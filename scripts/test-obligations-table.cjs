/**
 * Sree Krushna Marriage OS — Test Suite: Family Obligations Tabular Run Sheet
 * Standard: STD-SHOPPING-OBLIGATION-002 / AC-DEC-2026-064 / UI-DEC-2026-048
 * Ticket: SK-022 (Phase 1 Validation Gate VG-1)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const rootHtmlFile = path.join(rootDir, 'family-obligations-run-sheet.html');
const pubHtmlFile = path.join(rootDir, 'public', 'family-obligations-run-sheet.html');
const mdTableFile = path.join(rootDir, '02_RITUALS_CULTURE', 'obligations', 'family_obligations_table.md');
const obligationsDataFile = path.join(rootDir, 'js', 'obligations-data.js');

console.log('🧪 Running Test Suite: Family Obligations Tabular Run Sheet (SK-022)...');

// 1. Verify file existence
assert(fs.existsSync(rootHtmlFile), 'family-obligations-run-sheet.html must exist at root');
assert(fs.existsSync(pubHtmlFile), 'public/family-obligations-run-sheet.html must exist');
assert(fs.existsSync(mdTableFile), 'family_obligations_table.md must exist in 02_RITUALS_CULTURE/obligations/');
console.log('  ✓ All target artifacts exist on disk.');

// 2. Verify 100% byte parity between root and public HTML
const rootBuf = fs.readFileSync(rootHtmlFile);
const pubBuf = fs.readFileSync(pubHtmlFile);
assert.strictEqual(rootBuf.length, pubBuf.length, `Byte length mismatch: ${rootBuf.length} vs ${pubBuf.length}`);
assert(rootBuf.equals(pubBuf), 'Root and Public run sheet HTML must have 100% byte parity');
console.log(`  ✓ 100% Byte Parity verified between root and public (${rootBuf.length} bytes).`);

// 3. Verify all 49 obligations are represented in the HTML
const htmlContent = rootBuf.toString('utf8');
const sandbox = {};
const rawCode = fs.readFileSync(obligationsDataFile, 'utf8');
eval(rawCode.replace('window.', 'sandbox.'));
const obligations = sandbox.FAMILY_OBLIGATIONS_DATA.obligations || [];

assert.strictEqual(obligations.length, 49, 'Expected exactly 49 obligations in SSOT dataset');

let missingInHtml = 0;
let missingInMd = 0;
const mdContent = fs.readFileSync(mdTableFile, 'utf8');

obligations.forEach(o => {
  if (!htmlContent.includes(`<strong>${o.id}</strong>`)) {
    console.error(`  ❌ Missing in HTML: ${o.id}`);
    missingInHtml++;
  }
  if (!mdContent.includes(o.id)) {
    console.error(`  ❌ Missing in Markdown: ${o.id}`);
    missingInMd++;
  }
});

assert.strictEqual(missingInHtml, 0, `All 49 obligations must be present in HTML (missing: ${missingInHtml})`);
assert.strictEqual(missingInMd, 0, `All 49 obligations must be present in Markdown (missing: ${missingInMd})`);
console.log('  ✓ All 49 canonical obligations (OBL-001 through OBL-049) verified in both HTML and Markdown tables.');

// 4. Verify all milestones are present
const expectedMilestones = ['EVT-001', 'EVT-002', 'EVT-004', 'EVT-005', 'EVT-006', 'POST_WEDDING'];
expectedMilestones.forEach(m => {
  assert(htmlContent.includes(m), `Milestone ${m} must be present in HTML`);
  assert(mdContent.includes(m), `Milestone ${m} must be present in Markdown`);
});
console.log('  ✓ All canonical ritual milestones present in tabular grouping.');

// 5. Verify print-specific markup and styles
assert(htmlContent.includes('@media print'), 'HTML must include dedicated @media print stylesheet');
assert(htmlContent.includes('size: A4 landscape'), 'HTML must declare A4 landscape print format');
assert(htmlContent.includes('check-box-square'), 'HTML must render tactile coordinator verification checkboxes');
assert(htmlContent.includes('signoff-footer'), 'HTML must render family elder sign-off footer blocks');
console.log('  ✓ Print formatting, A4 landscape orientation, checkboxes, and sign-off blocks verified.');

console.log('🎉 ALL TESTS PASSED: Family Obligations Tabular Run Sheet (VG-1) 100% Certified!');
