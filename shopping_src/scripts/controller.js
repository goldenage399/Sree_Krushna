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
    let activeStoreCategory = 'all';

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
    const storeFilterBar = document.getElementById('storeFilterBar');
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

    // Contextual 1-Click Visual AI & Image Search (P-SHOPPING-DISCOVERY-001)
    window.openVisualSearch = function(query, mode = 'images') {
      const udmParam = (mode === 'ai') ? 'udm=50' : 'udm=2';
      const cleanQuery = (query || '').replace(/[^\w\s\-\u0B00-\u0B7F]/gi, ' ').replace(/\s+/g, ' ').trim();
      const url = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}&${udmParam}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    };

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

      const paramView = params.get('view') || params.get('tab');
      if (paramView === 'survey') {
        setTimeout(() => {
          if (window.switchShoppingView) window.switchShoppingView('survey');
        }, 100);
      } else if (paramView === 'table') {
        if (params.get('group')) tableState.groupBy = params.get('group');
        if (params.get('sort')) tableState.sortKey = params.get('sort');
        if (params.get('order')) tableState.sortOrder = params.get('order');
        if (params.get('cat')) tableState.category = params.get('cat');
        if (params.get('status')) tableState.status = params.get('status');
        if (params.get('q')) tableState.query = params.get('q');
        if (params.get('layout') === 'cards') {
          tableState.displayMode = 'cards';
          setTimeout(() => { if (window.setTableLayoutMode) window.setTableLayoutMode('cards'); }, 150);
        }
        setTimeout(() => {
          if (window.switchShoppingView) window.switchShoppingView('table');
        }, 100);
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
                    <div style="display: flex; gap: 6px; margin-top: 10px; align-items: stretch; flex-wrap: wrap;">
                      <button class="shop-pod-radio-btn" type="button" style="flex: 1; min-width: 120px; margin-top: 0;">
                        <span>${isSelected ? '🔘' : '⚪'}</span>
                        <span>${isSelected ? 'Selected (Active)' : 'Choose Concept'}</span>
                      </button>
                      <button class="shop-visual-search-btn" type="button" onclick="event.stopPropagation(); window.openVisualSearch('${(opt.visualSearchQuery || (opt.title + ' ' + (opt.color || '') + ' ' + (opt.weave || ''))).replace(/'/g, "\\'")}')" title="Google Images Visual AI Search">
                        <span>🔍</span> Visual Search ↗
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

      const shareUrl = (typeof SKPrimitives !== 'undefined' && SKPrimitives.getStakeholderUrl)
        ? SKPrimitives.getStakeholderUrl('shopping-registry.html', { cluster: cluster.id, mode: 'family' })
        : `${window.location.origin}/shopping-registry.html?cluster=${cluster.id}&mode=family`;
      const msg = cluster.whatsappTemplate.replace('{url}', shareUrl);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(() => {
          showToast('WhatsApp invitation text copied to clipboard! Paste into your family chat.', '📲');
        });
      } else {
        prompt('Copy WhatsApp Message:', msg);
      }
    };

    // Render Stores with Category Filtering & Google Maps Navigation (P-SHOPPING-DISCOVERY-001)
    function renderStores() {
      const filteredStores = stores.filter(s => {
        if (activeStoreCategory === 'all') return true;
        return s.category === activeStoreCategory;
      });

      if (filteredStores.length === 0) {
        storesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--shop-text-muted);">
            No verified stores found for this category.
          </div>
        `;
        return;
      }

      storesGrid.innerHTML = filteredStores.map(s => {
        const mapsLink = s.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + ', ' + s.address)}`;
        return `
          <div class="shop-store-card">
            <div class="shop-store-name"><span>🏬</span> <span>${s.name}</span></div>
            <div class="shop-store-zone">${s.zone}</div>
            <div class="shop-store-specialty">${s.specialty}</div>
            <div class="shop-store-footer">
              <span class="shop-store-phone">📞 ${s.phone}</span>
              <a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="shop-store-map-btn" title="Open store in Google Maps">
                <span>🗺️</span> Navigate ↗
              </a>
            </div>
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
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <button class="shop-visual-search-btn" type="button" onclick="window.openVisualSearch('${(item.visualSearchQuery || (item.title + ' ' + (item.suggestedColor || '') + ' ' + (item.spec || ''))).replace(/'/g, "\\'")}')" title="Google Images Visual AI Search">
                  <span>🔍</span> Visual Search ↗
                </button>
                ${item.clusterId ? `
                  <button class="shop-btn shop-btn-sm" onclick="window.focusCluster('${item.clusterId}')" style="font-size: 11px; padding: 3px 8px;">
                    ⚖️ Compare Alternatives
                  </button>
                ` : ''}
              </div>
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

    // Store category filter pills (P-SHOPPING-DISCOVERY-001)
    const storePills = document.querySelectorAll('.shop-store-pill');
    storePills.forEach(pill => {
      pill.addEventListener('click', () => {
        storePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeStoreCategory = pill.getAttribute('data-store-cat') || 'all';
        renderStores();
      });
    });

    shopSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderItems();
    });

    // Share Family Button
    btnShareFamily.addEventListener('click', () => {
      const shareUrl = (typeof SKPrimitives !== 'undefined' && SKPrimitives.getStakeholderUrl)
        ? SKPrimitives.getStakeholderUrl('shopping-registry.html', { mode: 'family' })
        : `${window.location.origin}/shopping-registry.html?mode=family`;
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
      const shareUrl = (typeof SKPrimitives !== 'undefined' && SKPrimitives.getStakeholderUrl)
        ? SKPrimitives.getStakeholderUrl('shopping-registry.html', { mode: 'sisters' })
        : `${window.location.origin}/shopping-registry.html?mode=sisters`;
      const text = `👭 *Sree Krushna Wedding — Sisters' Wardrobe & Styling Hub*\nHey! Here is the Bhubaneswar shopping checklist for our sarees, lehengas, and groom styling. Tap to vote on your favorites:\n👉 ${shareUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Sisters review link copied! Paste into your chat.', '👭');
        });
      } else {
        prompt('Copy Sisters Link:', text);
      }
    });

    btnPrintRunSheet.addEventListener('click', () => {
      document.body.removeAttribute('data-print-target');
      window.print();
    });

    // ========================================================================
    // VIEW SWITCHER & SHOPPING MODES (P-SURVEY-HYBRID-001)
    // ========================================================================
    window.currentShoppingView = 'catalog';

    window.switchShoppingMode = function(mode) {
      if (mode === 'executive') {
        isFamilyMode = false;
        if (shopWelcomeBanner) shopWelcomeBanner.classList.remove('active');
        if (shopHeader) shopHeader.style.display = 'flex';
      }
    };

    window.switchShoppingView = function(viewMode) {
      window.currentShoppingView = viewMode;
      const tabCatalog = document.getElementById('tabCatalogView');
      const tabTable = document.getElementById('tabTableView');
      const tabSurvey = document.getElementById('tabSurveyView');
      const catalogSection = document.getElementById('catalogViewSection');
      const tableSection = document.getElementById('shoppingTableViewSection');
      const surveyStudio = document.getElementById('interactiveSurveyStudio');

      if (tabCatalog) tabCatalog.classList.toggle('active', viewMode === 'catalog');
      if (tabTable) tabTable.classList.toggle('active', viewMode === 'table');
      if (tabSurvey) tabSurvey.classList.toggle('active', viewMode === 'survey');

      if (catalogSection) catalogSection.style.display = viewMode === 'catalog' ? 'block' : 'none';
      if (tableSection) tableSection.style.display = viewMode === 'table' ? 'block' : 'none';
      if (surveyStudio) surveyStudio.style.display = viewMode === 'survey' ? 'flex' : 'none';

      if (viewMode === 'table') {
        window.renderShoppingTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (viewMode === 'survey') {
        window.updateSurveyUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // ========================================================================
    // HIGH-DENSITY MUTABLE TABLE ENGINE & FIRESTORE SYNC (AC-DEC-2026-028/029/030/031)
    // Standards: P-TABLE-INTERACTIVE-001 / P-COLLAB-CONCURRENCY-001 / P-SHOPPING-HARDEN-001
    // ========================================================================
    let firestoreShoppingCache = {};
    let localAdhocItems = JSON.parse(localStorage.getItem('sk_shopping_adhoc_items_v1') || '[]');
    let tableState = {
      groupBy: 'chapter', // 'chapter' | 'store' | 'none'
      sortKey: 'default', // 'default' | 'title' | 'category' | 'role' | 'store' | 'budget' | 'status' | 'actualPrice'
      sortOrder: 'asc',   // 'asc' | 'desc'
      category: 'all',
      status: 'all',
      query: '',
      collapsedGroups: new Set(),
      displayMode: 'table' // 'table' | 'cards' (AC-DEC-2026-034 / UI-DEC-2026-030)
    };
    let pendingRemoteToastCount = 0;
    let remoteToastTimer = null;

    function syncTableUrlState() {
      try {
        const url = new URL(window.location.href);
        if (window.currentShoppingView === 'table') {
          url.searchParams.set('view', 'table');
          if (tableState.groupBy !== 'chapter') url.searchParams.set('group', tableState.groupBy);
          else url.searchParams.delete('group');

          if (tableState.sortKey !== 'default') {
            url.searchParams.set('sort', tableState.sortKey);
            url.searchParams.set('order', tableState.sortOrder);
          } else {
            url.searchParams.delete('sort');
            url.searchParams.delete('order');
          }

          if (tableState.category !== 'all') url.searchParams.set('cat', tableState.category);
          else url.searchParams.delete('cat');

          if (tableState.status !== 'all') url.searchParams.set('status', tableState.status);
          else url.searchParams.delete('status');

          if (tableState.query) url.searchParams.set('q', tableState.query);
          else url.searchParams.delete('q');

          if (tableState.displayMode && tableState.displayMode !== 'table') {
            url.searchParams.set('layout', tableState.displayMode);
          } else {
            url.searchParams.delete('layout');
          }
        }
        window.history.replaceState(null, '', url.toString());
      } catch (err) {
        // Silently tolerate restricted contexts
      }
    }

    // Mutable Table Density & Layout Switcher (AC-DEC-2026-034 / UI-DEC-2026-030)
    window.setTableLayoutMode = function(mode) {
      tableState.displayMode = mode || 'table';
      const tableEl = document.getElementById('shoppingDataTable');
      const tableSec = document.getElementById('shoppingTableViewSection');
      if (tableEl) {
        tableEl.classList.toggle('mode-cards', mode === 'cards');
      }
      if (tableSec) {
        tableSec.classList.toggle('mode-cards', mode === 'cards');
      }
      document.querySelectorAll('#tableLayoutSwitcher .table-group-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-layout') === mode);
      });
      syncTableUrlState();
    };

    window.setTableGroupBy = function(groupBy) {
      tableState.groupBy = groupBy;
      document.querySelectorAll('#tableGroupSwitcher .table-group-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-group') === groupBy);
      });
      syncTableUrlState();
      window.renderShoppingTable();
    };

    window.setTableCategoryFilter = function(cat) {
      tableState.category = cat;
      document.querySelectorAll('#tableCategoryFilters .table-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
      });
      updateResetButtonVisibility();
      syncTableUrlState();
      window.renderShoppingTable();
    };

    window.setTableStatusFilter = function(status) {
      tableState.status = status;
      document.querySelectorAll('#tableStatusFilters .table-status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-status') === status);
      });
      updateResetButtonVisibility();
      syncTableUrlState();
      window.renderShoppingTable();
    };

    window.sortTableColumn = function(key) {
      if (tableState.sortKey === key && tableState.sortOrder === 'asc') {
        tableState.sortOrder = 'desc';
      } else if (tableState.sortKey === key && tableState.sortOrder === 'desc') {
        tableState.sortKey = 'default';
        tableState.sortOrder = 'asc';
      } else {
        tableState.sortKey = key;
        tableState.sortOrder = 'asc';
      }
      updateSortHeaderUI();
      updateResetButtonVisibility();
      syncTableUrlState();
      window.renderShoppingTable();
    };

    window.resetTableFilters = function() {
      const currentMode = tableState.displayMode || 'table';
      tableState = {
        groupBy: 'chapter',
        sortKey: 'default',
        sortOrder: 'asc',
        category: 'all',
        status: 'all',
        query: '',
        collapsedGroups: new Set(),
        displayMode: currentMode
      };
      const searchInput = document.getElementById('tableSearchInput');
      if (searchInput) searchInput.value = '';

      document.querySelectorAll('#tableGroupSwitcher .table-group-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-group') === 'chapter');
      });
      document.querySelectorAll('#tableCategoryFilters .table-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cat') === 'all');
      });
      document.querySelectorAll('#tableStatusFilters .table-status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-status') === 'all');
      });

      updateSortHeaderUI();
      updateResetButtonVisibility();
      syncTableUrlState();
      window.renderShoppingTable();
      showToast('Table filters and sorting reset to default', '↺');
    };

    function updateResetButtonVisibility() {
      const resetBtn = document.getElementById('btnResetTableFilters');
      if (!resetBtn) return;
      const isDirty = tableState.category !== 'all' || tableState.status !== 'all' || tableState.sortKey !== 'default' || !!tableState.query;
      resetBtn.style.display = isDirty ? 'inline-block' : 'none';
    }

    function updateSortHeaderUI() {
      document.querySelectorAll('.shop-data-table th.sortable').forEach(th => {
        const k = th.getAttribute('data-sort-key');
        const icon = document.getElementById(`sortIcon_${k}`);
        th.classList.remove('sorted-asc', 'sorted-desc');
        if (tableState.sortKey === k) {
          if (tableState.sortOrder === 'asc') {
            th.classList.add('sorted-asc');
            if (icon) icon.textContent = '▲';
          } else {
            th.classList.add('sorted-desc');
            if (icon) icon.textContent = '▼';
          }
        } else {
          if (icon) icon.textContent = '⇅';
        }
      });
    }

    window.filterShoppingTable = function() {
      const input = document.getElementById('tableSearchInput');
      tableState.query = input ? input.value.toLowerCase().trim() : '';
      updateResetButtonVisibility();
      syncTableUrlState();
      window.renderShoppingTable();
    };

    // Collapsible Accordion Group Toggle (AC-DEC-2026-032 / P-TABLE-ACCORDION-001)
    window.toggleTableGroup = function(groupId) {
      if (!groupId) return;
      if (tableState.collapsedGroups.has(groupId)) {
        tableState.collapsedGroups.delete(groupId);
      } else {
        tableState.collapsedGroups.add(groupId);
      }
      const isCollapsed = tableState.collapsedGroups.has(groupId);
      const headerRow = document.querySelector(`tr[data-group-header-id="${groupId}"]`);
      if (headerRow) {
        headerRow.classList.toggle('collapsed', isCollapsed);
        headerRow.setAttribute('aria-expanded', !isCollapsed);
        const arrow = headerRow.querySelector('.accordion-arrow');
        if (arrow) arrow.textContent = isCollapsed ? '▶' : '▼';
      }
      document.querySelectorAll(`tr[data-group-id="${groupId}"]`).forEach(tr => {
        tr.style.display = isCollapsed ? 'none' : '';
      });
      updateToggleAllButtonText();
    };

    window.toggleAllTableGroups = function() {
      const allHeaders = document.querySelectorAll('tr[data-group-header-id]');
      if (!allHeaders.length) return;
      const allGroupIds = Array.from(allHeaders).map(h => h.getAttribute('data-group-header-id'));
      const anyOpen = allGroupIds.some(id => !tableState.collapsedGroups.has(id));
      if (anyOpen) {
        // Collapse all
        allGroupIds.forEach(id => tableState.collapsedGroups.add(id));
      } else {
        // Expand all
        tableState.collapsedGroups.clear();
      }
      window.renderShoppingTable();
    };

    function updateToggleAllButtonText() {
      const toggleText = document.getElementById('toggleAllAccordionsText');
      if (!toggleText) return;
      const allHeaders = document.querySelectorAll('tr[data-group-header-id]');
      if (!allHeaders.length) {
        toggleText.textContent = 'Collapse All';
        return;
      }
      const allGroupIds = Array.from(allHeaders).map(h => h.getAttribute('data-group-header-id'));
      const anyOpen = allGroupIds.some(id => !tableState.collapsedGroups.has(id));
      toggleText.textContent = anyOpen ? 'Collapse All' : 'Expand All';
    }

    // Bidirectional Category to Chapter Auto-Mapping (P-INTAKE-CHAPTER-001)
    window.syncNewItemCategoryToChapter = function(cat) {
      const chapterSelect = document.getElementById('newItemChapter');
      if (!chapterSelect) return;
      const mapping = {
        bridal: 'chapter_bridal_silks',
        groom: 'chapter_groom_wear',
        jewellery: 'chapter_jewellery',
        sara: 'chapter_sara_gifting',
        engagement: 'chapter_engagement',
        puja_samagri: 'chapter_general',
        general: 'chapter_general'
      };
      if (mapping[cat]) {
        chapterSelect.value = mapping[cat];
      }
    };

    window.openAddShoppingItemModal = function() {
      const modal = document.getElementById('addShoppingItemModal');
      if (modal) {
        modal.classList.add('is-active');
        const catSelect = document.getElementById('newItemCategory');
        if (catSelect) window.syncNewItemCategoryToChapter(catSelect.value);
        const titleInput = document.getElementById('newItemTitle');
        if (titleInput) setTimeout(() => titleInput.focus(), 50);
      }
    };

    window.closeAddShoppingItemModal = function() {
      const modal = document.getElementById('addShoppingItemModal');
      if (modal) modal.classList.remove('is-active');
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeAddShoppingItemModal();
      }
    });

    window.handleAddNewShoppingItem = async function(e) {
      if (e) e.preventDefault();
      const title = document.getElementById('newItemTitle')?.value.trim();
      if (!title) return;

      const category = document.getElementById('newItemCategory')?.value || 'general';
      const chapterId = document.getElementById('newItemChapter')?.value || 'chapter_general';
      const status = document.getElementById('newItemStatus')?.value || 'Planned';
      const store = document.getElementById('newItemStore')?.value.trim() || '';
      const priceRange = document.getElementById('newItemPriceRange')?.value.trim() || '';
      const role = document.getElementById('newItemRole')?.value.trim() || 'Wedding Sourcing';
      const notes = document.getElementById('newItemNotes')?.value.trim() || '';

      const submitBtn = document.getElementById('btnSubmitNewShoppingItem');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      const newItem = {
        title,
        category,
        chapterId,
        status,
        store,
        priceRange,
        role,
        notes
      };

      try {
        if (typeof window.fsCreateShoppingItem === 'function') {
          const created = await window.fsCreateShoppingItem(newItem);
          showToast(`Item "${title}" (${created.id}) saved to Firestore!`, '🎉');
        } else {
          const nextNum = 900 + localAdhocItems.length + 1;
          const fallbackItem = {
            id: `TRS-${nextNum}`,
            code: `AD-${nextNum}`,
            ...newItem
          };
          localAdhocItems.push(fallbackItem);
          localStorage.setItem('sk_shopping_adhoc_items_v1', JSON.stringify(localAdhocItems));
          showToast(`Item "${title}" (${fallbackItem.id}) saved locally!`, '💾');
        }
      } catch (err) {
        console.warn('Error creating shopping item:', err);
        const nextNum = 900 + localAdhocItems.length + 1;
        const fallbackItem = {
          id: `TRS-${nextNum}`,
          code: `AD-${nextNum}`,
          ...newItem
        };
        localAdhocItems.push(fallbackItem);
        localStorage.setItem('sk_shopping_adhoc_items_v1', JSON.stringify(localAdhocItems));
        showToast(`Saved locally: "${title}"`, '💾');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '💾 Save to Firestore';
        }
        document.getElementById('addShoppingItemForm')?.reset();
        window.closeAddShoppingItemModal();
        window.renderShoppingTable();
      }
    };

    window.updateTableItemStatus = function(itemId, newStatus) {
      if (!firestoreShoppingCache[itemId]) firestoreShoppingCache[itemId] = {};
      firestoreShoppingCache[itemId].status = newStatus;

      const adhoc = localAdhocItems.find(i => i.id === itemId);
      if (adhoc) {
        adhoc.status = newStatus;
        localStorage.setItem('sk_shopping_adhoc_items_v1', JSON.stringify(localAdhocItems));
      }

      if (typeof window.fsSetShoppingItemStatus === 'function') {
        window.fsSetShoppingItemStatus(itemId, { status: newStatus }).catch(err => {
          console.warn('Firestore status update error:', err);
        });
      }
      updateTableHudStats();
      updateFilterPillCounts(getAllShoppingItemsMerged());
      showToast(`${itemId} status: ${newStatus.replace('_', ' ')}`, '✓');
    };

    window.updateTableItemPrice = function(itemId, val) {
      const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
      if (!firestoreShoppingCache[itemId]) firestoreShoppingCache[itemId] = {};
      firestoreShoppingCache[itemId].actualPrice = num;

      const adhoc = localAdhocItems.find(i => i.id === itemId);
      if (adhoc) {
        adhoc.actualPrice = num;
        localStorage.setItem('sk_shopping_adhoc_items_v1', JSON.stringify(localAdhocItems));
      }

      if (typeof window.fsSetShoppingItemStatus === 'function') {
        window.fsSetShoppingItemStatus(itemId, { actualPrice: num }).catch(err => {
          console.warn('Firestore price update error:', err);
        });
      }
      updateTableHudStats();
      showToast(`${itemId} price: ₹${num.toLocaleString('en-IN')}`, '💰');
    };

    window.updateTableItemNotes = function(itemId, val) {
      if (!firestoreShoppingCache[itemId]) firestoreShoppingCache[itemId] = {};
      firestoreShoppingCache[itemId].notes = val;

      const adhoc = localAdhocItems.find(i => i.id === itemId);
      if (adhoc) {
        adhoc.notes = val;
        localStorage.setItem('sk_shopping_adhoc_items_v1', JSON.stringify(localAdhocItems));
      }

      if (typeof window.fsSetShoppingItemStatus === 'function') {
        window.fsSetShoppingItemStatus(itemId, { notes: val }).catch(err => {
          console.warn('Firestore notes update error:', err);
        });
      }
      showToast(`${itemId} notes saved`, '📝');
    };

    function getAllShoppingItemsMerged() {
      const baseItems = (data && data.items) ? [...data.items] : [];
      const itemMap = new Map();
      baseItems.forEach(i => itemMap.set(i.id, { ...i }));

      localAdhocItems.forEach(i => {
        itemMap.set(i.id, { ...i });
      });

      Object.keys(firestoreShoppingCache).forEach(k => {
        const fItem = firestoreShoppingCache[k];
        if (fItem && fItem.title && !itemMap.has(k)) {
          itemMap.set(k, {
            id: k,
            code: fItem.code || k.replace('TRS-', 'AD-'),
            title: fItem.title,
            category: fItem.category || 'general',
            chapterId: fItem.chapterId || 'chapter_general',
            role: fItem.role || 'Wedding Sourcing',
            store: fItem.store || '',
            priceRange: fItem.priceRange || '',
            status: fItem.status || 'Planned',
            actualPrice: fItem.actualPrice || '',
            notes: fItem.notes || ''
          });
        }
      });

      return Array.from(itemMap.values());
    }

    function updateTableHudStats() {
      const all = getAllShoppingItemsMerged();
      const hudTotal = document.getElementById('tableHudTotal');
      const hudPurchased = document.getElementById('tableHudPurchased');
      const hudSpent = document.getElementById('tableHudTotalSpent');

      let purchasedCount = 0;
      let totalSpent = 0;

      all.forEach(item => {
        const ov = firestoreShoppingCache[item.id] || {};
        const st = ov.status || item.status || 'Planned';
        const pr = ov.actualPrice !== undefined ? Number(ov.actualPrice) : (Number(item.actualPrice) || 0);

        if (st === 'Purchased') {
          purchasedCount++;
        }
        if (!isNaN(pr) && pr > 0) {
          totalSpent += pr;
        }
      });

      if (hudTotal) hudTotal.textContent = all.length;
      if (hudPurchased) hudPurchased.textContent = `${purchasedCount} / ${all.length}`;
      if (hudSpent) hudSpent.textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    }

    function updateFilterPillCounts(allItems) {
      const catCounts = { all: allItems.length, bridal: 0, groom: 0, jewellery: 0, sara: 0, engagement: 0 };
      const statCounts = { all: allItems.length, Planned: 0, Shortlisted: 0, In_Trial: 0, Ordered: 0, Purchased: 0 };

      allItems.forEach(i => {
        const ov = firestoreShoppingCache[i.id] || {};
        const st = ov.status || i.status || 'Planned';
        const cat = i.category || 'general';

        if (catCounts[cat] !== undefined) catCounts[cat]++;
        if (statCounts[st] !== undefined) statCounts[st]++;
      });

      const setBadge = (id, count) => {
        const el = document.getElementById(id);
        if (el) el.textContent = count !== undefined ? count : '0';
      };

      setBadge('catCountAll', catCounts.all);
      setBadge('catCountBridal', catCounts.bridal);
      setBadge('catCountGroom', catCounts.groom);
      setBadge('catCountJewellery', catCounts.jewellery);
      setBadge('catCountSara', catCounts.sara);
      setBadge('catCountEngagement', catCounts.engagement);

      setBadge('statCountAll', statCounts.all);
      setBadge('statCountPlanned', statCounts.Planned);
      setBadge('statCountShortlisted', statCounts.Shortlisted);
      setBadge('statCountInTrial', statCounts.In_Trial);
      setBadge('statCountOrdered', statCounts.Ordered);
      setBadge('statCountPurchased', statCounts.Purchased);
    }

    function sortItems(itemsList, key, order) {
      if (key === 'default') return itemsList;
      const dir = order === 'desc' ? -1 : 1;
      return [...itemsList].sort((a, b) => {
        const ovA = firestoreShoppingCache[a.id] || {};
        const ovB = firestoreShoppingCache[b.id] || {};

        if (key === 'title') {
          return dir * (a.title || '').localeCompare(b.title || '');
        }
        if (key === 'category') {
          return dir * (a.category || '').localeCompare(b.category || '');
        }
        if (key === 'role') {
          return dir * (a.role || '').localeCompare(b.role || '');
        }
        if (key === 'store') {
          const storeA = ovA.actualStore || ovA.store || a.store || '';
          const storeB = ovB.actualStore || ovB.store || b.store || '';
          return dir * storeA.localeCompare(storeB);
        }
        if (key === 'budget') {
          const parseMinBudget = (str) => {
            if (!str) return 0;
            const nums = str.match(/\d+/g);
            return nums && nums.length > 0 ? parseInt(nums.join(''), 10) : 0;
          };
          return dir * (parseMinBudget(a.priceRange) - parseMinBudget(b.priceRange));
        }
        if (key === 'status') {
          const statusOrder = { 'Planned': 1, 'Shortlisted': 2, 'In_Trial': 3, 'Ordered': 4, 'Purchased': 5, 'Dropped': 6 };
          const stA = ovA.status || a.status || 'Planned';
          const stB = ovB.status || b.status || 'Planned';
          return dir * ((statusOrder[stA] || 99) - (statusOrder[stB] || 99));
        }
        if (key === 'actualPrice') {
          const prA = ovA.actualPrice !== undefined ? Number(ovA.actualPrice) : (Number(a.actualPrice) || 0);
          const prB = ovB.actualPrice !== undefined ? Number(ovB.actualPrice) : (Number(b.actualPrice) || 0);
          if (prA <= 0 && prB <= 0) return 0;
          if (prA <= 0) return 1;
          if (prB <= 0) return -1;
          return dir * (prA - prB);
        }
        return 0;
      });
    }

    function getChapterBadgeHtml(chapterId) {
      if (!chapterId) return '';
      const ch = chapters.find(c => c.id === chapterId);
      if (ch) {
        const shortTitle = ch.title.split('&')[0].trim();
        return `<span class="item-chapter-badge">${ch.icon || '📁'} Ch ${ch.number}: ${shortTitle}</span>`;
      }
      if (chapterId === 'chapter_general') {
        return `<span class="item-chapter-badge">✨ General</span>`;
      }
      return '';
    }

    function renderRowHtml(item, groupId = '', isCollapsed = false) {
      const ov = firestoreShoppingCache[item.id] || {};
      const curStatus = ov.status || item.status || 'Planned';
      const curPrice = ov.actualPrice !== undefined ? ov.actualPrice : (item.actualPrice || '');
      const curNotes = ov.notes !== undefined ? ov.notes : (item.notes || '');
      const plannedStore = item.store || '';
      const actualStore = ov.actualStore || '';
      const displayStore = actualStore || plannedStore || 'TBD';

      const statusClass = 'status-' + curStatus.toLowerCase();
      const escTitle = (item.title || '').replace(/"/g, '&quot;');
      const escStore = displayStore.replace(/"/g, '&quot;');
      const storePlannedDiff = (actualStore && plannedStore && actualStore !== plannedStore)
        ? `<span class="planned-store-tag">Planned: ${plannedStore.replace(/"/g, '&quot;')}</span>`
        : '';

      const updatedBy = ov.updatedBy ? ov.updatedBy.split('@')[0] : '';
      const attrHtml = updatedBy ? `<div class="row-attribution">Updated by ${updatedBy}</div>` : '';
      const chapterBadge = (tableState.groupBy !== 'chapter') ? getChapterBadgeHtml(item.chapterId) : '';
      const displayStyle = isCollapsed ? 'style="display: none;"' : '';

      return `
        <tr data-item-id="${item.id}" data-group-id="${groupId}" ${displayStyle}>
          <td class="sticky-col" data-col-label="Item Title &amp; Code">
            <div class="item-title-cell">
              <span class="item-code-badge">${item.id}</span>
              <span class="item-name-text">${escTitle}</span>
              ${attrHtml}
            </div>
          </td>
          <td data-col-label="Category">
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span class="item-cat-badge" style="text-transform: capitalize; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); width: fit-content;">${item.category}</span>
              ${chapterBadge}
            </div>
          </td>
          <td data-col-label="Liturgical Role" style="font-size: 0.8rem; color: var(--text-muted);">${item.role || '—'}</td>
          <td data-col-label="Store / Sourcing" style="font-size: 0.82rem; font-weight: 500;">
            ${escStore}
            ${storePlannedDiff}
          </td>
          <td data-col-label="Est. Budget" class="table-budget-cell" style="font-size: 0.82rem; color: var(--gold-bright); font-weight: 600;">${item.priceRange || '—'}</td>
          <td data-col-label="Live Status">
            <select class="status-dropdown ${statusClass}" data-item-id="${item.id}" data-field="status" onchange="this.className='status-dropdown status-'+this.value.toLowerCase(); window.updateTableItemStatus('${item.id}', this.value)">
              <option value="Planned" ${curStatus === 'Planned' ? 'selected' : ''}>⏳ Planned</option>
              <option value="Shortlisted" ${curStatus === 'Shortlisted' ? 'selected' : ''}>⭐ Shortlisted</option>
              <option value="In_Trial" ${curStatus === 'In_Trial' ? 'selected' : ''}>👗 In Trial</option>
              <option value="Ordered" ${curStatus === 'Ordered' ? 'selected' : ''}>📦 Ordered</option>
              <option value="Purchased" ${curStatus === 'Purchased' ? 'selected' : ''}>✅ Purchased</option>
              <option value="Dropped" ${curStatus === 'Dropped' ? 'selected' : ''}>❌ Dropped</option>
            </select>
          </td>
          <td data-col-label="Actual Price (₹)">
            <input type="text" class="table-price-input" data-item-id="${item.id}" data-field="price" placeholder="₹ actual" value="${curPrice}" onblur="window.updateTableItemPrice('${item.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
          </td>
          <td data-col-label="Notes / Tailoring">
            <input type="text" class="table-notes-input" data-item-id="${item.id}" data-field="notes" placeholder="Add note/spec..." value="${(curNotes || '').replace(/"/g, '&quot;')}" onblur="window.updateTableItemNotes('${item.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
          </td>
          <td data-col-label="Actions" style="text-align: center;">
            <div class="cell-actions">
              <button type="button" class="cell-action-btn" title="Visual AI Search" onclick="window.openVisualSearchByItemId('${item.id}')">🔍</button>
              <button type="button" class="cell-action-btn" title="Share via WhatsApp" onclick="window.shareTableItemById('${item.id}')">📱</button>
            </div>
          </td>
        </tr>
      `;
    }

    function calculateGroupSubtotals(groupItems) {
      let purchasedCount = 0;
      let totalSpent = 0;
      groupItems.forEach(item => {
        const ov = firestoreShoppingCache[item.id] || {};
        const st = ov.status || item.status || 'Planned';
        const pr = ov.actualPrice !== undefined ? Number(ov.actualPrice) : (Number(item.actualPrice) || 0);
        if (st === 'Purchased') purchasedCount++;
        if (!isNaN(pr) && pr > 0) totalSpent += pr;
      });
      return { total: groupItems.length, purchased: purchasedCount, spent: totalSpent };
    }

    window.renderShoppingTable = function() {
      const tbody = document.getElementById('shoppingTableBody');
      if (!tbody) return;

      const all = getAllShoppingItemsMerged();
      updateTableHudStats();
      updateFilterPillCounts(all);
      updateSortHeaderUI();
      updateResetButtonVisibility();

      // Filter step
      const filtered = all.filter(item => {
        const ov = firestoreShoppingCache[item.id] || {};
        const curStatus = ov.status || item.status || 'Planned';

        if (tableState.category !== 'all' && item.category !== tableState.category) {
          return false;
        }
        if (tableState.status !== 'all' && curStatus !== tableState.status) {
          return false;
        }
        if (tableState.query) {
          const matchTitle = (item.title || '').toLowerCase().includes(tableState.query);
          const matchCode = (item.id || '').toLowerCase().includes(tableState.query) || (item.code || '').toLowerCase().includes(tableState.query);
          const matchStore = (item.store || '').toLowerCase().includes(tableState.query) || (ov.actualStore || '').toLowerCase().includes(tableState.query);
          const matchRole = (item.role || '').toLowerCase().includes(tableState.query);
          const matchSpec = (item.spec || '').toLowerCase().includes(tableState.query);
          return matchTitle || matchCode || matchStore || matchRole || matchSpec;
        }
        return true;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 36px; color: var(--text-muted);"><div style="font-size: 1.1rem; margin-bottom: 8px;">🔍 No items found matching active filters</div><button type="button" class="shop-btn" onclick="window.resetTableFilters()">Reset All Filters</button></td></tr>`;
        return;
      }

      // Active Focus Preservation (P-DOM-RECONCILE-001)
      const activeEl = document.activeElement;
      const activeItemId = activeEl ? activeEl.getAttribute('data-item-id') : null;
      const activeField = activeEl ? activeEl.getAttribute('data-field') : null;
      const selStart = (activeEl && activeEl.selectionStart !== undefined) ? activeEl.selectionStart : null;
      const selEnd = (activeEl && activeEl.selectionEnd !== undefined) ? activeEl.selectionEnd : null;

      let html = '';

      if (tableState.groupBy === 'chapter') {
        // Group by liturgical chapter
        const chapterMap = new Map();
        chapters.forEach(c => chapterMap.set(c.id, { meta: c, items: [] }));
        const unassigned = [];

        filtered.forEach(item => {
          if (item.chapterId && chapterMap.has(item.chapterId)) {
            chapterMap.get(item.chapterId).items.push(item);
          } else {
            unassigned.push(item);
          }
        });

        chapterMap.forEach((grp, chId) => {
          if (grp.items.length > 0) {
            const sorted = sortItems(grp.items, tableState.sortKey, tableState.sortOrder);
            const sub = calculateGroupSubtotals(sorted);
            const isCollapsed = tableState.collapsedGroups.has(chId);
            const arrowGlyph = isCollapsed ? '▶' : '▼';
            html += `
              <tr class="table-group-header-row clickable ${isCollapsed ? 'collapsed' : ''}"
                  data-group-header-id="${chId}"
                  role="button"
                  tabindex="0"
                  aria-expanded="${!isCollapsed}"
                  onclick="window.toggleTableGroup('${chId}')"
                  onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); window.toggleTableGroup('${chId}'); }">
                <td colspan="9">
                  <div class="table-group-header-content">
                    <span class="table-group-title">
                      <span class="accordion-arrow">${arrowGlyph}</span>
                      ${grp.meta.icon || '📁'} ${grp.meta.title}
                    </span>
                    <div class="table-group-subtotal">
                      <span class="group-subtotal-badge">Items: <strong>${sub.total}</strong></span>
                      <span class="group-subtotal-badge">Purchased: <strong>${sub.purchased}</strong></span>
                      <span class="group-subtotal-badge">Spent: <strong style="color: var(--shop-emerald);">₹${sub.spent.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                </td>
              </tr>
            `;
            sorted.forEach(item => { html += renderRowHtml(item, chId, isCollapsed); });
          }
        });

        if (unassigned.length > 0) {
          const chId = 'chapter_general';
          const sorted = sortItems(unassigned, tableState.sortKey, tableState.sortOrder);
          const sub = calculateGroupSubtotals(sorted);
          const isCollapsed = tableState.collapsedGroups.has(chId);
          const arrowGlyph = isCollapsed ? '▶' : '▼';
          html += `
            <tr class="table-group-header-row clickable ${isCollapsed ? 'collapsed' : ''}"
                data-group-header-id="${chId}"
                role="button"
                tabindex="0"
                aria-expanded="${!isCollapsed}"
                onclick="window.toggleTableGroup('${chId}')"
                onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); window.toggleTableGroup('${chId}'); }">
              <td colspan="9">
                <div class="table-group-header-content">
                  <span class="table-group-title">
                    <span class="accordion-arrow">${arrowGlyph}</span>
                    ✨ Additional &amp; Ad-Hoc Items
                  </span>
                  <div class="table-group-subtotal">
                    <span class="group-subtotal-badge">Items: <strong>${sub.total}</strong></span>
                    <span class="group-subtotal-badge">Purchased: <strong>${sub.purchased}</strong></span>
                    <span class="group-subtotal-badge">Spent: <strong style="color: var(--shop-emerald);">₹${sub.spent.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              </td>
            </tr>
          `;
          sorted.forEach(item => { html += renderRowHtml(item, chId, isCollapsed); });
        }
      } else if (tableState.groupBy === 'store') {
        // Group by Store (P-SHOPPING-HARDEN-001: actualStore || store)
        const storeMap = new Map();
        filtered.forEach(item => {
          const ov = firestoreShoppingCache[item.id] || {};
          const stName = ov.actualStore || ov.store || item.store || 'Unassigned Store';
          if (!storeMap.has(stName)) storeMap.set(stName, []);
          storeMap.get(stName).push(item);
        });

        Array.from(storeMap.keys()).sort().forEach(stName => {
          const grpItems = storeMap.get(stName);
          const sorted = sortItems(grpItems, tableState.sortKey, tableState.sortOrder);
          const sub = calculateGroupSubtotals(sorted);
          const stId = 'store_' + stName.replace(/[^a-zA-Z0-9_-]/g, '_');
          const isCollapsed = tableState.collapsedGroups.has(stId);
          const arrowGlyph = isCollapsed ? '▶' : '▼';
          html += `
            <tr class="table-group-header-row clickable ${isCollapsed ? 'collapsed' : ''}"
                data-group-header-id="${stId}"
                role="button"
                tabindex="0"
                aria-expanded="${!isCollapsed}"
                onclick="window.toggleTableGroup('${stId}')"
                onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); window.toggleTableGroup('${stId}'); }">
              <td colspan="9">
                <div class="table-group-header-content">
                  <span class="table-group-title">
                    <span class="accordion-arrow">${arrowGlyph}</span>
                    🏬 ${stName}
                  </span>
                  <div class="table-group-subtotal">
                    <span class="group-subtotal-badge">Items: <strong>${sub.total}</strong></span>
                    <span class="group-subtotal-badge">Purchased: <strong>${sub.purchased}</strong></span>
                    <span class="group-subtotal-badge">Spent: <strong style="color: var(--shop-emerald);">₹${sub.spent.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              </td>
            </tr>
          `;
          sorted.forEach(item => { html += renderRowHtml(item, stId, isCollapsed); });
        });
      } else {
        // Flat List (Dual-Mode Context Preservation: Chapter Badges shown)
        const sorted = sortItems(filtered, tableState.sortKey, tableState.sortOrder);
        sorted.forEach(item => { html += renderRowHtml(item, '', false); });
      }

      tbody.innerHTML = html;

      updateToggleAllButtonText();
      const masterToggleBtn = document.getElementById('btnToggleAllAccordions');
      if (masterToggleBtn) {
        masterToggleBtn.style.display = (tableState.groupBy === 'none') ? 'none' : 'inline-flex';
      }

      // Restore Focus and Cursor Caret Position
      if (activeItemId && activeField) {
        const newEl = tbody.querySelector(`[data-item-id="${activeItemId}"][data-field="${activeField}"]`);
        if (newEl) {
          newEl.focus();
          if (selStart !== null && selEnd !== null && typeof newEl.setSelectionRange === 'function') {
            newEl.setSelectionRange(selStart, selEnd);
          }
        }
      }
    };

    window.openVisualSearchByItemId = function(itemId) {
      const all = getAllShoppingItemsMerged();
      const found = all.find(i => i.id === itemId);
      if (found) {
        window.openVisualSearch(found.title);
      }
    };

    window.shareTableItemById = function(itemId) {
      const all = getAllShoppingItemsMerged();
      const found = all.find(i => i.id === itemId);
      if (!found) return;

      const ov = firestoreShoppingCache[itemId] || {};
      const status = (ov.status || found.status || 'Planned').replace('_', ' ');
      const price = ov.actualPrice ? `₹${Number(ov.actualPrice).toLocaleString('en-IN')}` : (found.priceRange || 'TBD');
      const shareUrl = (typeof SKPrimitives !== 'undefined' && SKPrimitives.getStakeholderUrl)
        ? SKPrimitives.getStakeholderUrl('shopping-registry.html', { view: 'table', cat: found.category })
        : `${window.location.origin}/shopping-registry.html?view=table&cat=${found.category}`;

      const text = `🛍️ *Sree Krushna Marriage OS — Shopping Item*\nItem: *${found.title}* (${itemId})\nCategory: *${found.category}*\nStatus: *${status}*\nPrice/Budget: *${price}*\n👉 Live Shopping Table: ${shareUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Item link copied for WhatsApp!`, '📱');
        });
      } else {
        prompt('Copy WhatsApp Message:', text);
      }
    };

    window.exportShoppingTable = function(format) {
      const all = getAllShoppingItemsMerged();
      if (format === 'jsonl') {
        const lines = all.map(i => {
          const ov = firestoreShoppingCache[i.id] || {};
          return JSON.stringify({
            ...i,
            status: ov.status || i.status || 'Planned',
            actualPrice: ov.actualPrice !== undefined ? ov.actualPrice : (i.actualPrice || ''),
            actualStore: ov.actualStore || ov.store || i.store || '',
            notes: ov.notes || i.notes || '',
            updatedBy: ov.updatedBy || '',
            updatedAt: ov.updatedAt || ''
          });
        });
        const blob = new Blob([lines.join('\n') + '\n'], { type: 'application/x-ndjson' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shopping_items_live_${new Date().toISOString().split('T')[0]}.jsonl`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported live shopping JSONL!', '📥');
      } else if (format === 'csv') {
        const escapeCsv = (str) => {
          if (str === undefined || str === null) return '""';
          return `"${String(str).replace(/"/g, '""')}"`;
        };
        const rows = [
          ['ID', 'Code', 'Title', 'Category', 'Role', 'Store', 'Est_Price', 'Status', 'Actual_Price', 'Notes', 'Updated_By'].join(',')
        ];
        all.forEach(i => {
          const ov = firestoreShoppingCache[i.id] || {};
          rows.push([
            escapeCsv(i.id),
            escapeCsv(i.code || ''),
            escapeCsv(i.title),
            escapeCsv(i.category),
            escapeCsv(i.role || ''),
            escapeCsv(ov.actualStore || ov.store || i.store || ''),
            escapeCsv(i.priceRange || ''),
            escapeCsv(ov.status || i.status || 'Planned'),
            escapeCsv(ov.actualPrice !== undefined ? ov.actualPrice : (i.actualPrice || '')),
            escapeCsv(ov.notes || i.notes || ''),
            escapeCsv(ov.updatedBy || '')
          ].join(','));
        });
        const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shopping_items_live_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported live shopping CSV!', '📊');
      }
    };

    let firestoreUnsubscribe = null;
    let syncRetryTimer = null;

    function initFirestoreShoppingSync(retries = 25) {
      if (typeof window.fsListenShoppingItems === 'function') {
        const syncPill = document.getElementById('tableHudSyncStatus');
        const syncText = document.getElementById('tableSyncText');

        if (firestoreUnsubscribe) {
          try { firestoreUnsubscribe(); } catch(e) {}
          firestoreUnsubscribe = null;
        }

        if (syncText && (!firestoreShoppingCache || Object.keys(firestoreShoppingCache).length === 0)) {
          syncText.textContent = '⏳ Connecting Live Firestore...';
        }

        try {
          firestoreUnsubscribe = window.fsListenShoppingItems((itemsMap) => {
            const previousCache = firestoreShoppingCache || {};
            firestoreShoppingCache = itemsMap || {};

            // Identify remote updates from other users
            const changedRemoteItems = [];
            const userEmail = (window.currentUser && window.currentUser.email) ? window.currentUser.email : '';
            Object.keys(firestoreShoppingCache).forEach(k => {
              const current = firestoreShoppingCache[k];
              const prev = previousCache[k];
              if (current && (!prev || prev.status !== current.status || prev.actualPrice !== current.actualPrice || prev.notes !== current.notes)) {
                if (current.updatedBy && current.updatedBy !== userEmail) {
                  changedRemoteItems.push({ id: k, ...current });
                }
              }
            });

            // Trigger Throttled Toast & Pulse (P-COLLAB-CONCURRENCY-001)
            if (changedRemoteItems.length > 0) {
              changedRemoteItems.forEach(item => {
                const tr = document.querySelector(`tr[data-item-id="${item.id}"]`);
                if (tr) {
                  tr.classList.add('row-pulse');
                  setTimeout(() => tr.classList.remove('row-pulse'), 1800);
                }
              });

              pendingRemoteToastCount += changedRemoteItems.length;
              clearTimeout(remoteToastTimer);
              remoteToastTimer = setTimeout(() => {
                if (pendingRemoteToastCount === 1) {
                  const single = changedRemoteItems[0];
                  const author = single.updatedBy ? single.updatedBy.split('@')[0] : 'Collaborator';
                  showToast(`${author} updated ${single.id} (${(single.status || 'item').replace('_', ' ')})`, '🔔');
                } else if (pendingRemoteToastCount > 1) {
                  showToast(`${pendingRemoteToastCount} items updated in real-time`, '🔔');
                }
                pendingRemoteToastCount = 0;
              }, 4000);
            }

            const count = Object.keys(firestoreShoppingCache).length;
            if (syncText) syncText.textContent = `🟢 Live Sync (${count} updates)`;
            if (syncPill) {
              const dot = syncPill.querySelector('.sync-dot');
              if (dot) dot.classList.remove('offline');
            }
            if (window.currentShoppingView === 'table') {
              window.renderShoppingTable();
            }
          }, (err) => {
            console.warn('Firestore shopping listener permission/network notice:', err);
            const syncText = document.getElementById('tableSyncText');
            const syncPill = document.getElementById('tableHudSyncStatus');
            const isAuthErr = err && err.code === 'permission-denied';
            if (syncText) {
              syncText.textContent = isAuthErr ? '🟡 Local Mode (Sign-in Required)' : '🟡 Local Mode (Offline)';
              syncText.title = err ? (err.message || '') : '';
            }
            if (syncPill) {
              const dot = syncPill.querySelector('.sync-dot');
              if (dot) dot.classList.add('offline');
            }
          });
        } catch (e) {
          console.warn('Firestore shopping listener failed to initialize:', e);
          const syncText = document.getElementById('tableSyncText');
          if (syncText) syncText.textContent = '🟡 Local Mode';
        }
      } else if (retries > 0) {
        // Module firestore-client.js is still resolving async CDN imports; retry in 200ms
        clearTimeout(syncRetryTimer);
        syncRetryTimer = setTimeout(() => initFirestoreShoppingSync(retries - 1), 200);
      } else {
        const syncText = document.getElementById('tableSyncText');
        if (syncText) syncText.textContent = '🟡 Local Mode (Bridge Offline)';
        const syncPill = document.getElementById('tableHudSyncStatus');
        if (syncPill) {
          const dot = syncPill.querySelector('.sync-dot');
          if (dot) dot.classList.add('offline');
        }
      }
    }

    // Auto-reconnect when user completes Google Sign-In or switches accounts
    window.addEventListener('sk-auth-state-changed', () => {
      initFirestoreShoppingSync();
    });

    // ========================================================================
    // INTERACTIVE FAMILY SURVEY & BUDGET ENGINE (P-SURVEY-HYBRID-001)
    // ========================================================================
    const defaultSurveyState = {
      tiers: {
        'TRS-BR-01': { tier: 't2', price: 62500 },
        'TRS-OD-01': { tier: 't2', price: 21000 },
        'TRS-BR-02': { tier: 't2', price: 7750 },
        'TRS-BR-03': { tier: 't2', price: 57500 },
        'TRS-OD-04': { tier: 't1', price: 8000 },
        'SARA-MIL': { tier: 't1', price: 31500 },
        'SARA-FIL': { tier: 't1', price: 15000 },
        'TRS-OD-02': { tier: 't2', price: 11000 },
        'TRS-OD-03': { tier: 't1', price: 14000 }
      },
      tailoring: {
        'TRS-GR-03': { choice: 'bespoke', cost: 14250, savings: 27750 },
        'TRS-GR-06': { choice: 'bespoke', cost: 18000, savings: 8000 }
      },
      stakeholders: {
        'TRS-BR-01': ['bride', 'sisters'],
        'TRS-OD-01': ['bride', 'sisters', 'inlaws'],
        'TRS-BR-02': ['bride', 'inlaws'],
        'TRS-BR-03': ['bride', 'sisters'],
        'TRS-GR-03': ['bride', 'sisters', 'inlaws'],
        'TRS-OD-04': ['bride', 'inlaws']
      },
      notes: {},
      remarks: ''
    };

    let surveyState = JSON.parse(localStorage.getItem('sk_family_survey_answers_v1') || 'null') || defaultSurveyState;

    function saveSurveyState() {
      localStorage.setItem('sk_family_survey_answers_v1', JSON.stringify(surveyState));
      window.updateSurveyUI();
    }

    window.selectSurveyTier = function(itemId, tierId, price) {
      if (!surveyState.tiers) surveyState.tiers = {};
      surveyState.tiers[itemId] = { tier: tierId, price: Number(price) };
      saveSurveyState();
    };

    window.selectTailoringChoice = function(itemId, choiceId, cost, savings) {
      if (!surveyState.tailoring) surveyState.tailoring = {};
      surveyState.tailoring[itemId] = { choice: choiceId, cost: Number(cost), savings: Number(savings) };
      saveSurveyState();
    };

    window.toggleSurveyStakeholder = function(itemId, role) {
      if (!surveyState.stakeholders) surveyState.stakeholders = {};
      if (!surveyState.stakeholders[itemId]) surveyState.stakeholders[itemId] = [];
      const list = surveyState.stakeholders[itemId];
      const idx = list.indexOf(role);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push(role);
      }
      saveSurveyState();
    };

    window.saveSurveyNote = function(itemId, note) {
      if (!surveyState.notes) surveyState.notes = {};
      surveyState.notes[itemId] = note;
      localStorage.setItem('sk_family_survey_answers_v1', JSON.stringify(surveyState));
    };

    window.saveSurveyRemarks = function(remarks) {
      surveyState.remarks = remarks;
      localStorage.setItem('sk_family_survey_answers_v1', JSON.stringify(surveyState));
    };

    window.resetSurveyChoices = function() {
      surveyState = JSON.parse(JSON.stringify(defaultSurveyState));
      saveSurveyState();
      showToast('Survey selections reset to default.', '🔄');
    };

    window.updateSurveyUI = function() {
      if (!surveyState || !surveyState.tiers) return;

      // 1. Calculate category totals
      let bridalTotal = 0;
      ['TRS-BR-01', 'TRS-OD-01', 'TRS-BR-02', 'TRS-BR-03'].forEach(id => {
        if (surveyState.tiers[id]) bridalTotal += surveyState.tiers[id].price;
      });

      let groomTotal = 0;
      if (surveyState.tailoring && surveyState.tailoring['TRS-GR-03']) groomTotal += surveyState.tailoring['TRS-GR-03'].cost;
      if (surveyState.tailoring && surveyState.tailoring['TRS-GR-06']) groomTotal += surveyState.tailoring['TRS-GR-06'].cost;
      if (surveyState.tiers['TRS-OD-04']) groomTotal += surveyState.tiers['TRS-OD-04'].price;

      let saraTotal = 0;
      ['SARA-MIL', 'SARA-FIL'].forEach(id => {
        if (surveyState.tiers[id]) saraTotal += surveyState.tiers[id].price;
      });

      let heirloomsTotal = 0;
      ['TRS-OD-02', 'TRS-OD-03'].forEach(id => {
        if (surveyState.tiers[id]) heirloomsTotal += surveyState.tiers[id].price;
      });

      const grandTotal = bridalTotal + groomTotal + saraTotal + heirloomsTotal;

      let totalSavings = 0;
      Object.values(surveyState.tailoring || {}).forEach(t => {
        if (t.savings) totalSavings += t.savings;
      });

      const totalDecisions = Object.keys(surveyState.tiers || {}).length + Object.keys(surveyState.tailoring || {}).length;

      // Update Live Bar
      const elLiveTotal = document.getElementById('surveyLiveTotal');
      const elLiveSavings = document.getElementById('surveyLiveSavings');
      const elLiveProgress = document.getElementById('surveyLiveProgress');
      if (elLiveTotal) elLiveTotal.textContent = '₹' + grandTotal.toLocaleString('en-IN');
      if (elLiveSavings) elLiveSavings.textContent = '+₹' + totalSavings.toLocaleString('en-IN') + ' Saved';
      if (elLiveProgress) elLiveProgress.textContent = `${totalDecisions} Decided`;

      // Update Summary Card
      const elSummaryBridal = document.getElementById('summaryBridalTotal');
      const elSummaryGroom = document.getElementById('summaryGroomTotal');
      const elSummarySara = document.getElementById('summarySaraTotal');
      const elSummaryHeirlooms = document.getElementById('summaryHeirloomsTotal');
      const elSummaryGrand = document.getElementById('summaryGrandTotal');
      const elSummarySavings = document.getElementById('summarySavingsTotal');
      if (elSummaryBridal) elSummaryBridal.textContent = '₹' + bridalTotal.toLocaleString('en-IN');
      if (elSummaryGroom) elSummaryGroom.textContent = '₹' + groomTotal.toLocaleString('en-IN');
      if (elSummarySara) elSummarySara.textContent = '₹' + saraTotal.toLocaleString('en-IN');
      if (elSummaryHeirlooms) elSummaryHeirlooms.textContent = '₹' + heirloomsTotal.toLocaleString('en-IN');
      if (elSummaryGrand) elSummaryGrand.textContent = '₹' + grandTotal.toLocaleString('en-IN');
      if (elSummarySavings) elSummarySavings.textContent = '+₹' + totalSavings.toLocaleString('en-IN');

      const elRemarks = document.getElementById('surveyFamilyRemarks');
      if (elRemarks && surveyState.remarks) elRemarks.value = surveyState.remarks;

      // Update visual tier cards
      document.querySelectorAll('.survey-tier-card').forEach(card => {
        const itemId = card.getAttribute('data-item');
        const tierId = card.getAttribute('data-tier');
        const isSelected = (surveyState.tiers[itemId] && surveyState.tiers[itemId].tier === tierId);
        card.classList.toggle('selected', isSelected);
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = isSelected;
      });

      // Update tailoring cards
      document.querySelectorAll('.survey-tailor-card').forEach(card => {
        const itemId = card.getAttribute('data-item');
        const choiceId = card.getAttribute('data-choice');
        const isSelected = (surveyState.tailoring && surveyState.tailoring[itemId] && surveyState.tailoring[itemId].choice === choiceId);
        card.classList.toggle('selected', isSelected);
      });

      // Update stakeholder approval buttons
      document.querySelectorAll('.survey-stakeholder-btn').forEach(btn => {
        const row = btn.closest('.survey-item-row');
        if (!row) return;
        const itemId = row.id.replace('srow-', '');
        const roleMatch = btn.textContent.toLowerCase();
        let role = 'bride';
        if (roleMatch.includes('sister')) role = 'sisters';
        if (roleMatch.includes('in-law') || roleMatch.includes('inlaws')) role = 'inlaws';
        const isApproved = (surveyState.stakeholders && surveyState.stakeholders[itemId] && surveyState.stakeholders[itemId].includes(role));
        btn.classList.toggle('approved', !!isApproved);
      });

      // Update notes
      Object.entries(surveyState.notes || {}).forEach(([itemId, note]) => {
        const row = document.getElementById('srow-' + itemId);
        if (row) {
          const input = row.querySelector('.survey-note-input');
          if (input && document.activeElement !== input) input.value = note;
        }
      });
    };

    window.printFamilySurvey = function() {
      // Dynamic Print Synchronization: sync computed survey totals into print view
      const printDossier = document.getElementById('familySurveyDossierPrintView');
      if (printDossier && surveyState) {
        let bridalTotal = 0;
        ['TRS-BR-01', 'TRS-OD-01', 'TRS-BR-02', 'TRS-BR-03'].forEach(id => {
          if (surveyState.tiers[id]) bridalTotal += surveyState.tiers[id].price;
        });
        let groomTotal = 0;
        if (surveyState.tailoring && surveyState.tailoring['TRS-GR-03']) groomTotal += surveyState.tailoring['TRS-GR-03'].cost;
        if (surveyState.tailoring && surveyState.tailoring['TRS-GR-06']) groomTotal += surveyState.tailoring['TRS-GR-06'].cost;
        if (surveyState.tiers['TRS-OD-04']) groomTotal += surveyState.tiers['TRS-OD-04'].price;
        let saraTotal = 0;
        ['SARA-MIL', 'SARA-FIL'].forEach(id => {
          if (surveyState.tiers[id]) saraTotal += surveyState.tiers[id].price;
        });
        let heirloomsTotal = 0;
        ['TRS-OD-02', 'TRS-OD-03'].forEach(id => {
          if (surveyState.tiers[id]) heirloomsTotal += surveyState.tiers[id].price;
        });
        const grandTotal = bridalTotal + groomTotal + saraTotal + heirloomsTotal;

        const tallyGrid = printDossier.querySelector('.survey-tally-grid');
        if (tallyGrid) {
          tallyGrid.innerHTML = `
            <div>1. Bridal Wardrobe Total: <strong>₹${bridalTotal.toLocaleString('en-IN')}</strong></div>
            <div>2. Groom Wardrobe Total: <strong>₹${groomTotal.toLocaleString('en-IN')}</strong></div>
            <div>3. In-Laws 'Sara' Total: <strong>₹${saraTotal.toLocaleString('en-IN')}</strong></div>
            <div>4. Silverware &amp; Heirlooms: <strong>₹${heirloomsTotal.toLocaleString('en-IN')}</strong></div>
          `;
        }
        const ceilingEl = printDossier.querySelector('.survey-signoff-box strong:last-of-type');
        if (ceilingEl) {
          ceilingEl.textContent = '₹' + grandTotal.toLocaleString('en-IN');
        }
      }

      document.body.setAttribute('data-print-target', 'survey');
      window.print();
      window.addEventListener('afterprint', () => {
        document.body.removeAttribute('data-print-target');
      }, { once: true });
      setTimeout(() => {
        document.body.removeAttribute('data-print-target');
      }, 2500);
    };

    const btnPrintFamilySurvey = document.getElementById('btnPrintFamilySurvey');
    if (btnPrintFamilySurvey) {
      btnPrintFamilySurvey.addEventListener('click', window.printFamilySurvey);
    }

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

    // Initialize & Re-render API
    function renderShoppingRegistry() {
      updateKpis();
      renderChapters();
      renderClusters();
      renderStores();
      renderItems();
      if (typeof window.updateSurveyUI === 'function') {
        window.updateSurveyUI();
      }
    }
    window.renderShoppingRegistry = renderShoppingRegistry;
    window.copyStakeholderShare = function(key) {
      if (typeof SKPrimitives !== 'undefined' && SKPrimitives.copyStakeholderShare) {
        SKPrimitives.copyStakeholderShare(key);
      } else {
        console.warn('SKPrimitives not available for copyStakeholderShare:', key);
      }
    };
    window.openStandalonePortal = function(portalFile) {
      const url = (typeof SKPrimitives !== 'undefined' && SKPrimitives.getStakeholderUrl)
        ? SKPrimitives.getStakeholderUrl(portalFile)
        : `${window.location.origin}/${portalFile}`;
      window.open(url, '_blank');
    };

    parseUrlParams();
    renderShoppingRegistry();
    initFirestoreShoppingSync();
  })();
  /* SSOT: docs/incidents/INC-092-dynamic-module-timing-race-and-unauthenticated-local-fallback.md — INC-092 */