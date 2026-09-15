#!/usr/bin/env node
/**
 * Headless Cockpit Firestore Seeder — DLRS Pillar 2 (AC-DEC-2026-012)
 * Seeds master_decisions.json, topics_marquee.json, topics_rayagada.json
 * into Firestore cockpit_content/{docId} using cached Firebase CLI OAuth credentials.
 * Zero external npm dependencies. Pure Node.js built-ins.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const PROJECT_ID = 'sree-krushna-forever';
const DATA_DIR = path.resolve(__dirname, '..', 'cockpit_src', 'data');

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function getAccessToken() {
  const cfgPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (!fs.existsSync(cfgPath)) {
    throw new Error(`Firebase credentials not found at ${cfgPath}. Please run 'firebase login' first.`);
  }

  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  if (!cfg.tokens || (!cfg.tokens.access_token && !cfg.tokens.refresh_token)) {
    throw new Error('No OAuth tokens found in firebase-tools.json. Please run `firebase login`.');
  }

  const userEmail = (cfg.user && cfg.user.email) || 'goldenage399@gmail.com';
  let token = cfg.tokens.access_token;

  if (cfg.tokens.expires_at && Date.now() > cfg.tokens.expires_at - 60000) {
    console.log('🔄 Access token expired. Refreshing using cached refresh_token...');
    const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho85qd6.apps.googleusercontent.com',
        refresh_token: cfg.tokens.refresh_token,
        grant_type: 'refresh_token'
      })
    });
    const refreshData = await refreshRes.json();
    if (!refreshData.access_token) {
      throw new Error(`OAuth token refresh failed: ${JSON.stringify(refreshData)}`);
    }
    token = refreshData.access_token;
    cfg.tokens.access_token = token;
    if (refreshData.expires_in) {
      cfg.tokens.expires_at = Date.now() + (refreshData.expires_in * 1000);
    }
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
    console.log('✅ Access token refreshed and persisted to configstore.');
  }

  return { token, userEmail };
}

async function seedDocument(docId, jsonFilename, token, userEmail) {
  const filePath = path.join(DATA_DIR, jsonFilename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing source data file: ${filePath}`);
  }

  const rawJson = fs.readFileSync(filePath, 'utf8');
  const payload = JSON.parse(rawJson);
  const itemCount = Array.isArray(payload) ? payload.length : Object.keys(payload).length;

  console.log(`📤 Seeding ${docId} (${itemCount} items, ${rawJson.length} bytes)...`);

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/cockpit_content/${docId}`;
  const docBody = {
    fields: {
      payload: toFirestoreValue(payload),
      updatedBy: { stringValue: userEmail },
      updatedAt: { timestampValue: new Date().toISOString() }
    }
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(docBody)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status} seeding ${docId}: ${errText}`);
  }

  console.log(`   ✓ ${docId} successfully written to Firestore.`);
}

async function main() {
  console.log('🔒 Starting Headless Cockpit Firestore Seeder (DLRS Pillar 2)...');
  const startTime = Date.now();

  const { token, userEmail } = await getAccessToken();
  console.log(`🔑 Authenticated as allow-listed SuperAdmin: ${userEmail}`);

  await seedDocument('master_decisions', 'master_decisions.json', token, userEmail);
  await seedDocument('topics_marquee', 'topics_marquee.json', token, userEmail);
  await seedDocument('topics_rayagada', 'topics_rayagada.json', token, userEmail);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`🎉 Successfully seeded 3 cockpit documents in ${duration}s!`);
}

main().catch(err => {
  console.error('❌ Seeder error:', err.message);
  process.exit(1);
});
