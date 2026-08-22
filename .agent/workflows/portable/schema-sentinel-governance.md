---
pattern: schema-sentinel-governance
origin_cap: CAP-044
tier: universal
applies_to:
  - "Spreadsheet-backed applications"
  - "Decoupled data layers (JSON, CSV, NoSQL)"
  - "Systems suffering from positional fragility"
prereqs:
  - "Declarative Schema Registry (JS/JSON)"
  - "Centralized Data Helper module"
porting_effort: low
canonical_source: src/backend/00_SchemaRegistry.js
last_reviewed: 2026-04-28
description: "Eradicating positional data corruption via registry gates."
---

# Schema Sentinel Governance

> **Purpose**: Eradicate positional data corruption by decoupling code-side write logic from the physical layout of the data storage. Replaces hardcoded arrays with a declarative registry gate.

## 1. Problem: Positional Fragility
In many lightweight backends (GAS, Firebase, Flat Files), data is written as a positional array:
```javascript
sheet.appendRow([date, name, qty]); // ❌ Brittle
```
If the schema changes (e.g., "Type" is inserted between "Date" and "Name"), this code silently writes names into the quantity column.

## 2. Solution: The Sentinel Pattern
The Sentinel Pattern introduces a three-track enforcement layer:

### Track A: The Registry
A declarative object that defines the "Ideal State" of every table.
```javascript
const REGISTRY = {
  Inventory: {
    columns: [
      { name: 'Date', required: true },
      { name: 'Type', required: false },
      { name: 'Name', required: true }
    ]
  }
};
```

### Track B: The Sentinel Utility
A helper that transforms an object into an array using the registry as a map.
```javascript
function buildRow(key, data) {
  const schema = REGISTRY[key];
  return schema.columns.map(col => data[col.name] || '');
}
```

### Track C: The Runtime Gate
A validation check that runs before the write.
```javascript
function validate(key, liveHeaders) {
  const missing = REGISTRY[key].columns
    .filter(c => c.required && !liveHeaders.includes(c.name));
  if (missing.length) throw new Error("Schema Violation");
}
```

## 3. Implementation Workflow

1.  **Extract Schemas**: Move all `HEADERS` or schema constants into a dedicated `SchemaRegistry` file.
2.  **Defuse Arrays**: Search the codebase for `appendRow` or `setValues` calls using literal arrays. Replace them with the Sentinel utility.
3.  **Inject Gates**: Place the validation gate at the top of every write-path function or in a centralized Router/API layer.
4.  **Enforce Migration**: Use a setup script (`setupSpreadsheet`) to automatically apply registry changes (column additions/renames) to the live data layer.

## 4. Key Benefits

-   **Transparent Evolution**: Columns can be reordered or added (right-appended) without touching application code.
-   **Fail-Fast Writes**: Data corruption is prevented at the router level before it hits the disk.
-   **SSOT**: Engineering documentation (`SHEET_SCHEMAS.md`) and Runtime code (`SchemaRegistry.js`) stay in perfect parity.

---

## 5. Phase 4 Extension: Retiring Local Schema Constants (CAP-044)

Once a registry exists, any pre-existing local `*_HEADERS` constant arrays become **competing truths**. Drift is inevitable — they will diverge from the registry silently. This section documents the safe retirement procedure.

### 5.1 The Competing-Truth Problem

Local constants had two distinct uses:

| Use | Example | Risk |
|---|---|---|
| Iterate column names to build a read object | `HEADERS.forEach(h => obj[h] = row[colMap[h]])` | Missing columns if constant is stale |
| Size a write array | `new Array(HEADERS.length).fill('')` | Wrong column count → write misalignment |

### 5.2 Correct Substitution by Use Pattern

| Old pattern | Correct replacement | Reason |
|---|---|---|
| `HEADERS.forEach(h => obj[h] = row[colMap[h]])` | `Object.keys(colMap).forEach(h => obj[h] = row[colMap[h]])` | `colMap` is already built from the live sheet. `Object.keys` gives the exact same column names with no additional cost. |
| `new Array(HEADERS.length).fill('')` | `new Array(SCHEMA_REGISTRY.X.columns.length).fill('')` | Writes must be governed by the registry schema, not what happens to be in the live sheet. |
| `HEADERS.filter(h => colMap[h] === undefined)` | `SCHEMA_REGISTRY.X.columns.map(c => c.name).filter(h => colMap[h] === undefined)` | Find columns the registry expects that are absent from the live sheet. |
| `localHeaders[sheetName]` in a setup function | `_colsFor_(sheetName)` — local helper reading `SCHEMA_REGISTRY[key].columns.map(c => c.name)` | Scoped helper avoids repeating the `.columns.map(c => c.name)` chain 25+ times. |
| Inline array literal for dynamic sheet provisioning | `SCHEMA_REGISTRY.DynamicSchema.columns.map(c => c.name)` | Dynamic sheets (`isDynamic: true`) have no `sheetMapKey` so cannot use `getColMap()`. Registry access is the approved exception. |

### 5.3 Canonical Pattern Decision Table

`getColMap(registryKey, sheet)` **requires a live GAS `Sheet` object** — it reads `sheet.getRange(1,1,...)` to resolve live headers. It is NOT a pure registry lookup and cannot be called at module load time.

| Situation | Correct pattern | Notes |
|---|---|---|
| Write-path with `Sheet` in scope | `getColMap(registryKey, sheet)` | Returns `{colName: index}`. Use before `setValues` / `appendRow` to validate schema. |
| Row construction from object | `_buildRowFromRegistry_(registryKey, data)` | Returns ordered `Array`. The canonical write pattern — no Sheet needed. |
| Read-path col iteration (colMap already built) | `Object.keys(colMap)` | colMap is built from `all[0]` live headers. Never re-derive from registry in a read path. |
| Module-level name array (**Exception B**) | `SCHEMA_REGISTRY.X.columns.map(c => c.name)` | No Sheet in scope at module load. Registry-driven, not a hardcoded literal. |
| Dynamic sheet, no sheetMapKey (**Exception A**) | `SCHEMA_REGISTRY.X.columns.map(c => c.name)` | `isDynamic: true` — `getColMap` cannot resolve sheet by key alone. |

> **Exception B — when it applies**: A constant declared at module level (outside any function) that is used for write-path row construction (`appendRow(headers)`, `headers.map(h => obj[h])`, `headers.length`). At module load time, no Sheet object exists. Using `SCHEMA_REGISTRY.X.columns.map(c => c.name)` achieves registry governance without requiring a live sheet.
>
> Canonical example: `COMPUTED_SCHEDULE_FULL_HEADERS` in `11_TaskRepository.js`.
>
> **This is not a loophole.** The array is built from the registry at load time. Any schema change in the registry is automatically reflected. The constraint "never use a hardcoded literal array" is upheld.

### 5.4 Retirement Checklist

Before deleting a `*_HEADERS` constant:
1. `grep -r "CONST_NAME" src/backend/` — identify all live call sites (not comments)
2. Classify each: read iteration? write sizing? header bootstrap? migration check?
3. Apply the substitution table above per pattern
4. Re-grep to confirm zero live references remain
5. Annotate the retired line with `// CAP-NNN: retired CONST_NAME, now via SCHEMA_REGISTRY`
6. Update `SHEET_SCHEMAS.md` SSOT pointer if it still references the old constant file
