#!/usr/bin/env node
/**
 * check-html-balance.cjs — SDCA Source-Level Tag-Balance Validator
 *
 * SCOPE: Gap Variant A only — validates that all block-level HTML tags in a
 * component file are correctly opened and closed (balanced pairs).
 * This does NOT validate DOM nesting hierarchy or runtime selector contracts
 * (Gap Variant B → Phase 2, Gap Variant C → Phase 3).
 * See: STD-STRUCTURAL-CONTRACT-001 / SK-028 / AC-DEC-2026-070
 *
 * Usage: node scripts/check-html-balance.cjs <path/to/file.html>
 * Exit:  0 = balanced, 1 = unbalanced (with error details on stdout)
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node check-html-balance.cjs <path/to/file.html>');
  process.exit(1);
}

const absPath = path.resolve(filePath);
if (!fs.existsSync(absPath)) {
  console.error(`File not found: ${absPath}`);
  process.exit(1);
}

// Void / self-closing elements — never push onto stack
const VOID = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr'
]);

const content = fs.readFileSync(absPath, 'utf8');
const lines   = content.split(/\r?\n/);

// Build a flat list of (tag, isClose, lineNo) from the source
const TAG_RE = /<(\/?[a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?\s*\/?>/g;
const stack  = [];
const errors = [];

for (let li = 0; li < lines.length; li++) {
  const line = lines[li];
  let m;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(line)) !== null) {
    const raw     = m[1];
    const isClose = raw.startsWith('/');
    const tag     = (isClose ? raw.slice(1) : raw).toLowerCase();

    if (VOID.has(tag)) continue; // self-closing — skip

    if (isClose) {
      if (stack.length === 0) {
        errors.push(`Line ${li + 1}: Unexpected closing </${tag}> with empty stack`);
      } else if (stack[stack.length - 1].tag !== tag) {
        const expected = stack[stack.length - 1];
        errors.push(
          `Line ${li + 1}: Mismatched </${tag}> — expected </${expected.tag}> ` +
          `(opened at line ${expected.line})`
        );
        // Pop anyway to keep recovering
        stack.pop();
      } else {
        stack.pop();
      }
    } else {
      stack.push({ tag, line: li + 1 });
    }
  }
}

// Anything left on the stack = unclosed tags
for (const entry of stack) {
  errors.push(`Line ${entry.line}: Unclosed <${entry.tag}> (never closed)`);
}

if (errors.length > 0) {
  console.error(`[TAG-BALANCE FAIL] ${path.relative(process.cwd(), absPath)}`);
  errors.forEach(e => console.error(`  ✗ ${e}`));
  process.exit(1);
}

// Silent exit 0 when called from verify-modular-architecture loop
process.exit(0);
