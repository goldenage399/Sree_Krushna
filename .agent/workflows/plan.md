---
description: Create an implementation plan using the writing-plans skill
---

# /plan Workflow

## Step 0.1: Universal Patterns Reference Check
Review relevant ecosystem patterns:
- `.agent/patterns/P66-P67-collection-ownership.md`
- `.agent/patterns/anti-masking-fallback-layers.md`
- `.agent/patterns/call-graph-and-rules-ast-verification-gate.md`
- `.agent/patterns/canonical-stakeholder-deep-link-station.md`
- `.agent/patterns/centralized-mutation-delegation.md`
- `.agent/patterns/collab-visual-intake-and-deep-link-sharing.md`
- `.agent/patterns/consumer-path-integration-verification.md`
- `.agent/patterns/containing-block-viewport-escape-gate.md`
- `.agent/patterns/css-bridge-specificity-management.md`
- `.agent/patterns/css-color-mix-gradient-silence.md`
- `.agent/patterns/data-layer-verification-first.md`
- `.agent/patterns/data-migration-occupancy-safety.md`
- `.agent/patterns/db-inspect-fleet.md`
- `.agent/patterns/declarative-option-clustering-and-consensus.md`
- `.agent/patterns/deep-link-hook-composition.md`
- `.agent/patterns/derive-dont-declare-guardrails.md`
- `.agent/patterns/deterministic-ui-manual-capture-and-annotation-pipeline.md`
- `.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md`
- `.agent/patterns/dynamic-module-timing-race-and-auth-reconnect.md`
- `.agent/patterns/enhancement-id-staleness-collision.md`
- `.agent/patterns/eur-surface-audit.md`
- `.agent/patterns/event-metadata-contract-drift.md`
- `.agent/patterns/evidence-scoped-cta-gating.md`
- `.agent/patterns/external-iterative-design-gate.md`
- `.agent/patterns/git-tracked-secret-scanning-p104.md`
- `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`
- `.agent/patterns/ivp-001.md`
- `.agent/patterns/jwt-claims-sync-gate.md`
- `.agent/patterns/layout-linter-neutrality-gate.md`
- `.agent/patterns/lazy-periodic-instance-generation.md`
- `.agent/patterns/localhost-sw-cache-bypass-gate.md`
- `.agent/patterns/mock-first-boundary-contract-lock.md`
- `.agent/patterns/modal-action-handler-contract.md`
- `.agent/patterns/modal-gating-by-active-view.md`
- `.agent/patterns/modal-swap-transition.md`
- `.agent/patterns/monolithic-css-append-and-all-theme-matrix-sweep.md`
- `.agent/patterns/monolithic-engine-port-css-scoping-gate.md`
- `.agent/patterns/multi-profile-array-contains-query.md`
- `.agent/patterns/mutation-contract-pattern.md`
- `.agent/patterns/p81-id-registration-process.md`
- `.agent/patterns/page-anchors-neutrality.md`
- `.agent/patterns/page-width-ownership.md`
- `.agent/patterns/performative-council-and-telemetry-gate.md`
- `.agent/patterns/phased-development-ticket-first-gate.md`
- `.agent/patterns/plan-to-execution-reconciliation.md`
- `.agent/patterns/playwright-e2e-testing-protocol.md`
- `.agent/patterns/playwright-indexeddb-auth-session-capture.md`
- `.agent/patterns/playwright-spa-e2e-testing-best-practices.md`
- `.agent/patterns/portability-agnostic-derivation-gate.md`
- `.agent/patterns/position-routine-workspace-vs-audit-scoping.md`
- `.agent/patterns/prop-cascade-trace-safety.md`
- `.agent/patterns/proxy-signal-verdicts.md`
- `.agent/patterns/raw-evidence-before-hypothesis.md`
- `.agent/patterns/recurring-checklist-crud-playbook.md`
- `.agent/patterns/role-workflow-completeness.md`
- `.agent/patterns/rules-enforcement-testing-no-emulator.md`
- `.agent/patterns/sandboxed-ui-validation-gate.md`
- `.agent/patterns/scope-ledger-anchor.md`
- `.agent/patterns/scoped-query-ui-presentation-gap.md`
- `.agent/patterns/sdca-container-query-scoping.md`
- `.agent/patterns/sdca-pre-emit-syntax-gate.md`
- `.agent/patterns/search-before-inventing.md`
- `.agent/patterns/service-import-without-write-wiring.md`
- `.agent/patterns/skill-source-verification-gate.md`
- `.agent/patterns/ssot-preservation-template-guard.md`
- `.agent/patterns/sub-engine-shadowing-and-tab-reconciliation.md`
- `.agent/patterns/subcollection-write-cache-atomicity.md`
- `.agent/patterns/theme-button-opt-out-contract.md`
- `.agent/patterns/three-way-schema-alignment.md`
- `.agent/patterns/triage-anomalies-first.md`
- `.agent/patterns/two-tier-workspace-subview-decoupling.md`
- `.agent/patterns/typography-weight-and-bridge-token-enforcement.md`
- `.agent/patterns/ui-primitive-codebase-wide-standardization.md`
- `.agent/patterns/verifiable-implementation-before-adr-promotion.md`
- `.agent/patterns/web-deployment-gate.md`
- `.agent/patterns/write-site-contract-verification.md`
- `.agent/patterns/write-without-reader.md`

## When to Use

- Starting work on a new feature
- Need structured planning before coding
- Want guaranteed skill invocation for planning

## Steps

### Step 0: Incident & Historical Recurrence Gate [INC-068]

> [!IMPORTANT]
> **Automated Knowledge Retrieval**: Before drafting an implementation plan, execute:
> - `node tools/query-cli/cli.cjs --frontend "<keywords>"` (for UI/CSS/component changes)
> - `node tools/query-cli/cli.cjs --backend "<keywords>"` (for service/GAS/database changes)
> - `node tools/query-cli/cli.cjs --token "<name>"` (for CSS custom properties / theme tokens)
>
> **Requirement**: Any relevant INC-XXX case studies or historical invariants found must be explicitly listed under the plan's `User Review Required` or `Proposed Changes` section.

### Step 0.5: Service Layer Pre-Check (Backend Only) [PIO-086]

> **Skip this step** if work doesn't touch `backend/src/modules/`.

**First**: Read [ARCHITECTURE_Service_Layer_Pattern.md](../docs/ARCHITECTURE_Service_Layer_Pattern.md) to understand layer definitions.

1. **List Affected Modules**: Which modules will be modified?
2. **Verify Maps Exist**:
   ```
   | Module | Map Exists? |
   |--------|-------------|
   | Accounts | ✅ docs/Accounts_Module_SSOT/SERVICE_LAYER_MAP.md |
   | Expense | ❌ MISSING |
   ```
3. **If Map Missing**:
   - **DEFER** the planning OR
   - Create the `SERVICE_LAYER_MAP.md` first
4. **Create Layer Classification Table**:
   ```markdown
   | File | Layer | Operation |
   |------|-------|-----------| 
   | 14_10_ExpenseAggregator.js | Engine | Adding filter logic |
   | 14_05_MasterAccountsReader.js | Fetcher | New read function |
   ```

**Reference**: 
- Protocol #44 in GEMINI.md
- [ARCHITECTURE_Service_Layer_Pattern.md](../docs/ARCHITECTURE_Service_Layer_Pattern.md)

### Step 0.6: 4-Phase Problem-Solving Pre-Check (4-PPSD)

> [!NOTE]
> Ensure the plan aligns with the 4-Phase Problem-Solving Discipline ([GEMINI.md §AKCS-BEH-001 line 5](file:///d:/GitHub_Repo/Task-Dashboard/GEMINI.md)):
> 1. **Phase 1 (Codebase Intent)**: Verify existing data models, caller greps, and root causes physically before proposing task steps. See `.agent/patterns/write-site-contract-verification.md` for ground-truth verification rules.
> 2. **Phase 2 (External Industry Benchmarks)**: Search web/standards for enterprise benchmarks (e.g. Linear, Jira, Asana) or standard library solutions before inventing custom abstractions.
> 3. **Phase 3 (Objective Rule Synthesis)**: Declare explicit precedence ladders or decision rules for edge-case resolution.
> 4. **Phase 4 (Evidence-Based Execution)**: Ensure each task in the plan has clear, independently verifiable test steps. Follow the mandatory plan hard-stop gate (`.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`) and stop for explicit user approval before mutating files.

---

### Step 1: Mandatory Ticket Registration Gate [P-TICKET-FIRST-PHASING-001]

> **Invariant**: [`.agent/patterns/phased-development-ticket-first-gate.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/patterns/phased-development-ticket-first-gate.md)  
> **Standard**: `STD-PHASED-DEV-001` / `AC-DEC-2026-042`

**Multi-phase / Multi-surface Check**:
Does this initiative require ≥2 phases, span ≥2 files/modules, or exceed 200 lines of changes?

- **YES (Multi-phase / Complex)**:
  - An active enhancement ticket (`SK-###`, `TASK-###`, `PIO-###`) is **MANDATORY** before drafting the plan.
  - If ticket already exists in `enhancement-notes/` and `ENHANCEMENT-MASTER-REGISTRY.md`: use that folder (`enhancement-notes/{ID}-{Title}/implementation_plan.md`).
  - If NO ticket exists: **HALT**. Run `/enhancement-scaffolder` and `/enhancement-protocol-enforcer` to register the ticket and cluster entry BEFORE creating the plan.
- **NO (Single-scope simple patch)**:
  - Standalone plan saved to `docs/plans/YYYY-MM-DD-<feature-name>.md`.

### Step 2: Invoke Universal Planning Engine [P-UNIVERSAL-PLANNING-ENGINE-001]

> **Canonical Engine**: [`.agent/skills/writing-plans/SKILL.md`](../skills/writing-plans/SKILL.md)  
> **Standard**: `STD-PLANNING-ENGINE-001` / `AC-DEC-2026-044`

All planning workflows unconditionally invoke **`writing-plans`** as the single canonical planning engine. Legacy planners (`planning-with-files`, `implementation-plan-template`) are deprecated.

**Engine Capabilities**:
- Grounded in 4-PPSD and Reality-First Grounding (`RFG-001`).
- Generates 4-Tier DoD v1.7 sequential phase matrix (T1 Static, T2 Functional, T3 Integrated, T4 Governance).
- Generates 5-Step TDD task blocks (failing test, run fail, minimal implementation, run pass, commit).
- Enforces binary Validation Gates (VG) and Decision Nodes (DN).
- Enforces mandatory plan hard-stop before code execution (`INC-079`).

### Step 3: Save Implementation Plan

**Plan File Path**:
- **Active Enhancement Ticket** (`SK-###`, `TASK-###`, `PIO-###`):
  `enhancement-notes/{ID}/implementation_plan.md`
- **Single-Scope Patch (Exempt)**:
  `docs/plans/YYYY-MM-DD-<feature-name>.md`

### Step 4: Execution Handoff

After saving the plan, present the execution approach:
1. **Subagent-Driven**: Dispatch fresh subagent per phase/task with checkpoints.
2. **Sequential Session**: Execute Phase 1 tasks sequentially with atomic commits.
3. **Governed Execution**: Follow `/governance-workflow` for high-risk work.

### Step 5: Mandatory Plan Hard-Stop [INC-079]

Request user review of the implementation plan before proceeding to code execution. The agent MUST NOT write implementation code in the same prompt turn as plan creation.
