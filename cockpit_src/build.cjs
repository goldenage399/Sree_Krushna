/**
 * Static Decoupled Component Assembler (SDCA) Compiler — Decorator Negotiation Cockpit
 * Standard ID: SPEC-ARCH-SDCA-001 | Ruling: AC-DEC-2026-010 / AC-DEC-2026-012 / INV-SDCA-003
 * Invariant: Zero external npm dependencies. Pure Node.js built-ins.
 * Targets:
 *   - Standalone (default): decorator-cockpit.html (root + public)
 *   - Fragment (--fragment): cockpit-fragment.html (root + public)
 *   - All (--all): builds both standalone and fragment
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const startTime = process.hrtime();

const baseDir = __dirname;
const rootDir = path.resolve(baseDir, '..');

const isFragment = process.argv.includes('--fragment');
const isAll = process.argv.includes('--all');
const buildStandalone = !isFragment || isAll;
const buildFragment = isFragment || isAll;

console.log(`⚡ Starting SDCA Decorator Cockpit Build [Mode: ${isAll ? 'ALL (Standalone + Fragment)' : isFragment ? 'FRAGMENT' : 'STANDALONE'}]...`);

// Fails the build loudly if the injection marker is missing (INV-SDCA-003 hardening).
// Uses replacer function `() => content` to prevent special `$` pattern substitutions ($&, $$, $`, $') in content.
function safeReplace(str, marker, content, label) {
  if (!str.includes(marker)) {
    console.error(`❌ Critical: injection marker for "${label}" not found in template (expected: ${marker}).`);
    process.exit(1);
  }
  return str.replace(marker, () => content);
}

// 1. Read Common Data Stores (Canonical plates, map, slides)
const dataDir = path.join(baseDir, 'data');
const canonicalPlates = fs.readFileSync(path.join(dataDir, 'canonical_plates.json'), 'utf8');
const topicPlateMap = fs.readFileSync(path.join(dataDir, 'topic_plate_map.json'), 'utf8');
const slidesMarquee = fs.readFileSync(path.join(dataDir, 'slides_marquee.json'), 'utf8');
const slidesRayagada = fs.readFileSync(path.join(dataDir, 'slides_rayagada.json'), 'utf8');

// Sanity-check the two Firestore-sourced files parse as valid JSON, without emitting them.
const masterDecisionsCheck = JSON.parse(fs.readFileSync(path.join(dataDir, 'master_decisions.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(dataDir, 'topics_marquee.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(dataDir, 'topics_rayagada.json'), 'utf8'));

// 2. Read Shell Components
const compDir = path.join(baseDir, 'components');
const headerHtml = fs.readFileSync(path.join(compDir, 'header.html'), 'utf8');
const sidebarHtml = fs.readFileSync(path.join(compDir, 'sidebar.html'), 'utf8');
const stageHtml = fs.readFileSync(path.join(compDir, 'stage.html'), 'utf8');
const founderDeckHtml = fs.readFileSync(path.join(compDir, 'founder_deck.html'), 'utf8');
const decisionsWorkspaceHtml = fs.readFileSync(path.join(compDir, 'decisions_workspace.html'), 'utf8');
const toastHtml = fs.readFileSync(path.join(compDir, 'toast.html'), 'utf8');

// 3. Read Modals
const modalsDir = path.join(compDir, 'modals');
const modalFiles = fs.readdirSync(modalsDir).filter(f => f.endsWith('.html')).sort();
const combinedModals = modalFiles.map(f => {
  return fs.readFileSync(path.join(modalsDir, f), 'utf8');
}).join('\n\n  ');

// 4. Read Styles
const stylesDir = path.join(baseDir, 'styles');
const styleFiles = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css')).sort();
const combinedCss = styleFiles.map(f => {
  let content = fs.readFileSync(path.join(stylesDir, f), 'utf8');
  content = content.replace(/^\/\*\s*---\s*File:.*?\*\/[\r\n]*/, '');
  return `/* --- File: ${f} --- */\n${content.trim()}`;
}).join('\n\n');

// 5. PER-SOURCE SYNTAX GATE (INV-SDCA-003) on controller.js
const scriptsDir = path.join(baseDir, 'scripts');
const controllerPath = path.join(scriptsDir, 'controller.js');
const controllerJs = fs.readFileSync(controllerPath, 'utf8');

console.log('🔍 Executing Per-Source Syntax Gate (INV-SDCA-003) on controller.js...');
try {
  execFileSync(process.execPath, ['-c', controllerPath], { stdio: 'pipe' });
  console.log('✅ Per-Source Syntax Validation Passed (controller.js).');
} catch (err) {
  console.error('❌ controller.js failed `node -c` syntax validation:');
  console.error(err.stderr ? err.stderr.toString() : err.message);
  process.exit(1);
}

// 6. Zero-Leak Verification Function
function verifyZeroLeak(content, label) {
  if (Array.isArray(masterDecisionsCheck) && masterDecisionsCheck[0] && masterDecisionsCheck[0].title &&
      content.includes(JSON.stringify(masterDecisionsCheck[0].title))) {
    console.error(`❌ SEC-1 REGRESSION: master_decisions.json content detected in ${label}. It must be Firestore-only.`);
    process.exit(1);
  }
}

// 7. CSS Scoping Engine for Monolithic Port Isolation (INC-086 / monolithic-engine-port-css-scoping-gate.md)
function scopeSelector(sel, prefix) {
  sel = sel.trim();
  if (!sel) return '';
  if (sel === ':root') return prefix;
  if (sel === 'body') return prefix;
  if (sel === '*') return prefix + ' *';
  if (sel.startsWith('::-webkit-scrollbar')) return prefix + ' ' + sel;
  if (sel.startsWith('@page')) return sel;
  if (sel === 'body *') return sel; // print reset
  if (sel.startsWith('#tab-cockpit') || sel.startsWith('#cockpitFrame')) return sel;
  return prefix + ' ' + sel;
}

function scopeCssBlock(css, prefix) {
  let result = '';
  let i = 0;
  const len = css.length;

  while (i < len) {
    while (i < len && /\s/.test(css[i])) {
      result += css[i];
      i++;
    }
    if (i >= len) break;

    if (css.slice(i, i + 2) === '/*') {
      const endComment = css.indexOf('*/', i + 2);
      if (endComment === -1) {
        result += css.slice(i);
        break;
      }
      result += css.slice(i, endComment + 2);
      i = endComment + 2;
      continue;
    }

    if (css.slice(i).match(/^@(font-face|page|keyframes)/)) {
      const openBrace = css.indexOf('{', i);
      let braceCount = 1;
      let j = openBrace + 1;
      while (j < len && braceCount > 0) {
        if (css[j] === '{') braceCount++;
        else if (css[j] === '}') braceCount--;
        j++;
      }
      result += css.slice(i, j);
      i = j;
      continue;
    }

    if (css.slice(i).match(/^@media[^{]*\{/)) {
      const match = css.slice(i).match(/^(@media[^{]*\{)/);
      const mediaHeader = match[1];
      result += mediaHeader + '\n';
      i += mediaHeader.length;

      let innerCss = '';
      let braceCount = 1;
      while (i < len && braceCount > 0) {
        if (css.slice(i, i + 2) === '/*') {
          const endComment = css.indexOf('*/', i + 2);
          const cEnd = endComment === -1 ? len : endComment + 2;
          innerCss += css.slice(i, cEnd);
          i = cEnd;
          continue;
        }
        if (css[i] === '{') braceCount++;
        else if (css[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            i++;
            break;
          }
        }
        innerCss += css[i];
        i++;
      }
      result += scopeCssBlock(innerCss, prefix) + '\n}\n';
      continue;
    }

    const openBrace = css.indexOf('{', i);
    if (openBrace === -1) {
      result += css.slice(i);
      break;
    }

    const selectorChunk = css.slice(i, openBrace).trim();
    const closeBrace = css.indexOf('}', openBrace);
    if (closeBrace === -1) {
      result += css.slice(i);
      break;
    }
    const declarationChunk = css.slice(openBrace + 1, closeBrace);

    if (selectorChunk) {
      const scopedSelectors = selectorChunk
        .split(',')
        .map(s => scopeSelector(s, prefix))
        .filter(Boolean)
        .join(',\n');
      result += scopedSelectors + ' {' + declarationChunk + '}';
    } else {
      result += '{' + declarationChunk + '}';
    }

    i = closeBrace + 1;
  }

  return result;
}

// -------------------------------------------------------------
// BUILD TARGET 1: STANDALONE (decorator-cockpit.html)
// -------------------------------------------------------------
if (buildStandalone) {
  console.log('📦 Building Standalone Artifact (decorator-cockpit.html)...');
  const templatePath = path.join(baseDir, 'template.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Missing template.html at', templatePath);
    process.exit(1);
  }
  let output = fs.readFileSync(templatePath, 'utf8');

  output = safeReplace(output, '/* <!-- INJECT:STYLES --> */', combinedCss, 'STYLES');
  output = safeReplace(output, '<!-- INJECT:HEADER -->', headerHtml, 'HEADER');
  output = safeReplace(output, '<!-- INJECT:SIDEBAR -->', sidebarHtml, 'SIDEBAR');
  output = safeReplace(output, '<!-- INJECT:STAGE -->', stageHtml, 'STAGE');
  output = safeReplace(output, '<!-- INJECT:FOUNDER_DECK -->', founderDeckHtml, 'FOUNDER_DECK');
  output = safeReplace(output, '<!-- INJECT:DECISIONS_WORKSPACE -->', decisionsWorkspaceHtml, 'DECISIONS_WORKSPACE');
  output = safeReplace(output, '<!-- INJECT:TOAST -->', toastHtml, 'TOAST');
  output = safeReplace(output, '<!-- INJECT:MODALS -->', combinedModals, 'MODALS');

  output = safeReplace(output, '/* <!-- INJECT:CANONICAL_PLATES --> */', canonicalPlates.trim(), 'CANONICAL_PLATES');
  output = safeReplace(output, '/* <!-- INJECT:TOPIC_PLATE_MAP --> */', topicPlateMap.trim(), 'TOPIC_PLATE_MAP');
  output = safeReplace(output, '/* <!-- INJECT:SLIDES_MARQUEE --> */', slidesMarquee.trim(), 'SLIDES_MARQUEE');
  output = safeReplace(output, '/* <!-- INJECT:SLIDES_RAYAGADA --> */', slidesRayagada.trim(), 'SLIDES_RAYAGADA');

  verifyZeroLeak(output, 'standalone output');

  output = safeReplace(output, '/* <!-- INJECT:CONTROLLER --> */', controllerJs, 'CONTROLLER');

  // Syntax check standalone script block
  const scriptMatch = output.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    console.error('❌ No <script> block found in assembled standalone output.');
    process.exit(1);
  }
  try {
    new Function(scriptMatch[1]);
  } catch (err) {
    console.error('❌ Standalone JavaScript syntax check failed:', err.message);
    process.exit(1);
  }

  const rootOutputFile = path.join(rootDir, 'decorator-cockpit.html');
  const publicOutputFile = path.join(rootDir, 'public', 'decorator-cockpit.html');

  fs.writeFileSync(rootOutputFile, output, 'utf8');
  console.log(`🚀 Emitted root artifact: ${rootOutputFile} (${(output.length / 1024).toFixed(1)} KB)`);

  try {
    fs.mkdirSync(path.dirname(publicOutputFile), { recursive: true });
    fs.writeFileSync(publicOutputFile, output, 'utf8');
    console.log(`🚀 Emitted public artifact: ${publicOutputFile} (${(output.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`❌ Critical: Failed to emit public artifact to ${publicOutputFile}:`, err.message);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// BUILD TARGET 2: FRAGMENT (cockpit-fragment.html)
// -------------------------------------------------------------
if (buildFragment) {
  console.log('🧩 Building Scoped Fragment Artifact (cockpit-fragment.html)...');

  const scopedCss = scopeCssBlock(combinedCss, '#tab-cockpit #cockpitFrame');

  // Fragment base layout styling enforcing monolithic-engine-port-css-scoping-gate invariants
  const fragmentContainerStyles = `
/* ==========================================================================
   Sree Krushna Marriage OS — Decorator Negotiation Cockpit Fragment
   Scoped Exclusively to #tab-cockpit #cockpitFrame (Zero Global Leakage)
   Pattern: monolithic-engine-port-css-scoping-gate (AC-DEC-2026-012)
   ========================================================================== */

#tab-cockpit.active {
  display: flex !important;
  flex-direction: column;
  height: calc(100vh - 140px);
  min-height: 720px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#tab-cockpit #cockpitFrame {
  height: 100%;
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

#tab-cockpit #cockpitFrame .app-shell {
  display: flex !important;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

#tab-cockpit #cockpitFrame .decisions-layout {
  height: calc(100% - var(--header-height));
  flex: 1;
}
`;

  let fragmentOutput = `<!-- ==========================================================================
     Sree Krushna Marriage OS — Decorator Negotiation Cockpit (In-App Fragment)
     Standard: SPEC-ARCH-SDCA-001 | Ruling: AC-DEC-2026-012 / UI-DEC-2026-008
     ========================================================================== -->
<style>
${fragmentContainerStyles}

${scopedCss}
</style>

<div id="cockpitFrame" class="cockpit-container">
  <div class="app-shell">
    <div id="cockpitContentLoadingBanner" style="display:none; align-items:center; gap:10px; justify-content:center; padding:8px 16px; background:rgba(245,158,11,0.12); border-bottom:1px solid rgba(245,158,11,0.3); color:#f59e0b; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:600;">
      <span>⏳ Loading negotiation content…</span>
    </div>
    <div id="cockpitContentErrorBanner" style="display:none; padding:8px 16px; background:rgba(239,68,68,0.12); border-bottom:1px solid rgba(239,68,68,0.3); color:#fca5a5; font-family:'Inter',sans-serif; font-size:0.82rem;"></div>

    ${headerHtml}

    <main class="hud-layout" id="hudWorkspace">
      ${sidebarHtml}
      ${stageHtml}
    </main>

    ${founderDeckHtml}
    ${decisionsWorkspaceHtml}
  </div>

  ${combinedModals}
  ${toastHtml}
</div>

<script>
  const CANONICAL_PLATES = ${canonicalPlates.trim()};
  let VISUAL_PLATES = JSON.parse(JSON.stringify(CANONICAL_PLATES));
  let MASTER_DECISIONS = [];
  const TOPIC_PLATE_MAP = ${topicPlateMap.trim()};
  let TOPICS_MARQUEE = [];
  let TOPICS_RAYAGADA = [];
  const SLIDES_MARQUEE = ${slidesMarquee.trim()};
  const SLIDES_RAYAGADA = ${slidesRayagada.trim()};

  ${controllerJs}

  // Sub-Engine Delegation Contract (sub-engine-shadowing-and-tab-reconciliation.md)
  window.renderDecoratorCockpit = function() {
    if (typeof renderAgendaList === 'function') renderAgendaList();
    if (typeof renderTopicDetail === 'function') renderTopicDetail();
    if (typeof renderSlideIndicators === 'function') renderSlideIndicators();
    if (typeof renderCurrentSlide === 'function') renderCurrentSlide();
    if (typeof recalculate4TierQuote === 'function') recalculate4TierQuote();
    if (typeof renderDecisionsGrid === 'function') renderDecisionsGrid();
  };
</script>

<script type="module">
  import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

  async function loadCockpitContentFromFirestore() {
    if (typeof window.showCockpitContentLoading === 'function') window.showCockpitContentLoading(true);
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    try {
      const db = getFirestore();
      const [mdSnap, tmSnap, trSnap] = await Promise.all([
        getDoc(doc(db, 'cockpit_content', 'master_decisions')),
        getDoc(doc(db, 'cockpit_content', 'topics_marquee')),
        getDoc(doc(db, 'cockpit_content', 'topics_rayagada')),
      ]);

      let md = mdSnap.exists() ? mdSnap.data().payload : [];
      let tm = tmSnap.exists() ? tmSnap.data().payload : [];
      let tr = trSnap.exists() ? trSnap.data().payload : [];

      // DLRS Resilient Local Fallback (Pillar 1)
      if (isLocalhost && (!md.length || !tm.length || !tr.length)) {
        console.warn('⚠️ [DLRS] Local dev mode detected with unseeded Firestore. Loading local data from cockpit_src/data/ ...');
        try {
          const [mdRes, tmRes, trRes] = await Promise.all([
            fetch('cockpit_src/data/master_decisions.json').then(r => r.ok ? r.json() : null),
            fetch('cockpit_src/data/topics_marquee.json').then(r => r.ok ? r.json() : null),
            fetch('cockpit_src/data/topics_rayagada.json').then(r => r.ok ? r.json() : null),
          ]);
          if (mdRes && !md.length) md = mdRes;
          if (tmRes && !tm.length) tm = tmRes;
          if (trRes && !tr.length) tr = trRes;
        } catch (localErr) {
          console.warn('⚠️ [DLRS] Local fallback fetch error:', localErr);
        }
      }

      if (typeof window.applyCockpitContent === 'function') {
        window.applyCockpitContent({
          masterDecisions: md,
          topicsMarquee: tm,
          topicsRayagada: tr,
        });
      }

      if (!md.length && !isLocalhost) {
        if (typeof window.showCockpitContentError === 'function') {
          window.showCockpitContentError('Notice: Cockpit content not yet seeded in Firestore. Authorized SuperAdmins: run npm run seed:cockpit.');
        }
      }
    } catch (err) {
      console.error('Failed to load cockpit content from Firestore:', err);
      if (isLocalhost) {
        console.warn('⚠️ [DLRS] Falling back to local data on Firestore connection failure in local dev...');
        try {
          const [mdRes, tmRes, trRes] = await Promise.all([
            fetch('cockpit_src/data/master_decisions.json').then(r => r.ok ? r.json() : null),
            fetch('cockpit_src/data/topics_marquee.json').then(r => r.ok ? r.json() : null),
            fetch('cockpit_src/data/topics_rayagada.json').then(r => r.ok ? r.json() : null),
          ]);
          if (typeof window.applyCockpitContent === 'function') {
            window.applyCockpitContent({
              masterDecisions: mdRes || [],
              topicsMarquee: tmRes || [],
              topicsRayagada: trRes || [],
            });
          }
        } catch (fallbackErr) {
          if (typeof window.showCockpitContentError === 'function') window.showCockpitContentError(err.message || String(err));
        }
      } else {
        if (typeof window.showCockpitContentError === 'function') window.showCockpitContentError(err.message || String(err));
      }
    } finally {
      if (typeof window.showCockpitContentLoading === 'function') window.showCockpitContentLoading(false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCockpitContentFromFirestore);
  } else {
    loadCockpitContentFromFirestore();
  }
</script>
`;

  verifyZeroLeak(fragmentOutput, 'fragment output');

  // Pre-Emit Syntax Gate on fragment script block
  const fragScriptMatch = fragmentOutput.match(/<script>([\s\S]*?)<\/script>/);
  if (!fragScriptMatch) {
    console.error('❌ No <script> block found in assembled fragment output.');
    process.exit(1);
  }
  try {
    new Function(fragScriptMatch[1]);
    console.log('✅ Pre-Emit Fragment Bundle Syntax Validation Passed.');
  } catch (err) {
    console.error('❌ Assembled fragment bundle JavaScript failed syntax check:');
    console.error(err.message);
    process.exit(1);
  }

  const rootFragmentFile = path.join(rootDir, 'cockpit-fragment.html');
  const publicFragmentFile = path.join(rootDir, 'public', 'cockpit-fragment.html');

  fs.writeFileSync(rootFragmentFile, fragmentOutput, 'utf8');
  console.log(`🚀 Emitted root fragment: ${rootFragmentFile} (${(fragmentOutput.length / 1024).toFixed(1)} KB)`);

  try {
    fs.mkdirSync(path.dirname(publicFragmentFile), { recursive: true });
    fs.writeFileSync(publicFragmentFile, fragmentOutput, 'utf8');
    console.log(`🚀 Emitted public fragment: ${publicFragmentFile} (${(fragmentOutput.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`❌ Critical: Failed to emit public fragment to ${publicFragmentFile}:`, err.message);
    process.exit(1);
  }
}

const elapsed = process.hrtime(startTime);
const ms = (elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(2);
console.log(`🎉 SDCA Cockpit Build Complete in ${ms}ms.`);
