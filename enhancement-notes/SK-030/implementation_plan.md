# Implementation Plan — SK-030: Family Obligations 2D Faceted Filtering, State Orthogonality & Dual-Mode UI Ergonomics

> **Standard**: `STD-OBLIGATION-FACETED-FILTER-001` / `STD-PLANNING-ENGINE-001`  
> **Ruling**: `AC-DEC-2026-072` / `UI-DEC-2026-051`  
> **Governing Ticket**: [`enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md`](./00_ENHANCEMENT_INDEX.md)  
> **Cluster**: `[UI-QUALITY]` / `[BUSINESS-LOGIC]`  
> **Status**: `PROPOSED` — Awaiting User Approval (Plan Hard-Stop)  

---

## 1. Ground Truth & Intent

### Problem
In `#shoppingObligationsView`, Family Direction (`Bride Side`, `Groom Side`, `Joint`) and Material Category (`Attire`, `Gold/Silver`, `Bundles`, etc.) are assigned to the same scalar variable `activeObligationFilter = 'all'`. Selecting "Bride Side" and then clicking "Attire & Silks" overrides the direction filter, making multi-dimensional faceted search impossible.

### Objective
1. Refactor controller filter state into an orthogonal composite dictionary: `activeOblState = { direction, category, status, event, search, layout }`.
2. Implement 5-dimension boolean `AND` intersection in `getFilteredObligations()`.
3. Provide dedicated action handlers and update UI toolbar markup in `shopping_src/components/obligations_view.html` to separate Direction from Category into a 2-tier segmented layout.
4. Verify via unit test harness `scripts/test-obligation-faceted-filter.cjs` and full regression suite `npm run verify:all`.

---

## 2. Target Files & Proposed Changes

| File | Purpose | Changes |
| :--- | :--- | :--- |
| `scripts/test-obligation-faceted-filter.cjs` | New test harness (TDD) | Verify 2D query intersections (`bride` + `attire`, `groom` + `gold_silver`, `unresolved` + `direction`, etc.). |
| `shopping_src/scripts/controller.js` | Controller state & filter pipeline | Replace `activeObligationFilter` with `activeOblState`; update `getFilteredObligations()`, `setObligationDirection()`, `setObligationCategory()`, `toggleObligationStatus()`, `resetObligationFilters()`. |
| `shopping_src/components/obligations_view.html` | Markup | Reorganize toolbar into Tier 1 (Direction + Controls) and Tier 2 (Category + Status) with clean semantic data attributes. |
| `shopping_src/styles/10_obligations.css` | Styles | Style two-tier toolbar, active chips, reset button, and count pills (<500 lines limit preserved). |
| `package.json` | Script registration | Add `"test:obligation-facets": "node scripts/test-obligation-faceted-filter.cjs"`. |

---

## 3. Phased Definition of Done (DoD v1.7 Matrix)

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Controller State Orthogonality & Test Harness │
│  - Refactor activeOblState dictionary                  │
│  - Author scripts/test-obligation-faceted-filter.cjs   │
│  - Validation Gate (VG-1): test:obligation-facets 100% │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Phase 2: Two-Tier Segmented Toolbar Markup & Styles    │
│  - Reorganize obligations_view.html into 2 ribbons     │
│  - Update 10_obligations.css for active chips & badges │
│  - Validation Gate (VG-2): check-html-balance 100%     │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Phase 3: Compilation, Parity Audit & Regression Gate   │
│  - Recompile shopping-registry.html & fragment         │
│  - 100% Byte Parity across root and public/            │
│  - Validation Gate (VG-3): npm run verify:all (6/6)    │
└────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Step-by-Step Execution Tasks (Phase 1)

### Task 1: Create Automated TDD Test Harness (`scripts/test-obligation-faceted-filter.cjs`)
- **Action**: Create test file importing `js/obligations-data.js` and evaluating composite filter matrix:
  - Test 1: `direction = 'bride'` AND `category = 'attire'` (Expect exactly 13 obligations).
  - Test 2: `direction = 'groom'` AND `category = 'attire'` (Expect exactly 9 obligations).
  - Test 3: `direction = 'joint'` AND `category = 'ceremonial_token'` (Expect exactly 1 obligation: `OBL-053`).
  - Test 4: `status = 'unresolved'` AND `direction = 'bride'` (Expect exact subset of unresolved bride obligations).
  - Test 5: Reset clearing all active facets back to 53 total.
- **Verification**: `node scripts/test-obligation-faceted-filter.cjs`.

### Task 2: Refactor State & Filter Pipeline in `shopping_src/scripts/controller.js`
- **Location**: `shopping_src/scripts/controller.js` (lines 3832–3885 and lines 4390–4420).
- **Modifications**:
  1. Define `activeOblState = { direction: 'all', category: 'all', status: 'all', event: 'all', search: '', layout: 'table' }`.
  2. Rewrite `getFilteredObligations()` with independent predicate evaluation.
  3. Export `window.setObligationDirection(dir)`, `window.setObligationCategory(cat)`, `window.toggleObligationStatus(status)`, `window.resetObligationFilters()`.
  4. Ensure backward compatibility with any legacy calls to `setObligationFilter`.
- **Verification**: `node -c shopping_src/scripts/controller.js`.

### Task 3: Execute Phase 1 Validation Gate (VG-1)
- **Command**: `node scripts/test-obligation-faceted-filter.cjs`
- **Exit Condition**: 100% green exit code 0.
- **Commit Boundary**: `feat(shopping): implement 2D faceted controller filter engine for customary obligations (SK-030 Phase 1)`

---

## 5. Sequential Execution Boundaries & Plan Hard-Stop

> **MANDATORY GOVERNANCE INVARIANT (`INC-079` / `AC-DEC-2026-044`)**:  
> Planning concludes here. Execution of Phase 1 code mutations shall commence ONLY after user review and confirmation of this implementation plan.
