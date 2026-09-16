# INC-089 — Liturgical Attire Conflation & Multi-Chapter Trousseau Catalog Drift

**Incident ID**: `INC-089`  
**Date**: `2026-09-16`  
**Severity**: High (Cultural Invalidation & Procurement SSOT Drift)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standards**: `P-LITURGICAL-ATTIRE-001` (`AC-DEC-2026-025` / `UI-DEC-2026-021`), `SPEC-PROC-TROUSSEAU-001`, `STD-MOD-COMP-001`  
**Affected Component**: `04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md`, `js/shopping-data.js`, `shopping_src/components/body.html`, `shopping_src/components/survey_studio.html`, `docs/references/A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md`  

---

## 1. Executive Summary & Root Cause

During interactive trousseau review and family survey preparation, two systemic flaws were surfaced by the wedding hosts:
1. **Theological vs. Photographic Liturgical Conflation**:
   - The user inquired: *"Why is the Sherwani not listed under Groom Mandap Liturgical Attire? Check other such gaps across all events."*
   - In modern wedding photo albums and social reels, grooms are predominantly photographed on the decorative stage wearing royal embroidered Sherwanis (`TRS-GR-03`). This led earlier drafts of the shopping registry to create ambiguity around mandap wear.
   - **Root Cause**: Stitched, courtly Persian/Mughal garments (Sherwanis) are strictly non-Vedic. In authentic Odia Hindu Vivaha liturgy (*Hastaganthi*, *Havan*, *Kanyadaan*, *Saptapadi*), the groom **must** wear unstitched consecrated pure silk (*Ahatavasana*): the canonical **Sambalpuri Silk Joda & Dhoti** (`TRS-OD-04`). Furthermore, sitting 1.5 meters from an active havan fire for 3 hours in a heavy poly-lined velvet/zardozi sherwani causes acute heat exhaustion and traps sacred thread (*Yajnopavita*) oblations.
   - **Resolution**: Institutionalized the **Dual-Look Groom Transition Protocol (`P-LITURGICAL-ATTIRE-001`)**: Look 1 (Barat Sherwani) for grand arrival and stage Varmala photos $\to$ 15-minute green room change $\to$ Look 2 (Pure Silk Sambalpuri Joda) for mandap fire rites.
2. **Cross-Event Liturgical Gaps & Multi-Chapter Trousseau Drift**:
   - Audit revealed 5 essential sacred articles were completely missing:
     - Bride & Groom sacred crowns: Odia Shola & Silver Filigree Mukuta Set (`TRS-OD-05`).
     - Knotting vastra: Baula Patta & Hastaganthi Bandhana Vastra Set (`TRS-OD-06`).
     - Haldi attire: Bride Yellow Saree & Fresh Floral Jewellery Suite (`TRS-BR-08`).
     - Groom anointing wear: Groom Snana Haldi Tussar Silk Kurta & Dhoti Ensemble (`TRS-GR-10`).
     - Agni offerings: Handcrafted Bamboo Kula for Laja Homa & Odia Alta Set (`TRS-OD-07`).
   - Meanwhile, rapid UI feature sprints (`AC-DEC-2026-022`, `024`, `025`) expanded code data from 30 $\to$ 34 $\to$ 39 $\to$ 44 items, while the governing markdown SSOT `SPEC-PROC-TROUSSEAU-001.md` remained un-synchronized at 30 items.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

| Surface | Status | Impact & Remediation |
| :--- | :--- | :--- |
| **UI Surface** | **AFFECTED** | Shopping Registry (`shopping-registry.html` & `shopping_src/components/`) displayed 44 items, updated KPI banners, 5 category filter pills, 8 store cards with Maps buttons, and contextual Visual AI search buttons. All verified responsive without horizontal overflow. |
| **Data Surface** | **AFFECTED** | Expanded `js/shopping-data.js` and `public/js/shopping-data.js` from 39 to 44 items across 5 chapters, 5 clustered decision pods, and 8 store models. Maintained 100% byte-for-byte distribution parity (48,261 bytes). |
| **Reactive / State Surface** | **AFFECTED** | Deployed `window.openVisualSearch(query)` for Google Images grid telemetry (`udm=2`), interactive radio selection in Survey Studio, live sticky budget calculation, and print synchronization. |
| **Service / API Surface** | **AFFECTED** | Standardized external search URL schemas for Google Maps intent (`https://www.google.com/maps/search/?api=1&query=...`) and Google Images search. Programmatic global APIs verified idempotent. |
| **Module Surface** | **AFFECTED** | Rebuilt modular SDCA distributions via `node scripts/build-shopping-html.cjs`, maintaining strict compliance with `STD-MOD-COMP-001` (zero builder scripts > 500L) and dual-release byte parity. |
| **Governance Surface** | **AFFECTED** | Synchronized canonical SSOT `04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md` and `docs/references/` to 44 items (Version 2.0.0). Ratified Architecture & UI Council Decision `AC-DEC-2026-025` / `UI-DEC-2026-021`, updated `A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md`, and registered in `Council_Ledger.md`. |

---

## 3. Timeline of Events

1. **2026-09-15 17:00 IST**: User prompted `/prompt-clarity` challenging why Sherwani was omitted from Groom Mandap Liturgical Attire and requesting a cross-event cultural gap audit.
2. **2026-09-15 17:15 IST**: Conducted deep theological, liturgical, and visual research: resolved the distinction between Barat/Varmala stage photography and Vedic havan fire rites (*Ahatavasana* unstitched pure silk).
3. **2026-09-15 17:30 IST**: Identified 5 missing ritual articles across Mangala Snana, Hastaganthi, Laja Homa, and Grihapravesha. Formulated the 5-item expansion (39 to 44 items).
4. **2026-09-15 17:45 IST**: Implemented data layer expansion in `js/shopping-data.js` and synchronized with `public/js/shopping-data.js`.
5. **2026-09-15 18:00 IST**: Rebuilt HTML distributions via SDCA, updated `shopping_src/components/body.html` and `survey_studio.html`.
6. **2026-09-16 01:15 IST**: Automated testing confirmed 100% green pass on `test:shopping` (44/44 items) and full regression suite (`test:decision-registry`, `verify:ui-lifecycle`, `verify:modular-architecture`, `verify:mobile`, `verify:deployment`).
7. **2026-09-16 10:20 IST**: Triggered `/ssot-domain-mapper`, `/ssot-reconciliation`, and `/post-incident-governance`. Reconciled `SPEC-PROC-TROUSSEAU-001.md` from 30 to 44 items, updated `A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md`, and sealed documentation wiring.

---

## 4. Invariant Classification & New Structural Standards

1. **`INV-LITURGY-001` (Sacred vs. Courtly Garment Separation Invariant)**:
   - Wedding wardrobe taxonomies MUST NOT classify courtly/stitched garments (Sherwanis, Indo-Western suits) as Mandap Liturgical Attire for Vedic havan rites.
   - Any multi-look groom wardrobe MUST explicitly declare the **Dual-Look Transition Protocol** with a designated 15-minute green room changing window.
2. **`INV-TROUSSEAU-SYNC-001` (Trousseau Catalog & SSOT Parity Invariant)**:
   - The canonical item inventory in `js/shopping-data.js`, `SPEC-PROC-TROUSSEAU-001.md`, and `A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md` MUST remain in 100% item count and chapter parity.
   - Automated tests (`scripts/test-shopping-registry.cjs`) act as a hard gate preventing deployment if item counts diverge.

---

## 5. Verification & Compliance Matrix

| Audit Gate | Command | Result | Standard Reference |
| :--- | :--- | :--- | :--- |
| **Shopping Registry Gate** | `npm run test:shopping` | **✅ PASS** (44/44 items) | `SPEC-PROC-TROUSSEAU-001` |
| **Decision Registry Gate** | `npm run test:decision-registry` | **✅ PASS** | Synchronized |
| **UI Lifecycle Gate** | `npm run verify:ui-lifecycle` | **✅ PASS** | `STD-UI-LIFECYCLE-001` |
| **Modular SDCA Gate** | `npm run verify:modular-architecture` | **✅ PASS** | `STD-MOD-COMP-001` (44/44 checks) |
| **Mobile Responsiveness Gate** | `npm run verify:mobile` | **✅ PASS** | `M-GATE-01` (16/16 checks) |
| **Pre-Flight Deployment Gate** | `npm run verify:deployment` | **✅ PASS** | 10 Pre-Flight Layers Green |
| **Governance Wiring Gate** | `npm run verify:governance-wiring` | **✅ PASS** | P82 Compliant |
