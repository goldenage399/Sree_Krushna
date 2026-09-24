/**
 * SSOT: User_Created/Discussion Threads/Council/260924_arch_council_pinterest_intake_and_collaborative_visual_sharing.md § "Council Decision AC-DEC-2026-035"
 * Standard: P-COLLAB-VISUAL-INTAKE-001 / INC-094
 * Description: Shopping Registry Controller with Tri-Modal Visual Ingestion, Multi-Image Option Pods, and Deep-Link Sharing.
 */
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
    let itemOptionSelected = JSON.parse(localStorage.getItem('sk_shopping_item_options') || '{}');
    let itemCustomOptions = JSON.parse(localStorage.getItem('sk_shopping_custom_options') || '{}');
    let catalogViewMode = localStorage.getItem('sk_shopping_catalog_view') || 'thumbnails';
    let activeStoreCategory = 'all';
    window.catalogSubView = 'items';

    // Candidate Look 30-Day Archival Retention Constant (AC-DEC-2026-040)
    const ARCHIVE_RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

    // Host Identity & RBAC Gate (AC-DEC-2026-040 / SK-007)
    function isHostUser() {
      const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
      if (isLocal) return true;
      const user = window.currentUser;
      if (!user) return false;
      const email = (user.email || '').toLowerCase().trim();
      if (email === 'goldenage399@gmail.com' || email === 'krushna.s.panda@gmail.com') return true;
      if (user.role === 'host' || user.role === 'groom' || user.designation === 'super_admin' || user.isOwner === true) return true;
      return false;
    }
    window.isHostUser = isHostUser;

    // Automatic Sanitizer: Filter out corrupted/invalid Pinterest URLs (P-COLLAB-VISUAL-INTAKE-001)
    function sanitizeCustomOptions() {
      let dirty = false;
      Object.keys(itemCustomOptions).forEach(k => {
        if (Array.isArray(itemCustomOptions[k])) {
          const origLen = itemCustomOptions[k].length;
          itemCustomOptions[k] = itemCustomOptions[k].filter(opt => {
            if (!opt || !opt.src) return false;
            if (/pin\.it|pinterest(\.[a-z]{2,3})+\/pin\//i.test(opt.src) && !opt.src.includes('pinimg.com')) {
              return false;
            }
            return true;
          });
          if (itemCustomOptions[k].length !== origLen) dirty = true;
        }
      });
      if (dirty) {
        localStorage.setItem('sk_shopping_custom_options', JSON.stringify(itemCustomOptions));
        localStorage.setItem('sk_shopping_item_options', JSON.stringify(itemOptionSelected));
      }
    }
    sanitizeCustomOptions();

    window.clearItemCustomOptions = function(itemId) {
      if (!itemId) return;
      if (!isHostUser()) {
        showToast('Only the Host can clear looks.', '🔒');
        return;
      }
      let changed = false;
      if (itemCustomOptions[itemId]) {
        delete itemCustomOptions[itemId];
        changed = true;
      }
      if (itemOptionSelected[itemId]) {
        delete itemOptionSelected[itemId];
        changed = true;
      }
      if (changed) {
        localStorage.setItem('sk_shopping_custom_options', JSON.stringify(itemCustomOptions));
        localStorage.setItem('sk_shopping_item_options', JSON.stringify(itemOptionSelected));
        if (typeof window.fsSetShoppingItemStatus === 'function') {
          window.fsSetShoppingItemStatus(itemId, { options: [], selectedOptionIndex: 0 })
            .catch(err => console.warn('Firestore options clear skipped:', err));
        }
        renderItems();
        showToast(`Candidate looks cleared for ${itemId}.`, '🧹');
      }
    };

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
      localStorage.setItem('sk_shopping_custom_options', JSON.stringify(itemCustomOptions));
      updateKpis();
    }

    function getArchivedItemOptions(itemId) {
      if (!itemId) return [];
      const fsItem = firestoreShoppingCache ? firestoreShoppingCache[itemId] : null;
      const fsOptions = (fsItem && Array.isArray(fsItem.options)) ? fsItem.options : null;
      const localOpts = Array.isArray(itemCustomOptions[itemId]) ? itemCustomOptions[itemId] : [];
      const customOpts = (fsOptions && fsOptions.length > 0) ? fsOptions : localOpts;
      const now = Date.now();
      return customOpts.filter(opt => {
        if (!opt || !opt.isArchived) return false;
        const archTime = opt.archivedAt ? new Date(opt.archivedAt).getTime() : now;
        return (now - archTime) < ARCHIVE_RETENTION_MS;
      });
    }
    window.getArchivedItemOptions = getArchivedItemOptions;

    function getItemImages(item) {
      if (!item) return [];
      const baseImages = Array.isArray(item.images) ? [...item.images] : [];
      const fsItem = firestoreShoppingCache ? firestoreShoppingCache[item.id] : null;
      const fsOptions = (fsItem && Array.isArray(fsItem.options)) ? fsItem.options : null;
      const localOpts = Array.isArray(itemCustomOptions[item.id]) ? itemCustomOptions[item.id] : [];
      const customOpts = (fsOptions && fsOptions.length > 0) ? fsOptions : localOpts;

      const allImages = [...baseImages];
      customOpts.forEach(opt => {
        if (!opt || opt.isArchived) return; // Active Query Guard: filter out archived looks (AC-DEC-2026-040)
        if (!allImages.some(img => img.optionIndex === opt.optionIndex)) {
          allImages.push(opt);
        }
      });
      return allImages;
    }

    function getActiveOptionIndex(itemId) {
      const item = items.find(i => i.id === itemId);
      const availableImgs = getItemImages(item);
      const fsItem = firestoreShoppingCache ? firestoreShoppingCache[itemId] : null;
      let candidateIdx = 0;
      if (fsItem && typeof fsItem.selectedOptionIndex === 'number') {
        candidateIdx = fsItem.selectedOptionIndex;
      } else if (itemOptionSelected[itemId] !== undefined) {
        candidateIdx = Number(itemOptionSelected[itemId]);
      }

      // If candidate option exists in active (non-archived) images, use it
      if (availableImgs.some(img => img.optionIndex === candidateIdx)) {
        return candidateIdx;
      }
      // Dynamic Fallback Invariant (INV-OPTION-FALLBACK-001): First available non-archived option
      if (availableImgs.length > 0) {
        return availableImgs[0].optionIndex;
      }
      return 0;
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

    // ========================================================================
    // LEVEL 2 CATALOG OPERATING MODES & CROSS-CONTEXT NAVIGATION (AC-DEC-2026-037)
    // Standards: P-SHOPPING-JOURNEY-HUBS-001 / STD-MOD-COMP-001
    // ========================================================================
    function setCatalogSubView(subview, targetId) {
      const allowedViews = ['items', 'itinerary', 'clusters', 'stores', 'all'];
      const targetView = allowedViews.includes(subview) ? subview : 'items';
      window.catalogSubView = targetView;

      if (window.currentShoppingView !== 'catalog' && typeof window.switchShoppingView === 'function') {
        window.switchShoppingView('catalog');
      }

      const catalogSection = document.getElementById('catalogViewSection');
      if (catalogSection) {
        allowedViews.forEach(v => catalogSection.classList.remove(`mode-${v}`));
        catalogSection.classList.add(`mode-${targetView}`);
      }

      const subnavBtns = document.querySelectorAll('.catalog-subnav-btn');
      subnavBtns.forEach(btn => {
        const isCurrent = btn.getAttribute('data-subview') === targetView;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      // Synchronize URL query state if on catalog view
      try {
        const url = new URL(window.location.href);
        if (targetView !== 'items') {
          url.searchParams.set('subview', targetView);
        } else {
          url.searchParams.delete('subview');
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {
        // Safe fallback in restricted environments
      }

      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.outline = '2px solid var(--shop-gold, #d4af37)';
            el.style.boxShadow = '0 0 16px rgba(212, 175, 55, 0.4)';
            setTimeout(() => {
              el.style.outline = '';
              el.style.boxShadow = '';
            }, 3000);
          }
        }, 120);
      }
    }
    window.setCatalogSubView = setCatalogSubView;

    function jumpToStore(storeNameOrId) {
      if (!storeNameOrId) return;
      setCatalogSubView('stores');
      setTimeout(() => {
        const cleanName = storeNameOrId.trim().toLowerCase();
        const matched = stores.find(s => 
          (s.id && s.id.toLowerCase() === cleanName) ||
          s.name.toLowerCase() === cleanName ||
          s.name.toLowerCase().includes(cleanName) ||
          cleanName.includes(s.name.toLowerCase())
        );
        const storeDomId = matched ? (matched.id || `store_${matched.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`) : null;
        if (storeDomId) {
          const card = document.getElementById(storeDomId);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.outline = '2px solid var(--shop-gold, #d4af37)';
            card.style.boxShadow = '0 0 16px rgba(212, 175, 55, 0.4)';
            setTimeout(() => {
              card.style.outline = '';
              card.style.boxShadow = '';
            }, 3000);
          }
        }
      }, 100);
    }
    window.jumpToStore = jumpToStore;

    function jumpToChapter(chapterId) {
      if (!chapterId) return;
      activeChapter = chapterId;
      renderChapters();
      renderItems();
      setCatalogSubView('itinerary');
      setTimeout(() => {
        const milestoneTrack = document.getElementById('chapterMilestoneTrack');
        if (milestoneTrack) {
          milestoneTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    window.jumpToChapter = jumpToChapter;

    function focusCluster(clusterId) {
      if (!clusterId) return;
      setCatalogSubView('clusters', 'cluster-' + clusterId);
    }
    window.focusCluster = focusCluster;

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

      const paramCatalogView = params.get('catalog_mode') || params.get('catalog_view') || params.get('catalog_layout');
      if (paramCatalogView === 'compact' || paramCatalogView === 'list') {
        catalogViewMode = 'compact';
      } else if (paramCatalogView === 'thumbnails' || paramCatalogView === 'cards') {
        catalogViewMode = 'thumbnails';
      }

      // Deterministic Precedence Ladder for Catalog Operating Modes (Review 6.4 / AC-DEC-2026-037)
      const paramCluster = params.get('cluster');
      const paramOption = params.get('option');
      const paramStore = params.get('store');
      const paramChapter = params.get('chapter');
      const paramItem = params.get('item');
      const paramSubView = params.get('subview');

      if (paramCluster || (!paramItem && paramOption)) {
        // Priority 1: Cluster / Option (Decision Pods)
        setCatalogSubView('clusters');
        let targetCluster = null;
        let targetOpt = null;

        if (paramCluster) {
          targetCluster = clusters.find(c => c.id === paramCluster);
        }
        if (paramOption) {
          for (const c of clusters) {
            const found = c.options.find(o => o.optionId === paramOption || `${c.id}-${o.optionId}` === paramOption);
            if (found) {
              targetCluster = c;
              targetOpt = found;
              break;
            }
          }
        }

        if (targetCluster && targetCluster.chapterId) {
          activeChapter = targetCluster.chapterId;
        }

        setTimeout(() => {
          const optCard = paramOption ? (document.querySelector(`[data-option-id="${paramOption}"]`) || (targetCluster && targetOpt && document.getElementById(`opt-${targetCluster.id}-${targetOpt.optionId}`))) : null;
          if (optCard) {
            optCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            optCard.style.outline = '2px solid var(--shop-gold, #d4af37)';
            optCard.style.boxShadow = '0 0 16px rgba(212, 175, 55, 0.4)';
            setTimeout(() => { optCard.style.outline = ''; optCard.style.boxShadow = ''; }, 3000);
          } else if (targetCluster) {
            const el = document.getElementById('cluster-' + targetCluster.id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.style.outline = '2px solid var(--shop-gold, #d4af37)';
              el.style.boxShadow = '0 0 16px rgba(212, 175, 55, 0.4)';
              setTimeout(() => { el.style.outline = ''; el.style.boxShadow = ''; }, 3000);
            }
          }
          if (params.get('comments') === 'true' || params.get('drawer') === 'true') {
            if (window.SKPrimitives && window.SKPrimitives.openComments) {
              const key = targetCluster ? targetCluster.id : paramOption;
              window.SKPrimitives.openComments(key, {
                title: targetOpt ? targetOpt.title : (targetCluster ? targetCluster.title : paramOption),
                badge: targetOpt ? `Option ${targetOpt.optionId}` : (targetCluster ? targetCluster.id : paramOption),
                sub: targetOpt ? `${targetOpt.store} • ${targetOpt.priceTier}` : (targetCluster ? targetCluster.description : '')
              });
            }
          }
        }, 350);
      } else if (paramStore) {
        // Priority 2: Store Navigator & Directory
        jumpToStore(paramStore);
      } else if (paramChapter) {
        // Priority 3: Chapter Itinerary
        if (chapters.some(c => c.id === paramChapter)) {
          activeChapter = paramChapter;
        }
        setCatalogSubView('itinerary');
      } else if (paramItem) {
        // Priority 4: Item Checklist
        setCatalogSubView('items');
        const item = items.find(i => i.id === paramItem || i.code === paramItem);
        if (item && item.chapterId) {
          activeChapter = item.chapterId;
        }
        if (paramOption !== null && paramOption !== undefined) {
          const optIdx = parseInt(paramOption, 10);
          if (!isNaN(optIdx)) {
            const targetId = item ? item.id : paramItem;
            itemOptionSelected[targetId] = optIdx;
            localStorage.setItem('sk_shopping_item_options', JSON.stringify(itemOptionSelected));
          }
        }
        setTimeout(() => {
          const card = document.getElementById('card-' + paramItem) || (item && document.getElementById('card-' + item.id));
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlight-target-item');
            card.style.outline = '2px solid var(--shop-gold, #d4af37)';
            setTimeout(() => {
              card.classList.remove('highlight-target-item');
              card.style.outline = '';
            }, 3000);
            if (params.get('comments') === 'true' || params.get('drawer') === 'true') {
              const optIdx = (paramOption !== null && paramOption !== undefined) ? parseInt(paramOption, 10) : undefined;
              window.openItemRemarks(item ? item.id : paramItem, isNaN(optIdx) ? undefined : optIdx);
            }
          }
        }, 350);
      } else if (paramSubView) {
        // Priority 5: Explicit subview parameter
        setCatalogSubView(paramSubView);
      } else {
        // Priority 6: Default fallback
        setCatalogSubView('items');
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
                    <div class="shop-pod-store" onclick="event.stopPropagation(); window.jumpToStore('${opt.store.replace(/'/g, "\\'")}')" style="cursor: pointer;" title="View store in directory">📍 ${opt.store}</div>
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
        const storeDomId = s.id || `store_${s.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        return `
          <div class="shop-store-card" id="${storeDomId}">
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

    // Visual Dual-View Switching & Option Selection API (P-UNIVERSAL-VISUAL-ASSET-001)
    window.setCatalogViewMode = function(mode) {
      catalogViewMode = (mode === 'compact') ? 'compact' : 'thumbnails';
      localStorage.setItem('sk_shopping_catalog_view', catalogViewMode);
      syncCatalogViewUI();
      renderItems();
    };

    function syncCatalogViewUI() {
      const btnCards = document.getElementById('btnCatalogCards');
      const btnList = document.getElementById('btnCatalogList');
      if (btnCards && btnList) {
        btnCards.classList.toggle('active', catalogViewMode === 'thumbnails');
        btnList.classList.toggle('active', catalogViewMode === 'compact');
      }
      if (itemsGrid) {
        itemsGrid.classList.remove('view-thumbnails', 'view-compact-list');
        itemsGrid.classList.add(catalogViewMode === 'compact' ? 'view-compact-list' : 'view-thumbnails');
      }
    }

    window.selectItemOption = function(itemId, optionIndex) {
      if (window.chipGestureHandled) {
        window.chipGestureHandled = false;
        return;
      }
      itemOptionSelected[itemId] = optionIndex;
      localStorage.setItem('sk_shopping_item_options', JSON.stringify(itemOptionSelected));
      if (typeof window.fsSetShoppingItemStatus === 'function') {
        window.fsSetShoppingItemStatus(itemId, { selectedOptionIndex: optionIndex })
          .catch(err => console.warn('Firestore option sync skipped:', err));
      }
      renderItems();
    };

    window.shareItemOption = function(itemId, optionIndex) {
      const item = items.find(i => i.id === itemId);
      const title = item ? item.title : itemId;
      const allImgs = getItemImages(item);
      const activeImg = allImgs.find(img => img.optionIndex === optionIndex) || allImgs[0];
      const optLabel = activeImg ? (activeImg.label || `Option ${optionIndex}`) : `Option ${optionIndex}`;

      const shareUrl = (typeof SKPrimitives !== 'undefined' && SKPrimitives.getStakeholderUrl)
        ? SKPrimitives.getStakeholderUrl('shopping-registry.html', { item: itemId, option: optionIndex, mode: 'family' })
        : `${window.location.origin}/shopping-registry.html?item=${itemId}&option=${optionIndex}&mode=family`;

      const text = `✨ *Wedding Wardrobe Review — ${title} (${optLabel})*\nCheck out this candidate look for *${title}* in the Sree Krushna Shopping Registry!\n👉 Tap to view and compare looks: ${shareUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Link for ${optLabel} copied! Ready to paste into WhatsApp.`, '📱');
        });
      } else {
        prompt('Copy Look Link:', text);
      }

      if (navigator.share && window.innerWidth <= 768) {
        navigator.share({
          title: `${title} - ${optLabel}`,
          text: text,
          url: shareUrl
        }).catch(() => {});
      }
    };

    window.archiveItemOption = function(itemId, optionIndex) {
      if (!isHostUser()) {
        showToast('Only the Host can delete candidate looks.', '🔒');
        return;
      }
      if (optionIndex === 0) {
        showToast('Cannot delete canonical baseline concept.', '⚠️');
        return;
      }
      const customOpts = itemCustomOptions[itemId] || [];
      const target = customOpts.find(opt => opt.optionIndex === optionIndex);
      if (!target) {
        showToast('Look not found in custom list.', '⚠️');
        return;
      }
      target.isArchived = true;
      target.archivedAt = new Date().toISOString();
      localStorage.setItem('sk_shopping_custom_options', JSON.stringify(itemCustomOptions));

      // Dynamic Fallback Invariant (INV-OPTION-FALLBACK-001):
      // If currently selected look was archived, switch to first available non-archived look
      const item = items.find(i => i.id === itemId);
      const remaining = getItemImages(item);
      const nextActive = remaining.length > 0 ? remaining[0].optionIndex : 0;
      itemOptionSelected[itemId] = nextActive;
      localStorage.setItem('sk_shopping_item_options', JSON.stringify(itemOptionSelected));

      if (typeof window.fsSetShoppingItemStatus === 'function') {
        window.fsSetShoppingItemStatus(itemId, {
          options: itemCustomOptions[itemId],
          selectedOptionIndex: nextActive
        }).catch(err => console.warn('Firestore archive sync error:', err));
      }

      renderItems();
      if (typeof window.updateSurveyUI === 'function') window.updateSurveyUI();
      showToast('Candidate look moved to 30-day Trash Archive.', '🗑️');
    };

    window.restoreItemOption = function(itemId, optionIndex) {
      if (!isHostUser()) {
        showToast('Only the Host can restore candidate looks.', '🔒');
        return;
      }
      const customOpts = itemCustomOptions[itemId] || [];
      const target = customOpts.find(opt => opt.optionIndex === optionIndex);
      if (!target) {
        showToast('Archived look not found.', '⚠️');
        return;
      }
      delete target.isArchived;
      delete target.archivedAt;
      localStorage.setItem('sk_shopping_custom_options', JSON.stringify(itemCustomOptions));

      itemOptionSelected[itemId] = optionIndex;
      localStorage.setItem('sk_shopping_item_options', JSON.stringify(itemOptionSelected));

      if (typeof window.fsSetShoppingItemStatus === 'function') {
        window.fsSetShoppingItemStatus(itemId, {
          options: itemCustomOptions[itemId],
          selectedOptionIndex: optionIndex
        }).catch(err => console.warn('Firestore restore sync error:', err));
      }

      renderItems();
      if (typeof window.updateSurveyUI === 'function') window.updateSurveyUI();
      if (typeof renderArchivedLooksInModal === 'function') renderArchivedLooksInModal(itemId);
      showToast(`Look ${optionIndex} restored to catalog!`, '♻️');
    };

    window.openItemRemarks = function(itemId, optionIndex) {
      const item = items.find(i => i.id === itemId);
      const allImgs = item ? getItemImages(item) : [];
      const options = allImgs.map((img, idx) => ({
        index: img.optionIndex !== undefined ? img.optionIndex : idx,
        label: img.label || `Look ${(img.optionIndex !== undefined ? img.optionIndex : idx) + 1}`
      }));
      const optIdx = (typeof optionIndex === 'number') ? optionIndex : (options.length > 0 ? options[0].index : 0);
      const context = {
        entityId: itemId,
        activeOptionIndex: optIdx,
        options: options,
        title: item ? item.title : itemId,
        badge: `Look ${optIdx + 1}`,
        sub: item ? `${item.store || 'Shopping Registry'} • ${item.category || ''}` : 'Shopping Registry',
        alignment: '✨ Open for Family Remarks'
      };
      if (window.SKPrimitives && window.SKPrimitives.openComments) {
        window.SKPrimitives.openComments(context);
      } else if (window.openCommentsDrawer) {
        window.openCommentsDrawer(context);
      }
    };

    // Render Item Checklist Grid (Supporting Dual Views: Thumbnail Cards & Compact List)
    function renderItems() {
      syncCatalogViewUI();
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

      const catIcons = { bridal: '🥻', groom: '👑', jewellery: '💎', sara: '🎁', engagement: '💍', heirlooms: '👑' };

      itemsGrid.innerHTML = filtered.map(item => {
        const isBought = !!itemPurchased[item.id];
        const approvals = stakeholderApprovals[item.id] || item.approvals || {};
        const allImages = getItemImages(item);
        const hasImages = (allImages.length > 0);
        const activeOptIdx = getActiveOptionIndex(item.id);
        const activeImage = hasImages ? (allImages.find(img => img.optionIndex === activeOptIdx) || allImages[0]) : null;
        const isHost = isHostUser();
        const curOptIdx = activeImage ? activeImage.optionIndex : 0;
        const remarksUid = `${item.id}_opt_${curOptIdx}`;
        const remarksCount = (window.SKPrimitives && window.SKPrimitives.getCommentCount) ? window.SKPrimitives.getCommentCount(item.id) : 0;
        const archivedCount = getArchivedItemOptions(item.id).length;
        const catIcon = catIcons[item.category] || '🛍️';

        // ------------------------------------------------------------------
        // VIEW MODE 2: COMPACT LIST VIEW
        // ------------------------------------------------------------------
        if (catalogViewMode === 'compact') {
          const fallbackPath = `./assets/shopping/${item.slug || 'vivaha_pata'}/${item.slug || 'vivaha_pata'}_0.jpg`;
          const avatarHtml = (hasImages && activeImage)
            ? `<div class="shop-compact-avatar" onclick="window.openShoppingLightbox('${item.title.replace(/'/g, "\\'")}', '${activeImage.src}', '<strong>${item.id}:</strong> ${(activeImage.label || '').replace(/'/g, "\\'")} • ${item.store} • ${item.priceRange}', '${item.id}', ${curOptIdx})" title="Inspect ${item.title}">
                <img src="${activeImage.src}" alt="${item.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackPath}';">
                ${allImages.length > 1 ? `<span class="shop-compact-avatar-badge">${allImages.length}</span>` : ''}
               </div>`
            : `<div class="shop-compact-avatar" title="${item.title}">
                <span class="shop-compact-avatar-placeholder">${catIcon}</span>
               </div>`;

          return `
            <article class="shop-compact-row ${isBought ? 'purchased' : ''}" id="card-${item.id}">
              <label class="shop-compact-check-wrap" title="${isBought ? 'Mark Unpurchased' : 'Mark as Purchased'}">
                <input type="checkbox" ${isBought ? 'checked' : ''} onchange="window.togglePurchased('${item.id}', this.checked)">
              </label>

              ${avatarHtml}

              <div class="shop-compact-main">
                <div class="shop-compact-header">
                  <span class="shop-id-badge">${item.id}</span>
                  <h4 class="shop-compact-title" title="${item.title}">${item.title}</h4>
                  <span class="shop-compact-price">${item.priceRange}</span>
                </div>
                <div class="shop-compact-sub">
                  <span>🎨 ${item.suggestedColor}</span> • <span class="shop-link-badge" onclick="window.jumpToStore('${item.store.replace(/'/g, "\\'")}')" style="cursor: pointer; text-decoration: underline dotted;" title="Jump to Store">🏬 ${item.store}</span> • <span class="shop-link-badge" onclick="window.jumpToChapter('${item.chapterId}')" style="cursor: pointer; text-decoration: underline dotted;" title="Jump to Itinerary Chapter">📖 ${item.role}</span>
                </div>
                <div class="shop-compact-tags">
                  <span class="shop-mini-vote ${approvals.bride ? 'approved' : ''}" onclick="window.toggleApproval('${item.id}', 'bride')" title="Toggle Bride Approval">👰 ${approvals.bride ? '✓' : '○'}</span>
                  <span class="shop-mini-vote ${approvals.sisters ? 'approved' : ''}" onclick="window.toggleApproval('${item.id}', 'sisters')" title="Toggle Sisters Approval">👭 ${approvals.sisters ? '✓' : '○'}</span>
                  <span class="shop-mini-vote ${approvals.inlaws ? 'approved' : ''}" onclick="window.toggleApproval('${item.id}', 'inlaws')" title="Toggle In-Laws Approval">🤝 ${approvals.inlaws ? '✓' : '○'}</span>
                  ${item.clusterId ? `<span class="shop-mini-vote" onclick="window.focusCluster('${item.clusterId}')" title="Compare Alternatives" style="cursor: pointer;">⚖️ Compare</span>` : ''}
                </div>
              </div>

              <div class="shop-compact-actions">
                <button class="shop-remarks-btn" type="button" onclick="window.openItemRemarks('${item.id}', ${curOptIdx})" title="Family Remarks & Comments" style="font-size: 11px; padding: 3px 7px;">
                  <span>💬 ${remarksCount > 0 ? remarksCount : ''}</span>
                </button>
                <button class="shop-share-look-btn" type="button" onclick="window.shareItemOption('${item.id}', ${curOptIdx})" title="Share Look Link">
                  <span>📤</span>
                </button>
                <button class="shop-btn shop-btn-sm" type="button" onclick="window.openOptionIntakeModal('${item.id}')" title="Add Look" style="font-size: 11px; padding: 3px 7px;">
                  <span>➕</span>
                </button>
                <button class="shop-visual-search-btn" type="button" onclick="window.openVisualSearch('${(item.visualSearchQuery || (item.title + ' ' + (item.suggestedColor || '') + ' ' + (item.spec || ''))).replace(/'/g, "\\'")}')" title="Google Images Visual AI Search">
                  <span>🔍</span> <span>Search ↗</span>
                </button>
              </div>
            </article>
          `;
        }

        // ------------------------------------------------------------------
        // VIEW MODE 1: THUMBNAIL CARDS VIEW
        // ------------------------------------------------------------------
        let mediaHtml = '';
        const fallbackPath = `./assets/shopping/${item.slug || 'vivaha_pata'}/${item.slug || 'vivaha_pata'}_0.jpg`;
        if (hasImages && activeImage) {
          mediaHtml = `
            <div class="shop-card-media-wrapper" onclick="window.openShoppingLightbox('${item.title.replace(/'/g, "\\'")}', '${activeImage.src}', '<strong>${item.id}:</strong> ${(activeImage.label || '').replace(/'/g, "\\'")} • ${item.store} • ${item.priceRange}', '${item.id}', ${curOptIdx})" title="Click to inspect in Lightbox">
              <img src="${activeImage.src}" alt="${item.title}" class="shop-card-media-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackPath}'; this.classList.add('is-fallback');">
              <div class="shop-media-overlay-top">
                <span class="shop-media-badge-id">${item.id}</span>
                <span class="shop-media-badge-price">${item.priceRange}</span>
              </div>
              <div class="shop-media-overlay-bottom">
                <span class="shop-media-badge-count">📸 ${allImages.length === 1 ? '1 Look' : `${allImages.length} Looks`}</span>
                <span class="shop-media-hover-hint">🔍 Inspect</span>
              </div>
            </div>
          `;
        } else {
          mediaHtml = `
            <div class="shop-card-media-placeholder">
              <span class="shop-placeholder-icon">${catIcon}</span>
              <span class="shop-placeholder-title">${item.title}</span>
              <span class="shop-placeholder-sub">Curated liturgical specification • Reference photos pending showroom selection</span>
              <button type="button" class="shop-btn-add-look" onclick="window.openOptionIntakeModal('${item.id}')">➕ Add Pinterest / Showroom Look</button>
            </div>
          `;
        }

        const customCount = (itemCustomOptions[item.id] || []).length;
        const optionsBarHtml = `
          <div class="shop-card-options-bar">
            ${allImages.map(img => `
              <div class="shop-option-chip-group">
                <button type="button" 
                  class="shop-option-chip ${img.optionIndex === curOptIdx ? 'active' : ''}" 
                  data-item-id="${item.id}"
                  data-opt-idx="${img.optionIndex}"
                  data-is-default="${img.isDefault ? '1' : '0'}"
                  onclick="event.stopPropagation(); window.selectItemOption('${item.id}', ${img.optionIndex})" 
                  title="${(img.label || `Option ${img.optionIndex}`) + (img.optionIndex > 0 ? ' (Hold or right-click to manage)' : '')}">
                  ${img.isDefault ? '🌟 Concept' : (img.type === 'pinterest_direct' || (img.src && img.src.includes('pinimg')) ? '📌 Option ' + img.optionIndex : (img.type === 'pinterest_pin' || (img.referenceUrl && /pinterest|pin\.it/i.test(img.referenceUrl)) ? '📌 Pin ' + img.optionIndex : `Look ${img.optionIndex}`))}
                </button>
              </div>
            `).join('')}
            <button type="button" class="shop-option-chip shop-option-chip-add" onclick="event.stopPropagation(); window.openOptionIntakeModal('${item.id}')" title="Add a candidate look for this item">
              ➕ Add Look
            </button>
            ${archivedCount > 0 ? `
              <button type="button" class="shop-option-chip" onclick="event.stopPropagation(); window.openOptionIntakeModal('${item.id}', 'archived')" style="background: rgba(245, 158, 11, 0.12); color: #fbbf24; border-color: rgba(245, 158, 11, 0.35);" title="Open Trash Bin (${archivedCount} archived look${archivedCount > 1 ? 's' : ''})">
                🗄️ Trash (${archivedCount})
              </button>
            ` : ''}
          </div>
        `;

        return `
          <article class="shop-item-card ${isBought ? 'purchased' : ''}" id="card-${item.id}">
            <div>
              ${mediaHtml}
              ${optionsBarHtml}
              <div class="shop-item-top">
                <span class="shop-id-badge">${item.id}</span>
                <span style="font-size: 11px; font-weight: 700; color: var(--shop-gold);">${item.priceRange}</span>
              </div>
              <h3 class="shop-item-title">${item.title}</h3>
              <div class="shop-item-role" onclick="window.jumpToChapter('${item.chapterId}')" style="cursor: pointer; text-decoration: underline dotted;" title="Jump to Itinerary Chapter">✨ ${item.role}</div>
              <div class="shop-spec-box">
                <strong>Specification:</strong> ${item.spec}
              </div>
              <div class="shop-meta-row">
                <span class="shop-meta-tag">🎨 <strong>Color:</strong> ${item.suggestedColor}</span>
                <span class="shop-meta-tag" onclick="window.jumpToStore('${item.store.replace(/'/g, "\\'")}')" style="cursor: pointer; text-decoration: underline dotted;" title="Jump to Store in Directory">🏬 <strong>Store:</strong> ${item.store}</span>
              </div>
              ${activeImage && activeImage.referenceUrl ? `
                <div style="margin-top: 6px;">
                  <a href="${activeImage.referenceUrl}" target="_blank" rel="noopener" class="shop-ref-link-chip" onclick="event.stopPropagation()">
                    📌 View on Pinterest ↗
                  </a>
                </div>
              ` : ''}
              
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
                <button class="shop-remarks-btn" type="button" onclick="window.openItemRemarks('${item.id}', ${curOptIdx})" title="Family Remarks & Comments">
                  <span>💬 ${remarksCount > 0 ? `${remarksCount} Remarks` : 'Remarks'}</span>
                </button>
                <button class="shop-share-look-btn" type="button" onclick="window.shareItemOption('${item.id}', ${curOptIdx})" title="Share this look with family">
                  <span>📤 Share Look</span>
                </button>
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
      if (!clusterId) return;
      setCatalogSubView('clusters', 'cluster-' + clusterId);
    };

    // Filter pills
    shopFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        shopFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (typeof pill.scrollIntoView === 'function') {
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
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
        if (typeof pill.scrollIntoView === 'function') {
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
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
            } else {
              renderItems();
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

    window.openShoppingLightbox = function(title, photoUrl, caption, itemId, activeOptIdx) {
      if (!lightboxBackdrop || !lightboxImg) return;
      if (lightboxTitle) lightboxTitle.textContent = title;

      let fullCaption = caption || '';
      if (itemId && isHostUser()) {
        const customOpts = (itemCustomOptions[itemId] || []).filter(o => !o.isArchived);
        const hasCustom = customOpts.length > 0;
        const optNumber = (typeof activeOptIdx === 'number') ? activeOptIdx : 0;

        let adminBarHtml = '<div class="sk-lightbox-admin-bar">';
        adminBarHtml += '<div class="sk-lb-admin-title">🛡️ Host Management Controls</div>';

        if (optNumber > 0) {
          adminBarHtml += `
            <button type="button" class="sk-lb-btn-archive" onclick="event.stopPropagation(); window.archiveAndCloseLightbox('${itemId}', ${optNumber})">
              🗑️ Move Option ${optNumber} to Trash Bin
            </button>
          `;
        }

        if (hasCustom) {
          adminBarHtml += `
            <button type="button" class="sk-lb-btn-clear" onclick="event.stopPropagation(); window.clearAndCloseLightbox('${itemId}')">
              ⚠️ Clear All Custom Looks (Revert to Concept)
            </button>
          `;
        }
        adminBarHtml += '</div>';
        fullCaption += adminBarHtml;
      }

      if (lightboxCaption) lightboxCaption.innerHTML = fullCaption;

      const resolved = (window.SKPrimitives && window.SKPrimitives.resolveDriveAsset)
        ? window.SKPrimitives.resolveDriveAsset(photoUrl, { zoomWidth: 1600 })
        : { zoomUrl: photoUrl };

      lightboxImg.src = resolved.zoomUrl || photoUrl;
      lightboxBackdrop.classList.add('is-active');
      if (lightboxZoomEngine) lightboxZoomEngine.fit();
    };

    window.archiveAndCloseLightbox = function(itemId, optIdx) {
      if (confirm(`Move Option ${optIdx} to 30-day Trash Bin?`)) {
        window.archiveItemOption(itemId, optIdx);
        if (lightboxBackdrop) lightboxBackdrop.classList.remove('is-active');
      }
    };

    window.clearAndCloseLightbox = function(itemId) {
      if (confirm('Clear all added custom looks for this item and revert to canonical concept?')) {
        window.clearItemCustomOptions(itemId);
        if (lightboxBackdrop) lightboxBackdrop.classList.remove('is-active');
      }
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

    // Wire Option Intake Modal (Adapted from PIO ImageUploadWidget / P-PINTEREST-INTAKE-001)
    const btnOpenShoppingIntake = document.getElementById('btnOpenShoppingIntake');
    const intakeBackdrop = document.getElementById('skOptionIntakeBackdrop');
    const btnCloseIntake = document.getElementById('skOptionIntakeClose');
    const btnCancelIntake = document.getElementById('skBtnCancelIntake');
    const btnSubmitOption = document.getElementById('skBtnSubmitOption');
    const tabDrive = document.getElementById('skTabDriveLink');
    const tabDevice = document.getElementById('skTabDeviceUpload');
    const tabArchived = document.getElementById('skTabArchived');
    const paneDrive = document.getElementById('skPaneDrive');
    const paneDevice = document.getElementById('skPaneDevice');
    const paneArchived = document.getElementById('skPaneArchived');
    const driveInput = document.getElementById('skDriveUrlInput');
    const btnVerifyDrive = document.getElementById('skBtnVerifyDrive');
    const proofCard = document.getElementById('skDriveProofCard');
    const proofImg = document.getElementById('skDriveProofImg');
    const proofId = document.getElementById('skDriveFileId');
    const fileInput = document.getElementById('skFileInput');
    let localUploadedDataUrl = '';

    function switchIntakeTab(activeTab) {
      if (tabDrive) {
        tabDrive.classList.toggle('is-active', activeTab === 'drive');
        tabDrive.setAttribute('aria-selected', activeTab === 'drive' ? 'true' : 'false');
      }
      if (tabDevice) {
        tabDevice.classList.toggle('is-active', activeTab === 'device');
        tabDevice.setAttribute('aria-selected', activeTab === 'device' ? 'true' : 'false');
      }
      if (tabArchived) {
        tabArchived.classList.toggle('is-active', activeTab === 'archived');
        tabArchived.setAttribute('aria-selected', activeTab === 'archived' ? 'true' : 'false');
      }

      if (paneDrive) paneDrive.style.display = (activeTab === 'drive') ? 'block' : 'none';
      if (paneDevice) paneDevice.style.display = (activeTab === 'device') ? 'block' : 'none';
      if (paneArchived) paneArchived.style.display = (activeTab === 'archived') ? 'block' : 'none';

      const intakeGrid = document.getElementById('skIntakeMetadataGrid');
      if (intakeGrid) intakeGrid.style.display = (activeTab === 'archived') ? 'none' : 'grid';
      if (btnSubmitOption) btnSubmitOption.style.display = (activeTab === 'archived') ? 'none' : 'inline-block';
    }

    function renderArchivedLooksInModal(itemId) {
      const container = document.getElementById('skArchivedLooksList');
      const countEl = document.getElementById('skArchivedLooksCount');
      if (!container) return;
      const archived = getArchivedItemOptions(itemId);
      if (countEl) countEl.textContent = archived.length;

      if (archived.length === 0) {
        container.innerHTML = `
          <div class="sk-archived-empty">
            <span style="font-size: 24px; display: block; margin-bottom: 6px;">🗑️</span>
            <p>No candidate looks in the 30-day Trash Bin for this item.</p>
          </div>
        `;
        return;
      }

      const now = Date.now();
      container.innerHTML = archived.map(opt => {
        const archTime = opt.archivedAt ? new Date(opt.archivedAt).getTime() : now;
        const elapsedDays = Math.floor((now - archTime) / (24 * 60 * 60 * 1000));
        const remainingDays = Math.max(0, 30 - elapsedDays);
        const fallbackSrc = './assets/shopping/vivaha_pata/vivaha_pata_0.jpg';
        return `
          <div class="sk-archived-look-card">
            <img class="sk-archived-look-thumb" src="${opt.src}" alt="${opt.label || 'Look'}" onerror="this.src='${fallbackSrc}'" referrerpolicy="no-referrer">
            <div class="sk-archived-look-info">
              <div class="sk-archived-look-title">Option ${opt.optionIndex}: ${opt.label || 'Candidate Look'}</div>
              <div class="sk-archived-look-meta">
                <span class="sk-archived-countdown">⏳ ${remainingDays} days left</span>
                ${opt.priceTier ? `<span>• ${opt.priceTier}</span>` : ''}
                ${opt.store ? `<span>• ${opt.store}</span>` : ''}
              </div>
            </div>
            ${isHostUser() ? `
              <button type="button" class="sk-restore-look-btn" onclick="window.restoreItemOption('${itemId}', ${opt.optionIndex})">
                ♻️ Restore
              </button>
            ` : `
              <span style="font-size: 11px; color: #64748b;">Host Only</span>
            `}
          </div>
        `;
      }).join('');
    }
    window.renderArchivedLooksInModal = renderArchivedLooksInModal;

    window.openOptionIntakeModal = function(itemId, initialTab = 'drive') {
      if (!intakeBackdrop) return;
      const item = items.find(i => i.id === itemId);
      const itemIdInput = document.getElementById('skOptionItemId');
      const modalTitle = document.getElementById('skOptionIntakeTitle');
      const titleInput = document.getElementById('skOptionTitle');
      const categorySelect = document.getElementById('skOptionCategory');
      const priceInput = document.getElementById('skOptionPrice');
      const vendorInput = document.getElementById('skOptionVendor');

      if (itemIdInput) itemIdInput.value = itemId || '';
      if (modalTitle) modalTitle.textContent = item ? `Add Look for ${item.title} (${item.id})` : 'Add Shopping / Decor Option';

      if (item) {
        const existingImgs = getItemImages(item);
        const nextIdx = existingImgs.length;
        if (titleInput) titleInput.value = `${item.title} (Option ${nextIdx})`;
        if (categorySelect && item.category) {
          const catMap = { bridal: 'saree', groom: 'kurta', jewellery: 'jewelry' };
          if (catMap[item.category]) categorySelect.value = catMap[item.category];
        }
        if (vendorInput && item.store) vendorInput.value = item.store;
      } else {
        if (titleInput) titleInput.value = '';
      }

      if (driveInput) driveInput.value = '';
      if (proofCard) proofCard.style.display = 'none';
      if (fileInput) fileInput.value = '';
      if (priceInput) priceInput.value = '';
      localUploadedDataUrl = '';
      const alertEl = document.getElementById('skIntakeUrlAlert');
      if (alertEl) {
        alertEl.style.display = 'none';
        alertEl.className = 'sk-intake-alert';
        alertEl.textContent = '';
      }

      renderArchivedLooksInModal(itemId);
      switchIntakeTab(initialTab === 'archived' ? 'archived' : 'drive');

      intakeBackdrop.classList.add('is-active');
    };

    window.closeOptionIntakeModal = function() {
      if (intakeBackdrop) intakeBackdrop.classList.remove('is-active');
    };

    if (btnOpenShoppingIntake && intakeBackdrop) {
      btnOpenShoppingIntake.addEventListener('click', () => {
        window.openOptionIntakeModal('');
      });
    }

    if (btnCloseIntake) btnCloseIntake.addEventListener('click', window.closeOptionIntakeModal);
    if (btnCancelIntake) btnCancelIntake.addEventListener('click', window.closeOptionIntakeModal);

    // 3-Trigger Dismissibility (INV-LIFECYCLE-03)
    if (intakeBackdrop) {
      intakeBackdrop.addEventListener('click', (e) => {
        if (e.target === intakeBackdrop) window.closeOptionIntakeModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && intakeBackdrop && intakeBackdrop.classList.contains('is-active')) {
        window.closeOptionIntakeModal();
      }
    });

    if (tabDrive) tabDrive.addEventListener('click', () => switchIntakeTab('drive'));
    if (tabDevice) tabDevice.addEventListener('click', () => switchIntakeTab('device'));
    if (tabArchived) tabArchived.addEventListener('click', () => switchIntakeTab('archived'));

    // Client-Side Canvas Image Compressor (AC-DEC-2026-045 / P-PROGRESSIVE-INTAKE-001)
    function compressImageFile(file, maxWidth = 1400, quality = 0.82) {
      return new Promise((resolve) => {
        if (!file || !file.type.startsWith('image/')) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            let w = img.width;
            let h = img.height;
            if (w > maxWidth || h > maxWidth) {
              if (w > h) {
                h = Math.round((h * maxWidth) / w);
                w = maxWidth;
              } else {
                w = Math.round((w * maxWidth) / h);
                h = maxWidth;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve({
              dataUrl,
              originalSize: file.size,
              compressedSize: Math.round(dataUrl.length * 0.75)
            });
          };
          img.onerror = () => resolve({
            dataUrl: evt.target.result,
            originalSize: file.size,
            compressedSize: file.size
          });
          img.src = evt.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    }

    async function processSelectedImageFile(file) {
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPEG, PNG, WebP).', '⚠️');
        return;
      }
      showToast('Optimizing & loading photo...', '⏳');
      const res = await compressImageFile(file, 1400, 0.82);
      if (!res || !res.dataUrl) {
        showToast('Failed to process image file.', '⚠️');
        return;
      }
      localUploadedDataUrl = res.dataUrl;
      switchIntakeTab('device');

      const titleInput = document.getElementById('skOptionTitle');
      if (titleInput && (!titleInput.value || titleInput.value.includes('New Candidate Look'))) {
        const cleanName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Showroom Selection';
        titleInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }

      if (proofCard && proofImg) {
        proofImg.src = localUploadedDataUrl;
        proofCard.style.display = 'flex';
        const badgeEl = document.getElementById('skDriveProofBadge');
        if (badgeEl) badgeEl.textContent = `✓ Showroom Photo (${Math.round(res.compressedSize / 1024)} KB)`;
        if (proofId) proofId.textContent = `Name: ${file.name || 'Device Photo'}`;
      }

      showToast(`Showroom photo loaded (${Math.round(res.compressedSize / 1024)} KB)!`, '📷');
    }

    const intakeCard = intakeBackdrop ? intakeBackdrop.querySelector('.sk-intake-card') : null;
    const dropzone = document.getElementById('skDropzone');
    const btnQuickUpload = document.getElementById('skBtnQuickUpload');

    if (btnQuickUpload && fileInput) {
      btnQuickUpload.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => {
        fileInput.click();
      });
      dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInput.click();
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) processSelectedImageFile(file);
      });
    }

    // Modal-Wide HTML5 Drag and Drop (Windows Desktop & Browser)
    if (intakeBackdrop) {
      ['dragenter', 'dragover'].forEach(evtName => {
        intakeBackdrop.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (intakeCard) intakeCard.classList.add('is-drag-over');
          if (dropzone) dropzone.classList.add('is-drag-over');
        });
      });

      ['dragleave', 'dragend'].forEach(evtName => {
        intakeBackdrop.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (intakeCard) intakeCard.classList.remove('is-drag-over');
          if (dropzone) dropzone.classList.remove('is-drag-over');
        });
      });

      intakeBackdrop.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (intakeCard) intakeCard.classList.remove('is-drag-over');
        if (dropzone) dropzone.classList.remove('is-drag-over');

        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
          const file = dt.files[0];
          processSelectedImageFile(file);
        }
      });
    }

    // Option Chip Gestures & Contextual Popover (AC-DEC-2026-045 / P-LOOK-ERGONOMICS-001)
    let chipPopoverEl = document.getElementById('skChipActionPopover');
    if (!chipPopoverEl) {
      chipPopoverEl = document.createElement('div');
      chipPopoverEl.id = 'skChipActionPopover';
      chipPopoverEl.className = 'sk-chip-popover';
      chipPopoverEl.style.display = 'none';
      document.body.appendChild(chipPopoverEl);
    }

    let chipTimer = null;
    let chipStartX = 0;
    let chipStartY = 0;
    window.chipGestureHandled = false;

    window.closeOptionChipPopover = function() {
      if (chipPopoverEl) chipPopoverEl.style.display = 'none';
    };

    window.showOptionChipPopover = function(chipEl, itemId, optIdx, isDefault) {
      if (!chipPopoverEl || !chipEl) return;
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const allImgs = getItemImages(item);
      const img = allImgs.find(i => i.optionIndex === optIdx) || allImgs[0];
      const isHost = isHostUser();

      const lookTitle = img ? (img.label || `Option ${optIdx}`) : `Option ${optIdx}`;
      const isConcept = isDefault || optIdx === 0;

      let actionsHtml = `
        <div class="sk-chip-popover-header">
          <span class="sk-chip-popover-title">⚙️ ${lookTitle}</span>
          <button type="button" class="sk-chip-popover-close" onclick="window.closeOptionChipPopover()" aria-label="Close">✕</button>
        </div>
        <div class="sk-chip-popover-actions">
          <button type="button" class="sk-chip-popover-btn" onclick="window.closeOptionChipPopover(); window.openShoppingLightbox('${item.title.replace(/'/g, "\\'")}', '${img ? img.src : ''}', '<strong>${item.id}:</strong> ${(img && img.label ? img.label : '').replace(/'/g, "\\'")} • ${item.store} • ${item.priceRange}', '${item.id}', ${optIdx})">
            🔍 Inspect in Lightbox
          </button>
          <button type="button" class="sk-chip-popover-btn" onclick="window.closeOptionChipPopover(); window.openItemRemarks('${item.id}', ${optIdx})">
            💬 Remarks & Discussion
          </button>
      `;

      if (!isConcept && isHost) {
        actionsHtml += `
          <button type="button" class="sk-chip-popover-btn is-destructive" onclick="window.closeOptionChipPopover(); window.archiveItemOption('${item.id}', ${optIdx})">
            🗑️ Move to 30-Day Trash Bin
          </button>
        `;
      } else if (!isConcept && !isHost) {
        actionsHtml += `
          <div class="sk-chip-popover-hint">🛡️ Archiving looks is restricted to Wedding Hosts.</div>
        `;
      }

      actionsHtml += '</div>';
      chipPopoverEl.innerHTML = actionsHtml;
      chipPopoverEl.style.display = 'flex';

      const rect = chipEl.getBoundingClientRect();
      const popoverWidth = 240;
      let left = rect.left;
      if (left + popoverWidth > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - popoverWidth - 12);
      }
      let top = rect.bottom + 6;
      if (top + 160 > window.innerHeight) {
        top = Math.max(12, rect.top - 165);
      }

      chipPopoverEl.style.left = `${left}px`;
      chipPopoverEl.style.top = `${top}px`;
    };

    document.addEventListener('click', (e) => {
      if (chipPopoverEl && chipPopoverEl.style.display !== 'none') {
        if (!chipPopoverEl.contains(e.target) && !e.target.closest('.shop-option-chip')) {
          window.closeOptionChipPopover();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeOptionChipPopover();
      }
    });

    // Gesture delegation on document for .shop-option-chip
    document.addEventListener('pointerdown', (e) => {
      const chip = e.target.closest('.shop-option-chip[data-opt-idx]');
      if (!chip) return;
      chipStartX = e.clientX;
      chipStartY = e.clientY;

      if (chipTimer) clearTimeout(chipTimer);
      chipTimer = setTimeout(() => {
        window.chipGestureHandled = true;
        const itemId = chip.getAttribute('data-item-id');
        const optIdx = parseInt(chip.getAttribute('data-opt-idx'), 10);
        const isDef = chip.getAttribute('data-is-default') === '1';
        window.showOptionChipPopover(chip, itemId, optIdx, isDef);
      }, 500);
    });

    document.addEventListener('pointermove', (e) => {
      if (!chipTimer) return;
      if (Math.hypot(e.clientX - chipStartX, e.clientY - chipStartY) > 8) {
        clearTimeout(chipTimer);
        chipTimer = null;
      }
    });

    document.addEventListener('pointerup', () => {
      if (chipTimer) {
        clearTimeout(chipTimer);
        chipTimer = null;
      }
    });

    document.addEventListener('pointercancel', () => {
      if (chipTimer) {
        clearTimeout(chipTimer);
        chipTimer = null;
      }
    });

    window.addEventListener('scroll', () => {
      if (chipTimer) {
        clearTimeout(chipTimer);
        chipTimer = null;
      }
    }, { passive: true });

    document.addEventListener('contextmenu', (e) => {
      const chip = e.target.closest('.shop-option-chip[data-opt-idx]');
      if (!chip) return;
      e.preventDefault();
      e.stopPropagation();
      const itemId = chip.getAttribute('data-item-id');
      const optIdx = parseInt(chip.getAttribute('data-opt-idx'), 10);
      const isDef = chip.getAttribute('data-is-default') === '1';
      window.showOptionChipPopover(chip, itemId, optIdx, isDef);
    });

    // Candidate Image Validation Gates (P-COLLAB-VISUAL-INTAKE-001)
    // Candidate Image Validation Gates (P-COLLAB-VISUAL-INTAKE-001)
    function validateCandidateImageUrl(url) {
      if (!url || !url.trim()) {
        return { valid: false, type: 'empty', error: 'Please provide a direct image link or upload a showroom photo.' };
      }
      const cleanUrl = url.trim();

      // 1. Direct Pinterest CDN image (i.pinimg.com)
      if (cleanUrl.includes('i.pinimg.com')) {
        return {
          valid: true,
          type: 'pinterest_direct',
          src: cleanUrl,
          badge: '📌 Pinterest CDN (Direct Render)',
          isDirectImage: true
        };
      }

      // 2. Pinterest Web Pin (pin.it or *.pinterest.*/pin/ or similar)
      if (/pin\.it|pinterest(\.[a-z]{2,3})+/i.test(cleanUrl)) {
        const hasDirectExt = /\.(jpe?g|png|webp|avif)($|\?)/i.test(cleanUrl);
        if (!hasDirectExt && !cleanUrl.includes('pinimg.com')) {
          return {
            valid: false,
            type: 'pinterest_webpage',
            error: 'Invalidated Pinterest Link: This is a Pinterest webpage link (pin.it / pin/...), not a direct image file. Hotlinking web pages inside cards is blocked by browser security. Please right-click the photo on Pinterest and choose "Copy Image Address" (URL must start with https://i.pinimg.com/... and end with .jpg), or upload the photo using the "Device / Showroom Photo" tab.'
          };
        }
        return {
          valid: true,
          type: 'pinterest_direct',
          src: cleanUrl,
          badge: '📌 Pinterest Image Asset',
          isDirectImage: true
        };
      }

      // 3. Google Drive Link
      const driveResolved = (window.SKPrimitives && window.SKPrimitives.resolveDriveAsset)
        ? window.SKPrimitives.resolveDriveAsset(cleanUrl, { cardWidth: 800 })
        : null;
      if (driveResolved && driveResolved.isDrive) {
        return {
          valid: true,
          type: 'drive',
          src: driveResolved.cardThumbnail,
          badge: '📁 Drive ID: ' + driveResolved.driveId,
          isDirectImage: true
        };
      }

      // 4. Data URL (Showroom / Camera upload)
      if (cleanUrl.startsWith('data:image/')) {
        return {
          valid: true,
          type: 'data_url',
          src: cleanUrl,
          badge: '📷 Showroom Photo',
          isDirectImage: true
        };
      }

      // 5. Direct Web Image with standard extension
      if (/^https?:\/\/.*\.(jpe?g|png|webp|avif|gif)($|\?)/i.test(cleanUrl)) {
        return {
          valid: true,
          type: 'web_image',
          src: cleanUrl,
          badge: '🌐 Direct Web Image',
          isDirectImage: true
        };
      }

      // 6. Generic HTML Webpage URL (Store product page, shopping cart, etc.)
      if (/^https?:\/\//i.test(cleanUrl)) {
        return {
          valid: false,
          type: 'webpage_not_image',
          error: 'Invalidated Link: This is a website page address, not a direct image file (.jpg/.png). Browsers block HTML pages inside photo cards. Please right-click the photo on that page and select "Copy Image Address", or use the "Device / Showroom Photo" tab.'
        };
      }

      return {
        valid: false,
        type: 'invalid_format',
        error: 'Invalid link format. Image URLs must begin with http:// or https://'
      };
    }

    const verifyDriveLink = () => {
      const url = driveInput ? driveInput.value.trim() : '';
      const alertEl = document.getElementById('skIntakeUrlAlert');
      if (alertEl) {
        alertEl.style.display = 'none';
        alertEl.className = 'sk-intake-alert';
        alertEl.textContent = '';
      }
      if (!url) return;

      const v = validateCandidateImageUrl(url);
      if (!v.valid) {
        if (proofCard) proofCard.style.display = 'none';
        if (alertEl) {
          alertEl.style.display = 'block';
          alertEl.className = 'sk-intake-alert is-error';
          alertEl.textContent = v.error || 'Invalidated link.';
        }
        showToast(v.error || 'Invalid link', '⚠️');
        return;
      }

      // Perform active image decode verification to detect blocked hotlinks (403/CORS/ORB)
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.className = 'sk-intake-alert is-warning';
        alertEl.textContent = 'Testing link connectivity and hotlink permissions...';
      }

      const testImg = new Image();
      testImg.referrerPolicy = 'no-referrer';
      let timedOut = false;
      const timeoutId = setTimeout(() => {
        timedOut = true;
        testImg.src = '';
        if (proofCard) proofCard.style.display = 'none';
        if (alertEl) {
          alertEl.style.display = 'block';
          alertEl.className = 'sk-intake-alert is-error';
          alertEl.textContent = '❌ Verification timed out. The remote host took too long or blocked hotlinked requests. Please upload the photo directly.';
        }
        showToast('Image load timed out', '⚠️');
      }, 7000);

      testImg.onload = () => {
        if (timedOut) return;
        clearTimeout(timeoutId);
        if (proofCard) proofCard.style.display = 'flex';
        if (proofImg) {
          proofImg.src = v.src;
          proofImg.setAttribute('referrerpolicy', 'no-referrer');
        }
        if (proofId) proofId.textContent = v.badge;
        if (alertEl) {
          alertEl.style.display = 'block';
          alertEl.className = 'sk-intake-alert is-success';
          alertEl.textContent = `✓ Valid direct image asset verified (${testImg.naturalWidth}×${testImg.naturalHeight}px)! Ready for card rendering.`;
        }
        showToast('Image link verified successfully!', '✓');
      };

      testImg.onerror = () => {
        if (timedOut) return;
        clearTimeout(timeoutId);
        if (proofCard) proofCard.style.display = 'none';
        if (alertEl) {
          alertEl.style.display = 'block';
          alertEl.className = 'sk-intake-alert is-error';
          alertEl.textContent = '❌ Invalidated Hotlink: The remote host blocked this image (HTTP 403 / anti-hotlinking / ORB). This link cannot be entertained. Please save/screenshot the image and upload it via "Device / Showroom Photo", or use a direct image CDN address.';
        }
        showToast('Invalidated hotlink (host blocked access)', '⚠️');
      };

      testImg.src = v.src;
    };

    if (btnVerifyDrive) btnVerifyDrive.addEventListener('click', verifyDriveLink);
    if (driveInput) driveInput.addEventListener('change', verifyDriveLink);

    if (btnSubmitOption) {
      btnSubmitOption.addEventListener('click', () => {
        const itemId = document.getElementById('skOptionItemId')?.value.trim() || '';
        const title = document.getElementById('skOptionTitle')?.value.trim() || 'New Candidate Look';
        const price = document.getElementById('skOptionPrice')?.value.trim() || '';
        const category = document.getElementById('skOptionCategory')?.value || 'other';
        const vendor = document.getElementById('skOptionVendor')?.value.trim() || '';
        const urlInput = driveInput ? driveInput.value.trim() : '';
        const alertEl = document.getElementById('skIntakeUrlAlert');

        const commitLook = (srcUrl, refUrl, optType) => {
          if (itemId) {
            const item = items.find(i => i.id === itemId);
            if (!itemCustomOptions[itemId]) {
              itemCustomOptions[itemId] = [];
            }
            const baseImgs = (item && item.images) ? item.images : [];
            const allCustom = itemCustomOptions[itemId] || [];
            const maxIdx = Math.max(0, ...baseImgs.map(img => img.optionIndex || 0), ...allCustom.map(opt => opt.optionIndex || 0));
            const nextOptIndex = maxIdx + 1;

            const newOption = {
              optionIndex: nextOptIndex,
              isDefault: false,
              label: title,
              src: srcUrl || (item && item.images && item.images[0] ? item.images[0].src : ''),
              referenceUrl: refUrl || urlInput,
              type: optType,
              store: vendor || (item ? item.store : ''),
              priceTier: price ? `₹${price}` : (item ? item.priceRange : ''),
              addedAt: new Date().toISOString()
            };

            itemCustomOptions[itemId].push(newOption);
            localStorage.setItem('sk_shopping_custom_options', JSON.stringify(itemCustomOptions));

            itemOptionSelected[itemId] = nextOptIndex;
            localStorage.setItem('sk_shopping_item_options', JSON.stringify(itemOptionSelected));

            if (typeof window.fsSetShoppingItemStatus === 'function') {
              window.fsSetShoppingItemStatus(itemId, {
                options: itemCustomOptions[itemId],
                selectedOptionIndex: nextOptIndex
              }).catch(err => console.warn('Firestore options sync skipped/offline:', err));
            }

            renderItems();
            showToast(`Candidate look "${title}" added for ${itemId}!`, '📸');
            window.closeOptionIntakeModal();
          } else {
            showToast(`Option "${title}" recorded!`, '🎉');
            window.closeOptionIntakeModal();
          }
        };

        if (localUploadedDataUrl) {
          commitLook(localUploadedDataUrl, '', 'showroom_upload');
        } else if (urlInput) {
          const v = validateCandidateImageUrl(urlInput);
          if (!v.valid) {
            if (alertEl) {
              alertEl.style.display = 'block';
              alertEl.className = 'sk-intake-alert is-error';
              alertEl.textContent = v.error;
            }
            showToast(v.error, '⚠️');
            return;
          }

          // Active pre-flight check before adding to catalog!
          btnSubmitOption.disabled = true;
          const origText = btnSubmitOption.textContent;
          btnSubmitOption.textContent = 'Verifying image...';
          const testImg = new Image();
          testImg.referrerPolicy = 'no-referrer';
          let timedOut = false;
          const timeoutId = setTimeout(() => {
            timedOut = true;
            testImg.src = '';
            btnSubmitOption.disabled = false;
            btnSubmitOption.textContent = origText;
            if (alertEl) {
              alertEl.style.display = 'block';
              alertEl.className = 'sk-intake-alert is-error';
              alertEl.textContent = '❌ Verification timed out. Remote host blocked access. Please upload the photo instead.';
            }
            showToast('Verification timed out', '⚠️');
          }, 6000);

          testImg.onload = () => {
            if (timedOut) return;
            clearTimeout(timeoutId);
            btnSubmitOption.disabled = false;
            btnSubmitOption.textContent = origText;
            commitLook(v.src, v.src, v.type);
          };

          testImg.onerror = () => {
            if (timedOut) return;
            clearTimeout(timeoutId);
            btnSubmitOption.disabled = false;
            btnSubmitOption.textContent = origText;
            if (alertEl) {
              alertEl.style.display = 'block';
              alertEl.className = 'sk-intake-alert is-error';
              alertEl.textContent = '❌ Invalidated Hotlink: The remote host rejected image loading (HTTP 403 Forbidden). Hotlinks and broken links cannot be entertained. Please upload via "Device / Showroom Photo".';
            }
            showToast('Invalidated hotlink rejected', '⚠️');
          };

          testImg.src = v.src;
        } else {
          if (alertEl) {
            alertEl.style.display = 'block';
            alertEl.className = 'sk-intake-alert is-error';
            alertEl.textContent = 'Please provide a valid direct image link or upload a photo.';
          }
          showToast('Please provide an image link or photo', '⚠️');
          return;
        }
      });
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