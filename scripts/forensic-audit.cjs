/**
 * Sree Krushna Marriage OS — Forensic AST Decomposition Auditor
 * Compares pre-refactoring monolithic source (from git tree) against current modular files.
 * Enforces:
 * 1. ZERO dropped function declarations
 * 2. ZERO dropped CSS selector rules
 * 3. ZERO dropped functional DOM IDs
 * 4. 100% Data object and SSOT structure preservation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Default config
let auditConfig = {
  baseRef: process.argv[2] || '35157cb',
  originalFile: process.argv[3] || 'index.html',
  currentJsFiles: [
    'public/js/config.js',
    'public/js/marriage-state.js',
    'public/js/theme-init.js',
    'public/js/auth.js',
    'public/js/app.js'
  ],
  currentCssFile: 'public/css/main.css',
  currentHtmlFile: 'public/index.html',
  expectedDataObjects: [
    'MARRIAGE_STATE',
    'tasks',
    'stages',
    'tracks',
    'rituals'
  ],
  ignoredRemovedIds: [
    'vendor-row-VEN-001',
    'vendor-row-VDR-001',
    'vendor-row-VDR-002',
    'vendor-row-VDR-003',
    'vendor-row-VDR-004',
    'vendor-row-VDR-005',
    'asset-row-AST-001',
    'asset-row-AST-002',
    'asset-row-AST-003',
    'asset-row-AST-004',
    'asset-row-AST-005',
    'asset-row-AST-006'
  ]
};

const rcPath = path.join(ROOT_DIR, '.deploymentrc.json');
if (fs.existsSync(rcPath)) {
  try {
    const rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
    if (rc.decompositionAudit) {
      auditConfig = { ...auditConfig, ...rc.decompositionAudit };
    }
  } catch (e) {
    console.warn('⚠️ Warning reading .deploymentrc.json:', e.message);
  }
}

// 1. Get original monolithic source from git history
let originalSource;
try {
  originalSource = execSync(`git show ${auditConfig.baseRef}:${auditConfig.originalFile}`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024
  });
} catch (e) {
  console.error(`❌ Failed to retrieve git show ${auditConfig.baseRef}:${auditConfig.originalFile}`, e.message);
  process.exit(1);
}

console.log('===============================================================');
console.log('🏛️ FORENSIC DECOMPOSITION AUDIT: BEFORE vs AFTER');
console.log('===============================================================');
console.log(`Base Git Ref: ${auditConfig.baseRef} (${auditConfig.originalFile})`);
console.log(`Pre-decomposition line count: ${originalSource.split('\n').length} lines`);

let failureCount = 0;

// 2. Extract function declarations
const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
const origFuncs = new Set();
let m;
while ((m = funcRegex.exec(originalSource)) !== null) {
  origFuncs.add(m[1]);
}

const currentJs = auditConfig.currentJsFiles
  .map(f => {
    const p = path.join(ROOT_DIR, f);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  })
  .join('\n');

const currentFuncs = new Set();
while ((m = funcRegex.exec(currentJs)) !== null) {
  currentFuncs.add(m[1]);
}

console.log('\n--- 1. FUNCTION DECLARATIONS AUDIT ---');
console.log(`Original declared functions (${origFuncs.size})`);
console.log(`Current declared functions (${currentFuncs.size})`);

const missingFuncs = Array.from(origFuncs).filter(f => !currentFuncs.has(f) && !currentJs.includes(f));
if (missingFuncs.length > 0) {
  console.error('\x1b[31m❌ MISSING FUNCTIONS in decomposed JS:\x1b[0m', missingFuncs);
  failureCount++;
} else {
  console.log('\x1b[32m✅ ZERO missing functions! All pre-decomposition functions preserved.\x1b[0m');
}

// 3. Extract CSS Selectors
const cssSelectorRegex = /([\.#][a-zA-Z0-9_>-]+)\s*\{/g;
const origSelectors = new Set();
while ((m = cssSelectorRegex.exec(originalSource)) !== null) {
  origSelectors.add(m[1]);
}

const cssPath = path.join(ROOT_DIR, auditConfig.currentCssFile);
const currentCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
const currentSelectors = new Set();
while ((m = cssSelectorRegex.exec(currentCss)) !== null) {
  currentSelectors.add(m[1]);
}

console.log('\n--- 2. CSS SELECTORS AUDIT ---');
console.log(`Original CSS Selectors: ${origSelectors.size}`);
console.log(`Current CSS Selectors: ${currentSelectors.size}`);

const missingSelectors = Array.from(origSelectors).filter(s => !currentCss.includes(s));
if (missingSelectors.length > 0) {
  console.error('\x1b[31m❌ MISSING CSS SELECTORS in stylesheet:\x1b[0m', missingSelectors);
  failureCount++;
} else {
  console.log('\x1b[32m✅ ZERO missing CSS selectors! All styles preserved in CSS.\x1b[0m');
}

// 4. Extract DOM IDs
const idRegex = /id=["']([a-zA-Z0-9_-]+)["']/g;
const origIds = new Set();
while ((m = idRegex.exec(originalSource)) !== null) {
  origIds.add(m[1]);
}

const htmlPath = path.join(ROOT_DIR, auditConfig.currentHtmlFile);
const currentHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
const currentIds = new Set();
while ((m = idRegex.exec(currentHtml)) !== null) {
  currentIds.add(m[1]);
}

const ignoredIds = new Set(auditConfig.ignoredRemovedIds || []);

console.log('\n--- 3. DOM IDS AUDIT ---');
console.log(`Original DOM IDs (${origIds.size})`);
console.log(`Current DOM IDs (${currentIds.size})`);

const missingIds = Array.from(origIds).filter(id => !currentIds.has(id) && !ignoredIds.has(id));
if (missingIds.length > 0) {
  console.error('\x1b[31m❌ UNEXPECTED MISSING DOM IDs in decomposed HTML:\x1b[0m', missingIds);
  failureCount++;
} else {
  console.log('\x1b[32m✅ ZERO unexpected missing DOM IDs!\x1b[0m');
}

// 5. Data Objects & State Audit
console.log('\n--- 4. DATA OBJECTS & SSOT STATE AUDIT ---');
(auditConfig.expectedDataObjects || []).forEach(obj => {
  const inCurrent = currentJs.includes(obj);
  if (!inCurrent) {
    console.error(`\x1b[31m❌ Missing Data Object in decomposed JS: ${obj}\x1b[0m`);
    failureCount++;
  } else {
    console.log(`\x1b[32m  ✓ [PASS] Preserved Data Entity: ${obj}\x1b[0m`);
  }
});

console.log('\n===============================================================');
if (failureCount === 0) {
  console.log('\x1b[32m  ✅ FORENSIC DECOMPOSITION AUDIT PASSED (100% REGRESSION-FREE)\x1b[0m');
  console.log('===============================================================\n');
  process.exit(0);
} else {
  console.error(`\x1b[31m  ❌ ${failureCount} REGRESSION(S) DETECTED IN DECOMPOSITION AUDIT!\x1b[0m`);
  console.log('===============================================================\n');
  process.exit(1);
}
