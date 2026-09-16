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
  'id="shopViewSwitcher"',
  'id="tabCatalogView"',
  'id="tabSurveyView"',
  'id="interactiveSurveyStudio"',
  'id="surveyLiveBudgetBar"',
  'window.switchShoppingView',
  'window.selectSurveyTier',
  'window.selectTailoringChoice',
  'window.updateSurveyUI',
  'window.selectChapter',
  'window.selectClusterOption',
  'window.shareClusterWhatsApp',
  'window.togglePurchased',
  'window.toggleApproval',
  'window.openVisualSearch',
  'storeFilterBar',
  'shop-store-map-btn',
  'shop-visual-search-btn',
  'parseUrlParams'
];

domChecks.forEach(check => {
  assert(rootHtml.includes(check), `DOM element/contract missing: ${check}`);
  console.log(`  ✓ [PASS] HTML contains DOM element/contract: ${check}`);
});

console.log('▶ [3/4] Auditing Shared Data Layer Schema (SPEC-PROC-TROUSSEAU-001 / P-SHOPPING-DISCOVERY-001)...');
const dataChecks = [
  '"chapters":',
  '"clusters":',
  '"stores":',
  '"items":',
  'chapter_engagement',
  'cluster_engagement_rings',
  'TRS-EG-01',
  'TRS-EG-02',
  'TRS-EG-03',
  'TRS-EG-04',
  'TRS-EG-05',
  'TRS-BR-01',
  'TRS-BR-02',
  'TRS-GR-01',
  'TRS-GR-03',
  'TRS-JW-01',
  'TRS-JW-07',
  'TRS-SA-01',
  'TRS-SA-02',
  'TRS-OD-01',
  'TRS-OD-02',
  'TRS-OD-03',
  'TRS-OD-04',
  'TRS-OD-05',
  'TRS-OD-06',
  'TRS-OD-07',
  'TRS-BR-08',
  'TRS-GR-10',
  'cluster_vivaha_pata',
  'cluster_groom_mandap',
  'cluster_bridal_lehenga',
  'cluster_sara_inlaws',
  'whatsappTemplate',
  'mapsUrl'
];

dataChecks.forEach(check => {
  assert(rootData.includes(check), `Data layer contract missing: ${check}`);
  console.log(`  ✓ [PASS] Data layer contains contract: ${check}`);
});

console.log('▶ [4/4] Verifying 44/44 Item Count, Dual-Look Attire, Stores & Category Distribution...');
const jsonMatch = rootData.match(/\{[\s\S]*\}/);
assert(jsonMatch, 'Could not extract JSON data from shopping-data.js');
const data = JSON.parse(jsonMatch[0]);
assert.strictEqual(data.chapters.length, 5, 'Must have exactly 5 shopping chapters (including Engagement)');
assert.strictEqual(data.clusters.length, 5, 'Must have exactly 5 consensus clusters');
assert.strictEqual(data.stores.length, 8, 'Must have exactly 8 verified Bhubaneswar stores');

// Verify all stores have category and mapsUrl
data.stores.forEach(store => {
  assert(store.category, `Store ${store.id} missing category`);
  assert(store.mapsUrl && store.mapsUrl.startsWith('https://www.google.com/maps'), `Store ${store.id} missing valid Google Maps URL`);
});
console.log('  ✓ [PASS] All 8 stores categorized with verified Google Maps navigation URLs');

assert.strictEqual(data.items.length, 44, 'Must have exactly 44 itemized shopping records');

const bridalCount = data.items.filter(i => i.category === 'bridal').length;
const groomCount = data.items.filter(i => i.category === 'groom').length;
const jewelleryCount = data.items.filter(i => i.category === 'jewellery').length;
const saraCount = data.items.filter(i => i.category === 'sara').length;
const engagementCount = data.items.filter(i => i.category === 'engagement').length;

assert.strictEqual(bridalCount, 10, 'Must have 10 bridal items');
assert.strictEqual(groomCount, 10, 'Must have 10 groom items');
assert.strictEqual(jewelleryCount, 11, 'Must have 11 jewellery items');
assert.strictEqual(saraCount, 8, 'Must have 8 sara gifting items');
assert.strictEqual(engagementCount, 5, 'Must have 5 engagement items');

console.log(`  ✓ [PASS] Total 44 items verified: Engagement (${engagementCount}), Bridal (${bridalCount}), Groom (${groomCount}), Jewellery (${jewelleryCount}), Sara Gifting (${saraCount})`);

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('🎉 SHOPPING REGISTRY & LITURGICAL RECONCILIATION GATE: 100% GREEN (44/44 ITEMS)');
console.log('════════════════════════════════════════════════════════════════════════════════\n');
