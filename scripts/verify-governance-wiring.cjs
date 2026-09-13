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
 *     *-MODULE-SPEC.md     → DOCUMENTATION-INDEX.md + TASK-MANAGEMENT.md + SYSTEM_CLARITY_SNAPSHOT.md + PREFLIGHT.md
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

let GRAPH_DATA = null;

function pathToId(p) {
  let pStr = String(p).replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  pStr = pStr.replace(/\.(js|jsx|ts|tsx|py|css|html|md|json|jsonl)$/i, '');
  pStr = pStr.replace(/[^a-zA-Z0-9]/g, '_');
  return pStr.toLowerCase();
}

// --emit[=path]: materialize the GAWC graph (GWPA §2) to governance-wiring.json
const EMIT_ARG = process.argv.find(a => a === '--emit' || a.startsWith('--emit='));
const EMIT = !!EMIT_ARG;
const EMIT_PATH = (EMIT_ARG && EMIT_ARG.includes('=')) ? EMIT_ARG.split('=').slice(1).join('=') : 'governance-wiring.json';

// PACT-tier'd artifact types (carry activation_tier + bidirectional consumed_by). Everything else is matrix-wired.
const PACT_TYPES = new Set(['agent-pattern', 'rolling-snapshot', 'protocol', 'collaborator-wiring']);
// Types whose artifacts share a single backing file (so id must be disambiguated by ref).
const SHARED_FILE_TYPES = new Set(['p-standard', 'arch-invariant']);
// Stable lane order for the projection.
const CLASS_ORDER = ['agent-pattern', 'agent-skill', 'agent-workflow', 'dist-catalog', 'p-standard', 'arch-invariant', 'rolling-snapshot', 'protocol', 'collaborator-wiring', 'module-spec', 'doc-file'];

const CONSUMPTION_FILES = {
  skillRouter:       '.agent/skill-router.yaml',
  sessionOpen:       '.agent/workflows/aos-session-open.md',
  sessionClose:      '.agent/workflows/aos-session-close.md',
  claudeMd:          'CLAUDE.md',
  debugFrontend:     '.agent/workflows/debug-frontend.md',
  preflight:         '.agent/PREFLIGHT.md',
  standardsCatalog:  '.agent/standards-catalog.json',
  docIndex:          'docs/DOCUMENTATION-INDEX.md',
  taskManagementHub: 'docs/TASK-MANAGEMENT.md',
  systemSnapshot:    'docs/SYSTEM_CLARITY_SNAPSHOT.md',
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
  'module-spec': {
    label:      'Module SSOT Spec (*-MODULE-SPEC.md)',
    required:   ['docIndex', 'taskManagementHub', 'systemSnapshot', 'preflight'],
    atLeastOne: [],
    optional:   ['claudeMd'],
  },
  'doc-file': {
    label:      'docs/ markdown file',
    required:   ['docIndex'],
    atLeastOne: [],
    optional:   ['claudeMd'],
  },
};

// Human-readable labels for consumption files
const CONSUMPTION_LABELS = {
  skillRouter:       '.agent/skill-router.yaml',
  sessionOpen:       '.agent/workflows/aos-session-open.md',
  sessionClose:      '.agent/workflows/aos-session-close.md',
  claudeMd:          'CLAUDE.md',
  debugFrontend:     '.agent/workflows/debug-frontend.md',
  preflight:         '.agent/PREFLIGHT.md',
  docIndex:          'docs/DOCUMENTATION-INDEX.md',
  taskManagementHub: 'docs/TASK-MANAGEMENT.md',
  systemSnapshot:    'docs/SYSTEM_CLARITY_SNAPSHOT.md',
};

// Fix hint templates per (artifactType, consumptionFile) pair
const FIX_HINTS = {
  'module-spec': {
    docIndex: (ref) =>
      `Add a link to the Module SSOT in docs/DOCUMENTATION-INDEX.md under Task Management & Workflows:\n` +
      `  - [${path.basename(ref)}](./${ref.startsWith('docs/') ? path.relative('docs', ref).replace(/\\/g, '/') : ref.replace(/\\/g, '/')})`,
    taskManagementHub: (ref) =>
      `Add a reference link in docs/TASK-MANAGEMENT.md under Dashboard Integration & Related Documents:\n` +
      `  - [${path.basename(ref)}](./${path.relative('docs', ref).replace(/\\/g, '/')})`,
    systemSnapshot: (ref) =>
      `Add a workstream reference entry in docs/SYSTEM_CLARITY_SNAPSHOT.md under Section 2 Active Workstreams`,
    preflight: (ref) =>
      `Add a routing row in .agent/PREFLIGHT.md for changes touching this module page or hooks`,
  },
  'doc-file': {
    docIndex: (ref) =>
      `Add a link to the document in docs/DOCUMENTATION-INDEX.md under the appropriate section:\n` +
      `  - [${path.basename(ref)}](${ref.startsWith('docs/') ? './' + path.relative('docs', ref).replace(/\\/g, '/') : './' + ref.replace(/\\/g, '/')}) — <short description>`,
    claudeMd: (ref) =>
      `Consider listing in CLAUDE.md:\n` +
      `  [${path.basename(ref)}](${ref.startsWith('docs/') ? './' + path.relative('docs', ref).replace(/\\/g, '/') : './' + ref.replace(/\\/g, '/')})`,
  },
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

// Entry-point parity (Query 1.8 Gap 2): every agent harness entry point must
// reference the Frontend Knowledge Hub, so no agent (Claude / Gemini / Codex /
// other) loses its path into the FKL. Drift here silently re-creates the exact
// discoverability gap fixed in Query 1.7. Returns a list of failing entry points.
const ENTRY_POINTS = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md'];
const ENTRY_POINT_ANCHOR = 'frontend-knowledge-hub';

function checkEntryPointParity() {
  const failing = [];
  
  if (GRAPH_DATA) {
    const nodes = GRAPH_DATA.nodes || [];
    const edges = GRAPH_DATA.edges || [];
    for (const ep of ENTRY_POINTS) {
      const epNodeId = pathToId(ep);
      const epNode = nodes.find(n => n.id === epNodeId);
      if (!epNode) {
        failing.push({ ep, reason: 'entry-point file is absent in graph' });
        continue;
      }
      const hasFklRef = edges.some(e => e.source === epNodeId && e.relation === 'references_fkl');
      if (!hasFklRef) {
        failing.push({ ep, reason: 'does not reference FRONTEND-KNOWLEDGE-HUB.md (verified via graph)' });
      }
    }
    return failing;
  }

  for (const ep of ENTRY_POINTS) {
    const content = readFile(ep).toLowerCase();
    if (!content) failing.push({ ep, reason: 'entry-point file is absent' });
    else if (!content.includes(ENTRY_POINT_ANCHOR))
      failing.push({ ep, reason: 'does not reference FRONTEND-KNOWLEDGE-HUB.md' });
  }
  return failing;
}

// Check if a reference string appears in a consumption file's content
function isReferenced(content, ref) {
  if (!content || !ref) return false;
  if (ref.startsWith('docs/')) {
    const rel = ref.slice(5);
    return content.includes(ref.toLowerCase()) || content.includes(rel.toLowerCase());
  }
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

    // docs/**/*.md files (excluding DOCUMENTATION-INDEX.md and other hubs/templates)
    if (/^docs\/.*\.md$/.test(normalized)) {
      const EXEMPTED_DOCS = new Set([
        'docs/documentation-index.md',
        'docs/quick-task-reference.md',
        'docs/code-navigation-guide.md',
        'docs/ssot/dev-workflow-hub/readme.md',
        'docs/ssot/testing-hub/readme.md',
        'docs/ssot/architecture-hub/readme.md',
        'docs/ssot/ui-design/ui-design-hub.md',
      ]);
      if (!EXEMPTED_DOCS.has(normalized.toLowerCase())) {
        if (/-MODULE-SPEC\.md$/i.test(normalized)) {
          artifacts.push({ type: 'module-spec', file: normalized, ref: normalized, isNew: mode === 'new' });
        } else {
          artifacts.push({ type: 'doc-file', file: normalized, ref: normalized, isNew: mode === 'new' });
        }
      }
    }

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

  // All docs/**/*.md files (excluding DOCUMENTATION-INDEX.md and other hubs/templates)
  const EXEMPTED_DOCS = new Set([
    'docs/documentation-index.md',
    'docs/quick-task-reference.md',
    'docs/code-navigation-guide.md',
    'docs/ssot/dev-workflow-hub/readme.md',
    'docs/ssot/testing-hub/readme.md',
    'docs/ssot/architecture-hub/readme.md',
    'docs/ssot/ui-design/ui-design-hub.md',
  ]);
  const scanDocs = (dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        scanDocs(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        if (!EXEMPTED_DOCS.has(relPath.toLowerCase())) {
          const type = /-MODULE-SPEC\.md$/i.test(relPath) ? 'module-spec' : 'doc-file';
          artifacts.push({ type, file: relPath, ref: relPath, isNew: false });
        }
      }
    }
  };
  scanDocs(path.join(ROOT, 'docs'));

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

  if (GRAPH_DATA) {
    const patternNodeId = pathToId(file);
    const nodes = GRAPH_DATA.nodes || [];
    const edges = GRAPH_DATA.edges || [];
    const node = nodes.find(n => n.id === patternNodeId);
    
    if (!node) {
      findings.push({
        severity: 'error',
        consumptionFile: file,
        message: `Graphify error: pattern file "${file}" is not indexed in the knowledge graph.`,
        fix: 'Run `python scratch/finalize_graph.py` to index new patterns.'
      });
    } else {
      const tier = node.activation_tier || 'reference';
      const consumedByEdges = edges.filter(e => e.source === patternNodeId && e.relation === 'consumed_by');
      
      if (consumedByEdges.length === 0) {
        findings.push({
          severity: 'error',
          consumptionFile: file,
          message: 'consumed_by relation is missing in the graph — pattern is ORPHANED',
          fix: 'List ≥1 consumer in frontmatter and run graphify.'
        });
      } else {
        for (const edge of consumedByEdges) {
          const consumerNodeId = edge.target;
          const consumerNode = nodes.find(n => n.id === consumerNodeId);
          if (!consumerNode) {
            findings.push({
              severity: 'error',
              consumptionFile: file,
              message: `Graphify error: consumer node "${consumerNodeId}" does not exist in the graph.`,
              fix: 'Verify the consumer path.'
            });
            continue;
          }
          
          // Check for back-link edge in the graph
          const hasBackLink = edges.some(e => e.source === consumerNodeId && e.target === patternNodeId && e.relation === 'references_pattern');
          if (!hasBackLink) {
            findings.push({
              severity: 'error',
              consumptionFile: consumerNode.source_file || consumerNodeId,
              message: `BROKEN BACK-LINK (Verified via graph) — "${consumerNode.source_file || consumerNodeId}" does not reference the pattern ${file}`,
              fix: `Add a reference to \`.agent/patterns/${ref}.md\` in ${consumerNode.source_file || consumerNodeId}.`
            });
          }
        }
      }
      
      if (tier === 'routed') {
        const inRouter = edges.some(e => e.target === patternNodeId && e.relation === 'references_pattern' && e.source.includes('skill_router'));
        const isRouted = inRouter || isReferenced(consumption.skillRouter, `patterns/${ref}.md`);
        if (!isRouted) {
          findings.push({
            severity: 'error',
            consumptionFile: CONSUMPTION_LABELS.skillRouter,
            message: `activation_tier "${tier}" requires a skill-router entry (Verified via graph)`,
            fix: `Add to .agent/skill-router.yaml references to patterns/${ref}.md`
          });
        }
      }
    }
    
    const errors = findings.filter(f => f.severity === 'error');
    return { artifact, findings, status: errors.length > 0 ? 'unwired' : 'wired' };
  }

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

// ─── GAWC graph emit (GWPA §2 / governance-wiring.schema.json) ─────────────────
//
// Materializes the verifier's results into governance-wiring.json — the data store the
// projection reads (GWPA-INV-001). GENERATED, never hand-edited (GWPA-INV-002).
// Two wiring families (GWPA §2.1): pact (patterns + future tier'd types) carry activation_tier
// and a bidirectional consumed_by; matrix (catalogs/workflows/skills/standards/invariants) are
// wired via consumption files. Orphans/broken back-links are represented, not omitted (GWPA-INV-005).
function emitGraph(artifactResults, standardResults, consumption, outRel) {
  const all = [...artifactResults, ...standardResults].filter(r => r.status !== 'unknown');
  const classesMap = new Map();

  const artifacts = all.map(r => {
    const { type, ref, file } = r.artifact;
    const isPact = PACT_TYPES.has(type);
    if (!classesMap.has(type)) {
      classesMap.set(type, { id: type, label: (WIRING_MATRIX[type] && WIRING_MATRIX[type].label) || type, display_order: null });
    }

    const obj = {
      id: SHARED_FILE_TYPES.has(type) ? `${file}#${ref}` : file,
      artifact_type: type,
      wiring_model: isPact ? 'pact' : 'matrix',
      class: type,
      status: { wiring_state: r.status === 'wired' ? 'wired' : r.status === 'partial' ? 'partial' : 'unwired' },
      scope: 'in',
      consumed_by: [],
    };

    if (isPact) {
      const fm = parsePatternFrontmatter(readFile(file)) || {};
      obj.activation_tier = ['reference', 'routed', 'guarded'].includes(fm.activation_tier) ? fm.activation_tier : 'reference';
      if (fm.status === 'HYPOTHESIS' || fm.status === 'VALIDATED') obj.status.declared = fm.status;
      if (obj.status.wiring_state !== 'wired') {
        const msgs = r.findings.map(f => f.message).join(' | ');
        if (/ORPHANED/i.test(msgs)) obj.status.wiring_state = 'orphan';
        else if (/BROKEN BACK-LINK/i.test(msgs)) obj.status.wiring_state = 'broken-backlink';
      }
      const needle = String(file).toLowerCase();
      (fm.consumed_by || []).forEach(cf => {
        const content = readFile(cf).toLowerCase();
        obj.consumed_by.push({ consumer_file: cf, verified: !!content && content.includes(needle) });
      });
    } else {
      for (const [k, rel] of Object.entries(CONSUMPTION_FILES)) {
        if (isReferenced(consumption[k], ref)) obj.consumed_by.push({ consumer_file: rel, verified: true });
      }
    }
    return obj;
  });

  // Stable lane ordering (GWPA-INV-004)
  let order = 0;
  for (const t of CLASS_ORDER) { if (classesMap.has(t)) classesMap.get(t).display_order = order++; }
  for (const c of classesMap.values()) { if (c.display_order === null) c.display_order = order++; }

  const n = (pred) => artifacts.filter(pred).length;
  const graph = {
    generated_at: new Date().toISOString(),
    generator: 'verify-governance-wiring.cjs --emit',
    source_of_truth: 'frontmatter',
    classes: [...classesMap.values()].sort((a, b) => a.display_order - b.display_order),
    columns: ['reference', 'routed', 'guarded', 'excluded'],
    artifacts,
    summary: {
      total: artifacts.length,
      wired: n(a => a.status.wiring_state === 'wired'),
      partial: n(a => a.status.wiring_state === 'partial'),
      unwired: n(a => a.status.wiring_state === 'unwired'),
      orphan: n(a => a.status.wiring_state === 'orphan'),
      broken_backlink: n(a => a.status.wiring_state === 'broken-backlink'),
      excluded: n(a => a.scope === 'excluded'),
    },
  };

  fs.writeFileSync(path.join(ROOT, outRel), JSON.stringify(graph, null, 2) + '\n');
  console.log(`\n📤 Emitted GAWC graph → ${outRel} (${artifacts.length} artifacts)`);
}

function checkFrontendKnowledgeIndex(changedFiles) {
  const findings = { errors: [], warnings: [], passing: [] };
  const indexPath = path.join(ROOT, 'docs/frontend/frontend-knowledge-index.jsonl');
  if (!fs.existsSync(indexPath)) {
    findings.errors.push({
      message: "docs/frontend/frontend-knowledge-index.jsonl is missing",
      fix: "Restore or create docs/frontend/frontend-knowledge-index.jsonl"
    });
    return findings;
  }

  let lines = [];
  try {
    lines = fs.readFileSync(indexPath, 'utf8').split(/\r?\n/).filter(Boolean);
  } catch (err) {
    findings.errors.push({
      message: `Failed to read frontend-knowledge-index.jsonl: ${err.message}`,
      fix: "Verify file permissions and JSONL format"
    });
    return findings;
  }

  const jsonlEntries = [];
  let lineNum = 0;
  for (const line of lines) {
    lineNum++;
    try {
      const entry = JSON.parse(line);
      jsonlEntries.push({ entry, lineNum });
    } catch (err) {
      findings.errors.push({
        message: `Syntax error in frontend-knowledge-index.jsonl at line ${lineNum}: ${err.message}`,
        fix: "Ensure the line is valid single-line JSON"
      });
    }
  }

  for (const { entry, lineNum } of jsonlEntries) {
    if (entry.relatedFiles && Array.isArray(entry.relatedFiles)) {
      for (const relFile of entry.relatedFiles) {
        const absFile = path.join(ROOT, relFile);
        if (!fs.existsSync(absFile)) {
          findings.errors.push({
            message: `Broken link in frontend-knowledge-index.jsonl (line ${lineNum}): "${relFile}" does not exist on disk`,
            fix: `Fix the path "${relFile}" in frontend-knowledge-index.jsonl`
          });
        } else {
          findings.passing.push(`relatedFile: ${relFile}`);
        }
      }
    }

    if (entry.relatedIncidents && Array.isArray(entry.relatedIncidents)) {
      for (const incId of entry.relatedIncidents) {
        const incidentsDir = path.join(ROOT, 'docs/incidents');
        let matchFound = false;
        const cleanId = incId.replace(/^INC-/i, '');
        if (fs.existsSync(incidentsDir)) {
          const files = fs.readdirSync(incidentsDir);
          const incMatchPattern = new RegExp(`^INC-${cleanId}-.*\\.md$`, 'i');
          matchFound = files.some(f => incMatchPattern.test(f));
        }
        if (!matchFound) {
          findings.errors.push({
            message: `Broken incident reference in frontend-knowledge-index.jsonl (line ${lineNum}): "docs/incidents/INC-${cleanId}-*.md" does not exist`,
            fix: `Verify the incident file name for "INC-${cleanId}" exists in docs/incidents/`
          });
        } else {
          findings.passing.push(`relatedIncident: ${incId}`);
        }
      }
    }
  }

  const newIncidents = changedFiles.filter(f => /^docs\/incidents\/INC-[0-9a-zA-Z]+-.*\.md$/i.test(f));
  for (const newIncFile of newIncidents) {
    const filename = path.basename(newIncFile);
    const m = filename.match(/^INC-([0-9a-zA-Z]+)/i);
    if (m) {
      const incId = m[1];
      const isRegistered = jsonlEntries.some(({ entry }) =>
        (entry.id && entry.id.toLowerCase() === `inc-${incId}`.toLowerCase()) ||
        (entry.id && entry.id.toLowerCase() === incId.toLowerCase()) ||
        (entry.relatedIncidents && entry.relatedIncidents.some(id => id.toLowerCase() === incId.toLowerCase()))
      );
      if (!isRegistered) {
        findings.warnings.push({
          message: `Incident file ${newIncFile} is not registered in docs/frontend/frontend-knowledge-index.jsonl`,
          fix: `Consider registering "${incId}" in docs/frontend/frontend-knowledge-index.jsonl`
        });
      } else {
        findings.passing.push(`registeredIncident: ${incId}`);
      }
    }
  }

  return findings;
}

let projectFilesMap = null;
function resolveSourceFile(fileName) {
  if (fs.existsSync(path.join(ROOT, fileName))) {
    return fileName;
  }
  if (!projectFilesMap) {
    projectFilesMap = new Map();
    try {
      const files = git('ls-files').split(/\r?\n/).filter(Boolean);
      for (const f of files) {
        projectFilesMap.set(path.basename(f).toLowerCase(), f);
      }
    } catch {
      // ignore
    }
  }
  const cleanName = path.basename(fileName).toLowerCase();
  if (projectFilesMap.has(cleanName)) {
    return projectFilesMap.get(cleanName);
  }
  return null;
}

function checkDiscoverabilitySelfCheck(changedFiles) {
  const findings = { errors: [], warnings: [], passing: [] };
  
  if (GRAPH_DATA) {
    const nodes = GRAPH_DATA.nodes || [];
    const edges = GRAPH_DATA.edges || [];
    
    const incidentFiles = changedFiles.filter(f => /^docs\/incidents\/INC-[0-9a-zA-Z]+-.*\.md$/i.test(f));
    for (const incFile of incidentFiles) {
      const incNodeId = pathToId(incFile);
      const incNode = nodes.find(n => n.id === incNodeId);
      if (!incNode) {
        findings.warnings.push({
          message: `Incident file ${incFile} is not indexed in the graph. Run graphify to update.`,
          fix: 'Run `python scratch/finalize_graph.py`.'
        });
        continue;
      }
      
      const affectsEdges = edges.filter(e => e.source === incNodeId && e.relation === 'affects');
      if (affectsEdges.length === 0) {
        findings.warnings.push({
          message: `No affected components detected in graph for ${incFile}.`,
          fix: 'Add Affected Components section to incident file and rebuild graph.'
        });
        continue;
      }
      
      for (const edge of affectsEdges) {
        const targetNodeId = edge.target;
        const targetNode = nodes.find(n => n.id === targetNodeId);
        
        // Find if target node has a referenced_by edge back to the incident
        const hasBackLink = edges.some(e => e.source === targetNodeId && e.target === incNodeId && e.relation === 'referenced_by');
        if (!hasBackLink) {
          findings.errors.push({
            message: `DISC-001 Violation (Verified via graph): Source file "${targetNode ? targetNode.source_file : targetNodeId}" is modified by incident "${incNode.label}" but has no back-link comment pointing to the SSOT/Incident.`,
            fix: `Add a comment at the end of "${targetNode ? targetNode.source_file : targetNodeId}" pointing back to the SSOT/Incident, e.g.:\n` +
                 `  /* SSOT: docs/incidents/${incNode.label} — ${incNode.label.split('-').slice(0,2).join('-')} */`
          });
        } else {
          findings.passing.push(`DISC-001: Verified back-link in ${targetNode ? targetNode.source_file : targetNodeId} for ${incNode.label}`);
        }
      }
    }
    return findings;
  }
  
  // Find new or modified incident files in docs/incidents/INC-*.md
  const incidentFiles = changedFiles.filter(f => /^docs\/incidents\/INC-[0-9a-zA-Z]+-.*\.md$/i.test(f));
  
  for (const incFile of incidentFiles) {
    const content = readFile(incFile);
    if (!content) continue;
    
    const filename = path.basename(incFile);
    const m = filename.match(/^(INC-[0-9a-zA-Z]+)/i);
    const incId = m ? m[1].toUpperCase() : null;
    
    // Extract "Affected Component" or "Affected Components"
    const affectedMatch = content.match(/\*\*Affected Components?\*\*:\s*(.*)/i) || 
                          content.match(/Affected Components?:\s*(.*)/i);
                          
    if (!affectedMatch) {
      findings.warnings.push({
        message: `Incident file ${incFile} is missing an "Affected Component" section.`,
        fix: `Add a line: **Affected Component**: \`<file_path_1>\`, \`<file_path_2>\` to identify modified files.`
      });
      continue;
    }
    
    // Extract all file paths within backticks or markdown links in that line
    const affectedLine = affectedMatch[1];
    const fileMatches = affectedLine.match(/`([^`]+)`|\[([^\]]+)\]\(file:\/\/\/[^\)]+\)/g) || [];
    const sourceFiles = [];
    
    for (const match of fileMatches) {
      let filePath = match.replace(/`|\[|\]/g, '');
      if (filePath.includes('](')) {
        filePath = filePath.split('](')[0];
      }
      filePath = filePath.trim().replace(/\\/g, '/');
      if (filePath && !filePath.startsWith('http')) {
        const resolved = resolveSourceFile(filePath);
        if (resolved) {
          sourceFiles.push(resolved);
        }
      }
    }
    
    if (sourceFiles.length === 0) {
      findings.warnings.push({
        message: `No valid source files found in the "Affected Component" line of ${incFile}.`,
        fix: `Make sure files are in backticks (e.g. \`src/styles/themes-enhanced.css\`) and exist on disk.`
      });
      continue;
    }
    
    // For each source file, verify it has a back-link pointing back to the SSOT / Incident
    for (const srcFile of sourceFiles) {
      const srcContent = readFile(srcFile);
      if (!srcContent) continue;
      
      // Look for "SSOT:" or the incident ID (e.g. "INC-033")
      const hasBackLink = srcContent.toLowerCase().includes('ssot:') || 
                          (incId && srcContent.toUpperCase().includes(incId));
                          
      if (!hasBackLink) {
        findings.errors.push({
          message: `DISC-001 Violation: Source file "${srcFile}" is modified by incident "${incId || filename}" but has no back-link comment pointing to the SSOT/Incident.`,
          fix: `Add a comment at the end of "${srcFile}" pointing back to the SSOT/Incident, e.g.:\n` +
               `  /* SSOT: docs/incidents/${filename} — ${incId || 'INC-XXX'} */`
        });
      } else {
        findings.passing.push(`DISC-001: Verified back-link in ${srcFile} for ${incId || filename}`);
      }
    }
  }
  
  return findings;
}

function auditDarkNodes() {
  if (!GRAPH_DATA) return;
  const nodes = GRAPH_DATA.nodes || [];
  const edges = GRAPH_DATA.edges || [];
  
  const codeNodes = nodes.filter(n => n.file_type === 'code' && n.source_file);
  const darkFiles = new Set();
  
  for (const node of codeNodes) {
    const isLinked = edges.some(e => {
      if (e.source === node.id || e.target === node.id) {
        const otherId = e.source === node.id ? e.target : e.source;
        const otherNode = nodes.find(n => n.id === otherId);
        return otherNode && otherNode.file_type === 'document';
      }
      return false;
    });
    
    const isExempt = node.source_file.includes('node_modules') || 
                     node.source_file.includes('scratch/') || 
                     node.source_file.includes('test/') || 
                     node.source_file.includes('__tests__') ||
                     node.source_file.endsWith('.test.js') ||
                     node.source_file.endsWith('.spec.js');
                     
    if (!isLinked && !isExempt) {
      darkFiles.add(node.source_file);
    }
  }
  
  const darkNodes = Array.from(darkFiles);
  
  if (darkNodes.length > 0 && !JSON_OUT) {
    console.log(`\n🌌 DISC-001 AUDIT: Found ${darkNodes.length} Dark (Undocumented) Code Components:`);
    const displayList = darkNodes.slice(0, 15);
    for (const file of displayList) {
      console.log(`   ⚫ ${file}`);
    }
    if (darkNodes.length > 15) {
      console.log(`   ... and ${darkNodes.length - 15} more dark components.`);
    }
    console.log('   💡 Advice: Create an incident log, standard, or SSOT mapping in docs/ to document these files.');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function run() {
  try {
    const graphPath = path.join(ROOT, 'graphify-out/graph.json');
    if (fs.existsSync(graphPath)) {
      try {
        GRAPH_DATA = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
      } catch (e) {
        console.warn(`⚠️ Failed to parse graphify-out/graph.json: ${e.message}`);
      }
    }

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

    // Entry-point parity check (runs unconditionally — it is an invariant, not
    // tied to the changeset). An entry point that drops its FKL Hub pointer fails.
    const parityFailing = checkEntryPointParity();
    if (!JSON_OUT) {
      if (parityFailing.length === 0) {
        console.log('🔗 Entry-point parity: CLAUDE.md / GEMINI.md / AGENTS.md all reference the FKL Hub ✅');
      } else {
        console.log('\n🔴 ENTRY-POINT PARITY FAILURE (Query 1.8 Gap 2):');
        for (const f of parityFailing) console.log(`   ❌ ${f.ep} — ${f.reason}`);
        console.log('   💡 Fix: add a pointer to docs/ssot/ui-design/FRONTEND-KNOWLEDGE-HUB.md so this agent has a path into the FKL.\n');
      }
    }

    // Emit the GAWC graph (GWPA §2) if requested — does not affect the gate's exit code
    if (EMIT) {
      let graphArtifactResults = artifactResults;
      let graphStandardResults = standardResults;

      // If we are in diff mode, we must perform a full scan to generate the full graph,
      // so governance-wiring.json is always complete and valid against its schema.
      if (!ALL_MODE) {
        const fullArtifacts = getAllArtifacts();
        const catalogPath = path.join(ROOT, '.agent/standards-catalog.json');
        let fullNewStandards = [];
        if (fs.existsSync(catalogPath)) {
          const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
          fullNewStandards = catalog.standards.filter(s =>
            s.lifecycle?.createdDate && s.lifecycle.createdDate >= GAWC_EPOCH
          );
        }
        graphArtifactResults = fullArtifacts.map(a => {
          if (a.type === 'agent-pattern') {
            return checkPatternWiring(a, consumption);
          } else if (a.type === 'arch-invariant') {
            return checkArchInvariantWiring(a, consumption);
          } else {
            return checkArtifactWiring(a, allStandards, consumption);
          }
        });
        graphStandardResults = fullNewStandards.map(s => {
          const artifact = { type: 'p-standard', file: '.agent/standards-catalog.json', ref: s.id, isNew: false };
          return checkArtifactWiring(artifact, allStandards, consumption);
        });
      }

      emitGraph(graphArtifactResults, graphStandardResults, consumption, EMIT_PATH);
    }

    // Exit code
    const allResults = [...artifactResults, ...standardResults];
    const hasErrors = allResults.some(r => r.status === 'unwired');
    const hasWarnings = allResults.some(r => r.status === 'partial');

    // Run Frontend Knowledge Index checks
    const changedFiles = [...getNewFilesFromDiff(), ...getModifiedFilesFromDiff()];
    const fklChecks = checkFrontendKnowledgeIndex(changedFiles);
    
    // Run Discoverability Self-Check (DISC-001)
    const discChecks = checkDiscoverabilitySelfCheck(changedFiles);

    // Run Dark Nodes audit
    auditDarkNodes();

    if (!JSON_OUT) {
      if (fklChecks.errors.length > 0) {
        console.log('\n🔴 FRONTEND KNOWLEDGE INDEX ERRORS:');
        for (const e of fklChecks.errors) {
          console.log(`   ❌ ${e.message}`);
          console.log(`   💡 Fix: ${e.fix}`);
        }
      }
      if (fklChecks.warnings.length > 0) {
        console.log('\n🟡 FRONTEND KNOWLEDGE INDEX WARNINGS:');
        for (const w of fklChecks.warnings) {
          console.log(`   ⚠️  ${w.message}`);
          console.log(`   💡 Fix: ${w.fix}`);
        }
      }
      
      if (discChecks.errors.length > 0) {
        console.log('\n🔴 DISC-001 DISCOVERABILITY SELF-CHECK ERRORS:');
        for (const e of discChecks.errors) {
          console.log(`   ❌ ${e.message}`);
          console.log(`   💡 Fix: ${e.fix}`);
        }
      }
      if (discChecks.warnings.length > 0) {
        console.log('\n🟡 DISC-001 DISCOVERABILITY SELF-CHECK WARNINGS:');
        for (const w of discChecks.warnings) {
          console.log(`   ⚠️  ${w.message}`);
          console.log(`   💡 Fix: ${w.fix}`);
        }
      }
    }

    const hasFklErrors = fklChecks.errors.length > 0;
    const hasFklWarnings = fklChecks.warnings.length > 0;
    const hasDiscErrors = discChecks.errors.length > 0;
    const hasDiscWarnings = discChecks.warnings.length > 0;

    if (hasErrors || parityFailing.length > 0 || hasFklErrors || hasDiscErrors) return 1;
    if ((hasWarnings || hasFklWarnings || hasDiscWarnings) && STRICT) return 1;
    return 0;

  } catch (err) {
    console.error(`\n❌ verify-governance-wiring error: ${err.message}\n`);
    return 2;
  }
}

process.exit(run());
