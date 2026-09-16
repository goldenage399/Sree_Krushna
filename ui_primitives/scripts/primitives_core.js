/**
 * Sree Krushna Marriage OS — Universal UI Primitives Core Helper Library
 * Standard: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-019 / AC-DEC-2026-022
 * Scope: Zero-dependency DOM helpers for carousels, modals, toasts, Drive CDN normalization, and zoom/pan.
 */

(function(global) {
  'use strict';

  const SKPrimitives = {
    /**
     * Display a transient tactile toast message
     * @param {string} msg - The message to display
     * @param {number} duration - Milliseconds to stay visible (default: 2500)
     */
    showToast: function(msg, duration = 2500) {
      const toastEl = document.getElementById('skGlobalToast') || document.querySelector('.sk-toast');
      const textEl = document.getElementById('skToastMessage') || (toastEl ? toastEl.querySelector('.sk-toast-text') : null);
      if (!toastEl) return;
      
      if (textEl) textEl.textContent = msg;
      else toastEl.textContent = msg;
      
      toastEl.classList.add('is-visible');
      if (toastEl._timer) clearTimeout(toastEl._timer);
      toastEl._timer = setTimeout(function() {
        toastEl.classList.remove('is-visible');
      }, duration);
    },

    /**
     * Safely copy text to clipboard with modern fallback and optional toast notification
     * @param {string} text - Text to copy
     * @param {string} [feedbackMsg] - Optional message to show in toast
     * @returns {Promise<boolean>}
     */
    copyToClipboard: async function(text, feedbackMsg) {
      let ok = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          ok = true;
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          ok = document.execCommand('copy');
          document.body.removeChild(textArea);
        }
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        ok = false;
      }
      if (ok && feedbackMsg) {
        SKPrimitives.showToast(feedbackMsg);
      }
      return ok;
    },

    /**
     * Generate canonical, origin-aware URL for stakeholder standalone portals
     * Resolves BUG-SHARE-BASEURL-001 by guaranteeing target portal filename
     * @param {string} portalFile - e.g. 'shopping-registry.html', 'decision-registry.html'
     * @param {Object|string} [params] - Query parameter object or query string
     * @returns {string} Fully qualified canonical URL
     */
    getStakeholderUrl: function(portalFile, params) {
      const origin = (typeof window !== 'undefined' && window.location && window.location.origin) 
        ? window.location.origin 
        : 'https://sree-krushna-forever.web.app';
      let qs = '';
      if (typeof params === 'string') {
        qs = params.startsWith('?') ? params.substring(1) : params;
      } else if (params && typeof params === 'object') {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.set(key, params[key]);
          }
        });
        qs = searchParams.toString();
      }
      return `${origin}/${portalFile}${qs ? '?' + qs : ''}`;
    },

    /**
     * Universal Stakeholder Share Catalog (P-QUICK-SHARE-001)
     * @param {string} key
     * @returns {{ key: string, title: string, url: string, text: string, whatsappUrl: string }}
     */
    getStakeholderShare: function(key) {
      let url = '';
      let text = '';
      let title = '';

      switch (key) {
        case 'shopping-family':
          title = 'Family Shopping Review';
          url = SKPrimitives.getStakeholderUrl('shopping-registry.html', { mode: 'family' });
          text = `🌺 *Sree Krushna Marriage OS — Wedding Shopping Review*\nHelp us review and vote on the wedding trousseau, sarees, and 'Sara' gifting items for Bhubaneswar!\n👉 Tap to review: ${url}`;
          break;
        case 'shopping-sisters':
          title = "Sisters' Styling & Wardrobe Hub";
          url = SKPrimitives.getStakeholderUrl('shopping-registry.html', { mode: 'sisters' });
          text = `👭 *Sree Krushna Wedding — Sisters' Wardrobe & Styling Hub*\nHey! Here is the Bhubaneswar shopping checklist for our sarees, lehengas, and groom styling. Tap to vote on your favorites:\n👉 ${url}`;
          break;
        case 'shopping-vivaha-pata':
          title = 'Vivaha Pata & Khandua Attire';
          url = SKPrimitives.getStakeholderUrl('shopping-registry.html', { cluster: 'vivaha_pata', mode: 'family' });
          text = `👑 *Sree Krushna Wedding — Vivaha Pata & Khandua Review*\nHelp us choose the sacred wedding silks & Khandua Pata for the Lagna rituals:\n👉 Review & Vote: ${url}`;
          break;
        case 'shopping-groom-mandap':
          title = 'Groom Mandap Liturgical Attire';
          url = SKPrimitives.getStakeholderUrl('shopping-registry.html', { cluster: 'groom_mandap', mode: 'family' });
          text = `✨ *Sree Krushna Wedding — Groom Mandap Liturgical Attire*\nReview the authentic Odia Dhoti, Khandua Joda, and Mandap wear options:\n👉 Review & Vote: ${url}`;
          break;
        case 'decisions-family':
          title = 'Family Decor Consensus';
          url = SKPrimitives.getStakeholderUrl('decision-registry.html', { event: 'EVT-004', mode: 'family' });
          text = `🌺 *Sree Krushna Marriage OS — Family Decor Review*\nHelp us review and vote on our wedding decor concepts!\n👉 Tap to review: ${url}`;
          break;
        case 'decisions-mandap':
          title = 'Vivaha Mandap Decor Cluster';
          url = SKPrimitives.getStakeholderUrl('decision-registry.html', { event: 'EVT-004', cluster: 'mandap_structure', mode: 'family' });
          text = `🏛️ *Sree Krushna Wedding — Vivaha Mandap Design Consensus*\nReview and vote on the sacred Mandap floral & architectural themes:\n👉 Tap to vote: ${url}`;
          break;
        case 'decisions-sangeet':
          title = 'Sangeet Stage & Lighting Cluster';
          url = SKPrimitives.getStakeholderUrl('decision-registry.html', { event: 'EVT-003', cluster: 'sangeet_stage', mode: 'family' });
          text = `🪩 *Sree Krushna Wedding — Sangeet Stage & Lighting Consensus*\nVote on the Sangeet stage backdrop, trussing, and ambient lighting:\n👉 Tap to vote: ${url}`;
          break;
        case 'cockpit-hub':
          title = 'Decorator Negotiation Cockpit';
          url = SKPrimitives.getStakeholderUrl('decorator-cockpit.html');
          text = `🎪 *Sree Krushna Marriage OS — Decorator Cockpit*\nExecutive presentation and vendor quotation workspace:\n👉 View Cockpit: ${url}`;
          break;
        case 'intake-public':
          title = 'Proposal & Intake Studio';
          url = SKPrimitives.getStakeholderUrl('shopping-registry.html') + '#intake';
          text = `💡 *Sree Krushna Wedding — Idea & Shopping Drop*\nHave a saree recommendation or vendor quote? Drop it directly into our registry:\n👉 Submit Option: ${url}`;
          break;
        default:
          title = 'Sree Krushna Marriage OS';
          url = SKPrimitives.getStakeholderUrl('index.html');
          text = `👑 *Sree Krushna Marriage OS*\nSingle Source of Truth & Executive Control Tower:\n👉 Open OS: ${url}`;
      }

      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      return { key, title, url, text, whatsappUrl };
    },

    /**
     * Copy stakeholder share bundle to clipboard and notify
     * @param {string} key
     */
    copyStakeholderShare: function(key) {
      const share = SKPrimitives.getStakeholderShare(key);
      SKPrimitives.copyToClipboard(share.text, `Copied ${share.title} WhatsApp message to clipboard!`);
    },

    /**
     * Copy raw URL to clipboard
     * @param {string} keyOrUrl
     * @param {string} [label]
     */
    copyUrlToClipboard: function(keyOrUrl, label) {
      const url = (typeof keyOrUrl === 'string' && keyOrUrl.startsWith('http')) 
        ? keyOrUrl 
        : (SKPrimitives.getStakeholderShare(keyOrUrl).url);
      SKPrimitives.copyToClipboard(url, `Copied ${label || 'link'} to clipboard!`);
    },

    /**
     * Bind basic modal open/close accessibility triggers
     * @param {HTMLElement|string} modalElement - Backdrop element or selector
     * @param {Function} [onCloseCallback]
     */
    initModal: function(modalElement, onCloseCallback) {
      const el = typeof modalElement === 'string' ? document.querySelector(modalElement) : modalElement;
      if (!el) return;
      
      el.addEventListener('click', function(e) {
        if (e.target === el || e.target.classList.contains('sk-modal-close') || e.target.closest('.sk-modal-close')) {
          el.classList.remove('is-active');
          if (typeof onCloseCallback === 'function') onCloseCallback();
        }
      });
      
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && el.classList.contains('is-active')) {
          el.classList.remove('is-active');
          if (typeof onCloseCallback === 'function') onCloseCallback();
        }
      });
    },

    /**
     * Bind Zoom/Pan Engine to a Lightbox Image and Toolbar
     * @param {HTMLElement|string} imgElement 
     * @param {Object} [toolbarSelectors]
     * @returns {Object|null}
     */
    initLightboxZoom: function(imgElement, toolbarSelectors = {}) {
      const img = typeof imgElement === 'string' ? document.querySelector(imgElement) : imgElement;
      if (!img || !global.SKZoomPanEngine) return null;

      const badge = document.querySelector(toolbarSelectors.badge || '#skZoomBadge');
      
      const engine = new global.SKZoomPanEngine(img, {
        onTransformChange: function(state) {
          if (badge) badge.textContent = state.zoomPercent + '%';
        }
      });

      const btnZoomIn = document.querySelector(toolbarSelectors.zoomIn || '#skBtnZoomIn');
      const btnZoomOut = document.querySelector(toolbarSelectors.zoomOut || '#skBtnZoomOut');
      const btnFit = document.querySelector(toolbarSelectors.fit || '#skBtnFit');
      const btnReset = document.querySelector(toolbarSelectors.reset || '#skBtnReset');

      if (btnZoomIn) btnZoomIn.onclick = () => engine.zoomIn();
      if (btnZoomOut) btnZoomOut.onclick = () => engine.zoomOut();
      if (btnFit) btnFit.onclick = () => engine.fit();
      if (btnReset) btnReset.onclick = () => engine.reset();

      return engine;
    },

    /**
     * Resolve Google Drive link to high-speed CDN assets
     * @param {string} url 
     * @param {Object} [options]
     * @returns {Object}
     */
    resolveDriveAsset: function(url, options) {
      if (global.SKDriveNormalizer) {
        return global.SKDriveNormalizer.resolveAsset(url, options);
      }
      return { isDrive: false, url: url, cardThumbnail: url, zoomUrl: url };
    },

    /**
     * Open Collaborative Comments Drawer
     * @param {string} optionId 
     * @param {Object} [meta]
     */
    openComments: function(optionId, meta) {
      if (global.SKCommentsEngine) {
        global.SKCommentsEngine.openDrawer(optionId, meta);
      }
    },

    /**
     * Close Collaborative Comments Drawer
     */
    closeComments: function() {
      if (global.SKCommentsEngine) {
        global.SKCommentsEngine.closeDrawer();
      } else if (global.closeCommentsDrawer) {
        global.closeCommentsDrawer();
      } else {
        const backdrop = document.getElementById('skCommentsDrawerBackdrop');
        if (backdrop) backdrop.classList.remove('is-active');
        const drawer = document.getElementById('skCommentsDrawer');
        if (drawer) drawer.classList.remove('is-active');
      }
    },

    /**
     * Get comment count for an option
     * @param {string} optionId 
     * @returns {number}
     */
    getCommentCount: function(optionId) {
      if (global.SKCommentsEngine) {
        return global.SKCommentsEngine.getCommentCount(optionId);
      }
      return 0;
    }
  };

  global.SKPrimitives = SKPrimitives;
})(typeof window !== 'undefined' ? window : this);
