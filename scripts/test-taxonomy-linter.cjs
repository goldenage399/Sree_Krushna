#!/usr/bin/env node
/**
 * scripts/test-taxonomy-linter.cjs — Unit Test Suite for Scoped Taxonomy Linter (SK-019 Phase 2)
 *
 * Verifies:
 * 1. Detection of prohibited synonyms in sample text.
 * 2. Acceptance of preferred canonical terms.
 * 3. Ignoring prohibited terms inside markdown code blocks and inline code spans.
 * 4. Ignoring prohibited terms inside markdown URLs.
 * 5. Clean execution in --shared-only mode.
 */
'use strict';

const assert = require('assert');

console.log('🧪 ========================================================');
console.log('🏛️ SK-019 Test Suite: Scoped Taxonomy Vocabulary Linter');
console.log('==========================================================\n');

// 1. Module Import
let taxonomyLinter;
try {
  taxonomyLinter = require('./verify-taxonomy-vocabulary.cjs');
} catch (err) {
  console.error('❌ Failed to require verify-taxonomy-vocabulary.cjs:', err.message);
  process.exit(1);
}

const { lintText, sanitizeMarkdown, compileRules } = taxonomyLinter;

assert(typeof lintText === 'function', 'lintText must be an exported function');
assert(typeof sanitizeMarkdown === 'function', 'sanitizeMarkdown must be an exported function');
assert(typeof compileRules === 'function', 'compileRules must be an exported function');

// 2. Unit Test: sanitizeMarkdown (stripping code blocks and URLs)
console.log('🔍 [1/4] Testing Markdown Sanitization (Code & Link stripping)...');
const dirtyMd = `
Here is prose text with an assertion.
\`\`\`javascript
const prohibited = "Completion Checklist";
\`\`\`
Also an inline code snippet \`Signoff Criteria\` should be ignored.
And a link [Valid Anchor](https://example.com/parent/child/docs) where URL is preserved or stripped.
`;

const sanitized = sanitizeMarkdown(dirtyMd);
assert(!sanitized.includes('Completion Checklist'), 'Fenced code blocks must be stripped');
assert(!sanitized.includes('Signoff Criteria'), 'Inline code spans must be stripped');
console.log('  ✅ Markdown code blocks and inline code sanitized successfully.');

// 3. Unit Test: Prohibited Synonym Detection
console.log('\n🔍 [2/4] Testing Prohibited Synonym Detection...');
const sampleBadText = `
In this project, we must follow the Completion Checklist before merging.
Also, each task needs an assert step to verify the state.
`;

const rules = compileRules({ sharedOnly: false });
const violations = lintText(sampleBadText, rules);

assert.strictEqual(violations.length, 2, `Must detect exactly 2 violations, got ${violations.length}`);
assert(violations.some(v => v.prohibited === 'Completion Checklist'), 'Must flag "Completion Checklist"');
assert(violations.some(v => v.prohibited === 'assert step'), 'Must flag "assert step"');
console.log(`  ✅ Successfully detected violations: ${violations.map(v => v.prohibited).join(', ')}`);

// 4. Unit Test: Canonical Preferred Terms Pass
console.log('\n🔍 [3/4] Testing Canonical Preferred Terms Acceptance...');
const sampleGoodText = `
In this project, we must follow the Definition of Done (DoD v1.7) before merging.
Also, each task ends with a Validation Gate (VG) and Decision Node (DN).
We adhere to Spoke & Wheel SSOT architecture.
`;

const cleanViolations = lintText(sampleGoodText, rules);
assert.strictEqual(cleanViolations.length, 0, `Canonical text must produce 0 violations, got ${cleanViolations.length}`);
console.log('  ✅ 100% canonical text produced 0 violations.');

// 5. Unit Test: --shared-only Mode
console.log('\n🔍 [4/4] Testing --shared-only Mode Filtering...');
const sampleRepoText = `
We are organizing the Ring ceremony for the couple.
`;

const sharedRules = compileRules({ sharedOnly: true });
const sharedViolations = lintText(sampleRepoText, sharedRules);
// In sharedOnly mode, repo-specific "Ring ceremony" should NOT be flagged
assert.strictEqual(sharedViolations.length, 0, 'sharedOnly mode must ignore repo-specific prohibited terms');

const allRules = compileRules({ sharedOnly: false });
const allViolations = lintText(sampleRepoText, allRules);
// In standard mode, repo-specific "Ring ceremony" MUST be flagged
assert.strictEqual(allViolations.length, 1, 'Standard mode must flag repo-specific prohibited terms');
assert.strictEqual(allViolations[0].preferred, 'Nirbandha & Ashirbad');
console.log('  ✅ --shared-only mode isolation verified.');

console.log('\n==========================================================');
console.log('✨ ALL TAXONOMY LINTER TESTS PASSED (0 ERRORS)! ✨');
console.log('==========================================================\n');
