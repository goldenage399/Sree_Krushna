---
description: How to deploy backend code to Google Apps Script (GAS)
---

## Backend Deployment Workflow

> [!CAUTION]
> **NEVER use `clasp deploy`!** It creates a NEW deployment with a NEW URL, breaking all frontend configs.
> Only use `clasp push` which updates the existing deployment in-place.
> The user will manually create new versions in Apps Script UI if needed.

---

### ⛔ MANDATORY: Console Output Verification (Agent Rule)

> [!WARNING]
> **STOP AND VERIFY** — After running `deploy.ps1`, you MUST:
>
> 1. **READ the entire console output** before proceeding
> 2. **SEARCH for these keywords**: `ERROR`, `DUPLICATE`, `WARNING`, `ABORTED`
> 3. **IF any error found** → STOP immediately, report to user, DO NOT attempt workarounds
> 4. **IF script exits with non-zero code** → Deployment FAILED, do not proceed
>
> **Anti-Pattern**: Assuming success because the command "ran". The script prints status — READ IT.
>
> **Incident Origin**: 2026-01-28 — Agent ignored `DUPLICATE: 'ACCOUNTS_COLUMN_MAPPINGS'` error and attempted alternative deployment.

---

### CRITICAL: File Structure for GAS

Google Apps Script (GAS) requires a **flat file structure** - no subdirectories are supported. The project uses:

- **Development folder**: `backend/src/` (with `modules/expense/` subfolder for organization)
- **Deployment folder**: `backend/gas_prod_snapshot/` (flat structure for clasp push)

### Pre-Deployment Global Namespace Integrity Check (Mandatory)

> [!IMPORTANT]
> GAS uses a **flat global namespace**. All `const`, `let`, `var`, and `function` declarations share the same scope across all files. Duplicate declarations cause `SyntaxError` at runtime.

**Policy:**
- Deployment scripts **MUST** include a duplicate-declaration scan
- Deployment **MUST** abort if violations are found
- Stale file exclusion lists are **first-class citizens**, not hacks

**What constitutes a violation:**
- Duplicate `const`/`let`/`var` declarations (e.g., `DASHBOARD_CONFIG` in two files)
- Duplicate `function` names (e.g., facade delegating to router with same name)
- Legacy/stale `.gs` files leaking into deployment snapshot

**Hard Rule:** Runtime discovery of duplicates = protocol failure. The `deploy.ps1` script enforces this check at Step 6/7.

---

#### Cross-Repository Synchronization Notice

This guardrail applies to **all repositories** using GAS deployment (including `Unified_Uploader`). Maintainers must:
1. Mirror this guardrail in their local SSOTs
2. Ensure deploy scripts include namespace integrity checks
3. Treat divergence as a governance risk

---

#### Change Log & Rationale

**Added:** 2026-01-06  
**Trigger:** Production failure - `CONSUMPTION_MODULE_CONFIG` duplicate declaration crashed GAS at runtime.  
**Root Cause:** Stale file `14_ConsumptionConfig.js` leaked into deployment alongside modular `08_01_Consumption_Config.js`.  
**Resolution:** Moved failure detection left (pre-deployment) via automated scan in `deploy.ps1`.

---

### Deployment Steps

#### Step 0: Pre-Deployment Safety Check (MANDATORY)

> [!CAUTION]
> **PROTOCOL #10 ENFORCEMENT**: You MUST read the `gas-deploy-guard` skill before proceeding with deployment.

**The skill verifies:**
- No stale Router files (`04_Expense.js`, `05_Ledger.js`) in deployment target
- No duplicate declarations in global namespace
- Deployment folder integrity (correct `.clasp.json` location)

**Only proceed if skill validation passes.** The skill will guide you through any issues found.

---

#### Step 1: Modify Source Files

1. Make changes to files in `backend/src/` or `backend/src/modules/expense/`

2. Run the deploy script to sync and push files:

   ```powershell
   cd D:\GitHub_Repo\Task-Dashboard\backend
   .\scripts\deploy.ps1
   ```

3. The script automatically:

   - Copies `backend/src/*.js` → `gas_prod_snapshot/`
   - Copies `backend/src/modules/expense/*.js` → `gas_prod_snapshot/` (flattens)
   - Runs `clasp push` to update existing deployment

4. Verify: Open https://pi-ops.web.app and test

### Manual Sync (if needed)

If you need to sync files without pushing:

```powershell
# Copy main source files
Copy-Item "backend/src/*.js" -Destination "backend/gas_prod_snapshot/" -Force

# Copy and flatten expense modules
Copy-Item "backend/src/modules/expense/*.js" -Destination "backend/gas_prod_snapshot/" -Force

# Push to existing deployment (NEVER use clasp deploy)
cd backend/gas_prod_snapshot
clasp push
```

### Key Files

| File              | Location                     | Purpose                             |
| ----------------- | ---------------------------- | ----------------------------------- |
| `deploy.ps1`      | `backend/scripts/`           | Automated sync + push script        |
| `.clasp.json`     | `backend/gas_prod_snapshot/` | Clasp configuration for GAS project |
| `appsscript.json` | `backend/gas_prod_snapshot/` | GAS project manifest                |

### DO NOT

- ❌ **NEVER run `clasp deploy`** - creates new URL, breaks configs!
- ❌ Run `clasp push` directly from `backend/src/` - modules subfolder won't work
- ❌ Manually copy files to `gas_prod_snapshot/` without running the deploy script (may miss files)
- ❌ Edit files in `gas_prod_snapshot/` directly - always edit in `backend/src/` and sync
