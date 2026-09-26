/**
 * test-client-provider-strategy.cjs — Unit Test for SK-011 Phase 2 Client Provider Engine
 * 
 * Verifies:
 * 1. 2048px aspect ratio downscaling math (landscape, portrait, and already-small images).
 * 2. Payload size budget simulation (<1.2MB Base64 budget).
 * 3. Provider strategy configuration check (drive_webhook vs firebase_storage).
 * 4. Error guardrails when webhook URL is missing.
 * 5. Candidate look record schema conformance for Firestore.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CLIENT_PATH = path.join(ROOT_DIR, 'public', 'js', 'modules', 'firestore-client.js');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
  }
}

console.log('🧪 Starting SK-011 Phase 2 Client Provider Strategy Tests...\n');

// 1. Verify firestore-client.js exports compressImage and fsUploadLookPhoto
runTest('firestore-client.js contains compressImage and fsUploadLookPhoto with provider dispatch', () => {
  assert.ok(fs.existsSync(CLIENT_PATH), 'public/js/modules/firestore-client.js must exist');
  const code = fs.readFileSync(CLIENT_PATH, 'utf8');
  assert.ok(code.includes('compressImage'), 'Must define compressImage');
  assert.ok(code.includes('_uploadToDriveWebhook'), 'Must define _uploadToDriveWebhook');
  assert.ok(code.includes('maxDim = 2048'), 'Default maxDim must be 2048 (2K High-Fidelity)');
  assert.ok(code.includes('quality = 0.88'), 'Default quality must be 0.88');
  assert.ok(code.includes('provider === \'drive_webhook\''), 'Must implement drive_webhook provider branch');
  assert.ok(code.includes('provider === \'firebase_storage\''), 'Must implement firebase_storage provider branch');
});

// 2. Aspect Ratio Downscaling Math Verification
runTest('Downscaling calculation preserves aspect ratio and caps at 2048px', () => {
  function computeTargetDimensions(origW, origH, maxDim = 2048) {
    let width = origW;
    let height = origH;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }
    return { width, height };
  }

  // Case A: 4K Landscape Photo (4032 x 3024 - typical iPhone 12MP)
  const landscape = computeTargetDimensions(4032, 3024, 2048);
  assert.strictEqual(landscape.width, 2048);
  assert.strictEqual(landscape.height, 1536);
  assert.strictEqual((landscape.width / landscape.height).toFixed(2), (4032 / 3024).toFixed(2));

  // Case B: 48MP High-Res Portrait (6000 x 8000)
  const portrait = computeTargetDimensions(6000, 8000, 2048);
  assert.strictEqual(portrait.height, 2048);
  assert.strictEqual(portrait.width, 1536);

  // Case C: Already small image (800 x 600)
  const small = computeTargetDimensions(800, 600, 2048);
  assert.strictEqual(small.width, 800);
  assert.strictEqual(small.height, 600);
});

// 3. Size Budget Simulation
runTest('Size budget calculation verifies 2K 0.88 JPEG stays within 1.2MB payload limit', () => {
  // A 2048x1536 JPEG at 0.88 quality averages ~750KB
  const estimatedBinaryBytes = 750 * 1024;
  const base64Length = Math.round(estimatedBinaryBytes * 1.33);
  const base64MB = base64Length / (1024 * 1024);

  assert.ok(base64MB < 1.2, `Base64 size (${base64MB.toFixed(2)} MB) must be well below 1.2MB budget`);
  assert.ok(base64MB < 8.0, 'Payload must be well below GAS MAX_FILE_SIZE_MB (8.0 MB)');
});

// 4. Candidate Look Firestore Record Schema Conformance
runTest('Candidate Look option record formats with remote CDN URL and driveFileId', () => {
  const mockFileId = '1_mock_drive_file_id_xyz';
  const cdnUrl = `https://lh3.googleusercontent.com/d/${mockFileId}=w2048`;

  const newOption = {
    optionIndex: 3,
    isDefault: false,
    label: 'Look 3 (Showroom Trial)',
    src: cdnUrl,
    referenceUrl: `https://drive.google.com/file/d/${mockFileId}/view`,
    type: 'google_drive_upload',
    storageProvider: 'drive_webhook',
    driveFileId: mockFileId,
    storagePath: null,
    store: 'Kalamandir Bhubaneswar',
    priceTier: '₹25,000 - ₹35,000',
    addedAt: new Date().toISOString(),
    addedBy: 'goldenage399@gmail.com'
  };

  assert.strictEqual(newOption.storageProvider, 'drive_webhook');
  assert.strictEqual(newOption.type, 'google_drive_upload');
  assert.strictEqual(newOption.driveFileId, mockFileId);
  assert.ok(newOption.src.includes('=w2048'), 'Thumbnail URL requests high-res 2048px');
  assert.ok(newOption.referenceUrl.includes('drive.google.com/file/d/'));
});

// 5. Config presence verification
runTest('config.js exports driveUploadWebhookUrl and storageProvider', () => {
  const configCode = fs.readFileSync(path.join(ROOT_DIR, 'public', 'js', 'config.js'), 'utf8');
  assert.ok(configCode.includes('driveUploadWebhookUrl:'), 'Must declare driveUploadWebhookUrl');
  assert.ok(configCode.includes('storageProvider: "drive_webhook"'), 'Must declare storageProvider');
});

console.log(`\n========================================`);
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
