# Architecture Council Ruling: PIOps Drive Relay Webhook Leverage & Hybrid Media Architecture

**Session Date:** 2026-09-26  
**Council Decision:** `AC-DEC-2026-052` / `INFRA-DEC-2026-002`  
**Governing Standard:** `STD-MOD-COMP-001` / `STD-PHASED-DEV-001` / `RFG-001`  
**Referenced Documents:** PIOps `ARCHITECTURE_Dual_Upload_Rationale.md`, `12_FileUpload.js`, `14_06_ProofUpload.js`, `api.js`  
**Tracked Initiative:** `SK-011` (Multi-Provider Cloud Storage & Google Drive Intake Pipeline)  

---

## 🌍 Grounding Snapshot (RFG-001 Mandatory Anchor)

* **Repository Maturity Stage**: Pre-Launch / Family Production (Sree Krushna Marriage OS).
* **System Scope**: Wedding operations, ceremonial run sheets, liturgical attire & shopping registry, decorator cockpit, guest logistics, and cash financials.
* **Active Real-User Base**: 3 core hosts (`goldenage399@gmail.com`, `sreesubha18@gmail.com`, `krushna.s.panda@gmail.com`) + 20–30 expected family members and decorator collaborators.
* **Team Structure**: 1 Host Developer / Paired Agentic Architect.
* **Resource Constraints**: Avoid mandatory recurring infrastructure costs, credit card billing gates, or tight cross-repo coupling where clean, zero-cost, high-reliability Google Cloud/Drive primitives can be deployed independently.

---

## 🚪 The 3-Question Gate

1. **Reversibility** — **YES**. Decisions regarding cross-repo dependency coupling (calling PIOps' live backend vs. deploying an isolated Sree Krushna webhook) have long-term architectural ramifications on blast radius, error isolation, and operational autonomy.
2. **Boundary** — **YES**. Crosses client-side canvas processing, HTTP networking, external Google Drive API / Apps Script runtime, Firestore persistence, and CSP frame-ancestors/image headers.
3. **Disagreement** — **YES**. Real architectural disagreement: Should Sree Krushna call the already-deployed PIOps multi-tenant backend (zero deployment overhead, but tight cross-repo coupling) or deploy an isolated, self-contained webhook derived from PIOps' exact code?

---

## 🏛️ Council Deliberation & Member Positions

### 1. The SSOT Authority Auditor (`ssot-reconciliation`)
* **Position**: Forensic analysis of PIOps (`PIOperationsMgmt_Firebase`) reveals two distinct mechanisms:
  1. `ARCHITECTURE_Dual_Upload_Rationale.md`: Documented the "Dual-Upload" pattern where client uploads to Firebase Storage (<2s), then GAS executes `UrlFetchApp.fetch(firebaseUrl)` to relay to Google Drive. Crucially, the root cause for adding Firebase Storage in PIOps was **uncompressed 10MB raw photo uploads** resulting in 13.3MB Base64 payloads that hit GAS's hard 30-second execution timeout!
  2. `12_FileUpload.js` / `14_06_ProofUpload.js`: Production-tested direct Base64 upload functions accepting `text/plain` POST to prevent browser CORS `OPTIONS` preflight failures.
* **SSOT Insight**: If Sree Krushna enforces client-side Canvas compression (max 1200px, quality 0.82, payload <200KB), the 13.3MB payload problem is 100% eliminated! A 200KB payload uploads to GAS in ~1.2s, completely avoiding the 30-second timeout without needing Firebase Storage.

### 2. The Dependency & Impact Auditor (`change-impact-analysis`)
* **Position**: Vetoes Option A (calling the live PIOps GAS backend URL directly).
* **Evidence**: Inspecting `docs/ARCHITECTURE/ARCHITECTURE_DO_PKOS_Multi_Tenant_Hosting.md`: While PIOps acts as a multi-tenant host for internal construction modules (`UG-Farmhouse`, `QSR`), coupling a family wedding system to an enterprise commercial operations repository violates system boundaries. If PIOps undergoes a deployment, schema migration, or router refactor, Sree Krushna's wedding photo intake could silently break.
* **Ruling**: Sree Krushna must have its own isolated, standalone webhook in `backend_gas/MediaRelay.js`, porting PIOps' exact logic with zero runtime cross-repo dependency.

### 3. The Service Layer Integrity Auditor (`debug-backend` / `cos-invoke`)
* **Position**: The backend webhook in `backend_gas/MediaRelay.js` must incorporate the exact reliability engineering patterns developed in PIOps:
  - Simple `text/plain` POST handling (per PIOps `api.js` lines 504–514) to bypass browser CORS preflight.
  - MIME-type detection and sanitized unique file naming (`${safeLocation}_${dateStr}_${timestamp}.${ext}`).
  - Public link sharing via `driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)`.
  - Structured JSON response returning `{ success: true, fileId, fileUrl, cdnUrl }`.

### 4. The Auth & Permission Auditor (`firebase-firestore`)
* **Position**: Enforce Family Allowlist RBAC inside the Apps Script webhook.
* **Evidence**: In PIOps `12_FileUpload.js` lines 29–48, uploaders are verified against `allowedUsers`. In Sree Krushna, `MediaRelay.js` must check `uploaderEmail` against `['goldenage399@gmail.com', 'sreesubha18@gmail.com', 'krushna.s.panda@gmail.com']`.

### 5. The Maintainability & Velocity Auditor (`ponytail` / RFG-001)
* **Position**: The simplest, most durable architecture is a single self-contained script `backend_gas/MediaRelay.js` (<120 lines) containing zero external libraries, zero npm dependencies, and requiring a single 60-second copy-paste deployment into `script.google.com`.
* **Burden of Proof**: Meets all 4 RFG-001 criteria: solves the real problem today, requires zero recurring cost, eliminates cross-repo blast radius, and is 100% maintainable.

### 6. The Dissenter Seat (Advocate for Direct Multi-Tenant PIOps Endpoint Reuse)
* **Dissenter Argument**: Why make the Host deploy another script when PIOps already has an active, tested endpoint running 24/7? We could just add an action `uploadWeddingPhoto` to PIOps and be done in 10 minutes.
* **Council Rebuttal**: Adding Sree Krushna wedding endpoints to PIOps violates repository separation of concerns, pollutes PIOps' business logic with wedding data, and creates an operational failure cascade if PIOps is ever decommissioned or restructured. An independent script guarantees Sree Krushna runs forever independently.

---

## 🔬 Comprehensive Comparative Evaluation Matrix

| Evaluation Dimension | Option A: Shared Multi-Tenant PIOps Backend | Option B: Two-Hop Server-Side Relay (PIO ARCHITECTURE_Dual_Upload) | Option C: Dedicated Sree Krushna Webhook (`AC-DEC-2026-052`) |
| :--- | :--- | :--- | :--- |
| **Similarities** | Uploads image to Google Drive, returns ID & URL | Uploads image to Google Drive, returns ID & URL | Uploads image to Google Drive, returns ID & URL |
| **Code Provenance** | Uses live PIOps `backend/src/02_Router.js` | Uses PIOps `FirebaseStorageService` + GAS | Ports exact PIOps `12_FileUpload.js` & `14_06_ProofUpload.js` |
| **Deployment Overhead** | 0 new deployments (already running) | 1 Firebase Bucket + 1 GAS Relay Webhook | 1 one-time copy-paste deployment to `script.google.com` |
| **Billing Requirement** | $0 / Spark Free | Requires GCP Billing Account (Credit Card for Blaze) | **$0 / No Credit Card / Spark Free** |
| **Cross-Repo Blast Radius** | **High** (Tightly coupled to PIOps uptime & changes) | Medium (Tightly coupled to GCP billing & PIOps relay) | **Zero** (Completely isolated, self-contained) |
| **Upload Speed** | ~1.5s (Canvas compress + GAS) | ~2.0s (Staging upload + background relay) | ~1.2s – 1.8s (Canvas compress + GAS) |
| **Payload Size** | <200KB (client canvas compressed) | 150 bytes to GAS (after 200KB to Firebase) | <200KB (client canvas compressed) |
| **CORS Handling** | `text/plain` simple POST | `cors.json` + `text/plain` | `text/plain` simple POST (Zero CORS preflight) |
| **Quota & Limits** | Shares PIOps Google account Drive storage | 15 GB Drive + 5 GB staging | Dedicated 15 GB free Drive storage |
| **Governance Verdict** | Rejected (Cross-repo contamination) | Rejected (Requires Blaze credit card) | **Unanimously Approved & Certified** |

---

## 📜 Council Certified Decision (`AC-DEC-2026-052`)

1. **Self-Contained Standalone Webhook**:
   - Sree Krushna shall NOT call the live PIOps backend directly.
   - Sree Krushna shall port the exact, battle-tested upload logic from PIOps (`12_FileUpload.js` and `14_06_ProofUpload.js`) into a dedicated standalone script: `backend_gas/MediaRelay.js`.
2. **Client-Side Canvas Compression as Primary Defense**:
   - In accordance with the root cause analysis from PIOps' `ARCHITECTURE_Dual_Upload_Rationale.md`, client-side offscreen Canvas compression (max 1200px, quality 0.82, WebP/JPEG) is mandatory before transmission. This limits payload size to <200KB, preventing the 30-second GAS timeout that previously afflicted uncompressed 10MB raw photos in PIOps.
3. **Zero-CORS Simple POST Protocol**:
   - Transmit payloads using `headers: { "Content-Type": "text/plain" }` and `redirect: "follow"` to eliminate browser `OPTIONS` preflight requests, matching PIOps `api.js` lines 504–514.
4. **Permanent Storage & Zero-CORS CDN Resolution**:
   - Files are saved in a dedicated Google Drive folder (`Sree_Krushna_Wedding_Media`), marked with `ANYONE_WITH_LINK, VIEW`, and stored in Firestore as `{ driveFileId, photoUrl: "https://lh3.googleusercontent.com/d/" + driveFileId + "=w1200" }`, rendered via `DriveNormalizer.js`.
5. **Certification**:
   - Approved unanimously by all Council members. Status: **APPROVED & CERTIFIED (`AC-DEC-2026-052` / `INFRA-DEC-2026-002`)**.
