/**
 * Sree Krushna Marriage OS — Automated Pre-Flight Deployment Gate (Layered Verification)
 * Enforces:
 * 1. Runtime parse of all JS files (Classic Script + Module compliance)
 * 2. HTML Inline Handler Call-Graph Contract (every onclick/oninput target must exist)
 * 3. DOM ID Reference Integrity (every getElementById target in JS must exist in HTML)
 * 4. PWA Service Worker Shell Cache manifest validation
 * 5. Root <-> Public distribution file synchronization
 * 6. Security Headers & 404 Error Page existence
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

let failureCount = 0;

function logPass(msg) {
  console.log(`\x1b[32m  ✓ [PASS]\x1b[0m ${msg}`);
}

function logFail(msg, detail = '') {
  failureCount++;
  console.error(`\x1b[31m  ✗ [FAIL]\x1b[0m ${msg}`);
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

// ── LAYER 1: JS Runtime Parse (No Top-Level Await / Syntax Errors) ───────────
check('Layer 1: JavaScript Runtime Parse & Classic Script Syntax', () => {
  const jsFiles = [
    'public/js/config.js',
    'public/js/marriage-state.js',
    'public/js/theme-init.js',
    'public/js/app.js'
  ];

  jsFiles.forEach(file => {
    const fullPath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(fullPath)) {
      logFail(`File not found: ${file}`);
      return;
    }
    const code = fs.readFileSync(fullPath, 'utf8');
    try {
      new Function(code);
      logPass(`${file} is syntax-valid in classic script execution mode`);
    } catch (err) {
      logFail(`${file} has syntax or top-level await error`, err.message);
    }
  });
});

// ── LAYER 2: HTML Inline Event Handler Call-Graph Contract ───────────────────
check('Layer 2: HTML Inline Event Handlers <-> JS Window Function Contract', () => {
  const htmlPath = path.join(PUBLIC_DIR, 'index.html');
  const appJsPath = path.join(PUBLIC_DIR, 'js', 'app.js');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const appJs = fs.readFileSync(appJsPath, 'utf8');

  // Extract handlers like onclick="switchTab('tab-vision')", oninput="detectPlatform()"
  const handlerRegex = /\b(onclick|oninput|onchange|onsubmit)="([a-zA-Z0-9_]+)\s*\(/g;
  const handlersInHtml = new Set();
  let match;
  while ((match = handlerRegex.exec(html)) !== null) {
    handlersInHtml.add(match[2]);
  }

  handlersInHtml.forEach(funcName => {
    // Check if funcName is defined or bound to window in app.js
    const isDefined = appJs.includes(`function ${funcName}`) || appJs.includes(`window.${funcName}`) || appJs.includes(`${funcName} =`);
    if (isDefined) {
      logPass(`Inline handler '${funcName}' is defined in app.js`);
    } else {
      logFail(`Orphan inline handler '${funcName}' found in HTML but NOT in app.js!`);
    }
  });
});

// ── LAYER 3: DOM ID Reference Integrity ──────────────────────────────────────
check('Layer 3: JS document.getElementById References <-> HTML DOM IDs', () => {
  const htmlPath = path.join(PUBLIC_DIR, 'index.html');
  const appJsPath = path.join(PUBLIC_DIR, 'js', 'app.js');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const appJs = fs.readFileSync(appJsPath, 'utf8');

  const idRefRegex = /document\.getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
  const idsInJs = new Set();
  let match;
  while ((match = idRefRegex.exec(appJs)) !== null) {
    idsInJs.add(match[1]);
  }

  idsInJs.forEach(id => {
    const idExists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
    if (idExists) {
      logPass(`DOM element '#${id}' exists in index.html`);
    } else {
      logFail(`Missing DOM ID in HTML: '#${id}' queried by app.js!`);
    }
  });
});

// ── LAYER 4: PWA Service Worker Shell Assets Integrity ───────────────────────
check('Layer 4: PWA Service Worker Shell Assets on Disk', () => {
  const swPath = path.join(PUBLIC_DIR, 'sw.js');
  if (!fs.existsSync(swPath)) {
    logFail('public/sw.js missing');
    return;
  }
  const swCode = fs.readFileSync(swPath, 'utf8');
  const shellMatch = swCode.match(/STATIC_SHELL\s*=\s*\[([\s\S]*?)\];/);
  if (!shellMatch) {
    logFail('STATIC_SHELL array not found in sw.js');
    return;
  }

  const assets = shellMatch[1]
    .split(',')
    .map(s => s.trim().replace(/['"]/g, ''))
    .filter(s => s && s !== '/');

  assets.forEach(asset => {
    const assetPath = path.join(PUBLIC_DIR, asset.startsWith('/') ? asset.slice(1) : asset);
    if (fs.existsSync(assetPath)) {
      logPass(`SW Shell Asset exists: ${asset}`);
    } else {
      logFail(`SW Shell Asset MISSING on disk: ${asset} (${assetPath})`);
    }
  });
});

// ── LAYER 5: Root <-> Public Synchronization ─────────────────────────────────
check('Layer 5: Root <-> Public Distribution Synchronization', () => {
  const rootIndex = path.join(ROOT_DIR, 'index.html');
  const publicIndex = path.join(PUBLIC_DIR, 'index.html');

  if (!fs.existsSync(rootIndex) || !fs.existsSync(publicIndex)) {
    logFail('One or both index.html files missing');
    return;
  }

  const rootContent = fs.readFileSync(rootIndex, 'utf8');
  const publicContent = fs.readFileSync(publicIndex, 'utf8');

  if (rootContent === publicContent) {
    logPass(`root index.html (${rootContent.length} bytes) is in EXACT sync with public/index.html`);
  } else {
    logFail(`root index.html (${rootContent.length} bytes) DIFFERS from public/index.html (${publicContent.length} bytes)!`);
  }
});

// ── LAYER 6: Security Headers & 404 Page ──────────────────────────────────────
check('Layer 6: Security Headers & 404 Error Page', () => {
  const fourOhFour = path.join(PUBLIC_DIR, '404.html');
  if (fs.existsSync(fourOhFour)) {
    logPass('public/404.html exists');
  } else {
    logFail('Missing public/404.html');
  }

  const fbConfig = path.join(ROOT_DIR, 'firebase.json');
  if (fs.existsSync(fbConfig)) {
    const fb = fs.readFileSync(fbConfig, 'utf8');
    if (fb.includes('X-Frame-Options') && fb.includes('cleanUrls')) {
      logPass('firebase.json has security headers and cleanUrls enabled');
    } else {
      logFail('firebase.json missing X-Frame-Options or cleanUrls');
    }
  } else {
    logFail('firebase.json missing');
  }
});

// ── SUMMARY & EXIT CODE ──────────────────────────────────────────────────────
console.log('\n===============================================================');
if (failureCount === 0) {
  console.log('\x1b[32m  ✅ ALL PRE-FLIGHT VERIFICATION GATES PASSED (100% GREEN)\x1b[0m');
  console.log('===============================================================\n');
  process.exit(0);
} else {
  console.error(`\x1b[31m  ❌ ${failureCount} PRE-FLIGHT VERIFICATION CHECK(S) FAILED!\x1b[0m`);
  console.error('\x1b[31m  DEPLOYMENT BLOCKED TO PREVENT PRODUCTION DEFECTS.\x1b[0m');
  console.log('===============================================================\n');
  process.exit(1);
}
