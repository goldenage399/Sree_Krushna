---
description: Multi-disciplinary, evidence-based council review for significant architectural, system design, Firebase/Firestore schema, and service boundary decisions in Task-Dashboard — before implementation begins.
---

# SOP-WFL-ARCH-COUNCIL-001: Architecture Council Review Workflow

This workflow governs how Antigravity evaluates significant structural decisions in the Task-Dashboard system. It applies to:

- New service modules added to `src/services/` (88+ existing services — check for duplication first)
- Firestore schema changes to any live collection (`tasks`, `users`, `profiles`, `projects`, `assignments`, `activityLogs`, `auditLogs`, `escalations`, `notifications`, `featureFlags`, `vendors`)
- Changes to the role/permission model (5-level hierarchy: `super_admin`=1, `admin`=2, `manager/project_head`=3, `site_supervisor/coordinator`=4, `associate`=5)
- Changes to how task lifecycle, profile assignment, and escalation chains relate to one another
- Modifications to `firestore.rules` — particularly to the `projectLevels` denormalized map, the claims-first hybrid permission pattern (`getProjectLevel()`), or any helper function that breaks the circular-dependency guard (`hasLevelViaClaims()`)
- New React contexts added to `src/contexts/` (`AuthContext`, `ProfileContext`, `ProjectContext`, `TaskCreationContext`, `ThemeContext`, `UsersContext` are the established 6)
- Changes to the `ServiceRegistry` pattern or `ServiceInitializer.js` bootstrap sequence
- Any change that crosses the 3 service category boundaries: **Core** (TaskManagement, ProfileUserMapping, AuditLog, FeatureFlag), **Assignment & Delegation** (12 services including CascadingVacancy, ActingAssignment, Delegation), or **Workflow** (BlockerWorkflow, EscalationTrigger, AlternativeSolution, DependencyResolution)

**This is not a single-agent checklist.** It is a multi-disciplinary council in which each relevant domain expert evaluates the proposal independently from its own area of expertise, before a consolidated recommendation is produced. The goal of Phase 1 is **not** consensus — it is to surface the strongest insights from every discipline and expose where they converge, diverge, and why.

> **Protocol conformance**: Council Deliberation Protocol **v1.0** — shared Phase 0/1/2 skeleton. Council files are deliberately self-contained (no base-file inheritance); drift between councils is caught by periodic conformance audit against this version stamp.

> **When to invoke — 3-question gate** (any YES → invoke; all NO → skip):
> 1. **Reversibility** — Is the change hard to reverse or does it propagate? Specifically: Firestore schema changes (documents already written can't be retroactively updated), security rule rewrites (affect live production data access immediately on deploy), new service patterns added to ServiceRegistry (all consumers inherit the contract), shared hook contracts (`useTaskQuery`, `useFirestoreSubscription`, `usePermissions`, `useSmartFiltering`), or new React context providers (consumers get no tree-level isolation)?
> 2. **Boundary** — Does it cross an architecture tier? Examples that trigger YES: service logic added to a component, Firestore writes moved outside the service layer, `AuthContext` role logic duplicated in a page, a new hook that shadows a `src/services/` function's responsibility, a UI decision that requires a Firestore field that doesn't exist yet.
> 3. **Disagreement** — Would two reasonable engineers plausibly disagree? Known active disagreements in this codebase: `QueryOptimizationService.js` vs `QueryOptimizationService.enhanced.js` (two competing implementations), `ProfileUserMappingService.js` vs `.core.js` vs `.modular.js` vs `.advanced.js` (four variants of the same service), the `hasLevel()` (deprecated) vs `hasProjectLevel()` vs `hasGlobalLevel()` permission check split.
>
> **Expedited tier**: For borderline-qualifying changes, run an expedited session — the 3 most relevant default members, one paragraph each (Position · Evidence · Challenge), compressed synthesis. Binding, but marked `EXPEDITED` in the ledger.
>
> **Skip log**: If the gate was consulted and answered all-NO on a borderline call, log one `SKIP` line in `User_Created/Discussion Threads/Council/Council_Ledger.md` with a one-line justification.
>
> **Cross-council ordering**: Structure before presentation (**Architecture → UI**). If the proposal substantively touches the UI council's domain, this council rules first and hands down a one-paragraph **referral note** as a locked constraint — no joint sessions.

---

## 🏛️ The Architecture Council Members

| Council Member | Sourced Workflow | Core Domain |
| :--- | :--- | :--- |
| **The SSOT Authority Auditor** | `ssot-reconciliation` | Doc/code/reality drift. Checks: does the proposed change align with the canonical documentation in `GEMINI.md`, `CLAUDE.md`, and `docs/ssot/`? Is the ADR for this decision already written (check `docs/adr/`)? Are any existing protocols (P01–P97) being violated or silently superseded? |
| **The Schema & Firestore Auditor** | `firebase-firestore` skill (MANDATORY) / `table-schema-documentation` | Firestore collection schema changes; index implications on `firestore.indexes.json`; security rule impact (especially the `projectLevels` denormalized map and the circular-dependency guard in `/users` rules); query cost (P33 O(1) I/O rule — no N+1 loops against Firestore). Reviews `AdvancedFirebaseOperationsService.js` and `QueryOptimizationService.js` impacts. |
| **The Service Layer Integrity Auditor** | `debug-backend` / `cos-invoke` | Service module correctness in `src/services/`. Specifically: does the new service overlap with an existing one (88+ services — duplication is the main failure mode here)? Is it registered via `ServiceRegistry.js`? Does every new Firestore write include `createdBy`, `createdAt`, `updatedBy`, `updatedAt` (P20 audit trail)? Are all writes going through `ActivityLogService` with `ACTIVITY_TYPES` constants (P-VAT — no raw strings)? Does `ServiceInitializer.js` need updating? |
| **The Dependency & Impact Auditor** | `change-impact-analysis` / `graph-assisted-pre-flight` | Cross-file cascade across `src/`. Known high-coupling surfaces: `App.jsx` (40KB — the routing monolith), `TaskDetailsModal.jsx` (103KB), `TaskUpdateModal.jsx` (75KB), `AdminRequestReview.jsx` (82KB), `TaskCreationContext.jsx` (53KB). Any change to shared hooks (`useTaskQuery`, `usePermissions`, `useSmartFiltering`) fans out to dozens of consumers. |
| **The File Placement Auditor** | `file-placement-guardrail` | Correct location per `src/` taxonomy: `components/` (UI only), `services/` (business logic + Firebase), `hooks/` (React state + subscription), `contexts/` (app-level shared state), `pages/` (route-level containers), `utils/` (pure functions), `tokens/` (CSS design tokens), `constants/` (domain enumerations). No service logic in components; no UI in services. **For any `pages/` file named as a "host page" or "locked host": evidence must cite the actual `<Route element={<X/>}>` JSX that renders it (`npm run check:page-reachability` at minimum) — a preference-string consumer or an import statement is not evidence of reachability.** (Origin: TASK-222 named `AssociateDashboard.jsx` "the locked host page" on the strength of it reading a display-mode preference; the file was never rendered anywhere in `App.jsx` and the feature shipped invisible until the product owner asked to see it.) |
| **The Decision & Standards Auditor** | `complex-architecture-blueprint` (Phase E: ADRs) / `register-standard` / `domain-modeling` skill | Is this change worth an ADR in `docs/adr/`? Is it a new pattern worth registering as an enforceable standard? Does it require updating the domain glossary (`CONTEXT.md`) with new canonical terms? Known recorded decisions: ADR-001 (profile-first assignment model), ADR-002 (Firestore for task state). Does this decision supersede or contradict either? |
| **The Auth & Permission Auditor** | `firebase-firestore` skill / `protocol-enforcer-pre-code` | Is the proposed change consistent with the 5-level role hierarchy (levels 1–5)? Does it use the correct check function: `hasProjectLevel()` for project-scoped ops, `hasGlobalLevel()` for system-wide, `hasLevelViaClaims()` inside `/users` rules only (to break the circular dependency)? Does it avoid the deprecated `hasLevel()` function? Are custom claims (`projectLevels`, `isOwner`) properly refreshed via `forceTokenRefresh()` when level changes? |
| **The Maintainability & Velocity Auditor** | `ponytail` / P11 (600-line file growth limit) | Complexity cost and reversibility. Known maintenance debt targets: `QueryOptimizationService.js` vs `.enhanced.js` (consolidation needed), `ProfileUserMappingService.js` / `.core.js` / `.modular.js` / `.advanced.js` (four variants — new service must not become a fifth). Flags changes that are technically correct but create long-term maintenance debt. **Also owns the Reality-First Grounding Policy (RFG-001, below)**: enforces the maturity anchor, the recommendation classification, and the Burden-of-Proof rule during Phase 1 and vetoes any Phase 2 synthesis that recommends a Speculative/Future-Extension item as Required-Now. |

Add or substitute members when the proposal touches a domain none of the above covers. The table is a default roster, not a ceiling — **but the default roster is mandatory**: omitting a default member requires a logged justification in the session artifact, and every added member is logged with the reason it was seated.

---

## 🔧 Phase Execution Skills (Superpowers Integration)

These skills govern **how** each council phase is executed. They are not Phase 1 evaluators (domain experts) — they are the execution machinery for their named phases. Activate the relevant skill when entering that phase.

| Council Phase | Skill | Role in This Council |
| :--- | :--- | :--- |
| **Phase 0: Evidence Collection** | `systematic-debugging` | Traces cascade paths across the service layer and Firestore schema before the council opens. Prevents reasoning from memory about what `CascadingVacancyService.js`, the `projectLevels` map, or `ServiceInitializer.js` actually does. |
| **Phase 1: Independent Evaluation** | `brainstorming` | Structures the **dissenter seat** — the council mandates one member argue against the majority direction; this skill forces genuine challenge generation rather than consensus reinforcement. |
| **Phase 1: Independent Evaluation** | `dispatching-parallel-agents` | Runs the 6–7 member evaluations truly independently and concurrently. Each member's evaluation is an independent problem domain; parallel dispatch is the literal mechanic for honoring the "do not resolve conflicts yet" rule. |
| **Phase 2: Synthesis** | `writing-plans` | Structures the synthesis output — sequenced by risk, with rejected alternatives documented. The Phase 2 output artifact IS the plan that Phase 3 executes. |
| **Phase 3: Implementation** | `executing-plans` | Executes the council-approved synthesis as a tracked plan with verification checkpoints. Mandatory `finishing-a-development-branch` sub-skill closes the loop. |
| **Phase 3: Implementation** | `subagent-driven-development` | Dispatches council-approved changes that span multiple independent files as isolated subagents with per-task review loops. Prevents context pollution across `ServiceRegistry`, Firestore rules, and hook changes in a single session. |
| **Phase 3: Implementation** | `using-git-worktrees` | **Mandatory for 🔴 high-risk surfaces** (`firestore.rules`, `AuthContext.jsx`, `App.jsx`, `TaskCreationContext.jsx`). Isolates the change from main during Phase 3 execution — if the change is hard to reverse, it must be reversible mid-implementation. |
| **Phase 3: Implementation** | `test-driven-development` | All new services or modules introduced by a council ruling are written test-first. "Technically correct but untested" is not a valid Phase 3 completion state. |
| **Phase 3: Implementation** | `requesting-code-review` | Whole-branch code review before the council ledger entry is written. Separate from the council's own Phase 1 — this reviews the *implementation*, not the *proposal*. |
| **Phase 3: Implementation** | `finishing-a-development-branch` | Branch integration gate (tests verified, merge/PR decision made) before the council artifact is committed to `User_Created/Discussion Threads/Council/`. |
| **Phases 3 & 4: Verification** | `verification-before-completion` | Prevents marking council-approved changes done without hard evidence. Enforces the rule: do not proceed to commit if any unanimous or high-confidence concern from Phase 2 was left unaddressed. |
| **Phase 3 output challenged** | `receiving-code-review` | When the user challenges the synthesis or the implementation result — prevents performative agreement and enforces actual technical re-evaluation with reasoning. |

> **Not applicable to councils:** `writing-skills` (skill authoring), `using-superpowers` (skill discovery bootstrap). These have no council role.

---

## 🔴 Known High-Risk Surfaces (Auto-escalate to FULL council, skip expedited)

These areas have documented past incidents and active technical debt. Any change touching them skips the expedited tier and requires a full council session:

| Surface | Why High-Risk | Evidence |
| :--- | :--- | :--- |
| `firestore.rules` — `/users` collection rule | Circular dependency: `isOwner()` → `getUserData()` → `get(/users/{uid})` → evaluate `/users rule` → `isOwner()`. Uses `hasLevelViaClaims()` specifically to break this loop. Breaking it silently makes all user reads fail. | `firestore.rules` L82–89 comment |
| `AuthContext.jsx` — level normalization | `level` fields from Firestore arrive as strings. `toLevel()` coerces to number. Bypassing this causes strict-equality mismatches (P94 — INC-038). | `AuthContext.jsx` L50–59 |
| `App.jsx` — routing monolith (40KB) | Single file owns all route-level wiring. Every new page added here; touches are high-impact cascades. | P11 file growth threshold approaching |
| `TaskCreationContext.jsx` (53KB) | Owns the full task-creation state machine. Tight coupling to `TaskCreationModal.jsx`, `TaskDraftService`, `TaskValidationService`, `AssignmentService`. | P11 threshold exceeded |
| `CascadingVacancyService.js` (39KB) | Manages cascading reassignment on profile vacancy. State changes propagate across multiple collections. Any schema change to `assignments` or `profiles` must be validated here. | Service README — Assignment & Delegation category |
| Firestore query memoization | Non-memoized queries inside Firestore hooks cause infinite re-render loops. Pattern: `useMemo(() => query(...), [])` is mandatory. | `src/services/README.md` L75–89 / QUERY-MEMOIZATION-PROTOCOL.md |
| `projectLevels` denormalized map | Used by security rules for O(1) permission checks. Any change to how `projectLevels` is written to Firestore user documents immediately affects all live permission decisions. | `firestore.rules` L40–58 |

---

## 🌍 Reality-First Grounding Policy (RFG-001)

> **Origin**: 2026-07-09 RAM governance session + its external gap-analysis review (thread `260701_ActivityShell Refinement.md`, Queries 10.28–10.30). The council approved a sound decision but (a) invented field names duplicating ADR-014's existing ownership axis, (b) cited an ADR number already taken, and (c) had no intake filter when an external review proposed an enterprise-scale model (capability layers, workload engines, generalized state machines) justified only by hypothetical future modules. This policy makes those failure modes structural checks instead of luck.
>
> **Skeleton note**: additive to Council Deliberation Protocol v1.0 — Phase 0/1/2 structure is unchanged; this policy adds inputs and output constraints only.

**Optimization target**: the best architecture *for this repository, at this stage, with this evidence* — not the best possible architecture. Do not optimize for an imagined enterprise.

### 1. Maturity Anchor (Phase 0 input, mandatory)

Every session artifact opens with a one-line **Grounding Snapshot**: current stage (Prototype / Pre-MVP / MVP / **Pre-launch** / Production / Scale-up), module count, active real-user count, team size. Every Phase 1 position and Phase 2 recommendation is evaluated against *that* stage. As of 2026-08-08 this repo is: **launch-imminent — 4–5 real users today (all Google/Gmail accounts), ~30 expected as onboarding proceeds; 1 module (Tasks), 1 developer** — update the line when reality changes, not the policy. (Anchor history: "pre-launch, 2 users" early 2026-07-09; "onboarding begins end of July 2026, 2 real users" as of 2026-07-09; user-confirmed 4–5 on 2026-08-08.)

<!-- shared:std.governance.rfg-001-classification:start -->
### 2. Recommendation Classification (Phase 2 output constraint, mandatory)

Unchanged from the original protocol — every item in the Recommended Course of Action carries exactly one tag (Required Now / Recommended Soon / Future Extension / Speculative), tie-broken by: **"Would I still recommend this if the repository never grows beyond its current size?"**

### 3. Burden of Proof for new artifacts (Phase 1, enforced by Maintainability & Velocity Auditor)

Before recommending any new SSOT, decision-log entry, workflow, checker, hook, or schema field, the proposing member must show: (1) the problem exists today, cited; (2) existing architecture can't evolve to solve it; (3) net complexity goes down, not up, at this repo's actual maturity stage; (4) deferring it creates measurable debt.

### 4. External Review Intake

Owned by the SSOT Authority Auditor: decompose, classify, verify the reviewer's premises against actual repo documentation and facts before adopting anything.
<!-- shared:std.governance.rfg-001-classification:end -->

### Task-Dashboard-specific elaboration of RFG-001

The shared block above stays generic on purpose (it's synced verbatim to every SAP-linked repo). This is the concrete Task-Dashboard version — restored 2026-08-15 after a cross-repo promotion pass overwrote it with the generic wording; kept local instead of re-merging into the shared block so it can't be clobbered by a future sync from another repo.

**Recommendation Classification, full test table:**

| Tag | Meaning | Test |
| :--- | :--- | :--- |
| **Required Now** | A verified current problem breaks without it | Evidence from the repo, not from a projected future |
| **Recommended Soon** | Current problem, tolerable short-term | Named trigger for when "soon" arrives |
| **Future Extension** | Only benefits hypothetical modules/scale | Recorded as a deferral with re-open trigger — never implemented from this session |
| **Speculative** | No demonstrated need path | Recorded and dropped |

**Derived-Layer-First re-open condition** (added 2026-07-29, TASK-222 precedent): when a Future Extension item is deferred *in favor of* a lighter derived/interim capability that ships in its place (e.g., a board deferred in favor of a derived grouped view over the same data), its named trigger MUST include a usage-evidence condition from that interim capability once shipped — not only a headcount/scale threshold. A scale threshold alone ("onboarding cohort arrives") can fire without ever checking whether the interim capability actually satisfied the need it was built to test. Example: [260728_arch_council_kanban_execution_workflow.md](../../User_Created/Discussion%20Threads/Council/260728_arch_council_kanban_execution_workflow.md) deferred the interactive Kanban board (WS-3/WS-4) in favor of `useTodayAgenda` + a derived status-grouped view (WS-1); its trigger already included "a current associate reports daily-execution friction" alongside the scale threshold — that friction-report clause is the usage-evidence condition this rule requires, and is the template for future Future Extension write-ups of this shape.

**Burden of Proof, full form:** before the council may recommend any new **SSOT, ADR, framework, layer, service, registry, protocol, capability, or schema field**, the proposing member must show, with repo evidence: (1) the problem exists **today** (cite the file/incident/thread); (2) existing architecture cannot evolve to solve it (name what was checked and why it fails); (3) the proposal reduces net complexity, and its maintenance cost is justified at the current maturity stage; (4) deferring it creates *measurable* debt (name what becomes expensive/impossible later — cf. ADR-014's "Pre-Launch Historical Preservation" section, the canonical example of this test done right). Any of the four unprovable → the item is tagged Future Extension/Speculative, not adopted. Prefer evolving an existing capability over creating a new one, always.

**External Review Intake, full procedure:** external reviews (AI gap analyses, consultant feedback, pasted critiques) are **proposals, not verdicts** — including well-argued ones. (1) Decompose the review into individual claims/proposals. (2) Run each through the Recommendation Classification above — external origin grants no exemption from Burden of Proof. (3) **Verify the reviewer's premises against the repo before adopting anything**: external reviewers do not know the ledger, existing ADRs, or naming precedents. The RAM case is canonical — the reviewer's Gap 6 (decision precedence) was real and adopted; Gaps 1–3 (capability hierarchy) were enterprise speculation and deferred; and neither the reviewer nor the council noticed the ADR-014 name collision until a repo cross-check found it. (4) Record adopted vs deferred **with rationale** in the session artifact or an amendment to the original council record. An external review that survives intake may trigger a council **amendment** (appended to the original record, ledger line updated) rather than a full re-run, when it corrects rather than reverses the decision.

---

## 🗺️ Mandate Coverage Map

<!-- shared:std.governance.mandate-coverage-map-discipline:start -->
Every council review mandate item must map to a seated auditor or explicit gate. The table below enforces coverage integrity across all architectural and structural dimensions.
<!-- shared:std.governance.mandate-coverage-map-discipline:end -->

| # | Mandate item | Stated in | Owner |
| :-- | :-- | :-- | :-- |
| 1 | `src/services/` additions & modifications | Applies-to §1 | Service Layer Integrity Auditor |
| 2 | Firestore collection schema changes | Applies-to §2 | Schema & Firestore Auditor |
| 3 | Role/permission model & claims changes | Applies-to §3 | Auth & Permission Auditor |
| 4 | Task lifecycle & profile assignments | Applies-to §4 | SSOT Authority Auditor |
| 5 | `firestore.rules` modifications | Applies-to §5 | Schema & Firestore Auditor |
| 6 | React contexts & global state | Applies-to §6 | File Placement Auditor |
| 7 | ServiceRegistry & bootstrap sequence | Applies-to §7 | Service Layer Integrity Auditor |
| 8 | Service category boundaries | Applies-to §8 | Service Layer Integrity Auditor |
| 9 | High-Risk Surfaces | High-Risk Surfaces | Dependency & Impact Auditor |
| 10 | Maturity Anchor | RFG-001 §1 | Phase 0 item (grounding snapshot) |
| 11 | Recommendation Classification | RFG-001 §2 | Maintainability & Velocity Auditor |
| 12 | Burden of Proof | RFG-001 §3 | Maintainability & Velocity Auditor |
| 13 | Explicit N/A ledger | ICG-001 #2 | `check-council-artifact.ps1` |
| 14 | Self-critique close + verbatim-Challenge quote | ICG-001 #3 | `check-council-artifact.ps1` |
| 15 | No-plan-only first response | ICG-001 #1 | **Unowned mechanically** |

---

<!-- shared:std.governance.council-deliberation-protocol:start -->
## 🚀 Workflow Phases

The Phase 0–4 skeleton is the domain-agnostic procedure followed across all architecture and UI council reviews.

### Phase 0: Evidence Collection (Mandatory Before Council Opens)

1. **Ledger check** — consult `User_Created/Discussion Threads/Council/Council_Ledger.md` for any prior ruling on the same surface. A stale ruling (code changed since its snapshot hash) must be re-validated, not silently contradicted.
2. **Duplication check** — search existing modules/services/functions to verify no duplicate capability already exists before proposing a new one.
3. **Read the ground truth** — `view_file` the actual source code, schemas, rules, and configuration the proposal touches. Never reason from memory.
4. **Evidence snapshot** — record the current commit hash and the list of files this session's evidence relies on.
5. **Referral check** — name any other council domain the proposal substantively touches; apply cross-council ordering.
6. **Concept collision check (RFG-001)** — before minting a new field name or artifact, grep decisions and registries for the concept, not just the name.
7. **Grounding Snapshot (RFG-001)** — record the maturity anchor line in the artifact header.
8. **External mechanism & pattern search (search-before-inventing)** — consult [.agent/patterns/search-before-inventing.md](../patterns/search-before-inventing.md) before concluding an existing cross-repo mechanism or pattern does not exist.
9. **Call-Graph & Rules-AST Verification Gate** — consult [.agent/patterns/call-graph-and-rules-ast-verification-gate.md](../patterns/call-graph-and-rules-ast-verification-gate.md). Never declare a service or aggregation layer 'reusable' without static grep confirmation of production callers in `src/pages/` and `src/components/`. Never verify a Firestore security rule by leaf keyword without walking the full parent match hierarchy to confirm resource path permission and write authorization. When fixing a query or filter defect, always sweep sibling methods in the same service class for identical filtering logic.

### Phase 1: Independent Evaluation

Each participating member evaluates the proposal **independently**, through the lens of its own domain. For each member, produce:

* **Position** — what this domain expert recommends or objects to.
* **Evidence** — grounded in the actual codebase, `00_Master/`, or established project protocols (cite the file/section). Unsupported opinions are not admissible.
* **Assumptions** — what must be true for the position to hold.
* **Trade-offs** — what is gained and given up.
* **Risks & Dependencies** — what could go wrong, and what this position depends on.
* **Challenge** — actively probe the proposal (and, where relevant, other members' likely positions) rather than reinforcing the initial idea. A valid challenge must include a **concrete failure scenario** and a **"what would change my mind"** condition.
* **Confidence** — High / Medium / Low, assigned by the member itself, not deferred to synthesis.

One member per session is the **assigned dissenter**: its Position must argue against the emerging majority direction, whatever that is. Rotate the seat across sessions and name it in the artifact.

Do not resolve conflicts yet. Do not silently drop a member's concern because another member's take is more convenient.

### Phase 2: Synthesis

**Synthesizer charter**: the synthesis must quote each member's Challenge **verbatim** before resolving it (now mechanically checked — see ICG-001 above), and may not introduce any argument no member raised in Phase 1. If the winning rationale does not exist in Phase 1, the session is malformed — return to Phase 1, do not patch it in synthesis.

Produce a consolidated synthesis containing:

1. **Areas of unanimous agreement.**
2. **Areas of disagreement**, with the reasoning and evidence behind each position.
3. **Trade-off analysis** across the disagreements.
4. **Recommended course of action.**
5. **Alternative approaches considered and rejected**, and why.
6. **Confidence level** (High / Medium / Low) for each recommendation, with the reason for that confidence.

If a disagreement cannot be resolved with available evidence, say so explicitly and present it to the user as an open question rather than picking a side by default.

### Phase 3: Implementation & Verification Gate

Only after the synthesis is accepted:

* Execute the change surgically, per the recommended course of action.
* Run local self-tests, pre-flights, and syntax verifications if the change touched tooling or scripts.
* Confirm that verified test passes, command output, or execution proof are captured before completion.
* Do not proceed to commit if any unanimous or high-confidence concern from Phase 2 was left unaddressed.
<!-- shared:std.governance.council-deliberation-protocol:end -->

### Task-Dashboard-specific elaboration of Phase 0 and Phase 3

The shared skeleton above stays generic on purpose (it's synced verbatim to every SAP-linked repo). This is how Task-Dashboard instantiates it concretely — restored 2026-08-15 after a cross-repo promotion pass overwrote it with the generic wording; kept local instead of re-merging into the shared block so it can't be clobbered by a future sync from another repo.

**Phase 0 additions:**
- **Codebase Truth & Zero-Duplication Check (MANDATORY)** — before proposing ANY new script, protocol ID, npm command, or governance layer, you MUST search `scripts/`, `package.json`, `.agent/PREFLIGHT.md`, and `.agent/standards-catalog.json` to verify whether an existing script, matrix, or protocol already handles or partially handles the requirement. Proposing a new parallel system when an existing mechanism can be extended is a critical governance failure.
- **Duplication check (Service Layer)** — before any new service, run `grep -r "ServiceName" src/services/` and read `src/services/README.md` Service Categories. The 88+ existing services cover most domain needs; adding an 89th that duplicates an existing one is the primary failure mode.
- **Activate `firebase-firestore` skill** — if the proposal touches any Firestore collection, activate the skill unconditionally before forming any opinion on schema or rule impact.
- **Live Data & Diagnostic Tooling Gate (MANDATORY)** — if the proposal concerns missing data, missing fields, display fallbacks, or security rule errors, you MUST run a live database inspection (`db-inspect.md` or execute existing inspection/repair scripts in `scripts/`) to verify whether the targeted data actually exists in Firestore and whether a repair script already exists before opening the council. Proposing fallback layers without live DB inspection is an Anti-Masking Protocol failure (`anti-masking-fallback-layers.md`).

**Phase 3 additions:**
- If the ruling names an actor by **condition** (e.g. "Current Handler," "Owner") rather than a role literal, see `.agent/patterns/evidence-scoped-cta-gating.md` before wiring any UI trigger — verify every lawful actor under the rule has a reachable path, not just the persona named in the motivating evidence/incident.
- If the ruling requires proving a Firestore security rule actually denies unauthorized access (not just code review), see `.agent/patterns/rules-enforcement-testing-no-emulator.md` — the Admin SDK bypasses rules and cannot verify enforcement; use client-SDK custom-token impersonation instead, with explicit user approval.
- Run `npm run preflight` and confirm no violations (R1–R22 PREFLIGHT table).
- Run `npm run dev` and confirm the feature/change functions as expected in the browser.
- Confirm Firestore security rules deploy cleanly if `firestore.rules` was touched (`firebase deploy --only firestore:rules`).
- Confirm no audit trail fields (`createdBy`, `createdAt`, `updatedBy`, `updatedAt`) were dropped from new write operations (P20).
- Confirm all new `ActivityLogService` calls use `ACTIVITY_TYPES` constants, not raw strings (P-VAT).
- Confirm any new Firestore queries inside hooks use `useMemo()` to prevent infinite loops.
- **Verification claims require real, re-run output (MANDATORY)** — any statement that something is "fixed," "verified," "now works," or "confirmed" must be backed by the literal output of a command executed *this session*, quoted verbatim. A formatted-looking result block that was not actually produced by running the command is a Completion Gate failure equal to skipping verification entirely. Origin: 260730, a session's own "Verification Result" block for a P82 wiring fix showed a checklist line that does not exist anywhere in `verify-governance-wiring.cjs`'s actual output — caught only when the next session re-ran the command and diffed the real output against the claim.

---

<!-- shared:std.governance.icg-001:start -->
## 🎯 Invocation Completeness Gate (ICG-001)

> **Origin**: 2026-08-14 user feedback (`Discussion/DiscussionThreads/WorkflowImprovements/260814_WorkflowUpgrades.md`, Query 1.1) — a council invocation returned a plan summary with no Phase 1 positions and no output artifact; the full evaluation only surfaced after two follow-up prompts. Structural, not behavioral: closes the gap without relying on the user to keep asking.

**What this gate mechanically checks, and what it can't**: items 1–3 are a behavioral contract on the agent running the council — nothing in this repo intercepts a chat response before it's sent. What CAN be mechanically checked is the output artifact file. `check-council-artifact.ps1` (repo root) derives the roster, the Phase 1 field list, and the Phase 2 item list from *this file's own* tables/sections — a seated member (its own heading) must carry all 7 Phase 1 fields, and each seated member's Challenge must be quoted verbatim (≥1 sentence, ≥6 words) somewhere in the Phase 2 synthesis (added Query 2.3, after the checker caught this exact violation in this repo's own real adversarial-replay artifact). It cannot block a chat response, only the committed file — see the script's own header for the complete, current scope boundary.

1. **No plan-only first response.** The first response after invocation is the full Phase 0→2 artifact (or an `EXPEDITED` equivalent), not a summary with a "want the details?" offer.
2. **Explicit N/A ledger.** Every default roster member or phase not exercised gets a named reason in the artifact. Silence is not valid.
3. **Self-critique close.** Phase 2 ends with a **Process Notes** subsection covering this council's own SOP, roster, invocation protocol, gates, and workflow — each entry names the gap (`Gap:`) **and** a concrete proposed fix (`Proposed fix:`); states whether applied in-session or deferred pending approval, and why.
<!-- shared:std.governance.icg-001:end -->

See `Council_Ledger.md` PROCESS-CORRECTION rows, 2026-07-28 and 2026-07-30, for the incidents this gate closes.

---

## 📜 Output Artifact (Mandatory)

A council session is not valid until its record exists:

* **File**: `User_Created/Discussion Threads/Council/[YYMMDD]_arch_council_[subject].md` — containing the roster (with omission/addition justifications and the named dissenter), all Phase 1 positions, the synthesis, and the **evidence snapshot** (commit hash + list of files relied on).
* **Architecture Decision Handoff**: When invoked via `/role-activation` or as an auto-triggered gate, emit the structured `.agent/session/mode1-output.json` (`architecture-decision`) artifact containing `architectural_findings`, `blast_radius_scope`, `contract_write_sites_inspected`, `external_benchmarks_referenced`, and `precedence_ladder` to directly satisfy the `delivery-planner` gate.
* **Ledger line**: append one row to `User_Created/Discussion Threads/Council/Council_Ledger.md`: date, council, type (`FULL`/`EXPEDITED`/`SKIP`), subject, one-line verdict, artifact link, snapshot hash.
* **Staleness rule**: a future session citing this ruling runs `git log <snapshot-hash>.. -- <evidence files>`; any commits returned mean the ruling is stale and must be re-validated before being relied on. No expiry dates — the diff is the decay model.

---

## Relationship to Other Workflows

This council does not replace `complex-architecture-blueprint`, `ssot-reconciliation`, or the other sourced workflows — it orchestrates them as domain lenses within a single evidence-based review. For a change scoped to exactly one domain (e.g., only a service bug, only a file-placement question), invoke that workflow directly instead of the full council.

For performative council and unfired telemetry prevention, see `.agent/patterns/performative-council-and-telemetry-gate.md`.
For verifiable implementation before ADR promotion, see `.agent/patterns/verifiable-implementation-before-adr-promotion.md`.
For exhaustive multi-repo discovery before proposing mechanisms, see `.agent/patterns/search-before-inventing.md`.

