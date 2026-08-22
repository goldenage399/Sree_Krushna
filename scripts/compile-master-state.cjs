/**
 * Complete Master State Compiler
 * Source: User_Created/Discussion Threads/TaskBreakdowns/260822_task_Identification.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const blueprintPath = path.join(ROOT, 'User_Created', 'Discussion Threads', 'TaskBreakdowns', '260822_task_Identification.md');
const blueprintContent = fs.readFileSync(blueprintPath, 'utf8');

console.log('Compiling Master State from Blueprint...');

// 1. Parse Control Room Matrix (Section 2)
const matrixRegex = /\|\s*(GOV-\d+|VEN-\d+|RIT-\d+|DEC-\d+|PWR-\d+|FOOD-\d+|GFT-\d+|LOG-\d+|SEC-\d+|MED-\d+|LEG-\d+|CLS-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/g;
let match;
const matrixTasks = [];

while ((match = matrixRegex.exec(blueprintContent)) !== null) {
  const id = match[1].trim();
  const deliverable = match[2].trim();
  const owner = match[3].trim();
  const priority = match[4].trim();
  const checklistRaw = match[5].trim();
  
  const checklistItems = checklistRaw.split(';').map(c => ({
    text: c.trim(),
    done: false
  })).filter(c => c.text.length > 0);
  
  matrixTasks.push({
    controlId: id,
    title: deliverable,
    owner: owner,
    priority: priority === 'Critical' ? 'Critical' : 'High',
    checklist: checklistItems
  });
}

console.log(`Parsed ${matrixTasks.length} Control-Room Matrix items.`);

// Map into Canonical Tasks
let tskCounter = 1;
const allTasks = matrixTasks.map(item => {
  const taskId = 'TSK-' + String(tskCounter++).padStart(3, '0');
  
  let eventScope = 'EVT-004';
  let track = 'fleet';
  let stage = 'STAGE_01';
  let wbs = `1.${tskCounter}.1`;
  
  if (item.controlId.startsWith('GOV') || item.controlId.startsWith('LEG')) {
    eventScope = 'Master_Planning';
    track = 'purohit';
    stage = 'STAGE_01';
  } else if (item.controlId.startsWith('VEN') && item.title.includes('Rayagada')) {
    eventScope = 'EVT-001';
    track = 'bride';
    stage = 'STAGE_01';
  } else if (item.controlId.startsWith('VEN') && item.title.includes('reception')) {
    eventScope = 'EVT-005';
    track = 'groom';
    stage = 'STAGE_03';
  } else if (item.controlId.startsWith('RIT')) {
    eventScope = 'EVT-004';
    track = 'purohit';
    stage = 'STAGE_04';
  } else if (item.controlId.startsWith('FOOD')) {
    eventScope = 'EVT-004';
    track = 'catering';
    stage = 'STAGE_05';
  } else if (item.controlId.startsWith('MED') || item.controlId.startsWith('DEC')) {
    track = 'media';
    stage = 'STAGE_02';
  } else if (item.controlId.startsWith('SEC')) {
    track = 'fleet';
    stage = 'STAGE_01';
  }
  
  return {
    id: taskId,
    controlId: item.controlId,
    title: item.title,
    event: eventScope,
    owner: item.owner,
    priority: item.priority,
    status: 'Planned',
    track: track,
    stage: stage,
    wbs: wbs,
    checklist: item.checklist
  };
});

console.log(`Generated ${allTasks.length} canonical tasks with full metadata.`);

// Save canonical tasks JSON
fs.writeFileSync(path.join(ROOT, 'scratch', 'compiled-tasks.json'), JSON.stringify(allTasks, null, 2), 'utf8');
console.log('Saved scratch/compiled-tasks.json successfully.');
