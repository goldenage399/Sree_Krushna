---
description: Backend testing workflow - covers pre-wiring validation, schema migration, new table setup, and integration testing. Use decision tree below to identify which phases apply.
---

# Backend Readiness Checklist

> **Purpose**: Complete backend testing workflow for any scenario.
> **Usage**: Start with Decision Tree below to identify which phases to run.

---

## 🎯 Decision Tree (Start Here)

**What are you doing?**

```
┌─────────────────────────────────────────────────────────────────┐
│ What's your current task?                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ➤ "Setting up a NEW module/table"                              │
│     → Run: Phase 1 → 2 → 3 → 5 → 6                              │
│                                                                 │
│  ➤ "Adding NEW COLUMNS to existing table"                       │
│     → Run: Phase 4 (4.1 first) → Phase 4A → 5                   │
│     🔑 Key phases: 4A.1 Discover, 4A.2 Plan, 4A.3 Execute       │
│                                                                 │
│  ➤ "Wiring frontend to existing backend"                        │
│     → Run: Phase 1 → 2 → 4 → 6                                  │
│                                                                 │
│  ➤ "Testing after backend code changes"                         │
│     → Run: Phase 3 → 4 → 5                                      │
│                                                                 │
│  ➤ "Debugging data not appearing correctly"                     │
│     → Run: Phase 4.1 (Column Mapping) first                     │
│     → If columns wrong: Phase 4A                                │
│                                                                 │
│  ➤ "Cleaning up after failed test"                              │
│     → Run: Phase 5 only                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Quick Reference:**
| Scenario | Phases |
|----------|--------|
| New module | 1 → 2 → 3 → 5 → 6 |
| Add columns | 4 → **4A** → 5 |
| Frontend wiring | 1 → 2 → 4 → 6 |
| Post-change testing | 3 → 4 → 5 |
| Rollback/cleanup | 5 only |

---

## Testing Repository (Reference Hub)

📚 **Full test templates available at:**
`enhancement-notes/BACKEND_TESTING_REPOSITORY.md`

Create modular test files: `99_TestScripts_[ModuleName].js` (see Section 3.1 below).

---

## Phase 1: SSOT Verification

### 1.1 Configuration Check
- [ ] Verify module config exists in `00_Config.js` (e.g., `RECEIVABLES_LOCATIONS`)
- [ ] Check `docId`, sheet names, and `allowedUsers` are correct
- [ ] Confirm location IDs match frontend expectations (`gnp`, `delta`, `gita`)
- [ ] **Data Occupancy Check**: Verify that schema updates or migration actions do not perform destructive overwrites of active multi-project schemas. See `.agent/patterns/data-migration-occupancy-safety.md` for the full protocol.

### 1.2 Column Mapping Check
- [ ] Verify column aliases in relevant files:
  - Expense: `04_06_ColumnAliases.js`
  - Receivables: `5_1_Receivables.js` → `RECEIVABLES_CONFIG.columns`
  - Accounts: `14_01_Validation.js` → `INPUT_ACCOUNTS_HEADERS`
- [ ] Run `TEST_LocationConfig()` to verify sheet access

### 1.3 Validation Schema Check
- [ ] Review validation rules in module's `Validation.js`
- [ ] Confirm required fields match frontend form fields
- [ ] Check numeric bounds, string lengths, date constraints

---

## Phase 2: Router Action Verification

### 2.1 Action Registration
- [ ] Verify action is registered in `02_Router.js`
- [ ] Check action name matches frontend's `callGASBackend(action, payload)`
- [ ] Confirm payload parameters match backend function signature

### 2.2 Expected Actions for Module
Replace `[MODULE]` with: `receivables`, `accounts`, `expense`, etc.

| Frontend Action | Backend Function | Parameters |
|-----------------|------------------|------------|
| `get[MODULE]Locations` | `get[MODULE]LocationsForUser` | `userEmail` |
| `fetch[Entity]List` | `fetch[Entity]List` | `locationId, userEmail` |
| `submit[Entry]` | `submit[Entry]` | `locationId, data, userEmail` |
| `process[Action]` | `process[Action]` | `locationId, entries, details, userEmail` |

---

## Phase 3: Dry Run Tests (GAS Editor)

### 3.1 Test Scripts Location

**Best Practice**: Use separate test files per module for maintainability.

| File Pattern | Purpose |
|-------------|---------|
| `99_TestScripts.js` | Shared utilities, generic tests |
| `99_TestScripts_Expense.js` | Expense module tests |
| `99_TestScripts_Receivables.js` | Receivables module tests |
| `99_TestScripts_Accounts.js` | Accounts module tests |

This pattern:
- ✅ Keeps module tests isolated
- ✅ Easier to find/edit specific tests
- ✅ Prevents massive single file
- ✅ Clear ownership per module

### 3.2 Standard Test Functions

#### Reference Data Test
```javascript
// Run in GAS Editor
function testGetReferenceData() {
  const result = getExpenseReferenceData('gnp');
  Logger.log('Categories: ' + (result.data?.categories?.length || 0));
  Logger.log('Vendors: ' + (result.data?.vendors?.length || 0));
}
```

#### Submit Flow Test (CREATES DATA!)
```javascript
function testSubmitFlow() {
  const testPayload = {
    action: '[YOUR_ACTION]',
    locationId: 'gnp',
    // Add your test data here
  };
  const result = handleAction_(testPayload);
  Logger.log(JSON.stringify(result, null, 2));
}
```

### 3.3 Module-Specific Tests

**Receivables:**
```javascript
testReceivablesSystem()        // From 5_1_Receivables.js
testReceivablesProcessing()    // From 5_3_ReceivablesProcessing.js
```

### 3.4 Archived Test Framework (RECOMMENDED)
Located at: `backend/_archive/backend_tests.js`

This file contains a **complete test framework** with pass/fail counting:

```javascript
// Run ALL backend tests with summary
runAllBackendTests()  // Runs: config, token, access, validation, calculations, backup, logging

// Quick verification after changes
quickSmokeTest()      // Runs only: config, access, calculations

// Verify sheet access across all locations
testSheetAccess()     // Tests: TRACKERS, EXPENSE_LOCATIONS sheets
```

**Test Functions Available:**
| Function | Tests |
|----------|-------|
| `testConfiguration()` | DEV_MODE, FIREBASE_PROJECT_ID, TRACKERS |
| `testAccessControl()` | allowedUsers array, email validation |
| `testDataValidation()` | Required fields, positive numbers, dates |
| `testGasTrackerCalculations()` | Gas opening/closing formulas |
| `testSheetAccess()` | All configured sheets are accessible |

**Usage Pattern:**
```javascript
// Copy backend_tests.js content to 99_TestScripts.js for persistence
// Or run directly from _archive during development
```

**Accounts:**
```javascript
// Create in 99_TestScripts.js
function testSubmitAccountsEntry() {
  const payload = {
    locationId: 'gnp',
    date: new Date().toISOString(),
    cashSale: 1000,
    upiSale: 500,
    billingSummaryUrl: 'https://drive.google.com/file/d/test'
  };
  const result = submitAccountsEntry('gnp', payload, 'test@example.com');
  Logger.log(JSON.stringify(result));
}
```

---

## Phase 4: Data Validation

### 4.1 Column Mapping Test (CRITICAL)

> ⚠️ **Run this before any wiring** - Unmapped columns are the #1 cause of wiring failures

Use `TEST_[Module]SheetStructure()` which now includes:
- ✅ Alias-based matching (handles `Invoice_Date`, `InvoiceDate`, `date`, etc.)
- ✅ Required vs optional column tracking
- ✅ Clear summary: `Mapped: X/Y`
- ✅ Actionable fix suggestions when columns missing
- ✅ Returns `false` if required columns missing (blocks wiring)

Example output when columns don't match:
```
❌ Col 3: "Total" (expected: Invoice Amount)
❌ BLOCKING: Missing required columns
   Missing: Invoice Amount, Customer Name

─── HOW TO FIX ───
   1. Rename sheet columns to match expected names
   2. Add column aliases to module COLUMN_ALIASES
   3. Use dynamic column resolution in backend
```

### 4.2 Dynamic Mapping Test
- [ ] Submit test payload with all required fields
- [ ] Verify data appears in correct sheet columns
- [ ] Check column names match expected headers

### 4.2 Audit Column Test
Run after submission:
```javascript
// Verify audit columns populated
function testAuditColumns() {
  // From 99_TestScripts.js - testAuditColumnMapping()
  testAuditColumnMapping();
}
```

Expected audit columns:
- `Submitter_Note`, `Submitted_By`, `Entry_Timestamp`
- `Version`, `Review_Round` (if approval workflow)

### 4.3 Cross-Sheet Verification
After submit, verify data flows to:
- [ ] Primary sheet (e.g., `Input_Expense`, `Receivables_Ledger`)
- [ ] Archive sheet (e.g., `Ledger_Input_Logs`, `Receivables_Input_Logs`)
- [ ] Ledger (if `paymentStatus: 'Pending'`)

---

## Phase 4A: Schema Migration (When Adding Columns)

> **Use When**: Adding new columns to existing sheets (e.g., split payment columns)
> **🛑 STOP Points**: Marked below - require user confirmation before proceeding

### 4A.1 Discover Current Schema
```javascript
// Run in GAS Editor
function DISCOVER_CurrentSchema(locationId, sheetName) {
    const config = getLocationConfig(locationId);
    const ss = SpreadsheetApp.openById(config.docId);
    const sheet = ss.getSheetByName(sheetName);
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log('=== CURRENT SCHEMA (' + headers.length + ' columns) ===');
    headers.forEach((h, i) => Logger.log(`Col ${i+1}: ${h}`));
}
```

> **🛑 STOP**: Review current schema. Document discrepancies before proceeding.

### 4A.2 Plan Migration
```javascript
// Compare current vs expected
function PLAN_Migration(locationId, sheetName, expectedHeaders) {
    const config = getLocationConfig(locationId);
    const ss = SpreadsheetApp.openById(config.docId);
    const sheet = ss.getSheetByName(sheetName);
    
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const currentCount = currentHeaders.length;
    const expectedCount = expectedHeaders.length;
    
    Logger.log('Current: ' + currentCount + ' cols, Expected: ' + expectedCount);
    
    if (currentCount >= expectedCount) {
        Logger.log('✅ No new columns needed');
        return;
    }
    
    const toAdd = expectedHeaders.slice(currentCount);
    Logger.log('Columns to add: ' + toAdd.join(', '));
}
```

> **🛑 STOP**: Confirm migration plan with user before executing.

### 4A.3 Execute Migration
- [ ] Backend auto-migration triggers on first log operation
- [ ] OR run manual migration:
```javascript
function EXECUTE_Migration(locationId, sheetName, newHeaders) {
    const config = getLocationConfig(locationId);
    const ss = SpreadsheetApp.openById(config.docId);
    const sheet = ss.getSheetByName(sheetName);
    const lastCol = sheet.getLastColumn();
    
    sheet.getRange(1, lastCol + 1, 1, newHeaders.length).setValues([newHeaders]);
    sheet.getRange(1, lastCol + 1, 1, newHeaders.length)
        .setFontWeight('bold').setBackground('#FFE599');
    
    Logger.log('✅ Added ' + newHeaders.length + ' columns');
}
```

### 4A.4 Verify Migration
```javascript
// Must return true before proceeding to testing
TEST_VerifyInputLogsSchema('[LOCATION_ID]')  // Receivables
TEST_[Module]SheetStructure('[LOCATION_ID]') // Other modules
```

### 4A.5 Schema Rollback (if needed)
```javascript
function ROLLBACK_Schema(locationId, sheetName, columnsToRemove) {
    const config = getLocationConfig(locationId);
    const ss = SpreadsheetApp.openById(config.docId);
    const sheet = ss.getSheetByName(sheetName);
    
    for (let i = 0; i < columnsToRemove; i++) {
        sheet.deleteColumn(sheet.getLastColumn());
    }
    Logger.log('✅ Removed ' + columnsToRemove + ' columns');
}
```

---

## Phase 5: Rollback & Cleanup

### 5.1 Standard Rollback Function
```javascript
// From 99_TestScripts.js
function rollbackTestEntries(inputRows, ledgerRows, archiveRows) {
  // Deletes last N rows from each sheet
}

// Quick cleanup after failed test
rollbackLastTest();  // Deletes 2 input, 1 ledger, 1 archive
```

### 5.2 Module-Specific Rollback
Create per-module rollback if needed:
```javascript
function rollbackReceivablesTest(ledgerRows = 1, archiveRows = 1) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Rollback Receivables_Ledger
  const ledger = ss.getSheetByName('Receivables_Ledger');
  if (ledger && ledgerRows > 0) {
    const lastRow = ledger.getLastRow();
    ledger.deleteRows(lastRow - ledgerRows + 1, ledgerRows);
    Logger.log('Deleted ' + ledgerRows + ' from Receivables_Ledger');
  }
  
  // Rollback Receivables_Input_Logs
  const archive = ss.getSheetByName('Receivables_Input_Logs');
  if (archive && archiveRows > 0) {
    const lastRow = archive.getLastRow();
    archive.deleteRows(lastRow - archiveRows + 1, archiveRows);
    Logger.log('Deleted ' + archiveRows + ' from Receivables_Input_Logs');
  }
}
```

---

## Phase 6: Frontend Contract Verification

### 6.1 Expected Response Format
All backend responses should follow:
```javascript
{
  success: true|false,
  message: "Human readable status",
  data: { /* module-specific data */ },
  // On error:
  errorCode: "ERR_*",
  errorContext: { function, details }
}
```

### 6.2 Frontend Service Contract
Check frontend service file (e.g., `ReceivablesService.js`) expects:
- [ ] Same action names as Router
- [ ] Same payload structure
- [ ] Same response fields

### 6.3 Field Name Mapping
| Backend Field | Frontend Field | Notes |
|---------------|----------------|-------|
| `invoiceDate` | `invoiceDate` | ISO format |
| `invoiceAmount` | `invoiceAmount` | Number |
| `customerName` | `customerName` | String |

---

## Phase 7: Protection & Permission Check

### 7.1 Sheet Protection Scan
```javascript
// From TEST_ProtectionScanner.js
TEST_scanAllProtections();
```

### 7.2 Role-Based Access
- [ ] Verify `getUserRole()` returns correct role for test user
- [ ] Check module actions validate role where needed

---

## Quick Start Checklist

For a new module, verify in order:

1. [ ] Config exists in `00_Config.js`
2. [ ] Actions registered in `02_Router.js`
3. [ ] Run `TEST_LocationConfig()` - sheets accessible
4. [ ] Create test payload matching frontend
5. [ ] Run submit test in GAS Editor
6. [ ] Verify data in sheets
7. [ ] Run rollback to clean up
8. [ ] Check frontend service expects same contract

---

## Troubleshooting

### CORS Error in Browser
**Cause**: Backend threw exception (hidden by CORS)
**Fix**: Run same payload in GAS Editor to see actual error

### "Unknown action" Error
**Cause**: Action not in Router switch statement
**Fix**: Add case in `02_Router.js`

### Data Missing in Sheet
**Cause**: Column index mismatch
**Fix**: Check `COLUMN_MAPPINGS` or `columns` config

### "Sheet not found" Error
**Cause**: Sheet name mismatch or missing
**Fix**: Verify sheet name in config matches actual sheet
