window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-XXXXXXXXXX", {
      send_page_view: true,
      cookie_flags: "SameSite=None;Secure",
    });
  


    // Progressive Web App Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('Service Worker registration skipped/failed', err));
      });
    }

    // Sticky Header Scroll Compressor Engine
    const stickyShell = document.getElementById('stickyHeaderShell');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            stickyShell.classList.add('is-scrolled');
          } else {
            stickyShell.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Theme Management Engine
    function syncThemeButton() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const icon = document.getElementById('themeToggleIcon');
      const text = document.getElementById('themeToggleText');
      const metaThemeColor = document.getElementById('meta-theme-color');
      
      if (currentTheme === 'dark') {
        if (icon) icon.innerText = '☀️';
        if (text) text.innerText = 'Light';
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#080b11');
      } else {
        if (icon) icon.innerText = '🌙';
        if (text) text.innerText = 'Dark';
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#fbf9f4');
      }
    }

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('sree_krushna_theme', nextTheme);
      syncThemeButton();
    }

    // Initialize Theme Button
    syncThemeButton();

    // ── Countdown Timer — Real Dates (IST) ──────────────────────────────────
    const CD_EVENTS = {
      engagement: { label: '💍 Engagement — 11 Feb 2027',  ms: new Date('2027-02-11T10:00:00+05:30').getTime() },
      wedding:    { label: '👑 Wedding Muhurat — 10 Mar 2027', ms: new Date('2027-03-10T08:00:00+05:30').getTime() },
      reception:  { label: '🎉 Grand Reception — 10 Mar 2027', ms: new Date('2027-03-10T19:00:00+05:30').getTime() },
    };

    let cdActiveEvent = 'engagement';

    function cdPad(n) { return String(n).padStart(2, '0'); }

    function cdFlipNum(el, newVal) {
      if (el.innerText === newVal) return;
      el.classList.add('flip');
      setTimeout(() => { el.innerText = newVal; el.classList.remove('flip'); }, 120);
    }

    function updateCountdown() {
      const evt = CD_EVENTS[cdActiveEvent];
      const now  = Date.now();
      const diff = evt.ms - now;
      const labelEl = document.getElementById('cd-next-label');

      if (diff <= 0) {
        if (labelEl) labelEl.textContent = evt.label + ' — Celebrated ✓';
        cdFlipNum(document.getElementById('cd-days'),  '00');
        cdFlipNum(document.getElementById('cd-hours'), '00');
        cdFlipNum(document.getElementById('cd-mins'),  '00');
        cdFlipNum(document.getElementById('cd-secs'),  '00');
        return;
      }

      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000)  / 60000);
      const secs  = Math.floor((diff % 60000)    / 1000);

      if (labelEl) labelEl.textContent = evt.label;
      cdFlipNum(document.getElementById('cd-days'),  cdPad(days));
      cdFlipNum(document.getElementById('cd-hours'), cdPad(hours));
      cdFlipNum(document.getElementById('cd-mins'),  cdPad(mins));
      cdFlipNum(document.getElementById('cd-secs'),  cdPad(secs));
    }

    // Wire event-switcher pills
    document.querySelectorAll('.cd-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cd-pill').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        cdActiveEvent = btn.dataset.event;
        updateCountdown();
      });
    });

    setInterval(updateCountdown, 1000);
    updateCountdown();
    // ────────────────────────────────────────────────────────────────────────

    // ══════════════════════════════════════════════════════════════════════════
    // UNIFIED TASK & SWIMLANE 3-ZONE ENGINE (UG-FARMHOUSE SPECIFICATION)
    // ══════════════════════════════════════════════════════════════════════════

    // 1. Unified State Hydration (LocalStorage + Canonical Data Feed)
    const DEFAULT_TASKS = (typeof MARRIAGE_STATE !== 'undefined' && MARRIAGE_STATE.tasks) ? MARRIAGE_STATE.tasks : [];
    let currentTasks = JSON.parse(localStorage.getItem('sree_krushna_master_tasks_v4')) || DEFAULT_TASKS;

    // Active View States
    let activeStageId = 'STAGE_03'; // Default to Barat & Main Wedding Day
    let activeSwimlaneTrack = 'all';
    let swimlaneSearchQuery = '';
    let activeConsoleTaskId = null;

    function saveMasterTasks() {
      localStorage.setItem('sree_krushna_master_tasks_v4', JSON.stringify(currentTasks));
    }

    // ── Zone 1: Global KPI Bar ──────────────────────────────────────
    function updateSwimlaneKPIs() {
      const total = currentTasks.length;
      const done = currentTasks.filter(t => t.status === 'Completed' || t.done).length;
      const progress = currentTasks.filter(t => t.status === 'In-Progress').length;
      
      const elTotal = document.getElementById('swimlane-stat-total');
      const elDone = document.getElementById('swimlane-stat-done');
      const elProg = document.getElementById('swimlane-stat-progress');
      const elGates = document.getElementById('swimlane-stat-gates');

      if (elTotal) elTotal.innerText = total;
      if (elDone) elDone.innerText = done;
      if (elProg) elProg.innerText = progress;
      if (elGates) elGates.innerText = '4/4 Ready';

      // Also update Task Manager KPIs
      const kpiTot = document.getElementById('kpi-total-tasks');
      const kpiPend = document.getElementById('kpi-pending-tasks');
      const kpiDone = document.getElementById('kpi-completed-tasks');
      if (kpiTot) kpiTot.innerText = total;
      if (kpiPend) kpiPend.innerText = total - done;
      if (kpiDone) kpiDone.innerText = done;
    }

    // ── Zone 2: Interactive Stage Pipeline Strip ───────────────────
    function renderStageStrip() {
      const strip = document.getElementById('stage-strip');
      if (!strip || typeof MARRIAGE_STATE === 'undefined') return;

      strip.innerHTML = '';
      MARRIAGE_STATE.stages.forEach(s => {
        const stageTasks = currentTasks.filter(t => t.stage === s.id);
        const total = stageTasks.length;
        const completed = stageTasks.filter(t => t.status === 'Completed' || t.done).length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const isActive = (s.id === activeStageId);

        const card = document.createElement('div');
        card.className = `stage-card ${isActive ? 'active' : ''}`;
        card.setAttribute('data-testid', `stage-card-${s.id}`);
        card.setAttribute('role', 'tab');
        card.setAttribute('aria-selected', isActive ? 'true' : 'false');
        card.onclick = () => selectStage(s.id);

        card.innerHTML = `
          <div class="stage-card-header">
            <span class="stage-card-num">STAGE ${s.num}</span>
            <span class="stage-card-icon">${s.icon}</span>
          </div>
          <div class="stage-card-name">${s.name}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem; color: var(--text-muted);">
            <span>${s.timeframe}</span>
            <span style="font-weight: 700; color: ${pct === 100 ? 'var(--emerald-sacred)' : 'var(--gold-bright)'};">${pct}%</span>
          </div>
          <div class="stage-progress-bar">
            <div class="stage-progress-fill" style="width: ${pct}%; background: ${pct === 100 ? 'var(--emerald-sacred)' : 'var(--gold-gradient)'};"></div>
          </div>
        `;
        strip.appendChild(card);
      });
    }

    function updateStageIndicator() {
      const ind = document.getElementById('active-stage-indicator');
      if (!ind || typeof MARRIAGE_STATE === 'undefined') return;
      if (activeStageId === 'ALL') {
        ind.innerHTML = '📍 Viewing <strong>All 6 Wedding Stages</strong> (Full 24h Timeline)';
      } else {
        const s = MARRIAGE_STATE.stages.find(x => x.id === activeStageId);
        if (s) {
          ind.innerHTML = `📍 Viewing <strong>STAGE ${s.num}: ${s.name}</strong> (${s.timeframe})`;
        }
      }
    }

    function selectStage(stageId) {
      if (activeStageId === stageId && stageId !== 'ALL') {
        activeStageId = 'ALL';
      } else {
        activeStageId = stageId;
      }

      const resetBtn = document.getElementById('btn-show-all-stages');
      if (resetBtn) {
        resetBtn.style.display = (activeStageId !== 'ALL') ? 'inline-flex' : 'none';
      }

      updateStageIndicator();
      renderStageStrip();
      renderSwimlaneMatrix();
    }

    // ── Zone 3: 2D Multi-Track Matrix Canvas ───────────────────────
    function filterSwimlaneTrack(trackId) {
      activeSwimlaneTrack = trackId;
      document.querySelectorAll('#swimlane-track-filters .filter-pill').forEach(el => {
        if (el.dataset.track === trackId) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
      renderSwimlaneMatrix();
    }

    function onSwimlaneSearch(query) {
      swimlaneSearchQuery = query.toLowerCase().trim();
      renderSwimlaneMatrix();
    }

    function updateTrackFilterCounts() {
      if (typeof MARRIAGE_STATE === 'undefined') return;
      
      const allCount = (activeStageId === 'ALL') ? currentTasks.length : currentTasks.filter(t => t.stage === activeStageId).length;
      const allPill = document.querySelector('#swimlane-track-filters .filter-pill[data-track="all"]');
      if (allPill) allPill.innerText = `All Tracks (${allCount})`;

      MARRIAGE_STATE.tracks.forEach(tr => {
        let count = currentTasks.filter(t => t.track === tr.id);
        if (activeStageId !== 'ALL') count = count.filter(t => t.stage === activeStageId);
        const pill = document.querySelector(`#swimlane-track-filters .filter-pill[data-track="${tr.id}"]`);
        if (pill) pill.innerText = `${tr.icon} ${tr.title} (${count.length})`;
      });
    }

    function renderSwimlaneMatrix() {
      const table = document.getElementById('swimlane-matrix-table');
      if (!table || typeof MARRIAGE_STATE === 'undefined') return;

      table.innerHTML = '';
      updateTrackFilterCounts();

      // 1. Matrix Sticky Header Row
      const headerRow = document.createElement('div');
      headerRow.className = 'matrix-header-row';
      headerRow.innerHTML = `
        <div class="matrix-track-col-header">OPERATIONAL TRACK</div>
        <div class="matrix-time-bands-header">
          <span>SYNCHRONIZED ACTIVITIES & DELIVERABLES &bull; ${activeStageId !== 'ALL' ? `${activeStageId}` : 'ALL 6 STAGES'}</span>
          <span style="font-size: 0.74rem; font-weight: 500; color: var(--gold-bright);">Click node to inspect & checklist ↗</span>
        </div>
      `;
      table.appendChild(headerRow);

      // 2. Render Each Track Row
      MARRIAGE_STATE.tracks.forEach(tr => {
        if (activeSwimlaneTrack !== 'all' && tr.id !== activeSwimlaneTrack) {
          return;
        }

        // Filter tasks for this track, stage, and search query
        let trackTasks = currentTasks.filter(t => t.track === tr.id);
        if (activeStageId !== 'ALL') {
          trackTasks = trackTasks.filter(t => t.stage === activeStageId);
        }
        if (swimlaneSearchQuery) {
          trackTasks = trackTasks.filter(t => 
            t.title.toLowerCase().includes(swimlaneSearchQuery) ||
            t.id.toLowerCase().includes(swimlaneSearchQuery) ||
            (t.lead && t.lead.toLowerCase().includes(swimlaneSearchQuery)) ||
            (t.desc && t.desc.toLowerCase().includes(swimlaneSearchQuery))
          );
        }

        const row = document.createElement('div');
        row.className = `matrix-row matrix-row-${tr.id}`;
        row.setAttribute('data-testid', `matrix-row-${tr.id}`);

        // Left Track Header
        const labelCol = document.createElement('div');
        labelCol.className = 'matrix-row-label';
        labelCol.style.borderLeft = `4px solid ${tr.color}`;
        labelCol.innerHTML = `
          <div class="matrix-row-track-title" style="color: ${tr.color};">
            <span>${tr.icon}</span> ${tr.title}
          </div>
          <div class="matrix-row-lead">Lead: ${tr.lead}</div>
          <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">
            ${trackTasks.length} active node${trackTasks.length === 1 ? '' : 's'}
          </div>
        `;
        row.appendChild(labelCol);

        // Right Nodes Column
        const nodesCol = document.createElement('div');
        nodesCol.className = 'matrix-row-nodes';

        if (trackTasks.length === 0) {
          nodesCol.innerHTML = `
            <div style="font-size: 0.84rem; color: var(--text-dim); font-style: italic; padding: 16px; display: flex; align-items: center; gap: 8px;">
              <span>ℹ️</span> No operational activities scheduled in ${activeStageId} for ${tr.title}.
            </div>
          `;
        } else {
          trackTasks.forEach(t => {
            const isDone = (t.status === 'Completed' || t.done);
            const totalChecks = (t.checklist && t.checklist.length) || 0;
            const doneChecks = totalChecks > 0 ? t.checklist.filter(c => c.done).length : (isDone ? 1 : 0);

            const node = document.createElement('div');
            node.className = `event-node ${isDone ? 'is-completed' : ''}`;
            node.style.borderLeft = `3px solid ${tr.color}`;
            node.setAttribute('data-testid', `swimlane-node-${t.id}`);
            node.onclick = () => openTaskConsole(t.id);

            node.innerHTML = `
              <div class="node-top">
                <span class="node-time">${t.timeTag || 'Day-Of'}</span>
                <div style="display: flex; gap: 4px; align-items: center;">
                  ${t.gate ? `<span class="gate-badge" data-testid="gate-badge-${t.gate}">${t.gate}</span>` : ''}
                  <span class="node-id-badge">${t.id}</span>
                </div>
              </div>
              <div class="event-title">${t.title}</div>
              <div class="node-bottom">
                <span class="node-lead">${t.lead || tr.lead}</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  ${totalChecks > 0 ? `<span style="font-size: 0.68rem; font-weight: 700; color: ${doneChecks === totalChecks ? 'var(--emerald-sacred)' : 'var(--gold-bright)'};">✓ ${doneChecks}/${totalChecks}</span>` : ''}
                  <span class="node-status-pill ${isDone ? 'node-status-completed' : t.status === 'In-Progress' ? 'node-status-progress' : 'node-status-planned'}">
                    ${isDone ? 'Done ✓' : t.status || 'Planned'}
                  </span>
                </div>
              </div>
            `;
            nodesCol.appendChild(node);
          });
        }

        row.appendChild(nodesCol);
        table.appendChild(row);
      });

      updateSwimlaneKPIs();
    }

    // ── Slide-Over Console Drawer (UG-Farmhouse Task Inspector) ─────
    function openTaskConsole(taskId) {
      activeConsoleTaskId = taskId;
      const t = currentTasks.find(x => x.id === taskId);
      if (!t) return;

      // Populate Header & Info
      document.getElementById('drawer-id-tag').innerText = t.id;
      document.getElementById('drawer-title').innerText = t.title;
      document.getElementById('drawer-desc').innerText = t.desc || 'No detailed deliverable notes recorded.';
      document.getElementById('drawer-timetag').innerText = t.timeTag || 'Scheduled Timeline Node';
      document.getElementById('drawer-wbs').innerText = t.wbs || t.id;

      // Resolve Lead Owner & Direct Dial
      let leadName = t.lead || 'Planning Committee';
      let leadRole = 'Operational Coordinator';
      let leadPhone = '+91 98765 00000';

      const match = leadName.match(/PER-\d+/);
      if (match && MARRIAGE_STATE.people && MARRIAGE_STATE.people[match[0]]) {
        const p = MARRIAGE_STATE.people[match[0]];
        leadName = `${match[0]} — ${p.name}`;
        leadRole = p.role;
        leadPhone = p.phone;
      }

      document.getElementById('drawer-lead-name').innerText = leadName;
      document.getElementById('drawer-lead-role').innerText = leadRole;
      
      const cleanPhone = leadPhone.replace(/[\s\-\+]/g, '');
      document.getElementById('drawer-call-btn').href = `tel:${leadPhone}`;
      document.getElementById('drawer-wa-btn').href = `https://wa.me/${cleanPhone}?text=Namaskar%2C%20regarding%20task%20${t.id}%20(${encodeURIComponent(t.title)})`;

      // Render Dynamic Verification Checklist
      const checkContainer = document.getElementById('drawer-checklist');
      checkContainer.innerHTML = '';
      if (t.checklist && t.checklist.length > 0) {
        t.checklist.forEach((item, idx) => {
          const row = document.createElement('label');
          row.className = 'checklist-row';
          row.innerHTML = `
            <input type="checkbox" class="checklist-checkbox" ${item.done ? 'checked' : ''} onchange="toggleConsoleChecklist('${t.id}', ${idx})" />
            <span class="checklist-text ${item.done ? 'checked' : ''}">${item.text}</span>
          `;
          checkContainer.appendChild(row);
        });
      } else {
        checkContainer.innerHTML = `
          <div style="font-size: 0.84rem; color: var(--text-muted); font-style: italic;">
            Standard protocol check — sign off upon deliverable execution.
          </div>
        `;
      }

      // Render Linked Entities
      const linkedContainer = document.getElementById('drawer-linked-pills');
      linkedContainer.innerHTML = '';
      const entities = t.linkedEntities || [];
      if (entities.length > 0) {
        entities.forEach(ent => {
          const pill = document.createElement('span');
          pill.className = 'entity-pill';
          pill.innerText = ent;
          linkedContainer.appendChild(pill);
        });
        document.getElementById('drawer-linked-section').style.display = 'block';
      } else {
        document.getElementById('drawer-linked-section').style.display = 'none';
      }

      // Update Status Buttons
      updateConsoleStatusButtons(t.status || (t.done ? 'Completed' : 'Planned'));

      // Open Drawer
      document.getElementById('console-drawer').classList.add('active');
      document.getElementById('console-backdrop').classList.add('active');
    }

    function closeTaskConsole() {
      document.getElementById('console-drawer').classList.remove('active');
      document.getElementById('console-backdrop').classList.remove('active');
      activeConsoleTaskId = null;
    }

    function toggleConsoleChecklist(taskId, checkIndex) {
      const t = currentTasks.find(x => x.id === taskId);
      if (!t || !t.checklist || !t.checklist[checkIndex]) return;

      t.checklist[checkIndex].done = !t.checklist[checkIndex].done;
      
      const allDone = t.checklist.every(c => c.done);
      const anyDone = t.checklist.some(c => c.done);

      if (allDone) {
        t.status = 'Completed';
        t.done = true;
      } else if (anyDone) {
        t.status = 'In-Progress';
        t.done = false;
      }

      saveMasterTasks();
      updateConsoleStatusButtons(t.status);
      renderStageStrip();
      renderSwimlaneMatrix();
      renderTasks();

      // Refresh checklist UI
      const checkContainer = document.getElementById('drawer-checklist');
      if (checkContainer) {
        const rows = checkContainer.querySelectorAll('.checklist-row');
        if (rows[checkIndex]) {
          const span = rows[checkIndex].querySelector('.checklist-text');
          const input = rows[checkIndex].querySelector('.checklist-checkbox');
          if (input) input.checked = t.checklist[checkIndex].done;
          if (span) span.className = `checklist-text ${t.checklist[checkIndex].done ? 'checked' : ''}`;
        }
      }
    }

    function updateConsoleStatusButtons(status) {
      document.querySelectorAll('.status-select-btn').forEach(btn => {
        if (btn.dataset.status === status) {
          btn.classList.add('active-status');
        } else {
          btn.classList.remove('active-status');
        }
      });
    }

    function setTaskStatus(newStatus) {
      if (!activeConsoleTaskId) return;
      const t = currentTasks.find(x => x.id === activeConsoleTaskId);
      if (!t) return;

      t.status = newStatus;
      t.done = (newStatus === 'Completed');
      if (t.checklist) {
        t.checklist.forEach(c => { c.done = (newStatus === 'Completed'); });
      }

      saveMasterTasks();
      updateConsoleStatusButtons(newStatus);
      renderStageStrip();
      renderSwimlaneMatrix();
      renderTasks();
      openTaskConsole(t.id); // Refresh open drawer
    }

    // ── Sync with CRUD Task Manager (tab-tasks) ─────────────────────
    function renderTasks() {
      const tbody = document.getElementById('task-table-body');
      if (!tbody) return;

      tbody.innerHTML = '';
      currentTasks.forEach((t, index) => {
        const isDone = (t.status === 'Completed' || t.done);
        const tr = document.createElement('tr');
        tr.setAttribute('data-testid', `task-row-${t.id}`);
        tr.setAttribute('data-task-id', t.id);
        tr.innerHTML = `
          <td style="text-align: center;"><input type="checkbox" data-testid="task-checkbox-${t.id}" ${isDone ? 'checked' : ''} onchange="toggleMasterTask(${index})" style="cursor: pointer; width: 22px; height: 22px; accent-color: var(--gold-primary);" aria-label="Mark task ${t.id} as complete" /></td>
          <td style="font-family: monospace; color: var(--gold-bright); font-weight: 700; cursor: pointer;" onclick="openTaskConsole('${t.id}')" data-testid="task-id-${t.id}">${t.id}</td>
          <td style="${isDone ? 'text-decoration: line-through; color: var(--text-dim);' : 'font-weight: 500;'}" data-testid="task-title-${t.id}">${t.title}</td>
          <td><span style="font-size: 0.78rem; color: var(--sapphire-royal); background: rgba(59, 130, 246, 0.1); padding: 3px 8px; border-radius: var(--radius-sm); white-space: nowrap;">${t.stage || 'General'}</span></td>
          <td><strong data-testid="task-owner-${t.id}" style="white-space: nowrap;">${t.lead || 'Committee'}</strong></td>
          <td><span style="color: ${t.priority === 'Critical' ? 'var(--crimson-royal)' : t.priority === 'High' ? 'var(--gold-bright)' : 'var(--text-muted)'}; font-weight: 700;" data-testid="task-priority-${t.id}">${t.priority || 'Medium'}</span></td>
          <td><span class="status-badge ${isDone ? 'status-completed' : t.status === 'In-Progress' ? 'status-progress' : 'status-planned'}" data-testid="task-status-${t.id}">${t.status || 'Planned'}</span></td>
          <td style="text-align: center;"><button style="background: none; border: none; color: var(--crimson-royal); cursor: pointer; font-size: 1.4rem; min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;" data-testid="task-delete-${t.id}" aria-label="Delete task ${t.id}" onclick="deleteMasterTask(${index})">&times;</button></td>
        `;
        tbody.appendChild(tr);
      });

      updateSwimlaneKPIs();
      saveMasterTasks();
    }

    function toggleMasterTask(index) {
      const t = currentTasks[index];
      t.done = !t.done;
      t.status = t.done ? 'Completed' : 'In-Progress';
      if (t.checklist) {
        t.checklist.forEach(c => { c.done = t.done; });
      }
      saveMasterTasks();
      renderTasks();
      renderStageStrip();
      renderSwimlaneMatrix();
    }

    function deleteMasterTask(index) {
      currentTasks.splice(index, 1);
      saveMasterTasks();
      renderTasks();
      renderStageStrip();
      renderSwimlaneMatrix();
    }

    function generateNextTaskId() {
      if (!currentTasks || currentTasks.length === 0) return 'TSK-001';
      const numericIds = currentTasks.map(t => {
        const match = String(t.id).match(/TSK-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const maxId = Math.max(0, ...numericIds);
      return 'TSK-' + String(maxId + 1).padStart(3, '0');
    }

    function addNewTask() {
      const titleInput = document.getElementById('new-task-title');
      const title = titleInput.value.trim();
      if (!title) return;

      const event = document.getElementById('new-task-event').value;
      const owner = document.getElementById('new-task-owner').value;
      const newId = generateNextTaskId();

      currentTasks.unshift({
        id: newId,
        title: title,
        stage: 'STAGE_03',
        track: 'bride',
        lead: owner,
        priority: 'High',
        status: 'In-Progress',
        done: false,
        checklist: [{ text: 'Deliverable execution verified', done: false }]
      });

      titleInput.value = '';
      saveMasterTasks();
      renderTasks();
      renderStageStrip();
      renderSwimlaneMatrix();
    }

    // ── Tab & Navigation Engine ─────────────────────────────────────
    function switchTab(tabId, updateHash = true) {
      const targetId = tabId.startsWith('tab-') ? tabId : `tab-${tabId}`;
      const targetTab = document.getElementById(targetId);
      if (!targetTab) return;

      document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
        el.setAttribute('aria-hidden', 'true');
      });
      document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('active');
        el.setAttribute('aria-selected', 'false');
      });

      targetTab.classList.add('active');
      targetTab.setAttribute('aria-hidden', 'false');

      const matchingBtn = document.querySelector(`[aria-controls="${targetId}"]`);
      if (matchingBtn) {
        matchingBtn.classList.add('active');
        matchingBtn.setAttribute('aria-selected', 'true');
      }

      sessionStorage.setItem('sree_krushna_active_tab', targetId);
      if (updateHash && window.location.hash !== `#${targetId}`) {
        history.replaceState(null, null, `#${targetId}`);
      }
    }

    function hydrateActiveTab() {
      const hashTab = window.location.hash.replace('#', '');
      const savedTab = sessionStorage.getItem('sree_krushna_active_tab');

      if (hashTab && document.getElementById(hashTab)) {
        switchTab(hashTab, false);
      } else if (savedTab && document.getElementById(savedTab)) {
        switchTab(savedTab, false);
      } else {
        switchTab('tab-dashboard', false);
      }
    }

    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && document.getElementById(newHash)) {
        switchTab(newHash, false);
      }
    });

    function showEventDetails(title, time, location, lead, desc) {
      document.getElementById('modal-title').innerText = title;
      document.getElementById('modal-time').innerText = time;
      document.getElementById('modal-location').innerText = location;
      document.getElementById('modal-lead').innerText = lead;
      document.getElementById('modal-desc').innerText = desc || 'Live operational track node in Sree Krushna Marriage OS.';
      document.getElementById('detail-modal').classList.add('active');
      document.getElementById('detail-modal').setAttribute('aria-hidden', 'false');
    }

    function showRitualModal(title, desc, samagri, priest, duration) {
      document.getElementById('modal-title').innerText = title;
      document.getElementById('modal-time').innerText = duration;
      document.getElementById('modal-location').innerText = priest;
      document.getElementById('modal-lead').innerText = samagri;
      document.getElementById('modal-desc').innerText = desc;
      document.getElementById('detail-modal').classList.add('active');
      document.getElementById('detail-modal').setAttribute('aria-hidden', 'false');
    }

    function closeModal(e) {
      document.getElementById('detail-modal').classList.remove('active');
      document.getElementById('detail-modal').setAttribute('aria-hidden', 'true');
    }

    // ==========================================================================
    // CO-CREATION & ASYNCHRONOUS IDEA INGESTION ENGINE (SPEC-INTAKE-COCREATION-001)
    // ==========================================================================
    let ideasList = JSON.parse(localStorage.getItem('sree_krushna_ideas_v1')) || [
      {
        id: 'IDEA-001',
        submitter: 'Sree (Bride)',
        category: 'Decor',
        event: 'EVT-004',
        rawText: 'Suspended tuberose floral dome over mandap with traditional brass bells and warm fairy lights',
        reframedTitle: 'Mandap Decor: Suspended Tuberose Dome with Hanging Temple Bells',
        mediaUrl: 'https://www.instagram.com/reel/C3example1/',
        platform: 'Instagram',
        suggestedAction: 'Request 3D visual concept and tuberose volume estimate from Mandap Decorators',
        status: 'Staged',
        timestamp: '2026-08-22'
      },
      {
        id: 'IDEA-002',
        submitter: 'Krushna (Groom)',
        category: 'Music',
        event: 'EVT-005',
        rawText: 'Cold pyrotechnics on grand stage walk with live classical flute fusion for reception entry',
        reframedTitle: 'Reception Entry: Cinematic Stage Walk with Cold Pyros & Live Flute',
        mediaUrl: 'https://youtube.com/shorts/example2',
        platform: 'YouTube',
        suggestedAction: 'Verify indoor cold pyro permissions and sound system with Mayfair Hub management',
        status: 'Staged',
        timestamp: '2026-08-22'
      }
    ];

    function saveIdeas() {
      localStorage.setItem('sree_krushna_ideas_v1', JSON.stringify(ideasList));
    }

    function openInspirationModal() {
      const modal = document.getElementById('inspirationModal');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('idea-notes').focus();
      }
    }

    function closeInspirationModal(e) {
      const modal = document.getElementById('inspirationModal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    function detectPlatform() {
      const urlInput = document.getElementById('idea-url');
      const badge = document.getElementById('idea-platform-badge');
      if (!urlInput || !badge) return;
      const url = urlInput.value.trim().toLowerCase();

      if (url.includes('instagram.com')) {
        badge.innerHTML = '📸 Instagram Reel / Post';
      } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        badge.innerHTML = '🎥 YouTube Video / Short';
      } else if (url.includes('pinterest.')) {
        badge.innerHTML = '📌 Pinterest Board / Pin';
      } else if (url.includes('drive.google.com') || url.includes('photos.google.com')) {
        badge.innerHTML = '📁 Google Drive / Photos';
      } else if (url.length > 5) {
        badge.innerHTML = '🌐 Web Reference';
      } else {
        badge.innerHTML = '';
      }
    }

    function reframeWithAI() {
      const notes = document.getElementById('idea-notes').value.trim();
      const cat = document.getElementById('idea-category').value;
      const evt = document.getElementById('idea-event').value;
      const preview = document.getElementById('idea-ai-preview');
      if (!notes) {
        preview.innerHTML = '<span style="color: var(--crimson-royal);">⚠️ Please enter some raw notes first before requesting AI reframing.</span>';
        return;
      }

      // Client-Side AI Reframer Engine (Heuristic Synthesis & Schema Normalization)
      let cleanTitle = notes.length > 60 ? notes.substring(0, 58) + '...' : notes;
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      
      const categoryLabels = {
        'Decor': 'Mandap & Floral Decor',
        'Photography': 'Photo & Cinema Track',
        'Attire': 'Trousseau & Bridal Styling',
        'Catering': 'Traditional Odia Feast',
        'Music': 'Stage Entertainment & Audio',
        'Rituals': 'Vedic Liturgy & Samagri',
        'Venue': 'Hospitality & Logistics',
        'General': 'General Wedding Planning'
      };

      const structuredTitle = `${categoryLabels[cat] || cat}: ${cleanTitle}`;
      const actionItem = `Review proposal during next planning sync, align with ${cat} lead, and estimate budget impact.`;

      preview.innerHTML = `
        <div style="color: var(--text-main); font-style: normal;">
          <div style="margin-bottom: 4px;"><strong>🎯 Reframed Proposal:</strong> <span style="color: var(--gold-bright);">${structuredTitle}</span></div>
          <div style="margin-bottom: 4px;"><strong>🏷️ Target Milestone:</strong> <code>${evt}</code> &bull; <strong>Domain:</strong> ${cat}</div>
          <div><strong>⚡ Suggested Action:</strong> <span style="color: var(--text-muted);">${actionItem}</span></div>
        </div>
      `;
    }

    function submitIdea() {
      const notes = document.getElementById('idea-notes').value.trim();
      if (!notes) {
        alert('Please enter your idea or concept notes before submitting.');
        return;
      }

      const submitter = document.getElementById('idea-submitter').value;
      const category = document.getElementById('idea-category').value;
      const event = document.getElementById('idea-event').value;
      const url = document.getElementById('idea-url').value.trim();

      let platform = 'Web Note';
      if (url.includes('instagram.com')) platform = 'Instagram';
      else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'YouTube';
      else if (url.includes('pinterest.')) platform = 'Pinterest';
      else if (url.includes('drive.google.com')) platform = 'Drive';

      const numericIds = ideasList.map(item => {
        const match = String(item.id).match(/IDEA-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const nextId = 'IDEA-' + String(Math.max(0, ...numericIds) + 1).padStart(3, '0');

      let reframedTitle = `${category}: ${notes.length > 55 ? notes.substring(0, 52) + '...' : notes}`;

      const newIdea = {
        id: nextId,
        submitter: submitter,
        category: category,
        event: event,
        rawText: notes,
        reframedTitle: reframedTitle,
        mediaUrl: url,
        platform: platform,
        suggestedAction: `Evaluate proposal with ${submitter} and coordinate with ${category} lead.`,
        status: 'Staged',
        timestamp: new Date().toISOString().split('T')[0]
      };

      ideasList.unshift(newIdea);
      saveIdeas();
      renderIdeas();

      // Reset form
      document.getElementById('idea-notes').value = '';
      document.getElementById('idea-url').value = '';
      document.getElementById('idea-platform-badge').innerHTML = '';
      document.getElementById('idea-ai-preview').innerHTML = 'Click "Structure with AI" to generate a standardized proposal title and suggested action item.';

      closeInspirationModal(null);
      
      // Auto-switch or notification
      const countEl = document.getElementById('ideas-count');
      if (countEl) countEl.innerText = ideasList.length;
      alert(`✨ Idea ${nextId} submitted to Staging Inbox! View it in Vision Studio.`);
    }

    function deleteIdea(index) {
      if (confirm(`Remove idea ${ideasList[index].id} from staging queue?`)) {
        ideasList.splice(index, 1);
        saveIdeas();
        renderIdeas();
      }
    }

    function copyIdeasForDev() {
      const exportJson = JSON.stringify(ideasList, null, 2);
      navigator.clipboard.writeText(exportJson).then(() => {
        alert(`📋 Copied ${ideasList.length} staged ideas as structured JSON to clipboard for developer triage!`);
      }).catch(() => {
        alert('Failed to copy to clipboard. Please check browser permissions.');
      });
    }

    function renderIdeas() {
      const grid = document.getElementById('ideas-grid');
      const countEl = document.getElementById('ideas-count');
      if (!grid) return;

      if (countEl) countEl.innerText = ideasList.length;

      if (ideasList.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 28px; border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); background: rgba(15, 22, 36, 0.4); color: var(--text-dim);">
            No ideas in staging queue. Click "+ Drop New Idea" or the "💡 Share Idea" button in the header to submit inspiration!
          </div>
        `;
        return;
      }

      grid.innerHTML = '';
      ideasList.forEach((idea, index) => {
        const card = document.createElement('div');
        card.className = 'role-badge-card';
        card.style.position = 'relative';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        card.setAttribute('data-testid', `idea-card-${idea.id}`);

        let mediaAffordance = '';
        if (idea.mediaUrl) {
          const platformIcon = idea.platform === 'Instagram' ? '📸' : idea.platform === 'YouTube' ? '🎥' : idea.platform === 'Pinterest' ? '📌' : '🔗';
          mediaAffordance = `
            <div style="margin-top: 8px; margin-bottom: 6px;">
              <a href="${idea.mediaUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 4px 10px; border-radius: 8px; font-size: 0.78rem; color: var(--gold-bright); text-decoration: none; word-break: break-all;">
                <span>${platformIcon}</span> View ${idea.platform} Reference ↗
              </a>
            </div>
          `;
        }

        card.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; gap: 6px;">
              <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
                <span style="font-family: monospace; font-weight: 700; color: var(--gold-bright); font-size: 0.78rem;">${idea.id}</span>
                <span class="status-badge" style="background: rgba(59, 130, 246, 0.15); color: var(--sapphire-royal); font-size: 0.68rem;">${idea.category}</span>
                <span class="status-badge status-progress" style="font-size: 0.68rem;">${idea.status}</span>
              </div>
              <button onclick="deleteIdea(${index})" style="background: none; border: none; color: var(--crimson-royal); font-size: 1.1rem; cursor: pointer; padding: 2px 6px;" title="Dismiss Idea">&times;</button>
            </div>
            <h5 style="font-size: 0.92rem; color: var(--text-main); margin: 0 0 6px; line-height: 1.3;">${idea.reframedTitle || idea.rawText}</h5>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin: 0 0 6px;">"${idea.rawText}"</p>
            ${mediaAffordance}
          </div>
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--text-dim);">
            <span>👤 ${idea.submitter}</span>
            <span>📅 ${idea.timestamp} &bull; <code>${idea.event}</code></span>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    // ── Global System Initialization ───────────────────────────────
    updateStageIndicator();
    renderStageStrip();
    renderSwimlaneMatrix();
    renderTasks();
    renderIdeas();
    hydrateActiveTab();
  


    const GA4_ID = "G-XXXXXXXXXX";   // ← keep in sync with <head> config tag
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";

    const reportFn = (metric) => {
      // ── GA4 custom event ────────────────────────────────────────
      if (typeof gtag === "function") {
        gtag("event", "web_vitals", {
          event_category:   "Web Vitals",
          event_label:      metric.id,
          metric_name:      metric.name,
          metric_value:     Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
          metric_rating:    metric.rating,
          metric_delta:     Math.round(metric.delta),
          device_type:      deviceType,
          non_interaction:  true,
        });
      } else {
        console.table({ ...metric, deviceType });
      }
    };

    try {
      const { onLCP, onINP, onCLS } = await import(
        "https://esm.sh/web-vitals@4?bundle"
      );
      [onLCP, onINP, onCLS].forEach((fn) => fn(reportFn));
    } catch (err) {
      console.warn("[RUM] web-vitals load failed:", err.message);
    }
