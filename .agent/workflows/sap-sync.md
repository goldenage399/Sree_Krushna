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

---

## Step 4 — Sync Agent Config Blocks (Block Propagation)

> **Purpose**: Propagates `std.universal.*` blocks from `UNIVERSAL_AGENT_CONTEXT.md` into all SAP-linked repos' `CLAUDE.md`, `GEMINI.md`, and `.agents/AGENTS.md`. Also checks for drift between a repo's `AGENT_SHARED_CONTEXT.md` (canonical) and its consuming files.

### Block Taxonomy

| Tier | Marker Domain | Source | Scope |
|---|---|---|---|
| Universal | `std.universal.*` | `UNIVERSAL_AGENT_CONTEXT.md` (this repo) | All SAP-linked repos |
| Repo-local | `std.repo.<slug>.*` | Each repo's `AGENT_SHARED_CONTEXT.md` | Single repo only |
| Ecosystem | `std.ecosystem.<cluster>.*` | Lead repo of cluster | Named repo cluster |

**Full taxonomy registry**: [`Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md`](../../../Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md)

### Drift Detection (non-destructive — run first)

```powershell
# Check ALL repos for block drift — exits non-zero if any mismatch found
npm run sync:agent-blocks -- --check

# Check a single repo
npm run sync:agent-blocks -- --check --repo="d:/GitHub_Repo/BMS"

# Show a drift report without modifying anything
npm run sync:agent-blocks -- --report
```

### Propagating Universal Blocks to a Target Repo

When a universal block is updated in `UNIVERSAL_AGENT_CONTEXT.md`:

```powershell
# Push all universal blocks to a single target repo
npm run sync:agent-blocks -- --push --tier=universal --repo="d:/GitHub_Repo/<target-repo>"

# Push all universal blocks to ALL SAP-linked repos
npm run sync:agent-blocks -- --push --tier=universal

# Push a specific block to a specific repo
npm run sync:agent-blocks -- --push --block=std.universal.ai-behavioral-guidelines --repo="d:/GitHub_Repo/Capsicum"
```

### Manual Sync Protocol (until `sync:agent-blocks` script is implemented)

1. Edit the block in `UNIVERSAL_AGENT_CONTEXT.md` between its `<!-- shared:std.universal.<id>:start -->` / `<!-- shared:std.universal.<id>:end -->` markers.
2. Copy the updated content block.
3. In each target repo's `CLAUDE.md`, `GEMINI.md`, and `.agents/AGENTS.md`, find the matching `<!-- shared:std.universal.<id>:start | source: ... -->` marker and replace the content up to the matching `:end` marker.
4. Commit in each target repo referencing the block ID in the message.

### Wiring a New Repo into the Block System

1. Create `AGENT_SHARED_CONTEXT.md` in the new repo (use existing stubs as template — copy from BMS or Capsicum).
2. Assign a repo slug (e.g., `newrepo`) and update all block IDs to `std.repo.newrepo.*`.
3. Populate the 4 repo-local blocks: `project-overview`, `document-authority-hierarchy`, `command-reference`, `pattern-activation`.
4. Wrap the corresponding sections in `CLAUDE.md` / `GEMINI.md` / `.agents/AGENTS.md` with `shared:std.repo.newrepo.*` markers.
5. For universal blocks in those files, replace existing inline content with the content from `UNIVERSAL_AGENT_CONTEXT.md` wrapped in `shared:std.universal.*` markers.
6. Register the new repo slug in [`Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md`](../../../Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md) — add rows to the Repo-Local Block Registry and Consuming File Status tables.
7. Run `npm run sync:agent-blocks -- --check --repo="d:/GitHub_Repo/<new-repo>"` to verify zero drift.

### `sync:agent-blocks` Script Spec

The script is wired into `package.json` as:
```json
"sync:agent-blocks": "node scripts/sync-agent-blocks.cjs --check",
"sync:agent-blocks:push": "node scripts/sync-agent-blocks.cjs --push",
"sync:agent-blocks:report": "node scripts/sync-agent-blocks.cjs --check --report"
```

**Script responsibilities**:
- Parse `UNIVERSAL_AGENT_CONTEXT.md` → extract all `std.universal.*` blocks by marker
- Parse each repo's `AGENT_SHARED_CONTEXT.md` → extract all `std.repo.<slug>.*` blocks
- For each consuming file (`CLAUDE.md`, `GEMINI.md`, `.agents/AGENTS.md`) in each repo:
  - Find all `shared:std.*:start` markers
  - Extract content between start/end pairs
  - Compare against canonical source (byte-level, normalized line endings)
  - In `--check` mode: report diffs and exit non-zero
  - In `--push` mode: overwrite drifted content in consuming files, preserve surrounding file content
- Output: per-file drift table with block ID, repo, consuming file, and status (✅ in-sync / ⚠️ drifted / ❌ marker-missing)
