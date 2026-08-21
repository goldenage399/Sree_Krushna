---
name: schema-migration-guide
description: >
  Guide for safe schema migrations following the ANALYZE→BACKUP→MIGRATE→VERIFY→ROLLBACK pattern (Protocol 7).
  Use when adding/removing/renaming columns in Google Sheets.
  Prevents data loss and provides rollback capability.
---

## Goal

Ensure all schema changes are reversible and non-destructive.

## The 6-Step Migration Pattern

### Step 1: CHECK EXISTING PATTERNS

**Action**: Search for existing migration scripts.

```powershell
Get-ChildItem "backend/src/99_SchemaMigration_*.js"
```

If found → Clone and adapt. If not → Create new using this template.

### Step 2: ANALYZE (Dry Run)

```javascript
function ANALYZE_{Module}Schema_AllLocations() {
  // Compare expected vs actual headers
  // Log differences, do NOT modify
}
```

### Step 3: BACKUP

```javascript
function BACKUP_{Module}Headers(locId) {
  // Store current headers in PropertiesService
  const key = `BACKUP_${locId}_${Date.now()}`;
  PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(headers));
}
```

### Step 4: MIGRATE (Dry + Live)

```javascript
function MIGRATE_{Module}Schema_AllLocations(dryRun = true) {
  if (dryRun) { Logger.log("DRY RUN - no changes made"); }
  // Add/rename/remove columns
}
```

### Step 5: VERIFY

```javascript
function VERIFY_{Module}Schema_AllLocations() {
  // Confirm schema now matches expected
}
```

### Step 6: ROLLBACK (Emergency)

```javascript
function ROLLBACK_{Module}Headers(locId, backupKey) {
  // Restore from PropertiesService backup
}
```

## ❌ Example Violation

**User**: "Just manually add the `Variance_Reason` column to the sheet."

**This skill BLOCKS**: "🛑 Use migration scripts. Manual changes are unreversible and inconsistent across locations."

## ➡️ What's Next?

After migration passes:

- Run **`ssot-domain-mapper`** → Update `SHEET_SCHEMAS.md`
- Run **`backend-test-generator`** → Create `TEST_ValidateSchema()`
