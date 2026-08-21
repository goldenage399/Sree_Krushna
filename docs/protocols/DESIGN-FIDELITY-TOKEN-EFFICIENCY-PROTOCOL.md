# Design Fidelity & Token Efficiency Protocol

**Protocol ID**: ENH-INFRA-040
**Status**: ✅ Production Ready
**Created**: 2025-11-04
**External Collaborator**: Verified and recommended
**Parent**: Production-First Development Protocol

---

## 🎯 Purpose

This protocol ensures that every automated or collaborative modification to components:

1. **Retains production layout hierarchy and UX flow**
2. **Uses design tokens efficiently** (no hardcoded values, minimal redundancy)
3. **Improves clarity and maintainability** without flattening structure
4. **Requires human approval** for structural changes

**Problem Solved**: Prevents well-intentioned refactoring from accidentally removing semantic structure, visual proportions, or intentional design decisions.

---

## 🏛️ The 8 Golden Rules

### **R1: Preserve Hierarchy** 🏗️
**Rule**: Never delete or merge layout containers (Section, StepGroup, Header, Sidebar). Only refactor inside them.

**Why**: Component hierarchy provides semantic meaning, accessibility landmarks, and maintainability structure.

**Example**:
```jsx
// ✅ CORRECT - Preserve structure
<Section>
  <Header>...</Header>
  <StepGroup>
    <Step1 />
    <Step2 />
  </StepGroup>
</Section>

// ❌ WRONG - Flattened structure
<div>
  <Step1 />
  <Step2 />
</div>
```

### **R2: Token First, Not Token Only** 🎨
**Rule**: Replace literals with tokens, but respect existing visual proportions and spacing rhythm.

**Why**: Tokens provide consistency, but the original spacing relationships matter. Don't blindly replace 16px → var(--space-md) if the design intentionally used 18px for visual balance.

**Example**:
```css
/* ✅ CORRECT - Respect visual proportions */
.card-padding {
  padding: var(--space-lg); /* Was 24px, matches design intent */
}

/* ❌ WRONG - Forces token that breaks design */
.card-padding {
  padding: var(--space-md); /* Was 24px, now 16px - visually broken */
}
```

### **R3: One-to-One Parity** 📐
**Rule**: Sandbox or new file must render the same component tree depth as production (±1 nested level max).

**Why**: Drastic simplification indicates missing semantic structure or accessibility concerns.

**Example**:
```
Production depth: 7 levels
Sandbox depth: 6-8 levels → ✅ ACCEPTABLE
Sandbox depth: 3 levels → ❌ REJECTED (too simplified)
```

### **R4: Semantic CSS Tokens** 🎯
**Rule**: Always use `--space-*`, `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`. Never re-declare tokens locally unless adding a sandbox-specific variant (`--tc-*`).

**Why**: Centralized tokens enable global theme changes. Local redeclaration breaks this system.

**Example**:
```css
/* ✅ CORRECT - Use global tokens */
.button {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-primary);
}

/* ✅ ACCEPTABLE - Sandbox-specific variant */
.tc-button {
  --tc-button-padding: var(--space-lg); /* Sandbox override */
  padding: var(--tc-button-padding);
}

/* ❌ WRONG - Redefines global token */
.button {
  --space-md: 20px; /* Breaks global system */
}
```

### **R5: Diff Before Apply** 📊
**Rule**: Compare new file vs. production baseline; list changes in: **STRUCTURE Δ**, **TOKENS Δ**, **VISUAL Δ**. Request approval before merging.

**Why**: Transparency prevents accidental regressions. Human review catches edge cases automation misses.

**Required Report Format**:
```
STRUCTURE Δ:
  - Added: ErrorBoundary wrapper (+1 level)
  - Removed: None
  - Modified: None

TOKENS Δ:
  - Added: --shadow-sm, --shadow-md, --shadow-lg
  - Removed: None
  - Modified: --color-accent-alpha-15 (rgba value changed)

VISUAL Δ:
  - Spacing: Increased padding from 16px → clamp(16px, 3vw, 24px) [fluid responsive]
  - Colors: None
  - Typography: Added line-height: 1.5 to body text
```

### **R6: Compact ≠ Minimalist** 🗂️
**Rule**: "Compact view" means visible in one scroll, not fewer components. Preserve info grouping and step logic.

**Why**: Compact UX improves usability, but removing semantic sections harms maintainability and accessibility.

**Example**:
```
✅ COMPACT (Good):
  All 5 steps visible on one page
  Each step still has: <section>, <header>, <content>
  Total: Same number of components, just no pagination

❌ MINIMALIST (Bad):
  All 5 steps merged into one <div>
  No semantic sections
  Total: Fewer components, but lost structure
```

### **R7: Never Inline Large Token Sets** 📦
**Rule**: Import from `semantic-foundation.css` + `design-tokens.css`; only override what's missing.

**Why**: Inline token duplication creates maintenance burden and version drift.

**Example**:
```css
/* ✅ CORRECT - Hybrid approach */
@import url('../../styles/semantic-foundation.css');
@import url('../../styles/design-tokens.css');

:root {
  /* Only sandbox-specific additions */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* ❌ WRONG - Duplicates entire token set */
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  /* ... 200 more lines of duplicated tokens */
}
```

### **R8: Accessibility Lock** 🔒
**Rule**: Maintain all `aria-labels`, focus states, and tab order. Never remove for "simplicity".

**Why**: Accessibility is non-negotiable. Removing ARIA attributes to "clean up" code harms users.

**Example**:
```jsx
// ✅ CORRECT - Preserve accessibility
<button
  aria-label="Submit task"
  aria-describedby="submit-help"
  tabIndex={0}
>
  Submit
</button>

// ❌ WRONG - Removed for "cleanliness"
<button>Submit</button>
```

---

## ⚙️ Implementation Workflow

### **Step 1: Generate Baseline** (Before Changes)

```bash
# Generate component structure snapshot
node scripts/generate-component-baseline.js src/pages/TaskCreationPage.jsx

# Output: docs/baselines/TaskCreationPage.structure.json
```

**Baseline Contains**:
- Component hierarchy tree
- Nesting depth
- Prop types
- Child count per parent
- Semantic element types

### **Step 2: Make Proposed Changes**

Work in a separate branch or file:
```bash
git checkout -b feature/component-refactor
# Make changes...
```

### **Step 3: Analyze Token Usage**

```bash
# Check for hardcoded CSS values
npm run analyze:tokens

# Or check specific files
npm run analyze:tokens src/components/MyComponent.css
```

**Analyzer Detects**:
- Hardcoded `px` values not in token definitions
- Hardcoded color values (`#hex`, `rgb()`, `rgba()`)
- Hardcoded font sizes
- Inline styles in JSX
- CSS literals outside token files

### **Step 4: Generate Delta Report**

```bash
# Compare current state vs baseline
node scripts/compare-component-structure.js \
  --baseline docs/baselines/TaskCreationPage.structure.json \
  --current src/pages/TaskCreationPage.jsx
```

**Output Format**:
```
═══════════════════════════════════════════════════
STRUCTURE Δ REPORT
═══════════════════════════════════════════════════

Added Components:
  + ErrorBoundary (wrapper, depth: 1)
  + LoadingState (conditional, depth: 3)

Removed Components:
  - None

Modified Components:
  ~ StepHeader: props changed (added: icon, removed: badge)

Depth Change: 6 → 7 levels (+1) ✅ ACCEPTABLE

═══════════════════════════════════════════════════
TOKENS Δ REPORT
═══════════════════════════════════════════════════

New Tokens Declared:
  + --shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
  + --shadow-md: 0 4px 6px rgba(0,0,0,0.07)
  + --color-accent-alpha-15: rgba(0,102,204,0.15)

Removed Tokens:
  - None

Modified Token Values:
  ~ --border-radius-card: 8px → 12px

═══════════════════════════════════════════════════
VISUAL Δ REPORT
═══════════════════════════════════════════════════

Spacing Changes:
  ~ .card padding: 16px → clamp(16px, 3vw, 24px) [fluid]
  ~ .section margin-bottom: 24px → 32px [increased]

Color Changes:
  ~ .header background: #f5f5f5 → var(--color-bg-elevated) [tokenized]

Typography Changes:
  + body line-height: 1.5 [added]
  ~ h2 font-size: 20px → clamp(18px, 2vw, 24px) [fluid]

═══════════════════════════════════════════════════
APPROVAL REQUIRED
═══════════════════════════════════════════════════

STRUCTURE Δ: 2 additions, 0 removals ✅ Low risk
TOKENS Δ: 3 new tokens ⚠️ Review token names
VISUAL Δ: 5 changes ⚠️ Verify visual regression

Proceed with merge? [Y/n]
```

### **Step 5: Await Human Approval**

**Approval Criteria**:
- ✅ STRUCTURE Δ = 0 → Auto-approve
- ⚠️ STRUCTURE Δ > 0 → Human review required
- ⚠️ TOKENS Δ > 0 → Verify token naming/necessity
- ⚠️ VISUAL Δ with spacing changes → Screenshot comparison recommended

### **Step 6: Merge or Iterate**

**If Approved**:
```bash
git commit -m "feat(component): refactor per ENH-INFRA-040 delta approval"
git merge feature/component-refactor
```

**If Rejected**:
- Review delta report
- Identify problematic changes
- Iterate and re-submit

---

## 🧩 Repository Structure Additions

### **Required Directories**

```
docs/baselines/
  ├── TaskCreationPage.structure.json
  ├── ProfilePage.structure.json
  └── [component-name].structure.json

scripts/
  ├── generate-component-baseline.js     # Creates structure snapshots
  ├── compare-component-structure.js     # Generates delta reports
  └── analyze-tokens.js                  # Detects hardcoded CSS

docs/architecture/
  └── FIDELITY-REQUIREMENTS.md           # Visual/structural requirements
```

### **NPM Scripts**

```json
{
  "scripts": {
    "baseline:generate": "node scripts/generate-component-baseline.js",
    "baseline:compare": "node scripts/compare-component-structure.js",
    "analyze:tokens": "node scripts/analyze-tokens.js",
    "analyze:tokens:strict": "node scripts/analyze-tokens.js --fail-on-hardcoded",
    "fidelity:check": "npm run analyze:tokens && npm run baseline:compare"
  }
}
```

---

## 🔄 Integration with Existing Protocols

### **Enhanced Protocols**

1. **Sandbox Creation Protocol (SCP-001)**
   - Add: Generate baseline before sandbox creation
   - Add: Include delta report in sandbox README
   - Verify: Sandbox depth matches production (±1 level)

2. **Production-First Development Protocol**
   - Add: Fidelity checks before production merge
   - Add: Token analysis in pre-commit hooks
   - Verify: No hardcoded values in production CSS

3. **Component Safety Analysis Protocol**
   - Add: Structure preservation verification
   - Add: Accessibility lock checks
   - Verify: ARIA attributes maintained

### **Enforcement in CLAUDE.md**

```yaml
🎨 BEFORE modifying component layout → MANDATORY: Generate STRUCTURE/TOKENS/VISUAL Δ report (ENH-INFRA-040)
📐 BEFORE changing spacing/colors → MANDATORY: Check Design Fidelity & Token Efficiency Protocol
🔍 WHEN proposing layout changes → MANDATORY: Await human approval with 3-part delta comparison
🔒 WHEN refactoring components → MANDATORY: Preserve accessibility attributes per R8
```

---

## 📊 Success Metrics

### **Token Efficiency**
- **Target**: ≥95% of CSS declarations use tokens
- **Measurement**: `npm run analyze:tokens`
- **Threshold**: <5% hardcoded values acceptable (for rare edge cases)

### **Hierarchy Fidelity**
- **Target**: Component depth variation ≤1 level
- **Measurement**: `npm run baseline:compare`
- **Threshold**: Depth change >1 requires explicit justification

### **Accessibility Compliance**
- **Target**: 100% ARIA attribute preservation
- **Measurement**: Manual review + automated linting
- **Threshold**: Zero tolerance for removed accessibility features

### **Approval Overhead**
- **Target**: <10% of changes require human approval
- **Measurement**: STRUCTURE Δ > 0 count / total changes
- **Threshold**: If >20% need approval, review automation logic

---

## 🚨 Violation Examples & Fixes

### **Violation 1: Flattened Hierarchy**

```jsx
// ❌ BEFORE (Violation of R1)
<div className="task-creation">
  {/* All 5 steps inline, no sections */}
  <input />
  <input />
  <textarea />
</div>

// ✅ AFTER (Compliant)
<div className="task-creation">
  <section className="step-1">
    <header>Step 1</header>
    <div className="content">
      <input />
    </div>
  </section>
  <section className="step-2">
    <header>Step 2</header>
    <div className="content">
      <input />
      <textarea />
    </div>
  </section>
</div>
```

**Delta Report Would Show**:
```
STRUCTURE Δ:
  - Removed: 5 <section> elements
  - Removed: 5 <header> elements
  - Depth: 6 → 2 levels (-4) ❌ REJECTED
```

### **Violation 2: Hardcoded Values**

```css
/* ❌ BEFORE (Violation of R4) */
.card {
  padding: 20px;
  margin-bottom: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

/* ✅ AFTER (Compliant) */
.card {
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-md);
}
```

**Token Analyzer Would Show**:
```
❌ HARDCODED VALUES DETECTED:
  Line 2: padding: 20px → Use var(--space-lg)
  Line 3: margin-bottom: 15px → Use var(--space-md)
  Line 4: background: #f5f5f5 → Use var(--color-bg-elevated)
  Line 5: border-radius: 8px → Use var(--radius-md)

Token Usage: 0% (0/4 declarations use tokens)
```

### **Violation 3: Removed Accessibility**

```jsx
// ❌ BEFORE (Violation of R8)
<button onClick={handleSubmit}>
  Submit
</button>

// ✅ AFTER (Compliant)
<button
  onClick={handleSubmit}
  aria-label="Submit task for review"
  aria-describedby="submit-help"
  tabIndex={0}
>
  Submit
</button>
<span id="submit-help" className="sr-only">
  Submitting will save your task and notify the assigned team member
</span>
```

**Review Checklist**:
- [ ] aria-label present for context
- [ ] aria-describedby for additional info
- [ ] tabIndex for keyboard navigation
- [ ] Screen reader text available

---

## 🏁 Quick Reference

| Rule | Check | Tool | Threshold |
|------|-------|------|-----------|
| **R1: Hierarchy** | Component depth | `baseline:compare` | ±1 level |
| **R2: Proportions** | Visual regression | Screenshot test | Manual review |
| **R3: Parity** | Tree depth | `baseline:compare` | ±1 level |
| **R4: Tokens** | Hardcoded values | `analyze:tokens` | <5% |
| **R5: Diff** | Delta report | All scripts | Human approval if Δ>0 |
| **R6: Semantic** | Section count | `baseline:compare` | No removal |
| **R7: Import** | Token source | Code review | Import vs inline |
| **R8: A11y** | ARIA attributes | Linter + manual | 100% preservation |

---

## 📚 Related Documentation

- **[Sandbox Creation Protocol (SCP-001)](SANDBOX-CREATION-PROTOCOL.md)** - Isolated component development
- **[Production-First Development Protocol](PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md)** - Ship fast, enhance later
- **[Component Safety Analysis Protocol](COMPONENT-SAFETY-ANALYSIS-PROTOCOL.md)** - Modification safety checks

---

**Protocol ID**: ENH-INFRA-040
**Status**: ✅ Active
**External Validation**: ✅ Collaborator-verified
**Last Updated**: 2025-11-04
**Enforcement**: Automatic via CLAUDE.md + Manual approval workflow
