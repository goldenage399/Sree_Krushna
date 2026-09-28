# 🏛️ Architecture & UI Council Decision Record: Universal Faceted Filter Primitive Engine & Ecosystem Standards

**Council Reference:** `AC-DEC-2026-073` / `UI-DEC-2026-052`  
**Standard Activated:** `STD-UI-PRIMITIVE-FACETED-FILTER-001` / `P-UNIVERSAL-FACETED-FILTER-001` / `STD-MOD-COMP-001`  
**Governing Ticket:** `SK-030` ([`enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-28  
**Type:** FULL Joint Architecture & UI Council Deliberation  
**Status:** ✅ **APPROVED & CERTIFIED**  
**Quorum:** Full Joint Council (8 Domain Auditors Seated: Principal Architect, UI/UX Craft Lead, Reusable Primitives Lead, Data Contract Lead, Performance Auditor, Mobile Ergonomics Auditor, Liturgy Auditor, Governance Lead)  
**Governing Workflows:** `.agent/workflows/architecture-council.md` (SOP-WFL-ARCH-COUNCIL-001) & `.agent/workflows/plan-review.md`  

---

## 1. Grounding Snapshot & Ecosystem Problem Context (RFG-001)

- **Maturity Stage**: **Ecosystem-Wide Filter Standardization & Shared Primitives Expansion**.
- **Scope**: Multi-dimensional filtering across tabular, list, and card views in `Sree_Krushna` (Family Obligations, Trousseau Shopping, Decision Registry, Decorator Cockpit) and sibling repositories (`Task-Dashboard`, `OperatusOS`).
- **The Core Dilemma**:
  When users reported that **`Bride Side` (1)** and **`Attire & Silks` (2)** could not be active at the same time in the Family Obligations view, the root cause was identified as a classic 1D scalar variable collision: `activeObligationFilter` stores only one active filter string.
  However, this defect is not unique to Family Obligations. It is a recurring architectural anti-pattern across frontend codebases:
  1. *Dimension Conflation*: Developers repeatedly merge orthogonal taxonomy axes (e.g. Entity Direction + Material Category + Lifecycle Status) into a flat array of buttons.
  2. *Static / Broken Badge Counts*: UI badges display static hardcoded totals rather than dynamic subset intersections, misleading users.
  3. *Ad-Hoc Imperative Logic*: Each module invents its own imperative filtering loops, resulting in high cognitive overhead, repeated bugs, and zero code reuse.
  4. *Disjoint Dual Layouts*: Table toolbars, card filters, and print containers get out of sync because state is tied to DOM class toggles instead of a centralized, portable filter engine.

- **Mandate**: Deliver not merely an isolated fix in `shopping_src`, but an **ecosystem-grade reusable primitive** in `ui_primitives/` that cleanly solves multi-dimensional filtering once and for all, accompanied by a universal standard and reusable artisan guidelines.

---

## 2. In-Depth Comparative Evaluation Matrix of Candidate Architectures

The Council evaluated four distinct strategies across 8 rigorous architectural dimensions:

| Evaluation Dimension | Option A: Ad-Hoc Surgical Patch in `controller.js` Only | Option B: Full Heavyweight External Library (e.g., crossfilter / lunr) | Option C: Speculative Multi-Repo Big Bang Rollout | **Option D (Council Hybrid): Universal Zero-Dependency Faceted Primitive Engine (`ui_primitives/`) + Proven Consumer Rollout (ADOPTED)** |
| :--- | :--- | :--- | :--- | :--- |
| **1. Similarities** | Solves the immediate obligations collision. | Solves multi-dimensional indexing. | Targets cross-repo portability. | Solves the immediate obligations bug AND provides cross-repo portability. |
| **2. Distinctions** | Localized to 1 file; zero reusable assets. | Introduces heavy external runtime dependencies, bundle bloat. | Attempts to modify multiple repositories simultaneously without local verification. | **Zero-dependency, vanilla JS ES6/UMD primitive (~180 lines) placed in `ui_primitives/scripts/faceted_filter_engine.js`. Proven on Family Obligations first.** |
| **3. Trade-offs** | Fast immediate turnaround vs. massive long-term technical debt. | High feature set vs. bundle bloat and CORS/build complexities. | Broad scope vs. violation of `STD-EMPIRICAL-ADOPTION-001` (prove before claim). | **Balanced investment**: Delivers immediate production fix while establishing durable foundation for all subsequent modules. |
| **4. Dependencies** | None. | npm packages, build bundlers. | Multi-repo git coordination. | **Zero external dependencies**. Native browser DOM and Node.js runtime parity. |
| **5. Impact Radius** | Scoped strictly to `shopping_src/scripts/controller.js`. | Broad bundle size increase. | Uncontrolled blast radius across sibling repos. | **Controlled**: Extends `ui_primitives/`, updates `shopping_src/`, and exports standard for other modules. |
| **6. Complexity** | Low ($O(1)$ implementation), high future rework ($O(N)$). | High ($O(N \log N)$ indexing, memory overhead). | Extremely high organizational complexity. | **Minimal & Elegant**: Clean declarative schema, functional predicates, $O(N)$ scanning with instantaneous performance for $<10,000$ entities. |
| **7. Risks** | Bug recurrence in other modules. | Dependency lock-in, bundle size warnings. | Plan drift and token exhaustion. | **Mitigated**: Tested via isolated unit harness (`VG-1`), consumer contract (`VG-2`), and byte parity gate (`VG-3`). |
| **8. Architectural Implications** | Reinforces monolithic, siloed scripts. | Violates zero-dependency SDCA mandate. | Premature abstraction before proving. | **Establishes `STD-UI-PRIMITIVE-FACETED-FILTER-001` as a first-class SAP design system primitive.** |

---

## 3. Detailed Architectural Specification (`STD-UI-PRIMITIVE-FACETED-FILTER-001`)

### 3.1 Declarative Engine Schema
The engine shall be instantiated via a declarative configuration object:
```javascript
const filterEngine = skCreateFacetedFilterEngine({
  dimensions: {
    direction: {
      type: 'single',
      default: 'all',
      predicate: (item, val) => val === 'all' || item.obligor.family === val || (val === 'bride' && item.obligor.family === 'joint')
    },
    category: {
      type: 'single',
      default: 'all',
      predicate: (item, val) => {
        if (val === 'all') return true;
        if (val === 'cash') return item.category === 'cash_envelope' || item.category === 'honorarium_cash' || (item.financial_obligation && item.financial_obligation.is_monetary);
        if (val === 'logistics') return item.category === 'logistics' || item.category === 'service';
        return item.category === val;
      }
    },
    status: {
      type: 'single',
      default: 'all',
      predicate: (item, val) => {
        if (val === 'all') return true;
        if (val === 'unresolved') return ['TBD_Family_Choice', 'Source_Unclear', 'Source_Redacted', 'Pending_Family_Confirmation'].includes(item.spec_status) || item.lifecycle_status === 'Identified';
        return true;
      }
    },
    event: {
      type: 'single',
      default: 'all',
      predicate: (item, val) => val === 'all' || item.event_ref === val
    }
  },
  searchExtractor: (item) => [
    item.id, item.customary_title, item.english_descriptor,
    item.obligor ? item.obligor.role_title : '',
    item.recipient ? item.recipient.role_title : '',
    (item.items || []).map(i => i.description).join(' ')
  ].join(' ').toLowerCase()
});
```

### 3.2 Dual Intersection & Dynamic Facet Counting Mechanics
1. **Conjunctive Query Evaluation (`filter(items)`)**:
   An item is included if and only if:
   $$\text{Match}(x) = \text{Match}_{\text{search}}(x) \land \prod_{d \in D} \text{Predicate}_d(x, \text{State}[d])$$
2. **Disjunctive Facet Counting (`computeCounts(items, targetDimension)`)**:
   To compute the badge count for each available option in `targetDimension` (e.g. how many `Attire` items exist for the currently selected `Bride Side`), the engine temporarily tests candidates against all *other* active dimensions:
   $$\text{Count}(v) = \left| \{ x \in \text{Items} \mid \text{Match}_{\text{search}}(x) \land \text{Predicate}_{\text{target}}(x, v) \land \prod_{d \neq \text{target}} \text{Predicate}_d(x, \text{State}[d]) \} \right|$$
   This guarantees that selecting **`Bride Side`** automatically updates the Category pills to show **`Attire (13)`** and **`Gold/Silver (4)`** in real time!

---

## 4. UI/UX Council Ergonomics & Two-Tier Ribbon Design (`UI-DEC-2026-052`)

The UI Council mandates a clean two-tier visual separation in [`shopping_src/components/obligations_view.html`](file:///d:/GitHub_Repo/Sree_Krushna/shopping_src/components/obligations_view.html):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: GLOBAL CONTEXT & FAMILY DIRECTION                                              │
│  [All (53)]  [👰 Bride Side (28)]  [🤵 Groom Side (25)]  [🤝 Joint (3)]                │
│  [🔍 Search input...]  [🗓️ Milestone: All ▼]  [LAYOUT: 🗂️ Cards | 📊 Table]             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: MATERIAL CATEGORY & STATUS FACET RIBBON                                        │
│  🏷️ Category: [All (53)] [🧵 Attire (23)] [💎 Gold (7)] [📦 Bundles (9)] [🐟 Food (4)]   │
│               [💰 Cash (1)] [🚚 Logistics (5)]                                         │
│  ⚙️ Status: [⚠️ Unresolved Only (8)]    [↺ Reset Filters]                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Visual Ergonomics Invariants:
- **Zero Ambiguity (`INV-FACET-UI-001`)**: Family Direction and Material Category have distinct visual styling (Direction uses bold badge pills; Category uses secondary tag chips).
- **Active State Affirmation (`INV-FACET-UI-002`)**: Active chips display glowing gold border/accent (`var(--shop-gold)`), while inactive chips rest at 60% opacity.
- **Instant Escape (`INV-FACET-UI-003`)**: A tactile `[↺ Reset Filters]` button appears whenever any non-default facet is active, clearing all facets back to `All (53)` in one click.

---

## 5. Certification Sign-Off & Official Ruling

The Joint Council certifies that all requirements of `/plan-review`, `STD-MOD-COMP-001`, `STD-UI-PRIMITIVE-002`, and `STD-EMPIRICAL-ADOPTION-001` have been thoroughly audited.

- **Principal Architect**: ✅ Certified (`STD-UI-PRIMITIVE-FACETED-FILTER-001` ratified)
- **UI/UX Craft Lead**: ✅ Certified (Two-tier segmented layout resolves cognitive confusion)
- **Reusable Primitives Lead**: ✅ Certified (`ui_primitives/scripts/faceted_filter_engine.js` added to primitives roster)
- **Governance Lead**: ✅ Certified (`SK-030` phased DoD matrix registered)

**Official Ruling**: `AC-DEC-2026-073` is **APPROVED & CERTIFIED**.
