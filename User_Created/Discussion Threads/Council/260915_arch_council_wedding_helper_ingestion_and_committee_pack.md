# Architecture & UI Council Decision Record: Wedding Helper External Benchmark Ingestion & Pre-Release Core Committee Decision Pack

**Decision Reference:** `AC-DEC-2026-017` / `UI-DEC-2026-013`  
**Standard Reference:** `CRDF-001` (Core Committee Release & Decision Finalization Pack) & `P-DECISION-REG-001` (Dual-Surfacing Scoped Decision Engine)  
**Parent Initiative:** `AC-DEC-2026-016` (Scalable Multi-Option Consensus, Chronological Event Stepper & Deep-Link Engine)  
**Date:** 2026-09-15  
**Status:** **APPROVED & SHIPPED**  
**Quorum:** Full Council (Lead Systems Architect, Principal Frontend & UI/UX Engineer, SSOT Compliance & Cultural Alignment Officer, Schema & Firestore Auditor, Service Layer Integrity Auditor, Dependency & Impact Auditor, Maintainability & Velocity Auditor)

---

## 1. Grounding Snapshot (RFG-001 §1)
- **Current Stage:** Pre-launch / Core Committee Release Gate
- **Module Count:** 6 Core Modules (Tasks, Liturgy, Procurement, Operations, Governance, Decision Registry)
- **Active Real Users:** 4–5 Core Committee Leads (Bride, Groom, Parents, Key Functional Chairs)
- **Team Size:** 1 Core Architect + Domain Leads
- **Core Domain Invariant:** **Daytime Vivaha with Hastaganthi at 12:00 PM (Noon)** (09:30 AM Barat, 10:30 AM Baranugam, 11:00 AM Varamala, 11:30 AM Mandap, 12:00 PM Hastaganthi, 12:30 PM Grand Vivaha Bhoji Feast, 03:30 PM Kanyavida departure).

---

## 2. Phase 0: Evidence Collection & Snapshot

- **Commit Hash:** `b9d9e43269bb2777d54f18f96e64431284224739`
- **Files Relied On:**
  - `docs/references/Wedding_Helper_Sheet.md` (lossless extraction of 7 sheets from external benchmark)
  - `js/decision-registry-data.js` and `public/js/decision-registry-data.js`
  - `js/marriage-state.js`, `public/js/marriage-state.js`, and `templates/web-spa-shell/public/js/marriage-state.js`
  - `01_TIMELINE_EVENTS/wedding_day/EVT-004_barat_and_wedding.md`
  - `02_RITUALS_CULTURE/specs/RIT-005_kanyadaan.md`
  - `cockpit_src/data/master_decisions.json`
  - `scripts/test-decision-registry.cjs` and `scripts/test-cockpit.cjs`
- **Duplication & Concept Collision Check:**
  - Grepped `DEC-` and `PROP-` across `js/decision-registry-data.js` and `cockpit_src/data/master_decisions.json`.
  - Confirmed `DEC-01` through `DEC-20` represent the 20 Decor Decisions governed by `master_decisions.json` and tested by `test:cockpit`.
  - Confirmed new committee choices cleanly take `DEC-21` (Grand Entry Atmospheric Production), `DEC-22` (Arrival Walkway Narrative), and `DEC-23` (Sangeet Media vs. Craft Promenade) without collision.
  - Confirmed `CLUSTER-ENTRY` is added as the 3rd decision cluster in `clusters`.

---

## 3. Phase 1: Independent Evaluations (7 Seated Members)

### 1. The SSOT Authority Auditor (`ssot-reconciliation`)
- **Position:** Approve the hybrid model. Mandate that all newly ingested items strictly anchor to canonical Daytime Vivaha milestones (12:00 Noon Hastaganthi) and avoid creating unlinked orphan micro-tasks.
- **Evidence:** `EVT-004` lines 12–25, `RIT-005`, and `Wedding_Helper_Sheet.md` lines 137–175. Lingering `Muhurtham 10:15` text in `events[4]` must be cleaned up to match the Daytime invariant.
- **Assumptions:** All T-7 operational items are anchored directly under existing parent work packages (`TSK-703`, `TSK-203`, `TSK-603`).
- **Trade-offs:** Requires discipline in maintaining dual data layers.
- **Risks & Dependencies:** Desynchronization between timeline markdown files and client JS state.
- **Challenge:** "If new operational items are created as standalone top-level tasks rather than nested sub-checklists, the task registry will balloon with micro-tasks that fragment committee attention."
- **Confidence:** High.

### 2. The Schema & Firestore Auditor (`firebase-firestore`)
- **Position:** Approve. The hybrid model uses client-side static state within `DECISION_REGISTRY_DATA` and `MARRIAGE_STATE`, requiring zero schema changes to Firestore and zero security rule alterations.
- **Evidence:** `firestore.rules` lines 1–120; `DECISION_REGISTRY_DATA` is client-side offline-first state.
- **Assumptions:** No dynamic Firestore writes are introduced before formal committee consensus.
- **Trade-offs:** Consensus tallies are currently stored in local browser memory (`localStorage`).
- **Risks & Dependencies:** Zero backend risk.
- **Challenge:** "Introducing dynamic Firestore voting synchronization before the static schema is locked will create unauthenticated write vulnerabilities in security rules."
- **Confidence:** High.

### 3. The Service Layer Integrity Auditor (`debug-backend` / `cos-invoke`)
- **Position:** Approve. Mandate 100% byte-for-byte parity across root and `public/` distribution files.
- **Evidence:** `scripts/test-decision-registry.cjs` lines 7–12 strictly asserts byte parity between `js/decision-registry-data.js` and `public/js/decision-registry-data.js`.
- **Assumptions:** Verification scripts are executed and assert 100% green.
- **Trade-offs:** Dual-file editing overhead.
- **Risks & Dependencies:** `test:decision-registry` failure if public files drift.
- **Challenge:** "Modifying `js/decision-registry-data.js` without simultaneously writing identical bytes to `public/js/decision-registry-data.js` will immediately break automated pre-flight CI gates."
- **Confidence:** High.

### 4. The Dependency & Impact Auditor (`change-impact-analysis`)
- **Position:** Approve. Adding `DEC-21`, `DEC-22`, `DEC-23` and `CLUSTER-ENTRY` has zero negative impact on UI rendering logic in `decision-registry.html` because cards and clusters are completely data-driven.
- **Evidence:** `decision-registry.html` loops dynamically over `window.DECISION_REGISTRY_DATA.items` and `clusters`.
- **Assumptions:** Array schemas match existing items.
- **Trade-offs:** Minimal memory footprint increase (+4 KB).
- **Risks & Dependencies:** Summary counts (`totalItems`, `pendingChoices`, `totalClusters`) must be incremented correctly.
- **Challenge:** "If the `summary` metadata in `decision-registry-data.js` is not updated to match the new item counts, header KPI widgets will display stale statistics."
- **Confidence:** High.

### 5. The File Placement Auditor (`file-placement-guardrail`)
- **Position:** Approve. Canonical data placement is `js/decision-registry-data.js` (mirrored to `public/js/`) and `js/marriage-state.js` (mirrored to `public/js/` and `templates/web-spa-shell/public/js/`).
- **Evidence:** Pre-flight layer 4 & 5 rules. `master_decisions.json` in `cockpit_src/data/` must NOT be touched.
- **Assumptions:** Zero files placed outside established directories.
- **Trade-offs:** None.
- **Risks & Dependencies:** None.
- **Challenge:** "Placing committee decision cards inside `master_decisions.json` instead of `decision-registry-data.js` will trigger a hard assertion failure in `test:cockpit` which requires exactly 20 steps."
- **Confidence:** High.

### 6. The Decision & Standards Auditor (`domain-modeling`)
- **Position:** Approve. Register standard `CRDF-001` (Core Committee Release & Decision Finalization Pack) in governance logs.
- **Evidence:** Standards catalog and `00_GOVERNANCE/decisions/` directory structure.
- **Assumptions:** Formal council record is committed and ledger updated.
- **Trade-offs:** Governance documentation overhead.
- **Risks & Dependencies:** None.
- **Challenge:** "Failing to document this decision in `Council_Ledger.md` creates audit drift and leaves future agents unable to verify why `DEC-21`..`23` were introduced."
- **Confidence:** High.

### 7. The Maintainability & Velocity Auditor (`ponytail` / P11) — **Assigned Dissenter**
- **Position:** **OBJECT to Option 1 in its raw form; DEMAND the Scoped Hybrid Model.**
- **Evidence:** `js/marriage-state.js` is already 2,365 lines long. Adding loose tasks increases file weight and maintenance debt.
- **Assumptions:** Committee members will be overwhelmed if presented with too many open questions at once.
- **Trade-offs:** Requires discipline to nest tasks rather than create new ones.
- **Risks & Dependencies:** Cognitive overload during committee review.
- **Challenge:** "Adding both new decision cards and a separate battery of operational tasks risks cognitive overload for the family committee, turning what should be an exciting review into an exhausting bureaucratic audit unless items are strictly grouped into actionable clusters with recommended defaults."
- **What would change my mind:** "Every new decision card must have a pre-selected '(Recommended)' default option, and operational countdown items must be folded into existing high-level tasks (`TSK-703`, `TSK-203`, `TSK-603`) as discrete checklist items rather than creating new top-level WBS nodes."
- **Confidence:** High.

---

## 4. Phase 2: Synthesis & Verbatim Challenge Resolutions

### Verbatim Challenge Resolutions

1. **Maintainability Auditor Challenge:**
   > *"Adding both new decision cards and a separate battery of operational tasks risks cognitive overload for the family committee, turning what should be an exciting review into an exhausting bureaucratic audit unless items are strictly grouped into actionable clusters with recommended defaults."*
   - **Resolution:** **Adopted**. In `CRDF-001`, all 3 new decision cards (`DEC-21`, `DEC-22`, `DEC-23`) feature explicit pre-selected recommended options (`selected: true` on recommended Option A), clear luxury benchmarks, and WhatsApp consensus sharing templates. Operational tasks are strictly folded into existing parent tasks (`TSK-703`, `TSK-203`, `TSK-603`), adding zero new top-level WBS nodes.

2. **File Placement Auditor Challenge:**
   > *"Placing committee decision cards inside `master_decisions.json` instead of `decision-registry-data.js` will trigger a hard assertion failure in `test:cockpit` which requires exactly 20 steps."*
   - **Resolution:** **Adopted**. `master_decisions.json` remains untouched at exactly 20 steps. New committee items are placed exclusively in `js/decision-registry-data.js` and `public/js/decision-registry-data.js`.

3. **Service Layer Integrity Auditor Challenge:**
   > *"Modifying `js/decision-registry-data.js` without simultaneously writing identical bytes to `public/js/decision-registry-data.js` will immediately break automated pre-flight CI gates."*
   - **Resolution:** **Adopted**. Scripted byte-for-byte mirroring was executed, verified by `npm run test:decision-registry`.

4. **SSOT Authority Auditor Challenge:**
   > *"If new operational items are created as standalone top-level tasks rather than nested sub-checklists, the task registry will balloon with micro-tasks that fragment committee attention."*
   - **Resolution:** **Adopted**. Zero standalone top-level tasks were created. All T-7 items are nested inside existing parent work packages.

5. **Dependency & Impact Auditor Challenge:**
   > *"If the `summary` metadata in `decision-registry-data.js` is not updated to match the new item counts, header KPI widgets will display stale statistics."*
   - **Resolution:** **Adopted**. `summary.totalItems` is updated to 31, `pendingChoices` to 9, and `totalClusters` to 3.

---

## 5. Shipped Architecture & Deliverables: `CRDF-001`

### A. Creative Decision Plane (`js/decision-registry-data.js`)
- **`DEC-21` (Grand Couple Entry Atmospheric Production & Special Effects)**:
  - Option A (Recommended): Low-Lying Dry Ice Cloud Fog + Shimmering Soap Bubbles (Safe indoor/marquee, zero residue, ethereal photo aesthetic).
  - Option B: Pyrotechnic Cold Spark Fountains (Gerb Units).
  - Option C: Mechanical Fresh Rose Petal Cannons & Floral Shower.
- **`DEC-22` (Arrival Walkway Narrative & Experiential Welcome Installation)**:
  - Option A (Recommended): Chronological 'Memory Lane' Archival Photo Passage along the 60ft starlit walkway culminating at wedding year.
  - Option B: Contemporary Family Silhouette & Shadow Profile Cutout Wall.
  - Option C: Heritage Odia Pattachitra Swagata Torana.
- **`DEC-23` (Sangeet Stage Digital Media Stream vs. Cultural Artisan Promenade)**:
  - Option A (Recommended): Blended Hybrid: Flanked Dual LED Relay Screens for performance candids + Foyer Artisan Promenade (Lac Bangle & Polaroid Trellis).
  - Option B: Pure Digital Media Focus (Full P3 LED Wall).
  - Option C: Pure Folk Craft Promenade (Unplugged stage & puppet theater).
- **`CLUSTER-ENTRY`**: Clustered decision option pod pairing Option A vs Option B vs Option C with 1-click WhatsApp consensus generator template.
- **Daytime Timing Sync**: Updated `events[4]` (`Day 2 Vedic Vivaha`) timing string to `"Day 2 Daytime Vivaha (09:30 - 16:30, Hastaganthi 12:00 Noon)"`.
- **Metadata Summary**: `totalItems: 31`, `pendingChoices: 9`, `totalClusters: 3`.

### B. Operational Task Plane (`js/marriage-state.js`)
- **`TSK-703` (Sangeet Choreography Rehearsals & Media)**:
  - Normalized `timeTag` to `'T-45 Days to T-5 Days'`.
  - Added T-7 Days song collection & cue sheet curation checklist item.
  - Added T-7 Days childhood/courtship photo and video montage compilation checklist item.
- **`TSK-203` (Cinematography, Drone & Photography Suite Contract)**:
  - Reconciled checklist item 2 to enforce outdoor-only drone flight invariant.
  - Added pre-planned must-have shot and reel list hand-off checklist item.
- **`TSK-603` (Vendor Contract & Invoice Compliance)**:
  - Normalized `timeTag` to `'T-90 Days to Day +5'`.
  - Expanded truncated checklist into 4-point vendor finalization protocol (contracts archived, written confirmation of reporting/arrival schedules, crew meal headcounts, milestone advance & balance schedule locked).
- **Synchronized Distributions**: Mirrored to `public/js/marriage-state.js` and `templates/web-spa-shell/public/js/marriage-state.js`.

---

## 6. RFG-001 Recommendation Classification Table

| Item | Classification | Rationale & Test |
| :--- | :--- | :--- |
| **`DEC-21`: Atmospheric Entry Production** | **Required Now** | Core Committee must finalize special effects permits before contracting AV vendor. |
| **`DEC-22`: Arrival Walkway Narrative** | **Required Now** | Decorator needs 4 weeks lead time for printing framed archival photo timeline or cutting silhouette boards. |
| **`DEC-23`: Sangeet Media vs Craft Stalls** | **Required Now** | Determines AV stage screen budget vs artisan vendor booking. |
| **`CLUSTER-ENTRY`: Entry Decision Pod** | **Required Now** | Enables family WhatsApp voting on entry special effects. |
| **`TSK-703`, `203`, `603` Checklist Enrichments** | **Required Now** | Eliminates known operational gaps at T-7 countdown. |
| **Daytime Vivaha Timing Sync in Decision Registry** | **Required Now** | Eliminates lingering 10:15 muhurtham text drift in `events[4]`. |

---

## 7. Process Notes (ICG-001 §3)
- **Gap:** Pre-existing `DEC-15`, `DEC-16`, and `DEC-17` in `js/decision-registry-data.js` created potential naming confusion with proposed committee decisions.
- **Proposed fix:** Explicitly reserved `DEC-01` through `DEC-20` for Decorator Cockpit master decisions and started committee voting additions at `DEC-21`. Applied in-session.
- **Gap:** `TSK-603` in `js/marriage-state.js` had an unclosed truncated checklist (`"All `CTR-"`) from an earlier draft.
- **Proposed fix:** Repaired in-session with the complete 4-point vendor finalization protocol.

---

## 8. Sign-Off & Verification Evidence
- Decision Registry & Consensus Engine: `npm run test:decision-registry` → `🎉 Decision Registry, Event Stepper & WhatsApp Consensus Validation: 100% GREEN & SYNCHRONIZED!`
- Decorator Cockpit Smoke Gate: `npm run test:cockpit` → `🎉 DECORATOR COCKPIT SMOKE GATE PASSED: 100% GREEN & MEETING READY!`
- Universal Pre-Flight Deployment Gate: `npm run verify:deployment` → `✅ ALL PRE-FLIGHT VERIFICATION GATES PASSED (100% GREEN)`
