#!/usr/bin/env node
/**
 * test-gas-deployment-wiring.cjs
 * 
 * Verification Gate for SK-014 Phase 1:
 * Sheet Configuration Architecture & Clasp Deployment Pipeline
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const GAS_DIR = path.join(ROOT, 'backend_gas');

console.log('🧪 Running SK-014 Phase 1 Clasp & Schema Wiring Verification...\n');

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

// 1. Check .clasp.json
check('.clasp.json exists and links to Script ID 1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN', () => {
  const claspPath = path.join(GAS_DIR, '.clasp.json');
  assert(fs.existsSync(claspPath), `Missing ${claspPath}`);
  const clasp = JSON.parse(fs.readFileSync(claspPath, 'utf8'));
  assert.strictEqual(clasp.scriptId, '1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN', 'Mismatched scriptId');
});

// 2. Check appsscript.json manifest
check('backend_gas/appsscript.json exists and declares V8 runtime', () => {
  const manifestPath = path.join(GAS_DIR, 'appsscript.json');
  assert(fs.existsSync(manifestPath), `Missing ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.strictEqual(manifest.runtimeVersion, 'V8', 'Manifest must declare V8 runtimeVersion');
  assert(manifest.webapp, 'Manifest must declare webapp configuration');
});

// 3. Check deploy-gas-relay.cjs
check('scripts/deploy-gas-relay.cjs exists and passes syntax check', () => {
  const deployerPath = path.join(ROOT, 'scripts', 'deploy-gas-relay.cjs');
  assert(fs.existsSync(deployerPath), `Missing ${deployerPath}`);
  execSync(`node -c "${deployerPath}"`);
});

// 4. Check backend_gas/SHEET_SCHEMA_SPEC.md
check('backend_gas/SHEET_SCHEMA_SPEC.md defines Config_Settings, Config_Routing, and Upload_Ledger with spreadsheet ID 1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc', () => {
  const specPath = path.join(GAS_DIR, 'SHEET_SCHEMA_SPEC.md');
  assert(fs.existsSync(specPath), `Missing ${specPath}`);
  const content = fs.readFileSync(specPath, 'utf8');
  assert(content.includes('1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc'), 'Spec missing spreadsheet ID');
  assert(content.includes('Config_Settings'), 'Spec missing Config_Settings');
  assert(content.includes('Config_Routing'), 'Spec missing Config_Routing');
  assert(content.includes('Upload_Ledger'), 'Spec missing Upload_Ledger');
  assert(content.includes('SubfolderPath'), 'Spec missing SubfolderPath');
  assert(content.includes('ThumbnailCdnUrl'), 'Spec missing ThumbnailCdnUrl');
});

console.log(`\n🎉 All ${passCount}/${totalChecks} Phase 1 deployment and schema checks passed!\n`);
