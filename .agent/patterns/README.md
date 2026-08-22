# .agent/patterns/ — Process Intelligence Index

> **Purpose**: Validated process patterns, methodologies, and named anti-patterns that should
> survive beyond a single agent session without being re-derived.
>
> **Distinction from skills**: Skills are executable, parameterized instructions. Patterns are
> validated approaches an agent *reads* to avoid re-discovering a settled methodology.
>
> **Distinction from standards**: Standards (`standards-catalog.json`) are code-scannable,
> enforceable rules. Patterns are *process* intelligence — how to run a workflow, how to
> structure a brief, how to review output — things that often cannot be mechanically scanned.
>
> **How to add**: Use `/capture-pattern`. Every pattern must carry a **Pattern Activation
> Contract (PACT-001)** in its frontmatter and pass `npm run verify:governance-wiring` before
> session close.

---

## The Activation Contract (PACT-001)

A captured pattern is inert until something *pulls* it. Every pattern declares **how it is
consumed** via `activation_tier`, and the P82 gate verifies that wiring is real:

| Tier | Consumed by | Required wiring (P82-verified) |
|---|---|---|
| **`reference`** | A workflow that reads it on demand | ≥1 `consumed_by` file that actually contains `.agent/patterns/<name>.md` (bidirectional) |
| **`routed`** | Natural-language detection, standalone | `reference` + `triggers` + a `skill-router.yaml` entry |
| **`guarded`** | An executable check (ESLint / ast-grep / preflight) | `reference` + `guard: "npm run <script>"` resolving to a real `package.json` script |

The tier is a **graduation ladder**: a pattern may start at `reference` and graduate to
`guarded` once it earns an executable check. See `.agent/workflows/capture-pattern.md` Step 3.5.

---

## Index

| Pattern File | Tier | Status | Consumed By | Portability |
|---|---|---|---|---|
| [triage-anomalies-first.md](triage-anomalies-first.md) | `reference` | VALIDATED | `aos-session-open.md` | universal |
| [external-iterative-design-gate.md](external-iterative-design-gate.md) | `reference` | VALIDATED | `external-ui-redesign.md` | universal |
| [eur-surface-audit.md](eur-surface-audit.md) | `routed` | HYPOTHESIS | `external-ui-redesign.md` (Phase 5 Surface Audit Gate), `skill-router.yaml` | universal |
| [scope-ledger-anchor.md](scope-ledger-anchor.md) | `reference` | VALIDATED | `aos-session-open.md`, `aos-session-close.md` | universal |
| [db-inspect-fleet.md](db-inspect-fleet.md) | `routed` | VALIDATED | `skill-router.yaml` | repo-specific |
| [mock-first-boundary-contract-lock.md](mock-first-boundary-contract-lock.md) | `reference` | VALIDATED | `aos-session-close.md` | universal |
| [P66-P67-collection-ownership.md](P66-P67-collection-ownership.md) | `guarded` | VALIDATED | PREFLIGHT R1 (`npm run preflight`) | repo-specific |
| [mutation-contract-pattern.md](mutation-contract-pattern.md) | `guarded` | VALIDATED | PREFLIGHT R2 (`npm run sg:inv005`) | repo-specific |
| [layout-linter-neutrality-gate.md](layout-linter-neutrality-gate.md) | `reference` | VALIDATED | `post-incident-governance.md` | universal |
| [css-bridge-specificity-management.md](css-bridge-specificity-management.md) | `guarded` | VALIDATED | `post-incident-governance.md`, `debug-frontend.md`, `debug.md`, `skill-router.yaml`, PREFLIGHT R26 (`npm run check:bridge-classes`) | universal |
| [page-width-ownership.md](page-width-ownership.md) | `reference` | VALIDATED | `debug-frontend.md` (Step 4 — Who owns WIDTH?) | universal |
| [skill-source-verification-gate.md](skill-source-verification-gate.md) | `routed` | HYPOTHESIS | `skill-onboarding.md`, `skill-router.yaml` | universal |
| [service-import-without-write-wiring.md](service-import-without-write-wiring.md) | `reference` | VALIDATED | `post-incident-governance.md`, `cos-invoke.md` | universal |
| [subcollection-write-cache-atomicity.md](subcollection-write-cache-atomicity.md) | `reference` | HYPOTHESIS | `post-incident-governance.md`, `cos-invoke.md` | universal |
| [jwt-claims-sync-gate.md](jwt-claims-sync-gate.md) | `reference` | VALIDATED | `cos-invoke.md` | repo-specific |
| [ui-primitive-codebase-wide-standardization.md](ui-primitive-codebase-wide-standardization.md) | `reference` | HYPOTHESIS | `harvest-frontend-knowledge.md`, `cos-invoke.md` | universal |
| [centralized-mutation-delegation.md](centralized-mutation-delegation.md) | `reference` | VALIDATED | `post-incident-governance.md`, `cos-invoke.md` | universal |
| [role-workflow-completeness.md](role-workflow-completeness.md) | `reference` | VALIDATED | `role-activation.md`, `post-incident-governance.md` | universal |
| [theme-button-opt-out-contract.md](theme-button-opt-out-contract.md) | `reference` | **SUPERSEDED** (INC-063 — model inverted to opt-in, see file) | `debug-frontend.md` (Track G), `THEME-SYSTEM.md` (FKL-DI-003, FKL-DI-015), `harvest-frontend-knowledge.md` (Phase 0.1) | universal |
| [data-layer-verification-first.md](data-layer-verification-first.md) | `reference` | VALIDATED | `debug.md` (Investigation Gate), `debug-backend.md` (Phase 1) | universal |
| [sandboxed-ui-validation-gate.md](sandboxed-ui-validation-gate.md) | `reference` | VALIDATED | `FRONTEND-KNOWLEDGE-HUB.md` (Part 10 Step 0) | universal |
| [modal-action-handler-contract.md](modal-action-handler-contract.md) | `reference` | VALIDATED | `debug-frontend.md` (Track G) | repo-specific |
| SDP-001 (external) | `reference` | VALIDATED | `GEMINI.md` protocol table + mandatory triggers | universal |
| [event-metadata-contract-drift.md](event-metadata-contract-drift.md) | `routed` | HYPOTHESIS | `post-incident-governance.md`, `skill-router.yaml` | repo-specific |
| [scoped-query-ui-presentation-gap.md](scoped-query-ui-presentation-gap.md) | `reference` | HYPOTHESIS | `post-incident-governance.md`, `debug-frontend.md` | universal |
| [deep-link-hook-composition.md](deep-link-hook-composition.md) | `reference` | HYPOTHESIS | `enhancement-protocol.md` | universal |
| [modal-gating-by-active-view.md](modal-gating-by-active-view.md) | `reference` | VALIDATED | `debug-frontend.md` | repo-specific |
| [modal-swap-transition.md](modal-swap-transition.md) | `reference` | VALIDATED | `debug-frontend.md` | repo-specific |
| [prop-cascade-trace-safety.md](prop-cascade-trace-safety.md) | `reference` | VALIDATED | `change-impact-analysis.md` | repo-specific |
| [page-anchors-neutrality.md](page-anchors-neutrality.md) | `reference` | HYPOTHESIS | `change-impact-analysis.md` | repo-specific |
| [css-color-mix-gradient-silence.md](css-color-mix-gradient-silence.md) | `guarded` | VALIDATED | `debug-frontend.md`, PREFLIGHT P-CMT | repo-specific |
| [write-without-reader.md](write-without-reader.md) | `reference` | VALIDATED | `post-incident-governance.md`, `cos-invoke.md` | universal |
| [performative-council-and-telemetry-gate.md](performative-council-and-telemetry-gate.md) | `reference` | VALIDATED | `architecture-council.md`, `debug-backend.md` | repo-specific |
| [verifiable-implementation-before-adr-promotion.md](verifiable-implementation-before-adr-promotion.md) | `reference` | VALIDATED | `role-activation.md`, `architecture-council.md` | repo-specific |
| [evidence-scoped-cta-gating.md](evidence-scoped-cta-gating.md) | `reference` | VALIDATED | `architecture-council.md` | universal |
| [rules-enforcement-testing-no-emulator.md](rules-enforcement-testing-no-emulator.md) | `routed` | VALIDATED | `architecture-council.md`, `skill-router.yaml` | universal |
| [data-migration-occupancy-safety.md](data-migration-occupancy-safety.md) | `reference` | VALIDATED | `backend-readiness.md` | universal |
| [derive-dont-declare-guardrails.md](derive-dont-declare-guardrails.md) | `reference` | VALIDATED | `post-incident-governance.md`, `cos-invoke.md` | universal |
| [proxy-signal-verdicts.md](proxy-signal-verdicts.md) | `routed` | VALIDATED | `post-incident-governance.md`, `debug-architecture.md`, `cos-invoke.md`, `skill-router.yaml` | universal |
| [lazy-periodic-instance-generation.md](lazy-periodic-instance-generation.md) | `reference` | HYPOTHESIS | `enhancement-protocol.md` | universal |
| [enhancement-id-staleness-collision.md](enhancement-id-staleness-collision.md) | `reference` | VALIDATED | `enhancement-scaffolder/SKILL.md` (Step 1.4) | universal |
| [git-tracked-secret-scanning-p104.md](git-tracked-secret-scanning-p104.md) | `guarded` | VALIDATED | PREFLIGHT R38 (`npm run check:secrets`) | universal |
| [playwright-indexeddb-auth-session-capture.md](playwright-indexeddb-auth-session-capture.md) | `reference` | VALIDATED | `backend-testing.md` | repo-specific |
| [playwright-spa-e2e-testing-best-practices.md](playwright-spa-e2e-testing-best-practices.md) | `reference` | VALIDATED | `AUTOMATED-TESTING-GUIDE.md`, `backend-testing.md` | repo-specific |
| [playwright-e2e-testing-protocol.md](playwright-e2e-testing-protocol.md) | `reference` | VALIDATED | `.agents/skills/e2e-testing/SKILL.md` | universal |
| [anti-masking-fallback-layers.md](anti-masking-fallback-layers.md) | `reference` | VALIDATED | `debug.md`, `debug-backend.md`, `architecture-council.md` | universal |
| [ssot-preservation-template-guard.md](ssot-preservation-template-guard.md) | `reference` | VALIDATED | `ssot-reconciliation.md`, `governance-workflow.md` | repo-specific |
| [write-site-contract-verification.md](write-site-contract-verification.md) | `reference` | VALIDATED | `role-activation.md`, `plan.md` | universal |
| [position-routine-workspace-vs-audit-scoping.md](position-routine-workspace-vs-audit-scoping.md) | `reference` | VALIDATED | `debug-task-architecture.md`, `cos-invoke.md` | universal |
| [recurring-checklist-crud-playbook.md](recurring-checklist-crud-playbook.md) | `reference` | HYPOTHESIS | `cos-invoke.md`, `RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md` | repo-specific |
| [call-graph-and-rules-ast-verification-gate.md](call-graph-and-rules-ast-verification-gate.md) | `reference` | VALIDATED | `architecture-council.md`, `debug.md` | universal |
| [typography-weight-and-bridge-token-enforcement.md](typography-weight-and-bridge-token-enforcement.md) | `reference` | VALIDATED | `debug-frontend.md`, `cos-invoke.md` | universal |
| [intent-clarity-decoupling-and-plan-hardstop.md](intent-clarity-decoupling-and-plan-hardstop.md) | `reference` | VALIDATED | `prompt-clarity/SKILL.md`, `role-activation.md`, `plan.md` | universal |
| [p81-id-registration-process.md](p81-id-registration-process.md) | `reference` | VALIDATED | `INC-016`, `INC-085`, `AGENTS.md` (Modal Rule 5), `PREFLIGHT.md` R13 | universal |
| [deterministic-ui-manual-capture-and-annotation-pipeline.md](deterministic-ui-manual-capture-and-annotation-pipeline.md) | `reference` | VALIDATED | `UI_MANUAL_CAPTURE_WORKFLOW.md` | universal |

| [monolithic-css-append-and-all-theme-matrix-sweep.md](monolithic-css-append-and-all-theme-matrix-sweep.md) | `reference` | VALIDATED | `debug-frontend.md`, `THEME-SYSTEM.md` | repo-specific |
| [monolithic-engine-port-css-scoping-gate.md](monolithic-engine-port-css-scoping-gate.md) | `reference` | VALIDATED | `external-ui-redesign.md`, `CLAUDE.md`, `GEMINI.md` | universal |
| [localhost-sw-cache-bypass-gate.md](localhost-sw-cache-bypass-gate.md) | `reference` | VALIDATED | `web-deployment-gate.md`, `CLAUDE.md`, `GEMINI.md` | universal |
| [sub-engine-shadowing-and-tab-reconciliation.md](sub-engine-shadowing-and-tab-reconciliation.md) | `reference` | VALIDATED | `ssot-reconciliation.md`, `CLAUDE.md`, `GEMINI.md` | universal |
> Update this index whenever a pattern is created or its tier changes via `/capture-pattern`.

---

## Usage

When starting any task, check this index first if it involves:
- **Major UI screens, new components, or visual layouts** → read `sandboxed-ui-validation-gate.md` to construct isolation previews and verify theme compatibility first.
- **Tailwind responsive class doing nothing / grid not multi-column / breakpoint silently ignored** → read `css-bridge-specificity-management.md` **IMMEDIATELY** (6 confirmed incidents). VEA-001 applies: stop after 1 failed attempt and request a screenshot. **Cheaper than reading**: just run `npm run preflight` before calling any src/ change done — R26 catches this mechanically, no reading required.
- **Scaffolding a new enhancement / getting a TASK-NNN ID** → `enhancement-id-staleness-collision.md` — `enhancement-config.json`'s `next_id` can be stale; grep-verify the ID is actually free before using it (see `enhancement-scaffolder/SKILL.md` Step 1.4).
- **External / iterative UI redesign** → read `external-iterative-design-gate.md`
- **Ingesting / porting an external JSX design file into production (EUR Execution)** → run Surface Audit Gate first: read `eur-surface-audit.md` **BEFORE opening any production file**. Classify every external element; get architect sign-off on REJECT rows before coding.
- **Multi-session workflow resumption or ledger tracking** → read `scope-ledger-anchor.md`
- **Firestore reads/writes, collection ownership** → `P66-P67-collection-ownership.md` (also guarded at preflight)
- **Shared-state / profile-assignment mutations, cache invalidation** → `mutation-contract-pattern.md` (also guarded)
- **Firebase Auth claims, JWT token refreshes, and client-side security rules** → read `jwt-claims-sync-gate.md`
- **Proposing any new system, automation script, pipeline, schema, ADR, or registry LOCK** → run `proto-system-discovery` per **SDP-001** ([`SYSTEM-DISCOVERY-PROTOCOL.md`](../../docs/protocols/SYSTEM-DISCOVERY-PROTOCOL.md)) before writing anything. §6 Capability-Spectrum Check required for any contract or LOCK.
- **Firestore collection returning empty results / missing permission errors / silent query omissions** → verify data existence FIRST before editing rules or indexes — read `data-layer-verification-first.md`.
- **Reporting a "show/see/list all of X" fix as complete** → verify the render path, not just the query — read `scoped-query-ui-presentation-gap.md` before declaring done.
- **Adding URL deep-linking, or reusing an existing page's rich UI for a second, differently-scoped data source** → read `deep-link-hook-composition.md`: wrap the existing state hook, don't modify it; keep data hooks separate per consumer.
- **Overlapping details modals, dual backdrops, or nested sub-view overlay conflicts** → read `modal-gating-by-active-view.md`.
- **Nested warning modals, portal stacking context errors, or double backdrop darkening** → read `modal-swap-transition.md`.
- **Refactoring or removing component props/variants (causing layout/visual regressions)** → read `prop-cascade-trace-safety.md`.
- **Testing styling anchors, ID selectors, accessibility overrides (causing off-screen modal/layout regressive rendering)** → read `page-anchors-neutrality.md`.
- **Executing database schema migrations or batch updates to collections** → read `data-migration-occupancy-safety.md` to prevent destructive overwrites of already-migrated user mappings.

When ending a session with a validated discovery → run `/capture-pattern` to add it here.

---

## Cross-repo propagation

Patterns marked `portability: universal` are candidates for propagation to other SAP repos.
See `docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md` for the full standard and the
per-repo rollout procedure.
