#!/usr/bin/env node
/**
 * hook-pipeline-contracts-check.cjs — SK-012 Phase 4c: real-time PostToolUse gate
 *
 * Wired as a Claude Code PostToolUse hook (see .claude/settings.local.json,
 * matcher "Edit|Write", filtered to *.js via the hook's own `if` clause).
 * Runs the same Check-1 logic as `scripts/verify-pipeline-contracts.cjs`
 * (Base64 image data reaching localStorage) against ONLY the single file
 * that was just written, immediately after the write — instead of only
 * catching it when someone remembers to run the full npm script before
 * commit.
 *
 * Reads the standard Claude Code hook stdin JSON:
 *   { "tool_name": "Write"|"Edit", "tool_input": { "file_path": "..." }, ... }
 * On a violation, prints a JSON hook-output object with `decision: "block"`
 * and a `reason` — Claude Code feeds this back into the same turn so the
 * agent can self-correct without waiting for a separate verification pass.
 *
 * Origin: docs/incidents/INC-099-mock-persistence-and-intake-preview-hierarchy-blind-spot.md
 * Ticket: enhancement-notes/SK-012 Phase 4c (AC-DEC-2026-056)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { findLocalStorageBase64Violations } = require('./verify-pipeline-contracts.cjs');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const raw = readStdin();
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // no parseable input — nothing to check, fail open
  }

  const filePath = input?.tool_input?.file_path || input?.tool_response?.filePath;
  if (!filePath) process.exit(0);

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    process.exit(0); // file gone or unreadable — nothing to check
  }

  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const violations = findLocalStorageBase64Violations(relPath, content);
  if (violations.length === 0) process.exit(0);

  const lines = violations.map(v => `  Line ${v.line} (${v.kind}): ${v.snippet}`).join('\n');
  const reason =
    `verify-pipeline-contracts: Base64 image data reaching localStorage in ${relPath} ` +
    `(caught immediately by the SK-012 Phase 4c PostToolUse hook, not just at commit time):\n${lines}\n` +
    `Route this through the cloud upload pipeline (window.fsUploadLookPhoto), never localStorage. ` +
    `See docs/incidents/INC-099-*.md.`;

  console.log(JSON.stringify({
    decision: 'block',
    reason,
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: reason,
    },
  }));
  process.exit(0);
}

main();
