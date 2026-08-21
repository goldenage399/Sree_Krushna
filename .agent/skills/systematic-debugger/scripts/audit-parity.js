#!/usr/bin/env node
/**
 * ============================================================
 * audit-parity.js — Mechanical Refactor Parity Auditor
 * ============================================================
 * Zero-dependency AST & balanced-brace tokenizer to extract and
 * compare function definitions between git baselines, monolithic
 * files, and modular target files.
 *
 * Usage:
 *   node audit-parity.js --ref-git "3ab3902:path/to/dashboard.html" --html-script-idx 1 --target-files "file1.js,file2.js"
 *   node audit-parity.js --ref-file "old.js" --target-files "new1.js,new2.js" --diff "applyZoom"
 *   node audit-parity.js --ref-file "old.js" --target-files "new1.js" --json
 *   node audit-parity.js --ref-file "old.js" --target-files "new1.js" --strict
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

function parseArgs(args) {
  const options = {
    refGit: null,
    refFile: null,
    targetFiles: [],
    targetGit: null,
    htmlScriptIdx: null,
    diffFn: null,
    json: false,
    strict: false,
    ignoreWhitespace: true,
    cwd: process.cwd()
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--ref-git' && i + 1 < args.length) options.refGit = args[++i];
    else if (arg === '--ref-file' && i + 1 < args.length) options.refFile = args[++i];
    else if (arg === '--target-files' && i + 1 < args.length) {
      options.targetFiles = args[++i].split(',').map(s => s.trim()).filter(Boolean);
    }
    else if (arg === '--target-git' && i + 1 < args.length) options.targetGit = args[++i];
    else if (arg === '--html-script-idx' && i + 1 < args.length) {
      const v = args[++i];
      options.htmlScriptIdx = v === 'all' ? 'all' : parseInt(v, 10);
    }
    else if (arg === '--diff' && i + 1 < args.length) options.diffFn = args[++i];
    else if (arg === '--json') options.json = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--no-ignore-whitespace') options.ignoreWhitespace = false;
    else if (arg === '--cwd' && i + 1 < args.length) options.cwd = args[++i];
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
${colors.bright}Mechanical Refactor Parity Auditor (audit-parity.js)${colors.reset}

${colors.yellow}Usage:${colors.reset}
  node audit-parity.js [options]

${colors.yellow}Options:${colors.reset}
  --ref-git <commit:path>     Baseline file from a git commit
  --ref-file <path>           Baseline file from local filesystem
  --target-files <f1,f2,...>  Comma-separated list of target files
  --target-git <commit:path>  Target file from a git commit
  --html-script-idx <n|all>   Extract <script> tag (0-indexed, or 'all') from HTML
  --diff <functionName>       Show detailed line diff for a specific function
  --json                      Output machine-readable JSON
  --strict                    Exit with code 1 if any differences or missing functions
  --no-ignore-whitespace      Perform strict character-for-character whitespace diffing
  --cwd <path>                Working directory for git operations
  --help, -h                  Show this help message
`);
}

function getFileContent(source, cwd, isGit) {
  if (isGit) {
    try {
      return execSync(`git show "${source}"`, {
        cwd,
        encoding: 'utf8',
        maxBuffer: 20 * 1024 * 1024
      });
    } catch (err) {
      throw new Error(`Failed to read git object "${source}": ${err.message}`);
    }
  } else {
    const resolved = path.isAbsolute(source) ? source : path.resolve(cwd, source);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Local file not found: "${resolved}"`);
    }
    return fs.readFileSync(resolved, 'utf8');
  }
}

function extractScriptTags(html, idx) {
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const scripts = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  if (scripts.length === 0) return html; // fallback if no <script> tags
  if (idx === 'all' || idx === null || idx === undefined) {
    return scripts.join('\n\n');
  }
  if (typeof idx === 'number') {
    if (idx >= 0 && idx < scripts.length) {
      return scripts[idx];
    }
    throw new Error(`Requested <script> index ${idx}, but file only has ${scripts.length} script tags`);
  }
  return scripts.join('\n\n');
}

/**
 * Token-safe balanced-brace JavaScript function extractor.
 * Handles:
 *   - function foo(...) { ... }
 *   - async function foo(...) { ... }
 *   - const/let/var foo = function(...) { ... }
 *   - const/let/var foo = (args) => { ... }
 *   - const/let/var foo = async (args) => { ... }
 */
function extractFunctions(src) {
  const map = {};
  if (!src || typeof src !== 'string') return map;

  const fnPatterns = [
    // function foo(...) {
    /\b(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)\s*\(/g,
    // const foo = (async)? (...) => { or const foo = (async)? function(...) {
    /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\s*\(|\([^)]*\)\s*=>|[a-zA-Z_$][\w$]*\s*=>)\s*\{/g
  ];

  for (const pattern of fnPatterns) {
    let match;
    while ((match = pattern.exec(src)) !== null) {
      const name = match[1];
      const matchStart = match.index;
      
      // Find opening brace '{'
      let openBraceIdx = src.indexOf('{', matchStart);
      if (openBraceIdx === -1) continue;

      // Extract body with quote & comment safety
      let depth = 0;
      let inSingleQuote = false;
      let inDoubleQuote = false;
      let inTemplate = false;
      let inLineComment = false;
      let inBlockComment = false;
      let inRegex = false;
      let endIdx = -1;

      for (let i = openBraceIdx; i < src.length; i++) {
        const ch = src[i];
        const prev = i > 0 ? src[i - 1] : '';
        const next = i + 1 < src.length ? src[i + 1] : '';

        // Handle escape characters
        if (prev === '\\' && (inSingleQuote || inDoubleQuote || inTemplate || inRegex)) {
          continue;
        }

        // Line comments
        if (inLineComment) {
          if (ch === '\n') inLineComment = false;
          continue;
        }

        // Block comments
        if (inBlockComment) {
          if (ch === '*' && next === '/') {
            inBlockComment = false;
            i++;
          }
          continue;
        }

        // String literals
        if (inSingleQuote) {
          if (ch === "'") inSingleQuote = false;
          continue;
        }
        if (inDoubleQuote) {
          if (ch === '"') inDoubleQuote = false;
          continue;
        }
        if (inTemplate) {
          if (ch === '`') inTemplate = false;
          continue;
        }

        // Check start of comments
        if (ch === '/' && next === '/') {
          inLineComment = true;
          i++;
          continue;
        }
        if (ch === '/' && next === '*') {
          inBlockComment = true;
          i++;
          continue;
        }

        // Check start of strings
        if (ch === "'") { inSingleQuote = true; continue; }
        if (ch === '"') { inDoubleQuote = true; continue; }
        if (ch === '`') { inTemplate = true; continue; }

        // Track braces
        if (ch === '{') {
          depth++;
        } else if (ch === '}') {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }

      if (endIdx !== -1) {
        map[name] = src.slice(matchStart, endIdx + 1);
      }
    }
  }

  return map;
}

function normalizeCode(code) {
  if (!code) return '';
  return code.replace(/\s+/g, ' ').trim();
}

function generateLineDiff(fnName, refCode, curCode) {
  const refLines = (refCode || '').split('\n');
  const curLines = (curCode || '').split('\n');

  let output = `\n${colors.bright}${colors.cyan}=== Function Diff: ${fnName} ===${colors.reset}\n`;
  output += `${colors.dim}Baseline Lines: ${refLines.length} | Target Lines: ${curLines.length}${colors.reset}\n\n`;

  const maxLen = Math.max(refLines.length, curLines.length);
  for (let i = 0; i < maxLen; i++) {
    const rLine = refLines[i];
    const cLine = curLines[i];

    if (rLine === undefined) {
      output += `${colors.green}+ ${(i + 1).toString().padStart(4)}: ${cLine}${colors.reset}\n`;
    } else if (cLine === undefined) {
      output += `${colors.red}- ${(i + 1).toString().padStart(4)}: ${rLine}${colors.reset}\n`;
    } else if (rLine.trim() !== cLine.trim()) {
      output += `${colors.red}- ${(i + 1).toString().padStart(4)}: ${rLine}${colors.reset}\n`;
      output += `${colors.green}+ ${(i + 1).toString().padStart(4)}: ${cLine}${colors.reset}\n`;
    } else {
      output += `${colors.gray}  ${(i + 1).toString().padStart(4)}: ${rLine}${colors.reset}\n`;
    }
  }

  return output;
}

function runAudit(opts) {
  // 1. Fetch reference code
  let refRaw = '';
  if (opts.refGit) {
    refRaw = getFileContent(opts.refGit, opts.cwd, true);
  } else if (opts.refFile) {
    refRaw = getFileContent(opts.refFile, opts.cwd, false);
  } else {
    throw new Error('Either --ref-git or --ref-file must be specified.');
  }

  const refIsHtml = (opts.refGit || opts.refFile || '').endsWith('.html');
  const refSrc = refIsHtml ? extractScriptTags(refRaw, opts.htmlScriptIdx) : refRaw;

  // 2. Fetch target code
  let targetSrc = '';
  if (opts.targetGit) {
    const tRaw = getFileContent(opts.targetGit, opts.cwd, true);
    const tIsHtml = opts.targetGit.endsWith('.html');
    targetSrc += (tIsHtml ? extractScriptTags(tRaw, opts.htmlScriptIdx) : tRaw) + '\n';
  }

  for (const tFile of opts.targetFiles) {
    const tRaw = getFileContent(tFile, opts.cwd, false);
    const tIsHtml = tFile.endsWith('.html');
    targetSrc += (tIsHtml ? extractScriptTags(tRaw, opts.htmlScriptIdx) : tRaw) + '\n';
  }

  if (!targetSrc.trim()) {
    throw new Error('Target source is empty. Specify --target-files or --target-git.');
  }

  // 3. Extract functions
  const refFns = extractFunctions(refSrc);
  const curFns = extractFunctions(targetSrc);

  const results = [];
  const refNames = new Set(Object.keys(refFns));
  const curNames = new Set(Object.keys(curFns));

  // Check all baseline functions
  for (const name of refNames) {
    const r = refFns[name];
    const c = curFns[name];

    if (!c) {
      results.push({
        name,
        status: 'MISSING',
        refLen: r.length,
        curLen: 0,
        diffBytes: r.length,
        refLines: r.split('\n').length,
        curLines: 0
      });
      continue;
    }

    const rn = opts.ignoreWhitespace ? normalizeCode(r) : r;
    const cn = opts.ignoreWhitespace ? normalizeCode(c) : c;

    if (rn !== cn) {
      results.push({
        name,
        status: 'CHANGED',
        refLen: r.length,
        curLen: c.length,
        diffBytes: Math.abs(r.length - c.length),
        refLines: r.split('\n').length,
        curLines: c.split('\n').length
      });
    } else {
      results.push({
        name,
        status: 'IDENTICAL',
        refLen: r.length,
        curLen: c.length,
        diffBytes: 0,
        refLines: r.split('\n').length,
        curLines: c.split('\n').length
      });
    }
  }

  // Check for newly added functions
  for (const name of curNames) {
    if (!refNames.has(name)) {
      const c = curFns[name];
      results.push({
        name,
        status: 'ADDED',
        refLen: 0,
        curLen: c.length,
        diffBytes: c.length,
        refLines: 0,
        curLines: c.split('\n').length
      });
    }
  }

  // Sort: MISSING first, then CHANGED (by diff size desc), then ADDED, then IDENTICAL
  const statusWeight = { MISSING: 0, CHANGED: 1, ADDED: 2, IDENTICAL: 3 };
  results.sort((a, b) => {
    if (statusWeight[a.status] !== statusWeight[b.status]) {
      return statusWeight[a.status] - statusWeight[b.status];
    }
    return (b.diffBytes || 0) - (a.diffBytes || 0);
  });

  // Handle single function diff inspection
  if (opts.diffFn) {
    const fnName = opts.diffFn;
    const r = refFns[fnName];
    const c = curFns[fnName];
    if (!r && !c) {
      console.error(`${colors.red}Error: Function "${fnName}" not found in baseline or target.${colors.reset}`);
      process.exit(1);
    }
    console.log(generateLineDiff(fnName, r, c));
    return;
  }

  // Output formatting
  const missingCount = results.filter(r => r.status === 'MISSING').length;
  const changedCount = results.filter(r => r.status === 'CHANGED').length;
  const addedCount = results.filter(r => r.status === 'ADDED').length;
  const identicalCount = results.filter(r => r.status === 'IDENTICAL').length;
  const totalRef = Object.keys(refFns).length;

  if (opts.json) {
    const output = {
      summary: {
        totalBaselineFunctions: totalRef,
        totalTargetFunctions: Object.keys(curFns).length,
        missing: missingCount,
        changed: changedCount,
        added: addedCount,
        identical: identicalCount,
        hasDiscrepancies: (missingCount > 0 || changedCount > 0)
      },
      results
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(`\n${colors.bright}=== Mechanical Refactor Parity Audit ===${colors.reset}`);
    console.log(`${colors.dim}Baseline: ${opts.refGit || opts.refFile}${colors.reset}`);
    console.log(`${colors.dim}Targets:  ${opts.targetFiles.join(', ') || opts.targetGit}${colors.reset}\n`);

    console.log(`${colors.white}Total Baseline Functions:${colors.reset} ${colors.bright}${totalRef}${colors.reset}`);
    console.log(`  - ${colors.green}Identical:${colors.reset} ${identicalCount}`);
    console.log(`  - ${colors.yellow}Changed:${colors.reset}   ${changedCount}`);
    console.log(`  - ${colors.red}Missing:${colors.reset}   ${missingCount}`);
    console.log(`  - ${colors.cyan}Added:${colors.reset}     ${addedCount}\n`);

    const nonIdentical = results.filter(r => r.status !== 'IDENTICAL');
    if (nonIdentical.length > 0) {
      console.log(`${colors.bright}${'STATUS'.padEnd(10)} ${'FUNCTION NAME'.padEnd(30)} ${'REF LEN'.padEnd(10)} ${'CUR LEN'.padEnd(10)} ${'DIFF BYTES'.padEnd(12)}${colors.reset}`);
      console.log('-'.repeat(74));

      for (const r of nonIdentical) {
        let statusColor = colors.white;
        if (r.status === 'MISSING') statusColor = colors.red;
        else if (r.status === 'CHANGED') statusColor = colors.yellow;
        else if (r.status === 'ADDED') statusColor = colors.cyan;

        console.log(
          `${statusColor}${r.status.padEnd(10)}${colors.reset} ` +
          `${colors.bright}${r.name.padEnd(30)}${colors.reset} ` +
          `${(r.refLen ? r.refLen.toString() : '-').padEnd(10)} ` +
          `${(r.curLen ? r.curLen.toString() : '-').padEnd(10)} ` +
          `${r.diffBytes.toString().padEnd(12)}`
        );
      }
      console.log('');
    } else {
      console.log(`${colors.green}${colors.bright}[PASS] 100% Function parity achieved across all targets.${colors.reset}\n`);
    }
  }

  if (opts.strict && (missingCount > 0 || changedCount > 0)) {
    process.exit(1);
  }
}

// CLI Execution Entry Point
if (require.main === module) {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (!opts.refGit && !opts.refFile) {
      printHelp();
      process.exit(1);
    }
    runAudit(opts);
  } catch (err) {
    console.error(`\n${colors.red}${colors.bright}[ERROR]${colors.reset} ${err.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  extractFunctions,
  normalizeCode,
  extractScriptTags,
  runAudit
};
