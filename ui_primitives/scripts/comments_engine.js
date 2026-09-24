/**
 * Sree Krushna Marriage OS — Collaborative Comments & Contextual Opinions Engine
 * Standard: STD-MOD-COMP-001 | SSOT: docs/references/SPEC-ARCH-CONTEXTUAL-COMMENTS-001.md — FKL-DI-023
 * Ruling: AC-DEC-2026-021 / AC-DEC-2026-046 / UI-DEC-2026-042 (P-CONTEXTUAL-COMMENTS-001)
 * Scope: Multi-tier comments, cross-option tagging (@Look N), in-drawer scope navigation,
 *        item-level aggregation, emoji reactions, stakeholder filtering, and real-time Firestore sync.
 */

(function(global) {
  'use strict';

  const STORAGE_KEY_COMMENTS = 'sk_option_comments_v1';
  const STORAGE_KEY_REACTIONS = 'sk_option_reactions_v1';

  // Seed sample comments for realistic family review out-of-the-box
  const SEED_COMMENTS = {
    'PLATE-01': [
      { id: 'c-01', author: 'Sree (Bride)', role: 'bride', roleIcon: '👰', text: 'The layered lotus petals and central brass kalasam are breathtaking! Can we ensure genuine bell metal vilakku lamps?', timestamp: 'Today at 09:15 AM', isInternal: false, entityId: 'PLATE-01', optionIndex: 0, targetTags: ['opt_0'] },
      { id: 'c-02', author: 'Sunita (Sister)', role: 'sisters', roleIcon: '👭', text: 'Looks exceptionally grand for photography! Make sure the havan pit has high smoke exhaust so eyes don’t sting during the 2-hour Vedic purnahuti.', timestamp: 'Today at 10:40 AM', isInternal: false, entityId: 'PLATE-01', optionIndex: 0, targetTags: ['opt_0'] },
      { id: 'c-03', author: 'Krushna (Host/Groom)', role: 'host', roleIcon: '👑', text: 'Tentage contractor verified that the 24ft lotus dome easily fits inside the Marquee hall with 4ft aisle clearance.', timestamp: 'Today at 11:05 AM', isInternal: true, entityId: 'PLATE-01', optionIndex: 0, targetTags: ['opt_0'] }
    ],
    'cluster_vivaha_pata': [
      { id: 'c-10', author: 'Sree (Bride)', role: 'bride', roleIcon: '👰', text: 'The crimson red Berhampuri Patta with temple border is timeless. Utkalika confirmed they have 3 fresh handloom pieces ready for our Day 1 visit.', timestamp: 'Yesterday at 04:30 PM', isInternal: false, entityId: 'cluster_vivaha_pata', optionIndex: 0, targetTags: ['opt_0'] },
      { id: 'c-11', author: 'Aparna (Sister)', role: 'sisters', roleIcon: '👭', text: 'Let us definitely pair it with a contrast mustard-gold pure raw silk blouse piece. Master Canteen weavers have antique zari options.', timestamp: 'Yesterday at 05:12 PM', isInternal: false, entityId: 'cluster_vivaha_pata', optionIndex: 0, targetTags: ['opt_0'] },
      { id: 'c-12', author: 'Patra Family (In-Laws)', role: 'inlaws', roleIcon: '🎁', text: 'Traditional Berhampuri silk is deeply auspicious for Telugu and Odia Vedic rites. We fully approve Option A.', timestamp: 'Yesterday at 06:45 PM', isInternal: false, entityId: 'cluster_vivaha_pata', optionIndex: 0, targetTags: ['opt_0'] }
    ]
  };

  const SEED_REACTIONS = {
    'PLATE-01': { love: 4, approve: 2, doubt: 1, blocker: 0, userReactions: ['love'] },
    'cluster_vivaha_pata': { love: 5, approve: 3, doubt: 0, blocker: 0, userReactions: ['love', 'approve'] }
  };

  class CommentsEngine {
    constructor() {
      this.comments = this._loadData(STORAGE_KEY_COMMENTS, SEED_COMMENTS);
      this.reactions = this._loadData(STORAGE_KEY_REACTIONS, SEED_REACTIONS);
      this.activeOptionId = null;
      this.activeContext = null;
      this.activeScope = 'all'; // 'all' or 'opt_0', 'opt_1', etc.
      this.activeFilterRole = 'all';

      this._initDomListeners();
    }

    _loadData(key, seed) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn('Storage read error for', key, e);
      }
      return Object.assign({}, seed);
    }

    _saveData(key, data) {
      try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.warn('Storage write error for', key, e); }
    }

    _initDomListeners() {
      if (typeof document === 'undefined') return;
      const bind = () => this._bindDomEvents();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
      } else {
        bind();
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const backdrop = document.getElementById('skCommentsDrawerBackdrop');
          const drawer = document.getElementById('skCommentsDrawer');
          if ((backdrop && backdrop.classList.contains('is-active')) || (drawer && drawer.classList.contains('is-active'))) {
            this.closeDrawer();
          }
        }
      });
    }

    _bindDomEvents() {
      const backdrop = document.getElementById('skCommentsDrawerBackdrop');
      const drawer = document.getElementById('skCommentsDrawer');
      const closeBtn = document.getElementById('skBtnCloseComments');
      const postBtn = document.getElementById('skBtnPostComment');
      const filtersWrap = document.getElementById('skStakeholderFilters');

      if (closeBtn) closeBtn.onclick = (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } this.closeDrawer(); };
      if (backdrop) backdrop.onclick = (e) => { if (e.target === backdrop) { if (e) { e.preventDefault(); e.stopPropagation(); } this.closeDrawer(); } };
      if (postBtn) postBtn.onclick = () => this._handlePostSubmit();

      ['love', 'approve', 'doubt', 'blocker'].forEach(type => {
        const btn = document.querySelector(`.sk-reaction-btn[data-reaction="${type}"]`);
        if (btn) btn.onclick = () => this._handleReactionClick(type);
      });

      if (filtersWrap) {
        filtersWrap.onclick = (e) => {
          const pill = e.target.closest('.sk-role-pill');
          if (!pill) return;
          filtersWrap.querySelectorAll('.sk-role-pill').forEach(p => p.classList.remove('is-active'));
          pill.classList.add('is-active');
          this.activeFilterRole = pill.dataset.role || 'all';
          this.renderCommentsList();
        };
      }
    }

    _resolveTargetContext(target, meta = {}) {
      if (typeof target === 'object' && target !== null) {
        const entityId = target.entityId || 'ENTITY';
        const activeIdx = Number.isInteger(target.activeOptionIndex) ? target.activeOptionIndex : null;
        return {
          entityId: entityId,
          activeOptionIndex: activeIdx,
          options: Array.isArray(target.options) ? target.options : [],
          title: target.title || meta.title || entityId,
          sub: target.subtitle || target.sub || meta.sub || 'Family Consensus & Remarks',
          badge: target.badge || meta.badge || (activeIdx !== null ? `Look ${activeIdx + 1}` : 'All Looks'),
          alignment: target.alignment || meta.alignment || '✨ Open for Remarks'
        };
      }
      const str = String(target || '');
      const match = str.match(/^(.+)_opt_(\d+)$/);
      if (match) {
        const optIdx = parseInt(match[2], 10);
        return {
          entityId: match[1], activeOptionIndex: optIdx, options: meta.options || [],
          title: meta.title || match[1], sub: meta.sub || 'Family Consensus & Remarks',
          badge: meta.badge || `Look ${optIdx + 1}`, alignment: meta.alignment || '✨ Open for Remarks'
        };
      }
      return {
        entityId: str || 'ENTITY', activeOptionIndex: null, options: meta.options || [],
        title: meta.title || str, sub: meta.sub || 'Family Consensus & Remarks',
        badge: meta.badge || str, alignment: meta.alignment || '✨ Open for Remarks'
      };
    }

    _extractOptionTags(text) {
      if (!text) return [];
      const tags = new Set();
      const regex = /@(look|option|opt)[-\s]*(\d+|all)/gi;
      let m;
      while ((m = regex.exec(text)) !== null) {
        const val = m[2].toLowerCase();
        if (val === 'all') tags.add('all');
        else tags.add('opt_' + (parseInt(val, 10) - 1));
      }
      return Array.from(tags);
    }

    _getAllItemComments(entityId) {
      if (!entityId) return [];
      const all = [];
      const prefix = entityId + '_opt_';
      const exactKey = entityId;
      const allKey = entityId + '_all';
      Object.keys(this.comments).forEach(k => {
        if (k === exactKey || k === allKey || k.startsWith(prefix)) {
          const list = this.comments[k];
          if (Array.isArray(list)) {
            list.forEach(c => {
              const item = Object.assign({}, c);
              if (!item._sourceKey) item._sourceKey = k;
              if (item.optionIndex === undefined && k.startsWith(prefix)) {
                item.optionIndex = parseInt(k.replace(prefix, ''), 10);
              }
              all.push(item);
            });
          }
        }
      });
      const seen = new Set();
      const deduped = [];
      all.forEach(c => {
        const id = c.id || JSON.stringify(c);
        if (!seen.has(id)) { seen.add(id); deduped.push(c); }
      });
      return deduped;
    }

    openDrawer(target, meta = {}) {
      this._bindDomEvents();
      this.activeContext = this._resolveTargetContext(target, meta);
      this.activeOptionId = (this.activeContext.activeOptionIndex !== null)
        ? `${this.activeContext.entityId}_opt_${this.activeContext.activeOptionIndex}`
        : this.activeContext.entityId;
      this.activeScope = (this.activeContext.activeOptionIndex !== null)
        ? `opt_${this.activeContext.activeOptionIndex}`
        : 'all';
      this.activeFilterRole = 'all';

      const backdrop = document.getElementById('skCommentsDrawerBackdrop');
      const drawer = document.getElementById('skCommentsDrawer');
      if (!backdrop && !drawer) return;

      const titleEl = document.getElementById('skCommentsDrawerTitle');
      const badgeEl = document.getElementById('skCommentsOptionBadge');
      const subEl = document.getElementById('skCommentsDrawerSub');
      const pillEl = document.getElementById('skCommentsAlignmentPill');

      if (titleEl) titleEl.textContent = this.activeContext.title;
      if (badgeEl) badgeEl.textContent = this.activeContext.badge;
      if (subEl) subEl.textContent = this.activeContext.sub;
      if (pillEl) pillEl.textContent = this.activeContext.alignment;

      const filtersWrap = document.getElementById('skStakeholderFilters');
      if (filtersWrap) {
        filtersWrap.querySelectorAll('.sk-role-pill').forEach(p => {
          p.classList.toggle('is-active', p.dataset.role === 'all');
        });
      }

      this.renderOptionNav();
      this.renderReactions();
      this.renderCommentsList();
      if (backdrop) backdrop.classList.add('is-active');
      if (drawer) drawer.classList.add('is-active');
    }

    closeDrawer() {
      const backdrop = document.getElementById('skCommentsDrawerBackdrop');
      if (backdrop) backdrop.classList.remove('is-active');
      const drawer = document.getElementById('skCommentsDrawer');
      if (drawer) drawer.classList.remove('is-active');
      this.activeOptionId = null;
      this.activeContext = null;
    }

    renderOptionNav() {
      const navEl = document.getElementById('skCommentsOptionNav');
      if (!navEl || !this.activeContext) return;

      const entityId = this.activeContext.entityId;
      const allComments = this._getAllItemComments(entityId);
      const totalCount = allComments.length;

      let options = this.activeContext.options || [];
      if (options.length === 0) {
        const foundIndices = new Set();
        allComments.forEach(c => { if (Number.isInteger(c.optionIndex)) foundIndices.add(c.optionIndex); });
        if (this.activeContext.activeOptionIndex !== null) foundIndices.add(this.activeContext.activeOptionIndex);
        options = Array.from(foundIndices).sort().map(idx => ({ index: idx, label: `Look ${idx + 1}` }));
      }

      let pillsHtml = `
        <button type="button" class="sk-opt-nav-pill ${this.activeScope === 'all' ? 'is-active' : ''}" data-scope="all">
          <span>🌐 All Looks</span> <strong class="sk-pill-count">${totalCount}</strong>
        </button>
      `;

      options.forEach(opt => {
        const optScope = `opt_${opt.index}`;
        const optCount = allComments.filter(c => {
          return c.optionIndex === opt.index || (c.targetTags && c.targetTags.includes(optScope));
        }).length;
        const isActive = this.activeScope === optScope;
        pillsHtml += `
          <button type="button" class="sk-opt-nav-pill ${isActive ? 'is-active' : ''}" data-scope="${optScope}">
            <span>${opt.label || `Look ${opt.index + 1}`}</span> <strong class="sk-pill-count">${optCount}</strong>
          </button>
        `;
      });

      navEl.innerHTML = pillsHtml;
      navEl.onclick = (e) => {
        const btn = e.target.closest('.sk-opt-nav-pill');
        if (!btn) return;
        this.selectScope(btn.dataset.scope);
      };
    }

    selectScope(scopeId) {
      this.activeScope = scopeId || 'all';
      if (this.activeContext) {
        const badgeEl = document.getElementById('skCommentsOptionBadge');
        if (this.activeScope === 'all') {
          this.activeOptionId = this.activeContext.entityId;
          if (badgeEl) badgeEl.textContent = 'All Looks';
        } else {
          const optIdx = parseInt(this.activeScope.replace('opt_', ''), 10);
          this.activeOptionId = `${this.activeContext.entityId}_opt_${optIdx}`;
          if (badgeEl) badgeEl.textContent = `Look ${optIdx + 1}`;
        }
      }
      this.renderOptionNav();
      this.renderReactions();
      this.renderCommentsList();
    }

    renderReactions() {
      if (!this.activeOptionId) return;
      const data = this.reactions[this.activeOptionId] || { love: 0, approve: 0, doubt: 0, blocker: 0, userReactions: [] };
      ['love', 'approve', 'doubt', 'blocker'].forEach(type => {
        const btn = document.querySelector(`.sk-reaction-btn[data-reaction="${type}"]`);
        if (!btn) return;
        const countEl = btn.querySelector('.count');
        if (countEl) countEl.textContent = data[type] || 0;
        const hasReacted = (data.userReactions || []).includes(type);
        btn.classList.toggle('user-reacted', hasReacted);
      });
    }

    _handleReactionClick(type) {
      if (!this.activeOptionId) return;
      if (!this.reactions[this.activeOptionId]) {
        this.reactions[this.activeOptionId] = { love: 0, approve: 0, doubt: 0, blocker: 0, userReactions: [] };
      }
      const data = this.reactions[this.activeOptionId];
      if (!data.userReactions) data.userReactions = [];

      const idx = data.userReactions.indexOf(type);
      if (idx >= 0) {
        data.userReactions.splice(idx, 1);
        data[type] = Math.max(0, (data[type] || 1) - 1);
      } else {
        data.userReactions.push(type);
        data[type] = (data[type] || 0) + 1;
      }

      this._saveData(STORAGE_KEY_REACTIONS, this.reactions);
      this.renderReactions();
    }

    renderCommentsList() {
      const stream = document.getElementById('skCommentsStream');
      if (!stream) return;

      const entityId = this.activeContext ? this.activeContext.entityId : this.activeOptionId;
      const allComments = this._getAllItemComments(entityId);

      let scopedList = allComments;
      if (this.activeScope && this.activeScope !== 'all') {
        const targetOptIdx = parseInt(this.activeScope.replace('opt_', ''), 10);
        scopedList = allComments.filter(c => {
          if (c.optionIndex === targetOptIdx) return true;
          if (c.targetTags && (c.targetTags.includes(this.activeScope) || c.targetTags.includes('all'))) return true;
          if (c._sourceKey && c._sourceKey.endsWith(`_opt_${targetOptIdx}`)) return true;
          return false;
        });
      }

      const filtered = (this.activeFilterRole === 'all')
        ? scopedList
        : scopedList.filter(c => c.role === this.activeFilterRole);

      const countEl = document.getElementById('skCountAll');
      if (countEl) countEl.textContent = scopedList.length;

      if (filtered.length === 0) {
        stream.innerHTML = `
          <div class="sk-comments-empty">
            <span class="sk-comments-empty-icon">💭</span>
            <p>No opinions posted yet under this filter.</p>
            <p style="font-size: 11px;">Be the first to share your recommendation!</p>
          </div>
        `;
        return;
      }

      stream.innerHTML = filtered.map(c => {
        const lookBadge = Number.isInteger(c.optionIndex) ? `<span class="sk-comment-look-badge">Look ${c.optionIndex + 1}</span>` : '';
        const tagBadges = (Array.isArray(c.targetTags) && c.targetTags.length > 0)
          ? `<div class="sk-comment-tags-row">${c.targetTags.map(t => `<span class="sk-comment-tag-pill">@Look ${t === 'all' ? 'All' : parseInt(t.replace('opt_', ''), 10) + 1}</span>`).join(' ')}</div>`
          : '';
        return `
        <div class="sk-comment-card ${c.isInternal ? 'is-internal' : ''}">
          <div class="sk-comment-top">
            <div class="sk-comment-author-wrap">
              <span class="sk-comment-avatar">${c.roleIcon || '👤'}</span>
              <span class="sk-comment-author">${c.author}</span>
              <span class="sk-comment-role-badge">${c.role ? c.role.toUpperCase() : 'FAMILY'}</span>
              ${lookBadge}
            </div>
            <div class="sk-comment-meta">
              ${c.isInternal ? '<span class="sk-comment-tier-tag">🔒 HOST ONLY</span>' : ''}
              <span class="sk-comment-time">${c.timestamp}</span>
            </div>
          </div>
          <p class="sk-comment-text">${c.text}</p>
          ${tagBadges}
        </div>`;
      }).join('');
    }

    _sanitizeText(str) {
      if (!str) return '';
      return String(str).slice(0, 500).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    _handlePostSubmit() {
      const input = document.getElementById('skCommentInput');
      const roleSelect = document.getElementById('skCommentRoleSelect');
      const internalCheck = document.getElementById('skCommentIsInternal');
      if (!input || !this.activeOptionId) return;

      const rawText = input.value.trim();
      if (!rawText) return;
      const text = this._sanitizeText(rawText);

      const role = roleSelect ? roleSelect.value : 'sisters';
      const isInternal = internalCheck ? internalCheck.checked : false;

      const roleMap = {
        bride: { label: 'Sree (Bride)', icon: '👰' }, sisters: { label: 'Sister (Family)', icon: '👭' },
        inlaws: { label: 'Patra Family (In-Laws)', icon: '🎁' }, elders: { label: 'Elder (Mama/Mami)', icon: '🪔' },
        host: { label: 'Krushna (Host/Groom)', icon: '👑' }
      };

      const authorInfo = roleMap[role] || { label: 'Family Member', icon: '👤' };
      const tags = this._extractOptionTags(text);

      let optIdx = null;
      if (this.activeScope && this.activeScope !== 'all') {
        optIdx = parseInt(this.activeScope.replace('opt_', ''), 10);
      } else if (this.activeContext && this.activeContext.activeOptionIndex !== null) {
        optIdx = this.activeContext.activeOptionIndex;
      }

      const entityId = this.activeContext ? this.activeContext.entityId : this.activeOptionId.split('_opt_')[0];

      const newComment = {
        id: 'c-' + Date.now(),
        author: authorInfo.label,
        role: role,
        roleIcon: authorInfo.icon,
        text: text,
        timestamp: 'Just now',
        isInternal: isInternal,
        entityId: entityId,
        optionIndex: optIdx,
        targetTags: tags
      };

      const storageKey = optIdx !== null ? `${entityId}_opt_${optIdx}` : `${entityId}_all`;

      if (!this.comments[storageKey]) {
        this.comments[storageKey] = [];
      }
      this.comments[storageKey].push(newComment);
      this._saveData(STORAGE_KEY_COMMENTS, this.comments);

      // Real-time Firestore sync bridge (AC-DEC-2026-041 / SK-007)
      if (typeof global.fsSetShoppingItemStatus === 'function') {
        global.fsSetShoppingItemStatus(entityId, {
          [`comments_${storageKey}`]: this.comments[storageKey]
        }).catch(err => console.warn('Firestore comments sync skipped:', err));
      }

      input.value = '';
      this.renderOptionNav();
      this.renderCommentsList();

      if (global.SKPrimitives && global.SKPrimitives.showToast) {
        global.SKPrimitives.showToast('Opinion posted and saved!', 2000);
      }
    }

    syncExternalComments(optionId, commentsList) {
      if (!optionId || !Array.isArray(commentsList)) return;
      this.comments[optionId] = commentsList;
      this._saveData(STORAGE_KEY_COMMENTS, this.comments);
      if (this.activeOptionId === optionId || (this.activeContext && this.activeContext.entityId === optionId)) {
        this.renderOptionNav();
        this.renderCommentsList();
      }
    }

    getCommentCount(target) {
      if (!target) return 0;
      if (target.includes('_opt_')) {
        const parts = target.split('_opt_');
        const entityId = parts[0];
        const optIdx = parseInt(parts[1], 10);
        const all = this._getAllItemComments(entityId);
        return all.filter(c => c.optionIndex === optIdx || (c.targetTags && c.targetTags.includes(`opt_${optIdx}`))).length;
      }
      return this._getAllItemComments(target).length;
    }
  }

  global.SKCommentsEngine = new CommentsEngine();
  global.openCommentsDrawer = function(target, meta) {
    if (global.SKCommentsEngine) {
      global.SKCommentsEngine.openDrawer(target, meta);
    }
  };
  global.closeCommentsDrawer = function() {
    if (global.SKCommentsEngine) {
      global.SKCommentsEngine.closeDrawer();
    } else {
      const backdrop = document.getElementById('skCommentsDrawerBackdrop');
      if (backdrop) backdrop.classList.remove('is-active');
      const drawer = document.getElementById('skCommentsDrawer');
      if (drawer) drawer.classList.remove('is-active');
    }
  };
})(typeof window !== 'undefined' ? window : this);
