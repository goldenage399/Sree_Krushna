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

### 4. Modular Component Architecture Invariant (`STD-MOD-COMP-001` / `P-MOD-COMP-001`)
- **Zero Monolithic UI Scripts**: No web module, dashboard, or HTML assembler script may exceed 500 lines or embed raw monolithic HTML/CSS templates inline.
- **Mandatory SDCA Structure**: All web modules must follow the Static Decoupled Component Assembler pattern (`_src/components/`, `_src/styles/`, `_src/scripts/controller.js`, `_src/template.html`, `_src/build.cjs`).
- **Shared Primitives First**: Cross-cutting UI components (Carousel, Lightbox, Stepper, Option Pod, WhatsApp Share, Toast, Theme Tokens) must be imported from `ui_primitives/`.
- **Dual-Release Byte Parity**: Root (`/`) and Public (`/public`) artifacts must maintain 100% byte parity and pass `npm run verify:modular-architecture`.
- **Collaborative Options Model**: See [PROP-20260915-collaborative-options-and-comments-model.md](./docs/proposals/PROP-20260915-collaborative-options-and-comments-model.md).
- **Family Consultation Dossier**: See [A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md](./docs/references/A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md).
- **Canonical Trousseau Specification**: See [SPEC-PROC-TROUSSEAU-001.md](./docs/references/SPEC-PROC-TROUSSEAU-001.md).
- **Liturgical Attire & Catalog Drift Case Study**: See [INC-089-liturgical-attire-conflation-and-trousseau-catalog-drift.md](./docs/incidents/INC-089-liturgical-attire-conflation-and-trousseau-catalog-drift.md).
- **Stakeholder Deep-Link Station & Pathname Conflation Case Study**: See [INC-090-spa-pathname-drift-in-stakeholder-share-links.md](./docs/incidents/INC-090-spa-pathname-drift-in-stakeholder-share-links.md).
- **Unvetted Ideation Creep Case Study**: See [INC-091-unvetted-ideation-creep-and-incubation-firewall-boundary.md](./docs/incidents/INC-091-unvetted-ideation-creep-and-incubation-firewall-boundary.md).
- **ES Module Timing Race & Reconnection Case Study**: See [INC-092-dynamic-module-timing-race-and-unauthenticated-local-fallback.md](./docs/incidents/INC-092-dynamic-module-timing-race-and-unauthenticated-local-fallback.md).
- **SDCA At-Rule Compiler Scoping Case Study**: See [INC-093-sdca-compiler-regex-container-query-mangling.md](./docs/incidents/INC-093-sdca-compiler-regex-container-query-mangling.md).
- **Open Ground Experiential Proposals**: See [PROP-20260917-open-ground-experiential-enhancements.md](./docs/proposals/PROP-20260917-open-ground-experiential-enhancements.md).
- **3-Tier Multi-Surface Deployment**: See [260916_arch_council_multi_surface_web_app_and_shopping_deployment.md](./User_Created/Discussion Threads/Council/260916_arch_council_multi_surface_web_app_and_shopping_deployment.md) (`AC-DEC-2026-026` / `P-MULTI-SURFACE-DEPLOY-001`).
- **Universal Quick-Share Architecture**: See [260916_arch_council_universal_executive_quick_share_and_deep_link_architecture.md](./User_Created/Discussion Threads/Council/260916_arch_council_universal_executive_quick_share_and_deep_link_architecture.md) (`AC-DEC-2026-027` / `UI-DEC-2026-023` / `P-QUICK-SHARE-001`).
- **Mutable Table & Multi-Viewport Architecture**: See [SPEC-ARCH-MUTABLE-TABLE-001.md](./docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md) (`FKL-DI-022` / `INV-SDCA-004` / `AC-DEC-2026-034`).
- **Tri-Modal Visual Intake & Collaborative Deep-Link Sharing**: See [260924_arch_council_pinterest_intake_and_collaborative_visual_sharing.md](./User_Created/Discussion Threads/Council/260924_arch_council_pinterest_intake_and_collaborative_visual_sharing.md) (`AC-DEC-2026-035` / `P-COLLAB-VISUAL-INTAKE-001` / `INC-094`).
- **Top-Left Brand Seal & Adaptive Drawer Architecture**: See [260923_arch_council_top_left_brand_seal_and_navigation_drawer_architecture.md](./User_Created/Discussion Threads/Council/260923_arch_council_top_left_brand_seal_and_navigation_drawer_architecture.md) (`AC-DEC-2026-036` / `UI-DEC-2026-032` / `P-BRAND-NAV-HYBRID-001` / `INC-095`).
- **Shopping Catalog Domain Decoupling & Two-Tier Operating Modes**: See [260923_arch_council_shopping_catalog_information_architecture_and_domain_decoupling.md](./User_Created/Discussion Threads/Council/260923_arch_council_shopping_catalog_information_architecture_and_domain_decoupling.md) (`AC-DEC-2026-037` / `UI-DEC-2026-033` / `P-SHOPPING-JOURNEY-HUBS-001` / `INC-096`).
- **Pinterest Intake, Multi-Image Containers & Collab Deep-Link Sharing**: See [260924_arch_council_pinterest_intake_and_collaborative_visual_sharing.md](./User_Created/Discussion Threads/Council/260924_arch_council_pinterest_intake_and_collaborative_visual_sharing.md) (`AC-DEC-2026-038` / `UI-DEC-2026-034` / `P-PINTEREST-INTAKE-001` / `P-MULTI-IMAGE-CONTAINER-001` / `P-COLLAB-OPTION-SHARE-001`).
- **Decorator Cockpit Multi-Option Visual Intake & Deep-Linking**: See [260924_arch_council_decorator_cockpit_multi_option_visual_intake_and_deep_linking.md](./User_Created/Discussion Threads/Council/260924_arch_council_decorator_cockpit_multi_option_visual_intake_and_deep_linking.md) (`AC-DEC-2026-039` / `UI-DEC-2026-035` / `P-DECOR-MULTI-OPTION-001`).
- **Two-Tier Contextual Comments Engine & Cross-Option Tagging Architecture**: See [260924_arch_council_contextual_multi_option_comments_architecture.md](./User_Created/Discussion Threads/Council/260924_arch_council_contextual_multi_option_comments_architecture.md) (`AC-DEC-2026-046` / `UI-DEC-2026-042` / `P-CONTEXTUAL-COMMENTS-001` / `INC-097` / `SPEC-ARCH-CONTEXTUAL-COMMENTS-001.md`).
- **Universal UI Button Primitives & Pre-Flight Design System Verification Gate**: See [260924_arch_council_ui_button_primitives_and_preflight_gate.md](./User_Created/Discussion Threads/Council/260924_arch_council_ui_button_primitives_and_preflight_gate.md) (`AC-DEC-2026-047` / `UI-DEC-2026-043` / `STD-UI-PRIMITIVE-002` / `P-BUTTON-PRIMITIVE-GATE-001`).


### 5. Dynamic UI Lifecycle & Modal Dismissibility Invariant (`STD-UI-LIFECYCLE-001` / `DEC-003`)
- **Sequential Dynamic Script Awaiting (`INV-LIFECYCLE-01`)**: All SPA dynamic tab/fragment loaders (`mount*Tab()`) MUST await `script.onload` sequentially before executing dependent code.
- **Prohibition of Naked `DOMContentLoaded` (`INV-LIFECYCLE-02`)**: Modular UI components and dynamic fragments MUST guard event binding with `document.readyState !== 'loading'`. Naked `DOMContentLoaded` listeners are strictly forbidden.
- **3-Trigger Modal/Drawer Dismissibility (`INV-LIFECYCLE-03`)**: All modals and slide-over drawers MUST support (1) explicit Close button click, (2) Backdrop click, and (3) Escape keydown.
- **Pre-Flight Lifecycle Gate (`INV-LIFECYCLE-04`)**: Changes to UI scripts or mounters must pass `npm run verify:ui-lifecycle`.

### 6. Incubation Firewall & Ideation Boundary (`INV-INCUBATION-FIREWALL-001` / `P-IDEA-FIREWALL-001`)
- **Strict Ideation Segregation**: No exploratory suggestion, creative idea, decorator add-on, or unapproved experiential concept may directly modify or append to canonical operational SSOTs (`05_OPERATIONS_LOGISTICS/`, `04_PROCUREMENT_VENDORS/`), procurement tenders/riders, financial ledgers, or active task queues.
- **Mandatory Incubation Routing**: All new concepts, exploratory features, and brainstormed additions MUST be routed through `.agent/workflows/idea-incubator.md` (`/idea-incubator`) and logged into `docs/proposals/` as `DRAFT (In Ideation / Incubation — PENDING DECISION)`.
- **Promotion Gate**: An incubation proposal can only be promoted to active operational specifications, decisions (`DEC-###`), and execution tasks (`TSK-###`) after formal host review, budget clearance, and council certification (`AC-DEC-###`).

### 7. Mandatory Ticket Registration & Phased Planning Invariant (`STD-PHASED-DEV-001` / `P-TICKET-FIRST-PHASING-001` / `AC-DEC-2026-042`)
- **Pre-Implementation Ticket Gate**: No multi-directional, multi-phase (≥2 phases), or cross-surface development work may proceed to implementation planning or code mutation without a formally registered enhancement ticket (`SK-###`, `TASK-###`, or `PIO-###`) in `enhancement-notes/` and `ENHANCEMENT-MASTER-REGISTRY.md`.
- **Sequential Phased DoD Matrix**: All multi-phase implementation plans (`writing-plans`, `/plan`) MUST decompose work into strictly sequential, independently verifiable phases. Each phase must define an objective Definition of Done (DoD), binary Validation Gates (VG), and Decision Nodes (DN).
- **Prohibition of Monolithic Execution Chaining**: Agents MUST NOT chain multi-phase development into continuous uncommitted execution loops. Each phase must be committed, verified, and checked off sequentially.

### 8. Universal Canonical Planning Engine Invariant (`STD-PLANNING-ENGINE-001` / `P-UNIVERSAL-PLANNING-ENGINE-001` / `AC-DEC-2026-044`)
- **Single Canonical Engine**: All planning workflows (`/plan`, implementation plans, task plans) route exclusively to `.agent/skills/writing-plans/SKILL.md`. Legacy unanchored planners (`planning-with-files`, `implementation-plan-template`) are deprecated.
- **SAP Dual-Block Isolation**: The planning engine is partitioned into `<!-- shared:std.agent.planning-engine.core -->` (synchronized losslessly across repos via `/sap-sync`) and `<!-- repo-specific:sree-krushna -->` (local taxonomy, SDCA compilers, and verification commands).
- **Mandatory Plan Hard-Stop**: The planning phase concludes with the plan saved to disk. Detailed 5-step TDD tasks are scoped to Phase 1 first. Chaining planning directly into uncommitted code execution is strictly prohibited.

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
| Idea incubation & concept proposals | `.agent/workflows/idea-incubator.md` & `.agent/skills/idea-incubator/SKILL.md` |
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
| Task dependency graph edits (depends_on/unlocks rewiring) | `.agent/workflows/task-graph-reconciliation.md` |
| Site Architecture & Navigation | `.claude/skills/site-architecture/SKILL.md` |
| Governance verification | `npm run verify:governance-wiring:all` |

---

## 4. Pattern Activation & PACT-001 Cross-References
This repository implements the following universal patterns:
- `.agent/patterns/anti-masking-fallback-layers.md`
- `.agent/patterns/call-graph-and-rules-ast-verification-gate.md`
- `.agent/patterns/centralized-mutation-delegation.md`
- `.agent/patterns/consumer-path-integration-verification.md`
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
- `.agent/patterns/search-before-inventing.md`
- `.agent/patterns/service-import-without-write-wiring.md`
- `.agent/patterns/skill-source-verification-gate.md`
- `.agent/patterns/ssot-preservation-template-guard.md`
- `.agent/patterns/subcollection-write-cache-atomicity.md`
- `.agent/patterns/theme-button-opt-out-contract.md`
- `.agent/patterns/three-way-schema-alignment.md`
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
- `.agent/patterns/sdca-pre-emit-syntax-gate.md`
- `.agent/patterns/declarative-option-clustering-and-consensus.md`
- `.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md`
- `.agent/patterns/canonical-stakeholder-deep-link-station.md`
- `.agent/patterns/dynamic-module-timing-race-and-auth-reconnect.md`
- `.agent/patterns/sdca-container-query-scoping.md`
- `.agent/patterns/collab-visual-intake-and-deep-link-sharing.md`
- `.agent/patterns/containing-block-viewport-escape-gate.md`
- `.agent/patterns/two-tier-workspace-subview-decoupling.md`
- `.agent/patterns/phased-development-ticket-first-gate.md`
- `.agent/patterns/candidate-looks-ergonomics-and-intake.md`
- `.agent/patterns/contextual-multi-option-comments-engine.md`
- `.agent/patterns/button-primitive-and-preflight-gate.md`
