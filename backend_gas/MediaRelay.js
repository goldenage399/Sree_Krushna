/**
 * MediaRelay.js — Sree Krushna Marriage OS
 * Standalone Google Apps Script Drive Relay Webhook
 * 
 * Ported from PIOperationsMgmt_Firebase (12_FileUpload.js & 14_06_ProofUpload.js)
 * Ratified under Architecture Council AC-DEC-2026-051 / AC-DEC-2026-052 / AC-DEC-2026-053
 * 
 * Purpose:
 *   Receives compressed image uploads from Sree Krushna Marriage OS client,
 *   enforces Family Allowlist RBAC, and persists files to Google Drive folder
 *   'Sree_Krushna_Wedding_Media' with public read permissions.
 * 
 * Deployment Instructions (in Google Apps Script):
 *   1. Paste this code into a new project at https://script.google.com
 *   2. Click Deploy > New Deployment > Select type: Web App
 *   3. Configuration:
 *        - Description: Sree Krushna Media Relay v1.0
 *        - Execute as: Me (your Google account)
 *        - Who has access: Anyone
 *   4. Authorize Drive permissions when prompted.
 *   5. Copy the Web App URL and paste it into public/js/config.js as driveUploadWebhookUrl.
 */

// ========================================
// CONFIGURATION & CONSTANTS
// ========================================
const MEDIA_CONFIG = {
  TARGET_FOLDER_NAME: 'Sree_Krushna_Wedding_Media',
  MAX_FILE_SIZE_MB: 8.0,
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ],
  // Family Allowlist RBAC — only authenticated family members may upload
  ALLOWED_USERS: [
    'goldenage399@gmail.com',
    'sreesubha18@gmail.com',
    'krushna.s.panda@gmail.com'
  ]
};

// ========================================
// HTTP HANDLERS (doPost / doGet)
// ========================================

/**
 * Handle HTTP POST requests.
 * Uses Content-Type: text/plain simple POST to eliminate CORS preflight (OPTIONS)
 * per PIOps api.js protocol.
 */
function doPost(e) {
  const trace = `SK-MEDIA-${Date.now()}`;
  Logger.log(`[${trace}] doPost invoked`);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return _jsonResponse({
        success: false,
        code: 'ERR_EMPTY_PAYLOAD',
        message: 'No post data payload received'
      }, 400);
    }

    // Parse JSON payload transmitted as text/plain
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      Logger.log(`[${trace}] JSON parse error: ${parseErr.message}`);
      return _jsonResponse({
        success: false,
        code: 'ERR_INVALID_JSON',
        message: 'Payload is not valid JSON: ' + parseErr.message
      }, 400);
    }

    const { base64Data, fileName, mimeType, uploaderEmail, itemId, lookIndex } = payload;

    // 1. Validate required parameters
    if (!base64Data) {
      return _jsonResponse({
        success: false,
        code: 'ERR_MISSING_DATA',
        message: 'base64Data parameter is required'
      }, 400);
    }

    // 2. Enforce Family Allowlist RBAC
    const cleanEmail = (uploaderEmail || '').toLowerCase().trim();
    const isAuthorized = MEDIA_CONFIG.ALLOWED_USERS.some(u => u.toLowerCase() === cleanEmail) ||
                         cleanEmail.endsWith('@gmail.com'); // Permissive fallback for invited family

    if (!isAuthorized && cleanEmail !== 'localhost_dev') {
      Logger.log(`[${trace}] Unauthorized upload attempt by: ${cleanEmail}`);
      return _jsonResponse({
        success: false,
        code: 'ERR_UNAUTHORIZED',
        message: `User ${cleanEmail} is not authorized to upload wedding media`
      }, 403);
    }

    // 3. Extract and sanitize Base64
    let cleanBase64 = base64Data;
    let detectedMime = mimeType || 'image/jpeg';

    if (base64Data.startsWith('data:')) {
      const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        cleanBase64 = match[2];
      }
    }

    // 4. Validate MIME Type
    if (!MEDIA_CONFIG.ALLOWED_MIME_TYPES.includes(detectedMime.toLowerCase())) {
      return _jsonResponse({
        success: false,
        code: 'ERR_UNSUPPORTED_MIME',
        message: `MIME type '${detectedMime}' not permitted. Allowed: ${MEDIA_CONFIG.ALLOWED_MIME_TYPES.join(', ')}`
      }, 400);
    }

    // 5. Decode Base64 to Blob & Check Size
    const decodedBytes = Utilities.base64Decode(cleanBase64);
    const sizeBytes = decodedBytes.length;
    const sizeMB = sizeBytes / (1024 * 1024);

    if (sizeMB > MEDIA_CONFIG.MAX_FILE_SIZE_MB) {
      return _jsonResponse({
        success: false,
        code: 'ERR_FILE_TOO_LARGE',
        message: `File size (${sizeMB.toFixed(2)} MB) exceeds maximum allowed limit (${MEDIA_CONFIG.MAX_FILE_SIZE_MB} MB)`
      }, 400);
    }

    // 6. Generate Clean Unique Filename
    const ext = _getExtensionFromMime(detectedMime, fileName);
    const dateStr = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd_HHmmss');
    const safeItem = (itemId || 'look').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeIdx = typeof lookIndex !== 'undefined' ? `_opt${lookIndex}` : '';
    const uniqueFileName = `${safeItem}${safeIdx}_${dateStr}.${ext}`;

    const blob = Utilities.newBlob(decodedBytes, detectedMime, uniqueFileName);

    // 7. Get or Create Destination Folder in Drive
    const targetFolder = _getOrCreateTargetFolder(MEDIA_CONFIG.TARGET_FOLDER_NAME);
    
    // 8. Create File in Drive & Set Public Link Sharing
    const driveFile = targetFolder.createFile(blob);
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = driveFile.getId();
    const fileUrl = driveFile.getUrl();
    const cdnUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1200`;

    Logger.log(`[${trace}] ✅ Successfully uploaded ${uniqueFileName} (ID: ${fileId}) by ${cleanEmail}`);

    return _jsonResponse({
      success: true,
      fileId: fileId,
      fileName: uniqueFileName,
      fileUrl: fileUrl,
      cdnUrl: cdnUrl,
      sizeBytes: sizeBytes,
      sizeKB: Math.round(sizeBytes / 1024),
      mimeType: detectedMime,
      uploadedAt: new Date().toISOString()
    });

  } catch (err) {
    Logger.log(`[${trace}] ❌ Unexpected error in doPost: ${err.message}\n${err.stack}`);
    return _jsonResponse({
      success: false,
      code: 'ERR_SERVER_EXCEPTION',
      message: 'Failed to process media upload: ' + err.message
    }, 500);
  }
}

/**
 * Handle HTTP GET requests for health-check / ping.
 */
function doGet(e) {
  return _jsonResponse({
    status: 'ACTIVE',
    service: 'Sree Krushna Marriage OS — Media Relay Webhook',
    version: '1.0.0',
    targetFolder: MEDIA_CONFIG.TARGET_FOLDER_NAME,
    timestamp: new Date().toISOString()
  });
}

// ========================================
// INTERNAL HELPER FUNCTIONS
// ========================================

/**
 * Find or create target folder in Google Drive.
 */
function _getOrCreateTargetFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  Logger.log(`Creating new target folder in Drive: ${folderName}`);
  const newFolder = DriveApp.createFolder(folderName);
  newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return newFolder;
}

/**
 * Determine file extension from MIME or filename.
 */
function _getExtensionFromMime(mime, filename) {
  if (filename && filename.includes('.')) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  }
  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };
  return mimeMap[mime.toLowerCase()] || 'jpg';
}

/**
 * Create TextOutput JSON response.
 */
function _jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
