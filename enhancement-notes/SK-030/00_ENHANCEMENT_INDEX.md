# SK-030: Universal Faceted Filter Primitive Engine, State Orthogonality & Dual-Mode UI Ergonomics (STD-UI-PRIMITIVE-FACETED-FILTER-001)

## 📊 Metadata

- **Category**: UI_QUALITY / SHARED_PRIMITIVES / ARCHITECTURE
- **Priority**: HIGH
- **Status**: READY (Planned)
- **Estimate**: 6 hours
- **Target Release**: v2.9.8
- **Risk Level**: LOW (Isolated new primitive in `ui_primitives/` + clean controller integration)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]` & `[SHARED-PRIMITIVES]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-020  # Customary Family Obligation Register (STD-FAMILY-OBLIGATION-001)
    - SK-022  # Family Obligations Tabular View & Dual Mode Architecture (STD-SHOPPING-OBLIGATION-002)
    - SK-010  # Universal UI Button Primitives & Pre-Flight Gate (STD-UI-PRIMITIVE-002)
  related:
    - AC-DEC-2026-073  # Universal Faceted Filter Primitive Engine & Ecosystem Standards
    - UI-DEC-2026-052  # Two-Tier Segmented Toolbar Ergonomics & Design System Integration
    - 02_RITUALS_CULTURE/obligations/family_obligations_master.md
    - ui_primitives/scripts/
  blocks:
    - None
```

---

## 🎯 Goal & Ecosystem Vision

1. **Deliver Universal Faceted Filter Primitive Engine (`ui_primitives/scripts/faceted_filter_engine.js`)**:
   - Create a zero-dependency, vanilla JS declarative filtering engine supporting $N$-dimensional orthogonal filtering.
   - Built-in multi-dimensional conjunctive boolean intersection (`filter(items)`).
   - Dynamic real-time facet count aggregation (`computeFacetCounts()`), allowing UI badges to reflect actual available counts per selection.
   - URL search parameter serialization/hydration and state reset handling.
2. **Resolve the Family Obligations 1D Filter Collision**:
   - Wire `shopping_src/scripts/controller.js` to instantiate the new shared primitive.
   - Allow users to filter simultaneously by **Direction** (`Bride Side`, `Groom Side`, `Joint`) AND **Category** (`Attire`, `Gold/Silver`, etc.) without collision.
3. **Two-Tier Segmented Ribbon Ergonomics**:
   - **Tier 1 (Global Context & Direction)**: Search, Event Milestone selector, Direction pills, and Layout Switcher (`Cards | Table`).
   - **Tier 2 (Category & Status Facet Strip)**: Category chips with active badges, `Unresolved Only` toggle, and instant `Reset Filters` control.
4. **Institutionalize Ecosystem Assets**:
   - Ratify standard `STD-UI-PRIMITIVE-FACETED-FILTER-001`.
   - Document universal pattern `.agent/patterns/declarative-orthogonal-faceted-filtering.md`.
   - Update `scripts/verify-modular-architecture.cjs` to audit the new primitive.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Universal Faceted Filter Primitive Engine     │
│  - Author ui_primitives/scripts/faceted_filter_engine  │
│  - Implement declarative schema & computeFacetCounts() │
│  - Author scripts/test-faceted-filter-primitive.cjs    │
│  - Validation Gate (VG-1): Unit test harness 100% green│
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Phase 2: Family Obligations Controller Integration     │
│  - Instantiate engine in shopping_src/controller.js    │
│  - Export window.setObligationDirection/Category() etc.│
│  - Author scripts/test-obligation-faceted-filter.cjs   │
│  - Validation Gate (VG-2): Contract tests 100% green   │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Phase 3: Two-Tier Segmented Toolbar Markup & Styles    │
│  - Update shopping_src/components/obligations_view.html│
│  - Add active chip styles in 10_obligations.css (<500) │
│  - Validation Gate (VG-3): check-html-balance 100%     │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Phase 4: SDCA Compilation, Byte Parity & Ecosystem Standard │
│  - Compile shopping-registry.html & fragment           │
│  - 100% Byte Parity across root and public/            │
│  - Register declarative-orthogonal-faceted-filtering.md│
│  - Validation Gate (VG-4): npm run verify:all (6/6)    │
└────────────────────────────────────────────────────────┘
```
