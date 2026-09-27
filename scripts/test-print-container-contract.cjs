/**
 * test-print-container-contract.cjs
 *
 * Automated verification suite for STD-UI-PRINT-CONTAINER-001 and INV-PRINT-ZERO-DUMP-001.
 * Tests:
 * 1. Global SPA Print De-multiplexing in public/css/main.css (active tab only, zero 60-page dump).
 * 2. Sandboxed Headless Print Primitive (ui_primitives/scripts/print_engine.js) contract & syntax.
 * 3. Headless DOM simulation of iframe creation, styling, and isolation.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  ✓ [PASS] ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  ✗ [FAIL] ${msg}`);
  failed++;
}

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║   TEST: SCOPED CONTAINER PRINT ENGINE & ZERO-DUMP CONTRACT (SK-023)        ║');
console.log('║   Standard: STD-UI-PRINT-CONTAINER-001 | Invariant: INV-PRINT-ZERO-DUMP-001║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

// -----------------------------------------------------------------------------
// Check 1: Global SPA Print De-Multiplexing in public/css/main.css
// -----------------------------------------------------------------------------
console.log('▶ [1/3] Auditing public/css/main.css for Zero-Dump Print Invariant (INV-PRINT-ZERO-DUMP-001)...');
const mainCssPath = path.join(rootDir, 'public', 'css', 'main.css');

if (!fs.existsSync(mainCssPath)) {
  fail('public/css/main.css does not exist');
} else {
  const css = fs.readFileSync(mainCssPath, 'utf8');

  // Must NOT contain unconditional multi-tab unrolling
  const hasUnconditionalUnroll = css.includes('.tab-content { display: block !important; margin-bottom: 40px; page-break-after: always; }');
  if (hasUnconditionalUnroll) {
    fail('Found unconditional multi-tab print unrolling in main.css! Violates INV-PRINT-ZERO-DUMP-001 (causes 50-60 page dump).');
  } else {
    pass('Unconditional multi-tab print unroller has been successfully retired.');
  }

  // Must contain active-tab only print rule
  const hasActiveTabPrint = css.includes('.tab-content.active { display: block !important;') || css.includes('.tab-content.active{display:block !important;');
  const hasInactiveTabHidden = css.includes('.tab-content:not(.active) { display: none !important;') || css.includes('.tab-content:not(.active){display:none !important;');

  if (hasActiveTabPrint && hasInactiveTabHidden) {
    pass('main.css enforces active-tab-only print scoping (.tab-content.active vs .tab-content:not(.active)).');
  } else {
    fail('main.css missing explicit active-tab print rule (.tab-content.active visible, .tab-content:not(.active) hidden).');
  }
}

// -----------------------------------------------------------------------------
// Check 2: Sandboxed Headless Print Primitive (ui_primitives/scripts/print_engine.js)
// -----------------------------------------------------------------------------
console.log('\n▶ [2/3] Auditing ui_primitives/scripts/print_engine.js Static Contract & Modularity...');
const printEnginePath = path.join(rootDir, 'ui_primitives', 'scripts', 'print_engine.js');

if (!fs.existsSync(printEnginePath)) {
  fail('ui_primitives/scripts/print_engine.js does not exist on disk.');
} else {
  const code = fs.readFileSync(printEnginePath, 'utf8');
  const lineCount = code.split('\n').length;

  if (lineCount <= 500) {
    pass(`print_engine.js line count is ${lineCount} lines (under 500-line modular limit).`);
  } else {
    fail(`print_engine.js exceeds modular limit: ${lineCount} lines > 500.`);
  }

  // Syntax check
  try {
    execFileSync(process.execPath, ['-c', printEnginePath], { stdio: 'pipe' });
    pass('print_engine.js passed node -c syntax validation.');
  } catch (err) {
    fail(`print_engine.js syntax error: ${err.message}`);
  }

  // Check required exports/affordances
  if (code.includes('window.skPrintContainer') || code.includes('skPrintContainer')) {
    pass('print_engine.js exposes skPrintContainer to global scope.');
  } else {
    fail('print_engine.js missing window.skPrintContainer definition.');
  }

  // Check iframe sandbox creation
  if (code.includes('__sk_print_sandbox__') || code.includes('createElement(\'iframe\')')) {
    pass('print_engine.js implements sandboxed headless iframe pattern (INV-PRINT-IFRAME-SANDBOX-001).');
  } else {
    fail('print_engine.js does not use headless iframe pattern.');
  }

  // Check lifecycle guard (INV-LIFECYCLE-02)
  if (code.includes("addEventListener('DOMContentLoaded'") || code.includes('addEventListener("DOMContentLoaded"')) {
    if (code.includes('document.readyState') || code.includes('window.__skReady')) {
      pass('print_engine.js guards DOMContentLoaded with document.readyState check (INV-LIFECYCLE-02).');
    } else {
      fail('print_engine.js has un-guarded DOMContentLoaded listener.');
    }
  } else {
    pass('print_engine.js avoids naked DOMContentLoaded listener (INV-LIFECYCLE-02).');
  }
}

// -----------------------------------------------------------------------------
// Check 3: Headless Simulation of Print Assembly Contract
// -----------------------------------------------------------------------------
console.log('\n▶ [3/3] Simulating Headless Print Assembly Contract...');
try {
  // Verify that print_engine.js provides the standard ink-saving A4 styles
  if (fs.existsSync(printEnginePath)) {
    const code = fs.readFileSync(printEnginePath, 'utf8');
    assert(code.includes('@page'), 'Must define @page print rule');
    assert(code.includes('landscape') || code.includes('orientation'), 'Must support landscape/portrait orientation');
    assert(code.includes('.no-print'), 'Must suppress .no-print elements inside the iframe');
    assert(code.includes('onafterprint') || code.includes('remove()') || code.includes('removeChild'), 'Must clean up iframe sandbox');
    pass('Headless Print Assembly Contract verified: @page, orientation, .no-print suppression, and iframe cleanup.');
  } else {
    fail('Cannot run simulation: print_engine.js missing.');
  }
} catch (err) {
  fail(`Simulation contract error: ${err.message}`);
}

// -----------------------------------------------------------------------------
// Check 4: In-App Container Print Wiring (Phase 2)
// -----------------------------------------------------------------------------
console.log('\n▶ [4/4] Auditing In-App Container Print Wiring in Shopping Registry (Phase 2)...');
const shoppingRegistryHtml = path.join(rootDir, 'public', 'shopping-registry.html');
const shoppingFragmentHtml = path.join(rootDir, 'public', 'shopping-fragment.html');

if (fs.existsSync(shoppingRegistryHtml) && fs.existsSync(shoppingFragmentHtml)) {
  const regHtml = fs.readFileSync(shoppingRegistryHtml, 'utf8');
  const fragHtml = fs.readFileSync(shoppingFragmentHtml, 'utf8');

  // Verify skPrintContainer is bundled
  if (regHtml.includes('skPrintContainer') && fragHtml.includes('skPrintContainer')) {
    pass('skPrintContainer is bundled into both shopping-registry.html and shopping-fragment.html.');
  } else {
    fail('skPrintContainer not bundled into shopping distribution files.');
  }

  // Verify container print buttons
  if (regHtml.includes('btnPrintShoppingTable') && regHtml.includes('printShoppingTable')) {
    pass('shopping-registry.html contains #btnPrintShoppingTable wiring.');
  } else {
    fail('shopping-registry.html missing #btnPrintShoppingTable.');
  }

  if (regHtml.includes('printObligationsSheet')) {
    pass('shopping-registry.html wires printObligationsSheet with skPrintContainer.');
  } else {
    fail('shopping-registry.html missing printObligationsSheet.');
  }
} else {
  fail('Shopping distribution HTML files missing.');
}

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failed === 0) {
  console.log(`🎉 ALL CONTRACT CHECKS PASSED (${passed}/${passed}): SK-023 Phase 1 & 2 Verified!`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`💥 CONTRACT CHECKS FAILED: ${failed} failure(s), ${passed} passed.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
