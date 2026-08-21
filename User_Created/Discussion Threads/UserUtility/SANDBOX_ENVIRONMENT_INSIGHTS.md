## Sandbox Environment & Diff Tooling Insights

This document captures the critical learnings and debugging resolutions for running developer utility scripts within the sandboxed agent environment.

---

### 🚨 Symptom: Electron EPERM Crash on `code --diff`

When a Python utility (like `adjust_headers.py` or `format_chat_log.py`) attempts to open a side-by-side file comparison in the VS Code diff window, it crashes with:
```text
node:fs:2800
      const stats = binding.lstat(base, true, undefined, true /* throwIfNoEntry */);
                            ^
Error: EPERM: operation not permitted, lstat 'C:\Users\golde\AppData'
```

---

### 🔍 Root Cause Analysis

1. **User Privilege Mismatch**: The host VS Code instance is installed in the AppData directory of the host user profile (`C:\Users\golde`). The sandboxed AI agent runs under a restricted local user identity (`legion\temp`).
2. **Path Access Control**: Windows private directories (`C:\Users\<user>`) block access by other local users (like `temp`).
3. **Implicit Node Module Resolution**: During startup, Electron/Node.js traverses directories listed in the `PATH` environment variable (which inherits `C:\Users\golde` directories from the host process) to find resources or resolve global packages, calling `realpathSync` and triggering the `EPERM` security block.
4. **Active Editor Mapping**: The user is running **Antigravity IDE** (`antigravity-ide.cmd`), not vanilla VS Code (`code`). This IDE is installed under `C:\Users\Temp` and is fully accessible to the sandbox user.

---

### 🛠️ Best Practices & Workarounds

#### 1. Active IDE Detection
Do not assume standard global binaries (`code`). Check for the running IDE binary context:
```python
def find_code() -> str | None:
    if shutil.which("antigravity-ide"):
        return "antigravity-ide"
    if shutil.which("code"):
        return "code"
    # Fallbacks...
```

#### 2. Environment PATH Cleansing
Before spawning subprocesses (like VS Code diff commands) via Python, filter out any inaccessible host user directories from the `PATH` variable to prevent Electron bootstrap lstat crashes:
```python
import os
import subprocess

sub_env = os.environ.copy()
path_entries = sub_env.get("PATH", "").split(os.pathsep)
## Filter out host user profile folders (e.g., 'golde')
clean_path_entries = [entry for entry in path_entries if "golde" not in entry.lower()]
sub_env["PATH"] = os.pathsep.join(clean_path_entries)

## Spawn subprocess safely
subprocess.Popen([code, "--diff", src, temp], env=sub_env)
```

### 3. Fallback Terminal Preview & Non-Interactive Bypass
Provide fallback and non-interactive execution modes:
- `SKIP_CODE_DIFF=1`: Renders diff preview directly to the terminal panel without launching GUI diff windows.
- `AUTO_APPLY=1` / `BYPASS_CONFIRMATION=1`: Automatically writes changes to the target file without pausing for manual Enter prompt confirmation.

#### Registered VS Code Tasks Spectrum (6 Modes per Utility)
Each utility (`Adjust Markdown Headers` and `Format Chat Log`) exposes 6 tasks in `.vscode/tasks.json` under `Ctrl+Shift+P` → **Tasks: Run Task**:

1. **`(Selection)`**: Interactive GUI diff on highlighted lines.
2. **`(Full File)`**: Interactive GUI diff on entire file.
3. **`(Terminal Preview - Selection)`**: Terminal diff preview with Enter confirmation on highlighted lines.
4. **`(Terminal Preview - Full File)`**: Terminal diff preview with Enter confirmation on entire file.
5. **`(Bypassed - Selection)`**: Non-interactive auto-apply on highlighted lines (`SKIP_CODE_DIFF=1`, `AUTO_APPLY=1`).
6. **`(Bypassed - Full File)`**: Non-interactive auto-apply on entire file (`SKIP_CODE_DIFF=1`, `AUTO_APPLY=1`).

---

### 📐 Markdown Header Level Adjustment & Hierarchy Preservation

When implementing text-processing scripts that demote/shift markdown header levels (e.g., to keep designated section headings like `# Query X.Y -` at H1 while demoting content headings):

#### 1. The Sibling Hierarchy Bug
Comparing child headings directly against a flat variable (like `prev_output_level` representing the immediate preceding header) causes a logical error:
- When processing sibling children at the same depth under a parent, the first sibling is processed and shifts.
- The second sibling is then compared against the first sibling's shifted level, falsely triggering a "same depth" demotion rule.
- This results in consecutive siblings cascading into nested parent-child levels (e.g., sibling H3s turning into H3, H4, H5...).

#### 2. Resolution: Stack-Based Ancestor Tracking
To maintain sibling levels, maintain a stack of `(original_level, shifted_level)` tuples to map parent-child relationships correctly:
```python
## Initialize stack starting with the document top-level (always H1)
ancestors = [(1, 1)]

## When a section header is matched, reset the stack to [(1, 1)]
```

### 3. Mathematical Simplification
Instead of complex branching conditional checks for gap preservation, the relationship-safe shifted level can be calculated as:
```python
## 1. Find the closest parent from stack (where parent_original_level < original_level)
parent_original, parent_shifted = 1, 1
for a_orig, a_shift in reversed(ancestors):
    if a_orig < original_level:
        parent_original, parent_shifted = a_orig, a_shift
        break

## 2. Shift ONLY if not already subordinate to the parent's shifted level
new_level = max(original_level, parent_shifted + 1)

## 3. Update ancestors stack by removing any peer/deeper levels
ancestors = [a for a in ancestors if a[0] < original_level]
ancestors.append((original_level, new_level))
```
Using `max(original_level, parent_shifted + 1)` guarantees that:
- Any content header originally at H2 remains H2 if the parent is H1 (`max(2, 1 + 1) = 2`).
- A skipped/gap child (e.g., H3 under H1 where parent shifted to H2) remains at H3 since `max(3, 2 + 1) = 3`.
- A conflicting child (e.g., H2 child under H1 parent where the parent shifts H1 $\rightarrow$ H2) shifts to H3 since `max(2, 2 + 1) = 3`.

