---
pattern: sheet-drive-media-relay
activation_tier: guarded
guard: "node scripts/test-sheet-drive-relay-contract.cjs"
canonical_source: sree-krushna
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: enhancement-notes/SK-015/00_ENHANCEMENT_INDEX.md
    at: "DoD Matrix"
  - file: User_Created/Discussion Threads/Council/260926_arch_council_reusable_sheet_drive_media_relay_skill_and_sap_sync.md
    at: "AC-DEC-2026-055"
triggers:
  - "STD-DRIVE-MEDIA-RELAY-001"
  - "P-DRIVE-MEDIA-RELAY-001"
  - "sheet-drive-relay"
  - "drive media relay"
  - "setup drive upload"
  - "INV-RELAY-CORS-001"
  - "INV-RELAY-CANVAS-002"
  - "INV-RELAY-SHEET-003"
  - "INV-RELAY-CACHE-004"
  - "INV-RELAY-CDN-005"
portability: universal
porting_effort: low
---

# Pattern: Universal Sheet-Drive Media Relay & Real-Time Audit Ledger Architecture

**Standard ID**: `STD-DRIVE-MEDIA-RELAY-001` / `P-DRIVE-MEDIA-RELAY-001`  
**Category**: Architecture / Infrastructure / Cloud Storage Relay  
**Origin**: Sree Krushna Marriage OS & PIOperationsMgmt_Firebase (`AC-DEC-2026-055` / `SK-015`)  
**Status**: VALIDATED  

---

## 1. Problem Statement

Modern decoupled web SPAs, mobile apps, and automation workflows frequently require image and media upload capabilities (e.g. candidate lehenga photos, venue decor snapshots, expense receipts, contract scans).

Traditional cloud storage setups (e.g. Firebase Cloud Storage, AWS S3, Google Cloud Storage) impose friction:
1. **Billing Friction**: Mandatory Blaze/Credit-Card plans with hard blocking when payment credentials expire.
2. **CORS Preflight Hell**: Browser cross-origin `POST` with `Content-Type: application/json` or `multipart/form-data` triggers preflight `OPTIONS` requests that fail on serverless Google Apps Script webhooks.
3. **Execution Timeouts**: Direct uploading of raw multi-megabyte camera photos (10MB+) causes Google Apps Script 30-second execution timeouts.
4. **Disorganized Storage Drift**: Uploading all assets into a single flat bucket creates chaos and manual sorting debt.
5. **No Visual Audit Trail**: Lack of an immutable transaction ledger recording who uploaded what, when, where, and the exact CDN access URLs.

---

## 2. Mandatory Architectural Invariants

### INV-RELAY-CORS-001: Zero-CORS Simple POST Relay Protocol
All browser-to-relay transmissions MUST use the HTML5 Simple Request standard:
```javascript
// Browser client upload call:
const response = await fetch(webhookUrl, {
  method: 'POST',
  mode: 'cors',
  headers: {
    'Content-Type': 'text/plain' // Must be text/plain to avoid preflight OPTIONS check
  },
  body: JSON.stringify(payload),
  redirect: 'follow'
});
```
Google Apps Script webhooks return a 302 redirect upon handling `doPost(e)`. The client fetch MUST include `redirect: 'follow'` to automatically resolve the redirected response.

---

### INV-RELAY-CANVAS-002: Client-Side 2K Offscreen Canvas Budgeting
Browsers MUST downscale camera images prior to transmission using an offscreen `<canvas>`:
- **Maximum Dimension**: 2048px on the longest edge (tack-sharp 2K QHD for zoom inspection).
- **Compression**: WebP or JPEG with quality 0.85–0.88.
- **Payload Budget**: <1.2 MB base64 string.
Transmitting payloads under 1.2 MB guarantees completion in under 3.5 seconds on standard GAS V8 execution, eliminating 30-second timeout risks.

---

### INV-RELAY-SHEET-003: Two-Tier Google Sheet Control Plane
Storage organization and governance are driven by a connected Google Spreadsheet acting as the system control plane:
1. **`Config_Routing` Tab**: Maps combinations of `[Module, Event, Category]` to designated Google Drive subfolder paths.
2. **`Upload_Ledger` Tab**: Appends an immutable, 12-column audit log for every transaction:
   - `Timestamp`
   - `UploaderEmail`
   - `ItemId`
   - `Module`
   - `Event`
   - `Category`
   - `FileName`
   - `FileSizeKB`
   - `FileId`
   - `DriveUrl`
   - `ThumbnailCdnUrl`
   - `SubfolderPath`

---

### INV-RELAY-CACHE-004: Dynamic Hierarchical Folder Auto-Provisioning with 10-Minute TTL
The Google Apps Script webhook MUST resolve or dynamically provision required Drive subfolders recursively.
- **In-Memory Cache**: Uses `CacheService.getScriptCache()` with a 600-second (10-minute) TTL to cache resolved Folder IDs, preventing repetitive Drive folder lookup API calls.
- **Dynamic Provisioning**: If a specified subfolder path (e.g. `Shopping/Vivaha/Sherwani`) does not exist, the script automatically creates each missing subfolder hierarchically under `ROOT_FOLDER_ID`.

---

### INV-RELAY-CDN-005: Universal 2K High-DPI CDN Resolution
All uploaded media IDs are formatted for immediate, zero-CORS rendering across web SPAs:
```
https://lh3.googleusercontent.com/d/{fileId}=w2048
```
Files must have permission set to `DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW` so that Google's global UserContent CDN serves high-DPI images with edge-caching and zero authentication cookies required.

---

## 3. Webhook Contract Specifications

### Inbound Payload Schema (`text/plain` JSON string)
```json
{
  "image": "data:image/jpeg;base64,...",
  "fileName": "bridal_lehenga_front.jpg",
  "mimeType": "image/jpeg",
  "uploaderEmail": "user@example.com",
  "itemId": "LOOK-001",
  "module": "Shopping",
  "event": "Vivaha",
  "category": "Bridal_Lehenga"
}
```

### Outbound Response Envelope
```json
{
  "success": true,
  "fileId": "1a2b3c4d5e...",
  "fileUrl": "https://drive.google.com/file/d/1a2b3c4d5e.../view",
  "cdnUrl": "https://lh3.googleusercontent.com/d/1a2b3c4d5e...=w2048",
  "subfolderPath": "Shopping/Vivaha/Bridal_Lehenga"
}
```

### Error Envelope
```json
{
  "success": false,
  "error": "Detailed description of error",
  "code": "AUTH_FORBIDDEN | INVALID_PAYLOAD | ROUTING_ERROR"
}
```

---

## 4. Verification & Testing Protocol

Repositories implementing this standard MUST verify template and runtime contracts:
```bash
node scripts/test-sheet-drive-relay-contract.cjs
```
