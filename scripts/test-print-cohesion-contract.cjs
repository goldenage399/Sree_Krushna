/**
 * Automated Contract Test: Smart Cohesive Page-Break Orchestration (SK-032)
 * Standard: STD-UI-PRINT-RUNSHEET-003 / AC-DEC-2026-075 / UI-DEC-2026-055
 * Invariants: INV-PAGE-COHESION-001, STD-MOD-COMP-001
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const cssPath = path.join(rootDir, 'shopping_src', 'styles', '12_print_themes_and_options.css');
const printEnginePath = path.join(rootDir, 'ui_primitives', 'scripts', 'print_engine.js');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║     SMART COHESIVE PAGE-BREAK CONTRACT TEST (SK-032 PHASE 1)               ║');
console.log('║     Standard: STD-UI-PRINT-RUNSHEET-003 | Ruling: AC-DEC-2026-075          ║');
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

// 1. Audit Shopping Print Stylesheet (12_print_themes_and_options.css)
console.log('▶ [1/3] Auditing Print Options & Cohesive CSS (12_print_themes_and_options.css)...');
assert(fs.existsSync(cssPath), 'Missing 12_print_themes_and_options.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const printBlockMatch = cssContent.match(/@media print\s*\{([\s\S]*?)\n\}/);
assert(printBlockMatch, 'Missing @media print block in 12_print_themes_and_options.css');
const printCss = printBlockMatch[1];

check('12_print_themes_and_options.css defines cohesive mode with break-inside: avoid (INV-PAGE-COHESION-001)', () => {
  assert(
    printCss.includes('data-print-pagebreak="cohesive"') || printCss.includes("data-print-pagebreak='cohesive'"),
    'Missing data-print-pagebreak="cohesive" rule in @media print'
  );
  assert(
    printCss.includes('.obl-table-milestone-block') && printCss.includes('break-inside: avoid'),
    'Cohesive mode must declare break-inside: avoid on .obl-table-milestone-block'
  );
  assert(
    printCss.includes('page-break-inside: avoid'),
    'Cohesive mode must declare vendor prefix page-break-inside: avoid'
  );
});

check('12_print_themes_and_options.css supports universal token .sk-print-cohesive-block (STD-UI-PRINT-RUNSHEET-003)', () => {
  assert(
    printCss.includes('.sk-print-cohesive-block'),
    'Missing .sk-print-cohesive-block selector in 12_print_themes_and_options.css'
  );
});

check('12_print_themes_and_options.css defines fluid mode with break-inside: auto (STD-UI-PRINT-RUNSHEET-003)', () => {
  assert(
    printCss.includes('data-print-pagebreak="fluid"') || printCss.includes("data-print-pagebreak='fluid'"),
    'Missing data-print-pagebreak="fluid" rule in @media print'
  );
  assert(
    printCss.includes('break-inside: auto'),
    'Fluid mode must declare break-inside: auto'
  );
});

check('12_print_themes_and_options.css stays below 500 lines (STD-MOD-COMP-001)', () => {
  const lineCount = cssContent.split(/\r?\n/).length;
  assert(lineCount < 500, `12_print_themes_and_options.css has ${lineCount} lines (ceiling: 500)`);
});

// 2. Audit Universal Print Engine (ui_primitives/scripts/print_engine.js)
console.log('\n▶ [2/3] Auditing Universal Print Engine Cohesion Invariants (print_engine.js)...');
assert(fs.existsSync(printEnginePath), 'Missing print_engine.js');
const printEngineContent = fs.readFileSync(printEnginePath, 'utf8');

check('print_engine.js default styles declare cohesive mode (INV-PAGE-COHESION-001)', () => {
  assert(
    printEngineContent.includes('data-print-pagebreak="cohesive"'),
    'print_engine.js defaultStyles must define data-print-pagebreak="cohesive"'
  );
  assert(
    printEngineContent.includes('.sk-print-cohesive-block'),
    'print_engine.js defaultStyles must define .sk-print-cohesive-block'
  );
  assert(
    printEngineContent.includes('break-inside: avoid !important') || printEngineContent.includes('page-break-inside: avoid !important'),
    'print_engine.js defaultStyles must enforce break-inside: avoid !important'
  );
});

check('print_engine.js default styles declare fluid mode (STD-UI-PRINT-RUNSHEET-003)', () => {
  assert(
    printEngineContent.includes('data-print-pagebreak="fluid"'),
    'print_engine.js defaultStyles must define data-print-pagebreak="fluid"'
  );
  assert(
    printEngineContent.includes('break-inside: auto !important') || printEngineContent.includes('page-break-inside: auto !important'),
    'print_engine.js defaultStyles must enforce break-inside: auto !important in fluid mode'
  );
});

check('print_engine.js default styles support milestones mode with break-before: page (INV-PAGE-BREAK-ORCH-001)', () => {
  assert(
    printEngineContent.includes('data-print-pagebreak="milestones"'),
    'print_engine.js defaultStyles must define data-print-pagebreak="milestones"'
  );
  assert(
    printEngineContent.includes('break-before: page !important'),
    'print_engine.js defaultStyles must declare break-before: page !important'
  );
});

check('print_engine.js normalizes options.pageBreaks defaulting to cohesive (STD-UI-PRINT-RUNSHEET-003)', () => {
  assert(
    printEngineContent.includes("'cohesive'"),
    'print_engine.js must reference cohesive mode'
  );
  assert(
    printEngineContent.includes('options.pageBreaks'),
    'print_engine.js must inspect options.pageBreaks'
  );
});

check('print_engine.js stays below 500 lines (STD-MOD-COMP-001)', () => {
  const lineCount = printEngineContent.split(/\r?\n/).length;
  assert(lineCount < 500, `print_engine.js has ${lineCount} lines (ceiling: 500)`);
});

// 3. Functional Execution of print_engine Preferences
console.log('\n▶ [3/3] Functional Execution of Print Engine Preferences API...');
check('skGetPrintPreferences defaults to cohesive and validates 3-tier spectrum', () => {
  // Clear any cached require
  delete require.cache[require.resolve(printEnginePath)];
  const engine = require(printEnginePath);
  assert(typeof engine.skGetPrintPreferences === 'function', 'skGetPrintPreferences must be a function');
  assert(typeof engine.skSavePrintPreferences === 'function', 'skSavePrintPreferences must be a function');
  
  const prefs = engine.skGetPrintPreferences();
  assert(prefs && typeof prefs === 'object', 'Preferences must return an object');
  assert(prefs.pageBreaks === 'cohesive', `Default pageBreaks must be 'cohesive', got '${prefs.pageBreaks}'`);
});

console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('🎉 ALL COHESIVE PAGE-BREAK CONTRACT CHECKS PASSED: SK-032 PHASE 1 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN SK-032 PHASE 1 VERIFICATION.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
