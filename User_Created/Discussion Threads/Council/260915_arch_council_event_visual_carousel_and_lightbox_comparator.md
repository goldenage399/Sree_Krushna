# Architecture & UI Council Decision Record: Event-Grouped Visual Decision Comparator & Universal Lightbox System

**Decision Reference:** `AC-DEC-2026-015` / `UI-DEC-2026-011`  
**Standard Reference:** `P-VISUAL-CAROUSEL-001` (Event-Grouped Visual Decision Comparator)  
**Parent Initiative:** `AC-DEC-2026-014` (Unified Pending Decision Registry & Idea Incubator Dashboard)  
**Date:** 2026-09-15  
**Status:** **APPROVED & SHIPPED**  
**Quorum:** Full Council (Lead Systems Architect, Principal Frontend & UI/UX Engineer, SSOT Compliance & Cultural Alignment Officer)

---

## 1. Executive Summary & Problem Context
The user requested a visual comparator mechanism to allow family members and executive decision-makers to:
1. Browse and compare shortlisted stage, mandap, and entrance concepts grouped cleanly by wedding events (Day 1 Haldi, Day 1 Mehendi, Day 1 Sangeet, Day 2 Vedic Vivaha, Infrastructure).
2. Efficiently share the 12 canonical visual plates (`PLATE-01` to `PLATE-12`) between the **Decorator Cockpit** (`decorator-cockpit.html`) and the **Master Decision Registry** (`decision-registry.html`) without code or asset duplication.
3. Bridge ideation proposals (`PROP-01` to `PROP-07`) and pending host decisions (`DEC-08`, `DEC-12`, `DEC-14`, `DEC-15`) with high-resolution visual previews and side-by-side alternative comparison modes.

---

## 2. 5-Lens Architectural Evaluation (Plan Review Framework)

| Lens | Architectural Evaluation | Verdict |
|---|---|---|
| **1. User Empathy & Pragmatism** | Indian wedding decor decisions involve extended family consensus. Visual comparison across 3 mandap options or 2 sangeet stages drives immediate alignment without technical jargon. | **STRONG PASS** |
| **2. Architectural SSOT & Zero Duplication** | Reuses canonical plate store `assets/decor/registry.json` and enriches `js/decision-registry-data.js` via automated build scripts (`scripts/build-decision-registry-data.cjs`). | **STRONG PASS** |
| **3. Performance & Asset Hygiene** | Pure CSS scroll-snap (`scroll-snap-type: x mandatory`). Zero external JavaScript carousel libraries (0 KB added npm bloat). Lazy-loaded images with fallback placeholders. | **STRONG PASS** |
| **4. Scoping & Non-Invasiveness (INC-086)** | All styles strictly encapsulated under `#decisionRegistryRoot`, `#drLightboxModal`, or `.dr-*` namespaces. Zero global leak into host app or body styles. | **STRONG PASS** |
| **5. Portability & Offline PWA Invariant** | 100% offline-first. Runs in local browser without active internet connection or external CDN dependencies. Guaranteed byte-parity between root and `public/`. | **STRONG PASS** |

---

## 3. Shipped Architecture & Deliverables

### A. Shared Canonical Data Layer (`P-SSOT-DATA`)
- Enriched `js/decision-registry-data.js` and `public/js/decision-registry-data.js` (46.6 KB, 100% byte parity):
  - Embeds all 12 canonical visual plates (`PLATE-01` to `PLATE-12`) with event tags, dimension specs, status badges, architectural notes, and AI generative prompts.
  - Formulates 6 event taxonomy categories:
    - 🌟 All Events (12 plates)
    - ☀️ Day 1 Haldi & Arrival (2 plates: `PLATE-05`, `PLATE-08`)
    - 🌿 Day 1 Mehendi (2 plates: `PLATE-06`, `PLATE-08`)
    - 🌙 Day 1 Sangeet & Party (3 plates: `PLATE-03`, `PLATE-09`, `PLATE-12`)
    - 🪔 Day 2 Vedic Vivaha (5 plates: `PLATE-01`, `PLATE-02`, `PLATE-09`, `PLATE-10`, `PLATE-11`)
    - 🏗️ Venue Infrastructure (3 plates: `PLATE-04`, `PLATE-05`, `PLATE-07`)
  - Cross-references pending decisions and proposals (`DEC-08`, `DEC-09`, `DEC-12`, `DEC-13`, `DEC-14`, `DEC-15`, `DEC-16`, `PROP-01` through `PROP-07`) with their corresponding visual plates and video references.

### B. Visual Concept Lookbook & Stage Comparator Carousel (`#visualShowcaseSection`)
- Positioned prominently below the KPI metrics banner.
- Event filter pill tabs with live plate counters.
- Smooth horizontal scroll-snap track with desktop arrow buttons (`‹` / `›`) and mobile swipe support.
- Plate cards featuring:
  - 16:9 aspect-ratio photo preview with graceful fallback.
  - ID badge, event tag, and status badge (`LOCKED SPEC`, `PENDING HOST VOTE`, `SHORTLISTED OPTION`, `INCUBATING PROPOSAL`).
  - Zone & dimension specs.
  - Quick action buttons: `🔍 Inspect`, `⚖️ Compare`, and `⚡ View Decision` (smooth scrolls down to the decision card with a gold highlight pulse).

### C. Universal Lightbox Modal & Multi-Option Comparator (`#drLightboxModal`)
- Fullscreen modal with glassmorphism blur and backdrop dismissal.
- High-res photo display with prev/next navigation (`‹` / `›`) and keyboard arrows (`←` / `→`, `ESC`).
- **CAD Vector Blueprint Toggle**: For plates with SVG schematics (`PLATE-01` to `PLATE-08`), toggle seamlessly between photo and scalable architectural CAD blueprint.
- **Side-by-Side Comparison Mode**:
  - Mandap Alternatives: `PLATE-01` (Lotus) vs `PLATE-10` (Carved Telugu) vs `PLATE-11` (Suspended Dome).
  - Sangeet Stage Alternatives: `PLATE-03` (Concert Stage) vs `PLATE-12` (Midnight Blooms Mirror Stage).
- Bottom thumbnail hop rail displaying all 12 plates with golden active indicators.

### D. Automated Build & Verification Gate
- `npm run build:decision-registry`: Builds both data layer and HTML with automated byte-parity verification.
- `npm run test:decision-registry`: Verifies DOM contracts, ID integrity, event taxonomy, and byte-for-byte parity.
- `npm run test:cockpit`: 100% GREEN (12 canonical plates synchronized across both cockpit and registry).
- `npm run verify:deployment`: 100% GREEN (All 9 preflight layers green).

---

## 4. Sign-Off & Verification Evidence
- `node scripts/test-decision-registry.cjs` → `🎉 Decision Registry & Visual Carousel Validation: 100% GREEN & SYNCHRONIZED!`
- Root & Public HTML size: `69,047 bytes` (Exact match).
- Root & Public Data JS size: `46,638 bytes` (Exact match).
