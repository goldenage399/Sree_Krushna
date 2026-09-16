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
      const tabSurvey = document.getElementById('tabSurveyView');
      const catalogSection = document.getElementById('catalogViewSection');
      const surveyStudio = document.getElementById('interactiveSurveyStudio');

      if (viewMode === 'survey') {
        if (tabCatalog) tabCatalog.classList.remove('active');
        if (tabSurvey) tabSurvey.classList.add('active');
        if (catalogSection) catalogSection.style.display = 'none';
        if (surveyStudio) surveyStudio.style.display = 'flex';
        window.updateSurveyUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (tabCatalog) tabCatalog.classList.add('active');
        if (tabSurvey) tabSurvey.classList.remove('active');
        if (catalogSection) catalogSection.style.display = 'block';
        if (surveyStudio) surveyStudio.style.display = 'none';
      }
    };

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
  })();