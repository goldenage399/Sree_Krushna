# 🏛️ Architecture & UI Council Decision Record: Family Obligations 2D Faceted Filtering, State Orthogonality & Dual-Mode UI Ergonomics

**Council Reference:** `AC-DEC-2026-072` / `UI-DEC-2026-051`  
**Standard Activated:** `STD-OBLIGATION-FACETED-FILTER-001` / `STD-SHOPPING-OBLIGATION-002` / `P-2D-FILTER-ORTHOGONALITY-001`  
**Governing Ticket:** `SK-030` ([`enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-28  
**Type:** FULL Joint Architecture & UI Council Deliberation  
**Status:** ✅ **APPROVED & CERTIFIED**  
**Quorum:** Full Joint Council (8 Domain Auditors Seated: Principal Architect, UI/UX Lead, Data Contract Lead, Epistemic Auditor, Mobile Ergonomics Auditor, Performance Auditor, Liturgy Auditor, Governance Lead)  
**Governing Workflows:** `.agent/workflows/architecture-council.md` (SOP-WFL-ARCH-COUNCIL-001) & `.agent/workflows/plan-review.md`  

---

## 1. Grounding Snapshot & Empirical Diagnosis (RFG-001)

- **Maturity Stage**: **System Usability & Multi-Faceted Query Hardening** (53 customary family obligations codified under `02_RITUALS_CULTURE/obligations/` and rendered in `#shoppingObligationsView`).
- **Target User Personas**:
  1. *Host / Wedding Coordinators*: High-speed cross-checking of specific subsets (e.g. "Show me all *Attire* given by *Bride Side*", or "Show me *Gold/Silver* given by *Groom Side*").
  2. *Family Elders & Relatives*: Navigating the custom obligations register without unexpected filter resets or missing records.
- **Identified Defect & Usability Pathology (The 1D Scalar Collision Bug)**:
  In `shopping_src/scripts/controller.js` and `shopping_src/components/obligations_view.html`:
  - The filter toolbar (`#oblFilterPills`) places three semantically distinct dimensions into a single scalar radio-group variable: `activeObligationFilter = 'all'`.
    1. **Family Direction**: `all`, `bride`, `groom`, `joint`
    2. **Epistemic / Lifecycle Status**: `unresolved`
    3. **Material Category**: `attire`, `gold_silver`, `cash`, `composite_bundle`, `edible_hospitality`, `logistics`
  - When the user selects **`Bride Side (28)`** (`1`), `activeObligationFilter` becomes `'bride'`.
  - When the user then selects **`Attire & Silks (22)`** (`2`), `window.setObligationFilter('attire')` overwrites `activeObligationFilter` to `'attire'`.
  - In `getFilteredObligations()`:
    ```javascript
    if (activeObligationFilter === 'bride') {
      if (o.obligor.family !== 'bride' && o.obligor.family !== 'joint') return false;
    } else if (activeObligationFilter === 'attire') {
      if (o.category !== 'attire') return false;
    }
    ```
  - **Verdict**: The `if ... else if` structure and 1D scalar state model make Family Direction and Category mutually exclusive. Users cannot simultaneously filter for *"Bride Side"* AND *"Attire"*.
  - Furthermore, in Table Mode, an inner category toolbar (`#oblTableCatFilters`) was added that also triggers `setObligationFilter(...)`, fighting with the top filter bar and causing visual desynchronization.

---

## 2. Comparative Evaluation Matrix of Candidate Architectures

| Evaluation Dimension | Option 1: 1D Scalar Expansion (Status Quo with Composite Keys) | Option 2: Full Elastic Multi-Select Facet Engine | Option 3: Basic Independent Scalars (Direction + Category Only) | **Option 4 (Council Hybrid): 2D Orthogonal Faceted Filtering + Tiered Toolbar Ergonomics (ADOPTED)** |
| :--- | :--- | :--- | :--- | :--- |
| **Description** | Hardcode compound string keys (e.g. `bride_attire`, `groom_gold`). | Checkbox-based multi-value faceted filtering (e.g. `Attire OR Gold` AND `Bride OR Groom`). | Two separate string variables `activeDirection` and `activeCategory` with minimal UI changes. | **Consolidate filter state into a unified 2D faceted controller state object (`activeOblState`), separate Direction from Category in the UI, provide live intersecting badge counts, and unify Table/Card filtering.** |
| **State Complexity** | ❌ Combinatorial explosion (42 keys). High maintenance debt. | ⚠️ High complexity (sets, arrays, toggle operators, query parser). | ⚠️ Low, but leaves inner table category toolbar disjoint from top bar. | **Optimal**: Clean, declarative state object with boolean AND intersection across orthogonal dimensions. |
| **Cognitive Ergonomics** | ❌ Confusing; buttons toggle each other unexpectedly. | ⚠️ High visual footprint (many checkboxes, popovers). | ⚠️ Better, but toolbar visual hierarchy remains cluttered. | **Optimal**: Tier 1 (Direction + Milestone + Search + Layout) + Tier 2 (Category + Status). |
| **Live Intersection Counts** | ❌ Broken / static hardcoded numbers. | ✅ Dynamic count re-computation. | ⚠️ Static badges or partial count sync. | **Optimal**: Dynamic badge count updates showing exact matching count for the active intersection. |
| **Dual View Sync (Cards/Table)**| ❌ Desynchronized state between top and inner toolbars. | ⚠️ Complex DOM state binding. | ⚠️ Partial sync. | **100% Unified**: Top toolbar controls both Card and Table modes; inner table toolbar seamlessly mirrors Tier 2. |
| **SDCA Limit Compliance** | ✅ Under 500 lines. | ❌ Risk of exceeding modular line caps (>500 lines). | ✅ Under 500 lines. | **100% Certified**: `<450` lines in `controller.js` obligation methods; cleanly decomposed. |

---

## 3. Council Architectural Decision & Standard Synthesis (`STD-OBLIGATION-FACETED-FILTER-001`)

The Council unanimously certifies **Option 4 (Hybrid 2D Faceted Architecture)** under the following structural specifications:

### 3.1 Unified 2D State Model
All obligation filtering across both Cards and Table layouts shall be governed by an orthogonal composite state dictionary:
```javascript
const activeOblState = {
  direction: 'all',    // 'all' | 'bride' | 'groom' | 'joint'
  category: 'all',     // 'all' | 'attire' | 'gold_silver' | 'composite_bundle' | 'edible_hospitality' | 'cash' | 'logistics'
  status: 'all',       // 'all' | 'unresolved'
  event: 'all',        // 'all' | 'EVT-001' ... 'POST_WEDDING'
  search: '',          // string search query
  layout: 'table'      // 'cards' | 'table'
};
```

### 3.2 Boolean AND Intersecting Filter Pipeline
The predicate pipeline in `getFilteredObligations()` evaluates all 5 dimensions simultaneously:
```javascript
function getFilteredObligations() {
  const obls = getObligationsList();
  if (!obls || obls.length === 0) return [];
  const q = (activeOblState.search || '').toLowerCase().trim();

  return obls.filter(o => {
    // 1. Milestone Filter
    if (activeOblState.event !== 'all' && o.event_ref !== activeOblState.event) return false;

    // 2. Direction Filter (Orthogonal Dimension 1)
    if (activeOblState.direction === 'bride') {
      if (o.obligor.family !== 'bride' && o.obligor.family !== 'joint') return false;
    } else if (activeOblState.direction === 'groom') {
      if (o.obligor.family !== 'groom') return false;
    } else if (activeOblState.direction === 'joint') {
      if (o.obligor.family !== 'joint' && !o.exchange_cluster.is_exchange) return false;
    }

    // 3. Category Filter (Orthogonal Dimension 2)
    if (activeOblState.category !== 'all') {
      if (activeOblState.category === 'cash') {
        const isCash = o.category === 'cash_envelope' || o.category === 'honorarium_cash' || (o.financial_obligation && o.financial_obligation.is_monetary);
        if (!isCash) return false;
      } else if (activeOblState.category === 'logistics') {
        if (o.category !== 'logistics' && o.category !== 'service') return false;
      } else {
        if (o.category !== activeOblState.category) return false;
      }
    }

    // 4. Status Filter (Orthogonal Dimension 3)
    if (activeOblState.status === 'unresolved') {
      const isUnresolved = ['TBD_Family_Choice', 'Source_Unclear', 'Source_Redacted', 'Pending_Family_Confirmation'].includes(o.spec_status) || o.lifecycle_status === 'Identified';
      if (!isUnresolved) return false;
    }

    // 5. Search Text Filter
    if (!q) return true;
    const itemsText = (o.items || []).map(i => i.description).join(' ');
    const text = [
      o.id, o.customary_title, o.english_descriptor,
      o.obligor ? o.obligor.role_title : '',
      o.recipient ? o.recipient.role_title : '',
      o.event_ref, itemsText
    ].join(' ').toLowerCase();

    return text.includes(q);
  });
}
```

### 3.3 Visual Control Hierarchy (Two-Tier Segmented Toolbar)
- **Tier 1 (Global Context & Direction Bar)**:
  - `[All (53)]` • `[👰 Bride Side (28)]` • `[🤵 Groom Side (25)]` • `[🤝 Joint Handlers (3)]`
  - Accompanied by Search Input, Milestone Dropdown, and `[Cards | Table]` Switcher.
- **Tier 2 (Category & Status Facet Strip)**:
  - `Category:` `[All (53)]` • `[🧵 Attire (23)]` • `[💎 Gold & Silver (7)]` • `[📦 Bundles (9)]` • `[🐟 Food & Bhara (4)]` • `[💰 Cash (1)]` • `[🚚 Logistics (5)]`
  - `Status Toggle:` `[⚠️ Unresolved Only (8)]`
  - `Reset Filters` button that clears all active facets in one click.

---

## 4. Council Rulings & Invariant Declarations

- **`INV-OBL-FACET-001` (Zero State Collision Invariant)**: Direction, Category, and Status shall NEVER share the same scalar variable. All filter mutations must update their respective dedicated state properties in `activeOblState`.
- **`INV-OBL-FACET-002` (Dual Layout State Parity)**: Switching between Cards mode and Table mode must preserve exact active filter facets without reset.
- **`INV-OBL-FACET-003` (Print Filter Preservation)**: When invoking `window.printObligationsSheet()` or `window.skPrintContainer`, the table shall print the EXACT currently filtered subset (or provide a clean indicator if filtered).

---

## 5. Certification Sign-Off

- **Principal Architect**: ✅ Certified (`STD-OBLIGATION-FACETED-FILTER-001` ratified)
- **UI/UX Craft Auditor**: ✅ Certified (Two-tier segmented layout resolves cognitive confusion)
- **Data Contract Lead**: ✅ Certified (Zero schema mutation to `OBL-###` entities)
- **Governance Lead**: ✅ Certified (Registered under `SK-030`)

**Official Ruling**: `AC-DEC-2026-072` is **APPROVED & CERTIFIED** for immediate phased implementation under `SK-030`.
