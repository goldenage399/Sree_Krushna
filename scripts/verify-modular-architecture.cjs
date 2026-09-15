/**
 * Modular Component Architecture Verification Gate (STD-MOD-COMP-001)
 * Standard Reference: STD-MOD-COMP-001 / P-MOD-COMP-001
 * Ruling: AC-DEC-2026-019 / UI-DEC-2026-015
 * 
 * Enforces zero monolithic UI scripts, SDCA structure compliance,
 * per-source syntax validation, shared primitives presence, and 100% dual-release byte parity.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
let failures = 0;
let passes = 0;

function pass(msg) {
  console.log(`  ✓ [PASS] ${msg}`);
  passes++;
}

function fail(msg) {
  console.error(`  ❌ [FAIL] ${msg}`);
  failures++;
}

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║        MODULAR COMPONENT ARCHITECTURE & SDCA VERIFICATION GATE (STD)       ║');
console.log('║        Standard: STD-MOD-COMP-001 | AC-DEC-2026-019 / UI-DEC-2026-015      ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

// ----------------------------------------------------------------------------
// 1. Audit Script Directory for Monolithic HTML Builders (>500 lines)
// ----------------------------------------------------------------------------
console.log('▶ [1/5] Auditing scripts/ for Monolithic UI Builder Script Compliance (Max 500 lines)...');
const scriptsDir = path.join(rootDir, 'scripts');
// Per AC-DEC-2026-019: Governs user-facing HTML assemblers; data seeders are exempt
const builderFiles = fs.readdirSync(scriptsDir).filter(f => f.startsWith('build-') && f.includes('-html') && f.endsWith('.cjs'));

builderFiles.forEach(file => {
  const filePath = path.join(scriptsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lineCount = content.split(/\r?\n/).length;

  if (lineCount <= 500) {
    pass(`${file}: ${lineCount} lines (under 500-line modular limit)`);
  } else {
    fail(`${file}: ${lineCount} lines exceeds 500-line monolithic limit (STD-MOD-COMP-001 violation)`);
  }
});

// ----------------------------------------------------------------------------
// 2. Validate Mandatory SDCA Source Directory Trees
// ----------------------------------------------------------------------------
console.log('\n▶ [2/5] Auditing SDCA Module Source Trees (Template, Components, Styles, Controller)...');
const sdcaModules = ['cockpit_src', 'decision_registry_src', 'shopping_src'];

sdcaModules.forEach(mod => {
  const modDir = path.join(rootDir, mod);
  if (!fs.existsSync(modDir)) {
    fail(`Missing SDCA source directory: ${mod}`);
    return;
  }

  const templatePath = path.join(modDir, 'template.html');
  const buildPath = path.join(modDir, 'build.cjs');
  const stylesDir = path.join(modDir, 'styles');
  const scriptsDir = path.join(modDir, 'scripts');

  if (fs.existsSync(templatePath)) pass(`${mod}/template.html exists`);
  else fail(`${mod}/template.html missing`);

  if (fs.existsSync(buildPath)) pass(`${mod}/build.cjs exists`);
  else fail(`${mod}/build.cjs missing`);

  if (fs.existsSync(stylesDir) && fs.readdirSync(stylesDir).some(f => f.endsWith('.css'))) {
    pass(`${mod}/styles/ contains modular CSS partials`);
  } else {
    fail(`${mod}/styles/ missing or has no CSS partials`);
  }

  if (fs.existsSync(scriptsDir) && fs.existsSync(path.join(scriptsDir, 'controller.js'))) {
    pass(`${mod}/scripts/controller.js exists`);
  } else {
    fail(`${mod}/scripts/controller.js missing`);
  }
});

// ----------------------------------------------------------------------------
// 3. Per-Source JavaScript Syntax Gate (node -c)
// ----------------------------------------------------------------------------
console.log('\n▶ [3/5] Executing Per-Source Syntax Gate (node -c) on all Controllers & Primitives...');
const controllers = [
  path.join(rootDir, 'cockpit_src', 'scripts', 'controller.js'),
  path.join(rootDir, 'decision_registry_src', 'scripts', 'controller.js'),
  path.join(rootDir, 'shopping_src', 'scripts', 'controller.js'),
  path.join(rootDir, 'ui_primitives', 'scripts', 'primitives_core.js'),
  path.join(rootDir, 'ui_primitives', 'scripts', 'drive_normalizer.js'),
  path.join(rootDir, 'ui_primitives', 'scripts', 'zoom_pan_engine.js'),
  path.join(rootDir, 'ui_primitives', 'scripts', 'comments_engine.js')
];

controllers.forEach(ctrl => {
  const relPath = path.relative(rootDir, ctrl);
  try {
    execFileSync(process.execPath, ['-c', ctrl], { stdio: 'pipe' });
    pass(`${relPath} passed node -c syntax validation`);
  } catch (err) {
    fail(`${relPath} failed node -c syntax validation: ${err.message}`);
  }
});

// ----------------------------------------------------------------------------
// 4. Validate Universal Shared UI Primitives Engine (ui_primitives/)
// ----------------------------------------------------------------------------
console.log('\n▶ [4/5] Verifying Universal Shared UI Primitives Engine (ui_primitives/)...');
const primDir = path.join(rootDir, 'ui_primitives');
const expectedPrimitives = [
  'components/carousel.html',
  'components/lightbox.html',
  'components/stepper.html',
  'components/option_pod.html',
  'components/whatsapp_modal.html',
  'components/toast.html',
  'components/option_intake_modal.html',
  'components/comments_drawer.html',
  'styles/00_tokens_base.css',
  'styles/01_primitives.css',
  'styles/02_zoom_pan.css',
  'styles/03_comments_drawer.css',
  'scripts/primitives_core.js',
  'scripts/drive_normalizer.js',
  'scripts/zoom_pan_engine.js',
  'scripts/comments_engine.js'
];

expectedPrimitives.forEach(rel => {
  const fullPath = path.join(primDir, rel);
  if (fs.existsSync(fullPath)) {
    pass(`Primitive verified: ui_primitives/${rel}`);
  } else {
    fail(`Missing required UI primitive: ui_primitives/${rel}`);
  }
});

// ----------------------------------------------------------------------------
// 5. Dual-Release Distribution Byte Parity Audit
// ----------------------------------------------------------------------------
console.log('\n▶ [5/5] Auditing Dual-Release Distribution Byte-for-Byte Parity...');
const dualPairs = [
  ['decorator-cockpit.html', 'public/decorator-cockpit.html'],
  ['cockpit-fragment.html', 'public/cockpit-fragment.html'],
  ['decision-registry.html', 'public/decision-registry.html'],
  ['decision-registry-fragment.html', 'public/decision-registry-fragment.html'],
  ['shopping-registry.html', 'public/shopping-registry.html'],
  ['js/decision-registry-data.js', 'public/js/decision-registry-data.js'],
  ['js/shopping-data.js', 'public/js/shopping-data.js']
];

dualPairs.forEach(([rootRel, pubRel]) => {
  const rootFile = path.join(rootDir, rootRel);
  const pubFile = path.join(rootDir, pubRel);

  if (!fs.existsSync(rootFile) || !fs.existsSync(pubFile)) {
    fail(`Missing distribution target: ${rootRel} or ${pubRel}`);
    return;
  }

  const rootBuf = fs.readFileSync(rootFile);
  const pubBuf = fs.readFileSync(pubFile);

  if (rootBuf.equals(pubBuf)) {
    pass(`${rootRel} <──► ${pubRel}: 100% byte-for-byte identical (${rootBuf.length} bytes)`);
  } else {
    fail(`Byte parity drift detected between ${rootRel} (${rootBuf.length} B) and ${pubRel} (${pubBuf.length} B)`);
  }
});

// ----------------------------------------------------------------------------
// Summary & Exit Code
// ----------------------------------------------------------------------------
console.log('\n' + '═'.repeat(80));
if (failures === 0) {
  console.log(`🎉 ALL ${passes} MODULAR COMPONENT CHECKS PASSED: STD-MOD-COMP-001 100% COMPLIANT!`);
  console.log('═'.repeat(80) + '\n');
  process.exit(0);
} else {
  console.error(`💥 MODULAR COMPONENT GATE FAILED: ${failures} errors detected.`);
  console.log('═'.repeat(80) + '\n');
  process.exit(1);
}
