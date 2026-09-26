/**
 * Test Harness: Customary Family Obligation Schema & Contract Verification
 * Standard: STD-FAMILY-OBLIGATION-001 / AC-DEC-2026-061 / AC-DEC-2026-062
 * Ticket: SK-020
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const obligationsDir = path.join(rootDir, '02_RITUALS_CULTURE', 'obligations');
const hubPath = path.join(rootDir, '02_RITUALS_CULTURE', 'HUB.md');

console.log('▶ [1/4] Verifying Obligations Directory & Hub Registration...');
assert(fs.existsSync(obligationsDir), '02_RITUALS_CULTURE/obligations/ directory must exist');
const hubContent = fs.readFileSync(hubPath, 'utf8');
assert(hubContent.includes('Customary Family Obligations (`OBL-###`)'), 'HUB.md must register Obligations spoke');
assert(hubContent.includes('obligations/'), 'HUB.md must link to obligations directory');
console.log('  ✓ [PASS] Obligations spoke registered in HUB.md');

console.log('▶ [2/4] Verifying Obligation Template Schema Contract...');
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

console.log('▶ [3/4] Verifying Architecture Specification (SPEC-ARCH-FAMILY-OBLIGATION-001)...');
const specPath = path.join(rootDir, 'docs', 'references', 'SPEC-ARCH-FAMILY-OBLIGATION-001.md');
assert(fs.existsSync(specPath), 'SPEC-ARCH-FAMILY-OBLIGATION-001.md must exist');
const specContent = fs.readFileSync(specPath, 'utf8');
assert(specContent.includes('STD-FAMILY-OBLIGATION-001'), 'Spec must reference STD-FAMILY-OBLIGATION-001');
assert(specContent.includes('AC-DEC-2026-061'), 'Spec must reference AC-DEC-2026-061');
assert(specContent.includes('AC-DEC-2026-062'), 'Spec must reference AC-DEC-2026-062');
assert(specContent.includes('Epistemic Honesty Invariant'), 'Spec must define Epistemic Honesty Invariant');
assert(specContent.includes('Ahiya Manduli'), 'Spec must document Ahiya Manduli customary obligation');
console.log('  ✓ [PASS] Architecture specification verified');
