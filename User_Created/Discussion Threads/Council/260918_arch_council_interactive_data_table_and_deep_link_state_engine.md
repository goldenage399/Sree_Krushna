# 🏛️ Architecture & UI Council Deliberation: Interactive Data Table Architecture — Multi-Column Sorting, Hierarchical Grouping, Dual-Faceted Pill Filtering & Synchronized Deep-Link State

**Decision References:** `AC-DEC-2026-029` (Architecture) / `UI-DEC-2026-025` (UI/UX)  
**Standard Identifier:** `P-TABLE-INTERACTIVE-001` (Enterprise Interactive Data Table & Bidirectional Deep-Link State Engine)  
**Parent Specifications:** `AC-DEC-2026-027` (`P-QUICK-SHARE-001`), `AC-DEC-2026-028` (`P-SHOPPING-FIRESTORE-COLLAB-001`), `STD-MOD-COMP-001`, `STD-UI-LIFECYCLE-001`  
**Session Date:** 2026-09-18  
**Deliberation Type:** FULL Council Deliberation  
**Maturity Anchor (RFG-001):** Operational Readiness / Production In-Use — Real-Time Shopping Party in Bhubaneswar Retail Districts.  
**Governing Workflows:** `.agent/workflows/architecture-council.md` & `.agent/workflows/ui-council.md` (Featuring `impeccable` as Core Craft Auditor)  
**Related SSOTs:** [`SPEC-PROC-TROUSSEAU-001.md`](../../04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md), [`firestore.rules`](../../firestore.rules), [`FEATURE_CATALOG.json`](../../FEATURE_CATALOG.json), [`ARCHITECTURE_SPEC.md`](../../ARCHITECTURE_SPEC.md)

---

## 1. Executive Summary & Problem Context

Following the certification and deployment of the real-time collaborative Firestore shopping engine (`AC-DEC-2026-028`), stakeholders field-tested the live mutable table view in `#tab-shopping` and `shopping-registry.html`. While cross-phone data updates succeeded, users identified ergonomic limitations in scannability during fast-paced shopping:
1. **Unsegmented Monolithic List**: 44 items displayed as a flat table obscured liturgical milestones (Bridal Silks vs Groom Mandap vs In-Laws Gifting).
2. **Missing Multi-Column Sorting**: Users could not sort by Price, Status, or Store to batch purchases inside specific Bhubaneswar showrooms.
3. **Coarse Single-Pill Filtering**: Only domain categories could be filtered, lacking orthogonal status filtering (e.g. Bridal items that are Ordered or Purchased).
4. **URL & Share Link Decoupling**: Sharing the table via WhatsApp shared a generic URL instead of preserving the active user's filtered and sorted view.

---

## 2. Official Council Rulings (`AC-DEC-2026-029` / `UI-DEC-2026-025`)

1. **Ruling 1: Dynamic Grouping Engine (`P-TABLE-GROUP-001`)**:
   The table view toolbar features a segmented Group-By selector with three canonical modes:
   - `group=chapter` (**Default**): Groups items by liturgical chapter with section headers displaying aggregate metrics (`Items: X | Purchased: Y | Total Spent: ₹Z`).
   - `group=store`: Groups items by sourcing store (`actualStore || store`), optimized for physical in-store shopping sweeps.
   - `group=none` (**Flat Grid**): Renders all items in a single sortable grid for global budget analysis.

2. **Ruling 2: Multi-Column Tri-State Sorting (`P-TABLE-SORT-001`)**:
   Clicking sortable `<th>` headers cycles through: Neutral (`⇅`) ➔ Ascending (`▲`) ➔ Descending (`▼`). Supported sort keys: `title`, `category`, `role`, `store`, `budget`, `status`, `actualPrice`. All numerical values use monospaced tabular numerals (`font-variant-numeric: tabular-nums`).

3. **Ruling 3: Two-Tiered Faceted Filter Bar (`P-TABLE-FILTER-001`)**:
   - **Tier 1 (Category Facet)**: Multi-pill ribbon with dynamic count badges (`All 44`, `Bridal 10`, `Groom 10`, `Jewellery 7`, `Sara 12`, `Engagement 5`).
   - **Tier 2 (Status Facet)**: Secondary pill ribbon with real-time status counts (`Planned`, `Shortlisted`, `In Trial`, `Ordered`, `Purchased`).
   - Combined with real-time text query search and 1-click `[↺ Reset]` affordance.

4. **Ruling 4: Bidirectional URL Synchronization & Quick-Share (`P-QUICK-SHARE-001`)**:
   Table state continuously syncs to URL query parameters via `window.history.replaceState`. The `[🔗 Share Table]` button generates formatted WhatsApp invitations with deep links via `SKPrimitives.getStakeholderUrl()`.

5. **Ruling 5: Modularity & Parity Gate (`STD-MOD-COMP-001`)**:
   Preserves strict modular component limits (<500 lines per component). Recompiled via `shopping_src/build.cjs` with 100% byte-for-byte parity across standalone and in-app distribution targets.

---

## 3. Council Ledger Sign-Off

- **Architecture Council Chair**: APPROVED & SIGNED (`AC-CHAIR-2026-029`)
- **UI/UX Council Chair**: APPROVED & SIGNED (`UI-CHAIR-2026-025`)
- **Core Craft Auditor (`impeccable`)**: CERTIFIED FOR PRODUCTION
