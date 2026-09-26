/**
 * MediaRelay.js — Sree Krushna Marriage OS
 * Standalone Google Apps Script Webhook for Sheet-Configured Google Drive Media Relay
 * Standard: STD-DRIVE-MEDIA-RELAY-001 (Universal SAP Package)
 * Ratified under Architecture Council AC-DEC-2026-054 / AC-DEC-2026-055 (SK-014 / SK-015)
 * 
 * Host Bindings:
 *   Root Folder ID: '1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ' (Sree_Krushna_Wedding_Media)
 *   Spreadsheet ID: '1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc' (Sree_Krushna_Media_Relay)
 *   Script ID:      '1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN'
 */

// ─── CONFIGURATION BINDINGS ──────────────────────────────────────────────────
var ROOT_FOLDER_ID = '1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ';
var SPREADSHEET_ID = '1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc';
var AUTHORIZED_EMAILS = [
  'goldenage399@gmail.com',
  'sreesubha18@gmail.com',
  'krushna.s.panda@gmail.com'
];

var TAB_CONFIG_ROUTING = 'Config_Routing';
var TAB_UPLOAD_LEDGER = 'Upload_Ledger';
var TAB_CONFIG_SETTINGS = 'Config_Settings';

var CACHE_TTL_SECONDS = 600; // 10 minutes

// ─── HEALTH CHECK (GET) ──────────────────────────────────────────────────────
function doGet(e) {
  var output = {
    status: 'online',
    instance: 'Sree_Krushna_Wedding_Media_Relay',
    standard: 'STD-DRIVE-MEDIA-RELAY-001',
    rootFolderId: ROOT_FOLDER_ID,
    spreadsheetId: SPREADSHEET_ID,
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── WEBHOOK HANDLER (POST) ──────────────────────────────────────────────────
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return _createErrorResponse('INVALID_PAYLOAD', 'Missing POST body payload');
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return _createErrorResponse('INVALID_JSON', 'Malformed JSON in request body: ' + parseErr.message);
    }

    // 1. RBAC Authentication Check
    var uploaderEmail = (payload.uploaderEmail || '').trim().toLowerCase();
    if (!uploaderEmail || !_isAuthorized(uploaderEmail)) {
      return _createErrorResponse('AUTH_FORBIDDEN', 'Unauthorized uploader: ' + (uploaderEmail || 'anonymous'));
    }

    // 2. Validate Image Data
    var imageRaw = payload.image || '';
    if (!imageRaw) {
      return _createErrorResponse('MISSING_IMAGE', 'No image data provided in payload');
    }

    var base64Data = imageRaw;
    var mimeType = payload.mimeType || 'image/jpeg';

    if (imageRaw.indexOf(';base64,') !== -1) {
      var parts = imageRaw.split(';base64,');
      var prefix = parts[0];
      base64Data = parts[1];
      if (prefix.indexOf('data:') === 0) {
        mimeType = prefix.replace('data:', '');
      }
    }

    var decodedBytes = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedBytes, mimeType);

    // 3. Filename & Item ID Sanitation
    var itemId = (payload.itemId || 'GEN').replace(/[^a-zA-Z0-9_-]/g, '_');
    var rawFileName = (payload.fileName || ('photo_' + Date.now() + '.jpg')).replace(/[^a-zA-Z0-9_.-]/g, '_');
    var sanitizedFileName = itemId + '_' + Date.now() + '_' + rawFileName;
    blob.setName(sanitizedFileName);

    // 4. Resolve Dynamic Routing & Subfolder Placement
    var moduleName = (payload.module || 'General').trim();
    var eventName = (payload.event || 'General').trim();
    var categoryName = (payload.category || 'General').trim();

    var subfolderPath = _resolveSubfolderPath(moduleName, eventName, categoryName);
    var targetFolder = _resolveOrCreateFolder(subfolderPath);

    // 5. Create File in Target Drive Folder
    var file = targetFolder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (permErr) {
      console.warn('Could not set public view permission on file:', permErr.message);
    }

    var fileId = file.getId();
    var fileUrl = file.getUrl();
    var cdnUrl = 'https://lh3.googleusercontent.com/d/' + fileId + '=w2048';
    var fileSizeKB = Math.round(decodedBytes.length / 1024);

    // 6. Log Transaction to Upload_Ledger Sheet
    _logUploadToSheet({
      timestamp: new Date(),
      uploaderEmail: uploaderEmail,
      itemId: itemId,
      module: moduleName,
      event: eventName,
      category: categoryName,
      fileName: sanitizedFileName,
      fileSizeKB: fileSizeKB,
      fileId: fileId,
      driveUrl: fileUrl,
      cdnUrl: cdnUrl,
      subfolderPath: subfolderPath
    });

    // 7. Return Standard Success Response
    var response = {
      success: true,
      fileId: fileId,
      fileUrl: fileUrl,
      cdnUrl: cdnUrl,
      subfolderPath: subfolderPath,
      fileName: sanitizedFileName,
      fileSizeKB: fileSizeKB
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (fatalErr) {
    console.error('Fatal relay error:', fatalErr);
    return _createErrorResponse('RELAY_EXECUTION_ERROR', fatalErr.message);
  }
}

// ─── RBAC & ALLOWLIST VALIDATION ─────────────────────────────────────────────
function _isAuthorized(email) {
  if (!email) return false;
  
  // 1. Check compiled default list
  for (var i = 0; i < AUTHORIZED_EMAILS.length; i++) {
    if (AUTHORIZED_EMAILS[i].toLowerCase() === email) {
      return true;
    }
  }

  // 2. Check dynamic Config_Settings allowlist if spreadsheet is bound
  try {
    var sheet = _getSheet(TAB_CONFIG_SETTINGS);
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      for (var r = 1; r < data.length; r++) {
        if (data[r][0] === 'ALLOWLIST_EMAIL' && data[r][1]) {
          var allowed = String(data[r][1]).trim().toLowerCase();
          if (allowed === email) return true;
        }
      }
    }
  } catch (e) {
    console.warn('Could not check Config_Settings allowlist:', e.message);
  }

  return false;
}

// ─── ROUTING TABLE RESOLUTION (CACHED) ───────────────────────────────────────
function _resolveSubfolderPath(moduleName, eventName, categoryName) {
  var routingTable = _getRoutingTable();
  
  // 1. Exact 3-way match: Module + Event + Category
  var key3 = (moduleName + '|' + eventName + '|' + categoryName).toLowerCase();
  if (routingTable[key3]) return routingTable[key3];

  // 2. 2-way match: Module + Event
  var key2 = (moduleName + '|' + eventName + '|*').toLowerCase();
  if (routingTable[key2]) return routingTable[key2];

  // 3. 1-way match: Module
  var key1 = (moduleName + '|*|*').toLowerCase();
  if (routingTable[key1]) return routingTable[key1];

  // 4. Default hierarchical fallback
  return moduleName + '/' + eventName + '/' + categoryName;
}

function _getRoutingTable() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('MEDIA_ROUTING_TABLE');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed parsing cached routing table:', e);
    }
  }

  var table = {};
  try {
    var sheet = _getSheet(TAB_CONFIG_ROUTING);
    if (sheet) {
      var rows = sheet.getDataRange().getValues();
      // Expecting: [Module, Event, Category, SubfolderPath, Status]
      for (var i = 1; i < rows.length; i++) {
        var mod = String(rows[i][0] || '*').trim();
        var evt = String(rows[i][1] || '*').trim();
        var cat = String(rows[i][2] || '*').trim();
        var path = String(rows[i][3] || '').trim();
        var status = String(rows[i][4] || 'ACTIVE').trim().toUpperCase();

        if (path && status === 'ACTIVE') {
          var key = (mod + '|' + evt + '|' + cat).toLowerCase();
          table[key] = path;
        }
      }
    }
  } catch (sheetErr) {
    console.warn('Error reading Config_Routing sheet:', sheetErr.message);
  }

  try {
    cache.put('MEDIA_ROUTING_TABLE', JSON.stringify(table), CACHE_TTL_SECONDS);
  } catch (cacheErr) {
    console.warn('Failed to cache routing table:', cacheErr.message);
  }

  return table;
}

// ─── DYNAMIC HIERARCHICAL FOLDER AUTO-PROVISIONING ───────────────────────────
function _resolveOrCreateFolder(relativePath) {
  var rootFolder;
  try {
    rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
  } catch (err) {
    throw new Error('Unable to access ROOT_FOLDER_ID (' + ROOT_FOLDER_ID + '): ' + err.message);
  }

  if (!relativePath || relativePath === '/' || relativePath === '.') {
    return rootFolder;
  }

  var segments = relativePath.split('/').map(function(s) { return s.trim(); }).filter(Boolean);
  var currentFolder = rootFolder;
  var accumulatedPath = '';

  var cache = CacheService.getScriptCache();

  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    accumulatedPath = accumulatedPath ? (accumulatedPath + '/' + segment) : segment;
    var cacheKey = 'FOLDER_ID_' + accumulatedPath.replace(/[^a-zA-Z0-9_]/g, '_');
    var cachedFolderId = cache.get(cacheKey);

    if (cachedFolderId) {
      try {
        currentFolder = DriveApp.getFolderById(cachedFolderId);
        continue;
      } catch (e) {
        // Cache stale or folder deleted, proceed to lookup
      }
    }

    var subFolders = currentFolder.getFoldersByName(segment);
    if (subFolders.hasNext()) {
      currentFolder = subFolders.next();
    } else {
      currentFolder = currentFolder.createFolder(segment);
    }

    try {
      cache.put(cacheKey, currentFolder.getId(), CACHE_TTL_SECONDS);
    } catch (e) {
      // Non-fatal cache write failure
    }
  }

  return currentFolder;
}

// ─── 12-DIMENSION UPLOAD LEDGER LOGGING ───────────────────────────────────────
function _logUploadToSheet(entry) {
  try {
    var sheet = _getSheet(TAB_UPLOAD_LEDGER);
    if (!sheet) {
      console.warn('Upload_Ledger tab not found in spreadsheet:', SPREADSHEET_ID);
      return;
    }

    // Append 12-dimension immutable audit entry
    sheet.appendRow([
      entry.timestamp,
      entry.uploaderEmail,
      entry.itemId,
      entry.module,
      entry.event,
      entry.category,
      entry.fileName,
      entry.fileSizeKB,
      entry.fileId,
      entry.driveUrl,
      entry.cdnUrl,
      entry.subfolderPath
    ]);
  } catch (err) {
    console.error('Failed to log entry to Upload_Ledger:', err.message);
  }
}

// ─── SPREADSHEET HELPER ──────────────────────────────────────────────────────
function _getSheet(sheetName) {
  if (!SPREADSHEET_ID) return null;
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(sheetName);
}

// ─── ERROR RESPONSE HELPER ───────────────────────────────────────────────────
function _createErrorResponse(code, message) {
  var envelope = {
    success: false,
    code: code,
    error: message,
    standard: 'STD-DRIVE-MEDIA-RELAY-001'
  };
  return ContentService.createTextOutput(JSON.stringify(envelope))
    .setMimeType(ContentService.MimeType.JSON);
}
