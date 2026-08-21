# Design Harmonization Compliance Protocol

**Protocol ID**: DHCP-001
**Status**: ✅ **PRODUCTION READY**
**Created**: 2025-11-06
**Parent Protocols**:
- [Design Fidelity & Token Efficiency Protocol (ENH-INFRA-040)](DESIGN-FIDELITY-TOKEN-EFFICIENCY-PROTOCOL.md)
- [Proto Theme Intelligence Integration](PROTO-THEME-INTELLIGENCE-INTEGRATION.md)
- [Proto Governance UI Implementation Chain](PROTO-GOVERNANCE-UI-IMPLEMENTATION-CHAIN-EXTENSION.md)

---

## 🎯 Purpose

**Unified semantic token compliance framework** ensuring all UI/UX changes maintain architectural consistency with the semantic foundation system.

### Problem Solved
- ❌ Hardcoded values breaking theme systems
- ❌ Inconsistent token usage across components
- ❌ Missing pre-implementation validation
- ❌ Fragmented guidance across multiple protocols

### Solution Provided
✅ **Single source of truth** for semantic token compliance
✅ **Pre-implementation checklist** preventing violations
✅ **Code review standards** with examples
✅ **5-theme validation workflow**
✅ **Proto-command integration** for automated checks

---

## 🛡️ Core Compliance Rules

### **Rule 1: Zero Hardcoded Values** 🚫

**Prohibition**: NEVER use hardcoded pixel, color, or opacity values

**Examples**:
```css
/* ❌ NON-COMPLIANT */
.form-field {
  margin-bottom: 20px; /* Hardcoded */
  background: rgb(245, 241, 235); /* Hardcoded */
  box-shadow: 0 8px 24px rgba(0,0,0,0.08); /* Hardcoded */
}

/* ✅ COMPLIANT */
.form-field {
  margin-bottom: var(--tc-space-5); /* 20px via semantic token */
  background: var(--tc-form-background); /* Theme-aware */
  box-shadow: var(--tc-shadow-md); /* Theme-aware opacity */
}
```

---

### **Rule 2: Semantic Token System** 🎨

**Requirement**: All values MUST use established semantic token system

**Token Categories**:

#### **Spacing Tokens** (`--tc-space-*`)
```yaml
available_tokens:
  --tc-space-0_5: "2px"   # Micro spacing
  --tc-space-1: "4px"     # Extra small
  --tc-space-2: "8px"     # Small
  --tc-space-3: "12px"    # Medium-small
  --tc-space-4: "16px"    # Medium
  --tc-space-5: "20px"    # Medium-large
  --tc-space-6: "24px"    # Large
  --tc-space-8: "32px"    # Extra large
  --tc-space-12: "48px"   # XXL

usage_example:
  field_margins: "var(--tc-space-5) /* 20px consistent spacing */"
  section_padding: "var(--tc-space-6) /* 24px section padding */"
```

#### **Typography Tokens** (`--tc-*`, `--dt-font-size-*`)
```yaml
available_tokens:
  --tc-section-title-size: "Section header size"
  --tc-subsection-title-size: "Subsection header size"
  --tc-body-md: "14px - Standard body text"
  --tc-body-lg: "16px - Large body text"
  --tc-caption: "12px - Small helper text"
  --tc-font-weight-semibold: "600"
  --tc-font-weight-medium: "500"

usage_example:
  headers: "font-size: var(--tc-section-title-size);"
  labels: "font-size: var(--tc-body-md);"
```

#### **Color Tokens with Opacity** (`color-mix()`)
```yaml
requirement: "Use color-mix() for opacity, NEVER rgba() with hardcoded values"

pattern:
  syntax: "color-mix(in srgb, var(--tc-color-*) X%, transparent)"

examples:
  subtle_background: "color-mix(in srgb, var(--tc-priority-high) 5%, transparent)"
  medium_opacity: "color-mix(in srgb, var(--tc-primary) 15%, transparent)"
  border_tint: "color-mix(in srgb, var(--tc-accent) 30%, transparent)"

priority_tokens:
  --tc-priority-low: "Low priority color"
  --tc-priority-medium: "Medium priority color"
  --tc-priority-high: "High priority color"
```

#### **Shadow Tokens** (`--tc-shadow-*`, `--card-shadow`)
```yaml
available_tokens:
  --tc-shadow-sm: "Subtle shadow"
  --tc-shadow-md: "Medium shadow"
  --tc-shadow-lg: "Large shadow"
  --tc-shadow-focus: "Focus state shadow"
  --card-shadow: "Card-specific shadow"

usage_example:
  cards: "box-shadow: var(--tc-shadow-md);"
  modals: "box-shadow: var(--tc-shadow-lg);"
```

#### **Border Tokens** (`--tc-border-*`)
```yaml
available_tokens:
  --tc-border-width-sm: "1px"
  --tc-border-width-md: "1.6px"
  --tc-border-width-lg: "2px"
  --tc-form-border: "Form input borders"
  --theme-border-subtle: "Subtle separator borders"

usage_example:
  inputs: "border: var(--tc-border-width-sm) solid var(--tc-form-border);"
  selected: "border: var(--tc-border-width-lg) solid var(--tc-primary);"
```

---

## 📋 Pre-Implementation Checklist

**Execute BEFORE making any CSS/style changes:**

### **Step 1: Token Identification**
- [ ] Identify target value (e.g., "20px margin", "18px font")
- [ ] Search for appropriate semantic token
- [ ] Check `src/styles/semantic-foundation.css` for token definition
- [ ] Verify token exists across all themes

### **Step 2: Token Verification**
```bash
# Search for existing token
grep -r "tc-space-5\|20px" src/styles/semantic-foundation.css

# Verify theme coverage
grep -r "tc-priority-high" src/tokens/enhanced/*.tokens.js
```

### **Step 3: Fallback Check**
- [ ] Confirm token has fallback value: `var(--tc-space-5, 20px)`
- [ ] Verify fallback won't break theme switching
- [ ] Test with theme toggle before committing

### **Step 4: Documentation**
- [ ] Add inline comment explaining token usage
- [ ] Format: `/* <value> via semantic token - theme-aware */`
- [ ] Include original hardcoded value for context if replacing

### **Step 5: Alternative Path**
**If token doesn't exist:**
```yaml
option_a_use_calc:
  - "Use calc() with existing tokens"
  - "Example: calc(var(--tc-body-md) * 1.286) for 18px"

option_b_create_token:
  - "Create new token in semantic-foundation.css"
  - "Define across all 5 themes"
  - "Document in TOKEN-QUICK-REFERENCE.md"
  - "Requires architecture review"
```

---

## 🔥 CSS Edit Self-Check Protocol (Phase 1a)

**Purpose**: Pre-edit self-check to prevent hardcoded value violations during actual CSS file editing operations.

**Status**: ✅ Active (enforced via CLAUDE.md AUTOMATIC PROTOCOL ENFORCEMENT)

### 🎯 Trigger Points

This protocol activates **BEFORE**:
- Any CSS file Edit operation
- Any CSS file Write operation
- Any CSS property modification

### ✅ Required Pre-Edit Checks (4-Step)

#### **Step 1: Identify Change Type**

Determine which semantic token category applies:

- [ ] **Spacing change?** → Search `--tc-space-*` tokens (e.g., `--tc-space-5` for 20px)
- [ ] **Color/opacity change?** → Use `color-mix()` with theme tokens (e.g., `--tc-priority-high`)
- [ ] **Shadow change?** → Use `--tc-shadow-*` tokens (e.g., `--tc-shadow-md`)
- [ ] **Border change?** → Use `--tc-border-*` tokens (e.g., `--tc-border-width-md`)
- [ ] **Typography change?** → Use `--tc-*` font tokens (e.g., `--tc-font-size-base`)

#### **Step 2: Verify Token Exists**

Confirm the semantic token is defined across all themes:

```bash
# Example: Check if spacing token exists in all themes
grep -r "tc-space-5" src/styles/semantic-foundation.css

# Example: Check if shadow token exists
grep -r "tc-shadow-md" src/styles/semantic-foundation.css
```

**Verification Criteria**:
- [ ] Token appears in at least 5 theme definitions (light, sepia, high-contrast, dim-dark, true-dark)
- [ ] Token has consistent property type across themes (e.g., all spacing tokens use px/rem)
- [ ] If missing → Use **Alternative Path** (see Pre-Implementation Checklist Step 5)

#### **Step 3: Pre-Edit Lint Check**

Run DHCP-001 lint validation BEFORE making changes:

```bash
# Check specific file for existing violations
npm run lint:dhcp -- src/path/to/file.css

# Or check all CSS files
npm run lint:dhcp
```

**Pre-Edit Requirements**:
- [ ] Zero DHCP-001 violations in target file
- [ ] If violations exist → Fix pre-existing issues first
- [ ] Confirm clean baseline before introducing new changes

#### **Step 4: Document Inline**

Prepare inline comment for the CSS change:

```css
/* [computed-value] via semantic token - theme-aware */
```

**Comment Format Rules**:
- Include computed value in comment (e.g., `/* 20px via semantic token */`)
- Always include "theme-aware" flag to signal multi-theme support
- Add fallback value in property: `var(--tc-space-5, 20px)`

**Example**:
```css
.form-field {
  margin-bottom: var(--tc-space-5, 20px); /* 20px via semantic token - theme-aware */
}
```

### 🎯 Expected Outcomes

After completing the 4-step self-check:

- ✅ **Hardcoded value eliminated** - No hex colors, no px values outside tokens
- ✅ **Semantic token identified** - Token exists in `--tc-*` system
- ✅ **Inline comment prepared** - Documentation format ready
- ✅ **Pre-edit lint check passed** - Clean baseline confirmed
- ✅ **Fallback value defined** - Property includes fallback for safety

### 🔗 Integration with CLAUDE.md

This protocol is enforced via CLAUDE.md automatic enforcement rule:

```yaml
🔥 BEFORE any CSS file Edit/Write → MANDATORY: CSS Edit Self-Check Protocol (DHCP-001 Phase 1a)
```

See: [CLAUDE.md - Automatic Protocol Enforcement](../../CLAUDE.md#-automatic-protocol-enforcement)

### 📊 Enforcement Layer Comparison

| Enforcement Layer | Timing | Type | Self-Check Role |
|-------------------|--------|------|-----------------|
| **CSS Edit Self-Check** | During editing | Procedural | ✅ **THIS PROTOCOL** - Earliest gate |
| Suggestion-time | Before proposing changes | Procedural | References this protocol |
| Lint-time | During `npm run lint:dhcp` | Automated | Validates self-check results |
| Pre-commit | Before git commit | Automated (hook) | Final safety net |
| Code Review | During PR review | Manual | Audit trail verification |

**Key Benefit**: Self-check catches violations at the **earliest possible point** (during Edit/Write), before staging, commit, or PR.

---

## 🔍 Code Review Standards

### **Required Comment Format**

```css
/* ============================================
   ✅ SEMANTIC TOKEN COMPLIANT - DHCP-001
   ============================================ */

.form-field {
  margin-bottom: var(--tc-space-5); /* 20px via semantic token - theme-aware */
  position: relative;
}

.priority-label {
  background: color-mix(in srgb, var(--tc-priority-high) 5%, transparent);
  border: var(--tc-border-width-md) solid color-mix(in srgb, var(--tc-priority-high) 30%, transparent);
}
```

### **Violation Examples**

```css
/* ❌ REJECTED - Hardcoded spacing */
.form-field {
  margin-bottom: 20px; /* DHCP-001 violation */
}

/* ❌ REJECTED - Hardcoded rgba */
.priority-label {
  background: rgba(239, 68, 68, 0.05); /* DHCP-001 violation */
}

/* ❌ REJECTED - Hardcoded shadow */
.card {
  box-shadow: 0 8px 24px rgba(0,0,0,0.08); /* DHCP-001 violation */
}
```

---

## 🎨 5-Theme Validation Workflow

### **Requirement**
All changes MUST work correctly across **5 themes** without hardcoded values

### **Theme List**
1. **Light** (default)
2. **Sepia** (earth tones)
3. **Dim Dark** (low-contrast dark)
4. **Grayscale** (monochrome)
5. **Velvet Dark** (high-contrast dark)

### **Validation Steps**

```bash
# Step 1: Start dev server
npm run dev

# Step 2: Navigate to modified component/page
# Example: http://localhost:5173/task-creation

# Step 3: Test theme switching
# Click theme selector → Test all 5 themes

# Step 4: Verify no visual breakage
# - Text remains readable
# - Backgrounds remain visible
# - Borders remain visible
# - Shadows render correctly
```

### **Automated Validation** (Optional)

```bash
# Use proto-command for automated theme compliance check
# (Requires PROTO-THEME-INTELLIGENCE-INTEGRATION.md)

proto- validate theme compliance src/components/TaskCreation/steps/BasicInformationStep.jsx
```

**Expected Output**:
```yaml
theme_compliance_report:
  hardcoded_violations: 0
  token_usage: "100%"
  theme_coverage: "5/5 themes ✅"
  recommended_fixes: []
```

---

## 🔧 Implementation Guidelines

### **Phase-by-Phase Approach**

#### **Phase 1: Discovery & Planning**
1. Identify all hardcoded values in target file
2. Map each value to appropriate semantic token
3. Document token mapping in enhancement/issue
4. Get architecture review if creating new tokens

#### **Phase 2: Token Replacement**
1. Replace hardcoded values one category at a time:
   - Spacing first (lowest risk)
   - Colors second (medium risk)
   - Shadows/borders last (lowest impact)
2. Test after each category replacement
3. Commit incrementally for easy rollback

#### **Phase 3: Validation**
1. Run build verification: `npm run build`
2. Test theme switching manually
3. Run automated validation if available
4. Screenshot comparison (before/after)

#### **Phase 4: Documentation**
1. Update enhancement tracker with completion
2. Add inline comments for complex token usage
3. Document any new tokens created
4. Update TOKEN-QUICK-REFERENCE.md if needed

---

## 🤖 Automated Enforcement

### **Stylelint Integration** ✅ **PRODUCTION ACTIVE**

**Configuration**: `.stylelintrc.dhcp-001.json`

**What it catches**:
- ❌ Hardcoded px/rem values in spacing properties
- ❌ Hardcoded hex/rgb/rgba colors
- ❌ Non-semantic token usage

**Usage**:
```bash
# Check all CSS files for DHCP-001 compliance
npm run lint:dhcp

# Auto-fix violations where possible
npm run lint:dhcp:fix
```

### **Pre-Commit Hook** ✅ **AVAILABLE**

**Hook**: `.husky/pre-commit-dhcp-001`

**Behavior**:
- Automatically runs on `git commit`
- Only checks **staged CSS files**
- **Blocks commit** if violations detected
- Provides helpful error messages with fixes

**Installation**:
```bash
# Add to existing pre-commit hook
echo "bash .husky/pre-commit-dhcp-001" >> .husky/pre-commit

# Or run manually
bash .husky/pre-commit-dhcp-001
```

**Complete Documentation**: [.husky/README.md](../../.husky/README.md)

---

## 🚀 Proto-Command Integration

### **Available Commands**

```bash
# Validate theme compliance
proto- validate theme compliance [target-file]

# Audit semantic token usage
proto- audit semantic tokens [component]

# Scan for hardcoded violations
proto- discover hardcoded values [directory]

# Generate token migration plan
proto- plan token migration [component]

# NEW: Automated lint check
npm run lint:dhcp
npm run lint:dhcp:fix
```

**Reference**: [PROTO-THEME-INTELLIGENCE-INTEGRATION.md](PROTO-THEME-INTELLIGENCE-INTEGRATION.md)

---

## 🔄 Phase 2: Utility Class Consolidation Framework

**Status**: ⚡ **ACTIVE ENHANCEMENT GUIDE**
**Purpose**: Systematic migration of repeated Tailwind utility combinations to semantic CSS classes
**Scope**: ONE-TIME codebase-wide consolidation (not for new code)
**Implementation Guide**: [SEMANTIC-CLASS-TRANSITION-FRAMEWORK.md](../architecture/SEMANTIC-CLASS-TRANSITION-FRAMEWORK.md)

### **When Phase 2 Applies**

**Triggers**:
- Repeated utility combinations (5+ occurrences across codebase)
- Complex utility chains (8+ classes in single className)
- Component-specific design patterns used in multiple files
- Codebase-wide design system refactoring initiatives

**NOT Triggered By**:
- New component creation (use Phase 1 semantic tokens directly)
- One-off layouts (keep inline utilities)
- Simple utility combinations (1-2 classes)

### **Phase 1 vs Phase 2 Decision Matrix**

| Scenario | Use Phase 1 (Semantic Tokens) | Use Phase 2 (Class Consolidation) |
|----------|------------------------------|-----------------------------------|
| **New component** | ✅ Use `var(--tc-space-5)` directly | ❌ Not applicable |
| **Existing code: 3 instances** | ✅ Replace hardcoded values with tokens | ❌ Keep inline utilities |
| **Existing code: 10+ instances** | ✅ Replace hardcoded values | ✅ **ALSO consolidate to semantic class** |
| **Complex utility chain** | ✅ Use semantic tokens | ✅ **Create semantic CSS class** |

### **Phase 2 Quick Reference**

**Candidate Selection** (from SEMANTIC-CLASS-TRANSITION-FRAMEWORK.md):
```yaml
high_priority_candidates:
  - Repetition: Used in 5+ places
  - Design coupling: Tightly coupled to design tokens
  - State variants: Multiple states (hover, active, disabled)
  - Responsive: Different styles across breakpoints
  - Theming: Adapts to theme changes
  - Composite: 5+ utility classes combined

quick_wins_examples:
  buttons: "47 occurrences → .btn-primary (4 hours)"
  cards: "32 occurrences → .card-elevated (3 hours)"
  badges: "28 occurrences → .badge-success (2 hours)"
  form_inputs: "41 occurrences → .input-base (5 hours)"
```

**Workflow**:
1. **Audit**: Run `npm run analyze:repeated-utilities` (from framework)
2. **Prioritize**: Use priority matrix (High Impact + Low Effort first)
3. **Create Semantic Class**: Follow naming convention `[component]-[variant]-[state]`
4. **Migrate**: Use automated script `npm run migrate:utilities`
5. **Validate**: 5-theme testing + visual regression

**Complete Guide**: See [SEMANTIC-CLASS-TRANSITION-FRAMEWORK.md](../architecture/SEMANTIC-CLASS-TRANSITION-FRAMEWORK.md) for:
- Detailed transition process (Phase 1-3)
- Migration automation scripts
- Implementation roadmap
- Success metrics
- ESLint enforcement rules

---

## 📚 Related Protocols & Documentation

### **Parent Protocols**
- [Design Fidelity & Token Efficiency Protocol](DESIGN-FIDELITY-TOKEN-EFFICIENCY-PROTOCOL.md) - R2, R4 rules
- [Proto Theme Intelligence Integration](PROTO-THEME-INTELLIGENCE-INTEGRATION.md) - Theme validation
- [Proto Governance UI Implementation Chain](PROTO-GOVERNANCE-UI-IMPLEMENTATION-CHAIN-EXTENSION.md) - Implementation tracking

### **Reference Documentation**
- **[ENH-UI-041 Semantic Foundation Master](../ui-compliance/SEMANTIC-FOUNDATION-MASTER.md)** - Complete semantic token system
- **[TOKEN-QUICK-REFERENCE.md](../tokens/TOKEN-QUICK-REFERENCE.md)** - Token quick lookup (if exists)
- **[Enhanced Themes CSS](../../src/styles/enhanced-themes.css)** - Theme definitions
- **[SEMANTIC-CLASS-TRANSITION-FRAMEWORK.md](../architecture/SEMANTIC-CLASS-TRANSITION-FRAMEWORK.md)** ⚡ **ENHANCEMENT GUIDE** - Codebase-wide utility consolidation

### **Example Implementation**
- **[ENH-UI_QUALITY-20251106](../enhancements/ENH-UI_QUALITY-20251106-TASKCREATION-PHASE3-ENHANCEMENTS.md)** - Phase 3b compliance section

---

## ✅ Success Criteria

### **Component-Level**
- [ ] Zero hardcoded px/rem values
- [ ] Zero hardcoded rgb/rgba colors
- [ ] Zero hardcoded opacity values
- [ ] All spacing uses `--tc-space-*` tokens
- [ ] All colors use `color-mix()` with semantic tokens
- [ ] All shadows use `--tc-shadow-*` tokens
- [ ] Inline comments document token usage

### **Project-Level**
- [ ] Works across all 5 themes
- [ ] Build passes: `npm run build`
- [ ] No theme-switching visual breakage
- [ ] Token usage documented in enhancement
- [ ] Proto-validation passes (if applicable)

---

## 🎯 Quick Reference Card

```yaml
# Quick Token Lookup
spacing: "var(--tc-space-5) /* 20px */"
typography: "var(--tc-body-md) /* 14px */"
color_opacity: "color-mix(in srgb, var(--tc-primary) 15%, transparent)"
shadows: "var(--tc-shadow-md)"
borders: "var(--tc-border-width-sm)"

# Pre-Flight Checklist
- [ ] Token identified
- [ ] Token verified in semantic-foundation.css
- [ ] Fallback defined
- [ ] Comment added
- [ ] 5-theme tested

# Validation Commands
proto- validate theme compliance [file]
npm run build
# Manual theme toggle test
```

---

## 📊 Compliance Tracking

**Protocol Version**: 2.0 (Phase 2 added 2025-11-21)
**Enforcement**: MANDATORY for all UI/UX enhancements
**Applies To**:
- **Phase 1**: All new code (ENH-UI-* enhancements, component creation, CSS refactoring)
- **Phase 2**: Codebase-wide utility consolidation enhancements (5+ occurrences)

**First Implementation**: ENH-UI_QUALITY-20251106 Phase 3b
**Status**: ✅ Production Ready
**Last Updated**: 2025-11-21

---

## 📝 Version History

| Version | Date | Change | Impact |
|---------|------|--------|--------|
| 1.0 | 2025-11-06 | Initial protocol - semantic token compliance | Phase 1 only |
| 2.0 | 2025-11-21 | Added Phase 2 - utility class consolidation framework | Codebase-wide migration support |

---

*This protocol consolidates semantic token compliance guidance (Phase 1) and utility class consolidation strategy (Phase 2) into a unified framework. For questions or protocol updates, reference parent protocols or consult project architecture documentation.*
