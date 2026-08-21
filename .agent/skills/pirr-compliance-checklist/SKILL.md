---
name: pirr-compliance-checklist
description: >
  Automated Post-Implementation Reconciliation Review (19 categories).
  Use before merging code to verify SSOT synchronization.
  Prevents tech debt and orphan functions (category 12).
---

## Goal

Ensure "Definition of Done" includes Documentation, not just Code.

## The 15-Point PIRR Checklist

1.  **System Prompt**: Did high-level invariants change? (`AVP_SYSTEM_PROMPT.md`)
2.  **Naming/Glossary**: New terms? (`GLOSSARY.md`)
3.  **Roles/Permissions**: New actors? (`Role_System.md`)
4.  **Schema/Data**: Columns changed? (`SHEET_SCHEMAS.md`)
5.  **API Contract**: JSON payload changed? (`CONTRACT.json`)
6.  **Validation Rules**: Logic changed? (`VALIDATION_Rules_*.md`)
7.  **Testing**: New test script? (`BACKEND_TESTING_REPOSITORY.md`)
8.  **Project Rules**: New coding standard? (`PROJECT_RULES.md`)
9.  **Workflows**: Process change? (`.agent/workflows/`)
10. **Architecture**: Module structure? (`ARCHITECTURE_*.md`)
11. **Core Function Index**: New utility? (`CORE_FUNCTION_INDEX.md`)
12. **UTF-8 Encoding**: Modified HTML/JS? Check for mojibake (`ðŸ`, `â€`, `Â`).
13. **Error Contract**: Backend `try/catch` blocks use `createErrorResponse()`? (Protocol #29)
    - **Scope**: `modules/` only (frontend-facing). Test scripts (`99_*.js`) exempt—they run in GAS Editor.
    ```powershell
    Select-String -Path "backend\src\modules\**\*.js" -Pattern "success: false, error:" -Recurse
    # MUST return 0 matches
    ```
14. **Enhancement State Machine**: If you worked on an enhancement, validate its state:
    - [ ] ACTIVE enhancements have "Last Updated" within 7 days
    - [ ] ACTIVE enhancements have "Current Phase" defined
    - [ ] COMPLETED enhancements have "Completed" date
    - [ ] Phase marked `[x]` has sub-task granularity
    - [ ] **Open Discoveries table** (added 2026-07-29, TASK-222 precedent): every row has a disposition — Resolved / Accepted / Deferred Investigation / Rejected. `Deferred Investigation` requires a non-empty Linked Task cell. An enhancement cannot be marked COMPLETE with a blank disposition or a `Deferred Investigation` row with no linked task.
    - **Files**: `enhancement-notes/*/00_ENHANCEMENT_INDEX.md`
    - **Output**: NON-BLOCKING warning for the date/phase checks; the Open Discoveries disposition check is **BLOCKING** — PIRR fails if any row is blank or a Deferred Investigation lacks a linked task.
    - **Operator Decision**: On date/phase violation, choose to (a) acknowledge and defer, (b) reactivate enhancement, or (c) mark as abandoned
15. **Documentation Hub Sync**: Did you update the Hub? (Protocol #41)
    - [ ] Run `.agent/scripts/verify-hub-integrity.ps1` (Must pass!)
    - [ ] New docs created this session added to `DOCUMENTATION_HUB.md`?
    - [ ] **Module-level check**: New docs in `docs/{Module}_Module_SSOT/` added to that module's `00_DOCUMENT_HUB.md`?
    - [ ] Dependencies recorded in Dependency Graph?
    - [ ] Impacts recorded in Dependency Graph?
    - [ ] "Last Verified" dates updated for modified docs?
    
    **Quick verification**:
    ```powershell
    # List new docs in this session
    git diff --name-only HEAD~5 | Select-String "docs/.*\.md$"
    # For each file, verify it exists in corresponding hub
    ```
    - **IF ANY UNCHECKED → PIRR FAILS**
16. **Service Layer Violation Check** (Protocol #44) [PIO-086]
    - [ ] Run anti-pattern detection:
    ```powershell
    # Controllers/Engines must NOT call SpreadsheetApp directly
    $violations = @()
    $violations += Select-String -Path "backend\src\modules\*\*Aggregator*.js" -Pattern "SpreadsheetApp\." -Recurse
    $violations += Select-String -Path "backend\src\modules\*\*MultiStep*.js" -Pattern "SpreadsheetApp\." -Recurse
    $violations += Select-String -Path "backend\src\modules\*\*Service.js" -Pattern "SpreadsheetApp\." -Recurse
    if ($violations.Count -gt 0) { Write-Error "Layer violation detected: $($violations.Count) matches" }
    ```
    - [ ] New backend functions have `@layer` JSDoc annotation?
    - [ ] Cross-module calls use Facade pattern (not direct Engine calls)?
    - **IF VIOLATIONS DETECTED → PIRR FAILS** (Blocking)
17. **Standards Registration Check** (Protocol #53 - Proposed) [Gap identified 2026-02-16]
    - [ ] Did you implement a **new reusable pattern** (architecture, data integrity, performance)?
    - [ ] Is it registered in `.agent/standards-catalog.json`?
    - [ ] Is the pattern documented in `ARCHITECTURE_*.md` or `PATTERN_*.md`?
    - [ ] Added to `docs/DOCUMENTATION_HUB.md`?
    - **Triggers**:
        - Creating cross-cutting utilities (WriteJournal, LockService, WAL)
        - Establishing new architectural patterns (Dual-Path Lookup, Idempotency)
        - Implementing data integrity safeguards
    - **Action**: Run `/register-standard` workflow
    - **Output**: NON-BLOCKING warning (prompt user to register or defer)
    - **Exemptions**: Module-specific helpers, one-off fixes, temporary scaffolds
18. **Architectural Invariant Scanning**
    - [ ] Run `npm run check:auth-fallbacks` (ARCH-INV-005) — exits non-zero on violation
    - [ ] If new invariant scanners have been added this session, run those too
    - PIRR does not pass if any invariant scanner exits non-zero

20. **Architectural Phasing** _(Added 2026-06-28 · Phase 5 RRM-001)_
    - [ ] Did this session produce any architectural recommendations (in a Review, ADR draft, design doc, or PIRR finding)?
      → Every recommendation must carry an Implement Now / Design Now / Defer / Reject classification
    - [ ] Are all Design Now items paired with a declared Seam and Trigger?
    - [ ] Are all Defer items paired with a named Trigger condition?
    - [ ] Does any commit message or session output say "we should" or "in the future" without a classification?
      → Unclassified deferred intent is a governance gap — classify it now or log it as a Defer with Trigger
    - **Reference**: `docs/ssot/engineering-review/dimensions/architectural-phasing.md`
    - **IF architectural recommendations present and none classified → PIRR FAILS** (Blocking)

19. **Design System / Theme Changes** _(Added 2026-05-17)_
    - [ ] Were any CSS variables, design tokens, or theme aliases modified?
      → Update `docs/ssot/ui-design/spokes/THEME-SYSTEM.md` (token reference + architecture decisions)
    - [ ] Were any `[data-theme]` blocks added or consolidated?
      → Verify the **Single Authority** rule: token definitions live in `theme-tokens.css` only (retired: `themes-enhanced.css`/`enhanced-themes.css`, TASK-218 M2.5)
    - [ ] Were any new semantic utility classes introduced or ghost classes removed?
      → Update `UI-DESIGN-HUB.md` Decision History
    - [ ] Were any `<button>` elements acting as tabs/filters/toggles touched?
      → Confirm `.theme-button-secondary` is declared to bypass broad gradient selectors
    - [ ] Were any scoped CSS classes added to escape the `tailwind-semantic-bridge.css` cascade conflict?
      → Document the new class in `src/styles/utilities/components.css` with a comment linking back to INC-002 / ADR-008
    - **Files to check**: `src/styles/theme-tokens.css`, `src/styles/theme-utilities.css`
      (retired: `themes-enhanced.css`/`enhanced-themes.css`, TASK-218 M2.5),
      `src/styles/vibrancy-utilities.css`, `src/contexts/ThemeContext.jsx`
    - **SSOT targets**: `THEME-SYSTEM.md`, `UI-DESIGN-HUB.md`, `RESPONSIVE-DESIGN.md`
    - **IF ANY CSS CHANGE WAS MADE AND NONE OF THE ABOVE CHECKED → PIRR FAILS**

## Task-Dashboard Repo-Specific Overrides

> **Activation**: Apply this section when running PIRR in the `Task-Dashboard` repository. PIO-origin checks that reference GAS/SpreadsheetApp infrastructure are not applicable — mark them N/A and apply the Firebase equivalents below instead.

| PIO Category | Task-Dashboard Firebase Equivalent |
|---|---|
| **Cat 4** Schema/Data (`SHEET_SCHEMAS.md`) | Did Firestore collection fields, indexes, or document shapes change? → Update `docs/TASK-MANAGEMENT.md` collection schemas. |
| **Cat 5** API Contract (`CONTRACT.json`) | Did Firestore security rules access paths change? → Update `docs/FIREBASE-SECURITY-ARCHITECTURE-ANALYSIS.md` and verify `firestore.rules`. |
| **Cat 13** Error Contract (`createErrorResponse()`) | New Firebase operations must handle `permission-denied` and `not-found`. Run: `grep -rn "catch" src/services/` — each catch block must surface a user-readable error, not swallow silently. |
| **Cat 16** Service Layer (SpreadsheetApp direct calls) | Run: `grep -rn "collection(" src/components/ src/pages/` — **must return 0 results.** Direct Firestore calls in UI layer violate ADR-001 (P66/P67). All collection access must go through context owner hooks in `src/contexts/`. |
| **Cat 16b** Page Reachability *(added 2026-07-29, PREFLIGHT R37)* | If any `src/pages/*.jsx` file was created or modified, run `npm run check:page-reachability` — must exit 0 for the touched file. A page that compiles, passes unit tests, and has correct internal logic can still be completely unreachable if it was never wired into a `<Route>` anywhere. **"Full data chain verified: UI → Hook → Firebase" (T3) may not be checked off from reading code alone** — it requires confirming the actual route resolves to the actual component (dev server + browser, or this script as a minimum floor). Origin: TASK-222 shipped and PIRR-signed-off a feature inside `AssociateDashboard.jsx`, which was never rendered anywhere in `App.jsx` — caught only when the product owner asked to see it running. |

---

## Execution

For each Category where code was changed, ask:

> "Did we update the corresponding SSOT?"

### Output Report

```markdown
## 🏁 PIRR Compliance Report

| Category          | Changed? | SSOT Updated? | Link            |
| :---------------- | :------: | :-----------: | :-------------- |
| API Contract      |   YES    |      ✅       | `CONTRACT.json` |
| Schema            |    NO    |       -       | -               |
| Core Functions    |   YES    |      ❌       | **MISSING**     |
| Enhancement State |   YES    |      ⚠️       | STALE (7+ days) |

🚨 **BLOCKING**: Please update `CORE_FUNCTION_INDEX.md` before merge.
⚠️ **WARNING**: PIO-070 is stale (7+ days without update). Action: [defer/reactivate/abandon]
```

## ❌ Example Violation

**User**: "Ready to merge my Accounts feature."

**PIRR Check**: "Did you update `CONTRACT.json`?" → **NO**

**This skill blocks merge** until the contract is updated.

## ➡️ What's Next?

After this skill passes:

- **Code is ready to merge** ✅
- Run `enhancement-tracker-update` skill (Protocol #32)
- Create **Session Handoff** if ending work session
