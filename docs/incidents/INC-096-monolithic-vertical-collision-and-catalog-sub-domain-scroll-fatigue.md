# INC-096 — Monolithic Vertical Collision & Catalog Sub-Domain Scroll Fatigue (`#catalogViewSection`)

**Incident ID**: `INC-096`  
**Date**: `2026-09-24`  
**Severity**: High (Cognitive Overload / ~1,800px Scroll Roadblock / Deep-Link Collision)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `P-SHOPPING-JOURNEY-HUBS-001`, `AC-DEC-2026-037`, `UI-DEC-2026-033`  
**Affected Components**: `shopping_src/components/body.html`, `shopping_src/styles/03_stores_and_items.css`, `shopping_src/scripts/controller.js`  
**Related Patterns**: `.agent/patterns/two-tier-workspace-subview-decoupling.md`, `.agent/patterns/declarative-option-clustering-and-consensus.md`  

---

## Architectural Surface Mapping

1. **UI Surface**: `#catalogViewSection` within the Shopping module contains the primary visual inventory for wedding procurement.
2. **Data Surface**: Zero data corruption; 44 items, 8 stores, 5 chapters, and clustered pods are preserved.
3. **Reactive Surface**: Clicking cross-context links (e.g. store names, chapter milestones, alternatives) previously triggered uncoordinated scrolling across a massive 2,400px page height.
4. **Service Surface**: No service layer failure.
5. **Module Surface**: Conflation of 4 distinct operational domains inside a single linear scroll container.
6. **Governance Surface**: Codified `P-SHOPPING-JOURNEY-HUBS-001` in Council Ledger (`AC-DEC-2026-037` / `UI-DEC-2026-033`).

---

## 1. Executive Summary & Symptom

When opening `#tab-shopping` in Catalog view, users were confronted with four heavy, vertically stacked containers:
1. `#shoppingStepper` (5-Day Bhubaneswar Itinerary — ~320px)
2. `#shoppingClusterPods` (Clustered Decision Pods — ~450px)
3. `#shoppingStoreNavigator` (8-Store Retail Directory & Navigation — ~380px)
4. `#itemsGrid` (Master 44-Item Wardrobe Checklist — ~1,200px)

This linear vertical stacking created ~1,800px of scroll depth before a user could view or interact with the first item in the inventory checklist. Furthermore, deep links with competing query parameters (`cluster`, `store`, `chapter`, `item`, `subview`) collided without deterministic resolution, and physical printing was coupled to browser CSS states.

---

## 2. The 9-Step Diagnostic Engine

### Step 1: Root Cause Timeline & Technical Anatomy
- **Introduction**: As features were added during trousseau curation (itinerary planning, decision pods, store navigation, and checklists), each section was appended as a top-level block inside `#catalogViewSection`.
- **Incorrect Assumption**: Assumed that keeping all domains in a single scrollable document provided "everything in one place."
- **The Reality**: The 4 sections represent completely different cognitive mindsets:
  - *Itinerary*: Temporal schedule planning (days, phases).
  - *Decision Pods*: Deliberative consensus and voting among competing looks.
  - *Store Navigator*: Physical geography and vendor transit logistics in Bhubaneswar.
  - *Items Checklist*: Granular tactical execution (buying, budgeting, checking off items).
  Forcing all 4 mindsets into a single linear column forced users to mentally filter out ~1,800px of non-actionable cards every time they wanted to inspect an item.

### Step 2: Escape Analysis
- **Why was it not caught by existing automated tests?**
  Automated tests in `scripts/test-shopping-registry.cjs` assert the *existence* of DOM IDs (`#shoppingStepper`, `#shoppingClusterPods`, `#shoppingStoreNavigator`, `#itemsGrid`) and data schemas. They do not evaluate scroll fatigue, cognitive load, or viewport presentation clarity.
- **Discovery**: User prompt identified the exact problem: *"so many sections under document.querySelector('#catalogViewSection') .. isnt it overwhelming . can u define the problem i am trying to point out here"*.

### Step 3: Systemic Weaknesses
Lack of an explicit **Two-Tier Navigation Architecture**: having Level 1 Workspaces (`Catalog`, `Table`, `Survey`) without Level 2 Operating Modes inside the rich Catalog workspace.

### Step 4: Change Impact Analysis
Decoupling the 4 domains via a sticky operating mode subnav (`#catalogSubnavStrip`) while permanently preserving all IDs in the DOM guarantees:
- 0px scroll depth to the checklist as the default anchor.
- Zero DOM deletions, maintaining 100% automated test suite compatibility.
- Seamless focused workflows for each stakeholder group.

### Step 5: Missed Signals
Visual inspection showed the user scrolling through multiple viewports before encountering item cards.

### Step 6: Preventive Guardrails
1. **Operating Mode Invariant (`INV-SDCA-MODE-001`)**: Rich SPA catalog tabs with $\ge 3$ distinct functional domains must implement a sticky Level 2 operating mode subnav with an immediate 0px execution anchor.
2. **Non-Destructive Container Hiding**: Inactive mode containers must be hidden using `display: none !important`, while active containers must never have forced display overrides (preserving their native CSS Grid and Flexbox structures).
3. **Decoupled Independent Print Rule**: Physical printing must unroll all sections using `display: revert !important;` in `@media print` without depending on browser view modes.
4. **Deterministic Precedence Ladder**: Deep-link parameter parsing must enforce unambiguous priority: `cluster` ➔ `store` ➔ `chapter` ➔ `item` ➔ `subview` ➔ fallback `items`.

### Step 7: Generalized Defect Pattern
**Monolithic Domain Stacking & Deep-Link Precedence Ambiguity**: Stacking multiple complex sub-domains into a single vertical scroll container without progressive disclosure or modal sub-navigation.

### Step 8: Repository Scan
Audited Decorator Cockpit and Decision Registry — both already utilize partitioned tabs, carousels, or drawers.

### Step 9: Knowledge Capture
- Codified into `.agent/patterns/two-tier-workspace-subview-decoupling.md`.
- Ratified in Council Ledger as `AC-DEC-2026-037` / `UI-DEC-2026-033`.

---

## 3. Remediation & Code Changes

1. **Markup Enhancement (`shopping_src/components/body.html`)**:
   - Injected `#catalogSubnavStrip` with semantic `role="tablist"` and 5 operating mode buttons (`items`, `itinerary`, `clusters`, `stores`, `all`).
   - Set `#catalogViewSection` initial state to `class="mode-items"`.
2. **Styling & Print Decoupling (`shopping_src/styles/03_stores_and_items.css`)**:
   - Added sticky `.catalog-subnav-strip` with `top: var(--shopping-sticky-offset, 12px)`.
   - Added non-destructive container hiding for `.mode-items`, `.mode-itinerary`, `.mode-clusters`, and `.mode-stores`.
   - Added independent `@media print` unrolling via `display: revert !important;`.
3. **Controller & Navigation API (`shopping_src/scripts/controller.js`)**:
   - Implemented `setCatalogSubView(subview, targetId)`.
   - Implemented `jumpToStore(storeNameOrId)`, `jumpToChapter(chapterId)`, and `focusCluster(clusterId)`.
   - Added store DOM IDs in `renderStores()`.
   - Added interactive jump links on item cards and cluster option cards.
   - Enforced the canonical deterministic precedence ladder in `parseUrlParams()`.
4. **Dual-Release Compilation**:
   - Rebuilt `shopping-registry.html` and `shopping-fragment.html` with 100% byte parity to `public/`.

---

## 4. Certification & Verification

- `npm run test:shopping` — `100% GREEN` (all 44 items, 8 stores, and subnav contracts verified).
- `npm run verify:modular-architecture` — `45/45 PASSED`.
- `npm run verify:ui-lifecycle` — `100% GREEN`.
- `npm run verify:deployment` — `10/10 LAYERS PASSED`.
- `fc.exe /b shopping-registry.html public\shopping-registry.html` — `100%` byte identical.
