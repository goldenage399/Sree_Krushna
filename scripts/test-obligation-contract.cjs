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
