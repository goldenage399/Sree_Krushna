# Architecture Council Ruling: End-to-End Dependency & Impact Radius Blueprint

**Session Date:** 2026-09-26  
**Council Decision:** `AC-DEC-2026-053` / `INFRA-DEC-2026-003`  
**Governing Standard:** `STD-MOD-COMP-001` / `STD-PHASED-DEV-001` / `RFG-001` / `P-SSOT-DOCS`  
**Referenced Decisions:** `AC-DEC-2026-051`, `AC-DEC-2026-052`, `AC-DEC-2026-050`, `AC-DEC-2026-047`  
**Tracked Initiative:** `SK-011` (Multi-Provider Cloud Storage & Google Drive Intake Pipeline)  

---

## 🌍 Grounding Snapshot (RFG-001 Mandatory Anchor)

* **Repository Maturity Stage**: Pre-Launch / Family Production (Sree Krushna Marriage OS).
* **System Scope**: Cross-cutting impact across 3 SDCA compilation pipelines (Shopping Registry, Decorator Cockpit, Decision Registry), 1 shared UI primitive (`option_intake_modal.html`), 1 shared CDN normalizer (`drive_normalizer.js`), 1 shared lightbox carousel (`lightbox.html`), 1 Firestore client (`firestore-client.js`), and 1 newly established external serverless webhook (`backend_gas/MediaRelay.js`).
* **Active Real-User Base**: 3 core hosts (`goldenage399@gmail.com`, `sreesubha18@gmail.com`, `krushna.s.panda@gmail.com`) + 20–30 expected family members and decorator collaborators.
* **Team Structure**: 1 Host Developer / Paired Agentic Architect.

---

## 🚪 The 3-Question Gate

1. **Reversibility** — **YES**. Un-nesting shared HTML primitives affects multiple downstream compiled HTML files across both root `/` and `/public`. A regression in `option_intake_modal.html` breaks not only Shopping, but also Decorator Cockpit and Decision Registry.
2. **Boundary** — **YES**. Crosses 4 architectural tiers: External Cloud Services (Google Drive, Apps Script), Shared Primitives (`ui_primitives/`), Client Persistence (Firestore, `config.js`), and Compiled Consumer Surfaces.
3. **Disagreement** — **YES**. Tension between (a) scoping changes narrowly to Shopping only (which would create divergent copies of `option_intake_modal.html` and violate `STD-MOD-COMP-001`), vs. (b) updating the shared primitive with defensive safeguards across all 3 consumer builders.

---

## 🔬 In-Depth 4-Tier Dependency & Impact Radius Audit

### Tier 1: External Cloud & Serverless Infrastructure (Newly Established)
* **Google Apps Script Webhook (`backend_gas/MediaRelay.js`)**:
  - *Dependency*: Deployed to Google's serverless runtime (`script.google.com/macros/s/.../exec`).
  - *Blast Radius*: Single point of failure for new file uploads if down or unauthenticated.
  - *Mitigations*:
    - Simple `text/plain` POST transmission per PIOps `api.js` protocol (eliminates CORS preflight failures).
    - Client-side Canvas downscaling (<200KB) eliminates GAS 30-second timeouts.
    - Family Allowlist RBAC checks prevent unauthorized uploads.
    - Provider Strategy pattern in `firestore-client.js` allows seamless hot-swapping to Firebase Storage if Blaze is ever enabled.
* **Google Drive Storage Container (`Sree_Krushna_Wedding_Media`)**:
  - *Dependency*: Google Drive folder owned by the Host Google account.
  - *Quota*: 15 GB free storage (capacity for >60,000 compressed photos).
  - *Permission Model*: Public read link sharing (`DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW`) set programmatically at creation time.
* **Google UserContent CDN (`https://lh3.googleusercontent.com/d/{id}=w1200`)**:
  - *Dependency*: High-speed zero-CORS image delivery proxy. Handled via `DriveNormalizer.js` with LRU caching.

### Tier 2: Shared UI Primitives & Core Engines (Affected Internal Assets)
* **`ui_primitives/components/option_intake_modal.html`**:
  - *Consumers*: **3 SDCA Builders**!
    1. `shopping_src/build.cjs`
    2. `cockpit_src/build.cjs`
    3. `decision_registry_src/build.cjs`
  - *Modifications*:
    - Un-nest `#skDriveProofCard` outside the tab panes so it is universally visible for both Link mode and File Upload mode.
    - Add `#skBtnClearProof` to reset selected files.
    - Add `#skUploadProgressBarWrap` and `#skUploadProgressBar` for upload progress feedback.
  - *Blast Radius Control*:
    - All controller scripts in consumers must use optional chaining and null guards (`const btn = document.getElementById('skBtnClearProof'); if (btn) { ... }`).
    - Builders compile without breaking changes because the DOM markup is purely additive.
* **`ui_primitives/scripts/drive_normalizer.js`**:
  - *Status*: Zero modifications required. Sree Krushna's existing normalizer already supports Drive File ID resolution to `lh3.googleusercontent.com/d/{id}=w1200`.
* **`ui_primitives/components/lightbox.html` & `ui_primitives/scripts/lightbox.js`**:
  - *Status*: Upgraded in SK-013 (`AC-DEC-2026-050`). Real-time Firestore sync of newly uploaded candidate looks immediately feeds into the interactive lightbox carousel.

### Tier 3: Client State & Persistence Layer (Affected Internal Assets)
* **`public/js/modules/firestore-client.js`**:
  - *Modifications*: Implements `window.fsUploadLookPhoto(itemId, imageSource, metadata)`.
  - *Strategy*: Dispatches to `uploadToDriveWebhook` or `uploadToFirebaseStorage` based on `window.firebaseConfig.storageProvider`.
  - *Firestore Schema*: Updates `shopping_items/{itemId}` with `{ driveFileId, photoUrl, storageProvider, uploadedBy, uploadedAt }`. Backward-compatible with existing candidate looks array.
* **`public/js/config.js`**:
  - *Modifications*: Declares `driveUploadWebhookUrl` and default `storageProvider: 'drive_webhook'`.

### Tier 4: Compiled Consumer Surfaces (Affected End-User Deliverables)
* **6 Output HTML Artifacts**:
  1. `shopping-registry.html` & `public/shopping-registry.html`
  2. `decorator-cockpit.html` & `public/decorator-cockpit.html`
  3. `decision-registry.html` & `public/decision-registry.html`
* **SPA Dynamic Tab Loaders (`index.html`)**:
  - `mountShoppingTab()` and `mountCockpitTab()` must preserve `STD-UI-LIFECYCLE-001` sequential script awaiting.

---

## 🗺️ Multi-Phase Roadmap & Subsequent Phase Handling Plan

| Phase | Phase Focus | Dependencies Handled | Blast Radius Control & Validation Gates |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Standalone GAS Webhook & Contract Lock** | Google Apps Script serverless runtime, Google Drive target folder, `config.js` | **VG-1**: Node.js contract test `scripts/test-drive-relay-contract.cjs` verifying base64 decoding, MIME detection, and JSON response schema. Zero UI/Firestore mutations. |
| **Phase 2** | **Client Provider Engine & Firestore State Sync** | `firestore-client.js`, Firestore `shopping_items` collection schema, Canvas compression | **VG-2**: Headless test verifying Canvas downscaling (<200KB), provider dispatch, and atomic Firestore candidate look insertion. |
| **Phase 3** | **Multi-Surface Modal Rectification & Controller Wiring** | `option_intake_modal.html` across all 3 SDCA compilers; `shopping_src/scripts/controller.js` | **VG-3**: Defensive event binding in controllers; interactive verification of thumbnail preview, clear button, upload progress bar, and card re-rendering. |
| **Phase 4** | **Standalone Shell Parity, Dual-Release & Pre-Flight Sweep** | 6 compiled HTML artifacts (root + `public/`), standalone shell `<head>` scripts, Hosting | **VG-4**: 100% byte parity verification (`npm run verify:modular-architecture`), button check (`npm run verify:ui-buttons`), lifecycle check (`npm run verify:ui-lifecycle`), test sweep (`npm run test:shopping`), and production deployment. |

---

## 📜 Council Certified Decision (`AC-DEC-2026-053`)

1. **Shared Primitive Integrity (`STD-MOD-COMP-001`)**:
   - The council strictly mandates that `option_intake_modal.html` remain a single shared primitive across Shopping Registry, Decorator Cockpit, and Decision Registry. Under no circumstances may an ad-hoc local copy be created.
2. **Defensive Consumer Decoupling**:
   - All event bindings for the new intake elements (`#skBtnClearProof`, `#skUploadProgressBarWrap`) must be conditionally guarded to prevent null-reference runtime exceptions on surfaces where the controller has not yet bound them.
3. **Sequential Phase Enforcement (`STD-PHASED-DEV-001`)**:
   - The multi-phase roadmap above is locked as the canonical sequence for `SK-011`. Phase 1 remains strictly bounded to backend/contract infrastructure before any frontend UI or shared primitives are mutated.
4. **Certification**:
   - Approved unanimously by all 8 Council members + Dissenter. Status: **APPROVED & CERTIFIED (`AC-DEC-2026-053` / `INFRA-DEC-2026-003`)**.
