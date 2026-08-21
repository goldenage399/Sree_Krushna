---
name: gas-deploy-guard
description: >
  Blocks unsafe deployments and checks for stale files (Protocol 10).
  Use when user asks to "Deploy", "Push", or "Release" backend code.
  Prevents "CORS 200 OK" errors caused by stale files.
---

## Goal

Ensure zero downtime caused by bad deployments.

## The 3 Guardrails

### 1. The Clasp and Manual Prohibition (NON-NEGOTIABLE)

**Trigger**: User asks to run `clasp push`, `clasp deploy`, or manually move files to `gas_prod_snapshot`.
**Action**: 🛑 BLOCK IMMEDIATELY.
**Rule**: Manual deployment bypasses safety checks (Duplicate Globals, Router Wrappers, Stale Files).
**Correction**: "I cannot execute manual deployment. Protocol mandates using `backend/scripts/deploy.ps1`. Usage: `powershell -File backend/scripts/deploy.ps1`."
**Override**: There is NO override. If the script fails, FIX THE SCRIPT. Do not bypass it.

### 2. Router Wrapper Location (Protocol 10)

**Trigger**: User added function to `02_Router.js`.
**Check**: Where is the wrapper defined?

- ✅ `04_Expense_Router.js` (Deployed) -> OK
- ❌ `04_Expense.js` (Stale) -> FAIL. Move it to `_Router.js`.

### 3. Global Namespace Integrity

**Trigger**: User added a global variable or function.
**Check**: Is the name unique across ALL 50+ backend files?
**Action**: Warn user to use `CONST_` prefix or module scoping.

## Output

If user asks to deploy:
""I will deploy using the safe script. First, I am verifying Protocol 10 (Router Wrappers)..."

## ❌ Example Violation

**User**: "Just run `clasp push` to deploy."

**This skill BLOCKS**: "🛑 NEVER use raw clasp. Use `.\scripts\deploy.ps1` which includes namespace checks."

## ➡️ What's Next?

After this skill passes (deployment complete):

- Verify in production: `https://pi-ops.web.app`
- Run **`pirr-compliance`** if this was a feature release"
