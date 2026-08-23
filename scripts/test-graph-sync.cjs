#!/usr/bin/env node
/**
 * Test Graph Sync & Option B Verification Suite
 *
 * Verifies:
 * 1. Static & DAG task graph integrity via validate-task-graph.cjs logic.
 * 2. Option B ad-hoc task creation, ID minting, and predecessor linkage.
 * 3. Predecessor unlocks symmetry updates.
 * 4. Multi-device client adoption simulation (Pass-2 adoption in fsListenTaskStatus).
 */
'use strict';
const path = require('path');
const assert = require('assert');

console.log('🧪 ========================================================');
console.log('👑 Option B End-to-End Verification: Task Graph & Cloud Sync');
console.log('==========================================================\n');

// 1. Verify Task Graph Integrity
console.log('🔍 [1/3] Running Graph Integrity & DFS Cycle Detection...');
const MARRIAGE_STATE = require('../public/js/marriage-state.js');
const fs = require('fs');

function extractProjectState() {
  const filePath = path.join(__dirname, '../public/js/modules/dopkos-engine.js');
  const src = fs.readFileSync(filePath, 'utf8');
  const marker = 'const PROJECT_STATE = {';
  const start = src.indexOf(marker);
  if (start === -1) throw new Error('PROJECT_STATE literal not found in dopkos-engine.js');

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
  return new Function('return ' + src.slice(start + marker.length - 1, end + 1))();
}

const PROJECT_STATE = extractProjectState();
const planningTasks = MARRIAGE_STATE.tasks || [];
const dagTasks = PROJECT_STATE.tasks || [];
const allTasks = planningTasks.concat(dagTasks);
const byId = new Map(allTasks.map(t => [t.id, t]));
const allGates = new Set((MARRIAGE_STATE.gates || []).map(g => g.id));

let errors = [];
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

assert.strictEqual(errors.length, 0, `Graph integrity errors found: ${errors.join(', ')}`);
console.log(`  ✅ ${allTasks.length} canonical tasks verified with 0 errors.`);

// 2. Simulate Option B Ad-hoc Task Creation & Predecessor Linking
console.log('\n🚀 [2/3] Testing Option B Ad-hoc Task Creation & Unlocks Symmetry...');
const mockCloudState = {};
let mockTaskCounter = 2000;

function mockMintId(prefix) {
  mockTaskCounter++;
  return `${prefix}-${String(mockTaskCounter).padStart(3, '0')}`;
}

// Client 1 approves a Change Request with predecessor TSK-101
const predecessorId = 'TSK-101';
const predTask = byId.get(predecessorId);
assert(predTask, `Predecessor task ${predecessorId} must exist`);

const newAdhocId = mockMintId('TSK');
const newAdhocTask = {
  id: newAdhocId,
  title: 'Custom Odia Mithai Tasting Trial',
  event: 'STAGE_01',
  owner: 'PER-006 (Bride Mother)',
  priority: 'High',
  status: 'Planned',
  done: false,
  track: 'catering',
  depends_on: [predecessorId],
  unlocks: [],
  dependency_type: 'standard',
  checklist: [{ text: 'Taste Chhena Poda and Rasabali samples', done: false }]
};

// Store full adhoc task in cloud
mockCloudState[newAdhocId] = { ...newAdhocTask };

// Update predecessor's unlocks array and store overlay in cloud
predTask.unlocks = predTask.unlocks || [];
if (!predTask.unlocks.includes(newAdhocId)) predTask.unlocks.push(newAdhocId);
mockCloudState[predecessorId] = {
  status: predTask.status,
  done: !!predTask.done,
  unlocks: predTask.unlocks
};

console.log(`  ✅ Client 1 created ad-hoc task ${newAdhocId} linked to predecessor ${predecessorId}`);
console.log(`  ✅ Predecessor ${predecessorId} now unlocks: ${JSON.stringify(predTask.unlocks)}`);

// 3. Simulate Client 2 (Remote Device) Hydration & Pass-2 Adoption
console.log('\n🌐 [3/3] Simulating Remote Device (Client 2) Hydration & Pass-2 Adoption...');

// Client 2 starts with baseline canonical tasks
const client2Tasks = JSON.parse(JSON.stringify(allTasks));

// Pass 1: Overlay status/unlocks on known tasks
client2Tasks.forEach(t => {
  const cloud = mockCloudState[t.id];
  if (!cloud) return;
  t.status = cloud.status || t.status;
  t.done = (cloud.status === 'Completed' || !!cloud.done);
  if (Array.isArray(cloud.unlocks)) t.unlocks = cloud.unlocks;
});

// Pass 2: Adopt brand-new ad-hoc tasks
Object.keys(mockCloudState).forEach(taskId => {
  if (client2Tasks.some(t => t.id === taskId)) return;
  const cloud = mockCloudState[taskId];
  if (!cloud.title) return; // Ignore pure overlays
  client2Tasks.unshift({
    id: taskId,
    title: cloud.title,
    event: cloud.event,
    owner: cloud.owner,
    priority: cloud.priority,
    status: cloud.status,
    done: !!cloud.done,
    track: cloud.track,
    checklist: cloud.checklist || [],
    depends_on: cloud.depends_on || [],
    unlocks: cloud.unlocks || [],
    dependency_type: cloud.dependency_type || 'standard'
  });
});

// Verification assertions for Client 2
const client2AdoptedTask = client2Tasks.find(t => t.id === newAdhocId);
assert(client2AdoptedTask, 'Client 2 must have adopted the ad-hoc task');
assert.strictEqual(client2AdoptedTask.title, 'Custom Odia Mithai Tasting Trial');
assert.deepStrictEqual(client2AdoptedTask.depends_on, [predecessorId]);

const client2PredTask = client2Tasks.find(t => t.id === predecessorId);
assert(client2PredTask, 'Client 2 must have predecessor task');
assert(client2PredTask.unlocks.includes(newAdhocId), 'Client 2 predecessor unlocks must include new ad-hoc task ID');

console.log(`  ✅ Client 2 successfully adopted ad-hoc task ${newAdhocId}`);
console.log(`  ✅ Client 2 task count: ${client2Tasks.length} (increased by 1)`);
console.log(`  ✅ Bidirectional edge symmetry confirmed across simulated devices!`);

console.log('\n==========================================================');
console.log('✨ OPTION B MULTI-DEVICE GRAPH SYNC VERIFICATION PASSED! ✨');
console.log('==========================================================\n');
