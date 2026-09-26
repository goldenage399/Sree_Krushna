#!/usr/bin/env node
/**
 * scripts/verify-ui-button-primitives.cjs
 * Pre-Flight Verification Gate: Universal UI Button Primitives & Zero Naked Buttons
 *
 * Standard Reference: STD-UI-PRIMITIVE-002 | Ruling: AC-DEC-2026-047 / UI-DEC-2026-043
 * SSOT: docs/references/SPEC-ARCH-BUTTON-PRIMITIVES-001.md (FKL-AL-008 / FKL-WI-005)
 * Standard Pattern: P-BUTTON-PRIMITIVE-GATE-001 | Ticket: SK-010
 *
 * Invariants Checked:
 *   1. INV-BTN-01: Zero Naked / Unstyled <button> Tags
 *      Every <button> tag in component templates and production HTML must have
 *      at least one recognized design system class attribute from the approved whitelist.
 *
 *   2. INV-BTN-02: Zero Orphan Button Classes
 *      Every class matching sk-btn* or sk-modal-close referenced in HTML MUST
 *      resolve to a defined CSS rule in ui_primitives/styles/ or module styles.
 *
 *   3. INV-BTN-03: Design System State & Contract Enforcement
 *      Universal button primitives in ui_primitives/styles/01_primitives.css
 *      must declare cursor: pointer, :hover, and :focus-visible states.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
let failureCount = 0;
let passCount = 0;

function logPass(msg) {
  console.log(`\x1b[32m  ✓ [PASS]\x1b[0m ${msg}`);
  passCount++;
}

function logFail(msg, detail = '') {
  failureCount++;
  console.error(`\x1b[31m  ❌ [FAIL]\x1b[0m ${msg}`);
  if (detail) console.error(`    \x1b[33mDetail: ${detail}\x1b[0m`);
}

function check(title, fn) {
  console.log(`\n\x1b[36m▶ Running: ${title}\x1b[0m`);
  try {
    fn();
  } catch (err) {
    logFail(`Unexpected error during ${title}`, err.message);
  }
}

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║     UNIVERSAL UI BUTTON PRIMITIVES & DESIGN SYSTEM GATE (STD-UI-002)       ║');
console.log('║     Standard: STD-UI-PRIMITIVE-002 | Ruling: AC-DEC-2026-047 / SK-010      ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝');

// Approved button class patterns / prefixes
const APPROVED_BUTTON_PATTERNS = [
  /^sk-btn-nav$/,
  /^sk-/,
  /^shop-/,
  /^dr-/,
  /^table-/,
  /^survey-/,
  /^header-/,
  /^btn-/,
  /^brand/,
  /^decor-/,
  /^lookbook-/,
  /^decision-/,
  /^cell-action-btn$/,
  /^lb-/,
  /^pin-submit-btn$/,
  /^catalog-subnav-btn$/,
  /^share-chip/,
  /^stage-tab-btn$/,
  /^tone-btn$/,
  /^mode-btn$/,
  /^event-pill$/,
  /^status-btn/,
  /^theme-/,
  /^drawer-/,
  /^status-/,
  /^decisions-/,
  /^pwa-/,
  /nav-btn/,
  /executive-/,
  /qa-/,
  /cd-pill/,
  /stage-reset-btn/,
  /swimlane-sort-btn/,
  /planning-view-btn/,
  /ribbon-/,
  /cockpit-/,
  /modal-close/,
  /google-btn/,
  /profile-trigger/,
  /popover-logout/,
  /tab-nav-more/
];

function isApprovedButtonClass(cls) {
  return APPROVED_BUTTON_PATTERNS.some(pat => pat.test(cls));
}

function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== '.claude') {
        getHtmlFiles(fullPath, fileList);
      }
    } else if (entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// ----------------------------------------------------------------------------
// 1. Audit HTML Templates for Zero Naked / Unstyled <button> Tags (INV-BTN-01)
// ----------------------------------------------------------------------------
check('Check 1: Zero Naked / Unstyled <button> Tags in Templates (INV-BTN-01)', () => {
  const targetDirs = [
    path.join(REPO_ROOT, 'ui_primitives', 'components'),
    path.join(REPO_ROOT, 'shopping_src', 'components'),
    path.join(REPO_ROOT, 'cockpit_src', 'components'),
  ];

  const individualFiles = [
    path.join(REPO_ROOT, 'cockpit_src', 'template.html'),
    path.join(REPO_ROOT, 'shopping_src', 'template.html'),
    path.join(REPO_ROOT, 'decision_registry_src', 'template.html'),
    path.join(REPO_ROOT, 'index.html'),
    path.join(REPO_ROOT, 'shopping-registry.html'),
    path.join(REPO_ROOT, 'decorator-cockpit.html'),
    path.join(REPO_ROOT, 'decision-registry.html')
  ].filter(f => fs.existsSync(f));

  let htmlFiles = [];
  targetDirs.forEach(dir => getHtmlFiles(dir, htmlFiles));
  htmlFiles = Array.from(new Set([...htmlFiles, ...individualFiles]));

  let violationCount = 0;

  for (const filePath of htmlFiles) {
    const relPath = path.relative(REPO_ROOT, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    const buttonRegex = /<button\b([^>]*)>/gi;
    let match;

    while ((match = buttonRegex.exec(content)) !== null) {
      const attrs = match[1];
      const matchIndex = match.index;
      // Calculate line number
      const lineNum = content.slice(0, matchIndex).split(/\r?\n/).length;

      // Extract class attribute
      const classMatch = attrs.match(/class=["']([^"']*)["']/i);
      if (!classMatch) {
        logFail(`${relPath}:${lineNum} contains naked <button> with NO class attribute!`, match[0].slice(0, 100));
        violationCount++;
        continue;
      }

      const classes = classMatch[1].trim().split(/\s+/).filter(Boolean);
      const hasApprovedClass = classes.some(isApprovedButtonClass);

      if (!hasApprovedClass) {
        logFail(
          `${relPath}:${lineNum} <button> has classes [${classes.join(', ')}] but none match approved design system button primitives!`,
          match[0].slice(0, 100)
        );
        violationCount++;
      }
    }
  }

  if (violationCount === 0) {
    logPass(`All scanned HTML files adhere to INV-BTN-01: Zero Naked <button> tags found across ${htmlFiles.length} files.`);
  }
});

// ----------------------------------------------------------------------------
// 2. Audit for Zero Orphan Button Classes in HTML (INV-BTN-02)
// ----------------------------------------------------------------------------
check('Check 2: Zero Orphan Button Classes in HTML Templates (INV-BTN-02)', () => {
  const primCssDir = path.join(REPO_ROOT, 'ui_primitives', 'styles');
  const cssFiles = fs.readdirSync(primCssDir).filter(f => f.endsWith('.css'));
  const bundledCss = cssFiles.map(f => fs.readFileSync(path.join(primCssDir, f), 'utf8')).join('\n');

  const componentDirs = [
    path.join(REPO_ROOT, 'ui_primitives', 'components'),
    path.join(REPO_ROOT, 'shopping_src', 'components'),
    path.join(REPO_ROOT, 'cockpit_src', 'components')
  ];

  let htmlFiles = [];
  componentDirs.forEach(dir => getHtmlFiles(dir, htmlFiles));

  const skButtonClassesInHtml = new Set();
  const classToFilesMap = new Map();

  for (const filePath of htmlFiles) {
    const relPath = path.relative(REPO_ROOT, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const classRegex = /class=["']([^"']*)["']/gi;
    let match;

    while ((match = classRegex.exec(content)) !== null) {
      const classes = match[1].trim().split(/\s+/).filter(Boolean);
      for (const cls of classes) {
        if (cls.startsWith('sk-btn') || cls === 'sk-modal-close') {
          skButtonClassesInHtml.add(cls);
          if (!classToFilesMap.has(cls)) classToFilesMap.set(cls, []);
          classToFilesMap.get(cls).push(relPath);
        }
      }
    }
  }

  let orphanCount = 0;
  for (const cls of skButtonClassesInHtml) {
    // Check if class exists as a CSS selector
    const selectorRegex = new RegExp(`\\.${cls}\\b`);
    if (!selectorRegex.test(bundledCss)) {
      const files = classToFilesMap.get(cls) || [];
      logFail(`Orphan CSS Class Detected: '.${cls}' is used in HTML but NOT defined in ui_primitives/styles/!`, `Used in: ${files.join(', ')}`);
      orphanCount++;
    }
  }

  if (orphanCount === 0) {
    logPass(`All ${skButtonClassesInHtml.size} sk-btn* and sk-modal-close classes used in HTML map to active CSS rules (Zero Orphans).`);
  }
});

// ----------------------------------------------------------------------------
// 3. Contract & State Enforcement on Button Primitives (INV-BTN-03)
// ----------------------------------------------------------------------------
check('Check 3: Design System State & Contract Enforcement (INV-BTN-03)', () => {
  const primCssPath = path.join(REPO_ROOT, 'ui_primitives', 'styles', '01_primitives.css');
  if (!fs.existsSync(primCssPath)) {
    logFail('ui_primitives/styles/01_primitives.css does not exist');
    return;
  }

  const css = fs.readFileSync(primCssPath, 'utf8');

  // Verify mandatory selectors
  const requiredSelectors = [
    '.sk-btn',
    '.sk-btn:focus-visible',
    '.sk-btn-secondary',
    '.sk-btn-secondary:hover',
    '.sk-btn-primary',
    '.sk-btn-primary:hover',
    '.sk-btn-danger',
    '.sk-btn-nav',
    '.sk-modal-close',
    '.sk-modal-close:hover'
  ];

  let missingSelectors = 0;
  for (const sel of requiredSelectors) {
    if (!css.includes(sel)) {
      logFail(`Missing mandatory primitive selector: '${sel}' in 01_primitives.css`);
      missingSelectors++;
    }
  }

  if (missingSelectors === 0) {
    logPass(`All ${requiredSelectors.length} mandatory button primitive selectors and states are defined.`);
  }

  // Verify cursor: pointer on .sk-btn and .sk-modal-close
  const skBtnBlock = css.slice(css.indexOf('.sk-btn {'), css.indexOf('}', css.indexOf('.sk-btn {')));
  if (skBtnBlock.includes('cursor: pointer')) {
    logPass('.sk-btn declares cursor: pointer');
  } else {
    logFail('.sk-btn does not declare cursor: pointer');
  }

  const skCloseBlock = css.slice(css.indexOf('.sk-modal-close {'), css.indexOf('}', css.indexOf('.sk-modal-close {')));
  if (skCloseBlock.includes('cursor: pointer')) {
    logPass('.sk-modal-close declares cursor: pointer');
  } else {
    logFail('.sk-modal-close does not declare cursor: pointer');
  }
});

// ----------------------------------------------------------------------------
// Final Verdict
// ----------------------------------------------------------------------------
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failureCount === 0) {
  console.log(`\x1b[32m🎉 ALL BUTTON PRIMITIVE CHECKS PASSED (${passCount} checks green): STD-UI-PRIMITIVE-002 VERIFIED!\x1b[0m`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`\x1b[31m❌ GATE FAILED: ${failureCount} failure(s) detected. Fix unstyled buttons / orphan classes before proceeding.\x1b[0m`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
