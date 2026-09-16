# 🏛️ Architecture & UI Council Decision Record: Universal Stakeholder Quick-Share Station & Canonical Deep-Link Architecture

- **Decision Record:** `AC-DEC-2026-027` / `UI-DEC-2026-023`
- **Pattern Specification:** `P-QUICK-SHARE-001` (Universal Stakeholder Quick-Share Station & Canonical Deep-Link Architecture)
- **Bug Resolution:** `BUG-SHARE-BASEURL-001` (SPA Pathname Drift in Standalone Share Link Generation)
- **Parent Specifications:** `ARCHITECTURE_SPEC.md`, `STD-MOD-COMP-001`, `STD-UI-LIFECYCLE-001`, `P-MULTI-SURFACE-DEPLOY-001`
- **Date:** 2026-09-16
- **Status:** **APPROVED & SHIPPED**
- **Quorum:** Enterprise Architecture Board, UI/UX Council, Liturgical Logistics Committee, Security & Deployment Gatekeepers

---

## 1. Context & Forensic Defect Discovery

### 1.1 The Operational Challenge
Following the successful deployment of the 3-Tier Multi-Surface Web App (`AC-DEC-2026-026`), executive hosts noted that accessing stakeholder-specific URLs (`?mode=family`, `?mode=sisters`, cluster consensus links) required manually remembering or searching past chat windows to retrieve URLs, rather than having them readily available inside the application.

Furthermore, a forensic audit of the share link generation logic revealed **`BUG-SHARE-BASEURL-001`**:
```javascript
// DEFECTIVE IMPLEMENTATION:
const baseUrl = window.location.origin + window.location.pathname;
const shareUrl = `${baseUrl}?mode=family`;
```
- When running on standalone portals (`/shopping-registry.html`), `window.location.pathname` resolved to `/shopping-registry.html`.
- **CRITICAL FAILURE IN SPA MODE**: When running mounted inside the main SPA (`https://sree-krushna-forever.web.app/#tab-shopping`), `window.location.pathname` resolved to `/` or `/index.html`.
- Consequently, copying family review links from within the main dashboard generated:
  `https://sree-krushna-forever.web.app/?mode=family`
  which directed family elders to the authenticated dashboard login screen rather than the frictionless standalone shopping portal.

---

## 2. Universal Stakeholder Deep-Link Catalog

The Council cataloged all ten canonical stakeholder deep links across the Marriage OS ecosystem:

| # | Stakeholder Circle | Target Portal / Anchor | Query Parameters | WhatsApp Template & Intent |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Parents & Extended Family** | `/shopping-registry.html` | `?mode=family` | Frictionless family survey voting & A4 print form. |
| 2 | **Sisters' Styling Circle** | `/shopping-registry.html` | `?mode=sisters` | Sister coordinates, pastels, and matching ensembles. |
| 3 | **Vivaha Pata Trousseau** | `/shopping-registry.html` | `?cluster=vivaha_pata&mode=family` | Sacred wedding silks & Khandua Pata consensus. |
| 4 | **Groom Mandap Attire** | `/shopping-registry.html` | `?cluster=groom_mandap&mode=family` | Authentic Odia Dhoti, Khandua Joda, and Mandap wear. |
| 5 | **Family Decor Consensus** | `/decision-registry.html` | `?event=EVT-004&mode=family` | Event-by-event decor stepper with 1-click voting. |
| 6 | **Vivaha Mandap Decor** | `/decision-registry.html` | `?event=EVT-004&cluster=mandap_structure&mode=family` | Sacred Vedic Vivaha Mandap theme alignment. |
| 7 | **Sangeet Stage Decor** | `/decision-registry.html` | `?event=EVT-003&cluster=sangeet_stage&mode=family` | Sangeet stage backdrop, trussing, and lighting. |
| 8 | **Executive Decorator RFP**| `/decorator-cockpit.html` | (none) | High-speed vendor negotiation and quotation deck. |
| 9 | **Public Proposal Intake** | `/shopping-registry.html` | `#intake` | Rapid open suggestion and image upload drop. |
| 10 | **Core Marriage OS** | `/` | (none) | Master OS Control Tower, Precedence DAG & Liturgy. |

---

## 3. Certified Resolution: Universal Quick-Share Station (`P-QUICK-SHARE-001`)

The Council certified a 3-layer synergistic implementation:

### 3.1 Layer 1: Canonical URL Normalization in `ui_primitives`
Added `SKPrimitives.getStakeholderUrl(portalFile, params)` and `SKPrimitives.getStakeholderShare(key)` in `ui_primitives/scripts/primitives_core.js`:
- Guarantees canonical target filename (`shopping-registry.html`, `decision-registry.html`) regardless of whether code runs in an iframe, an embedded SPA container, or a standalone tab.
- Re-exports `copyStakeholderShare(key)` and `copyUrlToClipboard(key, label)` globally with integrated toast notifications.

### 3.2 Layer 2: In-Tab Contextual Quick-Share Bars
- **Shopping Registry (`#tab-shopping`)**: Prominent `.shop-executive-share-bar` positioned above the catalog/survey view switcher with 1-click copy chips for Family Mode, Sisters' Styling, Vivaha Pata, Groom Mandap, and Standalone Portal pop-out (`_blank`).
- **Decision Registry (`#tab-decision-registry`)**: Prominent `.dr-executive-share-bar` positioned above the event stepper with 1-click copy chips for Family Decor Mode, Vivaha Mandap, Sangeet Stage, and Standalone Portal pop-out.

### 3.3 Layer 3: Global Header Quick-Share Station
- Added `[🔗 Share Links]` button (`#openExecutiveShareBtn`) in the sticky top header (`.header-right`) of `index.html` and `public/index.html`.
- Bound to modal `#executiveShareModal` featuring 10 stakeholder cards, each equipped with 1-click WhatsApp text copy (`📋`), direct WhatsApp Web dispatch (`💬`), and direct pop-out (`↗️`).
- Satisfies `INV-LIFECYCLE-03`: 3-trigger dismissibility (Close button, Backdrop click, and Escape keydown).
- Formally registered in `FEATURE_CATALOG.json` under `headerAffordances` and `intakeModals`.

---

## 4. Verification & Governance Trace

1. **Syntax & Architecture Gate (`STD-MOD-COMP-001`)**: `npm run verify:modular-architecture` — 45/45 checks pass (100% byte parity across all 8 dual-distribution files).
2. **Dynamic UI Lifecycle Gate (`STD-UI-LIFECYCLE-001`)**: `npm run verify:ui-lifecycle` — 4/4 checks pass (INV-LIFECYCLE-01, 02, 03, 04).
3. **Mobile First Gate (`M-GATE-01`)**: `npm run verify:mobile` — 16/16 checks pass.
4. **Pre-Flight Zero-Proxy Deployment Gate**: `npm run verify:deployment` — All 10 Layers pass 100% green.
5. **Standalone Functional Suites**: `npm run test:shopping` and `npm run test:decision-registry` pass 100% green.
