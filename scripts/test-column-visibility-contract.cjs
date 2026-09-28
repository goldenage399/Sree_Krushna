/**
 * Automated Contract Test: Universal Column Visibility & Print Data Masking Engine (SK-033)
 * Standard: STD-TABLE-COL-VIS-001 / INV-TABLE-COL-MASK-001 / STD-TABLE-BUDGET-001
 * Ruling: AC-DEC-2026-076 / UI-DEC-2026-056
 * Ticket: SK-033 (Phase 1 Validation Gate)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execFileSync } = require('child_process');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║     UNIVERSAL COLUMN VISIBILITY & DATA MASKING TEST (SK-033 PHASE 1)       ║');
console.log('║     Standard: STD-TABLE-COL-VIS-001 | Ruling: AC-DEC-2026-076              ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

const rootDir = path.resolve(__dirname, '..');
const enginePath = path.join(rootDir, 'ui_primitives', 'scripts', 'column_visibility_engine.js');

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

// 1. File Existence, Modularity Limits (<500 lines) & Syntax Gate
console.log('▶ [1/5] Auditing Module Existence, Line Limit & Syntax (column_visibility_engine.js)...');

check('column_visibility_engine.js exists on disk', () => {
  assert(fs.existsSync(enginePath), 'Missing ui_primitives/scripts/column_visibility_engine.js');
});

if (fs.existsSync(enginePath)) {
  const content = fs.readFileSync(enginePath, 'utf8');
  const lineCount = content.split(/\r?\n/).length;

  check(`column_visibility_engine.js stays strictly below 500 lines (${lineCount} lines / STD-MOD-COMP-001)`, () => {
    assert(lineCount < 500, `Line count (${lineCount}) exceeds 500 lines`);
  });

  check('column_visibility_engine.js passes node -c syntax check', () => {
    execFileSync(process.execPath, ['-c', enginePath], { stdio: 'pipe' });
  });
}

// 2. Export Contract Verification
console.log('\n▶ [2/5] Auditing Column Visibility Engine API Exports...');
let engine;
try {
  engine = require(enginePath);
} catch (e) {
  console.error(`  ✗ [FAIL] Cannot require column_visibility_engine.js: ${e.message}`);
  failures++;
}

if (engine) {
  const requiredMethods = [
    'registerTable',
    'getTableConfig',
    'getActiveColumns',
    'setActiveColumns',
    'applyPreset',
    'calculateRebalancedWidths',
    'filterTableDOMForPrint',
    'resetTableState'
  ];

  requiredMethods.forEach(method => {
    check(`Exports mandatory method: ${method}`, () => {
      assert(typeof engine[method] === 'function', `Missing export method: ${method}`);
    });
  });

  // 3. Table Registration & Preset Contract
  console.log('\n▶ [3/5] Auditing Table Registration & Role Presets Contract...');

  const sampleColumns = [
    { id: 'obl_id', label: 'ID', baseWidth: 8, defaultVisible: true },
    { id: 'milestone', label: 'Milestone', baseWidth: 14, defaultVisible: true },
    { id: 'title', label: 'Obligation Title', baseWidth: 22, defaultVisible: true },
    { id: 'direction', label: 'Direction', baseWidth: 12, defaultVisible: true },
    { id: 'category', label: 'Category', baseWidth: 14, defaultVisible: true },
    { id: 'specs', label: 'Specification & Units', baseWidth: 16, defaultVisible: true },
    { id: 'cost', label: 'Estimated Cash / Cost', baseWidth: 8, defaultVisible: true },
    { id: 'status', label: 'Fulfillment Status', baseWidth: 6, defaultVisible: true }
  ];

  const samplePresets = {
    full: ['obl_id', 'milestone', 'title', 'direction', 'category', 'specs', 'cost', 'status'],
    elder: ['milestone', 'title', 'direction', 'category', 'specs', 'status'], // Masks obl_id and cost
    vendor: ['obl_id', 'milestone', 'title', 'category', 'specs', 'status']     // Masks direction and cost
  };

  check('registerTable successfully registers table config and presets', () => {
    engine.registerTable('family-obligations', {
      columns: sampleColumns,
      presets: samplePresets
    });
    const cfg = engine.getTableConfig('family-obligations');
    assert(cfg, 'Configuration should be registered');
    assert.strictEqual(cfg.columns.length, 8, 'Should have 8 registered columns');
    assert(cfg.presets.elder, 'Should have elder preset');
  });

  check('getActiveColumns defaults to all defaultVisible columns', () => {
    const active = engine.getActiveColumns('family-obligations');
    assert.strictEqual(active.length, 8, 'Default should have all 8 columns');
    assert(active.includes('cost'), 'Default should include cost');
  });

  check('applyPreset("elder") masks confidential cost and technical ID', () => {
    const active = engine.applyPreset('family-obligations', 'elder');
    assert.strictEqual(active.length, 6, 'Elder preset should have 6 columns');
    assert(!active.includes('cost'), 'Elder preset must mask confidential cost column');
    assert(!active.includes('obl_id'), 'Elder preset must mask technical ID');
    assert(active.includes('title'), 'Elder preset must include title');
  });

  check('applyPreset("vendor") masks private family direction and confidential cost', () => {
    const active = engine.applyPreset('family-obligations', 'vendor');
    assert.strictEqual(active.length, 6, 'Vendor preset should have 6 columns');
    assert(!active.includes('cost'), 'Vendor preset must mask internal costs');
    assert(!active.includes('direction'), 'Vendor preset must mask family direction');
    assert(active.includes('obl_id'), 'Vendor preset must keep deliverable ID');
  });

  check('setActiveColumns persists custom column selection', () => {
    engine.setActiveColumns('family-obligations', ['title', 'specs', 'status']);
    const active = engine.getActiveColumns('family-obligations');
    assert.deepStrictEqual(active, ['title', 'specs', 'status']);
  });

  // 4. Mathematical Width Re-budgeting Invariant (STD-TABLE-BUDGET-001)
  console.log('\n▶ [4/5] Auditing Mathematical Width Re-budgeting (STD-TABLE-BUDGET-001)...');

  function sumWidths(resultMap) {
    let sum = 0;
    for (const key in resultMap) {
      sum += resultMap[key].percentage;
    }
    return Math.round(sum * 100) / 100;
  }

  check('All 8 columns rebalance to exactly 100.00% width', () => {
    const allKeys = sampleColumns.map(c => c.id);
    const rebalanced = engine.calculateRebalancedWidths(sampleColumns, allKeys);
    const sum = sumWidths(rebalanced);
    assert.strictEqual(sum, 100.00, `Expected sum 100.00%, got ${sum}%`);
  });

  check('Elder preset (6 columns, base sum 84%) rebalances proportionally to exactly 100.00%', () => {
    const elderKeys = samplePresets.elder;
    const rebalanced = engine.calculateRebalancedWidths(sampleColumns, elderKeys);
    const sum = sumWidths(rebalanced);
    assert.strictEqual(sum, 100.00, `Expected sum 100.00%, got ${sum}%`);

    // Ratio verification: title (22) vs status (6)
    const ratio = rebalanced.title.percentage / rebalanced.status.percentage;
    const expectedRatio = 22 / 6;
    assert(Math.abs(ratio - expectedRatio) < 0.05, `Ratio mismatch: got ${ratio}, expected ${expectedRatio}`);
  });

  check('Compact 3 columns (base sum 44%) rebalances proportionally to exactly 100.00%', () => {
    const compactKeys = ['title', 'specs', 'status']; // 22, 16, 6 -> sum 44
    const rebalanced = engine.calculateRebalancedWidths(sampleColumns, compactKeys);
    const sum = sumWidths(rebalanced);
    assert.strictEqual(sum, 100.00, `Expected sum 100.00%, got ${sum}%`);
  });

  check('Single active column rebalances to exactly 100.00%', () => {
    const singleKey = ['title'];
    const rebalanced = engine.calculateRebalancedWidths(sampleColumns, singleKey);
    assert.strictEqual(rebalanced.title.percentage, 100.00);
  });

  // 5. Physical DOM Excision Invariant (INV-TABLE-COL-MASK-001)
  console.log('\n▶ [5/5] Auditing Physical DOM Excision for Print Sandbox (INV-TABLE-COL-MASK-001)...');

  // Lightweight mock DOM table structure
  function createMockTable() {
    function createCell(tag, colKey, text) {
      return {
        tagName: tag.toUpperCase(),
        attributes: { 'data-col-key': colKey },
        textContent: text,
        style: {},
        parentNode: null,
        getAttribute: function(k) { return this.attributes[k] || null; },
        setAttribute: function(k, v) { this.attributes[k] = String(v); }
      };
    }

    function createRow(cells) {
      const row = {
        tagName: 'TR',
        children: cells,
        cells: cells,
        querySelectorAll: function(sel) {
          if (sel === 'th' || sel === 'td') return this.children;
          return [];
        },
        removeChild: function(child) {
          const idx = this.children.indexOf(child);
          if (idx !== -1) {
            this.children.splice(idx, 1);
            child.parentNode = null;
          }
        }
      };
      cells.forEach(c => { c.parentNode = row; });
      return row;
    }

    const headerCells = [
      createCell('th', 'obl_id', 'ID'),
      createCell('th', 'title', 'Title'),
      createCell('th', 'cost', 'Cost / Budget'),
      createCell('th', 'status', 'Status')
    ];

    const dataCells1 = [
      createCell('td', 'obl_id', 'OBL-024'),
      createCell('td', 'title', 'Cash Envelopes for In-Laws'),
      createCell('td', 'cost', '₹1,50,000 (Confidential)'),
      createCell('td', 'status', 'Pending')
    ];

    const dataCells2 = [
      createCell('td', 'obl_id', 'OBL-050'),
      createCell('td', 'title', 'Traditional Kancheepuram Silk'),
      createCell('td', 'cost', '₹45,000 (Confidential)'),
      createCell('td', 'status', 'Purchased')
    ];

    const headerRow = createRow(headerCells);
    const bodyRow1 = createRow(dataCells1);
    const bodyRow2 = createRow(dataCells2);

    const thead = {
      tagName: 'THEAD',
      children: [headerRow],
      querySelectorAll: function(sel) { return sel === 'th' ? headerRow.children : []; }
    };
    headerRow.parentNode = thead;

    const tbody = {
      tagName: 'TBODY',
      children: [bodyRow1, bodyRow2],
      querySelectorAll: function(sel) {
        if (sel === 'tr') return this.children;
        return [];
      }
    };
    bodyRow1.parentNode = tbody;
    bodyRow2.parentNode = tbody;

    const table = {
      tagName: 'TABLE',
      children: [thead, tbody],
      querySelector: function(sel) {
        if (sel === 'thead') return thead;
        if (sel === 'tbody') return tbody;
        return null;
      },
      querySelectorAll: function(sel) {
        if (sel === 'th') return thead.querySelectorAll('th');
        if (sel === 'tr') return [headerRow, bodyRow1, bodyRow2];
        if (sel === 'thead th') return thead.querySelectorAll('th');
        if (sel === 'tbody tr') return tbody.querySelectorAll('tr');
        return [];
      }
    };

    return { table, headerRow, bodyRow1, bodyRow2 };
  }

  check('filterTableDOMForPrint physically excises unselected columns from the DOM', () => {
    const { table, headerRow, bodyRow1, bodyRow2 } = createMockTable();

    // Active columns: only title and status (masks obl_id and confidential cost)
    const activeKeys = ['title', 'status'];

    const mockCols = [
      { id: 'obl_id', baseWidth: 15 },
      { id: 'title', baseWidth: 45 },
      { id: 'cost', baseWidth: 25 },
      { id: 'status', baseWidth: 15 }
    ];

    engine.filterTableDOMForPrint(table, activeKeys, mockCols);

    // 1. Headers pruned
    assert.strictEqual(headerRow.children.length, 2, 'Header must have exactly 2 columns left');
    const remainingHeaderKeys = headerRow.children.map(th => th.getAttribute('data-col-key'));
    assert.deepStrictEqual(remainingHeaderKeys, ['title', 'status']);

    // 2. Data rows pruned
    assert.strictEqual(bodyRow1.children.length, 2, 'Row 1 must have exactly 2 cells left');
    assert.strictEqual(bodyRow2.children.length, 2, 'Row 2 must have exactly 2 cells left');

    // 3. Confidential text completely gone
    const row1Texts = bodyRow1.children.map(td => td.textContent);
    assert(!row1Texts.some(t => t.includes('Confidential')), 'Confidential cost text must be physically deleted');
    assert(!row1Texts.some(t => t.includes('OBL-024')), 'Omitted ID text must be physically deleted');

    // 4. Remaining headers have rebalanced width styles applied
    const titleHeader = headerRow.children[0];
    const statusHeader = headerRow.children[1];
    assert(titleHeader.style.width, 'Remaining th must have width style');
    assert(statusHeader.style.width, 'Remaining th must have width style');
  });
}

// Summary
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('🎉 ALL COLUMN VISIBILITY CONTRACT CHECKS PASSED: SK-033 PHASE 1 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN COLUMN VISIBILITY CONTRACT SUITE`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
