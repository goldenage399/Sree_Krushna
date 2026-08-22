---
description: How to safely remove large blocks of code (100+ lines) from files
---

# Large Code Removal Workflow

## When to Use
- Removing 100+ lines of obsolete code
- Multiple non-contiguous ranges to delete
- `replace_file_content` fails with "target content not found"

## Why Text Matching Fails on Large Blocks

| Failure Mode | Cause |
|--------------|-------|
| Whitespace mismatch | Tabs vs spaces, trailing spaces |
| Line ending differences | CRLF vs LF (Git `core.autocrlf`) |
| Invisible characters | BOM, zero-width spaces, copied from web/terminal |
| Context drift | IDE auto-format, prettier/eslint, import reordering |
| Encoding normalization | UTF-8 variants, quote characters |

## Recommended Approach: Line Indices

### Step 1: Identify Line Ranges to KEEP
```
Lines 1-849     = keep
Lines 850-1037  = DELETE
Lines 1039-1078 = keep  
Lines 1080-2045 = DELETE
Lines 2046-2304 = keep
```

### Step 2: Convert to 0-Based Indices
PowerShell uses 0-based indices: subtract 1 from line numbers
- `1-849` → `0..848`
- `1039-1078` → `1038..1077`
- `2046-2304` → `2045..2303`

### Step 3: Run PowerShell Command
```powershell
# With backup (recommended)
$src = "path/to/file.js"
$bak = "path/to/file.backup.js"
Copy-Item $src $bak
(Get-Content $src | Select-Object -Index ((0..848) + (1038..1077) + (2045..2303))) | Set-Content $src
```

### Step 4: Post-Removal Verification
1. **Lint check**: Run `eslint` or IDE shows no syntax errors
2. **Import check**: Removed functions not imported elsewhere
3. **Export check**: Update exports to remove deleted function references
4. **Git diff**: `git diff --stat` confirms only expected lines removed
5. **Browser test**: Module loads without errors

## Recovery
If removal breaks the file:
```powershell
# From backup
Copy-Item $bak $src

# From git
git checkout HEAD -- path/to/file.js
```

## Alternative: Small Anchor Replacements
For smaller blocks (< 50 lines), use unique anchor strings:
```javascript
// Instead of replacing 50 lines, replace a unique function signature:
// TargetContent: "function obsoleteFunc() {"
// Find the end: view file to find closing brace line
```

---
*Created: 2026-01-12 after failed attempts with replace_file_content tool*
