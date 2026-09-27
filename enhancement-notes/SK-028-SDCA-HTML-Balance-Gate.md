# SK-028: SDCA HTML Balance Gate — Source-Level Tag Validation

## 📊 Metadata
- **Category**: FIX / INFRASTRUCTURE
- **Priority**: HIGH
- **Status**: PENDING
- **Estimate**: ~1–2 hours
- **Target Release**: v2.9.6
- **Risk Level**: LOW
- **Council Ruling**: `AC-DEC-2026-070` (EXPEDITED, 2026-09-27)
- **Governing Standard**: `STD-MOD-COMP-001` / `P-MOD-COMP-001`
- **Cluster**: Infrastructure Enhancement Cluster

## 🔗 Dependencies
- **Depends On**: None (Foundational — closes gap identified in INC post-fix `fd47c6f`)
- **Blocks**: None

## 🎯 Goal

Create a committed stack-based HTML tag-balance checker (`scripts/check-html-balance.cjs`) and wire it into `verify:modular-architecture` step [2/6] so that any future unclosed/mismatched tag in any SDCA `components/*.html` file (across all 3 modules) fails the pre-flight gate before it reaches a compiled artifact.

## 🛡️ Risk Assessment
- **Risks**: The balance check validates only Gap Variant A (unbalanced open/close tag pairs). Gap Variant B (structurally balanced but hierarchically wrong nesting) is explicitly out of scope per `INV-PROVE-BEFORE-CLAIM-001`.
- **Mitigation**: Scope annotation added to script header and `STD-MOD-COMP-001` coverage note. No false security — developers must still run live browser verification.
- **Gap Variant B re-open trigger**: A second real SDCA regression where tags were balanced but DOM nesting was wrong, OR when a Playwright SDCA smoke test suite is introduced.

## 📜 SSOT Impact
- [`scripts/verify-modular-architecture.cjs`](../scripts/verify-modular-architecture.cjs) — Step [2/6] `sdcaModules.forEach()` loop extended
- [`scripts/check-html-balance.cjs`](../scripts/check-html-balance.cjs) — **NEW FILE**
- `GEMINI.md` §4 — `STD-MOD-COMP-001` coverage note updated with Gap Variant A annotation

## 📋 Implementation Plan (Phase 1 — Single Phase)

### Step 1: Create `scripts/check-html-balance.cjs`

Write a ~30-line stack-based tag matcher derived from the Q1.0 incident scratch script (lines 104–120 of `260927_RegressionHandling.md`). The script:
- Accepts a file path as CLI argument (`process.argv[2]`)
- Reads the file, splits by line, iterates tags via regex
- Maintains a stack for opened block-level tags
- Prints any unclosed/mismatched tag with line number and exits non-zero
- Header comment: *"Validates tag-balance only (Gap Variant A). Does NOT validate DOM nesting hierarchy (Gap Variant B — deferred per INV-PROVE-BEFORE-CLAIM-001 / SK-028 re-open trigger)."*

**🔍 Validation Gate**:
1. (Binary) `node scripts/check-html-balance.cjs shopping_src/components/body.html` → must exit code 0 and print no errors
2. (Binary) Inject a deliberate unclosed `<div>` into a temp copy and verify the script exits code 1

**🚦 Decision Node**:
- **Pass**: Proceed to Step 2.
- **Fail (1st)**: Inspect the regex pattern. Check for self-closing tag list completeness (img, br, hr, input, meta, link). Re-run gate.
- **Fail (2nd)**: Halt. Surface to user with observed output.

---

### Step 2: Extend `verify:modular-architecture.cjs` Step [2/6]

Inside the `sdcaModules.forEach()` loop (lines 56–88), after the existing existence checks, add a glob scan of `<mod>/components/*.html` and for each file call `check-html-balance.cjs` via `execFileSync`. Pass/fail via the existing `pass()`/`fail()` helpers.

For `cockpit_src`: also scan `<mod>/components/modals/*.html` if modals subfolder exists (confirmed: cockpit has a `modals/` subdir).

**🔍 Validation Gate**:
1. (Binary) `npm run verify:modular-architecture` → must exit code 0, with new `[PASS] <module>/components/<file>.html: tag-balance OK` lines for all 11+ HTML files
2. (Binary) Git grep confirms NO new npm script category was added (only existing `verify:modular-architecture` extended)

**🚦 Decision Node**:
- **Pass**: Proceed to Step 3.
- **Fail (1st)**: Check `execFileSync` path resolution relative to `rootDir`. Re-run gate.
- **Fail (2nd)**: Halt. Surface to user with full `verify:modular-architecture` output.

---

### Step 3: Add Scope Annotation to `GEMINI.md` §4 `STD-MOD-COMP-001`

In the `STD-MOD-COMP-001` invariant description, add one sentence: *"Tag-balance is validated at source level before compilation (Gap Variant A, `AC-DEC-2026-070`); DOM nesting hierarchy validation (Gap Variant B) is deferred to `SK-028` re-open trigger."*

**🔍 Validation Gate**:
1. (Binary) `grep -n "Gap Variant" GEMINI.md` → must return at least 1 match in STD-MOD-COMP-001 section
2. [human-review] Confirm the annotation is accurate and does not imply broader protection than provided

**🚦 Decision Node**:
- **Pass**: Proceed to verification.
- **Fail (1st)**: Locate the correct `STD-MOD-COMP-001` section in `GEMINI.md` and re-apply annotation.
- **Fail (2nd)**: Halt. Surface to user.

---

## ✅ Definition of Done (v1.7 — Simple)

| Tier | Name | Criterion | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Static** | `check-html-balance.cjs` exits 0 on all 11 SDCA component HTML files | `node scripts/check-html-balance.cjs <each file>` — all exit code 0 | [ ] | [Script output] |
| **T2** | **Functional** | `npm run verify:modular-architecture` passes with new tag-balance lines | Run `npm run verify:modular-architecture` → all PASS, new balance lines present | [ ] | [Terminal output] |
| **T3** | **Integrated** | Scope annotation present in `GEMINI.md`; `ENHANCEMENT-MASTER-REGISTRY.md` updated | `grep "Gap Variant" GEMINI.md` returns match; registry updated | [ ] | [grep output + registry diff] |
| **T4** | **Standard** | PIRR complete | All governance artifacts committed in same session | [ ] | [git log] |

**DoD Completion**: 0/4 criteria verified (0%)

---

## 🔗 Related Artifacts
- **Incident**: `User_Created/Discussion Threads/Shopping/260927_RegressionHandling.md` (Q1.0 + Q1.1)
- **Council Artifact**: `User_Created/Discussion Threads/Council/260927_arch_council_sdca_structural_dom_contract_and_html_balance_gate.md`
- **Council Ledger**: `AC-DEC-2026-070` (EXPEDITED, 2026-09-27, snapshot `5d4d0fe`)
- **Fix Commit**: `fd47c6f` — immediate incident fix (div balance restored)
- **Gap Variant B Open Investigation**: `SK-028` re-open trigger documented above
