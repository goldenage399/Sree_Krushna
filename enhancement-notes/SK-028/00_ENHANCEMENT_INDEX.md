# SK-028: SDCA Structural DOM Contract & Cross-Repo Portable Validation Framework

## 📊 Metadata
- **Category**: INFRASTRUCTURE / QUALITY / CROSS-REPO PORTABILITY
- **Priority**: HIGH
- **Status**: COMPLETED
- **Estimate**: 4 Phases (Completed)
- **Target Release**: v2.9.6
- **Risk Level**: LOW
- **Council Ruling**: `AC-DEC-2026-070` (FULL COUNCIL CERTIFIED, 2026-09-28)
- **Governing Standard**: `STD-STRUCTURAL-CONTRACT-001` / `STD-MOD-COMP-001`
- **Cluster**: Infrastructure Enhancement Cluster

## 🔗 Dependencies
- **Depends On**: None (Foundational — closes gap exposed in INC post-fix `fd47c6f`)
- **Blocks**: None

## 🎯 Goal

Establish a comprehensive 4-layer validation framework that permanently prevents SDCA DOM nesting regressions, unclosed tags, and broken lazy-mount selector contracts across all web modules and portable sibling repositories:
1. **Source Level (Gap Variant A)**: Zero-dependency stack-based tag-balance gate (`scripts/check-html-balance.cjs`).
2. **Compile-Time Level (Gap Variant B)**: Declarative JSON contracts (`.structural-contracts/*.json`) and stack-based hierarchy validator (`scripts/verify-structural-contracts.cjs`).
3. **Runtime Browser Level (Gap Variant C)**: Playwright headless DOM contract assertions after dynamic fragment mounting (`tests/sdca-structural.spec.mjs`).
4. **Cross-Repo Portability**: Codified universal pattern (`.agent/patterns/structural-dom-contract-gate.md`) and skill (`.agent/skills/structural-contract-verifier/SKILL.md`), verified with exit code 0 on sibling repositories (`Task-Dashboard`, `OperatusOS`).

---

## 4-Phase Definition of Done (DoD) & Validation Matrix

| Phase | Deliverables | Validation Gate | Status |
|---|---|---|---|
| **Phase 1: Source Tag-Balance Gate** | `scripts/check-html-balance.cjs`, extended `scripts/verify-modular-architecture.cjs` step [2/6], `GEMINI.md` §4 | `npm run verify:modular-architecture` passes all 64 checks; 16/16 SDCA HTML files verified; negative test passed | ✅ COMPLETED (`e558892`) |
| **Phase 2: Structural Contracts & Hierarchy Validator** | `.structural-contracts/{shopping,cockpit,decision-registry}.json`, `scripts/verify-structural-contracts.cjs`, npm scripts | `npm run verify:structural-contracts` passes 17/17 checks; negative test caught deliberate violation | ✅ COMPLETED (`90b0ca7`) |
| **Phase 3: Playwright Runtime DOM Assertions** | `tests/sdca-structural.spec.mjs`, `npm run test:sdca-structural` | 8/8 tests passed on Desktop Chromium (3.5s) and Mobile Chrome Pixel 5 (3.9s) | ✅ COMPLETED (`355875f`) |
| **Phase 4: Cross-Repo Pattern & Portability Proof** | `.agent/patterns/structural-dom-contract-gate.md`, `.agent/skills/structural-contract-verifier/SKILL.md`, `--dir` CLI support | Verified on `Task-Dashboard` and `OperatusOS` with exit code 0 | ✅ COMPLETED |

---

## 📜 Architectural Invariant (`STD-STRUCTURAL-CONTRACT-001`)

1. **Rule 1 (Tag Balance)**: All SDCA source components must pass `check-html-balance.cjs` before build execution.
2. **Rule 2 (Declarative Contracts)**: All modules must declare DOM container relationships in `.structural-contracts/<module>.json`.
3. **Rule 3 (Hierarchy Validation)**: Build output must verify ancestor-descendant constraints via `verify-structural-contracts.cjs`.
4. **Rule 4 (Runtime Verification)**: Lazy-mounted SPA fragments must prove DOM attachment and parentage in Playwright (`test:sdca-structural`).
5. **Rule 5 (Empirical Portability)**: Portability claims require zero-config multi-repo execution proof under `INV-PROVE-BEFORE-CLAIM-001`.
