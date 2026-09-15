# Architecture & UI Council Decision Record: Wedding Trousseau, "Sara" Gifting & Bhubaneswar Shopping Master Specification

**Decision Reference:** `AC-DEC-2026-018` / `UI-DEC-2026-014`  
**Standard Reference:** `SPEC-PROC-TROUSSEAU-001` & `P-SHOPPING-CONSENSUS-001` (Multi-Stakeholder Trousseau & Gifting Consensus Engine)  
**Parent Framework:** `P-COMPARE-SHARE-001` (Frictionless Deep-Linking & WhatsApp Consensus)  
**Date:** 2026-09-15  
**Status:** **APPROVED & SHIPPED**  
**Quorum:** Full Council (7 Seated Members: Lead Systems Architect, Principal Frontend & UI/UX Engineer, SSOT Compliance & Cultural Alignment Officer, Schema & Firestore Auditor, Service Layer Integrity Auditor, Dependency & Impact Auditor, Maintainability & Velocity Auditor)

---

## 1. Executive Summary & Context

With the Bride's side (*Kanyapaksha*) arriving in Bhubaneswar within the next 10 days for wedding shopping, the host requested an end-to-end, categorized shopping checklist spanning groomswear, bridal silks, lehengas, jewellery, and family gifting bundles (*"Sara"* / *Bhara*). The architecture needed to allow opinions from the bride, the groom's sisters, and the in-laws to be gathered and decided harmoniously without overwhelming non-technical relatives.

The Architecture Council evaluated three potential approaches (App-heavy, Docs-only, Quick-poll) and ratified a zero-gap hybrid architecture combining:
1. **A Canonical Cultural & Procurement SSOT**: `04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md`.
2. **An Offline-First Interactive Shopping & Consensus Portal**: `shopping-registry.html` (and `public/shopping-registry.html` with 100% byte parity).
3. **Multi-Stakeholder Consensus & WhatsApp Deep-Linking (`P-COMPARE-SHARE-001`)**: 1-click sharing to WhatsApp (`?mode=family&cluster=...` and `?mode=sisters`).
4. **Bhubaneswar Retail Directory & A4 Printable Run Sheet**: Verified market hubs (Master Canteen, Janpath, Saheed Nagar, Market Building Unit-2).

---

## 2. 5-Lens Architectural Evaluation

| Lens | Architectural Evaluation | Verdict |
|---|---|---|
| **1. User Empathy & Pragmatism** | Extended family members on mobile need immediate visual clarity without creating accounts. Zero-login URL deep links (`?mode=family`) with WhatsApp formatted text allow sisters, bride, and in-laws to vote with 1 tap. | **STRONG PASS** |
| **2. Architectural SSOT & Zero Duplication** | Items are declaratively defined in `js/shopping-data.js` and synced to `public/` via SDCA builders (`scripts/build-shopping-data.cjs`), avoiding hardcoded duplicate HTML strings. | **STRONG PASS** |
| **3. Performance & Asset Hygiene** | Pure Vanilla HTML5/CSS3/JS. Zero external JS libraries. Instant local load, 100% offline PWA compliant, and touch targets calibrated for mobile screens (320px–414px). | **STRONG PASS** |
| **4. Scoping & Non-Invasiveness (INC-086)** | All styles strictly encapsulated under `#shoppingRegistryRoot`, `.shop-*`, and `#shopModal`. Zero stylesheet leakage into host app. | **STRONG PASS** |
| **5. Portability & Offline PWA Invariant** | Fully operational offline in local browser. Guaranteed byte-for-byte identical output between root and `public/` files. | **STRONG PASS** |

---

## 3. Shipped Architecture & Deliverables

### A. Canonical SSOT Specification (`SPEC-PROC-TROUSSEAU-001.md`)
- Published in `04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md`.
- Organizes 30 items across 4 core categories:
  1. **Category A (Bridal Sanctum Trousseau)**: 7 items including Sacred Vivaha Pata (Hastaganthi 12:00 PM), Sangeet Lehenga, Haldi Saree, Odhani/Veil.
  2. **Category B (Groom Ceremonial Wardrobe)**: 8 items including Mandap Raw Silk Dhoti-Kurta, Ceremonial Patta (Angavastra), Royal Barat Sherwani, Safa & Mojaris.
  3. **Category C (Bridal Ornaments & Silver Filigree)**: 9 items including Chandra Haar, Sita Haar, Matha Patti, Silver Bridal Payal (Tarakasi), Bichhiya, Silver Sindoor Farua.
  4. **Category D (The "Sara" Gifting Bundles)**: 6 items including Mother-in-law Bomkai Silk Saree, Father-in-law Tussar/Raymond package, Sisters' Lehengas, Shringar Kula kit.
- 5-Day Bhubaneswar market itinerary with store recommendations, phone numbers, and operational hours.

### B. Shared Data Layer (`js/shopping-data.js` & `public/js/shopping-data.js`)
- Emitted by `scripts/build-shopping-data.cjs` (31,653 bytes each, 100% byte parity).
- Encapsulates 4 shopping chapters, 4 consensus clusters, 8 verified retail stores, and 30 itemized procurement records.

### C. Interactive Web Module (`shopping-registry.html` & `public/shopping-registry.html`)
- Emitted by `scripts/build-shopping-html.cjs` (43,105 bytes each, 100% byte parity).
- **Top 4-Stage Itinerary Stepper**: Step through Bridal Silks → Groom Wardrobe → Ornaments → In-Laws "Sara" Bundles with live completion counts.
- **Clustered Decision Option Pods**: Side-by-side alternative comparison cards for Vivaha Pata, Groom Mandap wear, Sangeet Lehenga, and In-Laws Samandhi Vastra.
- **Multi-Stakeholder Consensus Bar**: Real-time approval toggles for `👰 Bride`, `👭 Sisters`, and `🤝 In-Laws`.
- **1-Click WhatsApp Consensus Deep-Link Engine**: Copies formatted invitation messages with direct URLs to clipboard.
- **Bhubaneswar Store Navigator**: Directory cards for Boyanika, Khimji, Lalchnd, Kalamandir, Manyavar Mohey, Sherwani House, Market Building, and Raymond.
- **Printable A4 Run Sheet**: Clean `@media print` layout formatting checklist with store addresses for physical market trips.

### D. Automated Verification Gate
- `scripts/test-shopping-registry.cjs`: 100% Green (audits byte parity, DOM elements, data schemas, 30/30 category distribution).
- Registered into `package.json` as `npm run build:shopping` and `npm run test:shopping`.

---

## 4. Sign-Off & Verification Evidence
- `node scripts/test-shopping-registry.cjs` → `🎉 SHOPPING REGISTRY & CONSENSUS GATE PASSED: 100% GREEN & READY FOR BHUBANESWAR TRIP!`
- `npm run test:decision-registry` → `🎉 Decision Registry, Event Stepper & WhatsApp Consensus Validation: 100% GREEN & SYNCHRONIZED!`
- `npm run test:cockpit` → `🎉 DECORATOR COCKPIT SMOKE GATE PASSED: 100% GREEN & MEETING READY!`
- `npm run verify:deployment` → `✅ ALL PRE-FLIGHT VERIFICATION GATES PASSED (100% GREEN)`
