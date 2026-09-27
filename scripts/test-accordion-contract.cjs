/**
 * Automated Contract Verification Suite: Obligations Table Milestone Accordion
 * Standards: STD-UI-ACCORDION-001 / INV-COLLAPSIBLE-PRINT-001 / STD-MOD-COMP-001
 * Tickets: SK-025 / SK-022
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const CSS_FILE = path.join(REPO_ROOT, 'shopping_src', 'styles', '11_obligations_table_and_print.css');
const HTML_FILE = path.join(REPO_ROOT, 'shopping_src', 'components', 'obligations_view.html');
const CONTROLLER_FILE = path.join(REPO_ROOT, 'shopping_src', 'scripts', 'controller.js');

console.log('🔍 Auditing Obligations Table Milestone Accordion Contract (SK-025)...\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`  ❌ [FAIL] ${msg}`);
    failed = true;
  } else {
    console.log(`  ✓ [PASS] ${msg}`);
  }
}

// 1. Check file existence
assert(fs.existsSync(CSS_FILE), '11_obligations_table_and_print.css exists');
assert(fs.existsSync(HTML_FILE), 'obligations_view.html exists');
assert(fs.existsSync(CONTROLLER_FILE), 'controller.js exists');

if (!fs.existsSync(CSS_FILE) || !fs.existsSync(HTML_FILE) || !fs.existsSync(CONTROLLER_FILE)) {
  process.exit(1);
}

const css = fs.readFileSync(CSS_FILE, 'utf8');
const html = fs.readFileSync(HTML_FILE, 'utf8');
const js = fs.readFileSync(CONTROLLER_FILE, 'utf8');

// 2. CSS Affordance Checks
assert(
  css.includes('.obl-table-milestone-header') && css.includes('cursor: pointer'),
  '.obl-table-milestone-header declares cursor: pointer'
);

assert(
  css.includes('.obl-milestone-chevron'),
  'Declares .obl-milestone-chevron styling with rotation transition'
);

assert(
  css.includes('.obl-table-milestone-block.is-collapsed') && css.includes('display: none'),
  'Declares .obl-table-milestone-block.is-collapsed hiding data table'
);

// 3. Print Preservation Invariant (INV-COLLAPSIBLE-PRINT-001)
const printMediaIndex = css.lastIndexOf('@media print');
assert(printMediaIndex !== -1, 'Stylesheet includes @media print block');

if (printMediaIndex !== -1) {
  const printBlock = css.substring(printMediaIndex);
  assert(
    printBlock.includes('display: table !important') || printBlock.includes('.obl-data-table'),
    'INV-COLLAPSIBLE-PRINT-001: @media print forces unrolling of .obl-data-table even when collapsed'
  );
}

// 4. HTML Toolbar Affordance Checks
assert(
  html.includes('expandAllMilestones') && html.includes('collapseAllMilestones'),
  'obligations_view.html provides Expand All and Collapse All toolbar buttons'
);

// 5. Controller Functions & State Persistence Checks
assert(
  js.includes('toggleMilestoneAccordion'),
  'controller.js implements toggleMilestoneAccordion'
);

assert(
  js.includes('expandAllMilestones') && js.includes('collapseAllMilestones'),
  'controller.js exports expandAllMilestones and collapseAllMilestones'
);

assert(
  js.includes('localStorage') && js.includes('sk_obl_accordion_state'),
  'controller.js persists accordion open/collapsed state in localStorage'
);

assert(
  js.includes('data-milestone-id'),
  'controller.js binds data-milestone-id attribute to milestone block'
);

console.log('\n===============================================================');
if (failed) {
  console.error('❌ ACCORDION CONTRACT VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL ACCORDION CONTRACT CHECKS PASSED (100% GREEN)');
  process.exit(0);
}
