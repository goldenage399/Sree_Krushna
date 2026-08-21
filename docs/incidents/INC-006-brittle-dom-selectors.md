# INC-006 — Brittle DOM Selector Failures in Layout Restructuring

**Date**: 2026-06-08  
**Severity**: Low (brittle testing and linter selector queries)  
**Status**: Resolved (semantic selectors rule codified, registered in standards catalog, verification gate updated)  
**Affected Component**: E2E testing scripts, linter rules, layout query selectors  

---

## What Happened

During layout restructuring of the task creation wizard (specifically merging sections in `TASK-157` and `TASK-158`), E2E tests and manual layout verification checks failed when trying to query form elements. 

Specifically, querying `#project-classification-impact-assessment-section > div:nth-child(2) > fieldset` succeeded because that section had a flat structure, but a similar selector failed for `#basic-info-timeline-section` since the latter required an intermediate `<div class="section-content compact-grid-3">` wrapper to implement a responsive desktop grid. 

This highlighted a systemic vulnerability: layout changes (such as wrapping fields in a grid wrapper or changing child order) break structural index-based selectors, causing test suite and linter failures.

---

## Investigation

Index-based DOM queries rely on specific tag counts and strict hierarchy (e.g., `> div:nth-child(2) > fieldset`). 
1. **Layout Wrapping**: Implementing responsive design (multi-column grids on desktop pointer devices) necessitates wrapping fields inside container `div`s. This breaks selectors expecting direct children (`>`).
2. **Dynamic Elements**: Adding validation error messages, warning banners, or auto-save indicator badges changes index offsets, rendering `:nth-child()` pointers incorrect.
3. **Best Practice Deviation**: Using DOM tree indexes instead of semantic attributes breaks the separation between layout (CSS/HTML wrapper structure) and semantics (elements under test).

---

## Architectural Surface Mapping

The incident was audited against the six architectural surfaces to extract lessons and prevent regressions:

### 1. UI Surface
* **Grid and Flex nesting**: Visual layout wraps (like CSS grid track containers) should not dictate the selector structure of tests or linter tools.
* **Semantic separation**: Keep DOM selection target identifiers decoupled from display wrapping structures.

### 2. Data Surface
* **No Impact**: No database read/write APIs, schemas, or SheetWriter structures were altered.

### 3. Reactive Surface
* **No Impact**: No state setter payload contracts or context hook states were modified.

### 4. Service Surface
* **No Impact**: No external APIs or authorization services were involved.

### 5. Module Surface
* **No Impact**: Modular dependencies and package bounds remained unchanged.

### 6. Governance Surface
* **Standard Deficiency**: No standard existed to forbid structural index-based DOM selectors in test suites, scripts, or linter queries.
* **Remediation**: Registered a new governance standard `P79` (`sap.gov.brittle-dom-selectors`) in the standards catalog and codified Protocol 75 in `GEMINI.md`.

---

## Fix Applied

1. **Standards Catalog Registration ([standards-catalog.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/standards-catalog.json))**:
   - Registered standard `P79` (`sap.gov.brittle-dom-selectors`).
2. **Violation Pattern Mapping ([violation-patterns.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/violation-patterns.json))**:
   - Mapped `P79_BRITTLE_DOM_SELECTORS` to scan for `:nth-child` or `:nth-of-type` selectors in tests and workspace scripts.
3. **SSOT Codification ([GEMINI.md](file:///d:/GitHub_Repo/Task-Dashboard/GEMINI.md))**:
   - Appended `Protocol 75` establishing the Brittle DOM Selector Avoidance rule.

---

## Lessons Learned & Prevention

1. **Avoid Brittle Selectors**: Never write selectors dependent on child indices (`nth-child`) or rigid direct children tags (`>`).
2. **Leverage semantic anchors**: Always query components using class names (e.g. `.priority-fieldset`), IDs, or explicit testing attributes (e.g. `data-testid`).

---

## Structural Invariant Established

### Protocol 75: Brittle DOM Selector Avoidance
* **Rule**: E2E test scripts, linter rules, and layout query selectors must target elements using semantic classes, IDs, or `data-testid` attributes. Positional child indexes (like `:nth-child()`, `:nth-of-type()`) or strict tag parent-child chains are prohibited.
* **Verification**: Running `node scripts/verify-standards-integrity.cjs` must return exit code `0` before commit.
