# SK-024: Shopping Module Architecture Streamlining, Column Space Optimization & Obligations Table Controls (STD-SHOPPING-OBLIGATION-002 / P-OBLIGATION-RECONCILIATION-001)

## 📊 Metadata

- **Category**: UI_QUALITY / ARCHITECTURE / UX
- **Priority**: HIGH
- **Status**: IMPLEMENTED
- **Estimate**: 10 hours
- **Target Release**: v2.9.3
- **Risk Level**: LOW (Localized to `shopping_src/`, purely additive and responsive hardening)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`, `[BUSINESS-LOGIC]`, and `[UX]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-020  # Customary Family Obligation Register & Multi-Domain Fulfilment Pipeline
    - SK-022  # Family Obligations Tabular View, Dual Card/Table Mode & Printable Run Sheet Architecture
    - SK-023  # Universal Scoped Container Print Engine & Tabular Run Sheet Artisan Skill
  related:
    - AC-DEC-2026-061  # Customary Family Obligation Register Architecture
    - AC-DEC-2026-062  # Shopping Tab Family Obligation Integration
    - AC-DEC-2026-064  # Family Obligations Tabular View Architecture
    - AC-DEC-2026-066  # Shopping Module Architecture Streamlining & Obligations Table UX
    - UI-DEC-2026-050  # Table Column Density & Subspec Optimization Standard
    - STD-MOD-COMP-001 # Modular Component Architecture Invariant
  blocks:
    - None
```

---

## 🎯 Goal

Resolve table layout density defects, add essential sorting and filtering controls to the Obligations Table, eliminate cognitive confusion between the 44-item commercial shopping checklist and 53-item customary family obligations, and streamline the Shopping Registry Information Architecture:
1. **Column Width & Space Optimization (`UI-DEC-2026-050`)**:
   - Constrain the unconstrained `Items / Specifications` column to `width: 220px; max-width: 260px;` across `<th>` and `.obl-td-specs`.
   - Format multi-item specifications into compact chips/badges with text ellipsis, line-clamp, and hover tooltips, preventing vertical row height blowout.
2. **Inner Table Filters & Multi-Column Sorting**:
   - Provide interactive sortable `<th>` headers with visual directional indicators (▲/▼/⇅) for Code, Direction, Title, Category, and Cash Cost.
   - Introduce inline Category facet filter pills directly within the table controls for rapid filtering without leaving table layout mode.
3. **Information Architecture Alignment & Dynamic Counter Sync**:
   - Codify the dual-domain relationship: 44 commercial trousseau items in Shopping (`TRS-###`) ⟷ 53 customary family obligations in Culture (`OBL-###`).
   - Dynamically bind all hardcoded "49" counters across templates, banners, and scripts to `window.OBLIGATIONS_DATA.length` (53).
   - Clarify domain boundaries in UI copy to eliminate double-table cognitive friction.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Obligations Table Column Constraints & Typography Hardening
- [x] **Authoritative Plan Location**: Authored and committed in-repo at [`enhancement-notes/SK-024/implementation_plan.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-024/implementation_plan.md) (`P-SSOT-DOCS`).
- [x] **Column Width Constraint**: In `shopping_src/scripts/controller.js` line 4110 and `shopping_src/styles/11_obligations_table_and_print.css`, declare explicit `width: 220px; max-width: 260px;` on `<th>` and `.obl-td-specs`.
- [x] **Zero Data-Hiding & CSS Line-Clamp**: Veto "+N more" JS truncation to protect liturgical visibility; implement pure CSS `line-clamp: 3` on `.obl-td-specs` with native `title` tooltip for wrapped text.
- [x] **Print Unclamping**: Ensure `@media print` unclamps lines (`display: table-cell; -webkit-line-clamp: unset;`) so physical paper run sheets never clip handover specifications.
- [x] **Validation Gate (VG-1)**: Visual and programmatic verification (`scripts/test-obligations-table-density.cjs`) that `.obl-td-specs` stays strictly within 220–260px and zero items are concealed behind clickable toggles.

### Phase 2: Inner Table Category Filters & Multi-Column Sorting
- [x] **Sortable Table Headers**: Upgrade `<th>` elements in `renderObligationsTable()` to interactive clickable headers with `data-sort-key` (`code`, `direction`, `title`, `category`, `cost`).
- [x] **Numeric Cash Sorting Key**: Extract parsed numerical integers (`unit_amount_inr || estimated_total_inr || 0`) for cash sorting to prevent lexicographical string sort errors on `"₹5,000/head"`.
- [x] **Sorting State Engine**: Implement `tableSortKey` and `tableSortDir` (`asc` / `desc`) in `controller.js` with instant in-memory re-sorting and dynamic sort arrow badges (`▲`, `▼`, `⇅`).
- [x] **Inline Category Filter Pills**: Add category filter pills (`All`, `Attire`, `Gold & Silver`, `Cash Dakshina`, `Food & Bhara`, `Logistics`) to `#obligationsTableContainer` toolbar.
- [x] **Validation Gate (VG-2)**: Clicking headers reverses sort order with proper numerical cash ordering; clicking category pills updates table rows instantly without resetting layout mode.

### Phase 3: Module IA Alignment & Dynamic Counter Synchronization
- [x] **Dynamic Counter Binding**: Eradicate all hardcoded "49" strings in `shopping_src/components/body.html`, `obligations_view.html`, and `controller.js`. Bind them dynamically to `OBLIGATIONS_DATA.length` (53) and live filtered subsets.
- [x] **Domain Separation & UI Copy Polish**: Clarify the relationship between `[🛍️ Items Checklist (44)]` and `[📜 Family Obligations (53)]` in tooltips and welcome banners to eliminate dual-table confusion.
- [x] **Validation Gate (VG-3)**: All UI counters show 53; zero references to stale "49" count remain; subview transitions maintain clear domain identity.

### Phase 4: Full Verification, SDCA Compilation & Byte Parity
- [x] **SDCA Compilation**: Compile `shopping_src/` via `node shopping_src/build.cjs`.
- [x] **Dual-Release Byte Parity**: Verify 100% byte-for-byte parity between root (`/`) and `public/` distribution targets (`shopping-registry.html` and `shopping-fragment.html`).
- [x] **Regression Test Gates**: Execute `npm run test:obligations`, `npm run test:shopping`, `npm run verify:modular-architecture`, and `npm run verify:taxonomy`.
- [x] **Validation Gate (VG-4)**: All automated test suites pass 100% green; zero linter or modularity violations.
