/**
 * SAP Shared Architectural Patterns — UI Primitives: Print Engine
 * File: js/print_engine.js
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
    var noPrintEls = clone.querySelectorAll('.no-print, button, .sk-btn, .shop-btn, .btn, input, select');
    for (var i = 0; i < noPrintEls.length; i++) {
      noPrintEls[i].parentNode.removeChild(noPrintEls[i]);
    }

    // 4. Create Sandboxed Headless Iframe
    var iframe = document.createElement('iframe');
    iframe.id = '__sk_print_sandbox__';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-1000';

    document.body.appendChild(iframe);

    // 5. Construct Self-Contained Print Document
    var iframeDoc = iframe.contentWindow || iframe.contentDocument;
    if (iframeDoc.document) iframeDoc = iframeDoc.document;

    var signoffBlock = includeSignoff ? [
      '<div class="print-signoff-footer">',
      '  <div class="signoff-line"><strong>Coordinator / Lead:</strong> ___________________________</div>',
      '  <div class="signoff-line"><strong>Sign-Off / Approval:</strong> ___________________________</div>',
      '  <div class="signoff-line"><strong>Date / Time:</strong> ____ / ____ / 2026</div>',
      '</div>'
    ].join('\n') : '';

    var htmlContent = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '  <meta charset="utf-8">',
      '  <title>' + escapeHtml(title) + '</title>',
      '  <style>',
      '    @page {',
      '      size: ' + pageSize + ' ' + orientation + ';',
      '      margin: ' + margin + ';',
      '    }',
      '    * {',
      '      box-sizing: border-box;',
      '      -webkit-print-color-adjust: exact !important;',
      '      print-color-adjust: exact !important;',
      '    }',
      '    body {',
      '      margin: 0;',
      '      padding: 0;',
      '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
      '      color: #000000 !important;',
      '      background: #ffffff !important;',
      '      font-size: 9.5px;',
      '      line-height: 1.35;',
      '    }',
      '    .print-header {',
      '      margin-bottom: 12px;',
      '      padding-bottom: 8px;',
      '      border-bottom: 2px solid #000000;',
      '      display: flex;',
      '      justify-content: space-between;',
      '      align-items: flex-end;',
      '    }',
      '    .print-title {',
      '      font-size: 15px;',
      '      font-weight: 800;',
      '      text-transform: uppercase;',
      '      letter-spacing: 0.5px;',
      '      margin: 0;',
      '      color: #000000;',
      '    }',
      '    .print-subtitle {',
      '      font-size: 10px;',
      '      color: #444444;',
      '      margin-top: 3px;',
      '    }',
      '    .print-meta {',
      '      font-size: 8.5px;',
      '      color: #555555;',
      '      text-align: right;',
      '    }',
      '    table {',
      '      width: 100% !important;',
      '      border-collapse: collapse !important;',
      '      margin-bottom: 8px !important;',
      '      border: 1px solid #000000 !important;',
      '    }',
      '    th {',
      '      background: #000000 !important;',
      '      color: #ffffff !important;',
      '      font-size: 8.5px !important;',
      '      font-weight: 700 !important;',
      '      text-transform: uppercase !important;',
      '      padding: 4px 6px !important;',
      '      border: 1px solid #000000 !important;',
      '      text-align: left !important;',
      '    }',
      '    thead {',
      '      display: table-header-group !important;',
      '    }',
      '    tr {',
      '      page-break-inside: avoid !important;',
      '    }',
      '    td {',
      '      padding: 4px 6px !important;',
      '      border: 1px solid #cccccc !important;',
      '      font-size: 9px !important;',
      '      color: #000000 !important;',
      '      vertical-align: top !important;',
      '      background: #ffffff !important;',
      '    }',
      '    tbody tr:nth-child(even) td {',
      '      background: #fbfbfb !important;',
      '    }',
      '    .print-signoff-footer {',
      '      margin-top: 20px;',
      '      padding-top: 8px;',
      '      border-top: 1.5px dashed #000000;',
      '      display: flex;',
      '      justify-content: space-between;',
      '      font-size: 9px;',
      '      page-break-inside: avoid !important;',
      '    }',
      '    .signoff-line {',
      '      color: #000000;',
      '    }',
      '    .no-print, [data-no-print="true"] {',
      '      display: none !important;',
      '    }',
      '    ' + customCss,
      '  </style>',
      '</head>',
      '<body>',
      '  <div class="print-header">',
      '    <div>',
      '      <h1 class="print-title">' + escapeHtml(title) + '</h1>',
      '      <div class="print-subtitle">' + escapeHtml(subtitle) + '</div>',
      '    </div>',
      '    <div class="print-meta">',
      '      <div><strong>Orientation:</strong> A4 ' + orientation.toUpperCase() + '</div>',
      '      <div><strong>Page:</strong> Scoped Print Sandbox</div>',
      '    </div>',
      '  </div>',
      '  <div class="print-content">',
      clone.outerHTML,
      '  </div>',
      signoffBlock,
      '</body>',
      '</html>'
    ].join('\n');

    // 6. Write to Sandboxed Iframe
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

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

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Lifecycle-safe registration (INV-LIFECYCLE-02)
  window.skPrintContainer = skPrintContainer;
  window.sapPrintContainer = skPrintContainer;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      skPrintContainer: skPrintContainer,
      sapPrintContainer: skPrintContainer
    };
  }
})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
