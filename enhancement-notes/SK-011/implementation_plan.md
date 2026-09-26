# SK-011 Phase 2 Implementation Plan: Client Provider Engine & Firestore State Sync

This plan defines Phase 2 of **SK-011: Multi-Provider Cloud Storage & Google Drive Intake Pipeline**, certified under **`AC-DEC-2026-051`**, **`AC-DEC-2026-052`**, and **`AC-DEC-2026-053`**.

## User Review Required

> [!IMPORTANT]
> **Client-Side Compression & Provider Abstraction**: Phase 2 integrates the client-side offscreen Canvas compression engine (<200KB) and the pluggable provider strategy in `public/js/modules/firestore-client.js`. This connects the client UI to the Google Apps Script Webhook deployed in Phase 1, automatically saving uploaded look photos to Google Drive and persisting them to Firestore `shopping_items/{itemId}`.

---

## Open Questions

None. Architecture and data flow were ratified in `AC-DEC-2026-053`.

---

## Proposed Changes

### Client Persistence & Storage Engine (`public/js/modules/`)

#### [MODIFY] [firestore-client.js](file:///d:/GitHub_Repo/Sree_Krushna/public/js/modules/firestore-client.js)
- Implement `compressImage(fileOrDataUrl, maxDim=1200, quality=0.82)`:
  - Downscales images to max 1200px on the longest edge.
  - Compresses to JPEG/WebP with 0.82 quality, keeping payloads under 200KB.
- Implement `_uploadToDriveWebhook(base64Data, metadata)`:
  - Sends simple-request `POST` with `headers: { "Content-Type": "text/plain" }` and `redirect: "follow"` to `window.firebaseConfig.driveUploadWebhookUrl`.
  - Includes `uploaderEmail`, `itemId`, and `fileName`.
  - Returns `{ success: true, fileId, cdnUrl }`.
- Implement `window.fsUploadLookPhoto(itemId, imageSource, metadata)`:
  - Dispatches to `_uploadToDriveWebhook` or Firebase Storage based on `window.firebaseConfig.storageProvider`.
  - Updates Firestore `shopping_items/{itemId}` via `setDoc(docRef, { candidate_looks: arrayUnion(...) }, { merge: true })`.

---

### Automated Validation Scripts (`scripts/`)

#### [NEW] [test-client-provider-strategy.cjs](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-client-provider-strategy.cjs)
- Automated unit test verifying:
  - Aspect ratio constraint math for 4K / large images downscaled to 1200px.
  - Provider strategy dispatching logic.
  - Firestore atomic update payload structure.

---

## Verification Plan

### Automated Tests
- Provider Strategy Unit Tests:
  ```bash
  node scripts/test-client-provider-strategy.cjs
  ```
- SDCA & Lifecycle Verification:
  ```bash
  npm run verify:modular-architecture
  npm run verify:ui-lifecycle
  npm run verify:governance-wiring:all
  ```

### Manual Verification
- Execute mock upload call in browser console verifying file transmission and Firestore document state update.
