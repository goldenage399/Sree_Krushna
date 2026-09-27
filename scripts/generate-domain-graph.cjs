#!/usr/bin/env node
/**
 * scripts/generate-domain-graph.cjs — Universal Domain Entity Knowledge Graph Generator
 *
 * Part of SK-019 (STD-UNIVERSAL-TAXONOMY-001 / PKG-006 / AC-DEC-2026-060)
 *
 * Scans markdown frontmatter, JSONL records, and intra-document cross-reference links
 * across domain directories to build a deterministic entity knowledge graph.
 * Configured via .agent/domain-graph-config.json with zero external dependencies.
 *
 * Usage:
 *   node scripts/generate-domain-graph.cjs [--root <repoPath>] [--config <configPath>] [--out <dir>]
 */
'use strict';

const fs = require('fs');
const path = require('path');

// ─── Default Canonical Entity Prefixes ─────────────────────────────────────────
const DEFAULT_CANONICAL_PREFIXES = [
  'EVT', 'RIT', 'SAM', 'PER', 'FAM', 'VEN', 'VDR', 'CTR',
  'TSK', 'DEC', 'PAY', 'RSK', 'AST', 'CHG', 'GATE', 'CP',
  'TRS', 'SHP', 'GFT', 'OBL', 'EXC'
];

// ─── Configuration Loader ───────────────────────────────────────────────────────
function loadConfig(repoRoot, customConfigPath = null) {
  let resolvedPath = null;
  if (customConfigPath) {
    resolvedPath = path.isAbsolute(customConfigPath)
      ? customConfigPath
      : path.resolve(repoRoot, customConfigPath);
  } else {
    const candidate = path.join(repoRoot, '.agent', 'domain-graph-config.json');
    if (fs.existsSync(candidate)) {
      resolvedPath = candidate;
    }
  }

  const defaults = {
    repoName: path.basename(repoRoot),
    canonicalPrefixes: DEFAULT_CANONICAL_PREFIXES,
    targetDirectories: [
      '00_GOVERNANCE', '01_TIMELINE_EVENTS', '02_RITUALS_CULTURE',
      '03_PEOPLE_GUESTS', '04_PROCUREMENT_VENDORS', '05_OPERATIONS_LOGISTICS',
      '06_FINANCE_COMMERCIALS', '07_DOCUMENTS_ARCHIVE', '08_RESEARCH_REFERENCE',
      'docs'
    ],
    rootFiles: ['ARCHITECTURE_SPEC.md', 'DOCS_HUB.md', 'README.md', 'ENHANCEMENT-MASTER-REGISTRY.md'],
    ignoreDirectories: ['node_modules', '.git', 'graphify-out', 'scratch', 'User_Created'],
    outputDir: 'graphify-out'
  };

  if (!resolvedPath || !fs.existsSync(resolvedPath)) {
    return defaults;
  }

  try {
    const raw = fs.readFileSync(resolvedPath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      repoName: parsed.repoName || defaults.repoName,
      canonicalPrefixes: Array.isArray(parsed.canonicalPrefixes) && parsed.canonicalPrefixes.length > 0
        ? parsed.canonicalPrefixes
        : defaults.canonicalPrefixes,
      targetDirectories: Array.isArray(parsed.targetDirectories)
        ? parsed.targetDirectories
        : defaults.targetDirectories,
      rootFiles: Array.isArray(parsed.rootFiles)
        ? parsed.rootFiles
        : defaults.rootFiles,
      ignoreDirectories: Array.isArray(parsed.ignoreDirectories)
        ? parsed.ignoreDirectories
        : defaults.ignoreDirectories,
      outputDir: parsed.outputDir || defaults.outputDir
    };
  } catch (err) {
    console.warn(`⚠️ [Domain Graph] Error reading config at ${resolvedPath}, using defaults: ${err.message}`);
    return defaults;
  }
}

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

function extractEntityLinks(text, prefixes = DEFAULT_CANONICAL_PREFIXES) {
  if (!text || typeof text !== 'string') return [];
  const regex = new RegExp(`\\b(${prefixes.join('|')})-[A-Za-z0-9_-]+\\b`, 'g');
  const matches = text.match(regex) || [];
  return Array.from(new Set(matches));
}

// ─── File Discovery ───────────────────────────────────────────────────────────
function findSourceFiles(repoRoot, config = null) {
  const cfg = config || loadConfig(repoRoot);
  const files = [];
  const visitedPaths = new Set();
  const ignoreSet = new Set(cfg.ignoreDirectories || []);

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (_) {
      return;
    }

    for (const entry of entries) {
      if (ignoreSet.has(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.jsonl'))) {
        try {
          const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, '/');
          if (!visitedPaths.has(relPath)) {
            visitedPaths.add(relPath);
            const content = fs.readFileSync(fullPath, 'utf8');
            files.push({ filePath: relPath, content });
          }
        } catch (_) {}
      }
    }
  }

  // Walk target directories
  let foundAnyDir = false;
  for (const d of cfg.targetDirectories) {
    const dirPath = path.join(repoRoot, d);
    if (fs.existsSync(dirPath)) {
      foundAnyDir = true;
      walk(dirPath);
    }
  }

  // If none of targetDirectories exist, fallback to discovering root-level directories
  if (!foundAnyDir) {
    try {
      const rootEntries = fs.readdirSync(repoRoot, { withFileTypes: true });
      for (const entry of rootEntries) {
        if (entry.isDirectory() && !ignoreSet.has(entry.name)) {
          walk(path.join(repoRoot, entry.name));
        }
      }
    } catch (_) {}
  }

  // Also check root markdown files
  for (const rf of (cfg.rootFiles || [])) {
    const fullPath = path.join(repoRoot, rf);
    if (fs.existsSync(fullPath)) {
      try {
        const relPath = rf.replace(/\\/g, '/');
        if (!visitedPaths.has(relPath)) {
          visitedPaths.add(relPath);
          files.push({ filePath: relPath, content: fs.readFileSync(fullPath, 'utf8') });
        }
      } catch (_) {}
    }
  }

  return files;
}

// ─── Graph Builder ────────────────────────────────────────────────────────────
function buildGraph(files, config = null) {
  const prefixes = (config && config.canonicalPrefixes) || DEFAULT_CANONICAL_PREFIXES;
  const nodes = {};
  const dangling = new Set();
  const prefixMatchRegex = new RegExp(`^(${prefixes.join('|')})-[A-Za-z0-9]+(-[A-Za-z0-9]+)?`);

  // First Pass: Register explicit nodes
  for (const file of files) {
    if (file.filePath.endsWith('.jsonl')) {
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
      const fm = parseFrontmatter(file.content);
      let nodeId = fm.id;
      if (!nodeId) {
        const base = path.basename(file.filePath);
        const match = base.match(prefixMatchRegex);
        if (match) nodeId = match[0];
      }

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
        const match = base.match(prefixMatchRegex);
        if (match) sourceId = match[0];
      }
    }

    const links = extractEntityLinks(file.content, prefixes);
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
function generateMarkdownReport(graph, config = null) {
  const { nodes, dangling } = graph;
  const nodeIds = Object.keys(nodes);
  const repoName = (config && config.repoName) || 'Repository';

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

  let md = `# 🌐 Canonical Domain Entity Graph Report — ${repoName}\n\n`;
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
    md += `These entity identifiers are referenced in documentation or catalogs but lack formal spec files:\n\n`;
    md += `| Missing Entity ID | Expected Domain | Status |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const d of dangling.sort()) {
      const type = d.split('-')[0];
      md += `| **\`${d}\`** | ${type} | \`UNSCAFFOLDED_REFERENCE\` |\n`;
    }
  }

  md += `\n---\n\n*Generated automatically by \`scripts/generate-domain-graph.cjs\` (${repoName}).*\n`;
  return md;
}

// ─── CLI Execution ─────────────────────────────────────────────────────────────
function run(customRoot = null, customConfig = null, customOut = null) {
  const repoRoot = customRoot || path.resolve(__dirname, '..');
  const config = loadConfig(repoRoot, customConfig);

  console.log(`🚀 [Domain Graph] Scanning repository: ${config.repoName} at: ${repoRoot}`);
  const files = findSourceFiles(repoRoot, config);
  console.log(`   Found ${files.length} markdown and JSONL source files.`);

  const graph = buildGraph(files, config);
  const nodeCount = Object.keys(graph.nodes).length;
  console.log(`   Compiled ${nodeCount} entity nodes with ${graph.dangling.length} external references.`);

  const outDir = customOut
    ? (path.isAbsolute(customOut) ? customOut : path.resolve(repoRoot, customOut))
    : path.join(repoRoot, config.outputDir || 'graphify-out');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const report = generateMarkdownReport(graph, config);
  fs.writeFileSync(path.join(outDir, 'GRAPH_REPORT.md'), report, 'utf8');
  fs.writeFileSync(path.join(outDir, 'graph.json'), JSON.stringify(graph, null, 2), 'utf8');

  console.log(`✅ [Domain Graph] Generated:`);
  console.log(`   - ${path.relative(repoRoot, path.join(outDir, 'GRAPH_REPORT.md'))}`);
  console.log(`   - ${path.relative(repoRoot, path.join(outDir, 'graph.json'))}\n`);
  return graph;
}

// ─── Parse CLI Arguments if invoked directly ─────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  let cliRoot = null;
  let cliConfig = null;
  let cliOut = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root' && args[i + 1]) {
      cliRoot = path.resolve(process.cwd(), args[++i]);
    } else if (args[i] === '--config' && args[i + 1]) {
      cliConfig = args[++i];
    } else if (args[i] === '--out' && args[i + 1]) {
      cliOut = args[++i];
    }
  }

  run(cliRoot, cliConfig, cliOut);
}

module.exports = {
  CANONICAL_PREFIXES: DEFAULT_CANONICAL_PREFIXES,
  DEFAULT_CANONICAL_PREFIXES,
  loadConfig,
  parseFrontmatter,
  extractEntityLinks,
  findSourceFiles,
  buildGraph,
  generateMarkdownReport,
  run
};
