# Sree Krushna Marriage OS — Agent Operating Manual

This repository represents the **Sree Krushna Marriage OS** — an architectural and operational knowledge base for wedding planning, rituals, procurement, guest management, and financials.

---

## 1. Prime Invariants & Operating Discipline

### 1. 4-Phase Problem-Solving Discipline (4-PPSD)
- **Phase 1: Ground Truth & Intent**: Analyze existing entity models (`ARCHITECTURE_SPEC.md`), invariants, and relations before modifying documents.
- **Phase 2: Research & Domain Alignment**: Verify cultural traditions and logistics against SSOT specifications before proposing changes.
- **Phase 3: Objective Rule Synthesis**: Follow explicit precedence ladders and schemas for events, rituals, and tasks.
- **Phase 4: Evidence-Based Execution**: Execute in verified, consistent steps.

### 2. Entity Identifier Integrity (`P-ENT-ID`)
All entities must use standardized 3-digit padded identifiers:
- `EVT-###`: Timeline Events (`01_TIMELINE_EVENTS/`)
- `RIT-###`: Rituals & Culture Specs (`02_RITUALS_CULTURE/specs/`)
- `PER-###`: People & Guests Directory (`03_PEOPLE_GUESTS/directory/`)
- `FAM-###`: Family Units (`03_PEOPLE_GUESTS/families/`)
- `VEN-###`: Venues & Accommodations (`05_OPERATIONS_LOGISTICS/venues/`)
- `VDR-###`: Vendors (`04_PROCUREMENT_VENDORS/vendors/`)
- `CTR-###`: Vendor Contracts (`04_PROCUREMENT_VENDORS/contracts/`)
- `TSK-###`: Governance Tasks (`00_GOVERNANCE/tasks/`)
- `DEC-###`: Decisions (`00_GOVERNANCE/decisions/`)
- `PAY-###`: Finance & Ledger Records (`06_FINANCE_COMMERCIALS/ledger/`)
- `RSK-###`: Risks & Mitigations (`00_GOVERNANCE/risks/`)

### 3. Spoke & Wheel Documentation (`P-SSOT-DOCS`)
- Hub documents (`HUB.md` / `DOCS_HUB.md`) contain only indices and status snapshots (max 150 lines).
- Spoke documents contain detailed domain specifications and declare parent hub in frontmatter.
- Master entities are canonical; all views (run sheets, dashboards, trackers) are derived views.

---

## 2. Session Startup Gate (MANDATORY)

Before any task work, review:
1. `.agent/skill-router.yaml` — Skill Router Index
2. `ARCHITECTURE_SPEC.md` — Canonical entity architecture and state machines
3. `.agent/PREFLIGHT.md` — Preflight check matrix
4. Follow `.agent/workflows/aos-session-open.md` at session start and `.agent/workflows/aos-session-close.md` at session close.

---

## 3. Key Workflows & Governance Protocols

| Task Type | Workflow / Skill to Follow |
|---|---|
| Multi-step execution planning | `.agent/workflows/plan.md` & `.agent/skills/writing-plans/SKILL.md` |
| Plan review & validation | `.agent/workflows/plan-review.md` |
| Systematic problem diagnosis | `.agent/workflows/portable/systematic-debugging.md` & `.agent/skills/systematic-debugger/SKILL.md` |
| Clarify ambiguous prompt | `.agent/skills/prompt-clarity/SKILL.md` |
| Domain mapping & entity linking | `.agent/skills/ssot-domain-mapper/SKILL.md` |
| Flowchart & architecture visuals | `.agent/skills/mermaid-skill/SKILL.md` |
| Capture new pattern | `.agent/workflows/capture-pattern.md` / `.agent/workflows/capture-pattern-lite.md` |
| Onboard new skill | `.agent/workflows/skill-onboarding.md` |
| Governance compliance workflow | `.agent/workflows/governance-workflow.md` |
| Synchronize universal patterns | `.agent/workflows/sap-sync.md` |
| Architecture Council Review | `.agent/workflows/architecture-council.md` |
| UI/UX Council Review | `.agent/workflows/ui-council.md` (featuring `impeccable` as Core Craft Auditor) |
| Ingest / Adapt External Design (EUR v2) | `.agent/workflows/external-ui-redesign.md` |
| Mobile UI Engineering (300px) | `.agent/workflows/mobile-ui-engineering.md` |
| UI Craft, Polish & Token Validation | `.claude/skills/impeccable/SKILL.md` & `.agent/skills/ui-design-validator/SKILL.md` |
| Advanced UI/UX Design System | `.agent/skills/ui-ux-pro-max/SKILL.md` & `.agent/skills/frontend-design/SKILL.md` |
| Post-Incident Governance & Analysis | `.agent/workflows/post-incident-governance.md` & `.agent/workflows/post-incident-analysis.md` |
| SSOT Conflict & Drift Reconciliation | `.agent/workflows/ssot-reconciliation.md` & `.agent/skills/ssot-domain-mapper/SKILL.md` |
| Site Architecture & Navigation | `.claude/skills/site-architecture/SKILL.md` |
| Governance verification | `npm run verify:governance-wiring:all` |

---

## 4. Pattern Activation & PACT-001 Cross-References
This repository implements the following universal patterns:
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
- `.agent/patterns/localhost-sw-cache-bypass-gate.md`
- `.agent/patterns/monolithic-engine-port-css-scoping-gate.md`
- `.agent/patterns/sub-engine-shadowing-and-tab-reconciliation.md`
