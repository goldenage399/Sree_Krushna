# SK-030: Family Obligations 2D Faceted Filtering, State Orthogonality & Dual-Mode UI Ergonomics (STD-OBLIGATION-FACETED-FILTER-001)

## 📊 Metadata

- **Category**: UI_QUALITY / BUSINESS_LOGIC / ERGONOMICS
- **Priority**: HIGH
- **Status**: READY (Planned)
- **Estimate**: 4 hours
- **Target Release**: v2.9.8
- **Risk Level**: LOW (Client-side controller state refactoring; zero data schema mutations)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]` & `[BUSINESS-LOGIC]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-020  # Customary Family Obligation Register (STD-FAMILY-OBLIGATION-001)
    - SK-022  # Family Obligations Tabular View & Dual Mode Architecture (STD-SHOPPING-OBLIGATION-002)
    - SK-010  # Universal UI Button Primitives & Pre-Flight Gate (STD-UI-PRIMITIVE-002)
  related:
    - AC-DEC-2026-072  # Architecture Council Ratification of 2D Faceted Filter Model
    - UI-DEC-2026-051  # UI/UX Council Two-Tier Segmented Toolbar Ergonomics
    - 02_RITUALS_CULTURE/obligations/family_obligations_master.md
    - js/obligations-data.js
  blocks:
    - None
```

---

## 🎯 Goal

Eliminate the 1D scalar filter collision in the Customary Family Obligations subview (`#shoppingObligationsView`) by delivering:
1. **2D Orthogonal Controller State Architecture**:
   - Refactor `activeObligationFilter` from a single scalar string into an orthogonal composite dictionary:
     `activeOblState = { direction: 'all', category: 'all', status: 'all', event: 'all', search: '', layout: 'table' }`.
2. **True Multidimensional Boolean Intersection**:
   - Enable users to filter simultaneously by **Direction** (`Bride Side`, `Groom Side`, `Joint`) AND **Category** (`Attire`, `Gold/Silver`, `Bundles`, `Food`, `Cash`, `Logistics`) AND **Status** (`Unresolved`) without mutual deselection.
3. **Two-Tier Segmented Toolbar Ergonomics**:
   - **Tier 1 (Global Context & Direction)**: Search, Event Milestone selector, Family Direction pills (`All`, `Bride Side`, `Groom Side`, `Joint`), and Layout Switcher (`Cards | Table`).
   - **Tier 2 (Category & Status Facet Strip)**: Category chips with active badges, `Unresolved Only` toggle, and instant `Reset Filters` control.
4. **Dynamic Live Badge Recalculation**:
   - Automatically recompute category counts for the active direction (e.g. clicking `Bride Side` shows `Attire (13)` rather than global `23`).
5. **100% SDCA Integrity & Dual-Release Byte Parity**:
   - Maintain strict SDCA modularity (`<500` lines per component/css file) and pass `test:shopping`, `test:obligations`, and `verify:modular-architecture`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Controller State Orthogonality & Predicate Composition Engine
- [ ] **State Dictionary Refactoring**: Replace `activeObligationFilter` with `activeOblState` in `shopping_src/scripts/controller.js`.
- [ ] **Predicate Pipeline**: Implement multi-dimensional `AND` filtering across `direction`, `category`, `status`, `event`, and `search`.
- [ ] **Dedicated Action Handlers**: Implement `window.setObligationDirection(dir)`, `window.setObligationCategory(cat)`, `window.toggleObligationStatus(status)`, and `window.resetObligationFilters()`.
- [ ] **Automated Test Harness**: Author `scripts/test-obligation-faceted-filter.cjs` verifying 2D combination query results.
- [ ] **Validation Gate (VG-1)**: `node scripts/test-obligation-faceted-filter.cjs` passes 100% with zero filter collisions.

### Phase 2: Two-Tier Segmented Markup & Responsive CSS Styling
- [ ] **Markup Refactoring**: Update `shopping_src/components/obligations_view.html` to render Tier 1 (Direction) and Tier 2 (Category/Status) as visually distinct, uncluttered ribbons.
- [ ] **Responsive CSS Styling**: Add clear active states, badge chips, and mobile-wrapping styles in `shopping_src/styles/10_obligations.css`.
- [ ] **Dynamic Badge Recomputation**: Bind `updateObligationFilterCounts()` to recalculate counts based on active direction.
- [ ] **Validation Gate (VG-2)**: Clean tag balance check via `node scripts/check-html-balance.cjs` and responsive styling sweep.

### Phase 3: SDCA Compilation, Dual-Release Byte Parity & Regression Verification
- [ ] **Module Compilation**: Run `npm run build:shopping:all` to compile `shopping-registry.html` and `shopping-fragment.html`.
- [ ] **Dual-Release Parity**: Verify 100% byte parity between root and public HTML distributions.
- [ ] **Full Test Suite Gate**: `npm run verify:all` passes 100% across all 6 validation gates.
- [ ] **Validation Gate (VG-3)**: All tests green, zero console warnings, zero regressions.
