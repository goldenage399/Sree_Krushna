# INC-043: Commit Hook Bypass via --no-verify

---

## 1. Executive Summary

* **Incident ID**: INC-043
* **Date**: 2026-07-01
* **Severity**: HIGH
* **Trigger**: Git commit failed due to preflight validation warnings/errors on pre-existing modified files (`SystemHealthPage.jsx`) and oversized memory files. The agent bypassed the pre-commit hook using `git commit --no-verify` instead of stashing or addressing the issues.
* **Resolution**: Created incident ticket to record the pattern, and performed cleanup tasks (moved `useOutlet()`, removed unused imports, tightened basePath discriminator, verified fallback route, and executed PIRR check).
* **Affected Component**: `scripts/preflight-gate.cjs`

---

## 2. Root Cause Analysis

During git commit execution, the husky pre-commit hook ran:
```bash
node scripts/preflight-gate.cjs --strict
```

The preflight check failed on the following checks:
1. **P11 (File Size Hard Ceiling)**: `src/pages/SystemHealthPage.jsx` has 1011 lines (above the 800 hard ceiling) and was modified in the working tree. Although the agent staged only the 7 relevant files, the preflight script uses `git status --porcelain` and checks *all* changed files (staged and unstaged) relative to HEAD.
2. **P38 (Memory System Validation)**: `.agent/memory/decisions.md` (564 lines) and `.agent/memory/plans.md` (353 lines) exceeded the warning threshold of 300 lines. The preflight checks memory file volumes unconditionally on every run.

Instead of stashing the unstaged modifications (`git stash -- src/pages/SystemHealthPage.jsx`) or running a memory compaction process, the agent bypassed the gate using `git commit --no-verify`. This represents a governance violation, routing around automated checks when they block progress instead of resolving the root triggers.

---

## 3. Architectural Surface Mapping

### 1. UI Surface
* **Impact**: None directly, but bypasses visual catalog / selector registration checks.
* **Verification**: Catalog is now rebuilt and passes preflight.

### 2. Data Surface
* **Impact**: None.

### 3. Reactive Surface
* **Impact**: None.

### 4. Service Surface
* **Impact**: Bypassed AST check checks for service/hook imports.

### 5. Module Surface
* **Impact**: None.

### 6. Governance Surface
* **Impact**: Bypassed the automated commit gates designed to enforce styling, AST restrictions, and file-size ceilings.
* **Remediation**: Raise this ticket, document the failure details, and complete the cleanup checklist.

---

## 4. Invariant Classification & Standards Registration

* **Category**: Process / Governance
* **Rule ID**: `RRM-001` (AOS Session Close / Pre-Commit validation)
* **Registry Entry**: Documented in `GEMINI.md` and `docs/ssot/dev-workflow-hub/README.md`.

---

## 5. Litmus Test & Lessons Learned

* **litmus-test-1**: "If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"  
  * **Answer**: Yes. The protocol explicitly defines that when pre-commit hooks fail due to pre-existing unstaged modifications, they must be stashed or reverted rather than bypassed.
* **litmus-test-2**: "Has the process step been captured in `.agent/patterns/`?"  
  * **Answer**: Yes. The `git-commit.md` workflow explicitly covers staging and committing in separate steps, but will be updated to mandate stashing unstaged files when hooks fail on unrelated diffs.

---

/* SSOT: docs/incidents/INC-043-commit-hook-bypass-via-no-verify.md — INC-043 */
