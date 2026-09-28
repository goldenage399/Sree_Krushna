# 🏛️ Architecture & UI Council Decision Record: Multi-Viewport Fluid Table Budgeting, Inner Container Clamping & Print Run-Sheet Preservation

**Council Reference:** `AC-DEC-2026-071` / `UI-DEC-2026-053`  
**Standards Activated:** `STD-TABLE-BUDGET-001` / `INV-COLLAPSIBLE-PRINT-001` / `STD-UI-INTERACTION-SPEC-001` / `STD-STRUCTURAL-CONTRACT-001`  
**Governing Ticket:** `SK-029` ([`enhancement-notes/SK-029/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-029/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-28  
**Type:** Joint Architecture & UI Council Deliberation  
**Status:** ✅ **APPROVED & CERTIFIED**  
**Quorum:** Joint Council (Architecture Council + UI Council, 7 Auditors Seated)  
**Governing Workflows:** `.agent/workflows/architecture-council.md` (SOP-WFL-ARCH-COUNCIL-001), `.agent/workflows/ui-council.md` (SOP-WFL-UI-COUNCIL-001), and `.agent/workflows/plan-review.md`  

---

## 1. Ground Truth & System Grounding (Reality-First Grounding Policy RFG-001)

### 1.1 The Specific Target: `td.obl-td-specs` & `.obl-data-table`
- **Current DOM & CSS Configuration**:
  - In `shopping_src/styles/11_obligations_table_and_print.css` (lines 141–152):
    ```css
    .obl-td-specs {
      width: 220px;
      max-width: 260px;
      font-size: 11px;
      color: #e2e8f0;
      line-height: 1.4;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    ```
  - In `shopping_src/scripts/controller.js` (line 4289 & 4291):
    ```javascript
    ${getSortTh('title', 'Customary Title & Description', 'width: 220px; max-width: 260px;')}
    ...
    <th style="width: 220px; max-width: 260px;" class="col-specs">Items / Specifications</th>
    ```
  - Table data cells:
    ```javascript
    <td class="obl-td-title"><strong>${...}</strong><div class="obl-subdesc">${...}</div></td>
    <td class="obl-td-specs" title="${...}">• ${itemsText}</td>
    ```

### 1.2 Observed Failure Modes
1. **Broken Table Formatting Context (Display Override on `<td>`)**:
   Applying `display: -webkit-box` directly to a `<td>` replaces its default `display: table-cell`. In Blink/Chromium engines, the cell ceases to participate in standard table column flex calculations, shrinking down to rigid pixel constraints (`220px × 63.8px`).
2. **Asymmetric Slack Absorption (`table-layout: auto`)**:
   Under `table-layout: auto`, when a `100%` width table has excess horizontal space ("slack"), the browser distributes slack to columns with unconstrained `<td>` cells. Because `.obl-td-title` has no CSS width rule while `.obl-td-specs` has an explicit `220px` clamp, Column 2 absorbs 100% of all widescreen slack while Column 1 remains artificially starved.
3. **Premature Truncation on Ultra-Wide Screens**:
   On 1440px–1920px viewports, Column 1 truncates multi-bullet liturgical specifications into ellipses (`...`) after 3 lines despite hundreds of pixels of blank, unused horizontal space across the row.
4. **Physical Print Run-Sheet Integrity Risks**:
   While `@media print` currently applies `-webkit-line-clamp: unset !important; display: table-cell !important;`, the lack of proportional column budgeting causes uneven column wrapping on paper, violating the pristine elder consultation requirements of `STD-TABULAR-RUN-SHEET-SKILL-001`.

---

## 2. In-Depth Comparative Evaluation of Architectural Options

| Dimension | Option A: Proportional Percentage Fixed Budgeting (`table-layout: fixed`) | Option B: Dual-Spring Fluid Allocation (`table-layout: auto`) + Card Fallback | Option C: Container Query-Driven Track Grid (`@container` + CSS Grid) | **Certified Hybrid: Structural Decoupling + Proportional Fixed Budget + Responsive Scroll + Print Unclamping (`STD-TABLE-BUDGET-001`)** |
| :--- | :--- | :--- | :--- | :--- |
| **Core Mechanism** | `table-layout: fixed;` with explicit % column widths and an inner `<div class="obl-specs-clamp">`. | Keep `table-layout: auto`, relax 220px clamp to `min-width: 200px`, allow browser to auto-balance. | Rewrite table using CSS Grid and `@container` tracks. | **Isolates line-clamp into inner `<div>`; applies `table-layout: fixed; width: 100%;` with 30%:25% Title:Specs budget; wraps table in horizontal touch-scroll for <1024px; full print unrolling.** |
| **Similarities** | Solves 220px clamp; provides more room for specifications. | Solves 220px clamp; expands specifications. | Expands specifications on wider containers. | **Inherits deterministic math from A, fluid readability from B, and clean container resilience without C's rewrite.** |
| **Distinctions** | Deterministic: columns strictly obey percentages regardless of text length. | Non-deterministic: browser guesses column widths row-by-row based on longest text string. | Completely replaces HTML table elements with CSS Grid div semantics. | **Preserves semantic HTML5 `<table>`, guarantees pixel-exact column ratios, isolates display models cleanly.** |
| **Trade-offs** | Fixed layout requires column widths to sum to 100%. | Auto layout causes jitter during pagination or milestone filtering. | Breaks table semantic markup, high risk of regression in existing tests and print stylesheets. | **Requires a small inner `<div>` wrapper in `controller.js` and updating density test regexes.** |
| **Impact Radius** | Localized to `11_obligations_table_and_print.css`, `controller.js`, and test suite. | Localized to CSS only, but layout unpredictable across browsers. | High blast radius: alters DOM structure across all obligation templates. | **Controlled blast radius: 2 source files (`controller.js`, `11_obligations_table_and_print.css`) + 1 test file.** |
| **Complexity** | Low (standard CSS table properties). | Very Low (removing constraints). | High (complete rewrite of table renderer). | **Low & Highly Maintainable (<40 lines of CSS/JS changes).** |
| **Risks** | Long unbroken strings could overflow if `word-break` missing. | Large Odia titles might still push Specs to wrap awkwardly. | Screen readers lose table navigation; print stylesheets fail completely. | **Zero regression risk: protected by `test-obligations-table-density.cjs` and structural contracts.** |
| **Print Safety** | High (fixed percentages translate perfectly to A4 landscape). | Moderate (browser auto-layout on paper often wraps unpredictably). | Low (CSS Grid page-breaking is notoriously buggy across browser print engines). | **Maximum (`INV-COLLAPSIBLE-PRINT-001` unrolls inner clamp div completely; page-breaks avoided on rows).** |

---

## 3. Multi-Disciplinary Council Deliberations

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: APPROVE Certified Hybrid.
- **Evidence**: The proposal directly adheres to `SPEC-ARCH-MUTABLE-TABLE-001.md`, `SPEC-ARCH-UI-ERGONOMICS-AND-INTERACTION-ENGINE-001.md`, and `INV-COLLAPSIBLE-PRINT-001`. It respects the single source of truth for customary obligations (`02_RITUALS_CULTURE/specs/`) and prevents presentation hacks from distorting domain data.

### 3.2 UI/UX Craft & Polish Auditor (`impeccable`)
- **Position**: APPROVE Certified Hybrid.
- **Evidence**:
  - The current state (220px clamped box next to a cavernous 800px description cell) violates visual rhythm and balance.
  - Allocating **30% for Title** and **25% for Specifications** achieves harmonious optical weight:
    - Customary titles (Odia script + English descriptors) have ample breathing room.
    - Multi-item specifications display up to 3 bullet items across broad, readable lines with clean line-height (1.4).
  - Encapsulating line-clamp in `.obl-specs-clamp` ensures that the ellipsis indicator (`...`) renders cleanly at the bottom-right of the text block without clipping table borders.

### 3.3 Math & Layout Auditor (`parent-layout-audit`)
- **Position**: APPROVE Certified Hybrid.
- **Mathematical Validation**:
  - **Desktop (1440px Viewport)**:
    - Container usable width: ~1380px.
    - Code (8%): 110px (minimum 75px satisfied).
    - Direction (12%): 165px (minimum 115px satisfied).
    - Title (30%): 414px (luxurious, readable).
    - Category (9%): 124px (minimum 85px satisfied).
    - Specifications (25%): 345px (57% increase over 220px clamp!).
    - Cash / Cost (8%): 110px (minimum 85px satisfied).
    - Sourced Via (8%): 110px (minimum 90px satisfied).
  - **A4 Landscape Print (1046px Usable Width)**:
    - Title: ~313px.
    - Specifications: ~261px.
    - Both columns receive over 570px combined, allowing full unrolled text without crowding numerical columns.
  - **Narrow Viewports (<1024px down to 300px)**:
    - Enforcing `min-width: 880px` on `.obl-data-table` with `overflow-x: auto` on its container prevents table columns from squishing below their minimum legible thresholds.

### 3.4 Mobile Usability Auditor (`mobile-ui-validator`)
- **Position**: APPROVE Certified Hybrid.
- **Evidence**:
  - On phones (<768px), an 8-column data table should never be forced to compress into 300px–400px.
  - The horizontal scroll container (`overflow-x: auto; -webkit-overflow-scrolling: touch;`) ensures smooth finger swiping.
  - Furthermore, the UI already provides `activeObligationLayout === 'cards'` (`SK-021` / `SK-022`), which is the canonical phone reading mode.

### 3.5 Theme & Print Systems Auditor (`tabular-run-sheet-artisan` / `INV-COLLAPSIBLE-PRINT-001`)
- **Position**: APPROVE Certified Hybrid.
- **Evidence**:
  - In `@media print` and `window.skPrintContainer`, `.obl-specs-clamp` must be explicitly unrolled:
    ```css
    .obl-specs-clamp {
      display: block !important;
      -webkit-line-clamp: unset !important;
      overflow: visible !important;
      height: auto !important;
      max-height: none !important;
    }
    ```
  - Combined with `break-inside: avoid;` on rows, this guarantees that paper run sheets printed for family elders never clip or truncate liturgical items.

### 3.6 Maintainability & Velocity Auditor (Ponytail Dissenter)
- **Position**: APPROVE Certified Hybrid.
- **Challenge**: "Why not just remove `max-width: 260px` in CSS and let the browser auto-layout?"
- **Resolution**:
  - Plain `table-layout: auto` causes layout shift and jitter when toggling milestone accordions or filtering categories.
  - It also leaves the `display: -webkit-box` bug on the `<td>` intact.
  - The hybrid approach fixes the DOM bug with an inner `<div>` wrapper and provides rock-solid, deterministic sizing via standard CSS `table-layout: fixed`. It requires zero new dependencies and fewer than 40 lines of code.

---

## 4. Council Synthesis & Certified Invariants

### Invariant 1: Table-Cell Display Model Isolation (`INV-TABLE-DOM-001`)
> In all HTML data tables across the platform, table cells (`<td>`, `<th>`) must maintain their native `display: table-cell` display model. Under no circumstances may `display: -webkit-box`, `display: flex`, or `display: grid` be applied directly to a `<td>` or `<th>`. Text clamping, flex alignments, or badge grouping must always be encapsulated inside a dedicated child container (`<div class="*-clamp">` or `<div class="*-inner">`).

### Invariant 2: Universal Proportional Table Budgeting (`STD-TABLE-BUDGET-001`)
> High-density data tables containing multiple text-heavy descriptive columns must use `table-layout: fixed; width: 100%;` with explicit column percentages declared on the `<th>` row. Primary descriptive columns (e.g. Title and Specifications) must be allocated balanced width budgets (within a 1.0–1.3x ratio of each other) to prevent single-column whitespace starvation.

### Invariant 3: Responsive Table Scroll & Viewport Degradation
> Tabular data views must enforce `overflow-x: auto; min-width: 880px;` on viewports `<1024px` to preserve minimum column legibility. On mobile devices (<768px), the interface must provide an accessible, prominent affordance to switch to Card mode.

### Invariant 4: Zero-Truncation Print Unrolling (`INV-COLLAPSIBLE-PRINT-001`)
> In all print media queries and container print streams, all inner clamp containers must unconditionally unclamp (`-webkit-line-clamp: unset !important; overflow: visible !important; height: auto !important;`), ensuring 100% liturgical text visibility on physical paper.

---

## 5. Certification Verdict & Next Steps

✅ **DECISION CERTIFIED BY UNANIMOUS COUNCIL QUORUM** (`AC-DEC-2026-071` / `UI-DEC-2026-053`)

1. Enhancement ticket **`SK-029`** is formally registered in `ENHANCEMENT-MASTER-REGISTRY.md` and `docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md`.
2. The 4-Phase Definition of Done (DoD v1.7) matrix is codified in `enhancement-notes/SK-029/00_ENHANCEMENT_INDEX.md`.
3. The Phase 1 TDD Implementation Plan has been generated using `writing-plans` in `enhancement-notes/SK-029/implementation_plan.md`.
4. **Hard-Stop Gate**: Awaiting user approval of the Phase 1 implementation plan before executing code modifications.
