#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Sree Krushna Marriage OS — Asynchronous Change-Request Triage Engine
 * SPEC-ARCH-INTENT-DISPATCH-001
 * 
 * Usage:
 *   node scripts/triage-requests.cjs list
 *   node scripts/triage-requests.cjs inspect <CR-ID>
 *   node scripts/triage-requests.cjs approve <CR-ID>
 *   node scripts/triage-requests.cjs reject <CR-ID> <Reason>
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(ROOT_DIR, 'scratch', 'change_requests_queue.json');

// Default Seeded Requests if file does not exist
const SEED_REQUESTS = [
  {
    requestId: 'CR-001',
    targetDomain: 'VISION',
    intentType: 'DROP_INSPIRATION',
    submitter: 'Sree (Bride)',
    targetEvent: 'EVT-004',
    title: 'Mandap Decor: Suspended Tuberose Dome with Hanging Temple Bells',
    payload: {
      rawNotes: 'Suspended tuberose floral dome over mandap with traditional brass bells and warm fairy lights',
      mediaUrl: 'https://www.instagram.com/reel/C3example1/',
      platform: 'Instagram'
    },
    status: 'Pending_Review',
    submittedAt: '2026-08-22T02:35:00Z'
  },
  {
    requestId: 'CR-002',
    targetDomain: 'VISION',
    intentType: 'DROP_INSPIRATION',
    submitter: 'Krushna (Groom)',
    targetEvent: 'EVT-005',
    title: 'Reception Entry: Cinematic Stage Walk with Cold Pyros & Live Flute',
    payload: {
      rawNotes: 'Cold pyrotechnics on grand stage walk with live classical flute fusion for reception entry',
      mediaUrl: 'https://youtube.com/shorts/example2',
      platform: 'YouTube'
    },
    status: 'Pending_Review',
    submittedAt: '2026-08-22T02:35:00Z'
  },
  {
    requestId: 'CR-003',
    targetDomain: 'VENDORS',
    intentType: 'NOMINATE_VENDOR',
    submitter: 'Parents Council',
    targetEvent: 'EVT-004',
    title: 'Vendor Proposal (Catering): Nimapada Sweets & Odia Feast Caterers',
    payload: {
      vendorName: 'Nimapada Sweets & Odia Feast Caterers',
      category: 'Catering',
      contact: 'Debashis +91 9861000000',
      rawNotes: 'Specialists in pure Ghee Chenna Jhili, Dalma, and traditional Kanika rice for 800 guests.',
      mediaUrl: 'https://nimapadaccaterers.com'
    },
    status: 'Pending_Review',
    submittedAt: '2026-08-22T09:15:00Z'
  },
  {
    requestId: 'CR-004',
    targetDomain: 'RITUALS',
    intentType: 'ADJUST_RITUAL',
    submitter: 'Head Priest / Purohit',
    targetEvent: 'EVT-004',
    title: 'Liturgy Note: RIT-007 (Hastaganthi & Saptapadi)',
    payload: {
      ritualName: 'RIT-007: Hastaganthi & Saptapadi',
      rawNotes: 'Please arrange 7 betel leaves with whole areca nuts and unhusked paddy placed before the holy homa fire.'
    },
    status: 'Pending_Review',
    submittedAt: '2026-08-22T09:30:00Z'
  },
  {
    requestId: 'CR-005',
    targetDomain: 'CUSTODY',
    intentType: 'PROPOSE_ASSET',
    submitter: 'Parents Council',
    targetEvent: 'EVT-004',
    title: 'Custody Asset: Sacred Solapith & Brass Mukutas (~450g) for Bride & Groom',
    payload: {
      assetName: 'Sacred Solapith & Brass Mukutas',
      metal: 'Sacred Mukuta',
      weight: '450g',
      wearer: 'Bride & Groom',
      proposedCustodian: 'Uncle / Family Coordinator',
      rawNotes: 'Consecrated Mukutas to be handed over at Mandap 30 mins before Baarata arrival.'
    },
    status: 'Pending_Review',
    submittedAt: '2026-08-22T10:00:00Z'
  }
];

function loadRequests() {
  try {
    if (fs.existsSync(QUEUE_FILE)) {
      return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn(`[WARN] Could not read ${QUEUE_FILE}, falling back to defaults.`);
  }
  return SEED_REQUESTS;
}

function saveRequests(data) {
  const dir = path.dirname(QUEUE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const args = process.argv.slice(2);
const command = args[0] || 'list';
const targetId = args[1];

const requests = loadRequests();

console.log('\x1b[36m%s\x1b[0m', '═════════════════════════════════════════════════════════════════════════════');
console.log('\x1b[33m%s\x1b[0m', '👑 SREE KRUSHNA MARRIAGE OS — ASYNCHRONOUS CHANGE-REQUEST TRIAGE ENGINE');
console.log('\x1b[36m%s\x1b[0m', '═════════════════════════════════════════════════════════════════════════════\n');

switch (command.toLowerCase()) {
  case 'list': {
    console.log(`Found ${requests.length} total change requests in the intake queue:\n`);
    console.log('ID      | DOMAIN   | INTENT            | SUBMITTER         | STATUS          | TITLE');
    console.log('--------+----------+-------------------+-------------------+-----------------+---------------------------------------------');
    requests.forEach(r => {
      const statusColor = r.status === 'Pending_Review' ? '\x1b[33m' : r.status === 'Approved_Merged' ? '\x1b[32m' : '\x1b[31m';
      const row = `${r.requestId.padEnd(7)} | ${r.targetDomain.padEnd(8)} | ${r.intentType.padEnd(17)} | ${r.submitter.padEnd(17)} | ${statusColor}${r.status.padEnd(15)}\x1b[0m | ${r.title}`;
      console.log(row);
    });
    console.log('\n\x1b[90mTip: Run "node scripts/triage-requests.cjs inspect <CR-ID>" to inspect payload details.\x1b[0m\n');
    break;
  }

  case 'inspect': {
    if (!targetId) {
      console.error('\x1b[31mError: Please specify a Request ID (e.g. CR-001)\x1b[0m');
      process.exit(1);
    }
    const item = requests.find(r => r.requestId.toUpperCase() === targetId.toUpperCase());
    if (!item) {
      console.error(`\x1b[31mError: Request ${targetId} not found in change queue.\x1b[0m`);
      process.exit(1);
    }
    console.log(`\x1b[32m=== Change Request Details: ${item.requestId} ===\x1b[0m`);
    console.log(`Title:       ${item.title}`);
    console.log(`Domain:      ${item.targetDomain} (${item.intentType})`);
    console.log(`Submitter:   ${item.submitter}`);
    console.log(`Milestone:   ${item.targetEvent}`);
    console.log(`Status:      ${item.status}`);
    console.log(`SubmittedAt: ${item.submittedAt}`);
    console.log('\n\x1b[33mPayload Context:\x1b[0m');
    console.log(JSON.stringify(item.payload, null, 2));
    console.log('\n\x1b[90mCommands:\x1b[0m');
    console.log(`  Approve: node scripts/triage-requests.cjs approve ${item.requestId}`);
    console.log(`  Reject:  node scripts/triage-requests.cjs reject ${item.requestId} "Reason here"`);
    break;
  }

  case 'approve': {
    if (!targetId) {
      console.error('\x1b[31mError: Please specify a Request ID to approve (e.g. CR-001)\x1b[0m');
      process.exit(1);
    }
    const item = requests.find(r => r.requestId.toUpperCase() === targetId.toUpperCase());
    if (!item) {
      console.error(`\x1b[31mError: Request ${targetId} not found in change queue.\x1b[0m`);
      process.exit(1);
    }

    item.status = 'Approved_Merged';
    item.resolvedAt = new Date().toISOString();
    
    // Determine assigned entity code based on domain
    let assignedCode = 'TSK-504';
    if (item.targetDomain === 'VENDORS') assignedCode = 'VDR-005';
    else if (item.targetDomain === 'RITUALS') assignedCode = 'RIT-013';
    else if (item.targetDomain === 'CUSTODY') assignedCode = 'AST-006';
    else if (item.targetDomain === 'VISION') assignedCode = 'DEC-011';

    item.resolvedEntityId = assignedCode;
    saveRequests(requests);

    console.log(`\x1b[32m✅ SUCCESS: Change Request ${item.requestId} APPROVED & MERGED!\x1b[0m`);
    console.log(`Assigned SSOT Entity ID: \x1b[33m${assignedCode}\x1b[0m`);
    console.log(`Domain:                  ${item.targetDomain}`);
    console.log(`Title:                   ${item.title}`);
    console.log(`Provenance:              Linked to ${item.submitter} at ${item.resolvedAt}`);
    break;
  }

  case 'reject': {
    if (!targetId) {
      console.error('\x1b[31mError: Please specify a Request ID to reject (e.g. CR-001)\x1b[0m');
      process.exit(1);
    }
    const reason = args.slice(2).join(' ') || 'Declined by Planning Council during sprint triage';
    const item = requests.find(r => r.requestId.toUpperCase() === targetId.toUpperCase());
    if (!item) {
      console.error(`\x1b[31mError: Request ${targetId} not found in change queue.\x1b[0m`);
      process.exit(1);
    }

    item.status = 'Rejected';
    item.resolvedAt = new Date().toISOString();
    item.rejectionReason = reason;
    saveRequests(requests);

    console.log(`\x1b[31m❌ Change Request ${item.requestId} marked REJECTED.\x1b[0m`);
    console.log(`Reason: ${reason}`);
    break;
  }

  default:
    console.log(`Unknown command "${command}". Available commands: list, inspect <CR-ID>, approve <CR-ID>, reject <CR-ID> <Reason>`);
}
