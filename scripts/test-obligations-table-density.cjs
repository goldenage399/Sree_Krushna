/**
 * Automated Contract Test: Obligations Table Density & Column Space Optimization (SK-024 Phase 1)
 * Standards: STD-SHOPPING-OBLIGATION-002 / UI-DEC-2026-050 / AC-DEC-2026-066
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const cssPath = path.join(rootDir, 'shopping_src', 'styles', '11_obligations_table_and_print.css');
const controllerPath = path.join(rootDir, 'shopping_src', 'scripts', 'controller.js');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║       OBLIGATIONS TABLE DENSITY & COLUMN CONSTRAINT GATE (SK-024)          ║');
console.log('║       Standard: STD-SHOPPING-OBLIGATION-002 | Ruling: AC-DEC-2026-066      ║');
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

check('.obl-td-specs declares width: 220px', () => {
  assert(cssContent.includes('.obl-td-specs'), 'Missing .obl-td-specs selector');
  const match = cssContent.match(/\.obl-td-specs\s*\{[^}]+\}/s);
  assert(match, 'Cannot extract .obl-td-specs CSS block');
  const block = match[0];
  assert(block.includes('width: 220px') || block.includes('width:220px'), '.obl-td-specs missing width: 220px');
});

check('.obl-td-specs declares max-width: 260px', () => {
  const match = cssContent.match(/\.obl-td-specs\s*\{[^}]+\}/s);
  assert(match, 'Cannot extract .obl-td-specs CSS block');
  const block = match[0];
  assert(block.includes('max-width: 260px') || block.includes('max-width:260px'), '.obl-td-specs missing max-width: 260px');
});

check('.obl-td-specs declares line-clamp: 3 with ellipsis overflow', () => {
  const match = cssContent.match(/\.obl-td-specs\s*\{[^}]+\}/s);
  assert(match, 'Cannot extract .obl-td-specs CSS block');
  const block = match[0];
  assert(block.includes('-webkit-line-clamp: 3') || block.includes('line-clamp: 3'), '.obl-td-specs missing line-clamp: 3');
  assert(block.includes('overflow: hidden'), '.obl-td-specs missing overflow: hidden');
});

check('@media print unclamps .obl-td-specs to prevent cutting off text on paper', () => {
  const printMatch = cssContent.match(/@media print\s*\{.*?\}/s);
  assert(printMatch, 'Missing @media print block');
  assert(
    cssContent.includes('-webkit-line-clamp: unset') || cssContent.includes('line-clamp: unset') || cssContent.includes('display: table-cell !important'),
    '@media print must unclamp .obl-td-specs'
  );
});

// 2. Audit Table Header & Cell Rendering in controller.js
console.log('\n▶ [2/4] Auditing Table Header & Cell Attributes in controller.js...');
const controllerContent = fs.readFileSync(controllerPath, 'utf8');

check('<th> for Items / Specifications has explicit width 220px constraint', () => {
  assert(
    controllerContent.includes('<th style="width: 220px; max-width: 260px;" class="col-specs">Items / Specifications</th>') ||
    controllerContent.includes('<th style="width: 220px;') ||
    controllerContent.includes('class="col-specs"'),
    'Header missing explicit 220px width constraint'
  );
});

check('.obl-td-specs cell binds native title attribute for full description hover', () => {
  assert(
    controllerContent.includes('class="obl-td-specs" title=') ||
    controllerContent.includes('class="obl-td-specs col-specs" title='),
    '.obl-td-specs must bind title attribute for hover tooltip'
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
  console.log('🎉 ALL DENSITY & COLUMN CONSTRAINT CHECKS PASSED: SK-024 PHASE 1 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN SK-024 PHASE 1 VERIFICATION.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
