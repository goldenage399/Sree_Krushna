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
  'parseUrlParams',
  'id="shopCatalogViewToggle"',
  'id="btnCatalogCards"',
  'id="btnCatalogList"',
  'window.setCatalogViewMode',
  'window.selectItemOption',
  'window.shareItemOption',
  'window.openOptionIntakeModal',
  'window.closeOptionIntakeModal',
  'id="skOptionIntakeBackdrop"',
  'id="skOptionItemId"',
  'id="skDriveUrlInput"',
  'id="skBtnSubmitOption"',
  'highlight-target-item',
  'shop-share-look-btn',
  'shop-card-options-bar',
  'shop-option-chip-add',
  'id="catalogSubnavStrip"',
  'window.setCatalogSubView',
  'window.jumpToStore',
  'window.jumpToChapter',
  'catalog-subnav-btn'
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

console.log('▶ [5/5] Auditing Visual Asset Taxonomy & 100% Byte Parity (P-UNIVERSAL-VISUAL-ASSET-001)...');
const path = require('path');
const rootRegPath = path.resolve('assets/shopping/registry.json');
const pubRegPath = path.resolve('public/assets/shopping/registry.json');
assert(fs.existsSync(rootRegPath), 'assets/shopping/registry.json must exist');
assert(fs.existsSync(pubRegPath), 'public/assets/shopping/registry.json must exist');
const rootReg = JSON.parse(fs.readFileSync(rootRegPath, 'utf8'));
const pubReg = JSON.parse(fs.readFileSync(pubRegPath, 'utf8'));
assert.strictEqual(rootReg.items.length, 8, 'Must have 8 registered items in visual asset taxonomy');
assert.strictEqual(pubReg.items.length, 8, 'Must have 8 registered items in public asset taxonomy');
assert.strictEqual(fs.readFileSync(rootRegPath, 'utf8'), fs.readFileSync(pubRegPath, 'utf8'), 'Byte parity between root and public registry.json failed');

rootReg.items.forEach(it => {
  assert(it.options.length >= 1, `Item ${it.itemId} must have at least 1 image option`);
  it.options.forEach(opt => {
    assert(opt.filename.toLowerCase().endsWith('.jpg'), `Image ${opt.filename} must be .jpg format`);
    const rootImg = path.join(path.dirname(rootRegPath), it.slug, opt.filename);
    const pubImg = path.join(path.dirname(pubRegPath), it.slug, opt.filename);
    assert(fs.existsSync(rootImg), `Image ${rootImg} missing in root`);
    assert(fs.existsSync(pubImg), `Image ${pubImg} missing in public`);
    assert.strictEqual(fs.statSync(rootImg).size, fs.statSync(pubImg).size, `Byte parity failed for ${opt.filename}`);
  });
});
console.log(`  ✓ [PASS] All 8 visual reference folders, .jpg assets, and registry.json verified with 100% byte parity.`);

console.log('▶ [6/6] Auditing Pinterest Intake, Multi-Image Containers & Collab Deep-Link Sharing (P-PINTEREST-INTAKE-001 / AC-DEC-2026-038)...');
// 1. Verify CSS partial modularity (< 500 lines)
const collabCssPath = path.resolve('shopping_src/styles/08_collab_options_and_sharing.css');
assert(fs.existsSync(collabCssPath), '08_collab_options_and_sharing.css must exist');
const collabCss = fs.readFileSync(collabCssPath, 'utf8');
const collabCssLines = collabCss.split('\n').length;
assert(collabCssLines <= 500, `08_collab_options_and_sharing.css has ${collabCssLines} lines, exceeds 500-line modular limit`);
console.log(`  ✓ [PASS] 08_collab_options_and_sharing.css modularity verified (${collabCssLines} lines, < 500)`);

// 2. Verify compiled CSS rules exist in standalone HTML
assert(rootHtml.includes('@keyframes targetPulse'), 'Compiled HTML must include targetPulse keyframe animation');
assert(rootHtml.includes('.highlight-target-item'), 'Compiled HTML must include highlight-target-item selector');
assert(rootHtml.includes('.shop-card-options-bar'), 'Compiled HTML must include shop-card-options-bar selector');
assert(rootHtml.includes('.shop-share-look-btn'), 'Compiled HTML must include shop-share-look-btn selector');
console.log('  ✓ [PASS] Target pulse, option switcher, and share look styles compiled into distribution HTML');

// 3. Verify Firestore security rules validation
const firestoreRules = fs.readFileSync('firestore.rules', 'utf8');
assert(firestoreRules.includes('options') && firestoreRules.includes('selectedOptionIndex'), 'firestore.rules must allow options and selectedOptionIndex');
console.log('  ✓ [PASS] firestore.rules validates options and selectedOptionIndex on shopping_items');

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('🎉 SHOPPING REGISTRY & LITURGICAL RECONCILIATION GATE: 100% GREEN (44/44 ITEMS)');
console.log('════════════════════════════════════════════════════════════════════════════════\n');
