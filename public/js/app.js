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

    // ── Smooth Directional Sticky Shell Engine (Zero Jitter / Protocol 34) ────
    const stickyShell = document.getElementById('stickyHeaderShell');
    let lastScrollY = window.scrollY || 0;
    let isHidden = false;
    const scrollElevationThreshold = 80;
    const scrollClearThreshold = 25;
    const scrollDeltaThreshold = 8;
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
      if (!scrollTicking && stickyShell) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY || 0);
          const delta = currentScrollY - lastScrollY;

          // 1. Elevation shadow toggle with dual-threshold hysteresis (no oscillation)
          if (currentScrollY > scrollElevationThreshold && !stickyShell.classList.contains('is-scrolled')) {
            stickyShell.classList.add('is-scrolled');
          } else if (currentScrollY < scrollClearThreshold && stickyShell.classList.contains('is-scrolled')) {
            stickyShell.classList.remove('is-scrolled');
          }

          // 2. Mobile Directional Auto-Hide (Scroll-Down: hide, Scroll-Up: reveal)
          if (window.innerWidth <= 768) {
            if (Math.abs(delta) > scrollDeltaThreshold) {
              if (delta > 0 && currentScrollY > 120 && !isHidden) {
                stickyShell.classList.add('nav-hidden');
                isHidden = true;
              } else if (delta < 0 && isHidden) {
                stickyShell.classList.remove('nav-hidden');
                isHidden = false;
              }
            }
            if (currentScrollY < 50 && isHidden) {
              stickyShell.classList.remove('nav-hidden');
              isHidden = false;
            }
          } else if (isHidden) {
            stickyShell.classList.remove('nav-hidden');
            isHidden = false;
          }

          lastScrollY = currentScrollY;
          scrollTicking = false;
        });
        scrollTicking = true;
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

    // ── Countdown Timer — Real Dates (IST: UTC + 5:30) ──────────────────────
    const CD_EVENTS = {
      engagement: { label: '💍 Engagement — 11 Feb 2027',  ms: Date.UTC(2027, 1, 11, 4, 30, 0) },
      wedding:    { label: '👑 Wedding Muhurat — 10 Mar 2027', ms: Date.UTC(2027, 2, 10, 2, 30, 0) },
      reception:  { label: '🎉 Grand Reception — 10 Mar 2027', ms: Date.UTC(2027, 2, 10, 13, 30, 0) },
    };

    let cdActiveEvent = 'engagement';

    function cdPad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

    function cdFlipNum(el, newVal) {
      if (!el) return;
      if (el.textContent === newVal) return;
      el.textContent = newVal;
      el.classList.add('flip');
      setTimeout(() => {
        if (el) el.classList.remove('flip');
      }, 120);
    }

    function updateCountdown() {
      const evt = CD_EVENTS[cdActiveEvent] || CD_EVENTS.engagement;
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

      // Synchronize Header Live Countdown Capsule
      const miniIcon = document.getElementById('cdMiniIcon');
      const miniLabel = document.getElementById('cdMiniLabel');
      const miniDigits = document.getElementById('cdMiniDigits');
      if (miniDigits) {
        const iconMap = { engagement: '💍', wedding: '👑', reception: '🎉' };
        const labelMap = { engagement: 'Engagement', wedding: 'Wedding', reception: 'Reception' };
        if (miniIcon) miniIcon.textContent = iconMap[cdActiveEvent] || '💍';
        if (miniLabel) miniLabel.textContent = labelMap[cdActiveEvent] || 'Event';
        if (diff <= 0) {
          miniDigits.textContent = 'Celebrated ✓';
        } else {
          miniDigits.textContent = `${days}d ${cdPad(hours)}h ${cdPad(mins)}m`;
        }
      }
    }

    function cycleCountdownEvent() {
      const order = ['engagement', 'wedding', 'reception'];
      const currentIndex = order.indexOf(cdActiveEvent);
      const nextIndex = (currentIndex + 1) % order.length;
      cdActiveEvent = order[nextIndex];

      // Sync Hero pills
      document.querySelectorAll('.cd-pill').forEach(b => {
        const isMatch = b.dataset.event === cdActiveEvent;
        b.classList.toggle('active', isMatch);
        b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      updateCountdown();
    }
    window.cycleCountdownEvent = cycleCountdownEvent;

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
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem('sree_krushna_master_tasks_v6')) || JSON.parse(localStorage.getItem('sree_krushna_master_tasks_v5'));
    } catch (e) {}
    
    // Automatically seed full canonical master tasks (62 tasks) with SSOT metadata synced to user state
    let currentTasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    if (stored && Array.isArray(stored) && stored.length > 0) {
      const storedMap = new Map(stored.map(t => [t.id, t]));
      currentTasks.forEach(canonicalTask => {
        const cached = storedMap.get(canonicalTask.id);
        if (cached) {
          canonicalTask.status = cached.status || canonicalTask.status;
          canonicalTask.done = (cached.status === 'Completed' || !!cached.done);
          if (Array.isArray(cached.checklist) && Array.isArray(canonicalTask.checklist)) {
            cached.checklist.forEach((item, idx) => {
              if (canonicalTask.checklist[idx]) {
                canonicalTask.checklist[idx].done = !!item.done;
              }
            });
          }
        }
      });
      // Merge any user-created custom tasks
      stored.filter(t => !currentTasks.some(ct => ct.id === t.id)).forEach(customTask => {
        currentTasks.push(customTask);
      });
    }

    // Active View States (Default to STAGE_01 Pre-Wedding & Procurement)
    let activeStageId = 'STAGE_01';
    let activeSwimlaneTrack = 'all';
    let swimlaneSearchQuery = '';
    let activeConsoleTaskId = null;

    function saveMasterTasks() {
      localStorage.setItem('sree_krushna_master_tasks_v6', JSON.stringify(currentTasks));
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

    // ── Temporal Timeline & Urgency Sorting Engine ─────────────────
    let currentSwimlaneSortMode = 'TIMELINE'; // 'TIMELINE' | 'URGENCY' | 'WBS' | 'STATUS'

    function parseTaskTimelineMinutes(t) {
      if (!t) return 0;
      const str = String(t.timeTag || '').toLowerCase().trim();

      // 1. Stage Baseline Offset (Minutes from Day 0 00:00)
      const stageBaseOffset = {
        'STAGE_01': -120 * 1440, // ~ -172,800 mins
        'STAGE_02': -2 * 1440,   // ~ -2,880 mins
        'STAGE_03': 16 * 60,     // 16:00 Day 0 = +960 mins
        'STAGE_04': 19.5 * 60,   // 19:30 Day 0 = +1,170 mins
        'STAGE_05': 19.5 * 60,   // 19:30 Day 0 = +1,170 mins
        'STAGE_06': 1 * 1440     // Day +1 = +1,440 mins
      };

      // 2. Parse explicit T-Days (e.g. "T-180 Days", "T-90", "T - 45", "T-2 Days")
      const tDaysMatch = str.match(/t\s*-\s*(\d+)\s*(?:days?|d)?/i);
      if (tDaysMatch) {
        const days = parseInt(tDaysMatch[1], 10);
        return -(days * 1440);
      }

      // 3. Parse explicit T-Hours (e.g. "T - 4 Hours", "T-4h")
      const tHoursMatch = str.match(/t\s*-\s*(\d+)\s*hours?/i);
      if (tHoursMatch) {
        const hours = parseInt(tHoursMatch[1], 10);
        return -(hours * 60);
      }

      // 4. Parse Day +Days (e.g. "Day +1", "Day +4", "Day +7 to Day +30")
      const dayPlusMatch = str.match(/day\s*\+\s*(\d+)/i);
      if (dayPlusMatch) {
        const days = parseInt(dayPlusMatch[1], 10);
        return days * 1440;
      }

      // 5. Parse 24-hr clock times on Day 0 (e.g. "15:00", "17:00 to 19:30", "19:30 to 22:30")
      const timeClockMatch = str.match(/(\d{1,2}):(\d{2})/);
      if (timeClockMatch) {
        const hours = parseInt(timeClockMatch[1], 10);
        const mins = parseInt(timeClockMatch[2], 10);
        return (hours * 60) + mins;
      }

      // 6. Day 0 - T+0 or Day-Of
      if (str.includes('t+0') || str.includes('day-of') || str.includes('day 0')) {
        return stageBaseOffset[t.stage] || 0;
      }

      // Fallback to stage default
      return stageBaseOffset[t.stage] || 0;
    }

    function getTaskPriorityWeight(t) {
      const p = String(t.priority || '').toLowerCase();
      if (p === 'critical') return 1;
      if (p === 'high') return 2;
      if (p === 'medium') return 3;
      if (p === 'low' || p === 'planned') return 4;
      return 3;
    }

    function getTaskStageOrder(stageId) {
      const map = { 'STAGE_01': 1, 'STAGE_02': 2, 'STAGE_03': 3, 'STAGE_04': 4, 'STAGE_05': 5, 'STAGE_06': 6 };
      return map[stageId] || 99;
    }

    function sortSwimlaneTasks(tasks) {
      return [...tasks].sort((a, b) => {
        if (currentSwimlaneSortMode === 'URGENCY') {
          // Priority first
          const pA = getTaskPriorityWeight(a);
          const pB = getTaskPriorityWeight(b);
          if (pA !== pB) return pA - pB;
          // Then chronological timeline
          const timeA = parseTaskTimelineMinutes(a);
          const timeB = parseTaskTimelineMinutes(b);
          if (timeA !== timeB) return timeA - timeB;
          return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
        } else if (currentSwimlaneSortMode === 'WBS') {
          return String(a.wbs || a.id).localeCompare(String(b.wbs || b.id), undefined, { numeric: true });
        } else if (currentSwimlaneSortMode === 'STATUS') {
          const statusOrder = { 'In-Progress': 1, 'Planned': 2, 'Completed': 3 };
          const sA = statusOrder[a.status] || 2;
          const sB = statusOrder[b.status] || 2;
          if (sA !== sB) return sA - sB;
          return parseTaskTimelineMinutes(a) - parseTaskTimelineMinutes(b);
        } else {
          // DEFAULT: TIMELINE (Chronological Stage + TimeTag + Urgency)
          // 1. Stage Order
          const stageA = getTaskStageOrder(a.stage);
          const stageB = getTaskStageOrder(b.stage);
          if (stageA !== stageB) return stageA - stageB;

          // 2. Timeline Minutes
          const timeA = parseTaskTimelineMinutes(a);
          const timeB = parseTaskTimelineMinutes(b);
          if (timeA !== timeB) return timeA - timeB;

          // 3. Priority Urgency Tie-breaker
          const pA = getTaskPriorityWeight(a);
          const pB = getTaskPriorityWeight(b);
          if (pA !== pB) return pA - pB;

          // 4. ID Natural Sort
          return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
        }
      });
    }

    function setSwimlaneSortMode(mode) {
      currentSwimlaneSortMode = mode;
      document.querySelectorAll('.swimlane-sort-btn').forEach(btn => {
        if (btn.dataset.sort === mode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
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
          <span>SYNCHRONIZED ACTIVITIES & DELIVERABLES &bull; ${activeStageId !== 'ALL' ? `${activeStageId}` : 'ALL 6 STAGES'} (${currentSwimlaneSortMode === 'URGENCY' ? '⚡ Urgency Sorted' : currentSwimlaneSortMode === 'WBS' ? '🔢 WBS Sorted' : currentSwimlaneSortMode === 'STATUS' ? '📊 Status Sorted' : '⏱️ Chronological Timeline'})</span>
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

        // Apply strict Chronological Timeline & Urgency Sorting
        trackTasks = sortSwimlaneTasks(trackTasks);

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
            const isCritical = (t.priority === 'Critical');
            const totalChecks = (t.checklist && t.checklist.length) || 0;
            const doneChecks = totalChecks > 0 ? t.checklist.filter(c => c.done).length : (isDone ? 1 : 0);

            const node = document.createElement('div');
            node.className = `event-node ${isDone ? 'is-completed' : ''}`;
            node.style.borderLeft = `3px solid ${isCritical ? 'var(--crimson-royal, #ef4444)' : tr.color}`;
            node.setAttribute('data-testid', `swimlane-node-${t.id}`);
            node.onclick = () => openTaskConsole(t.id);

            node.innerHTML = `
              <div class="node-top">
                <span class="node-time" style="${isCritical ? 'font-weight: 700; color: var(--gold-bright);' : ''}">${t.timeTag || 'Day-Of'}</span>
                <div style="display: flex; gap: 4px; align-items: center;">
                  ${isCritical ? '<span class="status-badge status-urgent" style="font-size: 0.62rem; padding: 1px 5px; letter-spacing: 0.2px;">⚡ Critical</span>' : ''}
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
          <td style="text-align: center;"><button class="header-action-btn" data-testid="task-propose-update-${t.id}" aria-label="Propose update for task ${t.id}" onclick="proposeTaskUpdate('${t.id}')" style="min-height: 28px; padding: 3px 10px; font-size: 0.74rem; background: rgba(212, 168, 67, 0.12); border: 1px solid rgba(212, 168, 67, 0.38); color: var(--gold-bright); border-radius: var(--radius-sm, 6px); cursor: pointer; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;"><span>💡</span><span>Propose Update</span></button></td>
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

    function proposeTaskUpdate(taskId) {
      const t = currentTasks.find(x => x.id === taskId);
      if (!t) return;

      const eventScope = t.stage || t.eventScope || 'Master_Planning';
      openUniversalIntakeModal({
        domain: 'Tasks',
        event: eventScope,
        contextLabel: `Change Request for Task ${t.id} (${t.title})`,
        initialNotes: `[${t.id}] Update Proposal:\n• Current Action: ${t.title}\n• Assigned Owner: ${t.lead || 'Planning Committee'}\n• Priority: ${t.priority || 'Medium'}\n• Status: ${t.status || 'Planned'}\n• Proposed Adjustment: `
      });
    }

    function loadTaskForEdit(taskId) {
      proposeTaskUpdate(taskId);
    }

    function submitTaskForm() {
      addNewTask();
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
      const title = titleInput ? titleInput.value.trim() : '';
      const eventSelect = document.getElementById('new-task-event');
      const event = eventSelect ? eventSelect.value : 'Master_Planning';

      openUniversalIntakeModal({
        domain: 'Tasks',
        event: event,
        contextLabel: 'Operational Task Proposal (' + (event === 'Master_Planning' ? 'General Planning' : event) + ')',
        initialNotes: title
      });

      if (titleInput) titleInput.value = '';
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

      if (targetId === 'tab-dopkos' && window.renderDoPkosStudio) {
        window.renderDoPkosStudio();
      } else if (targetId === 'tab-planning' && window.renderPlanningSuite) {
        window.renderPlanningSuite();
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

    let currentLiturgyTitle = '';
    function showRitualModal(title, desc, samagri, priest, duration) {
      currentLiturgyTitle = title;
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
    // UNIVERSAL WRITE-INTENT & CHANGE REQUEST DISPATCHER (SPEC-ARCH-INTENT-DISPATCH-001)
    // ==========================================================================
    let changeRequestsList = JSON.parse(localStorage.getItem('sree_krushna_change_requests_v1')) || [
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
      }
    ];

    function saveChangeRequests() {
      localStorage.setItem('sree_krushna_change_requests_v1', JSON.stringify(changeRequestsList));
    }

    function dispatchChangeRequest({ targetDomain, intentType, title, payload, targetEvent = 'Master_Planning', submitter = 'Family Lead' }) {
      const numericIds = changeRequestsList.map(item => {
        const match = String(item.requestId).match(/CR-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const nextId = 'CR-' + String(Math.max(0, ...numericIds) + 1).padStart(3, '0');

      const cr = {
        requestId: nextId,
        targetDomain: targetDomain,
        intentType: intentType,
        submitter: submitter,
        targetEvent: targetEvent,
        title: title,
        payload: payload,
        status: 'Pending_Review',
        submittedAt: new Date().toISOString()
      };

      changeRequestsList.unshift(cr);
      saveChangeRequests();

      // If domain is VISION, also mirror to ideasList for Tab 5 visual display
      if (targetDomain === 'VISION') {
        const nextIdeaId = 'IDEA-' + String(Math.max(0, ...ideasList.map(i => {
          const m = String(i.id).match(/IDEA-(\d+)/);
          return m ? parseInt(m[1], 10) : 0;
        })) + 1).padStart(3, '0');

        ideasList.unshift({
          id: nextIdeaId,
          submitter: submitter,
          category: payload.category || 'General',
          event: targetEvent,
          rawText: payload.rawNotes || title,
          reframedTitle: title,
          mediaUrl: payload.mediaUrl || '',
          platform: payload.platform || 'Web Note',
          suggestedAction: `Evaluate proposal #${nextId} during next planning sync with ${submitter}.`,
          status: 'Staged',
          timestamp: new Date().toISOString().split('T')[0]
        });
        saveIdeas();
        renderIdeas();
      }

      showChangeRequestReceipt(cr);
      return cr;
    }

    function showChangeRequestReceipt(cr) {
      const modal = document.getElementById('changeRequestReceiptModal');
      if (modal) {
        const idEl = document.getElementById('cr-receipt-id');
        const titleEl = document.getElementById('cr-receipt-title');
        const domainEl = document.getElementById('cr-receipt-domain');
        const submitterEl = document.getElementById('cr-receipt-submitter');
        if (idEl) idEl.innerText = cr.requestId;
        if (titleEl) titleEl.innerText = cr.title;
        if (domainEl) domainEl.innerText = `${cr.targetDomain} (${cr.intentType})`;
        if (submitterEl) submitterEl.innerText = cr.submitter;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      } else {
        alert(`✅ Change Request #${cr.requestId} Logged!\n\nTitle: ${cr.title}\nDomain: ${cr.targetDomain}\n\nForwarded to Planning Council & Backend Team for Review.`);
      }
    }

    function closeChangeRequestReceipt() {
      const modal = document.getElementById('changeRequestReceiptModal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    // ── User Identity & Submitter Resolution Engine ───────────────
    function getAuthenticatedSubmitterName() {
      if (window.currentUserRole && window.currentUserRole.role) {
        if (window.currentUserRole.role.includes('Groom')) return 'Krushna (Groom)';
        if (window.currentUserRole.role.includes('Bride')) return 'Sree (Bride)';
        if (window.currentUserRole.role.includes('Parents')) return 'Parents Council';
      }
      if (window.currentUser && window.currentUser.email) {
        const email = window.currentUser.email.toLowerCase();
        if (email.includes('goldenage') || email.includes('krushna')) return 'Krushna (Groom)';
        if (email.includes('sreesubha') || email.includes('sree')) return 'Sree (Bride)';
      }
      return 'Krushna (Groom)'; // Default fallback
    }

    function autoSelectAuthenticatedSubmitter(selectId) {
      const select = document.getElementById(selectId);
      if (!select) return;
      const currentSubmitter = getAuthenticatedSubmitterName();
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.includes('Groom') && currentSubmitter.includes('Groom')) {
          select.selectedIndex = i;
          break;
        } else if (select.options[i].value.includes('Bride') && currentSubmitter.includes('Bride')) {
          select.selectedIndex = i;
          break;
        } else if (select.options[i].value === currentSubmitter) {
          select.selectedIndex = i;
          break;
        }
      }
    }

    // ── Universal Marriage Intent & Proposal Studio Engine ────────
    function openUniversalIntakeModal(options = {}) {
      const modal = document.getElementById('inspirationModal');
      if (!modal) return;

      // 1. Auto-select authenticated user profile
      autoSelectAuthenticatedSubmitter('idea-submitter');

      // 2. Pre-select category/domain if specified
      if (options.domain) {
        const catSelect = document.getElementById('idea-category');
        if (catSelect && catSelect.options) {
          for (let i = 0; i < catSelect.options.length; i++) {
            if (catSelect.options[i] && catSelect.options[i].value && catSelect.options[i].value.toLowerCase() === options.domain.toLowerCase()) {
              catSelect.selectedIndex = i;
              break;
            }
          }
        }
      }

      // 3. Pre-select event milestone if specified
      if (options.event) {
        const evtSelect = document.getElementById('idea-event');
        if (evtSelect) evtSelect.value = options.event;
      }

      // 4. Render Context Ribbon
      const ribbon = document.getElementById('intake-context-ribbon');
      if (ribbon) {
        if (options.contextLabel) {
          ribbon.innerHTML = `🏷️ <strong>Launch Context:</strong> ${options.contextLabel}`;
          ribbon.style.display = 'block';
        } else {
          ribbon.style.display = 'none';
        }
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      const notesEl = document.getElementById('idea-notes');
      if (notesEl) {
        notesEl.value = options.initialNotes || '';
        notesEl.focus();
      }
    }

    function closeInspirationModal(e) {
      const modal = document.getElementById('inspirationModal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    // ── Polymorphic Domain Trigger Aliases ───────────────────────────
    function openInspirationModal() {
      openUniversalIntakeModal({ domain: 'Decor', contextLabel: 'General Wedding Proposal & Vision' });
    }

    function openLiturgyNoteModal() {
      const ritual = currentLiturgyTitle || 'Vedic Liturgy';
      openUniversalIntakeModal({ domain: 'Rituals', contextLabel: `Liturgy & Samagri Adjustment: ${ritual}` });
    }

    function openVendorNominationModal() {
      openUniversalIntakeModal({ domain: 'Vendors', contextLabel: 'Vendor Nomination & Quotation' });
    }

    function openCustodyProposalModal() {
      openUniversalIntakeModal({ domain: 'Custody', contextLabel: 'Custody Asset & Locker Record' });
    }

    function closeLiturgyNoteModal() { closeInspirationModal(null); }
    function closeVendorNominationModal() { closeInspirationModal(null); }
    function closeCustodyProposalModal() { closeInspirationModal(null); }

    // ==========================================================================
    // CO-CREATION & ASYNCHRONOUS IDEA INGESTION ENGINE (SPEC-INTAKE-COCREATION-001)
    // ==========================================================================
    let currentIdeaFilter = 'ALL';

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

      let cleanTitle = notes.length > 60 ? notes.substring(0, 58) + '...' : notes;
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      
      const categoryLabels = {
        'Decor': 'Mandap & Floral Decor',
        'Photography': 'Photo & Cinema Track',
        'Attire': 'Trousseau & Bridal Styling',
        'Catering': 'Traditional Odia Feast',
        'Music': 'Stage Entertainment & Audio',
        'Rituals': 'Vedic Liturgy & Samagri',
        'Vendors': 'Vendor Procurement & Quotes',
        'Custody': 'Precious Asset & Vault Custody',
        'Tasks': 'Operational Task Proposal',
        'Venue': 'Hospitality & Logistics',
        'General': 'General Wedding Proposal'
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
      const notesEl = document.getElementById('idea-notes');
      const notes = notesEl ? notesEl.value.trim() : '';
      if (!notes) {
        alert('Please enter your proposal, notes or quote before submitting.');
        return;
      }

      const submitterEl = document.getElementById('idea-submitter');
      const submitter = submitterEl ? submitterEl.value : getAuthenticatedSubmitterName();
      const category = document.getElementById('idea-category').value;
      const event = document.getElementById('idea-event').value;
      const urlEl = document.getElementById('idea-url');
      const url = urlEl ? urlEl.value.trim() : '';

      let platform = 'Web Note';
      if (url.includes('instagram.com')) platform = 'Instagram';
      else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'YouTube';
      else if (url.includes('pinterest.')) platform = 'Pinterest';
      else if (url.includes('drive.google.com')) platform = 'Drive';

      const domainMap = {
        'Decor': 'VISION',
        'Photography': 'VISION',
        'Attire': 'VISION',
        'Catering': 'VENDORS',
        'Music': 'VISION',
        'Rituals': 'RITUALS',
        'Vendors': 'VENDORS',
        'Custody': 'CUSTODY',
        'Tasks': 'TASKS',
        'Venue': 'OPERATIONS',
        'General': 'VISION'
      };
      const targetDomain = domainMap[category] || 'VISION';

      const intentMap = {
        'TASKS': 'PROPOSE_TASK',
        'RITUALS': 'ADJUST_RITUAL',
        'VENDORS': 'NOMINATE_VENDOR',
        'CUSTODY': 'PROPOSE_ASSET',
        'VISION': 'DROP_INSPIRATION',
        'OPERATIONS': 'PROPOSE_TASK'
      };
      const intentType = intentMap[targetDomain] || 'DROP_INSPIRATION';

      let reframedTitle = `${category}: ${notes.length > 55 ? notes.substring(0, 52) + '...' : notes}`;

      dispatchChangeRequest({
        targetDomain: targetDomain,
        intentType: intentType,
        title: reframedTitle,
        targetEvent: event,
        submitter: submitter,
        payload: {
          category: category,
          rawNotes: notes,
          mediaUrl: url,
          platform: platform
        }
      });

      // Reset form
      notesEl.value = '';
      if (urlEl) urlEl.value = '';
      const badge = document.getElementById('idea-platform-badge');
      if (badge) badge.innerHTML = '';
      const preview = document.getElementById('idea-ai-preview');
      if (preview) preview.innerHTML = 'Click "Structure with AI" to generate a standardized proposal title and suggested action item.';

      closeInspirationModal(null);
    }

    // ── Soft-Archive / Non-Destructive Withdraw ─────────────────────
    function withdrawIdea(index) {
      const idea = ideasList[index];
      if (!idea) return;

      if (idea.status === 'Withdrawn') {
        idea.status = 'Staged';
        delete idea.withdrawnAt;
      } else {
        if (!confirm(`Move proposal "${idea.id}" to Withdrawn status? (This preserves audit history without permanently deleting).`)) {
          return;
        }
        idea.status = 'Withdrawn';
        idea.withdrawnAt = new Date().toISOString();
        idea.withdrawnBy = getAuthenticatedSubmitterName();
      }

      // Keep changeRequestsList in sync
      const matchedCr = changeRequestsList.find(cr => cr.requestId === idea.id || (cr.title && cr.title === idea.reframedTitle));
      if (matchedCr) {
        matchedCr.status = idea.status === 'Withdrawn' ? 'Withdrawn' : 'Pending_Review';
        saveChangeRequests();
      }

      saveIdeas();
      renderIdeas();
      renderIntakeLedger();
    }

    function filterIdeas(filterType) {
      currentIdeaFilter = filterType;
      document.querySelectorAll('.idea-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filterType);
      });
      renderIdeas();
    }

    function copyIdeasForDev() {
      const payload = {
        changeRequests: changeRequestsList,
        stagedIdeas: ideasList
      };
      const exportJson = JSON.stringify(payload, null, 2);
      navigator.clipboard.writeText(exportJson).then(() => {
        alert(`📋 Copied ${changeRequestsList.length} change requests & ${ideasList.length} staged ideas as structured JSON to clipboard for developer triage!`);
      }).catch(() => {
        alert('Failed to copy to clipboard. Please check browser permissions.');
      });
    }

    function renderIdeas() {
      const grid = document.getElementById('ideas-grid');
      const countEl = document.getElementById('ideas-count');
      if (!grid) return;

      let filtered = ideasList;
      if (currentIdeaFilter === 'STAGED') {
        filtered = ideasList.filter(i => i.status !== 'Withdrawn');
      } else if (currentIdeaFilter === 'WITHDRAWN') {
        filtered = ideasList.filter(i => i.status === 'Withdrawn');
      }

      if (countEl) countEl.innerText = filtered.length;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 28px; border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); background: rgba(15, 22, 36, 0.4); color: var(--text-dim);">
            No ideas in this view. Click "+ Drop New Idea" or the "💡 Share Idea" button in the header to submit inspiration!
          </div>
        `;
        return;
      }

      grid.innerHTML = '';
      filtered.forEach((idea) => {
        const originalIndex = ideasList.findIndex(i => i.id === idea.id);
        const card = document.createElement('div');
        card.className = 'role-badge-card';
        card.style.position = 'relative';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        if (idea.status === 'Withdrawn') {
          card.style.opacity = '0.65';
          card.style.borderStyle = 'dashed';
        }
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

        const withdrawBtnText = idea.status === 'Withdrawn' ? '↺ Restore' : '📥 Withdraw';
        const withdrawBtnStyle = idea.status === 'Withdrawn' ? 'background: rgba(245, 197, 24, 0.1); color: var(--gold-bright);' : 'background: none; color: var(--text-muted);';

        card.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; gap: 6px;">
              <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
                <span style="font-family: monospace; font-weight: 700; color: var(--gold-bright); font-size: 0.78rem;">${idea.id}</span>
                <span class="status-badge" style="background: rgba(59, 130, 246, 0.15); color: var(--sapphire-royal); font-size: 0.68rem;">${idea.category}</span>
                <span class="status-badge ${idea.status === 'Withdrawn' ? '' : 'status-progress'}" style="font-size: 0.68rem; ${idea.status === 'Withdrawn' ? 'color: var(--text-dim); border-color: var(--border-subtle);' : ''}">${idea.status}</span>
              </div>
              <button onclick="withdrawIdea(${originalIndex})" class="theme-toggle-btn" style="padding: 2px 8px; font-size: 0.72rem; ${withdrawBtnStyle}" title="${idea.status === 'Withdrawn' ? 'Restore proposal' : 'Withdraw without deleting'}">${withdrawBtnText}</button>
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

    // ── Universal Intake & Change Requests Ledger Modal ────────────
    let currentLedgerFilter = 'ALL';

    function openIntakeLedgerModal() {
      const modal = document.getElementById('intakeLedgerModal');
      if (modal) {
        renderIntakeLedger();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    }

    function closeIntakeLedgerModal(e) {
      const modal = document.getElementById('intakeLedgerModal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    function filterIntakeLedger(domain) {
      currentLedgerFilter = domain;
      document.querySelectorAll('.ledger-filter-btn, .ledger-tab-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-domain') === domain);
      });
      renderIntakeLedger();
    }

    function renderIntakeLedger() {
      const modalTbody = document.getElementById('intake-ledger-tbody');
      const tabTbody = document.getElementById('intake-tab-tbody');
      const modalCountEl = document.getElementById('intake-ledger-count');
      const tabCountEl = document.getElementById('ledger-tab-count');

      let filtered = changeRequestsList;
      if (currentLedgerFilter !== 'ALL') {
        filtered = changeRequestsList.filter(cr => cr.targetDomain === currentLedgerFilter);
      }

      if (modalCountEl) modalCountEl.innerText = filtered.length;
      if (tabCountEl) tabCountEl.innerText = filtered.length;

      const renderRows = (tbody) => {
        if (!tbody) return;
        if (filtered.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 24px;">
                No change requests found for domain: ${currentLedgerFilter}
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = '';
        filtered.forEach(cr => {
          const tr = document.createElement('tr');
          const statusColor = cr.status === 'Pending_Review' ? 'var(--gold-bright)' : cr.status === 'Approved_Merged' ? 'var(--emerald-royal)' : 'var(--crimson-royal)';
          
          let actionBtns = '';
          if (cr.status === 'Approved_Merged') {
            actionBtns = `<span style="color: var(--emerald-royal); font-size: 0.75rem; font-weight: 600;">✓ Merged</span>`;
          } else if (cr.status === 'Withdrawn') {
            actionBtns = `<button onclick="approveChangeRequest('${cr.requestId}')" class="theme-toggle-btn" style="padding: 2px 8px; font-size: 0.72rem; color: var(--gold-bright);">↺ Re-open</button>`;
          } else {
            actionBtns = `
              <div style="display: flex; gap: 4px; justify-content: center;">
                <button onclick="approveChangeRequest('${cr.requestId}')" class="btn-primary" style="padding: 3px 8px; font-size: 0.72rem; border-radius: var(--radius-sm); cursor: pointer;" title="Align & Merge into live execution">✓ Approve</button>
                <button onclick="rejectChangeRequest('${cr.requestId}')" class="theme-toggle-btn" style="padding: 3px 6px; font-size: 0.72rem; color: var(--text-dim);" title="Soft-archive proposal">✕</button>
              </div>
            `;
          }

          tr.innerHTML = `
            <td><strong style="font-family: monospace; color: var(--gold-bright); font-size: 0.8rem;">${cr.requestId}</strong></td>
            <td><span class="role-pill-tag" style="background: var(--bg-surface-elevated); font-size: 0.72rem;">${cr.targetDomain}</span></td>
            <td>
              <div style="font-weight: 600; color: var(--text-main); font-size: 0.84rem;">${cr.title}</div>
              <div style="font-size: 0.74rem; color: var(--text-dim); margin-top: 2px;">${cr.payload ? (cr.payload.rawNotes || '') : ''}</div>
            </td>
            <td style="font-size: 0.8rem; color: var(--text-muted);">${cr.submitter}</td>
            <td style="font-size: 0.75rem; color: var(--text-dim);">${cr.submittedAt ? cr.submittedAt.split('T')[0] : '2026-08-22'}</td>
            <td><span class="status-badge" style="color: ${statusColor}; border-color: ${statusColor}; font-size: 0.7rem;">${cr.status}</span></td>
            <td style="text-align: center;">${actionBtns}</td>
          `;
          tbody.appendChild(tr);
        });
      };

      renderRows(modalTbody);
      renderRows(tabTbody);
    }

    function approveChangeRequest(requestId) {
      const cr = changeRequestsList.find(r => r.requestId === requestId);
      if (!cr) return;

      if (cr.status === 'Approved_Merged') {
        alert(`Proposal ${requestId} is already Approved & Merged into active master state.`);
        return;
      }

      cr.status = 'Approved_Merged';
      cr.mergedAt = new Date().toISOString();
      cr.mergedBy = getAuthenticatedSubmitterName();

      let createdEntityId = null;

      // Automated SSOT State Mutation for Tasks
      if (cr.targetDomain === 'TASKS' || cr.intentType === 'PROPOSE_TASK') {
        const nextId = generateNextTaskId();
        createdEntityId = nextId;
        const newTask = {
          id: nextId,
          title: cr.title.replace(/^Task Proposal:\s*/, '').replace(/^Tasks:\s*/, ''),
          event: cr.targetEvent || 'Master_Planning',
          owner: cr.payload ? (cr.payload.suggestedOwner || cr.submitter) : cr.submitter,
          priority: 'High',
          status: 'Planned',
          track: 'purohit',
          checklist: [
            { text: `Review proposal requirements: ${cr.payload ? (cr.payload.rawNotes || cr.title) : cr.title}`, done: false },
            { text: 'Confirm operational lead and execution window', done: false }
          ]
        };
        currentTasks.unshift(newTask);
        renderTaskTable();
        renderSwimlaneMatrix();
      }

      // Persist changes
      try {
        localStorage.setItem(STORAGE_KEYS.CHANGE_REQUESTS, JSON.stringify(changeRequestsList));
        localStorage.setItem('sree_krushna_tasks_v1', JSON.stringify(currentTasks));
      } catch (e) {
        console.warn('Storage sync failed:', e.message);
      }

      renderIntakeLedger();
      renderIdeas();

      alert(`🎉 Proposal ${requestId} successfully APPROVED & GRADUATED into live active SSOT${createdEntityId ? ` as ${createdEntityId}` : ''}!`);
    }

    function rejectChangeRequest(requestId) {
      const cr = changeRequestsList.find(r => r.requestId === requestId);
      if (!cr) return;

      if (!confirm(`Are you sure you want to mark proposal "${cr.requestId}: ${cr.title}" as Withdrawn? (This preserves audit history).`)) {
        return;
      }

      cr.status = 'Withdrawn';
      cr.withdrawnAt = new Date().toISOString();
      cr.withdrawnBy = getAuthenticatedSubmitterName();

      try {
        localStorage.setItem(STORAGE_KEYS.CHANGE_REQUESTS, JSON.stringify(changeRequestsList));
      } catch (e) {
        console.warn('Storage sync failed:', e.message);
      }

      renderIntakeLedger();
      renderIdeas();
    }

    // ── DO_PKOS Operating Studio (Sandbox) Engine ───────────────────
    let currentDopkosView = 'TOPOLOGY'; // 'TOPOLOGY' | 'THREADS' | 'RUNSHEET' | 'ROADMAP' | 'MATRIX' | 'CRITICAL'
    let currentDopkosEvent = 'ALL';
    let currentDopkosTrack = 'ALL';

    const DAY_OF_SCHEDULE = [
      {
        time: '03:30',
        label: 'Mobilisation & Wakeup',
        gate: null,
        tracks: {
          bride: { title: 'Wake-up, hydration & light nourishment', lead: 'PER-006 (Bride Mother)', status: 'Planned' },
          groom: { title: 'Wake-up, grooming & hydration', lead: 'PER-008 (Groom Lead)', status: 'Planned' },
          purohit: { title: 'Priest arrival & sacred fire-area inspection', lead: 'Chief Purohit', status: 'Planned' },
          catering: { title: 'Kitchen mobilisation & priest meal packing', lead: 'Food Lead', status: 'Planned' },
          media: { title: 'Camera batteries & media server sanity check', lead: 'Media Lead', status: 'Planned' },
          fleet: { title: 'Early morning vehicle check & hotel shuttles', lead: 'Fleet Lead', status: 'Planned' }
        }
      },
      {
        time: '04:00',
        label: 'Styling & Vault Opening',
        gate: null,
        tracks: {
          bride: { title: 'Bridal MUA & hair styling begins', lead: 'MUA Team', status: 'Planned' },
          groom: { title: 'Groom styling & traditional attire prep', lead: 'Groom Styling', status: 'Planned' },
          purohit: { title: 'Samagri count & Kusha grass arrangement', lead: 'Priest Assistant', status: 'Planned' },
          catering: { title: 'Breakfast buffet setup for early guests', lead: 'Catering Lead', status: 'Planned' },
          media: { title: 'Macro detail shots of rings & invites', lead: 'Lead Photographer', status: 'Planned' },
          fleet: { title: 'Jewellery vault opened under two-person custody', lead: 'Security Lead & Groom Father', status: 'Planned', critical: true }
        }
      },
      {
        time: '05:30',
        label: 'Jewellery Fitting & Mandap Sanctum',
        gate: null,
        tracks: {
          bride: { title: 'Bridal gold jewellery fitting & Baula Patani draping', lead: 'Bride Mother', status: 'Planned', critical: true },
          groom: { title: 'Groom Dhoti & Mukuta placement prep', lead: 'Groom Uncle', status: 'Planned' },
          purohit: { title: 'Mandap sacred purification with Ganga jal', lead: 'Chief Purohit', status: 'Planned' },
          catering: { title: 'Guest breakfast service active', lead: 'Hospitality Lead', status: 'Planned' },
          media: { title: 'First-look portrait setup & lighting lock', lead: 'Media Lead', status: 'Planned' },
          fleet: { title: 'Driver manifests distributed for guest pickups', lead: 'Fleet Lead', status: 'Planned' }
        }
      },
      {
        time: '06:45',
        label: 'Barat Assembly & Gate Readiness',
        gate: 'GATE-02',
        gateTitle: 'GATE-02: Barat Assembly & Narayana Reception',
        tracks: {
          bride: { title: 'Bride in private green room; final veil check', lead: 'Sree & Maid of Honor', status: 'Planned' },
          groom: { title: 'Barat departure assembly with brass band', lead: 'Krushna & Barat Lead', status: 'Planned' },
          purohit: { title: 'Aarti Thali, tender coconut & Varamala ready at arch', lead: 'Purohit & Bride Mother', status: 'Planned', critical: true },
          catering: { title: 'Welcome drinks & fresh tender coconut station open', lead: 'Catering Lead', status: 'Planned' },
          media: { title: 'Barat procession drone/gimbal live coverage', lead: 'Cinematographer', status: 'Planned' },
          fleet: { title: 'Barat traffic escort & parking lanes locked', lead: 'Fleet Lead', status: 'Planned' }
        }
      },
      {
        time: '07:30',
        label: 'Baranugam & Arch Entry',
        gate: null,
        tracks: {
          bride: { title: 'Bride entry-ready on bridal pathway', lead: 'Bride Brother', status: 'Planned' },
          groom: { title: 'Groom welcomed as Lord Narayana at mandap arch', lead: 'Bride Mother', status: 'Planned', critical: true },
          purohit: { title: 'Vedic welcoming chants & Varamala exchange', lead: 'Chief Purohit', status: 'Planned' },
          catering: { title: 'Morning snacks & spiced buttermilk distribution', lead: 'Food Lead', status: 'Planned' },
          media: { title: 'Two-camera mandap recording initiated', lead: 'Media Lead', status: 'Planned' },
          fleet: { title: 'Sacred zone security perimeter locked', lead: 'Security Lead', status: 'Planned' }
        }
      },
      {
        time: '08:00',
        label: 'Astrological Lagna & Mandap Sanctum',
        gate: 'GATE-03',
        gateTitle: 'GATE-03: Kanyadaan, Hastaganthi & Saptapadi (08:00 Lagna Muhurat)',
        tracks: {
          bride: { title: 'Kanyadaan: Father pours consecrated water; Hastaganthi tied', lead: 'Kanyadata & Sree', status: 'Planned', critical: true },
          groom: { title: 'Paternal vows affirmed; Hastaganthi sacred knot received', lead: 'Krushna & Parents', status: 'Planned', critical: true },
          purohit: { title: 'Vedic Agni Homa, Lajahoma & Saptapadi seven vows', lead: 'Chief Purohit', status: 'Planned', critical: true },
          catering: { title: 'Mandap sacred zone kept quiet; quiet service nearby', lead: 'Food Lead', status: 'Planned' },
          media: { title: 'Lapel audio synced with macro ceremony recording', lead: 'Media Lead', status: 'Planned' },
          fleet: { title: 'Fire safety marshal and backup generator on hot standby', lead: 'Fleet Lead', status: 'Planned' }
        }
      },
      {
        time: '08:45',
        label: 'Coronation & Vermilion Rite',
        gate: 'GATE-04',
        gateTitle: 'GATE-04: Sindoor Daan & Mukuta Coronation',
        tracks: {
          bride: { title: 'Sindoor Daan on forehead parting; Mangalsutra Dharan', lead: 'Sree & Krushna', status: 'Planned', critical: true },
          groom: { title: 'Cuttack silver filigree Mukuta crowned by maternal uncle', lead: 'Krushna & Uncle', status: 'Planned', critical: true },
          purohit: { title: 'Final Shanti Patha & Mahaprasad blessing', lead: 'Chief Purohit', status: 'Planned' },
          catering: { title: 'Grand traditional Odia wedding feast service begins', lead: 'Food Lead', status: 'Planned' },
          media: { title: 'Elder blessing portraits & couple sanctum closeups', lead: 'Media Lead', status: 'Planned' },
          fleet: { title: 'Precious jewellery & sacred samagri re-logged into safe', lead: 'Security Lead', status: 'Planned' }
        }
      },
      {
        time: '19:00',
        label: 'Grand Royal Reception',
        gate: null,
        tracks: {
          bride: { title: 'Bridal reception silk styling & stage entry', lead: 'Sree', status: 'Planned' },
          groom: { title: 'Groom royal reception sherwani styling & stage walk', lead: 'Krushna', status: 'Planned' },
          purohit: { title: 'Receiving line elder blessings', lead: 'Elders Council', status: 'Planned' },
          catering: { title: '850+ capacity royal buffet opened in waves; live counters', lead: 'Catering Lead', status: 'Planned' },
          media: { title: 'Photo lounge candids & guest stage portraits', lead: 'Media Lead', status: 'Planned' },
          fleet: { title: 'VIP valet & guest departure transport active', lead: 'Fleet Lead', status: 'Planned' }
        }
      },
      {
        time: '23:00',
        label: 'Reconciliation & Vault Closeout',
        gate: null,
        tracks: {
          bride: { title: 'Personal luggage and attire transfer for Grihapravesh', lead: 'Bride Team', status: 'Planned' },
          groom: { title: 'Groom departure preparation', lead: 'Groom Team', status: 'Planned' },
          purohit: { title: 'Ritual trunk sealed for Day +1 rites', lead: 'Chief Purohit', status: 'Planned' },
          catering: { title: 'Vendor meal service & kitchen cleanout signoff', lead: 'Food Lead', status: 'Planned' },
          media: { title: '3-copy data backup verified with checksums', lead: 'Media Lead', status: 'Planned' },
          fleet: { title: 'Gold jewellery, shagun cash & media sealed into vault', lead: 'Security Lead', status: 'Planned', critical: true }
        }
      }
    ];

    const MACRO_HORIZONS = [
      {
        id: 'H1',
        name: 'T-180 to T-120: Foundation & Authority',
        period: '11 Sep – 10 Nov 2026',
        desc: 'Purohit appointment, venue leases, budget allocation, handloom trousseau weaving.',
        tasks: ['GOV-001', 'GOV-002', 'GOV-003', 'VEN-001', 'VEN-002', 'VEN-003', 'SEC-001']
      },
      {
        id: 'H2',
        name: 'T-120 to T-60: Guest Architecture & Procurement',
        period: '10 Nov 2026 – 9 Jan 2027',
        desc: 'Rooming rules, photography SLAs, menu tasting, silver filigree Mukuta measurements.',
        tasks: ['GFT-001', 'GFT-002', 'RIT-001', 'RIT-002', 'RIT-003', 'RIT-006', 'LOG-004']
      },
      {
        id: 'H3',
        name: 'T-60 to T-14: Operational Detailing & Trials',
        period: '9 Jan – 25 Feb 2027',
        desc: 'MUA trials, 125kVA generator load test, FSSAI catering hygiene audit, mithai batching.',
        tasks: ['FOOD-001', 'FOOD-002', 'FOOD-003', 'FOOD-004', 'PWR-001', 'PWR-002', 'DEC-001', 'DEC-002', 'DEC-003']
      },
      {
        id: 'H4',
        name: 'T-14 to T-1: Rayagada Mobilisation',
        period: '26 Jan – 10 Feb 2027',
        desc: 'Deva Nimantrana, Rayagada stage installation, dry-runs, Mangan turmeric preparation.',
        tasks: ['RIT-004', 'LOG-001', 'LOG-002', 'LOG-003', 'SEC-002', 'SEC-003', 'MED-001', 'MED-002', 'MED-003', 'MED-004']
      },
      {
        id: 'H5',
        name: 'Day 0A: Rayagada Nirbandha',
        period: '11 February 2027',
        desc: 'Patra Paribartana, paternal vow exchange, ring ceremony, traditional Rayagada feast.',
        tasks: ['RIT-003', 'GATE-01', 'FOOD-001', 'SEC-001']
      },
      {
        id: 'H6',
        name: 'Day 0B: BBSR Wedding & Reception',
        period: '10 March 2027',
        desc: '08:00 Lagna Muhurat, Kanyadaan, Hastaganthi, Saptapadi, 850+ guest royal reception.',
        tasks: ['RIT-005', 'GATE-02', 'GATE-03', 'GATE-04', 'FOOD-003', 'MED-006']
      },
      {
        id: 'H7',
        name: 'Day +1 to +30: Post-Wedding & Legal SUJOG',
        period: '11 Mar – 10 Apr 2027',
        desc: 'Grihapravesh, Chauthi night, Astamangala feast, SUJOG marriage registration, archive.',
        tasks: ['LEG-001', 'LEG-002', 'CLS-001', 'CLS-002']
      }
    ];

    function setDopkosView(viewName) {
      currentDopkosView = viewName;
      document.querySelectorAll('.dopkos-view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-view-${viewName.toLowerCase()}`);
      });
      renderDoPkosStudio();
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

      // Synchronize View Switcher Button Active Highlighters
      document.querySelectorAll('.dopkos-view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `btn-view-${currentDopkosView.toLowerCase()}`);
      });

      if (currentDopkosView === 'TOPOLOGY') {
        renderDopkosTopology(container);
      } else if (currentDopkosView === 'THREADS') {
        renderDopkosThreads(container);
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

    // ── UG-Farmhouse Authentic Dependency Topology Engine ───────────
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
      if (window.renderPlanningSuite) window.renderPlanningSuite();
      if (selectedTopologyTaskId) {
        openTaskConsole(taskId);
      }
    }

    function clearTopologySelection() {
      selectedTopologyTaskId = null;
      if (window.renderPlanningSuite) window.renderPlanningSuite();
    }

    // ── Topology Status Storage & Dynamic State Machine ────────────
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
      if (window.renderPlanningSuite) window.renderPlanningSuite();
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

      // Coordinate mapper
      const taskCoords = {};
      TOPOLOGY_TASKS.forEach(t => {
        const rowIndex = TOPOLOGY_TRACKS.findIndex(tr => tr.id === t.track);
        const colIndex = t.col !== undefined ? t.col : (t.stage - 1);
        const x = LABEL_W + colIndex * COL_W + 12;
        const y = HEADER_H + rowIndex * ROW_H + 8;
        taskCoords[t.id] = { x, y, colIndex, rowIndex };
      });

      // Render Stage Headers
      let headerHtml = `
        <div style="display: flex; height: ${HEADER_H}px; border-bottom: 2px solid var(--border-subtle); position: sticky; top: 0; background: var(--bg-surface-elevated); z-index: 30;">
          <div style="width: ${LABEL_W}px; flex-shrink: 0; border-right: 1px solid var(--border-subtle); background: var(--bg-surface-elevated); font-size: 0.72rem; font-weight: 800; color: var(--gold-bright); display: flex; align-items: center; justify-content: center; text-transform: uppercase;">
            TRACK / STAGE
          </div>
      `;
      TOPOLOGY_STAGES.forEach(s => {
        headerHtml += `
          <div style="width: ${COL_W}px; flex-shrink: 0; border-right: 1px solid var(--border-subtle); padding: 6px 10px; display: flex; flex-direction: column; justify-content: center;">
            <span style="font-size: 0.68rem; font-weight: 700; color: var(--gold-bright); text-transform: uppercase;">STAGE ${s.num}</span>
            <span style="font-size: 0.72rem; color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.name.split(':')[1] || s.name}</span>
          </div>
        `;
      });
      headerHtml += `</div>`;

      // Render Rows & Left Track Labels
      let rowsHtml = '';
      TOPOLOGY_TRACKS.forEach((track, rIndex) => {
        rowsHtml += `
          <div style="display: flex; height: ${ROW_H}px; border-bottom: 1px solid var(--border-subtle); background: ${track.bg};">
            <div style="width: ${LABEL_W}px; flex-shrink: 0; border-right: 2px solid ${track.color}; background: var(--bg-surface-elevated); padding: 8px 6px; display: flex; flex-direction: column; justify-content: center; position: sticky; left: 0; z-index: 20;">
              <span style="font-size: 0.76rem; font-weight: 800; color: ${track.color};">${track.label}</span>
              <span style="font-size: 0.65rem; color: var(--text-dim);">${track.id.toUpperCase()}</span>
            </div>
            <div style="flex: 1; display: flex;">
              ${TOPOLOGY_STAGES.map(() => `<div style="width: ${COL_W}px; flex-shrink: 0; border-right: 1px dashed rgba(255,255,255,0.05);"></div>`).join('')}
            </div>
          </div>
        `;
      });

      // Render SVG Dependency Edges with Micro-Legends
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
          const pathD = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

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
            gateLabel = `
              <text x="${midX}" y="${midY - 5}" font-size="9" fill="#f59e0b" font-weight="700" text-anchor="middle" letter-spacing="0.5">🔒 SEALING GATE</text>
            `;
          }

          svgEdgesHtml += `
            <g class="dep-edge" data-from="${fromId}" data-to="${t.id}">
              <path d="${pathD}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-dasharray="${strokeDash}" />
              ${gateLabel}
            </g>
          `;
        });
      });

      // Render Task Cards with Dynamic Status Machine
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

        cardsHtml += `
          <div class="task-card-node" style="position: absolute; left: ${coord.x}px; top: ${coord.y}px; width: ${CARD_W}px; height: ${CARD_H}px; ${cardBg} ${cardBorder} ${cardGlow} border-left: 3px solid ${trackColor}; border-radius: 4px; padding: 6px 8px; cursor: pointer; z-index: ${zIndex}; transition: all 0.2s ease;" onclick="selectTopologyNode('${t.id}')">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
              <span style="font-family: monospace; font-size: 0.68rem; font-weight: 800; color: var(--gold-bright);">${t.id}</span>
              <button onclick="toggleTopologyStatus('${t.id}', event)" class="status-pill" style="font-size: 0.62rem; font-weight: 700; padding: 1px 6px; border-radius: 3px; border: 1px solid; cursor: pointer; ${statusStyle}" title="Click to toggle status (READY -> ACTIVE -> DONE)">
                ${status === 'DONE' ? '✓ DONE' : status}
              </button>
            </div>
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-main); line-height: 1.25; max-height: 2.5em; overflow: hidden;">${t.name}</div>
            <div style="margin-top: 4px; font-size: 0.65rem; color: var(--text-dim); display: flex; justify-content: space-between;">
              <span>${t.depends_on.length ? `Prereqs: ${t.depends_on.length}` : 'Start Node'}</span>
              ${isSelected ? '<span style="color: var(--gold-bright); font-weight: 800;">ACTIVE</span>' : ''}
              ${isPred ? '<span style="color: #f59e0b; font-weight: 800;">BLOCKER</span>' : ''}
              ${isSucc ? '<span style="color: #38bdf8; font-weight: 800;">UNLOCKS</span>' : ''}
            </div>
          </div>
        `;
      });

      // Interactive Breadcrumbs Ribbon
      let breadcrumbsRibbon = '';
      if (selectedTopologyTaskId) {
        const selTask = TOPOLOGY_TASKS.find(x => x.id === selectedTopologyTaskId);
        const predsList = Array.from(preds).map(id => TOPOLOGY_TASKS.find(x => x.id === id)).filter(Boolean);
        const succsList = Array.from(succs).map(id => TOPOLOGY_TASKS.find(x => x.id === id)).filter(Boolean);

        breadcrumbsRibbon = `
          <div style="background: linear-gradient(135deg, rgba(245, 197, 24, 0.12), var(--bg-surface-elevated)); border: 1px solid var(--gold-antique); border-radius: var(--radius-md); padding: 10px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 800; color: var(--gold-bright); font-size: 0.85rem;">📍 Focus: <strong>${selTask.id}: ${selTask.name}</strong></span>
              <span style="color: var(--text-dim); font-size: 0.76rem;">|</span>
              <span style="font-size: 0.76rem; color: #f59e0b;">⛔ Blocked by: ${predsList.map(p => `<strong style="cursor: pointer; text-decoration: underline;" onclick="selectTopologyNode('${p.id}')">${p.id}</strong>`).join(', ') || '<span style="color: var(--emerald-royal);">None (Ready to Start)</span>'}</span>
              <span style="color: var(--text-dim); font-size: 0.76rem;">──></span>
              <span style="font-size: 0.76rem; color: #38bdf8;">🔓 Unlocks: ${succsList.map(s => `<strong style="cursor: pointer; text-decoration: underline;" onclick="selectTopologyNode('${s.id}')">${s.id}</strong>`).join(', ') || 'Terminal Node'}</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-primary" onclick="openTaskConsole('${selectedTopologyTaskId}')" style="font-size: 0.72rem; padding: 4px 12px; background: var(--gold-gradient); color: #080b11; font-weight: 700;">🔍 Open Console</button>
              <button class="theme-toggle-btn" onclick="clearTopologySelection()" style="font-size: 0.72rem; padding: 4px 10px; background: var(--bg-surface);">✕ Reset</button>
            </div>
          </div>
        `;
      } else {
        breadcrumbsRibbon = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: rgba(15, 22, 36, 0.6); padding: 8px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 8px;">
            <div style="font-size: 0.78rem; color: var(--text-muted);">
              💡 <strong>Sacred Precedence DAG Engine:</strong> Click any card to highlight its complete upstream blockers (<span style="color: #f59e0b; font-weight: 700;">Amber Predecessors</span>) & downstream unlocks (<span style="color: #38bdf8; font-weight: 700;">Blue Successors</span>). Click status pills to toggle state!
            </div>
          </div>
        `;
      }

      // Full Assembly
      container.innerHTML = `
        ${breadcrumbsRibbon}
        <div id="topology-scroll-viewport" style="overflow: auto; max-height: 620px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); position: relative; background: #080b11;">
          <div style="position: relative; width: ${totalWidth}px; height: ${totalHeight}px;">
            ${headerHtml}
            ${rowsHtml}
            <svg style="position: absolute; top: 0; left: 0; width: ${totalWidth}px; height: ${totalHeight}px; pointer-events: none; z-index: 5;">
              ${svgEdgesHtml}
            </svg>
            ${cardsHtml}
          </div>
        </div>
      `;
    }

    // View 1: ⏱️ Day-Of Live Multi-Track Run Sheet
    function renderDopkosRunSheet(container) {
      let html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
      `;

      DAY_OF_SCHEDULE.forEach((slot) => {
        // Render Gate Banner if slot is a gate
        let gateBanner = '';
        if (slot.gate) {
          gateBanner = `
            <div style="background: linear-gradient(90deg, rgba(245, 197, 24, 0.2), var(--bg-surface-elevated)); border-left: 4px solid var(--gold-bright); padding: 10px 16px; border-radius: var(--radius-sm); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: var(--font-display); color: var(--gold-bright); font-weight: 700; font-size: 0.92rem;">🛡️ ${slot.gateTitle}</span>
              <span class="status-badge" style="background: var(--gold-bright); color: #080b11; font-weight: 800; font-size: 0.72rem;">SYNCHRONIZATION GATE</span>
            </div>
          `;
        }

        // Render parallel track cards
        const tracks = ['bride', 'groom', 'purohit', 'catering', 'media', 'fleet'];
        let trackCardsHtml = '';

        tracks.forEach(trackKey => {
          if (currentDopkosTrack !== 'ALL' && currentDopkosTrack !== trackKey) return;
          const item = slot.tracks[trackKey];
          if (!item) return;

          const trackIcons = { bride: '👰', groom: '🤵', purohit: '🕉️', catering: '🍲', media: '📸', fleet: '🛡️' };
          const borderHighlight = item.critical ? 'border-color: var(--gold-bright); box-shadow: 0 0 10px rgba(245, 197, 24, 0.15);' : '';

          trackCardsHtml += `
            <div class="role-badge-card" style="margin: 0; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; ${borderHighlight}" onclick="openTaskConsole('TSK-101')">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 0.72rem; font-weight: 700; color: var(--gold-bright); text-transform: uppercase;">${trackIcons[trackKey]} ${trackKey}</span>
                  ${item.critical ? '<span class="status-badge status-urgent" style="font-size: 0.65rem; padding: 1px 6px;">Lagna Critical</span>' : ''}
                </div>
                <div style="font-size: 0.84rem; color: var(--text-main); font-weight: 600; line-height: 1.3;">${item.title}</div>
              </div>
              <div style="margin-top: 8px; font-size: 0.72rem; color: var(--text-dim); display: flex; justify-content: space-between;">
                <span>👤 ${item.lead}</span>
                <span style="color: var(--emerald-royal);">✓ ${item.status}</span>
              </div>
            </div>
          `;
        });

        html += `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
            ${gateBanner}
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 6px;">
              <span style="font-family: monospace; font-size: 1.05rem; font-weight: 800; color: var(--gold-bright); background: rgba(245, 197, 24, 0.1); padding: 2px 8px; border-radius: var(--radius-sm);">${slot.time} IST</span>
              <strong style="color: var(--text-main); font-size: 0.9rem;">${slot.label}</strong>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
              ${trackCardsHtml}
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;
    }

    // View 2: 📅 Macro Planning Roadmap (Gantt Horizon)
    function renderDopkosRoadmap(container) {
      let html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
      `;

      MACRO_HORIZONS.forEach(horizon => {
        html += `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
              <div>
                <h4 style="font-family: var(--font-display); color: var(--gold-bright); margin: 0 0 4px; font-size: 1rem;">${horizon.name}</h4>
                <p style="color: var(--text-muted); font-size: 0.82rem; margin: 0; line-height: 1.4;">${horizon.desc}</p>
              </div>
              <span class="status-badge" style="background: rgba(59, 130, 246, 0.15); color: var(--sapphire-royal); font-size: 0.74rem;">📅 ${horizon.period}</span>
            </div>

            <!-- Tasks Pills Row -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
              ${horizon.tasks.map(t => `<span class="role-pill-tag" style="background: var(--bg-surface-elevated); font-family: monospace; font-size: 0.75rem; cursor: pointer;" onclick="openTaskConsole('${t}')">${t}</span>`).join('')}
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;
    }

    // View 3: 📊 2D Role Matrix (UG-Farmhouse DO_PKOS Standard)
    function renderDopkosMatrix(container) {
      let html = `
        <div class="table-responsive-wrapper" style="overflow-x: auto;">
          <table class="task-table" style="font-size: 0.8rem; border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="min-width: 140px; position: sticky; left: 0; background: var(--bg-surface-elevated); z-index: 2;">Role Track</th>
                <th>T-180..T-120</th>
                <th>T-120..T-60</th>
                <th>T-60..T-14</th>
                <th>Rayagada (11 Feb)</th>
                <th>BBSR Wedding (10 Mar)</th>
                <th>Post-Event (SUJOG)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="position: sticky; left: 0; background: var(--bg-surface-elevated); font-weight: 700; color: var(--gold-bright);">👰 Bride Team</td>
                <td>Handloom Baula Patani Saree</td>
                <td>Bridal Footwear & MUA Trial</td>
                <td>Green Room Logistics</td>
                <td>Mangan Turmeric Bath</td>
                <td>Kanyadaan & Hastaganthi</td>
                <td>Grihapravesh Altas</td>
              </tr>
              <tr>
                <td style="position: sticky; left: 0; background: var(--bg-surface-elevated); font-weight: 700; color: var(--gold-bright);">🤵 Groom Team</td>
                <td>Groom Traditional Attire</td>
                <td>Cuttack Mukuta Sizing</td>
                <td>Barat Route Planning</td>
                <td>Patra Paribartana Exchange</td>
                <td>Baranugam & Saptapadi</td>
                <td>Chauthi Night Homa</td>
              </tr>
              <tr>
                <td style="position: sticky; left: 0; background: var(--bg-surface-elevated); font-weight: 700; color: var(--gold-bright);">🕉️ Purohit</td>
                <td>Chief Purohit Appointment</td>
                <td>Vidhi-Patra & Deva Nimantrana</td>
                <td>Samagri Trunks Packing</td>
                <td>Nirbandha Vows</td>
                <td>08:00 Lagna Muhurat Homa</td>
                <td>Astamangala Blessing</td>
              </tr>
              <tr>
                <td style="position: sticky; left: 0; background: var(--bg-surface-elevated); font-weight: 700; color: var(--gold-bright);">🍲 Food & Catering</td>
                <td>Authentic Odia Menu Tasting</td>
                <td>Mithai Shelf-Life Booking</td>
                <td>FSSAI Hygiene Audit</td>
                <td>Traditional Rayagada Feast</td>
                <td>850+ Capacity Royal Buffet</td>
                <td>Astamangala Feast</td>
              </tr>
              <tr>
                <td style="position: sticky; left: 0; background: var(--bg-surface-elevated); font-weight: 700; color: var(--gold-bright);">📸 Photo/Media</td>
                <td>Pre-wedding Permits</td>
                <td>4TB Backup Storage SLA</td>
                <td>Mandap Sightlines Test</td>
                <td>Family Portraits</td>
                <td>Two-Camera Mandap Audio</td>
                <td>Documentary Archive</td>
              </tr>
              <tr>
                <td style="position: sticky; left: 0; background: var(--bg-surface-elevated); font-weight: 700; color: var(--gold-bright);">🛡️ Security/Fleet</td>
                <td>Gold Insurance & Vault Lease</td>
                <td>Hotel Blocks & Driver List</td>
                <td>125kVA Generator Check</td>
                <td>Ring Ceremony Security</td>
                <td>Jewellery Dual-Custody</td>
                <td>SUJOG Legal Closeout</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = html;
    }

    // View 4: ⚡ Critical Path & Lagna Protection Map
    function renderDopkosCritical(container) {
      let html = `
        <div style="background: rgba(245, 197, 24, 0.05); border: 1px dashed var(--gold-antique); border-radius: var(--radius-md); padding: 16px; margin-bottom: 14px;">
          <h4 style="font-family: var(--font-display); color: var(--gold-bright); margin: 0 0 6px;">⚡ Critical Path: Astrological Lagna & Gold Vault Protection</h4>
          <p style="color: var(--text-muted); font-size: 0.82rem; margin: 0; line-height: 1.5;">
            These items have strict zero-tolerance dependency timelines. Any delay on a predecessor blocks the irreversible sacred rites.
          </p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
          <div class="role-badge-card" style="border: 2px solid var(--gold-bright); background: rgba(245, 197, 24, 0.08);">
            <span class="status-badge status-urgent" style="font-size: 0.68rem; margin-bottom: 6px;">BLOCKER 1 &bull; Astrological Lagna</span>
            <h5 style="color: var(--text-main); margin: 0 0 4px; font-size: 0.92rem;">Chief Purohit Lagna Lock (GOV-001)</h5>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0 0 8px;">Purohit's 08:00 IST Lagna timing strictly overrides all hospitality and entertainment schedules.</p>
            <div style="font-size: 0.72rem; color: var(--gold-bright);">Prerequisite for: RIT-001, GFT-001, VEN-001</div>
          </div>
          <div class="role-badge-card" style="border: 2px solid var(--gold-bright); background: rgba(245, 197, 24, 0.08);">
            <span class="status-badge status-urgent" style="font-size: 0.68rem; margin-bottom: 6px;">BLOCKER 2 &bull; Precious Vault</span>
            <h5 style="color: var(--text-main); margin: 0 0 4px; font-size: 0.92rem;">Two-Person Jewellery Vault Protocol (SEC-001)</h5>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0 0 8px;">Vault opened strictly under dual family sign-off at 04:00 and sealed post-rite at 09:00.</p>
            <div style="font-size: 0.72rem; color: var(--gold-bright);">Prerequisite for: Bridal Dressing, Mukuta Fitting</div>
          </div>
          <div class="role-badge-card" style="border: 2px solid var(--gold-bright); background: rgba(245, 197, 24, 0.08);">
            <span class="status-badge status-urgent" style="font-size: 0.68rem; margin-bottom: 6px;">BLOCKER 3 &bull; Power Resilience</span>
            <h5 style="color: var(--text-main); margin: 0 0 4px; font-size: 0.92rem;">Dedicated 125kVA Generator & Sound (PWR-001)</h5>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0 0 8px;">Independent power load prevents fire-homa blackout and guarantees Purohit lapel audio recording.</p>
            <div style="font-size: 0.72rem; color: var(--gold-bright);">Prerequisite for: Mandap Lighting, Live Stream</div>
          </div>
        </div>
      `;
      container.innerHTML = html;
    }

    // View 5: 🧵 Workstream Journey (Pulling the Thread Engine)
    let activeDopkosThread = 'PHOTO';

    const WORKSTREAM_THREADS = {
      PHOTO: {
        id: 'PHOTO',
        icon: '📸',
        title: 'Photography & Cinematography Journey',
        lead: 'Media Lead & Couple (Sree & Krushna)',
        tagline: 'From shortlisting with the 36-Question SLA to Pre-wedding permits, Rayagada shoot, and 4TB raw archiving.',
        steps: [
          {
            stepNum: 1,
            horizon: 'T-180 (TODAY)',
            status: 'ACTIVE_TODAY',
            title: 'Shortlist & Evaluate 3 Lead Photographers with 36-Question SLA',
            description: 'Evaluate camera rigs (Sony A7IV / FX3), macro lenses for vermilion/rings, Purohit lapel audio sync, dual-card backup, and confirm lead shooter presence.',
            deliverable: 'Signed SLA with 4TB raw data backup clause & 48h teaser commitment',
            ctaLabel: 'Propose Photographer Candidate',
            ctaDomain: 'Vendors',
            ctaNotes: 'Evaluate wedding photographer quote against 36-question SLA'
          },
          {
            stepNum: 2,
            horizon: 'T-150',
            status: 'NEXT_UP',
            title: 'Select & Permit Pre-Wedding Locations',
            description: 'Choose 2 curated Odisha backdrops: Puri Blue Flag Beach (sunrise seascape) vs Konark Marine Drive vs Muktesvara Temple heritage surroundings.',
            deliverable: 'Location permits secured, travel itinerary, wardrobe lookbook aligned with Sree'
          },
          {
            stepNum: 3,
            horizon: 'T-120',
            status: 'FUTURE',
            title: 'Rayagada Engagement Coverage Protocol',
            description: 'Coordinate photographer travel to Rayagada, establish lighting for evening Patra Paribartana & ring ceremony vows in indoor hall.',
            deliverable: 'Engagement shot-list: Paternal vow exchange, horoscope close-up, ring macro'
          },
          {
            stepNum: 4,
            horizon: 'T-30',
            status: 'FUTURE',
            title: 'Drone Clearances & Lapel Audio Hardware Dry-Run',
            description: 'Verify DGCA drone clearance, test wireless Purohit lapel mics against fire-homa frequency interference, and calibrate 125kVA generator power isolation.',
            deliverable: 'Audio sanity test sign-off with Chief Purohit'
          },
          {
            stepNum: 5,
            horizon: 'Day 0B (10 Mar)',
            status: 'FUTURE',
            title: 'Wedding Day 2-Camera Mandap Sanctum & Reception Protocol',
            description: '04:00 bridal detail macro shots -> 07:30 Barat arrival -> 08:00 Lagna Muhurat (uninterrupted Hastaganthi & Sindoor Daan) -> 19:00 Royal Reception live feed.',
            deliverable: 'Mandap sacred zone non-intrusive lens protocol enforced'
          },
          {
            stepNum: 6,
            horizon: 'Post-Wedding',
            status: 'FUTURE',
            title: '48h Teaser, 4TB Raw Data Handover & Luxury Album Print',
            description: 'Receive 60-second highlight reel within 48h for family broadcast. Collect uncompressed raw footage on encrypted drive. Proof and sign off 80-page legacy album.',
            deliverable: 'Physical album delivery & cloud archive lock'
          }
        ]
      },
      ATTIRE: {
        id: 'ATTIRE',
        icon: '👗',
        title: 'Handloom Trousseau & Bridal Attire Journey',
        lead: 'Bride Team (Sree & Mother)',
        tagline: 'Authentic Nuapatna Baula Patani, Cuttack Silver Filigree Mukutas, and Reception Silk.',
        steps: [
          {
            stepNum: 1,
            horizon: 'T-180 (TODAY)',
            status: 'ACTIVE_TODAY',
            title: 'Commission Nuapatna Master Weaver for Baula Patani & Dhoti',
            description: 'Directly commission authentic natural dyed Mulberry silk saree with traditional temple borders and coordinated Groom yellow silk Dhoti & Kurta.',
            deliverable: 'Weaving order placed with 90-day production window',
            ctaLabel: 'Propose Handloom Weaver',
            ctaDomain: 'Vision',
            ctaNotes: 'Commission Nuapatna weaver for authentic Baula Patani saree'
          },
          {
            stepNum: 2,
            horizon: 'T-150',
            status: 'NEXT_UP',
            title: 'Head-Size Measurement for Cuttack Silver Filigree Mukutas',
            description: 'Coordinate with Cuttack artisans to measure Bride & Groom head circumferences for lightweight, bespoke silver filigree crowns.',
            deliverable: 'Bespoke silver Mukuta pair crafting confirmed'
          },
          {
            stepNum: 3,
            horizon: 'T-120',
            status: 'FUTURE',
            title: 'Finalize Reception Evening Silk & Groom Royal Sherwani',
            description: 'Select Bride reception couture and Groom bespoke royal bandhgala/sherwani with coordinated accents.',
            deliverable: 'Attire ensemble locked and tailored'
          },
          {
            stepNum: 4,
            horizon: 'T-60',
            status: 'FUTURE',
            title: 'MUA Hair Styling & Saree Draping Trial',
            description: 'Complete trial session with bridal makeup artist for longevity, humidity resistance, and traditional Odia Mukuta fastening.',
            deliverable: 'MUA lookbook approved by Sree'
          },
          {
            stepNum: 5,
            horizon: 'Day 0A & 0B',
            status: 'FUTURE',
            title: 'Ceremonial Draping for Mangan & Sacred Mandap Sanctum',
            description: 'Mangan turmeric ritual bath dressing -> 05:30 wedding morning jewellery fitting & sacred Baula Patani draping -> Evening reception transformation.',
            deliverable: 'Smooth 3-change wardrobe schedule executed'
          }
        ]
      },
      VENUE: {
        id: 'VENUE',
        icon: '🏛️',
        title: 'Venues, Hospitality & Transport Journey',
        lead: 'Groom Uncle & Fleet Coordinator',
        tagline: 'Rayagada Nirbandha Hall, BBSR 850p Mandap, Hotel Room Blocks & Airport Shuttles.',
        steps: [
          {
            stepNum: 1,
            horizon: 'T-180 (TODAY)',
            status: 'ACTIVE_TODAY',
            title: 'Sign Rayagada & BBSR Venue Contracts with Power SLAs',
            description: 'Lock Rayagada Nirbandha AC banquet (11 Feb 2027) and BBSR Grand Mandap & Lawn (10 Mar 2027) with dedicated 125kVA generator & rain contingency clauses.',
            deliverable: 'Signed venue contracts with clear load-in and cleanup windows',
            ctaLabel: 'Propose Venue Agreement',
            ctaDomain: 'Venues',
            ctaNotes: 'Finalize venue contracts with 125kVA power generator backup'
          },
          {
            stepNum: 2,
            horizon: 'T-150',
            status: 'NEXT_UP',
            title: 'Block Hotel Rooms in Rayagada & Bhubaneswar',
            description: 'Reserve 25 AC rooms in Rayagada and 45 rooms in BBSR. Allocate ground-floor / near-lift rooms for elders.',
            deliverable: 'Room inventory locked with group discounts'
          },
          {
            stepNum: 3,
            horizon: 'T-90',
            status: 'FUTURE',
            title: 'Collect Outstation/NRI Guest Travel Windows',
            description: 'Issue Save-The-Dates with travel intake form to compile flight and train arrivals into BBI and RGDA.',
            deliverable: 'Consolidated guest arrival manifest'
          },
          {
            stepNum: 4,
            horizon: 'T-14',
            status: 'FUTURE',
            title: 'Fleet Mobilisation & Driver Contact Roster',
            description: 'Contract 8 dedicated Innovas/Travellers with designated route leaders and emergency contact cards in Odia & English.',
            deliverable: 'Driver duty chart and dispatch hotline live'
          },
          {
            stepNum: 5,
            horizon: 'Day 0A & 0B',
            status: 'FUTURE',
            title: 'Welcome Concierge, Valet & Departure Handover',
            description: 'Manage hotel check-in desks, Barat parking escort, and post-reception luggage departure.',
            deliverable: '100% guest check-in and checkout reconciled'
          }
        ]
      },
      FOOD: {
        id: 'FOOD',
        icon: '🍲',
        title: 'Authentic Odia Catering & Mithai Journey',
        lead: 'Food & Hospitality Lead',
        tagline: '21-Item Odia Feast, Chhena Poda Shelf-Life Tracking, and FSSAI Food Safety.',
        steps: [
          {
            stepNum: 1,
            horizon: 'T-180 (TODAY)',
            status: 'ACTIVE_TODAY',
            title: 'Menu Tasting & Formulation of Authentic 21-Item Feast',
            description: 'Formulate master menu: Kanika, Dalma, Paneer Besara, Dahi Baigana, Potola Rasa, Machha Besara (non-veg counters segregated), and Ambula Rai.',
            deliverable: 'Approved multi-course tasting menu sign-off',
            ctaLabel: 'Propose Catering Menu',
            ctaDomain: 'Food',
            ctaNotes: 'Approve authentic 21-item Odia catering menu with FSSAI hygiene SLA'
          },
          {
            stepNum: 2,
            horizon: 'T-120',
            status: 'NEXT_UP',
            title: 'Book Traditional Mithai Artisans & Shelf-Life Batches',
            description: 'Contract renowned confectioners for authentic Pahala Rasagola, Nayagarh Chhena Poda, Nimapada Chhena Jhili, and Puri Khaja.',
            deliverable: 'Staggered delivery batches aligned to event mornings'
          },
          {
            stepNum: 3,
            horizon: 'T-60',
            status: 'FUTURE',
            title: 'FSSAI Catering Hygiene Audit & Water Verification',
            description: 'Inspect caterer commercial kitchen, verify RO potable water supply for cooking/drinking, and audit food handler medical certificates.',
            deliverable: 'Food safety audit compliance certificate'
          },
          {
            stepNum: 4,
            horizon: 'Day 0A & 0B',
            status: 'FUTURE',
            title: 'Sattvic Priest Meals, Live Counters & 850p Buffet Waves',
            description: 'Serve sattvic without onion/garlic meals to Purohits prior to muhurat. Manage 3 parallel buffet lines to keep wait times under 4 minutes.',
            deliverable: '850+ guests served with zero stockouts'
          }
        ]
      },
      CUSTODY: {
        id: 'CUSTODY',
        icon: '💍',
        title: 'Precious Gold, Silver & Vault Custody Journey',
        lead: 'Security & Custody Lead (Parents Council)',
        tagline: 'Two-Person Dual Custody, Photographic Cataloging & Mandap Handshake.',
        steps: [
          {
            stepNum: 1,
            horizon: 'T-180 (TODAY)',
            status: 'ACTIVE_TODAY',
            title: 'Photographic Gold Jewellery Cataloging & Hallmarking Audit',
            description: 'Photograph, weigh, and catalog every bridal gold ornament with BIS hallmark certificates and assign secure transit bags.',
            deliverable: 'Signed Master Asset Ledger with high-res photos',
            ctaLabel: 'Propose Custody Ledger Entry',
            ctaDomain: 'Governance',
            ctaNotes: 'Log gold jewellery inventory into secure two-person custody ledger'
          },
          {
            stepNum: 2,
            horizon: 'T-120',
            status: 'NEXT_UP',
            title: 'Cuttack Silver Filigree Mukutas Inspection & Safe Storage',
            description: 'Receive bespoke silver Mukuta crowns from artisans, verify craftsmanship, and lock in velvet protective strongboxes.',
            deliverable: 'Silver Mukuta vault custody receipt signed'
          },
          {
            stepNum: 3,
            horizon: 'T-14',
            status: 'FUTURE',
            title: 'Designate Two-Person Custody Teams & Bank Locker Schedule',
            description: 'Formally assign two family elders (one from Bride, one from Groom side) who hold dual keys to the on-site hotel vault.',
            deliverable: 'Vault dual-signatory protocol locked'
          },
          {
            stepNum: 4,
            horizon: 'Day 0B (04:00)',
            status: 'FUTURE',
            title: 'Vault Opening & Mandap Jewellery Handshake',
            description: 'Open vault at 04:00 under witnessed sign-off for bridal dressing. Escort Mukuta to mandap at 08:30 for coronation.',
            deliverable: 'Dual sign-off on asset transit log'
          },
          {
            stepNum: 5,
            horizon: 'Day 0B (23:00)',
            status: 'FUTURE',
            title: 'Post-Reception Vault Resealing & Cash/Gift Reconciliation',
            description: 'Collect all jewellery, shagun envelopes, and gold gifts. Re-weigh and seal into hotel safe under dual signature.',
            deliverable: 'Vault sealed and zero-discrepancy reconciliation report'
          }
        ]
      },
      LITURGY: {
        id: 'LITURGY',
        icon: '🕉️',
        title: 'Vedic Liturgy, Chief Purohit & Samagri Journey',
        lead: 'Chief Purohit & Groom Father',
        tagline: '08:00 Lagna Muhurat, Deva Nimantrana, Kusha Grass & Astrological Sanctum.',
        steps: [
          {
            stepNum: 1,
            horizon: 'T-180 (TODAY)',
            status: 'ACTIVE_TODAY',
            title: 'Appoint Chief Purohit & Lock 08:00 IST Lagna Muhurat',
            description: 'Formally engage respected Odia Brahmin Purohit, confirm exact Lagna Muhurat window (08:00 IST on 10 March 2027), and establish ritual precedence.',
            deliverable: 'Purohit confirmation letter and sacred muhurat lock',
            ctaLabel: 'Propose Liturgy Note',
            ctaDomain: 'Rituals',
            ctaNotes: 'Formalize Chief Purohit appointment and 08:00 Lagna Muhurat lock'
          },
          {
            stepNum: 2,
            horizon: 'T-120',
            status: 'NEXT_UP',
            title: 'Consecrated Vidhi-Patra & Deva Nimantrana Package',
            description: 'Draft the sacred liturgical sequence and present first invitation with betel nut & cloth to Lord Jagannath Temple, Puri.',
            deliverable: 'Deva Nimantrana offered at Puri Jagannath temple'
          },
          {
            stepNum: 3,
            horizon: 'T-14',
            status: 'FUTURE',
            title: 'Samagri Trunks Packing & Holy Mahaprasad Procured',
            description: 'Procure pure ghee, dry coconuts, Kusha grass, Ganga jal, raw turmeric, and fresh Mahaprasad from Puri.',
            deliverable: '100% samagri checklist verified with Chief Priest'
          },
          {
            stepNum: 4,
            horizon: 'Day 0A & 0B',
            status: 'FUTURE',
            title: 'Execute Sacred Rites in Exact Purohit Sequence',
            description: 'Officiate Nirbandha (11 Feb) -> Mangan turmeric bath -> Kanyadaan, Hastaganthi knot, Lajahoma, Saptapadi, Sindoor Daan, Mukuta coronation.',
            deliverable: 'Irreversible Vedic rites completed without delay'
          }
        ]
      }
    };

    function selectDopkosThread(threadKey) {
      activeDopkosThread = threadKey;
      renderDoPkosStudio();
    }

    function renderDopkosThreads(container) {
      const thread = WORKSTREAM_THREADS[activeDopkosThread] || WORKSTREAM_THREADS.PHOTO;

      // Thread Selector Tabs
      let selectorHtml = `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">`;
      Object.keys(WORKSTREAM_THREADS).forEach(key => {
        const t = WORKSTREAM_THREADS[key];
        const isActive = activeDopkosThread === key;
        const activeStyle = isActive 
          ? 'background: var(--gold-gradient); color: #080b11; font-weight: 700; border-color: transparent;' 
          : 'background: var(--bg-surface-elevated); color: var(--text-main); border: 1px solid var(--border-subtle);';
        selectorHtml += `
          <button class="theme-toggle-btn" onclick="selectDopkosThread('${key}')" style="font-size: 0.78rem; padding: 6px 14px; ${activeStyle}">
            ${t.icon} ${t.title.split(' ')[0]}
          </button>
        `;
      });
      selectorHtml += `</div>`;

      // Active Thread Header Banner
      let bannerHtml = `
        <div style="background: linear-gradient(135deg, rgba(245, 197, 24, 0.12), var(--bg-surface)); border: 1px solid var(--gold-antique); border-radius: var(--radius-md); padding: 16px; margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.5rem;">${thread.icon}</span>
                <h3 style="margin: 0; font-family: var(--font-display); color: var(--gold-bright);">${thread.title}</h3>
              </div>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 6px 0 0; line-height: 1.4;">${thread.tagline}</p>
            </div>
            <div style="text-align: right;">
              <span class="status-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--emerald-royal); font-size: 0.74rem;">👤 Lead: ${thread.lead}</span>
            </div>
          </div>
        </div>
      `;

      // Chronological Journey Steps
      let stepsHtml = `<div style="display: flex; flex-direction: column; gap: 14px; position: relative;">`;

      thread.steps.forEach((s) => {
        const isActiveToday = s.status === 'ACTIVE_TODAY';
        const isNextUp = s.status === 'NEXT_UP';

        const stepBadge = isActiveToday 
          ? `<span class="status-badge status-urgent" style="font-size: 0.72rem; animation: pulse 2s infinite;">👉 DO THIS TODAY</span>`
          : (isNextUp ? `<span class="status-badge" style="background: rgba(59, 130, 246, 0.15); color: var(--sapphire-royal); font-size: 0.72rem;">⚪ NEXT UP</span>` : `<span class="status-badge" style="background: var(--bg-surface-elevated); color: var(--text-dim); font-size: 0.72rem;">⚪ FUTURE</span>`);

        const cardBorder = isActiveToday 
          ? `border: 2px solid var(--gold-bright); background: rgba(245, 197, 24, 0.06); box-shadow: 0 0 16px rgba(245, 197, 24, 0.15);` 
          : `border: 1px solid var(--border-subtle); background: var(--bg-surface);`;

        let actionCta = '';
        if (s.ctaLabel) {
          actionCta = `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 0.76rem; color: var(--text-dim);">Deliverable: <strong>${s.deliverable}</strong></span>
              <button class="btn btn-primary" onclick="openUniversalIntakeModal({ domain: '${s.ctaDomain}', contextLabel: '${thread.title}', initialNotes: '${s.ctaNotes}' })" style="font-size: 0.76rem; padding: 5px 14px; background: var(--gold-gradient); color: #080b11; font-weight: 700;">
                ⚡ ${s.ctaLabel} →
              </button>
            </div>
          `;
        } else {
          actionCta = `
            <div style="margin-top: 10px; font-size: 0.76rem; color: var(--text-dim);">
              Deliverable: <strong>${s.deliverable}</strong>
            </div>
          `;
        }

        stepsHtml += `
          <div style="${cardBorder} border-radius: var(--radius-md); padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: monospace; font-weight: 800; color: var(--gold-bright); background: rgba(245, 197, 24, 0.1); padding: 2px 8px; border-radius: var(--radius-sm); font-size: 0.8rem;">STEP ${s.stepNum} &bull; ${s.horizon}</span>
                <h4 style="margin: 0; font-size: 0.95rem; color: var(--text-main); font-weight: 700;">${s.title}</h4>
              </div>
              ${stepBadge}
            </div>
            <p style="color: var(--text-muted); font-size: 0.84rem; margin: 0 0 6px; line-height: 1.45;">
              ${s.description}
            </p>
            ${actionCta}
          </div>
        `;
      });

      stepsHtml += `</div>`;

      container.innerHTML = selectorHtml + bannerHtml + stepsHtml;
    }



    // ── Global System Initialization ───────────────────────────────
    updateStageIndicator();
    renderStageStrip();
    renderSwimlaneMatrix();
    renderTasks();
    renderIdeas();
    renderIntakeLedger();
    renderDoPkosStudio();
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

    // ── Explicit Global Window Bindings for Inline HTML Handlers ──
    window.toggleTheme = toggleTheme;
    window.switchTab = switchTab;
    window.openTaskConsole = openTaskConsole;
    window.closeTaskConsole = closeTaskConsole;
    window.toggleConsoleChecklist = toggleConsoleChecklist;
    window.toggleChecklistItem = toggleConsoleChecklist; // alias
    window.toggleMasterTask = toggleMasterTask;
    window.loadTaskForEdit = loadTaskForEdit;
    window.proposeTaskUpdate = proposeTaskUpdate;
    window.submitTaskForm = submitTaskForm;
    window.setTaskStatus = setTaskStatus;
    window.addNewTask = addNewTask;
    window.selectStage = selectStage;
    window.setDopkosView = setDopkosView;
    window.filterDopkosEvent = filterDopkosEvent;
    window.filterDopkosTrack = filterDopkosTrack;
    window.selectDopkosThread = selectDopkosThread;
    window.selectTopologyNode = selectTopologyNode;
    window.clearTopologySelection = clearTopologySelection;
    window.toggleTopologyStatus = toggleTopologyStatus;
    window.renderDopkosTopology = renderDopkosTopology;
    window.renderDoPkosStudio = renderDoPkosStudio;
    window.filterSwimlaneTrack = filterSwimlaneTrack;
    window.filterSwimlane = filterSwimlaneTrack; // alias
    window.setSwimlaneSortMode = setSwimlaneSortMode;
    window.onSwimlaneSearch = onSwimlaneSearch;
    window.showEventDetails = showEventDetails;
    window.showNodeModal = showEventDetails; // alias
    window.showRitualModal = showRitualModal;
    window.closeModal = closeModal;
    window.openInspirationModal = openInspirationModal;
    window.closeInspirationModal = closeInspirationModal;
    window.detectPlatform = detectPlatform;
    window.reframeWithAI = reframeWithAI;
    window.submitIdea = submitIdea;
    window.withdrawIdea = withdrawIdea;
    window.restoreIdea = withdrawIdea; // alias
    window.filterIdeas = filterIdeas;
    window.copyIdeasForDev = copyIdeasForDev;
    window.updateCountdown = updateCountdown;
    window.dispatchChangeRequest = dispatchChangeRequest;
    window.showChangeRequestReceipt = showChangeRequestReceipt;
    window.closeChangeRequestReceipt = closeChangeRequestReceipt;
    window.openUniversalIntakeModal = openUniversalIntakeModal;
    window.openLiturgyNoteModal = openLiturgyNoteModal;
    window.closeLiturgyNoteModal = closeLiturgyNoteModal;
    window.openVendorNominationModal = openVendorNominationModal;
    window.closeVendorNominationModal = closeVendorNominationModal;
    window.openCustodyProposalModal = openCustodyProposalModal;
    window.closeCustodyProposalModal = closeCustodyProposalModal;
    window.openIntakeLedgerModal = openIntakeLedgerModal;
    window.closeIntakeLedgerModal = closeIntakeLedgerModal;
    window.filterIntakeLedger = filterIntakeLedger;
    window.renderIntakeLedger = renderIntakeLedger;
    window.approveChangeRequest = approveChangeRequest;
    window.rejectChangeRequest = rejectChangeRequest;
    window.getAuthenticatedSubmitterName = getAuthenticatedSubmitterName;

    // ── Real User Monitoring (RUM) / Web Vitals (Safe Async IIFE) ──
    (async function initWebVitals() {
      try {
        const { onLCP, onINP, onCLS } = await import(
          "https://esm.sh/web-vitals@4?bundle"
        );
        [onLCP, onINP, onCLS].forEach((fn) => fn(reportFn));
      } catch (err) {
        console.warn("[RUM] web-vitals load failed:", err.message);
      }
    })();

    // ── PWA Live Invalidation & Service Worker Update Hook ─────────
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                const toast = document.getElementById('pwa-update-toast');
                if (toast) toast.style.display = 'flex';
              }
            });
          }
        });
      });
    }
