/**
 * Test Harness: Customary Family Obligations 2D Faceted Filter Integration (SK-030 Phase 3)
 * Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 / STD-FAMILY-OBLIGATION-001
 * Ruling: AC-DEC-2026-074 / UI-DEC-2026-053
 *
 * Verifies that Family Obligations can be filtered simultaneously across:
 *  - Direction (Bride Side / Groom Side / Joint / Unresolved)
 *  - Category (Attire & Silks / Gold & Silver / Cash / Bundles / Food / Logistics)
 *  - Text Search (Ritual / Relative / Customary Title / OBL-###)
 * with dynamic count recalculation and zero 1D overwrite collisions.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║     FAMILY OBLIGATIONS 2D FACETED FILTER VERIFICATION (SK-030 Phase 3)     ║');
console.log('║     Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 | AC-DEC-2026-074        ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

const rootDir = path.resolve(__dirname, '..');

// 1. Load Real Obligations Data
console.log('▶ [1/5] Loading Canonical Obligations Data (js/obligations-data.js)...');
const dataFilePath = path.join(rootDir, 'js', 'obligations-data.js');
assert(fs.existsSync(dataFilePath), 'js/obligations-data.js must exist');
const dataContent = fs.readFileSync(dataFilePath, 'utf8');

const sandbox = {};
sandbox.window = sandbox;
const vm = require('vm');
vm.createContext(sandbox);
vm.runInContext(dataContent, sandbox);

const obligationsData = sandbox.FAMILY_OBLIGATIONS_DATA;
assert(obligationsData && Array.isArray(obligationsData.obligations), 'Must export FAMILY_OBLIGATIONS_DATA with obligations array');
const obls = obligationsData.obligations;
console.log(`  ✓ [PASS] Loaded ${obls.length} canonical obligations from data layer`);

// 2. Load Faceted Filter Engine Primitive
console.log('\n▶ [2/5] Initializing Faceted Filter Engine with Obligations Schema...');
const engineMod = require(path.join(rootDir, 'ui_primitives', 'scripts', 'faceted_filter_engine.js'));
const createEngine = engineMod.skCreateFacetedFilterEngine;

const engine = createEngine({
  dimensions: {
    direction: {
      default: 'all',
      options: ['all', 'bride', 'groom', 'joint', 'unresolved'],
      predicate: (o, val) => {
        if (val === 'all') return true;
        if (val === 'bride') return o.obligor && (o.obligor.family === 'bride' || o.obligor.family === 'joint');
        if (val === 'groom') return o.obligor && o.obligor.family === 'groom';
        if (val === 'joint') return (o.obligor && o.obligor.family === 'joint') || (o.exchange_cluster && o.exchange_cluster.is_exchange);
        if (val === 'unresolved') {
          return ['TBD_Family_Choice', 'Source_Unclear', 'Source_Redacted', 'Pending_Family_Confirmation'].includes(o.spec_status) || o.lifecycle_status === 'Identified';
        }
        return true;
      }
    },
    category: {
      default: 'all',
      options: ['all', 'attire', 'gold_silver', 'composite_bundle', 'edible_hospitality', 'cash', 'logistics'],
      predicate: (o, val) => {
        if (val === 'all') return true;
        if (val === 'attire') return o.category === 'attire';
        if (val === 'gold_silver') return o.category === 'gold_silver';
        if (val === 'cash') {
          return o.category === 'cash_envelope' || o.category === 'honorarium_cash' || (o.financial_obligation && o.financial_obligation.is_monetary);
        }
        if (val === 'composite_bundle') return o.category === 'composite_bundle';
        if (val === 'edible_hospitality') return o.category === 'edible_hospitality';
        if (val === 'logistics') return o.category === 'logistics' || o.category === 'service';
        return o.category === val;
      }
    },
    event: {
      default: 'all',
      predicate: (o, val) => val === 'all' || o.event_ref === val
    }
  },
  searchExtractor: (o) => {
    const itemsText = (o.items || []).map(i => i.description).join(' ');
    return [
      o.id,
      o.customary_title,
      o.english_descriptor,
      o.obligor ? o.obligor.role_title : '',
      o.recipient ? o.recipient.role_title : '',
      o.event_ref,
      o.ritual_ref,
      itemsText
    ].join(' ');
  }
});

assert.strictEqual(engine.filter(obls).length, obls.length, 'Initially all items pass');
console.log('  ✓ [PASS] Engine initialized with 3 orthogonal dimensions (direction, category, event)');

// 3. Simultaneous 2D Filtering: Direction (Bride) + Category (Attire)
console.log('\n▶ [3/5] Testing Simultaneous 2D Filter: Bride Side (1) AND Attire & Silks (2)...');
engine.setFacet('direction', 'bride');
const brideAll = engine.filter(obls);
assert(brideAll.length > 0, 'Bride obligations must be non-empty');
console.log(`  - Active direction='bride': ${brideAll.length} items`);

// Apply secondary facet category='attire' simultaneously
engine.setFacet('category', 'attire');
const brideAttire = engine.filter(obls);
assert(brideAttire.length > 0, 'Bride + Attire items must be non-empty');
assert(brideAttire.length < brideAll.length, 'Bride + Attire must be a proper subset of all Bride items');
assert(brideAttire.every(o => (o.obligor.family === 'bride' || o.obligor.family === 'joint') && o.category === 'attire'),
  'All returned items must satisfy BOTH direction=bride AND category=attire');
console.log(`  ✓ [PASS] Simultaneous 2D Intersection verified: found ${brideAttire.length} Bride Attire items without 1D overwrite collision!`);

// 4. Dynamic Count Badges Aggregation Verification
console.log('\n▶ [4/5] Testing Dynamic Count Recalculation across Orthogonal Facets...');
// When direction='bride', computing category counts should reflect breakdown among bride items
const brideCategoryCounts = engine.computeCounts(obls, 'category');
assert.strictEqual(brideCategoryCounts.all, brideAll.length, 'category.all count must equal total bride items');
assert.strictEqual(brideCategoryCounts.attire, brideAttire.length, 'category.attire count must match true subset count');
assert(brideCategoryCounts.gold_silver !== undefined, 'category.gold_silver count should be computed');

// When category='attire', computing direction counts should reflect breakdown among attire items
engine.setFacet('direction', 'all');
engine.setFacet('category', 'attire');
const allAttire = engine.filter(obls);
const attireDirectionCounts = engine.computeCounts(obls, 'direction');
assert.strictEqual(attireDirectionCounts.all, allAttire.length, 'direction.all count must equal total attire items');
assert.strictEqual(attireDirectionCounts.bride, brideAttire.length, 'direction.bride count must equal bride attire items');
console.log(`  ✓ [PASS] Dynamic counts accurately recalculate in both directions (Bride Attire: ${brideAttire.length}, Total Attire: ${allAttire.length})`);

// 5. Text Search with Active Facets & Reset
console.log('\n▶ [5/5] Testing Text Search with Active Facets & Reset Behavior...');
engine.setFacet('direction', 'bride');
engine.setFacet('category', 'attire');
engine.setSearchQuery('silk');
const filteredSilk = engine.filter(obls);
assert(filteredSilk.length > 0, 'Must find silk attire items on bride side');
assert(filteredSilk.every(o => o.category === 'attire'), 'All search results must still satisfy active category facet');

engine.reset();
assert.strictEqual(engine.filter(obls).length, obls.length, 'Reset must restore full 53 items');
console.log('  ✓ [PASS] Search and reset operate seamlessly with multi-facet engine');

console.log('\n════════════════════════════════════════════════════════════════════════════');
console.log('🎉 ALL 5 OBLIGATION 2D FACETED FILTER CHECKS PASSED: SK-030 PHASE 3 VERIFIED!');
console.log('════════════════════════════════════════════════════════════════════════════\n');
