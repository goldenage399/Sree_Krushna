#!/usr/bin/env node
/**
 * Test Suite for Universal Domain Entity Graph Generator (SK-019 Phase 3)
 *
 * Verifies:
 * 1. YAML frontmatter extraction (id, event_id, status, hub, title).
 * 2. Regex link extraction matching canonical entity prefixes (EVT, RIT, TRS, etc.).
 * 3. In-memory graph compilation (nodes, inbound/outbound edge mappings).
 * 4. Human-readable markdown report and JSON graph output formatting.
 * 5. Loading declarative configuration from .agent/domain-graph-config.json.
 * 6. Custom prefix matching and custom configuration file override.
 * 7. Graceful fallback when configuration file is absent.
 */
'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('🧪 ========================================================');
console.log('🏛️ SK-019 Test Suite: Universal Domain Entity Graph Engine');
console.log('==========================================================\n');

// 1. Module Import
let domainGraph;
try {
  domainGraph = require('./generate-domain-graph.cjs');
} catch (err) {
  console.error('❌ Failed to require generate-domain-graph.cjs:', err.message);
  process.exit(1);
}

const {
  loadConfig,
  parseFrontmatter,
  extractEntityLinks,
  buildGraph,
  generateMarkdownReport
} = domainGraph;

assert(typeof loadConfig === 'function', 'loadConfig must be an exported function');
assert(typeof parseFrontmatter === 'function', 'parseFrontmatter must be an exported function');
assert(typeof extractEntityLinks === 'function', 'extractEntityLinks must be an exported function');
assert(typeof buildGraph === 'function', 'buildGraph must be an exported function');
assert(typeof generateMarkdownReport === 'function', 'generateMarkdownReport must be an exported function');

// 2. Unit Test: parseFrontmatter
console.log('🔍 [1/7] Testing YAML Frontmatter Extraction...');
const sampleMd = `---
hub: 02_RITUALS_CULTURE/HUB.md
id: RIT-001
name: "Nirbandha Ceremony"
event_id: "EVT-001"
status: "Confirmed"
---
# Content here
Some text referencing [EVT-001](file:///path) and [SAM-001](file:///path)
`;

const fm = parseFrontmatter(sampleMd);
assert.strictEqual(fm.id, 'RIT-001', 'Should extract id');
assert.strictEqual(fm.event_id, 'EVT-001', 'Should extract event_id');
assert.strictEqual(fm.status, 'Confirmed', 'Should extract status');
assert.strictEqual(fm.name, 'Nirbandha Ceremony', 'Should extract name/title');
console.log('  ✅ Frontmatter extraction parsed attributes correctly.');

// 3. Unit Test: extractEntityLinks
console.log('\n🔍 [2/7] Testing Regex Entity Link Extraction...');
const links = extractEntityLinks(sampleMd);
assert(Array.isArray(links), 'Links must be an array');
assert(links.includes('EVT-001'), 'Must detect EVT-001');
assert(links.includes('SAM-001'), 'Must detect SAM-001');
console.log(`  ✅ Extracted entity links: ${JSON.stringify(links)}`);

// 4. Unit Test: buildGraph on synthetic items
console.log('\n🔍 [3/7] Testing In-Memory Graph Compilation & Edge Symmetry...');
const mockFiles = [
  {
    filePath: '01_TIMELINE_EVENTS/pre_wedding/EVT-001.md',
    content: `---
id: EVT-001
title: "Nirbandha Event"
---
Links to [RIT-001](...)
`
  },
  {
    filePath: '02_RITUALS_CULTURE/specs/RIT-001.md',
    content: sampleMd
  },
  {
    filePath: '06_FINANCE_COMMERCIALS/ledger/PAY-001.md',
    content: `---
id: PAY-001
amount: 50000
---
Paid for [EVT-001](...)
`
  }
];

const graph = buildGraph(mockFiles);
assert(graph.nodes['EVT-001'], 'Graph must contain EVT-001 node');
assert(graph.nodes['RIT-001'], 'Graph must contain RIT-001 node');
assert(graph.nodes['PAY-001'], 'Graph must contain PAY-001 node');

// Verify edges
assert(graph.nodes['EVT-001'].outbound.includes('RIT-001'), 'EVT-001 must have outbound to RIT-001');
assert(graph.nodes['RIT-001'].inbound.includes('EVT-001'), 'RIT-001 must have inbound from EVT-001');
assert(graph.nodes['PAY-001'].outbound.includes('EVT-001'), 'PAY-001 must have outbound to EVT-001');
assert(graph.nodes['EVT-001'].inbound.includes('PAY-001'), 'EVT-001 must have inbound from PAY-001');
console.log('  ✅ In-memory node compilation and edge symmetry verified.');

// 5. Unit Test: generateMarkdownReport
console.log('\n🔍 [4/7] Testing Markdown Report Generation...');
const report = generateMarkdownReport(graph, { repoName: 'Sree_Krushna' });
assert(typeof report === 'string', 'Report must be a markdown string');
assert(report.includes('# 🌐 Canonical Domain Entity Graph Report — Sree_Krushna'), 'Report must include standard header with repo name');
assert(report.includes('EVT-001'), 'Report must mention EVT-001');
assert(report.includes('RIT-001'), 'Report must mention RIT-001');
console.log('  ✅ Markdown report formatting verified.');

// 6. Unit Test: loadConfig from local repo
console.log('\n🔍 [5/7] Testing Declarative Config Loading (.agent/domain-graph-config.json)...');
const repoRoot = path.resolve(__dirname, '..');
const cfg = loadConfig(repoRoot);
assert.strictEqual(cfg.repoName, 'Sree_Krushna', 'Must load repoName');
assert(Array.isArray(cfg.canonicalPrefixes), 'Must load canonicalPrefixes array');
assert(cfg.canonicalPrefixes.includes('OBL'), 'Must include OBL in canonicalPrefixes');
assert(cfg.canonicalPrefixes.includes('EXC'), 'Must include EXC in canonicalPrefixes');
assert(Array.isArray(cfg.targetDirectories), 'Must load targetDirectories');
console.log(`  ✅ Loaded declarative config for ${cfg.repoName} with ${cfg.canonicalPrefixes.length} prefixes.`);

// 7. Unit Test: Custom Config Override & Custom Prefixes
console.log('\n🔍 [6/7] Testing Custom Prefix & Link Resolution...');
const customPrefixes = ['TASK', 'MOD', 'FEAT'];
const customText = 'Working on TASK-101 which depends on MOD-202 and links to FEAT-303.';
const customLinks = extractEntityLinks(customText, customPrefixes);
assert.deepStrictEqual(customLinks.sort(), ['FEAT-303', 'MOD-202', 'TASK-101'].sort(), 'Must detect custom prefixes');
console.log(`  ✅ Custom prefixes extracted successfully: ${JSON.stringify(customLinks)}`);

// 8. Unit Test: Graceful Fallback on Missing Config
console.log('\n🔍 [7/7] Testing Graceful Fallback When Config is Absent...');
const fallbackCfg = loadConfig('/non/existent/path/that/does/not/exist');
assert(fallbackCfg, 'Must return fallback configuration object');
assert(Array.isArray(fallbackCfg.canonicalPrefixes), 'Fallback must supply canonical prefixes');
assert(fallbackCfg.outputDir === 'graphify-out', 'Fallback must default outputDir to graphify-out');
console.log('  ✅ Graceful fallback verified.');

console.log('\n==========================================================');
console.log('✨ ALL 7 DOMAIN GRAPH TESTS PASSED (0 ERRORS)! ✨');
console.log('==========================================================\n');
