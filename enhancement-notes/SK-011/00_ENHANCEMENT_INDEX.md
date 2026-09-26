# SK-011: Multi-Provider Cloud Storage & Google Drive Intake Pipeline

## 📊 Metadata

- **Category**: ARCHITECTURE / CLOUD_STORAGE / GOOGLE_DRIVE_INTEGRATION
- **Priority**: HIGH
- **Status**: IMPLEMENTATION_VERIFIED
- **Estimate**: 6 hours
- **Target Release**: v2.6.0
- **Risk Level**: MEDIUM
- **Owner**: goldenage399
- **Cluster**: `[INFRASTRUCTURE]` & `[UI-QUALITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-004  # Firestore Cross-Device Sync for Change Requests & Task Status
    - SK-007  # Candidate Look Lifecycle, 30-Day Archival Recovery & Shared Comments Primitive Integration
    - SK-010  # Universal UI Button Primitives & Pre-Flight Design System Verification Gate
  related:
    - AC-DEC-2026-028  # Real-Time Collaborative Firestore Shopping Engine
    - AC-DEC-2026-035  # Pinterest Intake & Collaborative Visual Sharing
    - AC-DEC-2026-045  # Candidate Look Ergonomics & Archival Lifecycle
    - AC-DEC-2026-048  # Firebase Cloud Storage Persistent Photo Intake Pipeline
    - AC-DEC-2026-051  # Multi-Provider Cloud Storage & Google Drive Intake Pipeline
    - AC-DEC-2026-052  # PIOps Drive Relay Webhook Leverage & Standalone Media Architecture
    - AC-DEC-2026-053  # End-to-End Dependency & Impact Radius Blueprint
    - .agent/patterns/collab-visual-intake-and-deep-link-sharing.md
    - docs/references/SPEC-ARCH-CLOUD-STORAGE-INTAKE-001.md
    - docs/incidents/INC-099-mock-persistence-and-intake-preview-hierarchy-blind-spot.md
  blocks:
    - None
```

---

## 🎯 Goal

Establish a production-grade, zero-billing-hurdle cloud storage and visual synchronization pipeline for wedding shopping and decor sourcing:
1. **Zero-Cost Google Drive Storage Relay**: Deploy a standalone Google Apps Script Webhook (`backend_gas/MediaRelay.js`) bounded to a dedicated Google Drive folder (`Sree_Krushna_Wedding_Media`), enabling high-capacity photo storage (15 GB free) without requiring a credit card or Firebase Blaze plan upgrade.
2. **Client-Side Image Compression & Simple Transmission**: Implement browser-side Canvas downscaling (max 1200px, WebP/JPEG, <250KB) and transmit via `text/plain` POST to bypass browser CORS preflight (`OPTIONS`) limitations, conforming to PIO's production-tested `api.js` protocol.
3. **Pluggable Storage Provider Strategy in Firestore Client**: Implement `window.fsUploadLookPhoto(itemId, imageSource, metadata)` supporting both the default Google Drive Webhook and future Firebase Cloud Storage via configuration toggle (`window.firebaseConfig.storageProvider`).
4. **Zero-CORS CDN Resolution & State Sync**: Write uploaded Google Drive File IDs to Firestore `shopping_items/{itemId}`, using `DriveNormalizer.js` to render high-performance zero-CORS thumbnails (`https://lh3.googleusercontent.com/d/{id}=w1200`).
5. **Universal Intake Modal & Standalone Shell Parity**: Rectify the DOM hierarchy bug in `option_intake_modal.html` by un-nesting the proof card into a shared preview container, wiring the clear button and upload progress bar, and mounting Firebase modules in `shopping-registry.html`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Standalone Google Apps Script Drive Relay Webhook (`backend_gas/MediaRelay.js`)
- [x] **GAS Script Authoring**: Create `backend_gas/MediaRelay.js` implementing:
  - `doPost(e)` accepting base64 image data, file name, MIME type, and authenticated uploader email.
  - Allowlist RBAC enforcement: verify uploader against authorized family emails (`goldenage399@gmail.com`, `sreesubha18@gmail.com`, `krushna.s.panda@gmail.com`).
  - Google Drive folder placement in `Sree_Krushna_Wedding_Media`.
  - Link sharing set to `DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW`.
  - JSON response returning `{ success: true, fileId, fileUrl, cdnUrl }`.
- [x] **Deployment Guide & URL Config**: Document deployment steps in `backend_gas/README.md` and configure the Webhook URL in `public/js/config.js` and `js/config.js` (`driveUploadWebhookUrl` with byte parity).
- [x] **Validation Gate (VG-1)**: Contract test `scripts/test-drive-relay-contract.cjs` verifying base64 decoding, MIME validation, RBAC, unique filename sanitization, and JSON response schema (6/6 tests passing).

### Phase 2: Client Storage Provider Strategy & Firestore Sync (`public/js/modules/firestore-client.js`)
- [x] **Canvas Compressor Utility**: Implement client-side `compressImage(fileOrDataUrl, maxDim=2048, quality=0.88)` returning 2K high-fidelity compressed data URL (<1.2MB payload, 4.2MP detail for Lightbox zoom).
- [x] **Provider Strategy Implementation**:
  - `_uploadToDriveWebhook(base64Data, metadata)`: sends simple `text/plain` POST with `redirect: 'follow'` to `driveUploadWebhookUrl`.
  - `uploadToFirebaseStorage(fileBlob, metadata)`: fallback/opt-in native Firebase Storage bridge via `window.firebaseConfig.storageProvider`.
- [x] **Firestore State Sync**: Atomically append the new candidate look option to Firestore collection `shopping_items/{itemId}` via `setDoc(..., { merge: true })`, storing `driveFileId`, `photoUrl`, `storageProvider`, and audit timestamps.
- [x] **Validation Gate (VG-2)**: Unit test `scripts/test-client-provider-strategy.cjs` verifying 2048px aspect-ratio downscaling math, size budgeting, provider dispatching, and Firestore candidate look schema conformance (5/5 tests passing).

### Phase 3: Universal Intake Modal & UI Feedback Rectification
- [x] **DOM Hierarchy Fix**: In `ui_primitives/components/option_intake_modal.html`, un-nest `#skDriveProofCard` from `#skPaneDrive` into a shared preview container visible across both Drive and Device tabs.
- [x] **Dedicated Dropzone Preview**: Render local thumbnail inside `#skDropzone` immediately upon file selection, with `#skBtnClearProof` to reset.
- [x] **Upload Progress HUD**: Wire active loading states and progress bar (`#skUploadProgressBarWrap`) during upload.
- [x] **Controller Integration**: Update `shopping_src/scripts/controller.js` to invoke `window.fsUploadLookPhoto` on submit, deprecating local Base64 storage.
- [x] **Validation Gate (VG-3)**: Manual file selection in UI displays preview; submit uploads photo to Google Drive and renders the item card with remote CDN thumbnail across browsers.

### Phase 4: Standalone Shell Parity & Dual-Release Verification
- [x] **Template Mounting**: Mount Firebase App, Auth, and `firestore-client.js` in `shopping_src/template.html` and sync `js/modules/` to root with byte parity.
- [x] **SDCA Recompilation**: Recompile all 3 SDCA targets (`shopping_src/build.cjs --all`, `cockpit_src/build.cjs --all`, `decision_registry_src/build.cjs --all`).
- [x] **Byte Parity Sweep**: Verify 100% byte parity between root files and `public/` files across all 6 compiled HTML artifacts.
- [x] **Verification Matrix Green Sweep**:
  - `npm run verify:ui-buttons` (5/5 PASS)
  - `npm run verify:modular-architecture` (46/46 PASS)
  - `npm run verify:ui-lifecycle` (100% PASS)
  - `npm run test:shopping` (7/7 stages PASS)
  - `npm run verify:deployment` (10/10 layers PASS)
  - `npm run verify:governance-wiring:all` (193/193 PASS)
- [ ] **Validation Gate (VG-4)**: Deploy to production and verify live photo upload and real-time cross-device rendering on `https://sree-krushna-forever.web.app`.
