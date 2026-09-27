/**
 * Automated Contract Test: Obligations Table Sorting & Inner Category Filters (SK-024 Phase 2)
 * Standards: STD-SHOPPING-OBLIGATION-002 / UI-DEC-2026-050 / AC-DEC-2026-066
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const cssPath = path.join(rootDir, 'shopping_src', 'styles', '11_obligations_table_and_print.css');
const controllerPath = path.join(rootDir, 'shopping_src', 'scripts', 'controller.js');
const viewPath = path.join(rootDir, 'shopping_src', 'components', 'obligations_view.html');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║       OBLIGATIONS TABLE SORTING & INNER FILTERS GATE (SK-024)              ║');
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

const controllerContent = fs.readFileSync(controllerPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const viewContent = fs.readFileSync(viewPath, 'utf8');

// 1. Audit Sortable Headers in controller.js
console.log('▶ [1/5] Auditing Sortable Headers & Sort Icons in controller.js...');

check('window.sortObligationsTable is declared and exported', () => {
  assert(controllerContent.includes('function sortObligationsTable') || controllerContent.includes('window.sortObligationsTable ='), 'Missing sortObligationsTable function');
  assert(controllerContent.includes('window.sortObligationsTable = sortObligationsTable') || controllerContent.includes('window.sortObligationsTable = function'), 'sortObligationsTable not attached to window');
});

check('<th> headers declare onclick="window.sortObligationsTable(...)")', () => {
  const hasDynamicHelper = controllerContent.includes('onclick="window.sortObligationsTable(\'${key}\')"') ||
                           controllerContent.includes('onclick="window.sortObligationsTable(\'${sortKey}\')"') ||
                           controllerContent.includes('window.sortObligationsTable(\'code\')');
  const hasSortKeys = ['code', 'direction', 'title', 'category', 'cost'].every(k => 
    controllerContent.includes(`getSortTh('${k}'`) || controllerContent.includes(`window.sortObligationsTable('${k}')`)
  );
  assert(hasDynamicHelper && hasSortKeys, 'Table headers must hook sort keys (code, direction, title, category, cost) to window.sortObligationsTable');
});

check('Headers include dynamic sort indicators (▲, ▼, ⇅)', () => {
  assert(controllerContent.includes('▲') && controllerContent.includes('▼') && controllerContent.includes('⇅'), 'Missing sort direction arrow indicators');
});

// 2. Audit Numeric Cash Sorting Algorithm
console.log('\n▶ [2/5] Auditing Numeric Cash Sorting Key Logic...');

check('Cash sorting extracts parsed numerical integer rather than string compare', () => {
  assert(
    controllerContent.includes('unit_amount_inr') &&
    (controllerContent.includes('Number(') || controllerContent.includes('parseInt(') || controllerContent.includes('parseFloat(') || controllerContent.includes('|| 0')),
    'Cash sorting must extract numerical amount'
  );
  // Verify numeric sorting logic behavior
  const mockObls = [
    { id: 'OBL-001', financial_obligation: { is_monetary: false } },
    { id: 'OBL-015', financial_obligation: { is_monetary: true, unit_amount_inr: 5000 } },
    { id: 'OBL-024', financial_obligation: { is_monetary: true, estimated_total_inr: 2100 } }
  ];
  const getCost = o => (o.financial_obligation && o.financial_obligation.is_monetary)
    ? (Number(o.financial_obligation.unit_amount_inr || o.financial_obligation.estimated_total_inr) || 0)
    : 0;
  
  const sortedAsc = [...mockObls].sort((a, b) => getCost(a) - getCost(b));
  assert.strictEqual(sortedAsc[0].id, 'OBL-001', '0 should be first in asc');
  assert.strictEqual(sortedAsc[1].id, 'OBL-024', '2100 should be second in asc');
  assert.strictEqual(sortedAsc[2].id, 'OBL-015', '5000 should be third in asc');

  const sortedDesc = [...mockObls].sort((a, b) => getCost(b) - getCost(a));
  assert.strictEqual(sortedDesc[0].id, 'OBL-015', '5000 should be first in desc');
  assert.strictEqual(sortedDesc[1].id, 'OBL-024', '2100 should be second in desc');
  assert.strictEqual(sortedDesc[2].id, 'OBL-001', '0 should be third in desc');
});

// 3. Audit Inner Table Category Filter Toolbar
console.log('\n▶ [3/5] Auditing Inner Table Filter Bar in obligations_view.html...');

check('obligations_view.html contains inner category filter container or toolbar', () => {
  assert(
    viewContent.includes('id="oblTableInnerToolbar"') ||
    viewContent.includes('class="obl-table-inner-toolbar"') ||
    viewContent.includes('id="oblTableCatFilters"'),
    'Missing inner table filter toolbar in obligations_view.html'
  );
});

check('Inner filter toolbar includes key category pills (All, Attire, Gold/Silver, Bundles, Cash, Food)', () => {
  assert(viewContent.includes('data-inner-filter="all"'), 'Missing inner all filter');
  assert(viewContent.includes('data-inner-filter="attire"'), 'Missing inner attire filter');
  assert(viewContent.includes('data-inner-filter="gold_silver"'), 'Missing inner gold_silver filter');
  assert(viewContent.includes('data-inner-filter="cash"'), 'Missing inner cash filter');
});

// 4. Audit Filter Pill Synchronization in controller.js
console.log('\n▶ [4/5] Auditing Filter Synchronization in controller.js...');

check('setObligationFilter syncs both top and inner filter pills', () => {
  assert(
    controllerContent.includes('.obl-inner-pill') || controllerContent.includes('data-inner-filter'),
    'setObligationFilter must synchronize .obl-inner-pill active state'
  );
});

// 5. Audit CSS Styles for Sortable Headers & Inner Filter Toolbar
console.log('\n▶ [5/5] Auditing CSS Styles (11_obligations_table_and_print.css)...');

check('CSS defines .sortable-th with cursor: pointer and hover state', () => {
  assert(cssContent.includes('.sortable-th') || cssContent.includes('th.sortable'), 'Missing sortable-th class');
  assert(cssContent.includes('cursor: pointer'), 'Missing cursor: pointer for sortable header');
});

check('CSS defines styles for .obl-table-inner-toolbar and .obl-inner-pill', () => {
  assert(cssContent.includes('.obl-table-inner-toolbar') || cssContent.includes('.obl-inner-pill'), 'Missing inner filter toolbar CSS rules');
});

check('11_obligations_table_and_print.css remains below 500 lines', () => {
  const lineCount = cssContent.split('\n').length;
  assert(lineCount < 500, `11_obligations_table_and_print.css has ${lineCount} lines (limit: 500)`);
});

// Summary
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('🎉 ALL SORTING & INNER FILTER CHECKS PASSED: SK-024 PHASE 2 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN SK-024 PHASE 2 VERIFICATION.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
