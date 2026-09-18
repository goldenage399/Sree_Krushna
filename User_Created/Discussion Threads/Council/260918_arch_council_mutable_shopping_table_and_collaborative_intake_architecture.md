# 🏛️ Architecture & UI Council Deliberation: Real-Time Collaborative Firestore Shopping Engine & Live Mutable Table Grid

**Decision References:** `AC-DEC-2026-028` (Architecture) / `UI-DEC-2026-024` (UI/UX)  
**Standard Identifier:** `P-SHOPPING-FIRESTORE-COLLAB-001` (Real-Time Multi-Device Shopping Collaboration Standard)  
**Session Date:** 2026-09-18  
**Deliberation Type:** FULL Council Deliberation  
**Maturity Anchor (RFG-001):** Launch-Imminent / Operational Readiness — 4-5 Core Family Committee Users, 30+ Extended Family Reviewers, 3 Production Modules (Tasks, Decorator Cockpit, Shopping Registry).  
**Snapshot Commit Hash:** `c0db231944471117b7d858b244032a2432384caf`  
**Governing Workflows:** `.agent/workflows/architecture-council.md` & `.agent/workflows/ui-council.md`  
**Related SSOTs:** [`SPEC-PROC-TROUSSEAU-001.md`](../../04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md), [`firestore.rules`](../../firestore.rules), [`FEATURE_CATALOG.json`](../../FEATURE_CATALOG.json), [`ARCHITECTURE_SPEC.md`](../../ARCHITECTURE_SPEC.md)

---

## 1. Executive Summary & Problem Context

During on-the-ground wedding shopping trips in Bhubaneswar (e.g. at Boyanika, Manyavar, Kalamandir, and Khimji Jewellers across Janpath, Master Canteen, and Saheed Nagar), the shopping party (Bride, Groom, Sisters, Parents, and In-Laws) operates across multiple mobile devices simultaneously. 

To prevent coordination chaos, duplicated purchases, and budget drift, the team required:
1. **Real-Time Cross-Phone Synchronization**: When an item (e.g. a Vivaha Pata saree) is purchased, marking it "Purchased" and logging the actual negotiated price (e.g. ₹32,500) on one phone must immediately reflect on all other family members' phones without requiring page refreshes.
2. **Offline Resilience in Showrooms**: Basement retail spaces in Bhubaneswar often have spotty cellular connectivity. The system must buffer updates locally in IndexedDB and automatically sync upon reconnection without dropping edits.
3. **On-the-Fly Ad-Hoc Item Minting**: When unexpected items or liturgical samagri are discovered in stores, users must be able to add a new item on the spot with atomic sequential ID minting (`TRS-9##`).
4. **High-Density Mutable Table Mode**: An unadorned, rapid-action tabular data grid integrated directly into `#tab-shopping` in `https://sree-krushna-forever.web.app` alongside the existing Cards and Survey Studio.

---

## 2. Evidence Snapshot & Ground Truth Audit (Phase 0)

| Evidence Item | Source File / Artifact | Live Observation & Invariant |
| :--- | :--- | :--- |
| **Canonical Trousseau SSOT** | `04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md` | Contains 44 item specifications across 5 chapters with standardized `TRS-###` identifiers (`P-ENT-ID`). |
| **Production Shopping Data Layer** | `js/shopping-data.js` & `public/js/shopping-data.js` | Exports `window.SHOPPING_REGISTRY_DATA` containing `meta`, `chapters`, `clusters`, `stores`, and all 44 `items` with 100% byte parity. |
| **Firestore Client Architecture** | `public/js/modules/firestore-client.js` | Configures Firebase App, Firestore with `persistentLocalCache()` (IndexedDB offline cache), and atomic ID minting via `counters/{counterName}`. |
| **Firestore Security Boundary** | `firestore.rules` | Enforces declarative validation and authentication. Expanded under `AC-DEC-2026-028` with `isValidShoppingItemOverlay` and `isValidAdhocShoppingItem` under `/shopping_items/{itemId}` and atomic counter minting under `/counters/{counterId}`. |
| **SDCA Component Architecture** | `shopping_src/components/`, `styles/`, `scripts/controller.js` | Modular assembly compiled via `shopping_src/build.cjs`. Preserves `STD-MOD-COMP-001` (<500 lines per component file). |

---

## 3. Comparative Evaluation of Storage & Sync Models

| Evaluation Dimension | Client-Only LocalStorage | Real-Time Firestore Engine (`P-SHOPPING-FIRESTORE-COLLAB-001`) | Standalone Static Sheet |
| :--- | :--- | :--- | :--- |
| **Multi-Device Collaboration** | **Fails Completely**: Sandboxed to a single browser. Other phones cannot see updates during shopping. | **Optimal**: Real-time `onSnapshot` updates broadcast across all phones instantly. | **Moderate**: Requires switching to an external spreadsheet app. |
| **Offline Resilience** | Supported locally, but never synchronizes with peers. | **Built-in IndexedDB Cache**: Queues offline mutations in basements and flushes automatically on reconnect. | Requires active internet connection to edit Google Sheets. |
| **Data Integrity** | Prone to browser cache clearing or phone storage wipes. | **Persistent Cloud Backup**: Cloud Firestore document store with 1-click JSONL/CSV export. | High, but prone to accidental cell deletion. |
| **In-App Integration** | Minimal | **Seamless**: High-density table directly in `#tab-shopping` with live status dropdowns and price inputs. | Decoupled |

---

## 4. Official Council Rulings (`AC-DEC-2026-028` / `UI-DEC-2026-024`)

1. **Ruling 1 (Real-Time Firestore Backbone)**:
   All shopping progress tracking, purchase prices, notes, and ad-hoc items are persisted to Firestore under `shopping_items/{itemId}` and synced via `fsListenShoppingItems`, `fsSetShoppingItemStatus`, and `fsCreateShoppingItem` in `firestore-client.js`.
2. **Ruling 2 (Dual-Shape Document Contract)**:
   - **Shape A (Overlay)**: Overlays live operational fields (`status`, `actualPrice`, `actualStore`, `notes`, `purchasedBy`, `updatedBy`, `updatedAt`) onto canonical items `TRS-BR-01` to `TRS-OD-07`.
   - **Shape B (Ad-Hoc Addition)**: Stores on-the-spot items minted via `counters/shopping_items` with sequential IDs (`TRS-9##`).
3. **Ruling 3 (3-Way View Switcher & Mutable Table)**:
   `#tab-shopping` and `shopping-registry.html` provide a 3-way view toggle:
   - `[🛍️ Trousseau Catalog]` (Visual Cards, Carousels, Store Map, Lightbox)
   - `[📊 Live Mutable Table]` (High-Density Table, Inline Status Dropdowns, Actual Price Inputs, Live Budget HUD, + Add Item Modal)
   - `[📝 Family Survey Studio]` (Family Consultation & Printable A4 Dossier)
4. **Ruling 4 (Canonical Data Interchange Layer)**:
   The master catalog is exported to `04_PROCUREMENT_VENDORS/shopping_and_trousseau/shopping_items.jsonl` and `shopping_items.csv` via `scripts/export-shopping-jsonl.cjs`.
5. **Ruling 5 (Verification Gate Pass)**:
   Full test suite passes across `test:shopping` (44/44 items), `verify:modular-architecture` (45/45 checks), `verify:ui-lifecycle` (100% green), and `verify:deployment` (10/10 layers).

---

## 5. Council Ledger Sign-Off

- **Architecture Council Chair**: APPROVED & SIGNED (`AC-CHAIR-2026-028`)
- **UI/UX Council Chair**: APPROVED & SIGNED (`UI-CHAIR-2026-024`)
- **Commit Baseline**: Snapshot `c0db231944471117b7d858b244032a2432384caf`
