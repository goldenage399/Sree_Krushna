const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Get original monolithic index.html before commit 0ed3acb
let originalHtml;
try {
  originalHtml = execSync('git show 35157cb:index.html', { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });
} catch (e) {
  console.error('Failed to get git show 35157cb:index.html', e.message);
  process.exit(1);
}

console.log('===============================================================');
console.log('🏛️ FORENSIC DECOMPOSITION AUDIT: BEFORE vs AFTER');
console.log('===============================================================');
console.log('Pre-decomposition index.html line count:', originalHtml.split('\n').length);

// 2. Extract functions
const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
const origFuncs = new Set();
let m;
while ((m = funcRegex.exec(originalHtml)) !== null) {
  origFuncs.add(m[1]);
}

const currentJsFiles = [
  'public/js/config.js',
  'public/js/marriage-state.js',
  'public/js/theme-init.js',
  'public/js/auth.js',
  'public/js/app.js'
];
const currentJs = currentJsFiles.map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');

const currentFuncs = new Set();
while ((m = funcRegex.exec(currentJs)) !== null) {
  currentFuncs.add(m[1]);
}

console.log('\n--- 1. FUNCTION DECLARATIONS AUDIT ---');
console.log(`Original declared functions (${origFuncs.size}):`, Array.from(origFuncs).sort());
console.log(`Current declared functions (${currentFuncs.size}):`, Array.from(currentFuncs).sort());

const missingFuncs = Array.from(origFuncs).filter(f => !currentFuncs.has(f) && !currentJs.includes(f));
if (missingFuncs.length > 0) {
  console.log('\x1b[31m❌ MISSING FUNCTIONS in decomposed JS:\x1b[0m', missingFuncs);
} else {
  console.log('\x1b[32m✅ ZERO missing functions! All pre-decomposition functions preserved.\x1b[0m');
}

// 3. Extract CSS Selectors
const cssSelectorRegex = /([\.#][a-zA-Z0-9_>-]+)\s*\{/g;
const origSelectors = new Set();
while ((m = cssSelectorRegex.exec(originalHtml)) !== null) {
  origSelectors.add(m[1]);
}

const currentCss = fs.readFileSync(path.join(__dirname, '..', 'public/css/main.css'), 'utf8');
const currentSelectors = new Set();
while ((m = cssSelectorRegex.exec(currentCss)) !== null) {
  currentSelectors.add(m[1]);
}

console.log('\n--- 2. CSS SELECTORS AUDIT ---');
console.log(`Original CSS Selectors: ${origSelectors.size}`);
console.log(`Current CSS Selectors: ${currentSelectors.size}`);

const missingSelectors = Array.from(origSelectors).filter(s => !currentCss.includes(s));
if (missingSelectors.length > 0) {
  console.log('\x1b[31m❌ MISSING CSS SELECTORS in main.css:\x1b[0m', missingSelectors);
} else {
  console.log('\x1b[32m✅ ZERO missing CSS selectors! All styles preserved and expanded in main.css.\x1b[0m');
}

// 4. Extract DOM IDs
const idRegex = /id=["']([a-zA-Z0-9_-]+)["']/g;
const origIds = new Set();
while ((m = idRegex.exec(originalHtml)) !== null) {
  origIds.add(m[1]);
}

const currentHtml = fs.readFileSync(path.join(__dirname, '..', 'public/index.html'), 'utf8');
const currentIds = new Set();
while ((m = idRegex.exec(currentHtml)) !== null) {
  currentIds.add(m[1]);
}

console.log('\n--- 3. DOM IDS AUDIT ---');
console.log(`Original DOM IDs (${origIds.size})`);
console.log(`Current DOM IDs (${currentIds.size})`);

const missingIds = Array.from(origIds).filter(id => !currentIds.has(id));
if (missingIds.length > 0) {
  console.log('\x1b[33m⚠️ DOM IDs removed or refactored:\x1b[0m', missingIds);
} else {
  console.log('\x1b[32m✅ ZERO missing DOM IDs!\x1b[0m');
}

// 5. Global Variables & Objects Audit
console.log('\n--- 4. DATA OBJECTS & SSOT STATE AUDIT ---');
const dataObjects = ['WBS_TASKS', 'TRACK_DEFINITIONS', 'STAGE_DEFINITIONS', 'RITUAL_SCHEDULE', 'SANCTIFIED_ASSET_REGISTRY', 'ACTIVE_VENDOR_PIPELINE'];
dataObjects.forEach(obj => {
  const inOrig = originalHtml.includes(obj);
  const inCurrent = currentJs.includes(obj);
  if (inOrig && !inCurrent) {
    console.log(`\x1b[31m❌ Missing Data Object: ${obj}\x1b[0m`);
  } else if (inOrig && inCurrent) {
    console.log(`\x1b[32m✅ Preserved Data Object: ${obj}\x1b[0m`);
  }
});
console.log('===============================================================\n');
