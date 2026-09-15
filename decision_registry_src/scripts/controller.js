(function() {
    'use strict';

    const STORAGE_KEY_SELECTIONS = 'sk_decision_registry_v2';
    const STORAGE_KEY_LOCKED_EVENTS = 'sk_locked_events_v2';
    const STORAGE_KEY_FAMILY_VOTES = 'sk_family_votes_v2';

    let currentEvent = 'wedding'; // default active event in stepper
    let currentFilter = 'all_pending';
    let searchQuery = '';
    let isFamilyMode = false;
    let userSelections = {};
    let lockedEvents = {};
    let familyVotes = {};
    let activeModalPlateIndex = 0;
    let isCompareMode = false;
    let isCadMode = false;
    let lightboxZoomEngine = null;

    // Read stored state
    try {
      const s = localStorage.getItem(STORAGE_KEY_SELECTIONS);
      if (s) userSelections = JSON.parse(s);
      const l = localStorage.getItem(STORAGE_KEY_LOCKED_EVENTS);
      if (l) lockedEvents = JSON.parse(l);
      const f = localStorage.getItem(STORAGE_KEY_FAMILY_VOTES);
      if (f) familyVotes = JSON.parse(f);
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY_SELECTIONS, JSON.stringify(userSelections));
        localStorage.setItem(STORAGE_KEY_LOCKED_EVENTS, JSON.stringify(lockedEvents));
        localStorage.setItem(STORAGE_KEY_FAMILY_VOTES, JSON.stringify(familyVotes));
      } catch (e) {
        console.warn('Storage write error:', e);
      }
    }

    let data = window.DECISION_REGISTRY_DATA || { items: [], plates: [], events: [], clusters: [] };
    let plates = data.plates || [];
    let items = data.items || [];
    let events = data.events || [];
    let clusters = data.clusters || [];
    let chronologicalEvents = events.filter(e => e.id !== 'all');

    function refreshData() {
      if (window.DECISION_REGISTRY_DATA) {
        data = window.DECISION_REGISTRY_DATA;
        plates = data.plates || [];
        items = data.items || [];
        events = data.events || [];
        clusters = data.clusters || [];
        chronologicalEvents = events.filter(e => e.id !== 'all');
      }
    }

    // DOM Elements
    const grid = document.getElementById('decisionsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterPills = document.querySelectorAll('.dr-pill');
    const btnExportJson = document.getElementById('btnExportJson');
    const btnPrintDossier = document.getElementById('btnPrintDossier');
    const btnShareFamilyMode = document.getElementById('btnShareFamilyMode');
    const familyWelcomeBanner = document.getElementById('familyWelcomeBanner');
    const executiveHeader = document.getElementById('executiveHeader');
    const drToast = document.getElementById('drToast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMsg = document.getElementById('toastMsg');

    // Stepper DOM
    const milestoneTrack = document.getElementById('milestoneTrack');
    const btnStepperPrev = document.getElementById('btnStepperPrev');
    const btnStepperNext = document.getElementById('btnStepperNext');
    const activeEventIcon = document.getElementById('activeEventIcon');
    const activeEventSummary = document.getElementById('activeEventSummary');
    const btnLockActiveEvent = document.getElementById('btnLockActiveEvent');
    const clusterPodsContainer = document.getElementById('clusterPodsContainer');

    // Carousel DOM
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselCounterIndicator = document.getElementById('carouselCounterIndicator');
    const btnCarouselPrev = document.getElementById('btnCarouselPrev');
    const btnCarouselNext = document.getElementById('btnCarouselNext');

    // Lightbox DOM
    const modal = document.getElementById('drLightboxModal');
    const btnCloseLightbox = document.getElementById('btnCloseLightbox');
    const btnModalPrev = document.getElementById('btnModalPrev');
    const btnModalNext = document.getElementById('btnModalNext');
    const modalPlateId = document.getElementById('modalPlateId');
    const modalPlateTitle = document.getElementById('modalPlateTitle');
    const modalPlateSub = document.getElementById('modalPlateSub');
    const modalImg = document.getElementById('modalImg');
    const modalSvgObject = document.getElementById('modalSvgObject');
    const modalSingleStage = document.getElementById('modalSingleStage');
    const modalCompareStage = document.getElementById('modalCompareStage');
    const btnToggleCompare = document.getElementById('btnToggleCompare');
    const modalBlueprintToggleWrap = document.getElementById('modalBlueprintToggleWrap');
    const btnViewPhoto = document.getElementById('btnViewPhoto');
    const btnViewCad = document.getElementById('btnViewCad');
    const modalDimensions = document.getElementById('modalDimensions');
    const modalEventZone = document.getElementById('modalEventZone');
    const modalClause = document.getElementById('modalClause');
    const modalLinkedDecisions = document.getElementById('modalLinkedDecisions');
    const modalNotesBox = document.getElementById('modalNotesBox');
    const modalThumbsBar = document.getElementById('modalThumbsBar');

    function showToast(msg, icon = '📋') {
      toastIcon.textContent = icon;
      toastMsg.textContent = msg;
      drToast.classList.add('active');
      setTimeout(() => {
        drToast.classList.remove('active');
      }, 3500);
    }

    // ========================================================================
    // URL DEEP LINK & QUERY PARAM PARSER (P-DEEP-LINK-001)
    // ========================================================================
    function parseUrlParams() {
      const params = new URLSearchParams(window.location.search);

      // Mode check: ?mode=family
      if (params.get('mode') === 'family') {
        isFamilyMode = true;
        familyWelcomeBanner.classList.add('active');
        executiveHeader.style.display = 'none';
      }

      // Event check: ?event=wedding | sangeet | mehendi | haldi | infrastructure
      const paramEvent = params.get('event');
      if (paramEvent && chronologicalEvents.some(e => e.id === paramEvent)) {
        currentEvent = paramEvent;
      }

      // Cluster check: ?cluster=mandap | stage
      const paramCluster = params.get('cluster');
      if (paramCluster) {
        const cl = clusters.find(c => c.id === paramCluster);
        if (cl) {
          currentEvent = cl.event;
          setTimeout(() => {
            const firstPlateIdx = plates.findIndex(p => p.id === cl.options[0].plateId);
            if (firstPlateIdx >= 0) window.openLightbox(firstPlateIdx, true);
          }, 200);
        }
      }

      // Plate direct check: ?plate=PLATE-09
      const paramPlate = params.get('plate');
      if (paramPlate) {
        const pIdx = plates.findIndex(p => p.id === paramPlate);
        if (pIdx >= 0) {
          setTimeout(() => window.openLightbox(pIdx), 200);
        }
      }
    }

    window.switchViewMode = function(mode) {
      if (mode === 'executive') {
        const url = new URL(window.location.href);
        url.searchParams.delete('mode');
        window.location.href = url.toString();
      }
    };

    // ========================================================================
    // STEPPER & EVENT CHAPTER ENGINE
    // ========================================================================
    function renderMilestones() {
      if (!milestoneTrack) return;
      if (!chronologicalEvents || !chronologicalEvents.length) {
        milestoneTrack.innerHTML = '';
        if (activeEventSummary) activeEventSummary.textContent = 'Loading events...';
        return;
      }

      milestoneTrack.innerHTML = chronologicalEvents.map((evt, idx) => {
        const isActive = (evt.id === currentEvent);
        const isLocked = !!lockedEvents[evt.id];
        const eventItems = items.filter(i => i.event === evt.id);
        const lockedCount = eventItems.filter(i => userSelections[i.id] || i.status === 'locked').length;

        return `
          <div class="dr-milestone-node ${isActive ? 'active' : ''} ${isLocked ? 'locked-state' : ''}" onclick="window.selectEventMilestone('${evt.id}')">
            <div class="dr-milestone-top">
              <span class="dr-milestone-phase">Phase ${idx + 1}</span>
              <span class="dr-milestone-badge">${isLocked ? '✓ Locked' : `${lockedCount}/${eventItems.length}`}</span>
            </div>
            <div class="dr-milestone-label">
              <span>${evt.icon || '📌'}</span> <span>${(evt.label || evt.id).replace('Day 1 ', '').replace('Day 2 ', '')}</span>
            </div>
            <div class="dr-milestone-time">${evt.timing || ''}</div>
          </div>
        `;
      }).join('');

      // Update Active Action Bar
      const activeEvtObj = chronologicalEvents.find(e => e.id === currentEvent) || chronologicalEvents[0];
      if (!activeEvtObj) return;

      if (activeEventIcon) activeEventIcon.textContent = activeEvtObj.icon || '📌';
      if (activeEventSummary) activeEventSummary.innerHTML = `Currently Reviewing: <strong>${activeEvtObj.label || activeEvtObj.id}</strong> (${activeEvtObj.timing || ''})`;
      
      const isEventLocked = !!lockedEvents[currentEvent];
      if (btnLockActiveEvent) {
        btnLockActiveEvent.innerHTML = isEventLocked 
          ? '<span>✓</span> Event Choices Certified & Locked' 
          : '<span>🔒</span> Freeze & Lock This Event\'s Choices';
        btnLockActiveEvent.style.background = isEventLocked 
          ? 'rgba(16, 185, 129, 0.4)' 
          : 'linear-gradient(135deg, #10b981, #059669)';
      }
    }

    window.selectEventMilestone = function(eventId) {
      currentEvent = eventId;
      renderMilestones();
      renderClusterPods();
      renderCarouselCards();
      renderGrid();
    };

    // Stepper Navigation
    if (btnStepperPrev) {
      btnStepperPrev.addEventListener('click', () => {
        const idx = chronologicalEvents.findIndex(e => e.id === currentEvent);
        if (idx > 0) {
          window.selectEventMilestone(chronologicalEvents[idx - 1].id);
        }
      });
    }

    if (btnStepperNext) {
      btnStepperNext.addEventListener('click', () => {
        const idx = chronologicalEvents.findIndex(e => e.id === currentEvent);
        if (idx < chronologicalEvents.length - 1) {
          window.selectEventMilestone(chronologicalEvents[idx + 1].id);
        }
      });
    }

    // Lock Active Event
    if (btnLockActiveEvent) {
      btnLockActiveEvent.addEventListener('click', () => {
        lockedEvents[currentEvent] = !lockedEvents[currentEvent];
        saveState();
        renderMilestones();
        showToast(
          lockedEvents[currentEvent] 
            ? `Event ${currentEvent.toUpperCase()} successfully frozen & ratified!` 
            : `Event ${currentEvent.toUpperCase()} unlocked for edits.`,
          lockedEvents[currentEvent] ? '🔒' : '🔓'
        );
      });
    }

    // ========================================================================
    // MULTI-OPTION CLUSTER POD ENGINE (P-OPTION-POD-001)
    // ========================================================================
    function renderClusterPods() {
      if (!clusterPodsContainer) return;
      // Find clusters belonging to active event
      const activeClusters = clusters.filter(c => c.event === currentEvent);

      if (activeClusters.length === 0) {
        clusterPodsContainer.innerHTML = '';
        return;
      }

      clusterPodsContainer.innerHTML = activeClusters.map(cluster => {
        const decisionItem = items.find(i => i.id === cluster.decisionId) || {};
        const savedChoice = userSelections[cluster.decisionId] || 'A';
        const votes = familyVotes[cluster.id] || {};

        return `
          <div class="dr-cluster-card" id="cluster-${cluster.id}">
            <div class="dr-cluster-header">
              <div class="dr-cluster-title-wrap">
                <h2>
                  <span>🏛️</span> 
                  <span>${cluster.title}</span>
                  <span class="dr-id-badge">${cluster.clusterId}</span>
                </h2>
                <p>${cluster.description}</p>
              </div>
              <div class="dr-cluster-actions">
                <button class="dr-btn dr-btn-whatsapp" onclick="window.shareClusterWhatsApp('${cluster.id}')" title="Share this option comparison to WhatsApp">
                  <span>📱</span> Share for Family Vote
                </button>
                <button class="dr-btn" onclick="window.openCommentsDrawer('${cluster.options[0].plateId}', { title: '${cluster.title.replace(/'/g, "\\'")}', badge: '${cluster.clusterId}', sub: '${cluster.description.replace(/'/g, "\\'")}' })" title="Open Discussion Thread">
                  <span>💬</span> Family Opinions
                </button>
                <button class="dr-btn" onclick="window.openLightboxByPlateId('${cluster.options[0].plateId}', true)" title="Open Fullscreen Comparison">
                  <span>⚖️</span> Compare Fullscreen
                </button>
              </div>
            </div>

            <!-- Side-by-Side N-Option Grid -->
            <div class="dr-pod-grid">
              ${cluster.options.map(opt => {
                const plate = plates.find(p => p.id === opt.plateId);
                if (!plate) return '';
                const isSelected = (savedChoice === opt.optionId);
                const voteCount = votes[opt.optionId] || 0;
                const commentCount = (window.SKPrimitives && window.SKPrimitives.getCommentCount) ? window.SKPrimitives.getCommentCount(plate.id) : 0;

                return `
                  <div class="dr-pod-option-card ${isSelected ? 'selected' : ''}" data-option-id="${opt.optionId}" data-plate-id="${plate.id}" id="card-plate-${plate.id}" onclick="window.selectClusterOption('${cluster.decisionId}', '${opt.optionId}', '${cluster.id}')">
                    <div class="dr-pod-media">
                      <img class="dr-pod-img" src="${plate.photoSrc}" alt="${opt.label}" loading="lazy" onerror="this.src='./assets/decor/marquee/photo-luxury-marquee-chandeliers.jpg'">
                      <div class="dr-pod-badge-bar">
                        <span class="dr-plate-id-badge">${plate.id}</span>
                        <span class="dr-plate-status-badge ${plate.status}">${plate.statusBadge}</span>
                      </div>
                    </div>
                    <div class="dr-pod-body">
                      <div>
                        <h4 class="dr-pod-title">${opt.label}</h4>
                        <div class="dr-pod-dims">📐 ${plate.dimensions}</div>
                        <div class="dr-pod-highlight">${opt.highlight}</div>
                      </div>
                      <div style="display: flex; gap: 6px; margin-top: 10px; align-items: stretch;">
                        <button class="dr-pod-radio-btn" type="button" style="flex: 1; margin-top: 0;">
                          <span>${isSelected ? '🔘' : '⚪'}</span>
                          <span>${isSelected ? 'Chosen Concept' : 'Select Concept'}</span>
                          ${voteCount > 0 ? `<span style="margin-left: auto; color: var(--dr-purple);">(${voteCount})</span>` : ''}
                        </button>
                        <button class="dr-btn" type="button" onclick="event.stopPropagation(); window.openCommentsDrawer('${plate.id}', { title: '${opt.label.replace(/'/g, "\\'")}', badge: '${plate.id}', sub: '${cluster.title.replace(/'/g, "\\'")}', alignment: '${isSelected ? '✓ Active Host Choice' : 'Open for Remarks'}' })" title="Open Family Opinions & Remarks" style="padding: 4px 10px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; border-color: rgba(212, 175, 55, 0.4); color: var(--dr-gold);">
                          <span>💬</span> <span>${commentCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="dr-cluster-footer">
              <div class="dr-consensus-tally">
                <span>📊</span> 
                <span><strong>Family Consensus Tally:</strong> ${formatVoteTally(votes, cluster.options)}</span>
              </div>
              <span style="font-size: 11px; color: var(--dr-text-muted);">
                Governs Contract Specification: ${decisionItem.phase || 'Phase III Scenic Fabrication'}
              </span>
            </div>
          </div>
        `;
      }).join('');
    }

    function formatVoteTally(votes, options) {
      const tallyParts = options.map(opt => {
        const count = votes[opt.optionId] || 0;
        return `${opt.optionId}: ${count}`;
      });
      return tallyParts.join(' | ');
    }

    window.selectClusterOption = function(decisionId, optionId, clusterId) {
      userSelections[decisionId] = optionId;
      
      // Record vote locally
      if (!familyVotes[clusterId]) familyVotes[clusterId] = {};
      familyVotes[clusterId][optionId] = (familyVotes[clusterId][optionId] || 0) + 1;

      saveState();
      renderClusterPods();
      renderMilestones();
      renderGrid();
      showToast(`Concept Option ${optionId} locked for ${decisionId}!`, '✓');
    };

    // 1-Click WhatsApp Consensus Generator (P-WHATSAPP-SHARE-001)
    window.shareClusterWhatsApp = function(clusterId) {
      const cluster = clusters.find(c => c.id === clusterId);
      if (!cluster) return;

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?event=${cluster.event}&cluster=${cluster.id}&mode=family`;
      const msg = cluster.whatsappTemplate.replace('{url}', shareUrl);

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(() => {
          showToast('WhatsApp invitation text copied to clipboard! Paste into your family chat.', '📲');
        });
      } else {
        // Fallback
        prompt('Copy WhatsApp Message:', msg);
      }
    };

    // Share Entire Family Mode Link
    if (btnShareFamilyMode) {
      btnShareFamilyMode.addEventListener('click', () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?event=${currentEvent}&mode=family`;
        const text = `🌺 *Sree Krushna Marriage OS — Family Decor Review*\nHelp us review and vote on our wedding decor concepts!\n👉 Tap to review: ${shareUrl}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast('Family review link copied! Paste into WhatsApp.', '📱');
          });
        } else {
          prompt('Copy Family Link:', text);
        }
      });
    }

    // ========================================================================
    // CAROUSEL COMPONENT ENGINE (Filtered by Active Stepper Event)
    // ========================================================================
    function renderCarouselCards() {
      if (!carouselTrack) return;
      const visiblePlates = plates.filter(p => p.events && p.events.includes(currentEvent));
      if (carouselCounterIndicator) {
        carouselCounterIndicator.textContent = `Showing ${visiblePlates.length} Plates (${currentEvent.toUpperCase()})`;
      }

      if (visiblePlates.length === 0) {
        carouselTrack.innerHTML = `
          <div style="padding: 40px; color: var(--dr-text-muted); text-align: center; width: 100%;">
            No individual visual plates registered for this event.
          </div>
        `;
        return;
      }

      carouselTrack.innerHTML = visiblePlates.map(plate => {
        const globalIndex = plates.findIndex(p => p.id === plate.id);
        const hasAlternatives = (plate.clusterId !== null);
        const primaryDecision = plate.linkedDecisions && plate.linkedDecisions.length > 0 ? plate.linkedDecisions[0] : null;

        return `
          <article class="dr-plate-card" data-plate-id="${plate.id}">
            <div class="dr-plate-media" onclick="window.openLightbox(${globalIndex})">
              <img class="dr-plate-img" src="${plate.photoSrc}" alt="${plate.title}" loading="lazy" onerror="this.src='./assets/decor/marquee/photo-luxury-marquee-chandeliers.jpg'">
              <div class="dr-plate-tag-bar">
                <span class="dr-plate-id-badge">${plate.id}</span>
                <span class="dr-plate-status-badge ${plate.status}">${plate.statusBadge}</span>
              </div>
              <div class="dr-plate-overlay">
                <span class="dr-plate-event-label">${plate.eventLabel}</span>
              </div>
            </div>
            <div class="dr-plate-body">
              <div>
                <h3 class="dr-plate-card-title">${plate.title}</h3>
                <div class="dr-plate-dim-tag">
                  <span>📐</span> <span>${plate.dimensions}</span>
                </div>
                <div class="dr-plate-notes-clamp">${plate.notes}</div>
              </div>
              <div class="dr-plate-footer-actions">
                <button class="dr-plate-btn-action" onclick="window.openLightbox(${globalIndex})" title="Inspect Fullscreen Image & CAD">
                  <span>🔍</span> Inspect
                </button>
                ${hasAlternatives ? `
                  <button class="dr-plate-btn-action highlight" onclick="window.openLightbox(${globalIndex}, true)" title="Compare with Alternative Options">
                    <span>⚖️</span> Compare
                  </button>
                ` : ''}
                ${primaryDecision ? `
                  <button class="dr-plate-btn-action" onclick="window.jumpToDecision('${primaryDecision}')" title="Scroll to Linked Decision">
                    <span>⚡</span> ${primaryDecision}
                  </button>
                ` : ''}
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    if (btnCarouselPrev) {
      btnCarouselPrev.addEventListener('click', () => {
        if (carouselTrack) carouselTrack.scrollBy({ left: -340, behavior: 'smooth' });
      });
    }

    if (btnCarouselNext) {
      btnCarouselNext.addEventListener('click', () => {
        if (carouselTrack) carouselTrack.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }

    // ========================================================================
    // DECISIONS GRID ENGINE
    // ========================================================================
    function renderGrid() {
      const q = searchQuery.toLowerCase().trim();
      const filtered = items.filter(item => {
        // Event check: in stepper mode, show active event's decisions unless 'all' is selected
        if (currentEvent !== 'all' && item.event !== currentEvent) return false;

        // Category / Status Filter
        let matchesFilter = false;
        if (currentFilter === 'all') {
          matchesFilter = true;
        } else if (currentFilter === 'all_pending') {
          matchesFilter = (item.category === 'decor_pending' || item.category === 'decor_vendor' || item.category === 'idea_incubator');
        } else {
          matchesFilter = (item.category === currentFilter);
        }

        if (!matchesFilter) return false;

        if (!q) return true;
        const text = (item.id + ' ' + item.title + ' ' + (item.dilemma || '') + ' ' + (item.benchmark || '') + ' ' + (item.zone || '') + ' ' + (item.plateRef || '')).toLowerCase();
        return text.includes(q);
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--dr-text-muted);">
            <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
            <h3 style="margin: 0 0 6px; color: #ffffff;">No matching decisions for ${currentEvent.toUpperCase()}</h3>
            <p style="margin: 0; font-size: 13px;">Try switching to another filter pill or clicking another event in the stepper above.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const categoryClass = item.category;
        const savedChoice = userSelections[item.id];

        let mediaAttachmentHtml = '';
        if (item.plateRef) {
          const refPlate = plates.find(p => p.id === item.plateRef);
          if (refPlate) {
            const plateIndex = plates.findIndex(p => p.id === item.plateRef);
            mediaAttachmentHtml = `
              <div class="dr-card-media-attachment" onclick="window.openLightbox(${plateIndex})" title="Click to view in Lightbox">
                <div class="dr-card-media-left">
                  <img class="dr-card-thumb-img" src="${refPlate.photoSrc}" alt="${refPlate.title}" loading="lazy" onerror="this.src='./assets/decor/marquee/photo-luxury-marquee-chandeliers.jpg'">
                  <div class="dr-card-media-text">
                    <span class="dr-card-media-title">${refPlate.title}</span>
                    <span class="dr-card-media-sub">${item.plateRef} • ${refPlate.dimensions}</span>
                  </div>
                </div>
                <div class="dr-card-media-action">
                  <span>Inspect</span> <span>🔍</span>
                </div>
              </div>
            `;
          }
        }

        let optionsHtml = '';
        if (item.options && item.options.length > 0) {
          optionsHtml = `
            <div class="dr-options-container">
              ${item.options.map(opt => {
                const isSelected = savedChoice ? (savedChoice === opt.id) : opt.selected;
                return `
                  <div class="dr-option-row ${isSelected ? 'selected' : ''}" onclick="window.selectDecisionOption('${item.id}', '${opt.id}')">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div class="dr-radio-circle">
                        <div class="dr-radio-inner"></div>
                      </div>
                      <span>${opt.text}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }

        let vendorBoxHtml = '';
        if (item.vendorDeliverable) {
          vendorBoxHtml = `
            <div class="dr-vendor-box">
              <span>⚠️</span>
              <span><strong>Deliverable Due:</strong> ${item.vendorDeliverable}</span>
            </div>
          `;
        }

        let statusClass = 'pending';
        if (item.status === 'vendor') statusClass = 'vendor';
        if (item.status === 'incubating') statusClass = 'incubating';
        if (item.status === 'locked') statusClass = 'locked';

        return `
          <article class="dr-card ${categoryClass}" id="card-${item.id}">
            <div class="dr-card-strip"></div>
            <div>
              <div class="dr-card-header">
                <div class="dr-badge-group">
                  <span class="dr-id-badge">${item.id}</span>
                  <span class="dr-category-badge">${item.categoryLabel}</span>
                </div>
                <span class="dr-status-pill ${statusClass}">${item.statusLabel}</span>
              </div>
              <h2 class="dr-card-title">
                <span>${item.domainIcon || '📌'}</span>
                <span>${item.title}</span>
              </h2>
              <div class="dr-dilemma-box">${item.dilemma || ''}</div>
              ${item.benchmark ? `
                <div class="dr-benchmark-note">
                  <strong>Luxury Standard:</strong> ${item.benchmark}
                </div>
              ` : ''}
              ${mediaAttachmentHtml}
              ${optionsHtml}
              ${vendorBoxHtml}
            </div>
            <div class="dr-card-footer">
              <span>${item.zone || item.targetEvent || 'Marriage OS Scope'}</span>
              ${item.plateRef ? `
                <span class="dr-plate-link" onclick="window.openLightbox(${plates.findIndex(p => p.id === item.plateRef)})">
                  <span>🖼️</span> ${item.plateRef}
                </span>
              ` : (item.estimatedCost ? `<span style="color: var(--dr-purple); font-weight: 600;">Est: ${item.estimatedCost}</span>` : '')}
            </div>
          </article>
        `;
      }).join('');
    }

    window.selectDecisionOption = function(itemId, optionId) {
      userSelections[itemId] = optionId;
      saveState();
      renderGrid();
    };

    window.jumpToDecision = function(decisionId) {
      const item = items.find(i => i.id === decisionId);
      if (!item) return;

      if (currentEvent !== item.event) {
        currentEvent = item.event;
        renderMilestones();
        renderClusterPods();
        renderCarouselCards();
      }

      renderGrid();

      setTimeout(() => {
        const cardEl = document.getElementById('card-' + decisionId);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cardEl.classList.add('target-highlight');
          setTimeout(() => cardEl.classList.remove('target-highlight'), 2500);
        }
      }, 60);
    };

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter');
        renderGrid();
      });
    });

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderGrid();
    });

    // ========================================================================
    // LIGHTBOX MODAL ENGINE
    // ========================================================================
    window.openLightbox = function(index, startInCompareMode = false) {
      if (index < 0 || index >= plates.length) index = 0;
      activeModalPlateIndex = index;
      isCompareMode = !!startInCompareMode;
      isCadMode = false;
      updateLightboxContent();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    window.openLightboxByPlateId = function(plateId, startInCompareMode = false) {
      const idx = plates.findIndex(p => p.id === plateId);
      if (idx >= 0) window.openLightbox(idx, startInCompareMode);
    };

    function closeLightbox() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      isCompareMode = false;
    }

    function updateLightboxContent() {
      const plate = plates[activeModalPlateIndex];
      if (!plate) return;

      modalPlateId.textContent = plate.id;
      modalPlateTitle.textContent = plate.title;
      modalPlateSub.textContent = `${plate.eventLabel} • ${plate.zone} • ${plate.spec}`;
      modalDimensions.textContent = plate.dimensions;
      modalEventZone.textContent = `${plate.eventLabel} (${plate.zone})`;
      modalClause.textContent = plate.clause || 'CTR-DECOR-RIDER-001';
      modalLinkedDecisions.textContent = plate.linkedDecisions ? plate.linkedDecisions.join(', ') : 'None';
      modalNotesBox.innerHTML = `
        <div style="margin-bottom: 6px;"><strong>Architectural & Scenic Spec:</strong> ${plate.notes}</div>
        ${plate.prompt ? `
          <details style="margin-top: 8px; font-size: 11px; color: var(--dr-text-muted);">
            <summary style="cursor: pointer; color: var(--dr-gold); font-weight: 600;">✨ View AI Generative Prompt</summary>
            <div style="margin-top: 6px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; line-height: 1.4;">${plate.prompt}</div>
          </details>
        ` : ''}
      `;

      if (plate.blueprintSrc) {
        modalBlueprintToggleWrap.style.display = 'flex';
        btnViewPhoto.classList.toggle('active', !isCadMode);
        btnViewCad.classList.toggle('active', isCadMode);
      } else {
        modalBlueprintToggleWrap.style.display = 'none';
        isCadMode = false;
      }

      const altPlateIds = getAlternativesForPlate(plate.id);
      if (altPlateIds.length > 1) {
        btnToggleCompare.style.display = 'inline-flex';
        btnToggleCompare.classList.toggle('active', isCompareMode);
        btnToggleCompare.textContent = isCompareMode ? '📷 Single View' : `⚖️ Compare (${altPlateIds.length})`;
      } else {
        btnToggleCompare.style.display = 'none';
        isCompareMode = false;
      }

      if (isCompareMode && altPlateIds.length > 1) {
        modalSingleStage.style.display = 'none';
        modalCompareStage.classList.add('active');
        renderCompareStage(altPlateIds);
      } else {
        modalSingleStage.style.display = 'flex';
        modalCompareStage.classList.remove('active');

        if (isCadMode && plate.blueprintSrc) {
          modalImg.style.display = 'none';
          modalSvgObject.style.display = 'block';
          modalSvgObject.data = plate.blueprintSrc;
          if (lightboxZoomEngine) lightboxZoomEngine.fit();
        } else {
          modalSvgObject.style.display = 'none';
          modalImg.style.display = 'block';
          const resolved = (window.SKPrimitives && window.SKPrimitives.resolveDriveAsset)
            ? window.SKPrimitives.resolveDriveAsset(plate.photoSrc, { zoomWidth: 1600 })
            : { zoomUrl: plate.photoSrc };
          modalImg.src = resolved.zoomUrl || plate.photoSrc;
          if (lightboxZoomEngine) lightboxZoomEngine.fit();
        }
      }

      renderLightboxThumbs();
    }

    function getAlternativesForPlate(plateId) {
      if (plateId === 'PLATE-01' || plateId === 'PLATE-10' || plateId === 'PLATE-11') {
        return ['PLATE-01', 'PLATE-10', 'PLATE-11'];
      }
      if (plateId === 'PLATE-03' || plateId === 'PLATE-12') {
        return ['PLATE-03', 'PLATE-12'];
      }
      return [plateId];
    }

    function renderCompareStage(plateIds) {
      modalCompareStage.innerHTML = plateIds.map(id => {
        const p = plates.find(item => item.id === id);
        if (!p) return '';
        const isCurrent = (p.id === plates[activeModalPlateIndex].id);
        return `
          <div class="dr-compare-card ${isCurrent ? 'current' : ''}">
            <div class="dr-compare-card-media">
              <img class="dr-compare-card-img" src="${p.photoSrc}" alt="${p.title}">
              <div class="dr-plate-tag-bar">
                <span class="dr-plate-id-badge">${p.id}</span>
                <span class="dr-plate-status-badge ${p.status}">${p.statusBadge}</span>
              </div>
            </div>
            <div class="dr-compare-card-body">
              <div>
                <h4 style="margin: 0 0 4px; font-size: 13px; color: #ffffff;">${p.title}</h4>
                <div style="font-size: 11px; color: var(--dr-gold); margin-bottom: 8px;">${p.dimensions}</div>
                <div style="font-size: 11px; color: var(--dr-text-secondary); line-height: 1.4;">${p.notes}</div>
              </div>
              <button class="dr-plate-btn-action ${isCurrent ? 'highlight' : ''}" style="margin-top: 10px;" onclick="window.selectCompareTarget('${p.id}')">
                ${isCurrent ? '✓ Active Option' : 'Select This Option'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    window.selectCompareTarget = function(plateId) {
      const idx = plates.findIndex(p => p.id === plateId);
      if (idx >= 0) {
        activeModalPlateIndex = idx;
        isCompareMode = false;
        updateLightboxContent();
      }
    };

    function renderLightboxThumbs() {
      modalThumbsBar.innerHTML = plates.map((p, idx) => {
        const isActive = (idx === activeModalPlateIndex);
        return `
          <div class="dr-lightbox-thumb ${isActive ? 'active' : ''}" onclick="window.openLightbox(${idx}, ${isCompareMode})" title="${p.id}: ${p.title}">
            <img src="${p.photoSrc}" alt="${p.id}" onerror="this.src='./assets/decor/marquee/photo-luxury-marquee-chandeliers.jpg'">
          </div>
        `;
      }).join('');

      const activeThumb = modalThumbsBar.querySelector('.dr-lightbox-thumb.active');
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }

    btnCloseLightbox.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    btnModalPrev.addEventListener('click', () => {
      activeModalPlateIndex = (activeModalPlateIndex - 1 + plates.length) % plates.length;
      updateLightboxContent();
    });

    btnModalNext.addEventListener('click', () => {
      activeModalPlateIndex = (activeModalPlateIndex + 1) % plates.length;
      updateLightboxContent();
    });

    btnViewPhoto.addEventListener('click', () => {
      isCadMode = false;
      updateLightboxContent();
    });

    btnViewCad.addEventListener('click', () => {
      isCadMode = true;
      updateLightboxContent();
    });

    btnToggleCompare.addEventListener('click', () => {
      isCompareMode = !isCompareMode;
      updateLightboxContent();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        activeModalPlateIndex = (activeModalPlateIndex - 1 + plates.length) % plates.length;
        updateLightboxContent();
      }
      if (e.key === 'ArrowRight') {
        activeModalPlateIndex = (activeModalPlateIndex + 1) % plates.length;
        updateLightboxContent();
      }
    });

    // Export JSON
    btnExportJson.addEventListener('click', () => {
      const exportPayload = {
        exported_at: new Date().toISOString(),
        selections: userSelections,
        locked_events: lockedEvents,
        family_votes: familyVotes,
        registry: data
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sree-krushna-decisions-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    btnPrintDossier.addEventListener('click', () => window.print());
 
    // Initialize Lightbox Zoom/Pan Engine (STD-MOD-COMP-001)
    if (window.SKPrimitives && window.SKPrimitives.initLightboxZoom && modalImg) {
      lightboxZoomEngine = window.SKPrimitives.initLightboxZoom(modalImg, {
        badge: '#skZoomBadge',
        zoomIn: '#skBtnZoomIn',
        zoomOut: '#skBtnZoomOut',
        fit: '#skBtnFit',
        reset: '#skBtnReset'
      });
    }

    // Wire Option Intake Modal (Adapted from PIO ImageUploadWidget)
    const btnOpenOptionIntake = document.getElementById('btnOpenOptionIntake');
    const intakeBackdrop = document.getElementById('skOptionIntakeBackdrop');
    const btnCloseIntake = document.getElementById('skOptionIntakeClose');
    const btnCancelIntake = document.getElementById('skBtnCancelIntake');
    const btnSubmitOption = document.getElementById('skBtnSubmitOption');
    const tabDrive = document.getElementById('skTabDriveLink');
    const tabDevice = document.getElementById('skTabDeviceUpload');
    const paneDrive = document.getElementById('skPaneDrive');
    const paneDevice = document.getElementById('skPaneDevice');
    const driveInput = document.getElementById('skDriveUrlInput');
    const btnVerifyDrive = document.getElementById('skBtnVerifyDrive');
    const proofCard = document.getElementById('skDriveProofCard');
    const proofImg = document.getElementById('skDriveProofImg');
    const proofId = document.getElementById('skDriveFileId');

    if (btnOpenOptionIntake && intakeBackdrop) {
      btnOpenOptionIntake.addEventListener('click', () => {
        intakeBackdrop.classList.add('is-active');
      });

      const closeIntake = () => {
        intakeBackdrop.classList.remove('is-active');
      };

      if (btnCloseIntake) btnCloseIntake.addEventListener('click', closeIntake);
      if (btnCancelIntake) btnCancelIntake.addEventListener('click', closeIntake);

      if (tabDrive && tabDevice) {
        tabDrive.addEventListener('click', () => {
          tabDrive.classList.add('is-active');
          tabDevice.classList.remove('is-active');
          if (paneDrive) paneDrive.style.display = 'block';
          if (paneDevice) paneDevice.style.display = 'none';
        });

        tabDevice.addEventListener('click', () => {
          tabDevice.classList.add('is-active');
          tabDrive.classList.remove('is-active');
          if (paneDevice) paneDevice.style.display = 'block';
          if (paneDrive) paneDrive.style.display = 'none';
        });
      }

      const verifyDriveLink = () => {
        const url = driveInput ? driveInput.value.trim() : '';
        if (!url) return;
        const resolved = (window.SKPrimitives && window.SKPrimitives.resolveDriveAsset)
          ? window.SKPrimitives.resolveDriveAsset(url, { cardWidth: 200 })
          : null;
        if (resolved && resolved.isDrive) {
          if (proofCard) proofCard.style.display = 'flex';
          if (proofImg) proofImg.src = resolved.cardThumbnail;
          if (proofId) proofId.textContent = 'Drive ID: ' + resolved.driveId;
          showToast('Google Drive asset recognized with zero-CORS preview!', '✓');
        } else {
          showToast('Direct URL registered.', '✓');
        }
      };

      if (btnVerifyDrive) btnVerifyDrive.addEventListener('click', verifyDriveLink);
      if (driveInput) driveInput.addEventListener('change', verifyDriveLink);

      if (btnSubmitOption) {
        btnSubmitOption.addEventListener('click', () => {
          const title = document.getElementById('skOptionTitle')?.value.trim() || 'New Option';
          const price = document.getElementById('skOptionPrice')?.value.trim() || '—';
          const category = document.getElementById('skOptionCategory')?.value || 'other';
          showToast(`Option "${title}" added to ${category.toUpperCase()}!`, '🎉');
          closeIntake();
        });
      }
    }

    // URL Query Param Parser & Deep-Link Wiring
    function parseUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'family') {
        isFamilyMode = true;
        if (familyWelcomeBanner) familyWelcomeBanner.classList.add('active');
        if (executiveHeader) executiveHeader.style.display = 'none';
      }

      const paramEvent = params.get('event');
      if (paramEvent && events.some(e => e.id === paramEvent)) {
        currentEvent = paramEvent;
      }

      const paramCluster = params.get('cluster');
      if (paramCluster) {
        const matchedCluster = clusters.find(c => c.id === paramCluster || c.clusterId === paramCluster);
        if (matchedCluster && matchedCluster.event) {
          currentEvent = matchedCluster.event;
        }
        setTimeout(() => {
          const el = document.getElementById('cluster-' + paramCluster) || (matchedCluster && document.getElementById('cluster-' + matchedCluster.id));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (params.get('comments') === 'true' || params.get('drawer') === 'true') {
              const optId = (matchedCluster && matchedCluster.options && matchedCluster.options[0]) ? matchedCluster.options[0].plateId : paramCluster;
              if (window.SKPrimitives && window.SKPrimitives.openComments) {
                window.SKPrimitives.openComments(optId, {
                  title: matchedCluster ? matchedCluster.title : paramCluster,
                  badge: matchedCluster ? matchedCluster.clusterId : 'CLUSTER',
                  sub: matchedCluster ? matchedCluster.description : ''
                });
              }
            }
          }
        }, 350);
      }

      const paramOption = params.get('option') || params.get('plate');
      if (paramOption) {
        let matchedCluster = null;
        const matchedPlate = plates.find(p => p.id === paramOption);
        for (const c of clusters) {
          if (c.options && c.options.some(o => o.optionId === paramOption || o.plateId === paramOption)) {
            matchedCluster = c;
            break;
          }
        }
        if (matchedCluster && matchedCluster.event) {
          currentEvent = matchedCluster.event;
        }
        setTimeout(() => {
          const optionCard = document.querySelector(`[data-plate-id="${paramOption}"]`) || document.querySelector(`[data-option-id="${paramOption}"]`) || document.getElementById('card-plate-' + paramOption);
          if (optionCard) {
            optionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            optionCard.style.outline = '2px solid var(--dr-gold, #d4a843)';
            setTimeout(() => { optionCard.style.outline = ''; }, 3000);
          } else if (matchedCluster) {
            const clusterEl = document.getElementById('cluster-' + matchedCluster.id);
            if (clusterEl) clusterEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          if (window.SKPrimitives && window.SKPrimitives.openComments) {
            const optMeta = matchedPlate || (matchedCluster ? { title: matchedCluster.title, id: paramOption, description: matchedCluster.description } : { title: paramOption, id: paramOption, description: '' });
            window.SKPrimitives.openComments(paramOption, {
              title: optMeta.title || paramOption,
              badge: optMeta.id || optMeta.badge || paramOption,
              sub: optMeta.description || optMeta.sub || ''
            });
          }
        }, 350);
      }
    }

    // Initialize
    function initDecisionRegistry() {
      refreshData();
      parseUrlParams();
      renderMilestones();
      renderClusterPods();
      renderCarouselCards();
      renderGrid();
    }
    window.renderDecisionRegistry = initDecisionRegistry;
    window.initDecisionRegistry = initDecisionRegistry;

    initDecisionRegistry();
  })();