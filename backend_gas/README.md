# Sree Krushna Marriage OS — Google Apps Script Media Relay

This directory contains the standalone Google Apps Script (GAS) Webhook that handles persistent photo intake directly to Google Drive, completely bypassing the Firebase Cloud Storage Blaze billing upgrade.

---

## 🚀 Deployment Guide

### Option A: Automated 1-Command Deployment via CLI (Recommended)

Once logged into clasp (`npx @google/clasp login`):

```powershell
node scripts/deploy-gas-relay.cjs --push
```

This single command:
1. Performs pre-flight JS syntax checks (`node -c`).
2. Pushes source files (`MediaRelay.js`, `appsscript.json`) to Google Apps Script (`clasp push --force`).
3. Automatically bumps the versioned production deployment in-place (`clasp deploy --deploymentId <id> --description "..."`), matching the PIOps deployment architecture (`D:\GitHub_Repo\PIOperationsMgmt_Firebase\backend\scripts\deploy.ps1`).
4. Keeps the existing Web App URL live and unchanged with the new version active immediately—**requiring zero clicks in the Apps Script UI**.

---

### Option B: Manual UI Deployment (Fallback / First-Time Setup)

If clasp CLI is not configured, you can deploy manually:

1. Navigate to [https://script.google.com](https://script.google.com).
2. Open or create project `SreeKrushna_MediaRelay`.
3. Copy contents of `MediaRelay.js` into the editor.
4. Click **Deploy** &rarr; **New deployment** (or **Manage deployments** &rarr; **Edit** &rarr; **New version**).
5. Ensure:
   - **Execute as**: `Me (<your-email>)`
   - **Who has access**: `Anyone`
6. Copy the published Web App URL into `public/js/config.js` and `js/config.js`.

---

## 🔒 Security & Architecture Details
- **Zero CORS Preflight**: Uses `Content-Type: text/plain` simple POST requests to avoid browser `OPTIONS` preflight failures, conforming to the PIOps production `api.js` protocol.
- **Family Allowlist RBAC**: Validates the `uploaderEmail` against authorized family hosts (`goldenage399@gmail.com`, `sreesubha18@gmail.com`, `krushna.s.panda@gmail.com`).
- **Zero-CORS CDN Thumbnailing**: Returns `cdnUrl: https://lh3.googleusercontent.com/d/{fileId}=w1200`, which renders with sub-second speeds and zero CORS restrictions via `ui_primitives/scripts/drive_normalizer.js`.
- **Target Folder**: Automatically provisions the folder `Sree_Krushna_Wedding_Media` in Google Drive upon first upload.
