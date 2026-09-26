#!/usr/bin/env node
/**
 * verify-pipeline-contracts.cjs — SK-012 Phase 3: Anti-Performative Pipeline Contract Gate
 *
 * Problem this solves (INC-099):
 *   Client code stored Base64 image data directly in localStorage (Canvas ->
 *   toDataURL() -> localStorage.setItem), and a standalone HTML shell could
 *   silently drop the firestore-client.js <script> tag its own controller
 *   depends on -- both failures are invisible at review time: no test
 *   simulates an actual upload, and every dependent Firestore call is guarded
 *   by a `typeof window.fsX === 'function'` check that just silently no-ops
 *   when the script is missing.
 *
 * Checks:
 *   1. Base64-to-localStorage: flags a localStorage.setItem(...) call whose
 *      value argument contains a literal `data:image/...;base64,` prefix, or
 *      references a variable assigned from `.toDataURL(` earlier in the same
 *      file. Deliberately narrow -- does NOT flag ordinary JSON/string state
 *      (selections, view mode, approvals), only the Canvas -> Base64 ->
 *      localStorage mechanism INC-099 documented.
 *   2. Shell/fragment Firestore dependency parity: for each standalone shell
 *      (NOT the SPA fragments -- those are composed into index.html, which
 *      already loads firestore-client.js globally; that is correct, verified
 *      architecture, not a gap), if its controller calls a window-attached
 *      firestore-client.js function, the shell's own <script> tags must
 *      include firestore-client.js.
 *
 * Usage:
 *   node scripts/verify-pipeline-contracts.cjs
 *
 * Exit codes:
 *   0 — no violations
 *   1 — one or more violations found
 *   2 — script execution error
 *
 * Routing: .agent/PREFLIGHT.md row R6
 * Origin: docs/incidents/INC-099-mock-persistence-and-intake-preview-hierarchy-blind-spot.md
 * Ticket: enhancement-notes/SK-012 Phase 3 (AC-DEC-2026-056)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

// ─── Check 1: Base64 image data reaching localStorage ──────────────────────

const CONTROLLER_FILES_TO_SCAN = [
  'shopping_src/scripts/controller.js',
  'cockpit_src/scripts/controller.js',
  'public/js/modules/firestore-client.js',
  'js/modules/firestore-client.js',
];

function findLocalStorageBase64Violations(relPath, content) {
  const violations = [];
  if (!content) return violations;

  // Direct literal: localStorage.setItem(..., '...data:image/...;base64,...')
  // NOTE: must NOT exclude ";" from the capture — a data URI's own
  // "data:image/png;base64,..." contains a literal semicolon, so a naive
  // [^;]*? truncates before ever reaching the call's closing ")". Lazy
  // [\s\S]*? + backtracking correctly finds the real "');" statement end
  // even across nested parens (e.g. JSON.stringify(...)).
  const setItemCalls = [...content.matchAll(/localStorage\.setItem\(([\s\S]*?)\)\s*;/g)];
  for (const m of setItemCalls) {
    if (/data:image\/[a-zA-Z0-9.+-]+;base64,/.test(m[1])) {
      const line = content.slice(0, m.index).split('\n').length;
      violations.push({ line, kind: 'literal-data-uri', snippet: m[0].slice(0, 120).replace(/\s+/g, ' ') });
    }
  }

  // Indirect: a variable assigned from `.toDataURL(` is later passed into
  // localStorage.setItem(...) anywhere in the same file.
  const toDataUrlVars = [...content.matchAll(/(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*[^;]*\.toDataURL\(/g)]
    .map(m => m[1]);
  for (const varName of new Set(toDataUrlVars)) {
    const re = new RegExp(`localStorage\\.setItem\\([^)]*\\b${varName}\\b`);
    const m = content.match(re);
    if (m) {
      const line = content.slice(0, m.index).split('\n').length;
      violations.push({
        line,
        kind: 'todataurl-variable',
        snippet: `variable "${varName}" (assigned from .toDataURL()) reaches localStorage.setItem(...)`,
      });
    }
  }

  return violations.map(v => ({ ...v, file: relPath }));
}

// ─── Check 2: Standalone shell / firestore-client dependency parity ────────

const SHELL_CONTROLLER_PAIRS = [
  { shell: 'shopping-registry.html', controller: 'shopping_src/scripts/controller.js' },
  { shell: 'decorator-cockpit.html', controller: 'cockpit_src/scripts/controller.js' },
];

const FIRESTORE_CLIENT_SOURCE = 'public/js/modules/firestore-client.js';

// Minimal parser for `Object.assign(window, { name1, name2, alias: real, ... });`
// Avoids an AST dependency — the block is a flat, single-purpose export list.
function extractWindowAttachedNames(content) {
  if (!content) return [];
  const m = content.match(/Object\.assign\(window,\s*\{([\s\S]*?)\}\s*\)/);
  if (!m) return [];
  return m[1]
    .split(',')
    .map(s => s.split(':')[0].trim()) // tolerate `alias: realName` shorthand — keep the exposed key
    .filter(s => /^[A-Za-z0-9_$]+$/.test(s));
}

function checkShellDependencyParity() {
  const findings = [];
  const exposedNames = extractWindowAttachedNames(readFile(FIRESTORE_CLIENT_SOURCE));

  for (const { shell, controller } of SHELL_CONTROLLER_PAIRS) {
    const controllerContent = readFile(controller);
    const shellContent = readFile(shell);
    if (!controllerContent || !shellContent) continue;

    const callsFirestore = exposedNames.some(name =>
      new RegExp(`window\\.${name}\\s*\\(`).test(controllerContent)
    );
    if (!callsFirestore) continue; // this controller has no firestore-client.js dependency — nothing to check

    // Require an actual <script src="...firestore-client.js"> tag, not just
    // the bare substring anywhere in the file (a comment mentioning the file
    // would otherwise satisfy a naive check and mask a genuinely missing tag).
    if (!/<script[^>]*\ssrc="[^"]*firestore-client\.js"[^>]*>/.test(shellContent)) {
      findings.push({
        shell,
        controller,
        message:
          `${controller} calls window.<firestore-client function>(...) but ${shell} does not ` +
          `<script>-include firestore-client.js — every guarded call will silently no-op.`,
      });
    }
  }

  return findings;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function run() {
  try {
    let violations = [];
    for (const relPath of CONTROLLER_FILES_TO_SCAN) {
      violations = violations.concat(findLocalStorageBase64Violations(relPath, readFile(relPath)));
    }
    const parityFindings = checkShellDependencyParity();
    const total = violations.length + parityFindings.length;

    if (total === 0) {
      console.log('\n🟢 verify-pipeline-contracts: no Base64/localStorage or shell-dependency violations found.\n');
      return 0;
    }

    console.log(`\n🔍 Pipeline Contract Audit — ${total} violation(s)\n`);

    for (const v of violations) {
      console.log(`🔴 BASE64-IN-LOCALSTORAGE — ${v.file}:${v.line} (${v.kind})`);
      console.log(`   ${v.snippet}`);
      console.log(`   💡 Fix: route this media through the cloud upload pipeline (window.fsUploadLookPhoto), never localStorage.\n`);
    }

    for (const f of parityFindings) {
      console.log(`🔴 SHELL-DEPENDENCY-GAP — ${f.shell}`);
      console.log(`   ${f.message}`);
      console.log(`   💡 Fix: add <script type="module" src=".../firestore-client.js"></script> to ${f.shell}.\n`);
    }

    console.log(`🛑 ${total} violation(s). See docs/incidents/INC-099-*.md for the failure mode this gate exists to catch.`);
    console.log(`   Routing: .agent/PREFLIGHT.md row R6\n`);
    return 1;
  } catch (err) {
    console.error(`\n❌ verify-pipeline-contracts error: ${err.message}\n`);
    return 2;
  }
}

process.exit(run());
