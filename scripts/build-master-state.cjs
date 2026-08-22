const fs = require('fs');
const path = require('path');

const tasksDir = path.join(__dirname, '..', '00_GOVERNANCE', 'tasks');

// Load all task pack files
const packFiles = [
  'TSK_PACK_01_LITURGY_SAMAGRI.md',
  'TSK_PACK_02_PROCUREMENT_VENDORS.md',
  'TSK_PACK_03_LOGISTICS_HOSPITALITY.md',
  'TSK_PACK_04_CUSTODY_ATTIRE.md',
  'TSK_PACK_05_DAY_OF_SWIMLANES.md',
  'TSK_PACK_06_LEGAL_DOCUMENTATION.md',
  'TSK_PACK_07_TRIALS_REHEARSALS.md',
  'TSK_PACK_08_DIGITAL_GUEST_EXPERIENCE.md',
  'TSK_PACK_09_TRAVEL_VENDOR_TRIALS.md',
  'TSK_PACK_10_BRAND_STATIONERY.md',
  'TSK_PACK_11_SHOPPING_TROUSSEAU.md'
];

// Track mapping helper
function determineTrack(taskId, packId) {
  if (['TSK-205', 'TSK-401', 'TSK-502', 'TSK-701', 'TSK-702', 'TSK-1004', 'TSK-1101'].includes(taskId)) return 'bride';
  if (['TSK-206', 'TSK-402', 'TSK-403', 'TSK-503', 'TSK-704', 'TSK-1102'].includes(taskId)) return 'groom';
  if (['TSK-101', 'TSK-102', 'TSK-103', 'TSK-104', 'TSK-105', 'TSK-106', 'TSK-107', 'TSK-108', 'TSK-504', 'TSK-1104'].includes(taskId)) return 'purohit';
  if (['TSK-201', 'TSK-202', 'TSK-505', 'TSK-903'].includes(taskId)) return 'catering';
  if (['TSK-203', 'TSK-204', 'TSK-506', 'TSK-703', 'TSK-801', 'TSK-802', 'TSK-803', 'TSK-804', 'TSK-904', 'TSK-1001', 'TSK-1002', 'TSK-1003', 'TSK-1005'].includes(taskId)) return 'media';
  return 'fleet';
}

// Stage mapping helper
function determineStage(taskId, phase) {
  if (['TSK-103', 'TSK-207', 'TSK-304', 'TSK-305', 'TSK-404', 'TSK-705', 'TSK-804', 'TSK-805', 'TSK-905', 'TSK-1104', 'TSK-1105'].includes(taskId)) return 'STAGE_02';
  if (['TSK-104', 'TSK-405', 'TSK-501', 'TSK-502', 'TSK-503', 'TSK-505', 'TSK-506', 'TSK-507'].includes(taskId)) return 'STAGE_03';
  if (['TSK-105', 'TSK-106', 'TSK-107', 'TSK-504'].includes(taskId)) return 'STAGE_04';
  if (['TSK-601'].includes(taskId)) return 'STAGE_05';
  if (['TSK-108', 'TSK-602'].includes(taskId)) return 'STAGE_06';
  return 'STAGE_01';
}

const allTasks = [];

for (const file of packFiles) {
  const filePath = path.join(tasksDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File missing: ${filePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Parse task blocks: ### `TSK-###`: Title ...
  const taskRegex = /### `(TSK-\d+)`: ([^\n\r]+)[\s\S]*?\* \*\*WBS Code:\*\* `([^`]+)`[\s\S]*?\* \*\*Phase:\*\* ([^\n\r]+)[\s\S]*?\* \*\*Lead Owner:\*\* ([^\n\r]+)[\s\S]*?\* \*\*Priority:\*\* ([^\n\r]+)[\s\S]*?\* \*\*Status:\*\* ([^\n\r]+)(?:[\s\S]*?\* \*\*Linked Entities:\*\* ([^\n\r]+))?[\s\S]*?#### Deliverable Description:\s*([\s\S]*?)(?=#### Verification Checklist:|$)(?:#### Verification Checklist:\s*([\s\S]*?)(?=---|###|$))?/g;
  
  let match;
  while ((match = taskRegex.exec(content)) !== null) {
    const id = match[1].trim();
    const title = match[2].trim();
    const wbs = match[3].trim();
    const phase = match[4].trim();
    const lead = match[5].trim();
    const priority = match[6].trim();
    const linkedRaw = match[8] ? match[8].trim() : '';
    const desc = match[9] ? match[9].trim().replace(/\r?\n/g, ' ') : '';
    const checklistRaw = match[10] || '';
    
    const linkedEntities = linkedRaw.match(/(?:RIT|SAM|CTR|VEN|PAY|AST|PER|EVT|VDR)-\d+/g) || [];
    
    // Parse checklist lines
    const checklist = [];
    const checkLineRegex = /- \[[ xX]\] ([^\n\r]+)/g;
    let clMatch;
    while ((clMatch = checkLineRegex.exec(checklistRaw)) !== null) {
      checklist.push({
        text: clMatch[1].trim(),
        done: false // All reverted to false per user requirement
      });
    }
    
    // If no checklist in markdown, create sensible defaults
    if (checklist.length === 0) {
      checklist.push({ text: 'Scope & requirements verified with stakeholders', done: false });
      checklist.push({ text: 'Vendor / liturgical coordination confirmed', done: false });
      checklist.push({ text: 'Final deliverable sign-off and ledger recorded', done: false });
    }
    
    const stage = determineStage(id, phase);
    const track = determineTrack(id, file);
    
    allTasks.push({
      id,
      wbs,
      stage,
      track,
      title,
      lead,
      priority,
      status: 'Planned', // Reverted to Planned
      timeTag: phase.replace(/^Phase \d+ \((.*?)\)$/, '$1'),
      desc,
      checklist,
      linkedEntities,
      gate: id === 'TSK-501' ? 'GATE-01' : null
    });
  }
}

console.log(`Parsed ${allTasks.length} canonical tasks from all 11 task packs.`);

// Generate the marriage-state.js content
const stateCode = `/**
 * 👑 Sree Krushna Marriage OS — Canonical State & Data Feed
 * Single Source of Truth for:
 * • 6 Temporal Stages / Phases
 * • 6 Parallel Operational Swimlanes (Tracks)
 * • 4 Critical Operational Gates (GATE-01 to GATE-04)
 * • ${allTasks.length} Master Tasks & Work Packages (TSK-101 through TSK-1105)
 * • Sacred Samagri (SAM-###), Precious Assets (AST-###), People & Contacts (PER-###)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MARRIAGE_STATE = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    meta: {
      version: '3.1.0',
      title: 'Sree Krushna Marriage OS',
      couple: 'Sree & Krushna',
      muhurat: '2027-03-10 08:00 IST',
      venue: 'Swarna Mandap, Bhubaneswar, Odisha',
      updatedAt: '${new Date().toISOString()}'
    },

    // ── 6 TEMPORAL PHASES / STAGES ──────────────────────────────────
    stages: [
      {
        id: 'STAGE_01',
        num: '01',
        name: 'Pre-Wedding & Procurement',
        timeframe: 'T - 120 to T - 15 Days',
        desc: 'Astrological Muhurat lock, venue SLAs, attire weaving, gold vault audit, wedding website & invitations.',
        icon: '📜'
      },
      {
        id: 'STAGE_02',
        num: '02',
        name: 'Mangan & Sacred Rites',
        timeframe: 'T - 2 to T - 1 Days',
        desc: 'Deva Nimantrana, Mangan dawn turmeric bath, Mehendi trials, Mandap decoration & guest airport pickups.',
        icon: '🌿'
      },
      {
        id: 'STAGE_03',
        num: '03',
        name: 'Barat & Grand Reception',
        timeframe: 'Day 0 • 16:00 to 19:30',
        desc: 'Barat assembly, Groom Safa/Mukuta dressing, bridal photography, brass band arrival & GATE-02 Baranugam.',
        icon: '🎺'
      },
      {
        id: 'STAGE_04',
        num: '04',
        name: 'Vedic Mandap Sanctum',
        timeframe: 'Day 0 • 19:30 to 22:30',
        desc: 'Astrological Lagna muhurat rites: Kanyadaan, Hastaganthi, Lajahoma, Saptapadi & Sindoor Daan.',
        icon: '🕉️'
      },
      {
        id: 'STAGE_05',
        num: '05',
        name: 'Royal Feast & Hospitality',
        timeframe: 'Day 0 • 19:30 to 23:30',
        desc: 'Traditional Odia feast dining pavilion, VIP Sattvic service, photo lounge candids & guest departures.',
        icon: '🍲'
      },
      {
        id: 'STAGE_06',
        num: '06',
        name: 'Chauthi & Astamangala',
        timeframe: 'Day +1 to Day +8',
        desc: 'HMA marriage registration, Grihapravesh, Chauthi night puja, asset bank vault return & Astamangala.',
        icon: '👑'
      }
    ],

    // ── 6 PARALLEL OPERATIONAL TRACKS (SWIMLANES) ───────────────────
    tracks: [
      {
        id: 'bride',
        code: 'TRACK_A',
        title: 'Bride Team & Styling',
        icon: '👰',
        lead: 'PER-006 (Bride Mother) & Sree',
        color: '#ff758f',
        bgGradient: 'linear-gradient(90deg, #3d1421, var(--bg-surface-elevated))'
      },
      {
        id: 'groom',
        code: 'TRACK_B',
        title: 'Groom Team & Barat',
        icon: '🤵',
        lead: 'PER-008 (Groom Lead) & Krushna',
        color: '#70d6ff',
        bgGradient: 'linear-gradient(90deg, #132a4a, var(--bg-surface-elevated))'
      },
      {
        id: 'purohit',
        code: 'TRACK_C',
        title: 'Vedic Purohits & Sanctum',
        icon: '🕉️',
        lead: 'PER-080 (Chief Vedic Purohit) & PER-005',
        color: '#ffd15c',
        bgGradient: 'linear-gradient(90deg, #382405, var(--bg-surface-elevated))'
      },
      {
        id: 'catering',
        code: 'TRACK_D',
        title: 'Catering & Hospitality',
        icon: '🍲',
        lead: 'PER-014 (Food Lead & Controller)',
        color: '#2ec4b6',
        bgGradient: 'linear-gradient(90deg, #0e331b, var(--bg-surface-elevated))'
      },
      {
        id: 'media',
        code: 'TRACK_E',
        title: 'Photo, Cinema & Drone',
        icon: '📸',
        lead: 'VDR-003 (Senior Studio Lead)',
        color: '#c77dff',
        bgGradient: 'linear-gradient(90deg, #2b1442, var(--bg-surface-elevated))'
      },
      {
        id: 'fleet',
        code: 'TRACK_F',
        title: 'Fleet & Asset Custody',
        icon: '🚗',
        lead: 'PER-007 (Cash/Gold Custodian) & PER-012',
        color: '#ffb703',
        bgGradient: 'linear-gradient(90deg, #332110, var(--bg-surface-elevated))'
      }
    ],

    // ── 4 CRITICAL OPERATIONAL GATES ────────────────────────────────
    gates: [
      {
        id: 'GATE-01',
        name: 'Pre-Event Readiness Greenlight',
        targetTime: 'Day 0 • T - 4 Hours (15:00)',
        owner: 'PER-014 (Command Controller)',
        description: 'Mandatory sign-off across green rooms, power backups, samagri inspection, and dining pavilion setup.',
        status: 'READY'
      },
      {
        id: 'GATE-02',
        name: 'Barat & Entrance Handshake',
        targetTime: 'Day 0 • 19:30',
        owner: 'PER-006 (Bride Mother) & PER-008',
        description: 'Synchronized handshake: Barat procession arrival, cold pyros clearance, and Baranugam welcoming aarti.',
        status: 'PENDING'
      },
      {
        id: 'GATE-03',
        name: 'Vedic Sanctum Muhurat Lock',
        targetTime: 'Day 0 • 21:30 Lagna Muhurat',
        owner: 'PER-080 (Chief Vedic Purohit)',
        description: 'Sacred Kanyadaan, Hastaganthi water pouring, Lajahoma, Saptapadi 7 vows & Sindoor Daan.',
        status: 'PENDING'
      },
      {
        id: 'GATE-04',
        name: 'Kanyavida & Shagun Custody Seal',
        targetTime: 'Day 0 • 23:45',
        owner: 'PER-007 (Asset Custodian) & Parents',
        description: 'Signed handover of gift ledger, cash envelopes, gold return verification, and bridal vehicle departure.',
        status: 'PENDING'
      }
    ],

    // ── KEY PEOPLE DIRECTORY (PER-###) ──────────────────────────────
    people: {
      'PER-001': { name: 'Sree (Bride)', role: 'Tier 1 Core Bride', phone: '+91 98765 00001' },
      'PER-002': { name: 'Krushna (Groom)', role: 'Tier 1 Core Groom', phone: '+91 98765 00002' },
      'PER-005': { name: 'Shri B. Panda', role: 'Bride Father (Kanyadata)', phone: '+91 94370 11111' },
      'PER-006': { name: 'Smt. S. Panda', role: 'Bride Mother (Green Room Lead)', phone: '+91 94370 22222' },
      'PER-007': { name: 'Shri D. Tripathy', role: 'Gold & Cash Custodian', phone: '+91 94370 33333' },
      'PER-008': { name: 'Shri R. Mishra', role: 'Groom Lead & Styling', phone: '+91 94370 44444' },
      'PER-012': { name: 'Capt. A. Dash', role: 'Fleet & Transit Dispatcher', phone: '+91 94370 55555' },
      'PER-014': { name: 'Er. S. Mohapatra', role: 'Day-of Command Controller', phone: '+91 94370 66666' },
      'PER-080': { name: 'Pandit S. Rath Sharma', role: 'Chief Vedic Purohit (Puri)', phone: '+91 94370 77777' },
      'VDR-003': { name: 'Royal Cinematography Studio', role: 'Lead Media Vendor', phone: '+91 94370 88888' },
      'VDR-005': { name: 'Master Bridal Artistry', role: 'Bridal MUA Lead', phone: '+91 94370 99999' },
      'VDR-006': { name: 'Odia Dhol & Brass Ensemble', role: 'Barajatri Band Lead', phone: '+91 94370 00000' }
    },

    // ── CANONICAL MASTER TASKS (TSK-101 THROUGH TSK-1105) ───────────
    tasks: ${JSON.stringify(allTasks, null, 6)}
  };
});
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'js', 'marriage-state.js'), stateCode, 'utf-8');
fs.writeFileSync(path.join(__dirname, '..', 'js', 'marriage-state.js'), stateCode, 'utf-8');
console.log('Successfully generated public/js/marriage-state.js and js/marriage-state.js');
