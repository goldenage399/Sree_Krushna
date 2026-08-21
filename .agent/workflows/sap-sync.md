---
description: Synchronize universal PACT governance patterns, onboard new repositories, shared council blocks, and portable engine across repositories.
---

# SAP & PACT Pattern Sync Workflow (`/sap-sync`)

> **Purpose**: Automates the cross-repository onboarding and synchronization of the PACT-001 (Pattern Activation Contract) governance mechanism, universal patterns, skills, shared council blocks, and portable engines across all repositories in the ecosystem.
>
> **Canonical Hub**: `Task-Dashboard` (`d:\GitHub_Repo\Task-Dashboard`)
>
> **Scope**: All SAP-linked repositories (e.g. `Task-Dashboard`, `PIOperationsMgmt_Firebase`, `Capsicum`, `BMS`, `UG-Farmhouse`, `QSR`, `Sree_Krushna`, `DashBoard`, `Inventory_Mgmt`, `Unified_Uploader`, etc.)

**Trigger phrases**:
- "bootstrap new repo governance"
- "onboard new repo"
- "sync patterns across repos"
- "propagate PACT mechanism"
- "run sap-sync"
- "deploy PACT to other repos"
- "sync universal patterns"

---

## ⚡ Quick-Start: 1-Command New Repo Onboarding (Bootstrap)

To instantly initialize full `.agent` governance, PACT-001 patterns, universal skills, workflows, verification gates, `package.json` hooks, and `CLAUDE.md`/`GEMINI.md` for ANY new or existing repository:

```powershell
# Run from Task-Dashboard canonical hub:
npm run sap:bootstrap -- --target="d:/GitHub_Repo/<NewRepoName>"

# Or invoke directly with Node:
node scripts/bootstrap-spoke-governance.cjs --target="d:/GitHub_Repo/<NewRepoName>" --name="<RepoName>" --description="<Optional Description>"
```

### What the 1-Command Bootstrap Does Automatically:
1. **Directories**: Scaffolds `.agent/workflows/portable`, `.agent/skills`, `.agent/patterns`, `docs/protocols`, `docs/ssot`, and `scripts`.
2. **Verifiers**: Copies `verify-governance-wiring.cjs` (P82 verifier) and `verify-governance-schema.cjs`.
3. **Protocols**: Deploys `PATTERN-ACTIVATION-CONTRACT-MANUAL.md` and `governance-wiring.schema.json`.
4. **Workflows**: Deploys `plan.md`, `plan-review.md`, `sap-sync.md`, `capture-pattern.md`, `aos-session-open.md`, `aos-session-close.md`, `spoke-and-wheel-docs.md`, `systematic-debugging.md`, etc.
5. **Universal Skills**: Copies `writing-plans`, `systematic-debugger`, `protocol-enforcer-pre-code`, `prompt-clarity`, `pin-branch`, `mermaid-skill`, `ssot-domain-mapper`, `writing-technical-documentation`, `writing-clearly-and-concisely`, `memory-session-loader`, `memory-session-end`, `memory-event-logger`, `memory-decision-logger`.
6. **PACT-001 Patterns**: Copies and automatically adapts all universal patterns (`search-before-inventing`, `raw-evidence-before-hypothesis`, `intent-clarity-decoupling`, `proxy-signal-verdicts`, `scope-ledger-anchor`, `triage-anomalies-first`, `data-layer-verification-first`, `write-without-reader`, `p81-id-registration-process`).
7. **Package Hooks**: Registers `verify:governance-wiring`, `verify:governance-wiring:all`, and `verify:governance-schema` in `package.json`.
8. **Catalogs & Manuals**: Generates tailored `.agent/skill-router.yaml`, `.agent/standards-catalog.json`, `.agent/PREFLIGHT.md`, `CLAUDE.md`, and `GEMINI.md`.
9. **Verification**: Executes `node scripts/verify-governance-wiring.cjs --all` inside the target repo, guaranteeing 100% green verification upon exit.

---

## Step 0 — Portability & Scope Evaluation Gate (MANDATORY)

Before promoting or modifying shared governance files, evaluate the 5-Gate Portability Model:
- **Gate 1 (Substrate Decoupling)**: Keep pure reasoning in shared blocks; keep framework specifics in local sections.
- **Gate 2 (4-Tier Scope Classification)**: Assign logic strictly to governing tier (`all`, `tier-1`, `tier-3`, `local-only`).
- **Gate 3 (Marker Boundary Isolation)**: Enclose shared blocks inside `<!-- shared:std.<domain>.<block-id>:start/end -->`.
- **Gate 4 (Mechanical Verification)**: Enforce byte-level UTF-8 without BOM and automated schema linting.
- **Gate 5 (Reality-First Simplicity)**: Ground shared mechanisms against current reality before expanding complexity.

---

## Step 1 — Verify Local State on Canonical Hub

1. Ensure the canonical hub (`Task-Dashboard`) is clean:
   ```powershell
   git status
   ```
2. Run local governance verification:
   ```powershell
   npm run verify:governance-wiring:all
   ```

---

## Step 2 — Synchronize Existing Spokes

To update an already-onboarded repository with the latest universal patterns and skills:

```powershell
node scripts/bootstrap-spoke-governance.cjs --target="d:/GitHub_Repo/<TargetSpoke>"
```

---

## Step 3 — Target Spoke Verification

Always verify in the target spoke repository context:

```powershell
cd "d:/GitHub_Repo/<TargetSpoke>"
npm run verify:governance-wiring:all
```
Ensure output reports `✅ All artifact(s) fully wired — read path is complete.`