const fs = require('fs');
const assert = require('assert');

console.log('▶ [1/4] Auditing Dual Release Artifacts & Byte Parity...');
const rootHtml = fs.readFileSync('shopping-registry.html', 'utf8');
const pubHtml = fs.readFileSync('public/shopping-registry.html', 'utf8');
assert.strictEqual(rootHtml, pubHtml, 'Byte parity between root and public shopping-registry.html failed');
console.log('  ✓ [PASS] shopping-registry.html: 100% byte-identical across root and public/ (' + rootHtml.length + ' bytes)');

const rootData = fs.readFileSync('js/shopping-data.js', 'utf8');
const pubData = fs.readFileSync('public/js/shopping-data.js', 'utf8');
assert.strictEqual(rootData, pubData, 'Byte parity between root and public js/shopping-data.js failed');
console.log('  ✓ [PASS] js/shopping-data.js: 100% byte-identical across root and public/ (' + rootData.length + ' bytes)');

console.log('▶ [2/4] Auditing Rendered DOM Structure & Workspaces (INC-086 Scoped)...');
const domChecks = [
  'id="shoppingRegistryRoot"',
  'id="shopWelcomeBanner"',
  'id="shoppingStepper"',
  'id="chapterMilestoneTrack"',
  'id="shoppingClusterPods"',
  'id="shoppingStoreNavigator"',
  'id="storesGrid"',
  'id="shopFilterPills"',
  'id="shopSearchInput"',
  'id="itemsGrid"',
  'id="shopToast"',
  'window.selectChapter',
  'window.selectClusterOption',
  'window.shareClusterWhatsApp',
  'window.togglePurchased',
  'window.toggleApproval',
  'parseUrlParams'
];

domChecks.forEach(check => {
  assert(rootHtml.includes(check), `DOM element/contract missing: ${check}`);
  console.log(`  ✓ [PASS] HTML contains DOM element/contract: ${check}`);
});

console.log('▶ [3/4] Auditing Shared Data Layer Schema (SPEC-PROC-TROUSSEAU-001)...');
const dataChecks = [
  '"chapters":',
  '"clusters":',
  '"stores":',
  '"items":',
  'TRS-BR-01',
  'TRS-BR-02',
  'TRS-GR-01',
  'TRS-GR-03',
  'TRS-JW-01',
  'TRS-JW-07',
  'TRS-SA-01',
  'TRS-SA-02',
  'cluster_vivaha_pata',
  'cluster_groom_mandap',
  'cluster_bridal_lehenga',
  'cluster_sara_inlaws',
  'whatsappTemplate'
];

dataChecks.forEach(check => {
  assert(rootData.includes(check), `Data layer contract missing: ${check}`);
  console.log(`  ✓ [PASS] Data layer contains contract: ${check}`);
});

console.log('▶ [4/4] Verifying 30/30 Item Count & Category Distribution...');
const jsonMatch = rootData.match(/\{[\s\S]*\}/);
assert(jsonMatch, 'Could not extract JSON data from shopping-data.js');
const data = JSON.parse(jsonMatch[0]);
assert.strictEqual(data.chapters.length, 4, 'Must have exactly 4 shopping chapters');
assert.strictEqual(data.clusters.length, 4, 'Must have exactly 4 consensus clusters');
assert.strictEqual(data.stores.length, 8, 'Must have exactly 8 verified Bhubaneswar stores');
assert.strictEqual(data.items.length, 30, 'Must have exactly 30 itemized shopping records');

const bridalCount = data.items.filter(i => i.category === 'bridal').length;
const groomCount = data.items.filter(i => i.category === 'groom').length;
const jewelleryCount = data.items.filter(i => i.category === 'jewellery').length;
const saraCount = data.items.filter(i => i.category === 'sara').length;

assert.strictEqual(bridalCount, 7, 'Must have 7 bridal items');
assert.strictEqual(groomCount, 8, 'Must have 8 groom items');
assert.strictEqual(jewelleryCount, 9, 'Must have 9 jewellery items');
assert.strictEqual(saraCount, 6, 'Must have 6 sara gifting items');

console.log(`  ✓ [PASS] Total 30 items verified: Bridal (${bridalCount}), Groom (${groomCount}), Jewellery (${jewelleryCount}), Sara Gifting (${saraCount})`);

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('🎉 SHOPPING REGISTRY & CONSENSUS GATE PASSED: 100% GREEN & READY FOR BHUBANESWAR TRIP!');
console.log('════════════════════════════════════════════════════════════════════════════════\n');
