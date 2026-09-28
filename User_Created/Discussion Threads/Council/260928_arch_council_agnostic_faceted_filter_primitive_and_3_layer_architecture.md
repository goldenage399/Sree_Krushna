# 🏛️ Architecture & UI Council Decision Record: Universal 3-Layer Agnostic Faceted Filter Architecture & Ecosystem Shared Primitive

**Council Reference:** `AC-DEC-2026-074` / `UI-DEC-2026-053`  
**Standard Activated:** `STD-UI-PRIMITIVE-FACETED-FILTER-001` / `STD-MOD-COMP-001` / `P-3LAYER-AGNOSTIC-FILTER-001`  
**Governing Ticket:** `SK-030` ([`enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-030/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-28  
**Type:** FULL Joint Architecture & UI Council Deliberation  
**Status:** ✅ **APPROVED & CERTIFIED**  
**Quorum:** Full Joint Council (8 Domain Auditors Seated: Principal Architect, UI/UX Craft Lead, Reusable Primitives Lead, Data Contract Lead, Performance Auditor, Mobile Ergonomics Auditor, Liturgy Auditor, Governance Lead)  
**Governing Workflows:** `.agent/workflows/architecture-council.md` (SOP-WFL-ARCH-COUNCIL-001) & `.agent/workflows/plan-review.md`  

---

## 1. Grounding Snapshot & Diagnostic Audit (RFG-001)

### 1.1 The Specific User Inquiry
The user asked:
> *"Is all of this plan SK030 modular and reusable and have agnostic components for reusability across all repos?"*

### 1.2 Honest Architectural Audit of the Prior Plan
An impartial audit of the initial SK-030 draft reveals that while the **headless filtering engine** was designed to be agnostic, the **UI layer remained partially coupled** to `shopping_src`:

| Architectural Layer | Prior SK-030 Plan State | Verdict | Identified Coupling Gap |
| :--- | :--- | :--- | :--- |
| **Layer 1: Headless Filter Engine** | `ui_primitives/scripts/faceted_filter_engine.js` | ✅ **Agnostic** | Zero DOM dependencies; declarative dimension schemas; portable across any JS engine. |
| **Layer 2: UI Component Markup** | Inlined inside `shopping_src/components/obligations_view.html` | ❌ **Coupled** | **Gap Variant UI-A**: Sibling repos or other modules would have to write custom HTML markup. No reusable primitive in `ui_primitives/components/`. |
| **Layer 3: UI CSS Styling** | Inlined inside `shopping_src/styles/10_obligations.css` | ❌ **Coupled** | **Gap Variant UI-B**: Sibling repos cannot style faceted toolbars without copy-pasting CSS. No token-driven stylesheet in `ui_primitives/styles/`. |
| **Layer 4: DOM Event Binding** | Imperative querySelectors inside `shopping_src/controller.js` | ❌ **Coupled** | **Gap Variant UI-C**: No automated mounter lifecycle. Each consumer had to manually wire click handlers and count recalculations. |

### 1.3 The Council Mandate
The council unanimously rules that **SK-030 must be upgraded to a complete 3-Layer Decoupled Primitive Architecture**. The entire visual apparatus (HTML template, CSS token styles, mounter lifecycle, and headless engine) shall reside in `ui_primitives/`, making it 100% turnkey and portable across `Sree_Krushna`, `Task-Dashboard`, and `OperatusOS`.

---

## 2. In-Depth Comparative Evaluation Matrix of Architectural Options

The Council evaluated three distinct architectural configurations across 8 mandatory governance dimensions:

| Evaluation Dimension | Option A: Engine-Only Primitive (UI Remains Local) | Option B: Full Web Component Custom Element (`<sk-faceted-toolbar>`) | **Option C (Council Hybrid): 3-Layer Agnostic Decoupled Architecture (`ui_primitives/` Template + CSS + Engine + Mounter) (ADOPTED)** |
| :--- | :--- | :--- | :--- |
| **1. Similarities** | Solves the Family Obligations 1D bug. | Solves the Family Obligations 1D bug. | Solves the Family Obligations 1D bug. |
| **2. Distinctions** | UI template and CSS remain locked in `shopping_src`. | Uses Shadow DOM Web Components (`customElements.define`). | **Standard SDCA template (`faceted_toolbar.html`) + Design Token CSS (`04_faceted_toolbar.css`) + Headless Engine & Lightweight Mounter (`faceted_filter_engine.js`).** |
| **3. Trade-offs** | Fast local delivery vs. high technical debt for sibling repos. | Maximum isolation vs. Shadow DOM CSS theming friction and print engine piercing complexity. | **Optimal**: Zero Shadow DOM friction; 100% themeable via CSS variables; seamlessly readable by `skPrintContainer` and `@media print`. |
| **4. Dependencies** | None. | Web Component polyfills on legacy browsers. | **Zero external dependencies**. Native browser DOM and Node.js runtime parity. |
| **5. Impact Radius** | Scoped to `shopping_src`. | Cross-cutting DOM encapsulation changes. | **Controlled**: Extends `ui_primitives/` and cleanly refactors `shopping_src` as Reference Consumer #1. |
| **6. Complexity** | Low ($O(1)$) locally; $O(N)$ across ecosystem. | High ($O(N)$ Shadow DOM event retargeting). | **Minimal & Elegant**: Declarative schema + pure DOM tree injection. Cleanly decomposed under 250 lines per file. |
| **7. Risks** | Duplicated UI code when sibling repos implement faceted search. | Shadow DOM print stylesheet concealment (`INV-COLLAPSIBLE-PRINT-001`). | **Mitigated**: Regular Light DOM rendering ensures `@media print` unrolls and unclamps cleanly without hacks. |
| **8. Architectural Implications** | Violates `STD-MOD-COMP-001` (Shared Primitives First). | Introduces divergent component model in an SDCA repository. | **Fulfills `STD-MOD-COMP-001`, `STD-UI-PRIMITIVE-002`, and `STD-EMPIRICAL-ADOPTION-001` with turnkey portability.** |

---

## 3. The 3-Layer Agnostic Primitive Specification (`STD-UI-PRIMITIVE-FACETED-FILTER-001`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│             STD-UI-PRIMITIVE-FACETED-FILTER-001 (3-LAYER AGNOSTIC ENGINE)              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 1: HEADLESS PREDICATE & COUNT ENGINE                                             │
│  - File: ui_primitives/scripts/faceted_filter_engine.js                                │
│  - Pure functional schema: { dimensions, searchExtractor }                            │
│  - Methods: setFacet(), getFacet(), filter(items), computeCounts(items, targetDim)     │
│  - Zero DOM dependencies; CommonJS & Browser UMD compatible.                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 2: REUSABLE UI TEMPLATE, DESIGN TOKENS & DOM MOUNTER                             │
│  - Component Template: ui_primitives/components/faceted_toolbar.html                  │
│  - Token Stylesheet: ui_primitives/styles/04_faceted_toolbar.css                       │
│    (Defines .sk-facet-bar, .sk-facet-tier, .sk-facet-pill, .sk-facet-chip, etc.)      │
│  - Lightweight Mounter: skFacetedToolbar.mount(container, engine, { onFilterChange })  │
│    (Auto-binds clicks, updates active styling, and updates dynamic count badges)       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 3: PLUGGABLE CONSUMER ADAPTATION (ZERO CUSTOM CSS IN MODULES)                    │
│  - Reference Consumer #1: shopping_src/scripts/controller.js (Family Obligations)     │
│  - Reference Consumer #2: Task-Dashboard / OperatusOS (Future Sibling Import)          │
│  - Consumer provides only data arrays and declarative dimension definitions.           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Design System Token CSS Contract (`04_faceted_toolbar.css`)
All styling is driven strictly through theme CSS tokens:
- `--sk-facet-bg`: Background container color
- `--sk-facet-border`: Subtle divider border
- `--sk-facet-active-border`: Gold active accent border (`var(--shop-gold)`)
- `--sk-facet-pill-radius`: Pill corner radius (9999px for pills, 6px for chips)
- High-contrast, black-and-white ink-saving overrides for `@media print`.

### 3.2 Dynamic Real-Time Count Recalculation Contract
When dimension $A$ (`direction`) changes, the mounter automatically executes `engine.computeCounts(items, 'category')` and updates inner `.sk-facet-count` spans without full DOM tear-down:
- Selecting **`Bride Side`** instantly updates the Category chips to show **`Attire (13)`**, **`Gold/Silver (4)`**, **`Bundles (5)`**, etc.
- Clicking **`↺ Reset Filters`** instantly restores global baseline counts.

---

## 4. Phased Definition of Done (DoD v1.7 Matrix) for SK-030

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

---

## 5. Certification Sign-Off & Official Ruling

The Joint Architecture & UI Council certifies that:
1. All four architectural layers (Headless Engine, UI Template, CSS Tokens, and Mounter) are fully agnostic and decoupled from `shopping_src`.
2. The solution is 100% portable to sibling repositories (`Task-Dashboard`, `OperatusOS`) with zero code alterations.
3. The phased plan conforms to strict TDD, binary validation gates, and `STD-PHASED-DEV-001`.

- **Principal Architect**: ✅ Certified (`STD-UI-PRIMITIVE-FACETED-FILTER-001` ratified)
- **UI/UX Craft Lead**: ✅ Certified (Layer 2 `.sk-facet-*` design system tokens ratified)
- **Reusable Primitives Lead**: ✅ Certified (`ui_primitives/` roster expansion approved)
- **Governance Lead**: ✅ Certified (`SK-030` 4-phase sequential DoD matrix registered)

**Official Ruling**: `AC-DEC-2026-074` is **APPROVED & CERTIFIED** for immediate Phase 1 execution under `SK-030`.
