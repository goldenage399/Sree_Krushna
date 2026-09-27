# INC-100 — Mutable Table Pseudo-Card Degradation & Cross-Domain Conflation (`#shoppingTableBody`)

**Incident ID**: `INC-100`  
**Date**: `2026-09-27`  
**Severity**: High (Broken Tabular Semantics / Visual Layout Degradation / Cross-Domain Conflation)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: User & Antigravity Agent  
**Governing Standard**: `P-TABLE-DOMAIN-SEPARATION-001`, `AC-DEC-2026-034`, `Directive 2.2 / SK-021`  
**Affected Components**: `shopping_src/components/table_view.html`, `shopping_src/styles/06_mutable_table.css`, `shopping_src/scripts/controller.js`  
**Related Patterns**: `.agent/patterns/table-domain-separation-and-mobile-scroll.md`, `.agent/patterns/two-tier-workspace-subview-decoupling.md`  

---

## 6-Surface Impact Assessment

1. **UI Surface**: Table rows under `#shoppingTableBody > tr:nth-child(2)` rendered as stacked, borderless vertical blocks with duplicate labels (`data-col-label`) and missing column headers instead of a clean horizontal spreadsheet table.
2. **Data Surface**: Zero schema drift or corruption; all 44 canonical items and Firestore live price/status fields remained intact.
3. **Reactive Surface**: The controller tracked an experimental `tableState.displayMode = 'cards'`, mutating table class names and triggering pseudo-element styling upon toggle or breakpoint resize.
4. **Service Surface**: No service layer failure.
5. **Module Surface**: Conflation of the **Decision / Curation Domain** ("What do we want?") with the **Procurement / Execution Domain** ("What are we doing about it?") inside the Mutable Table component.
6. **Governance Surface**: Retired experimental Cards mode; reconciled [`SPEC-ARCH-MUTABLE-TABLE-001.md`](file:///d:/GitHub_Repo/Sree_Krushna/docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md) (`FKL-DI-025`, `FKL-AL-009`, `FKL-WI-006`); registered `SK-021` in `ENHANCEMENT-MASTER-REGISTRY.md` and `UI-QUALITY-ENHANCEMENT-CLUSTER.md`.

---

## 1. Executive Summary & Root Cause

### Symptom
When inspecting a row in the Mutable Table (`document.querySelector("#shoppingTableBody > tr:nth-child(2)")`), users observed that the row rendered as an unformatted vertical stack of labels and input boxes with missing column headers rather than a high-density spreadsheet grid.

### Root Cause
An experimental layout switcher (`#tableLayoutSwitcher`) and CSS rule `.shop-data-table.mode-cards` were introduced to solve mobile responsiveness. Instead of using standard horizontal touch-scrolling, the CSS applied `display: block` to `<thead>`, `<tbody>`, `<tr>`, and `<td>`, hiding headers and injecting column labels via `td::before { content: attr(data-col-label); }`. 

Because a data table lacks high-resolution lookbook photography, Pinterest intake pods, and visual card styling, this transformation turned the spreadsheet into a degraded, broken-looking wireframe. More fundamentally, it violated **Domain Separation**: attempting to turn an accounting spreadsheet into an ad-hoc visual showroom.

---

## 2. The 9-Step Diagnostic Engine

### Step 1: Root Cause Timeline & Technical Anatomy
- **Origin**: In earlier responsiveness iterations (`AC-DEC-2026-034`), an experimental "Cards" mode was drafted under the assumption that wide tables cannot be easily edited on mobile.
- **The Trap**: The CSS pseudo-element collapse stripped all tabular column structure without providing the rich media benefits of a true Card surface.
- **The Domain Conflation**:
  - *Curation Surface* (Catalog): Built for visual inspiration, lookbook browsing, and consensus.
  - *Execution Surface* (Ledger): Built for rapid numerical accounting, live status tracking, and tailoring notes.
  Merging these into one surface corrupted the user experience of both.

### Step 2: Escape Analysis
- **Why was it not caught by existing automated tests?**
  Automated tests in `scripts/test-shopping-registry.cjs` validated DOM node presence and data contracts (`assert(tbody)`), but did not check rendered bounding boxes or visual column alignment.
- **Discovery**: User explicitly tested the selector in DevTools:
  *"whats going on ? document.querySelector("#shoppingTableBody > tr:nth-child(2)"). #shoppingTableBody this seems to be missing the formatting... If this is so, then why do we even need a separate trousseau catalog What justifies the different requirements of Trousseau catalog and live mutable table grid can you please explain"*

### Step 3: Systemic Weaknesses
1. Lack of a strict invariant: *A surface never becomes the owner of a fact because it displays or edits it.*
2. Attempting to solve mobile ergonomics by destroying table markup semantics rather than providing container touch-scrolling.

### Step 4: Resolution (Directive 2.2 — Path A: Clean Separation)
1. **Permanent Cards Mode Retirement**:
   - Removed `#tableLayoutSwitcher` markup from `shopping_src/components/table_view.html`.
   - Deleted all `.mode-cards` CSS rules from `shopping_src/styles/06_mutable_table.css`.
   - Purged `displayMode` from `shopping_src/scripts/controller.js`.
2. **Pure Tabular Responsive Ergonomics**:
   - Pinned left key column (`td.sticky-col`) with solid background and elevation shadow.
   - Enabled smooth hardware-accelerated touch-scrolling (`overflow-x: auto; -webkit-overflow-scrolling: touch`).
   - Sized all touch targets $\ge 44 \times 44\text{px}$ for mobile.
3. **Bi-Directional Cross-Surface Navigation ($\le 2$ interactions)**:
   - Added `[👁️]` button on table rows $\to$ jumps to Catalog with 3s gold pulse.
   - Added `[📊 Ledger]` button on catalog cards $\to$ jumps to Table with 3s row pulse.

---

## 3. Recurrence Prevention & Invariant Lock (Directive §10)

1. **What allowed Cards mode to exist?**
   An ad-hoc attempt to solve mobile table responsiveness using CSS pseudo-elements rather than horizontal touch-scrolling with sticky key columns.
2. **What domain/surface ambiguity enabled it?**
   Failing to strictly decouple the **Decision / Curation Domain** from the **Procurement / Execution Domain**.
3. **What projection/editing ambiguity enabled it?**
   The conflation between projecting item facts for accounting vs owning the visual look selection experience.
4. **What pre-flight check should have caught it?**
   Responsive verification requiring true tabular scrolling semantics across mobile viewports rather than structural DOM/CSS collapses.
5. **Where is that check now documented/enforced?**
   Codified in `SPEC-ARCH-MUTABLE-TABLE-001.md`, `GEMINI.md` (`INV-SDCA-004`), `.agent/patterns/table-domain-separation-and-mobile-scroll.md`, and enforced by deleting all `.mode-cards` code paths.
6. **How will future work prevent accidental domain ownership?**
   Invariant: *A surface never becomes the owner of a fact because it displays or edits it.* Instant 1-tap cross-navigation (`[👁️]` $\leftrightarrow$ `[📊 Ledger]`) provides seamless handoffs without feature duplication.
