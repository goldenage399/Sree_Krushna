---
description: Unified debugging workflow for all frontend issues - value display, UI interaction, state sync, and handoff
---

# Frontend Debugging Workflow

**Purpose**: End-to-end debugging process from bug report to handoff
**Scope**: All Task-Dashboard frontend modules
**Version**: 2.0

> **Knowledge Retrieval**: Before beginning, execute [FRONTEND-KNOWLEDGE-HUB.md](../../docs/ssot/ui-design/FRONTEND-KNOWLEDGE-HUB.md) Part 10 Step 0 to load the retrieval profile for this work type (WT-02 Frontend Debugging).

> [!IMPORTANT]
> **Incident & Knowledge Query Gate**: Run `node tools/query-cli/cli.cjs --frontend "<symptom/component keywords>"` before diagnosing to surface matching INC-XXX case studies, historical invariants, and 7-theme matrix rules (see [.agent/patterns/monolithic-css-append-and-all-theme-matrix-sweep.md](../patterns/monolithic-css-append-and-all-theme-matrix-sweep.md)).

> **Golden Rule**: "State is the Single Source of Truth. The DOM is just a reflection."

> **Master Workflow**: [/debug](./debug.md) — Routes to the appropriate track based on symptom
>
> > [!IMPORTANT]
> > **Investigation Gate (IVP-001)**: All debugging and troubleshooting sessions MUST consume and apply the **[ivp-001.md](../../.agent/patterns/ivp-001.md)** protocol. Initialize a Hypothesis Ledger before editing code.
>
> **Cross-Reference**: For backend/GAS issues (CORS, API errors, Sheet operations), use [/debug-backend](./debug-backend.md)

---

## Architecture Context

### File Boundaries (UI vs Logic)

| Track            | Files                                        | Responsibility                              |
| ---------------- | -------------------------------------------- | ------------------------------------------- |
| **UI Track**     | `*Renderer.js`, `*.css`                      | DOM generation, event binding, visual state |
| **Logic Track**  | `*Utils.js`, `*Service.js`, `DataMapper.js`  | Calculations, validations, data transforms  |
| **State Track**  | `StateManager.js`, `DraftCache.js`           | State persistence, cache management         |
| **Orchestrator** | `*Module.js` (e.g., ExpenseStagingModule.js) | Wiring UI → State → Logic → Render          |

### Unidirectional Data Flow

```
User Action → Event Handler → State Update → Calculation → Render → DOM
     ↑                                                           │
     └───────────────────────── Feedback ─────────────────────────┘
```

---

## 6-Step Methodology (From SYSTEMATIC_DEBUGGING.md)

### Quick Reference

```
┌────────────────────────────────────────────────────────────┐
│ 6-STEP SYSTEMATIC DEBUGGING                                │
├────────────────────────────────────────────────────────────┤
│ 1. STOP & DEFINE (Inventory Tools + Question Assumptions)  │
│ 2. REPRODUCE (Verify consistency)                          │
│ 3. TRACE (Layer 0 Check + Bisect)                          │
│ 4. EVIDENCE (Collect actual data inputs/outputs)           │
│ 5. ROOT CAUSE (Hypothesize → Test → Iterate)               │
│ 6. FIX + VERIFY + PREVENT (Automate guardrails)            │
├────────────────────────────────────────────────────────────┤
│ RED FLAGS: Debugging empty DB | "Maybe it's X" | No logs   │
│ ACTION:    STOP → INVENTORY TOOLS → CHECK DATA SOURCE      │
└────────────────────────────────────────────────────────────┘
```

### Layer Trace Table

| Layer                       | What to Verify          | Recommended Tool                | Fallback              |
| --------------------------- | ----------------------- | ------------------------------- | --------------------- |
| **Layer 0** (Data Source)   | Does data exist?        | Firebase Admin SDK              | Firebase Console      |
| **Layer 0.5** (Write Audit) | What was written when?  | WriteJournal sheet              | Sheet version history |
| **Layer 1** (Query/Fetch)   | Is query executing?     | Console logs                    | Network tab           |
| **Layer 2** (State)         | Is state populated?     | `stateManager.getCurrentBill()` | DevTools              |
| **Layer 3** (Render)        | Is component rendering? | Browser Elements                | Visual inspection     |

### Tool Inventory

| Tool Type         | Examples                   | When to Use                       |
| ----------------- | -------------------------- | --------------------------------- |
| **Admin SDK**     | `debugFirestoreGeneric.js` | Direct Layer 0 verification       |
| **Browser Agent** | `browser_subagent`         | UI state, console capture         |
| **AI Research**   | `@mcp:perplexity-ask`      | Tool discovery, approach research |
| **Manual Check**  | Firebase Console           | Fallback                          |

> **Full methodology**: [SYSTEMATIC_DEBUGGING.md](../docs/SYSTEMATIC_DEBUGGING.md)

---

## Step 0: Topology Layer Classification (30 seconds)

Run this before ANYTHING ELSE for any layout, UI, or data bug.
Ask: **which layer is most likely responsible?** — not "which component?"

```
□ L1 — Viewport Authority         breakpoint never activates, viewport overflow
□ L2 — Application Shell          page scroll wrong, sidebar collision, h-screen issue
□ L3 — Layout Authority           content region wrong width/height
□ L4 — Constraint Authority       grid collapses, flex blowout, element too wide, text clips
□ L5 — Responsive Authority       mobile/desktop difference, modal positioning, body scroll lock
□ L6 — Component Authority        local rendering, internal spacing, interactive state
□    — Data Layer                  wrong/missing data, zero results, divergent views
```

**Pick the most likely layer, then go directly to the matching preflight below.**
**Query the knowledge index for similar symptoms:**
`node tools/query-cli/cli.cjs --frontend <symptom keywords>` (e.g. `node tools/query-cli/cli.cjs --frontend overflow modal`)

### 🛑 Runtime Evidence Gate (REG-001)

After completing the **Layout Investigation Preflight** (checks 1–10 below), if **any** of the following still remain unresolved:

- Overflow Authority (which ancestor owns `overflow`)
- Width Authority (which ancestor sets the width budget)
- Constraint Authority (which element is causing blowout/collapse)
- Scroll Owner (which element is the scroll container)
- Responsive Owner (which breakpoint path is active)

**STOP. Do not expand repository search further.**
Request runtime evidence from the user:
1. Ask the user to right-click the affected element in browser → **Inspect** (this selects it as `$0`)
2. Ask the user to paste [layout-console-toolkit.js](../../docs/frontend/layout-console-toolkit.js) into the DevTools Console tab and run the relevant function:
   - `traceOverflow($0)` — overflow/scroll authority
   - `traceConstraintChain($0)` — width blowout / flex-grid collapse
   - `traceScrollOwner($0)` — scroll container
   - `traceWidthOwner($0)` — width budget chain
3. Read the console output before touching any code.

**The agent must not guess topology from static grep when runtime truth is available.**

Reference: [FRONTEND-TOPOLOGY-MODEL.md](../../docs/frontend/FRONTEND-TOPOLOGY-MODEL.md) | Query CLI: `node tools/query-cli/cli.cjs --frontend <terms>`

---

## Layout Investigation Preflight (30 seconds)

Run this before any layout, overflow, scroll, or responsive bug — before opening DevTools.

> [!WARNING]
> **CSS Bridge Override (INC-002 / INC-022 / INC-037 / FKL-DI-016) — CHECK FIRST before the numbered list below.**
> If the symptom is any Tailwind responsive variant (`sm:`, `md:`, `lg:`, `xl:`) appearing to do nothing, or a grid refusing to go multi-column:
> ```bash
> node tools/query-cli/cli.cjs --frontend "responsive class no-op bridge grid typography override"
> ```
> Then read `.agent/patterns/css-bridge-specificity-management.md`.
> This is the **most common cause** of "layout not responsive" bugs in this codebase (5 confirmed instances). The fix is either adding the missing responsive class to `tailwind-semantic-bridge.css`, or applying Tailwind's `!` important modifier (e.g. `md:!text-[10px]`, `md:!font-semibold`) to bypass global bridge redefinitions of base classes (like `.text-xs` or `.font-bold`).

> [!CAUTION]
> **Visual Edit Attempt Cap (VEA-001)** — enforced for ALL layout/CSS edits.
> - **Attempt 1**: Make the fix. Report what changed and why.
> - **If user says it didn't work**: STOP. Do NOT attempt a second edit.
> - Ask: "Please share a screenshot or DevTools computed styles — I cannot verify visual output from static analysis."
> - Only after receiving visual evidence: diagnose, then attempt 2.
> See `.agent/patterns/css-bridge-specificity-management.md § Visual Edit Attempt Cap`.

```
1. Screenshot available?          If no → get one before touching code.

2. Regression?                    git log -S "overflow\|flex\|scroll\|width" -- src/
                                  Check last 5 commits touching the affected component.

3. Known incident?                Query knowledge index: node tools/query-cli/cli.cjs --frontend <keywords>
                                  Or check docs/frontend/LAYOUT-BUG-INDEX.md / docs/incidents/ (INC-XXX)

4. Who owns WIDTH?                Check LAYOUT-OWNERSHIP.md.
                                  DashboardLayout <main> owns content width.
                                  Pages fill flex-1. Tables own their own overflow-x.
                                  Two pages same structure but different widths?
                                  See .agent/patterns/page-width-ownership.md — check registry ownership, not per-page PageContainer.

5. Who owns HEIGHT?               DashboardLayout owns h-screen.
                                  ResponsiveModal owns max-h-[90vh] on tablet.
                                  Pages do NOT control their own height.

6. Who owns OVERFLOW?             DashboardLayout <main> → overflow-auto (vertical).
                                  ResponsiveModal content div → overflow-y-auto per breakpoint.
                                  Tables → overflow-x-auto, set per page inline.

7. Who owns SCROLLING?            Same as overflow owner — DashboardLayout for page scroll,
                                  ResponsiveModal for modal content scroll.

8. Mobile only?                   isMobile path in DashboardLayout / ResponsiveModal.
                                  body scroll lock: ResponsiveModal.jsx:41-55.

9. Desktop only?                  isDesktop path. Check Topbar rendering, sidebar width.

10. Tailwind responsive broken?   Check INC-002 first.
                                  Symptom: lg:/md:/sm: classes silently do nothing.
                                  Cause: CSS bridge import order overrides responsive utilities.

11. Ownership still ambiguous?    → REG-001 GATE: request runtime evidence via layout-console-toolkit.js.
                                  Do NOT continue grepping. Static source cannot reveal computed layout.
```

---

## Data Divergence Preflight (30 seconds)

Run this before any "UI shows wrong/missing data" bug — before opening DevTools.

```
1. Same data in two places (page + modal, tab + page)?
   Both must read from the same source. Check both code paths.

2. getDocs() or UsersContext?
   Any display path that fires getDocs() for user-profile state = P61 violation.
   Fix: read from UsersContext (allUsers from useUsers()).

3. Which isActive predicate?
   Canonical: a.isActive !== false  (includes undefined as active)
   Banned:    a.isActive truthy     (excludes undefined — silent miss)
   Banned:    where('status','==','active')  (drops users missing the field)

4. Field stores ID or display name?
   Firestore where() must filter by stable ID.
   task.project stores "FFC Delta" (display); query needs "ffc_delta" (ID).
   → INC-012

5. Local variable shadowing outer context?
   grep -n "const userCtx\|const ctx" in the affected function.
   A shadowed context strips real profile assignments from the query.
   → INC-010

6. One component upgraded, another left behind?
   grep -rn "getLinkedUser\b\|profileId ===" src/
   Legacy singular helpers hiding behind upgraded counterparts.
   → INC-003, INC-020

7. where() silently dropping records?
   Any field used in where() that might be absent, null, or use alternate values
   will silently exclude those records. Verify field presence in sample docs.

8. Known incident? Search docs/frontend/DATA-DIVERGENCE-INDEX.md first.
```

---

## Phase 0: Bug Classification (< 2 min)

### Decision Tree

```
START: What is the symptom?
│
├─[A] "I click but nothing happens"
│   └─→ Is there an error in console?
│       ├─ YES → Check error message
│       └─ NO → UI TRACK: Zombie Handler OR Event Propagation Blocked
│           └─→ FAST: Ask user to paste button's HTML from DevTools
│           └─→ Check for: stopPropagation(), pointer-events: none
│           └─→ If no blockers: Does handler method exist?
│
├─[B] "UI shows wrong value" or "Validation fails"
│   └─→ Which part is wrong?
│       ├─ Input value wrong → UI TRACK (render issue)
│       ├─ Calculated value wrong → LOGIC TRACK (calc issue)
│       └─ Both → MIXED (state flow issue)
│
├─[C] "Toggle changes but behavior stays same"
│   └─→ MIXED: DOM-Reading Anti-Pattern
│       └─→ Check: Is calc reading from State or DOM?
│
├─[J] "Tasks missing from Today's Agenda, or miscategorized in Grouped Kanban view"
│   └─→ Agenda/Kanban Derivation Track:
│       ├─ Check `useTodayAgenda` filter rules (`scheduledStart`, `deadline`/`dueDate`, `daily_attention_reports`)
│       ├─ Check status casing (`P-CASE`) and `getTaskKanbanColumn` in `kanbanExecutionMapping.js`
│       └─ Verify `task.status` is a canonical `WRITABLE_STATUSES` (TLM-009 / ARCH-INV-009)
│
├─[D] "Page jumps / focus lost / scroll reset"
│   └─→ UI TRACK: InnerHTML Thrashing
│       └─→ Check: Is full innerHTML being replaced?
│
├─[E] "Input change doesn't update other fields"
│   └─→ MIXED: Ghost Events / Incomplete Wiring
│       └─→ Check: Event listener → State update → Recalc chain
│
│
├─[F] "CORS/API error"
│   └─→ Check function exists in deployed GAS
│   └─→ Check backend logs for ReferenceError (PIO-096B)
│
├─[G] "Generic Error Message" (e.g., LEDGER_CREATION_FAILED)
│   └─→ BACKEND TRACK: Real error is hidden
│       └─→ Check GAS Executions for crash in catch block
└─[H] "Element hidden / overlay wrong"
│   └─→ LAYOUT TRACK: Z-Index or Stacking Context
│       └─→ Check: Computed Style vs UI_DESIGN_SYSTEM.md layers (Protocol #27)
│       └─→ Verify z-index token usage (--z-* variables)
│       └─→ Overlapping modals or backdrops? -> Verify tab-based modal gating (see [.agent/patterns/modal-gating-by-active-view.md](../../.agent/patterns/modal-gating-by-active-view.md)) or modal swap transitions (see [.agent/patterns/modal-swap-transition.md](../../.agent/patterns/modal-swap-transition.md))
│
└─[I] "Sticky element fails to stick / scroll wrong"
│   └─→ LAYOUT TRACK: Viewport Ancestor Trace (VAT) — see Track E below
│       └─→ CRITICAL: Do NOT inspect component CSS first.
│       └─→ Read SCROLL-AND-STICKY-CONTRACT.md → trace OUTWARD via overflow/height grep
│
└─[J] "Grid won't multi-column / layout not responsive / element wrong size"
    └─→ LAYOUT TRACK: Container Hierarchy Audit (CHA) — see Track F below
        └─→ CRITICAL: Do NOT grep CSS token names first.
        └─→ Read graphify-out/GRAPH_REPORT.md → trace parent chain → calculate width math
│
└─[K] "Component styled correctly in one theme, broken (plain/ugly) in another theme"
    └─→ CSS THEME TRACK: Global Theme Override Conflict — see Track G below
        └─→ CRITICAL: Do NOT assume a JSX or state bug.
        └─→ grep -n "button-theme-primary\|theme-button-secondary" src/styles/theme-utilities.css → check opt-in class (post-INC-063; `themes-enhanced.css` this used to reference is retired)
│
└─[L] "Token/color/theme variable doesn't resolve as expected" OR "not sure which file owns this token" OR "same-looking token behaves differently in two places" OR "wrong hover/active/computed color, don't know which token is responsible yet"
    └─→ TOKEN ARCHITECTURE TRACK: Fragmented Token System — see Track I below
        └─→ Don't know the token name yet? Start from the CSS class name (Track I Step 0), not a guessed token or a DOM selector path.
        └─→ CRITICAL: Do NOT start a fresh grep sweep across src/tokens/ and src/styles/.
        └─→ Read enhancement-notes/TASK-218-Token-Architecture-Stabilization-Program/01_PHASE1_DISCOVERY_LOG.md FIRST — the topology is already mapped (D1-D8+)
```

### Quick Classification Questions

| Question                             | If YES             | If NO            |
| ------------------------------------ | ------------------ | ---------------- |
| Is the bug visible in the DOM?       | Includes UI Track  | Pure Logic       |
| Does console show correct values?    | UI rendering issue | Calc/State issue |
| Does bug persist after page refresh? | State persistence  | In-memory only   |
| Does bug affect multiple rows?       | Shared logic issue | Single-row state |

---

## Phase 1: Investigation by Track

### Track A: Pure UI Issues

**Scope**: Buttons, toggles, inputs, visual display
**Files**: `*Renderer.js`, `*.css`

**Trace Protocol**:

```
1. Find the HTML element
   → grep for class name or data-action
   → Confirm element exists in rendered DOM
   → grep for class name in `public/css` (Ghost Class Check)

2. Find the event binding
   → Search setupEventDelegation in *Module.js
   → Confirm case statement exists for action

3. Find the handler method
   → grep for `methodName() {`
   → If MISSING → This is the bug (Zombie Handler)

4. Check the handler logic
   → Does it update DOM correctly?
   → Does it call other methods that might fail?
```

**Common Fixes**:

- Missing method → Add to \*Module.js
- Wrong element ID → Fix ID pattern in renderer
- CSS not applied → Check class toggle logic
- Element renders completely transparent in specific themes → Check if `color-mix()` is silently failing due to gradient tokens. See `.agent/patterns/css-color-mix-gradient-silence.md`.

---

### Track B: Pure Logic Issues

**Scope**: Calculations, validations, data transforms
**Files**: `*Utils.js`, `*Service.js`, `DataMapper.js`

**Trace Protocol**:

```
1. Identify the calculation function
   → Which util/service function produces the wrong value?
   → Add console.log for inputs and output

2. Verify inputs are correct
   → Are all required values passed?
   → Are they the right type (number vs string)?

3. Step through the formula
   → Is the math correct?
   → Are edge cases handled (zeros, nulls)?

4. Verify output is used
   → Is the calculated value returned?
   → Is caller using the return value?
```

**Common Fixes**:

- Wrong formula → Fix calculation in utility function
- Missing input → Add to function parameters
- Type coercion → Add `parseFloat()` / `parseInt()`

---

### Track C: State Issues

**Scope**: State not synced, value not persisted
**Files**: `StateManager.js`, save/update handlers
**Related Skill**: [.agent\skills\vercel-react-best-practices](../../.agent/skills/vercel-react-best-practices/SKILL.md) — Guidelines for React hooks dependency validation, state optimization, and avoiding unmemoized render loops (INC-009).

**Trace Protocol**:

```
1. Identify where value is calculated
   → Log the calculated value (should be correct)

2. Identify where value is written to state
   → Find stateManager.update* call
   → CHECK: Is the field in the update object?
   → If MISSING → This is the bug (State Shadowing)

3. Identify where value is read from state
   → Find stateManager.get* or getLineItem() call
   → Verify it's reading the same field name

4. Check timing
   → Is read happening AFTER write completes?
   → Any async issues?
```

**Common Fixes**:

- Field missing from update → Add to object spread
- Wrong field name → Standardize naming
- Async race → Add await or use callback

---

### Track D: Mixed Issues (UI + Logic + State)

**Scope**: Toggle works visually but doesn't affect calculation
**Files**: Multiple (orchestrator is usually the issue)

**Full Flow Trace**:

```
1. EVENT LAYER (*Module.js)
   └─→ Log: "Event received: {action, index, value}"

2. STATE LAYER (StateManager.js)
   └─→ Log: "State before: {...}"
   └─→ Log: "State after: {...}"
   └─→ Verify: Did the value change?

3. CALCULATION LAYER (utils)
   └─→ Log: "Calc inputs: {qty, amount, mode, ...}"
   └─→ CHECK: Is it reading from STATE or from DOM?
   └─→ If DOM → This is the bug (DOM-Reading Anti-Pattern)

4. RENDER LAYER (renderers)
   └─→ Log: "Rendering with: {...}"
   └─→ Verify: Is new value displayed?
```

---

### Track E: Layout / Scroll / Sticky Issues (Viewport Ancestor Trace — VAT)

**Scope**: `position: sticky` failures, wrong scroll container, overflow conflicts
**SSOT**: `docs/ssot/ui-design/spokes/SCROLL-AND-STICKY-CONTRACT.md`

> [!CAUTION]
> **Cognitive Localization Anti-Pattern**: Do NOT start by inspecting the component's own CSS. `position: sticky` is a relational layout property — it is controlled entirely by the ancestor hierarchy, not the element itself. Starting inward wastes turns reading irrelevant padding and component markup.

**VAT Protocol — 5-Step Outward-First Trace**:

```
[Sticky / Scroll Bug Reported]
         │
         ▼
 1. READ: docs/ssot/ui-design/spokes/SCROLL-AND-STICKY-CONTRACT.md
    → Identify which Scroll Model applies (Model A: Outer, Model B: Inner)
    → Confirm the expected scroll authority owner for this page
         │
         ▼
 2. LOCATE: Find the target component in App.jsx / DashboardLayout
    → Map the ancestor chain from DashboardLayout down to the component
    → Write out the chain explicitly (e.g. DashboardLayout → main → PageWrapper → content → target)
         │
         ▼
 3. GREP OUTWARD — scan ONLY the ancestor chain files for:
    grep -n "overflow" <ancestor files>
    grep -n "height: 100" <ancestor files>
    → Look for any overflow: hidden / auto / scroll on a non-scroll-authority ancestor
         │
         ▼
 4. CHECK: Retirement / Refactor history for ancestor files
    → git log --oneline -- <ancestor file>
    → If recently refactored: was legacy overflow/height left behind as dormant debt?
         │
         ▼
 5. SURGICAL FIX on the ancestor, not the component.
    → Match the fix to the Scroll Model from step 1 (SCROLL-AND-STICKY-CONTRACT §2)
```

**Grep commands**:

```bash
# Trace overflow conflicts in ancestor chain
grep -n "overflow" src/App.jsx src/components/layout/DashboardLayout.jsx src/pages/TaskCreationPage.jsx

# Trace height locks
grep -n "height: 100\|min-height\|max-height" src/styles/components/task-creation-modular.css src/styles/tokens/layout-tokens.css
```

**Root cause categories**:

| Symptom | Root Cause | Fix Location |
|---|---|---|
| Sticky header won't stick | `overflow: hidden/auto` on non-scroll ancestor | Remove/change overflow on that ancestor |
| Page scrolls in wrong container | Wrong scroll model (A vs B) mixed | Align page to one model per SCROLL CONTRACT §2 |
| Sticky works on desktop, breaks on mobile | Media query changes overflow | Add model-consistent mobile override |
| Legacy refactor left dormant overflow rule | Retired stepper/layout left `overflow-y: auto` behind | Remove the dormant rule; align to current model |

---

### Track F: CSS Layout Constraint — Container Hierarchy Audit (CHA)

**Scope**: Grid not multi-column, flex not wrapping, element wrong size, layout not responsive  
**SSOT**: `graphify-out/GRAPH_REPORT.md` (component communities) + `docs/ssot/ui-design/`

> [!CAUTION]
> **Bottom-Up CSS Token Trap**: Do NOT start by grepping for CSS token names (`tc-width-96`, `profile-list`, `form-section-max-width`). A bottom-up search finds the token but not its constraint context. The constraint that kills a grid is never on the grid itself — it is on an ancestor container. Grepping tokens bottom-up without knowing the parent chain turns a 3-second width calculation into 20+ turns of blind search.

**CHA Protocol — 6-Step Catalog-First Hierarchy Trace**:

```
[Grid / Layout Bug Reported]
         │
         ▼
 0. READ: dist/layout-catalog.json  ← O(1) lookup BEFORE any grep
    → Search selectors{} for the target component ID or class
    → Note pre-computed height, overflow, position, z-index, padding
    → If selector found: jump directly to step 3 (skip grepping steps 1-2)
    → If selector missing: run npm run cache:build:layout, then continue
         │
         ▼
 1. READ: graphify-out/GRAPH_REPORT.md
    → Find the component in its community cluster
    → Identify parent containers (the community hub is usually the constraining ancestor)
    → Note any "God Node" containers (high edge count = broad layout influence)
         │
         ▼
 2. READ parent component source (identified from graphify community)
    → Find max-width, width, padding on the direct parent
    → Find padding/margin on the grandparent and layout wrapper
    → Write out the full ancestor chain with their width constraints explicitly
         │
         ▼
 3. CALCULATE available width math top-down:
    Viewport → sidebar/rail → page padding → section wrapper → section padding → grid container
    → Sum all subtractions to get the actual px available to the grid
         │
         ▼
 4. COMPARE: available width vs grid's min-size requirement
    → For CSS Grid: requires (columns × minmax_min) + ((columns-1) × gap) px
    → If available < requirement → grid mathematically forced to fewer columns
    → This is the constraint — not the grid definition itself
         │
         ▼
 5. SURGICAL FIX at the constraint level:
    → Option A: Raise the ancestor max-width
    → Option B: Lower the grid cell minmax() minimum
    → Option C: Remove padding from an intermediate wrapper
    → Do NOT add more CSS to the grid container itself — that won't help
```

**Documented failure mode**:

| Anti-Pattern | What Happens | Why It Fails |
|---|---|---|
| Bottom-Up Token Grep | Search `tc-width-96` → `tc-space-40` → `profile-list` → 20+ turns | Never finds the parent constraint; finds implementation details instead |
| Component-Level CSS Fix | Add wider min-width to `.profiles-list` | Parent max-width still caps total — no visual change |
| Graphify Skip | Grep directly without reading community map | Misses the God Node ancestor that owns the constraint |

**Width math example** (from Thread 2 post-mortem, 2026-05-23):
```
Viewport: 1024px
- Sidebar: 300px → 724px remaining
- Page padding: 32px → 692px
- Section wrapper padding: 40px → 652px
- Section content padding: 40px → 612px
Grid available: 612px | Grid needs 2×320 + 20 = 660px → forced to 1 column
Root cause: .form-section max-width (780px via --tc-form-section-max-width) + ancestor paddings
```

---

### Track G: CSS Theme Override Conflict (FKL-WI-002) — model inverted by INC-063 (2026-07-12)

**Scope**: Component styles correct in default theme, visually broken (or under-styled) in one or two specific themes (Sepia, Velvet-Dark, etc.)
**SSOT**: `docs/ssot/ui-design/spokes/THEME-SYSTEM.md` (FKL-DI-003 — superseded, read the superseding note) · `src/styles/theme-tokens.css` + `src/styles/theme-utilities.css` (the `themes-enhanced.css`/`enhanced-themes.css` pair this track originally cited was retired in TASK-218 M2.5).
**Related Skill**: [.agent\skills\ui-ux-pro-max](../../.agent/skills/ui-ux-pro-max/SKILL.md) — Reference for theme-specific styles, color palettes, and WCAG AA accessibility contrast compliance verification.
**Related Pattern**: [.agent/patterns/typography-weight-and-bridge-token-enforcement.md](../../.agent/patterns/typography-weight-and-bridge-token-enforcement.md) (INC-083)

> [!NOTE]
> **The failure direction reversed.** Before INC-063, `[data-theme="sepia"/"velvet-dark"] button:not(.theme-button-secondary)` made every bare `<button>` a hijacked gradient CTA by default — the bug was an *unwanted* gradient appearing on a plain button. That selector is gone. Today the equivalent selector is `.button-theme-primary` (opt-in), so the failure this track now catches is usually the **opposite**: a button that *should* look like a branded primary CTA in these themes but renders plain because it never declared `.button-theme-primary`. If you're chasing an unwanted gradient in a theme, you're likely looking at stale intuition from before this inversion — re-check against the current CSS, don't assume the old model.

**Track G Protocol — 5-Step Theme Trace**:

```
[Component looks correct in Light/Dim-Dark, wrong in Sepia/Velvet-Dark]
         │
         ▼
 0. QUERY the maps FIRST — don't grep cold. Don't know the token name yet? Start from the
    class name instead (see Track I Step 0 for the `--style` lookup) — don't reach for a
    devtools DOM-path selector, it doesn't identify the responsible token either way.
    npm run cache:build:tokens          # if stale (regenerate is cheap, seconds)
    npm run query -- --token <theme-var-you-suspect>
    → Instantly answers: is it defined in the broken theme? Is it a gradient there
      (TOKEN-TYPE-001)? Is it consumed anywhere at all (or an orphan, INC-064 shape)?
      This answers most Track G cases without steps 1-4 below. Note the "known
      limitation": a PHANTOM finding needs the consuming selector's scope AND the full
      var() fallback chain verified before you trust it (INC-057/062/063/066 shapes) —
      the map doesn't know selector scope or whether a "missing" token has a safe fallback.
         │
         ▼
 1. CONFIRM theme specificity is the cause:
    → Switch theme in the app → observe whether style snaps to expected appearance in other themes.
    → If yes: this is a theme-scoped CSS conflict, not a JSX/state bug.
         │
         ▼
 2. GREP the current selectors — do not assume the pre-INC-063 model:
    grep -n "button-theme-primary\|theme-button-secondary" src/styles/theme-utilities.css
    grep -n "\[data-theme" src/styles/theme-utilities.css | head -20
    → Confirm which class (if any) actually governs this element in the broken theme.
         │
         ▼
 3. CHECK the component against the OPT-IN contract:
    grep -n "button-theme-primary\|theme-button-secondary" src/components/YourComponent.jsx
    → Looks plain but should be a branded primary CTA → ADD `.button-theme-primary`.
    → Renders an unexpected gradient → check for a stray `.button-theme-primary` or `.theme-button`
      class, or a DERIVE-DON'T-DECLARE gap (some other selector re-asserting the old hijack —
      run `npm run check:color-mix` / `grep -rn "button:not(" src/styles/` to confirm none remain).
         │
         ▼
 4. VERIFY across all 7 themes (Light, Dim Dark, Sepia, Velvet Dark, Grayscale, Ambient, Amb-time):
    → Switch to each theme in the running dev server and confirm styles are correct.
    → A button that looks "under-emphasized" in exactly one theme after this fix is the expected,
      SAFE failure mode (visible, easy to spot) — tag it `.button-theme-primary` and move on.
```

**When to use Track G**:
- A primary-looking action (`Save`, `Create`, `Confirm`) looks plain/unstyled in Sepia or Velvet-Dark only.
- A `<button>` renders an unexpected branded gradient it shouldn't have (check for a stray opt-in class).
- Component renders correctly in browser DevTools (correct `className`) but final computed style is different from expectation.

**The opt-in contract (post-INC-063)**:

| Element type | Should get the branded gradient treatment? | Action |
|---|---|---|
| Real primary CTA (`Save`, `Create Task`, form submit) | ✅ Yes | Add `.button-theme-primary` |
| Everything else — icon buttons, menu rows, tabs, secondary/cancel actions | ❌ No — default is now plain/neutral | Do nothing (no class needed; `.theme-button-secondary` still works but is no longer required) |

See [INC-063](../../docs/incidents/INC-063-button-theme-hijack-opt-out-default.md) for the full incident record and why the default was inverted rather than patched again.

---

### Track H: Asynchronous URL Synchronization / Deep-Link Race Conditions (P101 / FKL-DI-021)

**Scope**: Modal reopens itself immediately after closing, flashes, or interactive state gets reset on router navigation.
**SSOT**: `.agent/patterns/deep-link-hook-composition.md` · `docs/incidents/INC-053-modal-deep-link-race-condition-reopening.md`
**Rule**: Standard `P101` (Asynchronous URL Sync Ref-Guard Invariant).

> [!CAUTION]
> **Stale Parameter Read Trap**: Do NOT assume a component state-updater is broken when a modal reopens on dismiss. React state updates are batched and synchronous, but URL search parameters updates propagate asynchronously via React Router context. In the intermediate render cycle, the local state is cleared but the URL parameter is still present, triggering effect handlers.

**Track H Protocol — 4-Step Ref-Guard Verification Trace**:

```
[Deep-linked Modal Reopens or Interactive State Resets]
         │
         ▼
 1. CONFIRM state-URL synchronization mismatch:
    → Open browser console. Click "Close/Dismiss" on the modal.
    → Observe if the local state transitions to "Closed" but then immediately flips back to "Open" in the subsequent render cycle.
         │
         ▼
 2. CHECK searchParams dependency in useEffect:
    → Open the sync hook/component (e.g. `src/hooks/patterns/useTaskDeepLink.js`).
    → Find the `useEffect` that listens to `searchParams` / `location.search` to trigger opening the modal/drawer.
    → Check if it checks `!detailsModal.isOpen` before triggering open.
         │
         ▼
 3. AUDIT for useRef Guard declaration:
    → Check if the hook/component declares a `useRef` to track the ID currently being closed (e.g. `const justClosedTaskId = useRef(null);`).
    → Verify that the close action (e.g. `closeTask`) sets the ref value: `justClosedTaskId.current = taskId;` BEFORE calling state/search-params updates.
    → Verify that the `useEffect` auto-open block exits early if the current URL parameter matches the ref value:
      `if (justClosedTaskId.current === taskId) return;`
         │
         ▼
 4. VERIFY clean-up logic:
    → Ensure `justClosedTaskId.current` is set back to `null` once the URL query parameter has been successfully removed/cleared (i.e. `!taskId` in the effect) or when a new task is explicitly opened.
```

---

### Track I: Token/Theme Architecture Fragmentation (TAP-001 / TASK-218)

**Rewritten 2026-07-14 — the previous version of this track described an architecture retired months ago (see `[!CAUTION]` below). If you have this track cached from an earlier read, re-read it — the file/pipeline names changed, not just the advice.**

**Scope**: A CSS custom property (`--theme-*`, `--cic-*`, `--dt-*`, `--tc-*`) doesn't resolve to the value you expect, an element's computed style doesn't match what its class *should* produce, two components using "the same" token render differently, or you're about to grep `src/tokens/` / `src/styles/` cold to figure out where a token is defined.
**SSOT**: `docs/ssot/ui-design/spokes/THEME-SYSTEM.md` (Token Type Registry, Vocabulary Ownership, M3b evaluation) · `enhancement-notes/TASK-218-Token-Architecture-Stabilization-Program/09_CONSOLIDATION_MANIFEST.md` (current, authoritative state of every pipeline — the discovery-log files 01-08 are historical record, not current state; if they conflict with the manifest, the manifest wins)

> [!CAUTION]
> **Re-Archaeology Trap, still live, now about different facts.** The version of this track before 2026-07-14 told you to check `themes-enhanced.css`/`enhanced-themes.css` (retired, M2.5, replaced by `theme-tokens.css` + `theme-utilities.css`), to check two generated-token JS trees (`tokens/generated/` retired M1; `tokens/enhanced/` retired M1b — **both gone, neither is a live pipeline anymore**), and that `--tc-*` is "a stale migration placeholder, do not extend it" (Phase 5's original verdict — **reversed** once real usage was checked: ~2,000 live consumption sites across 16 files, one of the most-used prefix families in the codebase). Following the old advice today would send you looking for files that don't exist and avoiding a token family you're actually supposed to use. **The lesson generalizes: this doc is a snapshot, not a fixed law — check the manifest's dated status before trusting a claim here, the same way you'd distrust a stale code comment.**

**Track I Protocol — Check-the-map-first Trace**:

```
[Token/color/theme value wrong, unexpected computed style, or unclear which file owns a variable]
         │
         ▼
 0. START FROM THE CLASS NAME, not a DOM path or a guessed token name:
    → Inspect element in devtools, copy its CLASS NAME (not "Copy selector" — an nth-child DOM
      path is fragile and doesn't identify the responsible CSS or token; the class does).
    → npm run query -- --style <className>     (or grep .cache/style-map.json directly)
      → Instantly shows the consuming CSS rule(s) and every token they reference.
    → npm run query -- --token <tokenNameFromAbove>
      → Instantly answers: defined in every theme? A gradient (TOKEN-TYPE-001)? An orphan (INC-064
        shape)? A phantom (INC-057/062/063/066 shape — but verify the KNOWN LIMITATION below first).
    → This is usually 2 lookups total. Don't fall back to grepping source cold unless the map is
      stale (`npm run check:freshness`) or the class isn't found (inline Tailwind utility, not a
      named component class — grep the .jsx directly in that case).
         │
         ▼
 1. KNOW the phantom-finding limitation before trusting it as a bug (INC-066, 2026-07-14):
    → The token map flags a token "missing from theme X" whenever it's the FIRST name in a
      var(a, fallback) chain and isn't defined in every theme it's read in — even when the
      FALLBACK is fully defined everywhere and the chain was designed to rely on it (e.g.
      --theme-button-primary → var(--theme-accent), intentional, not a bug). Read the full
      var() chain at the consumption site before treating a phantom finding as a defect.
    → Separately: phantom detection doesn't parse consuming-selector SCOPE — a token defined
      only in sepia, consumed only inside `[data-theme="sepia"] .x { ... }`, is flagged as
      "missing from the other 6 themes" but isn't actually broken. Verify the selector.
         │
         ▼
 2. KNOW the current file structure (authoritative as of TASK-218 M2.5/M1b, 2026-07-14):
    → src/styles/theme-tokens.css    — ALL [data-theme]/:root custom-property DEFINITIONS. One file, one owner.
    → src/styles/theme-utilities.css — the utility classes/keyframes that CONSUME those tokens.
    → No generator produces theme-tokens.css. It is hand-authored directly — there is no
      themePresets.js → CSS pipeline to check; that idea was evaluated and ruled out (no live
      JS data source exists to generate from). Edit the CSS file directly.
    → src/tokens/enhanced/, src/tokens/generated/, and both their generator scripts are FULLY
      RETIRED (deleted). If you find a reference to either in an older doc or your own memory,
      the doc is stale — trust the filesystem (`ls src/tokens/`) over the doc.
         │
         ▼
 3. KNOW there are 3 independent token-prefix vocabularies (corrected, TASK-218 M3, supersedes
    Phase 5 Decision 5) — do not assume one covers the others, and do not treat --tc-* as dead:
    --theme-*  Theme-STATE colour (background/foreground/accent/status) — per [data-theme], theme-tokens.css
    --cic-*    Categorical/identity colour (project + tag slots) — art-directed per theme, theme-tokens.css
               (relocated from src/tokens/palette.css, retired 2026-07-15, ADR-026 amendment)
    --tc-*     The static design SCALE (spacing/radius/typography/shadow/sizing/motion) — theme-AGNOSTIC by
               design (:root only, never per-theme). ~2,000 live usages across 16 files. NOT deprecated,
               NOT narrow. Do not delete an "unused" --tc-* entry without checking sibling usage first —
               a partially-used scale (some shades/steps unused) is normal, not dead code.
    (--dt-* also exists — a second, smaller static scale overlapping --tc-*. Confirmed duplicate,
    Deferred-With-Trigger for merge, not yet executed — see THEME-SYSTEM.md § M3b. Don't extend --dt-*.)
         │
         ▼
 4. IF a color-mix()/oklch()/rgb()/hsl() call renders transparent or wrong:
    → This is TOKEN-TYPE-001 (FKL-DI-021). Check docs/ssot/ui-design/spokes/THEME-SYSTEM.md § Token Type Registry —
      a token may be a gradient string, not a solid color, and color-mix() silently returns `transparent` for gradients.
    → Run `npm run check:color-mix` to scan for any gradient-token-in-color-function violation.
         │
         ▼
 5. LOG new findings, don't just fix and move on:
    → If you find a new fragmentation/duplication pattern, or a stale doc claim like the ones
      this rewrite just corrected, fix the doc in the same session — don't leave it for the next
      reader to re-discover the hard way (that's exactly how the pre-2026-07-14 version of this
      track went stale in the first place).
    → Do NOT unilaterally consolidate/delete a competing pipeline without checking `09_CONSOLIDATION_MANIFEST.md`
      first — some consolidations are already decided (M1/M1b/M2/M2.5/M3), some are deliberately deferred (M3b).
```

**When to use Track I**:
- Grep is about to start across `src/tokens/` and `src/styles/` cold.
- A token "looks like" it should be shared but two components render it differently.
- An element's hover/active/computed color doesn't match its theme's palette — even if you don't yet know which token is responsible (start at Step 0, not by guessing a token name).
- A CSS file's header comment claims it's "canonical"/"the foundation" — verify against `09_CONSOLIDATION_MANIFEST.md`, don't trust the comment at face value (this is exactly how the retired files' claims outlived their accuracy).

---

### Track J: Agenda/Kanban Derivation Issues (TASK-222)

**Scope**: A task is missing from "Today's Agenda," appears there when it shouldn't, or lands in the wrong column of `AssociateDashboard.jsx`'s Grouped view (`To Do` / `In Progress` / `Blocked` / `Done`).
**SSOT**: `src/hooks/features/useTodayAgenda.js` (agenda derivation), `src/constants/kanbanExecutionMapping.js` (column mapping) — both pure, derived, read-only over the `tasks` SSOT; no shadow collection. `enhancement-notes/TASK-222-Execution-Oriented-Task-Orchestration/02_PHASE1_PRD.md` (FR-1/FR-2 spec + edge cases).

**Track J Protocol — 2-Layer Derivation Trace**:

```
[Task missing from Today's Agenda, or in the wrong Kanban column]
         │
         ▼
 0. IDENTIFY which layer owns the symptom — they are independent and fail differently:
    → "Missing from / wrongly in Today's Agenda" → useTodayAgenda.js (Step 1 below)
    → "In the wrong column (To Do/In Progress/Blocked/Done)" → kanbanExecutionMapping.js (Step 2 below)
    → Both can be wrong at once but have separate root causes — don't assume fixing one fixes the other.
         │
         ▼
 1. AGENDA INCLUSION (useTodayAgenda.js) — a task is included if ANY of 3 independent
    conditions hold (they are OR'd, not AND'd):
    a. task.id is in today's daily_attention_reports.taskIds (AttentionReportService.getReport,
       keyed `${userId}_${todayStr}`, todayStr = local date via toLocaleDateString('en-CA'))
    b. task.scheduledStart is the same LOCAL calendar date as today (isSameLocalDate — compares
       year/month/day, not a time-range check)
    c. task.deadline OR task.dueDate is today-or-earlier (isTodayOrOverdue) AND task.status
       (lowercased) is NOT 'completed' — a completed-but-overdue task is deliberately excluded
    → If a task with a deadline is missing: check whether task.status is already 'completed'
      first (3c's explicit exclusion) before assuming the date logic is broken.
    → If a task with no scheduledStart/deadline is missing: expected — by design (PRD edge case),
      it only appears via 3a (daily_attention_reports). It is backlog, not "today," unless
      explicitly flagged.
    → toDateObj() handles Firestore Timestamp (.toDate()), {seconds} shape, and raw Date/string —
      if a task's date field is a plain unparseable string, it silently returns null (excluded,
      not an error). Check the raw Firestore field shape before assuming the hook is broken.
         │
         ▼
 2. COLUMN ASSIGNMENT (kanbanExecutionMapping.js, getTaskKanbanColumn) — case-insensitive
    (P-CASE: `.toLowerCase().trim()` on task.status before comparison):
    → status 'completed' → Done
    → status 'in_progress' (or legacy 'in progress' with a space) AND (blockedBy.length > 0 OR
      dependency?.status === 'blocked') → Blocked
    → status 'in_progress' otherwise → In Progress
    → EVERYTHING ELSE (including 'pending' AND 'cancelled') → To Do
    → KNOWN GOTCHA: a cancelled task falls through to the To Do bucket — there is no dedicated
      Cancelled column. If a user reports "a cancelled task is showing in To Do," this is the
      current designed behavior, not a bug — confirm with the user whether a Cancelled column
      is actually wanted before changing `getTaskKanbanColumn`.
         │
         ▼
 3. CHECK the P-CASE guard is actually doing its job:
    → If a task with status 'Pending' (legacy capitalized) or 'In Progress' (with a space, legacy)
      is miscategorized, verify getTaskKanbanColumn's `.toLowerCase().trim()` ran on the actual
      field value — log `task.status` raw (not through any other transform) at the point of
      failure.
         │
         ▼
 4. IF neither layer explains the symptom, check `useMyTasks` (the upstream real-time listener
    both `useTodayAgenda` and the Grouped view read from) — a task invisible to Today's Agenda
    might simply not be in the underlying `tasks` array at all (a scoping/permission issue one
    layer up, not a derivation bug).
```

**When to use Track J**:
- "Today's Agenda" tab in `AssociateDashboard.jsx` is missing a task the user expects, or shows one they don't.
- Grouped view puts a task in the wrong execution column.
- A status-vocabulary change (TLM-009) or a new blocker/dependency field is being added and its interaction with `getTaskKanbanColumn`/`useTodayAgenda` needs tracing before shipping.

---

## Phase 2: Fix Implementation

### Fix Checklist by Bug Type

| Bug Type            | Fix Location         | Verification            |
| ------------------- | -------------------- | ----------------------- |
| Zombie Handler      | `*Module.js`         | Click works             |
| State Shadowing     | Save/update function | Value persists in state |
| DOM-Reading         | Calculation function | Uses State, not DOM     |
| InnerHTML Thrashing | Refresh function     | Scroll preserved        |
| Ghost Events        | Event listeners      | Field triggers recalc   |

### New Input Field Checklist

Before marking UI change "done":

- [ ] Input ID: `edit-{field}-{index}`
- [ ] Event listener in `setupEventDelegation`
  - Text: `input` event (debounced)
  - Dropdown: `change` event (immediate)
- [ ] Calculation function reads new value
- [ ] Save function persists to state
- [ ] Validation knows about field

---

## Phase 3: Verification

### Multi-Layer Verification

| Layer          | Check                                     | Tool                  |
| -------------- | ----------------------------------------- | --------------------- |
| **DOM**        | Element displays correct value            | DevTools Elements     |
| **State**      | `stateManager.getCurrentBill()` has value | Console               |
| **Validation** | No E/W errors                             | Click Validate button |
| **Persist**    | Value survives refresh (if saved)         | Page refresh          |

### Debug Scripts

```javascript
// Line item state
window.debugItem = (i) => console.table(stateManager.getLineItem(i));

// Full bill snapshot
window.debugBill = () =>
  console.log(JSON.stringify(stateManager.getCurrentBill(), null, 2));

// State snapshot for handoff
window.captureDebugState = () => {
  const bill = window.stateManager?.getCurrentBill();
  const snapshot = {
    timestamp: new Date().toISOString(),
    location: window.globalLocation?.id,
    billId: bill?.id,
    status: bill?.status,
    itemCount: bill?.items?.length,
    items: bill?.items?.map((i) => ({
      name: i.name,
      qty: i.qty,
      rate: i.rate,
      amount: i.amount,
      mode: i.mode || "loose",
    })),
  };
  console.log("📋 Debug Snapshot:", JSON.stringify(snapshot, null, 2));
  return snapshot;
};
```

---

## Phase 4: Handoff

### Structured Handoff Template

```markdown
## Bug Handoff: [Brief Title]

### Reproduction Steps

1. [Exact steps to reproduce]
2. [Environment: Browser, Location, User Role]
3. [Expected vs Actual behavior]

### Root Cause Analysis

- **Anti-Pattern**: [Zombie Handler / State Shadowing / DOM-Reading / InnerHTML Thrashing / Ghost Events]
- **File(s)**: [path:line_numbers]
- **Explanation**: [1-2 sentences]

### Fix Applied

- **Change**: [What was added/modified]
- **Verification**: [How to confirm fix works]

### Regression Risk

- [ ] Could affect: [Other areas that use same code]
- [ ] Tested: [Related functionality verified]
```

### Commit Message Template

```
fix(module-name): {symptom} [{anti-pattern}]

Root cause: {brief explanation}
Files: {file1}, {file2}
Tested: {verification steps}
Refs: PIO-XXX
```

---

## Phase 5: Retrospective (When Bug Took > 1 Hour)

| Question                            | Action if YES                              |
| ----------------------------------- | ------------------------------------------ |
| Did this bug type happen before?    | Add to SYSTEMATIC_DEBUGGING.md as new case |
| Was root cause a missing guardrail? | Add protocol to GEMINI.md                  |
| Did verification miss something?    | Update verification checklist              |
| Could a linter/hook have caught it? | Add automated check                        |

> If the "fix" was verified by tracing a query/hook's data correctness without separately
> confirming the render path presents that data the way the requirement asked — see
> `.agent/patterns/scoped-query-ui-presentation-gap.md`.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│ DEBUGGING TRACKS                                                │
├─────────────────────────────────────────────────────────────────┤
│ UI TRACK: *Renderer.js, *.css                                   │
│   → Zombie Handler: Method missing after switch case            │
│   → InnerHTML Thrashing: Full refresh kills scroll              │
├─────────────────────────────────────────────────────────────────┤
│ LOGIC TRACK: *Utils.js, *Service.js                             │
│   → Formula error: Wrong math in calculation                    │
│   → Input missing: Field not passed to function                 │
├─────────────────────────────────────────────────────────────────┤
│ STATE TRACK: StateManager.js                                    │
│   → State Shadowing: Value calculated but not saved             │
│   → Wrong read: Field name typo                                 │
├─────────────────────────────────────────────────────────────────┤
│ MIXED: *Module.js                                               │
│   → DOM-Reading: Calc reads DOM instead of State                │
│   → Ghost Events: Input not wired to recalc chain               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Commonly Missed Verification Steps

| Missed Check                | Consequence                 | Prevention                      |
| --------------------------- | --------------------------- | ------------------------------- |
| **Global variable leakage** | State pollution across rows | Lint: `no-var`, scope isolation |
| **Incremental testing**     | Compound issues missed      | Test after each sub-fix         |
| **Edge case coverage**      | Zeros, nulls, empty strings | Add edge case tests             |
| **Browser cache**           | Testing old code            | Hard refresh (Ctrl+Shift+R)     |
| **State after refresh**     | Persistence bugs            | Verify after page reload        |

---

## Automation Guardrails

### Code Review Questions

| Question                                   | Red Flag Answer                 |
| ------------------------------------------ | ------------------------------- |
| Does the new input have an event listener? | No / "Assumed it would work"    |
| Is the calculated value saved to state?    | "It's displayed in the DOM"     |
| Does the calculation read from state?      | "It reads from the input field" |
| Is scroll/focus preserved after update?    | "We refresh the whole grid"     |

---

## Appendix A: Known Issue Index (Module-Specific)

> **When to use**: After generic checks don't resolve the issue, check module-specific known issues.

### Expense-Staging Module

| Symptom                       | Root Cause                                  | Solution                   | Generic Step |
| ----------------------------- | ------------------------------------------- | -------------------------- | ------------ |
| Blank screen                  | CSS `display: none`                         | Add `.visible` class       | Track A      |
| Validation banner shows 0     | Data at bill-level, read at item-level      | Fix adapter                | Track C      |
| Error rows not highlighted    | `attachValidationToItems` misses errors     | Parse both errors/warnings | Track D      |
| Dropdown shows wrong options  | `categories` vs `masterLists.categories`    | Use correct data path      | Track B      |
| New module blank after adding | Missing closing `</div>` on previous module | Check parent nesting       | Track A      |
| Empty columns after submit    | Field not set by UI                         | Trace UI→State→Backend     | Track C      |
| Button fires twice            | Missing `type="button"`                     | Add to all action buttons  | Track A      |
| Toggle mode ignored           | Reading from DOM instead of State           | Use StateManager           | Track D      |

### Backend/API Issues

| Symptom                     | Root Cause                    | Solution                  | Generic Step        |
| --------------------------- | ----------------------------- | ------------------------- | ------------------- |
| CORS error with 200 OK      | GAS crash before jsonResponse | Check Apps Script logs    | See TROUBLESHOOTING |
| "Unknown action"            | GAS not deployed              | Redeploy with new version | See TROUBLESHOOTING |
| Session.getActiveUser error | Web app context               | Wrap in try-catch         | Track B             |

---

## Appendix B: Turbo Grep Commands

> **When to use**: Quick pattern searches during debugging. Copy-paste ready.

### UI Investigation

// turbo

```powershell
# Find HTML element by data-action
Select-String -Path "public/**/*.js" -Pattern 'data-action="actionName"' -Recurse
```

// turbo

```powershell
# Find event listener switch case
Select-String -Path "public/js/modules/**/\*Module.js" -Pattern "case 'actionName':" -Recurse
```

// turbo

```powershell
# Verify method exists
Select-String -Path "public/js/modules/**/*.js" -Pattern "methodName\(\) {" -Recurse
```

### State Investigation

// turbo

```powershell
# Find state update calls
Select-String -Path "public/js/modules/**/*.js" -Pattern "updateLineItem|setState" -Recurse
```

// turbo

```powershell
# Find DOM reads in calculation files (anti-pattern)
Select-String -Path "public/js/modules/**/utils/*.js" -Pattern "querySelector|getElementById" -Recurse
```

### DOM Investigation

// turbo

```powershell
# Find innerHTML replacement (thrashing risk)
Select-String -Path "public/js/modules/**/*.js" -Pattern "innerHTML\s*=" -Recurse
```

---

## Reference

- [SYSTEMATIC_DEBUGGING.md](../docs/SYSTEMATIC_DEBUGGING.md) (6-step methodology + Cases 6.A-6.F)
- [GEMINI.md Protocol #15](../GEMINI.md) (Classification tree)
- [DEBUGGING_HANDBOOK.md](../docs/DEBUGGING_HANDBOOK.md) (Full case studies)

---

**Last Updated**: 2026-06-20
**Origin**: PIO-050 Debugging Session Retrospective, PIO-052 Event Propagation Fix

---

## 🔑 Registered Knowledge Items (FKL)

<details>
<summary>🔑 FKL Item Header (FKL-WI-002)</summary>

```yaml
---
fkl_id: FKL-WI-002
fkl_type: WorkflowImprovement
source:
  - eur-001/m6-ingestion
  - WT-02
  - WT-04
promoted_from: ""
applies_to:
  - TabButton
  - PillSwitcher
  - SegmentedControl
  - any self-styled button in themed contexts
workflow_activation:
  - WT-02
  - WT-04
  - WT-05
promotion_status: Active
superseded_by: ""
content_ref: .agent/workflows/debug-frontend.md
---
```
</details>

### FKL-WI-002: CSS Theme Override Conflict — Track G (Workflow Improvement)
Added **Track G** to `debug-frontend.md` and symptom `[K]` to the Phase 0 decision tree. This gives agents a 4-step inspection sequence for diagnosing component styles that are correct in default themes but visually broken (gradients injected, colors overridden) in specific themes like Sepia or Velvet-Dark. The root cause is the global `button:not(.theme-button-secondary)` selector in `themes-enhanced.css` which acts as a universal theme reset layer. Without this track, agents spend 30+ turns reading JSX state and component CSS before discovering the conflict is in a global theme file. See **Case Study 5.15** in `DEBUGGING_HANDBOOK.md` for the full incident record.

<details>
<summary>🔑 FKL Item Header (FKL-WI-003)</summary>

```yaml
---
fkl_id: FKL-WI-003
fkl_type: WorkflowImprovement
source:
  - enhancement-notes/TASK-218-Token-Architecture-Stabilization-Program/01_PHASE1_DISCOVERY_LOG.md
  - User_Created/Discussion Threads/Governance/TokenGovernance/TAP-001 — Token Architecture Stabilization Program.md
promoted_from: ""
applies_to:
  - src/tokens/*
  - src/styles/*.css
  - src/config/option-registry.js
  - src/contexts/ThemeContext.jsx
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: .agent/workflows/debug-frontend.md
---
```
</details>

### FKL-WI-003: Token/Theme Architecture Fragmentation — Track I (Workflow Improvement)
Added **Track I** to `debug-frontend.md` and symptom `[L]` to the Phase 0 decision tree, routing any token/color/theme-resolution investigation to `enhancement-notes/TASK-218-Token-Architecture-Stabilization-Program/01_PHASE1_DISCOVERY_LOG.md` before a fresh grep sweep. TAP-001's own Phase 1 discovery documented 8+ findings (D1-D8): two CSS files that both self-claim canonical status (`themes-enhanced.css` + `enhanced-themes.css`), 4 independent token-prefix vocabularies (`--theme-`, `--cic-`, `--dt-`, `--tc-`), a second-order CIC derivation layer (`option-registry.js:getTagStyle`), a gradient-vs-solid-color contract (TOKEN-TYPE-001/FKL-DI-021), and two parallel generated-token output trees (`tokens/enhanced/` vs `tokens/generated/`) both live. Without this track, an agent re-derives this topology from scratch — the exact "knowledge discovery cost, not implementation cost" failure mode the TAP-001 charter thread's retrospective (Query/Response 1.7) identified as consuming ~75% of a prior session's effort. Debugging fixes found via this track must still respect Phase 1-5 discipline: log new findings to the discovery log, do not unilaterally consolidate competing pipelines (that's a Phase 5 Architecture Council decision).
