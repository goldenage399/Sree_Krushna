/**
 * Test Harness: Customary Family Obligation Schema & Contract Verification
 * Standard: STD-FAMILY-OBLIGATION-001 / AC-DEC-2026-061 / AC-DEC-2026-062
 * Ticket: SK-020
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { parseYamlFrontmatter } = require('./obligation-parser.cjs');

const rootDir = path.resolve(__dirname, '..');
const obligationsDir = path.join(rootDir, '02_RITUALS_CULTURE', 'obligations');
const hubPath = path.join(rootDir, '02_RITUALS_CULTURE', 'HUB.md');

console.log('▶ [1/6] Verifying Obligations Directory & Hub Registration...');
assert(fs.existsSync(obligationsDir), '02_RITUALS_CULTURE/obligations/ directory must exist');
const hubContent = fs.readFileSync(hubPath, 'utf8');
assert(hubContent.includes('Customary Family Obligations (`OBL-###`)'), 'HUB.md must register Obligations spoke');
assert(hubContent.includes('obligations/'), 'HUB.md must link to obligations directory');
console.log('  ✓ [PASS] Obligations spoke registered in HUB.md');

console.log('▶ [2/6] Verifying Obligation Template Schema Contract...');
const tmplPath = path.join(rootDir, '02_RITUALS_CULTURE', 'obligation_template.md');
assert(fs.existsSync(tmplPath), '02_RITUALS_CULTURE/obligation_template.md must exist');
const tmplContent = fs.readFileSync(tmplPath, 'utf8');

const requiredTokens = [
  'id: OBL-###',
  'entity_type: customary_family_obligation',
  'lifecycle_status:',
  'spec_status:',
  'epistemic_tier:',
  'event_ref:',
  'ritual_ref:',
  'obligor:',
  'recipient:',
  'category:',
  'customary_title:',
  'verbatim_provenance:',
  'items:',
  'financial_obligation:',
  'downstream_projections:',
  'logistical_custody:'
];

requiredTokens.forEach(t => {
  assert(tmplContent.includes(t), `Template missing contract token: ${t}`);
});
console.log('  ✓ [PASS] Obligation template contract verified with 16 schema keys');

console.log('▶ [3/6] Verifying Architecture Specification (SPEC-ARCH-FAMILY-OBLIGATION-001)...');
const specPath = path.join(rootDir, 'docs', 'references', 'SPEC-ARCH-FAMILY-OBLIGATION-001.md');
assert(fs.existsSync(specPath), 'SPEC-ARCH-FAMILY-OBLIGATION-001.md must exist');
const specContent = fs.readFileSync(specPath, 'utf8');
assert(specContent.includes('STD-FAMILY-OBLIGATION-001'), 'Spec must reference STD-FAMILY-OBLIGATION-001');
assert(specContent.includes('AC-DEC-2026-061'), 'Spec must reference AC-DEC-2026-061');
assert(specContent.includes('AC-DEC-2026-062'), 'Spec must reference AC-DEC-2026-062');
assert(specContent.includes('Epistemic Honesty Invariant'), 'Spec must define Epistemic Honesty Invariant');
assert(specContent.includes('Ahiya Manduli'), 'Spec must document Ahiya Manduli customary obligation');
console.log('  ✓ [PASS] Architecture specification verified');

console.log('▶ [4/6] Auditing Core Schema Validation Engine & State Enums...');

const ALLOWED_CATEGORIES = [
  'attire', 'composite_bundle', 'gold_silver', 'edible_hospitality',
  'ceremonial_token', 'honorarium_cash', 'service', 'logistics'
];
const ALLOWED_LIFECYCLE = ['Identified', 'Agreed', 'Procuring', 'Staged', 'Handed_Over', 'Waived'];
const ALLOWED_SPEC_STATUS = [
  'Fully_Specified', 'TBD_Family_Choice', 'Source_Unclear', 'Source_Redacted', 'Pending_Family_Confirmation'
];
const ALLOWED_EPISTEMIC = ['SACRED_CORE', 'PROTOCOL_SPECIFIED', 'UNCERTAIN_EXPLORATORY'];
const ALLOWED_OBLIGOR_FAMILIES = ['groom', 'bride', 'joint'];
const ALLOWED_RECIPIENT_FAMILIES = ['bride', 'groom', 'joint', 'external'];

function validateObligationObject(obl, fileLabel = 'record') {
  assert(obl, `Obligation object missing in ${fileLabel}`);
  assert(obl.id && (/^OBL-\d{3}$/.test(obl.id) || obl.id === 'OBL-###'), `Invalid obligation ID "${obl.id}" in ${fileLabel}`);
  assert.strictEqual(obl.entity_type, 'customary_family_obligation', `Invalid entity_type in ${fileLabel}`);
  assert(ALLOWED_CATEGORIES.includes(obl.category), `Invalid category "${obl.category}" in ${fileLabel}`);
  assert(ALLOWED_LIFECYCLE.includes(obl.lifecycle_status), `Invalid lifecycle_status "${obl.lifecycle_status}" in ${fileLabel}`);
  assert(ALLOWED_SPEC_STATUS.includes(obl.spec_status), `Invalid spec_status "${obl.spec_status}" in ${fileLabel}`);
  assert(ALLOWED_EPISTEMIC.includes(obl.epistemic_tier), `Invalid epistemic_tier "${obl.epistemic_tier}" in ${fileLabel}`);

  assert(obl.obligor && ALLOWED_OBLIGOR_FAMILIES.includes(obl.obligor.family), `Invalid obligor family in ${fileLabel}`);
  assert(obl.recipient && ALLOWED_RECIPIENT_FAMILIES.includes(obl.recipient.family), `Invalid recipient family in ${fileLabel}`);

  // Invariant 1: State Machine Orthogonality Guard
  if (['Staged', 'Handed_Over'].includes(obl.lifecycle_status)) {
    assert(
      !['Source_Unclear', 'Source_Redacted'].includes(obl.spec_status),
      `Orthogonal State Violation in ${fileLabel}: lifecycle "${obl.lifecycle_status}" cannot have spec_status "${obl.spec_status}"`
    );
  }

  // Invariant 2: Epistemic Honesty Cash Guard (Zero Fabricated Totals)
  if (obl.financial_obligation && obl.financial_obligation.headcount === null) {
    assert(
      obl.financial_obligation.estimated_total_inr === null,
      `Epistemic Honesty Violation in ${fileLabel}: estimated_total_inr must be null when headcount is null`
    );
  }

  // Invariant 3: Reciprocal Exchange Cluster Pairing
  if (obl.exchange_cluster && obl.exchange_cluster.is_exchange) {
    assert(
      obl.exchange_cluster.cluster_id && /^EXC-\d{3}$/.test(obl.exchange_cluster.cluster_id),
      `Invalid exchange cluster_id in ${fileLabel}`
    );
    assert(
      obl.exchange_cluster.peer_obligation_id && /^OBL-\d{3}$/.test(obl.exchange_cluster.peer_obligation_id),
      `Invalid exchange peer_obligation_id in ${fileLabel}`
    );
  }

  return true;
}

// Verify Synthetic Valid Fixture
const validFixture = {
  id: 'OBL-025',
  entity_type: 'customary_family_obligation',
  customary_title: 'Ahiya Manduli (Saree for Mummy)',
  english_descriptor: "Groom Family's Auspicious Saree Presentation to Bride's Mother",
  category: 'attire',
  event_ref: 'EVT-004',
  ritual_ref: 'RIT-004',
  obligor: { family: 'groom', primary_contact: 'PER-005', role_title: "Groom's Parents" },
  recipient: { family: 'bride', primary_contact: 'PER-006', role_title: "Bride's Mother (Mummy)" },
  exchange_cluster: { is_exchange: false, cluster_id: null, peer_obligation_id: null },
  lifecycle_status: 'Agreed',
  spec_status: 'Fully_Specified',
  epistemic_tier: 'SACRED_CORE',
  financial_obligation: { is_monetary: false, unit_amount_inr: null, headcount: null, estimated_total_inr: null }
};

assert(validateObligationObject(validFixture, 'synthetic valid fixture'));
console.log('  ✓ [PASS] Synthetic valid fixture conforms to all contract rules');

console.log('▶ [5/6] Testing Invariant Guards & Negative Test Fixtures...');

// Negative Test 1: Handed_Over with Source_Unclear must FAIL
try {
  validateObligationObject({
    ...validFixture,
    lifecycle_status: 'Handed_Over',
    spec_status: 'Source_Unclear'
  }, 'negative fixture: state orthogonality');
  assert.fail('Expected State Orthogonality violation error');
} catch (err) {
  assert(err.message.includes('Orthogonal State Violation'), `Unexpected error message: ${err.message}`);
  console.log('  ✓ [PASS] Correctly rejected invalid state combination (Handed_Over + Source_Unclear)');
}

// Negative Test 2: Fabricated cash total with null headcount must FAIL
try {
  validateObligationObject({
    ...validFixture,
    category: 'honorarium_cash',
    financial_obligation: {
      is_monetary: true,
      unit_amount_inr: 5000,
      headcount: null,
      estimated_total_inr: 50000 // FABRICATED!
    }
  }, 'negative fixture: fabricated cash');
  assert.fail('Expected Epistemic Honesty violation error');
} catch (err) {
  assert(err.message.includes('Epistemic Honesty Violation'), `Unexpected error message: ${err.message}`);
  console.log('  ✓ [PASS] Correctly rejected fabricated cash total when headcount is null');
}

// Negative Test 3: Unpaired exchange cluster must FAIL
try {
  validateObligationObject({
    ...validFixture,
    exchange_cluster: {
      is_exchange: true,
      cluster_id: 'INVALID_CLUSTER',
      peer_obligation_id: null
    }
  }, 'negative fixture: invalid exchange');
  assert.fail('Expected Exchange Cluster violation error');
} catch (err) {
  assert(err.message.includes('Invalid exchange cluster_id'), `Unexpected error message: ${err.message}`);
  console.log('  ✓ [PASS] Correctly rejected invalid exchange cluster pairing');
}

console.log('▶ [6/6] Scanning Physical Obligations Directory...');
const oblFiles = fs.readdirSync(obligationsDir).filter(f => f.startsWith('OBL-') && f.endsWith('.md'));
if (oblFiles.length === 0) {
  console.log('  ℹ️  02_RITUALS_CULTURE/obligations/ is currently empty (awaiting Phase 4 ingestion).');
} else {
  oblFiles.forEach(f => {
    const raw = fs.readFileSync(path.join(obligationsDir, f), 'utf8');
    const parsed = parseYamlFrontmatter(raw);
    assert(parsed, `Failed to parse YAML frontmatter in ${f}`);
    validateObligationObject(parsed, f);
  });
  console.log(`  ✓ [PASS] Scanned and validated ${oblFiles.length} physical obligation records.`);
}

console.log('▶ [7/7] Auditing Obligation Compilation Engine & Dual-Release Byte Parity...');
const compilerPath = path.join(rootDir, 'scripts', 'compile-obligations.cjs');
assert(fs.existsSync(compilerPath), 'scripts/compile-obligations.cjs must exist');

const { execFileSync } = require('child_process');
execFileSync(process.execPath, [compilerPath], { stdio: 'pipe' });

const masterDocPath = path.join(obligationsDir, 'family_obligations_master.md');
assert(fs.existsSync(masterDocPath), 'family_obligations_master.md must be emitted');

const rootDataPath = path.join(rootDir, 'js', 'obligations-data.js');
const pubDataPath = path.join(rootDir, 'public', 'js', 'obligations-data.js');
assert(fs.existsSync(rootDataPath), 'js/obligations-data.js must exist');
assert(fs.existsSync(pubDataPath), 'public/js/obligations-data.js must exist');

const rootData = fs.readFileSync(rootDataPath, 'utf8');
const pubData = fs.readFileSync(pubDataPath, 'utf8');
assert.strictEqual(rootData, pubData, '100% byte parity between root and public obligations-data.js failed');
console.log('  ✓ [PASS] compile-obligations.cjs verified with 100% dual-release byte parity');

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('🎉 OBLIGATION CONTRACT VERIFICATION: 100% GREEN (PHASE 3 COMPILATION ENGINE)');
console.log('════════════════════════════════════════════════════════════════════════════════\n');

module.exports = { validateObligationObject };
