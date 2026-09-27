# SK-022: Family Obligations Tabular View, Dual Card/Table Mode & Printable Run Sheet Architecture (STD-SHOPPING-OBLIGATION-002)

## 📊 Metadata

- **Category**: UI_QUALITY / BUSINESS_LOGIC / PRINT_ARCHITECTURE
- **Priority**: HIGH
- **Status**: COMPLETED
- **Estimate**: 8 hours
- **Target Release**: v2.9.1
- **Risk Level**: LOW-MEDIUM (Additive UI subview mode; zero mutation to underlying `OBL` data schema)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]` & `[BUSINESS-LOGIC]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-020  # Customary Family Obligation Register & Multi-Domain Fulfilment Pipeline
    - SK-005  # Multi-Viewport Responsive Modernization (P-MULTI-VIEWPORT-RESPONSIVE-001)
    - SK-008  # Universal Canonical Planning Engine (STD-PLANNING-ENGINE-001)
  related:
    - AC-DEC-2026-061  # Ratification of OBL-001 Family Obligation Model
    - AC-DEC-2026-062  # Shopping Tab Family Obligation Integration & Subview Navigation
    - AC-DEC-2026-064  # Family Obligations Tabular View & Printable Run Sheet Architecture
    - 02_RITUALS_CULTURE/obligations/family_obligations_master.md
    - js/obligations-data.js
  blocks:
    - None
```

---

## 🎯 Goal

Resolve the cognitive overload and paper printability gap in the Customary Family Obligations subview (`#shoppingObligationsView`) by delivering:
1. **Immediate High-Density Printable Run Sheet**:
   - Provide an ink-friendly, zero-bloat standalone HTML and Markdown table formatted specifically for A4 landscape printing and family elder review.
2. **In-App Dual Card/Table View Mode**:
   - Add a tactile layout switcher (`[🗂️ Cards] ⟷ [📊 Table]`) to `#shoppingObligationsView`, mirroring the proven mutable table paradigm (`AC-DEC-2026-034`).
   - The table mode provides an 8-column high-density spreadsheet: Code (`OBL-###`), Milestone (`EVT-###`), Direction (Obligor ⟶ Recipient), Title & Description, Category, Quantity/Items, Financial/Cash, and Sourcing Link (`TRS-###`).
3. **Dedicated Ink-Friendly `@media print` Engine**:
   - Upgrade `shopping_src/styles/10_obligations.css` with dedicated print rules that suppress dark backgrounds, hide toolbars/buttons, force black-on-white high contrast, enforce clean page-breaks by milestone, and append coordinator sign-off check-boxes.
4. **100% SDCA Integrity & Dual-Release Byte Parity**:
   - Maintain strict SDCA modularity (`<500` lines per component/css file) and pass `test:shopping`, `test:obligations`, and `verify:modular-architecture`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Standalone Printable Run Sheet & Markdown Master Table Generator
- [x] **Printable Standalone HTML**: Author `public/family-obligations-run-sheet.html` featuring high-density CSS table, print stylesheet (`@page { size: A4 landscape; margin: 10mm; }`), and zero CDN dependencies.
- [x] **Canonical Markdown Table**: Generate `02_RITUALS_CULTURE/obligations/family_obligations_table.md` detailing all 49 obligations sorted chronologically by ritual milestone.
- [x] **CLI Test Baseline**: Author `scripts/test-obligations-table.cjs` verifying that every one of the 49 canonical obligations is represented in the table output with correct fields.
- [x] **Validation Gate (VG-1)**: `node scripts/test-obligations-table.cjs` passes 100% with all 49 records verified.

### Phase 2: SDCA Component & Controller Dual Layout Integration (`[🗂️ Cards] ⟷ [📊 Table]`)
- [x] **Markup Component**: Add layout switcher (`#oblLayoutSwitcher`) and `<table class="shop-data-table" id="obligationsDataTable">` to `shopping_src/components/obligations_view.html`.
- [x] **Controller Logic**: Implement `window.setObligationLayoutMode('cards'|'table')` and `renderObligationsTable()` in `shopping_src/scripts/controller.js`.
- [x] **Sort & Filter Sync**: Connect search, family side filter, category pills, and milestone dropdown seamlessly across both card and table layouts.
- [x] **Validation Gate (VG-2)**: Interactive toggling between Cards and Table mode preserves active filter and search state without UI glitches.

### Phase 3: Dedicated Print Stylesheet & Ink-Saving A4 Formatting
- [x] **Print Stylesheet**: Add dedicated `@media print` rules in `shopping_src/styles/11_obligations_table_and_print.css`:
  - Suppress navigation bars, header banners, action buttons, search inputs, and filter pills (`display: none !important;`).
  - Force `#shoppingObligationsView` and `#obligationsDataTable` visible with pure white background and black text (`#000000`).
  - Set page-break rules (`page-break-inside: avoid;`) on milestone groups and rows.
  - Render coordinator/elder sign-off checkboxes (`[ ] Handed Over | Verified by: ___________`).
- [x] **Validation Gate (VG-3)**: Browser print preview (Ctrl+P) renders a clean, multi-page A4 landscape run sheet with zero background clipping or wasted toner.

### Phase 4: SDCA Compilation, Byte Parity & Pre-Flight Verification Gate
- [x] **Compilation**: Run `node shopping_src/build.cjs --all` emitting root and `/public` artifacts.
- [x] **Byte Parity**: Confirm 100% byte parity between root (`shopping-registry.html`, `shopping-fragment.html`) and `/public/`.
- [x] **Modular Verification**: Run `npm run verify:modular-architecture` ensuring `11_obligations_table_and_print.css` (218 lines) and `obligations_view.html` (129 lines) stay under 500 lines.
- [x] **Full Regression**: Execute `npm run test:shopping`, `node scripts/test-obligations-table.cjs`, and `npm run verify:governance-wiring:all`.
- [x] **Validation Gate (VG-4)**: All automated test suites and pre-flight gates pass 100% green.
