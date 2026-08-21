#!/usr/bin/env node
/**
 * bootstrap-spoke-governance.cjs — SAP Automated Repository Governance Onboarding
 *
 * Purpose:
 *   1-Command setup to initialize and wire full .agent governance, PACT-001 patterns,
 *   skills, workflows, verification gates, and CLAUDE.md/GEMINI.md for ANY new or existing repo.
 *
 * Usage:
 *   node scripts/bootstrap-spoke-governance.cjs --target="D:/GitHub_Repo/NewRepoName"
 *   node scripts/bootstrap-spoke-governance.cjs --target="../NewRepo" --name="CustomName"
 *
 * Exit codes:
 *   0 — target repository successfully initialized and 100% verified
 *   1 — initialization or verification failed
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HUB_ROOT = path.resolve(__dirname, '..');

// ─── Parse CLI Arguments ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
let targetArg = null;
let nameArg = null;
let descArg = null;
let dryRun = false;
let force = false;

for (const arg of args) {
  if (arg.startsWith('--target=')) targetArg = arg.split('=').slice(1).join('=');
  else if (arg === '-t' && args[args.indexOf(arg) + 1]) targetArg = args[args.indexOf(arg) + 1];
  else if (arg.startsWith('--name=')) nameArg = arg.split('=').slice(1).join('=');
  else if (arg.startsWith('--description=')) descArg = arg.split('=').slice(1).join('=');
  else if (arg === '--dry-run') dryRun = true;
  else if (arg === '--force' || arg === '-f') force = true;
}

if (!targetArg) {
  console.error('❌ Error: Missing required parameter --target=<path>');
  console.error('Usage: node scripts/bootstrap-spoke-governance.cjs --target="D:/GitHub_Repo/TargetRepo"');
  process.exit(1);
}

const TARGET_ROOT = path.resolve(process.cwd(), targetArg);
const REPO_NAME = nameArg || path.basename(TARGET_ROOT);
const REPO_DESC = descArg || `${REPO_NAME} — Domain Application & Knowledge Base`;

console.log(`\n🚀 [SAP Governance Bootstrap] Starting repository onboarding...`);
console.log(`   Hub Source:  ${HUB_ROOT}`);
console.log(`   Target Repo: ${TARGET_ROOT}`);
console.log(`   Repo Name:   ${REPO_NAME}`);
console.log(`   Description: ${REPO_DESC}\n`);

// ─── Helper Functions ──────────────────────────────────────────────────────────
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    if (!dryRun) fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${path.relative(TARGET_ROOT, dirPath) || '.'}`);
  }
}

function writeFileNoBom(filePath, content) {
  if (dryRun) {
    console.log(`📝 [Dry-Run] Write: ${path.relative(TARGET_ROOT, filePath)}`);
    return;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log(`📝 Written: ${path.relative(TARGET_ROOT, filePath)}`);
}

function copyFileSafe(srcRel, dstRel) {
  const src = path.join(HUB_ROOT, srcRel);
  const dst = path.join(TARGET_ROOT, dstRel);
  if (!fs.existsSync(src)) {
    console.warn(`⚠️ Source file missing: ${srcRel}`);
    return;
  }
  if (!dryRun) {
    ensureDir(path.dirname(dst));
    fs.copyFileSync(src, dst);
  }
  console.log(`📋 Copied:  ${dstRel}`);
}

function copyDirRecursive(srcRel, dstRel) {
  const src = path.join(HUB_ROOT, srcRel);
  const dst = path.join(TARGET_ROOT, dstRel);
  if (!fs.existsSync(src)) return;

  ensureDir(dst);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcEntry = path.join(src, entry.name);
    const dstEntry = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(path.join(srcRel, entry.name), path.join(dstRel, entry.name));
    } else if (entry.isFile()) {
      if (!dryRun) fs.copyFileSync(srcEntry, dstEntry);
      console.log(`📋 Copied:  ${path.join(dstRel, entry.name)}`);
    }
  }
}

// ─── Step 1: Directory Structure ──────────────────────────────────────────────
console.log(`\n--- Step 1: Initializing Directory Structure ---`);
const DIRS = [
  '.agent/workflows/portable',
  '.agent/skills',
  '.agent/patterns',
  '.claude/skills',
  'docs/protocols',
  'docs/ssot',
  'scripts',
];
DIRS.forEach(d => ensureDir(path.join(TARGET_ROOT, d)));

// ─── Step 2: Verification Scripts ─────────────────────────────────────────────
console.log(`\n--- Step 2: Deploying Governance Verification Scripts ---`);
// Spoke verification script (checks P82 and PACT-001)
const SPOKE_VERIFIER_SRC = path.join(HUB_ROOT, '..', 'Capsicum', 'scripts', 'verify-governance-wiring.cjs');
if (fs.existsSync(SPOKE_VERIFIER_SRC)) {
  if (!dryRun) fs.copyFileSync(SPOKE_VERIFIER_SRC, path.join(TARGET_ROOT, 'scripts/verify-governance-wiring.cjs'));
  console.log(`📋 Copied:  scripts/verify-governance-wiring.cjs (Spoke Verifier)`);
} else {
  copyFileSafe('scripts/verify-governance-wiring.cjs', 'scripts/verify-governance-wiring.cjs');
}
copyFileSafe('scripts/verify-governance-schema.cjs', 'scripts/verify-governance-schema.cjs');

// ─── Step 3: Protocol Documentation ───────────────────────────────────────────
console.log(`\n--- Step 3: Copying Protocol Documentation ---`);
copyFileSafe('docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md', 'docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md');
copyFileSafe('docs/protocols/governance-wiring.schema.json', 'docs/protocols/governance-wiring.schema.json');
copyFileSafe('.agent/patterns/README.md', '.agent/patterns/README.md');

// ─── Step 4: Workflows & Governance Councils ──────────────────────────────────
console.log(`\n--- Step 4: Synchronizing Workflows & Governance Councils ---`);
const WORKFLOWS = [
  'plan.md',
  'plan-review.md',
  'sap-sync.md',
  'capture-pattern.md',
  'capture-pattern-lite.md',
  'skill-onboarding.md',
  'governance-workflow.md',
  'aos-session-open.md',
  'aos-session-close.md',
  'architecture-council.md',
  'ui-council.md',
  'external-ui-redesign.md',
  'mobile-ui-engineering.md',
  'table-schema-documentation.md',
  'new-prd.md',
  'perf-review.md',
];
WORKFLOWS.forEach(wf => copyFileSafe(`.agent/workflows/${wf}`, `.agent/workflows/${wf}`));

const PORTABLE_WORKFLOWS = [
  'spoke-and-wheel-docs.md',
  'systematic-debugging.md',
  'session-handoff-system.md',
  'ssot-reconciliation.md',
  'financial-integrity-patterns.md',
  'spreadsheet-backend-patterns.md',
];
PORTABLE_WORKFLOWS.forEach(pwf => copyFileSafe(`.agent/workflows/portable/${pwf}`, `.agent/workflows/portable/${pwf}`));

// ─── Step 5: Full .agent/skills Suite ─────────────────────────────────────────
console.log(`\n--- Step 5: Deploying All .agent Skills ---`);
const CORE_SKILLS = [
  'protocol-enforcer-pre-code',
  'writing-plans',
  'systematic-debugger',
  'prompt-clarity',
  'pin-branch',
  'mermaid-skill',
  'ssot-domain-mapper',
  'writing-technical-documentation',
  'writing-clearly-and-concisely',
  'memory-session-loader',
  'memory-session-end',
  'memory-event-logger',
  'memory-decision-logger',
  'ui-ux-pro-max',
  'frontend-design',
  'ui-design-validator',
  'mobile-ui-validator',
  'parent-layout-audit',
  'cos-orchestrator',
  'cos-safe-refactor',
  'cos-integration-verifier',
  'admin-component-contracts',
  'declarative-schema-enforcer',
  'contract-first-api-validator',
  'schema-migration-guide',
  'caveman',
  'caveman-compress',
  'change-prd-architect',
  'enhancement-scaffolder',
  'enhancement-tracker-update',
  'phased-commit-orchestrator',
  'writejournal-audit-gate',
  'pirr-compliance-checklist',
  'planning-with-files',
  'test-driven-development',
  'backend-test-generator',
  'gas-deploy-guard',
  'gas-optimizer',
  'task-firestore-direct-write',
  'vercel-react-best-practices',
];
CORE_SKILLS.forEach(skill => copyDirRecursive(`.agent/skills/${skill}`, `.agent/skills/${skill}`));

// ─── Step 6: Deploy .claude/skills (Impeccable, Site Architecture, etc.) ──────
console.log(`\n--- Step 6: Deploying Claude-Native Skills (Impeccable, etc.) ---`);
const CLAUDE_SKILLS = [
  'impeccable',
  'architecture-patterns',
  'high-end-visual-design',
  'improve-codebase-architecture',
  'site-architecture',
  'web-design-guidelines',
  'skill-creator',
  'triage',
  'grill-with-docs',
  'python-performance-optimization',
];
CLAUDE_SKILLS.forEach(skill => copyDirRecursive(`.claude/skills/${skill}`, `.claude/skills/${skill}`));

// ─── Step 7: Incident Encyclopedia (All 86+ INCs) ────────────────────────────
console.log(`\n--- Step 7: Deploying Incident Encyclopedia (docs/incidents/) ---`);
ensureDir(path.join(TARGET_ROOT, 'docs/incidents'));
copyDirRecursive('docs/incidents', 'docs/incidents');

// ─── Step 8: AST-Grep Static Rules & Query Tools ──────────────────────────────
console.log(`\n--- Step 8: Deploying AST-Grep Rules & Query CLI Tool ---`);
ensureDir(path.join(TARGET_ROOT, '.claude/sg-rules'));
copyDirRecursive('.claude/sg-rules', '.claude/sg-rules');
if (fs.existsSync(path.join(HUB_ROOT, 'tools/query-cli'))) {
  ensureDir(path.join(TARGET_ROOT, 'tools/query-cli'));
  copyDirRecursive('tools/query-cli', 'tools/query-cli');
}

// ─── Step 9: Deploy All Ecosystem Patterns (PACT-001 Adaptation) ─────────────
console.log(`\n--- Step 9: Deploying All Ecosystem Patterns (PACT-001) ---`);
const routerSrcPath = path.join(HUB_ROOT, '.agent/skill-router.yaml');
const routerSrcContent = fs.existsSync(routerSrcPath) ? fs.readFileSync(routerSrcPath, 'utf8').toLowerCase() : '';

const patternsSrcDir = path.join(HUB_ROOT, '.agent/patterns');
const patternFiles = fs.readdirSync(patternsSrcDir).filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');

const LOCAL_CONSUMED_BLOCK = `consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"`;

const deployedPatternNames = [];

patternFiles.forEach(patName => {
  const ref = path.basename(patName, '.md');
  deployedPatternNames.push(ref);
  const srcPath = path.join(patternsSrcDir, patName);
  let content = fs.readFileSync(srcPath, 'utf8');

  // Ensure PACT-001 frontmatter exists
  if (!content.includes('activation_tier:')) {
    if (content.startsWith('---')) {
      content = content.replace(/^---\r?\n/, `---\npattern: ${ref}\nactivation_tier: reference\ncanonical_source: task-dashboard\nstatus: HYPOTHESIS\n`);
    } else {
      content = `---\npattern: ${ref}\nactivation_tier: reference\ncanonical_source: task-dashboard\nstatus: HYPOTHESIS\n${LOCAL_CONSUMED_BLOCK}\n---\n\n` + content;
    }
  }

  // Replace entire consumed_by block with spoke local block
  content = content.replace(/consumed_by:[\s\S]*?(?=\r?\n(?:triggers|portability|canonical_source|activation_tier|status|tags|description|---):?)/, LOCAL_CONSUMED_BLOCK + '\n');

  // Determine tier after frontmatter is intact
  let triggersMatch = content.match(/^triggers:\s*\[.+\]/m) || content.match(/^triggers:\s*\n\s*-\s*.+/m);
  let hasTriggers = !!triggersMatch;
  let hasRouterEntry = routerSrcContent.includes('id: pattern-' + ref.toLowerCase()) || routerSrcContent.includes('id: ' + ref.toLowerCase());
  let tier = (hasTriggers && hasRouterEntry) ? 'routed' : 'reference';

  content = content.replace(/activation_tier:\s*\w+/, 'activation_tier: ' + tier);

  if (!content.includes('canonical_source:')) {
    content = content.replace(/activation_tier:\s*(\w+)/, 'activation_tier: $1\ncanonical_source: task-dashboard');
  }

  writeFileNoBom(path.join(TARGET_ROOT, '.agent/patterns', patName), content);
});

// Ensure plan.md references all patterns
const targetPlanWf = path.join(TARGET_ROOT, '.agent/workflows/plan.md');
if (fs.existsSync(targetPlanWf)) {
  let planContent = fs.readFileSync(targetPlanWf, 'utf8');
  const patternList = deployedPatternNames.map(p => `- \`.agent/patterns/${p}.md\``).join('\n');
  const patternSection = `\n## Step 0.1: Universal Patterns Reference Check\nReview relevant ecosystem patterns:\n${patternList}\n\n`;
  if (planContent.includes('## Step 0.1: Universal Patterns Reference Check')) {
    planContent = planContent.replace(/## Step 0\.1: Universal Patterns Reference Check[\s\S]*?(?=\r?\n## )/, patternSection.trim() + '\n\n');
  } else {
    planContent = planContent.replace(/# \/plan Workflow\r?\n/, `# /plan Workflow\n${patternSection}`);
  }
  writeFileNoBom(targetPlanWf, planContent);
}

// ─── Step 10: package.json Governance Scripts ─────────────────────────────────
console.log(`\n--- Step 10: Configuring package.json ---`);
const pkgPath = path.join(TARGET_ROOT, 'package.json');
let pkg = {};
if (fs.existsSync(pkgPath)) {
  try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch { pkg = {}; }
} else {
  pkg = {
    name: REPO_NAME.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    version: '1.0.0',
    description: REPO_DESC,
    license: 'ISC',
  };
}

pkg.scripts = pkg.scripts || {};
pkg.scripts['verify:governance-wiring'] = 'node scripts/verify-governance-wiring.cjs';
pkg.scripts['verify:governance-wiring:all'] = 'node scripts/verify-governance-wiring.cjs --all';
pkg.scripts['verify:governance-schema'] = 'node scripts/verify-governance-schema.cjs';

writeFileNoBom(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// ─── Step 11: .agent Configuration & Routing Catalogs ─────────────────────────
console.log(`\n--- Step 11: Deploying Complete .agent Skill Router ---`);
copyFileSafe('.agent/skill-router.yaml', '.agent/skill-router.yaml');

const STANDARDS_CATALOG_CONTENT = JSON.stringify({
  version: '1.0.0',
  lastUpdated: new Date().toISOString().slice(0, 10),
  metadata: {
    projectName: REPO_NAME,
    owner: 'goldenage399',
    targetEnvironment: 'Multi-Repo SAP Spoke',
    governanceModel: 'AI-Driven Development (Antigravity Agent)',
    sourceOfTruth: 'GEMINI.md',
    totalStandards: 4,
    lastUpdated: new Date().toISOString().slice(0, 10),
  },
  categories: {
    governance: 'Process and workflow controls',
    'data-integrity': 'Schema validity and entity relations',
    documentation: 'SSOT, hubs, and schema specifications',
    memory: 'Persistent context and session telemetry',
  },
  standards: [
    {
      id: 'P-SSOT-DOCS',
      category: 'documentation',
      name: 'Spoke & Wheel Single Source of Truth',
      description: 'Hub documents contain only indices (max 150 lines). Spoke documents own detailed specifications and declare parent hub in frontmatter.',
      severity: 'MEDIUM',
      enforcement: {
        checkpoints: ['pre-commit'],
        manualOnly: false,
        automatedGate: 'npm run verify:governance-wiring',
      },
      references: ['.agent/workflows/portable/spoke-and-wheel-docs.md'],
    },
    {
      id: 'P82',
      category: 'governance',
      name: 'Governance Artifact Wiring Completeness',
      description: 'All new workflows, skills, and patterns must be wired into skill-router.yaml and CLAUDE.md/GEMINI.md.',
      severity: 'CRITICAL',
      enforcement: {
        checkpoints: ['pre-commit', 'CI'],
        manualOnly: false,
        automatedGate: 'npm run verify:governance-wiring',
      },
      references: ['scripts/verify-governance-wiring.cjs'],
    },
    {
      id: 'P-4PPSD',
      category: 'governance',
      name: '4-Phase Problem-Solving Discipline',
      description: 'Strict adherence to Ground Truth -> Research Benchmarks -> Objective Rules -> Evidence-Based Execution.',
      severity: 'HIGH',
      enforcement: {
        checkpoints: ['session-start', 'planning'],
        manualOnly: true,
      },
      references: ['GEMINI.md', 'CLAUDE.md'],
    },
  ],
}, null, 2) + '\n';
writeFileNoBom(path.join(TARGET_ROOT, '.agent/standards-catalog.json'), STANDARDS_CATALOG_CONTENT);

const PREFLIGHT_CONTENT = `# ${REPO_NAME} — Preflight Gate & Routing Table

> **Standard**: P82 (Governance Wiring Completeness)
> **Enforcement**: Run before making structural, code, or schema changes.

## Routing Matrix

| Row | Trigger / Condition | Standard / Protocol | Verification Action | Rationale / Failure Mode Prevented |
|---|---|---|---|---|
| R1 | Creating new Markdown specifications or guides | \`.agent/workflows/portable/spoke-and-wheel-docs.md\` | Check \`hub:\` frontmatter and verify registration in parent hub | Documentation drift and orphaned markdown files |
| R2 | Adding or updating \`.agent/patterns/*.md\` | \`docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md\` (PACT-001) | \`npm run verify:governance-wiring\` | Orphaned pattern contracts or unwired triggers |
| R3 | Running cross-repo sync | \`.agent/workflows/sap-sync.md\` | \`npm run verify:governance-wiring:all\` | Schema drift across sibling repositories |
`;
writeFileNoBom(path.join(TARGET_ROOT, '.agent/PREFLIGHT.md'), PREFLIGHT_CONTENT);

// ─── Step 12: Agent Operating Manuals (CLAUDE.md / GEMINI.md) ────────────────
console.log(`\n--- Step 12: Creating / Updating Agent Operating Manuals ---`);
const claudeMdPath = path.join(TARGET_ROOT, 'CLAUDE.md');
if (!fs.existsSync(claudeMdPath) || force) {
  const patternListing = deployedPatternNames.map(p => `- \`.agent/patterns/${p}.md\``).join('\n');
  const AGENT_MANUAL_CONTENT = `# ${REPO_NAME} — Agent Operating Manual

This repository represents **${REPO_NAME}** — ${REPO_DESC}.

---

## 1. Prime Invariants & Operating Discipline

### 1. 4-Phase Problem-Solving Discipline (4-PPSD)
- **Phase 1: Ground Truth & Intent**: Analyze existing domain models, invariants, and relations before modifying documents.
- **Phase 2: Research & Domain Alignment**: Verify benchmarks and standards against SSOT specifications before proposing changes.
- **Phase 3: Objective Rule Synthesis**: Follow explicit precedence ladders and schemas for all domain entities and tasks.
- **Phase 4: Evidence-Based Execution**: Execute in verified, consistent steps.

### 2. Spoke & Wheel Documentation (\`P-SSOT-DOCS\`)
- Hub documents (\`HUB.md\` / \`DOCS_HUB.md\`) contain only indices and status snapshots (max 150 lines).
- Spoke documents contain detailed domain specifications and declare parent hub in frontmatter.
- Master entities are canonical; all views (dashboards, trackers, run sheets) are derived views.

---

## 2. Session Startup Gate (MANDATORY)

Before any task work, review:
1. \`.agent/skill-router.yaml\` — Skill Router Index
2. \`.agent/PREFLIGHT.md\` — Preflight check matrix
3. Follow \`.agent/workflows/aos-session-open.md\` at session start and \`.agent/workflows/aos-session-close.md\` at session close.

---

## 3. Key Workflows & Governance Protocols

| Task Type | Workflow / Skill to Follow |
|---|---|
| Multi-step execution planning | \`.agent/workflows/plan.md\` & \`.agent/skills/writing-plans/SKILL.md\` |
| Plan review & validation | \`.agent/workflows/plan-review.md\` |
| Systematic problem diagnosis | \`.agent/workflows/portable/systematic-debugging.md\` & \`.agent/skills/systematic-debugger/SKILL.md\` |
| Clarify ambiguous prompt | \`.agent/skills/prompt-clarity/SKILL.md\` |
| Domain mapping & entity linking | \`.agent/skills/ssot-domain-mapper/SKILL.md\` |
| Flowchart & architecture visuals | \`.agent/skills/mermaid-skill/SKILL.md\` |
| Architecture Council Review | \`.agent/workflows/architecture-council.md\` |
| UI/UX Council Review | \`.agent/workflows/ui-council.md\` |
| Ingest / Adapt External Design (EUR v2) | \`.agent/workflows/external-ui-redesign.md\` |
| Mobile UI Engineering (300px) | \`.agent/workflows/mobile-ui-engineering.md\` |
| UI Design & Token Validation | \`.agent/skills/ui-design-validator/SKILL.md\` & \`.claude/skills/impeccable/SKILL.md\` |
| Advanced UI/UX Design System | \`.agent/skills/ui-ux-pro-max/SKILL.md\` & \`.agent/skills/frontend-design/SKILL.md\` |
| Site Architecture & Navigation | \`.claude/skills/site-architecture/SKILL.md\` |
| Governance verification | \`npm run verify:governance-wiring:all\` |

---

## 4. Pattern Activation & PACT-001 Cross-References
This repository implements the following universal patterns:
${patternListing}
`;
  writeFileNoBom(claudeMdPath, AGENT_MANUAL_CONTENT);
  writeFileNoBom(path.join(TARGET_ROOT, 'GEMINI.md'), AGENT_MANUAL_CONTENT);
} else {
  console.log(`ℹ️ Existing CLAUDE.md preserved (use --force to overwrite)`);
}

// ─── Step 13: Run Verification Gate in Target ─────────────────────────────────
console.log(`\n--- Step 13: Running Automated Verification in Target Repo ---`);
if (!dryRun) {
  try {
    const verifierScript = path.join(TARGET_ROOT, 'scripts/verify-governance-wiring.cjs');
    const out = execSync(`node "${verifierScript}" --all`, { cwd: TARGET_ROOT, encoding: 'utf8' });
    console.log(out);
    console.log(`\n✨ [SAP Bootstrap Complete] Repository "${REPO_NAME}" is 100% wired and verified!`);
  } catch (err) {
    console.error(`\n❌ Target verification failed:`);
    console.error(err.stdout || err.message);
    process.exit(1);
  }
}