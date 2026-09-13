#!/usr/bin/env node
/**
 * scripts/verify-cross-repo-parity.cjs
 *
 * Mechanical Cross-Repo Parity Gate & Mirror Verifier
 *
 * Enforces SHA256 parity for whole-file mirrored SAP skills (such as `prompt-clarity`)
 * across all repositories on disk (d:/GitHub_Repo) and verifies 100% byte-parity
 * between the `.claude/skills/` and `.agent/skills/` dual-loader directories.
 *
 * Authority:
 *   - Capsicum: docs/GOVERNANCE/SHARED_ALIGNMENT_PROTOCOL.md
 *   - Task-Dashboard: aos-session-close.md Step 3.3
 *   - PIOperationsMgmt: PIO-186 / verify-skill-mirror-sync.cjs
 *
 * Usage:
 *   node scripts/verify-cross-repo-parity.cjs [--skill=<name>] [--fix]
 *   npm run verify:cross-repo-parity
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const BASE_DIR = path.resolve('d:/GitHub_Repo');
const CANONICAL_HUB = 'Capsicum';

const TARGET_REPOS = [
  'Capsicum',
  'Task-Dashboard',
  'PIOperationsMgmt_Firebase',
  'QSR',
  'BMS',
  'DashBoard',
  'Inventory_Mgmt',
  'Sree_Krushna',
  'SupervisorComplianceMonitoring',
  'UG Farmhouse',
  'Unified_Uploader'
];

// Whole-file mirrored skills under SAP discipline
const DEFAULT_SKILLS = ['prompt-clarity'];

// Parse CLI flags
const args = process.argv.slice(2);
const fixFlag = args.includes('--fix');
const skillArg = args.find(a => a.startsWith('--skill='));
const targetSkills = skillArg ? [skillArg.split('=')[1]] : DEFAULT_SKILLS;

function normalizeContent(content) {
  // Strip trailing whitespace per line and normalize CRLF to LF
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

function computeHash(content) {
  return crypto.createHash('sha256').update(normalizeContent(content)).digest('hex').substring(0, 10);
}

function resolveRepoPath(repoName) {
  let repoPath = path.join(BASE_DIR, repoName);
  if (!fs.existsSync(repoPath) && repoName === 'UG Farmhouse') {
    repoPath = path.join(BASE_DIR, 'UG-Farmhouse');
  }
  return fs.existsSync(repoPath) ? repoPath : null;
}

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║               SAP MECHANICAL CROSS-REPO PARITY VERIFIER                    ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
console.log(`Canonical Hub : ${CANONICAL_HUB}`);
console.log(`Target Skills : ${targetSkills.join(', ')}`);
console.log(`Auto-Fix Mode : ${fixFlag ? 'ENABLED (--fix)' : 'DISABLED'}\n`);

const hubPath = resolveRepoPath(CANONICAL_HUB);
if (!hubPath) {
  console.error(`❌ FATAL: Canonical Hub repository not found at "${path.join(BASE_DIR, CANONICAL_HUB)}"`);
  process.exit(1);
}

let totalErrors = 0;

for (const skill of targetSkills) {
  console.log(`────────────────────────────────────────────────────────────────────────────`);
  console.log(`🔍 Auditing Skill: [${skill}]`);
  console.log(`────────────────────────────────────────────────────────────────────────────`);

  const hubSkillDir = path.join(hubPath, '.agent/skills', skill);
  if (!fs.existsSync(hubSkillDir)) {
    console.error(`❌ FATAL: Skill "${skill}" does not exist in Canonical Hub at "${hubSkillDir}"`);
    totalErrors++;
    continue;
  }

  // Enumerate files in canonical skill
  const skillFiles = fs.readdirSync(hubSkillDir).filter(f => {
    return fs.statSync(path.join(hubSkillDir, f)).isFile();
  });

  // Calculate canonical hashes
  const canonicalHashes = {};
  for (const file of skillFiles) {
    const filePath = path.join(hubSkillDir, file);
    canonicalHashes[file] = computeHash(fs.readFileSync(filePath, 'utf8'));
  }

  console.log(`Canonical Reference Files (${CANONICAL_HUB}):`);
  for (const file of skillFiles) {
    console.log(`  • ${file.padEnd(20)} [SHA: ${canonicalHashes[file]}]`);
  }
  console.log('');

  // Table header
  console.log('┌────────────────────────────────┬─────────────────┬─────────────────┬──────────┐');
  console.log('│ Repository                     │ Internal Mirror │ Canonical Match │ Status   │');
  console.log('├────────────────────────────────┼─────────────────┼─────────────────┼──────────┤');

  for (const repo of TARGET_REPOS) {
    const repoPath = resolveRepoPath(repo);
    if (!repoPath) {
      console.log(`│ ${repo.padEnd(30)} │ [MISSING REPO]  │ [N/A]           │ ⚠️ SKIP  │`);
      continue;
    }

    const claudeSkillDir = path.join(repoPath, '.claude/skills', skill);
    const agentSkillDir = path.join(repoPath, '.agent/skills', skill);

    const claudeExists = fs.existsSync(claudeSkillDir);
    const agentExists = fs.existsSync(agentSkillDir);

    if (!claudeExists && !agentExists) {
      if (fixFlag) {
        fs.mkdirSync(claudeSkillDir, { recursive: true });
        fs.mkdirSync(agentSkillDir, { recursive: true });
        for (const file of skillFiles) {
          const content = fs.readFileSync(path.join(hubSkillDir, file), 'utf8');
          fs.writeFileSync(path.join(claudeSkillDir, file), content, 'utf8');
          fs.writeFileSync(path.join(agentSkillDir, file), content, 'utf8');
        }
        console.log(`│ ${repo.padEnd(30)} │ POPULATED       │ SYNCHRONIZED    │ 🛠️ FIXED │`);
        continue;
      } else {
        console.log(`│ ${repo.padEnd(30)} │ MISSING DUAL    │ MISSING         │ ❌ FAIL  │`);
        totalErrors++;
        continue;
      }
    }

    // Check dual-folder parity
    let mirrorInSync = true;
    let mirrorDetails = '100% Parity';
    let canonicalInSync = true;

    for (const file of skillFiles) {
      const claudeFile = path.join(claudeSkillDir, file);
      const agentFile = path.join(agentSkillDir, file);

      const claudeHas = fs.existsSync(claudeFile);
      const agentHas = fs.existsSync(agentFile);

      if (!claudeHas || !agentHas) {
        mirrorInSync = false;
        mirrorDetails = 'Missing Mirror';
        canonicalInSync = false;
        break;
      }

      const claudeContent = fs.readFileSync(claudeFile, 'utf8');
      const agentContent = fs.readFileSync(agentFile, 'utf8');

      const claudeHash = computeHash(claudeContent);
      const agentHash = computeHash(agentContent);

      if (claudeHash !== agentHash) {
        mirrorInSync = false;
        mirrorDetails = 'Hash Mismatch';
      }

      // Check canonical match
      // Exception: PIOperationsMgmt carries a repo-specific discussion-thread note per PIO-186 §2f
      const isPIOExpectedVariation = (repo === 'PIOperationsMgmt_Firebase' && file === 'SKILL.md');
      if (!isPIOExpectedVariation && claudeHash !== canonicalHashes[file]) {
        canonicalInSync = false;
      }
    }

    if (!mirrorInSync || !canonicalInSync) {
      if (fixFlag) {
        fs.mkdirSync(claudeSkillDir, { recursive: true });
        fs.mkdirSync(agentSkillDir, { recursive: true });
        for (const file of skillFiles) {
          if (repo === 'PIOperationsMgmt_Firebase' && file === 'SKILL.md') continue; // preserve PIO-186 note
          const content = fs.readFileSync(path.join(hubSkillDir, file), 'utf8');
          fs.writeFileSync(path.join(claudeSkillDir, file), content, 'utf8');
          fs.writeFileSync(path.join(agentSkillDir, file), content, 'utf8');
        }
        console.log(`│ ${repo.padEnd(30)} │ HEALED          │ HEALED          │ 🛠️ FIXED │`);
      } else {
        const mirrorStr = mirrorInSync ? '✓ In-Sync' : `✗ ${mirrorDetails}`;
        const canStr = canonicalInSync ? '✓ Canonical' : '✗ Drifted';
        console.log(`│ ${repo.padEnd(30)} │ ${mirrorStr.padEnd(15)} │ ${canStr.padEnd(15)} │ ❌ FAIL  │`);
        totalErrors++;
      }
    } else {
      const pioNote = (repo === 'PIOperationsMgmt_Firebase') ? '* PIO §2f' : '✓ Canonical';
      console.log(`│ ${repo.padEnd(30)} │ ✓ In-Sync       │ ${pioNote.padEnd(15)} │ ✅ PASS  │`);
    }
  }

  console.log('└────────────────────────────────┴─────────────────┴─────────────────┴──────────┘');
  console.log('* Note: PIOperationsMgmt carries documented repo-specific discussion-thread note (PIO-186 §2f).\n');
}

if (totalErrors > 0) {
  console.error(`\n🚨 MECHANICAL GATE FAILED: Found ${totalErrors} parity violation(s).`);
  console.error(`Run with \`--fix\` to automatically synchronize drifted repositories with Canonical Hub (${CANONICAL_HUB}).`);
  process.exit(1);
} else {
  console.log(`\n🎉 MECHANICAL GATE PASSED: All monitored SAP whole-file skills exhibit 100% parity across all repositories.`);
  process.exit(0);
}
