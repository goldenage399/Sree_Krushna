---
pattern: large-code-removal
origin_cap: PIOps-Cleanup
tier: universal
applies_to:
  - "Removing 100+ lines"
  - "Multiple non-contiguous deletions"
  - "Edit tool failures"
prereqs:
  - "PowerShell access"
porting_effort: low
canonical_source: GEMINI.md
last_reviewed: 2026-04-21
description: "Surgical line-based deletion for large blocks."
---

# Portable Workflow: Large Code Removal (Surgical Mode)

**Purpose:** Safely remove large or complex blocks of code when standard string-replacement tools fail due to whitespace, line endings, or context drift.

---

## 1. Line-Index Deletion (Protocol #57)

**Constraint:** Use line-based indexing for 100% precision when removing large blocks.

**Step 1: Identify Line Ranges to KEEP**
Use `view_file` to determine the exact line numbers of the code you want to keep.
- Lines 1-100: KEEP
- Lines 101-500: DELETE
- Lines 501-1000: KEEP

**Step 2: Convert to 0-Based Indices**
PowerShell `Select-Object -Index` uses 0-based indexing (subtract 1 from line numbers).
- `1-100` → `0..99`
- `501-1000` → `500..999`

**Step 3: Execute PowerShell Command**
```powershell
$file = "absolute/path/to/file.js"
(Get-Content $file | Select-Object -Index ((0..99) + (500..999))) | Set-Content $file
```

---

## 2. Post-Removal Verification

1. **Lint Check**: Immediately run `npm run lint` or check for syntax errors.
2. **Export Check**: Ensure you haven't broken the module's export structure.
3. **Dependency Check**: Ensure the removed code wasn't imported by other modules.
4. **Git Verification**: Use `git diff --stat` to confirm only the expected number of lines were removed.
