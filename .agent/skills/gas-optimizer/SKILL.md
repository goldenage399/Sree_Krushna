---
name: gas-optimizer
description: Enforces Google Apps Script specific optimization rules with decision logic for different data volumes and access patterns.
---

# GAS Optimization Protocol

> **Purpose**: Prevent SQL-style optimization errors in Google Apps Script.
> **Core Axiom**: Minimize API round-trips while considering data volume.

---

## Decision Tree: Which Pattern to Use?

```
START: Need to read sheet data

Q1: How many rows in the sheet?
├─ <5K rows → Use VACUUM PATTERN (load all)
├─ 5K-20K rows → Consider VACUUM or INDEX-RANGE based on query count
└─ >20K rows → Use INDEX-RANGE PATTERN

Q2: How many dates/items are you querying?
├─ 1-3 dates → INDEX-RANGE (targeted fetch)
├─ 10+ dates → VACUUM (load-once is cheaper)
└─ All dates → VACUUM (obviously)

Q3: Is the sheet sorted by date?
├─ YES → INDEX-RANGE works well
└─ NO → Add MAINTENANCE TRIGGER or use VACUUM
```

---

## Pattern A: The "Vacuum" (Bulk Read)

**When to Use**: Sheets <10K rows OR querying many dates at once

**Rule**: Read entire data range into memory once, process locally.

```javascript
// ❌ ANTI-PATTERN: Multiple column reads
const dates = sheet.getRange(2, 1, lastRow, 1).getValues(); // Call 1
const sales = sheet.getRange(2, 5, lastRow, 1).getValues(); // Call 2

// ✅ OPTIMIZED: Single bulk read
const data = sheet.getDataRange().getValues(); // 1 Call
const dates = data.map(r => r[0]);
const sales = data.map(r => r[4]);
```

**Performance**: ~500ms for 10K rows, ~2s for 50K rows

---

## Pattern B: The "Batch Writer" (Bulk Write)

**When to Use**: Updating multiple rows/cells

**Rule**: Never call `setValue` inside a loop.

```javascript
// ❌ ANTI-PATTERN: Loop Write (causes timeout)
data.forEach((row, i) => {
  sheet.getRange(i+1, 1).setValue(row.status); // N Calls
});

// ✅ OPTIMIZED: Single batch write
const updates = data.map(row => [row.status]);
sheet.getRange(1, 1, updates.length, 1).setValues(updates); // 1 Call
```

**GAS Limit**: 300 writes/min. Batch keeps you safe.

---

## Pattern C: The "Map-Lookup" (O(1) Access)

**When to Use**: Finding rows by key (date, ID, etc.)

**Rule**: Convert array to Map immediately after fetching.

```javascript
// ❌ ANTI-PATTERN: Linear scan per lookup (O(N) each time)
const rowIndex = data.findIndex(row => row[0] === targetDate);

// ✅ OPTIMIZED: Build map once (O(N)), lookup O(1)
const dateMap = new Map(data.map((r, i) => [r[0], i + 1]));
const rowIndex = dateMap.get(targetDate);
```

---

## Pattern D: The "Index-Then-Range" (Targeted Fetch) ⭐ NEW

**When to Use**: 
- Sheets >10K rows
- Querying 1-5 specific dates
- Sheet is sorted by date

**Prerequisite**: Sheet must be sorted by date (add maintenance trigger).

### Step 1: Build Date-Row Index (light query, date column only)

```javascript
function buildDateRowIndex(sheet, dateColIndex) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return {};
  
  // Read ONLY the date column (minimal data transfer)
  const dateCol = sheet.getRange(2, dateColIndex, lastRow - 1, 1).getValues();
  
  const index = {}; // { 'YYYY-MM-DD': { startRow, count } }
  let currentDate = null;
  let startRow = 2;
  let count = 0;
  
  dateCol.forEach((row, i) => {
    const date = Utilities.formatDate(new Date(row[0]), 'Asia/Kolkata', 'yyyy-MM-dd');
    
    if (date !== currentDate) {
      if (currentDate) {
        index[currentDate] = { startRow, count };
      }
      currentDate = date;
      startRow = i + 2;
      count = 1;
    } else {
      count++;
    }
  });
  
  // Capture last date group
  if (currentDate) {
    index[currentDate] = { startRow, count };
  }
  
  return index;
}
```

### Step 2: Fetch Specific Range

```javascript
function getRowsByDate(sheet, dateIndex, targetDate, numCols) {
  const range = dateIndex[targetDate];
  if (!range) return [];
  
  // Fetch ONLY the rows for this date
  return sheet.getRange(range.startRow, 1, range.count, numCols).getValues();
}
```

### Step 3: Cache the Index

```javascript
// Cache index in PropertiesService (expire after 1 hour)
function getCachedDateIndex(locationId, sheetName) {
  const cacheKey = `DATE_INDEX_${locationId}_${sheetName}`;
  const cached = CacheService.getScriptCache().get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const sheet = getSheet(locationId, sheetName);
  const index = buildDateRowIndex(sheet, DATE_COL);
  
  CacheService.getScriptCache().put(cacheKey, JSON.stringify(index), 3600);
  return index;
}
```

**Performance**: 
- Index build: ~200ms for 50K rows (reads 1 column)
- Targeted fetch: ~50ms for 100 rows
- Total: ~250ms vs ~2s for vacuum on 50K rows

---

## Pattern E: Maintenance Trigger (Keep Data Sorted)

**When to Use**: Enabling Pattern D (Index-Then-Range)

**Rule**: Sort sheets by date nightly to keep rows sequential.

```javascript
// Time-triggered function (set to run daily at 2 AM)
function dailyMaintenanceSort() {
  const locations = ['gnp', 'delta', 'gita'];
  const sheets = ['Master_Expense', 'Master_Ledger', 'Receivables_Input_Logs'];
  
  locations.forEach(loc => {
    sheets.forEach(sheetName => {
      try {
        const sheet = getSheet(loc, sheetName);
        const lastRow = sheet.getLastRow();
        if (lastRow <= 1) return;
        
        const range = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
        range.sort({ column: DATE_COL, ascending: true });
        
        // Invalidate cached index
        CacheService.getScriptCache().remove(`DATE_INDEX_${loc}_${sheetName}`);
        
        Logger.log(`[MAINTENANCE] Sorted ${sheetName} for ${loc}`);
      } catch (e) {
        Logger.log(`[ERROR] Sort failed: ${sheetName} ${loc}: ${e.message}`);
      }
    });
  });
}
```

---

## Pattern F: Chunked Batch Write (For Large Updates)

**When to Use**: Writing >1000 rows at once

**Rule**: Split into chunks of 500-1000 to avoid timeouts.

```javascript
function batchWriteChunked(sheet, data, startRow, numCols, chunkSize = 500) {
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    sheet.getRange(startRow + i, 1, chunk.length, numCols).setValues(chunk);
    
    // Flush to avoid memory issues
    SpreadsheetApp.flush();
  }
}
```

## Pattern G: Targeted Key Lookup (Generalized) ⭐ CORE PATTERN

**This is the generalized approach. All key-based filtering should use this pattern.**

**When to Use**: 
- Filtering by ANY key column (Date, Location_ID, Category, Transaction_ID, etc.)
- Sheet has >5K rows
- You need a subset of rows, not the entire sheet

**Core Idea**: Read ONLY the key column first, build an index, then fetch targeted rows.

### Step 1: Build Key-to-Row Index (Light Query)

```javascript
// Read ONLY the key column (minimal data transfer)
function buildKeyIndex(sheet, keyColIndex) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return {};
  
  // One API call: read key column only
  const keyCol = sheet.getRange(2, keyColIndex, lastRow - 1, 1).getValues();
  
  const index = {}; // { keyValue: [row1, row2, row3...] }
  
  keyCol.forEach((row, i) => {
    const key = String(row[0]);
    if (!index[key]) index[key] = [];
    index[key].push(i + 2); // Row number (1-indexed, skip header)
  });
  
  return index;
}
```

### Step 2: Analyze Row Distribution

```javascript
function analyzeRowDistribution(rowNumbers) {
  if (!rowNumbers || rowNumbers.length === 0) return { type: 'empty' };
  if (rowNumbers.length === 1) return { type: 'single', rows: rowNumbers };
  
  // Check if rows are contiguous
  const isContiguous = rowNumbers.every((r, i) => 
    i === 0 || r === rowNumbers[i-1] + 1
  );
  
  if (isContiguous) {
    return { type: 'contiguous', start: rowNumbers[0], count: rowNumbers.length };
  }
  
  // Check if rows are mostly clustered (span is close to count)
  const span = rowNumbers[rowNumbers.length - 1] - rowNumbers[0] + 1;
  const density = rowNumbers.length / span;
  
  if (density > 0.5) {
    return { type: 'clustered', start: rowNumbers[0], end: rowNumbers[rowNumbers.length - 1] };
  }
  
  return { type: 'scattered', rows: rowNumbers };
}
```

### Step 3: Fetch Based on Distribution

```javascript
function getRowsByKey(sheet, targetKey, keyColIndex, numCols) {
  const index = buildKeyIndex(sheet, keyColIndex);
  const rowNumbers = index[targetKey];
  
  if (!rowNumbers || rowNumbers.length === 0) return [];
  
  const distribution = analyzeRowDistribution(rowNumbers);
  
  switch (distribution.type) {
    case 'single':
      // Single row: 1 API call
      return [sheet.getRange(rowNumbers[0], 1, 1, numCols).getValues()[0]];
      
    case 'contiguous':
      // All rows together: 1 API call
      return sheet.getRange(distribution.start, 1, distribution.count, numCols).getValues();
      
    case 'clustered':
      // Rows mostly together: fetch bounding range, filter in-memory
      const allRows = sheet.getRange(
        distribution.start, 1, 
        distribution.end - distribution.start + 1, numCols
      ).getValues();
      // Filter to exact matches (fast in-memory)
      const rowSet = new Set(rowNumbers.map(r => r - distribution.start));
      return allRows.filter((_, i) => rowSet.has(i));
      
    case 'scattered':
      // Rows spread out: batch into chunks of contiguous rows
      return fetchScatteredRows(sheet, rowNumbers, numCols);
  }
}

// Helper: fetch scattered rows in optimal chunks
function fetchScatteredRows(sheet, rowNumbers, numCols) {
  const chunks = [];
  let chunkStart = rowNumbers[0];
  let chunkEnd = rowNumbers[0];
  
  for (let i = 1; i < rowNumbers.length; i++) {
    if (rowNumbers[i] === chunkEnd + 1) {
      chunkEnd = rowNumbers[i];
    } else {
      chunks.push({ start: chunkStart, count: chunkEnd - chunkStart + 1 });
      chunkStart = rowNumbers[i];
      chunkEnd = rowNumbers[i];
    }
  }
  chunks.push({ start: chunkStart, count: chunkEnd - chunkStart + 1 });
  
  // Fetch each chunk (minimize API calls)
  const results = [];
  chunks.forEach(chunk => {
    const rows = sheet.getRange(chunk.start, 1, chunk.count, numCols).getValues();
    results.push(...rows);
  });
  
  return results;
}
```

### Sub-Pattern G.1: Date-Specific Optimization (Binary Search)

**When to Use**: Key column is a DATE and data is roughly ordered by date

**Why It's Faster**: Binary search is O(log N) vs O(N) for building full index

```javascript
// For DATE keys only: use binary search instead of full index
function getRowsByDateRange(sheet, dateColIndex, startDate, endDate, numCols) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  // Quick boundary check (2 cell reads)
  const firstDate = sheet.getRange(2, dateColIndex).getValue();
  const lastDateVal = sheet.getRange(lastRow, dateColIndex).getValue();
  
  const firstStr = Utilities.formatDate(new Date(firstDate), 'Asia/Kolkata', 'yyyy-MM-dd');
  const lastStr = Utilities.formatDate(new Date(lastDateVal), 'Asia/Kolkata', 'yyyy-MM-dd');
  
  // Early exit if no overlap
  if (startDate > lastStr || endDate < firstStr) return [];
  
  // Binary search for start row
  const startRow = binarySearchRow(sheet, dateColIndex, startDate, 2, lastRow);
  const endRow = binarySearchRow(sheet, dateColIndex, endDate, startRow, lastRow);
  
  // Fetch targeted range
  return sheet.getRange(startRow, 1, endRow - startRow + 1, numCols).getValues();
}

function binarySearchRow(sheet, dateColIndex, targetDate, low, high) {
  const target = new Date(targetDate).getTime();
  
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const midDate = new Date(sheet.getRange(mid, dateColIndex).getValue()).getTime();
    
    if (midDate < target) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  
  return low;
}
```

### Performance Comparison

| Scenario | Full Vacuum | Key-Index + Targeted | Date Binary Search |
|----------|-------------|---------------------|-------------------|
| 50K rows, need 100 | ~2s (all data) | ~300ms (1 col + 100 rows) | ~150ms (log N + 100 rows) |
| 50K rows, need 10K | ~2s (all data) | ~800ms (1 col + 10K rows) | ~600ms (if contiguous) |
| 5K rows, need any | ~200ms | Overkill | Overkill |

### When to Use Which

| Key Type | Data Order | Pattern |
|----------|-----------|---------|
| ANY key | Unknown | G (Generalized) |
| ANY key | Known sorted | G + contiguous optimization |
| DATE | Sorted by date | G.1 (Binary Search) |
| DATE | Unsorted | G (Generalized) |

---

## Decision Matrix: Quick Reference

| Scenario | Rows | Keys Queried | Data Order | Pattern |
|----------|------|--------------|------------|---------|
| Small sheet | <5K | Any | Any | A (Vacuum) |
| Medium sheet, many keys | 5-20K | 10+ | Any | A (Vacuum) |
| Medium sheet, few keys | 5-20K | 1-5 | Sorted | D (Index-Range) |
| Medium sheet, few keys | 5-20K | 1-5 | Unsorted | **G (Key Lookup)** |
| Large sheet, all keys | >20K | All | Any | A (Vacuum) |
| Large sheet, few DATE keys | >20K | 1-5 | Sorted | **G.1 (Binary Search)** |
| Large sheet, few keys | >20K | 1-5 | Unknown | **G (Key Lookup)** |
| Large update | Any | N/A | N/A | F (Chunked Batch) |

---

## Verification Checklist

Run on every Implementation Plan:

1. [ ] **No Inside-Loop I/O**: Are `getRange`, `getValue`, `setValue` calls OUTSIDE loops?
2. [ ] **Single Read Principle**: Is the sheet read more than once? (Consolidate if yes)
3. [ ] **Correct Pattern Selected**: Does data volume match pattern choice?
4. [ ] **Index Maintained**: If using Index-Range, is maintenance trigger set up?
5. [ ] **Batch Size Safe**: Are writes chunked if >500 rows?
6. [ ] **Cache Utilized**: Is CacheService used for expensive lookups?

---

## GAS Limits Reference

| Limit | Value | Mitigation |
|-------|-------|------------|
| Script runtime | 6 min | Chunk operations, use triggers |
| Sheet reads | 300/min | Vacuum pattern, cache results |
| Sheet writes | 300/min | Batch pattern, chunk if needed |
| PropertiesService | 50KB | Use for flags only, not data |
| CacheService | 100KB per item | JSON compress if needed |
| Cell size | 50K chars | Use separate sheets for large JSON |

---

## Anti-Patterns to Avoid

```javascript
// ❌ Reading same sheet multiple times
const expenses = getSheet().getDataRange().getValues();
const ledger = getSheet().getDataRange().getValues(); // Same sheet, 2 calls

// ❌ Filtering in multiple getRange calls
const jan = sheet.getRange('A2:A100').getValues();
const feb = sheet.getRange('A101:A200').getValues();

// ❌ setValue in loop
rows.forEach(r => sheet.getRange(r.row, 1).setValue(r.value));

// ❌ Using getDataRange() for every lookup
function findRow(id) {
  const data = sheet.getDataRange().getValues(); // Called N times!
  return data.find(r => r[0] === id);
}

// ❌ Utilities.formatDate() in loop (PIO-085 Incident)
// This is an API CALL per iteration! 11K rows = 2 MINUTES
for (let i = 0; i < data.length; i++) {
  const isoDate = Utilities.formatDate(new Date(data[i][0]), tz, 'yyyy-MM-dd'); // ⚠️ API CALL
  if (isoDate >= startDate) { ... }
}

// ✅ FIXED: Use timestamp comparison (pure JavaScript, instant)
const startTs = new Date(startDate).getTime();
for (let i = 0; i < data.length; i++) {
  const rowTs = new Date(data[i][0]).getTime();
  if (rowTs >= startTs) { ... }  // Pure JS, no API call
}
```

---

## Test Functions


---

## Architectural Invariant: Location Boundary (Protocol 36)

**Optimizing Context**: Routing vs Execution separation simplifies caching.

**Rule**: Location resolution is a **ROUTING** concern. Execution logic should be **SHEET-SCOPED**.

```javascript
// ❌ ANTI-PATTERN: Passing locationId deep into logic
function processData(locationId, date) { ... }

// ✅ CORRECT: Resolving context at entry
function processData(sheet, date) {
  const docId = sheet.getParent().getId(); // Context from object
}
```

**Why for Optimization?**
- Sheet-scoped functions can be tested in isolation
- Caching keys can be derived from DocID (globally unique) vs LocationID (needs mapping)
- Prevents "N+1 Config Lookup" Anti-Pattern inside loops

---

## Architectural Invariant: Unified Writer (Protocol 37)

**Optimizing Context**: Cross-cutting concerns (WriteJournal + StaleMarker) are centralized.

**Rule**: All bulk writes to financial sheets **MUST** use `recordWriteWithStaleMarker()` from `00_UnifiedWriter.js`.

```javascript
// ✅ CORRECT: Use unified helper for cross-cutting concerns
recordWriteWithStaleMarker(sheet, {
  startRow: startRow,
  rowCount: rows.length,
  source: 'EXPENSE',
  userEmail: userEmail,
  writtenDate: rows[0][0]
});

// ❌ ANTI-PATTERN: Inline WriteJournal + StaleMarker calls
// (duplicate code, risk of missed integrations)
```

**Why for Optimization?**
- Single point for StaleMarker integration → enables Precision Refresh (75% I/O reduction)
- Consistent audit trail via WriteJournal
- Future extensibility for additional cross-cutting concerns

**Reference**: [GEMINI.md Protocol 37](../../GEMINI.md) | [ARCHITECTURE_UnifiedWriter.md](../../enhancement-notes/PIO-071-074-DateScopedFetching/Proposed%20Best%20Solution/ARCHITECTURE_UnifiedWriter.md)

