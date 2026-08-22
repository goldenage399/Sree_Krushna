---
description: Multi-disciplinary, evidence-based UI council review for dashboard, portal, and interface presentation decisions — visual hierarchy, motion, density, scannability, and design system integrity. Run before implementing any significant UI component redesign.
---

# SOP-WFL-UI-COUNCIL-001: UI Council Review Workflow

This workflow governs how Antigravity evaluates significant **presentation-layer** decisions in the Task-Dashboard. It applies to:

- Redesigning shared admin primitives exported from `src/components/admin/AdminShell.jsx` (`AdminSectionHeader`, `AdminStatTile`, `AdminToolbar`, `AdminTableShell`, `PillTabGroup`, `SearchInput`) — these are consumed by every admin page; prop contract changes cascade everywhere
- Structural surgery on `TaskCard.jsx` (33KB), `TaskDetailsModal.jsx` (103KB), `TaskUpdateModal.jsx` (75KB), `ActivityShell.jsx` (38KB), `TeamOversightPage.jsx` (78KB), `AdminRequestReview.jsx` (82KB) — all above the P11 600-line threshold
- Changes to the theme system (`src/contexts/ThemeContext.jsx`, `src/styles/theme-tokens.css`, `src/tokens/semantic.css`, `src/tokens/primitives.css`) or any decision that requires theme-conditional rendering. **Do not hardcode a theme count or list here — derive it**: `grep -oE '\[data-theme="[a-z-]+"\]' src/styles/theme-tokens.css | sort -u`. (This section previously said "5-theme" and omitted `dark` and `velvet-dark` from every enumerated list — a drifted fact that would have made a council following this SOP literally skip the two themes where INC-063 actually lived.)
- Introducing new component variants for role-differentiated views (Admin vs Supervisor vs Associate): layouts that must differ by `user.level` (1–2 = admin, 3–4 = supervisor, 5 = associate)
- Adding or removing status badge types, escalation signal visuals, assignment state pills, or priority indicators that appear across multiple components
- Layout decisions for `ProjectLayoutWrapper.jsx` — the shell that wraps all authenticated pages; changes here propagate to every route
- Mobile-specific layout decisions (`MobileBottomNavigation.jsx`, `MobileTaskCard.jsx`, `MobileNavigation.jsx`, `MobileOptimizedInput.jsx`) or any responsive breakpoint change in `docs/ssot/ui-design/spokes/RESPONSIVE-DESIGN.md`
- Design token additions or removals in `src/tokens/` or `docs/ssot/ui-design/spokes/DESIGN-TOKENS.md` — these are the CSS custom properties the entire app depends on (`--dt-*`, `--theme-*`, `--z-*`)

It is the UIUX counterpart to [architecture-council.md](architecture-council.md), which governs *how the platform is built*; this council governs *how approved content is visually presented* (Workflow 2 per IUS-001 — the IA content is already locked before this council runs).

**This is not a single-agent checklist.** Each relevant design discipline evaluates the proposal independently, grounded in the actual component code, established CSS design tokens (`docs/ssot/ui-design/`), and project invariants — never generic design-trend opinion. Phase 1's goal is **not** consensus; it is to surface the strongest insight from every discipline and expose where they converge, diverge, and why.

> **Protocol conformance**: Council Deliberation Protocol **v1.0** — shared Phase 0/1/2 skeleton across all councils. Council files are deliberately self-contained (no base-file inheritance); drift between councils is caught by periodic conformance audit against this version stamp.

> **When to invoke — 3-question gate** (any YES → invoke; all NO → skip):
> 1. **Reversibility** — Is the redesign structural rather than a routine tweak? YES examples: changing the flex/grid layout of `AdminToolbar`, swapping `AdminStatTile`'s `clickable` prop contract, restructuring `TaskCard.jsx`'s status badge region, adding a new `--theme-*` semantic token (every theme variant must be defined). NO examples: adjusting padding inside a single card, fixing a color typo, tightening a font-weight on a single label.
> 2. **Boundary** — Does it cross a domain? YES examples: a layout change that requires a Firestore field that IA hasn't approved (→ escalate to IA first), a component redesign that changes which `user.level` roles see it (→ involves AuthContext logic, pull in Architecture Council), a theme change that reintroduces an opt-out global override (superseded `FKL-DI-003` pattern) on `AdminShell` or any button. NO examples: adjusting an existing theme token value within its semantic meaning, adding a `data-testid` attribute.
> 3. **Disagreement** — Do competing directions exist? YES examples: "use a table vs. use cards for the task list", "show escalation badges on every row vs. only on escalated tasks", "inline vs. modal editing for task details", "sidebar vs. top-nav for mobile". These are recurring design disagreements in this codebase that benefit from deliberate multi-perspective evaluation.
>
> **Expedited tier**: For borderline-qualifying changes, run an expedited session — the 3 most relevant default members, one paragraph each (Position · Evidence · Challenge), compressed synthesis. Binding, but marked `EXPEDITED` in the ledger.
>
> **Skip log**: If the gate was consulted and answered all-NO on a borderline call, log one `SKIP` line in `User_Created/Discussion Threads/Council/Council_Ledger.md` with a one-line justification.
>
> **Cross-council ordering**: Architecture before UI (**Architecture → UI**). This council always rules last; upstream constraints arrive as one-paragraph **referral notes** and are locked — no joint sessions.

> **Domain gate (IUS-001)**: This council operates exclusively in **UIUX territory (How?)**. If a proposed change requires redefining *what* content is displayed (which Firestore collection to read, which fields to surface, which user roles see a section), stop and escalate to IA (Workflow 1 of [ia-uiux-separation.md](ia-uiux-separation.md)) first.

---

## 🏛️ Default Council Roster

The default roster covers the five visual disciplines that matter for this repository's admin/task-management context. **The roster is a starting point, not a ceiling** — add or substitute members when the component has unusual characteristics. **But the default roster is mandatory**: omitting a default member requires a logged justification in the session artifact, and every added member is logged with the reason it was seated.

| Council Member | Sourced Skill / Standard | Core Domain |
| :--- | :--- | :--- |
| **The Visual Hierarchy Auditor** | `ui-ux-pro-max` / `high-end-visual-design` | Typography weight scale, spatial hierarchy, color signal contrast, 3-second scan test. In this repo specifically: can a Supervisor scanning `TeamOversightPage.jsx` identify the most urgent escalated task in 3 seconds? Does `TaskCard.jsx` make task status (open/in-progress/blocked/complete) immediately distinguishable without reading the label? Does `MonitorTab.jsx` (28KB) separate signal from noise for an Admin? **Topbar/Header check**: maps layout utility regions, spacing consistency, identity area grouping, and enforces visual demotion for low-frequency actions (like Logout) to prevent asymmetric topbar visual density. |
| **The Craft & Visual Polish Auditor** | `impeccable` (`.claude/skills/impeccable/SKILL.md`) | **Core Member (Mandatory)**: Handcrafted visual excellence, cognitive load distillation, and anti-pattern eradication. Eliminates generic AI aesthetics (flat unstyled cards, low-contrast washed-out captions, repetitive border radii, uncalibrated saturation). Audits tactile micro-interactions, optical alignment, state craft (loading skeleton, empty states, error surfaces), responsive breathing room, and bespoke typography pairing. Validates live DOM ergonomics and ensures every visual element feels intentional, memorable, and human-crafted. |
| **The Theme System Auditor** | `ui-design-validator` / [THEME-SYSTEM.md](../../docs/ssot/ui-design/spokes/THEME-SYSTEM.md) | Theme correctness across all themes actually defined in `src/styles/theme-tokens.css` — **do not hardcode the count or list**; derive it (`grep -oE '\[data-theme="[a-z-]+"\]' src/styles/theme-tokens.css \| sort -u`). At time of writing: Light, Dark, Dim Dark, Sepia, Grayscale, Velvet Dark, Ambient (7). All implemented in `ThemeContext.jsx` with automatic time-based switching. **Also audits whether any standing theme rule is itself the root cause** (see Phase 0 item 7, Rule-Challenge Check) rather than only checking compliance with existing invariants — an opt-out contract can be the bug, not the fix (INC-063). No hardcoded hex — all colors must use `--theme-*` semantic tokens (`src/styles/theme-tokens.css`, `src/tokens/semantic.css`). Special attention to `--theme-accent`, `--theme-success-*`, `--theme-warning-*`, `--theme-error-*` — these carry task status and escalation semantics, and per TOKEN-TYPE-001 must resolve to a SOLID colour in every theme (a gradient here silently breaks `color:`/`border:`/`color-mix()` — see INC-057/INC-062). |
| **The Information Density Auditor** | `parent-layout-audit` / `web-design-guidelines` | Data-ink ratio, progressive disclosure, cognitive load. Key pages to validate: `TeamOversightPage.jsx` (78KB — the primary supervisor view), `AdminDashboard.jsx`, `WorkloadAnalyticsDashboard.jsx` (32KB), `AssignmentManagementDashboard.jsx` (33KB). Validate viewport utilization at target screen sizes: `>=1280px` desktop admin, `768px–1279px` tablet supervisor, `<768px` mobile field associate. Check `RESPONSIVE-DESIGN.md` for documented breakpoint contracts. **Composition audit**: Checks header layouts and toolbars for grouping hierarchy, elevation/container consistency, and data-ink optimization. |
| **The User Role Scannability Auditor** | `frontend-design` / `admin-component-contracts` skill | 3-second read target per role. **Admin** (Level 1–2): needs cross-project overview, system health, flagged items. `AdminDashboard.jsx`, `AuditLogsPage.jsx`, `SystemHealthPage.jsx`. **Supervisor** (Level 3–4): needs their profile cluster's task queue, overdue tasks, escalations requiring their action. `TeamOversightPage.jsx`, `MyTasksPage.jsx`, `EscalationDashboard.jsx`. **Associate** (Level 5): needs their assigned tasks, deadlines, blockers. `AssociateDashboard.jsx`, `PositionWorkspacePage.jsx`. Badge scarcity: escalation-state and overdue indicators must stand out — not every task card should carry the same visual weight. **Utility hierarchy**: Ensures utility action prominence aligns with actual usage frequency (e.g. session actions like logout are visually subordinate to workspace/navigation actions). |
| **The Design System Integrity Auditor** | `ui-design-validator` / `admin-component-contracts` skill | CSS custom property token fidelity. Enforces the three token namespaces: `--dt-*` (design tokens: spacing, radius, shadow, animation from `DESIGN-TOKENS.md`), `--theme-*` (semantic colors from `ThemeContext`/`THEME-SYSTEM.md`), `--z-*` (stacking context from `STACKING-CONTEXT-CONTRACT.md`). No hardcoded hex values, no magic z-index numbers, no raw `px` values outside the `--dt-spacing-*` scale. Validates `AdminShell.jsx` prop contracts (`AdminSectionHeader`, `AdminStatTile`, `AdminToolbar`, `AdminTableShell`). **Token definition/consumption check**: for any token this session touches, run `npm run query -- --token <name>` — don't assume a token is "wired up" because a plausibly-named CSS custom property exists nearby; verify the exact name the consumer reads matches the exact name the definition declares (INC-064: a `-background`/`-text` suffix pair sat orphaned in all 7 themes while the consumer read a differently-named property). **System Gap audit**: Identifies where ad-hoc styling hacks hide missing reusable layout capabilities or missing design systems (e.g., lack of a standardized Utility Bar component). |

### Optional Members (Invoke When Relevant)

| Council Member | When to Add |
| :--- | :--- |
| **The Math Auditor** (`parent-layout-audit`) | When pixel-fit claims are made (e.g., "4 stat tiles at 120px each + 16px gaps fit in the 560px AdminToolbar region"). Mandatory before any grid/flex sizing assertion — `ProjectLayoutWrapper.jsx` wrapper padding must be subtracted from the viewport first. |
| **The Mobile Usability Auditor** (`mobile-ui-validator`) | When the component has mobile routes or a responsive layout change. Key: `MobileBottomNavigation.jsx` touch targets (≥44px = `.touch-target` class from `src/index.css` L205–213), `SwipeableCard.jsx` swipe zones, `MobileOptimizedInput.jsx` input sizing. |
| **The Component Architect** (`admin-component-contracts` skill) | When the redesign introduces new primitives, changes the `AdminShell.jsx` exports, or modifies shared component prop contracts. Confirm `React.memo` usage, `className` forwarding, and that no styling is hardcoded inside the primitive. |
| **The React Performance Auditor** (`vercel-react-best-practices`) | When the redesign adds new `useEffect` hooks (especially with Firestore subscriptions), new `useMemo`/`useCallback` wrappers, dynamic imports, or re-render boundary changes near `TaskDetailsModal.jsx` or `TaskCreationContext.jsx`. |
| **The ActivityShell Auditor** | When changes touch `src/components/activity/ActivityShell.jsx` (38KB) or `ActivityFeed.jsx`. These components own the real-time activity stream display — Firestore listener lifecycle and event ordering must be validated. Consult `User_Created/Discussion Threads/Team Oversight and Profile Workspace/260701_ActivityShell Refinement.md` for prior design decisions. |

---

## 📊 Skill Eligibility & Alignment Matrix

### 🟢 UI Council Members (Fully Eligible & Active)

| Skill Name | Roster Role | Core Reasoning |
| :--- | :--- | :--- |
| `impeccable` | Craft & Polish Auditor (Core Member) | Visual craft, anti-AI-aesthetic enforcement, cognitive distillation, state craft, micro-interactions, optical balance. |
| `parent-layout-audit` | Math Auditor | Usable width arithmetic, `ProjectLayoutWrapper.jsx` padding offsets, flex wrapping, column constraints. |
| `mobile-ui-validator` | Mobile Usability Auditor | Breakpoint continuity, touch targets (≥44px via `.touch-target`), viewport limits, mobile visibility. |
| `ui-design-validator` | Token & Contract Auditor | `--theme-*` semantic token usage, `--z-*` z-index compliance, scroll/sticky overflow contracts, `--dt-*` design token usage. |
| `admin-component-contracts` | Component Architect | `AdminShell.jsx` prop contracts, `React.memo` presence, `className` forwarding, styling constraints on shared admin primitives. |
| `ui-ux-pro-max` | Motion Director / Aesthetic Auditor | `--dt-duration-*` and `--dt-ease-*` animation tokens, responsive layout patterns, `--theme-*` color contrast rules. |
| `high-end-visual-design` | Aesthetic Auditor | Typography (`--font-family-primary` system stack), visual depth via `--dt-shadow-*`, bento-grid layouts for dashboard pages. |
| `frontend-design` | Role-Scannability Auditor | Anti-template design choices, typographic hierarchy, visual differentiation between role-differentiated views. |
| `web-design-guidelines` | Standards Auditor | WCAG AA contrast compliance (`--theme-fg` on `--theme-bg`), keyboard navigation, semantic HTML structure. |

### 🟡 Conditionally Eligible (Technical UI Performance)

| Skill Name | Consulting Conditions |
| :--- | :--- |
| `vercel-react-best-practices` | New `useEffect`/Firestore subscription components, hook dependency arrays, bundle impact (esp. `TaskDetailsModal.jsx` 103KB), re-render boundaries. |

### 🔴 Ineligible (Other Governance Domains)

`site-architecture`, `build-dashboard`, `flutter-apply-architecture-best-practices`, `react-native-architecture`, `business-model*`, `business-growth-skills`, `business-intelligence`, `browser-subagent-hardener`, `backend-test-generator`, `writejournal-audit-gate`, `contract-first-api-validator`, `declarative-schema-enforcer`, `schema-migration-guide`, `firebase-firestore`, `protocol-enforcer-pre-code`, `enhancement-*`, `pirr-compliance-checklist`, `ssot-domain-mapper`, `gas-*`, `phased-commit-orchestrator`, `pin-branch`, `memory-*`, `planning-with-files`, `writing-skills`, `using-superpowers`.

> **Note:** `test-driven-development`, `writing-plans`, `requesting-code-review`, `verification-before-completion`, and the other superpowers execution skills are **not** ineligible — they govern Phase 3 & 4 execution. See **Phase Execution Skills** section below.

---

## 🔧 Phase Execution Skills (Superpowers Integration)

These skills govern **how** each council phase is executed. They are not Phase 1 evaluators (design disciplines) — they are the execution machinery for their named phases. Activate the relevant skill when entering that phase.

| Council Phase | Skill | Role in This Council |
| :--- | :--- | :--- |
| **Phase 0: Evidence Collection** | `systematic-debugging` | Traces cascade paths through component trees, CSS token inheritance, and `ThemeContext.jsx` before the council opens. Prevents reasoning from memory about which `AdminShell` primitive or `--theme-*` token the proposal actually touches. |
| **Phase 1: Independent Evaluation** | `brainstorming` | Structures the **dissenter seat** — the council mandates one member argue against the majority direction; this skill forces genuine challenge generation rather than aesthetic consensus reinforcement. |
| **Phase 1: Independent Evaluation** | `dispatching-parallel-agents` | Runs the 5 default member evaluations truly independently and concurrently. Each evaluator is an independent design discipline; parallel dispatch is the literal mechanic for honoring the "do not resolve conflicts yet" rule. |
| **Phase 2: Synthesis** | `writing-plans` | Structures the synthesis output — sequenced lowest-risk first (token corrections, dead code removal → parent div restructuring → shared primitive contract changes), with rejected alternatives documented. The Phase 2 output IS the plan Phase 3 executes. |
| **Phase 3: Implementation** | `executing-plans` | Executes the council-approved synthesis as a tracked plan with per-change verification checkpoints. Mandatory `finishing-a-development-branch` sub-skill closes the loop. |
| **Phase 3: Implementation** | `subagent-driven-development` | Dispatches council-approved changes across independent components (e.g., token corrections in one subagent, dead animation removal in another) with per-task review loops. Prevents context pollution when touching `TaskDetailsModal.jsx` (103KB) alongside theme token work. |
| **Phase 3: Implementation** | `using-git-worktrees` | For changes touching `ThemeContext.jsx`, `AdminShell.jsx`, or `ProjectLayoutWrapper.jsx` — shared primitives consumed everywhere. Isolates the change from main during execution. |
| **Phase 3: Implementation** | `test-driven-development` | For any new component or hook introduced by a council ruling — written test-first. "Passes visual review" is not a substitute for a failing test that proves behavior. |
| **Phase 3: Implementation** | `requesting-code-review` | Whole-branch code review before the council ledger entry is written. Reviews the *implementation*, not the *proposal* — separate from the council's Phase 1. |
| **Phase 3: Implementation** | `finishing-a-development-branch` | Branch integration gate (tests verified, full theme-matrix visual check (derive the theme list, do not hardcode "5"), merge/PR decision) before the council artifact is committed. |
| **Phase 4: Verification** | `verification-before-completion` | Enforces the Phase 4 gate — 3-second scan test, badge scarcity check, animation wiring, full theme-matrix fidelity (derive the theme list, do not hardcode "5") — as hard evidence before marking council-approved changes done. |
| **Phase 3 output challenged** | `receiving-code-review` | When the user challenges the synthesis or the implementation result — prevents performative agreement and enforces actual technical re-evaluation with reasoning. |

---

## 🌍 Reality-First Grounding Policy (RFG-001)

> **Origin**: 2026-07-09 RAM governance session + its external gap-analysis review.

**Optimization target**: the best UI *for this repository, at this stage, with this evidence* — not the best possible UI. Do not optimize for an imagined enterprise.

### 1. Maturity Anchor (Phase 0 input, mandatory)

Every session artifact opens with a one-line **Grounding Snapshot**: current stage, module count, active real-user count, team size.

<!-- shared:std.governance.rfg-001-classification:start -->
### 2. Recommendation Classification (Phase 2 output constraint, mandatory)

Unchanged from the original protocol — every item in the Recommended Course of Action carries exactly one tag (Required Now / Recommended Soon / Future Extension / Speculative), tie-broken by: **"Would I still recommend this if the repository never grows beyond its current size?"**

### 3. Burden of Proof for new artifacts (Phase 1, enforced by Maintainability & Velocity Auditor)

Before recommending any new SSOT, decision-log entry, workflow, checker, hook, or schema field, the proposing member must show: (1) the problem exists today, cited; (2) existing architecture can't evolve to solve it; (3) net complexity goes down, not up, at this repo's actual maturity stage; (4) deferring it creates measurable debt.

### 4. External Review Intake

Owned by the SSOT Authority Auditor: decompose, classify, verify the reviewer's premises against actual repo documentation and facts before adopting anything.
<!-- shared:std.governance.rfg-001-classification:end -->

---

## 🗺️ Mandate Coverage Map

<!-- shared:std.governance.mandate-coverage-map-discipline:start -->
Every council review mandate item must map to a seated auditor or explicit gate. The table below enforces coverage integrity across all architectural and structural dimensions.
<!-- shared:std.governance.mandate-coverage-map-discipline:end -->

| # | Mandate item | Stated in | Owner |
| :-- | :-- | :-- | :-- |
| 1 | Visual hierarchy & typography scale | Applies-to §1 | Visual Hierarchy Auditor |
| 2 | Theme tokens & color contrast | Applies-to §2 | Theme System Auditor |
| 3 | Information density & viewport fit | Applies-to §3 | Information Density Auditor |
| 4 | User role scannability | Applies-to §4 | User Role Scannability Auditor |
| 5 | Design system & CSS custom properties | Applies-to §5 | Design System Integrity Auditor |
| 6 | Maturity Anchor | RFG-001 §1 | Phase 0 item (grounding snapshot) |
| 7 | Recommendation Classification | RFG-001 §2 | Maintainability & Velocity Auditor |
| 8 | Burden of Proof | RFG-001 §3 | Maintainability & Velocity Auditor |
| 9 | Explicit N/A ledger | ICG-001 #2 | `check-council-artifact.ps1` |
| 10 | Self-critique close + verbatim-Challenge quote | ICG-001 #3 | `check-council-artifact.ps1` |
| 11 | No-plan-only first response | ICG-001 #1 | **Unowned mechanically** |

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
9. **Call-Graph & Permissions-AST Verification Gate** — consult [.agent/patterns/call-graph-and-rules-ast-verification-gate.md](../patterns/call-graph-and-rules-ast-verification-gate.md). Never declare an existing service, function, or aggregation layer "reusable" without static grep/AST confirmation of actual production callers in frontend/page entry points. Never verify a database security rule or authorization handler by leaf keyword without walking the full parent path hierarchy to confirm exact resource path permissions and write authorization. When fixing a query or filter defect, always sweep sibling methods in the same service class for identical filtering logic.

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

### Task-Dashboard-specific elaboration of the phases above

The shared skeleton above stays generic on purpose (it's synced verbatim to every SAP-linked repo). This is how Task-Dashboard's UI council instantiates it concretely — restored 2026-08-15 after a cross-repo promotion pass overwrote this entire section with UG-Farmhouse's generic wording; kept local instead of re-merging into the shared block so it can't be clobbered by a future sync from another repo.

**Phase 0 additions:**
- **Ledger check** also covers `User_Created/Discussion Threads/` for relevant design decision threads (e.g., `260701_ActivityShell Refinement.md`).
- **Read the component** — `view_file` the exact JSX and the component's CSS file (if separate). For admin components, read the relevant section of `AdminShell.jsx`.
- **Identify dead code** — flag animation scaffolding with no trigger, CSS class definitions never applied, state variables defined but never consumed. `TaskUpdateModal.jsx` (75KB) and `AdminRequestReview.jsx` (82KB) are known to have accumulated unused code paths. For dead CSS custom properties specifically, check `.cache/token-map.json`'s `findings.orphans` for any `--theme-*`/`--tc-*`/`--dt-*` token in this component's family.
- **Identify the primary audience** — Admin (Level 1–2), Supervisor (Level 3–4), or Associate (Level 5)? Determines which Scannability Auditor scenario is the reference case and which council members are mandatory vs. optional.
- **State the IA lock** — confirm the IA (which data fields, which Firestore collections, which role-gated sections) is approved and locked. The UI council only designs *how* to present it — not *what* to present.
- **Rule-Challenge Check** (added post-INC-063): if the component's problem stems from a *standing rule* this council or a prior one enforces (an opt-out contract, a global override, an invariant in `THEME-SYSTEM.md`), that rule is itself an evaluand this session, not a fixed constraint. Ask explicitly: does the fix decorate individual components to *escape* a global rule? If yes, the global rule's direction must be independently evaluated before the escape-hatch fix is accepted. Opt-out selectors (`:not(.x)`) are a named smell — see `.agent/patterns/derive-dont-declare-guardrails.md` § "prefer making bad state unrepresentable."
- **Failure-Class Recurrence Gate** (added post-INC-063): the ledger check queries prior rulings *on this component* — not enough, since a recurring defect class shows up on a *different* component each time. Before Phase 1 opens, also grep `docs/incidents/`, `docs/frontend/frontend-knowledge-index.jsonl`, and `.agent/patterns/` for the **failure class** (e.g. "theme override," "opt-out class," "gradient token"), not just the file path. If the session concerns a design token, also run `npm run query -- --token <name>`. **≥2 prior incidents of the same class found ⇒ a symptom-only fix is disallowed by default** — the session must at minimum record why root-causing is not being done this time.
- **Macro-Level Composition & System Audit**: audit the component/layout structure for systemic design smells — independent elements lacking grouping, visual imbalance, mixed component language, inconsistent elevation/container models, utility prioritization mismatches, or a missing reusable layout capability.

**Phase 2 additions:**
- **Diagnosis** first — a brief, honest summary of the primary failure modes in the current implementation, citing specific lines where dead code, token violations, or scannability failures live.
- **Measurement Gate** (added post-INC-063): any recommendation that patches symptoms at multiple call sites instead of fixing a shared root cause must state, in counts, both how many call sites the patch touches today and how many the root-cause fix would touch instead — adjectives ("a few," "some") are not admissible. INC-063: the actual counts were 884 hijacked buttons vs. ~24 real CTAs to tag after inverting the rule — a comparison nobody made before recommending the per-caller patch.
- **Effort/Impact matrix** — a table ranking each proposed change.
- **Rejected alternatives** — what was considered and why it was rejected.
- **Open questions for user approval** — anything that requires explicit product owner or architect sign-off before implementation begins.

**Phase 3 additions:**
- **Change 1 first** — the lowest-risk change is always done first, independently verified, before the higher-risk changes proceed.
- Run `npm run dev` and visually verify the component renders correctly at the primary audience's viewport (1280px for Admin/Supervisor, 375px for Associate mobile).
- Run across every theme defined in `src/styles/theme-tokens.css` (derive the list, do not hardcode it) to confirm no theme-broken states.
- Confirm no design token violations: no raw hex colors, no magic z-index numbers, no hardcoded `px` values outside the `--dt-spacing-*`/`--dt-radius-*` scale.
- Confirm `.touch-target`/`.touch-target-lg` classes are used for interactive elements, not inline `min-h-[48px]` utilities.
- **3-second scan test**: can a Supervisor identify the most urgent escalated task in 3 seconds? Can an Admin spot the highest-risk system flag without reading every row?
- **Badge scarcity**: is escalation state visually distinct from a routine status? Not every `TaskCard.jsx` should carry the same visual weight.
- **Animation wiring**: confirm every `transition`/`animation` CSS declaration has a corresponding trigger. Dead animation scaffolding is a known issue in the larger modal components.
- **Theme fidelity**: run through every theme defined in `src/styles/theme-tokens.css` (derive the count, currently 7, not 5). Confirm `--theme-accent` renders distinctly in Grayscale, Sepia mode's warm tones don't wash out error states, and no colour-named `--theme-*` token silently holds a gradient in any theme (`npm run check:color-mix` — see INC-057/INC-062).
- **React cleanup**: confirm any new `useEffect` blocks with Firestore subscriptions return a cleanup function or call `.abort()` on their controller.
- **ARIA modal & Swap Transition**: if the change introduces a new dialog/drawer, confirm `role="dialog"`, `aria-modal="true"`, `aria-labelledby` with a unique ID, and caller-supplied `data-testid`. If a secondary modal triggered from a primary modal, verify a **Modal Swap Transition** is used.
- **Guard Capability Audit** (added post-INC-063): if an automated guard is claimed to cover the defect class this session addressed, run it and confirm it actually fires on the *original* broken state. A guard that reports green while the class of bug it claims to cover is live is a **second finding** — fix or retire the guard in the same session. INC-063's `sg:fkl-di-003` reported 0 violations throughout the incident because it only matched gradient/glassmorphism classNames, never plain `<button>` hijacks.

---

<!-- shared:std.governance.icg-001:start -->
## 🎯 Invocation Completeness Gate (ICG-001)

> **Origin**: 2026-08-14 user feedback (`Discussion/DiscussionThreads/WorkflowImprovements/260814_WorkflowUpgrades.md`, Query 1.1) — a council invocation returned a plan summary with no Phase 1 positions and no output artifact; the full evaluation only surfaced after two follow-up prompts. Structural, not behavioral: closes the gap without relying on the user to keep asking.

**What this gate mechanically checks, and what it can't**: items 1–3 are a behavioral contract on the agent running the council — nothing in this repo intercepts a chat response before it's sent. What CAN be mechanically checked is the output artifact file. `check-council-artifact.ps1` (repo root) derives the roster, the Phase 1 field list, and the Phase 2 item list from *this file's own* tables/sections — a seated member (its own heading) must carry all 7 Phase 1 fields, and each seated member's Challenge must be quoted verbatim (≥1 sentence, ≥6 words) somewhere in the Phase 2 synthesis (added Query 2.3, after the checker caught this exact violation in this repo's own real adversarial-replay artifact). It cannot block a chat response, only the committed file — see the script's own header for the complete, current scope boundary.

1. **No plan-only first response.** The first response after invocation is the full Phase 0→2 artifact (or an `EXPEDITED` equivalent), not a summary with a "want the details?" offer.
2. **Explicit N/A ledger.** Every default roster member or phase not exercised gets a named reason in the artifact. Silence is not valid.
3. **Self-critique close.** Phase 2 ends with a **Process Notes** subsection covering this council's own SOP, roster, invocation protocol, gates, and workflow — each entry names the gap (`Gap:`) **and** a concrete proposed fix (`Proposed fix:`); states whether applied in-session or deferred pending approval, and why.
<!-- shared:std.governance.icg-001:end -->

See `Council_Ledger.md` PROCESS-CORRECTION row, 2026-07-28, for the incident this gate closes.

---

## 📜 Output Artifact (Mandatory)

A council session is not valid until its record exists:

- **File**: `User_Created/Discussion Threads/Council/[YYMMDD]_ui_council_[subject].md` — containing the roster (with omission/addition justifications and the named dissenter), all Phase 1 positions, the synthesis, and the **evidence snapshot** (commit hash + list of files relied on).
- **Architecture Decision Handoff**: When invoked via `/role-activation` or as an auto-triggered gate for UI architecture, emit the structured `.agent/session/mode1-output.json` (`architecture-decision`) artifact containing `architectural_findings`, `blast_radius_scope`, `contract_write_sites_inspected`, `external_benchmarks_referenced`, and `precedence_ladder` to directly satisfy the `delivery-planner` gate.
- **Ledger line**: append one row to `User_Created/Discussion Threads/Council/Council_Ledger.md`: date, council, type (`FULL`/`EXPEDITED`/`SKIP`), subject, one-line verdict, artifact link, snapshot hash.
- **Staleness rule**: a future session citing this ruling runs `git log <snapshot-hash>.. -- <evidence files>`; any commits returned mean the ruling is stale and must be re-validated before being relied on. No expiry dates — the diff is the decay model.

---

## Relationship to Other Workflows

| Related Workflow | Relationship |
| :--- | :--- |
| [ia-uiux-separation.md](ia-uiux-separation.md) | **Hard prerequisite**: IA (Workflow 1) must be approved before this council runs. The UI Council operates exclusively in Workflow 2 (How?). |
| [architecture-council.md](architecture-council.md) | Structural counterpart. Pull architecture-council in when a UI change requires: a new Firestore field, a new React context, changes to `ProjectLayoutWrapper.jsx` routing logic, or a shared hook contract change. Also: when this council defers a visual/interaction spec (a component, a library choice, a token set) because the underlying capability itself is Future Extension per an architecture-council ruling, its re-open trigger must satisfy architecture-council.md's RFG-001 § **Derived-Layer-First re-open condition** — usage evidence from whatever shipped in its place, not a scale threshold alone. Example: the [260728_ui_council_kanban_execution_workflow.md](../../User_Created/Discussion%20Threads/Council/260728_ui_council_kanban_execution_workflow.md) dissent deferring DND-library selection until the board itself is triggered. |
| [external-ui-redesign.md](external-ui-redesign.md) | Delegation workflow for when presentation design is handed to an external. This council's synthesis is the input to that workflow. |
| [mobile-ui-engineering.md](mobile-ui-engineering.md) | Detailed mobile engineering rules and breakpoint contracts. Invoke when the Mobile Usability Auditor surfaces a responsive issue that needs implementation guidance beyond `RESPONSIVE-DESIGN.md`. |
| [harvest-frontend-knowledge.md](harvest-frontend-knowledge.md) | Run after a major redesign to capture durable design decisions into the FKL before they are forgotten. Any new `--theme-*` token or `--dt-*` token added must be harvested and registered. |
| [debug-frontend.md](debug-frontend.md) | Frontend debug workflow — Tracks A–I covering zombie handlers, state shadows, scroll issues (Track E), layout issues (Track F), theme breakage (Track G), and token architecture (Track I). Track G specifically: "correct in one theme, broken in another" → query the token map first (`npm run query -- --token <name>`), FKL-DI-003 is superseded (opt-in `.button-theme-primary` model, not the old opt-out contract) — see THEME-SYSTEM.md's superseding note, not the original FKL-DI-003 text. |
| `admin-component-contracts` skill | Source-of-truth pointer for all shared admin UI primitives exported from `AdminShell.jsx`. Read SKILL.md before any review that touches these primitives. |
| [.agent/patterns/search-before-inventing.md](../patterns/search-before-inventing.md) | Exhaustive multi-repo discovery pattern before proposing new UI mechanisms or design tokens. |

---

## Invariants This Council Must Always Enforce

These are non-negotiable regardless of the aesthetic direction chosen. Any proposal that violates these is **rejected without synthesis**:

| Invariant | Enforcement Source |
| :--- | :--- |
| All colors must use `--theme-*` CSS custom property tokens — no hardcoded hex, no Tailwind color classes | `ui-design-validator` / `DESIGN-TOKENS.md` |
| Z-index values must use `--z-*` token variables — no magic numbers. See `STACKING-CONTEXT-CONTRACT.md` for the full token list | `ui-design-validator` / P27 / `STACKING-CONTEXT-CONTRACT.md` |
| Sticky elements must use the `.sticky-*` utility class system — not bare `position: sticky` with manual `top` values | [SCROLL-AND-STICKY-CONTRACT.md](../../docs/ssot/ui-design/spokes/SCROLL-AND-STICKY-CONTRACT.md) |
| Spacing must use `--dt-spacing-*` tokens or Tailwind equivalents (p-1=4px, p-2=8px, p-4=16px) — not inline arbitrary values | `DESIGN-TOKENS.md` Spacing Scale |
| Responsive overrides must exist for mobile viewports where expected — verified via `mobile-ui-validator` | P19 |
| Theme correctness across every theme defined in `src/styles/theme-tokens.css` (derive the list; currently 7, not 5) | [THEME-SYSTEM.md](../../docs/ssot/ui-design/spokes/THEME-SYSTEM.md) |
| Primary-CTA button styling in Sepia/Velvet-Dark is **opt-in** (`.button-theme-primary`), never opt-out — a plain `<button>` must fail *visibly-safe* (no branded styling), not *invisibly-broken* (hijacked into a CTA it isn't). FKL-DI-003 is superseded; do not reintroduce a `:not(.x)`-style global override for buttons | [THEME-SYSTEM.md](../../docs/ssot/ui-design/spokes/THEME-SYSTEM.md) FKL-DI-003 (superseded) · [INC-063](../../docs/incidents/INC-063-button-theme-hijack-opt-out-default.md) |
| Touch targets ≥44px via `.touch-target` class (from `src/index.css` L205–213) — not inline `min-h-[48px]` | `DESIGN-TOKENS.md` Accessibility Touch Targets |
| ARIA modal pattern on all dialogs: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` with unique caller-supplied ID; `data-testid` must be caller-supplied (not generic fallback) | Project-scoped AGENTS.md rule |
| `AdminShell.jsx` primitives: props forwarded correctly, no styling hardcoded inside the primitive, `React.memo` preserved | `admin-component-contracts` skill |
| Grid-aware container scaling: Elements nested inside multi-column grids (like `cockpit-grid-2`) must scale DOWN at breakpoint transitions (e.g. using `md:text-[10px] md:px-1.5`) rather than scaling UP. Viewport-only scaling queries that ignore parent column limits are prohibited. | FKL-DI-016 / RESPONSIVE-DESIGN.md |
| No Stacked Modals (Overlay Stacking Limit): Compounding backdrops by overlaying multiple modals/dialogs is prohibited. Dual or sequential modal flows must employ a state-based **Modal Swap Transition** (closing the active modal before mounting the next, with state memory to swap back on cancel). | `.agent/patterns/modal-swap-transition.md` |
