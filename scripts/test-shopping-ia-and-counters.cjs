/**
 * Automated Contract Test: Shopping Module IA Alignment & Dynamic Counter Synchronization (SK-024 Phase 3)
 * Standards: STD-SHOPPING-OBLIGATION-002 / AC-DEC-2026-066 / UI-DEC-2026-050
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const bodyPath = path.join(rootDir, 'shopping_src', 'components', 'body.html');
const viewPath = path.join(rootDir, 'shopping_src', 'components', 'obligations_view.html');
const controllerPath = path.join(rootDir, 'shopping_src', 'scripts', 'controller.js');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║       SHOPPING IA ALIGNMENT & DYNAMIC COUNTER SYNC GATE (SK-024)           ║');
console.log('║       Standard: STD-SHOPPING-OBLIGATION-002 | Ruling: AC-DEC-2026-066      ║');
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

const bodyContent = fs.readFileSync(bodyPath, 'utf8');
const viewContent = fs.readFileSync(viewPath, 'utf8');
const controllerContent = fs.readFileSync(controllerPath, 'utf8');

// 1. Audit Stale "49" Count Eradication in shopping_src/
console.log('▶ [1/4] Auditing Zero Stale "49" Counter Strings in shopping_src/...');

check('Zero stale "49" references exist in body.html', () => {
  const matches = (bodyContent.match(/49/g) || []);
  assert.strictEqual(matches.length, 0, `Found ${matches.length} occurrence(s) of "49" in body.html`);
});

check('Zero stale "49" references exist in obligations_view.html', () => {
  const matches = (viewContent.match(/49/g) || []);
  assert.strictEqual(matches.length, 0, `Found ${matches.length} occurrence(s) of "49" in obligations_view.html`);
});

check('Zero stale "49" references exist in controller.js', () => {
  const matches = (controllerContent.match(/49/g) || []);
  assert.strictEqual(matches.length, 0, `Found ${matches.length} occurrence(s) of "49" in controller.js`);
});

// 2. Audit Dynamic Counter Badges & Subnav Integration
console.log('\n▶ [2/4] Auditing Dynamic Counter Badges & Subnav Labels in body.html...');

check('body.html declares obl-count-badge in banner and subnav', () => {
  assert(bodyContent.includes('class="obl-count-badge"'), 'Missing obl-count-badge class in body.html');
  assert(bodyContent.includes('Family Obligations (<span class="obl-count-badge">53</span>)'), 'Missing 53 count badge in banner or subnav');
});

check('body.html button tooltips cite 53 Customary Obligations', () => {
  assert(bodyContent.includes('Explore Customary Family Lineage Obligations (53)'), 'Banner button tooltip missing 53');
  assert(bodyContent.includes('Customary Family Lineage Obligations &amp; Handover Protocols (53)'), 'Subnav button tooltip missing 53');
});

// 3. Audit Obligations View Header, KPIs & Filter Pills
console.log('\n▶ [3/4] Auditing Obligations View Static Placeholders & KPIs...');

check('obligations_view.html sets total KPI and subtitle to 53', () => {
  assert(viewContent.includes('id="oblKpiTotal">53<'), 'oblKpiTotal must be 53');
  assert(viewContent.includes('53 customary lineage handovers'), 'Subtitle must reference 53 handovers');
});

check('obligations_view.html sets groom KPI to 26', () => {
  assert(viewContent.includes('id="oblKpiGroom">26<'), 'oblKpiGroom must be 26');
});

check('Filter pills in obligations_view.html reflect updated counts', () => {
  assert(viewContent.includes('All Obligations (53)'), 'Missing All Obligations (53) pill');
  assert(viewContent.includes('🤵 Groom Side (26)'), 'Missing Groom Side (26) pill');
  assert(viewContent.includes('All (53)'), 'Missing inner All (53) pill');
  assert(viewContent.includes('🚚 Logistics (5)'), 'Missing inner Logistics (5) pill');
});

// 4. Audit Dynamic Counter Binding in controller.js
console.log('\n▶ [4/4] Auditing Dynamic Counter Synchronization in controller.js...');

check('updateObligationKpis dynamically synchronizes .obl-count-badge', () => {
  assert(controllerContent.includes('.obl-count-badge'), 'updateObligationKpis must query .obl-count-badge');
  assert(controllerContent.includes('badge.textContent = totalCount'), 'Must set badge.textContent to dynamic totalCount');
});

check('shareAllObligationsWhatsApp dynamically binds total and category counts', () => {
  assert(controllerContent.includes('${totalCount} customary lineage handovers'), 'WhatsApp share string must use dynamic totalCount');
  assert(controllerContent.includes('${groomCount} Groom Side Obligations'), 'WhatsApp share string must use dynamic groomCount');
});

check('printObligationsSheet dynamically sets totalCount in print subtitle', () => {
  assert(controllerContent.includes('${totalCount} Codified Ritual Dayitva'), 'Print subtitle must use dynamic totalCount');
});

// Summary
console.log('\n════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('🎉 ALL IA ALIGNMENT & COUNTER CHECKS PASSED: SK-024 PHASE 3 VERIFIED!');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(0);
} else {
  console.error(`❌ ${failures} CHECK(S) FAILED IN SK-024 PHASE 3 VERIFICATION.`);
  console.log('════════════════════════════════════════════════════════════════════════════\n');
  process.exit(1);
}
