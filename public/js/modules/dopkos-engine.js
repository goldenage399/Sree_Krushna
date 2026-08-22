/**
 * Sree Krushna Marriage OS — DO_PKOS Multi-Track Operating Studio & Sacred Precedence DAG Engine
 * Module: js/modules/dopkos-engine.js
 * Adapted from: UG-Farmhouse DO-PKOS Hybrid Architecture
 */
(function(window) {
  'use strict';

  let currentDopkosView = 'TOPOLOGY';
  let currentDopkosEvent = 'ALL';
  let currentDopkosTrack = 'ALL';
  let selectedTopologyTaskId = null;

  const TOPOLOGY_TRACKS = [
    { id: 'bride', label: '👰 BRIDE', color: '#c06b8c', bg: 'rgba(192, 107, 140, 0.08)' },
    { id: 'groom', label: '🤵 GROOM', color: '#d4a843', bg: 'rgba(212, 168, 67, 0.08)' },
    { id: 'purohit', label: '🕉️ PUROHIT', color: '#f5c518', bg: 'rgba(245, 197, 24, 0.08)' },
    { id: 'catering', label: '🍲 CATERING', color: '#e07850', bg: 'rgba(224, 120, 80, 0.08)' },
    { id: 'media', label: '📸 MEDIA', color: '#64b5f6', bg: 'rgba(100, 181, 246, 0.08)' },
    { id: 'fleet', label: '🛡️ FLEET/VAULT', color: '#66bb6a', bg: 'rgba(102, 187, 106, 0.08)' }
  ];

  const TOPOLOGY_STAGES = [
    { num: 1, name: 'STAGE 1: T-180 Foundation', col: 0 },
    { num: 2, name: 'STAGE 2: T-120 Procurement', col: 1 },
    { num: 3, name: 'STAGE 3: T-60 Detailing', col: 2 },
    { num: 4, name: 'STAGE 4: T-14 Rayagada', col: 3 },
    { num: 5, name: 'STAGE 5: Day 0 Wedding', col: 4 },
    { num: 6, name: 'STAGE 6: Post & Legal', col: 5 }
  ];

  const TOPOLOGY_TASKS = [
    // Stage 1: T-180 Foundation (Col 0)
    { id: 'GOV-001', name: 'Chief Purohit Lagna Lock', track: 'purohit', stage: 1, col: 0, status: 'DONE', depends_on: [] },
    { id: 'TSK-001', name: 'Nuapatna Baula Patani Saree', track: 'bride', stage: 1, col: 0, status: 'DONE', depends_on: [] },
    { id: 'TSK-002', name: 'Groom Silk Attire Prep', track: 'groom', stage: 1, col: 0, status: 'DONE', depends_on: ['TSK-001'] },
    { id: 'FOOD-001', name: '21-Item Menu Tasting', track: 'catering', stage: 1, col: 0, status: 'READY', depends_on: [] },
    { id: 'TSK-003', name: 'Photographer 36-Q SLA', track: 'media', stage: 1, col: 0, status: 'READY', depends_on: [] },
    { id: 'VEN-001', name: 'Rayagada & BBSR Leases', track: 'fleet', stage: 1, col: 0, status: 'READY', depends_on: ['GOV-001'] },

    // Stage 2: T-120 Procurement (Col 1)
    { id: 'RIT-001', name: 'Vidhi-Patra Signoff', track: 'purohit', stage: 2, col: 1, status: 'READY', depends_on: ['GOV-001'] },
    { id: 'TSK-006', name: 'Bridal Footwear & Trousseau', track: 'bride', stage: 2, col: 1, status: 'READY', depends_on: ['TSK-001'] },
    { id: 'GFT-001', name: 'Deva Nimantrana (Puri)', track: 'groom', stage: 2, col: 1, status: 'READY', depends_on: ['RIT-001'] },
    { id: 'FOOD-002', name: 'Pahala Mithai Booking', track: 'catering', stage: 2, col: 1, status: 'READY', depends_on: ['FOOD-001'] },
    { id: 'TSK-004', name: 'Pre-Wedding Shoot Permits', track: 'media', stage: 2, col: 1, status: 'READY', depends_on: ['TSK-003'] },
    { id: 'SEC-001', name: 'Gold Vault Dual-Custody', track: 'fleet', stage: 2, col: 1, status: 'READY', depends_on: [] },

    // Stage 3: T-60 Detailing (Col 2)
    { id: 'RIT-006', name: 'Samagri Inventory Check', track: 'purohit', stage: 3, col: 2, status: 'READY', depends_on: ['RIT-001'] },
    { id: 'TSK-005', name: 'MUA Trial & Lookbook', track: 'bride', stage: 3, col: 2, status: 'READY', depends_on: ['TSK-001'] },
    { id: 'RIT-002', name: 'Silver Mukuta Sizing', track: 'groom', stage: 3, col: 2, status: 'READY', depends_on: ['TSK-002'] },
    { id: 'FOOD-004', name: 'FSSAI Hygiene & Water Audit', track: 'catering', stage: 3, col: 2, status: 'READY', depends_on: ['FOOD-002'] },
    { id: 'MED-002', name: 'Drone DGCA Clearance', track: 'media', stage: 3, col: 2, status: 'READY', depends_on: ['TSK-004'] },
    { id: 'PWR-001', name: '125kVA Generator Test', track: 'fleet', stage: 3, col: 2, status: 'READY', depends_on: ['VEN-001'] },

    // Stage 4: T-14 Rayagada (Col 3)
    { id: 'RIT-007', name: 'Aarti Thali & Samagri Pack', track: 'purohit', stage: 4, col: 3, status: 'LOCKED', depends_on: ['RIT-006'] },
    { id: 'RIT-003', name: 'Mangan Turmeric Bath', track: 'bride', stage: 4, col: 3, status: 'LOCKED', depends_on: ['RIT-001', 'TSK-005'] },
    { id: 'RIT-004', name: 'Patra Paribartana Vows', track: 'groom', stage: 4, col: 3, status: 'LOCKED', depends_on: ['RIT-003', 'GFT-001'] },
    { id: 'FOOD-005', name: 'Rayagada Feast Service', track: 'catering', stage: 4, col: 3, status: 'LOCKED', depends_on: ['FOOD-001'] },
    { id: 'MED-001', name: 'Lapel Audio Sync Dry-Run', track: 'media', stage: 4, col: 3, status: 'LOCKED', depends_on: ['MED-002', 'PWR-001'] },
    { id: 'SEC-002', name: 'Ring & Horoscope Safe Escort', track: 'fleet', stage: 4, col: 3, status: 'LOCKED', depends_on: ['SEC-001'] },

    // Stage 5: Day 0 BBSR Wedding (Col 4)
    { id: 'RIT-005', name: 'Kanyadaan & Hastaganthi 08:00', track: 'purohit', stage: 5, col: 4, status: 'LOCKED', depends_on: ['GATE-02', 'SEC-003'] },
    { id: 'GATE-04', name: 'Sindoor Daan & Mukuta', track: 'bride', stage: 5, col: 4, status: 'LOCKED', is_gate: true, depends_on: ['RIT-005', 'RIT-002'] },
    { id: 'GATE-02', name: 'Baranugam Arch Welcome', track: 'groom', stage: 5, col: 4, status: 'LOCKED', is_gate: true, depends_on: ['RIT-004', 'VEN-001'] },
    { id: 'FOOD-003', name: '850p Royal Reception Feast', track: 'catering', stage: 5, col: 4, status: 'LOCKED', depends_on: ['GATE-04', 'FOOD-004'] },
    { id: 'MED-006', name: 'Mandap Audio 2-Cam Record', track: 'media', stage: 5, col: 4, status: 'LOCKED', depends_on: ['GATE-02', 'MED-001'] },
    { id: 'SEC-003', name: 'Jewellery Dual-Custody Open', track: 'fleet', stage: 5, col: 4, status: 'LOCKED', depends_on: ['SEC-002'] },

    // Stage 6: Post & Legal SUJOG (Col 5)
    { id: 'RIT-008', name: 'Astamangala Blessing', track: 'purohit', stage: 6, col: 5, status: 'LOCKED', depends_on: ['RIT-005'] },
    { id: 'TSK-007', name: 'Grihapravesh Altas Setup', track: 'bride', stage: 6, col: 5, status: 'LOCKED', depends_on: ['GATE-04'] },
    { id: 'TSK-008', name: 'Chauthi Homa Attire', track: 'groom', stage: 6, col: 5, status: 'LOCKED', depends_on: ['GATE-04'] },
    { id: 'FOOD-006', name: 'Kitchen Handover & Audit', track: 'catering', stage: 6, col: 5, status: 'LOCKED', depends_on: ['FOOD-003'] },
    { id: 'CLS-001', name: '4TB Raw Data & 48h Teaser', track: 'media', stage: 6, col: 5, status: 'LOCKED', depends_on: ['MED-006'] },
    { id: 'LEG-001', name: 'SUJOG Marriage Registration', track: 'fleet', stage: 6, col: 5, status: 'LOCKED', depends_on: ['RIT-005'] }
  ];

  const DAY_OF_SCHEDULE = [
    {
      time: '03:30',
      label: 'Mobilisation & Wakeup',
      gate: null,
      tracks: {
        bride: { task: 'Bridal Wakeup & Mangala Snana', lead: 'Pooja', status: 'READY' },
        groom: { task: 'Groom Wakeup & Snana', lead: 'Groom Lead', status: 'READY' },
        purohit: { task: 'Mandap Samagri Setup & Sanctification', lead: 'Chief Purohit', status: 'READY' },
        catering: { task: 'Morning Tea, Herbal Decoctions & Bhojana Prep', lead: 'Debashis', status: 'READY' },
        media: { task: 'Camera Batteries & Drone DGCA Flight Checks', lead: 'Rayagada Media', status: 'READY' },
        fleet: { task: '15-Vehicle Fleet Engine Warm-up & Dispatch', lead: 'Transport Lead', status: 'READY' }
      }
    },
    {
      time: '05:00',
      label: 'Bridal Dressing & Groom Preparations',
      gate: null,
      tracks: {
        bride: { task: 'MUA HD Hair & Makeup + Alta Application', lead: 'Pooja (MUA)', status: 'ACTIVE' },
        groom: { task: 'Nuapatna Vedic Silk Dhoti & Uttariya Dressing', lead: 'Groom Lead', status: 'ACTIVE' },
        purohit: { task: 'Navagraha Puja & Deva Homa Setup', lead: 'Chief Purohit', status: 'READY' },
        catering: { task: 'VIP Breakfast Buffet Opening (120 Pax)', lead: 'Debashis', status: 'READY' },
        media: { task: 'Bridal Portrait Solo Shoot (Room 402)', lead: 'Rayagada Media', status: 'ACTIVE' },
        fleet: { task: 'Groom Escort Convoy Positioning at Gate 1', lead: 'Fleet Lead', status: 'READY' }
      }
    },
    {
      time: '07:00',
      label: 'Baranugam & Barat Arrival Arch Gate',
      gate: 'GATE-02: Barat Welcoming & Tilak (Irreversible Closure 07:45)',
      tracks: {
        bride: { task: 'Final Mukuta Coronation & Room Touchup', lead: 'Pooja', status: 'READY' },
        groom: { task: 'Barat Procession & Arrival at Mandap Arch', lead: 'Groom Lead', status: 'READY' },
        purohit: { task: 'Baranugam Vedic Rites & Groom Feet Washing', lead: 'Chief Purohit', status: 'READY' },
        catering: { task: 'Welcome Sharbat & Mithai Service at Entry', lead: 'Debashis', status: 'READY' },
        media: { task: 'Barat Slow-Mo Drone & 2-Cam Mandap Recording', lead: 'Rayagada Media', status: 'READY' },
        fleet: { task: 'Mandap Gate Security & Parking Lock', lead: 'Security Lead', status: 'READY' }
      }
    },
    {
      time: '08:00',
      label: 'Sacred Lagna Muhurat: Kanyadaan & Hastaganthi',
      gate: 'GATE-03: Lagna Muhurat Sanctum Lock (Strict 08:00 - 08:30)',
      tracks: {
        bride: { task: 'Kanyadaan & Father Vows', lead: 'Family Elders', status: 'READY' },
        groom: { task: 'Hastaganthi Sacred Cloth Knot Tie', lead: 'Chief Purohit', status: 'READY' },
        purohit: { task: 'Vedic Agni Homa & 7 Ahutis', lead: 'Chief Purohit', status: 'READY' },
        catering: { task: 'Prasada Batch 1 Handover to Mandap Sanctum', lead: 'Debashis', status: 'READY' },
        media: { task: 'Audio Lapel Sync Recording of Vows', lead: 'Rayagada Media', status: 'READY' },
        fleet: { task: 'Jewellery Vault Dual-Signoff Sign-in Slip', lead: 'Vault Custodian', status: 'READY' }
      }
    },
    {
      time: '08:45',
      label: 'Saptapadi & Sindoor Daan (Final Sacramental Bond)',
      gate: 'GATE-04: Sindoor Daan & Legal Witness Lock (09:15)',
      tracks: {
        bride: { task: '7 Steps (Saptapadi) & Sindoor Daan', lead: 'Chief Purohit', status: 'READY' },
        groom: { task: 'Mukuta Tarakasi Silver Transfer & Sindoor', lead: 'Chief Purohit', status: 'READY' },
        purohit: { task: 'Laja Homa (Puffed Rice) & Final Blessings', lead: 'Chief Purohit', status: 'READY' },
        catering: { task: 'Mandap Family Lunch Service Prep', lead: 'Debashis', status: 'READY' },
        media: { task: '4K Sindoor Daan Macro Shot & Family Frames', lead: 'Rayagada Media', status: 'READY' },
        fleet: { task: 'Return Escort Fleet Engine Check', lead: 'Transport Lead', status: 'READY' }
      }
    }
  ];

  const MACRO_ROADMAP = [
    { id: 'H1', name: 'Stage 1: T-180 to T-120 Foundation', period: 'Sep – Oct 2026', desc: 'Chief Purohit Lagna Lock, Nuapatna Weaving, Rayagada Venue Leases, 36-Q SLA.', tasks: ['GOV-001', 'TSK-001', 'FOOD-001', 'TSK-003', 'VEN-001'] },
    { id: 'H2', name: 'Stage 2: T-120 to T-60 Procurement', period: 'Nov – Dec 2026', desc: 'Vidhi-Patra signoff, Deva Nimantrana at Puri Jagannath, Pahala Mithai batch booking.', tasks: ['RIT-001', 'TSK-006', 'GFT-001', 'FOOD-002', 'TSK-004', 'SEC-001'] },
    { id: 'H3', name: 'Stage 3: T-60 to T-14 Detailing', period: 'Jan 2027', desc: 'Silver Mukuta fitting, MUA trials, 125kVA generator tests, FSSAI hygiene audit.', tasks: ['RIT-006', 'TSK-005', 'RIT-002', 'FOOD-004', 'MED-002', 'PWR-001'] },
    { id: 'H4', name: 'Stage 4: T-14 to T-1 Rayagada', period: '01 – 09 Mar 2027', desc: 'Mangan turmeric bath, Patra Paribartana paternal vows, Rayagada feast service.', tasks: ['RIT-007', 'RIT-003', 'RIT-004', 'FOOD-005', 'MED-001', 'SEC-002'] },
    { id: 'H5', name: 'Stage 5: Day 0 BBSR Wedding', period: '10 Mar 2027', desc: 'Baranugam, Kanyadaan (08:00), Sindoor Daan, 850-guest royal feast.', tasks: ['RIT-005', 'GATE-04', 'GATE-02', 'FOOD-003', 'MED-006', 'SEC-003'] },
    { id: 'H6', name: 'Stage 6: Post-Wedding & SUJOG', period: '11 Mar – 10 Apr 2027', desc: 'Grihapravesh, Astamangala, SUJOG registration, 4TB Raw archive vault deposit.', tasks: ['RIT-008', 'TSK-007', 'TSK-008', 'FOOD-006', 'CLS-001', 'LEG-001'] }
  ];

  const TOPOLOGY_STORAGE_KEY = 'sree_krushna_topology_status_v1';
  let topologyStatusOverrides = {};
  try {
    topologyStatusOverrides = JSON.parse(localStorage.getItem(TOPOLOGY_STORAGE_KEY) || '{}');
  } catch (e) {}

  function getTopologyStatus(taskId) {
    if (topologyStatusOverrides[taskId]) return topologyStatusOverrides[taskId];
    const t = TOPOLOGY_TASKS.find(x => x.id === taskId);
    if (!t) return 'LOCKED';
    if (t.status === 'DONE') return 'DONE';
    if (!t.depends_on || !t.depends_on.length) return 'READY';
    const allPrereqsDone = t.depends_on.every(depId => getTopologyStatus(depId) === 'DONE');
    return allPrereqsDone ? 'READY' : 'LOCKED';
  }

  function toggleTopologyStatus(taskId, event) {
    if (event) event.stopPropagation();
    const current = getTopologyStatus(taskId);
    const nextMap = { 'LOCKED': 'READY', 'READY': 'ACTIVE', 'ACTIVE': 'DONE', 'DONE': 'READY', 'HOLD': 'READY' };
    const nextStatus = nextMap[current] || 'READY';
    topologyStatusOverrides[taskId] = nextStatus;
    try {
      localStorage.setItem(TOPOLOGY_STORAGE_KEY, JSON.stringify(topologyStatusOverrides));
    } catch (e) {}
    renderDoPkosStudio();
  }

  function getTopologyPredecessors(taskId, visited = new Set()) {
    const t = TOPOLOGY_TASKS.find(x => x.id === taskId);
    if (!t || !t.depends_on) return visited;
    t.depends_on.forEach(depId => {
      if (!visited.has(depId)) {
        visited.add(depId);
        getTopologyPredecessors(depId, visited);
      }
    });
    return visited;
  }

  function getTopologySuccessors(taskId, visited = new Set()) {
    TOPOLOGY_TASKS.forEach(t => {
      if ((t.depends_on || []).includes(taskId) && !visited.has(t.id)) {
        visited.add(t.id);
        getTopologySuccessors(t.id, visited);
      }
    });
    return visited;
  }

  function selectTopologyNode(taskId) {
    if (selectedTopologyTaskId === taskId) {
      selectedTopologyTaskId = null;
    } else {
      selectedTopologyTaskId = taskId;
    }
    renderDoPkosStudio();
    if (selectedTopologyTaskId && window.openTaskConsole) {
      window.openTaskConsole(taskId);
    }
  }

  function clearTopologySelection() {
    selectedTopologyTaskId = null;
    renderDoPkosStudio();
  }

  function setDopkosView(viewName) {
    currentDopkosView = viewName;
    syncDopkosViewButtons();
    renderDoPkosStudio();
  }

  function syncDopkosViewButtons() {
    document.querySelectorAll('.dopkos-view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === ('btn-view-' + currentDopkosView.toLowerCase()));
    });
  }

  function filterDopkosEvent(evtId) {
    currentDopkosEvent = evtId;
    document.querySelectorAll('.dopkos-event-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-event') === evtId);
    });
    renderDoPkosStudio();
  }

  function filterDopkosTrack(trackId) {
    currentDopkosTrack = trackId;
    document.querySelectorAll('.dopkos-track-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-track') === trackId);
    });
    renderDoPkosStudio();
  }

  function renderDoPkosStudio() {
    const container = document.getElementById('dopkos-canvas-container');
    if (!container) return;

    syncDopkosViewButtons();

    if (currentDopkosView === 'TOPOLOGY') {
      renderDopkosTopology(container);
    } else if (currentDopkosView === 'THREADS') {
      if (window.renderDopkosThreads) window.renderDopkosThreads(container);
    } else if (currentDopkosView === 'RUNSHEET') {
      renderDopkosRunSheet(container);
    } else if (currentDopkosView === 'ROADMAP') {
      renderDopkosRoadmap(container);
    } else if (currentDopkosView === 'MATRIX') {
      renderDopkosMatrix(container);
    } else if (currentDopkosView === 'CRITICAL') {
      renderDopkosCritical(container);
    }
  }

  function renderDopkosTopology(container) {
    const CARD_W = 158;
    const CARD_H = 78;
    const COL_W = 184;
    const ROW_H = 94;
    const LABEL_W = 100;
    const HEADER_H = 44;

    const numCols = TOPOLOGY_STAGES.length;
    const numRows = TOPOLOGY_TRACKS.length;
    const totalWidth = LABEL_W + numCols * COL_W;
    const totalHeight = HEADER_H + numRows * ROW_H;

    const preds = selectedTopologyTaskId ? getTopologyPredecessors(selectedTopologyTaskId) : new Set();
    const succs = selectedTopologyTaskId ? getTopologySuccessors(selectedTopologyTaskId) : new Set();
    const isSelectionActive = !!selectedTopologyTaskId;

    const taskCoords = {};
    TOPOLOGY_TASKS.forEach(t => {
      const rowIndex = TOPOLOGY_TRACKS.findIndex(tr => tr.id === t.track);
      const colIndex = t.col !== undefined ? t.col : (t.stage - 1);
      const x = LABEL_W + colIndex * COL_W + 12;
      const y = HEADER_H + rowIndex * ROW_H + 8;
      taskCoords[t.id] = { x, y, colIndex, rowIndex };
    });

    let headerHtml = '<div style="display: flex; height: ' + HEADER_H + 'px; border-bottom: 2px solid var(--border-subtle); position: sticky; top: 0; background: var(--bg-surface-elevated); z-index: 30;">' +
      '<div style="width: ' + LABEL_W + 'px; flex-shrink: 0; border-right: 1px solid var(--border-subtle); background: var(--bg-surface-elevated); font-size: 0.72rem; font-weight: 800; color: var(--gold-bright); display: flex; align-items: center; justify-content: center; text-transform: uppercase;">' +
        'TRACK / STAGE' +
      '</div>';
    TOPOLOGY_STAGES.forEach(s => {
      headerHtml += '<div style="width: ' + COL_W + 'px; flex-shrink: 0; border-right: 1px solid var(--border-subtle); padding: 6px 10px; display: flex; flex-direction: column; justify-content: center;">' +
        '<span style="font-size: 0.68rem; font-weight: 700; color: var(--gold-bright); text-transform: uppercase;">STAGE ' + s.num + '</span>' +
        '<span style="font-size: 0.72rem; color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + (s.name.split(':')[1] || s.name) + '</span>' +
      '</div>';
    });
    headerHtml += '</div>';

    let rowsHtml = '';
    TOPOLOGY_TRACKS.forEach((track) => {
      rowsHtml += '<div style="display: flex; height: ' + ROW_H + 'px; border-bottom: 1px solid var(--border-subtle); background: ' + track.bg + ';">' +
        '<div style="width: ' + LABEL_W + 'px; flex-shrink: 0; border-right: 2px solid ' + track.color + '; background: var(--bg-surface-elevated); padding: 8px 6px; display: flex; flex-direction: column; justify-content: center; position: sticky; left: 0; z-index: 20;">' +
          '<span style="font-size: 0.76rem; font-weight: 800; color: ' + track.color + ';">' + track.label + '</span>' +
          '<span style="font-size: 0.65rem; color: var(--text-dim);">' + track.id.toUpperCase() + '</span>' +
        '</div>' +
        '<div style="flex: 1; display: flex;">' +
          TOPOLOGY_STAGES.map(() => '<div style="width: ' + COL_W + 'px; flex-shrink: 0; border-right: 1px dashed rgba(255,255,255,0.05);"></div>').join('') +
        '</div>' +
      '</div>';
    });

    let svgEdgesHtml = '';
    TOPOLOGY_TASKS.forEach(t => {
      const toCoord = taskCoords[t.id];
      if (!toCoord) return;

      (t.depends_on || []).forEach(fromId => {
        const fromCoord = taskCoords[fromId];
        if (!fromCoord) return;

        const x1 = fromCoord.x + CARD_W;
        const y1 = fromCoord.y + CARD_H / 2;
        const x2 = toCoord.x;
        const y2 = toCoord.y + CARD_H / 2;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const pathD = 'M ' + x1 + ' ' + y1 + ' C ' + midX + ' ' + y1 + ', ' + midX + ' ' + y2 + ', ' + x2 + ' ' + y2;

        const isEdgeActive = isSelectionActive && (
          (t.id === selectedTopologyTaskId && preds.has(fromId)) ||
          (fromId === selectedTopologyTaskId && succs.has(t.id)) ||
          (preds.has(fromId) && preds.has(t.id)) ||
          (succs.has(fromId) && succs.has(t.id))
        );

        const strokeColor = isEdgeActive 
          ? (succs.has(t.id) ? '#38bdf8' : '#f59e0b') 
          : (isSelectionActive ? 'rgba(255,255,255,0.06)' : 'rgba(245, 197, 24, 0.35)');
        const strokeWidth = isEdgeActive ? 3.2 : 1.5;
        const strokeDash = isEdgeActive ? 'none' : (t.is_gate ? '5,3' : 'none');

        let gateLabel = '';
        if (t.is_gate && (isEdgeActive || !isSelectionActive)) {
          gateLabel = '<text x="' + midX + '" y="' + (midY - 5) + '" font-size="9" fill="#f59e0b" font-weight="700" text-anchor="middle" letter-spacing="0.5">🔒 SEALING GATE</text>';
        }

        svgEdgesHtml += '<g class="dep-edge" data-from="' + fromId + '" data-to="' + t.id + '">' +
          '<path d="' + pathD + '" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" fill="none" stroke-dasharray="' + strokeDash + '" />' +
          gateLabel +
        '</g>';
      });
    });

    let cardsHtml = '';
    TOPOLOGY_TASKS.forEach(t => {
      const coord = taskCoords[t.id];
      if (!coord) return;

      const isSelected = t.id === selectedTopologyTaskId;
      const isPred = preds.has(t.id);
      const isSucc = succs.has(t.id);
      const isDimmed = isSelectionActive && !isSelected && !isPred && !isSucc;
      const status = getTopologyStatus(t.id);

      let cardBorder = 'border: 1px solid var(--border-subtle);';
      let cardBg = 'background: var(--bg-surface);';
      let cardGlow = '';
      let zIndex = 2;

      if (isSelected) {
        cardBorder = 'border: 2px solid var(--gold-bright);';
        cardBg = 'background: rgba(245, 197, 24, 0.15);';
        cardGlow = 'box-shadow: 0 0 16px rgba(245, 197, 24, 0.45);';
        zIndex = 10;
      } else if (isPred) {
        cardBorder = 'border: 2px solid #f59e0b;';
        cardBg = 'background: rgba(245, 158, 11, 0.12);';
        cardGlow = 'box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);';
        zIndex = 9;
      } else if (isSucc) {
        cardBorder = 'border: 2px solid #38bdf8;';
        cardBg = 'background: rgba(56, 189, 248, 0.12);';
        cardGlow = 'box-shadow: 0 0 12px rgba(56, 189, 248, 0.35);';
        zIndex = 9;
      } else if (isDimmed) {
        cardBorder = 'border: 1px solid rgba(255,255,255,0.06);';
        cardBg = 'background: rgba(15, 22, 36, 0.3); opacity: 0.35; filter: grayscale(0.8);';
      }

      const trackColor = TOPOLOGY_TRACKS.find(tr => tr.id === t.track)?.color || '#fff';
      const statusColors = {
        'DONE': 'color: var(--emerald-royal); background: rgba(16, 185, 129, 0.15); border-color: var(--emerald-royal);',
        'READY': 'color: var(--gold-bright); background: rgba(245, 197, 24, 0.15); border-color: var(--gold-bright);',
        'ACTIVE': 'color: #38bdf8; background: rgba(56, 189, 248, 0.15); border-color: #38bdf8;',
        'HOLD': 'color: var(--crimson-royal); background: rgba(230, 57, 70, 0.15); border-color: var(--crimson-royal);',
        'LOCKED': 'color: var(--text-dim); background: var(--bg-surface-elevated); border-color: var(--border-subtle);'
      };

      const statusStyle = statusColors[status] || statusColors['LOCKED'];

      cardsHtml += '<div class="task-card-node" style="position: absolute; left: ' + coord.x + 'px; top: ' + coord.y + 'px; width: ' + CARD_W + 'px; height: ' + CARD_H + 'px; ' + cardBg + ' ' + cardBorder + ' ' + cardGlow + ' border-left: 3px solid ' + trackColor + '; border-radius: 4px; padding: 6px 8px; cursor: pointer; z-index: ' + zIndex + '; transition: all 0.2s ease;" onclick="selectTopologyNode(\'' + t.id + '\')">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">' +
          '<span style="font-family: monospace; font-size: 0.68rem; font-weight: 800; color: var(--gold-bright);">' + t.id + '</span>' +
          '<button onclick="toggleTopologyStatus(\'' + t.id + '\', event)" class="status-pill" style="font-size: 0.62rem; font-weight: 700; padding: 1px 6px; border-radius: 3px; border: 1px solid; cursor: pointer; ' + statusStyle + '" title="Click to toggle status (READY -> ACTIVE -> DONE)">' +
            (status === 'DONE' ? '✓ DONE' : status) +
          '</button>' +
        '</div>' +
        '<div style="font-size: 0.76rem; font-weight: 700; color: var(--text-main); line-height: 1.25; max-height: 2.5em; overflow: hidden;">' + t.name + '</div>' +
        '<div style="margin-top: 4px; font-size: 0.65rem; color: var(--text-dim); display: flex; justify-content: space-between;">' +
          '<span>' + (t.depends_on.length ? 'Prereqs: ' + t.depends_on.length : 'Start Node') + '</span>' +
          (isSelected ? '<span style="color: var(--gold-bright); font-weight: 800;">ACTIVE</span>' : '') +
          (isPred ? '<span style="color: #f59e0b; font-weight: 800;">BLOCKER</span>' : '') +
          (isSucc ? '<span style="color: #38bdf8; font-weight: 800;">UNLOCKS</span>' : '') +
        '</div>' +
      '</div>';
    });

    let breadcrumbsRibbon = '';
    if (selectedTopologyTaskId) {
      const selTask = TOPOLOGY_TASKS.find(x => x.id === selectedTopologyTaskId);
      const predsList = Array.from(preds).map(id => TOPOLOGY_TASKS.find(x => x.id === id)).filter(Boolean);
      const succsList = Array.from(succs).map(id => TOPOLOGY_TASKS.find(x => x.id === id)).filter(Boolean);

      breadcrumbsRibbon = '<div style="background: linear-gradient(135deg, rgba(245, 197, 24, 0.12), var(--bg-surface-elevated)); border: 1px solid var(--gold-antique); border-radius: var(--radius-md); padding: 10px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">' +
        '<div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">' +
          '<span style="font-weight: 800; color: var(--gold-bright); font-size: 0.85rem;">📍 Focus: <strong>' + selTask.id + ': ' + selTask.name + '</strong></span>' +
          '<span style="color: var(--text-dim); font-size: 0.76rem;">|</span>' +
          '<span style="font-size: 0.76rem; color: #f59e0b;">⛔ Blocked by: ' + (predsList.map(p => '<strong style="cursor: pointer; text-decoration: underline;" onclick="selectTopologyNode(\'' + p.id + '\')">' + p.id + '</strong>').join(', ') || '<span style="color: var(--emerald-royal);">None (Ready to Start)</span>') + '</span>' +
          '<span style="color: var(--text-dim); font-size: 0.76rem;">──></span>' +
          '<span style="font-size: 0.76rem; color: #38bdf8;">🔓 Unlocks: ' + (succsList.map(s => '<strong style="cursor: pointer; text-decoration: underline;" onclick="selectTopologyNode(\'' + s.id + '\')">' + s.id + '</strong>').join(', ') || 'Terminal Node') + '</span>' +
        '</div>' +
        '<div style="display: flex; gap: 6px;">' +
          '<button class="btn btn-primary" onclick="openTaskConsole(\'' + selectedTopologyTaskId + '\')" style="font-size: 0.72rem; padding: 4px 12px; background: var(--gold-gradient); color: #080b11; font-weight: 700;">🔍 Open Console</button>' +
          '<button class="theme-toggle-btn" onclick="clearTopologySelection()" style="font-size: 0.72rem; padding: 4px 10px; background: var(--bg-surface);">✕ Reset</button>' +
        '</div>' +
      '</div>';
    } else {
      breadcrumbsRibbon = '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: rgba(15, 22, 36, 0.6); padding: 8px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 8px;">' +
        '<div style="font-size: 0.78rem; color: var(--text-muted);">' +
          '💡 <strong>Sacred Precedence DAG Engine:</strong> Click any card to highlight its complete upstream blockers (<span style="color: #f59e0b; font-weight: 700;">Amber Predecessors</span>) & downstream unlocks (<span style="color: #38bdf8; font-weight: 700;">Blue Successors</span>). Click status pills to toggle state!' +
        '</div>' +
      '</div>';
    }

    container.innerHTML = breadcrumbsRibbon +
      '<div id="topology-scroll-viewport" style="overflow: auto; max-height: 620px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); position: relative; background: #080b11;">' +
        '<div style="position: relative; width: ' + totalWidth + 'px; height: ' + totalHeight + 'px;">' +
          headerHtml +
          rowsHtml +
          '<svg style="position: absolute; top: 0; left: 0; width: ' + totalWidth + 'px; height: ' + totalHeight + 'px; pointer-events: none; z-index: 5;">' +
            svgEdgesHtml +
          '</svg>' +
          cardsHtml +
        '</div>' +
      '</div>';
  }

  function renderDopkosRunSheet(container) {
    let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';

    DAY_OF_SCHEDULE.forEach((slot) => {
      let gateBanner = '';
      if (slot.gate) {
        gateBanner = '<div style="background: linear-gradient(90deg, rgba(245, 197, 24, 0.2), var(--bg-surface-elevated)); border-left: 4px solid var(--gold-bright); padding: 10px 16px; border-radius: var(--radius-sm); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">' +
          '<span style="font-size: 0.85rem; font-weight: 800; color: var(--gold-bright); font-family: var(--font-display);">🔒 ' + slot.gate + '</span>' +
          '<span class="status-badge status-urgent" style="font-size: 0.72rem;">HARD GATE</span>' +
        '</div>';
      }

      let trackCards = '';
      Object.keys(slot.tracks).forEach((tk) => {
        const item = slot.tracks[tk];
        const tkMeta = TOPOLOGY_TRACKS.find(t => t.id === tk) || { label: tk.toUpperCase(), color: '#fff' };
        trackCards += '<div style="flex: 1; min-width: 170px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-top: 3px solid ' + tkMeta.color + '; border-radius: var(--radius-sm); padding: 10px;">' +
          '<div style="font-size: 0.72rem; color: ' + tkMeta.color + '; font-weight: 700; margin-bottom: 4px;">' + tkMeta.label + '</div>' +
          '<div style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); line-height: 1.3;">' + item.task + '</div>' +
          '<div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">' +
            '<span style="font-size: 0.7rem; color: var(--text-dim);">👤 ' + item.lead + '</span>' +
            '<span class="status-badge" style="font-size: 0.65rem; background: var(--bg-surface-elevated);">' + item.status + '</span>' +
          '</div>' +
        '</div>';
      });

      html += '<div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">' +
        gateBanner +
        '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">' +
          '<span style="font-family: monospace; font-size: 1.1rem; font-weight: 800; color: var(--gold-bright); background: rgba(245, 197, 24, 0.1); padding: 2px 8px; border-radius: var(--radius-sm);">' + slot.time + '</span>' +
          '<h4 style="margin: 0; font-size: 0.95rem; color: var(--text-main); font-weight: 700;">' + slot.label + '</h4>' +
        '</div>' +
        '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' +
          trackCards +
        '</div>' +
      '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  function renderDopkosRoadmap(container) {
    let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';

    MACRO_ROADMAP.forEach(h => {
      let taskChips = h.tasks.map(tId => {
        const t = TOPOLOGY_TASKS.find(x => x.id === tId) || { id: tId, name: tId, status: 'READY' };
        return '<div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; min-width: 220px; flex: 1;">' +
          '<div>' +
            '<span style="font-family: monospace; font-size: 0.72rem; font-weight: 800; color: var(--gold-bright);">' + t.id + '</span>' +
            '<div style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">' + t.name + '</div>' +
          '</div>' +
          '<span class="status-badge" style="font-size: 0.65rem;">' + t.status + '</span>' +
        '</div>';
      }).join('');

      html += '<div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">' +
          '<h3 style="margin: 0; font-size: 1rem; color: var(--gold-bright); font-family: var(--font-display);">' + h.name + '</h3>' +
          '<span style="font-family: monospace; font-size: 0.78rem; color: var(--text-dim); background: var(--bg-surface); padding: 2px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">' + h.period + '</span>' +
        '</div>' +
        '<p style="font-size: 0.82rem; color: var(--text-muted); margin: 0 0 12px 0;">' + h.desc + '</p>' +
        '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' +
          taskChips +
        '</div>' +
      '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  function renderDopkosMatrix(container) {
    let thead = '<th style="padding: 10px; text-align: left; background: var(--bg-surface-elevated); color: var(--gold-bright); font-size: 0.76rem; border-bottom: 2px solid var(--border-subtle); position: sticky; left: 0; z-index: 10;">ROLE / TRACK</th>';
    TOPOLOGY_STAGES.forEach(s => {
      thead += '<th style="padding: 10px; text-align: left; background: var(--bg-surface-elevated); color: var(--gold-bright); font-size: 0.76rem; border-bottom: 2px solid var(--border-subtle); min-width: 160px;">' + s.name + '</th>';
    });

    let tbody = '';
    TOPOLOGY_TRACKS.forEach(tr => {
      let rowCells = '<td style="padding: 10px; background: var(--bg-surface-elevated); border-right: 2px solid ' + tr.color + '; position: sticky; left: 0; z-index: 5;">' +
        '<div style="font-weight: 700; color: ' + tr.color + '; font-size: 0.82rem;">' + tr.label + '</div>' +
        '<div style="font-size: 0.68rem; color: var(--text-dim);">' + tr.id.toUpperCase() + '</div>' +
      '</td>';

      TOPOLOGY_STAGES.forEach((st, sIndex) => {
        const tasksInSlot = TOPOLOGY_TASKS.filter(t => t.track === tr.id && (t.col !== undefined ? t.col === sIndex : t.stage === st.num));
        let slotContent = '';
        if (tasksInSlot.length) {
          slotContent = tasksInSlot.map(t => {
            const status = getTopologyStatus(t.id);
            return '<div onclick="selectTopologyNode(\'' + t.id + '\')" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 6px 8px; margin-bottom: 4px; cursor: pointer;">' +
              '<div style="font-family: monospace; font-size: 0.68rem; color: var(--gold-bright); font-weight: 700;">' + t.id + '</div>' +
              '<div style="font-size: 0.76rem; color: var(--text-main); font-weight: 600; line-height: 1.2;">' + t.name + '</div>' +
              '<div style="font-size: 0.65rem; color: var(--emerald-royal); margin-top: 2px;">' + status + '</div>' +
            '</div>';
          }).join('');
        } else {
          slotContent = '<div style="font-size: 0.7rem; color: var(--text-dim); font-style: italic;">No tasks</div>';
        }
        rowCells += '<td style="padding: 8px; border-bottom: 1px solid var(--border-subtle); border-right: 1px dashed rgba(255,255,255,0.05); vertical-align: top;">' + slotContent + '</td>';
      });

      tbody += '<tr>' + rowCells + '</tr>';
    });

    container.innerHTML = '<div style="overflow-x: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">' +
      '<table style="width: 100%; border-collapse: collapse;">' +
        '<thead><tr>' + thead + '</tr></thead>' +
        '<tbody>' + tbody + '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderDopkosCritical(container) {
    const criticalChain = [
      { id: 'GOV-001', name: 'Chief Purohit Lagna Lock', horizon: 'T-180', owner: 'Chief Purohit' },
      { id: 'RIT-001', name: 'Vidhi-Patra Signoff', horizon: 'T-120', owner: 'Purohit + Elders' },
      { id: 'GFT-001', name: 'Deva Nimantrana at Puri Jagannath', horizon: 'T-90', owner: 'Groom Lead' },
      { id: 'RIT-004', name: 'Patra Paribartana Vows (Rayagada)', horizon: 'T-14', owner: 'Bride + Groom Family' },
      { id: 'GATE-02', name: 'Baranugam Arch Welcome & Barat', horizon: 'Day 0 (07:30)', owner: 'Chief Purohit' },
      { id: 'GATE-03', name: 'Kanyadaan & Hastaganthi Sacred Knot', horizon: 'Day 0 (08:00)', owner: 'Chief Purohit + Elders' },
      { id: 'GATE-04', name: 'Sindoor Daan & Mukuta Coronation', horizon: 'Day 0 (08:45)', owner: 'Groom + Bride' },
      { id: 'LEG-001', name: 'SUJOG Legal Marriage Registration', horizon: 'Day +30', owner: 'Legal Team' }
    ];

    let stepsHtml = '';
    criticalChain.forEach((c, idx) => {
      const isLast = idx === criticalChain.length - 1;
      stepsHtml += '<div style="display: flex; gap: 16px; position: relative;">' +
        '<div style="display: flex; flex-direction: column; align-items: center;">' +
          '<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--gold-gradient); color: #080b11; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; z-index: 2;">' +
            (idx + 1) +
          '</div>' +
          (!isLast ? '<div style="width: 2px; flex: 1; background: var(--gold-antique); margin: 4px 0;"></div>' : '') +
        '</div>' +
        '<div style="flex: 1; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-left: 3px solid var(--gold-bright); border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 12px;">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">' +
            '<span style="font-family: monospace; font-size: 0.78rem; font-weight: 800; color: var(--gold-bright);">' + c.id + '</span>' +
            '<span style="font-size: 0.72rem; color: var(--text-dim);">' + c.horizon + '</span>' +
          '</div>' +
          '<div style="font-size: 0.9rem; font-weight: 700; color: var(--text-main);">' + c.name + '</div>' +
          '<div style="font-size: 0.74rem; color: var(--text-dim); margin-top: 4px;">Responsible Lead: ' + c.owner + '</div>' +
        '</div>' +
      '</div>';
    });

    container.innerHTML = '<div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">' +
      '<div style="margin-bottom: 16px;">' +
        '<h3 style="margin: 0 0 4px 0; color: var(--gold-bright); font-size: 1.15rem; font-family: var(--font-display);">⚡ Sacred Liturgical Critical Path (Zero-Slack Chain)</h3>' +
        '<p style="margin: 0; font-size: 0.82rem; color: var(--text-muted);">The non-negotiable liturgical and legal milestones governing the wedding timeline. Any delay on this chain directly delays the sacred Lagna Muhurat.</p>' +
      '</div>' +
      '<div style="display: flex; flex-direction: column;">' +
        stepsHtml +
      '</div>' +
    '</div>';
  }

  // Export to global window
  window.TOPOLOGY_TRACKS = TOPOLOGY_TRACKS;
  window.TOPOLOGY_STAGES = TOPOLOGY_STAGES;
  window.TOPOLOGY_TASKS = TOPOLOGY_TASKS;
  window.DAY_OF_SCHEDULE = DAY_OF_SCHEDULE;
  window.MACRO_ROADMAP = MACRO_ROADMAP;
  window.selectTopologyNode = selectTopologyNode;
  window.clearTopologySelection = clearTopologySelection;
  window.toggleTopologyStatus = toggleTopologyStatus;
  window.setDopkosView = setDopkosView;
  window.filterDopkosEvent = filterDopkosEvent;
  window.filterDopkosTrack = filterDopkosTrack;
  window.renderDoPkosStudio = renderDoPkosStudio;

})(window);
