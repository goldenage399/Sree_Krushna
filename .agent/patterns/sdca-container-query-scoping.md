---
pattern: sdca-container-query-scoping
activation_tier: guarded
guard: npm run verify:modular-architecture
status: VALIDATED
consumed_by:
  - file: shopping_src/build.cjs
    at: "scopeCssBlock container query regex matcher"
  - file: cockpit_src/build.cjs
    at: "scopeCssBlock container query regex matcher"
  - file: decision_registry_src/build.cjs
    at: "scopeCssBlock container query regex matcher"
  - file: .agent/workflows/external-ui-redesign.md
    at: "Phase 4: SDCA Modular Component Verification"
  - file: GEMINI.md
    at: "Section 4: Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Section 4: Pattern Activation & PACT-001 Cross-References"
portability: universal
canonical_source: sree-krushna
porting_effort: low
---

# SDCA Container Query Scoping Invariant (`INV-SDCA-004`)

**Category**: Build Integrity & Architecture Gate  
**Applies to**: Single-Document Client Applications (SDCA), modular CSS build scripts, CSS pre-scoping engines, and scoped HTML fragment builders.  
**Origin**: 2026-09-18 (Discovered during SK-005 Shopping Registry & Decorator Cockpit responsive reflow).  
**Status**: VALIDATED  

---

## Pattern — SDCA Container Query Scoping (`INV-SDCA-004`)

### Problem
In Static Decoupled Component Assemblers (SDCA) where modular CSS partials are concatenated and pre-scoped using a parent container ID (such as `#shoppingRegistryFrame` or `#cockpitFrame`), build scripts parse CSS selectors to prefix every selector with the container ID.

If the parser only tests for `@media` queries via:
```javascript
// BROKEN PATTERN:
if (css.slice(i).match(/^@media[^{]*\{/))
```
then modern `@container` queries (`@container (max-width: 680px) { ... }`) are **NOT** recognized as top-level at-rules. The build script treats `@container` as an ordinary CSS selector name and erroneously prepends the parent ID:
```css
/* INVALID CSS GENERATED */
#cockpitFrame @container (max-width: 680px) {
  .cockpit-hud { flex-direction: column; }
}
```
Browsers immediately reject this as an invalid CSS selector statement, causing all responsive container queries inside the scoped fragment to fail silently.

### Root Cause
1. **Incomplete At-Rule Regex**: Early CSS bundlers and lightweight scoping parsers assumed that `@media` was the only nested at-rule that wraps standard CSS blocks.
2. **Silent Degradation**: Browsers do not throw runtime exceptions on invalid CSS; they silently discard invalid rules. The resulting layout regression on tablet/mobile is only detectable visually or via container-aware smoke tests.

### Solution
SDCA CSS scoping functions (`scopeCssBlock`) MUST match all nested at-rules (`media`, `container`, `supports`, `layer`) via:
```javascript
// ENFORCED PATTERN (INV-SDCA-004):
if (css.slice(i).match(/^@(media|container|supports|layer)[^{]*\{/)) {
  const match = css.slice(i).match(/^(@(media|container|supports|layer)[^{]*\{)/);
  const atRuleHeader = match[1];
  result += atRuleHeader + '\n';
  i += atRuleHeader.length;
  // Recursively scope selectors INSIDE the at-rule block...
}
```

### Failure Modes Guarded
- Prepending container IDs to `@container` blocks.
- Corrupted responsive breakpoints when rendering SDCA modules inside parent SPA tab panels.
- White-screen or layout overflow on narrow mobile screens ($<768\text{px}$).

### Invariant Instances
- `cockpit_src/build.cjs`: Line 149 (`INV-SDCA-004`)
- `shopping_src/build.cjs`: Line 136 (`INV-SDCA-004`)
- `decision_registry_src/build.cjs`: Line 119 (`INV-SDCA-004`)
- Enforced by: `npm run verify:modular-architecture`
