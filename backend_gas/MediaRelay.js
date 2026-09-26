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

    // Administrative Action: SETUP_SHEETS (Self-Provisioning Bootstrap)
    if (payload.action === 'SETUP_SHEETS') {
      var setupResult = setupMediaRelaySheets();
      return ContentService.createTextOutput(JSON.stringify(setupResult))
        .setMimeType(ContentService.MimeType.JSON);
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

// ─── 12-DIMENSION UPLOAD LEDGER LOGGING (AUTO-HEALING) ────────────────────────
function _logUploadToSheet(entry) {
  try {
    var ledgerHeaders = [
      'Timestamp', 'UploaderEmail', 'ItemId', 'Module', 'Event', 'Category',
      'FileName', 'FileSizeKB', 'FileId', 'DriveUrl', 'ThumbnailCdnUrl', 'SubfolderPath'
    ];
    var sheet = _getOrHealSheet(TAB_UPLOAD_LEDGER, ledgerHeaders);
    if (!sheet) {
      console.warn('Upload_Ledger tab could not be accessed or healed in spreadsheet:', SPREADSHEET_ID);
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

// ─── SPREADSHEET AUTO-PROVISIONING & AUTO-HEALING ENGINE (INV-RELAY-AUTO-HEAL-006) ───
/**
 * Run this function once from the Apps Script editor (or trigger via POST { action: 'SETUP_SHEETS' })
 * to automatically create and format all 3 control tabs with styled headers and default seed rows.
 */
function setupMediaRelaySheets() {
  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured.');
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // 1. Setup Config_Settings
  var sSettings = _getSheetOrCreate(ss, TAB_CONFIG_SETTINGS, ['SettingKey', 'SettingValue', 'Notes']);
  if (sSettings.getLastRow() <= 1) {
    var defaultEmail = (AUTHORIZED_EMAILS && AUTHORIZED_EMAILS[0]) ? AUTHORIZED_EMAILS[0] : 'admin@example.com';
    var settingsRows = [
      ['ALLOWLIST_EMAIL', defaultEmail, 'Primary authorized host'],
      ['CACHE_TTL_SEC', '600', 'In-memory CacheService TTL in seconds'],
      ['MAX_FILE_SIZE_KB', '2048', 'Maximum allowed upload payload size in KB']
    ];
    sSettings.getRange(2, 1, settingsRows.length, 3).setValues(settingsRows);
  }

  // 2. Setup Config_Routing (Multi-Module Taxonomy)
  var sRouting = _getSheetOrCreate(ss, TAB_CONFIG_ROUTING, ['Module', 'Event', 'Category', 'SubfolderPath', 'Status']);
  if (sRouting.getLastRow() <= 1) {
    var routingRows = [
      ['Shopping', 'Vivaha', 'Bridal_Silks', 'Shopping/Vivaha/Bridal_Silks', 'ACTIVE'],
      ['Shopping', 'Vivaha', 'Groom_Wear', 'Shopping/Vivaha/Groom_Wear', 'ACTIVE'],
      ['Shopping', 'Vivaha', 'Jewellery', 'Shopping/Vivaha/Jewellery', 'ACTIVE'],
      ['Shopping', 'Vivaha', 'Tarakasi_Silver', 'Shopping/Vivaha/Tarakasi_Silver', 'ACTIVE'],
      ['Shopping', 'Reception', 'Bridal_Lehenga', 'Shopping/Reception/Bridal_Lehenga', 'ACTIVE'],
      ['Shopping', 'Reception', 'Groom_Sherwani', 'Shopping/Reception/Groom_Sherwani', 'ACTIVE'],
      ['Shopping', 'Sangeet', '*', 'Shopping/Sangeet/Outfits', 'ACTIVE'],
      ['Shopping', 'Engagement', '*', 'Shopping/Engagement/Rings_Attire', 'ACTIVE'],
      ['Shopping', 'Haldi', '*', 'Shopping/Haldi/Yellow_Silks', 'ACTIVE'],
      ['Shopping', '*', 'Sara_Gifting', 'Shopping/Gifting/Sara_Relatives', 'ACTIVE'],
      ['Decorator_Cockpit', 'Vivaha', 'Mandap', 'Decor/Vivaha/Mandap', 'ACTIVE'],
      ['Decorator_Cockpit', 'Vivaha', 'Stage_Backdrop', 'Decor/Vivaha/Stage_Backdrop', 'ACTIVE'],
      ['Decorator_Cockpit', 'Vivaha', 'Entry_Arch', 'Decor/Vivaha/Entry_Arch', 'ACTIVE'],
      ['Decorator_Cockpit', 'Vivaha', 'Dining_Pandal', 'Decor/Vivaha/Dining_Pandal', 'ACTIVE'],
      ['Decorator_Cockpit', '*', 'Lighting', 'Decor/Lighting_Atmosphere', 'ACTIVE'],
      ['Decorator_Cockpit', '*', 'Florals', 'Decor/Floral_Installations', 'ACTIVE'],
      ['Decorator_Cockpit', '*', 'Lounge', 'Decor/Photo_Lounges', 'ACTIVE'],
      ['Liturgy', 'Vivaha', 'Sacred_Pata', 'Liturgy/Vivaha/Sacred_Pata', 'ACTIVE'],
      ['Liturgy', 'Vivaha', 'Samagri', 'Liturgy/Vivaha/Samagri', 'ACTIVE'],
      ['Finance', '*', 'Invoices', 'Finance/Vendor_Invoices', 'ACTIVE'],
      ['Finance', '*', 'Receipts', 'Finance/Payment_Receipts', 'ACTIVE'],
      ['Operations', '*', 'Floorplans', 'Operations/Venue_Layouts', 'ACTIVE']
    ];
    sRouting.getRange(2, 1, routingRows.length, 5).setValues(routingRows);
  }

  // 3. Setup Upload_Ledger
  var sLedger = _getSheetOrCreate(ss, TAB_UPLOAD_LEDGER, [
    'Timestamp', 'UploaderEmail', 'ItemId', 'Module', 'Event', 'Category',
    'FileName', 'FileSizeKB', 'FileId', 'DriveUrl', 'ThumbnailCdnUrl', 'SubfolderPath'
  ]);

  // Delete empty default 'Sheet1' if it exists and other sheets are present
  try {
    var defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
      ss.deleteSheet(defaultSheet);
    }
  } catch (e) {}

  console.log('✅ Sheet-Drive Media Relay tabs successfully provisioned and formatted!');
  return { success: true, message: 'All control sheets provisioned successfully.' };
}

/**
 * Retrieves existing sheet or automatically provisions it with styled headers
 */
function _getSheetOrCreate(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0 && headers && headers.length > 0) {
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setFontColor('#ffffff');
    headerRange.setBackground('#1a1a2e'); // Deep Navy Theme
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);

    for (var c = 1; c <= headers.length; c++) {
      sheet.autoResizeColumn(c);
      if (sheet.getColumnWidth(c) < 130) {
        sheet.setColumnWidth(c, 130);
      }
    }
  }

  return sheet;
}

/**
 * Runtime auto-healing helper
 */
function _getOrHealSheet(sheetName, fallbackHeaders) {
  if (!SPREADSHEET_ID) return null;
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    return _getSheetOrCreate(ss, sheetName, fallbackHeaders);
  } catch (e) {
    console.warn('Could not access or heal sheet ' + sheetName + ':', e.message);
    return null;
  }
}

// ─── SPREADSHEET HELPER ──────────────────────────────────────────────────────
function _getSheet(sheetName) {
  if (!SPREADSHEET_ID) return null;
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    return ss.getSheetByName(sheetName);
  } catch (e) {
    console.warn('Error accessing spreadsheet:', e.message);
    return null;
  }
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
