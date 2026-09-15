# INC-087 — Linear Asset Ingestion Index Separation & Friction-Heavy Voting Architecture

**Incident ID**: `INC-087`  
**Date**: `2026-09-15`  
**Severity**: Medium (User Experience Fragmentation & Adoption Blocker)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & System Owner  

---

## 1. Executive Summary & Root Cause

Following the deployment of the Visual Decision Registry and Carousel (`P-VISUAL-CAROUSEL-001`), user testing and architectural review revealed a major usability and adoption gap:
1. **Linear Asset Ingestion Index Separation**:
   - Visual plates had been ingested in two distinct chronological waves: `PLATE-01` to `PLATE-08` during initial Marquee Tender drafting, and `PLATE-09` to `PLATE-12` during subsequent ideation intake.
   - The visual carousel iterated plates strictly by linear array index (`plates.map(...)`).
   - Consequently, `PLATE-01` (Vedic Lotus Mandap, index 0) was separated from its competing alternative `PLATE-10` (Royal Carved Telugu Mandap, index 9) and `PLATE-11` (Suspended Lotus Dome, index 10) by 8 intervening unrelated plates. Decision-makers could not compare mandap alternatives without repeatedly scrolling across the track.
2. **Chronological Milestone Flow Void**:
   - Decisions lacked a top-level timeline sequence, forcing hosts to scroll through a flat list of 28 decisions across all 2 days rather than locking choices event-by-event (`Day 1 Haldi` → `Day 1 Mehendi` → `Day 1 Sangeet` → `Day 2 Vedic Vivaha` → `Infrastructure`).
3. **High-Friction Family Voting**:
   - Inviting extended family to review decor options required sharing links to an administrative screen containing complex contract clauses, WBS milestones, and raw JSON export buttons, causing friction and confusion for non-technical family members.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

| Surface | Status | Impact & Remediation |
|---|---|---|
| **UI Surface** | **AFFECTED** | Visual comparator UI separated competing options and lacked milestone progression. Remedied by building the Chronological Event Stepper (`#eventStepperSection` / `#milestoneTrack`), Clustered Decision Option Pods (`.dr-cluster-card`), and Family Review Mode (`?mode=family`). |
| **Data Surface** | **AFFECTED** | Canonical data layer `DECISION_REGISTRY_DATA` in `js/decision-registry-data.js` lacked clustering and event taxonomy schema. Remedied by adding declarative `clusters` array (`CLUSTER-MANDAP`, `CLUSTER-STAGE`), mapping `clusterId` and `clusterOption` to plates, and establishing event chapters. |
| **Reactive / State Surface** | **AFFECTED** | User option selections, milestone lock certification, and family vote counts required persistent client-side tracking. Remedied with `localStorage` state serialization and live consensus counters (`formatVoteTally`). |
| **Service / Deep-Link Surface** | **AFFECTED** | No mechanism existed to share direct option comparisons to family messaging channels. Remedied with `P-DEEP-LINK-001` query parser (`?mode=family`, `?event=wedding`, `?cluster=mandap`) and 1-click WhatsApp message generation with formatted clipboard export. |
| **Module Surface** | **AFFECTED** | Ensured SDCA build pipeline (`scripts/build-decision-registry-data.cjs` and `scripts/build-decision-registry-html.cjs`) produces 100% byte-identical files across root and `public/` distributions. |
| **Governance Surface** | **AFFECTED** | Ratified Architecture & UI Council Decision `AC-DEC-2026-016` / `UI-DEC-2026-012`, logged in `Council_Ledger.md`, and captured universal pattern `declarative-option-clustering-and-consensus.md`. |

---

## 3. Timeline of Events

1. **07:30 IST**: User questioned why `PLATE-01` (Vedic Lotus Mandap) and `PLATE-10` (Royal Carved Telugu Mandap) were not grouped together in the carousel, and requested an event-by-event decision locking flow.
2. **07:45 IST**: User underscored that the solution must be scalable and usable for family members who need to easily see and compare options on mobile.
3. **08:00 IST**: Traced root cause to chronological array insertion order and lack of declarative semantic grouping in `js/decision-registry-data.js`.
4. **08:15 IST**: Formulated `AC-DEC-2026-016` / `UI-DEC-2026-012` specifying `P-OPTION-POD-001`, `P-EVENT-STEPPER-001`, and `P-COMPARE-SHARE-001`.
5. **08:25 IST**: Built and shipped `scripts/build-decision-registry-data.cjs` and `scripts/build-decision-registry-html.cjs`. Verified 100% byte parity between root and `public/`.
6. **08:30 IST**: Updated `scripts/test-decision-registry.cjs` to assert DOM contracts and data layer schemas. Ran test suite to 100% green.

---

## 4. Invariant Classification & New Structural Standards

1. **`STD-DEC-POD-001` (Declarative Decision Option Clustering)**:
   - When presenting competing alternatives for a design or procurement decision, items MUST be grouped into semantic clusters (`CLUSTER-<DOMAIN>`) in the canonical data layer, rather than relying on linear array iteration or file creation timestamps.
2. **`STD-EVENT-STEP-001` (Chronological Milestone Precedence Gate)**:
   - Decision dashboards spanning multi-day liturgical and logistical timelines MUST provide chapter-based event progression (`Phase 1` through `Phase N`) with explicit milestone locking affordances (`🔒 Freeze & Lock Choices`).
3. **`STD-DEEP-LINK-001` (Frictionless Family Sharing Contract)**:
   - Public/family review links MUST support URL state hydration (`?mode=family&cluster=<id>`) that suppresses internal administrative controls, operates with zero authentication barriers, and offers 1-tap WhatsApp invitation generation.

---

## 5. Verification Evidence

- `npm run test:decision-registry`: 100% Green (DOM elements, milestone track, cluster pods, URL parser, WhatsApp sharing verified).
- `npm run test:cockpit`: 100% Green (Cockpit smoke test & fragment isolation).
- `npm run verify:deployment`: 100% Green (All 9 pre-flight layers green).
