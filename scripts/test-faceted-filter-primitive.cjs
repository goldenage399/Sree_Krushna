/**
 * Test Harness: Universal Agnostic Faceted Filter Primitive (Layer 1 Headless Engine)
 * Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 / AC-DEC-2026-074 / UI-DEC-2026-053
 * Ticket: SK-030 (Phase 1 TDD Suite)
 *
 * Verifies:
 *  1. Declarative schema registration & default state
 *  2. Single dimension filtering
 *  3. Multi-dimensional conjunctive Boolean AND intersection (INV-FACET-INTERSECT-001)
 *  4. Search query filtering combined with active facets
 *  5. Dynamic facet counts computation across orthogonal dimensions (INV-FACET-COUNTS-001)
 *  6. Custom predicates and extractor functions
 *  7. Listener subscription & notification lifecycle
 *  8. Reset state restoration
 *  9. State serialization (getState / setState)
 * 10. URL Query string serialization / deserialization helpers
 */

const assert = require('assert');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║        UNIVERSAL FACETED FILTER ENGINE TEST HARNESS (SK-030 Phase 1)       ║');
console.log('║        Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 | AC-DEC-2026-074     ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

// 1. Module Load Verification
console.log('▶ [1/10] Loading Faceted Filter Engine Module...');
const enginePath = path.resolve(__dirname, '..', 'ui_primitives', 'scripts', 'faceted_filter_engine.js');
let createEngine;

try {
  const mod = require(enginePath);
  createEngine = mod.skCreateFacetedFilterEngine || mod;
  assert.strictEqual(typeof createEngine, 'function', 'Module must export skCreateFacetedFilterEngine factory');
  console.log('  ✓ [PASS] Engine factory loaded successfully');
} catch (err) {
  console.error('  ❌ [FAIL] Failed to load engine module:', err.message);
  process.exit(1);
}

// Synthetic Dataset Fixture
const sampleItems = [
  { id: 'OBL-001', title: 'Baradara Pani Tanka', direction: 'bride', category: 'brass_copper', status: 'delivered', tags: ['customary', 'brass'] },
  { id: 'OBL-002', title: 'Ahiya Manduli (Bride)', direction: 'bride', category: 'gold_silver', status: 'procured', tags: ['gold', 'ritual'] },
  { id: 'OBL-003', title: 'Panchupali Silver Lamp', direction: 'groom', category: 'gold_silver', status: 'procured', tags: ['silver', 'lamp'] },
  { id: 'OBL-004', title: 'Khandua Silk Joda', direction: 'groom', category: 'attire', status: 'procured', tags: ['silk', 'joda'] },
  { id: 'OBL-005', title: 'Sambalpuri Silk Saree', direction: 'bride', category: 'attire', status: 'delivered', tags: ['silk', 'saree'] },
  { id: 'OBL-006', title: 'Phula Mudhi Sweets', direction: 'bride', category: 'confectionery', status: 'planned', tags: ['sweets', 'manduli'] },
  { id: 'OBL-007', title: 'Bandapana Attire Joda', direction: 'bride', category: 'attire', status: 'procured', tags: ['silk', 'attire'] }
];

// Configuration schema
const schemaConfig = {
  dimensions: {
    direction: {
      default: 'all',
      predicate: (item, val) => val === 'all' || item.direction === val
    },
    category: {
      default: 'all',
      predicate: (item, val) => val === 'all' || item.category === val
    },
    status: {
      default: 'all',
      predicate: (item, val) => val === 'all' || item.status === val
    }
  },
  searchExtractor: (item) => [item.id, item.title, item.category, item.tags.join(' ')].join(' ')
};

// 2. Initialization & Default State
console.log('\n▶ [2/10] Verifying Initialization & Default State...');
const engine = createEngine(schemaConfig);
assert.strictEqual(engine.getFacet('direction'), 'all', 'Default direction should be "all"');
assert.strictEqual(engine.getFacet('category'), 'all', 'Default category should be "all"');
assert.strictEqual(engine.getFacet('status'), 'all', 'Default status should be "all"');
assert.strictEqual(engine.getSearchQuery(), '', 'Default search query should be empty');
const initialFiltered = engine.filter(sampleItems);
assert.strictEqual(initialFiltered.length, 7, 'Initially all 7 items must pass');
console.log('  ✓ [PASS] Defaults initialized accurately (7/7 items match)');

// 3. Single Dimension Filtering
console.log('\n▶ [3/10] Verifying Single Dimension Filtering...');
engine.setFacet('direction', 'bride');
assert.strictEqual(engine.getFacet('direction'), 'bride');
const brideItems = engine.filter(sampleItems);
assert.strictEqual(brideItems.length, 5, 'Should return 5 bride items');
assert(brideItems.every(i => i.direction === 'bride'), 'All returned items must have direction=bride');
console.log(`  ✓ [PASS] Single dimension filter returned ${brideItems.length}/5 bride items`);

// 4. Multi-Dimensional Conjunctive AND Intersection (INV-FACET-INTERSECT-001)
console.log('\n▶ [4/10] Verifying Multi-Dimensional Conjunctive AND Intersection...');
// Setting category to attire while direction is bride
engine.setFacet('category', 'attire');
const brideAttire = engine.filter(sampleItems);
// In sampleItems: OBL-005 (bride, attire) and OBL-007 (bride, attire)
assert.strictEqual(brideAttire.length, 2, 'Should return exactly 2 items matching bride AND attire');
assert(brideAttire.every(i => i.direction === 'bride' && i.category === 'attire'), 'Items must satisfy both facets');

// Add third dimension: status = 'delivered'
engine.setFacet('status', 'delivered');
const brideAttireDelivered = engine.filter(sampleItems);
// Only OBL-005 is bride, attire, delivered
assert.strictEqual(brideAttireDelivered.length, 1, 'Should return 1 item matching bride AND attire AND delivered');
assert.strictEqual(brideAttireDelivered[0].id, 'OBL-005');
console.log('  ✓ [PASS] Conjunctive Boolean AND intersection verified across 3 dimensions');

// 5. Dynamic Facet Counts Aggregation (INV-FACET-COUNTS-001)
console.log('\n▶ [5/10] Verifying Dynamic Facet Counts Aggregation...');
// Reset status to 'all', keep direction='bride', category='all'
engine.setFacet('status', 'all');
engine.setFacet('category', 'all');
engine.setFacet('direction', 'bride');

// When direction='bride', compute counts for category options
const categoryCounts = engine.computeCounts(sampleItems, 'category');
// Total bride items = 5
assert.strictEqual(categoryCounts.all, 5, 'Total bride items should be 5 for category.all');
assert.strictEqual(categoryCounts.brass_copper, 1, 'Bride brass_copper count should be 1');
assert.strictEqual(categoryCounts.gold_silver, 1, 'Bride gold_silver count should be 1');
assert.strictEqual(categoryCounts.attire, 2, 'Bride attire count should be 2');
assert.strictEqual(categoryCounts.confectionery, 1, 'Bride confectionery count should be 1');

// When category='attire', compute counts for direction options
engine.setFacet('direction', 'all');
engine.setFacet('category', 'attire');
const directionCounts = engine.computeCounts(sampleItems, 'direction');
// Total attire items = 3 (OBL-004 groom, OBL-005 bride, OBL-007 bride)
assert.strictEqual(directionCounts.all, 3, 'Total attire items should be 3 for direction.all');
assert.strictEqual(directionCounts.bride, 2, 'Bride attire count should be 2');
assert.strictEqual(directionCounts.groom, 1, 'Groom attire count should be 1');
console.log('  ✓ [PASS] Dynamic facet count aggregation adheres to orthogonal recalculation');

// 6. Text Search Filtering Combined with Facets
console.log('\n▶ [6/10] Verifying Text Search Filtering Combined with Facets...');
engine.reset();
engine.setSearchQuery('silk');
const silkItems = engine.filter(sampleItems);
// OBL-004 (groom, attire), OBL-005 (bride, attire), OBL-007 (bride, attire)
assert.strictEqual(silkItems.length, 3, 'Should find 3 items containing "silk"');

// Combine search "silk" with facet direction="bride"
engine.setFacet('direction', 'bride');
const brideSilkItems = engine.filter(sampleItems);
assert.strictEqual(brideSilkItems.length, 2, 'Should find 2 bride items matching "silk"');
assert(brideSilkItems.every(i => i.direction === 'bride'), 'Must match both search and facet');

// Search for term in tags
engine.setSearchQuery('manduli');
const manduliItems = engine.filter(sampleItems);
// OBL-002 (title contains Manduli, bride) and OBL-006 (tags contain manduli, bride)
assert.strictEqual(manduliItems.length, 2, 'Should match in title or tag');
console.log('  ✓ [PASS] Text search seamlessly intersects with active facets');

// 7. Listener Subscription Lifecycle
console.log('\n▶ [7/10] Verifying Listener Subscription Lifecycle...');
let notifications = 0;
let lastState = null;
const unsubscribe = engine.subscribe((state) => {
  notifications++;
  lastState = state;
});

engine.setFacet('direction', 'groom');
assert.strictEqual(notifications, 1, 'Listener should be called on facet change');
assert.strictEqual(lastState.facets.direction, 'groom');

engine.setSearchQuery('lamp');
assert.strictEqual(notifications, 2, 'Listener should be called on search change');
assert.strictEqual(lastState.search, 'lamp');

unsubscribe();
engine.setFacet('direction', 'bride');
assert.strictEqual(notifications, 2, 'Listener must NOT be called after unsubscribe');
console.log('  ✓ [PASS] Subscription lifecycle and event dispatch verified');

// 8. Reset Functionality
console.log('\n▶ [8/10] Verifying Reset Functionality...');
engine.reset();
assert.strictEqual(engine.getFacet('direction'), 'all');
assert.strictEqual(engine.getFacet('category'), 'all');
assert.strictEqual(engine.getFacet('status'), 'all');
assert.strictEqual(engine.getSearchQuery(), '');
const postResetItems = engine.filter(sampleItems);
assert.strictEqual(postResetItems.length, 7, 'All items must pass after reset');
console.log('  ✓ [PASS] Reset restored all dimensions and search to pristine defaults');

// 9. State Serialization & Bulk Restoration
console.log('\n▶ [9/10] Verifying State Serialization & Restoration...');
engine.setFacet('direction', 'groom');
engine.setFacet('category', 'attire');
engine.setSearchQuery('joda');

const snapshot = engine.getState();
assert.deepStrictEqual(snapshot, {
  facets: {
    direction: 'groom',
    category: 'attire',
    status: 'all'
  },
  search: 'joda'
});

engine.reset();
assert.strictEqual(engine.getFacet('direction'), 'all');

engine.setState(snapshot);
assert.strictEqual(engine.getFacet('direction'), 'groom');
assert.strictEqual(engine.getFacet('category'), 'attire');
assert.strictEqual(engine.getSearchQuery(), 'joda');
const restoredFiltered = engine.filter(sampleItems);
assert.strictEqual(restoredFiltered.length, 1);
assert.strictEqual(restoredFiltered[0].id, 'OBL-004');
console.log('  ✓ [PASS] State snapshot serialization and bulk restoration verified');

// 10. URL Query String Serialization / Deserialization
console.log('\n▶ [10/10] Verifying URL Query String Serialization & Deserialization...');
engine.reset();
engine.setFacet('direction', 'bride');
engine.setFacet('category', 'attire');
engine.setSearchQuery('saree');

const qs = engine.toQueryString();
assert(qs.includes('direction=bride'), 'Query string must contain direction=bride');
assert(qs.includes('category=attire'), 'Query string must contain category=attire');
assert(qs.includes('q=saree'), 'Query string must contain q=saree');
assert(!qs.includes('status=all'), 'Default facets should be omitted to keep URL compact');

engine.reset();
engine.fromQueryString(qs);
assert.strictEqual(engine.getFacet('direction'), 'bride');
assert.strictEqual(engine.getFacet('category'), 'attire');
assert.strictEqual(engine.getSearchQuery(), 'saree');
assert.strictEqual(engine.getFacet('status'), 'all');

// Handling empty / malformed query strings safely
engine.fromQueryString('');
assert.strictEqual(engine.getFacet('direction'), 'all');
assert.strictEqual(engine.getSearchQuery(), '');
console.log('  ✓ [PASS] URL Query string round-trip parsing and generation verified');

console.log('\n════════════════════════════════════════════════════════════════════════════');
console.log('🎉 ALL 10 UNIT TEST SUITES PASSED! (SK-030 Universal Faceted Filter Engine)');
console.log('════════════════════════════════════════════════════════════════════════════\n');
