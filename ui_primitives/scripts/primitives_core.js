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
     * Safely copy text to clipboard with modern fallback
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>}
     */
    copyToClipboard: async function(text) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          return successful;
        }
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
      }
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
