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

## 🏛️ The 3 Universal One-Shot Packages Synchronized Across All Repos

Every repository in the ecosystem (new or existing) receives and enforces the **3 Universal Assurance & State Packages**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        3 CORE UNIVERSAL PACKAGES IN SAP SYNC                           │
├─────────┬──────────────────────────────────────────┬───────────────────────────────────┤
│ Package │ Title & Spec Code                        │ Core Deliverables & Tooling       │
├─────────┼──────────────────────────────────────────┼───────────────────────────────────┤
│ PKG-001 │ Universal Web Release Assurance Gate     │ • scripts/verify-deployment.cjs   │
│         │ (SPEC-SAP-DEPLOY-GATE-001 / P-002)       │ • scripts/forensic-audit.cjs      │
│         │                                          │ • scripts/verify-react-deploy.cjs │
│         │                                          │ • .deploymentrc.json (Config)     │
├─────────┼──────────────────────────────────────────┼───────────────────────────────────┤
│ PKG-002 │ Universal Web App Bootstrap & Scaffolder │ • scripts/bootstrap-web-app.cjs   │
│         │ (SPEC-SAP-BOOTSTRAP-001)                 │ • templates/web-spa-shell/        │
│         │                                          │ • Dual CLI (scaffold & retrofit)  │
├─────────┼──────────────────────────────────────────┼───────────────────────────────────┤
│ PKG-003 │ Universal Write-Intent & Triage Engine   │ • scripts/triage-requests.cjs     │
│         │ (SPEC-ARCH-INTENT-DISPATCH-001 / SK-004) │ • /change_requests cloud queue    │
│         │                                          │ • CQRS Intent Dispatcher & Triage │
└─────────┴──────────────────────────────────────────┴───────────────────────────────────┘
```

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
1. **Directories**: Scaffolds `.agent/workflows/portable`, `.agent/skills`, `.agent/patterns`, `.claude/skills`, `docs/protocols`, `docs/ssot`, `templates`, and `scripts`.
2. **Universal Release Gate (PKG-001)**: Deploys `verify-deployment.cjs`, `forensic-audit.cjs`, `verify-react-deployment.cjs`, and `.deploymentrc.json`.
3. **Turnkey Scaffolder & Shell (PKG-002)**: Deploys `bootstrap-web-app.cjs` and `templates/web-spa-shell/`.
4. **Write-Intent & Triage Engine (PKG-003)**: Deploys `triage-requests.cjs` for asynchronous CLI triage.
5. **Governance Verifiers**: Deploys `verify-governance-wiring.cjs` (P82 verifier) and `verify-governance-schema.cjs`.
6. **Protocols & Patterns**: Deploys `PATTERN-ACTIVATION-CONTRACT-MANUAL.md`, `web-deployment-gate.md` (13 Invariants), and adapts all universal patterns.
7. **Workflows**: Deploys `plan.md`, `plan-review.md`, `sap-sync.md`, `web-deployment-gate.md`, `architecture-council.md`, `ui-council.md`, etc.
8. **Universal Skills**: Copies `web-deployment-gate`, `writing-plans`, `systematic-debugger`, `prompt-clarity`, `pin-branch`, `mermaid-skill`, `ssot-domain-mapper`, `ui-ux-pro-max`, `frontend-design`, `impeccable`, etc.
9. **Package Hooks**: Registers `verify:deployment`, `verify:react-deployment`, `audit:decomposition`, `bootstrap:web-app`, `triage:requests`, and `verify:governance-wiring:all` in `package.json`.
10. **Operating Manuals**: Generates tailored `CLAUDE.md`, `GEMINI.md`, `skill-router.yaml`, and `PREFLIGHT.md`.
11. **Automated Verification**: Executes `node scripts/verify-governance-wiring.cjs --all` inside the target repo, guaranteeing 100% green verification upon exit.

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

To update an already-onboarded repository with the latest universal patterns, skills, and 3 core packages:

```powershell
node scripts/bootstrap-spoke-governance.cjs --target="d:/GitHub_Repo/<TargetSpoke>"
```

---

## Step 3 — Target Spoke Verification

Always verify in the target spoke repository context:

```powershell
cd "d:/GitHub_Repo/<TargetSpoke>"
npm run verify:governance-wiring:all
npm run verify:deployment
```
Ensure all checks report `✅ ALL PRE-FLIGHT VERIFICATION GATES PASSED (100% GREEN)`.