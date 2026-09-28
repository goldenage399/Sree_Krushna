/**
 * Sree Krushna Marriage OS — UI Primitives: Print Engine
 * File: ui_primitives/scripts/print_engine.js
 *
 * Standard: STD-UI-PRINT-CONTAINER-001 (Universal Scoped Container Print Engine)
 * Invariants:
 *  - INV-PRINT-ZERO-DUMP-001: Zero full-SPA multi-tab print dumps
 *  - INV-PRINT-IFRAME-SANDBOX-001: Sandboxed headless iframe isolation contract
 *  - INV-LIFECYCLE-02: Zero naked DOMContentLoaded listeners
 *
 * Provides a zero-bleed container printing utility that isolates target HTML
 * into a temporary hidden <iframe> with dedicated ink-saving A4 styles.
 */

(function (window, document) {
  'use strict';

  /** Universal Scoped Container Print Function (STD-UI-PRINT-CONTAINER-001 / STD-TABLE-COL-VIS-001) */
  function skPrintContainer(target, options) {
    options = options || {};
    var theme = (options.theme === 'tint' || options.theme === 'contrast') ? options.theme : 'eco';
    var pageBreaks = (options.pageBreaks === 'milestones' || options.pageBreaks === 'fluid') ? options.pageBreaks : 'cohesive';
    var title = options.title || document.title || 'Print Run Sheet';
    var subtitle = options.subtitle || ('Generated: ' + new Date().toLocaleString());
    var orientation = options.orientation === 'portrait' ? 'portrait' : 'landscape';
    var pageSize = options.pageSize || 'A4';
    var margin = options.margin || '8mm 10mm';
    var customCss = options.customCss || '';
    var includeSignoff = Boolean(options.includeSignoff);

    // 1. Resolve Target Element
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el || !(el instanceof HTMLElement)) {
      console.warn('[skPrintContainer] Target element not found or invalid:', target);
      return false;
    }

    // 2. Remove any lingering print sandbox
    var existingSandbox = document.getElementById('__sk_print_sandbox__');
    if (existingSandbox && existingSandbox.parentNode) {
      existingSandbox.parentNode.removeChild(existingSandbox);
    }

    // 3. Clone and Clean Target Content
    var clone = el.cloneNode(true);
    var noPrintEls = clone.querySelectorAll('.no-print, button, .sk-btn, .shop-btn, input, select');
    for (var i = 0; i < noPrintEls.length; i++) {
      noPrintEls[i].parentNode.removeChild(noPrintEls[i]);
    }

    // Physical DOM excision for confidential data masking (INV-TABLE-COL-MASK-001)
    if (typeof window !== 'undefined' && window.skColumnVisibilityEngine && (options.tableId || options.activeColumns)) {
      var tables = clone.querySelectorAll ? clone.querySelectorAll('table') : [];
      if (clone.tagName === 'TABLE') tables = [clone];
      var colsToUse = options.activeColumns || (options.tableId ? window.skColumnVisibilityEngine.getActiveColumns(options.tableId) : null);
      if (colsToUse && tables.length > 0) {
        for (var t = 0; t < tables.length; t++) {
          window.skColumnVisibilityEngine.filterTableDOMForPrint(tables[t], colsToUse);
        }
      }
    }

    // 4. Construct Headless Sandbox Iframe
    var iframe = document.createElement('iframe');
    iframe.id = '__sk_print_sandbox__';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    // 5. Assemble Dedicated Ink-Saving Print Stylesheet
    var defaultStyles = [
      '@page {',
      '  size: ' + pageSize + ' ' + orientation + ';',
      '  margin: ' + margin + ';',
      '}',
      '* {',
      '  box-sizing: border-box;',
      '  -webkit-print-color-adjust: exact !important;',
      '  print-color-adjust: exact !important;',
      '}',
      'body {',
      '  margin: 0;',
      '  padding: 0;',
      '  background: #ffffff !important;',
      '  color: #000000 !important;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
      '  font-size: 9.5px;',
      '  line-height: 1.35;',
      '}',
      '.sk-print-header {',
      '  border-bottom: 2px solid #000000;',
      '  padding-bottom: 6px;',
      '  margin-bottom: 10px;',
      '  display: flex;',
      '  justify-content: space-between;',
      '  align-items: flex-end;',
      '}',
      '.sk-print-title {',
      '  font-size: 14px;',
      '  font-weight: 800;',
      '  letter-spacing: 0.02em;',
      '  margin: 0;',
      '  color: #000000;',
      '}',
      '.sk-print-sub {',
      '  font-size: 8.5px;',
      '  color: #333333;',
      '  margin-top: 2px;',
      '}',
      '.sk-print-badge {',
      '  font-size: 8px;',
      '  font-weight: 700;',
      '  border: 1px solid #000000;',
      '  padding: 2px 6px;',
      '  border-radius: 3px;',
      '  text-transform: uppercase;',
      '}',
      'table {',
      '  width: 100%;',
      '  border-collapse: collapse;',
      '  margin-bottom: 12px;',
      '  page-break-inside: auto;',
      '}',
      'thead {',
      '  display: table-header-group;',
      '}',
      'tr {',
      '  page-break-inside: avoid;',
      '  page-break-after: auto;',
      '}',
      'th {',
      '  background: #f8fafc !important;',
      '  color: #000000 !important;',
      '  padding: 4px 6px;',
      '  border: 1.5px solid #000000;',
      '  font-size: 8.5px;',
      '  font-weight: 700;',
      '  text-align: left;',
      '  text-transform: uppercase;',
      '}',
      'td {',
      '  padding: 4px 6px;',
      '  border: 1px solid #cccccc;',
      '  vertical-align: top;',
      '  font-size: 9px;',
      '  color: #000000 !important;',
      '  background: #ffffff !important;',
      '}',
      'tr:nth-child(even) td {',
      '  background: #fafafa !important;',
      '}',
      '.obl-table-milestone-header {',
      '  background: #ffffff !important;',
      '  color: #0f172a !important;',
      '  border: 1.5px solid #0f172a;',
      '  border-left: 6px solid #0f172a;',
      '  padding: 5px 8px;',
      '  font-weight: 700;',
      '  font-size: 10px;',
      '  margin-top: 10px;',
      '  margin-bottom: 4px;',
      '  break-after: avoid;',
      '  page-break-after: avoid;',
      '}',
      '/* Print Theme Variants (STD-UI-PRINT-RUNSHEET-002) */',
      'body[data-print-theme="eco"] .obl-table-milestone-header {',
      '  background: #ffffff !important;',
      '  color: #0f172a !important;',
      '  border: 1.5px solid #0f172a !important;',
      '  border-left: 6px solid #0f172a !important;',
      '}',
      'body[data-print-theme="eco"] th {',
      '  background: #f8fafc !important;',
      '  color: #000000 !important;',
      '  border: 1.5px solid #000000 !important;',
      '}',
      'body[data-print-theme="tint"] .obl-table-milestone-header {',
      '  background: #f1f5f9 !important;',
      '  color: #0f172a !important;',
      '  border: 1.5px solid #64748b !important;',
      '  border-left: 6px solid #0f172a !important;',
      '}',
      'body[data-print-theme="tint"] th {',
      '  background: #e2e8f0 !important;',
      '  color: #0f172a !important;',
      '  border: 1.5px solid #64748b !important;',
      '}',
      'body[data-print-theme="contrast"] .obl-table-milestone-header {',
      '  background: #0f172a !important;',
      '  color: #ffffff !important;',
      '  border: 1.5px solid #0f172a !important;',
      '  border-left: 6px solid #000000 !important;',
      '}',
      'body[data-print-theme="contrast"] .obl-table-milestone-count {',
      '  background: #1e293b !important;',
      '  color: #f8fafc !important;',
      '  border-color: #475569 !important;',
      '}',
      'body[data-print-theme="contrast"] th {',
      '  background: #1e293b !important;',
      '  color: #ffffff !important;',
      '  border: 1.5px solid #0f172a !important;',
      '}',
      '/* Smart Cohesive Page-Break Packaging (STD-UI-PRINT-RUNSHEET-003 / INV-PAGE-COHESION-001) */',
      'body[data-print-pagebreak="cohesive"] .obl-table-milestone-block,',
      'body[data-print-pagebreak="cohesive"] .shop-table-group,',
      'body[data-print-pagebreak="cohesive"] .sk-print-cohesive-block,',
      '.sk-print-cohesive-block {',
      '  break-inside: avoid !important;',
      '  page-break-inside: avoid !important;',
      '}',
      'body[data-print-pagebreak="fluid"] .obl-table-milestone-block,',
      'body[data-print-pagebreak="fluid"] .shop-table-group,',
      'body[data-print-pagebreak="fluid"] .sk-print-cohesive-block {',
      '  break-inside: auto !important;',
      '  page-break-inside: auto !important;',
      '}',
      '/* Scoped Page Break Modes (INV-PAGE-BREAK-ORCH-001) */',
      'body[data-print-pagebreak="milestones"] .obl-table-milestone-block:not(:first-child),',
      'body[data-print-pagebreak="milestones"] .shop-table-group:not(:first-child),',
      'body[data-print-pagebreak="milestones"] .sk-print-cohesive-block:not(:first-child) {',
      '  break-before: page !important;',
      '  page-break-before: always !important;',
      '  margin-top: 0 !important;',
      '}',
      '.obl-verif-box, .verif-box {',
      '  display: inline-block;',
      '  width: 13px;',
      '  height: 13px;',
      '  border: 1.5px solid #000000;',
      '  border-radius: 2px;',
      '}',
      '.sk-print-signoff {',
      '  margin-top: 16px;',
      '  padding-top: 8px;',
      '  border-top: 1px dashed #666666;',
      '  display: flex;',
      '  justify-content: space-between;',
      '  font-size: 9px;',
      '  page-break-inside: avoid;',
      '}',
      '.no-print {',
      '  display: none !important;',
      '}',
      customCss
    ].join('\n');

    // 6. Write Content to Iframe Document
    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + title + '</title>');
    doc.write('<style>' + defaultStyles + '</style></head>');
    doc.write('<body data-print-theme="' + theme + '" data-print-pagebreak="' + pageBreaks + '">');
    doc.write('<header class="sk-print-header">');
    doc.write('<div><h1 class="sk-print-title">' + title + '</h1><div class="sk-print-sub">' + subtitle + '</div></div>');
    doc.write('<div><span class="sk-print-badge">' + orientation.toUpperCase() + ' RUN SHEET</span></div>');
    doc.write('</header>');
    doc.write('<main id="skPrintMain">' + clone.innerHTML + '</main>');

    if (includeSignoff) {
      doc.write('<footer class="sk-print-signoff">');
      doc.write('<div><strong>Physical Handover Verified by:</strong> ___________________________</div>');
      doc.write('<div><strong>Family Elder Sign-off:</strong> ___________________________</div>');
      doc.write('<div><strong>Date / Time:</strong> ____ / ____ / 2026</div>');
      doc.write('</footer>');
    }

    doc.write('</body></html>');
    doc.close();

    // 7. Trigger Execution & Cleanup
    setTimeout(function () {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error('[skPrintContainer] Execution failed:', err);
      }

      // Safe asynchronous garbage collection
      setTimeout(function () {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2500);
    }, 250);

    return true;
  }

  var PREFS_STORAGE_KEY = 'sk_print_options';

  /**
   * Retrieves persistent print preferences
   * @returns {Object} { theme, pageBreaks, orientation, includeSignoff }
   */
  function skGetPrintPreferences() {
    try {
      if (typeof localStorage !== 'undefined') {
        var raw = localStorage.getItem(PREFS_STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return {
              theme: parsed.theme === 'tint' || parsed.theme === 'contrast' ? parsed.theme : 'eco',
              pageBreaks: (parsed.pageBreaks === 'milestones' || parsed.pageBreaks === 'fluid') ? parsed.pageBreaks : 'cohesive',
              orientation: parsed.orientation === 'portrait' ? 'portrait' : 'landscape',
              includeSignoff: parsed.includeSignoff !== false
            };
          }
        }
      }
    } catch (e) {
      console.warn('[skGetPrintPreferences] Error reading preferences:', e);
    }
    return { theme: 'eco', pageBreaks: 'cohesive', orientation: 'landscape', includeSignoff: true };
  }

  /**
   * Saves persistent print preferences
   * @param {Object} prefs
   */
  function skSavePrintPreferences(prefs) {
    if (!prefs || typeof prefs !== 'object') return;
    try {
      if (typeof localStorage !== 'undefined') {
        var current = skGetPrintPreferences();
        var updated = {
          theme: prefs.theme || current.theme,
          pageBreaks: prefs.pageBreaks || current.pageBreaks,
          orientation: prefs.orientation || current.orientation,
          includeSignoff: prefs.includeSignoff !== undefined ? Boolean(prefs.includeSignoff) : current.includeSignoff
        };
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('[skSavePrintPreferences] Error saving preferences:', e);
    }
  }

  /**
   * Universal Pre-Print Options Dialog Orchestrator (STD-UI-LIFECYCLE-001)
   * Opens the universal print options modal, syncs preferences, and initiates printing.
   * @param {Object} config - { target, title, subtitle }
   */
  function skOpenPrintOptionsModal(config) {
    config = config || {};
    var backdrop = document.getElementById('skPrintOptionsModalBackdrop');
    if (!backdrop) {
      // Fallback: direct print with saved preferences if modal DOM is absent
      var fallbackPrefs = skGetPrintPreferences();
      skPrintContainer(config.target, {
        title: config.title,
        subtitle: config.subtitle,
        theme: fallbackPrefs.theme,
        pageBreaks: fallbackPrefs.pageBreaks,
        orientation: fallbackPrefs.orientation,
        includeSignoff: fallbackPrefs.includeSignoff
      });
      return;
    }

    var prefs = skGetPrintPreferences();

    // Sync radio controls
    var themeRadios = backdrop.querySelectorAll('input[name="skPrintTheme"]');
    for (var i = 0; i < themeRadios.length; i++) {
      themeRadios[i].checked = themeRadios[i].value === prefs.theme;
    }

    var pbRadios = backdrop.querySelectorAll('input[name="skPrintPageBreak"]');
    for (var j = 0; j < pbRadios.length; j++) {
      pbRadios[j].checked = pbRadios[j].value === prefs.pageBreaks;
    }

    var orientRadios = backdrop.querySelectorAll('input[name="skPrintOrientation"]');
    for (var k = 0; k < orientRadios.length; k++) {
      orientRadios[k].checked = orientRadios[k].value === prefs.orientation;
    }

    var signoffCheck = backdrop.querySelector('#skPrintSignoffCheckbox');
    if (signoffCheck) signoffCheck.checked = prefs.includeSignoff;

    // Mount Column Visibility section if tableId is provided (STD-TABLE-COL-VIS-001)
    if (config.tableId && typeof window !== 'undefined' && window.skColumnVisibilityEngine) {
      window.skColumnVisibilityEngine.mountModalSection(backdrop, config.tableId);
    } else {
      var colSec = backdrop.querySelector('#skPrintColumnSection');
      if (colSec) colSec.style.display = 'none';
    }

    // Modal state activation
    backdrop.classList.add('is-active');
    document.body.classList.add('sk-modal-open');

    function closeModal() {
      backdrop.classList.remove('is-active');
      document.body.classList.remove('sk-modal-open');
      window.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') closeModal();
    }
    window.addEventListener('keydown', handleKeydown);

    var closeBtn = backdrop.querySelector('#skPrintModalClose');
    if (closeBtn) closeBtn.onclick = closeModal;
    var cancelBtn = backdrop.querySelector('#skPrintModalCancel');
    if (cancelBtn) cancelBtn.onclick = closeModal;

    backdrop.onclick = function (e) {
      if (e.target === backdrop) closeModal();
    };

    var submitBtn = backdrop.querySelector('#skPrintModalSubmit');
    if (submitBtn) {
      submitBtn.onclick = function () {
        var selectedTheme = 'eco';
        var selectedPb = 'cohesive';
        var selectedOrient = 'landscape';
        var includeSignoff = true;

        var checkedTheme = backdrop.querySelector('input[name="skPrintTheme"]:checked');
        if (checkedTheme) selectedTheme = checkedTheme.value;

        var checkedPb = backdrop.querySelector('input[name="skPrintPageBreak"]:checked');
        if (checkedPb) selectedPb = checkedPb.value;

        var checkedOrient = backdrop.querySelector('input[name="skPrintOrientation"]:checked');
        if (checkedOrient) selectedOrient = checkedOrient.value;

        if (signoffCheck) includeSignoff = signoffCheck.checked;

        var activeCols = null;
        if (config.tableId && typeof window !== 'undefined' && window.skColumnVisibilityEngine) {
          activeCols = window.skColumnVisibilityEngine.getSelectedColumnsFromModal(backdrop);
        }

        var newPrefs = {
          theme: selectedTheme,
          pageBreaks: selectedPb,
          orientation: selectedOrient,
          includeSignoff: includeSignoff
        };
        skSavePrintPreferences(newPrefs);
        closeModal();

        setTimeout(function () {
          skPrintContainer(config.target, {
            title: config.title,
            subtitle: config.subtitle,
            theme: selectedTheme,
            pageBreaks: selectedPb,
            orientation: selectedOrient,
            includeSignoff: includeSignoff,
            tableId: config.tableId,
            activeColumns: activeCols
          });
        }, 120);
      };
    }
  }

  // Lifecycle-safe registration (INV-LIFECYCLE-02)
  window.skPrintContainer = skPrintContainer;
  window.skGetPrintPreferences = skGetPrintPreferences;
  window.skSavePrintPreferences = skSavePrintPreferences;
  window.skOpenPrintOptionsModal = skOpenPrintOptionsModal;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      skPrintContainer: skPrintContainer,
      skGetPrintPreferences: skGetPrintPreferences,
      skSavePrintPreferences: skSavePrintPreferences,
      skOpenPrintOptionsModal: skOpenPrintOptionsModal
    };
  }
})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
