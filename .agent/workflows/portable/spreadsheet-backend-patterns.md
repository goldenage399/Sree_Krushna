---
pattern: spreadsheet-backend-patterns
origin_cap: CAP-035
tier: gas+firebase
applies_to:
  - "Google Apps Script (GAS) + Sheets"
  - "Airtable or Excel-based backends"
prereqs:
  - "Spreadsheet-as-a-database architecture"
porting_effort: medium
canonical_source: GEMINI.md
last_reviewed: 2026-04-18
description: "Column mapping, Whitespace toxicity, O(1) Loop guards."
---

# Portable Workflow: Spreadsheet Backend Patterns

**Purpose:** Spreadsheet-backed systems are prone to silent data corruption, race conditions, and parsing failures. This bundle of patterns ensures a robust, idempotent, and defensive backend.

---

## 1. O(1) I/O & Loop Performance Guard (Protocol #43)

**Constraint:** NEVER call GAS API methods (`Utilities.formatDate()`, `Session.getScriptTimeZone()`, or `SpreadsheetApp` methods) inside loops that process multiple rows.
**Why:** Apps Script API calls are network operations, not native JS functions. Filtering 10,000 rows with `Utilities.formatDate()` inside the loop can take **2 minutes**. Pure JS string/date manipulation takes **<1 second**.

**Pattern (The Head+Tail Fetch):**
1. Fetch all required context/data in bulk *before* the loop.
2. Build an in-memory dictionary/map (O(1) lookup).
3. Process the loop using pure JS operations and the in-memory map.
4. Write results back in bulk.

---

## 1. Response Contract (Protocol #29)

Every backend endpoint MUST return a standard JSON envelope. This prevents the frontend from receiving raw data types that it cannot parse or handle gracefully.

**Internal vs Public:**
- Public endpoints: Return the standard envelope.
- Internal helpers: Prefix with an underscore (e.g., `_readSheet()`) to prevent direct execution via API.

**Standard Envelope:**
```json
{
  "success": boolean,
  "message": "User-facing summary",
  "error": "Debug details / error code",
  "data": {}
}
```

---

## 3. Dynamic Column Mapping (Protocol #30 & PIO-100)

NEVER hardcode column indices (e.g., `row[2]`). If a user inserts a column, the logic breaks silently.

**Advanced Pattern (PIO-100 Standard):**
Handle multi-line headers, localization (e.g., English/Odia), and variant names using a Normalized Prefix Match strategy.

**Pattern:**
```javascript
const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
const colMap = {};
headers.forEach((h, i) => colMap[String(h || '').trim()] = i);

const value = row[colMap['Target Column Name']];
```

---

## 4. Whitespace Toxicity Defense (Protocol #40)

Manually edited spreadsheets often contain trailing spaces or inconsistent casing.

**Pattern:**
- Always `.trim()` and `.toUpperCase()` cell values before comparison.
- Never use `indexOf()` on raw header arrays; always use the sanitized `colMap`.

---

## 5. Idempotent Schema Enforcer (Protocol #38)

Schema updates must be idempotent. Avoid `if (headers.length === 7)` logic.

**Pattern:**
1. Define a Master Schema array in your config.
2. At startup/setup, compare the live sheet headers to the Master Schema.
3. If a mismatch is detected, overwrite the header row (Row 1) with the Master Schema.

---

## 6. Identity-Based Row Edits (Protocol #39)

Target rows by a unique identifier (Rule ID, UUID), NEVER by physical row number.

**Pattern:**
1. Read the entire sheet into memory.
2. Linearly scan for the row matching the target ID.
3. Preserve "hidden" columns by merging the incoming edit with the existing row data before writing back.
4. Use `setValues()` on the specific range to ensure the overwrite is atomic at the row level.

---

## 7. 3-Question Configuration Test (Protocol #53)

**Constraint:** Do not make system behavior configurable unless it passes the 3-Question Test.
**Why:** Over-engineering configuration leads to scattered settings, confusion, and fragile systems. If users never change it, it belongs in code.

**The Test (Sheet vs. Code):**
1. *Would a non-technical user want to change this?* (Yes -> Sheet, No -> Go to 2)
2. *Have users ever requested to customize this?* (Yes -> Sheet, No -> Go to 3)
3. *Does changing this require understanding system internals?* (Yes -> Code, No -> Default to Code if uncertain)

**Pattern:**
- **Business Rules** (Tax rates, Thresholds): Put in `Config` sheet.
- **Technical Defaults** (Cache TTL, Log Levels): Hardcode with sensible defaults (YAGNI).
