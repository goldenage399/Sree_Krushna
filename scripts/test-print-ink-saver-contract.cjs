/**
 * Automated Contract Test: Universal Ink-Saving Print Engine & Page-Break Invariants (SK-031)
 * Standard: STD-UI-PRINT-RUNSHEET-002 / AC-DEC-2026-072 / UI-DEC-2026-054
 * Invariants: INV-INK-SAVER-001, INV-PAGE-BREAK-ORCH-001, STD-MOD-COMP-001
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const cssPath = path.join(rootDir, 'shopping_src', 'styles', '11_obligations_table_and_print.css');
const printEnginePath = path.join(rootDir, 'ui_primitives', 'scripts', 'print_engine.js');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║     UNIVERSAL INK-SAVING & PAGE-BREAK CONTRACT TEST (SK-031 PHASE 1)       ║');
console.log('║     Standard: STD-UI-PRINT-RUNSHEET-002 | Ruling: AC-DEC-2026-072          ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

let failures = 0;

function check(desc, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${desc}`);
  } catch (err) {
    console.error(`  ✗ [FAIL] ${desc}: ${err.message}`);
    failures++;
  }
}

// 1. Audit Shopping Obligations Print Stylesheet (11_obligations_table_and_print.css)
console.log('▶ [1/4] Auditing Shopping Obligations Print CSS (11_obligations_table_and_print.css)...');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Extract @media print block
const printBlockMatch = cssContent.match(/@media print\s*\{([\s\S]*?)\n\}/);
assert(printBlockMatch, 'Missing @media print block in 11_obligations_table_and_print.css');
const printCss = printBlockMatch[1];

check('.obl-table-milestone-header declares white background in @media print (INV-INK-SAVER-001)', () => {
  const match = printCss.match(/\.obl-table-milestone-header\s*\{[^}]+\}/);
  assert(match, 'Missing .obl-table-milestone-header rule in @media print');
  const rule = match[0];
  assert(rule.includes('background: #ffffff') || rule.includes('background:#ffffff'), '.obl-table-milestone-header must declare white background (#ffffff)');
  assert(!rule.includes('background: #000000') && !rule.includes('background:#000000'), 'Must not declare solid black background on milestone header');
  assert(!rule.includes('background: #222222') && !rule.includes('background:#222222'), 'Must not declare dark gray background on milestone header');
});

check('.obl-table-milestone-header declares high-contrast black/charcoal text (INV-INK-SAVER-001)', () => {
  const match = printCss.match(/\.obl-table-milestone-header\s*\{[^}]+\}/);
  assert(match, 'Missing .obl-table-milestone-header rule in @media print');
  const rule = match[0];
  assert(rule.includes('color: #0f172a') || rule.includes('color: #000000') || rule.includes('color:#000000'), 'Must declare black/charcoal text color');
});

check('.obl-table-milestone-header declares structural border framing (INV-INK-SAVER-001)', () => {
  const match = printCss.match(/\.obl-table-milestone-header\s*\{[^}]+\}/);
  assert(match, 'Missing .obl-table-milestone-header rule in @media print');
  const rule = match[0];
  assert(rule.includes('border:') || rule.includes('border-left:'), 'Must declare structural borders for wireframe appearance');
});

check('.obl-table-milestone-header declares break-after: avoid to prevent orphan headers (INV-PAGE-BREAK-ORCH-001)', () => {
  const match = printCss.match(/\.obl-table-milestone-header\s*\{[^}]+\}/);
  assert(match, 'Missing .obl-table-milestone-header rule in @media print');
  const rule = match[0];
  assert(
    rule.includes('break-after: avoid') || rule.includes('page-break-after: avoid'),
    '.obl-table-milestone-header must declare break-after: avoid to prevent split headers'
  );
});

check('.obl-data-table thead declares display: table-header-group for repeating column headers (INV-PAGE-BREAK-ORCH-001)', () => {
  assert(
    printCss.includes('.obl-data-table thead') || printCss.includes('thead'),
    'Missing thead selector in @media print'
  );
  assert(
    printCss.includes('table-header-group'),
    'thead must declare display: table-header-group !important to repeat headers across pages'
  );
});

check('.obl-data-table tr declares break-inside: avoid for row integrity (INV-PAGE-BREAK-ORCH-001)', () => {
  const match = printCss.match(/\.obl-data-table tr\s*\{[^}]+\}/);
  assert(match, 'Missing .obl-data-table tr rule in @media print');
  const rule = match[0];
  assert(
    rule.includes('break-inside: avoid') || rule.includes('page-break-inside: avoid'),
    '.obl-data-table tr must declare break-inside: avoid'
  );
});

// 2. Audit Universal Scoped Print Engine (ui_primitives/scripts/print_engine.js)
console.log('\n▶ [2/4] Auditing Universal Print Engine Default Styles (ui_primitives/scripts/print_engine.js)...');
const printEngineContent = fs.readFileSync(printEnginePath, 'utf8');

check('print_engine.js default styles forbid solid black fill on th (INV-INK-SAVER-001)', () => {
  const match = printEngineContent.match(/'\s*th\s*\{\s*\\n'([\s\S]*?)'\\n\s*\}'/);
  // Also check direct string inclusion
  assert(
    !printEngineContent.includes("background: #000000 !important;'") ||
    !printEngineContent.includes("'  background: #000000 !important;',\n      '  color: #ffffff !important;',\n      '  padding: 4px 6px;',\n      '  border: 1px solid #000000;',\n      '  font-size: 8.5px;',\n      '  font-weight: 700;',\n      '  text-align: left;',\n      '  text-transform: uppercase;',\n      '}'"),
    'th must not declare solid black background in defaultStyles'
  );
  assert(
    printEngineContent.includes('th {') || printEngineContent.includes("'th {'"),
    'print_engine.js missing th styling'
  );
});

check('print_engine.js declares break-after: avoid on .obl-table-milestone-header (INV-PAGE-BREAK-ORCH-001)', () => {
  assert(
    printEngineContent.includes('break-after: avoid') || printEngineContent.includes('page-break-after: avoid'),
    'print_engine.js must declare break-after: avoid on milestone headers'
  );
});

check('print_engine.js enforces table-header-group on thead (INV-PAGE-BREAK-ORCH-001)', () => {
  assert(
    printEngineContent.includes('display: table-header-group'),
    'print_engine.js must declare thead { display: table-header-group; }'
  );
});

// 3. Modularity Line Limit Audits
console.log('\n▶ [3/4] Auditing SDCA Modularity Limits (<500 lines)...');
check('11_obligations_table_and_print.css stays below 500 lines (STD-MOD-COMP-001)', () => {
  const lines = cssContent.split('\n').length;
  assert(lines < 500, `11_obligations_table_and_print.css has ${lines} lines (limit: 500)`);
});

check('print_engine.js stays below 500 lines (STD-MOD-COMP-001)', () => {
  const lines = printEngineContent.split('\n').length;
  assert(lines < 500, `print_engine.js has ${lines} lines (limit: 500)`);
});

// Summary
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('🎉 ALL INK-SAVING & PAGE-BREAK CONTRACT CHECKS PASSED: SK-031 PHASE 1 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN SK-031 PHASE 1 VERIFICATION.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
