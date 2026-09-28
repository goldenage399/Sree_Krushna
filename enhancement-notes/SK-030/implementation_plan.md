# Implementation Plan — SK-030: Universal Faceted Filter Primitive Engine & Ecosystem Standards

> **Standard**: `STD-UI-PRIMITIVE-FACETED-FILTER-001` / `STD-PLANNING-ENGINE-001`  
> **Ruling**: `AC-DEC-2026-073` / `UI-DEC-2026-052`  
> **Governing Ticket**: [`enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md`](./00_ENHANCEMENT_INDEX.md)  
> **Cluster**: `[UI-QUALITY]` / `[SHARED-PRIMITIVES]`  
> **Status**: `PROPOSED` — Awaiting User Approval (Plan Hard-Stop)  

---

## 1. Ground Truth & Intent

### Problem
Across modern web applications and dashboards in our ecosystem (Family Obligations, Trousseau Shopping, Decision Registry, Task-Dashboard), filter state is frequently implemented via ad-hoc scalar strings (e.g. `activeObligationFilter = 'bride'`), causing mutually exclusive filter collisions when orthogonal dimensions (Family Direction $\times$ Material Category) are selected simultaneously. Badges show static totals rather than dynamic intersection counts, and table/card layouts desynchronize.

### Objective
1. **Author Universal Faceted Filter Primitive Engine** in [`ui_primitives/scripts/faceted_filter_engine.js`](file:///d:/GitHub_Repo/Sree_Krushna/ui_primitives/scripts/faceted_filter_engine.js) as a reusable, zero-dependency vanilla JS module.
2. Provide declarative schema definition, boolean `AND` conjunctive intersection, dynamic disjunctive facet count aggregation (`computeFacetCounts()`), and reset/serialization mechanisms.
3. Verify the engine in isolation via standalone unit test suite `scripts/test-faceted-filter-primitive.cjs`.
4. Integrate the engine into `shopping_src` (Phase 2), update UI markup/styles (Phase 3), and ratify the ecosystem pattern/standard (Phase 4).

---

## 2. Target Files & Proposed Changes (Phase 1 Focused)

| File | Purpose | Changes |
| :--- | :--- | :--- |
| `ui_primitives/scripts/faceted_filter_engine.js` | **New Reusable Primitive** | Implement `skCreateFacetedFilterEngine(config)` with schema registration, `filter(items)`, `computeCounts(items, targetDim)`, state get/set, and URL query helpers. |
| `scripts/test-faceted-filter-primitive.cjs` | **New TDD Test Harness** | Unit tests verifying multi-dimensional filtering, dynamic counts, search, and edge cases. |
| `scripts/verify-modular-architecture.cjs` | Modular auditor update | Register `ui_primitives/scripts/faceted_filter_engine.js` in `expectedPrimitives` and `controllers` syntax gate. |
| `package.json` | Script registration | Add `"test:faceted-filter": "node scripts/test-faceted-filter-primitive.cjs"`. |

---

## 3. Phased Definition of Done (DoD v1.7 Matrix)

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

### Task 2: Implement Universal Faceted Filter Engine (`ui_primitives/scripts/faceted_filter_engine.js`)
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
