---
pattern: task-close-gate
origin_cap: CAP-044
tier: universal
applies_to:
  - "Any agentic AI development environment"
  - "Projects with validators and compiled/generated outputs"
  - "Multi-artifact documentation systems"
prereqs:
  - "Node.js (or any script runtime)"
  - "At least one validator script"
  - "At least one compile/build step that produces output files"
porting_effort: low
canonical_source: scripts/agent-task-close-check.js
last_reviewed: 2026-04-29
description: "Single-command agent task gate: runs all validators + output freshness checks, exits non-zero on any failure."
---

# Task Close Gate

## Problem

In agent-driven development, a task is declared "done" when the code works. But codebases with validators, compiled outputs, and documentation artifact chains have a broader definition of done. An agent that closes a task without running validators or regenerating compiled outputs leaves hidden debt:

- Coverage validators not run → new action silently uncovered
- Compiled output stale → docs delivered to users are out of date
- Schema validator not run → schema drift not caught until next session

The gap is structural: the agent knows the checks exist, but there is no single forcing function that requires them before close-out. The checks are each individually optional.

## Solution: Single-Command Task Gate

Create one script (`scripts/agent-task-close-check.js`) that:
1. Runs all mandatory validators
2. Checks that any compiled/generated output is newer than the newest source file
3. Emits a clear `✅ ALL CHECKS PASSED — task may be marked COMPLETE` or `❌ N CHECK(S) FAILED`
4. Exits non-zero on any failure

The standing instructions (CLAUDE.md / GEMINI.md) mandate that this script must pass before any task is marked complete. The script is the forcing function — one command, unambiguous exit code.

## Minimal Implementation

```javascript
// scripts/agent-task-close-check.js
'use strict';
const fs           = require('fs');
const { execSync } = require('child_process');

let failures = 0;

console.log('=== AGENT TASK CLOSE CHECK ===\n');

// Check 1: run your project's coverage/schema validator
console.log('[ 1 ] Running coverage validator...');
try {
    execSync('node scripts/validate_workflow_coverage.js', { stdio: 'pipe' });
    console.log('      ✅ PASS');
} catch {
    console.error('      ❌ FAIL — fix coverage errors first');
    failures++;
}

// Check 2: compiled output freshness
// Replace SOURCES_DIR and OUTPUT_DIR with your project's equivalents
console.log('\n[ 2 ] Checking output freshness...');
const newestSource = latestMtime('docs/manual/workflows');
const outputs = fs.readdirSync('docs/output').filter(f => f.endsWith('.md'));

if (outputs.length === 0) {
    console.error('      ❌ FAIL — no compiled output found. Run compile step.');
    failures++;
} else {
    const newestOutput = outputs.reduce((max, f) => {
        const t = fs.statSync(`docs/output/${f}`).mtimeMs;
        return t > max ? t : max;
    }, 0);
    if (newestOutput < newestSource) {
        console.error('      ❌ FAIL — output is stale. Re-run compile step.');
        failures++;
    } else {
        console.log('      ✅ PASS');
    }
}

console.log('\n' + '='.repeat(40));
if (failures === 0) {
    console.log('✅  ALL CHECKS PASSED — task may be marked COMPLETE');
} else {
    console.error(`❌  ${failures} CHECK(S) FAILED — fix before closing task`);
    process.exit(1);
}

function latestMtime(dir) {
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .reduce((max, f) => {
            const t = fs.statSync(`${dir}/${f}`).mtimeMs;
            return t > max ? t : max;
        }, 0);
}
```

## Adaptation Guide

| Project type | Check 1 | Check 2 |
|---|---|---|
| API + workflow docs (this pattern) | `validate_workflow_coverage.js` | workflow doc → compiled manual freshness |
| Frontend with generated types | `tsc --noEmit` | source → `dist/` freshness |
| Schema-driven backend | schema validator | schema → migration freshness |
| Any doc system | doc linter | source → rendered output freshness |
| Firebase functions | `eslint` + `firebase functions:shell` smoke | source → `lib/` freshness |

## Standing Instruction Template

Add this to your CLAUDE.md / GEMINI.md:

```markdown
### Self-validation (run before every task close)

    node scripts/agent-task-close-check.js

Must emit `✅ ALL CHECKS PASSED` before any task is marked COMPLETE.
```

## Key Properties

**Exit code is the API.** The script returns 0 (pass) or 1 (fail). The agent reads the exit code, not the human-readable output. This makes it composable with CI pipelines.

**Composition over repetition.** The gate composes existing validators — it does not duplicate their logic. Each validator is still runnable independently; the gate simply ensures all of them ran.

**Freshness check catches the common silent failure.** Agents frequently update source files and forget to re-run the compile step. The `mtime` comparison is cheap, unambiguous, and catches this every time.

**No false positives from unrelated file touches.** The freshness check compares only files in the relevant source directory against the relevant output directory. Unrelated file edits do not trigger failures.

## Companion Documents

- [self-guarding-manual-system.md](self-guarding-manual-system.md) — the broader documentation triangle pattern
- [router-action-coverage.md](router-action-coverage.md) — the specific coverage validator this project uses
- [session-closeout-protocol.md](session-closeout-protocol.md) — human-level session audit checklist
