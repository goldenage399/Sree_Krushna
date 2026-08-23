#!/usr/bin/env node
/**
 * Task Graph Validator (see .agent/workflows/task-graph-reconciliation.md)
 *
 * Checks depends_on / unlocks / sealing_gate integrity across both task
 * sources: MARRIAGE_STATE.tasks (public/js/marriage-state.js) and
 * PROJECT_STATE.tasks (public/js/modules/dopkos-engine.js).
 *
 * Usage: node scripts/validate-task-graph.cjs   (npm run verify:task-graph)
 * Exit code 0 = clean, 1 = errors found. Warnings do not fail the run.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const MARRIAGE_STATE = require('../public/js/marriage-state.js');

// ponytail: dopkos-engine.js is a browser-only IIFE — no module.exports, and
// it touches `localStorage` inside its function bodies — so `require()`-ing
// it in plain Node would need a DOM/localStorage polyfill just to read one
// object literal. Instead, lift the `PROJECT_STATE = { ... }` literal straight
// out of the source text and evaluate only that, skipping the rest of the
// (browser-only) file entirely. Ceiling: the brace/string scanner below is a
// hand-rolled mini-parser, not a real JS parser — a task description
// containing a stray unescaped quote could miscount. None do today. Upgrade
// to a real parser (e.g. acorn) if that ever changes.
function extractProjectState() {
  const filePath = path.join(__dirname, '../public/js/modules/dopkos-engine.js');
  const src = fs.readFileSync(filePath, 'utf8');
  const marker = 'const PROJECT_STATE = {';
  const start = src.indexOf(marker);
  if (start === -1) throw new Error('PROJECT_STATE literal not found in dopkos-engine.js — has it been restructured?');

  let depth = 0, inString = null, escaped = false, end = -1;
  for (let i = start + marker.length - 1; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error('Unbalanced PROJECT_STATE literal in dopkos-engine.js');

  const literal = src.slice(start + marker.length - 1, end + 1);
  return new Function('return ' + literal)();
}

const PROJECT_STATE = extractProjectState();
const planningTasks = MARRIAGE_STATE.tasks || [];
const dagTasks = PROJECT_STATE.tasks || [];
const allTasks = planningTasks.concat(dagTasks);
const byId = new Map(allTasks.map(t => [t.id, t]));
const allGates = new Set((MARRIAGE_STATE.gates || []).map(g => g.id));

const errors = [];
const warnings = [];

// 1. Referential integrity — every depends_on/unlocks/sealing_gate target must exist
allTasks.forEach(t => {
  ['depends_on', 'unlocks'].forEach(field => {
    (t[field] || []).forEach(refId => {
      if (!byId.has(refId)) errors.push(`${t.id}.${field} references unknown task "${refId}"`);
    });
  });
  if (t.sealing_gate && !byId.has(t.sealing_gate) && !allGates.has(t.sealing_gate)) {
    errors.push(`${t.id}.sealing_gate references unknown gate/task "${t.sealing_gate}"`);
  }
});

// 2. Edge symmetry — A.unlocks -> B should imply B.depends_on -> A
allTasks.forEach(t => {
  (t.unlocks || []).forEach(targetId => {
    const target = byId.get(targetId);
    if (target && !(target.depends_on || []).includes(t.id)) {
      warnings.push(`${t.id}.unlocks includes "${targetId}" but ${targetId}.depends_on does not list "${t.id}" back`);
    }
  });
});

// 3. Cycle detection over depends_on (DFS, white/gray/black)
const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Map(allTasks.map(t => [t.id, WHITE]));
function dfs(id, stack) {
  color.set(id, GRAY);
  stack.push(id);
  const t = byId.get(id);
  for (const depId of (t && t.depends_on) || []) {
    if (!byId.has(depId)) continue; // already reported in check 1
    if (color.get(depId) === GRAY) {
      const cycleStart = stack.indexOf(depId);
      errors.push(`Circular dependency: ${stack.slice(cycleStart).concat(depId).join(' -> ')}`);
    } else if (color.get(depId) === WHITE) {
      dfs(depId, stack);
    }
  }
  stack.pop();
  color.set(id, BLACK);
}
allTasks.forEach(t => { if (color.get(t.id) === WHITE) dfs(t.id, []); });

// 4. Gate compliance — a must_precede_sealing edge must name a real sealing_gate
allTasks.forEach(t => {
  if (t.dependency_type === 'must_precede_sealing' && !t.sealing_gate) {
    errors.push(`${t.id} is dependency_type "must_precede_sealing" but has no sealing_gate`);
  }
});

console.log(`Checked ${allTasks.length} tasks (${planningTasks.length} planning + ${dagTasks.length} DAG).`);
if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} warning(s):`);
  warnings.forEach(w => console.log('  - ' + w));
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} error(s):`);
  errors.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
console.log('\n✅ Task graph is structurally valid.');
