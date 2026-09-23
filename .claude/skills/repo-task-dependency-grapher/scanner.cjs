#!/usr/bin/env node
/**
 * repo-task-dependency-grapher — reference implementation of the 4-phase
 * pipeline described in SKILL.md (Phase 1.5 intentionally NOT implemented —
 * see SKILL.md's recorded Future Extension deferral).
 *
 * Read-only. Never writes to any discovered source. Prints to stdout unless
 * --out <file> is given, in which case it writes ONLY that new file.
 *
 * Usage:
 *   node scanner.cjs [--root <repoPath>] [--out <file>] [--src <dir,dir,...>]
 *   node scanner.cjs --self-test
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ---------------------------------------------------------------------------
// Phase 1: Multi-Source Discovery Adapter (Markdown Registry, Technical Debt
// Logs, Implementation Gaps, Incident Postmortems, Source Annotations).
// Firestore / GitHub Issues adapters are intentionally NOT implemented here —
// they need live credentials this static-analysis script doesn't assume;
// the skill's own read-only/no-write contract still applies if added later.
// ---------------------------------------------------------------------------

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Discovers every enhancement/backlog registry file for a repo — not just the
 * two hardcoded root files. Covers both monolithic repos (PIO: everything
 * inline in ENHANCEMENTS.md) and sharded repos that split tickets into
 * cluster files (Task-Dashboard's docs/enhancements/*-CLUSTER.md) or
 * per-ticket notes (Capsicum's enhancement-notes/**). Two channels:
 *   1. Markdown links inside a root registry pointing at docs/enhancements/
 *      or enhancement-notes/ (explicit, author-declared linkage).
 *   2. A bounded directory walk of docs/enhancements/ and enhancement-notes/
 *      (catches files nobody got around to linking).
 * Without this, parseEnhancements() only ever saw the root files, so a task
 * whose real dependency lived in a cluster/note file got a false in-degree
 * of 0 ("Ready Now") in sharded repos — see the Query/Response 2.5 Council
 * decision in User_Created/Discussion Threads/Skilll_Improvement/260917_PendingWork_Skill.md.
 */
function resolveEnhancementFiles(root) {
  const discovered = new Set();
  const rootCandidates = ['ENHANCEMENTS.md', 'ENHANCEMENT-MASTER-REGISTRY.md', 'BACKLOG.md', 'TODO.md'];
  const linkRe = /\[[^\]]+\]\(((?:docs\/enhancements\/|enhancement-notes\/)[^)#\s]+\.md)\)/g;

  for (const rel of rootCandidates) {
    if (!fs.existsSync(path.join(root, rel))) continue;
    discovered.add(rel);
    const text = safeRead(path.join(root, rel));
    if (!text) continue;
    for (const m of text.matchAll(linkRe)) {
      const linkedRel = m[1].replace(/^\.\//, '');
      if (fs.existsSync(path.join(root, linkedRel))) discovered.add(linkedRel);
    }
  }

  const skipDirs = new Set(['.enhancement-backups', 'archive', 'node_modules', '.git']);
  function walk(dir, depth) {
    if (depth > 4) return; // bounded traversal — no runaway recursion
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (skipDirs.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, depth + 1);
      else if (/\.md$/i.test(entry.name)) discovered.add(path.relative(root, full).replace(/\\/g, '/'));
    }
  }
  for (const d of ['docs/enhancements', 'enhancement-notes']) {
    const fullDir = path.join(root, d);
    if (fs.existsSync(fullDir)) walk(fullDir, 0);
  }

  return Array.from(discovered);
}

/**
 * Resolves the canonical enhancement prefix for a given repository.
 * Uses system intelligence hierarchy:
 * 1. Read enhancement-config.json (SSOT per enhancement-scaffolder / Protocol 6):
 *    checks `canonical_prefix` (Task-Dashboard standard) or `id_prefix` (PIO/Capsicum standard).
 * 2. If config is absent, inspects ENHANCEMENTS.md / ENHANCEMENT-MASTER-REGISTRY.md
 *    and heuristically derives the dominant ticket prefix.
 * 3. Returns null if unknown, allowing universal fallback matching.
 */
function resolveRepoPrefix(root) {
  const cfgPath = path.join(root, 'enhancement-config.json');
  try {
    if (fs.existsSync(cfgPath)) {
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      if (cfg.canonical_prefix) return cfg.canonical_prefix.toUpperCase();
      if (cfg.id_prefix) return cfg.id_prefix.toUpperCase();
    }
  } catch {}

  // Heuristic frequency scan from backlog registries
  for (const rel of ['ENHANCEMENTS.md', 'ENHANCEMENT-MASTER-REGISTRY.md']) {
    const text = safeRead(path.join(root, rel));
    if (text) {
      const counts = {};
      for (const m of text.matchAll(/\b([A-Z]{2,10})-\d+\b/g)) {
        const p = m[1];
        counts[p] = (counts[p] || 0) + 1;
      }
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) return sorted[0][0];
    }
  }
  return null;
}

/**
 * Intelligent, multi-format parser for enhancement registries:
 * - Prose blocks: `**PIO-192**: Title` with `**Status**: ...`, `**Parent**: ...`
 * - Bullet lists: `- **CAP-001**: [Title](url)` under section headers `## ⏳ PENDING`, `## ✅ COMPLETED`
 * - Master registries: `TASK-251 ✅ **COMPLETE** - Title... Dependencies: TASK-247`
 * - Clustered headings: `### **TASK-228: Title**` with `**Depends On**: ...`, `**Status**: ...`
 * Supports native prefix auto-detection, cross-repo references, and attribute merging across files.
 */
function parseEnhancements(root) {
  const repoPrefix = resolveRepoPrefix(root);
  const tasks = [];
  const byId = new Map();

  function registerOrMerge(task) {
    if (!byId.has(task.id)) {
      byId.set(task.id, task);
      tasks.push(task);
      return;
    }
    const existing = byId.get(task.id);
    // Merge dependencies
    for (const d of task.dependsOn) {
      if (!existing.dependsOn.includes(d)) existing.dependsOn.push(d);
    }
    // Merge files
    for (const f of task.files) {
      if (!existing.files.includes(f)) existing.files.push(f);
    }
    // Upgrade status if existing was Unknown
    if (existing.status === 'Unknown' && task.status !== 'Unknown') {
      existing.status = task.status;
    }
    // Upgrade priority if existing was default and new is High/Critical
    if ((existing.priority === 'Medium' || existing.priority === 'Low') && /high|critical/i.test(task.priority)) {
      existing.priority = task.priority;
    }
    // Prefer richer title if existing was short summary
    if (existing.title.length < 20 && task.title.length > existing.title.length) {
      existing.title = task.title;
    }
  }

  function extractDeps(block, rawTitle, currentId) {
    const depLines = [];
    const depRe = /(?:^|\n)[ \t]*(?:\*\*|__)?(?:Depends\s+On|Parent|Prerequisites|Dependencies|Blocked\s+by)(?:\*\*|__)?:\s*([^\n]+)/gi;
    let dm;
    while ((dm = depRe.exec(block))) {
      depLines.push(dm[1]);
    }
    const combinedDeps = `${depLines.join(' ')} ${rawTitle}`;
    const parents = [];
    for (const depMatch of combinedDeps.matchAll(/\b([A-Z]{2,10}(?:-[A-Z0-9]+)*-\d+)\b/g)) {
      const depId = depMatch[1].toUpperCase();
      if (depId !== currentId && !parents.includes(depId)) {
        parents.push(depId);
      }
    }
    return parents;
  }

  const registryFiles = resolveEnhancementFiles(root);
  for (const rel of registryFiles) {
    const text = safeRead(path.join(root, rel));
    if (!text) continue;

    // Pattern 1: Bold ticket ID at line start or bullet: `**ID**: ...` or `- **ID**: ...`
    const boldTicketRe = /(?:^|\n)[ \t]*(?:-\s*)?\*\*([A-Z]{2,10}(?:-[A-Z0-9]+)*-\d+)\*\*:\s*([^\n]+)/g;
    let m;
    while ((m = boldTicketRe.exec(text))) {
      const id = m[1];
      let rawTitle = m[2].trim();
      const linkMatch = /^\[([^\]]+)\]\([^)]+\)/.exec(rawTitle);
      const title = linkMatch ? linkMatch[1] : rawTitle.replace(/—.*$/, '').trim();

      const blockStart = m.index;
      const nextDelim = text.slice(blockStart + 1).search(/\n(?:---|\*\*|\#\#|- \*\*)/);
      const block = text.slice(blockStart, nextDelim === -1 ? blockStart + 1000 : blockStart + 1 + nextDelim);

      let status = 'Unknown';
      const statusField = /\*\*Status\*\*:\s*([^\n]+)/i.exec(block);
      if (statusField) {
        status = statusField[1].trim();
      } else {
        const beforeText = text.slice(0, blockStart);
        const lastHeading = beforeText.match(/##\s*([^\n]+)[^#]*$/);
        if (lastHeading) {
          const h = lastHeading[1].toUpperCase();
          if (h.includes('PENDING') || h.includes('NOT STARTED')) status = 'Pending';
          else if (h.includes('ACTIVE') || h.includes('IN PROGRESS')) status = 'Active';
          else if (h.includes('COMPLETED') || h.includes('DONE')) status = 'Completed';
          else if (h.includes('PLANNED')) status = 'Planned';
        }
      }

      const priorityField = /\*\*Priority\*\*:\s*([^\n]+)/i.exec(block);
      const priority = priorityField ? priorityField[1].trim() : (status === 'Completed' ? 'Low' : 'Medium');
      const parents = extractDeps(block, rawTitle, id);
      const files = Array.from(block.matchAll(/`([\w./-]+\.(?:js|jsx|ts|tsx|json|md))`/g)).map((x) => x[1]);

      registerOrMerge({ id, title, source: rel, status, priority, dependsOn: parents, files });
    }

    // Pattern 2: Master Registry entries: `TASK-251 ✅ **COMPLETE** (date) - Title`
    const registryEntryRe = /(?:^|\n)[ \t]*\b([A-Z]{2,10}(?:-[A-Z0-9]+)*-\d+)\b\s+([^\n-]+?)\s+-\s+([^\n;]+)/g;
    while ((m = registryEntryRe.exec(text))) {
      const id = m[1];
      const rawStatus = m[2].replace(/\*\*/g, '').trim();
      let status = 'Unknown';
      if (/COMPLETE|DONE/i.test(rawStatus)) status = 'Completed';
      else if (/IN PROGRESS|ACTIVE/i.test(rawStatus)) status = 'Active';
      else if (/PENDING|PLANNED/i.test(rawStatus)) status = 'Pending';
      else if (/PARKED|DEFERRED/i.test(rawStatus)) status = 'Parked';

      const title = m[3].trim().slice(0, 120);
      const contextSlice = text.slice(m.index, m.index + 500);
      const parents = extractDeps(contextSlice, title, id);

      registerOrMerge({ id, title, source: rel, status, priority: status === 'Completed' ? 'Low' : 'Medium', dependsOn: parents, files: [] });
    }

    // Pattern 3: Heading ticket entry: `### **ID: Title**` or `### **ID**: Title` or `### ID: Title`
    const headingTicketRe = /(?:^|\n)[ \t]*#{2,4}[ \t]+(?:\*\*)?([A-Z]{2,10}(?:-[A-Z0-9]+)*-\d+)(?::\s*|\*\*:?\s*)([^\n]+)/g;
    while ((m = headingTicketRe.exec(text))) {
      const id = m[1];
      let rawTitle = m[2].trim();

      let status = 'Unknown';
      if (/COMPLETE|DONE/i.test(rawTitle)) status = 'Completed';
      else if (/IN PROGRESS|ACTIVE/i.test(rawTitle)) status = 'Active';
      else if (/PENDING/i.test(rawTitle)) status = 'Pending';
      else if (/PLANNED|PLANNING/i.test(rawTitle)) status = 'Planned';
      else if (/PARKED|DEFERRED/i.test(rawTitle)) status = 'Parked';

      let title = rawTitle.replace(/\*\*/g, '').replace(/—.*$/, '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}].*$/u, '').trim();

      const blockStart = m.index;
      const nextDelim = text.slice(blockStart + 1).search(/\n(?:---|\#\#\#|\#\#)/);
      const block = text.slice(blockStart, nextDelim === -1 ? blockStart + 1500 : blockStart + 1 + nextDelim);

      if (status === 'Unknown') {
        const statusField = /(?:\*\*|__)?Status(?:\*\*|__)?:\s*([^\n]+)/i.exec(block);
        if (statusField) {
          const s = statusField[1].trim();
          if (/COMPLETE|DONE/i.test(s)) status = 'Completed';
          else if (/IN PROGRESS|ACTIVE/i.test(s)) status = 'Active';
          else if (/PENDING/i.test(s)) status = 'Pending';
          else if (/PLANNED|PLANNING/i.test(s)) status = 'Planned';
          else if (/PARKED|DEFERRED/i.test(s)) status = 'Parked';
          else status = s;
        }
      }

      let priority = 'Medium';
      const priorityField = /(?:\*\*|__)?Priority(?:\*\*|__)?:\s*([^\n]+)/i.exec(block);
      if (priorityField) {
        const p = priorityField[1].trim();
        if (/critical/i.test(p)) priority = 'Critical';
        else if (/high/i.test(p)) priority = 'High';
        else if (/low/i.test(p)) priority = 'Low';
        else priority = p;
      } else if (status === 'Completed') {
        priority = 'Low';
      }

      const parents = extractDeps(block, rawTitle, id);
      const files = Array.from(block.matchAll(/`([\w./-]+\.(?:js|jsx|ts|tsx|json|md))`/g)).map((x) => x[1]);

      registerOrMerge({ id, title, source: rel, status, priority, dependsOn: parents, files });
    }
  }

  return tasks;
}

/** Parses docs/IMPLEMENTATION_GAPS.md's `### GAP-xxx:` headings + status table. */
function parseImplementationGaps(root) {
  const text = safeRead(path.join(root, 'docs', 'IMPLEMENTATION_GAPS.md'));
  if (!text) return [];
  const statusById = {};
  for (const row of text.matchAll(/\|\s*(GAP-\d+)\s*\|[^|]*\|[^|]*\|\s*([^|]+?)\s*\|/g)) {
    statusById[row[1]] = row[2].trim();
  }
  const tasks = [];
  const headingRe = /###\s*(GAP-\d+):\s*([^\n]+)/g;
  let m;
  while ((m = headingRe.exec(text))) {
    const id = m[1];
    const title = m[2].replace(/—.*$/, '').trim();
    const status = statusById[id] || 'Unknown';
    tasks.push({ id, title, source: 'docs/IMPLEMENTATION_GAPS.md', status, priority: 'High', dependsOn: [], files: [] });
  }
  return tasks;
}

/** Best-effort scan of the two technical-debt registries for DEBT-/FF-/INV- IDs. */
function parseTechnicalDebt(root) {
  const tasks = [];
  for (const rel of ['docs/TECHNICAL_DEBT.md', '.agent/technical-debt.md']) {
    const text = safeRead(path.join(root, rel));
    if (!text) continue;
    const seen = new Set();
    for (const m of text.matchAll(/\b((?:DEBT|FF|INV)-[A-Za-z0-9]+)\b[^\n]*?[-:—]\s*([^\n]+)/g)) {
      if (seen.has(m[1])) continue;
      seen.add(m[1]);
      tasks.push({ id: m[1], title: m[2].trim().slice(0, 120), source: rel, status: 'Unknown', priority: 'Medium', dependsOn: [], files: [] });
    }
  }
  return tasks;
}

/**
 * Lists docs/incidents/INC-*.md, extracting the first H1 as the title.
 * IDs default to the bare `INC-NNN` number (so plain-prose references like
 * "Blocked by: INC-005" still resolve). But some repos have multiple distinct
 * incident files sharing one number (e.g. INC-005-a.md, INC-005-b.md) from
 * parallel authorship — those would otherwise silently collide on the same
 * key in buildGraph's `byId` Map, and only the last one survives. When a
 * number is shared, every file with that number gets the full filename stem
 * as its ID instead, so no incident silently disappears from the graph.
 */
function parseIncidents(root) {
  const dir = path.join(root, 'docs', 'incidents');
  let entries = [];
  try {
    entries = fs.readdirSync(dir).filter((f) => /^INC-\d+.*\.md$/i.test(f));
  } catch {
    return [];
  }
  const numericId = (f) => (/INC-\d+/.exec(f) || ['INC-UNKNOWN'])[0];
  const counts = {};
  for (const f of entries) counts[numericId(f)] = (counts[numericId(f)] || 0) + 1;

  return entries.map((f) => {
    const text = safeRead(path.join(dir, f)) || '';
    const base = numericId(f);
    const id = counts[base] > 1 ? path.basename(f, '.md') : base;
    const title = (/^#\s*(.+)$/m.exec(text) || [, f])[1].trim();
    return { id, title, source: `docs/incidents/${f}`, status: 'Unaddressed-Follow-up', priority: 'Medium', dependsOn: [], files: [] };
  });
}

/** Walks a bounded set of source dirs for TODO/FIXME/DEPRECATED/STUB comments. */
function parseSourceAnnotations(root, srcDirs) {
  const tasks = [];
  const tagRe = /(TODO|FIXME|DEPRECATED|STUB)[:\s]/;
  const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.agent', '.claude']);

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (skipDirs.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
        const text = safeRead(full);
        if (!text) continue;
        text.split('\n').forEach((line, i) => {
          const m = tagRe.exec(line);
          if (m) {
            tasks.push({
              id: `${m[1]}-${path.basename(full)}-${i + 1}`,
              title: line.trim().slice(0, 160),
              source: `${path.relative(root, full)}:${i + 1}`,
              status: 'Open',
              priority: m[1] === 'DEPRECATED' ? 'Medium' : 'Low',
              dependsOn: [],
              files: [path.relative(root, full)],
            });
          }
        });
      }
    }
  }

  for (const d of srcDirs) walk(path.join(root, d));
  return tasks;
}

function discover(root, srcDirs) {
  return [
    ...parseEnhancements(root),
    ...parseImplementationGaps(root),
    ...parseTechnicalDebt(root),
    ...parseIncidents(root),
    ...parseSourceAnnotations(root, srcDirs),
  ];
}

// ---------------------------------------------------------------------------
// Phase 2: Topological Graph Engine (Kahn's algorithm + cycle detection).
// Edges come only from declared `dependsOn` fields parsed in Phase 1 — no
// static-code coupling probe (Phase 1.5 is deferred; see SKILL.md).
// ---------------------------------------------------------------------------

function buildGraph(tasks) {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const inDegree = new Map(tasks.map((t) => [t.id, 0]));
  const edges = [];
  for (const t of tasks) {
    for (const dep of t.dependsOn) {
      if (byId.has(dep)) {
        edges.push([dep, t.id]);
        inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
      }
    }
  }
  return { byId, inDegree, edges };
}

function topoSort(graph) {
  const inDegree = new Map(graph.inDegree);
  const adj = new Map();
  for (const [from, to] of graph.edges) {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push(to);
  }
  const queue = [...inDegree.entries()].filter(([, d]) => d === 0).map(([id]) => id);
  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    for (const next of adj.get(id) || []) {
      inDegree.set(next, inDegree.get(next) - 1);
      if (inDegree.get(next) === 0) queue.push(next);
    }
  }
  const cycle = order.length < graph.byId.size;
  return { order, cycle, unresolved: cycle ? [...graph.byId.keys()].filter((id) => !order.includes(id)) : [] };
}

// ---------------------------------------------------------------------------
// Phase 3: Multi-Factor Risk & Feasibility Calculator.
// Heuristic, not a precise measurement — E_base/M_tier are inferred from
// priority/path keywords; document this clearly rather than overstating
// certainty (the exact failure mode Amendment 1 fixed elsewhere).
// ---------------------------------------------------------------------------

function godNodeMultiplier(root, files) {
  let maxLines = 0;
  for (const f of files) {
    const text = safeRead(path.join(root, f));
    if (text) maxLines = Math.max(maxLines, text.split('\n').length);
  }
  if (maxLines > 800) return 2.5;
  if (maxLines >= 400) return 1.5;
  return 1.0;
}

function criticalityMultiplier(files) {
  const joined = files.join(' ').toLowerCase();
  if (/ledger|auth|firestore\.rules|accounts|receivable/.test(joined)) return 2.0;
  if (/router|aggregat|backend/.test(joined)) return 1.5;
  return 1.0;
}

function baseEffort(priority) {
  const p = (priority || '').toLowerCase();
  if (p.includes('high')) return 5;
  if (p.includes('medium')) return 3;
  if (p.includes('low')) return 1;
  return 3;
}

function scoreTask(root, task, fanout) {
  const eBase = baseEffort(task.priority);
  const gF = godNodeMultiplier(root, task.files);
  const mTier = criticalityMultiplier(task.files);
  const risk = eBase * (1 + fanout / 10) * gF * mTier;
  return { eBase, gF, mTier, fanout, risk: Math.round(risk * 100) / 100 };
}

// ---------------------------------------------------------------------------
// Phase 4: Output Generation & Rollout Safeguards.
// Mandatory sanitization pass runs on rendered text ONLY, per Amendment 1 —
// never on the internal task/graph objects used by Phase 2/3 logic above.
// ---------------------------------------------------------------------------

const REDACTION_PATTERNS = [
  { name: 'api-key', re: /\b(AIza[\w-]{10,}|sk-[\w-]{10,}|ghp_[\w-]{10,})\b/g },
  { name: 'email', re: /\b[\w.+-]+@(?:gmail\.com|[\w-]+\.(?:com|org|net|io))\b/g },
  { name: 'config-secret', re: /\b(apiKey|token|secret|password|allowedUsers)\s*[:=]\s*["'`]?[\w./-]{6,}["'`]?/gi },
];

function redact(text) {
  let out = text;
  for (const { name, re } of REDACTION_PATTERNS) {
    out = out.replace(re, `[REDACTED:${name}]`);
  }
  return out;
}

function tierFor(priority) {
  const p = (priority || '').toLowerCase();
  if (p.includes('critical') || p.includes('outage')) return 0;
  if (p.includes('high')) return 1;
  if (p.includes('medium')) return 2;
  return 3;
}

function renderMermaid(tasks, graph) {
  const tierNames = ['🔴 TIER 0', '🟠 TIER 1', '🟡 TIER 2', '🟢 TIER 3'];
  const byTier = [[], [], [], []];
  for (const t of tasks) byTier[tierFor(t.priority)].push(t);

  const lines = ['```mermaid', 'graph TD'];
  byTier.forEach((group, tier) => {
    if (!group.length) return;
    lines.push(`    subgraph T${tier} ["${tierNames[tier]}"]`);
    for (const t of group) {
      const safeId = t.id.replace(/[^\w]/g, '_');
      const label = redact(`${t.id}: ${t.title}`).replace(/"/g, "'").slice(0, 90);
      lines.push(`        ${safeId}["${label}"]:::t${tier}`);
    }
    lines.push('    end');
  });
  for (const [from, to] of graph.edges) {
    lines.push(`    ${from.replace(/[^\w]/g, '_')} --> ${to.replace(/[^\w]/g, '_')}`);
  }
  lines.push('```');
  return lines.join('\n');
}

function renderReport(root, tasks, graph, order) {
  const fanoutById = new Map();
  for (const [from] of graph.edges) fanoutById.set(from, (fanoutById.get(from) || 0) + 1);

  const lines = [
    `# Task Dependency Report`,
    ``,
    `Generated: ${new Date().toISOString()} | Tasks discovered: ${tasks.length} | Edges: ${graph.edges.length}`,
    ``,
    `> Read-only output. This report is not written back to any registry — apply findings manually.`,
    ``,
    `## Ready Now (in-degree 0)`,
  ];
  const ready = order.length ? order.filter((id) => graph.inDegree.get(id) === 0) : [];
  for (const id of ready.slice(0, 30)) {
    const t = graph.byId.get(id);
    const score = scoreTask(root, t, fanoutById.get(id) || 0);
    lines.push(`- **${redact(t.id)}** (${t.source}) — risk ${score.risk} (E=${score.eBase}, G=${score.gF}, M=${score.mTier}, fanout=${score.fanout})`);
  }
  if (!order.length && tasks.length) lines.push('_(none — see cycle warning below)_');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { root: process.cwd(), src: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root' && i + 1 < argv.length) args.root = argv[++i];
    else if (a.startsWith('--root=')) args.root = a.slice(7);
    else if (a === '--out' && i + 1 < argv.length) args.out = argv[++i];
    else if (a.startsWith('--out=')) args.out = a.slice(6);
    else if (a === '--src' && i + 1 < argv.length) args.src = argv[++i].split(',');
    else if (a.startsWith('--src=')) args.src = a.slice(6).split(',');
    else if (a === '--self-test') args.selfTest = true;
  }
  if (!args.src) {
    const candidates = ['src', 'backend/src', 'public/js', 'public', 'lib', 'app', 'modules'];
    args.src = candidates.filter((d) => fs.existsSync(path.join(args.root, d)));
  }
  return args;
}

function assert(cond, msg) {
  if (!cond) throw new Error(`Self-test FAILED: ${msg}`);
}

function runSelfTest() {
  // Cycle detection
  const cyclic = buildGraph([
    { id: 'A', dependsOn: ['B'] },
    { id: 'B', dependsOn: ['A'] },
  ]);
  const cyclicResult = topoSort(cyclic);
  assert(cyclicResult.cycle === true, 'expected a cycle to be detected for A<->B');

  // Valid diamond ordering
  const diamond = buildGraph([
    { id: 'A', dependsOn: [] },
    { id: 'B', dependsOn: ['A'] },
    { id: 'C', dependsOn: ['A'] },
    { id: 'D', dependsOn: ['B', 'C'] },
  ]);
  const diamondResult = topoSort(diamond);
  assert(!diamondResult.cycle, 'diamond graph must not be flagged as cyclic');
  assert(diamondResult.order.indexOf('A') < diamondResult.order.indexOf('D'), 'A must precede D');
  assert(diamondResult.order.indexOf('B') < diamondResult.order.indexOf('D'), 'B must precede D');

  // Redaction: catches known-shaped secrets, leaves normal text alone
  const dirty = 'key=AIzaSyFAKEKEY1234567890ABCDEFG and email test.user@gmail.com';
  const clean = redact(dirty);
  assert(!clean.includes('AIzaSyFAKEKEY'), 'API-key-shaped string must be redacted');
  assert(!clean.includes('test.user@gmail.com'), 'gmail address must be redacted');
  assert(redact('This is a normal sentence about tasks.') === 'This is a normal sentence about tasks.', 'plain text must pass through unredacted');

  // Enhancement discovery: root registry + linked cluster file + walk-only note file
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grapher-self-test-'));
  try {
    fs.writeFileSync(
      path.join(tmpRoot, 'ENHANCEMENTS.md'),
      '- **TEST-001**: Root ticket\nSee [cluster](docs/enhancements/TEST-CLUSTER.md) for sharded epics.\n'
    );
    fs.mkdirSync(path.join(tmpRoot, 'docs', 'enhancements'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, 'docs', 'enhancements', 'TEST-CLUSTER.md'),
      '- **TEST-002**: Linked cluster ticket\n\n### **TEST-004: Heading based cluster ticket** 📋 **PENDING**\n**Status**: 📋 **PENDING**\n**Depends On**: TEST-001, TEST-002\n\n### **TEST-001: Root ticket detailed**\n**Depends On**: TEST-002\n`src/core.js`\n'
    );
    fs.mkdirSync(path.join(tmpRoot, 'enhancement-notes', 'TEST-003'), { recursive: true });
    fs.writeFileSync(path.join(tmpRoot, 'enhancement-notes', 'TEST-003', '00_INDEX.md'), '- **TEST-003**: Unlinked note, found only by directory walk\n');

    const found = resolveEnhancementFiles(tmpRoot);
    assert(found.includes('ENHANCEMENTS.md'), 'must discover root ENHANCEMENTS.md');
    assert(found.includes('docs/enhancements/TEST-CLUSTER.md'), 'must follow markdown link to cluster file');
    assert(found.includes('enhancement-notes/TEST-003/00_INDEX.md'), 'must discover unlinked note via directory walk');

    const parsed = parseEnhancements(tmpRoot);
    const ids = parsed.map((t) => t.id);
    assert(
      ids.includes('TEST-001') && ids.includes('TEST-002') && ids.includes('TEST-003') && ids.includes('TEST-004'),
      'parseEnhancements must ingest tasks from root + linked cluster + walked note files + heading entries'
    );

    const t4 = parsed.find((t) => t.id === 'TEST-004');
    assert(t4 && t4.dependsOn.includes('TEST-001') && t4.dependsOn.includes('TEST-002'), 'TEST-004 must extract Depends On dependencies');
    assert(t4 && t4.status === 'Pending', 'TEST-004 must extract status from heading/block');

    const t1 = parsed.find((t) => t.id === 'TEST-001');
    assert(t1 && t1.dependsOn.includes('TEST-002'), 'TEST-001 must merge Depends On dependencies from detail cluster');
    assert(t1 && t1.files.includes('src/core.js'), 'TEST-001 must merge files from detail cluster');
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }

  // Incident ID collision: distinct files sharing one number must not collapse
  const incRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grapher-self-test-inc-'));
  try {
    const incDir = path.join(incRoot, 'docs', 'incidents');
    fs.mkdirSync(incDir, { recursive: true });
    fs.writeFileSync(path.join(incDir, 'INC-005-first-issue.md'), '# First distinct incident\n');
    fs.writeFileSync(path.join(incDir, 'INC-005-second-issue.md'), '# Second distinct incident\n');
    fs.writeFileSync(path.join(incDir, 'INC-999-unique.md'), '# Unique incident\n');

    const incidents = parseIncidents(incRoot);
    const ids = incidents.map((t) => t.id);
    assert(ids.length === 3, `expected 3 distinct incidents, got ${ids.length}: ${ids.join(', ')}`);
    assert(ids.includes('INC-005-first-issue') && ids.includes('INC-005-second-issue'), 'colliding INC-005 files must get disambiguated filename-stem IDs');
    assert(ids.includes('INC-999'), 'a non-colliding incident must keep its plain INC-NNN id');
  } finally {
    fs.rmSync(incRoot, { recursive: true, force: true });
  }

  console.log('✅ All self-tests passed.');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) {
    runSelfTest();
    return;
  }

  const tasks = discover(args.root, args.src);
  const graph = buildGraph(tasks);
  const { order, cycle, unresolved } = topoSort(graph);

  const parts = [];
  parts.push(`# Repo Task Dependency Graph — ${path.basename(args.root)}`);
  parts.push('');
  if (cycle) {
    parts.push(`⚠️ **Cycle detected** — could not fully order ${unresolved.length} task(s): ${unresolved.join(', ')}`);
    parts.push('');
  }
  parts.push(renderMermaid(tasks, graph));
  parts.push('');
  parts.push(renderReport(args.root, tasks, graph, order));

  const output = parts.join('\n');
  if (args.out) {
    fs.writeFileSync(args.out, output, 'utf8');
    console.log(`Wrote report to ${args.out} (${tasks.length} tasks discovered).`);
  } else {
    console.log(output);
  }
}

if (require.main === module) {
  main();
}

module.exports = { discover, buildGraph, topoSort, scoreTask, redact, renderMermaid, renderReport };
