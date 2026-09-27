#!/usr/bin/env node
/**
 * scripts/verify-taxonomy-vocabulary.cjs — Scoped Taxonomy & Canonical Vocabulary Linter
 *
 * Part of SK-019 (STD-UNIVERSAL-TAXONOMY-001 / INV-SAP-DUAL-BLOCK-001 / PKG-006 / AC-DEC-2026-063)
 * SSOT: DOCS_HUB.md & .agent/patterns/universal-repository-taxonomy-and-discovery-graph.md
 *
 * Enforces canonical cross-repo and repo-specific terminology on SSOTs, PRDs, and architecture notes.
 * Strictly excludes raw user discussion threads (User_Created/) per Council Dissenter ruling.
 *
 * Usage:
 *   node scripts/verify-taxonomy-vocabulary.cjs [--shared-only] [--target <path>] [--root <repoPath>]
 */
'use strict';

const fs = require('fs');
const path = require('path');

// ─── Markdown Sanitizer ───────────────────────────────────────────────────────
function sanitizeMarkdown(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    // Strip fenced code blocks preserving line breaks
    .replace(/```[\s\S]*?```/g, match => match.replace(/[^\r\n]/g, ' '))
    // Strip inline code spans
    .replace(/`[^`\r\n]+`/g, match => ' '.repeat(match.length))
    // Strip link URLs, keep anchor text: [Anchor](url) -> Anchor
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Strip HTML comments preserving line breaks
    .replace(/<!--[\s\S]*?-->/g, match => match.replace(/[^\r\n]/g, ' '));
}

// ─── Compile Taxonomy Rules ───────────────────────────────────────────────────
function compileRules(options = {}) {
  const { sharedOnly = false, dictionaryPath } = options;
  const dictFile = dictionaryPath || path.resolve(__dirname, '../.agent/taxonomy_dictionary.cjs');

  let dict;
  try {
    dict = require(dictFile);
  } catch (err) {
    throw new Error(`Failed to load taxonomy dictionary from ${dictFile}: ${err.message}`);
  }

  const rules = [];

  function addItems(items) {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (!item.preferred || !Array.isArray(item.prohibited)) continue;
      for (const prohibited of item.prohibited) {
        // Escape special regex chars
        const escaped = prohibited.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Word boundary matching, case-insensitive, stateless (no 'g' flag for test())
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        rules.push({
          preferred: item.preferred,
          prohibited,
          category: item.category || 'general',
          regex
        });
      }
    }
  }

  // Add shared terms
  if (dict.shared) {
    for (const group of Object.values(dict.shared)) {
      addItems(group);
    }
  }

  // Add repo-specific terms unless sharedOnly is true
  if (!sharedOnly && dict.repo_specific) {
    for (const group of Object.values(dict.repo_specific)) {
      addItems(group);
    }
  }

  return rules;
}

// ─── Lint Single Text Buffer ──────────────────────────────────────────────────
function lintText(text, rules) {
  const sanitized = sanitizeMarkdown(text);
  const lines = sanitized.split(/\r?\n/);
  const violations = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (const rule of rules) {
      if (rule.regex.test(line)) {
        violations.push({
          line: lineIdx + 1,
          prohibited: rule.prohibited,
          preferred: rule.preferred,
          category: rule.category
        });
        // Reset regex state after test
        rule.regex.lastIndex = 0;
      }
    }
  }

  return violations;
}

// ─── Discover Target Files ────────────────────────────────────────────────────
function discoverTargetFiles(repoRoot, customTarget) {
  if (customTarget) {
    const fullTarget = path.isAbsolute(customTarget) ? customTarget : path.join(repoRoot, customTarget);
    if (!fs.existsSync(fullTarget)) return [];
    if (fs.statSync(fullTarget).isFile()) {
      return [fullTarget];
    }
    repoRoot = fullTarget;
  }

  // Default target directories for canonical SSOTs
  const scanDirs = ['docs', '00_GOVERNANCE', 'enhancement-notes', '01_TIMELINE_EVENTS', '02_RITUALS_CULTURE'];
  const excludedDirs = new Set(['User_Created', 'node_modules', '.git', 'scratch', 'graphify-out', 'public', 'assets', 'incidents']);
  const files = [];

  function walk(current) {
    if (!fs.existsSync(current)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (excludedDirs.has(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(full);
      }
    }
  }

  if (customTarget && fs.statSync(fullTarget).isDirectory()) {
    walk(fullTarget);
  } else {
    for (const dir of scanDirs) {
      walk(path.join(repoRoot, dir));
    }
    // Also root markdown files
    const rootCandidates = ['ARCHITECTURE_SPEC.md', 'DOCS_HUB.md', 'README.md', 'ENHANCEMENT-MASTER-REGISTRY.md'];
    for (const rc of rootCandidates) {
      const full = path.join(repoRoot, rc);
      if (fs.existsSync(full)) files.push(full);
    }
  }

  return files;
}

// ─── CLI Execution ─────────────────────────────────────────────────────────────
function run() {
  const args = process.argv.slice(2);
  const sharedOnly = args.includes('--shared-only');
  let targetArg = null;
  let rootArg = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && args[i + 1]) targetArg = args[i + 1];
    if (args[i] === '--root' && args[i + 1]) rootArg = args[i + 1];
  }

  const repoRoot = rootArg ? path.resolve(rootArg) : path.resolve(__dirname, '..');
  console.log(`🔍 [Taxonomy Linter] Checking vocabulary standards (Mode: ${sharedOnly ? 'SHARED-ONLY' : 'ALL'})...`);

  const rules = compileRules({ sharedOnly, dictionaryPath: path.join(repoRoot, '.agent/taxonomy_dictionary.cjs') });
  const files = discoverTargetFiles(repoRoot, targetArg);
  console.log(`   Scanning ${files.length} canonical documentation files...`);

  let totalViolations = 0;
  for (const file of files) {
    const relPath = path.relative(repoRoot, file).replace(/\\/g, '/');
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (_) {
      continue;
    }

    const violations = lintText(content, rules);
    if (violations.length > 0) {
      console.log(`\n❌ ${relPath}:`);
      for (const v of violations) {
        console.log(`   Line ${v.line}: Found prohibited term "${v.prohibited}" ⟶ Replace with "${v.preferred}" (${v.category})`);
      }
      totalViolations += violations.length;
    }
  }

  console.log('\n==========================================================');
  if (totalViolations === 0) {
    console.log(`✅ [Taxonomy Linter] 100% CLEAN: 0 prohibited synonyms found across ${files.length} files.`);
    console.log('==========================================================\n');
    process.exit(0);
  } else {
    console.error(`❌ [Taxonomy Linter] FAILED: ${totalViolations} prohibited synonym violations found.`);
    console.log('==========================================================\n');
    process.exit(1);
  }
}

if (require.main === module) {
  run();
}

module.exports = {
  sanitizeMarkdown,
  compileRules,
  lintText,
  discoverTargetFiles,
  run
};
