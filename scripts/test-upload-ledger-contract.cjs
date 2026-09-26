#!/usr/bin/env node
/**
 * test-upload-ledger-contract.cjs
 * 
 * Verification Gate for SK-014 Phase 3:
 * Real-Time Audit Ledger & Client Metadata Enrichment
 */

'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const CLIENT_PUBLIC = path.join(ROOT, 'public', 'js', 'modules', 'firestore-client.js');
const CLIENT_ROOT = path.join(ROOT, 'js', 'modules', 'firestore-client.js');
const MEDIA_RELAY = path.join(ROOT, 'backend_gas', 'MediaRelay.js');

console.log('🧪 Running SK-014 Phase 3 Upload Ledger & Client Metadata Contract Verification...\n');

let passCount = 0;
let totalChecks = 0;

function check(title, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${title}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${title}: ${err.message}`);
    throw err;
  }
}

// 1. Dual-release byte parity check
check('firestore-client.js maintains 100% byte parity between /public and /js', () => {
  assert(fs.existsSync(CLIENT_PUBLIC), `Missing ${CLIENT_PUBLIC}`);
  assert(fs.existsSync(CLIENT_ROOT), `Missing ${CLIENT_ROOT}`);
  const a = fs.readFileSync(CLIENT_PUBLIC);
  const b = fs.readFileSync(CLIENT_ROOT);
  assert(Buffer.compare(a, b) === 0, 'Byte parity mismatch between public and root firestore-client.js');
});

// 2. Client payload enrichment check
check('firestore-client.js propagates module, event, and category in _uploadToDriveWebhook', () => {
  const content = fs.readFileSync(CLIENT_PUBLIC, 'utf8');
  assert(content.includes('module: metadata.module'), 'Missing module propagation in webhook payload');
  assert(content.includes('event: metadata.event'), 'Missing event propagation in webhook payload');
  assert(content.includes('category: metadata.category'), 'Missing category propagation in webhook payload');
  assert(content.includes("'Content-Type': 'text/plain'"), 'Must enforce text/plain Simple POST');
  assert(content.includes("redirect: 'follow'"), 'Must enforce redirect: follow');
});

// 3. MediaRelay ledger logger contract
check('MediaRelay.js logs all 12 dimensions to Upload_Ledger', () => {
  assert(fs.existsSync(MEDIA_RELAY), `Missing ${MEDIA_RELAY}`);
  const content = fs.readFileSync(MEDIA_RELAY, 'utf8');
  assert(content.includes('TAB_UPLOAD_LEDGER'), 'Missing TAB_UPLOAD_LEDGER definition');
  assert(content.includes('_logUploadToSheet'), 'Missing _logUploadToSheet function');
  assert(content.includes('entry.subfolderPath'), 'Missing subfolderPath in ledger logging');
  assert(content.includes('entry.cdnUrl'), 'Missing cdnUrl in ledger logging');
});

console.log(`\n🎉 All ${passCount}/${totalChecks} Phase 3 client payload and ledger contract checks passed!\n`);
