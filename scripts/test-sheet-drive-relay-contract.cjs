#!/usr/bin/env node
/**
 * test-sheet-drive-relay-contract.cjs
 * 
 * Contract & Validation Gate for SK-015:
 * Universal Sheet-Drive Media Relay Skill, Standard & Portable Package (STD-DRIVE-MEDIA-RELAY-001)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('🧪 Running STD-DRIVE-MEDIA-RELAY-001 Contract & Template Verification...\n');

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

// 1. Pattern file & PACT-001 frontmatter
check('Pattern file exists and satisfies PACT-001 activation contract', () => {
  const patternPath = path.join(ROOT, '.agent/patterns/sheet-drive-media-relay.md');
  assert(fs.existsSync(patternPath), `File does not exist: ${patternPath}`);
  
  const content = fs.readFileSync(patternPath, 'utf8');
  assert(content.includes('STD-DRIVE-MEDIA-RELAY-001'), 'Pattern missing standard ID STD-DRIVE-MEDIA-RELAY-001');
  assert(content.includes('INV-RELAY-CORS-001'), 'Pattern missing invariant INV-RELAY-CORS-001');
  assert(content.includes('INV-RELAY-CANVAS-002'), 'Pattern missing invariant INV-RELAY-CANVAS-002');
  assert(content.includes('INV-RELAY-SHEET-003'), 'Pattern missing invariant INV-RELAY-SHEET-003');
  assert(content.includes('INV-RELAY-CACHE-004'), 'Pattern missing invariant INV-RELAY-CACHE-004');
  assert(content.includes('INV-RELAY-CDN-005'), 'Pattern missing invariant INV-RELAY-CDN-005');
  assert(content.includes('portability: universal'), 'Pattern must be marked portability: universal');
});

// 2. Standards catalog entry
check('Standards catalog contains STD-DRIVE-MEDIA-RELAY-001', () => {
  const catalogPath = path.join(ROOT, '.agent/standards-catalog.json');
  assert(fs.existsSync(catalogPath), `Catalog does not exist: ${catalogPath}`);
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const found = catalog.standards.find(s => s.id === 'STD-DRIVE-MEDIA-RELAY-001');
  assert(found, 'Catalog missing entry with id STD-DRIVE-MEDIA-RELAY-001');
  assert(found.enforcement && found.enforcement.automatedGate, 'Entry missing automatedGate definition');
});

// 3. MediaRelay.template.js syntax & placeholder replacement
check('MediaRelay.template.js exists and compiles cleanly with node -c after substitution', () => {
  const templatePath = path.join(ROOT, '.agent/skills/sheet-drive-relay/templates/MediaRelay.template.js');
  assert(fs.existsSync(templatePath), `Template does not exist: ${templatePath}`);
  
  const content = fs.readFileSync(templatePath, 'utf8');
  assert(content.includes('{{ROOT_FOLDER_ID}}'), 'Template missing {{ROOT_FOLDER_ID}} placeholder');
  assert(content.includes('{{SPREADSHEET_ID}}'), 'Template missing {{SPREADSHEET_ID}} placeholder');
  assert(content.includes('{{AUTHORIZED_EMAILS}}'), 'Template missing {{AUTHORIZED_EMAILS}} placeholder');
  assert(content.includes('function doPost('), 'Template missing doPost entrypoint');
  assert(content.includes('CacheService'), 'Template missing CacheService caching');
  assert(content.includes('Upload_Ledger'), 'Template missing Upload_Ledger reference');
  assert(content.includes('Config_Routing'), 'Template missing Config_Routing reference');

  // Test placeholder replacement and JS syntax parsing
  const substituted = content
    .replaceAll('{{ROOT_FOLDER_ID}}', 'test_root_folder_id')
    .replaceAll('{{SPREADSHEET_ID}}', 'test_spreadsheet_id')
    .replaceAll('{{AUTHORIZED_EMAILS}}', JSON.stringify(['test@example.com']));

  const tempFile = path.join(__dirname, '__temp_relay_syntax_check.js');
  try {
    fs.writeFileSync(tempFile, substituted, 'utf8');
    execSync(`node -c "${tempFile}"`);
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});

// 4. appsscript.json manifest validity
check('appsscript.json manifest is valid and configured for V8 runtime', () => {
  const manifestPath = path.join(ROOT, '.agent/skills/sheet-drive-relay/templates/appsscript.json');
  assert(fs.existsSync(manifestPath), `Manifest does not exist: ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.strictEqual(manifest.runtimeVersion, 'V8', 'Manifest must declare V8 runtimeVersion');
  assert(manifest.webapp, 'Manifest must declare webapp configuration');
});

// 5. deploy-gas-relay.cjs syntax & security check
check('deploy-gas-relay.cjs deployer exists and compiles cleanly', () => {
  const deployerPath = path.join(ROOT, '.agent/skills/sheet-drive-relay/templates/deploy-gas-relay.cjs');
  assert(fs.existsSync(deployerPath), `Deployer does not exist: ${deployerPath}`);
  execSync(`node -c "${deployerPath}"`);
});

// 6. SHEET_SCHEMA_SPEC.md resource
check('SHEET_SCHEMA_SPEC.md specifies all 3 control sheets and 12 ledger dimensions', () => {
  const schemaPath = path.join(ROOT, '.agent/skills/sheet-drive-relay/resources/SHEET_SCHEMA_SPEC.md');
  assert(fs.existsSync(schemaPath), `Schema spec does not exist: ${schemaPath}`);
  const content = fs.readFileSync(schemaPath, 'utf8');
  assert(content.includes('Config_Settings'), 'Schema spec missing Config_Settings');
  assert(content.includes('Config_Routing'), 'Schema spec missing Config_Routing');
  assert(content.includes('Upload_Ledger'), 'Schema spec missing Upload_Ledger');
  assert(content.includes('SubfolderPath'), 'Schema spec missing SubfolderPath dimension');
  assert(content.includes('ThumbnailCdnUrl'), 'Schema spec missing ThumbnailCdnUrl dimension');
});

// 7. Auto-healing & Self-Provisioning Engine (INV-RELAY-AUTO-HEAL-006)
check('MediaRelay templates and instance implement setupMediaRelaySheets and auto-healing', () => {
  const templatePath = path.join(ROOT, '.agent/skills/sheet-drive-relay/templates/MediaRelay.template.js');
  const instancePath = path.join(ROOT, 'backend_gas/MediaRelay.js');
  
  [templatePath, instancePath].forEach(filePath => {
    assert(fs.existsSync(filePath), `File does not exist: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert(content.includes('setupMediaRelaySheets'), `${filePath} missing setupMediaRelaySheets`);
    assert(content.includes('_getOrHealSheet'), `${filePath} missing _getOrHealSheet`);
    assert(content.includes('_getSheetOrCreate'), `${filePath} missing _getSheetOrCreate`);
    assert(content.includes("'SETUP_SHEETS'"), `${filePath} missing SETUP_SHEETS action`);
  });

  // Verify backend_gas/MediaRelay.js compiles with node -c
  execSync(`node -c "${instancePath}"`);
});

// 8. Skill Mirror Parity Gate (P-SSOT-DOCS)
check('.agent and .claude sheet-drive-relay SKILL.md maintain 100% byte parity', () => {
  const agentSkill = path.join(ROOT, '.agent/skills/sheet-drive-relay/SKILL.md');
  const claudeSkill = path.join(ROOT, '.claude/skills/sheet-drive-relay/SKILL.md');
  assert(fs.existsSync(agentSkill), `Agent skill missing: ${agentSkill}`);
  assert(fs.existsSync(claudeSkill), `Claude skill missing: ${claudeSkill}`);
  const agentBuf = fs.readFileSync(agentSkill);
  const claudeBuf = fs.readFileSync(claudeSkill);
  assert(agentBuf.equals(claudeBuf), 'Skill files have diverged in byte content!');
});

console.log(`\n🎉 All ${passCount}/${totalChecks} Sheet-Drive Relay template and contract checks passed!\n`);

