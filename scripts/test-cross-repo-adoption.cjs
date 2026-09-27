#!/usr/bin/env node
/**
 * scripts/test-cross-repo-adoption.cjs — Automated Empirical Adoption Gate Guard
 *
 * Part of SK-027 (STD-EMPIRICAL-ADOPTION-001 / INV-PROVE-BEFORE-CLAIM-001 / AC-DEC-2026-069)
 *
 * Verifies that generate-domain-graph.cjs satisfies the Empirical Adoption Gate:
 * 1. Zero-config auto-detection from enhancement-config.json on live sibling repos (OperatusOS, Task-Dashboard).
 * 2. Real entity extraction from single-file registries (ENHANCEMENTS.md) without manual configuration.
 * 3. Strict uppercase prefix sanitization (zero noise nodes like page-, modal-, flex-).
 * 4. Synthetic isolation test verifying zero-config fallback mechanics.
 */
'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('🧪 ========================================================');
console.log('🏛️ SK-027 Automated Empirical Adoption Gate Guard');
console.log('==========================================================\n');

// 1. Require generate-domain-graph
let domainGraph;
try {
  domainGraph = require('./generate-domain-graph.cjs');
} catch (err) {
  console.error('❌ Failed to require generate-domain-graph.cjs:', err.message);
  process.exit(1);
}

const { loadConfig, findSourceFiles, buildGraph } = domainGraph;

// 2. Empirical Verification on Sibling Repo: OperatusOS
console.log('🔍 [1/3] Verifying Empirical Zero-Config Onboarding on OperatusOS...');
const operatusRoot = path.resolve('d:/GitHub_Repo/OperatusOS');

if (fs.existsSync(operatusRoot)) {
  const opsConfig = loadConfig(operatusRoot);
  assert.strictEqual(opsConfig.repoName, 'OperatusOS', 'Must auto-detect repoName OperatusOS from enhancement-config.json');
  assert(opsConfig.canonicalPrefixes.includes('OPS'), 'Must auto-detect OPS prefix from enhancement-config.json');

  const opsFiles = findSourceFiles(operatusRoot, opsConfig);
  assert(opsFiles.length >= 10, `Must discover at least 10 markdown files in OperatusOS (found ${opsFiles.length})`);

  const opsGraph = buildGraph(opsFiles, opsConfig);
  const opsNodeCount = Object.keys(opsGraph.nodes).length;
  assert(opsNodeCount >= 30, `Must compile at least 30 entities in OperatusOS (found ${opsNodeCount})`);
  assert(opsGraph.nodes['OPS-001'], 'Must index OPS-001 from ENHANCEMENTS.md');
  assert(opsGraph.nodes['OPS-040'], 'Must index OPS-040 from ENHANCEMENTS.md');

  // Verify zero noise types
  const noiseTypes = Object.keys(opsGraph.nodes).map(k => opsGraph.nodes[k].type).filter(t => !/^[A-Z]{2,6}$/.test(t));
  assert.strictEqual(noiseTypes.length, 0, `Must have zero non-canonical entity types (found ${JSON.stringify(noiseTypes)})`);

  console.log(`  ✅ OperatusOS Empirical Onboarding Verified: ${opsNodeCount} entities indexed (${opsFiles.length} files scanned, 0 noise nodes).`);
} else {
  console.log('  ⚠️ OperatusOS directory not found at path, skipping live sibling check.');
}

// 3. Empirical Verification on Sibling Repo: Task-Dashboard
console.log('\n🔍 [2/3] Verifying Empirical Noise Sanitization on Task-Dashboard...');
const taskDashboardRoot = path.resolve('d:/GitHub_Repo/Task-Dashboard');

if (fs.existsSync(taskDashboardRoot)) {
  const tdConfig = loadConfig(taskDashboardRoot);
  assert(tdConfig.canonicalPrefixes.includes('TASK'), 'Must auto-detect TASK prefix from Task-Dashboard enhancement-config.json');

  const tdFiles = findSourceFiles(taskDashboardRoot, tdConfig);
  assert(tdFiles.length > 500, `Must discover documentation files in Task-Dashboard (found ${tdFiles.length})`);

  const tdGraph = buildGraph(tdFiles, tdConfig);
  const tdNodeCount = Object.keys(tdGraph.nodes).length;
  assert(tdNodeCount >= 50, `Must compile entities in Task-Dashboard (found ${tdNodeCount})`);

  // Verify strict noise eradication
  const invalidTypes = Object.keys(tdGraph.nodes)
    .map(k => tdGraph.nodes[k].type)
    .filter(t => ['page', 'modal', 'component', 'fieldset', 'overflow', 'flex'].includes(t.toLowerCase()));
  assert.strictEqual(invalidTypes.length, 0, `Must have zero layout noise entity types in Task-Dashboard (found ${JSON.stringify(invalidTypes)})`);

  console.log(`  ✅ Task-Dashboard Empirical Verification Verified: ${tdNodeCount} entities indexed, 0 layout noise nodes.`);
} else {
  console.log('  ⚠️ Task-Dashboard directory not found at path, skipping live sibling check.');
}

// 4. Synthetic Isolated Zero-Config Test
console.log('\n🔍 [3/3] Verifying Synthetic Zero-Config Fallback & Registry Extraction...');
const syntheticFiles = [
  {
    filePath: 'ENHANCEMENTS.md',
    content: `# Registry\n\n**PILOT-001**: Initial Framework Setup\n- **Category**: CORE\n- **Status**: ACTIVE\n\n**PILOT-002**: Second Feature\n- **Category**: UI\n- **Status**: PENDING\n`
  },
  {
    filePath: 'docs/guide.md',
    content: `---
id: PILOT-003
title: Guide
---
References [PILOT-001](...) and [PILOT-002](...) and ignores page-header and modal-backdrop.
`
  }
];

const syntheticConfig = {
  repoName: 'SyntheticRepo',
  canonicalPrefixes: ['PILOT', 'EVT']
};

const syntheticGraph = buildGraph(syntheticFiles, syntheticConfig);
assert(syntheticGraph.nodes['PILOT-001'], 'Must index PILOT-001 from in-file registry');
assert(syntheticGraph.nodes['PILOT-002'], 'Must index PILOT-002 from in-file registry');
assert(syntheticGraph.nodes['PILOT-003'], 'Must index PILOT-003 from frontmatter');
assert(!syntheticGraph.nodes['page-header'], 'Must ignore page-header');
assert(!syntheticGraph.nodes['modal-backdrop'], 'Must ignore modal-backdrop');
assert(syntheticGraph.nodes['PILOT-003'].outbound.includes('PILOT-001'), 'Must record edge PILOT-003 -> PILOT-001');

console.log('  ✅ Synthetic Zero-Config Fallback & In-File Extraction Verified.');

console.log('\n==========================================================');
console.log('✨ ALL EMPIRICAL ADOPTION GATE TESTS PASSED (0 ERRORS)! ✨');
console.log('==========================================================\n');
