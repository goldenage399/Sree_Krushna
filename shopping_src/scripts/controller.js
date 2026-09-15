(function() {
    const data = window.SHOPPING_REGISTRY_DATA || { chapters: [], clusters: [], stores: [], items: [] };
    const chapters = data.chapters || [];
    const clusters = data.clusters || [];
    const stores = data.stores || [];
    const items = data.items || [];

    // Local State
    let activeChapter = 'all';
    let activeFilter = 'all';
    let searchQuery = '';
    let isFamilyMode = false;
    let userSelections = JSON.parse(localStorage.getItem('sk_shopping_selections') || '{}');
    let itemPurchased = JSON.parse(localStorage.getItem('sk_shopping_purchased') || '{}');
    let stakeholderApprovals = JSON.parse(localStorage.getItem('sk_shopping_approvals') || '{}');

    // DOM Elements
    const shopWelcomeBanner = document.getElementById('shopWelcomeBanner');
    const welcomeBannerTitle = document.getElementById('welcomeBannerTitle');
    const welcomeBannerSub = document.getElementById('welcomeBannerSub');
    const welcomeBannerIcon = document.getElementById('welcomeBannerIcon');
    const shopHeader = document.getElementById('shopHeader');
    const chapterMilestoneTrack = document.getElementById('chapterMilestoneTrack');
    const btnFilterAllChapters = document.getElementById('btnFilterAllChapters');
    const shoppingClusterPods = document.getElementById('shoppingClusterPods');
    const storesGrid = document.getElementById('storesGrid');
    const itemsGrid = document.getElementById('itemsGrid');
    const shopFilterPills = document.querySelectorAll('.shop-pill');
    const shopSearchInput = document.getElementById('shopSearchInput');
    const btnShareFamily = document.getElementById('btnShareFamily');
    const btnShareSisters = document.getElementById('btnShareSisters');
    const btnPrintRunSheet = document.getElementById('btnPrintRunSheet');
    const btnExportJson = document.getElementById('btnExportJson');
    const shopToast = document.getElementById('shopToast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMsg = document.getElementById('toastMsg');
    const kpiTotalItems = document.getElementById('kpiTotalItems');
    const kpiAlignedItems = document.getElementById('kpiAlignedItems');
    const kpiPurchasedItems = document.getElementById('kpiPurchasedItems');
    const kpiStoresCount = document.getElementById('kpiStoresCount');

    function saveState() {
      localStorage.setItem('sk_shopping_selections', JSON.stringify(userSelections));
      localStorage.setItem('sk_shopping_purchased', JSON.stringify(itemPurchased));
      localStorage.setItem('sk_shopping_approvals', JSON.stringify(stakeholderApprovals));
      updateKpis();
    }

    function showToast(msg, icon = '📋') {
      toastIcon.textContent = icon;
      toastMsg.textContent = msg;
      shopToast.classList.add('active');
      setTimeout(() => shopToast.classList.remove('active'), 3500);
    }

    // URL Query Param Parser & Deep-Link Wiring
    function parseUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'family') {
        isFamilyMode = true;
        shopWelcomeBanner.classList.add('active');
        shopHeader.style.display = 'none';
        welcomeBannerTitle.textContent = "Welcome to Sree & Krushna Family Trousseau Review!";
        welcomeBannerSub.textContent = "Please review the sacred Vivaha Pata, Groom Mandap wear, and In-Laws 'Sara' gifting packages below.";
      } else if (mode === 'sisters') {
        isFamilyMode = true;
        shopWelcomeBanner.classList.add('active');
        welcomeBannerIcon.textContent = "👭";
        welcomeBannerTitle.textContent = "Sisters' Styling & Wardrobe Review Hub!";
        welcomeBannerSub.textContent = "Vote on Sangeet Lehengas, Groom Sherwani styling, and your matching festive sarees!";
      }

      const paramChapter = params.get('chapter');
      if (paramChapter && chapters.some(c => c.id === paramChapter)) {
        activeChapter = paramChapter;
      }

      const paramCluster = params.get('cluster');
      if (paramCluster) {
        const matchedCluster = clusters.find(c => c.id === paramCluster);
        if (matchedCluster && matchedCluster.chapterId) {
          activeChapter = matchedCluster.chapterId;
        }
        setTimeout(() => {
          const el = document.getElementById('cluster-' + paramCluster) || (matchedCluster && document.getElementById('cluster-' + matchedCluster.id));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (params.get('comments') === 'true' || params.get('drawer') === 'true') {
              if (window.SKPrimitives && window.SKPrimitives.openComments) {
                window.SKPrimitives.openComments(paramCluster, {
                  title: matchedCluster ? matchedCluster.title : paramCluster,
                  badge: paramCluster,
                  sub: matchedCluster ? matchedCluster.description : ''
                });
              }
            }
          }
        }, 350);
      }

      const paramOption = params.get('option');
      if (paramOption) {
        let targetCluster = null;
        let targetOpt = null;
        for (const c of clusters) {
          const found = c.options.find(o => o.optionId === paramOption || `${c.id}-${o.optionId}` === paramOption);
          if (found) {
            targetCluster = c;
            targetOpt = found;
            break;
          }
        }
        if (targetCluster && targetCluster.chapterId) {
          activeChapter = targetCluster.chapterId;
        }
        setTimeout(() => {
          const optCard = document.querySelector(`[data-option-id="${paramOption}"]`) || (targetCluster && targetOpt && document.getElementById(`opt-${targetCluster.id}-${targetOpt.optionId}`));
          if (optCard) {
            optCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            optCard.style.outline = '2px solid var(--shop-gold, #d4af37)';
            setTimeout(() => { optCard.style.outline = ''; }, 3000);
          } else if (targetCluster) {
            const el = document.getElementById('cluster-' + targetCluster.id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          if (window.SKPrimitives && window.SKPrimitives.openComments) {
            const key = targetCluster ? targetCluster.id : paramOption;
            window.SKPrimitives.openComments(key, {
              title: targetOpt ? targetOpt.title : paramOption,
              badge: targetOpt ? `Option ${targetOpt.optionId}` : paramOption,
              sub: targetOpt ? `${targetOpt.store} • ${targetOpt.priceTier}` : ''
            });
          }
        }, 350);
      }

      const paramItem = params.get('item');
      if (paramItem) {
        const item = items.find(i => i.id === paramItem || i.code === paramItem);
        if (item && item.chapterId) {
          activeChapter = item.chapterId;
        }
        setTimeout(() => {
          const card = document.getElementById('card-' + paramItem) || (item && document.getElementById('card-' + item.id));
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.outline = '2px solid var(--shop-gold, #d4af37)';
            setTimeout(() => { card.style.outline = ''; }, 3000);
            if (window.SKPrimitives && window.SKPrimitives.openComments) {
              window.SKPrimitives.openComments(item.id, {
                title: item.title,
                badge: item.id,
                sub: `${item.store} • ${item.priceRange}`
              });
            }
          }
        }, 350);
      }
    }

    window.switchShoppingMode = function(mode) {
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      window.location.href = url.toString();
    };

    function updateKpis() {
      kpiTotalItems.textContent = items.length;
      kpiStoresCount.textContent = stores.length;

      let purchasedCount = 0;
      let alignedCount = 0;

      items.forEach(i => {
        if (itemPurchased[i.id]) purchasedCount++;
        const approvals = stakeholderApprovals[i.id] || i.approvals || {};
        if (approvals.bride && approvals.sisters) alignedCount++;
      });

      kpiPurchasedItems.textContent = `${purchasedCount} / ${items.length}`;
      kpiAlignedItems.textContent = alignedCount;
    }

    // Render Chapters
    function renderChapters() {
      chapterMilestoneTrack.innerHTML = chapters.map(c => {
        const isActive = (c.id === activeChapter);
        const chapterItems = items.filter(i => i.chapterId === c.id);
        const doneCount = chapterItems.filter(i => itemPurchased[i.id]).length;

        return `
          <div class="shop-milestone-node ${isActive ? 'active' : ''}" onclick="window.selectChapter('${c.id}')">
            <div class="shop-milestone-top">
              <span class="shop-milestone-phase">Chapter ${c.number}</span>
              <span class="shop-milestone-badge">${doneCount}/${chapterItems.length} Done</span>
            </div>
            <div class="shop-milestone-label">
              <span>${c.icon}</span> <span>${c.title}</span>
            </div>
            <div class="shop-milestone-time">${c.dayTimeline} • ${c.primaryZone}</div>
          </div>
        `;
      }).join('');
    }

    window.selectChapter = function(chapterId) {
      activeChapter = (activeChapter === chapterId) ? 'all' : chapterId;
      renderChapters();
      renderClusters();
      renderItems();
    };

    btnFilterAllChapters.addEventListener('click', () => {
      activeChapter = 'all';
      renderChapters();
      renderClusters();
      renderItems();
    });

    // Render Clusters
    function renderClusters() {
      const filteredClusters = clusters.filter(c => {
        if (activeChapter === 'all') return true;
        return c.chapterId === activeChapter;
      });

      if (filteredClusters.length === 0) {
        shoppingClusterPods.innerHTML = '';
        return;
      }

      shoppingClusterPods.innerHTML = filteredClusters.map(cluster => {
        const currentChoice = userSelections[cluster.id] || 'A';

        return `
          <div class="shop-cluster-card" id="cluster-${cluster.id}">
            <div class="shop-cluster-header">
              <div class="shop-cluster-title-wrap">
                <h2><span>✨</span> <span>${cluster.title}</span></h2>
                <p>${cluster.description} • <strong>Deciders:</strong> ${cluster.deciders.join(', ')}</p>
              </div>
              <div class="shop-cluster-actions">
                <button class="shop-btn shop-btn-whatsapp" onclick="window.shareClusterWhatsApp('${cluster.id}')">
                  <span>📱</span> Share for Vote
                </button>
                <button class="shop-btn" onclick="window.openCommentsDrawer('${cluster.id}', { title: '${cluster.title.replace(/'/g, "\\'")}', badge: '${cluster.id}', sub: '${cluster.description.replace(/'/g, "\\'")}' })" title="Open Discussion Thread">
                  <span>💬</span> Family Opinions (<span id="count-${cluster.id}">${(window.SKPrimitives && window.SKPrimitives.getCommentCount ? window.SKPrimitives.getCommentCount(cluster.id) : 0)}</span>)
                </button>
              </div>
            </div>

            <!-- N-Option Cards -->
            <div class="shop-pod-grid">
              ${cluster.options.map(opt => {
                const isSelected = (currentChoice === opt.optionId);
                const commentCount = (window.SKPrimitives && window.SKPrimitives.getCommentCount) ? window.SKPrimitives.getCommentCount(cluster.id) : 0;
                return `
                  <div class="shop-pod-option-card ${isSelected ? 'selected' : ''}" data-cluster-id="${cluster.id}" data-option-id="${opt.optionId}" id="opt-${cluster.id}-${opt.optionId}" onclick="window.selectClusterOption('${cluster.id}', '${opt.optionId}')">
                    <div class="shop-pod-top">
                      <h4 class="shop-pod-title">Option ${opt.optionId}: ${opt.title}</h4>
                      <span class="shop-pod-price">${opt.priceTier}</span>
                    </div>
                    <div class="shop-pod-color">${opt.color} • ${opt.weave}</div>
                    <div class="shop-pod-highlight">${opt.highlight}</div>
                    <div class="shop-pod-store">📍 ${opt.store}</div>
                    <div style="display: flex; gap: 6px; margin-top: 10px; align-items: stretch;">
                      <button class="shop-pod-radio-btn" type="button" style="flex: 1; margin-top: 0;">
                        <span>${isSelected ? '🔘' : '⚪'}</span>
                        <span>${isSelected ? 'Selected (Active)' : 'Choose Concept'}</span>
                      </button>
                      <button class="shop-btn" type="button" onclick="event.stopPropagation(); window.openCommentsDrawer('${cluster.id}', { title: '${opt.title.replace(/'/g, "\\'")}', badge: 'Opt ${opt.optionId}', sub: '${opt.store} • ${opt.priceTier}', alignment: '${isSelected ? '✓ Active Choice' : 'Open for Remarks'}' })" title="Open Family Opinions & Remarks" style="padding: 4px 10px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; border-color: rgba(212, 175, 55, 0.4); color: var(--shop-gold);">
                        <span>💬</span> <span>${commentCount}</span>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="shop-cluster-footer">
              <span>📊 <strong>Active Family Choice:</strong> Option ${currentChoice}</span>
              <span>Primary Hub: ${cluster.options[0].store}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    window.selectClusterOption = function(clusterId, optionId) {
      userSelections[clusterId] = optionId;
      saveState();
      renderClusters();
      showToast(`Selected Option ${optionId} for ${clusterId}!`, '✓');
    };

    // 1-Click WhatsApp Share for Clusters
    window.shareClusterWhatsApp = function(clusterId) {
      const cluster = clusters.find(c => c.id === clusterId);
      if (!cluster) return;

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?cluster=${cluster.id}&mode=family`;
      const msg = cluster.whatsappTemplate.replace('{url}', shareUrl);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(() => {
          showToast('WhatsApp invitation text copied to clipboard! Paste into your family chat.', '📲');
        });
      } else {
        prompt('Copy WhatsApp Message:', msg);
      }
    };

    // Render Stores
    function renderStores() {
      storesGrid.innerHTML = stores.map(s => {
        return `
          <div class="shop-store-card">
            <div class="shop-store-name"><span>🏬</span> <span>${s.name}</span></div>
            <div class="shop-store-zone">${s.zone}</div>
            <div class="shop-store-specialty">${s.specialty}</div>
            <div class="shop-store-phone">📞 ${s.phone}</div>
          </div>
        `;
      }).join('');
    }

    // Render Item Checklist Grid
    function renderItems() {
      const q = searchQuery.toLowerCase().trim();

      const filtered = items.filter(item => {
        if (activeChapter !== 'all' && item.chapterId !== activeChapter) return false;

        if (activeFilter === 'purchased') {
          if (!itemPurchased[item.id]) return false;
        } else if (activeFilter !== 'all') {
          if (item.category !== activeFilter) return false;
        }

        if (!q) return true;
        const text = (item.id + ' ' + item.code + ' ' + item.title + ' ' + item.role + ' ' + item.spec + ' ' + item.store + ' ' + item.suggestedColor).toLowerCase();
        return text.includes(q);
      });

      if (filtered.length === 0) {
        itemsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--shop-text-muted);">
            No shopping items match the current search and filter criteria.
          </div>
        `;
        return;
      }

      itemsGrid.innerHTML = filtered.map(item => {
        const isBought = !!itemPurchased[item.id];
        const approvals = stakeholderApprovals[item.id] || item.approvals || {};

        return `
          <article class="shop-item-card ${isBought ? 'purchased' : ''}" id="card-${item.id}">
            <div>
              <div class="shop-item-top">
                <span class="shop-id-badge">${item.id}</span>
                <span style="font-size: 11px; font-weight: 700; color: var(--shop-gold);">${item.priceRange}</span>
              </div>
              <h3 class="shop-item-title">${item.title}</h3>
              <div class="shop-item-role">✨ ${item.role}</div>
              <div class="shop-spec-box">
                <strong>Specification:</strong> ${item.spec}
              </div>
              <div class="shop-meta-row">
                <span class="shop-meta-tag">🎨 <strong>Color:</strong> ${item.suggestedColor}</span>
                <span class="shop-meta-tag">🏬 <strong>Store:</strong> ${item.store}</span>
              </div>
              
              <!-- Multi-Stakeholder Consensus Bar -->
              <div class="shop-stakeholder-bar">
                <span style="font-size: 11px; font-weight: 700; color: var(--shop-text-muted); margin-right: 4px;">CONSENSUS:</span>
                <button class="shop-vote-pill ${approvals.bride ? 'approved' : ''}" onclick="window.toggleApproval('${item.id}', 'bride')">
                  👰 Bride ${approvals.bride ? '✓' : '○'}
                </button>
                <button class="shop-vote-pill ${approvals.sisters ? 'approved' : ''}" onclick="window.toggleApproval('${item.id}', 'sisters')">
                  👭 Sisters ${approvals.sisters ? '✓' : '○'}
                </button>
                <button class="shop-vote-pill ${approvals.inlaws ? 'approved' : ''}" onclick="window.toggleApproval('${item.id}', 'inlaws')">
                  🤝 In-Laws ${approvals.inlaws ? '✓' : '○'}
                </button>
              </div>
            </div>

            <div class="shop-item-footer">
              <label class="shop-check-label">
                <input type="checkbox" ${isBought ? 'checked' : ''} onchange="window.togglePurchased('${item.id}', this.checked)">
                <span>${isBought ? '✓ In Shopping Bag (Purchased)' : 'Mark as Purchased'}</span>
              </label>
              ${item.clusterId ? `
                <button class="shop-btn shop-btn-sm" onclick="window.focusCluster('${item.clusterId}')" style="font-size: 11px; padding: 3px 8px;">
                  ⚖️ Compare Alternatives
                </button>
              ` : ''}
            </div>
          </article>
        `;
      }).join('');
    }

    window.togglePurchased = function(itemId, isChecked) {
      itemPurchased[itemId] = isChecked;
      saveState();
      renderChapters();
      renderItems();
      showToast(isChecked ? 'Item marked as purchased in bag!' : 'Item unmarked.', '🛍️');
    };

    window.toggleApproval = function(itemId, role) {
      if (!stakeholderApprovals[itemId]) {
        const orig = items.find(i => i.id === itemId) || {};
        stakeholderApprovals[itemId] = { ...(orig.approvals || {}) };
      }
      stakeholderApprovals[itemId][role] = !stakeholderApprovals[itemId][role];
      saveState();
      renderItems();
      showToast(`Updated ${role} approval for ${itemId}!`, '✓');
    };

    window.focusCluster = function(clusterId) {
      const el = document.getElementById('cluster-' + clusterId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Filter pills
    shopFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        shopFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter');
        renderItems();
      });
    });

    shopSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderItems();
    });

    // Share Family Button
    btnShareFamily.addEventListener('click', () => {
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?mode=family`;
      const text = `🌺 *Sree Krushna Marriage OS — Wedding Shopping Review*\nHelp us review and vote on the wedding trousseau, sarees, and 'Sara' gifting items for Bhubaneswar!\n👉 Tap to review: ${shareUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Family shopping link copied! Paste into WhatsApp.', '📱');
        });
      } else {
        prompt('Copy Family Link:', text);
      }
    });

    // Share Sisters Button
    btnShareSisters.addEventListener('click', () => {
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?mode=sisters`;
      const text = `👭 *Sree Krushna Wedding — Sisters' Wardrobe & Styling Hub*\nHey! Here is the Bhubaneswar shopping checklist for our sarees, lehengas, and groom styling. Tap to vote on your favorites:\n👉 ${shareUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Sisters review link copied! Paste into your chat.', '👭');
        });
      } else {
        prompt('Copy Sisters Link:', text);
      }
    });

    btnPrintRunSheet.addEventListener('click', () => window.print());

    btnExportJson.addEventListener('click', () => {
      const payload = {
        exported_at: new Date().toISOString(),
        purchased: itemPurchased,
        selections: userSelections,
        approvals: stakeholderApprovals,
        registry: data
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sree-krushna-shopping-export-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Lightbox & Zoom/Pan Integration (STD-MOD-COMP-001)
    const lightboxBackdrop = document.getElementById('skLightboxBackdrop');
    const lightboxTitle = document.getElementById('skLightboxTitle');
    const lightboxImg = document.getElementById('skLightboxImg');
    const lightboxCaption = document.getElementById('skLightboxCaption');
    const lightboxClose = document.getElementById('skLightboxClose');
    let lightboxZoomEngine = null;

    if (window.SKPrimitives && window.SKPrimitives.initLightboxZoom && lightboxImg) {
      lightboxZoomEngine = window.SKPrimitives.initLightboxZoom(lightboxImg, {
        badge: '#skZoomBadge',
        zoomIn: '#skBtnZoomIn',
        zoomOut: '#skBtnZoomOut',
        fit: '#skBtnFit',
        reset: '#skBtnReset'
      });
    }

    window.openShoppingLightbox = function(title, photoUrl, caption) {
      if (!lightboxBackdrop || !lightboxImg) return;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCaption) lightboxCaption.innerHTML = caption || '';

      const resolved = (window.SKPrimitives && window.SKPrimitives.resolveDriveAsset)
        ? window.SKPrimitives.resolveDriveAsset(photoUrl, { zoomWidth: 1600 })
        : { zoomUrl: photoUrl };

      lightboxImg.src = resolved.zoomUrl || photoUrl;
      lightboxBackdrop.classList.add('is-active');
      if (lightboxZoomEngine) lightboxZoomEngine.fit();
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        if (lightboxBackdrop) lightboxBackdrop.classList.remove('is-active');
      });
    }
    if (lightboxBackdrop) {
      lightboxBackdrop.addEventListener('click', (e) => {
        if (e.target === lightboxBackdrop) lightboxBackdrop.classList.remove('is-active');
      });
    }

    // Wire Option Intake Modal (Adapted from PIO ImageUploadWidget)
    const btnOpenShoppingIntake = document.getElementById('btnOpenShoppingIntake');
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

    if (btnOpenShoppingIntake && intakeBackdrop) {
      btnOpenShoppingIntake.addEventListener('click', () => {
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

    // Initialize
    parseUrlParams();
    updateKpis();
    renderChapters();
    renderClusters();
    renderStores();
    renderItems();
  })();