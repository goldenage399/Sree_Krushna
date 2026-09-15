    let currentMode = 'hud';
    let currentEvent = 'marquee';
    let currentTopicIndex = 0;
    let activeStageView = 'script';
    let activeTone = 'warm';
    let isHudUnlocked = true;
    let currentSlideIndex = 0;
    // {{ ... }}
    let currentLightboxIndex = 0;
    let currentLightboxMode = 'photo'; // 'photo' | 'blueprint'
    let currentGridMode = 'photo';     // 'photo' | 'blueprint'
    let activeLookbookFilter = 'all';


    let activeDecisionFilter = 'all';

    function loadSavedDecisions() {
      try {
        const saved = localStorage.getItem('sree_krushna_decor_decisions');
        if (saved) {
          const userChoices = JSON.parse(saved);
          MASTER_DECISIONS.forEach(d => {
            if (userChoices[d.id] && d.options) {
              d.options.forEach(o => {
                o.selected = (o.id === userChoices[d.id]);
              });
            }
          });
        }
      } catch (e) {
        console.warn('Error reading saved decor decisions:', e);
      }
    }

    function selectDecisionOption(decId, optId) {
      try {
        let userChoices = {};
        const saved = localStorage.getItem('sree_krushna_decor_decisions');
        if (saved) userChoices = JSON.parse(saved);

        userChoices[decId] = optId;
        localStorage.setItem('sree_krushna_decor_decisions', JSON.stringify(userChoices));

        const dec = MASTER_DECISIONS.find(d => d.id === decId);
        if (dec && dec.options) {
          dec.options.forEach(o => {
            o.selected = (o.id === optId);
          });
        }

        renderDecisionsGrid();
        showToast('✓ Saved decision for ' + decId);
      } catch (e) {
        alert('Error saving decision: ' + e.message);
      }
    }

    function resetDecisionChoices() {
      if (confirm('Reset all custom decision choices to original recommendations?')) {
        localStorage.removeItem('sree_krushna_decor_decisions');
        location.reload();
      }
    }

    function filterDecisions(filter) {
      activeDecisionFilter = filter;
      document.querySelectorAll('.decisions-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === 'fbtnDecisions-' + filter);
      });
      renderDecisionsGrid();
    }

    function calculateDecisionProgress() {
      // 9 locked + any pending with a selection
      let resolvedCount = 0;
      MASTER_DECISIONS.forEach(d => {
        if (d.status === 'locked') {
          resolvedCount++;
        } else if (d.status === 'pending') {
          const hasSelected = d.options && d.options.some(o => o.selected);
          if (hasSelected) resolvedCount++;
        }
      });
      const pct = Math.round((resolvedCount / MASTER_DECISIONS.length) * 100);
      return { count: resolvedCount, total: MASTER_DECISIONS.length, percent: pct };
    }

    function renderDecisionsGrid() {
      const container = document.getElementById('decisionsGridContainer');
      if (!container) return;
      container.innerHTML = '';

      // Update progress
      const progress = calculateDecisionProgress();
      document.getElementById('decisionProgressLabel').textContent = progress.count + ' / ' + progress.total + ' Steps Resolved';
      document.getElementById('decisionProgressPercent').textContent = progress.percent + '% COMPLETE';
      document.getElementById('decisionsProgressFill').style.width = progress.percent + '%';

      const filtered = MASTER_DECISIONS.filter(d => {
        if (activeDecisionFilter === 'all') return true;
        return d.status === activeDecisionFilter;
      });

      filtered.forEach(d => {
        const card = document.createElement('div');
        card.className = 'decision-card status-' + d.status;

        // Zone Media Preview Bar (Photo + CAD Blueprint + Lightbox Trigger)
        let mediaBarHtml = '';
        if (d.plateIndex !== undefined && typeof CANONICAL_PLATES !== 'undefined' && CANONICAL_PLATES[d.plateIndex]) {
          const p = CANONICAL_PLATES[d.plateIndex];
          mediaBarHtml = `
            <div class="decision-media-bar">
              <div class="decision-thumb-pair">
                <div class="decision-thumb-box" title="Click to inspect photo in Lightbox" onclick="openLightboxToPlate(${d.plateIndex}, 'photo')">
                  <img src="${p.photoSrc}" alt="${p.title}" loading="lazy" />
                  <span class="decision-thumb-tag">PHOTO</span>
                </div>
                <div class="decision-thumb-box" title="Click to inspect CAD blueprint in Lightbox" onclick="openLightboxToPlate(${d.plateIndex}, 'blueprint')">
                  <img src="${p.blueprintSrc}" alt="${p.title}" loading="lazy" />
                  <span class="decision-thumb-tag">CAD</span>
                </div>
              </div>
              <div class="decision-media-info">
                <span class="decision-media-plate-id">${p.id} &bull; ${p.categoryLabel || p.category}</span>
                <div class="decision-media-plate-title">${p.title}</div>
                <button class="decision-lightbox-btn" onclick="openLightboxToPlate(${d.plateIndex})">
                  <span>🔍</span> Inspect Blueprint &amp; Photo
                </button>
              </div>
            </div>
          `;
        }

        // Options HTML (Rich Visual Cards with Swatches & Badges)
        let optionsHtml = '';
        if (d.options && d.options.length > 0) {
          optionsHtml = '<div class="decision-options-group">';
          optionsHtml += '<div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 6px;">Select Preferred Direction:</div>';
          d.options.forEach(opt => {
            const isSel = opt.selected;
            let swatchesHtml = '';
            if (opt.swatches && opt.swatches.length > 0) {
              swatchesHtml = '<div class="decision-swatch-strip" title="Color Harmony Palette">';
              opt.swatches.forEach(sw => {
                swatchesHtml += `<span class="decision-swatch-circle" style="background-color: ${sw.hex};" title="${sw.name} (${sw.hex})"></span>`;
              });
              swatchesHtml += `<span class="decision-swatch-label">${opt.badge || 'Palette'}</span>`;
              swatchesHtml += '</div>';
            }

            let badgeHtml = '';
            if (opt.badge && !swatchesHtml) {
              badgeHtml = `<div class="decision-badge-chip">${opt.badge}</div>`;
            }

            optionsHtml += `
              <div class="decision-option-card ${isSel ? 'selected' : ''}" onclick="selectDecisionOption('${d.id}', '${opt.id}')">
                <div class="decision-option-header">
                  <div class="decision-option-title">
                    <input type="radio" name="opt-${d.id}" class="decision-option-radio" ${isSel ? 'checked' : ''} style="cursor:pointer;" />
                    <span style="line-height: 1.35;">${opt.text}</span>
                  </div>
                  <span class="decision-selected-pill">✓ SELECTED</span>
                </div>
                ${swatchesHtml}
                ${badgeHtml}
              </div>
            `;
          });
          optionsHtml += '</div>';
        } else if (d.vendorDeliverable) {
          optionsHtml = `
            <div class="decision-vendor-box">
              <strong style="color: #38bdf8;">📄 Required Vendor Deliverable:</strong>
              <div style="margin-top: 4px;">${d.vendorDeliverable}</div>
            </div>
          `;
        }

        card.innerHTML = `
          <div class="decision-card-top">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="decision-step-badge">STEP ${d.step < 10 ? '0' + d.step : d.step} &bull; ${d.id}</span>
              <span class="decision-card-domain-badge">${d.domainIcon || '📌'} ${d.zone}</span>
            </div>
            <span class="decision-status-pill ${d.status}">
              ${d.status === 'locked' ? '🟢 LOCKED' : (d.status === 'pending' ? '🟡 DECISION NEEDED' : '🔵 VENDOR ACTION')}
            </span>
          </div>

          <div>
            <div class="decision-card-title">${d.title}</div>
            <div class="decision-card-phase">${d.phase}</div>
          </div>

          ${mediaBarHtml}

          <div class="decision-dilemma-box">
            <strong>Dilemma:</strong> ${d.dilemma}
          </div>

          <div class="decision-benchmark-box">
            <div class="decision-benchmark-title"><span>🏆</span> Luxury Wedding Benchmark:</div>
            <div>${d.benchmark}</div>
          </div>

          <div class="decision-direction-box">
            <strong>Strategic Direction:</strong> ${d.direction}
          </div>

          ${optionsHtml}
        `;

        container.appendChild(card);
      });
    }

    function copyDecisionDigest() {
      let text = "SREE KRUSHNA MARRIAGE OS — MASTER DECOR DECISION ROADMAP DIGEST\n";
      text += "Generated: " + new Date().toISOString() + "\n";
      text += "------------------------------------------------------------\n\n";

      MASTER_DECISIONS.forEach(d => {
        text += `STEP ${d.step < 10 ? '0' + d.step : d.step}: ${d.title} [${d.status.toUpperCase()}]\n`;
        text += `Phase: ${d.phase} | Zone: ${d.zone}\n`;
        text += `Direction: ${d.direction}\n`;
        if (d.options) {
          const sel = d.options.find(o => o.selected);
          if (sel) text += `Resolved Selection: ${sel.text}\n`;
        }
        if (d.vendorDeliverable) {
          text += `Vendor Deliverable: ${d.vendorDeliverable}\n`;
        }
        text += "\n";
      });

      navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Copied Decision Digest to clipboard!');
      }).catch(err => {
        prompt('Copy digest manually:', text);
      });
    }

    /* ==========================================================================
       CUSTOM PHOTO / PINTEREST OVERRIDE ENGINE & ZOOM (AC-DEC-2026-008)
       ========================================================================== */
    let activeEditingPlateId = null;
    let isLightboxZoomed = false;

    function loadCustomPhotoOverrides() {
      try {
        const saved = localStorage.getItem('sree_krushna_custom_decor_photos');
        if (saved) {
          const overrides = JSON.parse(saved);
          VISUAL_PLATES.forEach(p => {
            if (overrides[p.id]) {
              p.photoSrc = overrides[p.id];
              p.isCustom = true;
            } else {
              p.isCustom = false;
            }
          });
        }
      } catch (e) {
        console.warn('Error reading custom decor photo overrides:', e);
      }
    }

    function toggleLightboxZoom() {
      isLightboxZoomed = !isLightboxZoomed;
      const wrapper = document.querySelector('.lightbox-img-wrapper');
      const btn = document.getElementById('lbZoomBtn');
      if (wrapper) wrapper.classList.toggle('is-zoomed', isLightboxZoomed);
      if (btn) btn.innerHTML = isLightboxZoomed ? '🔍 Fit' : '🔍 Expand';
    }

    function resetLightboxZoom() {
      isLightboxZoomed = false;
      const wrapper = document.querySelector('.lightbox-img-wrapper');
      const btn = document.getElementById('lbZoomBtn');
      if (wrapper) wrapper.classList.remove('is-zoomed');
      if (btn) btn.innerHTML = '🔍 Expand';
    }

    
    function showToast(message) {
      const toast = document.getElementById('cockpitToast');
      const text = document.getElementById('cockpitToastText');
      if (!toast || !text) return;
      text.textContent = message;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 2500);
    }

    function copyPlatePrompt(plateIndex) {
      const plate = VISUAL_PLATES[plateIndex] || VISUAL_PLATES[0];
      if (!plate || !plate.prompt) return;
      navigator.clipboard.writeText(plate.prompt).then(() => {
        showToast('✓ Copied ' + plate.id + ' prompt to clipboard!');
      }).catch(err => {
        prompt('Copy prompt manually:', plate.prompt);
      });
    }

    function copyPlatePromptById(plateId) {
      const plate = VISUAL_PLATES.find(p => p.id === plateId);
      if (!plate || !plate.prompt) return;
      navigator.clipboard.writeText(plate.prompt).then(() => {
        showToast('✓ Copied ' + plate.id + ' prompt to clipboard!');
      }).catch(err => {
        prompt('Copy prompt manually:', plate.prompt);
      });
    }

    function openCustomPhotoModal(plateId) {
      activeEditingPlateId = plateId;
      const plate = VISUAL_PLATES.find(p => p.id === plateId) || VISUAL_PLATES[0];
      if (!plate) return;

      document.getElementById('customPlateSubtitle').textContent = plate.id + ' — ' + plate.title;
      const input = document.getElementById('customPhotoInput');
      input.value = plate.isCustom ? plate.photoSrc : '';
      
      const previewImg = document.getElementById('customPhotoPreviewImg');
      const fallback = document.getElementById('customPhotoPreviewFallback');
      fallback.style.display = 'none';
      previewImg.style.display = 'block';
      previewImg.src = plate.photoSrc;

      const status = document.getElementById('customPhotoStatus');
      status.textContent = plate.isCustom ? 'Active Custom Override' : 'Canonical Vedic Default';
      status.style.color = plate.isCustom ? '#fbbf24' : '#10b981';

      const resetBtn = document.getElementById('btnResetToDefaultPhoto');
      resetBtn.style.display = plate.isCustom ? 'block' : 'none';

      const promptContainer = document.getElementById('customModalPromptText');
      if (promptContainer) promptContainer.textContent = plate.prompt || 'No prompt available.';
      document.getElementById('customPhotoModalBackdrop').classList.add('active');
    }

    function closeCustomPhotoModal() {
      document.getElementById('customPhotoModalBackdrop').classList.remove('active');
      activeEditingPlateId = null;
    }

    function onCustomPhotoUrlChange() {
      const url = document.getElementById('customPhotoInput').value.trim();
      if (url) {
        testCustomPhotoPreview();
      }
    }

    function testCustomPhotoPreview() {
      const url = document.getElementById('customPhotoInput').value.trim();
      const previewImg = document.getElementById('customPhotoPreviewImg');
      const fallback = document.getElementById('customPhotoPreviewFallback');
      if (url) {
        fallback.style.display = 'none';
        previewImg.style.display = 'block';
        previewImg.src = url;
      }
    }

    function handlePreviewError() {
      const previewImg = document.getElementById('customPhotoPreviewImg');
      const fallback = document.getElementById('customPhotoPreviewFallback');
      previewImg.style.display = 'none';
      fallback.style.display = 'block';
    }

    function onSaveCustomPhoto() {
      if (!activeEditingPlateId) return;
      const url = document.getElementById('customPhotoInput').value.trim();
      
      try {
        let overrides = {};
        const saved = localStorage.getItem('sree_krushna_custom_decor_photos');
        if (saved) overrides = JSON.parse(saved);

        if (url) {
          overrides[activeEditingPlateId] = url;
        } else {
          delete overrides[activeEditingPlateId];
        }
        localStorage.setItem('sree_krushna_custom_decor_photos', JSON.stringify(overrides));
        loadCustomPhotoOverrides();
      loadSavedDecisions();
        renderLookbookGrid();
        renderLightboxView();
        renderTopicDetail(currentTopicIndex);
        closeCustomPhotoModal();
      } catch (e) {
        alert('Error saving custom photo: ' + e.message);
      }
    }

    function onResetToCanonicalPhoto() {
      if (!activeEditingPlateId) return;
      try {
        const saved = localStorage.getItem('sree_krushna_custom_decor_photos');
        if (saved) {
          let overrides = JSON.parse(saved);
          delete overrides[activeEditingPlateId];
          localStorage.setItem('sree_krushna_custom_decor_photos', JSON.stringify(overrides));
        }
        const canonical = CANONICAL_PLATES.find(p => p.id === activeEditingPlateId);
        const current = VISUAL_PLATES.find(p => p.id === activeEditingPlateId);
        if (canonical && current) {
          current.photoSrc = canonical.photoSrc;
          current.isCustom = false;
        }
        loadCustomPhotoOverrides();
        renderLookbookGrid();
        renderLightboxView();
        renderTopicDetail(currentTopicIndex);
        closeCustomPhotoModal();
      } catch (e) {
        alert('Error resetting photo: ' + e.message);
      }
    }


    /* STATUS STORE */
    let topicStatuses = {};

    /* HELPER GETTERS */
    function getActiveTopics() {
      return currentEvent === 'marquee' ? TOPICS_MARQUEE : TOPICS_RAYAGADA;
    }

    function getActiveSlides() {
      return currentEvent === 'marquee' ? SLIDES_MARQUEE : SLIDES_RAYAGADA;
    }

    /* SEC-1 REMEDIATION (AC-DEC-2026-012): Firestore-sourced content bootstrap.
       MASTER_DECISIONS / TOPICS_MARQUEE / TOPICS_RAYAGADA start empty (declared with `let`
       in template.html) and are populated here once cockpit_src/template.html's auth-gate
       module script fetches them from Firestore's `cockpit_content` collection — which only
       succeeds for a signed-in, allow-listed user per firestore.rules. Until then, every
       render function above already treats an empty array as a safe "nothing yet" state. */
    function showCockpitContentLoading(isLoading) {
      const el = document.getElementById('cockpitContentLoadingBanner');
      if (el) el.style.display = isLoading ? 'flex' : 'none';
    }
    window.showCockpitContentLoading = showCockpitContentLoading;

    function showCockpitContentError(message) {
      const el = document.getElementById('cockpitContentErrorBanner');
      if (el) {
        el.textContent = '⚠️ Could not load negotiation content: ' + message + ' — check your connection and reload.';
        el.style.display = 'block';
      }
    }
    window.showCockpitContentError = showCockpitContentError;

    function renderTopicDependentViews() {
      renderAgendaList();
      renderTopicDetail();
      renderDecisionsGrid();
    }

    function applyCockpitContent(data) {
      MASTER_DECISIONS = (data && data.masterDecisions) || [];
      TOPICS_MARQUEE = (data && data.topicsMarquee) || [];
      TOPICS_RAYAGADA = (data && data.topicsRayagada) || [];
      renderTopicDependentViews();
    }
    window.applyCockpitContent = applyCockpitContent;

    /* RENDER FUNCTIONS */
    function renderAgendaList() {
      const topics = getActiveTopics();
      const container = document.getElementById('agendaListContainer');
      container.innerHTML = '';
      
      let agreedCount = 0;
      topics.forEach((topic, idx) => {
        const itemStatus = topicStatuses[currentEvent + '_' + idx] || 'pending';
        if (itemStatus === 'agreed') agreedCount++;

        const item = document.createElement('div');
        item.className = 'agenda-item' + (idx === currentTopicIndex ? ' active' : '');
        item.onclick = () => selectTopic(idx);
        item.innerHTML = `
          <div class="agenda-item-top">
            <span class="agenda-item-act ${topic.actClass}">${topic.act}</span>
            <div style="display: flex; gap: 4px; align-items: center;">
              <span class="agenda-item-status-pill ${itemStatus}">${itemStatus.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
          <div class="agenda-item-title">${topic.title}</div>
          <div class="agenda-item-desc">${topic.shortDesc}</div>
        `;
        container.appendChild(item);
      });

      document.getElementById('agendaCountText').textContent = `${topics.length} TACTICAL TOPICS`;
      document.getElementById('agendaAgreedCounter').textContent = `${agreedCount} AGREED`;
    }

    function selectTopic(index) {
      currentTopicIndex = index;
      renderAgendaList();
      renderTopicDetail();
    }

    function renderTopicDetail() {
      const topics = getActiveTopics();
      const topic = topics[currentTopicIndex] || topics[0];
      if (!topic) return;

      document.getElementById('topicActBadge').textContent = topic.act;
      document.getElementById('topicActBadge').className = 'topic-act-pill ' + topic.actClass;
      document.getElementById('topicTimeEstimate').textContent = topic.time;
      document.getElementById('topicTitle').textContent = topic.headline;
      document.getElementById('topicGoal').textContent = topic.goal;

      // Status buttons
      const currentStatus = topicStatuses[currentEvent + '_' + currentTopicIndex] || 'pending';
      ['Pending', 'InProgress', 'Agreed', 'Blocked'].forEach(st => {
        const btn = document.getElementById('sbtn' + st);
        if (btn) {
          const val = st === 'InProgress' ? 'in_progress' : st.toLowerCase();
          btn.classList.toggle('active', val === currentStatus);
        }
      });

      // Visual plate pill strip with DUAL actions: Photo vs Blueprint
      const visualStrip = document.getElementById('topicVisualStrip');
      const visualContainer = document.getElementById('topicVisualButtonsContainer');
      const visualCountText = document.getElementById('topicVisualCountText');
      const linkedPlates = TOPIC_PLATE_MAP[currentTopicIndex] || [];

      if (linkedPlates.length > 0) {
        visualStrip.style.display = 'flex';
        visualCountText.textContent = linkedPlates.length + ' Visual Reference Plate' + (linkedPlates.length > 1 ? 's' : '') + ' Linked';
        visualContainer.innerHTML = '';
        linkedPlates.forEach(plateIdx => {
          const plate = VISUAL_PLATES[plateIdx];
          if (plate) {
            // Photo button
            const btnPhoto = document.createElement('button');
            btnPhoto.className = 'topic-visual-btn photo-mode';
            btnPhoto.innerHTML = '<span>📸 ' + plate.id + ' Photo</span>';
            btnPhoto.onclick = () => openLightboxToPlate(plateIdx, 'photo');
            visualContainer.appendChild(btnPhoto);

            // Blueprint button
            const btnBlueprint = document.createElement('button');
            btnBlueprint.className = 'topic-visual-btn';
            btnBlueprint.innerHTML = '<span>📐 Blueprint</span>';
            btnBlueprint.onclick = () => openLightboxToPlate(plateIdx, 'blueprint');
            visualContainer.appendChild(btnBlueprint);
          }
        });
      } else {
        visualStrip.style.display = 'none';
      }

      // Spoken scripts
      document.getElementById('spokenScriptBox').textContent = topic.scripts[activeTone];
      document.getElementById('vernacularBox').textContent = 'Vernacular Anchor: "' + topic.vernacular + '"';

      // Decision tree
      const treeContainer = document.getElementById('treeStepsContainer');
      treeContainer.innerHTML = '';
      topic.tree.forEach(step => {
        const card = document.createElement('div');
        card.className = 'tree-step-card';
        card.innerHTML = `
          <div class="tree-step-header">${step.stage}</div>
          <div class="tree-step-title">${step.title}</div>
          <div class="tree-step-desc">${step.text}</div>
        `;
        treeContainer.appendChild(card);
      });

      // Curveballs
      const cbContainer = document.getElementById('curveballsContainer');
      cbContainer.innerHTML = '';
      topic.curveballs.forEach(cb => {
        const card = document.createElement('div');
        card.className = 'curveball-card';
        card.innerHTML = `
          <div class="curveball-objection">⚡ ${cb.objection}</div>
          <div class="curveball-counter">🛡️ <strong>Host Counter:</strong> ${cb.counter}</div>
          <div class="curveball-fallback">🔄 <strong>Fallback:</strong> ${cb.fallback}</div>
        `;
        cbContainer.appendChild(card);
      });

      // Facts & Guardrails
      document.getElementById('factCitationText').textContent = topic.factCitation;
      document.getElementById('guardrailText').textContent = topic.guardrail;
    }

    function switchStageTab(tabKey) {
      activeStageView = tabKey;
      ['script', 'tree', 'curveballs', 'evidence', 'calc'].forEach(t => {
        const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) btn.classList.toggle('active', t === tabKey);
      });

      document.getElementById('cardScriptSection').style.display = tabKey === 'script' ? 'flex' : 'none';
      document.getElementById('cardTreeSection').style.display = tabKey === 'tree' ? 'block' : 'none';
      document.getElementById('cardCurveballsSection').style.display = tabKey === 'curveballs' ? 'block' : 'none';
      document.getElementById('cardEvidenceSection').style.display = tabKey === 'evidence' ? 'flex' : 'none';
      document.getElementById('cardCalcSection').style.display = tabKey === 'calc' ? 'block' : 'none';

      triggerAutosave();
    }

    function switchTone(tone) {
      activeTone = tone;
      ['warm', 'data', 'firm'].forEach(t => {
        const btn = document.getElementById('btnTone' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) btn.classList.toggle('active', t === tone);
      });
      const topics = getActiveTopics();
      const topic = topics[currentTopicIndex] || topics[0];
      if (topic) {
        document.getElementById('spokenScriptBox').textContent = topic.scripts[tone];
      }
      triggerAutosave();
    }

    function setTopicStatus(status) {
      topicStatuses[currentEvent + '_' + currentTopicIndex] = status;
      renderAgendaList();
      renderTopicDetail();
      triggerAutosave();
    }

    function switchEvent(evt) {
      currentEvent = evt;
      currentTopicIndex = 0;
      document.getElementById('btnEventMarquee').classList.toggle('active', evt === 'marquee');
      document.getElementById('btnEventRayagada').classList.toggle('active', evt === 'rayagada');

      if (evt === 'marquee') {
        document.getElementById('metricVenueId').textContent = 'VEN-002 (50m Ground)';
        document.getElementById('metricBudgetCap').textContent = '₹4,00,000';
        document.getElementById('metricTargetSpend').textContent = '₹3,25,000';
        document.getElementById('metricReserveCeiling').textContent = '₹4,50,000';
      } else {
        document.getElementById('metricVenueId').textContent = 'VEN-001 (Hotel Hall)';
        document.getElementById('metricBudgetCap').textContent = '₹50,000';
        document.getElementById('metricTargetSpend').textContent = '₹40,000';
        document.getElementById('metricReserveCeiling').textContent = '₹60,000';
      }

      renderAgendaList();
      renderTopicDetail();
      renderSlideIndicators();
      renderCurrentSlide();
      triggerAutosave();
    }

    /* 4-TIER COMMERCIAL CALCULATOR LOGIC */
    function recalculate4TierQuote() {
      const tierA = parseFloat(document.getElementById('calcTierA').value) || 0;
      const tierB1 = parseFloat(document.getElementById('calcTierB1').value) || 0;
      const tierB2 = parseFloat(document.getElementById('calcTierB2').value) || 0;
      const tierB3 = parseFloat(document.getElementById('calcTierB3').value) || 0;
      const tierB4 = parseFloat(document.getElementById('calcTierB4').value) || 0;
      const tierC = parseFloat(document.getElementById('calcTierC').value) || 0;
      const discount = parseFloat(document.getElementById('calcDiscount').value) || 0;

      const rawTotal = tierA + tierB1 + tierB2 + tierB3 + tierB4 + tierC;
      const settlement = Math.max(0, rawTotal - discount);
      const savingsPct = rawTotal > 0 ? ((discount / rawTotal) * 100).toFixed(1) : 0;
      const retention = settlement * 0.20;
      const advToken = settlement * 0.30;
      const handover = settlement * 0.50;

      document.getElementById('res4TierRaw').textContent = '₹' + rawTotal.toLocaleString('en-IN');
      document.getElementById('res4TierSettlement').textContent = '₹' + settlement.toLocaleString('en-IN');
      document.getElementById('res4TierSavings').textContent = '₹' + discount.toLocaleString('en-IN') + ' (' + savingsPct + '%)';
      document.getElementById('res4TierRetention').textContent = '₹' + retention.toLocaleString('en-IN');

      document.getElementById('res4TierAdv').textContent = '₹' + advToken.toLocaleString('en-IN');
      document.getElementById('res4TierFw').textContent = '₹' + handover.toLocaleString('en-IN');
      document.getElementById('res4TierRet').textContent = '₹' + retention.toLocaleString('en-IN');

      // Sync to printable tender doc
      document.getElementById('docTierA').textContent = tierA.toLocaleString('en-IN');
      document.getElementById('docTierB1').textContent = tierB1.toLocaleString('en-IN');
      document.getElementById('docTierB2').textContent = tierB2.toLocaleString('en-IN');
      document.getElementById('docTierB3').textContent = tierB3.toLocaleString('en-IN');
      document.getElementById('docTierB4').textContent = tierB4.toLocaleString('en-IN');
      document.getElementById('docTierC').textContent = tierC.toLocaleString('en-IN');
      document.getElementById('docDiscount').textContent = discount.toLocaleString('en-IN');
      document.getElementById('docNetTotal').textContent = settlement.toLocaleString('en-IN');

      document.getElementById('docMilestone1').textContent = advToken.toLocaleString('en-IN');
      document.getElementById('docMilestone2').textContent = handover.toLocaleString('en-IN');
      document.getElementById('docMilestone3').textContent = retention.toLocaleString('en-IN');

      triggerAutosave();
    }

    /* VISUAL LOOKBOOK & LIGHTBOX LOGIC (v2.5 REAL PHOTO + BLUEPRINT) */
    function openLookbookModal() {
      renderLookbookGrid();
      document.getElementById('lookbookModalBackdrop').classList.add('active');
    }

    function closeLookbookModal() {
      document.getElementById('lookbookModalBackdrop').classList.remove('active');
    }

    function filterLookbook(category) {
      activeLookbookFilter = category;
      document.querySelectorAll('.lookbook-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === 'fbtn-' + category);
      });
      renderLookbookGrid();
    }

    function setGridImageMode(mode) {
      currentGridMode = mode;
      document.getElementById('gridTogglePhoto').classList.toggle('active', mode === 'photo');
      document.getElementById('gridToggleBlueprint').classList.toggle('active', mode === 'blueprint');
      renderLookbookGrid();
    }

    function renderLookbookGrid() {
      const container = document.getElementById('lookbookGridContainer');
      container.innerHTML = '';

      const filtered = VISUAL_PLATES.filter(p => {
        if (activeLookbookFilter === 'all') return true;
        return p.category === activeLookbookFilter;
      });

      filtered.forEach(plate => {
        const card = document.createElement('div');
        card.className = 'lookbook-card';
        const activeSrc = currentGridMode === 'photo' ? (plate.photoSrc || plate.blueprintSrc) : plate.blueprintSrc;
        card.onclick = () => openLightboxToPlate(plate.index, currentGridMode);
        card.innerHTML = `
          <div class="lookbook-img-box">
            <img src="${activeSrc}" alt="${plate.title}" onerror="this.src='${plate.blueprintSrc}'" />
            <span class="lookbook-badge-plate">${plate.id}</span>
            <span class="lookbook-badge-scope ${plate.mandatory ? 'mandatory' : 'inspiration'}">${plate.mandatory ? 'MANDATORY' : 'INSPIRATION'}</span>
            <span class="lookbook-badge-type">${currentGridMode === 'photo' ? '📸 Real Photo' : '📐 Blueprint'}</span>
            ${plate.isCustom ? '<span class="lookbook-badge-custom">📌 Custom URL</span>' : ''}
          </div>
          <div class="lookbook-card-body">
            <div class="lookbook-card-title">${plate.title}</div>
            <div class="lookbook-card-zone">${plate.zone}</div>
            <div class="lookbook-card-notes">${plate.notes}</div>
            <div class="lookbook-card-footer">
              <span>${plate.dimensions}</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="mode-btn" onclick="event.stopPropagation(); openCustomPhotoModal('${plate.id}')" style="font-size: 10px; padding: 2px 7px; background: rgba(245, 158, 11, 0.12); color: var(--accent-gold); border-color: rgba(245, 158, 11, 0.3);" title="Override with Pinterest or custom image">✏️ Photo</button>
                <span style="color:#38bdf8; font-weight:600; cursor:pointer;">Inspect ➔</span>
              </div>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function openLightboxToPlate(index, mode) {
      resetLightboxZoom();
      currentLightboxIndex = index;
      if (mode) currentLightboxMode = mode;
      renderLightboxView();
      document.getElementById('lightboxModalBackdrop').classList.add('active');
    }

    function closeLightboxModal() {
      resetLightboxZoom();
      document.getElementById('lightboxModalBackdrop').classList.remove('active');
    }

    function switchLightboxMode(mode) {
      currentLightboxMode = mode;
      renderLightboxView();
    }

    function toggleLightboxMode() {
      currentLightboxMode = currentLightboxMode === 'photo' ? 'blueprint' : 'photo';
      renderLightboxView();
    }

    function prevLightboxPlate() {
      resetLightboxZoom();
      if (currentLightboxIndex > 0) {
        currentLightboxIndex--;
      } else {
        currentLightboxIndex = VISUAL_PLATES.length - 1;
      }
      renderLightboxView();
    }

    function nextLightboxPlate() {
      resetLightboxZoom();
      if (currentLightboxIndex < VISUAL_PLATES.length - 1) {
        currentLightboxIndex++;
      } else {
        currentLightboxIndex = 0;
      }
      renderLightboxView();
    }

    function renderLightboxView() {
      const plate = VISUAL_PLATES[currentLightboxIndex] || VISUAL_PLATES[0];
      if (!plate) return;

      document.getElementById('lbPlateId').textContent = plate.id;
      document.getElementById('lbPlateTitle').textContent = plate.title;
      
      const scopeBadge = document.getElementById('lbScopeBadge');
      scopeBadge.textContent = plate.mandatory ? 'MANDATORY CONTRACTUAL SCOPE' : 'DESIGN INSPIRATION REFERENCE';
      scopeBadge.className = 'lightbox-scope-badge ' + (plate.mandatory ? 'mandatory' : 'inspiration');

      document.getElementById('lbTogglePhoto').classList.toggle('active', currentLightboxMode === 'photo');
      document.getElementById('lbToggleBlueprint').classList.toggle('active', currentLightboxMode === 'blueprint');

      document.getElementById('lbCounter').textContent = (currentLightboxIndex + 1) + ' / ' + VISUAL_PLATES.length;
      
      const img = document.getElementById('lightboxImg');
      const activeSrc = currentLightboxMode === 'photo' ? (plate.photoSrc || plate.blueprintSrc) : plate.blueprintSrc;
      img.src = activeSrc;
      img.alt = plate.title + ' (' + currentLightboxMode + ')';

      document.getElementById('lbZoneText').textContent = plate.zone;
      document.getElementById('lbSpecText').textContent = plate.spec;
      document.getElementById('lbClauseText').textContent = plate.clause;
      document.getElementById('lbNotesText').textContent = plate.notes + ' [' + plate.dimensions + ']';
    }

    /* TENDER EXPORT MODAL */
    function exportTenderAnnexureModal() {
      recalculate4TierQuote();
      const now = new Date();
      document.getElementById('tenderCurrentDate').textContent = now.toISOString().split('T')[0];
      document.getElementById('tenderModalBackdrop').classList.add('active');
    }

    function closeTenderModal() {
      document.getElementById('tenderModalBackdrop').classList.remove('active');
    }

    function printTenderDoc() {
      window.print();
    }

    /* AUTOSAVE ENGINE (localStorage) */
    let saveTimeout = null;
    function triggerAutosave() {
      const badge = document.getElementById('autosaveBadge');
      if (badge) {
        badge.textContent = '⏳ Saving...';
        badge.style.color = '#f59e0b';
      }
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveCockpitState, 600);
    }

    function saveCockpitState() {
      const state = {
        event: currentEvent,
        topicIndex: currentTopicIndex,
        stageTab: activeStageView,
        tone: activeTone,
        slideIndex: currentSlideIndex,
        topicStatuses: topicStatuses,
        calc: {
          tierA: document.getElementById('calcTierA').value,
          tierB1: document.getElementById('calcTierB1').value,
          tierB2: document.getElementById('calcTierB2').value,
          tierB3: document.getElementById('calcTierB3').value,
          tierB4: document.getElementById('calcTierB4').value,
          tierC: document.getElementById('calcTierC').value,
          discount: document.getElementById('calcDiscount').value
        },
        timestamp: new Date().toISOString()
      };
      try {
        localStorage.setItem('sree_krushna_cockpit_state_v2', JSON.stringify(state));
        const badge = document.getElementById('autosaveBadge');
        if (badge) {
          badge.textContent = '💾 Autosaved';
          badge.style.color = '#10b981';
        }
      } catch (err) {
        console.warn('Failed to save to localStorage:', err);
      }
    }

    function restoreCockpitState() {
      try {
        const raw = localStorage.getItem('sree_krushna_cockpit_state_v2');
        if (!raw) return;
        const state = JSON.parse(raw);
        if (state.topicStatuses) topicStatuses = state.topicStatuses;
        if (state.event) switchEvent(state.event);
        if (state.calc) {
          if (state.calc.tierA) document.getElementById('calcTierA').value = state.calc.tierA;
          if (state.calc.tierB1) document.getElementById('calcTierB1').value = state.calc.tierB1;
          if (state.calc.tierB2) document.getElementById('calcTierB2').value = state.calc.tierB2;
          if (state.calc.tierB3) document.getElementById('calcTierB3').value = state.calc.tierB3;
          if (state.calc.tierB4) document.getElementById('calcTierB4').value = state.calc.tierB4;
          if (state.calc.tierC) document.getElementById('calcTierC').value = state.calc.tierC;
          if (state.calc.discount) document.getElementById('calcDiscount').value = state.calc.discount;
          recalculate4TierQuote();
        }
        if (state.stageTab) switchStageTab(state.stageTab);
        if (state.tone) switchTone(state.tone);
        if (typeof state.topicIndex === 'number') selectTopic(state.topicIndex);
      } catch (e) {
        console.warn('Error restoring cockpit state:', e);
      }
    }

    function resetCockpitDefaults() {
      if (confirm('Reset all negotiation figures, topics and statuses to canonical defaults?')) {
        localStorage.removeItem('sree_krushna_cockpit_state_v2');
        window.location.reload();
      }
    }

    /* AUDIENCE PRESENTATION LOGIC */
    function renderSlideIndicators() {
      const slides = getActiveSlides();
      const container = document.getElementById('slideIndicatorsContainer');
      container.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'slide-dot' + (idx === currentSlideIndex ? ' active' : '');
        dot.onclick = () => goToSlide(idx);
        container.appendChild(dot);
      });
    }

    function renderCurrentSlide() {
      const slides = getActiveSlides();
      const slide = slides[currentSlideIndex] || slides[0];
      const container = document.getElementById('activeSlideContainer');
      container.innerHTML = `
        <div class="slide-tag">${slide.tag}</div>
        <h2 class="slide-title">${slide.title}</h2>
        <div class="slide-subtitle">${slide.subtitle}</div>
        ${slide.contentHtml}
      `;
      document.getElementById('slideCounterText').textContent = `Slide ${currentSlideIndex + 1} of ${slides.length}`;
      
      const dots = document.querySelectorAll('.slide-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlideIndex));
    }

    function prevSlide() {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderCurrentSlide();
      }
    }

    function nextSlide() {
      const slides = getActiveSlides();
      if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        renderCurrentSlide();
      }
    }

    function goToSlide(index) {
      currentSlideIndex = index;
      renderCurrentSlide();
    }

    /* VIEW SWITCHING & PIN AUTH */
    function switchView(mode) {
      currentMode = mode;
      const hudEl = document.getElementById('hudWorkspace');
      const founderEl = document.getElementById('founderWorkspace');
      const decisionsEl = document.getElementById('decisionsWorkspace');
      const btnHud = document.getElementById('btnModeHud');
      const btnFounder = document.getElementById('btnModeFounder');
      const btnDecisions = document.getElementById('btnModeDecisions');
      const liveModeBadge = document.getElementById('liveModeBadge');

      if (decisionsEl) decisionsEl.style.display = 'none';
      founderEl.classList.remove('active');
      hudEl.style.display = 'none';

      btnHud.classList.remove('active');
      btnFounder.classList.remove('active');
      if (btnDecisions) btnDecisions.classList.remove('active');

      if (mode === 'audience') {
        founderEl.classList.add('active');
        btnFounder.classList.add('active');
        liveModeBadge.textContent = '🔴 LIVE ON SCREEN — AUDIENCE VIEW';
        liveModeBadge.className = 'live-badge audience';
        renderCurrentSlide();
      } else if (mode === 'decisions') {
        if (decisionsEl) decisionsEl.style.display = 'flex';
        if (btnDecisions) btnDecisions.classList.add('active');
        liveModeBadge.textContent = '🏛️ MASTER DECOR DECISION ROADMAP';
        liveModeBadge.className = 'live-badge hud';
        renderDecisionsGrid();
      } else {
        hudEl.style.display = 'grid';
        btnHud.classList.add('active');
        liveModeBadge.textContent = '🔒 PRESENTER HUD — PRIVATE';
        liveModeBadge.className = 'live-badge hud';
        renderTopicDetail();
      }
    }

    function requestHudMode() {
      if (isHudUnlocked) {
        switchView('hud');
      } else {
        document.getElementById('pinModalBackdrop').classList.add('active');
        document.getElementById('pinInput').value = '';
        document.getElementById('pinInput').focus();
      }
    }

    function submitPin() {
      const pin = document.getElementById('pinInput').value;
      if (pin === '7799' || pin === '1234') {
        isHudUnlocked = true;
        sessionStorage.setItem('marriage_os_hud_unlocked', 'true');
        closePinModal();
        switchView('hud');
      } else {
        alert('Invalid Coordinator PIN. Access denied.');
        document.getElementById('pinInput').value = '';
      }
    }

    function closePinModal() {
      document.getElementById('pinModalBackdrop').classList.remove('active');
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        const target = document.getElementById('cockpitFrame') || document.documentElement;
        target.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    function copySpokenScript() {
      const text = document.getElementById('spokenScriptBox').textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        alert('Spoken dialogue copied to clipboard!');
      });
    }

    function handleGlobalSearch(query) {
      const q = query.toLowerCase().trim();
      if (!q) {
        renderAgendaList();
        return;
      }
      const items = document.querySelectorAll('.agenda-item');
      const topics = getActiveTopics();
      topics.forEach((t, idx) => {
        const match = t.title.toLowerCase().includes(q) || 
                      t.headline.toLowerCase().includes(q) || 
                      t.factCitation.toLowerCase().includes(q);
        if (items[idx]) {
          items[idx].style.display = match ? 'block' : 'none';
        }
      });
    }

    /* KEYBOARD SHORTCUTS */
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      
      // Lightbox navigation
      const lbBackdrop = document.getElementById('lightboxModalBackdrop');
      if (lbBackdrop && lbBackdrop.classList.contains('active')) {
        if (e.key === 'ArrowRight') { nextLightboxPlate(); return; }
        if (e.key === 'ArrowLeft') { prevLightboxPlate(); return; }
        if (e.key.toLowerCase() === 't') { toggleLightboxMode(); return; }
        if (e.key.toLowerCase() === 'z') { toggleLightboxZoom(); return; }
        if (e.key === 'Escape') { closeLightboxModal(); return; }
      }

      // Close other modals on Escape
      if (e.key === 'Escape') {
        closeLookbookModal();
        closeTenderModal();
        closePinModal();
        return;
      }

      // Hotkey V: Toggle Lookbook
      if (e.key.toLowerCase() === 'v') {
        const lb = document.getElementById('lookbookModalBackdrop');
        if (lb && lb.classList.contains('active')) closeLookbookModal();
        else openLookbookModal();
        return;
      }

      // Hotkey T: Export Tender
      if (e.key.toLowerCase() === 't' && currentMode === 'hud') {
        exportTenderAnnexureModal();
        return;
      }

      // Hotkey 4 or D: Master Decisions
      if (e.key === '4' || (e.key.toLowerCase() === 'd' && currentMode !== 'decisions')) {
        if (currentMode === 'decisions') switchView('hud');
        else switchView('decisions');
        return;
      }

      // Audience mode slides
      if (e.key === 'ArrowRight' && currentMode === 'audience') nextSlide();
      if (e.key === 'ArrowLeft' && currentMode === 'audience') prevSlide();

      // Hotkey H: Presenter HUD
      if (e.key.toLowerCase() === 'h') {
        if (currentMode === 'hud') switchView('audience');
        else requestHudMode();
      }

      // Tone switching (1: Warm, 2: Data, 3: Firm)
      if (e.key === '1') switchTone('warm');
      if (e.key === '2') switchTone('data');
      if (e.key === '3') switchTone('firm');
    });

    /* INITIALIZATION */
    window.addEventListener('DOMContentLoaded', () => {
      renderAgendaList();
      renderTopicDetail();
      renderSlideIndicators();
      renderCurrentSlide();
      recalculate4TierQuote();
      restoreCockpitState();
    });
