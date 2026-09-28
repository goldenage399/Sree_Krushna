# SK-030: Universal 3-Layer Agnostic Faceted Filter Architecture & Family Obligations 2D Ergonomics (STD-UI-PRIMITIVE-FACETED-FILTER-001)

## 📊 Metadata

- **Category**: UI_QUALITY / SHARED_PRIMITIVES / ARCHITECTURE
- **Priority**: HIGH
- **Status**: READY (Planned)
- **Estimate**: 6 hours
- **Target Release**: v2.9.8
- **Risk Level**: LOW (Isolated new primitive in `ui_primitives/` + clean consumer mounting)
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
    - AC-DEC-2026-074  # Universal 3-Layer Agnostic Faceted Filter Architecture
    - UI-DEC-2026-053  # Two-Tier Segmented Toolbar Ergonomics & Design System Tokens
    - 02_RITUALS_CULTURE/obligations/family_obligations_master.md
    - ui_primitives/scripts/
    - ui_primitives/components/
    - ui_primitives/styles/
  blocks:
    - None
```

---

## 🎯 Goal & Ecosystem Reusability Vision

1. **Deliver Universal 3-Layer Agnostic Faceted Filter Primitive (`ui_primitives/`)**:
   - **Layer 1 (Headless Engine)**: `ui_primitives/scripts/faceted_filter_engine.js` (zero-dependency schema engine with Boolean AND intersection and dynamic count aggregation math).
   - **Layer 2 (Agnostic UI Component & Tokens)**: `ui_primitives/components/faceted_toolbar.html` and `ui_primitives/styles/04_faceted_toolbar.css` (`.sk-facet-*` design system classes).
   - **Layer 3 (Lifecycle Mounter)**: `skFacetedToolbar.mount(container, engine, options)` auto-binding events, toggling active states, and redrawing counts.
2. **Eliminate the Family Obligations 1D Filter Collision (`shopping_src`)**:
   - Refactor `shopping_src` to act as Reference Consumer #1 of `skFacetedToolbar`.
   - Enable users to filter simultaneously by **Direction** (`Bride Side`, `Groom Side`, `Joint`) AND **Category** (`Attire`, `Gold/Silver`, etc.) without collision.
3. **Turnkey Portability Across All Repositories (`Task-Dashboard`, `OperatusOS`)**:
   - Any module or sibling repository can import the 3 files from `ui_primitives/` and gain instant, robust, theme-compliant two-tier faceted filtering with zero duplicated code.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Universal Faceted Filter Headless Engine (Layer 1)            │
│  - Author ui_primitives/scripts/faceted_filter_engine.js               │
│  - Implement declarative schema & computeCounts() aggregation math     │
│  - Author scripts/test-faceted-filter-primitive.cjs                    │
│  - Validation Gate (VG-1): Unit test harness 100% green                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 2: Agnostic UI Component, Token Styles & Mounter (Layer 2)       │
│  - Author ui_primitives/components/faceted_toolbar.html                │
│  - Author ui_primitives/styles/04_faceted_toolbar.css (.sk-facet-*)    │
│  - Implement skFacetedToolbar.mount() lifecycle in faceted_filter_eng. │
│  - Author scripts/test-faceted-toolbar-dom.cjs                         │
│  - Validation Gate (VG-2): DOM mounter & tag balance checks 100% green │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 3: Reference Consumer Integration (Family Obligations)           │
│  - Wire shopping_src/scripts/controller.js to mount skFacetedToolbar   │
│  - Replace inlined static filters in obligations_view.html             │
│  - Author scripts/test-obligation-faceted-filter.cjs                   │
│  - Validation Gate (VG-3): Obligations 2D query contract 100% green    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 4: SDCA Compilation, Byte Parity & Ecosystem Standard Audit      │
│  - Compile shopping-registry.html & fragment via SDCA build            │
│  - Verify 100% Byte Parity across root and public/                     │
│  - Register declarative-orthogonal-faceted-filtering.md pattern        │
│  - Update scripts/verify-modular-architecture.cjs                      │
│  - Validation Gate (VG-4): npm run verify:all (6/6 gates green)        │
└────────────────────────────────────────────────────────────────────────┘
```
