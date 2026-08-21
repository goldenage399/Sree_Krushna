#!/usr/bin/env node
/**
 * verify-governance-wiring.cjs — P82: Governance Artifact Wiring Completeness
 *
 * Problem this solves:
 *   Governance artifacts (dist/ catalogs, .agent/ workflows/skills, new P-standards)
 *   are routinely built, documented, and then never invoked — because no gate checks
 *   that the READ PATH (consumption layer) has been wired up. This script is that gate.
 *
 * What it checks:
 *   For each new governance artifact, verify it appears in the agent consumption layer:
 *     dist/*.json          → skill-router trigger + session-open step + CLAUDE.md pointer
 *     .agent/workflows/*.md → skill-router entry OR CLAUDE.md workflow table
 *     .agent/skills/*      → skill-router entry with matching id
 *     new P-standards      → skill-router trigger OR session-open conditional reference
 *
 * Usage:
 *   node scripts/verify-governance-wiring.cjs           # diff-mode: new artifacts only
 *   node scripts/verify-governance-wiring.cjs --all     # scan ALL known artifacts
 *   node scripts/verify-governance-wiring.cjs --strict  # exit 1 on any warning
 *   node scripts/verify-governance-wiring.cjs --json    # machine-readable output
 *
 * Exit codes:
 *   0  — all artifacts wired (or no governance artifacts changed)
 *   1  — one or more artifacts missing required wiring
 *   2  — script execution error
 *
 * Routing: .agent/PREFLIGHT.md row R14
 * Standard: P82 in .agent/standards-catalog.json
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const STRICT = process.argv.includes('--strict');
const ALL_MODE = process.argv.includes('--all');
const JSON_OUT = process.argv.includes('--json');

const CONSUMPTION_FILES = {
  skillRouter:    '.agent/skill-router.yaml',
  sessionOpen:    '.agent/workflows/aos-session-open.md',
  sessionClose:   '.agent/workflows/aos-session-close.md',
  claudeMd:       'CLAUDE.md',
  debugFrontend:  '.agent/workflows/debug-frontend.md',
  preflight:      '.agent/PREFLIGHT.md',
  standardsCatalog: '.agent/standards-catalog.json',
};

// ─── Wiring Matrix ───────────────────────────────────────────────────────────
//
// Each artifact type defines:
//   required[]    — ALL must be present. Missing any → ERROR (exit 1)
//   atLeastOne[]  — at least one must be present. Missing all → ERROR (exit 1)
//   optional[]    — nice to have. Missing → WARNING only (no exit 1 unless --strict)

const WIRING_MATRIX = {
  'dist-catalog': {
    label:      'dist/ JSON catalog',
    required:   ['skillRouter', 'sessionOpen', 'claudeMd'],
    atLeastOne: [],
    optional:   ['debugFrontend'],
  },
  'agent-workflow': {
    label:      '.agent/workflows/ file',
    required:   [],
    atLeastOne: ['skillRouter', 'claudeMd'],
    optional:   [],
  },
  'agent-skill': {
    label:      '.agent/skills/ SKILL.md',
    required:   ['skillRouter'],
    atLeastOne: [],
    optional:   [],
  },
  'p-standard': {
    label:      'P-standard entry',
    required:   [],
    atLeastOne: ['skillRouter', 'sessionOpen'],
    optional:   ['claudeMd', 'preflight'],
  },
  // Patterns use a dedicated checker (checkPatternWiring) — the matrix entry exists
  // only so printReport can resolve a human label. required/atLeastOne are unused here.
  'agent-pattern': {
    label:      '.agent/patterns/ file (Activation Contract / PACT-001)',
    required:   [],
    atLeastOne: [],
    optional:   [],
  },
  'arch-invariant': {
    label:      'Architectural Invariant (.cache/architectural-invariants.jsonl)',
    required:   [],
    atLeastOne: [],
    optional:   [],
  },
};

// Human-readable labels for consumption files
const CONSUMPTION_LABELS = {
  skillRouter:   '.agent/skill-router.yaml',
  sessionOpen:   '.agent/workflows/aos-session-open.md',
  sessionClose:  '.agent/workflows/aos-session-close.md',
  claudeMd:      'CLAUDE.md',
  debugFrontend: '.agent/workflows/debug-frontend.md',
  preflight:     '.agent/PREFLIGHT.md',
};

// Fix hint templates per (artifactType, consumptionFile) pair
const FIX_HINTS = {
  'dist-catalog': {
    skillRouter: (ref) =>
      `Add to .agent/skill-router.yaml:\n` +
      `  - id: ${ref}-lookup\n` +
      `    repo: [task-dashboard]\n` +
      `    triggers: ["${ref}", "${ref} catalog", "${ref} lookup"]\n` +
      `    cost: low\n` +
      `    invoke: read dist/${ref}.json\n` +
      `    when: "O(1) lookup for ${ref} — load before any grep spiral"`,
    sessionOpen: (ref) =>
      `Add a Step 0.N conditional block in .agent/workflows/aos-session-open.md:\n` +
      `  ### Step 0.N: ${ref} Load (CONDITIONAL)\n` +
      `  > Trigger: task keywords matching ${ref} domain\n` +
      `  > Action: load dist/${ref}.json, surface matched entries`,
    claudeMd: (ref) =>
      `Add a pointer line in CLAUDE.md under the relevant Quick Commands section:\n` +
      `  **${ref}**: Load \`dist/${ref}.json\` before investigating. Rebuild: \`npm run cache:build:${ref.replace(/-catalog$/, '')}\`.`,
    debugFrontend: (ref) =>
      `Optional: add a Step 0 in the relevant Track in .agent/workflows/debug-frontend.md:\n` +
      `  0. READ: dist/${ref}.json — O(1) lookup before any grep`,
  },
  'agent-workflow': {
    skillRouter: (ref) =>
      `Add to .agent/skill-router.yaml:\n` +
      `  - id: ${ref}\n` +
      `    repo: [task-dashboard]\n` +
      `    triggers: ["<trigger phrases for ${ref}>"]\n` +
      `    cost: medium\n` +
      `    invoke: read .agent/workflows/${ref}.md\n` +
      `    when: "<describe when to use this workflow>"`,
    claudeMd: (ref) =>
      `Add to the Key Workflows table in CLAUDE.md:\n` +
      `  | <Task Type> | \`.agent/workflows/${ref}.md\` |`,
  },
  'agent-skill': {
    skillRouter: (ref) =>
      `Add to .agent/skill-router.yaml:\n` +
      `  - id: ${ref}\n` +
      `    repo: [task-dashboard]\n` +
      `    triggers: ["<trigger phrases for ${ref}>"]\n` +
      `    cost: <low|medium|high>\n` +
      `    invoke: /${ref}\n` +
      `    when: "<describe when to invoke this skill>"`,
  },
  'p-standard': {
    skillRouter: (ref, meta) =>
      `Add triggers for ${ref} in .agent/skill-router.yaml (if a relevant skill exists):\n` +
      `  triggers: ["${ref.toLowerCase()}", "${(meta?.name || ref).toLowerCase().split(' ').slice(0,3).join(' ')}"]`,
    sessionOpen: (ref, meta) =>
      `Add a keyword to the Step 0.3 trigger list in .agent/workflows/aos-session-open.md:\n` +
      `  > Trigger: add "${ref.toLowerCase()}" or related domain keyword\n` +
      `  Or add a dedicated Step 0.N for this standard's domain if it has layout/infra scope.`,
    claudeMd: (ref, meta) =>
      `Add a pointer in CLAUDE.md Critical Protocols section:\n` +
      `  - **[${ref}: ${meta?.name || ref}]** — <short description>`,
    preflight: (ref) =>
      `Add row R## in .agent/PREFLIGHT.md routing table for ${ref} enforcement.`,
  },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function git(cmd) {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8' });
}

function readFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return '';
  return fs.readFileSync(abs, 'utf8');
}

// Load all consumption file contents once
function loadConsumptionFiles() {
  const loaded = {};
  for (const [key, relPath] of Object.entries(CONSUMPTION_FILES)) {
    loaded[key] = readFile(relPath).toLowerCase();
  }
  return loaded;
}

// Check if a reference string appears in a consumption file's content
function isReferenced(content, ref) {
  if (!content || !ref) return false;
  return content.includes(ref.toLowerCase());
}

// Load package.json scripts (used to validate `guard` commands resolve to real scripts)
function loadPackageScripts() {
  try {
    return JSON.parse(readFile('package.json')).scripts || {};
  } catch {
    return {};
  }
}

// Minimal parser for the Pattern Activation Contract (PACT-001) frontmatter.
// Avoids a yaml dependency — handles only the PCC schema fields it needs.
function parsePatternFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/);
  const fm = { activation_tier: null, status: null, guard: '', triggers: [], consumed_by: [], portability: null };

  // strip trailing ` # inline comment`, then surrounding quotes
  const unquote = (s) => s.replace(/\s+#.*$/, '').trim().replace(/^["']|["']$/g, '');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let mm;
    if ((mm = line.match(/^activation_tier:\s*(.+)$/)))      fm.activation_tier = unquote(mm[1]);
    else if ((mm = line.match(/^status:\s*(.+)$/)))           fm.status = unquote(mm[1]);
    else if ((mm = line.match(/^portability:\s*(.+)$/)))      fm.portability = unquote(mm[1]);
    else if ((mm = line.match(/^guard:\s*(.+)$/)))            fm.guard = unquote(mm[1]);
    else if ((mm = line.match(/^triggers:\s*\[(.*)\]\s*$/)))  fm.triggers = mm[1].split(',').map(unquote).filter(Boolean);
    else if (/^triggers:\s*$/.test(line)) {
      for (let j = i + 1; j < lines.length && /^\s*-\s+/.test(lines[j]); j++) {
        fm.triggers.push(unquote(lines[j].replace(/^\s*-\s+/, '')));
      }
    }
    else if (/^consumed_by:\s*$/.test(line)) {
      for (let j = i + 1; j < lines.length; j++) {
        const fmatch = lines[j].match(/^\s*-?\s*file:\s*(.+)$/);
        if (fmatch) fm.consumed_by.push(unquote(fmatch[1]));
        else if (/^\S/.test(lines[j])) break; // dedented to a new top-level key — block ended
      }
    }
  }
  return fm;
}

// Files in dist/ that are build outputs, not governance artifacts
const DIST_EXEMPTIONS = new Set([
  'manifest.json',          // Vite build manifest
  'index.html',             // Vite entry HTML
  'stats.json',             // Bundle stats
  'vite-manifest.json',     // Vite asset manifest
]);

// The date P82 was introduced — only flag P-standards created on or after this date
// in --all mode. Pre-GAWC standards are pre-existing debt and will be tracked separately.
const GAWC_EPOCH = '2026-06-11';

// ─── Artifact Detection ───────────────────────────────────────────────────────

function getNewFilesFromDiff() {
  try {
    const status = git('status --porcelain');
    return status
      .split('\n')
      .filter(Boolean)
      .filter(l => /^(\?\?|A\s|AM|\s?A)/.test(l))
      .map(l => l.slice(3).trim().replace(/^"|"$/g, '').replace(/\\/g, '/'));
  } catch {
    return [];
  }
}

function getModifiedFilesFromDiff() {
  try {
    const status = git('status --porcelain');
    return status
      .split('\n')
      .filter(Boolean)
      .filter(l => /^(\s?M|MM|R\s)/.test(l))
      .map(l => l.slice(3).trim().replace(/^"|"$/g, '').replace(/\\/g, '/'));
  } catch {
    return [];
  }
}

function detectArtifacts(files, mode) {
  const artifacts = [];

  for (const file of files) {
    const normalized = file.replace(/\\/g, '/');

    // dist/*.json catalog (skip known Vite build outputs)
    if (/^dist\/[^/]+\.json$/.test(normalized)) {
      const basename = path.basename(normalized);
      if (!DIST_EXEMPTIONS.has(basename)) {
        const ref = path.basename(normalized, '.json');
        artifacts.push({ type: 'dist-catalog', file: normalized, ref, isNew: mode === 'new' });
      }
    }

    // .agent/workflows/*.md  (skip known core workflows to reduce noise)
    const CORE_WORKFLOWS = new Set([
      'aos-session-open', 'aos-session-close', 'debug-frontend', 'debug',
      'enhancement-protocol', 'post-incident-governance', 'git-commit',
      'sap-sync', 'debug-architecture', 'large-code-removal', 'ssot-reconciliation',
      'session-startup-message',  // shared SAP block injected into other workflows — not standalone invocable
      'session-state-spec',       // schema reference document — not standalone invocable
    ]);
    if (/^\.agent\/workflows\/[^/]+\.md$/.test(normalized)) {
      const ref = path.basename(normalized, '.md');
      if (!CORE_WORKFLOWS.has(ref)) {
        artifacts.push({ type: 'agent-workflow', file: normalized, ref, isNew: mode === 'new' });
      }
    }

    // .agent/skills/*/SKILL.md
    const skillMatch = normalized.match(/^\.agent\/skills\/([^/]+)\/SKILL\.md$/);
    if (skillMatch) {
      artifacts.push({ type: 'agent-skill', file: normalized, ref: skillMatch[1], isNew: mode === 'new' });
    }

    // .agent/patterns/*.md (PACT-001) — skip the README index
    const patMatch = normalized.match(/^\.agent\/patterns\/([^/]+)\.md$/);
    if (patMatch && patMatch[1].toLowerCase() !== 'readme') {
      artifacts.push({ type: 'agent-pattern', file: normalized, ref: patMatch[1], isNew: mode === 'new' });
    }

    // .cache/architectural-invariants.jsonl (architectural invariants)
    if (/^\.cache\/architectural-invariants\.jsonl$/.test(normalized)) {
      const invPath = path.join(ROOT, normalized);
      if (fs.existsSync(invPath)) {
        try {
          const lines = fs.readFileSync(invPath, 'utf8').split(/\r?\n/).filter(Boolean);
          for (const line of lines) {
            const obj = JSON.parse(line);
            if (obj.id) {
              artifacts.push({ type: 'arch-invariant', file: normalized, ref: obj.id, isNew: mode === 'new' });
            }
          }
        } catch { /* ignore */ }
      }
    }
  }

  return artifacts;
}

function getNewStandards() {
  const catalogPath = path.join(ROOT, '.agent/standards-catalog.json');
  if (!fs.existsSync(catalogPath)) return [];

  const current = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let headIds = new Set();
  try {
    const headJson = git('show HEAD:.agent/standards-catalog.json');
    JSON.parse(headJson).standards.forEach(s => headIds.add(s.id));
  } catch {
    // File not committed yet or no HEAD — all are "new"
    return current.standards.filter(s =>
      s.lifecycle?.createdDate === today || s.lifecycle?.createdDate === yesterday
    );
  }

  return current.standards.filter(s => !headIds.has(s.id));
}

function getAllArtifacts() {
  const artifacts = [];

  // All dist/*.json (excluding Vite build outputs)
  const distDir = path.join(ROOT, 'dist');
  if (fs.existsSync(distDir)) {
    fs.readdirSync(distDir)
      .filter(f => f.endsWith('.json') && !DIST_EXEMPTIONS.has(f))
      .forEach(f => {
        const ref = path.basename(f, '.json');
        artifacts.push({ type: 'dist-catalog', file: `dist/${f}`, ref, isNew: false });
      });
  }

  // All .agent/workflows/*.md (non-core)
  const CORE_WORKFLOWS = new Set([
    'aos-session-open', 'aos-session-close', 'debug-frontend', 'debug',
    'enhancement-protocol', 'post-incident-governance', 'git-commit',
    'sap-sync', 'debug-architecture', 'large-code-removal', 'ssot-reconciliation',
    'preflight', 'cos-invoke', 'governance-workflow', 'codebase-navigation',
    'session-startup-message',   // shared SAP block — not standalone invocable
    'session-state-spec',        // schema reference doc — not standalone invocable
    'interactive-orchestrator',  // internal workflow invoked by the cos-orchestrator skill — wired via skill
  ]);
  const workflowDir = path.join(ROOT, '.agent/workflows');
  if (fs.existsSync(workflowDir)) {
    fs.readdirSync(workflowDir)
      .filter(f => f.endsWith('.md'))
      .forEach(f => {
        const ref = path.basename(f, '.md');
        if (!CORE_WORKFLOWS.has(ref)) {
          artifacts.push({ type: 'agent-workflow', file: `.agent/workflows/${f}`, ref, isNew: false });
        }
      });
  }

  // All .agent/skills/*/SKILL.md
  const skillsDir = path.join(ROOT, '.agent/skills');
  if (fs.existsSync(skillsDir)) {
    fs.readdirSync(skillsDir).forEach(dir => {
      const skillFile = `.agent/skills/${dir}/SKILL.md`;
      if (fs.existsSync(path.join(ROOT, skillFile))) {
        artifacts.push({ type: 'agent-skill', file: skillFile, ref: dir, isNew: false });
      }
    });
  }

  // All .agent/patterns/*.md (PACT-001) — skip the README index
  const patternsDir = path.join(ROOT, '.agent/patterns');
  if (fs.existsSync(patternsDir)) {
    fs.readdirSync(patternsDir)
      .filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
      .forEach(f => {
        artifacts.push({ type: 'agent-pattern', file: `.agent/patterns/${f}`, ref: path.basename(f, '.md'), isNew: false });
      });
  }

  // All architectural invariants
  const invPath = path.join(ROOT, '.cache/architectural-invariants.jsonl');
  if (fs.existsSync(invPath)) {
    try {
      const lines = fs.readFileSync(invPath, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        const obj = JSON.parse(line);
        if (obj.id) {
          artifacts.push({ type: 'arch-invariant', file: '.cache/architectural-invariants.jsonl', ref: obj.id, isNew: false });
        }
      }
    } catch { /* ignore */ }
  }

  return artifacts;
}

// ─── Wiring Checks ───────────────────────────────────────────────────────────

function checkArtifactWiring(artifact, standards, consumption) {
  const { type, ref, file } = artifact;
  const rules = WIRING_MATRIX[type];
  if (!rules) return { artifact, findings: [], status: 'unknown' };

  const findings = [];

  // Get any metadata for this artifact (used for p-standard fix hints)
  const meta = type === 'p-standard'
    ? standards.find(s => s.id === ref)
    : null;

  // Check required wiring points — ALL must be present
  for (const key of rules.required) {
    const found = isReferenced(consumption[key], ref);
    if (!found) {
      findings.push({
        severity: 'error',
        consumptionFile: CONSUMPTION_LABELS[key],
        message: `Missing required wiring in ${CONSUMPTION_LABELS[key]}`,
        fix: FIX_HINTS[type]?.[key]?.(ref, meta) || `Add reference to "${ref}" in ${CONSUMPTION_LABELS[key]}`,
      });
    }
  }

  // Check atLeastOne — at least one must be present
  if (rules.atLeastOne.length > 0) {
    const found = rules.atLeastOne.some(key => isReferenced(consumption[key], ref));
    if (!found) {
      const options = rules.atLeastOne.map(k => CONSUMPTION_LABELS[k]).join(' OR ');
      const primaryKey = rules.atLeastOne[0];
      findings.push({
        severity: 'error',
        consumptionFile: options,
        message: `Missing wiring — must appear in at least one of: ${options}`,
        fix: FIX_HINTS[type]?.[primaryKey]?.(ref, meta) || `Add reference to "${ref}" in ${options}`,
      });
    }
  }

  // Check optional wiring points — missing is a warning only
  for (const key of rules.optional) {
    const found = isReferenced(consumption[key], ref);
    if (!found) {
      findings.push({
        severity: 'warning',
        consumptionFile: CONSUMPTION_LABELS[key],
        message: `Optional wiring absent in ${CONSUMPTION_LABELS[key]}`,
        fix: FIX_HINTS[type]?.[key]?.(ref, meta) || `Consider adding reference to "${ref}" in ${CONSUMPTION_LABELS[key]}`,
      });
    }
  }

  const errors = findings.filter(f => f.severity === 'error');
  const warnings = findings.filter(f => f.severity === 'warning');
  const status = errors.length > 0 ? 'unwired' : warnings.length > 0 ? 'partial' : 'wired';

  return { artifact, findings, status };
}

// Pattern Activation Contract (PACT-001) checker.
//
// Unlike other artifacts (which only need to be *mentioned* somewhere), a pattern must
// declare HOW it is consumed and prove that wiring is real + bidirectional:
//   reference → ≥1 consumed_by file that actually links back to this pattern
//   routed    → reference checks + non-empty triggers + a skill-router entry
//   guarded   → routed checks + a guard command that resolves to a real package.json script
function checkPatternWiring(artifact, consumption) {
  const { ref, file } = artifact;
  const findings = [];
  const fm = parsePatternFrontmatter(readFile(file));
  const VALID_TIERS = ['reference', 'routed', 'guarded'];

  if (!fm || !fm.activation_tier) {
    findings.push({
      severity: 'error',
      consumptionFile: file,
      message: 'Missing Pattern Activation Contract — no `activation_tier` in frontmatter (PACT-001)',
      fix:
        `Add PACT-001 frontmatter to ${file}:\n` +
        `  ---\n  pattern: ${ref}\n  activation_tier: reference   # reference | routed | guarded\n` +
        `  status: HYPOTHESIS\n  consumed_by:\n    - file: .agent/workflows/<consumer>.md\n      at: "<phase/section>"\n  ---`,
    });
    return { artifact, findings, status: 'unwired' };
  }

  if (!VALID_TIERS.includes(fm.activation_tier)) {
    findings.push({
      severity: 'error', consumptionFile: file,
      message: `Invalid activation_tier "${fm.activation_tier}" — expected reference | routed | guarded`,
      fix: 'Set activation_tier to one of: reference, routed, guarded',
    });
  }

  // ── consumed_by: ≥1 entry, each must exist AND back-reference this pattern (bidirectional) ──
  if (fm.consumed_by.length === 0) {
    findings.push({
      severity: 'error', consumptionFile: file,
      message: 'consumed_by is empty — pattern is ORPHANED (nothing dereferences it)',
      fix: 'List ≥1 consumer in frontmatter:\n  consumed_by:\n    - file: .agent/workflows/<name>.md\n      at: "<where it is read>"',
    });
  } else {
    const needle = `.agent/patterns/${ref}.md`.toLowerCase();
    for (const consumerRel of fm.consumed_by) {
      const consumerContent = readFile(consumerRel).toLowerCase();
      if (!consumerContent) {
        findings.push({
          severity: 'error', consumptionFile: consumerRel,
          message: `consumed_by points to "${consumerRel}" which does not exist`,
          fix: 'Fix the path, or create the consumer file.',
        });
      } else if (!consumerContent.includes(needle)) {
        findings.push({
          severity: 'error', consumptionFile: consumerRel,
          message: `BROKEN BACK-LINK — "${consumerRel}" is claimed as a consumer but never references ${needle}`,
          fix: `Add a reference to \`${needle}\` in ${consumerRel} (so the consumer actually pulls the pattern), or correct consumed_by.`,
        });
      }
    }
  }

  // ── routed: require own triggers AND a skill-router entry (NL-surfaceable standalone) ──
  // (guarded does NOT inherit this — its strength is the executable guard, not NL routing.
  //  consumed_by back-link above is the universal anti-orphan requirement for every tier.)
  if (fm.activation_tier === 'routed') {
    if (fm.triggers.length === 0) {
      findings.push({
        severity: 'error', consumptionFile: file,
        message: `activation_tier "${fm.activation_tier}" requires non-empty \`triggers\` so the pattern surfaces on its own keywords`,
        fix: 'Add triggers: ["keyword one", "keyword two"] to the pattern frontmatter.',
      });
    }
    const inRouter = isReferenced(consumption.skillRouter, `patterns/${ref}.md`) ||
                     fm.triggers.some(t => isReferenced(consumption.skillRouter, t));
    if (!inRouter) {
      findings.push({
        severity: 'error', consumptionFile: CONSUMPTION_LABELS.skillRouter,
        message: `activation_tier "${fm.activation_tier}" requires a skill-router entry so NL detection can surface it standalone`,
        fix:
          `Add to .agent/skill-router.yaml:\n` +
          `  - id: pattern-${ref}\n    repo: [task-dashboard]\n` +
          `    triggers: [${fm.triggers.map(t => `"${t}"`).join(', ') || '"<trigger phrases>"'}]\n` +
          `    cost: low\n    invoke: read .agent/patterns/${ref}.md\n` +
          `    when: "Surface the ${ref} pattern when its triggers are detected"`,
      });
    }
  }

  // ── guarded: require a guard command that resolves to a real package.json script ──
  if (fm.activation_tier === 'guarded') {
    if (!fm.guard) {
      findings.push({
        severity: 'error', consumptionFile: file,
        message: 'activation_tier "guarded" requires a `guard` command (the executable enforcement)',
        fix: 'Add guard: "npm run <check>" referencing the enforcing script (ESLint rule, ast-grep, preflight, etc.).',
      });
    } else {
      const scripts = loadPackageScripts();
      const runRefs = [...fm.guard.matchAll(/npm run ([a-z0-9:_-]+)/gi)].map(x => x[1]);
      for (const s of runRefs) {
        if (!Object.prototype.hasOwnProperty.call(scripts, s)) {
          findings.push({
            severity: 'error', consumptionFile: 'package.json',
            message: `guard references "npm run ${s}" but no such script exists in package.json`,
            fix: `Add "${s}" to package.json scripts, or correct the guard command.`,
          });
        }
      }
    }
  }

  const errors = findings.filter(f => f.severity === 'error');
  return { artifact, findings, status: errors.length > 0 ? 'unwired' : 'wired' };
}

// Architectural Invariant checker (ARCH-INV-001 to ARCH-INV-007).
// Checks that:
//   - The invariant exists in .cache/architectural-invariants.jsonl
//   - The invariant has `id` and `guard` fields
//   - The `guard` command resolves to a real script in package.json
function checkArchInvariantWiring(artifact, consumption) {
  const { ref, file } = artifact;
  const findings = [];
  
  // Find the invariant object in the jsonl
  const content = readFile(file);
  const lines = content.split(/\r?\n/).filter(Boolean);
  let invariant = null;
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj.id === ref) {
        invariant = obj;
        break;
      }
    } catch { /* ignore */ }
  }

  if (!invariant) {
    findings.push({
      severity: 'error',
      consumptionFile: file,
      message: `Architectural invariant "${ref}" not found in ${file}`,
      fix: `Add the invariant JSON object to ${file}`,
    });
    return { artifact, findings, status: 'unwired' };
  }

  if (!invariant.id) {
    findings.push({
      severity: 'error',
      consumptionFile: file,
      message: `Invariant is missing 'id' field`,
      fix: `Add 'id' to invariant object`,
    });
  }

  if (!invariant.guard) {
    findings.push({
      severity: 'error',
      consumptionFile: file,
      message: `Invariant "${ref}" is missing 'guard' command`,
      fix: `Add 'guard': "npm run <script>" to invariant object in ${file}`,
    });
  } else {
    const scripts = loadPackageScripts();
    const runRefs = [...invariant.guard.matchAll(/npm run ([a-z0-9:_-]+)/gi)].map(x => x[1]);
    if (runRefs.length === 0) {
      findings.push({
        severity: 'error',
        consumptionFile: file,
        message: `Invariant "${ref}" guard "${invariant.guard}" does not contain any "npm run <script>" commands`,
        fix: `Update guard to call a valid package.json script via "npm run <script>"`,
      });
    }
    for (const s of runRefs) {
      if (!Object.prototype.hasOwnProperty.call(scripts, s)) {
        findings.push({
          severity: 'error',
          consumptionFile: 'package.json',
          message: `Invariant "${ref}" guard references "npm run ${s}" but no such script exists in package.json`,
          fix: `Add "${s}" to package.json scripts, or correct the guard command.`,
        });
      }
    }
  }

  const errors = findings.filter(f => f.severity === 'error');
  return { artifact, findings, status: errors.length > 0 ? 'unwired' : 'wired' };
}

// ─── Output Formatting ────────────────────────────────────────────────────────

function printReport(results, newStandardResults) {
  const all = [...results, ...newStandardResults];
  const errors = all.filter(r => r.status === 'unwired');
  const warnings = all.filter(r => r.status === 'partial');
  const passing = all.filter(r => r.status === 'wired');

  if (all.length === 0) {
    console.log('\n🟢 P82: No governance artifacts to check (no governance files in changeset).\n');
    return;
  }

  console.log(`\n🔍 P82 Governance Wiring Audit — ${all.length} artifact(s) checked\n`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`✅ All ${passing.length} artifact(s) fully wired — read path is complete.\n`);
    return;
  }

  // Print errors
  for (const r of errors) {
    const { type, ref, file } = r.artifact;
    const label = WIRING_MATRIX[type]?.label || type;
    console.log(`🔴 UNWIRED — ${label}: ${ref}`);
    console.log(`   File: ${file}`);
    for (const f of r.findings.filter(x => x.severity === 'error')) {
      console.log(`   ❌ ${f.message}`);
      console.log(`   💡 Fix: ${f.fix.split('\n').join('\n       ')}`);
    }
    console.log();
  }

  // Print warnings
  for (const r of warnings) {
    const { type, ref, file } = r.artifact;
    const label = WIRING_MATRIX[type]?.label || type;
    console.log(`🟡 PARTIAL — ${label}: ${ref}`);
    console.log(`   File: ${file}`);
    for (const f of r.findings.filter(x => x.severity === 'warning')) {
      console.log(`   ⚠️  ${f.message}`);
      console.log(`   💡 Fix: ${f.fix.split('\n').join('\n       ')}`);
    }
    console.log();
  }

  if (passing.length > 0) {
    console.log(`✅ Wired (${passing.length}): ${passing.map(r => r.artifact.ref).join(', ')}\n`);
  }

  if (errors.length > 0) {
    console.log(`🛑 ${errors.length} artifact(s) missing required wiring. Resolve before session close.`);
    console.log(`   Routing: .agent/PREFLIGHT.md row R14 | Standard: P82\n`);
  }
}

function printJson(results, newStandardResults) {
  const all = [...results, ...newStandardResults];
  const output = {
    date: new Date().toISOString().slice(0, 10),
    standard: 'P82',
    mode: ALL_MODE ? 'all' : 'diff',
    total: all.length,
    wired: all.filter(r => r.status === 'wired').length,
    partial: all.filter(r => r.status === 'partial').length,
    unwired: all.filter(r => r.status === 'unwired').length,
    artifacts: all.map(r => ({
      type: r.artifact.type,
      ref: r.artifact.ref,
      file: r.artifact.file,
      status: r.status,
      findings: r.findings.map(f => ({ severity: f.severity, message: f.message })),
    })),
  };
  console.log(JSON.stringify(output, null, 2));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function run() {
  try {
    const consumption = loadConsumptionFiles();

    let artifacts = [];
    let newStandards = [];

    if (ALL_MODE) {
      artifacts = getAllArtifacts();
      // In --all mode, only check P-standards created on or after the GAWC_EPOCH (P82 birth date).
      // Pre-GAWC standards are pre-existing debt and are tracked separately via audit.
      const catalogPath = path.join(ROOT, '.agent/standards-catalog.json');
      if (fs.existsSync(catalogPath)) {
        const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
        newStandards = catalog.standards.filter(s =>
          s.lifecycle?.createdDate && s.lifecycle.createdDate >= GAWC_EPOCH
        );
      }
    } else {
      // diff mode: only new files
      const newFiles = getNewFilesFromDiff();
      artifacts = detectArtifacts(newFiles, 'new');
      newStandards = getNewStandards();
    }

    // Load standards catalog for metadata (used in fix hints)
    let allStandards = [];
    try {
      const catalogPath = path.join(ROOT, '.agent/standards-catalog.json');
      if (fs.existsSync(catalogPath)) {
        allStandards = JSON.parse(fs.readFileSync(catalogPath, 'utf8')).standards || [];
      }
    } catch { /* ignore */ }

    // Run wiring checks (patterns use the dedicated PACT-001 checker)
    const artifactResults = artifacts.map(a => {
      if (a.type === 'agent-pattern') {
        return checkPatternWiring(a, consumption);
      } else if (a.type === 'arch-invariant') {
        return checkArchInvariantWiring(a, consumption);
      } else {
        return checkArtifactWiring(a, allStandards, consumption);
      }
    });

    const standardResults = newStandards.map(s => {
      const artifact = { type: 'p-standard', file: '.agent/standards-catalog.json', ref: s.id, isNew: true };
      return checkArtifactWiring(artifact, allStandards, consumption);
    });

    // Output
    if (JSON_OUT) {
      printJson(artifactResults, standardResults);
    } else {
      printReport(artifactResults, standardResults);
    }

    // Exit code
    const allResults = [...artifactResults, ...standardResults];
    const hasErrors = allResults.some(r => r.status === 'unwired');
    const hasWarnings = allResults.some(r => r.status === 'partial');

    if (hasErrors) return 1;
    if (hasWarnings && STRICT) return 1;
    return 0;

  } catch (err) {
    console.error(`\n❌ verify-governance-wiring error: ${err.message}\n`);
    return 2;
  }
}

process.exit(run());
