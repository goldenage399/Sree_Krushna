# 🏛️ Architecture & UI Council Decision Record: Shopping Tab Family Obligation Integration & Faceted Subview Navigation

**Standard Identifier:** `STD-SHOPPING-OBLIGATION-001` / `P-SHOPPING-FACETED-SUBVIEW-001` / `P-4PPSD`  
**Council Decision:** `AC-DEC-2026-062` / `UI-DEC-2026-047`  
**Governing Ticket:** `SK-020` ([`enhancement-notes/SK-020/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-020/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-27  
**Type:** FULL Architecture & UI Council Deliberation  
**Status:** ✅ CERTIFIED & IMPLEMENTATION-READY  
**Maturity Anchor (RFG-001):** Pre-launch wedding OS · 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20 expected as wedding approaches · 2 visual modules (Shopping Registry & Decorator Cockpit) · 1 developer.

---

## 1. Context & Motivation

Following the ratification of `OBL-001` (`AC-DEC-2026-061`), the Host directed:
> *"yes proceed and update the Shopping tab, so prepare a complete plan for the same and share"*

The challenge is integrating over 40 customary family obligations (*Vidhi Dayitva / Bhara / Sara*) into the existing interactive Shopping Registry (`shopping-registry.html` / `shopping-fragment.html`) without:
1. Corrupting the tightly vetted 44-item Canonical Trousseau Catalog (`SPEC-PROC-TROUSSEAU-001`).
2. Causing visual clutter or horizontal scroll fatigue on mobile (300px).
3. Conflating couple-centric trousseau shopping in Bhubaneswar with broader family covenants (cash honoraria, temple samagri, travel luggage).
4. Breaking existing automated verification gates (`npm run test:shopping` and `npm run verify:modular-architecture`).

---

## 2. Phase 0: Ground Truth & Evidence Collection

### 2.1 Repository Ground Truth
- **Shopping Registry SDCA Architecture**: Inspected `shopping_src/template.html`, `shopping_src/build.cjs`, `shopping_src/components/body.html`, and `shopping_src/scripts/controller.js`.
- **Existing Navigation Hierarchy**:
  - **Level 1 (`#shopViewSwitcher`)**: `[🛍️ Trousseau Catalog (44)]` ⟷ `[📊 Live Mutable Table Grid]` ⟷ `[📝 Interactive Family Survey]`.
  - **Level 2 (`#catalogSubnavStrip` / AC-DEC-2026-037)**: `[📋 Items Checklist (44)]` | `[🧭 5-Day Itinerary]` | `[🤝 Decision Pods (5)]` | `[📍 Retail Stores (8)]` | `[👁️ Full Run Sheet]`.
- **Data Layer Contract**: `js/shopping-data.js` and `public/js/shopping-data.js` (enforces 100% byte parity via `scripts/test-shopping-registry.cjs`).
- **Liturgical Attire Catalog**: 44 items strictly divided into Chapter 0 (Engagement, 5), Chapter 1 (Bridal, 10), Chapter 2 (Groom, 10), Chapter 3 (Jewellery, 11), Chapter 4 (Sara Gifting, 8).

### 2.2 External Industry Benchmarks & Cognitive Ergonomics
1. **Faceted Progressive Disclosure (Nielsen Norman Group)**: Adding 49 heterogeneous obligations directly to a 44-item shopping list creates severe cognitive overload (80+ items). Separating core couple wardrobe from extended inter-family gifting via progressive disclosure maintains focus while keeping data accessible.
2. **Bi-Directional Context Linking (Shopify / Amazon B2B)**: When an item satisfies an upstream obligation (e.g. Saree for Mother-in-Law `TRS-SA-01` fulfilling `OBL-003`), it displays a tactile badge linking back to the obligation.
3. **URL-First Deep-Linking (P-QUICK-SHARE-001)**: Stakeholders must be able to open WhatsApp links directly to the obligations subview (`?subview=obligations&family=bride`).

---

## 3. Options Evaluation (Trade-Off & Impact Radius Matrix)

The Council evaluated three candidate integration patterns:

| Dimension | Option A: Catalog Inflation (Merge into 44 Items) | Option B: Disjoint Standalone Portal (`obligations.html`) | **Option C: Integrated Subview Navigation Hub (ADOPTED)** |
| :--- | :--- | :--- | :--- |
| **Description** | Append all 49 obligations as `TRS-SA` items into `shopping_items.jsonl`, inflating catalog to 80+ items. | Build an entirely independent HTML portal `family-obligations.html`. | **Add `[📜 Family Obligations (49)]` mode to `#catalogSubnavStrip` with bi-directional badges in the catalog.** |
| **User Experience** | ❌ Severe scroll fatigue; couple's shopping list overwhelmed by extended gifts. | ⚠️ Fractured UX; forces family members to switch between different URLs. | ✅ **Seamless Ergonomics**: 1-click toggle within the familiar Shopping Registry interface. |
| **Data Integrity** | ❌ Conflates purchasable attire with cash honoraria, food gifts, and sacred samagri. | ⚠️ Duplicates data models and requires duplicate auth/styling infrastructure. | ✅ **Strict Decoupling**: Sourcing projection pipeline separates social covenants from store items. |
| **Test Stability** | ❌ Breaks `npm run test:shopping` (hard-coded 44/44 item count assertion fails). | ⚠️ Requires new test suites and CI scripts from scratch. | ✅ **100% Test Stability**: 44-item catalog stays intact; obligation mode is an additive subview. |
| **Mobile 300px Fit** | ❌ Infinite scrolling down hundreds of cards. | ⚠️ Inconsistent navigation drawers. | ✅ **Container Queries**: Responsive 1-col card grid reflowing smoothly to 300px. |

---

## 4. Phase 1: Independent Council Deliberation

### 4.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: APPROVE Option C. Preserving the 44-item baseline in `SPEC-PROC-TROUSSEAU-001` while providing an additive subview in `catalogSubnavStrip` guarantees that existing documented ADRs (`AC-DEC-2026-018`, `AC-DEC-2026-025`) remain 100% intact.
- **Evidence**: `04_PROCUREMENT_VENDORS/shopping_and_trousseau/SPEC-PROC-TROUSSEAU-001.md`.
- **Challenge**: *"How do we prevent items from appearing twice if an item is both a TRS item and an OBL line item?"*  
  *Resolution*: The Obligation view displays the *covenant* (who owes what to whom); the TRS card in the catalog displays the *procurement item*. The TRS card carries a `[📜 Fulfills OBL-###]` badge, and the OBL card carries a `[🛍️ Sourced via TRS-###]` link. They reference each other without duplicate data.

### 4.2 Schema & Firestore Auditor (`firebase-firestore`)
- **Position**: APPROVE. The obligation subview in the Shopping Tab reads from `js/shopping-data.js` (enriched with `window.SHOPPING_REGISTRY_DATA.obligations`). Real-time Firestore sync can later overlay handover status without altering the core schema.
- **Evidence**: `ARCHITECTURE_SPEC.md` §7.
- **Challenge**: *"Does adding 49 obligations inflate the client JS payload significantly?"*  
  *Resolution*: 49 lightweight JSON objects add ~18KB uncompressed, well below the 280KB budget.

### 4.3 Service Layer & SDCA Integrity Auditor (`debug-backend`)
- **Position**: APPROVE. The addition must strictly follow `STD-MOD-COMP-001` (SDCA):
  - Obligation cards markup in `shopping_src/components/obligations_view.html`.
  - Styles in `shopping_src/styles/10_obligations.css` (<500 lines).
  - Controller methods in `shopping_src/scripts/controller.js`.
  - Recompiled via `shopping_src/build.cjs` with 100% byte parity to `/public`.
- **Evidence**: `INV-SDCA-003` and `scripts/build-shopping-html.cjs`.

### 4.4 Dependency & Impact Auditor (`change-impact-analysis`)
- **Position**: APPROVE. Impact radius is strictly confined to `shopping_src/` and `scripts/build-shopping-data.cjs`. Zero impact on Decorator Cockpit or Decision Registry.

### 4.5 File Placement Auditor (`file-placement-guardrail`)
- **Position**: APPROVE. Conforms to established SDCA component structure.

### 4.6 Decision & Standards Auditor (`complex-architecture-blueprint`)
- **Position**: RATIFY as `STD-SHOPPING-OBLIGATION-001` and `AC-DEC-2026-062`.

### 4.7 Auth & Governance Gatekeeper (`protocol-enforcer-pre-code`)
- **Position**: APPROVE. Adheres to pre-implementation planning discipline.

### 4.8 Maintainability & Velocity Auditor (ASSIGNED DISSENTER — RFG-001)
- **Position**: DISSENT against rewriting the entire Shopping Registry DOM or building a complex virtualized list.
- **Challenge**: *"Will rendering 49 new obligation cards cause DOM lag or mobile jank on budget Android phones?"*
- **Resolution**: Certified. The subview uses standard CSS Container Queries and lazy DOM rendering. The obligation section is unrendered/hidden until the user explicitly selects `data-subview="obligations"`.

---

## 5. Plan Feasibility Audit (`plan-review.md`)

- **Requirements**: Provide a frictionless, mobile-optimized interface for family elders and coordinators to track 49 ritual obligations alongside retail shopping.
- **Architecture**: Faceted subview in `#catalogSubnavStrip` with family segment filter (`All`, `Bride ⟶ Groom`, `Groom ⟶ Bride`) and event milestone accordions.
- **Sequential Phasing**:
  - Phase 1: Canonical Scaffolding & Contract Verification (SK-020).
  - Phase 2: Schema Validation Suite (`test-obligation-contract.cjs`).
  - Phase 3: Sourcing Projection Engine (`compile-obligations.cjs` generating `obligations-data.js`).
  - Phase 4: Full 49-Obligation Dataset Ingestion.
  - Phase 5: Shopping Tab SDCA Component Architecture (`obligations_view.html` + `10_obligations.css`).
  - Phase 6: Interactive Controller Wiring, Deep-Link URL State, and WhatsApp Quick-Share.
  - Phase 7: Automated Byte Parity & Governance Verification.
- **Risk Assessment**:
  - Risk: 44-item test failure. Mitigation: 44-item catalog remains completely isolated from obligation subview data.

---

## 6. Architecture Council Certified Ruling (`AC-DEC-2026-062`)

1. **Adoption of Faceted Subview Navigation (Option C)**:
   - In `#catalogSubnavStrip`, add a dedicated 6th operating mode: `[📜 Family Obligations (49)]` (`data-subview="obligations"`).
   - In `#shopWelcomeBanner`, add a secondary CTA `[📜 View Family Obligations]`.
2. **Bi-Directional Cross-Domain Badging**:
   - Trousseau items in the 44-item catalog that fulfill an obligation carry a tactile badge `[📜 Fulfills OBL-###]` that deep-links into the obligation card.
   - Obligation cards display `[🛍️ View Shopping SKU (TRS-###)]` linking directly to the store/trial details.
3. **Family Side & Event Segmented Filtering**:
   - Segmented filter bar inside the obligation subview: `[🌺 All (49)]` | `[👰 Bride Side (28)]` | `[🤵 Groom Side (21)]` | `[⏳ Unresolved (6)]`.
4. **URL Deep-Linking & Stakeholder Quick-Share**:
   - `window.setCatalogSubView('obligations')` updates URL query string to `?subview=obligations`.
   - Stakeholder quick-share button added for WhatsApp: `[🌺 Share Obligations with Family]`.
5. **Implementation Authorization**:
   - Authorizes execution of the 7-phase implementation plan under `SK-020`, starting immediately with **Phase 1 (Tasks 1.1–1.4)**.

---

## 7. Status & Sign-Off

- **Council Ruling**: ✅ **UNANIMOUSLY CERTIFIED & RATIFIED** (`AC-DEC-2026-062` / `UI-DEC-2026-047`)
- **Implementation Status**: **READY FOR PHASE 1 EXECUTION**
