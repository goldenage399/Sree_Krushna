/**
 * Automated Contract Test: Obligations Table Density & Column Space Optimization (SK-024 / SK-029)
 * Standards: STD-SHOPPING-OBLIGATION-002 / UI-DEC-2026-050 / AC-DEC-2026-066 / STD-TABLE-BUDGET-001 / INV-TABLE-DOM-001 / AC-DEC-2026-071
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const cssPath = path.join(rootDir, 'shopping_src', 'styles', '11_obligations_table_and_print.css');
const controllerPath = path.join(rootDir, 'shopping_src', 'scripts', 'controller.js');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║       OBLIGATIONS TABLE DENSITY & INNER CLAMP GATE (SK-024 / SK-029)       ║');
console.log('║       Standard: STD-TABLE-BUDGET-001 | Ruling: AC-DEC-2026-071             ║');
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

// 1. Audit CSS Rules in 11_obligations_table_and_print.css
console.log('▶ [1/4] Auditing CSS Column Constraints & Line-Clamp (11_obligations_table_and_print.css)...');
const cssContent = fs.readFileSync(cssPath, 'utf8');

check('.obl-td-specs maintains native table-cell display (INV-TABLE-DOM-001)', () => {
  assert(cssContent.includes('.obl-td-specs'), 'Missing .obl-td-specs selector');
  const match = cssContent.match(/\.obl-td-specs\s*\{[^}]+\}/s);
  assert(match, 'Cannot extract .obl-td-specs CSS block');
  const block = match[0];
  assert(!block.includes('display: -webkit-box') && !block.includes('display:-webkit-box'), '.obl-td-specs must not declare display: -webkit-box directly on td');
});

check('.obl-specs-clamp declares line-clamp: 3 with ellipsis overflow', () => {
  assert(cssContent.includes('.obl-specs-clamp'), 'Missing .obl-specs-clamp selector');
  const match = cssContent.match(/\.obl-specs-clamp\s*\{[^}]+\}/s);
  assert(match, 'Cannot extract .obl-specs-clamp CSS block');
  const block = match[0];
  assert(block.includes('-webkit-line-clamp: 3') || block.includes('line-clamp: 3'), '.obl-specs-clamp missing line-clamp: 3');
  assert(block.includes('overflow: hidden'), '.obl-specs-clamp missing overflow: hidden');
});

check('@media print unclamps .obl-specs-clamp to prevent cutting off text on paper (INV-COLLAPSIBLE-PRINT-001)', () => {
  const printMatch = cssContent.match(/@media print\s*\{.*?\}/s);
  assert(printMatch, 'Missing @media print block');
  assert(
    cssContent.includes('-webkit-line-clamp: unset') || cssContent.includes('line-clamp: unset') || cssContent.includes('overflow: visible !important'),
    '@media print must unclamp .obl-specs-clamp'
  );
});

check('@media print enforces break-inside: avoid on .obl-data-table tr to prevent torn rows', () => {
  assert(
    cssContent.includes('.obl-data-table tr') && (cssContent.includes('break-inside: avoid') || cssContent.includes('page-break-inside: avoid')),
    '@media print must prevent row breaks inside .obl-data-table tr'
  );
});

// 2. Audit Table Header & Cell Rendering in controller.js
console.log('\n▶ [2/4] Auditing Table Header & Cell Attributes in controller.js...');
const controllerContent = fs.readFileSync(controllerPath, 'utf8');

check('<th> for Items / Specifications is declared in table header', () => {
  assert(
    controllerContent.includes('class="col-specs">Items / Specifications</th>') ||
    controllerContent.includes('>Items / Specifications</th>'),
    'Header missing Items / Specifications column'
  );
});

check('.obl-specs-clamp inner container is rendered inside .obl-td-specs cell', () => {
  assert(
    controllerContent.includes('<td class="obl-td-specs"><div class="obl-specs-clamp"'),
    'controller.js must render <div class="obl-specs-clamp"> inside <td class="obl-td-specs">'
  );
});

check('.obl-specs-clamp binds native title attribute for full description hover', () => {
  assert(
    controllerContent.includes('class="obl-specs-clamp" title=') ||
    controllerContent.includes('class="obl-td-specs" title='),
    'Must bind title attribute for hover tooltip'
  );
});

check('Zero "+N more" JS truncation code is introduced (Data Hiding Veto)', () => {
  assert(
    !controllerContent.includes('+N more') && !controllerContent.includes('more items') && !controllerContent.includes('more item'),
    'Must not include "+N more" truncation in controller.js'
  );
});

// 3. Proportional Budgeting & Multi-Viewport Styling (Phase 2 / STD-TABLE-BUDGET-001)
console.log('\n▶ [3/4] Auditing Proportional Table Budgeting & Responsive Viewport Rules...');

check('.obl-data-table declares table-layout: fixed (STD-TABLE-BUDGET-001)', () => {
  assert(cssContent.includes('.obl-data-table'), 'Missing .obl-data-table selector');
  const match = cssContent.match(/(?:^|\n)\.obl-data-table\s*\{[^}]+\}/s);
  assert(match, 'Cannot extract .obl-data-table CSS block');
  const block = match[0];
  assert(block.includes('table-layout: fixed'), '.obl-data-table must declare table-layout: fixed');
  assert(block.includes('width: 100%'), '.obl-data-table must declare width: 100%');
});

check('.shop-obl-table-container declares hardware-accelerated touch scroll', () => {
  const match = cssContent.match(/\.shop-obl-table-container\s*\{[^}]+\}/s);
  assert(match, 'Cannot extract .shop-obl-table-container CSS block');
  const block = match[0];
  assert(block.includes('overflow-x: auto'), 'Container missing overflow-x: auto');
  assert(block.includes('-webkit-overflow-scrolling: touch'), 'Container missing -webkit-overflow-scrolling: touch');
});

check('@media (max-width: 1024px) enforces min-width: 880px to prevent mobile squishing', () => {
  const match = cssContent.match(/@media\s*\(max-width:\s*1024px\)\s*\{[^}]+\.obl-data-table\s*\{[^}]+min-width:\s*880px[^}]+\}[^}]*\}/s);
  assert(match, 'Missing @media (max-width: 1024px) with .obl-data-table min-width: 880px');
});

check('controller.js allocates fluid proportional widths to Title (29%) and Specs (25%)', () => {
  assert(controllerContent.includes("width: 29%; min-width: 220px;"), 'Title missing width: 29% budget');
  assert(controllerContent.includes('style="width: 25%; min-width: 200px;" class="col-specs"'), 'Specs missing width: 25% budget');
});

// 4. Modularity Line Limit Check
console.log('\n▶ [4/4] Auditing SDCA Modularity & CSS Line Count...');
check('11_obligations_table_and_print.css stays below 500 lines (STD-MOD-COMP-001)', () => {
  const lineCount = cssContent.split('\n').length;
  assert(lineCount < 500, `11_obligations_table_and_print.css has ${lineCount} lines (limit: 500)`);
});

// Summary
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('🎉 ALL DENSITY, BUDGETING & VIEWPORT CHECKS PASSED: SK-029 PHASES 1 & 2 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN SK-029 VERIFICATION.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
