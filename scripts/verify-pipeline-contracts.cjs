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
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ALL_MODE = process.argv.includes('--all');

function readFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

// New (untracked or added) files only, by default — matches the convention
// verify-governance-wiring.cjs already uses: checking the FULL history
// against a rule added today would retroactively flag pre-existing debt
// (e.g. SK-011's own implementation_plan.md predates INV-DATA-TRANSIT-001,
// and AC-DEC-2026-035 predates INV-COUNCIL-GROUND-TRUTH-001 — it IS the
// incident that motivated the rule). --all scans everything, for audits.
function getNewOrChangedFiles(predicate) {
  if (ALL_MODE) return null; // caller does its own full-tree walk in --all mode
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
    return status.split('\n')
      .filter(Boolean)
      .filter(l => /^(\?\?|A\s|AM|\s?A|\s?M|MM)/.test(l))
      .map(l => l.slice(3).trim().replace(/^"|"$/g, '').replace(/\\/g, '/'))
      .filter(predicate);
  } catch {
    return [];
  }
}

// Flat directory of .md files (e.g. Council discussion threads).
function getFilesInDir(underDir, predicate) {
  const changed = getNewOrChangedFiles(f => f.startsWith(underDir.replace(/\\/g, '/')) && predicate(f));
  if (changed !== null) return changed;
  const abs = path.join(ROOT, underDir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter(predicate).map(f => path.join(underDir, f).replace(/\\/g, '/'));
}

// One level of ticket subdirectories (enhancement-notes/SK-###/implementation_plan.md).
//
// NOTE: git collapses a wholly-NEW untracked directory to a single
// "?? enhancement-notes/SK-999/" entry (no filename) rather than listing the
// file inside it — the most common case in practice, since a new ticket's
// plan usually arrives together with its brand-new folder. A plain filename
// regex against git-status lines misses this entirely (verified: caught by
// a synthetic new-ticket test that silently passed until this fix). Expand
// any matching collapsed directory entry by checking the known filename on
// disk, without resorting to `git status -uall` (expensive on large repos).
function getAllPlanFiles() {
  const changed = getNewOrChangedFiles(f =>
    /^enhancement-notes\/[^/]+\/(implementation_plan\.md)?$/.test(f)
  );
  if (changed !== null) {
    return changed
      .map(f => f.endsWith('/') ? `${f}implementation_plan.md` : f)
      .filter(rel => fs.existsSync(path.join(ROOT, rel)));
  }
  const notesDir = path.join(ROOT, 'enhancement-notes');
  if (!fs.existsSync(notesDir)) return [];
  return fs.readdirSync(notesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => `enhancement-notes/${d.name}/implementation_plan.md`)
    .filter(rel => fs.existsSync(path.join(ROOT, rel)));
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

// ─── Check 3: Plan header contract (`INV-DATA-TRANSIT-001`, SK-012 Phase 4a) ──
//
// Scoped to the plan's HEADER section only (up to the first "---"), not the
// whole document body — a plan can legitimately *discuss* INC-099/photo/
// upload context in its Task descriptions without itself being an intake
// feature plan (SK-012's own implementation_plan.md does exactly this).
// Checking the whole body would false-positive on every plan that so much
// as mentions the incident this rule is named after.

const PLAN_HEADER_INTAKE_KEYWORDS = /\b(upload|photo|image|intake|media attachment|camera capture)\b/i;
const PLAN_HEADER_REQUIRED_FIELDS = ['Storage Target', 'Multi-Device Transit', 'Client-Storage Prohibition'];

function extractPlanHeader(content) {
  const idx = content.indexOf('\n---');
  return idx === -1 ? content : content.slice(0, idx);
}

function checkPlanHeaderContracts() {
  const findings = [];
  for (const relPath of getAllPlanFiles()) {
    const content = readFile(relPath);
    if (!content) continue;
    const header = extractPlanHeader(content);
    if (!PLAN_HEADER_INTAKE_KEYWORDS.test(header)) continue; // not an intake-touching plan — out of scope

    const missing = PLAN_HEADER_REQUIRED_FIELDS.filter(f => !header.includes(f));
    if (missing.length > 0) {
      findings.push({
        file: relPath,
        message: `Plan header matches the intake/media keyword heuristic but is missing required field(s): ${missing.join(', ')}.`,
      });
    }
  }
  return findings;
}

// ─── Check 4: Council decision gate (`INV-COUNCIL-GROUND-TRUTH-001`, Phase 4b) ─
//
// Heuristic, not precise — runs as a WARNING (never fails the build) since a
// false positive here would block a legitimate council ratification. Only
// scans new/changed council artifacts (see getFilesInDir), never the full
// historical corpus by default: AC-DEC-2026-035 itself (the incident that
// motivated this rule) is full of gap language with no "BLOCKED"/"SCOPE CUT"
// decision, because it predates the rule — retroactively flagging history
// would just be noise, not a real finding.

const COUNCIL_GAP_PHRASES = /\b(unbacked|does not (currently )?sync|not yet implemented|open gap|not physically (backed|persisted)|no physical (store|persistence)|not persisted|mocked?)\b/i;
const COUNCIL_BLOCKING_DECISION = /(BLOCKED\s*\(PENDING_PIPELINE\)|APPROVED WITH SCOPE CUT)/;

function checkCouncilDecisionGate() {
  const findings = [];
  const councilDir = 'User_Created/Discussion Threads/Council';
  const files = getFilesInDir(councilDir, f => f.endsWith('.md') && !f.endsWith('Council_Ledger.md'));

  for (const relPath of files) {
    const content = readFile(relPath);
    if (!content) continue;
    if (!COUNCIL_GAP_PHRASES.test(content)) continue;
    if (!COUNCIL_BLOCKING_DECISION.test(content)) {
      findings.push({
        file: relPath,
        message:
          `Mentions a possible unbacked/mocked data-transit gap but its Decision section does not contain ` +
          `"BLOCKED (PENDING_PIPELINE)" or "APPROVED WITH SCOPE CUT" — verify manually (INV-COUNCIL-GROUND-TRUTH-001, heuristic).`,
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
    const planHeaderFindings = checkPlanHeaderContracts();
    const councilWarnings = checkCouncilDecisionGate(); // never blocks — heuristic, warning-only

    const blockingTotal = violations.length + parityFindings.length + planHeaderFindings.length;
    const total = blockingTotal + councilWarnings.length;

    if (total === 0) {
      console.log('\n🟢 verify-pipeline-contracts: no violations found.\n');
      return 0;
    }

    console.log(`\n🔍 Pipeline Contract Audit — ${blockingTotal} violation(s), ${councilWarnings.length} warning(s)\n`);

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

    for (const p of planHeaderFindings) {
      console.log(`🔴 PLAN-HEADER-GAP — ${p.file}`);
      console.log(`   ${p.message}`);
      console.log(`   💡 Fix: add the missing field(s) to the plan's header block (see writing-plans/SKILL.md §2).\n`);
    }

    for (const c of councilWarnings) {
      console.log(`🟡 COUNCIL-DECISION-GAP (warning) — ${c.file}`);
      console.log(`   ${c.message}\n`);
    }

    if (blockingTotal > 0) {
      console.log(`🛑 ${blockingTotal} violation(s). See docs/incidents/INC-099-*.md for the failure mode this gate exists to catch.`);
      console.log(`   Routing: .agent/PREFLIGHT.md row R6\n`);
      return 1;
    }
    return 0; // only warnings — do not block
  } catch (err) {
    console.error(`\n❌ verify-pipeline-contracts error: ${err.message}\n`);
    return 2;
  }
}

// SK-012 Phase 4c reuses findLocalStorageBase64Violations() from a PostToolUse
// hook (scripts/hook-pipeline-contracts-check.cjs) to check a single
// just-written file, rather than re-scanning the whole repo. Guard the CLI
// exit so `require()`-ing this file for that function doesn't also run the
// full multi-file audit.
if (require.main === module) {
  process.exit(run());
} else {
  module.exports = { findLocalStorageBase64Violations };
}
