# Incident Report: INC-034 - Sandboxed IDE CLI Path Resolution Mismatch

**Status:** Resolved
**Date:** 2026-06-27
**Severity:** Low (Developer tooling environment issue)

---

## ❓ 1. Symptoms & Incident Log
When running the `Format Chat Log` or `Adjust Markdown Headers` tasks inside the agent-sandboxed terminal environment, the execution of the VS Code CLI (`code --diff`) crashed with:
```text
node:fs:2800
      const stats = binding.lstat(base, true, undefined, true /* throwIfNoEntry */);
                            ^

Error: EPERM: operation not permitted, lstat 'C:\Users\golde\AppData'
```
This blocked the tool from launching the side-by-side diff comparison window for the agent and the developer in this environment.

---

## 🔍 2. Root Cause Analysis
1. **Tool Invocation Gap**: The utility script looked for the standard VS Code binary `code` using `shutil.which("code")` or candidate paths inside `%LOCALAPPDATA%` and `%APPDATA%`.
2. **Environment Sandbox**: The running shell process is executed under the sandboxed user `legion\temp`, while the VS Code installation belongs to the host user `golde` (`C:\Users\golde\AppData`).
3. **ACL Permission Denied**: Because standard user directories are locked down, the `temp` user lacks read/execute access to `C:\Users\golde\AppData`. When Electron/Node.js starts the `code` CLI, it attempts to resolve its main module path under the `golde` directory and crashes with `EPERM`.
4. **Active IDE**: The active IDE running in this environment is actually **Antigravity IDE** (`antigravity-ide.cmd`), installed locally in the `Temp` user profile (`C:\Users\Temp\AppData\Local\Programs\Antigravity IDE`), which has full read/write/execute permissions.

---

## 🛠️ 3. Remediation & Fix
1. **IDE CLI Support**: Updated the `find_code()` function in both `format_chat_log.py` and `adjust_headers.py` to prioritize `antigravity-ide` over `code`.
2. **Fallback Logic**: If `antigravity-ide` is present, it returns `"antigravity-ide"` and launches the diff comparison window using the active IDE process, which completely bypasses the permissions issue.
3. **Terminal Preview Mode**: Integrated the `Format Chat Log (Terminal Preview)` task mapping the `SKIP_CODE_DIFF=1` environment variable for environment configurations where no editor CLI is accessible.

---

## 📐 4. Architectural Surface Mapping
* **UI Surface**: N/A. No changes to the application client views.
* **Data Surface**: N/A. No modifications to database schemas or APIs.
* **Reactive Surface**: N/A. No changes to React components, states, hooks, or context.
* **Service Surface**: N/A. No changes to Cloud Functions, auth, or backend services.
* **Module Surface**: N/A. No changes to package dependencies or bundle layouts.
* **Governance Surface**: **Affected**. Developer utility scripts (`adjust_headers.py`, `format_chat_log.py`) and `.vscode/tasks.json` configurations adjusted to handle sandboxed environment paths.

---

## 💡 5. Lessons Learned
- **Environmental Awareness**: Developer scripts calling editor features must query process environment variables (`VSCODE_CWD`, `ANTIGRAVITY_EDITOR_APP_ROOT`) to identify the active editor binary rather than assuming standard global installation path structures (`code`).
- **Sandbox Identity Bounds**: Permissions limits differ between agent terminals and host developers. Tooling must support graceful CLI fallbacks (like terminal inline diffs) to allow seamless progression on validation steps.
