---
name: sheet-drive-relay
description: Universal Sheet-Configured Google Drive Media Relay & Real-Time Audit Ledger (STD-DRIVE-MEDIA-RELAY-001). Zero-billing, zero-CORS media storage pipeline with dynamic subfolder auto-provisioning and 12-dimension audit ledger.
---

# Universal Sheet-Drive Media Relay Skill

## Overview

Use this skill whenever an application or workflow requires an image, photo, or document upload pipeline without incurring Firebase Blaze / Cloud Storage billing hurdles. This skill provides a battle-hardened, zero-CORS Google Apps Script relay backed by Google Drive storage, dynamic Google Sheet routing, and an immutable 12-dimension transaction audit ledger.

**Origin Standards**: `STD-DRIVE-MEDIA-RELAY-001` / `P-DRIVE-MEDIA-RELAY-001` (`AC-DEC-2026-055` / `SK-015`)  
**Applicability**: Any web SPA, mobile app, or automation tool in the SAP ecosystem (e.g. `Task-Dashboard`, `Capsicum`, `BMS`, `UG-Farmhouse`, `QSR`, `Sree_Krushna`).

---

<!-- shared:std.agent.sheet-drive-relay.core:start -->

## The 5 Prime Architectural Invariants

Every deployment of this skill MUST conform to the 5 Prime Invariants:

1. **`INV-RELAY-CORS-001` (Zero-CORS Simple POST)**:
   - Web clients MUST send HTTP `POST` requests with header `'Content-Type': 'text/plain'` and `'redirect': 'follow'`.
   - Never use `'Content-Type': 'application/json'` from the browser to GAS webhooks; doing so triggers browser preflight `OPTIONS` requests that GAS cannot handle.

2. **`INV-RELAY-CANVAS-002` (Browser-Side 2K Budgeting)**:
   - Web clients MUST downscale high-resolution camera photos client-side using an offscreen `<canvas>` prior to transmission.
   - Max dimension: **2048px** on the longest edge (2K QHD for crisp zoom inspection).
   - Compression: WebP or JPEG at quality 0.85–0.88.
   - Target payload budget: **<1.2 MB**. Payloads under 1.2MB execute in <3.5 seconds on Google Apps Script, eliminating 30-second execution timeouts.

3. **`INV-RELAY-SHEET-003` (Two-Tier Sheet Control Plane)**:
   - The relay is controlled and audited by a connected Google Spreadsheet:
     - `Config_Routing`: Declarative mapping of `[Module, Event, Category]` to target subfolders.
     - `Upload_Ledger`: Append-only 12-dimension transaction audit ledger.
     - `Config_Settings`: System operational parameters and auxiliary RBAC allowlists.

4. **`INV-RELAY-CACHE-004` (Dynamic Subfolder Auto-Provisioning)**:
   - The webhook dynamically provisions missing folder paths hierarchically under `ROOT_FOLDER_ID`.
   - Folder IDs are cached in `CacheService.getScriptCache()` with a **600-second (10-minute) TTL**, minimizing repetitive Drive API lookups.

5. **`INV-RELAY-CDN-005` (Universal 2K UserContent CDN Resolution)**:
   - Uploaded files are served publicly via Google's edge-cached UserContent CDN:
     `https://lh3.googleusercontent.com/d/{fileId}=w2048`
   - Zero authentication cookies or authorization headers are required for frontend rendering.

---

## Bundled Turnkey Templates

The skill includes pre-tested templates located in `templates/` and `resources/`:
- [`MediaRelay.template.js`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/skills/sheet-drive-relay/templates/MediaRelay.template.js): Standalone GAS script with dynamic routing, folder auto-provisioning, and ledger appending.
- [`appsscript.json`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/skills/sheet-drive-relay/templates/appsscript.json): V8 runtime configuration manifest.
- [`deploy-gas-relay.cjs`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/skills/sheet-drive-relay/templates/deploy-gas-relay.cjs): Cross-platform Node.js deployer with `node -c` syntax verification.
- [`SHEET_SCHEMA_SPEC.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/skills/sheet-drive-relay/resources/SHEET_SCHEMA_SPEC.md): Declarative spreadsheet schema specification.

---

## Step-by-Step Instantiation Playbook

### Step 1: Initialize Google Sheet Control Plane
1. Create a Google Spreadsheet (e.g. `<ProjectName>_Media_Relay`).
2. Add the 3 canonical tabs defined in [`SHEET_SCHEMA_SPEC.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/skills/sheet-drive-relay/resources/SHEET_SCHEMA_SPEC.md):
   - **`Config_Settings`**: Headers: `SettingKey`, `SettingValue`, `Notes`
   - **`Config_Routing`**: Headers: `Module`, `Event`, `Category`, `SubfolderPath`, `Status`
   - **`Upload_Ledger`**: Headers: `Timestamp`, `UploaderEmail`, `ItemId`, `Module`, `Event`, `Category`, `FileName`, `FileSizeKB`, `FileId`, `DriveUrl`, `ThumbnailCdnUrl`, `SubfolderPath`
3. Note the `SPREADSHEET_ID` from the browser URL (`/spreadsheets/d/{ID}/edit`).

### Step 2: Initialize Google Drive Root Folder
1. Create a Google Drive folder (e.g. `<ProjectName>_Media`).
2. Note the `ROOT_FOLDER_ID` from the browser URL (`/folders/{ID}`).

### Step 3: Instantiate and Deploy the GAS Webhook
1. Copy `MediaRelay.template.js` into your backend folder (e.g. `backend_gas/MediaRelay.js`).
2. Replace configuration bindings:
   ```javascript
   var ROOT_FOLDER_ID = 'your_root_folder_id';
   var SPREADSHEET_ID = 'your_spreadsheet_id';
   var AUTHORIZED_EMAILS = ['admin@example.com', 'team@example.com'];
   ```
3. Copy `appsscript.json` into the same backend directory.
4. Create `.clasp.json` referencing your GAS Project ID:
   ```json
   {
     "scriptId": "YOUR_APPS_SCRIPT_PROJECT_ID",
     "rootDir": "."
   }
   ```
5. Deploy via clasp:
   ```bash
   node scripts/deploy-gas-relay.cjs --target-dir=backend_gas --push
   ```
6. In Google Apps Script UI:
   - Deploy as **Web App**.
   - Execute as: **Me (your email)**.
   - Who has access: **Anyone** (or Anonymous).
   - Copy the published Web App URL (`https://script.google.com/macros/s/.../exec`).

### Step 4: Wire Web Client (Zero-CORS Simple POST)

Implement the upload function in your web client data module:

```javascript
/**
 * Upload an image via the Sheet-Drive Media Relay
 */
async function uploadToDriveRelay(webhookUrl, imageFile, metadata) {
  // 1. Offscreen Canvas Downscaling (INV-RELAY-CANVAS-002)
  const base64Data = await compressTo2K(imageFile, 2048, 0.88);

  // 2. Build Payload
  const payload = {
    image: base64Data,
    fileName: imageFile.name || 'upload.jpg',
    mimeType: imageFile.type || 'image/jpeg',
    uploaderEmail: metadata.uploaderEmail,
    itemId: metadata.itemId,
    module: metadata.module || 'General',
    event: metadata.event || 'General',
    category: metadata.category || 'General'
  };

  // 3. Simple POST Request (INV-RELAY-CORS-001)
  const response = await fetch(webhookUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/plain' // Crucial: avoids OPTIONS preflight
    },
    body: JSON.stringify(payload),
    redirect: 'follow'
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Upload failed');
  }

  return {
    fileId: result.fileId,
    fileUrl: result.fileUrl,
    cdnUrl: result.cdnUrl,
    subfolderPath: result.subfolderPath
  };
}

/**
 * Client-Side Canvas 2K Downscaling Engine
 */
function compressTo2K(file, maxDimension = 2048, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
```

---

## Troubleshooting & Failure Recovery Matrix

| Symptom | Root Cause | Resolution |
| :--- | :--- | :--- |
| **`CORS error: Response to preflight request doesn't pass access control check`** | Fetch used `Content-Type: application/json` or custom headers. | Change headers to `'Content-Type': 'text/plain'` and remove all authorization headers from client request (`INV-RELAY-CORS-001`). |
| **`HTTP 302 / Redirected response not handled`** | Browser fetch did not follow the Google Apps Script redirect. | Add `redirect: 'follow'` to fetch options. |
| **`AUTH_FORBIDDEN: Unauthorized uploader`** | Uploader email is not in `AUTHORIZED_EMAILS` or `Config_Settings` allowlist. | Add the user's email to `AUTHORIZED_EMAILS` array or `Config_Settings` tab in the spreadsheet. |
| **`Exceeded maximum execution time` (GAS 30s timeout)** | Client sent uncompressed raw multi-megabyte photo (>5MB). | Enforce browser Canvas downscaling to max 2048px at 0.88 quality (<1.2MB) (`INV-RELAY-CANVAS-002`). |
| **Routing does not reflect recent changes to `Config_Routing` sheet** | Routing table is cached in `CacheService` with 10-minute TTL. | Wait 10 minutes or trigger a manual cache clear in GAS (`CacheService.getScriptCache().remove('MEDIA_ROUTING_TABLE')`). |

<!-- shared:std.agent.sheet-drive-relay.core:end -->
