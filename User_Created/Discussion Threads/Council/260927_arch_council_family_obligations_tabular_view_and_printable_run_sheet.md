# 🏛️ Architecture & UI Council Decision Record: Family Obligations Tabular View, Dual Card/Table Mode & Printable Run Sheet Architecture

**Council Reference:** `AC-DEC-2026-064` / `UI-DEC-2026-048`  
**Standard Activated:** `STD-SHOPPING-OBLIGATION-002` / `P-OBLIGATION-TABLE-PRINT-001` / `P-4PPSD`  
**Governing Ticket:** `SK-022` ([`enhancement-notes/SK-022/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-022/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-27  
**Type:** FULL Architecture & UI Council Deliberation  
**Status:** ✅ **APPROVED & CERTIFIED**  
**Quorum:** Full Joint Council (8 Domain Auditors Seated)  
**Governing Workflows:** `.agent/workflows/architecture-council.md` (SOP-WFL-ARCH-COUNCIL-001) & `.agent/workflows/plan-review.md`  

---

## 1. Grounding Snapshot & Reality-First Maturity Anchor (RFG-001)

- **Maturity Stage**: **Pre-Launch / System Usability & Print Hardening** (49 customary family obligations codified under `02_RITUALS_CULTURE/obligations/` and rendered in `#shoppingObligationsView`).
- **Target User Personas**:
  1. *Host / Wedding Coordinators*: High-speed cross-checking of all 49 ritual handovers, cash honoraria, and relative attire commitments during family meetings.
  2. *Family Elders (Parents, Uncles, Aunts)*: Non-digital review requiring physical A4 printed paper run sheets to verify Vidhi Dayitva, verify obligor ⟶ recipient assignments, and tick off physical items with ink.
- **Current Defect / Usability Gap**:
  The existing Family Obligations subview (`#shoppingObligationsView`) renders exclusively as a **card grid** (`.shop-obl-cards-grid`). While visually attractive on desktop monitors, it suffers from two major operational handicaps:
  1. *Screen Scannability*: Comparing 49 cards requires excessive vertical scrolling (~4,000px); users cannot quickly sort or filter horizontally across columns like a spreadsheet.
  2. *Printing Pathology*: Calling `window.print()` triggers the browser's default print dialog on dark-themed, un-optimized flex cards, resulting in 15+ pages of toner-wasting printouts with split cards across page margins.
- **Burden-of-Proof Constraint**: The council must deliver an immediate, ink-friendly printable tabular run sheet for family consultation without altering the underlying `OBL-###` data contract, without breaking SDCA modular limits (<500 lines per file), and without degrading mobile 300px performance.

---

## 2. Problem Statement & System Discovery (SDP-001 §6)

### A. The Core Dilemma: Card-Only Layout in an Executive Handover Domain
In `shopping_src/components/obligations_view.html`, all 49 obligations are rendered as rich cards:
`<div class="shop-obl-card" id="card-OBL-###">`.
Unlike the Commercial Sourcing view which features both a visual catalog and the High-Density Live Mutable Table Grid (`#shoppingTableViewSection > div.shop-table-container` per `AC-DEC-2026-034`), the Family Obligations subview lacks a native spreadsheet table.

### B. Usability & Environmental Pathologies
1. **Zero High-Density Scannability**: Elders and coordinators cannot see the holistic picture of an entire ritual milestone (e.g. *EVT-004 Mandap Vivaha*) on one screen.
2. **Ink & Paper Waste**: A card layout printed directly consumes ~18 sheets of paper and significant black toner due to dark card styling.
3. **Missing Sign-off Hardware**: Paper run sheets for Indian weddings require tactile coordinator verification check-boxes (`[ ] Handed Over | Verified by: ________`) at the physical venue.

---

## 3. Systematic Comparative Evaluation of Options

| Evaluation Dimension | Option A: Standalone Printable HTML File Only | Option B: Markdown Table in Artifact/Chat Only | Option C: In-App Table View Mode Only | **Option D (Council Hybrid): Dual-Mode Table + Integrated `@media print` + Instant Standalone Artifact (ADOPTED)** |
| :--- | :--- | :--- | :--- | :--- |
| **Description** | Single static HTML file (`family-obligations-print.html`) for browser printing. | Markdown table output directly in documentation and artifacts. | Add `[🗂️ Cards] ⟷ [📊 Table]` layout toggle in `#shoppingObligationsView`. | **Deliver immediate standalone printable HTML + Markdown table artifact, and scaffold in-app Dual-Mode Table with dedicated `@media print` engine.** |
| **Immediate Availability** | High (standalone file). | Immediate (in chat/docs). | Requires build & compile. | **Immediate**: User receives standalone printable artifact instantly while systemic in-app feature is planned. |
| **Elder Paper Usability** | High (clean A4 format). | Low (poor browser print rendering). | High (once compiled). | **Optimal**: High-contrast, black-and-white, milestone-grouped A4 landscape table with signature lines. |
| **In-App Integration** | None (disjoint file). | None. | High (integrated into registry). | **100% Native**: Users can toggle between visual Cards and dense Table inside the live app with 1 click. |
| **Search & Sort Sync** | Static (no dynamic JS). | Static. | Full interactive spreadsheet sorting/filtering. | **Full Parity**: Live search, family side filter, category pills, and milestone filter work across both cards and table. |
| **SDCA & Parity Risk** | Zero (isolated file). | Zero. | Medium (touches SDCA components). | **Zero Regression**: Modular component addition under 500 lines; 100% byte parity enforced via `build.cjs`. |

---

## 4. Multi-Disciplinary Council Deliberations (Phase 1)

### 4.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: APPROVE Option D. The tabular view directly reflects the fields codified in `02_RITUALS_CULTURE/obligations/` and `js/obligations-data.js` without inventing or omitting data.
- **Evidence**: All 49 records maintain exact 1:1 mapping with `OBL-001` through `OBL-049`.

### 4.2 Schema & Firestore Auditor (`firebase-firestore`)
- **Position**: APPROVE. The tabular rendering reads directly from `window.FAMILY_OBLIGATIONS_DATA.obligations`. Zero Firestore schema changes or database writes are introduced; the operation is 100% read-only presentation logic.

### 4.3 Service Layer & SDCA Integrity Auditor (`debug-backend`)
- **Position**: APPROVE with strict guardrails:
  - `shopping_src/components/obligations_view.html` must remain under 500 lines.
  - `shopping_src/styles/10_obligations.css` (currently 460 lines) must not exceed 500 lines. Print styles must be concisely factored.
  - Recompilation must pass `npm run verify:modular-architecture` with 100% byte parity to `/public`.

### 4.4 Dependency & Impact Auditor (`change-impact-analysis`)
- **Position**: APPROVE. Blast radius is strictly confined to `shopping_src/`. Zero impact on Decorator Cockpit, Decision Registry, or Core Firebase Auth.

### 4.5 File Placement Auditor (`file-placement-guardrail`)
- **Position**: APPROVE. Enhancement ticket registered as `SK-022` in `enhancement-notes/SK-022/00_ENHANCEMENT_INDEX.md` and recorded in `ENHANCEMENT-MASTER-REGISTRY.md`.

### 4.6 Decision & Standards Auditor (`complex-architecture-blueprint`)
- **Position**: RATIFY as `STD-SHOPPING-OBLIGATION-002` and `AC-DEC-2026-064`.

### 4.7 Auth & Governance Gatekeeper (`protocol-enforcer-pre-code`)
- **Position**: APPROVE. Follows mandatory pre-implementation ticket gate (`STD-PHASED-DEV-001` / `AC-DEC-2026-042`). Phase 1 plan output using `writing-plans` with mandatory plan hard-stop before code mutation.

### 4.8 Maintainability & Velocity Auditor (ASSIGNED DISSENTER — RFG-001)
- **Position**: DISSENT against heavyweight virtualized spreadsheet libraries (e.g. Handsontable, AG Grid).
- **Resolution**: Certified. The table will use standard semantic HTML (`<table class="shop-data-table">`) styled with CSS Container Queries, requiring zero external npm dependencies and weighing <10KB.

---

## 5. Plan Feasibility Audit (`plan-review.md`)

- **Scope Clarity**: Provide immediate printable artifact + implement in-app dual layout mode (`[🗂️ Cards] ⟷ [📊 Table]`) + dedicated print stylesheet.
- **DoD Feasibility**: 4 sequential phases with verifiable validation gates (VG-1 to VG-4).
- **Test Integrity**: Test script `scripts/test-obligations-table.cjs` will assert that all 49 obligations render correctly in tabular format.

---

## 6. Council Verdict & Certification

**VERDICT: ✅ UNANIMOUSLY APPROVED & CERTIFIED**
- **Action**: Scaffolded `SK-022` in `[UI-QUALITY]` / `[BUSINESS-LOGIC]`.
- **Immediate Deliverable**: Output Phase 1 Implementation Plan and immediate printable standalone table artifact.
