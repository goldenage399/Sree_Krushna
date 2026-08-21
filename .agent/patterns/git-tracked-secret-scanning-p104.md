---
pattern: git-tracked-secret-scanning-p104
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "check:secrets"
  - "secret scan"
  - "P104"
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Git-Tracked Secret Scanning (P104)

**Category**: Design Gate / Security Governance  
**Applies to**: Preflight checks, commit validation, CI/CD pipeline  
**Origin**: 2026-08-08 (INC-070 plaintext service account key leak in `src/utils/testingBackdoor.js`)  
**Status**: VALIDATED (Detected 6 additional leaked key files outside `src/` and passes cleanly on clean working tree)  

---

## Pattern — Git-Tracked Secret Scanning (P104)

### Problem
Private keys, API secrets, and service account credentials can leak into git repositories even when strict `.gitignore` rules exist. Developers may paste credentials directly into `.js`, `.ts`, `.md`, or `.json` files that do not match the `.gitignore` pattern. Relying on build-bundle inspection (e.g. scanning `dist/`) fails because Node-only scripts or test files are never bundled into the production website client code.

### Why it Happens
1. `.gitignore` rules target specific file extensions (e.g., `serviceAccountKey*.json`), ignoring secrets embedded in general `.js` files.
2. Security checks that scan client output bundles (`dist/`) miss unbundled root scripts and utility modules in `src/utils/` or `scripts/`.

### Solution
Enforce **P104 (Committed Secret Scan)** via `npm run check:secrets` (`scripts/check-committed-secrets.cjs`), which:
1. Enumerates all files currently tracked by git using `git ls-files`.
2. Inspects tracked file content for private key signatures (`BEGIN PRIVATE KEY`, `BEGIN RSA PRIVATE KEY`, service account JSON fields).
3. Exits with non-zero status if any secret marker is found in a git-tracked file.
4. Integrates into `PREFLIGHT.md` (Rule R38) so every pre-commit preflight verification runs the check.

### Failure Mode
Treating a `.gitignore` entry as a security gate, or scanning output build bundles instead of git-tracked source files, allowing plaintext keys to remain committed to git history unnoticed.

### Task-Dashboard Instance
- Scanner Script: [`scripts/check-committed-secrets.cjs`](file:///d:/GitHub_Repo/Task-Dashboard/scripts/check-committed-secrets.cjs)
- Incident Case Study: [`docs/incidents/INC-070-service-account-key-leak-and-p104-secret-scanner.md`](file:///d:/GitHub_Repo/Task-Dashboard/docs/incidents/INC-070-service-account-key-leak-and-p104-secret-scanner.md)
- Preflight Integration: [`PREFLIGHT.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/PREFLIGHT.md) (R38)
