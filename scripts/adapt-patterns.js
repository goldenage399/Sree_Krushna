const fs = require('fs');
const path = require('path');

const targetDir = 'd:/GitHub_Repo/Sree_Krushna';
const patternsDir = path.join(targetDir, '.agent/patterns');
const routerPath = path.join(targetDir, '.agent/skill-router.yaml');
const routerContent = fs.readFileSync(routerPath, 'utf8').toLowerCase();

const files = fs.readdirSync(patternsDir).filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');

const consumedBlock = 'consumed_by:\n  - file: CLAUDE.md\n    at: "Pattern Activation and PACT-001 Cross-References"\n  - file: .agent/workflows/plan.md\n    at: "Step 0.1: Universal Patterns Reference Check"';

for (const file of files) {
  const ref = path.basename(file, '.md');
  const filePath = path.join(patternsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if router references this pattern
  const isRouted = routerContent.includes('patterns/' + ref.toLowerCase()) || routerContent.includes(ref.toLowerCase());
  const tier = isRouted ? 'routed' : 'reference';

  // Extract triggers if any
  let triggersMatch = content.match(/^triggers:\s*\[(.*?)\]/m) || content.match(/^triggers:\s*\n((?:\s*-\s*.*\n)+)/m);
  let triggersBlock = '';
  if (tier === 'routed' && !triggersMatch) {
    triggersBlock = 'triggers: ["' + ref + '", "' + ref.replace(/-/g, ' ') + '"]\n';
  }

  content = content.replace(/consumed_by:[\s\S]*?(?=\r?\n---)/, consumedBlock);
  content = content.replace(/activation_tier:\s*\w+/, 'activation_tier: ' + tier);

  if (tier === 'routed' && triggersBlock && !content.includes('triggers:')) {
    content = content.replace(/activation_tier:\s*routed/, 'activation_tier: routed\n' + triggersBlock.trim());
  }

  if (!content.includes('canonical_source:')) {
    content = content.replace(/activation_tier:\s*(\w+)/, 'activation_tier: $1\ncanonical_source: task-dashboard');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Patterns aligned with PACT-001 reference/routed tiers.');
