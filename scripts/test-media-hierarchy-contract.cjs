#!/usr/bin/env node
/**
 * test-media-hierarchy-contract.cjs
 * 
 * Validation Gate (VG-2) for SK-017:
 * Multi-Module Google Drive Hierarchy Contract & Taxonomy Validator
 * Standard: STD-MEDIA-HIERARCHY-001 / Ruling: AC-DEC-2026-057
 */

'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('🧪 Running STD-MEDIA-HIERARCHY-001 Contract & Taxonomy Verification...\n');

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

// 1. SSOT Specification
check('SSOT specification SPEC-PROC-MEDIA-HIERARCHY-001.md exists and declares standard', () => {
  const specPath = path.join(ROOT, 'docs/references/SPEC-PROC-MEDIA-HIERARCHY-001.md');
  assert(fs.existsSync(specPath), `Spec file missing: ${specPath}`);
  const content = fs.readFileSync(specPath, 'utf8');
  assert(content.includes('STD-MEDIA-HIERARCHY-001'), 'Spec missing STD-MEDIA-HIERARCHY-001');
  assert(content.includes('INV-MODULE-UPLOAD-INTAKE-001'), 'Spec missing INV-MODULE-UPLOAD-INTAKE-001');
  assert(content.includes('AC-DEC-2026-057'), 'Spec missing council reference AC-DEC-2026-057');
});

// 2. Machine-Readable Taxonomy Manifest
check('media-routing-taxonomy.json exists and is valid schema', () => {
  const manifestPath = path.join(ROOT, 'backend_gas/media-routing-taxonomy.json');
  assert(fs.existsSync(manifestPath), `Manifest missing: ${manifestPath}`);
  const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  assert.strictEqual(data.standard, 'STD-MEDIA-HIERARCHY-001', 'Manifest standard mismatch');
  assert(Array.isArray(data.taxonomies), 'Manifest must declare taxonomies array');
  assert(data.taxonomies.length >= 20, `Expected at least 20 taxonomy rules, found ${data.taxonomies.length}`);

  // Check required modules
  const requiredModules = ['Shopping', 'Decorator_Cockpit', 'Liturgy', 'Finance', 'Operations'];
  const presentModules = new Set(data.taxonomies.map(t => t.module));
  requiredModules.forEach(mod => {
    assert(presentModules.has(mod), `Missing required module in taxonomy: ${mod}`);
  });

  // Check uniqueness and path safety
  const seenTuples = new Set();
  data.taxonomies.forEach((t, idx) => {
    assert(t.module && t.event && t.category && t.subfolder_path, `Taxonomy row ${idx} missing required fields`);
    const tupleKey = `${t.module}::${t.event}::${t.category}`;
    assert(!seenTuples.has(tupleKey), `Duplicate taxonomy tuple: ${tupleKey}`);
    seenTuples.add(tupleKey);

    assert(!t.subfolder_path.startsWith('/'), `Subfolder path should not have leading slash: ${t.subfolder_path}`);
    assert(!t.subfolder_path.includes('\\'), `Subfolder path should use forward slashes: ${t.subfolder_path}`);
  });
});

// 3. Client Controller Parameterization Verification
check('shopping_src/scripts/controller.js passes module, event, and category to fsUploadLookPhoto', () => {
  const controllerPath = path.join(ROOT, 'shopping_src/scripts/controller.js');
  const code = fs.readFileSync(controllerPath, 'utf8');
  assert(code.includes("module: 'Shopping'"), 'Controller must explicitly pass module: Shopping');
  assert(code.includes('event: resolvedEvent'), 'Controller must pass resolvedEvent');
  assert(code.includes('category: resolvedCategory'), 'Controller must pass resolvedCategory');
});

console.log(`\n🎉 All ${passCount}/${totalChecks} Media Hierarchy contract checks passed!\n`);
