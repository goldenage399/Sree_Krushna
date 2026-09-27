# SK-021: Shopping Surface Architecture — Clean Domain Separation & Cards Mode Retirement

> **Governing Directive**: [`User_Created/Discussion Threads/Shopping/260924_Shopping_UI_UPGRADES.md:L1381-L1732`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Shopping/260924_Shopping_UI_UPGRADES.md#L1381-L1732)  
> **Directive Decision**: **Choose Path A — Clean Separation.**  
> - **Catalog = Decision / Curation Surface** ("What do we want?")  
> - **Ledger (Mutable Table) = Operational / Execution Surface** ("What are we doing about it?")  
> - **Retire the experimental Mutable Table Cards mode completely.** Do not merge Catalog and Ledger into one hybrid experience.

---

## 📊 Metadata

- **Category**: ARCHITECTURE / DOMAIN_SEPARATION / UI_UX
- **Priority**: HIGH
- **Status**: COMPLETED
- **Estimate**: 8 hours
- **Target Release**: v2.9.1
- **Risk Level**: LOW (Confined strictly to `shopping_src/` SDCA components, styles, and controller)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-005  # Multi-Viewport Responsive Modernization & Ergonomic Architecture
    - SK-013  # Interactive Multi-Look Lightbox Carousel
    - SK-020  # Customary Family Obligation Register & Multi-Domain Fulfilment Pipeline
  related:
    - 04_PROCUREMENT_VENDORS/shopping_and_trousseau/SPEC-PROC-TROUSSEAU-001.md
    - docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
    - User_Created/Discussion Threads/Shopping/260924_Shopping_UI_UPGRADES.md (Directive 2.2)
  blocks:
    - None
```

---

## 🎯 Architectural Invariants & Requirements

1. **Clean Separation of Domains & Surfaces**:
   - **Domains own meaning**:
     - *Shopping Item*: Stable identity anchor (`shoppingItemId`, `title`, `category`, `chapterId`, `role`, `spec`).
     - *Decision & Curation*: Candidate looks, selected candidate, consensus approvals, styling comments.
     - *Procurement & Execution*: Vendor, actual price, purchase status, tailoring notes, delivery, payment.
   - **Surfaces own experience**:
     - *Catalog* (`#catalogViewSection`): Reads Shopping Item + Decision projections. Issues Decision commands. Displays limited Procurement data.
     - *Ledger* (`#shoppingTableViewSection`): Reads Shopping Item + Procurement projections. Issues Procurement commands. Displays approved Decision data.
   - **Critical Rule**: A surface never becomes the owner of a fact because it displays or edits it.
2. **Complete Retirement of Cards Mode**:
   - Remove `#tableLayoutSwitcher` (`[📊 Table]` / `[🗂️ Cards]`) from `shopping_src/components/table_view.html`.
   - Remove all `.shop-data-table.mode-cards` and `.mode-cards` CSS rules from `shopping_src/styles/06_mutable_table.css`.
   - Remove `setTableLayoutMode`, `tableState.displayMode`, and `layout=cards` URL param parsing from `shopping_src/scripts/controller.js`.
   - No reachable code path remains for Cards mode across renderer, route, flag, param, or breakpoint.
3. **Mobile Ledger Usability (True Table Ergonomics)**:
   - Mobile preserves the *same* Ledger workflow with responsive arrangements, not a second semantic workflow.
   - Sticky frozen `Item Title & Code` column pinned to left (`position: sticky; left: 0; z-index: 2`).
   - Smooth horizontal scroll container (`overflow-x: auto; -webkit-overflow-scrolling: touch`).
   - Touch targets $\ge 44 \times 44\text{px}$ for all buttons, selects, and inputs on mobile.
   - Zero clipped or overlapping essential controls.
4. **Bi-directional Cross-Surface Navigation ($\le 2$ interactions)**:
   - **Ledger $\rightarrow$ Catalog**: Each table row in `shoppingDataTable` provides a `[👁️]` quick-action button calling `window.jumpToCatalogItem(itemId)` that switches to the Catalog view, scrolls directly to the item card, and triggers a highlight pulse.
   - **Catalog $\rightarrow$ Ledger**: Each catalog card in `#itemsGrid` provides a `[📊]` quick-action button calling `window.jumpToLedgerItem(itemId)` that switches to the Ledger view, scrolls to the table row, and highlights it.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Pre-Implementation Audit & Cards Mode Full Retirement
- [x] **Pre-Implementation Audit**: Document domain vs surface boundaries and verify read/write command paths per Directive §8.
- [x] **Template Cleanup**: Remove `#tableLayoutSwitcher` from `shopping_src/components/table_view.html`.
- [x] **CSS Retirement**: Delete all `.mode-cards` rules from `shopping_src/styles/06_mutable_table.css`.
- [x] **Controller Cleanup**: Purge `tableState.displayMode`, `setTableLayoutMode`, and `layout=cards` from `shopping_src/scripts/controller.js`.
- [x] **Validation Gate (VG-1)**: Zero references to `mode-cards` or `tableLayoutSwitcher` in codebase.

### Phase 2: Mobile Ledger Table Polish & Touch Target Optimization
- [x] **Sticky Column Panning**: Verify `sticky-col` is pinned on mobile with clean shadow and backdrop contrast.
- [x] **Touch Target Compliance**: Enforce $\ge 44\text{px}$ touch targets on inputs, selects, and action icons in `06_mutable_table.css`.
- [x] **Input Field Usability**: Optimize `.table-price-input`, `.table-status-select`, and `.table-notes-input` for seamless mobile typing.
- [x] **Validation Gate (VG-2)**: Verify Ledger workflow functions on viewports: 360×800, 390×844, 768×1024, $\ge 1024$.

### Phase 3: Bi-directional Cross-Surface Navigation (Catalog $\leftrightarrow$ Ledger)
- [x] **Ledger $\rightarrow$ Catalog Navigation**: Implement `window.jumpToCatalogItem(itemId)` with tab switch and card highlight pulse.
- [x] **Catalog $\rightarrow$ Ledger Navigation**: Implement `window.jumpToLedgerItem(itemId)` with tab switch and row highlight pulse.
- [x] **UI Integration**: Wire `[👁️]` button in table action cell and `[📊 Ledger]` button in catalog card action bar.
- [x] **Validation Gate (VG-3)**: Verify navigation in both directions takes $\le 2$ interactions.

### Phase 4: SDCA Compilation, Byte Parity & Recurrence Prevention
- [x] **Rebuild Distributions**: Run `node shopping_src/build.cjs --all` with 100% byte parity to `/public`.
- [x] **Recurrence Prevention Documentation**: Formulate durable recurrence prevention answers per Directive §10.
- [x] **Test Gates**: Execute `npm run test:shopping`, `npm run test:obligations`, `npm run verify:modular-architecture`, and `npm run verify:governance-wiring:all`.

---

## 🛡️ Recurrence Prevention & Architectural Exit Criteria (Directive §10)

1. **What allowed Cards mode to exist?**
   - An ad-hoc attempt to solve mobile table responsiveness using CSS pseudo-elements (`td::before { content: attr(...) }`) rather than standard horizontal touch-scrolling with sticky frozen key columns.
2. **What domain/surface ambiguity enabled it?**
   - Failing to strictly decouple the **Decision / Curation Domain** ("What do we want?") from the **Procurement / Execution Domain** ("What are we doing about it?"). This led to the Mutable Table attempting to become a pseudo-catalog without the rich visual lookbook semantics of the Catalog surface.
3. **What projection/editing ambiguity enabled it?**
   - The conflation between projecting item facts for accounting vs owning the visual look selection experience. When the table tried to render card layouts, it stripped column headers and created an unformatted wireframe look.
4. **What pre-flight check should have caught it?**
   - Responsive verification requiring true tabular scrolling semantics across mobile viewports rather than structural DOM/CSS collapses, alongside verification of zero duplicate layout modes within a single surface.
5. **Where is that check now documented/enforced?**
   - Codified in `SPEC-ARCH-MUTABLE-TABLE-001.md`, `GEMINI.md` under `INV-SDCA-004`, and permanently enforced by removing all `.mode-cards` code paths.
6. **How will future work prevent a surface from becoming an accidental domain owner?**
   - Invariant: A surface never becomes the owner of a fact because it displays or edits it. Catalog remains the Decision surface; Ledger remains the Execution surface. Seamless cross-surface navigation (`[👁️]` on table rows, `[📊 Ledger]` on catalog cards) enables 1-tap context switching with highlight pulse, removing any motivation to replicate functionality across surfaces.
