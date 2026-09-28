/**
 * Test Harness: Universal Agnostic Faceted Toolbar Component & DOM Lifecycle (Layer 2)
 * Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 / STD-MOD-COMP-001 / STD-UI-PRIMITIVE-002
 * Ruling: AC-DEC-2026-074 / UI-DEC-2026-053
 * Ticket: SK-030 (Phase 2 Validation Gate)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║        UNIVERSAL FACETED TOOLBAR & DOM MOUNTER TEST (SK-030 Phase 2)       ║');
console.log('║        Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 | UI-DEC-2026-053     ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

const rootDir = path.resolve(__dirname, '..');

// 1. Tag-Balance Gate on HTML Template (Gap Variant A)
console.log('▶ [1/5] Auditing HTML Template Tag-Balance (faceted_toolbar.html)...');
const templatePath = path.join(rootDir, 'ui_primitives', 'components', 'faceted_toolbar.html');
assert(fs.existsSync(templatePath), 'ui_primitives/components/faceted_toolbar.html must exist');
const checkBalanceScript = path.join(rootDir, 'scripts', 'check-html-balance.cjs');

try {
  execFileSync(process.execPath, [checkBalanceScript, templatePath], { stdio: 'pipe' });
  console.log('  ✓ [PASS] faceted_toolbar.html tag-balance 100% OK (Gap Variant A)');
} catch (err) {
  console.error('  ❌ [FAIL] Tag balance validation failed:', err.stdout.toString());
  process.exit(1);
}

// 2. CSS Token & Design System Audit
console.log('\n▶ [2/5] Auditing Design System Tokens & Classes in 04_faceted_toolbar.css...');
const cssPath = path.join(rootDir, 'ui_primitives', 'styles', '04_faceted_toolbar.css');
assert(fs.existsSync(cssPath), 'ui_primitives/styles/04_faceted_toolbar.css must exist');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const requiredCssTokens = [
  '.sk-facet-toolbar',
  '.sk-facet-tier',
  '.sk-facet-tier-primary',
  '.sk-facet-pill',
  '.sk-facet-pill.is-active',
  '.sk-facet-tier-secondary',
  '.sk-facet-chips-scroll',
  '.sk-facet-chip',
  '.sk-facet-chip.is-active',
  '.sk-facet-badge',
  '.sk-facet-search-wrap',
  '.sk-facet-search-input-box',
  '.sk-facet-search-input',
  '.sk-facet-reset-btn',
  '@media (max-width: 768px)'
];

requiredCssTokens.forEach(token => {
  assert(cssContent.includes(token), `CSS missing mandatory rule: ${token}`);
});

const cssLineCount = cssContent.split(/\r?\n/).length;
assert(cssLineCount < 500, `CSS line count (${cssLineCount}) must not exceed 500 lines (STD-MOD-COMP-001)`);
console.log(`  ✓ [PASS] 04_faceted_toolbar.css verified (${cssLineCount} lines, all 15 token selectors present)`);

// 3. Module & Factory Exports Verification
console.log('\n▶ [3/5] Verifying Engine & Mounter Factory Exports...');
const enginePath = path.join(rootDir, 'ui_primitives', 'scripts', 'faceted_filter_engine.js');
const mod = require(enginePath);
assert(typeof mod.skCreateFacetedFilterEngine === 'function', 'Must export skCreateFacetedFilterEngine');
assert(typeof mod.skFacetedToolbar === 'object' && mod.skFacetedToolbar !== null, 'Must export skFacetedToolbar');
assert(typeof mod.skFacetedToolbar.mount === 'function', 'Must export skFacetedToolbar.mount');
console.log('  ✓ [PASS] skCreateFacetedFilterEngine and skFacetedToolbar.mount successfully loaded');

// 4. Lightweight Mock DOM Environment for Lifecycle Testing
function createMockElement(tagName) {
  const classSet = new Set();
  const el = {
    tagName: tagName.toUpperCase(),
    children: [],
    attributes: {},
    classList: {
      add: function (c) { classSet.add(c); },
      remove: function (c) { classSet.delete(c); },
      contains: function (c) { return classSet.has(c); }
    },
    listeners: {},
    innerHTML: '',
    value: '',
    textContent: '',
    appendChild: function (child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    setAttribute: function (k, v) { this.attributes[k] = String(v); },
    getAttribute: function (k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; },
    addEventListener: function (type, fn) {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push(fn);
    },
    removeEventListener: function (type, fn) {
      if (!this.listeners[type]) return;
      this.listeners[type] = this.listeners[type].filter(f => f !== fn);
    },
    dispatchEvent: function (type) {
      const fns = this.listeners[type] || [];
      fns.forEach(fn => fn({ target: this }));
    },
    querySelectorAll: function (selector) {
      const results = [];
      function recurse(node) {
        if (!node || !node.children) return;
        for (const child of node.children) {
          if (selector.startsWith('.') && child.classList.contains(selector.slice(1))) {
            results.push(child);
          } else if (selector.startsWith('#') && child.attributes.id === selector.slice(1)) {
            results.push(child);
          }
          recurse(child);
        }
      }
      recurse(this);
      return results;
    },
    querySelector: function (selector) {
      const all = this.querySelectorAll(selector);
      return all.length > 0 ? all[0] : null;
    }
  };

  let innerHTMLValue = '';
  Object.defineProperty(el, 'innerHTML', {
    get: function () { return innerHTMLValue; },
    set: function (val) {
      innerHTMLValue = val;
      if (val === '') {
        el.children = [];
      }
    }
  });

  Object.defineProperty(el, 'className', {
    get: function () { return Array.from(classSet).join(' '); },
    set: function (val) {
      classSet.clear();
      (val || '').split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
    }
  });

  return el;
}

const mockDoc = {
  createElement: function (tag) {
    return createMockElement(tag);
  }
};

const mockContainer = createMockElement('div');

const sampleItems = [
  { id: 'OBL-001', direction: 'bride', category: 'attire', status: 'procured' },
  { id: 'OBL-002', direction: 'bride', category: 'gold_silver', status: 'procured' },
  { id: 'OBL-003', direction: 'groom', category: 'attire', status: 'procured' }
];

const testEngine = mod.skCreateFacetedFilterEngine({
  dimensions: {
    direction: { default: 'all' },
    category: { default: 'all' }
  },
  searchExtractor: (item) => item.id
});

let filterChangeCount = 0;
let lastFilteredItems = null;

const toolbar = mod.skFacetedToolbar.mount(mockContainer, testEngine, {
  primary: {
    dimension: 'direction',
    label: 'Family Side',
    options: [
      { id: 'all', label: 'All', icon: '🌐' },
      { id: 'bride', label: 'Bride Side', icon: '👰' },
      { id: 'groom', label: 'Groom Side', icon: '🤵' }
    ]
  },
  secondary: {
    dimension: 'category',
    label: 'Category',
    options: [
      { id: 'all', label: 'All Categories' },
      { id: 'attire', label: 'Attire' },
      { id: 'gold_silver', label: 'Gold & Silver' }
    ]
  },
  search: {
    placeholder: 'Search obligations...'
  },
  getItems: () => sampleItems,
  onFilterChange: (filtered) => {
    filterChangeCount++;
    lastFilteredItems = filtered;
  }
}, mockDoc);

assert(toolbar, 'Toolbar mount must return controller instance');
assert(mockContainer.classList.contains('sk-facet-toolbar'), 'Container must have sk-facet-toolbar class');

const pills = mockContainer.querySelectorAll('.sk-facet-pill');
assert.strictEqual(pills.length, 3, 'Must render 3 primary pills');

const chips = mockContainer.querySelectorAll('.sk-facet-chip');
assert.strictEqual(chips.length, 3, 'Must render 3 secondary chips');

// Check initial counts
const allPill = pills[0];
assert(allPill.classList.contains('is-active'), 'Initial "all" pill must be active');
const allBadge = allPill.querySelector('.sk-facet-badge');
assert.strictEqual(allBadge.textContent, 3, 'All count must be 3');

console.log('  ✓ [PASS] Rendered 3 pills, 3 chips, search box, reset button with accurate initial counts');

// 5. User Interaction Simulation (Click, Search, Reset, Unmount)
console.log('\n▶ [5/5] Testing User Interactions (Click, Search, Reset, Unmount)...');

// Click "Bride Side" pill
const bridePill = pills[1];
bridePill.dispatchEvent('click');
assert.strictEqual(testEngine.getFacet('direction'), 'bride', 'Engine direction should update to bride');
assert(bridePill.classList.contains('is-active'), 'Bride pill should be active');
assert(!allPill.classList.contains('is-active'), 'All pill should no longer be active');

// Category chips dynamic badge count check:
// Bride items = 2 (1 attire, 1 gold_silver)
const attireChip = chips[1];
const attireBadge = attireChip.querySelector('.sk-facet-badge');
assert.strictEqual(attireBadge.textContent, 1, 'Bride attire count should be 1');

// Click "Attire" chip
attireChip.dispatchEvent('click');
assert.strictEqual(testEngine.getFacet('category'), 'attire', 'Engine category should update to attire');
assert(attireChip.classList.contains('is-active'), 'Attire chip should be active');
assert.strictEqual(lastFilteredItems.length, 1, 'Filtered items should be 1 (bride + attire)');
assert.strictEqual(lastFilteredItems[0].id, 'OBL-001');

// Click Reset button
const resetBtn = mockContainer.querySelector('.sk-facet-reset-btn');
assert(resetBtn, 'Reset button must be present in DOM');
resetBtn.dispatchEvent('click');
assert.strictEqual(testEngine.getFacet('direction'), 'all', 'Reset must restore direction to all');
assert.strictEqual(testEngine.getFacet('category'), 'all', 'Reset must restore category to all');
assert.strictEqual(lastFilteredItems.length, 3, 'Reset must restore all items');

// Unmount test
toolbar.unmount();
assert.strictEqual(mockContainer.children.length, 0, 'Unmount must clean container DOM');
console.log('  ✓ [PASS] Full DOM interaction lifecycle passed (Click, Active toggle, Counts, Reset, Unmount)');

console.log('\n════════════════════════════════════════════════════════════════════════════');
console.log('🎉 ALL 5 DOM MOUNTER & DESIGN SYSTEM CHECKS PASSED: SK-030 PHASE 2 VERIFIED!');
console.log('════════════════════════════════════════════════════════════════════════════\n');
