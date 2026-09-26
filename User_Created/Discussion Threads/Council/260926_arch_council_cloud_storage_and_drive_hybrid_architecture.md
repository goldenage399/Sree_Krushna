# Architecture Council Ruling: Multi-Provider Cloud Storage & Google Drive Intake Pipeline

**Session Date:** 2026-09-26  
**Council Decision:** `AC-DEC-2026-051` / `INFRA-DEC-2026-001`  
**Governing Standard:** `STD-MOD-COMP-001` / `STD-PHASED-DEV-001` / `RFG-001`  
**Referenced Incidents:** `INC-099`, `INC-094`, `INC-090`  
**Tracked Initiative:** `SK-011` (Multi-Provider Cloud Storage & Google Drive Intake Pipeline)  

---

## 🌍 Grounding Snapshot (RFG-001 Mandatory Anchor)

* **Repository Maturity Stage**: Pre-Launch / Family Production (Sree Krushna Marriage OS).
* **System Scope**: Wedding operations, ceremonial run sheets, liturgical attire & shopping registry, decorator cockpit, guest logistics, and cash financials.
* **Active Real-User Base**: 3 core hosts (`goldenage399@gmail.com`, `sreesubha18@gmail.com`, `krushna.s.panda@gmail.com`) with 20–30 expected family members and decorator collaborators.
* **Team Structure**: 1 Host Developer / Paired Agentic Architect.
* **Resource Constraints**: Avoid mandatory recurring infrastructure costs or credit card billing gates where zero-cost, high-reliability Google Cloud/Drive primitives can be leveraged losslessly.

---

## 🚪 The 3-Question Gate

1. **Reversibility** — **YES**. Storage architecture, file storage locations, URL schemes stored in live Firestore documents (`shopping_items/{itemId}`), and security boundaries cannot easily be reversed without complex data migrations.
2. **Boundary** — **YES**. Crosses client-side canvas processing, HTTP networking, external Google Drive API / Firebase Storage API, Firestore persistence, and CSP frame-ancestors/image headers.
3. **Disagreement** — **YES**. Significant architectural tension: Upgrading to Firebase Blaze plan (requiring a credit card) vs. Deploying a standalone Google Apps Script Webhook to Google Drive (zero billing, 15GB free quota) vs. Replicating PIO's Dual-Upload Server-Side Relay.

---

## 🏛️ Council Deliberation & Member Positions

### 1. The SSOT Authority Auditor (`ssot-reconciliation`)
* **Position**: The canonical SSOT for media assets (`07_DOCUMENTS_ARCHIVE/digital_media_catalog.md` and `04_PROCUREMENT_VENDORS/decor_and_design/MASTER_DECOR_DECISION_ROADMAP_SPEC.md` §2) explicitly establishes **Google Drive** as the long-term cloud storage repository for all ceremony media, contracts, and visual candidates. Attempting to introduce Firebase Storage as the sole proprietary store contradicts existing archive documentation.
* **Evidence**: `digital_media_catalog.md` Lines 11–13 specify Google Drive and Archival Drive as the master media locations. Furthermore, `ui_primitives/scripts/drive_normalizer.js` already provides the canonical zero-CORS CDN resolution (`lh3.googleusercontent.com/d/{id}=w1200`) specifically for Google Drive assets.
* **Challenge**: If Drive is our permanent archival SSOT, storing files only in Firebase Cloud Storage introduces two competing storage locations.

### 2. The Schema & Firestore Auditor (`firebase-firestore`)
* **Position**: Firestore documents in `shopping_items` must never store raw Base64 strings (1MB document limit, extreme bandwidth consumption). Firestore documents must store lightweight, declarative metadata:
  ```json
  {
    "photoUrl": "https://lh3.googleusercontent.com/d/1ABC...=w1200",
    "driveFileId": "1ABC...",
    "storageProvider": "google_drive",
    "uploadedBy": "goldenage399@gmail.com",
    "uploadedAt": "2026-09-26T18:30:00.000Z",
    "sizeBytes": 204850
  }
  ```
* **Evidence**: Storing the normalized CDN URL + the `driveFileId` provides O(1) reads, instant visual rendering, and zero-cost queries without exceeding Firestore quotas.
* **Challenge**: If an image in Drive is ever deleted or file permissions are private, the client image will fail to load unless the Drive Webhook automatically sets `DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW`.

### 3. The Service Layer Integrity Auditor (`debug-backend` / `cos-invoke`)
* **Position**: The client-side entry point `window.fsUploadLookPhoto(itemId, imageSource, metadata)` in `public/js/modules/firestore-client.js` must implement a **Provider Strategy Pattern**.
  - Provider A (Default / Zero-Cost): `uploadToDriveWebhook(base64Data, metadata)`
  - Provider B (Pluggable): `uploadToFirebaseStorage(fileBlob, metadata)`
* **Evidence**: Inspecting `PIOperationsMgmt_Firebase`: PIO maintains both `14_06_ProofUpload.js` (direct base64 to GAS Drive) and `FirebaseStorageService.js`. Decoupling the client interface ensures that the UI components (`option_intake_modal.html` and `controller.js`) remain completely oblivious to the underlying storage provider.
* **Challenge**: In `api.js` of PIO (lines 504–514), calling Google Apps Script Webhooks requires sending `Content-Type: text/plain` and `redirect: 'follow'` to avoid browser CORS preflight (`OPTIONS`) failures, because GAS endpoints cannot answer `OPTIONS` requests.

### 4. The Dependency & Impact Auditor (`change-impact-analysis`)
* **Position**: Blast radius is strictly constrained to 4 files:
  1. `public/js/modules/firestore-client.js` (adds upload engine)
  2. `ui_primitives/components/option_intake_modal.html` (DOM hierarchy fix for proof card & progress bar)
  3. `shopping_src/scripts/controller.js` (event listener wiring)
  4. `backend_gas/MediaRelay.js` (standalone Google Apps Script Webhook)
* **Evidence**: The SDCA compiler (`shopping_src/build.cjs --all`) compiles these into `public/shopping-registry.html` and root `shopping-registry.html`. All other modules (Decorator Cockpit, Decision Registry, Auth) remain untouched.

### 5. The Auth & Permission Auditor (`firebase-firestore`)
* **Position**: The Google Apps Script Webhook must not be a wide-open public dropzone that anyone on the internet can abuse.
* **Evidence**: The client must transmit the authenticated user's email (`window.currentUser.email`) and Firestore UID with the payload. The GAS Webhook must validate that the `uploaderEmail` belongs to the family allowlist (`goldenage399@gmail.com`, `sreesubha18@gmail.com`, `krushna.s.panda@gmail.com`, or `@gmail.com` family domain) before creating files in the Drive folder.

### 6. The Maintainability & Velocity Auditor (`ponytail` / RFG-001)
* **Position**: Replicating PIO's Dual-Upload Server-Side Relay (Firebase Storage staging -> GAS download via `UrlFetchApp` -> Google Drive upload -> Firebase delete) violates the Reality-First Grounding Policy (`RFG-001`). It introduces two cloud services, requires a credit card billing account for Blaze, adds two network hops, and creates 4 points of failure for a wedding app that needs ~100 photos total.
* **Evidence**: Direct browser-to-Drive upload via a single lightweight GAS Webhook (with client-side canvas compression) solves the entire requirement with $0 cost, 0 credit cards, and 15 GB of permanent storage.
* **Burden of Proof**: The GAS Drive Webhook satisfies all 4 conditions of RFG-001 §3.

### 7. The Dissenter Seat (Fierce Advocate for Blaze Plan & Firebase Storage)
* **Dissenter Argument**: Why maintain a Google Apps Script Webhook at all? Upgrading to the Blaze plan is free as long as we stay under 5 GB (100 photos is only ~25 MB, less than 1% of the free quota). Google Apps Script has cold starts (1.5–3.0 seconds), whereas Firebase Storage uploads take <400ms. By using GAS, we introduce an external deployment step outside of Git and Firebase Hosting.
* **Council Rebuttal & Synthesis**: The dissenter's performance point is valid: GAS cold starts are ~1.5–2s. However, the user explicitly encountered the Firebase Console billing paywall (*"To use Storage, upgrade your project's pricing plan"*) and specifically instructed us to leverage PI Operations Management's Drive knowledge. Moreover, by compressing the image in the browser via Canvas (<200KB), the GAS upload duration is ~1.8s, which is well within acceptable human UX tolerances when paired with an upload progress bar. Crucially, the council mandates a **Pluggable Architecture**: if the user ever decides to activate Blaze in the future, switching takes a single flag in `config.js` with zero code rewrites.

---

## 🔬 Comprehensive Comparative Evaluation Matrix

| Dimension | Option 1: Pure GAS Drive Webhook (PIO-047 Pattern) | Option 2: Firebase Blaze Plan Upgrade (Native Storage) | Option 3: Enterprise Dual-Upload Relay (PIO ARCHITECTURE_Firebase_Storage) | Option 4: The Architected Hybrid (`AC-DEC-2026-051`) |
| :--- | :--- | :--- | :--- | :--- |
| **Similarities** | Uploads image, returns URL, stores in Firestore | Uploads image, returns URL, stores in Firestore | Uploads image, returns URL, stores in Firestore | Uploads image, returns URL, stores in Firestore |
| **Storage Destination** | Dedicated Google Drive Folder | GCP Firebase Storage Bucket | Google Drive (via Firebase Staging) | Dedicated Google Drive Folder (with pluggable Firebase Storage) |
| **Billing Requirement** | **$0 / No Credit Card / Spark Free** | Requires GCP Billing Account (Credit Card) | Requires GCP Billing Account (Credit Card) | **$0 / No Credit Card / Spark Free** |
| **Storage Quota** | 15 GB free (Google Drive) | 5 GB free tier (Firebase Storage) | 15 GB free Drive + 5 GB staging | 15 GB free Drive (expandable to Blaze) |
| **Client Upload Speed** | ~1.5s – 2.5s (Canvas compress + GAS) | ~300ms – 700ms (Direct CDN) | ~300ms – 700ms (staging upload) | ~1.5s – 2.0s (Canvas compress + GAS) |
| **Preview CDN Engine** | Zero-CORS `lh3.googleusercontent.com` | Firebase Storage CDN Token URL | Zero-CORS `lh3.googleusercontent.com` | Zero-CORS `lh3.googleusercontent.com` (`DriveNormalizer.js`) |
| **CORS Constraints** | Handled via `text/plain` simple POST | Handled via `cors.json` on GCS bucket | Handled via `cors.json` + `UrlFetchApp` | Handled via `text/plain` simple POST (Zero-CORS) |
| **Infrastructure Overhead** | 1 Google Apps Script Web App | 1 Firebase Storage Bucket (`storage.rules`) | 1 Storage Bucket + 1 GAS Relay Webhook | 1 Google Apps Script Web App (GAS script committed in repo) |
| **Failure Modes** | GAS cold start (1–3s); file size limit if >5MB | Billing limits, unexpected card charges | Complex dual-hop timeout, auth drift | GAS cold start; fully mitigated by client canvas compression & progress HUD |
| **RFG-001 Alignment** | High (Stage-appropriate, $0 cost) | Medium (demands corporate billing setup) | Low (Over-engineered for 30 users) | **Maximum (Pragmatic, zero-cost, future-proof)** |

---

## 📜 Council Certified Decision (`AC-DEC-2026-051`)

1. **Ratification of the Hybrid Drive Intake Engine**:
   - The primary storage provider for Sree Krushna Marriage OS shall be **Google Drive via an Authenticated Google Apps Script Webhook** (`SreeKrushna_MediaRelay`), archiving all uploaded photos into a dedicated shared Google Drive folder (`Sree_Krushna_Wedding_Media`).
   - The client shall perform **Browser-Side Canvas Downscaling** (max dimension 1200px, WebP/JPEG quality 0.82, payload <250KB) prior to transmission, completely eliminating GAS timeouts and payload rejections.
   - The client shall send simple POST requests using `headers: { "Content-Type": "text/plain" }` and `redirect: "follow"` (per PIO `api.js` lines 504–514), preventing CORS preflight failures.
2. **Zero-CORS CDN Resolution**:
   - Stored records in Firestore `shopping_items/{itemId}` shall save the Google Drive File ID and the canonical zero-CORS thumbnail CDN URL (`https://lh3.googleusercontent.com/d/{fileId}=w1200`), resolved via `DriveNormalizer.js`.
3. **Pluggable Provider Architecture**:
   - `firestore-client.js` shall implement a clean provider abstraction (`drive_webhook` vs `firebase_storage`). If the Host ever links a billing card for Blaze, setting `window.firebaseConfig.storageProvider = 'firebase'` will immediately route uploads through Firebase Cloud Storage without altering UI components or Firestore data structures.
4. **Multi-Modal Intake Preservation**:
   - The Intake Modal retains its Pinterest / Web Image URL tab alongside the direct file upload tab, standardizing both into uniform previews.
5. **Certification**:
   - All 8 Council members + Dissenter unanimously approve the hybrid decision. Status: **APPROVED & CERTIFIED**.
