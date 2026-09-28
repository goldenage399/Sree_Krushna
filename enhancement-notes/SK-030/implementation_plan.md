# Implementation Plan — SK-030: Universal 3-Layer Agnostic Faceted Filter Architecture & Ecosystem Shared Primitive

> **Standard**: `STD-UI-PRIMITIVE-FACETED-FILTER-001` / `STD-PLANNING-ENGINE-001`  
> **Ruling**: `AC-DEC-2026-074` / `UI-DEC-2026-053`  
> **Governing Ticket**: [`enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md`](./00_ENHANCEMENT_INDEX.md)  
> **Cluster**: `[UI-QUALITY]` / `[SHARED-PRIMITIVES]`  
> **Status**: `COMPLETE` — All 4 Phases Verified (VG-1 through VG-4 Passed)  

---

## 1. Ground Truth & Intent

### Problem
In the initial SK-030 draft, the headless filtering engine was extracted to `ui_primitives/scripts/faceted_filter_engine.js`, but the UI component markup, CSS styling, and DOM event binding remained tightly coupled to `shopping_src/components/obligations_view.html` and `shopping_src/scripts/controller.js`. Sibling repositories (`Task-Dashboard`, `OperatusOS`) or other local modules (`decision-registry`, `decorator-cockpit`) could not reuse the visual toolbar without writing bespoke HTML, CSS, and click listeners from scratch.

### Objective
Upgrade SK-030 into a **complete 3-Layer Decoupled Primitive Architecture**:
1. **Layer 1 (Headless Engine)**: `ui_primitives/scripts/faceted_filter_engine.js` (zero-dependency schema engine with Boolean AND intersection and dynamic count aggregation math).
2. **Layer 2 (Agnostic UI Component & Tokens)**: `ui_primitives/components/faceted_toolbar.html` and `ui_primitives/styles/04_faceted_toolbar.css` (`.sk-facet-*` design system classes).
3. **Layer 3 (Lifecycle Mounter)**: `skFacetedToolbar.mount(container, engine, options)` auto-binding events, toggling active states, and redrawing counts.
4. **Phase 1 Execution Focus**: Build and verify the Layer 1 Headless Engine (`ui_primitives/scripts/faceted_filter_engine.js`) in isolation via standalone unit test suite `scripts/test-faceted-filter-primitive.cjs`.

---

## 2. Target Files & Proposed Changes (Phase 1 Focused)

| File | Purpose | Changes |
| :--- | :--- | :--- |
| `ui_primitives/scripts/faceted_filter_engine.js` | **Layer 1 Headless Engine** | Implement `skCreateFacetedFilterEngine(config)` with schema registration, `filter(items)`, `computeCounts(items, targetDim)`, state get/set, and URL query helpers. |
| `scripts/test-faceted-filter-primitive.cjs` | **Phase 1 TDD Test Harness** | Unit tests verifying multi-dimensional filtering, dynamic counts, search, and edge cases. |
| `scripts/verify-modular-architecture.cjs` | Modular auditor update | Register `ui_primitives/scripts/faceted_filter_engine.js` in `expectedPrimitives` and `controllers` syntax gate. |
| `package.json` | Script registration | Add `"test:faceted-filter": "node scripts/test-faceted-filter-primitive.cjs"`. |

---

## 3. Phased Definition of Done (DoD v1.7 Matrix)

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Universal Faceted Filter Headless Engine (Layer 1) [DONE]     │
│  - Author ui_primitives/scripts/faceted_filter_engine.js               │
│  - Implement declarative schema & computeCounts() aggregation math     │
│  - Author scripts/test-faceted-filter-primitive.cjs                    │
│  - Validation Gate (VG-1): Unit test harness 100% green (10/10 PASS)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 2: Agnostic UI Component, Token Styles & Mounter (Layer 2) [DONE]│
│  - Author ui_primitives/components/faceted_toolbar.html                │
│  - Author ui_primitives/styles/04_faceted_toolbar.css (.sk-facet-*)    │
│  - Implement skFacetedToolbar.mount() lifecycle in faceted_filter_eng. │
│  - Author scripts/test-faceted-toolbar-dom.cjs                         │
│  - Validation Gate (VG-2): DOM mounter & tag balance checks 100% green │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 3: Reference Consumer Integration (Family Obligations) [DONE]    │
│  - Wire shopping_src/scripts/controller.js to mount skFacetedToolbar   │
│  - Replace inlined static filters in obligations_view.html             │
│  - Author scripts/test-obligation-faceted-filter.cjs                   │
│  - Validation Gate (VG-3): Obligations 2D query contract 100% green    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 4: SDCA Compilation, Byte Parity & Ecosystem Standard Audit[DONE]│
│  - Compile shopping-registry.html & fragment via SDCA build            │
│  - Verify 100% Byte Parity across root and public/                     │
│  - Register .agent/patterns/declarative-orthogonal-faceted-filtering.md│
│  - Update scripts/verify-modular-architecture.cjs                      │
│  - Validation Gate (VG-4): npm run verify:all (6/6 gates green)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Step-by-Step Execution Tasks (Phase 1)

### Task 1: Author Automated TDD Unit Test Suite (`scripts/test-faceted-filter-primitive.cjs`)
- **Action**: Create standalone test harness validating the engine's core contract using synthetic fixtures:
  - Test 1: Single dimension filtering (`direction = 'bride'`).
  - Test 2: Multidimensional intersection (`direction = 'bride'` AND `category = 'attire'`).
  - Test 3: Search text filtering combined with active facets.
  - Test 4: Dynamic facet counting (`computeCounts(items, 'category')`) returns true subset distribution for active direction.
  - Test 5: Reset restores all dimensions to defaults.
  - Test 6: State serialization (`getState()`) and bulk restoration (`setState()`).
- **Run Command**: `node scripts/test-faceted-filter-primitive.cjs`
- **Expected Result**: Fails initially (module not found).

### Task 2: Implement Universal Faceted Filter Headless Engine (`ui_primitives/scripts/faceted_filter_engine.js`)
- **Action**: Author self-contained UMD/IIFE module exporting `window.skCreateFacetedFilterEngine` (or `module.exports` under Node.js):
  ```javascript
  (function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.skCreateFacetedFilterEngine = factory();
  }(typeof self !== 'undefined' ? self : this, function () { ... }));
  ```
- **Engine Capabilities**:
  - `dimensions`: key-value map defining defaults and custom predicate functions `(item, activeVal) => boolean`.
  - `searchExtractor`: function `(item) => string` for text search queries.
  - `setFacet(dim, val)`: update dimension state.
  - `getFacet(dim)`: query dimension state.
  - `filter(items)`: returns items matching all active facets + search.
  - `computeCounts(items, targetDim)`: returns distribution of available items across `targetDim` options given other active facets.
  - `reset()`: resets all dimensions to default.
- **Constraints**: Under 250 lines, zero external dependencies, strict ES6 vanilla JavaScript.

### Task 3: Register in Modular Verifier & Execute Phase 1 Validation Gate (VG-1)
- **Action**:
  1. Add `ui_primitives/scripts/faceted_filter_engine.js` to `expectedPrimitives` and `controllers` in `scripts/verify-modular-architecture.cjs`.
  2. Register `"test:faceted-filter": "node scripts/test-faceted-filter-primitive.cjs"` in `package.json`.
  3. Run `npm run test:faceted-filter` and `npm run verify:modular-architecture`.
- **Exit Condition**: Exit code 0, 100% green test assertions.
- **Commit Boundary**: `feat(primitives): implement universal faceted filter engine and unit test harness (SK-030 Phase 1)`

---

## 5. Sequential Execution Boundaries & Plan Hard-Stop

> **MANDATORY GOVERNANCE INVARIANT (`INC-079` / `AC-DEC-2026-044`)**:  
> Planning concludes here. Execution of Phase 1 code mutations shall commence ONLY after user review and confirmation of this implementation plan.
