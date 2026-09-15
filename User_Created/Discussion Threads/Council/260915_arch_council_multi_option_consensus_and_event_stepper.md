# Architecture & UI Council Decision Record: Scalable Multi-Option Consensus, Chronological Event Stepper & Deep-Link Engine

**Decision Reference:** `AC-DEC-2026-016` / `UI-DEC-2026-012`  
**Standard Reference:** `P-COMPARE-SHARE-001` (Scalable Multi-Option Consensus & Deep-Link Engine) & `P-EVENT-STEPPER-001` (Chronological Event Stepper & Milestone Locking)  
**Parent Initiative:** `AC-DEC-2026-015` (Event-Grouped Visual Decision Comparator & Universal Lightbox System)  
**Date:** 2026-09-15  
**Status:** **APPROVED & SHIPPED**  
**Quorum:** Full Council (Lead Systems Architect, Principal Frontend & UI/UX Engineer, SSOT Compliance & Cultural Alignment Officer)

---

## 1. Executive Summary & Problem Context
Following the deployment of `P-VISUAL-CAROUSEL-001`, user feedback and executive planning identified two critical operational gaps:
1. **Cluster Disconnection & Unpaired Alternatives**: In the initial linear plate index, `PLATE-01` (Vedic Lotus Mandap, index 0) was separated from `PLATE-10` (Royal Carved Telugu Mandap, index 9) and `PLATE-11` (Suspended Dome, index 10). Users reviewing the mandap decision were forced to hunt across indices rather than evaluating competing options side-by-side.
2. **Chronological Event Flow & Decision Locking**: Hosts needed a structured, chapter-by-chapter progression through the wedding timeline (`Day 1 Haldi` → `Day 1 Mehendi` → `Day 1 Sangeet` → `Day 2 Vedic Vivaha` → `Infrastructure`), enabling them to lock decisions milestone-by-milestone.
3. **Frictionless Family Sharing & Consensus (`P-COMPARE-SHARE-001`)**: Extending option comparison to family members required zero-login, mobile-optimized deep links via WhatsApp (`?mode=family&cluster=mandap`) that display clear voting affordances without overwhelming administrative controls.

---

## 2. 5-Lens Architectural Evaluation

| Lens | Architectural Evaluation | Verdict |
|---|---|---|
| **1. User Empathy & Pragmatism** | Non-technical family members on mobile need immediate visual clarity without logging in. Pre-formatted WhatsApp text with deep links delivers 1-tap review and voting. | **STRONG PASS** |
| **2. Architectural SSOT & Zero Duplication** | Competing options are grouped into semantic clusters (`CLUSTER-MANDAP`, `CLUSTER-STAGE`) in `js/decision-registry-data.js` derived from canonical plates, preventing scattered definitions. | **STRONG PASS** |
| **3. Performance & Mobile Hardening** | Touch-friendly cards, CSS-only transitions, and URL query param state hydration (`P-DEEP-LINK-001`). Zero external JS dependencies or tracking cookies. | **STRONG PASS** |
| **4. Scoping & Non-Invasiveness (INC-086)** | All components scoped under `#decisionRegistryRoot`, `#eventStepperSection`, `#clusterPodsContainer`, and `.dr-*`. Zero stylesheet leakage into host app. | **STRONG PASS** |
| **5. Portability & Offline PWA Invariant** | Fully operational offline. Generates identical byte-for-byte outputs across root and `public/` distributions (`decision-registry.html` and `js/decision-registry-data.js`). | **STRONG PASS** |

---

## 3. Shipped Architecture & Deliverables

### A. Chronological Event Stepper & Milestone Locking (`P-EVENT-STEPPER-001`)
- **Top Milestone Progress Bar (`#eventStepperSection` / `#milestoneTrack`)**:
  - Displays 5 sequential wedding chapters with phase numbers, timing badges, and completion tallies:
    1. Phase 1: ☀️ Haldi & Arrival (09:00 - 13:00)
    2. Phase 2: 🌿 Mehendi (14:30 - 17:00)
    3. Phase 3: 🌙 Sangeet & Party (19:00 - 23:30)
    4. Phase 4: 🪔 Day 2 Vedic Vivaha (06:00 - 14:00, Muhurtham 10:15)
    5. Phase 5: 🏗️ Venue Infrastructure
  - **Active Event Action Bar (`#eventActionBar`)**:
    - Contextual status indicator showing currently selected milestone.
    - `🔒 Freeze & Lock This Event's Choices` button: persists locked state to `localStorage` and updates milestone badges (`✓ Locked`).

### B. Functional Option Clustering (`#clusterPodsContainer`)
- Competitor plates grouped into semantic design pods:
  - **`CLUSTER-MANDAP`** (Governs `DEC-14`):
    - Option A: Vedic Lotus Mandap (`PLATE-01`)
    - Option B: Royal Carved Telugu Mandap (`PLATE-10`)
    - Option C: Suspended Floral Lotus Canopy Dome (`PLATE-11`)
  - **`CLUSTER-STAGE`** (Governs `DEC-12`):
    - Option A: Concert Production Stage & P3 LED Wall (`PLATE-03`)
    - Option B: Midnight Blooms Reflective Mirror Stage (`PLATE-12`)
- Interactive radio selection with real-time consensus tallies (`A: 1 | B: 0 | C: 0`) persisted locally.

### C. Deep-Link & Family Consensus Engine (`P-DEEP-LINK-001` / `P-COMPARE-SHARE-001`)
- **URL Parameter State Hydration**:
  - `?mode=family`: Activates family welcome banner (`#familyWelcomeBanner`), suppresses administrative controls, and presents streamlined voting view.
  - `?event=wedding`: Automatically selects active milestone and filters visual cards and decisions.
  - `?cluster=mandap`: Automatically navigates to active milestone and opens fullscreen comparative Lightbox.
  - `?plate=PLATE-10`: Directly launches inspector lightbox for specific plate.
- **1-Click WhatsApp Consensus Generator**:
  - `📱 Share for Family Vote` button copies formatted invitation messages with deep links directly to system clipboard.
  - Pre-formatted templates for mandap and stage reviews include option titles, plate references, and direct action URLs.

### D. Verification Gate & Parity Audit
- `npm run test:decision-registry`: 100% GREEN (asserts stepper, cluster pods, milestone track, URL parser, WhatsApp generators, and byte-parity).
- Root & Public HTML: 85,073 bytes (100% match).
- Root & Public Data JS: 51,249 bytes (100% match).

---

## 4. Sign-Off & Verification Evidence
- Verification Script: `node scripts/test-decision-registry.cjs` → `🎉 Decision Registry, Event Stepper & WhatsApp Consensus Validation: 100% GREEN & SYNCHRONIZED!`
- Pre-flight Gate: `npm run verify:deployment` → `✅ ALL PRE-FLIGHT VERIFICATION GATES PASSED (100% GREEN)`
- Cockpit Smoke Gate: `npm run test:cockpit` → `🎉 DECORATOR COCKPIT SMOKE GATE PASSED: 100% GREEN & MEETING READY!`
