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

  /**
   * Universal Scoped Container Print Function
   * @param {string|HTMLElement} target - CSS selector or DOM element to print
   * @param {Object} [options] - Configuration options
   * @param {string} [options.title] - Document header title
   * @param {string} [options.subtitle] - Header subtitle / timestamp
   * @param {'landscape'|'portrait'} [options.orientation='landscape'] - Page orientation
   * @param {string} [options.pageSize='A4'] - Paper size (e.g. 'A4')
   * @param {string} [options.margin='8mm 10mm'] - Print margins
   * @param {string} [options.customCss=''] - Additional CSS rules
   * @param {boolean} [options.includeSignoff=false] - Appends coordinator sign-off block
   * @returns {boolean} Whether print initiation succeeded
   */
  function skPrintContainer(target, options) {
    options = options || {};
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
    // Suppress screen-only buttons and tools inside the clone
    var noPrintEls = clone.querySelectorAll('.no-print, button, .sk-btn, .shop-btn, input, select');
    for (var i = 0; i < noPrintEls.length; i++) {
      noPrintEls[i].parentNode.removeChild(noPrintEls[i]);
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
      '  background: #000000 !important;',
      '  color: #ffffff !important;',
      '  padding: 4px 6px;',
      '  border: 1px solid #000000;',
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
      '  background: #222222 !important;',
      '  color: #ffffff !important;',
      '  padding: 4px 8px;',
      '  font-weight: 700;',
      '  font-size: 9.5px;',
      '  margin-top: 8px;',
      '  margin-bottom: 4px;',
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
    doc.write('<style>' + defaultStyles + '</style></head><body>');
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

  // Lifecycle-safe registration (INV-LIFECYCLE-02)
  window.skPrintContainer = skPrintContainer;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { skPrintContainer: skPrintContainer };
  }
})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
