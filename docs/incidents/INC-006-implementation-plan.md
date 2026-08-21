# Implementation Plan: Governance Refinement, Tooling Scanner, & Layout Ellipsis Fix

This plan details the implementation of structural enhancements to the governance tooling, the addition of a standards linter scanner, and the resolution of the priority label truncation visual defect, as requested in Reviews 5.2, 5.4, and 5.6.

## User Review Required

> [!IMPORTANT]
> - **Visual Defect Resolution (INC-005)**: Remove redundant `text-overflow` properties from the flex parent `.priority-label` in `task-creation-modular.css`. Truncation properties are already correctly defined on the block child `.priority-text`.
> - **Governance Refinement & Case Study (INC-006)**: Standardize brittle DOM selector avoidance and registry tooling.
> - **Standards Linter Scanner (`npm run lint:standards`)**:
>   - Implement `scripts/lint-standards.cjs` to scan `src/` for actual code violations using patterns defined in `violation-patterns.json`.
>   - **File-Extension Scoping**: To prevent false positives on CSS files (which legitimately use `:nth-child`), patterns will define `fileExtensions` (e.g., `[".js", ".jsx", ".ts", ".tsx"]`). If not specified, the scanner defaults to scanning JavaScript/TypeScript files only.
>   - **Baseline Scan**: Run a baseline scan to document pre-existing violations, add exceptions for legitimate cases, and verify the exit code is `0` before wiring to pre-commit checks or CI.
> - **Read-Path Discovery (`query-standard.cjs`)**: Implement `scripts/query-standard.cjs` to search the standards registry by category, keyword, or surface.
> - **Jaccard Semantic Overlap**: Both the register CLI and the integrity auditor will use standard Jaccard Similarity (`intersection / union`). The thresholds are aligned: warn at `> 0.25`, reject/error at `> 0.45` on both paths.
> - **Worthiness Gate & Attestation**:
>   - CLI flags `--reusable`, `--stable` etc. will skip interactive evaluation but trigger a prominent self-attestation warning: `⚠️ Worthiness flags passed directly — self-attestation mode. No interactive evaluation. Skipping evaluation is the developer's responsibility.`
>   - Interactive prompts will fire when flags are absent, requiring a score of $\ge 3$ to register.
> - **GEMINI.md TOC Index**: A scannable Table of Contents grouped by **Category** (e.g. Governance, UI Quality, Data Integrity) will be added to the top of `GEMINI.md` to prevent backfill issues, as all 51 standards have categories populated.
> - **Session Start workflow**: Add a step to `.agent/workflows/aos-session-open.md` prompting developers to run the query CLI with `--surface` or `--category` corresponding to their task on session open.

---

## Proposed Changes

### 1. Visual Layout Bug Fix (INC-005)

#### [MODIFY] [task-creation-modular.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/task-creation-modular.css)
- Remove `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` from `.compact-form-section .priority-label` (lines 1535-1537) to prevent layout engines from clipping flex containers incorrectly.

---

### 2. Read/Write Governance Utility CLIs

#### [MODIFY] [register-standard.cjs](file:///d:/GitHub_Repo/Task-Dashboard/scripts/register-standard.cjs)
- **Allowed Severities Validation**: Reject severity values not in `["LOW", "MEDIUM", "HIGH", "CRITICAL"]`.
- **Severity Flag**: Accept `--severity` (defaulting to `"MEDIUM"`).
- **Worthiness Gate**:
  - Accept worthiness flags (`--reusable`, `--forgetting-cost`, `--non-obvious`, `--boundary`, `--stable`).
  - If flags are provided, print standard warning: `⚠️ Worthiness flags passed directly — self-attestation mode. No interactive evaluation. Skipping evaluation is the developer's responsibility.`
  - If TTY and flags are absent, prompt interactively.
  - Fail execution with exit code `1` if the worthiness score is `< 3`.
  - Save the worthiness score details object into `standards-catalog.json`.
- **Jaccard Overlap**: Calculate similarity using Jaccard formula (`intersection / union`). Throw hard error at `> 0.45` (rejection) and print warning at `> 0.25`.
- **Dry-Run Flag**: If `--dry-run` is present, log output changes and exit without writing files.

#### [NEW] [query-standard.cjs](file:///d:/GitHub_Repo/Task-Dashboard/scripts/query-standard.cjs)
- Create a read CLI utility to query standards:
  - `--surface <name>`: Filter by surface (UI, Data, Reactive, Service, Module, Governance).
  - `--category <name>`: Filter by category.
  - `--keyword <phrase>`: Full-text case-insensitive keyword search on name and description.
  - Print matching standards with their ID, name, severity, and description.

---

### 3. Verification & Linter Auditing (INC-006)

#### [NEW] [lint-standards.cjs](file:///d:/GitHub_Repo/Task-Dashboard/scripts/lint-standards.cjs)
- Create a standards linter script:
  - Read `.agent/violation-patterns.json`.
  - Traverse `src/` directory (skipping `node_modules`, `.git`, and files in `exceptions` or `@compliance-ignore` blocks).
  - Scope files by `fileExtensions` (defaults to `[".js", ".cjs", ".jsx", ".ts", ".tsx"]` if not specified).
  - Test files against active regex patterns.
  - Report exact violations with file paths, line numbers, and standard message descriptions.
  - Exit with code `1` if violations are found.

#### [MODIFY] [package.json](file:///d:/GitHub_Repo/Task-Dashboard/package.json)
- Add command script: `"lint:standards": "node scripts/lint-standards.cjs"`.

#### [MODIFY] [verify-standards-integrity.cjs](file:///d:/GitHub_Repo/Task-Dashboard/scripts/verify-standards-integrity.cjs)
- **Typed ID Schema**: Support general alphanumeric-dash brackets (e.g., `[ANTI-GOV-079]`) in the `GEMINI.md` match checks.
- **Audit-Path Semantic Check**: Read standard descriptions, run Jaccard similarity scanner, and throw an integrity error if any standards overlap with Jaccard ratio `> 0.45` or print warning logs if `> 0.25`.

---

### 4. SSOT Quick Reference Index

#### [MODIFY] [GEMINI.md](file:///d:/GitHub_Repo/Task-Dashboard/GEMINI.md)
- Add a table of contents index at the top of the file under a new section `## 📍 Quick Reference by Category` mapping standards to their respective technical categories.

---

### 5. Dev Workflow Integration

#### [MODIFY] [aos-session-open.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-open.md)
- Add a step to the session open checklist:
  ```
  - [ ] Run standard lookup: Query the standards registry to search for rules matching this task:
        `node scripts/query-standard.cjs --keyword "<task-keywords>"` or `node scripts/query-standard.cjs --surface <surface>`
  ```

---

## Verification Plan

### Automated Tests
- Run the new standards linter against `src/` (baseline scan):
  ```powershell
  node scripts/lint-standards.cjs
  ```
- Run unit tests:
  ```powershell
  npm run test:unit:run
  ```
- Run the standards catalog integrity check:
  ```powershell
  node scripts/verify-standards-integrity.cjs
  ```

### Manual Verification
- Test `register-standard.cjs` dry-run and worthiness filter rejections.
- Test `query-standard.cjs` with `--category governance` and `--keyword "selector"`.

