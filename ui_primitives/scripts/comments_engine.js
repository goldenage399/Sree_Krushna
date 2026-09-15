/**
 * Sree Krushna Marriage OS — Collaborative Comments & Opinions Engine
 * Standard: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-021 / UI-DEC-2026-017
 * Scope: Multi-tier comments, emoji reactions, stakeholder filtering, and persistent discussion threads.
 */

(function(global) {
  'use strict';

  const STORAGE_KEY_COMMENTS = 'sk_option_comments_v1';
  const STORAGE_KEY_REACTIONS = 'sk_option_reactions_v1';

  // Seed sample comments for realistic family review out-of-the-box
  const SEED_COMMENTS = {
    'PLATE-01': [
      {
        id: 'c-01',
        author: 'Sree (Bride)',
        role: 'bride',
        roleIcon: '👰',
        text: 'The layered lotus petals and central brass kalasam are breathtaking! Can we ensure genuine bell metal vilakku lamps?',
        timestamp: 'Today at 09:15 AM',
        isInternal: false
      },
      {
        id: 'c-02',
        author: 'Sunita (Sister)',
        role: 'sisters',
        roleIcon: '👭',
        text: 'Looks exceptionally grand for photography! Make sure the havan pit has high smoke exhaust so eyes don’t sting during the 2-hour Vedic purnahuti.',
        timestamp: 'Today at 10:40 AM',
        isInternal: false
      },
      {
        id: 'c-03',
        author: 'Krushna (Host/Groom)',
        role: 'host',
        roleIcon: '👑',
        text: 'Tentage contractor verified that the 24ft lotus dome easily fits inside the Marquee hall with 4ft aisle clearance.',
        timestamp: 'Today at 11:05 AM',
        isInternal: true
      }
    ],
    'cluster_vivaha_pata': [
      {
        id: 'c-10',
        author: 'Sree (Bride)',
        role: 'bride',
        roleIcon: '👰',
        text: 'The crimson red Berhampuri Patta with temple border is timeless. Utkalika confirmed they have 3 fresh handloom pieces ready for our Day 1 visit.',
        timestamp: 'Yesterday at 04:30 PM',
        isInternal: false
      },
      {
        id: 'c-11',
        author: 'Aparna (Sister)',
        role: 'sisters',
        roleIcon: '👭',
        text: 'Let us definitely pair it with a contrast mustard-gold pure raw silk blouse piece. Master Canteen weavers have antique zari options.',
        timestamp: 'Yesterday at 05:12 PM',
        isInternal: false
      },
      {
        id: 'c-12',
        author: 'Patra Family (In-Laws)',
        role: 'inlaws',
        roleIcon: '🎁',
        text: 'Traditional Berhampuri silk is deeply auspicious for Telugu and Odia Vedic rites. We fully approve Option A.',
        timestamp: 'Yesterday at 06:45 PM',
        isInternal: false
      }
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
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn('Storage write error for', key, e);
      }
    }

    _initDomListeners() {
      if (typeof document === 'undefined') return;

      const bind = () => this._bindDomEvents();

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
      } else {
        bind();
      }

      // Universal Escape key listener
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

      if (closeBtn) {
        closeBtn.onclick = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          this.closeDrawer();
        };
      }

      if (backdrop) {
        backdrop.onclick = (e) => {
          if (e.target === backdrop) {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            this.closeDrawer();
          }
        };
      }

      if (postBtn) {
        postBtn.onclick = () => this._handlePostSubmit();
      }

      // Reaction buttons
      ['love', 'approve', 'doubt', 'blocker'].forEach(type => {
        const btn = document.querySelector(`.sk-reaction-btn[data-reaction="${type}"]`);
        if (btn) {
          btn.onclick = () => this._handleReactionClick(type);
        }
      });

      // Filter pills
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

    openDrawer(optionId, meta = {}) {
      this._bindDomEvents();
      this.activeOptionId = optionId;
      this.activeFilterRole = 'all';

      const backdrop = document.getElementById('skCommentsDrawerBackdrop');
      const drawer = document.getElementById('skCommentsDrawer');
      if (!backdrop && !drawer) return;

      const titleEl = document.getElementById('skCommentsDrawerTitle');
      const badgeEl = document.getElementById('skCommentsOptionBadge');
      const subEl = document.getElementById('skCommentsDrawerSub');
      const pillEl = document.getElementById('skCommentsAlignmentPill');

      if (titleEl) titleEl.textContent = meta.title || `Option ${optionId}`;
      if (badgeEl) badgeEl.textContent = meta.badge || optionId;
      if (subEl) subEl.textContent = meta.sub || 'Family Consensus & Remarks';
      if (pillEl) pillEl.textContent = meta.alignment || '✨ Open for Remarks';

      // Reset filters
      const filtersWrap = document.getElementById('skStakeholderFilters');
      if (filtersWrap) {
        filtersWrap.querySelectorAll('.sk-role-pill').forEach(p => {
          p.classList.toggle('is-active', p.dataset.role === 'all');
        });
      }

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

      const list = this.comments[this.activeOptionId] || [];
      const filtered = (this.activeFilterRole === 'all')
        ? list
        : list.filter(c => c.role === this.activeFilterRole);

      // Update total count
      const countEl = document.getElementById('skCountAll');
      if (countEl) countEl.textContent = list.length;

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

      stream.innerHTML = filtered.map(c => `
        <div class="sk-comment-card ${c.isInternal ? 'is-internal' : ''}">
          <div class="sk-comment-top">
            <div class="sk-comment-author-wrap">
              <span class="sk-comment-avatar">${c.roleIcon || '👤'}</span>
              <span class="sk-comment-author">${c.author}</span>
              <span class="sk-comment-role-badge">${c.role ? c.role.toUpperCase() : 'FAMILY'}</span>
            </div>
            <div class="sk-comment-meta">
              ${c.isInternal ? '<span class="sk-comment-tier-tag">🔒 HOST ONLY</span>' : ''}
              <span class="sk-comment-time">${c.timestamp}</span>
            </div>
          </div>
          <p class="sk-comment-text">${c.text}</p>
        </div>
      `).join('');
    }

    _handlePostSubmit() {
      const input = document.getElementById('skCommentInput');
      const roleSelect = document.getElementById('skCommentRoleSelect');
      const internalCheck = document.getElementById('skCommentIsInternal');
      if (!input || !this.activeOptionId) return;

      const text = input.value.trim();
      if (!text) return;

      const role = roleSelect ? roleSelect.value : 'sisters';
      const isInternal = internalCheck ? internalCheck.checked : false;

      const roleMap = {
        bride: { label: 'Sree (Bride)', icon: '👰' },
        sisters: { label: 'Sister (Family)', icon: '👭' },
        inlaws: { label: 'Patra Family (In-Laws)', icon: '🎁' },
        elders: { label: 'Elder (Mama/Mami)', icon: '🪔' },
        host: { label: 'Krushna (Host/Groom)', icon: '👑' }
      };

      const authorInfo = roleMap[role] || { label: 'Family Member', icon: '👤' };

      const newComment = {
        id: 'c-' + Date.now(),
        author: authorInfo.label,
        role: role,
        roleIcon: authorInfo.icon,
        text: text,
        timestamp: 'Just now',
        isInternal: isInternal
      };

      if (!this.comments[this.activeOptionId]) {
        this.comments[this.activeOptionId] = [];
      }
      this.comments[this.activeOptionId].push(newComment);
      this._saveData(STORAGE_KEY_COMMENTS, this.comments);

      input.value = '';
      this.renderCommentsList();

      if (global.SKPrimitives && global.SKPrimitives.showToast) {
        global.SKPrimitives.showToast('Opinion posted and saved!', 2000);
      }
    }

    getCommentCount(optionId) {
      const list = this.comments[optionId] || [];
      return list.length;
    }
  }

  global.SKCommentsEngine = new CommentsEngine();
  global.openCommentsDrawer = function(optionId, meta) {
    if (global.SKCommentsEngine) {
      global.SKCommentsEngine.openDrawer(optionId, meta);
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
