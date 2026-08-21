---
description: Streamlined Post-Incident Governance Workflow
---

# /post-incident-governance-lite

**Purpose**: Document a resolved production bug or systemic failure mode to prevent its recurrence.

---

## Step 1 — Log the Incident
Write a short case study entry inside `docs/incidents/INC-XXX.md` detailing:
1. **Symptom**: What was observed.
2. **Root Cause**: Why the bug occurred.
3. **Resolution**: How the bug was fixed.

## Step 2 — Invariant Registry Update
If the bug was caused by a violation of a systemic design pattern, update your project rules SSOT (`GEMINI.md` or `CLAUDE.md`) to add or strengthen a rules block.

## Step 3 — Verification Check
Ensure the project compiles successfully:
```powershell
npm run build
```
Confirm unit tests pass:
```powershell
npm run test:unit:run
```
