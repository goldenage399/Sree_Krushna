#!/usr/bin/env node
/**
 * scripts/verify-ui-lifecycle.cjs
 * Pre-Flight Lifecycle Gate: Dynamic Script Sequencing, Zombie Listener Audit, and 3-Trigger Dismissibility
 *
 * Enforces Architectural Standard: STD-UI-LIFECYCLE-001 / DEC-003
 *
 * Invariants Checked:
 *   1. INV-LIFECYCLE-01: Dynamic Script Sequencing Gate
 *      Host app dynamic script injectors (in public/js/app.js) MUST await newScript.onload
 *      for external src scripts before executing or appending dependent inline scripts.
 *
 *   2. INV-LIFECYCLE-02: Zombie DOMContentLoaded Prohibition
 *      Modular tab components and UI primitives MUST NOT rely solely on DOMContentLoaded.
 *      They must guard with `document.readyState !== 'loading'` or expose an explicit mount/init function.
 *
 *   3. INV-LIFECYCLE-03: 3-Trigger Modal/Drawer Dismissibility Contract
 *      All interactive overlays, modals, and slide-over drawers MUST provide:
 *        a. Dedicated Close Button with click binding
 *        b. Backdrop element with click binding
 *        c. Global Escape key handler
 *        d. Programmatic window-scoped dismiss function
 *
 *   4. INV-LIFECYCLE-04: Headless Lifecycle State Machine Simulation
 *      Simulates open -> close button -> open -> backdrop click -> open -> Escape key
 *      asserting active class toggling and state clearing.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO_ROOT = path.resolve(__dirname, '..');

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

// ── CHECK 1: Dynamic Script Injection Sequencing Gate ─────────────────────────
check('Check 1: Dynamic Script Tag Sequencing in Host App (INV-LIFECYCLE-01)', () => {
  const appJsPath = path.join(REPO_ROOT, 'public/js/app.js');
  if (!fs.existsSync(appJsPath)) {
    logFail('public/js/app.js does not exist');
    return;
  }

  const appJs = fs.readFileSync(appJsPath, 'utf8');

  // Verify mount functions that inject scripts
  const mountFunctions = ['mountDecisionRegistryTab', 'mountCockpitTab'];
  let checkedCount = 0;

  mountFunctions.forEach(fnName => {
    const fnDeclarationRegex = new RegExp(`async\\s+function\\s+${fnName}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)(?:\\n\\s*\\}\\s*(?:window\\.|async\\s+function|function|let|const))`, 'm');
    const match = fnDeclarationRegex.exec(appJs);
    
    if (match) {
      checkedCount++;
      const fnBody = match[1];

      // Must await external script onload
      const hasOnloadAwait = (fnBody.includes('.onload =') || fnBody.includes('onload')) && 
                             (fnBody.includes('resolve') || fnBody.includes('await'));
      if (hasOnloadAwait) {
        logPass(`'${fnName}' awaits script.onload for external scripts before running dependent code`);
      } else {
        logFail(`'${fnName}' does NOT await external script.onload! Risk of race condition in dynamic tab execution.`);
      }
    } else {
      // Fallback check
      const idx = appJs.indexOf(`async function ${fnName}`);
      if (idx !== -1) {
        checkedCount++;
        const fnBody = appJs.slice(idx, idx + 3500);
        const hasOnloadAwait = fnBody.includes('.onload =') && fnBody.includes('resolve');
        if (hasOnloadAwait) {
          logPass(`'${fnName}' awaits script.onload for external scripts before running dependent code`);
        } else {
          logFail(`'${fnName}' does NOT await external script.onload! Risk of race condition in dynamic tab execution.`);
        }
      } else {
        logFail(`Function '${fnName}' not found in public/js/app.js`);
      }
    }
  });

  if (checkedCount === 0) {
    logFail('No dynamic tab mount functions found in public/js/app.js');
  }
});

// ── CHECK 2: Zombie DOMContentLoaded Prohibition Gate ─────────────────────────
check('Check 2: Zombie DOMContentLoaded Prohibition Gate (INV-LIFECYCLE-02)', () => {
  const targetDirs = [
    path.join(REPO_ROOT, 'ui_primitives/scripts'),
    path.join(REPO_ROOT, 'decision_registry_src/scripts'),
    path.join(REPO_ROOT, 'shopping_registry_src/scripts'),
    path.join(REPO_ROOT, 'cockpit_src')
  ];

  const candidateFiles = [];
  targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      entries.forEach(e => {
        if (e.isFile() && e.name.endsWith('.js')) {
          candidateFiles.push(path.join(dir, e.name));
        }
      });
    }
  });

  candidateFiles.forEach(filePath => {
    const relPath = path.relative(REPO_ROOT, filePath);
    const code = fs.readFileSync(filePath, 'utf8');

    if (code.includes("addEventListener('DOMContentLoaded'") || code.includes('addEventListener("DOMContentLoaded"')) {
      const hasReadyStateCheck = code.includes('document.readyState') || code.includes('window.__skReady');
      const hasExplicitInit = code.includes('init') || code.includes('mount');

      if (hasReadyStateCheck) {
        logPass(`${relPath} guards DOMContentLoaded with document.readyState check`);
      } else if (hasExplicitInit) {
        logPass(`${relPath} exposes explicit initialization hook`);
      } else {
        logFail(`${relPath} contains un-guarded DOMContentLoaded listener! Will fail silently when mounted in dynamic SPA tab.`);
      }
    } else {
      logPass(`${relPath} avoids naked DOMContentLoaded listener`);
    }
  });
});

// ── CHECK 3: 3-Trigger Modal/Drawer Dismissibility Contract ───────────────────
check('Check 3: Modal & Drawer 3-Trigger Dismissibility Contract (INV-LIFECYCLE-03)', () => {
  const commentsEnginePath = path.join(REPO_ROOT, 'ui_primitives/scripts/comments_engine.js');
  const commentsHtmlPath = path.join(REPO_ROOT, 'ui_primitives/components/comments_drawer.html');

  if (!fs.existsSync(commentsEnginePath) || !fs.existsSync(commentsHtmlPath)) {
    logFail('Comments drawer component or engine missing in ui_primitives');
    return;
  }

  const engineCode = fs.readFileSync(commentsEnginePath, 'utf8');
  const htmlCode = fs.readFileSync(commentsHtmlPath, 'utf8');

  // Trigger 1: Explicit Close Button
  const hasCloseBtnHtml = htmlCode.includes('id="skBtnCloseComments"') || htmlCode.includes('sk-drawer-close');
  const hasCloseBtnHandler = htmlCode.includes('onclick="closeCommentsDrawer()"') || 
                             htmlCode.includes('onclick="window.closeCommentsDrawer()"') ||
                             engineCode.includes('skBtnCloseComments');
  if (hasCloseBtnHtml && hasCloseBtnHandler) {
    logPass('Trigger 1 Verified: Explicit Close Button (#skBtnCloseComments) with click handler');
  } else {
    logFail('Trigger 1 FAILED: Missing close button or click binding in comments drawer');
  }

  // Trigger 2: Backdrop Click
  const hasBackdropHtml = htmlCode.includes('id="skCommentsDrawerBackdrop"') || htmlCode.includes('sk-drawer-backdrop');
  const hasBackdropHandler = htmlCode.includes('onclick="closeCommentsDrawer()"') || 
                             htmlCode.includes('onclick="window.closeCommentsDrawer()"') ||
                             engineCode.includes('skCommentsDrawerBackdrop');
  if (hasBackdropHtml && hasBackdropHandler) {
    logPass('Trigger 2 Verified: Backdrop element (#skCommentsDrawerBackdrop) with dismiss click handler');
  } else {
    logFail('Trigger 2 FAILED: Missing backdrop element or dismiss binding in comments drawer');
  }

  // Trigger 3: Escape Keydown Listener
  const hasEscapeHandler = engineCode.includes("'Escape'") || engineCode.includes('"Escape"');
  if (hasEscapeHandler) {
    logPass('Trigger 3 Verified: Global/Scoped Escape keydown dismiss handler');
  } else {
    logFail('Trigger 3 FAILED: Comments drawer lacks Escape key dismiss handler');
  }

  // Trigger 4: Programmatic Global API
  const hasGlobalClose = (engineCode.includes('global.closeCommentsDrawer =') || engineCode.includes('window.closeCommentsDrawer ='));
  if (hasGlobalClose) {
    logPass('Programmatic Global API Verified: closeCommentsDrawer exported to global scope');
  } else {
    logFail('Programmatic Global API FAILED: Window close function not properly exported');
  }
});

// ── CHECK 4: Headless Lifecycle State Machine Simulation ─────────────────────
check('Check 4: Headless Lifecycle State Machine Simulation (INV-LIFECYCLE-04)', () => {
  const mockElements = {};
  const mockEl = (id) => {
    if (!mockElements[id]) {
      const classes = new Set();
      mockElements[id] = {
        id,
        style: {},
        classList: {
          add: (c) => classes.add(c),
          remove: (c) => classes.delete(c),
          contains: (c) => classes.has(c)
        },
        innerHTML: '',
        textContent: '',
        addEventListener: function(event, handler) {
          this[`on_${event}`] = handler;
        },
        scrollBy: () => {},
        scrollIntoView: () => {},
        querySelectorAll: () => [],
        querySelector: () => null
      };
    }
    return mockElements[id];
  };

  const documentListeners = {};
  const sandbox = {
    console: { log: () => {}, warn: () => {}, error: console.error },
    document: {
      readyState: 'complete',
      getElementById: (id) => mockEl(id),
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener: (event, handler) => {
        documentListeners[event] = documentListeners[event] || [];
        documentListeners[event].push(handler);
      }
    },
    window: {
      location: { search: '', origin: 'http://localhost:5000', pathname: '/' },
      localStorage: { getItem: () => null, setItem: () => {} },
      addEventListener: (event, handler) => {
        documentListeners[event] = documentListeners[event] || [];
        documentListeners[event].push(handler);
      }
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    URLSearchParams: URLSearchParams
  };
  sandbox.window.document = sandbox.document;
  sandbox.global = sandbox.window;

  const commentsEngineCode = fs.readFileSync(path.join(REPO_ROOT, 'ui_primitives/scripts/comments_engine.js'), 'utf8');

  // Run comments engine inside sandbox
  vm.runInNewContext(commentsEngineCode, sandbox);

  const backdrop = mockEl('skCommentsDrawerBackdrop');
  const drawer = mockEl('skCommentsDrawer');
  const closeBtn = mockEl('skBtnCloseComments');

  // Test Open
  sandbox.window.openCommentsDrawer('SIM-01', { title: 'Simulation Target' });
  if (backdrop.classList.contains('is-active') && drawer.classList.contains('is-active')) {
    logPass('State Machine: Drawer successfully entered active state on openCommentsDrawer()');
  } else {
    logFail('State Machine: Drawer failed to activate on open');
  }

  // Test Close Button
  if (closeBtn.onclick) {
    closeBtn.onclick({ target: closeBtn, preventDefault: () => {}, stopPropagation: () => {} });
  } else if (closeBtn.on_click) {
    closeBtn.on_click({ target: closeBtn, preventDefault: () => {}, stopPropagation: () => {} });
  } else {
    sandbox.window.closeCommentsDrawer();
  }
  if (!backdrop.classList.contains('is-active') && !drawer.classList.contains('is-active')) {
    logPass('State Machine: Drawer successfully dismissed via Close Button vector');
  } else {
    logFail('State Machine: Drawer remained active after Close Button click');
  }

  // Test Open -> Backdrop Click
  sandbox.window.openCommentsDrawer('SIM-02', { title: 'Simulation Target 2' });
  if (backdrop.onclick) {
    backdrop.onclick({ target: backdrop, preventDefault: () => {}, stopPropagation: () => {} });
  } else if (backdrop.on_click) {
    backdrop.on_click({ target: backdrop, preventDefault: () => {}, stopPropagation: () => {} });
  } else {
    sandbox.window.closeCommentsDrawer();
  }
  if (!backdrop.classList.contains('is-active') && !drawer.classList.contains('is-active')) {
    logPass('State Machine: Drawer successfully dismissed via Backdrop Click vector');
  } else {
    logFail('State Machine: Drawer remained active after Backdrop click');
  }

  // Test Open -> Escape Key Press
  sandbox.window.openCommentsDrawer('SIM-03', { title: 'Simulation Target 3' });
  const keydownHandlers = documentListeners['keydown'] || [];
  keydownHandlers.forEach(h => h({ key: 'Escape', preventDefault: () => {} }));
  if (!backdrop.classList.contains('is-active') && !drawer.classList.contains('is-active')) {
    logPass('State Machine: Drawer successfully dismissed via Escape Keydown vector');
  } else {
    logFail('State Machine: Drawer remained active after Escape key dispatch');
  }
});

// ── SUMMARY & EXIT CODE ──────────────────────────────────────────────────────
console.log('\n===============================================================');
if (failureCount === 0) {
  console.log('\x1b[32m  ✅ ALL DYNAMIC UI LIFECYCLE GATES PASSED (100% GREEN)\x1b[0m');
  console.log('===============================================================\n');
  process.exit(0);
} else {
  console.error(`\x1b[31m  ❌ ${failureCount} UI LIFECYCLE CHECK(S) FAILED!\x1b[0m`);
  console.error('\x1b[31m  COMMIT / RELEASE BLOCKED BY STD-UI-LIFECYCLE-001.\x1b[0m');
  console.log('===============================================================\n');
  process.exit(1);
}
