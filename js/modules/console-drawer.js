/**
 * Sree Krushna Marriage OS — Task Console Drawer Engine
 * Module: js/modules/console-drawer.js
 */
(function(window) {
  'use strict';

  let currentConsoleTaskId = null;
  const CHECKLIST_STORAGE_KEY = 'sree_krushna_checklist_state_v1';
  let checklistState = {};
  try {
    checklistState = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}');
  } catch (e) {}

  function openTaskConsole(taskId) {
    currentConsoleTaskId = taskId;
    const drawer = document.getElementById('console-drawer');
    const backdrop = document.getElementById('console-backdrop');
    if (!drawer) return;

    let task = null;
    if (window.TOPOLOGY_TASKS) task = window.TOPOLOGY_TASKS.find(t => t.id === taskId);
    if (!task && window.allTasks) task = window.allTasks.find(t => t.id === taskId);
    if (!task && window.currentTasks) task = window.currentTasks.find(t => t.id === taskId);

    if (!task) {
      task = {
        id: taskId,
        name: 'Task ' + taskId,
        track: 'purohit',
        stage: 1,
        status: 'READY',
        depends_on: []
      };
    }

    const idTag = document.getElementById('drawer-id-tag');
    const titleEl = document.getElementById('drawer-title');
    const descEl = document.getElementById('drawer-desc');
    const timetagEl = document.getElementById('drawer-timetag');
    const wbsEl = document.getElementById('drawer-wbs');

    if (idTag) idTag.textContent = task.id;
    if (titleEl) titleEl.textContent = task.name;
    if (descEl) descEl.textContent = task.desc || task.notes || ('Operational wedding execution task for Stage ' + (task.stage || 1) + ' (' + (task.track ? task.track.toUpperCase() : 'GENERAL') + ').');
    if (timetagEl) timetagEl.textContent = task.time || ('Stage ' + (task.stage || 1) + ' Horizon');
    if (wbsEl) wbsEl.textContent = task.wbs || ('WBS-' + (task.stage || 1) + '.' + (task.col !== undefined ? task.col + 1 : '0'));

    const leadNameEl = document.getElementById('drawer-lead-name');
    const leadRoleEl = document.getElementById('drawer-lead-role');
    const callBtn = document.getElementById('drawer-call-btn');
    const waBtn = document.getElementById('drawer-wa-btn');

    const leadInfo = getLeadForTrack(task.track || 'purohit');
    if (leadNameEl) leadNameEl.textContent = leadInfo.name;
    if (leadRoleEl) leadRoleEl.textContent = leadInfo.role;

    if (callBtn) {
      callBtn.href = 'tel:' + leadInfo.phone;
      callBtn.style.display = leadInfo.phone ? 'inline-flex' : 'none';
    }
    if (waBtn) {
      const waText = encodeURIComponent('Namaskar ' + leadInfo.name + ', regarding Sree Krushna Marriage OS Task [' + task.id + ': ' + task.name + ']: ');
      waBtn.href = 'https://wa.me/' + leadInfo.phone.replace(/[^0-9]/g, '') + '?text=' + waText;
      waBtn.style.display = leadInfo.phone ? 'inline-flex' : 'none';
    }

    renderConsoleChecklist(task);
    renderConsoleLinkedPills(task);

    drawer.classList.add('open', 'active');
    if (backdrop) backdrop.classList.add('open', 'active');
  }

  function closeTaskConsole() {
    const drawer = document.getElementById('console-drawer');
    const backdrop = document.getElementById('console-backdrop');
    if (drawer) drawer.classList.remove('open', 'active');
    if (backdrop) backdrop.classList.remove('open', 'active');
    currentConsoleTaskId = null;
  }

  function getLeadForTrack(track) {
    const leads = {
      'bride': { name: 'Pooja (Bride Lead) & Shashi Rekha', role: 'Bridal Trousseau, Mukuta & Rites', phone: '+919437000001' },
      'groom': { name: 'Groom Operations Lead', role: 'Vedic Attire, Barat & Groom Escort', phone: '+919437000002' },
      'purohit': { name: 'Chief Purohit (Raghunath Das)', role: 'Vedic Liturgy & Sacred Lagna Muhurat', phone: '+919437000003' },
      'catering': { name: 'Odisha Royal Caterers (Debashis)', role: '21-Item Authentic Feast & Mithai', phone: '+919437000004' },
      'media': { name: 'Rayagada Creative Studios', role: '36-Q SLA Photography & 4TB Archive', phone: '+919437000005' },
      'fleet': { name: 'Logistics & Vault Security Lead', role: 'Jewellery Vault Dual-Custody & Transport', phone: '+919437000006' }
    };
    return leads[track] || leads['purohit'];
  }

  function renderConsoleChecklist(task) {
    const clContainer = document.getElementById('drawer-checklist');
    if (!clContainer) return;

    const defaultItems = [
      'Review operational blueprint for ' + task.id,
      'Verify physical prerequisites and vendor readiness',
      'Dual-custody verification with lead owner',
      'Record timestamp signoff upon physical completion'
    ];

    const items = task.checklist || defaultItems;
    const taskKey = 'cl_' + task.id;
    const savedChecks = checklistState[taskKey] || {};

    let html = '';
    items.forEach((item, index) => {
      const isChecked = !!savedChecks[index];
      html += '<label style="display: flex; align-items: flex-start; gap: 10px; padding: 6px 8px; border-radius: var(--radius-sm); background: var(--bg-surface); margin-bottom: 6px; cursor: pointer; border: 1px solid var(--border-subtle); font-size: 0.8rem; color: ' + (isChecked ? 'var(--text-dim)' : 'var(--text-main)') + '; text-decoration: ' + (isChecked ? 'line-through' : 'none') + ';">' +
        '<input type="checkbox" ' + (isChecked ? 'checked' : '') + ' onchange="toggleConsoleChecklist(\'' + task.id + '\', ' + index + ', this.checked)" style="margin-top: 2px; accent-color: var(--gold-bright);">' +
        '<span>' + item + '</span>' +
      '</label>';
    });

    clContainer.innerHTML = html;
  }

  function toggleConsoleChecklist(taskId, itemIndex, isChecked) {
    const taskKey = 'cl_' + taskId;
    if (!checklistState[taskKey]) checklistState[taskKey] = {};
    checklistState[taskKey][itemIndex] = isChecked;
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklistState));
    } catch (e) {}
    if (currentConsoleTaskId === taskId) {
      const task = (window.TOPOLOGY_TASKS || []).find(t => t.id === taskId) || { id: taskId };
      renderConsoleChecklist(task);
    }
  }

  function renderConsoleLinkedPills(task) {
    const pillsContainer = document.getElementById('drawer-linked-pills');
    if (!pillsContainer) return;

    const prereqs = task.depends_on || [];
    let successors = [];
    if (window.TOPOLOGY_TASKS) {
      successors = window.TOPOLOGY_TASKS.filter(t => (t.depends_on || []).includes(task.id)).map(t => t.id);
    }

    if (!prereqs.length && !successors.length) {
      pillsContainer.innerHTML = '<span style="font-size: 0.76rem; color: var(--text-dim);">No direct dependency linkages.</span>';
      return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 8px;">';

    if (prereqs.length) {
      html += '<div><div style="font-size: 0.72rem; font-weight: 700; color: #f59e0b; margin-bottom: 4px; text-transform: uppercase;">⛔ Pre-requisite Blockers:</div>' +
        '<div style="display: flex; gap: 6px; flex-wrap: wrap;">' +
        prereqs.map(pId => '<span class="role-pill-tag" onclick="selectTopologyNode(\'' + pId + '\'); openTaskConsole(\'' + pId + '\');" style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #f59e0b; cursor: pointer; font-size: 0.75rem;">← ' + pId + '</span>').join('') +
        '</div></div>';
    }

    if (successors.length) {
      html += '<div><div style="font-size: 0.72rem; font-weight: 700; color: #38bdf8; margin-bottom: 4px; text-transform: uppercase;">🔓 Unlocks Downstream:</div>' +
        '<div style="display: flex; gap: 6px; flex-wrap: wrap;">' +
        successors.map(sId => '<span class="role-pill-tag" onclick="selectTopologyNode(\'' + sId + '\'); openTaskConsole(\'' + sId + '\');" style="background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; cursor: pointer; font-size: 0.75rem;">→ ' + sId + '</span>').join('') +
        '</div></div>';
    }

    html += '</div>';
    pillsContainer.innerHTML = html;
  }

  window.openTaskConsole = openTaskConsole;
  window.closeTaskConsole = closeTaskConsole;
  window.toggleConsoleChecklist = toggleConsoleChecklist;

})(window);
