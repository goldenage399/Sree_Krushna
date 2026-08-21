---
description: Create an implementation plan using the writing-plans skill
---

# /plan Workflow

## Step 0.1: Universal Patterns Reference Check
Review relevant ecosystem patterns:
- `.agent/patterns/anti-masking-fallback-layers.md`
- `.agent/patterns/call-graph-and-rules-ast-verification-gate.md`
- `.agent/patterns/centralized-mutation-delegation.md`
- `.agent/patterns/css-bridge-specificity-management.md`
- `.agent/patterns/css-color-mix-gradient-silence.md`
- `.agent/patterns/data-layer-verification-first.md`
- `.agent/patterns/data-migration-occupancy-safety.md`
- `.agent/patterns/db-inspect-fleet.md`
- `.agent/patterns/deep-link-hook-composition.md`
- `.agent/patterns/derive-dont-declare-guardrails.md`
- `.agent/patterns/deterministic-ui-manual-capture-and-annotation-pipeline.md`
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
- `.agent/patterns/mock-first-boundary-contract-lock.md`
- `.agent/patterns/modal-action-handler-contract.md`
- `.agent/patterns/modal-gating-by-active-view.md`
- `.agent/patterns/modal-swap-transition.md`
- `.agent/patterns/monolithic-css-append-and-all-theme-matrix-sweep.md`
- `.agent/patterns/multi-profile-array-contains-query.md`
- `.agent/patterns/mutation-contract-pattern.md`
- `.agent/patterns/P66-P67-collection-ownership.md`
- `.agent/patterns/p81-id-registration-process.md`
- `.agent/patterns/page-anchors-neutrality.md`
- `.agent/patterns/page-width-ownership.md`
- `.agent/patterns/performative-council-and-telemetry-gate.md`
- `.agent/patterns/playwright-e2e-testing-protocol.md`
- `.agent/patterns/playwright-indexeddb-auth-session-capture.md`
- `.agent/patterns/playwright-spa-e2e-testing-best-practices.md`
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
- `.agent/patterns/search-before-inventing.md`
- `.agent/patterns/service-import-without-write-wiring.md`
- `.agent/patterns/skill-source-verification-gate.md`
- `.agent/patterns/ssot-preservation-template-guard.md`
- `.agent/patterns/subcollection-write-cache-atomicity.md`
- `.agent/patterns/theme-button-opt-out-contract.md`
- `.agent/patterns/triage-anomalies-first.md`
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

### Step 1: Check Enhancement Context

**Ask:** "Is there an active PIO for this work?"

- **YES**: Use `enhancement-notes/ENHANCEMENT_PIO-XXX_*/` folder
- **NO**: Ask if user wants to run `enhancement-scaffolder` skill first

### Step 2: Select Planning Skill

**Complexity Assessment:**

- **Standard Feature**: Use `writing-plans` (Creates `implementation_plan.md`)
- **Complex Execution**: Use `planning-with-files` (Creates `task_plan.md` + `findings.md`)
  - Use when: Multi-step research, large refactors, or >5 tool calls expected.

**Action:** Read the chosen SKILL.md and follow instructions.

### Step 3: Save Plan

**Location (conditional):**

- `implementation_plan.md`:
  - If PIO exists → `enhancement-notes/ENHANCEMENT_PIO-XXX_Title/`
  - If no PIO → `docs/plans/YYYY-MM-DD-<feature-name>.md`
- `task_plan.md` (planning-with-files):
  - Always in **Project Root** (required by skill)

### Step 4: Execution Handoff

After plan is complete, offer:

1. **Subagent-Driven (this session)** → Use `subagent-driven-development` skill
2. **Parallel Session (separate)** → Use `executing-plans` skill
3. **Governed Execution** → Follow `/governance-workflow` for high-risk work

### Step 5: Notify User

Request user review of the implementation plan before proceeding to execution.
