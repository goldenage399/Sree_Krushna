# Architecture & UI Council Decision Record: Dual-Surface Family Consultation Survey, Odia Cultural Heirlooms & Trousseau Decision Gates

**Decision Reference:** `AC-DEC-2026-022` / `UI-DEC-2026-018`  
**Standard Reference:** `P-SURVEY-PRINT-001` (Dual-Surface Offline-First Family Survey & Heritage Invariant)  
**Parent Framework:** `SPEC-PROC-TROUSSEAU-001` & `STD-MOD-COMP-001` (Modular Component Architecture)  
**Date:** 2026-09-15  
**Status:** **APPROVED & CERTIFIED**  
**Quorum:** Full Council (7 Seated Members: Lead Systems Architect, Principal Frontend & UI/UX Engineer, SSOT Compliance & Cultural Alignment Officer, Schema & Firestore Auditor, Service Layer Integrity Auditor, Dependency & Impact Auditor, Maintainability & Velocity Auditor)

---

## 1. Executive Summary & Context

Ahead of the joint shopping expedition in Bhubaneswar with the Bride's family (*Kanyapaksha*), the host raised three critical strategic and cultural requirements:
1. **Physical Consultation Form for Non-Digital Stakeholders**: Key decision-makers (grandparents, senior elders, aunts, mothers) will not navigate digital web interfaces or fill online forms. A paper-first, ink-friendly A4 consultation questionnaire was required to allocate tentative budget brackets, record preferences, and establish formal family alignment.
2. **Authentic Odia Cultural Heirlooms & Ritual Vessels**: Deep contextual research into Odia bridal traditions revealed essential ceremonial assets that must not be omitted:
   - Sacred **Nuapatna Khandua Pata** silk with *Gita Govinda* calligraphic weaves, consecrated during *Diya Mangula Puja*.
   - Pure hand-cast **Balakati bell-metal (*Kansa*)** dinner and ritual thali set for the newlywed couple's auspicious first meal.
   - Consecrated **Cuttack Tarakasi (silver filigree)** *Sindura Phuda* (vermilion container) and *Pana Batta* (betel box), honouring the cultural prohibition against gold on feet/lower vessels.
   - Traditional **Sambalpuri Groom Joda & Silk Dhoti** with authentic Sambalpuri *Bandha* border work.
3. **Tailoring vs. Readymade Economics & Lead-Time Gating**:
   - Master Gents Tailoring (Janpath fabric sourcing + Ashok Nagar/Rajmahal master craftsmen) delivers bespoke fit and high-end silk finish at ₹12,000–₹16,500 versus readymade branded alternatives (Manyavar/Tasva) at ₹35,000–₹55,000 (~55–65% commercial savings).
   - Bridal blouse hand-embroidery (*Maggam* / *Aari* work) in Saheed Nagar / Bapuji Nagar requires a non-negotiable 7–10 day crafting window; bridal silk fabric must be dropped off on Day 1 of the Bhubaneswar trip.

The Council ratified the **Dual-Surface Family Survey Pattern (`P-SURVEY-PRINT-001`)**, establishing both a standalone physical A4 printable dossier and a 1-click browser print engine inside the modular Shopping Registry (`shopping_src/`).

---

## 2. 5-Lens Architectural Evaluation

| Lens | Architectural Evaluation | Verdict |
|---|---|---|
| **1. User Empathy & Pragmatism** | Respects non-digital family reality. Provides clean, high-contrast monochrome A4 printouts with large touchable checkboxes `[ ]`, rupee brackets, and handwritten note lines. Eliminates tech friction entirely for senior family elders. | **STRONG PASS** |
| **2. Cultural Fidelity & SSOT Integrity** | Directly anchors authentic Odia wedding customs (Nuapatna Khandua Pata, Balakati bell metal, Cuttack Tarakasi filigree, Puri Nirmalya) into the canonical trousseau schema (`SPEC-PROC-TROUSSEAU-001`). 34 items total across 4 distinct chapters. | **STRONG PASS** |
| **3. Commercial Governance & Decision Gates** | Enforces structured financial gates: custom tailoring vs off-the-shelf readymade economics, explicit lead-time buffer warnings (10-day turnaround), and tier-based budget allocations before physical store visits. | **STRONG PASS** |
| **4. Modular Component Architecture (`STD-MOD-COMP-001`)** | Print view and controller actions are completely decoupled within `shopping_src/` (`04_toast_and_print.css`, `body.html`, `controller.js`). Recompiled cleanly via `scripts/build-shopping-html.cjs` with 100% byte parity between root and `public/`. | **STRONG PASS** |
| **5. Portability & Offline Usability** | Operates 100% offline without network round-trips. Print engine relies purely on CSS `@media print` directives and native `window.print()` targeting `#familySurveyDossierPrintView`. | **STRONG PASS** |

---

## 3. Shipped Architecture & Deliverables

### A. Canonical Physical A4 Consultation Dossier (`A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md`)
- Published in `docs/references/A4_FAMILY_SHOPPING_CONSULTATION_DOSSIER.md`.
- Features ink-friendly ASCII styling, explicit section breaks, and structured budget decision brackets:
  - **Section 1**: Bridal Sanctum Trousseau & Sacred Pata (8 items, including Khandua Pata & Maggam blouse lead-time gate).
  - **Section 2**: Groom Ceremonial Wardrobe & Custom Tailoring (9 items, including Ashok Nagar custom tailoring vs Manyavar readymade cost-benefit comparison).
  - **Section 3**: Ornaments, Silver Filigree & Balakati Kansa (10 items, including Cuttack Tarakasi Sindura Phuda & Balakati hand-cast Kansa dinner set).
  - **Section 4**: In-Laws Gifting Bundles (*"Sara"* / *Bhara*) (7 items, including Sambalpuri Groom Joda & Samandhi Vastra).
  - **Section 5**: Bhubaneswar Artisan & Tailor Market Directory (Boyanika, Priyadarshini, Khimji, Ashok Nagar Gents Tailors, Saheed Nagar Bridal Boutiques, Balakati artisans).
  - **Section 6**: Family Sign-Off & Allocation Ledger (Elder, Groom, Bride, In-Laws approval signatures).
- Indexed in `docs/DOCUMENTATION-INDEX.md`, `CLAUDE.md`, and `GEMINI.md`.

### B. Enriched Shared Data Layer (`js/shopping-data.js` & `public/js/shopping-data.js`)
- Enriched dataset from 30 to **34 items**:
  - `TRS-OD-01`: Nuapatna Khandua Pata (Traditional Odia Bridal Sacred Silk).
  - `TRS-OD-02`: Balakati Hand-Cast Kansa Set (Traditional Bell-Metal Dinner Set).
  - `TRS-OD-03`: Cuttack Tarakasi Silver Sindura Phuda & Pana Batta (Pure Silver Filigree Ritual Containers).
  - `TRS-OD-04`: Sambalpuri Groom Joda & Silk Dhoti (Traditional Handloom Groom Attire).
- Added explicit `tailoringDecision` metadata to `TRS-GR-03` (Barat Sherwani) contrasting Bespoke Custom Tailoring (₹12,000–₹16,500, 7–10 days) with Readymade Branded (₹35,000–₹55,000, 1–2 days).
- Emitted with 100% byte parity (36,547 bytes each).

### C. Web App Modular Print Engine (`shopping_src/`)
- Implemented in accordance with `STD-MOD-COMP-001`:
  - `shopping_src/components/body.html`: Added `[📝 Print Family Survey]` toolbar button and `#familySurveyDossierPrintView` container.
  - `shopping_src/styles/04_toast_and_print.css`: Scoped `@media print` rules under `body[data-print-target="survey"]` to isolate paper output, enforce black/white contrast, hide navigation chrome, and preserve table layouts.
  - `shopping_src/scripts/controller.js`: Implemented `window.printFamilySurvey()` lifecycle hook (sets print target attribute, triggers native browser print dialog, and cleans up state).
- Compiled through `node scripts/build-shopping-html.cjs` to `shopping-registry.html` and `public/shopping-registry.html` (125,779 bytes each, 100% byte parity).

### D. Automated Verification Suite
- Updated `scripts/test-shopping-registry.cjs` to validate 34 items (Bridal: 8, Groom: 9, Jewellery: 10, Sara: 7) and data integrity.
- Verified zero errors and zero warnings across all project gates:
  - `npm run test:shopping` → 100% Green (34/34 items verified).
  - `npm run verify:modular-architecture` → 44/44 checks passed.
  - `npm run verify:governance-wiring` → 0 errors, 0 warnings.
  - `npm run verify:mobile` → 16/16 checks passed.
  - `npm run verify:deployment` → All 9 deployment layers passed.

---

## 4. Sign-Off & Verification Evidence

- `node scripts/test-shopping-registry.cjs` → `🎉 SHOPPING REGISTRY & CONSENSUS GATE PASSED: 100% GREEN & READY FOR BHUBANESWAR TRIP!`
- `npm run verify:modular-architecture` → `🎉 ZERO MONOLITHIC COMPONENT INVARIANT VERIFIED: 44/44 CHECKS PASSED (100% GREEN)`
- `npm run verify:governance-wiring` → `🎉 GOVERNANCE WIRING VERIFIED: 0 broken link errors, 0 schema violations, 0 warnings.`
- `npm run verify:deployment` → `✅ ALL PRE-FLIGHT VERIFICATION GATES PASSED (100% GREEN)`

Signed by the Architecture & UI Council:
- **Lead Systems Architect:** APPROVED
- **Principal Frontend & UI/UX Engineer:** APPROVED
- **SSOT Compliance & Cultural Alignment Officer:** APPROVED
- **Schema & Firestore Auditor:** APPROVED
- **Service Layer Integrity Auditor:** APPROVED
- **Dependency & Impact Auditor:** APPROVED
- **Maintainability & Velocity Auditor:** APPROVED
