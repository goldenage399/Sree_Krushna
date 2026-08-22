/**
 * Ingestion Compiler for Master Wedding Blueprint
 * Source: User_Created/Discussion Threads/TaskBreakdowns/260822_task_Identification.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const blueprintPath = path.join(ROOT, 'User_Created', 'Discussion Threads', 'TaskBreakdowns', '260822_task_Identification.md');
const blueprintContent = fs.readFileSync(blueprintPath, 'utf8');

console.log('Ingesting blueprint from:', blueprintPath);

// 1. Extract Section 2: Control-room matrix
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
    priority: priority,
    checklist: checklistItems
  });
}

console.log('Parsed Control-Room Matrix items:', matrixTasks.length);

// 2. Synthesize Canonical Tasks with P-ENT-ID TSK-###
let taskCounter = 1;
const canonicalTasks = matrixTasks.map(item => {
  const taskId = 'TSK-' + String(taskCounter++).padStart(3, '0');
  
  // Determine domain & event
  let eventScope = 'EVT-004';
  let track = 'fleet';
  
  if (item.controlId.startsWith('GOV') || item.controlId.startsWith('LEG')) {
    eventScope = 'Master_Planning';
    track = 'purohit';
  } else if (item.controlId.startsWith('VEN') && item.title.includes('Rayagada')) {
    eventScope = 'EVT-001';
    track = 'bride';
  } else if (item.controlId.startsWith('VEN') && item.title.includes('reception')) {
    eventScope = 'EVT-005';
    track = 'groom';
  } else if (item.controlId.startsWith('RIT')) {
    eventScope = 'EVT-004';
    track = 'purohit';
  } else if (item.controlId.startsWith('FOOD')) {
    eventScope = 'EVT-004';
    track = 'catering';
  } else if (item.controlId.startsWith('MED') || item.controlId.startsWith('DEC')) {
    track = 'media';
  }
  
  return {
    id: taskId,
    controlId: item.controlId,
    title: item.title,
    event: eventScope,
    owner: item.owner,
    priority: item.priority === 'Critical' ? 'Critical' : 'High',
    status: 'Planned',
    track: track,
    checklist: item.checklist
  };
});

console.log('Total Canonical Tasks generated:', canonicalTasks.length);

// Output preview
console.log('Sample Task #1:', canonicalTasks[0]);
console.log('Sample Task #10:', canonicalTasks[9]);

// Save to scratch/ingested-tasks.json
const scratchDir = path.join(ROOT, 'scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
fs.writeFileSync(path.join(scratchDir, 'ingested-tasks.json'), JSON.stringify(canonicalTasks, null, 2), 'utf8');

console.log('Saved to scratch/ingested-tasks.json successfully.');
