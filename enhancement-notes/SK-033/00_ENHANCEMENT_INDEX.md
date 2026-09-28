# SK-033: Universal Column Visibility & Print Data Masking Engine

## 📊 Metadata
- **Category**: UI QUALITY / PRINTS / ARCHITECTURE / DATA PRIVACY
- **Priority**: HIGH
- **Status**: IN_PLANNING
- **Estimate**: 4 Phases
- **Target Release**: v2.10.0
- **Risk Level**: LOW
- **Council Ruling**: `AC-DEC-2026-076` / `UI-DEC-2026-056` (FULL COUNCIL CERTIFIED, 2026-09-28)
- **Governing Standard**: `STD-TABLE-COL-VIS-001` / `INV-TABLE-COL-MASK-001` / `STD-TABLE-BUDGET-001` / `STD-UI-INTERACTION-SPEC-001`
- **Cluster**: UI Quality Enhancement Cluster

## 🔗 Dependencies
- **Depends On**: `SK-032` (Smart Cohesive Page-Break Orchestration), `SK-031` (Print Themes & Options Dialog), `SK-029` (Proportional Table Budgeting)
- **Blocks**: None

## 🎯 Goal

Provide customizable column visibility and sensitive data masking for printable tables and run sheets:
1. **Dynamic Column Selection Checkboxes**:
   Allow coordinators to select precisely which columns to include or omit when generating print run sheets.
2. **Confidential Data Masking Invariant (`INV-TABLE-COL-MASK-001`)**:
   Completely omit unselected columns from the print sandbox DOM tree (rather than merely hiding them via CSS), guaranteeing confidential financial details (unit prices, budgets, cash totals) and private family relationship markers cannot leak to external vendors or general event guests.
3. **1-Click Audience Presets**:
   Provide pre-configured role presets in the Pre-Print Options Dialog:
   - `Full Operational Dossier`: All 8 columns included for core coordinators.
   - `Elder Consultation Run Sheet`: Masks commercial/procurement IDs and internal costs; highlights ceremonial titles, specifications, and physical verification checkboxes.
   - `Vendor / Logistics Handover`: Masks internal budgets and private family relationships; isolates deliverables, counts, and verification signatures.
4. **Dynamic Proportional Width Re-Budgeting (`STD-TABLE-BUDGET-001`)**:
   Automatically re-normalize remaining column percentages to 100% when columns are omitted, preventing table border collapse, broken headers, or ugly dead space voids.
5. **Decoupled Architecture (`STD-MOD-COMP-001`)**:
   Implement via standalone zero-dependency primitive `ui_primitives/scripts/column_visibility_engine.js` (<300 lines), protecting `print_engine.js` from monolithic bloat.

---

## 4-Phase Definition of Done (DoD v1.7) & Sequential Phasing

| Phase | Scope & Deliverables | Validation Gate (VG) | Decision Node (DN) | Status |
|---|---|---|---|---|
| **Phase 1: Core Column Visibility Engine & Contract Test Harness** | Scaffold `ui_primitives/scripts/column_visibility_engine.js` with column registration, state management, and proportional width re-budgeting; author `scripts/test-column-visibility-contract.cjs`. | **VG-1**: Contract test passes 100% green; width normalization sums to 100%; modular limit <500 lines. | **DN-1**: Verify mathematical stability of column width redistribution. | ✅ **COMPLETED** |
| **Phase 2: Pre-Print Options Dialog Integration & Role Presets** | Add "Columns & Privacy Masking" section to `print_options_modal.html`; implement 3 audience presets (`Full`, `Elder`, `Vendor`); wire bidirectional sync with `print_engine.js`. | **VG-2**: Headless test verifying checked/unchecked columns correctly omit DOM elements in `skPrintContainer` sandbox. | **DN-2**: Verify touch target compliance (>=44px) and 3-trigger dismissibility. | 🟡 **IN_PROGRESS / READY** |
| **Phase 3: Interactive Screen Table Toolbar Integration** | Expose optional `[👁️ Columns]` toggle dropdown on high-density table toolbars (`#oblTableInnerToolbar`); wire `localStorage` column persistence. | **VG-3**: Screen table dynamically hides/shows columns without page reload; accordion tables remain cohesive. | **DN-3**: Confirm mobile table scroll container maintains `min-width` integrity. | ⚪ **QUEUED** |
| **Phase 4: SDCA Compilation, Byte Parity & Cross-Repo Packaging** | Recompile all SDCA surfaces via `build.cjs`; assert 100% byte parity to `/public`; package as `PKG-010` for ecosystem distribution via `/sap-sync`. | **VG-4**: 100% dual-release byte parity; all 69 modular checks green; exit code 0 across all verification suites. | **DN-4**: Formal release readiness sign-off for v2.10.0. | ⚪ **QUEUED** |

---

## 📜 Architectural Invariant (`STD-TABLE-COL-VIS-001`)

1. **Rule 1 (DOM Omission over CSS Hiding)**: In print mode, unselected columns must be physically excised from the cloned print DOM before transmission to the print driver (`INV-TABLE-COL-MASK-001`). Never rely on `visibility: hidden` which leaves whitespace voids and exposes text to scrapers.
2. **Rule 2 (Mathematical Width Normalization)**: Whenever columns are removed from a `table-layout: fixed` container, the remaining column percentage widths must be dynamically scaled by `100 / sum(remaining_widths)` to maintain 100% full-width grid alignment (`STD-TABLE-BUDGET-001`).
3. **Rule 3 (Role Preset Priority)**: Presets must never overwrite individual custom checkbox selections without explicit user action. Clicking a preset updates all checkboxes; subsequently toggling a checkbox unselects the preset tag.
4. **Rule 4 (Decoupled Modularity)**: Column visibility logic must reside in `ui_primitives/scripts/column_visibility_engine.js`, not inline inside `print_engine.js` or `controller.js`.
