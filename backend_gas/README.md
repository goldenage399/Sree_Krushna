# Sree Krushna Marriage OS — Google Apps Script Media Relay

This directory contains the standalone Google Apps Script (GAS) Webhook that handles persistent photo intake directly to Google Drive, completely bypassing the Firebase Cloud Storage Blaze billing upgrade.

---

## 🚀 One-Time 60-Second Deployment Guide

Follow these steps to deploy your private wedding photo relay into your Google account:

### Step 1: Open Google Apps Script
1. Navigate to [https://script.google.com](https://script.google.com).
2. Log in with the Google Account that will store the wedding photos (e.g. `goldenage399@gmail.com` or `krushna.s.panda@gmail.com`).
3. Click **+ New Project** (top-left).
4. Rename the project from *Untitled project* to **`SreeKrushna_MediaRelay`**.

### Step 2: Paste the Code
1. Erase the default `function myFunction() {}` in `Code.gs`.
2. Copy the entire contents of [`backend_gas/MediaRelay.js`](./MediaRelay.js) and paste it into the editor.
3. Press **Ctrl + S** (or click the Save floppy disk icon).

### Step 3: Deploy as Web App
1. Click the blue **Deploy** button (top-right) and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment form:
   - **Description**: `Sree Krushna Media Relay v1.0`
   - **Execute as**: `Me (<your-email>)` *(Ensures uploaded photos are owned by your Google Drive)*
   - **Who has access**: `Anyone` *(Allows the client web application to POST compressed photos)*
4. Click **Deploy**.

### Step 4: Authorize Google Drive Access
1. When prompted with *"Authorization required"*, click **Authorize access**.
2. Select your Google account.
3. If Google displays *"Google hasn't verified this app"*, click **Advanced** (bottom left), then click **Go to SreeKrushna_MediaRelay (unsafe)**.
4. Click **Allow**.

### Step 5: Copy Web App URL to Config
1. Google Apps Script will display your live **Web app URL**:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
2. Copy this URL.
3. Open [`public/js/config.js`](../public/js/config.js) in this repository and update:
   ```javascript
   window.firebaseConfig = {
     // ...
     driveUploadWebhookUrl: "https://script.google.com/macros/s/AKfycb.../exec",
     storageProvider: "drive_webhook"
   };
   ```

---

## 🔒 Security & Architecture Details
- **Zero CORS Preflight**: Uses `Content-Type: text/plain` simple POST requests to avoid browser `OPTIONS` preflight failures, conforming to the PIOps production `api.js` protocol.
- **Family Allowlist RBAC**: Validates the `uploaderEmail` against authorized family hosts (`goldenage399@gmail.com`, `sreesubha18@gmail.com`, `krushna.s.panda@gmail.com`).
- **Zero-CORS CDN Thumbnailing**: Returns `cdnUrl: https://lh3.googleusercontent.com/d/{fileId}=w1200`, which renders with sub-second speeds and zero CORS restrictions via `ui_primitives/scripts/drive_normalizer.js`.
- **Target Folder**: Automatically provisions the folder `Sree_Krushna_Wedding_Media` in Google Drive upon first upload.
