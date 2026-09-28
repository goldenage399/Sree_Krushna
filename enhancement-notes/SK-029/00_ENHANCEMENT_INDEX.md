# SK-029: Multi-Viewport Fluid Table Budgeting, Inner Container Clamping & Print Run-Sheet Preservation

## 📊 Metadata
- **Category**: UI QUALITY / ARCHITECTURE / ERGONOMICS
- **Priority**: HIGH
- **Status**: IN_PLANNING
- **Estimate**: 4 Phases
- **Target Release**: v2.9.7
- **Risk Level**: LOW
- **Council Ruling**: `AC-DEC-2026-071` / `UI-DEC-2026-053` (FULL COUNCIL CERTIFIED, 2026-09-28)
- **Governing Standard**: `STD-TABLE-BUDGET-001` / `INV-COLLAPSIBLE-PRINT-001` / `STD-UI-INTERACTION-SPEC-001`
- **Cluster**: UI Quality Enhancement Cluster

## 🔗 Dependencies
- **Depends On**: `SK-024` (Table density & column constraints), `SK-025` (Collapsible table accordions & print unrolling)
- **Blocks**: None

## 🎯 Goal

Resolve the asymmetric table column expansion defect where `Customary Title & Description` greedily absorbs all surplus table width while `Items / Specifications` remains rigidly clamped to 220px, establish an ergonomic multi-viewport layout budget, and preserve paper print run-sheet integrity:
1. **Structural Decoupling (`INV-TABLE-DOM-001`)**: Extract `display: -webkit-box` and `-webkit-line-clamp: 3` off the `<td>` tag into an inner wrapper container (`<div class="obl-specs-clamp">`), restoring native `display: table-cell` behavior to `.obl-td-specs`.
2. **Proportional Column Budgeting (`STD-TABLE-BUDGET-001`)**: Migrate `.obl-data-table` to `table-layout: fixed; width: 100%;` with a calibrated percentage budget allocating fluid horizontal space harmoniously between Title (30%) and Specs (25%), eliminating premature widescreen truncation and empty whitespace voids.
3. **Multi-Viewport Ergonomics (`STD-UI-INTERACTION-SPEC-001`)**: Guarantee responsive horizontal touch-scrolling (`overflow-x: auto; min-width: 880px`) on tablet/mobile viewports (`<1024px`), with a tactile prompt to switch to Cards mode on phone viewports (`<768px`).
4. **Zero-Truncation Print Run-Sheet Preservation (`INV-COLLAPSIBLE-PRINT-001`)**: Enforce complete unrolling of both Title and Specs in `@media print` and container print streams (`window.skPrintContainer`), ensuring elders receive 100% uncut liturgical specifications on A4 landscape paper.

---

## 4-Phase Definition of Done (DoD v1.7) & Sequential Phasing

| Phase | Scope & Deliverables | Validation Gate (VG) | Decision Node (DN) |
|---|---|---|---|
| **Phase 1: Structural Decoupling & Test Contract Update** | Isolate line-clamp into `<div class="obl-specs-clamp">` in `shopping_src/scripts/controller.js`; update `shopping_src/styles/11_obligations_table_and_print.css` to remove `-webkit-box` from `.obl-td-specs`; update `scripts/test-obligations-table-density.cjs` to assert inner wrapper contract. | **VG-1**: `node scripts/test-obligations-table-density.cjs` passes; `.obl-td-specs` retains `display: table-cell`; `.obl-specs-clamp` enforces 3-line clamp with tooltip. | **DN-1**: Confirm inner wrapper does not violate structural contract rules or break tag balance. |
| **Phase 2: Proportional Table Budgeting & Multi-Viewport Styling** | Enforce `table-layout: fixed; width: 100%;` on `.obl-data-table`; allocate percentage widths (Code: 8%, Dir: 12%, Title: 30%, Cat: 9%, Specs: 25%, Cash: 8%, Sourced: 8%); configure horizontal touch-scroll wrapper (`min-width: 880px`) for viewports `<1024px`. | **VG-2**: Visual inspection on 1920px (Desktop), 1366px (Laptop), and 768px (Tablet); verify Title and Specs expand in proportional harmony; verify horizontal scroll operates cleanly without layout breaks. | **DN-2**: Verify no column header or content wraps awkwardly at standard 1280px laptop width. |
| **Phase 3: Print Run-Sheet Unclamping & Container Isolation** | Enhance `@media print` and `window.skPrintContainer` scoped rules in `11_obligations_table_and_print.css`; ensure `.obl-specs-clamp` unclamps completely (`-webkit-line-clamp: unset !important; overflow: visible !important; height: auto !important;`); enforce `break-inside: avoid;` on rows. | **VG-3**: Test print stream rendering on Chrome headless / print preview; verify 100% of items and descriptions unroll on paper with zero ellipsis cutoffs across all 53 obligations. | **DN-3**: Confirm milestone page breaks adhere to A4 landscape margins without orphaned single rows. |
| **Phase 4: SDCA Compilation, Byte Parity & Regression Sweeps** | Compile SDCA via `node shopping_src/build.cjs`; synchronize `shopping-registry.html` and `shopping-fragment.html` to root and `public/`; execute complete regression suite (`npm run test:obligations`, `npm run verify:modular-architecture`, `npm run verify:ui-lifecycle`, `npm run verify:deployment`). | **VG-4**: 100% byte parity between root and `public/`; all 64 modular checks green; all 10 deployment gate layers pass with exit code 0. | **DN-4**: Formal release readiness sign-off for v2.9.7. |

---

## 📜 Architectural Invariant (`STD-TABLE-BUDGET-001`)

1. **Rule 1 (Table-Cell Isolation)**: In all HTML data tables, never apply `display: -webkit-box` or flexbox overrides directly to `<td>` or `<th>` elements. Line-clamp constraints must be encapsulated inside dedicated inner container elements (`<div class="*-clamp">`).
2. **Rule 2 (Deterministic Proportional Budgeting)**: Tabular datasets with multiple text-heavy columns must use `table-layout: fixed; width: 100%;` with explicit percentage column budgeting to prevent single-column slack absorption.
3. **Rule 3 (Fluid Spring Harmony)**: Primary descriptive columns (e.g. Title and Specifications) must be allocated balanced width shares (within a 1.0–1.3x ratio of each other) to prevent premature truncation of one while the other wastes whitespace.
4. **Rule 4 (Print Unclamping Preservation)**: All inner clamp containers must unconditionally unclamp in print media (`-webkit-line-clamp: unset !important; overflow: visible !important; height: auto !important;`) per `INV-COLLAPSIBLE-PRINT-001`.
