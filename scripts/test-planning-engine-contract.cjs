/**
 * Automated Contract Verification Suite: Universal Planning Engine & Dual-Council Protocol
 * Standards: STD-COUNCIL-DUAL-GATE-001 / STD-UI-INTERACTION-SPEC-001 / STD-PLANNING-ENGINE-001
 * Tickets: SK-026 / SK-008
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const AGENT_SKILL = path.join(REPO_ROOT, '.agent', 'skills', 'writing-plans', 'SKILL.md');
const CLAUDE_SKILL = path.join(REPO_ROOT, '.claude', 'skills', 'writing-plans', 'SKILL.md');
const STANDARDS_CATALOG = path.join(REPO_ROOT, '.agent', 'standards-catalog.json');

console.log('🔍 Auditing Planning Engine Dual-Council & UI/UX Interaction Contract (SK-026)...\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`  ❌ [FAIL] ${msg}`);
    failed = true;
  } else {
    console.log(`  ✓ [PASS] ${msg}`);
  }
}

// 1. Check existence of skill files
assert(fs.existsSync(AGENT_SKILL), '.agent/skills/writing-plans/SKILL.md exists');
assert(fs.existsSync(CLAUDE_SKILL), '.claude/skills/writing-plans/SKILL.md exists');

if (!fs.existsSync(AGENT_SKILL) || !fs.existsSync(CLAUDE_SKILL)) {
  process.exit(1);
}

const agentContent = fs.readFileSync(AGENT_SKILL, 'utf8');
const claudeContent = fs.readFileSync(CLAUDE_SKILL, 'utf8');

// 2. Check for Dual-Council Gate standard
assert(
  agentContent.includes('STD-COUNCIL-DUAL-GATE-001'),
  '.agent/skills/writing-plans declares STD-COUNCIL-DUAL-GATE-001'
);
assert(
  claudeContent.includes('STD-COUNCIL-DUAL-GATE-001'),
  '.claude/skills/writing-plans declares STD-COUNCIL-DUAL-GATE-001'
);

// 3. Check for 7-Domain UI/UX Interaction Specification Matrix
assert(
  agentContent.includes('STD-UI-INTERACTION-SPEC-001'),
  '.agent/skills/writing-plans declares STD-UI-INTERACTION-SPEC-001'
);
assert(
  claudeContent.includes('STD-UI-INTERACTION-SPEC-001'),
  '.claude/skills/writing-plans declares STD-UI-INTERACTION-SPEC-001'
);

// 4. Verify all 7 specific interaction domains are documented
const requiredDomains = [
  'Data Tables & Lists',
  'Media & Lightbox Viewers',
  'Modals, Drawers & Popovers',
  'Interactive Controls & Touch Targets',
  'Keyboard & Accessibility (A11y)',
  'State Craft & Micro-Feedback',
  'Dual-Surface Media Isolation'
];

requiredDomains.forEach(domain => {
  assert(
    agentContent.includes(domain),
    `Planning engine mandates domain: "${domain}"`
  );
});

// 5. Verify standards catalog registration
if (fs.existsSync(STANDARDS_CATALOG)) {
  const catalog = JSON.parse(fs.readFileSync(STANDARDS_CATALOG, 'utf8'));
  const hasDualGate = catalog.standards && catalog.standards.some(s => s.id === 'STD-COUNCIL-DUAL-GATE-001');
  const hasInteractionSpec = catalog.standards && catalog.standards.some(s => s.id === 'STD-UI-INTERACTION-SPEC-001');
  assert(hasDualGate, 'standards-catalog.json registers STD-COUNCIL-DUAL-GATE-001');
  assert(hasInteractionSpec, 'standards-catalog.json registers STD-UI-INTERACTION-SPEC-001');
} else {
  assert(false, 'standards-catalog.json exists');
}

// 6. Verify SAP dual-block parity between .agent and .claude mirrors
const agentSharedCore = agentContent.split('<!-- shared:std.agent.planning-engine.core:start -->')[1]?.split('<!-- shared:std.agent.planning-engine.core:end -->')[0]?.trim();
const claudeSharedCore = claudeContent.split('<!-- shared:std.agent.planning-engine.core:start -->')[1]?.split('<!-- shared:std.agent.planning-engine.core:end -->')[0]?.trim();

assert(agentSharedCore && claudeSharedCore && agentSharedCore === claudeSharedCore, 'SAP Shared Core dual-block is 100% byte-identical between .agent and .claude');

console.log('\n===============================================================');
if (failed) {
  console.error('❌ PLANNING ENGINE CONTRACT VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL PLANNING ENGINE CONTRACT CHECKS PASSED (100% GREEN)');
  process.exit(0);
}
