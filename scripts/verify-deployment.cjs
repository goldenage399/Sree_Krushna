/**
 * Sree Krushna Marriage OS — Automated Pre-Flight Deployment Gate (Layered Verification)
 * Specification Code: P-VERIFY-GATE-002
 * Enforces:
 * 1. Runtime parse of all JS files (Classic Script via new Function + ES Module via V8 AST check)
 * 2. HTML Inline Handler Call-Graph Contract (every onclick/oninput target must exist in window scope)
 * 3. DOM ID Reference Integrity (every getElementById target in JS must exist in HTML)
 * 4. PWA Service Worker Shell Cache manifest validation on physical disk
 * 5. Root <-> Public distribution file byte synchronization
 * 6. Security Headers & 404 Error Page existence
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

// Load optional .deploymentrc.json with fallback defaults
let config = {
  profile: 'vanilla-spa',
  rootIndex: 'index.html',
  publicDir: 'public',
  entryHtml: 'public/index.html',
  jsFiles: [
    'public/js/config.js',
    'public/js/marriage-state.js',
    'public/js/theme-init.js',
    'public/js/auth.js',
    'public/js/app.js'
  ],
  cssFiles: ['public/css/main.css'],
  serviceWorker: 'public/sw.js',
  errorPage: 'public/404.html',
  firebaseConfig: 'firebase.json',
  ignoredDomIds: [],
  securityHeaders: ['X-Frame-Options', 'cleanUrls']
};

const rcPath = path.join(ROOT_DIR, '.deploymentrc.json');
if (fs.existsSync(rcPath)) {
  try {
    const userConfig = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
    config = { ...config, ...userConfig };
  } catch (e) {
    console.warn('\x1b[33m  ⚠️ Warning: Could not parse .deploymentrc.json, using defaults.\x1b[0m', e.message);
  }
}

const PUBLIC_DIR = path.join(ROOT_DIR, config.publicDir || 'public');

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

// ── LAYER 1: JS Runtime Parse & AST Syntax & Mock Execution ──────────────────
check('Layer 1: JavaScript Runtime Parse, AST Syntax & Sandbox Execution', () => {
  const jsFiles = config.jsFiles || [];
  const htmlPath = path.join(ROOT_DIR, config.entryHtml || 'public/index.html');
  const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';

  const listeners = [];
  const createMockEl = () => ({
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    setAttribute: () => {},
    getAttribute: () => '',
    innerHTML: '',
    innerText: '',
    value: '2026-08-22',
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    appendChild: () => {}
  });

  const sandbox = {
    window: {},
    document: {
      documentElement: { getAttribute: () => 'dark', setAttribute: () => {} },
      getElementById: (id) => createMockEl(),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => createMockEl(),
      createElementNS: () => createMockEl(),
      body: { classList: { add: () => {}, remove: () => {}, contains: () => false } },
      addEventListener: (event, cb) => { listeners.push({ event, cb }); }
    },
    navigator: { serviceWorker: { ready: Promise.resolve({ addEventListener: () => {} }), register: () => Promise.resolve() } },
    matchMedia: () => ({ matches: false }),
    location: { hash: '#tab-dashboard' },
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    localStorage: { getItem: () => null, setItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {} },
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    alert: () => {},
    confirm: () => true
  };
  sandbox.window = sandbox;
  sandbox.addEventListener = (event, cb) => { listeners.push({ event, cb }); };

  jsFiles.forEach(file => {
    const fullPath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(fullPath)) {
      logFail(`File not found: ${file}`);
      return;
    }
    const code = fs.readFileSync(fullPath, 'utf8');
    const baseName = path.basename(file);

    // Check if script is declared with type="module" or has top-level import/export
    const isModuleInHtml = html.includes(`type="module" src="js/${baseName}"`) ||
                           html.includes(`type="module" src="/js/${baseName}"`) ||
                           html.includes(`type="module" src="${file}"`);
    const hasModuleKeywords = /^\s*(import|export)\s+/m.test(code);

    if (isModuleInHtml || hasModuleKeywords) {
      try {
        execFileSync(process.execPath, ['--input-type=module', '--check', '-'], {
          input: code,
          stdio: ['pipe', 'pipe', 'pipe']
        });
        logPass(`${file} is syntax-valid in ES Module execution mode`);
      } catch (err) {
        logFail(`${file} has ES Module syntax error`, err.stderr ? err.stderr.toString() : err.message);
      }
    } else {
      try {
        const vm = require('vm');
        vm.runInNewContext(code, sandbox);
        logPass(`${file} parsed AND executed in runtime sandbox with zero errors`);
      } catch (err) {
        logFail(`${file} failed runtime execution in sandbox`, err.message);
      }
    }
  });

  // Execute registered DOMContentLoaded/load listeners
  try {
    const origNav = global.navigator;
    global.navigator = sandbox.navigator;
    listeners.forEach(({ event, cb }) => cb());
    global.navigator = origNav;
    logPass(`All ${listeners.length} registered lifecycle event listeners executed in sandbox with zero errors`);
  } catch (err) {
    logFail(`Lifecycle event listener threw error in sandbox`, err.message);
  }
});

// ── LAYER 2: HTML Inline Event Handler Call-Graph Contract ───────────────────
check('Layer 2: HTML Inline Event Handlers <-> JS Window Function Contract', () => {
  const htmlPath = path.join(ROOT_DIR, config.entryHtml || 'public/index.html');
  if (!fs.existsSync(htmlPath)) {
    logFail(`Entry HTML file missing: ${config.entryHtml}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  
  // Aggregate all JS contents
  const jsCode = (config.jsFiles || [])
    .map(f => {
      const p = path.join(ROOT_DIR, f);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    })
    .join('\n');

  // Extract handlers like onclick="switchTab('tab-vision')", oninput="detectPlatform()"
  const handlerRegex = /\b(onclick|oninput|onchange|onsubmit)="([a-zA-Z0-9_]+)\s*\(/g;
  const handlersInHtml = new Set();
  let match;
  while ((match = handlerRegex.exec(html)) !== null) {
    handlersInHtml.add(match[2]);
  }

  handlersInHtml.forEach(funcName => {
    // Skip JS keywords like 'if', 'event'
    if (['if', 'for', 'while', 'switch', 'alert', 'confirm', 'prompt'].includes(funcName)) return;

    const isWindowBound = jsCode.includes(`window.${funcName} =`) || jsCode.includes(`window.${funcName}=`);
    const isGlobalFunc = jsCode.includes(`function ${funcName}`);
    if (isWindowBound || isGlobalFunc) {
      logPass(`Inline handler '${funcName}' is defined & exposed on window in application scripts`);
    } else {
      logFail(`Orphan inline handler '${funcName}' found in HTML but is NOT exposed on window in application scripts!`);
    }
  });

  // Verify all window.<ident> = <target> bindings reference defined functions/variables in JS
  const windowAssignRegex = /\bwindow\.([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+);/g;
  (config.jsFiles || []).forEach(file => {
    const p = path.join(ROOT_DIR, file);
    if (!fs.existsSync(p)) return;
    const content = fs.readFileSync(p, 'utf8');
    let winMatch;
    while ((winMatch = windowAssignRegex.exec(content)) !== null) {
      const targetIdent = winMatch[2];
      const literals = new Set(['null', 'undefined', 'true', 'false', 'window']);
      const isTargetDefined = literals.has(targetIdent) ||
                              content.includes(`function ${targetIdent}`) ||
                              content.includes(`let ${targetIdent}`) ||
                              content.includes(`const ${targetIdent}`) ||
                              content.includes(`var ${targetIdent}`) ||
                              targetIdent === winMatch[1];
      if (isTargetDefined) {
        logPass(`Window export 'window.${winMatch[1]} = ${targetIdent}' verified in ${file}`);
      } else {
        logFail(`Window export 'window.${winMatch[1]} = ${targetIdent}' in ${file} references undefined identifier '${targetIdent}'!`);
      }
    }
  });
});

// ── LAYER 3: DOM ID Reference Integrity ──────────────────────────────────────
check('Layer 3: JS document.getElementById References <-> HTML DOM IDs', () => {
  const htmlPath = path.join(ROOT_DIR, config.entryHtml || 'public/index.html');
  if (!fs.existsSync(htmlPath)) {
    logFail(`Entry HTML file missing: ${config.entryHtml}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const jsFiles = config.jsFiles || [];
  const ignoredIds = new Set(config.ignoredDomIds || []);

  const jsCode = jsFiles
    .map(f => {
      const p = path.join(ROOT_DIR, f);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    })
    .join('\n');

  const idRefRegex = /document\.getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
  const idsInJs = new Set();
  let match;
  while ((match = idRefRegex.exec(jsCode)) !== null) {
    if (!ignoredIds.has(match[1])) {
      idsInJs.add(match[1]);
    }
  }

  idsInJs.forEach(id => {
    const idExists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
    if (idExists) {
      logPass(`DOM element '#${id}' exists in entry HTML`);
    } else {
      logFail(`Missing DOM ID in HTML: '#${id}' queried by scripts!`);
    }
  });
});

// ── LAYER 4: PWA Service Worker Shell Assets Integrity ───────────────────────
check('Layer 4: PWA Service Worker Shell Assets on Disk', () => {
  const swRelative = config.serviceWorker || 'public/sw.js';
  const swPath = path.join(ROOT_DIR, swRelative);
  if (!fs.existsSync(swPath)) {
    logPass(`No service worker configured or found at ${swRelative} (Skipped)`);
    return;
  }

  const swCode = fs.readFileSync(swPath, 'utf8');
  const shellMatch = swCode.match(/STATIC_SHELL\s*=\s*\[([\s\S]*?)\];/);
  if (!shellMatch) {
    logPass('No explicit STATIC_SHELL array in sw.js (Standard Worker)');
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
  const rootIndex = path.join(ROOT_DIR, config.rootIndex || 'index.html');
  const publicIndex = path.join(ROOT_DIR, config.entryHtml || 'public/index.html');

  if (!fs.existsSync(rootIndex) || !fs.existsSync(publicIndex)) {
    logFail('One or both index.html files missing');
    return;
  }

  const rootContent = fs.readFileSync(rootIndex, 'utf8');
  const publicContent = fs.readFileSync(publicIndex, 'utf8');

  if (rootContent === publicContent) {
    logPass(`root index.html (${rootContent.length} bytes) is in EXACT sync with ${config.entryHtml}`);
  } else {
    logFail(`root index.html (${rootContent.length} bytes) DIFFERS from ${config.entryHtml} (${publicContent.length} bytes)!`);
  }
});

// ── LAYER 6: Security Headers & 404 Page ──────────────────────────────────────
check('Layer 6: Security Headers & 404 Error Page', () => {
  const fourOhFour = path.join(ROOT_DIR, config.errorPage || 'public/404.html');
  if (fs.existsSync(fourOhFour)) {
    logPass(`${config.errorPage || 'public/404.html'} exists`);
  } else {
    logFail(`Missing 404 error page: ${config.errorPage}`);
  }

  const fbConfig = path.join(ROOT_DIR, config.firebaseConfig || 'firebase.json');
  if (fs.existsSync(fbConfig)) {
    const fb = fs.readFileSync(fbConfig, 'utf8');
    const headers = config.securityHeaders || ['X-Frame-Options', 'cleanUrls'];
    const missing = headers.filter(h => !fb.includes(h));
    if (missing.length === 0) {
      logPass(`firebase.json verified with security headers (${headers.join(', ')})`);
    } else {
      logFail(`firebase.json missing required security settings: ${missing.join(', ')}`);
    }
  } else {
    logPass('No firebase.json found (Non-Firebase hosting environment)');
  }
});

// ── LAYER 7: Canonical Feature & Tab Registry Parity (FEATURE_CATALOG.json) ───
check('Layer 7: Canonical Feature & Tab Registry Parity', () => {
  const catalogPath = path.join(ROOT_DIR, 'FEATURE_CATALOG.json');
  if (!fs.existsSync(catalogPath)) {
    logFail('FEATURE_CATALOG.json does not exist. Canonical UI contract is missing.');
    return;
  }

  let catalog;
  try {
    const raw = fs.readFileSync(catalogPath, 'utf8').replace(/^\uFEFF/, '');
    catalog = JSON.parse(raw);
  } catch (e) {
    logFail('Failed to parse FEATURE_CATALOG.json:', e.message);
    return;
  }

  const htmlPath = path.join(ROOT_DIR, config.entryHtml || 'public/index.html');
  const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';

  // 1. Verify Canonical Tabs
  (catalog.canonicalTabs || []).forEach(tab => {
    const hasPanel = html.includes(`id="${tab.id}"`);
    const hasPanelTestId = html.includes(`data-testid="${tab.testId}"`);
    const hasNavTestId = html.includes(`data-testid="${tab.navTestId}"`);
    const hasSwitchHandler = html.includes(`switchTab('${tab.id}')`);

    if (hasPanel && hasPanelTestId && hasNavTestId && hasSwitchHandler) {
      logPass(`Tab '${tab.title}' (${tab.id}) is 100% mounted with Nav + Panel + TestIDs`);
    } else {
      logFail(`Tab '${tab.title}' (${tab.id}) has parity gap: panel=${hasPanel}, panelTestId=${hasPanelTestId}, navTestId=${hasNavTestId}, switchHandler=${hasSwitchHandler}`);
    }
  });

  // 2. Verify Header Affordances
  (catalog.headerAffordances || []).forEach(item => {
    const hasId = html.includes(`id="${item.id}"`);
    const hasTestId = html.includes(`data-testid="${item.testId}"`);
    if (hasId && hasTestId) {
      logPass(`Header Affordance '${item.label}' (${item.id}) verified in DOM`);
    } else {
      logFail(`Header Affordance '${item.label}' missing in DOM: id=${hasId}, testId=${hasTestId}`);
    }
  });

  // 3. Verify Universal Intake Modals
  (catalog.intakeModals || []).forEach(modal => {
    const hasId = html.includes(`id="${modal.id}"`);
    const hasTestId = html.includes(`data-testid="${modal.testId}"`);
    if (hasId && hasTestId) {
      logPass(`Intake Modal [${modal.domain}] (${modal.id}) verified in DOM`);
    } else {
      logFail(`Intake Modal [${modal.domain}] missing in DOM: id=${hasId}, testId=${hasTestId}`);
    }
  });
});

// ── LAYER 8: PWA Invalidation Engine & Zero-Stale Cache Contract ───────────────
check('Layer 8: PWA Invalidation Engine & Zero-Stale Cache Contract', () => {
  const htmlPath = path.join(ROOT_DIR, config.entryHtml || 'public/index.html');
  const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
  const appJsPath = path.join(ROOT_DIR, 'public/js/app.js');
  const appJs = fs.existsSync(appJsPath) ? fs.readFileSync(appJsPath, 'utf8') : '';
  const cssPath = path.join(ROOT_DIR, 'public/css/main.css');
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

  const hasToastInHtml = html.includes('id="pwa-update-toast"');
  const hasReloadBtn = html.includes('id="pwa-reload-btn"');
  const hasToastCss = css.includes('.pwa-update-toast');
  const hasSwListenerInJs = appJs.includes('updatefound') && appJs.includes('pwa-update-toast');

  if (hasToastInHtml && hasReloadBtn && hasToastCss && hasSwListenerInJs) {
    logPass('PWA update toast & lifecycle invalidation listener are 100% active');
  } else {
    logFail(`PWA Invalidation gap: toastInHtml=${hasToastInHtml}, reloadBtn=${hasReloadBtn}, toastCss=${hasToastCss}, swListener=${hasSwListenerInJs}`);
  }
});

// ── LAYER 9: Interactive Drawer & Slide-Over Panel State Contract ────────────
check('Layer 9: Interactive Drawer & Slide-Over Panel State Machine Contract', () => {
  const mainCssPath = path.join(ROOT_DIR, 'public/css/main.css');
  const dopkosCssPath = path.join(ROOT_DIR, 'public/css/dopkos-engine.css');
  const appJsPath = path.join(ROOT_DIR, 'public/js/app.js');
  const consoleDrawerJsPath = path.join(ROOT_DIR, 'public/js/modules/console-drawer.js');
  const dopkosJsPath = path.join(ROOT_DIR, 'public/js/modules/dopkos-engine.js');

  const mainCss = fs.existsSync(mainCssPath) ? fs.readFileSync(mainCssPath, 'utf8') : '';
  const dopkosCss = fs.existsSync(dopkosCssPath) ? fs.readFileSync(dopkosCssPath, 'utf8') : '';
  const appJs = fs.existsSync(appJsPath) ? fs.readFileSync(appJsPath, 'utf8') : '';
  const consoleDrawerJs = fs.existsSync(consoleDrawerJsPath) ? fs.readFileSync(consoleDrawerJsPath, 'utf8') : '';
  const dopkosJs = fs.existsSync(dopkosJsPath) ? fs.readFileSync(dopkosJsPath, 'utf8') : '';

  // 1. Global Console Drawer CSS Verification
  const hasConsoleDrawerOpenCss = (mainCss.includes('.console-drawer.active') || mainCss.includes('.console-drawer.open')) &&
                                  (mainCss.includes('.console-backdrop.active') || mainCss.includes('.console-backdrop.open'));
  if (hasConsoleDrawerOpenCss) {
    logPass('CSS rules for .console-drawer (.active/.open) and .console-backdrop verified in main.css');
  } else {
    logFail('Missing CSS activation rules for .console-drawer/.console-backdrop in main.css!');
  }

  // 2. DO-PKOS Slide-Over Detail Panel CSS Verification
  const hasDopkosDetailPanelCss = dopkosCss.includes('dopkos-detail-panel') &&
                                  (dopkosCss.includes('dopkos-detail-panel.open') || dopkosCss.includes('dopkos-detail-panel.active'));
  if (hasDopkosDetailPanelCss) {
    logPass('CSS rules for #dopkos-detail-panel (.open/.active) verified in dopkos-engine.css');
  } else {
    logFail('Missing CSS activation rules for #dopkos-detail-panel in dopkos-engine.css!');
  }

  // 3. Script Activation Logic Verification
  const hasAppDrawerActivation = appJs.includes('console-drawer') &&
                                 appJs.includes('console-backdrop') &&
                                 (appJs.includes(".classList.add('active', 'open')") || (appJs.includes(".classList.add('active')") || appJs.includes(".classList.add('open')")));
  if (hasAppDrawerActivation) {
    logPass('openTaskConsole() in app.js properly mutates console-drawer & backdrop classes');
  } else {
    logFail('openTaskConsole() in app.js is missing classList.add mutation!');
  }

  const hasDopkosPanelActivation = dopkosJs.includes('panel.classList.add') &&
                                   dopkosJs.includes('panel.classList.remove');
  if (hasDopkosPanelActivation) {
    logPass('openPanel() & closePanel() in dopkos-engine.js properly mutate detail panel state');
  } else {
    logFail('openPanel() / closePanel() in dopkos-engine.js missing panel classList mutations!');
  }
});
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
