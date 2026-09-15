#!/usr/bin/env node
/**
 * Headless Firestore Cockpit Inspector — Adapted from Task-Dashboard `db-inspect-fleet.md`
 * Validates:
 *   1. Negative Control: Unauthenticated GET returns HTTP 403 (Proves rules enforcement)
 *   2. Positive Control: Authenticated GET returns HTTP 200 (Proves allow-listed access)
 *   3. Document Occupancy: Verifies master_decisions, topics_marquee, topics_rayagada
 * Zero external npm dependencies. Pure Node.js built-ins.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const PROJECT_ID = 'sree-krushna-forever';
const DOCS = ['master_decisions', 'topics_marquee', 'topics_rayagada'];

async function getAccessToken() {
  const cfgPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (!fs.existsSync(cfgPath)) {
    throw new Error(`Firebase credentials not found at ${cfgPath}.`);
  }
  let cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  let token = cfg.tokens && cfg.tokens.access_token;
  if (cfg.tokens && (!cfg.tokens.expires_at || Date.now() > cfg.tokens.expires_at - 60000)) {
    try {
      const fbCmd = process.platform === 'win32' ? 'firebase.cmd' : 'firebase';
      require('child_process').execSync(`${fbCmd} projects:list`, { stdio: 'ignore' });
      cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      token = cfg.tokens && cfg.tokens.access_token;
    } catch (e) {
      console.warn('  ⚠️ Warning: Auto-refresh via Firebase CLI failed:', e.message);
    }
  }
  return token;
}

async function runAudit() {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║        FIRESTORE COCKPIT CLOUD OCCUPANCY & RULES ENFORCEMENT AUDIT         ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

  let passed = true;

  // 1. Negative Control (Unauthenticated Read)
  console.log('▶ [1/3] Negative Control Audit (Unauthenticated Access)...');
  const testUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/cockpit_content/master_decisions`;
  const unauthRes = await fetch(testUrl);
  if (unauthRes.status === 403 || unauthRes.status === 401) {
    console.log(`  ✓ [PASS] Unauthenticated request rejected with HTTP ${unauthRes.status} (Rules Enforced)`);
  } else {
    console.error(`  ❌ [FAIL] Expected HTTP 401/403, received HTTP ${unauthRes.status}`);
    passed = false;
  }

  // 2. Token Retrieval
  console.log('\n▶ [2/3] Authenticating via Firebase CLI Credentials...');
  const token = await getAccessToken();
  if (token) {
    console.log('  ✓ [PASS] Valid OAuth Bearer token resolved from configstore');
  } else {
    console.error('  ❌ [FAIL] Unable to resolve valid OAuth access token');
    process.exit(1);
  }

  // 3. Document Occupancy & Metadata Verification
  console.log('\n▶ [3/3] Live Cloud Document Occupancy & Metadata Verification...');
  for (const docId of DOCS) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/cockpit_content/${docId}`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.status === 200) {
      const data = await res.json();
      const count = data.fields && data.fields.payload && data.fields.payload.arrayValue && data.fields.payload.arrayValue.values ? data.fields.payload.arrayValue.values.length : 0;
      const updatedBy = data.fields && data.fields.updatedBy ? data.fields.updatedBy.stringValue : 'unknown';
      const updatedAt = data.fields && data.fields.updatedAt ? data.fields.updatedAt.timestampValue : 'unknown';
      console.log(`  ✓ [PASS] ${docId.padEnd(18)} → HTTP 200 | Items: ${String(count).padStart(2)} | UpdatedBy: ${updatedBy} | At: ${updatedAt}`);
    } else {
      console.error(`  ❌ [FAIL] ${docId} returned HTTP ${res.status}`);
      passed = false;
    }
  }

  console.log('\n' + '═'.repeat(80));
  if (passed) {
    console.log('🎉 FIRESTORE COCKPIT CLOUD AUDIT: 100% GREEN (RULES ENFORCED & DATA OCCUPIED)');
    process.exit(0);
  } else {
    console.error('🚨 FIRESTORE COCKPIT CLOUD AUDIT: FAILED');
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('❌ Inspector fatal error:', err.message);
  process.exit(1);
});
