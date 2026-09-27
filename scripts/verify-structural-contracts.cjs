#!/usr/bin/env node
/**
 * verify-structural-contracts.cjs — SDCA Structural Hierarchy Contract Validator
 *
 * SCOPE: Gap Variant B — validates that required IDs exist in compiled artifacts
 * AND that declared ancestor-descendant relationships hold in the assembled HTML.
 * Uses the same stack-based tag-map algorithm proven against real artifacts (2026-09-28).
 *
 * Does NOT validate runtime DOM state after lazy fragment mounting (Gap Variant C →
 * tests/sdca-structural.spec.mjs / SK-028 Phase 3).
 *
 * See: STD-STRUCTURAL-CONTRACT-001 / SK-028 / AC-DEC-2026-070
 *
 * Usage: node scripts/verify-structural-contracts.cjs
 * Exit:  0 = all contracts pass, 1 = one or more contracts failed
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let customDir = null;
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--dir=')) {
    customDir = args[i].split('=')[1];
  } else if (args[i] === '--dir' && args[i + 1]) {
    customDir = args[i + 1];
    i++;
  }
}

const rootDir       = customDir ? path.resolve(customDir) : path.join(__dirname, '..');
const contractsDir  = path.join(rootDir, '.structural-contracts');


let passes   = 0;
let failures = 0;

function pass(msg)  { console.log(`  ✓ [PASS] ${msg}`); passes++; }
function fail(msg)  { console.error(`  ✗ [FAIL] ${msg}`); failures++; }

// ---------------------------------------------------------------------------
// Stack-based ID → ancestor-chain builder (zero external dependencies)
// Proven against 489KB shopping-registry.html on 2026-09-28
// ---------------------------------------------------------------------------
const VOID = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr'
]);

function buildAncestorMap(html) {
  const tagRe = /<(\/?[a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
  const idRe  = /id=["']([^"']+)["']/;
  const stack = [];
  const map   = {}; // id -> [ancestor ids, outermost first]
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const raw = m[1], attrs = m[2] || '';
    const isClose = raw.startsWith('/');
    const tag = (isClose ? raw.slice(1) : raw).toLowerCase();
    if (isClose) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) { stack.splice(i); break; }
      }
    } else if (!VOID.has(tag)) {
      const id = (idRe.exec(attrs) || [])[1] || null;
      if (id) map[id] = stack.map(s => s.id).filter(Boolean);
      stack.push({ tag, id });
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Validate one contract entry against a loaded ancestor map
// ---------------------------------------------------------------------------
function validateEntry(entry, map, artifactRel) {
  const { id, must_be_descendant_of, must_be_at_root } = entry;

  if (!(id in map)) {
    fail(`${artifactRel}: #${id} not found`);
    return;
  }

  if (must_be_at_root) {
    if (map[id].length === 0) {
      pass(`${artifactRel}: #${id} is at root level ✓`);
    } else {
      fail(`${artifactRel}: #${id} expected at root but has ancestors [${map[id].join(' > ')}]`);
    }
  }

  if (must_be_descendant_of) {
    if (map[id].includes(must_be_descendant_of)) {
      pass(`${artifactRel}: #${id} is descendant of #${must_be_descendant_of} ✓`);
    } else {
      fail(
        `${artifactRel}: #${id} is NOT descendant of #${must_be_descendant_of} — ` +
        `actual ancestors: [${map[id].join(' > ') || 'none'}]`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Main — load all contracts, load artifacts, validate
// ---------------------------------------------------------------------------
if (!fs.existsSync(contractsDir)) {
  console.log('No .structural-contracts/ directory found — skipping (LOCAL_ONLY / no SDCA modules in this repo).');
  process.exit(0);
}

const contractFiles = fs.readdirSync(contractsDir).filter(f => f.endsWith('.json'));
if (contractFiles.length === 0) {
  console.log('No contract files found in .structural-contracts/ — skipping.');
  process.exit(0);
}

console.log('▶ SDCA Structural Contract Verification (Gap Variant B / STD-STRUCTURAL-CONTRACT-001)\n');

for (const contractFile of contractFiles) {
  const contract = JSON.parse(fs.readFileSync(path.join(contractsDir, contractFile), 'utf8'));
  console.log(`\n── Module: ${contract.module} (${contractFile}) ──`);

  const { standalone, fragment } = contract.artifacts;
  const artifactMap = {};

  // Load artifacts that exist
  for (const [key, rel] of [['standalone', standalone], ['fragment', fragment]]) {
    const abs = path.join(rootDir, rel);
    if (fs.existsSync(abs)) {
      artifactMap[key] = buildAncestorMap(fs.readFileSync(abs, 'utf8'));
    } else {
      console.log(`  ⚠ Artifact not found, skipping: ${rel}`);
    }
  }

  for (const entry of contract.required_ids) {
    const targets = entry.artifact === 'both'
      ? Object.entries(artifactMap)
      : [[entry.artifact, artifactMap[entry.artifact]]];

    for (const [artifactKey, map] of targets) {
      if (!map) continue; // artifact wasn't found on disk
      const rel = artifactKey === 'standalone' ? standalone : fragment;
      validateEntry(entry, map, path.relative(rootDir, path.join(rootDir, rel)));
    }
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n' + '═'.repeat(80));
if (failures === 0) {
  console.log(`🎉 ALL ${passes} STRUCTURAL CONTRACT CHECKS PASSED (STD-STRUCTURAL-CONTRACT-001)`);
  console.log('═'.repeat(80) + '\n');
  process.exit(0);
} else {
  console.error(`💥 STRUCTURAL CONTRACT GATE FAILED: ${failures} violation(s) detected.`);
  console.log('═'.repeat(80) + '\n');
  process.exit(1);
}

/* STD-STRUCTURAL-CONTRACT-001 / SK-028 Phase 2 / AC-DEC-2026-070 */
