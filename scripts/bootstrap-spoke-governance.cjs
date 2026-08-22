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

// ─── Step 2: Verification Scripts & 3 Core Universal Packages ────────────────
console.log(`\n--- Step 2: Deploying 3 Core Universal Packages & Verification Scripts ---`);
// Spoke verification script (checks P82 and PACT-001)
const SPOKE_VERIFIER_SRC = path.join(HUB_ROOT, '..', 'Capsicum', 'scripts', 'verify-governance-wiring.cjs');
if (fs.existsSync(SPOKE_VERIFIER_SRC)) {
  if (!dryRun) fs.copyFileSync(SPOKE_VERIFIER_SRC, path.join(TARGET_ROOT, 'scripts/verify-governance-wiring.cjs'));
  console.log(`📋 Copied:  scripts/verify-governance-wiring.cjs (Spoke Verifier)`);
} else {
  copyFileSafe('scripts/verify-governance-wiring.cjs', 'scripts/verify-governance-wiring.cjs');
}
copyFileSafe('scripts/verify-governance-schema.cjs', 'scripts/verify-governance-schema.cjs');

// Package 1: Universal Web Release Assurance Gate (SPEC-SAP-DEPLOY-GATE-001)
copyFileSafe('scripts/verify-deployment.cjs', 'scripts/verify-deployment.cjs');
copyFileSafe('scripts/forensic-audit.cjs', 'scripts/forensic-audit.cjs');
copyFileSafe('scripts/verify-react-deployment.cjs', 'scripts/verify-react-deployment.cjs');
copyFileSafe('.deploymentrc.json', '.deploymentrc.json');

// Package 2: Universal Web App Bootstrap & Scaffolder (SPEC-SAP-BOOTSTRAP-001)
copyFileSafe('scripts/bootstrap-web-app.cjs', 'scripts/bootstrap-web-app.cjs');
if (fs.existsSync(path.join(HUB_ROOT, 'templates/web-spa-shell'))) {
  copyDirRecursive('templates/web-spa-shell', 'templates/web-spa-shell');
}

// Package 3: Universal Write-Intent & Triage Engine (SPEC-ARCH-INTENT-DISPATCH-001)
copyFileSafe('scripts/triage-requests.cjs', 'scripts/triage-requests.cjs');

// ─── Step 3: Complete Protocols Suite (docs/protocols/) ───────────────────────
console.log(`\n--- Step 3: Deploying Complete Protocols Suite (docs/protocols/) ---`);
ensureDir(path.join(TARGET_ROOT, 'docs/protocols'));
copyDirRecursive('docs/protocols', 'docs/protocols');
copyFileSafe('.agent/patterns/README.md', '.agent/patterns/README.md');

// ─── Step 4: Workflows & Governance Councils ──────────────────────────────────
console.log(`\n--- Step 4: Synchronizing Workflows & Governance Councils ---`);
ensureDir(path.join(TARGET_ROOT, '.agent/workflows'));
ensureDir(path.join(TARGET_ROOT, '.agent/workflows/portable'));

const wfSrcDir = path.join(HUB_ROOT, '.agent/workflows');
if (fs.existsSync(wfSrcDir)) {
  const allWfFiles = fs.readdirSync(wfSrcDir).filter(f => f.endsWith('.md'));
  allWfFiles.forEach(wf => copyFileSafe(`.agent/workflows/${wf}`, `.agent/workflows/${wf}`));
  console.log(`ℹ️ Dynamically synchronized ${allWfFiles.length} root workflow files.`);
}

const portableWfSrcDir = path.join(HUB_ROOT, '.agent/workflows/portable');
if (fs.existsSync(portableWfSrcDir)) {
  const allPortableFiles = fs.readdirSync(portableWfSrcDir).filter(f => f.endsWith('.md'));
  allPortableFiles.forEach(pwf => copyFileSafe(`.agent/workflows/portable/${pwf}`, `.agent/workflows/portable/${pwf}`));
  console.log(`ℹ️ Dynamically synchronized ${allPortableFiles.length} portable workflow files.`);
}

// ─── Step 5: Full .agent/skills Suite ─────────────────────────────────────────
console.log(`\n--- Step 5: Deploying All .agent Skills ---`);
ensureDir(path.join(TARGET_ROOT, '.agent/skills'));
const skillsSrcDir = path.join(HUB_ROOT, '.agent/skills');
if (fs.existsSync(skillsSrcDir)) {
  const skillDirs = fs.readdirSync(skillsSrcDir, { withFileTypes: true }).filter(d => d.isDirectory());
  skillDirs.forEach(d => copyDirRecursive(`.agent/skills/${d.name}`, `.agent/skills/${d.name}`));
  console.log(`ℹ️ Dynamically deployed ${skillDirs.length} .agent skills.`);
}

// ─── Step 6: Deploy .claude/skills (Impeccable, Site Architecture, etc.) ──────
console.log(`\n--- Step 6: Deploying Claude-Native Skills (Impeccable, etc.) ---`);
ensureDir(path.join(TARGET_ROOT, '.claude/skills'));
const claudeSkillsSrcDir = path.join(HUB_ROOT, '.claude/skills');
if (fs.existsSync(claudeSkillsSrcDir)) {
  const claudeSkillDirs = fs.readdirSync(claudeSkillsSrcDir, { withFileTypes: true }).filter(d => d.isDirectory());
  claudeSkillDirs.forEach(d => copyDirRecursive(`.claude/skills/${d.name}`, `.claude/skills/${d.name}`));
  console.log(`ℹ️ Dynamically deployed ${claudeSkillDirs.length} .claude skills.`);
}

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

// Also scan and adapt any pre-existing local patterns in the target repo
const allTargetPatterns = fs.readdirSync(path.join(TARGET_ROOT, '.agent/patterns')).filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');
allTargetPatterns.forEach(patName => {
  const ref = path.basename(patName, '.md');
  if (!deployedPatternNames.includes(ref)) {
    deployedPatternNames.push(ref);
  }
  const targetPatPath = path.join(TARGET_ROOT, '.agent/patterns', patName);
  let content = fs.readFileSync(targetPatPath, 'utf8');

  if (!content.includes('activation_tier:')) {
    if (content.startsWith('---')) {
      content = content.replace(/^---\r?\n/, `---\npattern: ${ref}\nactivation_tier: reference\ncanonical_source: ${REPO_NAME.toLowerCase()}\nstatus: HYPOTHESIS\n`);
    } else {
      content = `---\npattern: ${ref}\nactivation_tier: reference\ncanonical_source: ${REPO_NAME.toLowerCase()}\nstatus: HYPOTHESIS\n${LOCAL_CONSUMED_BLOCK}\n---\n\n` + content;
    }
  }

  content = content.replace(/consumed_by:[\s\S]*?(?=\r?\n(?:triggers|portability|canonical_source|activation_tier|status|tags|description|---):?)/, LOCAL_CONSUMED_BLOCK + '\n');
  let triggersMatch = content.match(/^triggers:\s*\[.+\]/m) || content.match(/^triggers:\s*\n\s*-\s*.+/m);
  let hasTriggers = !!triggersMatch;
  let hasRouterEntry = routerSrcContent.includes('id: pattern-' + ref.toLowerCase()) || routerSrcContent.includes('id: ' + ref.toLowerCase());
  let tier = (hasTriggers && hasRouterEntry) ? 'routed' : 'reference';

  content = content.replace(/activation_tier:\s*\w+/, 'activation_tier: ' + tier);
  writeFileNoBom(targetPatPath, content);
});

console.log(`ℹ️ Adapted ${deployedPatternNames.length} total patterns in target repo.`);

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

// ─── Step 10: Canonical Enhancement Infrastructure (Cluster Model) ───────────
console.log(`\n--- Step 10: Deploying Canonical Enhancement Infrastructure ---`);
ensureDir(path.join(TARGET_ROOT, 'docs/enhancements'));
ensureDir(path.join(TARGET_ROOT, 'enhancement-notes'));

const prefix = REPO_NAME.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'ENH';

const enhConfig = {
  canonical_prefix: prefix,
  next_id: 1,
  repo: REPO_NAME,
  notes: `canonical_prefix is the native ID prefix for enhancements in this repository. Foreign references from other SAP repos (TASK-, PIO-, CAP-, BMS-) must include a source annotation. next_id is auto-incremented by the enhancement-scaffolder on each new enhancement confirmation.`
};
if (!fs.existsSync(path.join(TARGET_ROOT, 'enhancement-config.json'))) {
  writeFileNoBom(path.join(TARGET_ROOT, 'enhancement-config.json'), JSON.stringify(enhConfig, null, 2) + '\n');
}

const enhProtocol = `# ENHANCEMENT_PROTOCOL.md — ${REPO_NAME} Standard

This document defines the governance for creating, tracking, and verifying enhancements within the ${REPO_NAME} repository. It follows the Domain-Based Cluster Model used across the unified ecosystem.

## 🏗️ Backlog Architecture: The Cluster Model

- **Master Registry**: [ENHANCEMENT-MASTER-REGISTRY.md](./ENHANCEMENT-MASTER-REGISTRY.md) (The system index)
- **Domain Clusters**: Backlog items are stored in domain-specific files to minimize context load for agents:
    - [UI Quality Cluster](./docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md) (Visual design, layout, theme tokens, responsiveness, 300px mobile)
    - [Infrastructure Cluster](./docs/enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md) (Architecture, compilers, scripts, CI/CD, hosting)
    - [Governance Cluster](./docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md) (Protocols, workflows, SSOT reconciliation, 4-PPSD rules)
    - [Business Logic Cluster](./docs/enhancements/BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md) (Features, domain models, logic, workflows)

## 📋 Enhancement Lifecycle

<!-- shared:std.enhancement.lifecycle:start -->
### 1. Registration
- **Dependency Check**: Before scaffolding, MUST search the Master Registry (\`ENHANCEMENT-MASTER-REGISTRY.md\`) and Domain Cluster files for keywords related to the new feature to identify overlapping contexts or dependencies.
- **Simple Enhancements (≤ 2 days)**: Add a lean entry to the appropriate Cluster file.
- **Complex Enhancements (> 2 days)**:
    - Create a tracked folder in \`enhancement-notes/\`.
    - Create \`00_ENHANCEMENT_INDEX.md\` using the standard template.
    - Declare all dependencies explicitly (e.g. \`Depends On: None (Foundational)\` or specific IDs like \`Depends On: ${prefix}-001\`). Empty arrays \`[]\` are prohibited.
    - Register in the Master Registry and appropriate Cluster file.
- **ID Governance**: ID governance is managed via \`enhancement-config.json\` at repo root.
  This file must exist and define \`canonical_prefix\` and \`next_id\` before scaffolding
  can proceed. See [enhancement-scaffolder](.agent/skills/enhancement-scaffolder/SKILL.md)
  for enforcement logic.

### 2. Organizational Rationale (The "Why")
The use of dedicated tracking folders for complex work is enforced to ensure:
- **Knowledge Transfer**: Detailed technical context is maintained for future agents/users.
- **Audit Trail**: A complete record of architectural and implementation decisions.
- **Maintainability**: Future modifications have a clear roadmap and testing procedures.
- **Quality Assurance**: Prevents "Implementation Drift" by enforcing measurable success criteria.
<!-- shared:std.enhancement.lifecycle:end -->

## Prefix Governance
- **Native Prefix**: \`${prefix}-NNN\` (Unique to this repository).
<!-- shared:std.enhancement.prefix-governance:start -->
- **Foreign References**: \`TASK-NNN\`, \`PIO-NNN\`, \`CAP-NNN\`, or \`BMS-NNN\` (Used when referencing or porting from other SAP repositories).
- **Cluster Tags**: \`[UI-QUALITY]\`, \`[INFRA]\`, \`[GOVERNANCE]\`, \`[BUSINESS-LOGIC]\`
<!-- shared:std.enhancement.prefix-governance:end -->

## ✅ Definition of Done (v1.7 Standard)

> **Constraint**: ALL criteria must be verified before marking an enhancement as COMPLETED.

<!-- shared:std.enhancement.dod-v1.7:start -->
### 🛡️ 4-Tier Verification Matrix

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax/Lint | 100% clean console, no lint errors, valid JSON schemas. |
| **T2** | **Functional** | Logic/UI | Verified via integration test, manual walkthrough, or visual inspection. |
| **T3** | **Integrated** | State/Flow | Verified end-to-end data chain (State → Storage/Backend → UI Views). |
| **T4** | **Standard** | Governance | 100% compliance with \`npm run verify:governance-wiring:all\` and linked PIRR artifact with evidence populated in each category. |
<!-- shared:std.enhancement.dod-v1.7:end -->

<!-- shared:std.enhancement.cascading-rules:start -->
### 🔄 Cascading Rules
1. **Extraction Before Deletion**: Any logic/structure being replaced must be extracted to an Enhancement Note before removal.
2. **SSOT Synchronicity**: Documentation must be updated in the same session as code changes (AOS Phase C).
3. **No Disposable Scripts**: Test scripts must be semi-permanent and semantic (no \`temp.js\`).
4. **Return Discipline**: Phase completion requires surfacing the actual content of material artifacts, not descriptions of changes made. Confirmation that a file was edited is not a reviewable artifact. The file content is.
5. **Cluster Health Threshold**: Any Domain Cluster exceeding 800 lines triggers a mandatory domain-split review before new entries are added.
6. **Pre-Execution Manifest for High-Risk Operations**: Operations classified as high-risk — including prefix changes, bulk renames, deletions, and cross-file replacements — require a pre-execution manifest returned for approval before any command runs.
<!-- shared:std.enhancement.cascading-rules:end -->

---
**Status**: 🔵 ACTIVE (v1.7)  
**Guardian**: [AOS Phase Gate Governance](.agent/workflows/aos-session-open.md)
`;
if (!fs.existsSync(path.join(TARGET_ROOT, 'ENHANCEMENT_PROTOCOL.md'))) {
  writeFileNoBom(path.join(TARGET_ROOT, 'ENHANCEMENT_PROTOCOL.md'), enhProtocol);
}

const enhIndex = `# ENHANCEMENTS.md — ${REPO_NAME} Enhancement System Index

This file is the root-level entry point for ${REPO_NAME}'s enhancement-tracking system, mirroring the domain-cluster model used in \`Task-Dashboard\`, \`PIOperationsMgmt_Firebase\`, \`Capsicum\`, and \`BMS\`. It is a navigation index only — never a write target. Lean entries go in the relevant Domain Cluster file; full detail for Complex enhancements goes in \`enhancement-notes/\`.

## 📋 Quick Navigation

- **Primary Registry**: [ENHANCEMENT-MASTER-REGISTRY.md](./ENHANCEMENT-MASTER-REGISTRY.md)
- **Protocol**: [ENHANCEMENT_PROTOCOL.md](./ENHANCEMENT_PROTOCOL.md)

### 📂 Domain Clusters (Active Backlogs)

| Cluster | Focus | Backlog |
| :--- | :--- | :--- |
| **🧠 Governance** | Protocols, workflows, SSOT reconciliation, entity lifecycles | [Backlog](./docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md) |
| **📂 Infrastructure** | Architecture, Hub & Spoke structure, compilers, scripts, CI/CD | [Backlog](./docs/enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md) |
| **🎨 UI Quality** | View modularization, design tokens, responsiveness, 300px mobile | [Backlog](./docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md) |
| **💼 Business Logic** | Features, domain entities, business logic, workflows | [Backlog](./docs/enhancements/BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md) |

---

**Bootstrapped**: ${new Date().toISOString().slice(0, 10)}. See [ENHANCEMENT_PROTOCOL.md](./ENHANCEMENT_PROTOCOL.md) for lifecycle rules.

**Add a New Enhancement**: Follow the process in the [enhancement-scaffolder skill](.agent/skills/enhancement-scaffolder/SKILL.md).
`;
if (!fs.existsSync(path.join(TARGET_ROOT, 'ENHANCEMENTS.md'))) {
  writeFileNoBom(path.join(TARGET_ROOT, 'ENHANCEMENTS.md'), enhIndex);
}

const enhRegistry = `# ENHANCEMENT-MASTER-REGISTRY.md — ${REPO_NAME} Master Enhancement Registry

This file is the primary system index for all tracked enhancements in ${REPO_NAME}, recording both active and completed initiatives across all domain clusters.

| ID | Title | Cluster | Tier | Status | Branch | Target Release | Spec / PRD | PR / Commit | Completed Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;
if (!fs.existsSync(path.join(TARGET_ROOT, 'ENHANCEMENT-MASTER-REGISTRY.md'))) {
  writeFileNoBom(path.join(TARGET_ROOT, 'ENHANCEMENT-MASTER-REGISTRY.md'), enhRegistry);
}

const clusterFiles = [
  { name: 'GOVERNANCE-ENHANCEMENT-CLUSTER.md', title: 'Governance Enhancement Cluster', focus: 'Tracks protocols, workflows, SSOT reconciliation mechanisms, and 4-PPSD rules.' },
  { name: 'INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md', title: 'Infrastructure & Architecture Enhancement Cluster', focus: 'Tracks architecture integrity, Hub & Spoke structures, compilers, verification scripts, and CI/CD automation.' },
  { name: 'UI-QUALITY-ENHANCEMENT-CLUSTER.md', title: 'UI Quality Enhancement Cluster', focus: 'Tracks visual hierarchy, component modularization, design tokens, responsive layouts, and mobile 300px compliance.' },
  { name: 'BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md', title: 'Business Logic Enhancement Cluster', focus: 'Tracks domain models, business logic, entities, operational workflows, and features.' }
];

clusterFiles.forEach(cf => {
  const p = path.join(TARGET_ROOT, 'docs/enhancements', cf.name);
  if (!fs.existsSync(p)) {
    const cContent = `# ${cf.title}\n\n${cf.focus}\n\n## 📋 Active Enhancements\n\n| ID | Title | Priority | Status | Spec / Index |\n| :--- | :--- | :--- | :--- | :--- |\n\n## 🗃️ Backlog\n\n- None pending.\n`;
    writeFileNoBom(p, cContent);
  }
});

// ─── Step 11: package.json Governance Scripts ─────────────────────────────────
console.log(`\n--- Step 11: Configuring package.json ---`);
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
pkg.scripts['verify:deployment'] = 'node scripts/verify-deployment.cjs';
pkg.scripts['verify:react-deployment'] = 'node scripts/verify-react-deployment.cjs';
pkg.scripts['audit:decomposition'] = 'node scripts/forensic-audit.cjs';
pkg.scripts['bootstrap:web-app'] = 'node scripts/bootstrap-web-app.cjs';
pkg.scripts['triage:requests'] = 'node scripts/triage-requests.cjs';
pkg.scripts['pre-deploy'] = 'npm run verify:deployment';

writeFileNoBom(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// ─── Step 12: .agent Configuration & Routing Catalogs ─────────────────────────
console.log(`\n--- Step 12: Deploying Complete .agent Skill Router ---`);
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

// ─── Step 13: Agent Operating Manuals (CLAUDE.md / GEMINI.md) ────────────────
console.log(`\n--- Step 13: Creating / Updating Agent Operating Manuals ---`);
const claudeMdPath = path.join(TARGET_ROOT, 'CLAUDE.md');
const geminiMdPath = path.join(TARGET_ROOT, 'GEMINI.md');
const patternListing = deployedPatternNames.map(p => `- \`.agent/patterns/${p}.md\``).join('\n');

if (!fs.existsSync(claudeMdPath) || force) {
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
  writeFileNoBom(geminiMdPath, AGENT_MANUAL_CONTENT);
} else {
  let existingContent = fs.readFileSync(claudeMdPath, 'utf8');
  const newSection = `## 4. Pattern Activation & PACT-001 Cross-References\nThis repository implements the following universal patterns:\n${patternListing}\n`;
  if (existingContent.includes('## 4. Pattern Activation & PACT-001 Cross-References')) {
    existingContent = existingContent.replace(/## 4\. Pattern Activation & PACT-001 Cross-References[\s\S]*/, newSection);
  } else {
    existingContent += `\n\n${newSection}`;
  }
  writeFileNoBom(claudeMdPath, existingContent);
  writeFileNoBom(geminiMdPath, existingContent);
  console.log(`ℹ️ Updated pattern references in existing CLAUDE.md and GEMINI.md`);
}

// ─── Step 14: Run Verification Gate in Target ─────────────────────────────────
console.log(`\n--- Step 14: Running Automated Verification in Target Repo ---`);
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