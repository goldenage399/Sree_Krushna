# 🏛️ Architecture & UI Council Decision Record: Visual AI Discovery, Google Maps Navigation & Engagement Trousseau Hub

- **Decision Record:** `AC-DEC-2026-024` / `UI-DEC-2026-020`
- **Pattern Specification:** `P-SHOPPING-DISCOVERY-001` (Universal Visual AI Discovery & Geolocation Navigation Engine)
- **Parent Specifications:** `SPEC-PROC-TROUSSEAU-001` & `STD-MOD-COMP-001`
- **Date:** 2026-09-15
- **Status:** **APPROVED & SHIPPED**
- **Quorum:** Enterprise Architecture Board, Impeccable UI Craft Auditor, Cultural & Ritual Logistics Committee

---

## 1. Context & Architectural Problem Statement

Following the successful rollout of the interactive Family Survey Studio (`AC-DEC-2026-023`), family members and wedding hosts identified three critical operational and visual discovery friction points:
1. **Engagement Trousseau Gap**: Pre-wedding *Nirbandha* (Engagement / Ring Ceremony) articles (rings, engagement silks/lehengas, groom kurta sets, sagan thali platters, return vastra) were missing from the 34-item wedding checklist.
2. **Retail Navigation Ambiguity**: The 8 verified retail stores in Bhubaneswar lacked direct navigation access and specialty filtering, requiring manual map lookups across Janpath, Master Canteen, Saheed Nagar, and Ashok Nagar.
3. **Lack of Visual Search for Authentic Weaves**: Non-expert family members reviewing handloom pata, jewelry motifs, and sherwani silhouettes needed instant visual references to evaluate shortlisted options against market benchmarks.

---

## 2. Decision & Certified Architecture: The 3-Pillar Discovery Hub

The Council unanimously approved the **Optimal Hybrid Discovery Pattern (`P-SHOPPING-DISCOVERY-001`)** across three pillars:

### Pillar 1: Canonical Data Layer Expansion (`SPEC-PROC-TROUSSEAU-001`)
- Codified **Chapter 0: Engagement & Nirbandha Ceremony** (`chapter_engagement`).
- Expanded the canonical catalog from 34 to 39 items across 5 chapters:
  - `TRS-EG-01`: Diamond & Gold Engagement Rings (Bride & Groom) — Khimji / Lalchnd (₹45k–₹95k)
  - `TRS-EG-02`: Bride Engagement Saree / Pastel Handloom / Lehenga — Kalamandir / Boyanika (₹25k–₹45k)
  - `TRS-EG-03`: Groom Engagement Kurta Ensemble / Indo-Western Suit — Manyavar / Raymond (₹12k–₹22k)
  - `TRS-EG-04`: Decorative Ring Platter & Nirbandha Sagan Thali Hampers — Market Building Unit-2 (₹4.5k–₹9.5k)
  - `TRS-EG-05`: In-Laws Elder Return Vastra & Odia Sweets Hampers — Boyanika / Nimapada (₹18k–₹32k)
- Added `cluster_engagement_rings` with 3 competitive options (Solitaire Diamond, Dual-Tone Platinum, Heritage Vedic 22K Gold).

### Pillar 2: Vendor Store Directory Categorization & Google Maps Integration
- Classified all 8 verified stores into 4 specialty domains:
  - `silks`: Boyanika (Master Canteen), Kalamandir (Janpath)
  - `jewellery`: Khimji Jewellers (Janpath), Lalchnd Jewellers (Master Canteen)
  - `groomswear`: Manyavar & Mohey, Sherwani House (BMC Keshari), The Raymond Shop
  - `accessories`: Market Building (Unit-2 Plaza)
- Equipped each store card with a 1-click `[🗺️ Navigate ↗]` button linking to universal Google Maps search intent (`https://www.google.com/maps/search/?api=1&query=...`).
- Added interactive category filter pills (`[All Stores]`, `[🧵 Silks]`, `[💎 Gold & Silver]`, `[👑 Groomswear]`, `[🎀 Packaging]`).

### Pillar 3: Contextual 1-Click Visual AI & Image Search Engine
- Ported the QSR Construction Orchestration System (`indoor-dashboard.html:4580-4635`) visual search telemetry pattern.
- Implemented `window.openVisualSearch(query, mode)` generating high-precision search strings combining title, fabric/weave, color, and location context.
- Standardized on Google Images clean grid parameter `udm=2` (with optional Google AI Overviews `udm=50`).
- Rendered `[🔍 Visual Search ↗]` button on every item card in `itemsGrid` and every option card in `shoppingClusterPods`.

---

## 3. Verification & Compliance Matrix

| Audit Gate | Target Command | Result | Standard Reference |
| :--- | :--- | :--- | :--- |
| **Shopping Registry & Discovery Gate** | `npm run test:shopping` | **✅ PASS** | 39 items, 5 chapters, 5 clusters, 8 mapped stores verified |
| **Decision Registry Gate** | `npm run test:decision-registry` | **✅ PASS** | Cross-module synchronization intact |
| **Dynamic UI Lifecycle Gate** | `npm run verify:ui-lifecycle` | **✅ PASS** | 4/4 lifecycle & 3-trigger dismissibility checks green |
| **Modular Architecture SDCA Gate** | `npm run verify:modular-architecture` | **✅ PASS** | All files < 500 lines, 100% byte parity |
| **Mobile Responsiveness Gate** | `npm run verify:mobile` | **✅ PASS** | 16/16 checks green, touch targets >= 44px |
| **Pre-Flight Deployment Gate** | `npm run verify:deployment` | **✅ PASS** | All 10 pre-flight layers 100% green |
