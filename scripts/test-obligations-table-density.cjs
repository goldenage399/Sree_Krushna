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

// 3. Modularity Line Limit Check
console.log('\n▶ [3/4] Auditing SDCA Modularity & CSS Line Count...');
check('11_obligations_table_and_print.css stays below 500 lines (STD-MOD-COMP-001)', () => {
  const lineCount = cssContent.split('\n').length;
  assert(lineCount < 500, `11_obligations_table_and_print.css has ${lineCount} lines (limit: 500)`);
});

// Summary
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('🎉 ALL DENSITY & INNER CLAMP CHECKS PASSED: SK-029 PHASE 1 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN SK-029 PHASE 1 VERIFICATION.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
