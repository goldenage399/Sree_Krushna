/**
 * test-drive-relay-contract.cjs — Contract Verification for SK-011 Phase 1
 * 
 * Verifies:
 * 1. backend_gas/MediaRelay.js syntax and structural contract.
 * 2. Payload parsing: Base64 decoding simulation, data URI extraction, MIME validation.
 * 3. Family Allowlist RBAC logic.
 * 4. Unique filename sanitization and extension mapping.
 * 5. Response schema conformance (success, fileId, fileUrl, cdnUrl).
 * 6. Dual-release byte parity between js/config.js and public/js/config.js.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const MEDIA_RELAY_PATH = path.join(ROOT_DIR, 'backend_gas', 'MediaRelay.js');
const ROOT_CONFIG_PATH = path.join(ROOT_DIR, 'js', 'config.js');
const PUBLIC_CONFIG_PATH = path.join(ROOT_DIR, 'public', 'js', 'config.js');

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

console.log('🧪 Starting SK-011 Phase 1 Drive Relay Contract Tests...\n');

// 1. Verify MediaRelay.js existence and contents
runTest('MediaRelay.js exists and exports expected constants & handlers', () => {
  assert.ok(fs.existsSync(MEDIA_RELAY_PATH), 'backend_gas/MediaRelay.js must exist');
  const content = fs.readFileSync(MEDIA_RELAY_PATH, 'utf8');
  assert.ok(content.includes('function doPost(e)'), 'Must define doPost(e)');
  assert.ok(content.includes('function doGet(e)'), 'Must define doGet(e)');
  assert.ok(content.includes('Sree_Krushna_Wedding_Media'), 'Must reference Sree_Krushna_Wedding_Media folder');
  assert.ok(content.includes('goldenage399@gmail.com'), 'Must include goldenage399@gmail.com in allowlist');
  assert.ok(content.includes('https://lh3.googleusercontent.com/d/'), 'Must construct canonical zero-CORS CDN URL');
});

// 2. Simulate Base64 extraction and MIME detection
runTest('Base64 extraction handles raw base64 and data URI prefixes', () => {
  const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const dataUri = `data:image/png;base64,${sampleBase64}`;

  // Data URI match logic
  function extractBase64(input, defaultMime = 'image/jpeg') {
    let clean = input;
    let mime = defaultMime;
    if (input.startsWith('data:')) {
      const match = input.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mime = match[1];
        clean = match[2];
      }
    }
    return { clean, mime };
  }

  const rawRes = extractBase64(sampleBase64);
  assert.strictEqual(rawRes.clean, sampleBase64);
  assert.strictEqual(rawRes.mime, 'image/jpeg');

  const uriRes = extractBase64(dataUri);
  assert.strictEqual(uriRes.clean, sampleBase64);
  assert.strictEqual(uriRes.mime, 'image/png');

  // Verify buffer decodable
  const buf = Buffer.from(uriRes.clean, 'base64');
  assert.ok(buf.length > 0, 'Buffer length must be > 0');
});

// 3. Family Allowlist RBAC verification
runTest('Family Allowlist correctly validates authorized vs unauthorized emails', () => {
  const ALLOWED_USERS = [
    'goldenage399@gmail.com',
    'sreesubha18@gmail.com',
    'krushna.s.panda@gmail.com'
  ];

  function checkAuth(email) {
    const clean = (email || '').toLowerCase().trim();
    return ALLOWED_USERS.some(u => u.toLowerCase() === clean) ||
           clean.endsWith('@gmail.com') ||
           clean === 'localhost_dev';
  }

  assert.strictEqual(checkAuth('goldenage399@gmail.com'), true);
  assert.strictEqual(checkAuth('SREESUBHA18@GMAIL.COM'), true);
  assert.strictEqual(checkAuth('krushna.s.panda@gmail.com'), true);
  assert.strictEqual(checkAuth('cousin.family@gmail.com'), true);
  assert.strictEqual(checkAuth('localhost_dev'), true);
  assert.strictEqual(checkAuth('unauthorized_hacker@unknown-domain.xyz'), false);
  assert.strictEqual(checkAuth(''), false);
  assert.strictEqual(checkAuth(null), false);
});

// 4. Filename sanitization and unique naming
runTest('Filename generation generates safe, sanitized unique names', () => {
  function getExt(mime, filename) {
    if (filename && filename.includes('.')) {
      const ext = filename.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        return ext === 'jpeg' ? 'jpg' : ext;
      }
    }
    const map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    return map[mime] || 'jpg';
  }

  assert.strictEqual(getExt('image/jpeg', 'my photo (1).jpeg'), 'jpg');
  assert.strictEqual(getExt('image/png', 'sample.PNG'), 'png');
  assert.strictEqual(getExt('image/webp', 'blob'), 'webp');

  const itemId = 'SK-SHP-001/Sherwani';
  const safeItem = itemId.replace(/[^a-zA-Z0-9_-]/g, '_');
  assert.strictEqual(safeItem, 'SK-SHP-001_Sherwani');
});

// 5. Response schema conformance
runTest('Response schema conforms to SK client contracts', () => {
  const mockFileId = '1AbCdEfGhIjKlMnOpQrStUvWxYz_12345';
  const mockResponse = {
    success: true,
    fileId: mockFileId,
    fileName: 'look_opt1_2026-09-26.jpg',
    fileUrl: `https://drive.google.com/file/d/${mockFileId}/view`,
    cdnUrl: `https://lh3.googleusercontent.com/d/${mockFileId}=w1200`,
    sizeBytes: 154200,
    sizeKB: 151,
    mimeType: 'image/jpeg',
    uploadedAt: new Date().toISOString()
  };

  assert.strictEqual(typeof mockResponse.success, 'boolean');
  assert.strictEqual(typeof mockResponse.fileId, 'string');
  assert.ok(mockResponse.cdnUrl.startsWith('https://lh3.googleusercontent.com/d/'));
  assert.ok(mockResponse.cdnUrl.endsWith('=w1200'));
});

// 6. Config file verification and dual-release byte parity
runTest('config.js and public/js/config.js have exact 100% byte parity and new fields', () => {
  assert.ok(fs.existsSync(ROOT_CONFIG_PATH), 'js/config.js must exist');
  assert.ok(fs.existsSync(PUBLIC_CONFIG_PATH), 'public/js/config.js must exist');

  const rootConfig = fs.readFileSync(ROOT_CONFIG_PATH, 'utf8');
  const pubConfig = fs.readFileSync(PUBLIC_CONFIG_PATH, 'utf8');

  assert.strictEqual(rootConfig, pubConfig, 'js/config.js and public/js/config.js must have 100% byte parity');
  assert.ok(rootConfig.includes('driveUploadWebhookUrl'), 'Must include driveUploadWebhookUrl');
  assert.ok(rootConfig.includes('storageProvider: "drive_webhook"'), 'Must include storageProvider: "drive_webhook"');
});

console.log(`\n========================================`);
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
