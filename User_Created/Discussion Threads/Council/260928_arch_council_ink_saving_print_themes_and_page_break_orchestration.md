# Architecture & UI Council Deliberation: Universal Ink-Saving Print Engine, Configurable Themes & Accordion Page-Break Orchestration

**Date**: 2026-09-28  
**Convened By**: Architecture Council & UI/UX Council  
**Quorum**:
- 🏛️ Lead Systems Architect (`ARCHITECTURE_SPEC.md` Guardian)
- 🎨 UI/UX Design System & Craft Auditor (`impeccable` / `STD-UI-INTERACTION-SPEC-001`)
- 📄 Print & Tabular Run Sheet Artisan (`tabular-run-sheet-artisan` / `STD-UI-PRINT-CONTAINER-001`)
- 📱 Responsive Viewport & Mobile Ergonomics Auditor (`mobile-ui-validator`)
- 🛡️ Governance & Quality Gatekeeper (`STD-STRUCTURAL-CONTRACT-001`)
- 🪓 Simplicity & Maintainability Dissenter (Ponytail Dissenter)

**Rulings Certified**:
- `AC-DEC-2026-072` (Universal Ink-Saving Print Engine & Page-Break Orchestration)
- `UI-DEC-2026-054` (Executive Wireframe Print Aesthetic & Pre-Print Options Ergonomics)
- **Governing Standard**: `STD-UI-PRINT-RUNSHEET-002` (Ink-Saving Print Standards & Pagination Invariants)
- **Cluster**: UI Quality Enhancement Cluster
- **Enhancement Ticket**: [`SK-031`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-031/00_ENHANCEMENT_INDEX.md)

---

## 1. Problem Statement & Empirical Defect Analysis

### 1.1 The Black Header Toner Drain Defect
In both `@media print` in `shopping_src/styles/11_obligations_table_and_print.css` and the shared container print engine `ui_primitives/scripts/print_engine.js`:
```css
/* Defective Print Styles */
.obl-table-milestone-header {
  background: #000000 !important;
  color: #ffffff !important;
  padding: 4px 8px !important;
}
th {
  background: #000000 !important;
  color: #ffffff !important;
}
```
**Empirical Consequences**:
1. **Severe Toner Depletion**: Solid black filled rectangles consume up to 90–100% ink coverage across large horizontal header strips. When printing 53 customary obligations across 8 event milestones, an elder's home printer or office laser jet drains significant toner unnecessarily.
2. **Paper Warping & Smudging**: In standard inkjet printers, massive saturation of black ink causes regular 75–80 GSM A4 paper to crinkle and warp, taking minutes to dry and smudging when handled during rituals.
3. **Legibility Degradation**: Reverse text (white letters on wet black ink) suffers from "ink bleed," filling in small loops in fonts (e.g. `e`, `a`, `o`, and Odia script characters).
4. **Lack of User Autonomy**: Users who want clean wireframe printouts are forced to manually open generated PDFs in Acrobat or external editors to strip background fills.

### 1.2 The Split Accordion / Orphan Header Defect
When printing multi-milestone tables:
1. `.obl-table-milestone-block` was set to `page-break-inside: avoid !important;`.
2. However, major wedding milestones like `EVT-004` (Reception) or `EVT-003` (Hastaganthi / Vedic Nuptials) contain 12–15 detailed obligations, exceeding the height of a single A4 page (~700px printable height).
3. When an element is taller than a physical page, the browser's Paged Media layout engine **cannot satisfy `break-inside: avoid`**. It must break the element.
4. Without explicit `break-after: avoid` on the milestone header (`.obl-table-milestone-header`), browsers frequently print the milestone header bar at the bottom 20mm of Page 1, while breaking the table to the top of Page 2, creating an unsightly **orphaned header**.
5. Furthermore, hosts organizing physical handover dossiers often want **each milestone on its own page** (e.g. Page 1: Mangala Krushna, Page 2: Ring Ceremony, Page 3: Hastaganthi) so binders can be tabbed and distributed to distinct family elders.

---

## 2. Multi-Disciplinary Council Evaluation of Options

### Option 1: Static CSS Inversion Only (Zero Configuration)
- **Description**: Hardcode an ink-saving wireframe style into `@media print` and `print_engine.js`, replacing dark fills with white backgrounds and 1.5px black borders. Add `break-after: avoid`.
- **Strengths**: Zero UI footprint, zero extra clicks, immediate 95% ink savings on every print vector (Ctrl+P and button).
- **Weaknesses**: Cannot satisfy user demand for configurable pagination (continuous vs milestone-per-page) or executive gray tint vs stark wireframe.

### Option 2: Pre-Print Configuration Modal / Drawer in `ui_primitives/`
- **Description**: Intercept the `[🖨️ Print Sheet]` click with an interactive Print Preview & Options Drawer with live iframe preview and theme/pagination toggles.
- **Strengths**: Full user control; delivers print preview and configurable options directly in the web app.
- **Weaknesses**: More complex UI state machine; requires maintaining a live preview renderer.

### Option 3: Two-Tier Certified Hybrid (Universal Default + Configurable Station)
- **Description**:
  - **Tier 1 (Universal Safety Net - Out of the Box)**: Invert the default print stylesheet in both `@media print` and `ui_primitives/scripts/print_engine.js` to **Eco Wireframe** (`#ffffff` background, `#000000` text, crisp 1.5px/2px structural borders, and `break-after: avoid`). Even if a user prints via browser shortcut (`Ctrl + P`), zero toner is wasted and headers never orphan.
  - **Tier 2 (Configurable Engine Options)**: Upgrade `window.skPrintContainer(target, options)` to accept declarative print options:
    ```javascript
    options = {
      theme: 'eco' | 'tint' | 'contrast', // default: 'eco'
      pageBreaks: 'smart' | 'milestones', // default: 'smart'
      orientation: 'landscape' | 'portrait'
    };
    ```
    Injects `data-print-theme` and `data-print-pagebreak` into the print sandbox body, dynamically activating scoped print rules.
  - **Tier 3 (Accessible Print Options Popover)**: Provide a lightweight, accessible options popover next to `[🖨️ Print Sheet]` in `#shoppingObligationsView`, letting the user choose their preferred ink mode and page-break structure with persistent preferences in `localStorage`.
  - **Tier 4 (Cross-Repo Ecosystem Standard)**: Codify standard `STD-UI-PRINT-RUNSHEET-002` and pattern `ink-saving-print-themes-and-page-break-orchestration.md` across Sree Krushna, Task-Dashboard, and OperatusOS.

---

## 3. Deliberation & Verdict by Council Domain

### 3.1 Lead Systems Architect
- **Verdict**: APPROVE Option 3 (Certified Hybrid).
- **Rationale**: Isolating print themes and pagination options as declarative data attributes on the print sandbox document decouples the presentation engine from host application state. The architecture guarantees zero-toner defaults while providing structured configuration.

### 3.2 UI/UX Design System & Craft Auditor (`impeccable`)
- **Verdict**: APPROVE Option 3.
- **Craft Principles**:
  - **The Executive Wireframe Aesthetic**: Replace the heavy black block with an architectural, high-contrast bordered header:
    - Background: `#ffffff !important;`
    - Text: `#0f172a !important; font-weight: 700; font-size: 11px;`
    - Border: `1.5px solid #0f172a; border-left: 6px solid #0f172a;`
    - Padding: `6px 10px;`
    - Counter Badge: `border: 1px solid #cbd5e1; background: #f8fafc; color: #475569;`
  - This looks cleaner, more official, and infinitely more dignified on paper than an ink-drenched black rectangle.

### 3.3 Tabular Run Sheet Artisan (`tabular-run-sheet-artisan`)
- **Verdict**: APPROVE Option 3.
- **Pagination Specifications**:
  - **Anti-Orphan Header Invariant**: `.obl-table-milestone-header { break-after: avoid !important; page-break-after: avoid !important; }`.
  - **Table Column Header Continuity**: `.obl-data-table thead { display: table-header-group !important; }`.
  - **Row Integrity**: `.obl-data-table tr { break-inside: avoid !important; page-break-inside: avoid !important; }`.
  - **Milestone-per-Page Mode**: When `data-print-pagebreak="milestones"` is active, apply `break-before: page !important; page-break-before: always !important;` to `.obl-table-milestone-block:not(:first-child)`.

### 3.4 Simplicity & Maintainability Dissenter (Ponytail Dissenter)
- **Challenge**: "Why not just change `#000000` to `#ffffff` in CSS and stop there? Why build a popover and options engine?"
- **Resolution**:
  - A pure CSS inversion fixes the ink problem, but leaves the user unable to print "one milestone per page" for family binders, which was explicitly requested.
  - The hybrid approach keeps Tier 1 purely in CSS (zero JS dependencies for standard printing) and adds Tier 2 as a lightweight configuration layer of under 60 lines of code inside the already-existing `print_engine.js`. This provides maximum utility with minimal code bloat.

---

## 4. Formal Rulings & Invariant Codification

### Ruling `AC-DEC-2026-072`: Universal Ink-Saving Print Engine & Page-Break Orchestration
1. **`INV-INK-SAVER-001` (Zero-Toner Default)**: All printable views across all modules and applications must use pure white backgrounds (`#ffffff`) and crisp structural borders (`1.5px–2px solid #0f172a`) by default. Solid dark fills (`#000000`, `#111111`, `#222222`) are strictly prohibited in default print stylesheets.
2. **`INV-PAGE-BREAK-ORCH-001` (Anti-Orphan Header Invariant)**: Grouping headers preceding tabular data must enforce `break-after: avoid !important; page-break-after: avoid !important;`. Table header groups (`<thead>`) must enforce `display: table-header-group !important;`.

### Ruling `UI-DEC-2026-054`: Executive Wireframe Aesthetic & Pre-Print Options
1. Printable milestone headers must adopt the Executive Wireframe aesthetic (white background, bold 6px left accent border, high-contrast black typography, bordered badge).
2. The print engine must support user-selectable print themes (`eco`, `tint`, `contrast`) and pagination modes (`smart`, `milestones`) via declarative sandbox data attributes.

---

## 5. Certification Sign-Off

✅ **UNANIMOUSLY CERTIFIED BY ARCHITECTURE & UI COUNCIL QUORUM** (`AC-DEC-2026-072` / `UI-DEC-2026-054`)

- Enhancement ticket **`SK-031`** is formally registered in `ENHANCEMENT-MASTER-REGISTRY.md` and `docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md`.
- 4-Phase Definition of Done (DoD v1.7) matrix is codified in `enhancement-notes/SK-031/00_ENHANCEMENT_INDEX.md`.
- Phase 1 Implementation Plan is generated via `writing-plans` in `enhancement-notes/SK-031/implementation_plan.md`.
