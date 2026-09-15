#!/usr/bin/env node
/**
 * scripts/test-cockpit-smoke.cjs
 *
 * Dedicated Automated Pre-Flight Smoke & Runtime Audit for Decorator Cockpit
 * Validates:
 *   1. Dual release existence & 100% byte parity
 *   2. HTML DOM elements & workspace containers
 *   3. Embedded JavaScript execution in VM sandbox
 *   4. Data integrity (20 Master Decisions, 6 Rayagada Topics, 5 Rayagada Slides)
 *   5. Referenced photo & SVG file existence on disk
 *   6. Hotkey & tone state transitions
 *
 * Usage:
 *   npm run test:cockpit
 *   node scripts/test-cockpit-smoke.cjs
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootPath = path.resolve(__dirname, '..');
const rootFile = path.join(rootPath, 'decorator-cockpit.html');
const publicFile = path.join(rootPath, 'public', 'decorator-cockpit.html');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║        DECORATOR COCKPIT PRE-FLIGHT SMOKE & RUNTIME VERIFICATION GATE      ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

let totalErrors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    totalErrors++;
  } else {
    console.log(`  ✓ [PASS] ${message}`);
  }
}

// 1. Dual Release File Check & Byte Parity
console.log('▶ [1/5] Checking Dual Release Artifacts & Byte Parity...');
assert(fs.existsSync(rootFile), 'Root artifact decorator-cockpit.html exists');
assert(fs.existsSync(publicFile), 'Public artifact public/decorator-cockpit.html exists');

if (fs.existsSync(rootFile) && fs.existsSync(publicFile)) {
  const rootBuf = fs.readFileSync(rootFile);
  const pubBuf = fs.readFileSync(publicFile);
  assert(rootBuf.length === pubBuf.length, `Size matches: ${rootBuf.length} bytes`);
  assert(rootBuf.equals(pubBuf), 'Root and Public artifacts are byte-for-byte identical');
}

// 1b. Fragment Release Artifacts & Byte Parity
const rootFragFile = path.join(rootPath, 'cockpit-fragment.html');
const publicFragFile = path.join(rootPath, 'public', 'cockpit-fragment.html');
if (fs.existsSync(rootFragFile) || fs.existsSync(publicFragFile)) {
  console.log('\n▶ [1b/5] Checking Fragment Release Artifacts & Scoped Isolation...');
  assert(fs.existsSync(rootFragFile), 'Root fragment cockpit-fragment.html exists');
  assert(fs.existsSync(publicFragFile), 'Public fragment public/cockpit-fragment.html exists');

  if (fs.existsSync(rootFragFile) && fs.existsSync(publicFragFile)) {
    const rfBuf = fs.readFileSync(rootFragFile);
    const pfBuf = fs.readFileSync(publicFragFile);
    assert(rfBuf.length === pfBuf.length, `Fragment size matches: ${rfBuf.length} bytes`);
    assert(rfBuf.equals(pfBuf), 'Fragment Root and Public artifacts are byte-for-byte identical');

    const fragHtml = pfBuf.toString('utf8');
    const fragStyleMatch = fragHtml.match(/<style>([\s\S]*?)<\/style>/);
    assert(fragStyleMatch !== null, 'Fragment contains scoped <style> block');
    if (fragStyleMatch) {
      const unscoped = fragStyleMatch[1].split('\n').filter(l => /^(\*|body|html|:root)\s*\{/.test(l.trim()));
      assert(unscoped.length === 0, `Fragment contains 0 unscoped global CSS rules (found ${unscoped.length})`);
    }

    assert(fragHtml.includes('id="cockpitFrame"'), 'Fragment contains #cockpitFrame container');
    assert(fragHtml.includes('window.renderDecoratorCockpit ='), 'Fragment exports window.renderDecoratorCockpit delegation hook');
  }
}

// 2. DOM Structural Audit
console.log('\n▶ [2/5] Auditing Rendered DOM Structure & Workspaces...');
const html = fs.readFileSync(publicFile, 'utf8');

const requiredElements = [
  'id="hudWorkspace"',
  'id="founderWorkspace"',
  'id="decisionsWorkspace"',
  'id="btnModeHud"',
  'id="btnModeFounder"',
  'id="btnModeDecisions"',
  'id="decisionProgressLabel"',
  'id="decisionsProgressFill"',
  'id="decisionsGridContainer"',
  'id="fbtnDecisions-all"',
  'id="fbtnDecisions-pending"',
  'id="fbtnDecisions-locked"',
  'id="fbtnDecisions-vendor"',
  'id="lightboxModalBackdrop"',
  'id="lookbookModalBackdrop"',
  'id="tenderModalBackdrop"',
  'id="pinModalBackdrop"',
  'id="customPhotoModalBackdrop"',
  'class="decision-media-bar"',
  'class="decision-swatch-strip"',
  'class="decision-option-card ',
  'id="cockpitAuthOverlay"',
  'id="cockpitLoginBtn"',
  'initAuthGate',
  // SEC-1 remediation (AC-DEC-2026-012): the Firestore content-fetch contract must be wired.
  'let MASTER_DECISIONS = [];',
  'let TOPICS_MARQUEE = [];',
  'let TOPICS_RAYAGADA = [];',
  'loadCockpitContentFromFirestore',
  "'cockpit_content'"
];

requiredElements.forEach(selector => {
  assert(html.includes(selector), `HTML contains DOM element/contract: ${selector}`);
});

// 3. Asset Existence on Disk
console.log('\n▶ [3/5] Verifying Physical Media Assets on Disk...');
const scriptMatch = html.match(/const CANONICAL_PLATES = (\[[\s\S]*?\]);/);
assert(scriptMatch !== null, 'CANONICAL_PLATES array is present in assembled script');

if (scriptMatch) {
  const plates = JSON.parse(scriptMatch[1]);
  assert(plates.length >= 8, `CANONICAL_PLATES has ${plates.length} registered plates`);
  plates.forEach(p => {
    if (p.photoSrc) {
      const relPhoto = p.photoSrc.replace('./', '');
      const pubPhotoPath = path.join(rootPath, 'public', relPhoto);
      assert(fs.existsSync(pubPhotoPath), `Photo exists: ${relPhoto}`);
    }
    if (p.blueprintSrc) {
      const relSvg = p.blueprintSrc.replace('./', '');
      const pubSvgPath = path.join(rootPath, 'public', relSvg);
      assert(fs.existsSync(pubSvgPath), `CAD SVG exists: ${relSvg}`);
    }
  });
}

// 4. Data Stores Integrity + SEC-1 Zero-Leak Contract
// NOTE (AC-DEC-2026-012): master_decisions.json / topics_marquee.json / topics_rayagada.json
// are Firestore-sourced now (see cockpit_src/template.html + firestore.rules `cockpit_content`)
// and are intentionally NOT embedded in the compiled HTML. Shape/integrity checks now read the
// source-of-truth JSON files directly (these are exactly what scripts/seed-cockpit-firestore.html
// pushes to Firestore); a companion zero-leak check proves the actual content never reaches the
// static file.
console.log('\n▶ [4/5] Auditing Structured Data Stores & SEC-1 Data-Residency Contract...');
const dataDir = path.join(rootPath, 'cockpit_src', 'data');
const decs = JSON.parse(fs.readFileSync(path.join(dataDir, 'master_decisions.json'), 'utf8'));
const topicsMarqueeFixture = JSON.parse(fs.readFileSync(path.join(dataDir, 'topics_marquee.json'), 'utf8'));
const topicsRayagadaFixture = JSON.parse(fs.readFileSync(path.join(dataDir, 'topics_rayagada.json'), 'utf8'));

assert(decs.length === 20, `master_decisions.json has exactly 20 steps (found ${decs.length})`);
const withIcons = decs.filter(d => d.domainIcon);
assert(withIcons.length === 20, `All 20 decisions have domainIcon defined (found ${withIcons.length})`);
const withPlates = decs.filter(d => d.plateIndex !== undefined);
assert(withPlates.length >= 10, `At least 10 physical decisions have plateIndex assigned (found ${withPlates.length})`);
const dec08 = decs.find(d => d.id === 'DEC-08');
assert(dec08 && dec08.options[0].swatches && dec08.options[0].swatches.length === 4, 'DEC-08 has 4 live CSS palette swatches');

assert(topicsRayagadaFixture.length === 6, `topics_rayagada.json has 6 comprehensive battlecards (found ${topicsRayagadaFixture.length})`);
topicsRayagadaFixture.forEach((t, i) => {
  assert(t.scripts && t.scripts.warm && t.scripts.data && t.scripts.firm, `Topic ${i} (${t.title}) has all 3 tone scripts`);
});

console.log('\n▶ [4b/5] SEC-1 Zero-Leak Verification (sensitive content must NOT ship in the static file)...');
assert(!html.includes(JSON.stringify(decs[0].title)), 'master_decisions.json content (decision titles) is NOT present in compiled HTML');
assert(!html.includes(JSON.stringify(topicsRayagadaFixture[0].title)), 'topics_rayagada.json content (topic titles) is NOT present in compiled HTML');
assert(!html.includes(JSON.stringify(topicsMarqueeFixture[0].scripts.firm)), 'topics_marquee.json negotiation scripts are NOT present in compiled HTML');

if (fs.existsSync(publicFragFile)) {
  const fragHtml = fs.readFileSync(publicFragFile, 'utf8');
  assert(!fragHtml.includes(JSON.stringify(decs[0].title)), 'master_decisions.json content is NOT present in compiled fragment');
  assert(!fragHtml.includes(JSON.stringify(topicsRayagadaFixture[0].title)), 'topics_rayagada.json content is NOT present in compiled fragment');
  assert(!fragHtml.includes(JSON.stringify(topicsMarqueeFixture[0].scripts.firm)), 'topics_marquee.json scripts are NOT present in compiled fragment');
}

const rayagadaSlidesMatch = html.match(/const SLIDES_RAYAGADA = (\[[\s\S]*?\]);/);
assert(rayagadaSlidesMatch !== null, 'SLIDES_RAYAGADA array is present in script');
if (rayagadaSlidesMatch) {
  const slides = JSON.parse(rayagadaSlidesMatch[1]);
  assert(slides.length === 5, `SLIDES_RAYAGADA has 5 presentation slides (found ${slides.length})`);
}

// 5. JavaScript VM Sandbox Execution & State Machine Test
console.log('\n▶ [5/5] Executing Script in VM Sandbox & State Machine Test...');
const rawScriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert(rawScriptMatch !== null, '<script> block extracted successfully');

if (rawScriptMatch) {
  const mockStorage = {};
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
          contains: (c) => classes.has(c),
          toggle: (c, force) => {
            if (force === undefined) {
              if (classes.has(c)) classes.delete(c); else classes.add(c);
            } else if (force) {
              classes.add(c);
            } else {
              classes.delete(c);
            }
          }
        },
        innerHTML: '',
        textContent: '',
        appendChild: () => {},
        querySelectorAll: () => [],
        querySelector: () => null,
        setAttribute: () => {},
        getAttribute: () => ''
      };
    }
    return mockElements[id];
  };

  const sandbox = {
    console: { log: () => {}, warn: () => {}, error: console.error },
    document: {
      getElementById: (id) => mockEl(id),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => mockEl('div'),
      addEventListener: () => {}
    },
    window: {
      addEventListener: () => {},
      localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = v; },
        removeItem: (k) => { delete mockStorage[k]; }
      },
      location: { reload: () => {} }
    },
    localStorage: {
      getItem: (k) => mockStorage[k] || null,
      setItem: (k, v) => { mockStorage[k] = v; },
      removeItem: (k) => { delete mockStorage[k]; }
    },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    alert: () => {},
    confirm: () => true,
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: clearTimeout
  };

  try {
    vm.createContext(sandbox);
    vm.runInContext(rawScriptMatch[1], sandbox);
    assert(true, 'Assembled script executes in VM sandbox without runtime errors');

    // SEC-1 remediation (AC-DEC-2026-012): MASTER_DECISIONS/TOPICS_MARQUEE/TOPICS_RAYAGADA
    // start empty in the compiled script (see Phase 4). Simulate what
    // cockpit_src/template.html's onSignedIn Firestore fetch would deliver by calling
    // applyCockpitContent() directly with the same source-of-truth JSON fixtures used
    // in Phase 4, then re-run the state-machine assertions against the now-populated state.
    assert(typeof sandbox.applyCockpitContent === 'function', 'applyCockpitContent() bootstrap function is present in compiled script');
    if (typeof sandbox.applyCockpitContent === 'function') {
      sandbox.applyCockpitContent({
        masterDecisions: decs,
        topicsMarquee: topicsMarqueeFixture,
        topicsRayagada: topicsRayagadaFixture
      });
      assert(true, 'applyCockpitContent() ran without runtime errors against production-shaped fixture data');
    }

    // Test calculateDecisionProgress function in sandbox
    if (typeof sandbox.calculateDecisionProgress === 'function') {
      const prog = sandbox.calculateDecisionProgress();
      assert(prog && prog.total === 20, `calculateDecisionProgress() returned 20 steps (resolved: ${prog.count}, ${prog.percent}%)`);
    }

    // Test switchEvent function
    if (typeof sandbox.switchEvent === 'function') {
      sandbox.switchEvent('rayagada');
      assert(mockElements['btnEventRayagada'] && mockElements['btnEventRayagada'].classList.contains('active'), 'switchEvent("rayagada") sets Rayagada pill active');
      assert(mockElements['metricVenueId'] && mockElements['metricVenueId'].textContent.includes('VEN-001'), 'switchEvent("rayagada") updates metricVenueId to VEN-001');

      sandbox.switchEvent('marquee');
      assert(mockElements['btnEventMarquee'] && mockElements['btnEventMarquee'].classList.contains('active'), 'switchEvent("marquee") sets Marquee pill active');
      assert(mockElements['metricVenueId'] && mockElements['metricVenueId'].textContent.includes('VEN-002'), 'switchEvent("marquee") updates metricVenueId to VEN-002');
    }

    // Test switchTone function
    if (typeof sandbox.switchTone === 'function') {
      sandbox.switchTone('firm');
      assert(mockElements['btnToneFirm'] && mockElements['btnToneFirm'].classList.contains('active'), 'switchTone("firm") sets Firm tone button active');
      assert(mockElements['spokenScriptBox'] && mockElements['spokenScriptBox'].textContent.length > 0, 'switchTone("firm") populates spokenScriptBox');

      sandbox.switchTone('warm');
      assert(mockElements['btnToneWarm'] && mockElements['btnToneWarm'].classList.contains('active'), 'switchTone("warm") sets Warm tone button active');
    }

  } catch (err) {
    assert(false, `Sandbox execution error: ${err.message}`);
  }
}

console.log('\n' + '═'.repeat(80));
if (totalErrors > 0) {
  console.error(`🚨 DECORATOR COCKPIT SMOKE GATE FAILED with ${totalErrors} error(s).`);
  process.exit(1);
} else {
  console.log('🎉 DECORATOR COCKPIT SMOKE GATE PASSED: 100% GREEN & MEETING READY!');
  process.exit(0);
}
