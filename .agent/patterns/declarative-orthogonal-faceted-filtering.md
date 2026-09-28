---
pattern: declarative-orthogonal-faceted-filtering
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md
    at: "Phase 4"
portability: universal
canonical_source: sree-krushna
porting_effort: low
---

<!-- shared:std.agent.pattern.core -->
# Pattern: Declarative Orthogonal Multi-Dimensional Faceted Filtering Primitive (`STD-UI-PRIMITIVE-FACETED-FILTER-001`)

**Identifier**: `PAT-FACETED-FILTER-001` / `STD-UI-PRIMITIVE-FACETED-FILTER-001`  
**Classification**: Universal UI Primitive / Interaction Architecture  
**Origin Decisions**: `AC-DEC-2026-074`, `UI-DEC-2026-053` (SK-030)  
**Cross-Repo Portability**: Universal (`Sree_Krushna`, `Task-Dashboard`, `OperatusOS`)  

---

## 1. Problem Statement & Symptom Profile
In standard Web SPAs and dashboards, catalog/inventory views frequently implement single-dimension filter button bars (e.g., Category pills, Status pills, or Family Direction pills). When users attempt to apply simultaneous constraints across independent semantic dimensions (e.g., *Direction: Bride Side* `[1]` AND *Category: Attire & Silks* `[2]`), a 1D filter architecture fails in one of three ways:
1. **Filter Collision / Mutual Exclusion**: Clicking button `[2]` replaces filter `[1]`, clearing the previous selection.
2. **Combinatorial Explosion**: Creating static composite buttons for every combination ($N \times M \times P$ permutations) clutters the UI and requires manual hardcoding.
3. **Ghost Selections / Inaccurate Counts**: Displaying static item counts next to filter pills that do not reflect the active selections in *other* orthogonal dimensions misleads users into clicking combinations with 0 matches.

---

## 2. Invariants & Rules

### `INV-FACET-INTERSECT-001`: Multi-Dimensional Orthogonal Intersection
The filter state must represent independent dimensions as a structured map (`{ [dimensionId]: selectedValue }`), where `all` represents the identity/pass-through condition. An item passes the composite filter if and only if:
$$\text{passes}(item) = \left( \bigwedge_{d \in D} (F_d = \text{'all'} \lor \text{predicate}_d(item, F_d)) \right) \land \text{matchesQuery}(item, Q)$$
Each dimension operates strictly orthogonally without clearing or mutating sibling dimensions.

### `INV-FACET-COUNTS-001`: Dynamic Multi-Dimensional Count Recalculation
Option badge counts must never be static. For any dimension $d_k$ and option value $v$, the displayed count must represent items passing **all other active dimensions $D \setminus \{d_k\}$** and the active search query $Q$:
$$\text{count}(d_k, v) = |\{ item \in \text{Items} \mid \text{matchesQuery}(item, Q) \land \text{predicate}_{d_k}(item, v) \land \bigwedge_{j \neq k} (F_j = \text{'all'} \lor \text{predicate}_j(item, F_j)) \}|$$
This provides instant visual feedback on how selecting an option will narrow the current dataset.

### `INV-FACET-AWARE-SEARCH-001`: Compound Keyword Search
When a keyword search query $Q$ is active, the search filter intersects multiplicatively across all active facet selections and dynamically recalculates facet option counts.

### `INV-FACET-RESPONSIVE-001`: Mobile Ergonomics & Horizontal Non-Wrap Scrolling
Facet filter bars must be responsive. On mobile viewports (<640px), facet rows must render as fluid horizontal carousels/scrollers with touch targets $\ge 44\text{px}$ (`min-height: 44px`), smooth inertial touch scrolling (`-webkit-overflow-scrolling: touch`), and hidden scrollbars (`scrollbar-width: none`).

---

## 3. Reference Architecture: 3-Layer Decoupling

The primitive strictly separates logic, markup, and consumer integration:

```
┌────────────────────────────────────────────────────────┐
│  Layer 1: Headless Engine                              │
│  ui_primitives/scripts/faceted_filter_engine.js       │
│  - Pure JS, zero DOM, zero framework dependencies      │
│  - Manages { facets, search }, computes dynamic counts │
└──────────────────────────┬─────────────────────────────┘
                           │ drives
┌──────────────────────────▼─────────────────────────────┐
│  Layer 2: Agnostic UI Template & Styles                │
│  ui_primitives/components/faceted_toolbar.html         │
│  ui_primitives/styles/04_faceted_toolbar.css           │
│  - Micro-pills, count badges, search bar, clear-all    │
│  - Touch-friendly 44px targets, horizontal overflow    │
└──────────────────────────┬─────────────────────────────┘
                           │ consumed by
┌──────────────────────────▼─────────────────────────────┐
│  Layer 3: Domain Consumers                             │
│  - Family Obligations (shopping_src/scripts/controller)│
│  - Decorator Cockpit (cockpit_src/scripts/controller)  │
│  - Task Dashboard (src/components/...)                 │
└────────────────────────────────────────────────────────┘
```

---

## 4. Usage Example

### A. Headless Engine Instantiation
```javascript
const engine = new skFacetedFilterEngine({
  dimensions: [
    {
      id: 'direction',
      label: 'Side',
      allLabel: 'All Sides',
      options: [
        { id: 'all', label: 'All Sides' },
        { id: 'groom', label: 'Groom' },
        { id: 'bride', label: 'Bride' }
      ],
      predicate: (item, val) => item.familySide === val
    },
    {
      id: 'category',
      label: 'Category',
      allLabel: 'All Categories',
      extractValue: item => item.category
    }
  ],
  searchFields: ['title', 'notes', 'assignee']
});

engine.setItems(myCatalogData);
engine.setFacet('direction', 'bride');
engine.setFacet('category', 'attire');
const results = engine.filter();
const counts = engine.computeCounts();
```

### B. Mounting the Agnostic Toolbar
```javascript
const toolbar = skFacetedToolbar.mount({
  container: document.getElementById('myFacetedMount'),
  engine: engine,
  onFilterChange: (filteredItems, counts) => {
    renderTable(filteredItems);
  }
});
```

---

## 5. Verification & Adoption Gates
1. **Unit Test Suite**: `node scripts/test-faceted-filter-primitive.cjs` (verifies headless multidimensional filtering, dynamic counts, search integration).
2. **DOM Mounter Test**: `node scripts/test-faceted-toolbar-dom.cjs` (verifies DOM mounting, pill click handlers, active states, search input typing).
3. **Consumer Contract Test**: `node scripts/test-obligation-faceted-filter.cjs` (verifies exact multi-dimensional query intersection in production data).
4. **Modularity Standard**: Passed `npm run verify:modular-architecture` and tag balance gates (`check-html-balance.cjs`).
