#!/usr/bin/env node
/**
 * scripts/generate-domain-graph.cjs — Native Domain Entity Knowledge Graph Generator
 *
 * Part of SK-019 (STD-UNIVERSAL-TAXONOMY-001 / PKG-006 / AC-DEC-2026-060)
 *
 * Scans markdown frontmatter, JSONL records, and intra-document cross-reference links
 * across all 9 domain pillars to build a deterministic entity knowledge graph.
 * Emits graphify-out/GRAPH_REPORT.md and graphify-out/graph.json without external dependencies.
 *
 * Usage:
 *   node scripts/generate-domain-graph.cjs [--root <repoPath>] [--out <dir>]
 */
'use strict';

const fs = require('fs');
const path = require('path');

// ─── Canonical Entity Prefixes ────────────────────────────────────────────────
const CANONICAL_PREFIXES = [
  'EVT', 'RIT', 'SAM', 'PER', 'FAM', 'VEN', 'VDR', 'CTR',
  'TSK', 'DEC', 'PAY', 'RSK', 'AST', 'CHG', 'GATE', 'CP',
  'TRS', 'SHP', 'GFT'
];

// Regex matching canonical entity IDs e.g. EVT-001, TRS-BR-01, SAM-005, GATE-01
const ENTITY_ID_REGEX = new RegExp(`\\b(${CANONICAL_PREFIXES.join('|')})-[A-Za-z0-9_-]+\\b`, 'g');

// ─── Frontmatter & Link Parsers ───────────────────────────────────────────────
function parseFrontmatter(text) {
  if (!text || typeof text !== 'string') return {};
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const data = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    data[key] = val;
  }
  return data;
}

function extractEntityLinks(text) {
  if (!text || typeof text !== 'string') return [];
  const matches = text.match(ENTITY_ID_REGEX) || [];
  return Array.from(new Set(matches));
}

// ─── File Discovery ───────────────────────────────────────────────────────────
function findSourceFiles(repoRoot) {
  const targetDirs = [
    '00_GOVERNANCE', '01_TIMELINE_EVENTS', '02_RITUALS_CULTURE',
    '03_PEOPLE_GUESTS', '04_PROCUREMENT_VENDORS', '05_OPERATIONS_LOGISTICS',
    '06_FINANCE_COMMERCIALS', '07_DOCUMENTS_ARCHIVE', '08_RESEARCH_REFERENCE',
    'docs'
  ];

  const files = [];

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'graphify-out') {
          walk(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.jsonl'))) {
        try {
          const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, '/');
          const content = fs.readFileSync(fullPath, 'utf8');
          files.push({ filePath: relPath, content });
        } catch (_) {}
      }
    }
  }

  // Walk target directories
  for (const d of targetDirs) {
    walk(path.join(repoRoot, d));
  }

  // Also check root markdown files
  const rootFiles = ['ARCHITECTURE_SPEC.md', 'DOCS_HUB.md', 'README.md', 'ENHANCEMENT-MASTER-REGISTRY.md'];
  for (const rf of rootFiles) {
    const fullPath = path.join(repoRoot, rf);
    if (fs.existsSync(fullPath)) {
      try {
        files.push({ filePath: rf, content: fs.readFileSync(fullPath, 'utf8') });
      } catch (_) {}
    }
  }

  return files;
}

// ─── Graph Builder ────────────────────────────────────────────────────────────
function buildGraph(files) {
  const nodes = {};
  const dangling = new Set();

  // First Pass: Register explicit nodes
  for (const file of files) {
    if (file.filePath.endsWith('.jsonl')) {
      // JSONL items (e.g. shopping_items.jsonl)
      const lines = file.content.split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        try {
          const item = JSON.parse(line);
          if (item.id) {
            nodes[item.id] = {
              id: item.id,
              type: item.id.split('-')[0],
              title: item.title || item.name || item.id,
              file: file.filePath,
              status: item.status || 'Active',
              category: item.category || '',
              outbound: [],
              inbound: []
            };
          }
        } catch (_) {}
      }
    } else {
      // Markdown files
      const fm = parseFrontmatter(file.content);
      let nodeId = fm.id;
      if (!nodeId) {
        // Fallback: Check if file name begins with entity prefix (e.g., EVT-001_nirbandha.md -> EVT-001)
        const base = path.basename(file.filePath);
        const match = base.match(new RegExp(`^(${CANONICAL_PREFIXES.join('|')})-[A-Za-z0-9]+(-[A-Za-z0-9]+)?`));
        if (match) nodeId = match[0];
      }

      // If title is missing, try to extract from first H1 header
      let title = fm.name || fm.title || fm.full_name;
      if (!title) {
        const h1Match = file.content.match(/^#\s+(?:[^\w\s]+\s+)?([^\r\n]+)/m);
        if (h1Match) {
          title = h1Match[1].replace(/^[A-Z]{2,4}-\d{2,3}(?:-[A-Za-z0-9]+)?:\s*/, '').trim();
        } else {
          title = path.basename(file.filePath, '.md');
        }
      }

      if (nodeId) {
        nodes[nodeId] = {
          id: nodeId,
          type: nodeId.split('-')[0],
          title: title,
          file: file.filePath,
          status: fm.status || 'Documented',
          category: fm.category || '',
          outbound: [],
          inbound: []
        };
      }
    }
  }

  // Second Pass: Link relationships
  for (const file of files) {
    let sourceId = null;
    if (!file.filePath.endsWith('.jsonl')) {
      const fm = parseFrontmatter(file.content);
      sourceId = fm.id;
      if (!sourceId) {
        const base = path.basename(file.filePath);
        const match = base.match(new RegExp(`^(${CANONICAL_PREFIXES.join('|')})-[A-Za-z0-9]+(-[A-Za-z0-9]+)?`));
        if (match) sourceId = match[0];
      }
    }

    const links = extractEntityLinks(file.content);
    for (const targetId of links) {
      if (sourceId && sourceId === targetId) continue; // Skip self references

      if (sourceId && nodes[sourceId]) {
        if (!nodes[sourceId].outbound.includes(targetId)) {
          nodes[sourceId].outbound.push(targetId);
        }
      }

      if (nodes[targetId]) {
        if (sourceId && !nodes[targetId].inbound.includes(sourceId)) {
          nodes[targetId].inbound.push(sourceId);
        }
      } else {
        dangling.add(targetId);
      }
    }
  }

  return { nodes, dangling: Array.from(dangling) };
}

// ─── Markdown Report Generator ────────────────────────────────────────────────
function generateMarkdownReport(graph) {
  const { nodes, dangling } = graph;
  const nodeIds = Object.keys(nodes);

  // Group by prefix type
  const typeCounts = {};
  for (const id of nodeIds) {
    const type = nodes[id].type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  let totalEdges = 0;
  for (const id of nodeIds) {
    totalEdges += nodes[id].outbound.length;
  }

  let md = `# 🌐 Canonical Domain Entity Graph Report\n\n`;
  md += `> **Standard**: \`STD-UNIVERSAL-TAXONOMY-001\` / \`STD-PCL-001\`  \n`;
  md += `> **Generated At**: ${new Date().toISOString()}  \n`;
  md += `> **Entities Indexed**: ${nodeIds.length} | **Cross-Reference Edges**: ${totalEdges} | **Dangling Targets**: ${dangling.length}  \n\n`;
  md += `---\n\n`;

  md += `## 1. Domain Entity Breakdown\n\n`;
  md += `| Prefix | Entity Domain Description | Node Count |\n`;
  md += `| :--- | :--- | :--- |\n`;
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    md += `| **\`${type}-###\`** | Domain \`${type}\` entities | ${count} |\n`;
  }
  md += `\n---\n\n`;

  md += `## 2. Canonical Entity Index & Hub Topology\n\n`;
  md += `| Entity ID | Title / Concept | Status | File Location | Outbound Refs | Inbound Refs |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  for (const id of nodeIds.sort()) {
    const n = nodes[id];
    md += `| **\`${n.id}\`** | ${n.title} | \`${n.status}\` | [\`${n.file}\`](../${n.file}) | ${n.outbound.length} | ${n.inbound.length} |\n`;
  }

  if (dangling.length > 0) {
    md += `\n---\n\n`;
    md += `## 3. Referenced Entity Stubs (Dangling Links)\n\n`;
    md += `These entity identifiers are referenced in documentation or JSONL catalogs but lack formal spec files:\n\n`;
    md += `| Missing Entity ID | Expected Domain | Status |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const d of dangling.sort()) {
      const type = d.split('-')[0];
      md += `| **\`${d}\`** | ${type} | \`UNSCAFFOLDED_REFERENCE\` |\n`;
    }
  }

  md += `\n---\n\n*Generated automatically by \`scripts/generate-domain-graph.cjs\`.*\n`;
  return md;
}

// ─── CLI Execution ─────────────────────────────────────────────────────────────
function run(repoRoot = path.resolve(__dirname, '..')) {
  console.log(`🚀 [Domain Graph] Scanning repository at: ${repoRoot}`);
  const files = findSourceFiles(repoRoot);
  console.log(`   Found ${files.length} markdown and JSONL source files.`);

  const graph = buildGraph(files);
  const nodeCount = Object.keys(graph.nodes).length;
  console.log(`   Compiled ${nodeCount} entity nodes with ${graph.dangling.length} external references.`);

  const outDir = path.join(repoRoot, 'graphify-out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const report = generateMarkdownReport(graph);
  fs.writeFileSync(path.join(outDir, 'GRAPH_REPORT.md'), report, 'utf8');
  fs.writeFileSync(path.join(outDir, 'graph.json'), JSON.stringify(graph, null, 2), 'utf8');

  console.log(`✅ [Domain Graph] Generated:`);
  console.log(`   - ${path.relative(repoRoot, path.join(outDir, 'GRAPH_REPORT.md'))}`);
  console.log(`   - ${path.relative(repoRoot, path.join(outDir, 'graph.json'))}\n`);
  return graph;
}

if (require.main === module) {
  run();
}

module.exports = {
  CANONICAL_PREFIXES,
  parseFrontmatter,
  extractEntityLinks,
  findSourceFiles,
  buildGraph,
  generateMarkdownReport,
  run
};
