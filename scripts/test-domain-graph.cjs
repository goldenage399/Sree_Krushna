#!/usr/bin/env node
/**
 * Test Suite for Native Domain Entity Graph Generator (SK-019 Phase 1)
 *
 * Verifies:
 * 1. YAML frontmatter extraction (id, event_id, status, hub, title).
 * 2. Regex link extraction matching canonical entity prefixes (EVT, RIT, TRS, etc.).
 * 3. In-memory graph compilation (nodes, inbound/outbound edge mappings).
 * 4. Human-readable markdown report and JSON graph output formatting.
 */
'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('🧪 ========================================================');
console.log('🏛️ SK-019 Test Suite: Native Domain Entity Graph Generator');
console.log('==========================================================\n');

// 1. Module Import
let domainGraph;
try {
  domainGraph = require('./generate-domain-graph.cjs');
} catch (err) {
  console.error('❌ Failed to require generate-domain-graph.cjs:', err.message);
  process.exit(1);
}

const { parseFrontmatter, extractEntityLinks, buildGraph, generateMarkdownReport } = domainGraph;

assert(typeof parseFrontmatter === 'function', 'parseFrontmatter must be an exported function');
assert(typeof extractEntityLinks === 'function', 'extractEntityLinks must be an exported function');
assert(typeof buildGraph === 'function', 'buildGraph must be an exported function');
assert(typeof generateMarkdownReport === 'function', 'generateMarkdownReport must be an exported function');

// 2. Unit Test: parseFrontmatter
console.log('🔍 [1/4] Testing YAML Frontmatter Extraction...');
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
console.log('\n🔍 [2/4] Testing Regex Entity Link Extraction...');
const links = extractEntityLinks(sampleMd);
assert(Array.isArray(links), 'Links must be an array');
assert(links.includes('EVT-001'), 'Must detect EVT-001');
assert(links.includes('SAM-001'), 'Must detect SAM-001');
console.log(`  ✅ Extracted entity links: ${JSON.stringify(links)}`);

// 4. Unit Test: buildGraph on synthetic items
console.log('\n🔍 [3/4] Testing In-Memory Graph Compilation & Edge Symmetry...');
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
console.log('\n🔍 [4/4] Testing Markdown Report Generation...');
const report = generateMarkdownReport(graph);
assert(typeof report === 'string', 'Report must be a markdown string');
assert(report.includes('# 🌐 Canonical Domain Entity Graph Report'), 'Report must include standard header');
assert(report.includes('EVT-001'), 'Report must mention EVT-001');
assert(report.includes('RIT-001'), 'Report must mention RIT-001');
console.log('  ✅ Markdown report formatting verified.');

console.log('\n==========================================================');
console.log('✨ ALL DOMAIN GRAPH TESTS PASSED (0 ERRORS)! ✨');
console.log('==========================================================\n');
