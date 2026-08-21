# Sandbox Creation Protocol

**Protocol ID**: SCP-001
**Status**: ✅ Production Ready
**Created**: 2025-11-04
**Parent**: Production-First Development Protocol
**Success Case**: ENH-INFRA-037 + ENH-INFRA-038 (TaskCreationCompact)

---

## 🎯 Purpose

This protocol defines the standardized approach for creating **isolated development sandboxes** for pages, components, and features. Sandboxes enable:

- **External collaboration** without production access
- **CSS token validation** in isolation
- **Responsive design testing** without side effects
- **UI/UX prototyping** with mock data
- **Screenshot testing** baseline establishment
- **Bug reproduction** in controlled environment

---

## 📋 When to Create a Sandbox

### ✅ **Recommended Scenarios**

1. **External Collaboration**
   - Need to share component/page with external developers
   - External debugging or code review required
   - Consultant/contractor needs isolated environment

2. **Complex Component Development**
   - Page has multiple contexts/dependencies
   - Component requires extensive mock data
   - Feature needs isolated testing environment

3. **CSS Token Validation**
   - Testing new token system implementation
   - Validating theme consistency
   - Debugging CSS specificity issues

4. **UI/UX Experimentation**
   - Prototyping new designs
   - A/B testing layout variations
   - Responsive design iteration

5. **Production Debugging**
   - Isolating production bugs
   - Reproducing user-reported issues
   - Testing edge cases with controlled data

### ❌ **Not Recommended Scenarios**

- Simple utility components (use Storybook instead)
- One-off debugging (use browser DevTools)
- Components with minimal dependencies
- Internal-only development (use dev environment)

---

## 🏗️ Sandbox Architecture Pattern

### **Standard File Structure**

```
src/sandboxes/{ComponentName}Compact/
├── {ComponentName}Compact.jsx          # Main component (isolated version)
├── {ComponentName}Compact.css          # Component-specific styles
├── {ComponentName}Compact-tokens.css   # Hybrid token system
├── SandboxConfig.js                    # Mock data and constants
├── index.jsx                           # Entry point with ErrorBoundary
├── index.html                          # HTML entry for Vite
├── README.md                           # Comprehensive documentation
└── CollaboratorResponse/               # External feedback (if applicable)
    └── README.md
```

### **Naming Convention**

- **Directory**: `{ComponentName}Compact/` (e.g., `TaskCreationCompact/`)
- **Component**: `{ComponentName}Compact.jsx`
- **CSS Prefix**: `{initials}-` (e.g., `tc-` for TaskCreation Compact)
- **NPM Script**: `dev:{component}-compact` (e.g., `dev:task-compact`)

---

## 🔧 Implementation Phases

### **Phase 1: Setup & Configuration** (~30 min)

#### **1.1 Create Directory Structure**
```bash
mkdir -p src/sandboxes/{ComponentName}Compact
cd src/sandboxes/{ComponentName}Compact
```

#### **1.2 Create SandboxConfig.js**
**Purpose**: Centralize all mock data

```javascript
/**
 * @fileoverview Mock Data Configuration for {ComponentName}Compact Sandbox
 * @enhancement ENH-INFRA-XXX
 */

export const mockUser = {
  id: 'U123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'admin'
};

export const mockData = [
  // Realistic mock data matching production structure
];

export const mockOptions = {
  // Dropdown options, categories, etc.
};

export const defaultState = {
  // Default form/component state
};
```

#### **1.3 Create Hybrid Token System**
**File**: `{ComponentName}Compact-tokens.css`

```css
/**
 * @fileoverview Hybrid Token System for {ComponentName}Compact Sandbox
 * @description Imports base tokens + sandbox-specific overrides
 */

/* Import base modular tokens */
@import url('../../styles/semantic-foundation.css');
@import url('../../styles/design-tokens.css');

/* Sandbox-specific overrides */
:root {
  /* Shadow system */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Alpha tokens */
  --color-accent-alpha-15: rgba(0, 102, 204, 0.15);
  --color-error-alpha-10: rgba(220, 38, 38, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode overrides */
  }
}

/* Print optimization */
@media print {
  :root {
    /* Print-specific tokens */
  }
}
```

#### **1.4 Add NPM Script**
**File**: `package.json`

```json
{
  "scripts": {
    "dev:{component}-compact": "vite --open src/sandboxes/{ComponentName}Compact/index.html"
  }
}
```

---

### **Phase 2: Component Implementation** (~1-2 hours)

#### **2.1 Create Main Component**
**File**: `{ComponentName}Compact.jsx`

**Requirements**:
- ✅ Import mock data from SandboxConfig
- ✅ Use local state (useState) - no contexts
- ✅ All functionality self-contained
- ✅ Computed validation variables
- ✅ Enhanced console logging
- ✅ Proper JSDoc documentation

**Template**:
```javascript
/**
 * @fileoverview {ComponentName}Compact Sandbox
 * @description Isolated version with mock data and no external dependencies
 * @enhancement ENH-INFRA-XXX
 */

import React, { useState } from 'react';
import './{ComponentName}Compact.css';
import { mockData, mockOptions } from './SandboxConfig';

export default function {ComponentName}Compact() {
  const [state, setState] = useState(mockData[0]);

  // Computed validation
  const hasError = /* validation logic */;

  const handleSubmit = () => {
    console.log('📋 Submission:', state);
    console.table(state);
    alert('✅ Data logged to console (F12)');
  };

  return (
    <div className="{prefix}-page">
      {/* Component implementation */}
    </div>
  );
}
```

#### **2.2 Create Component Styles**
**File**: `{ComponentName}Compact.css`

**Requirements**:
- ✅ Use modular tokens exclusively (no hardcoded values)
- ✅ Fluid sizing with `clamp()`
- ✅ 5-breakpoint responsive system (1024/768/480/360/print)
- ✅ 3-tier shadow system
- ✅ Enhanced focus states (`outline-offset: 2px`)
- ✅ Grid protection with `minmax(min(280px, 100%), 1fr)`
- ✅ Overflow protection (`word-break`, `max-height`)
- ✅ Print optimization

**Pattern**:
```css
/* Fluid sizing */
.{prefix}-page {
  padding: clamp(var(--space-md), 5vw, var(--space-2xl));
  max-width: min(1400px, 95vw);
}

/* Responsive grids */
.{prefix}-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
}

/* Enhanced focus */
.{prefix}-button:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

### **Phase 3: ErrorBoundary & Entry Point** (~20 min)

#### **3.1 Create index.jsx with ErrorBoundary**

```javascript
/**
 * @fileoverview Entry Point for {ComponentName}Compact Sandbox
 * @enhancement ENH-INFRA-XXX
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import {ComponentName}Compact from './{ComponentName}Compact';
import './{ComponentName}Compact-tokens.css';

/**
 * ErrorBoundary Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Sandbox Error:', { error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px' }}>⚠️</div>
          <h1>Something went wrong</h1>
          <p>Error logged to console</p>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
          )}
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <{ComponentName}Compact />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
```

#### **3.2 Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{ComponentName}Compact Sandbox</title>
    <meta name="sandbox-mode" content="true" />
    <meta name="enhancement-id" content="ENH-INFRA-XXX" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.jsx"></script>
  </body>
</html>
```

---

### **Phase 4: Documentation** (~30 min)

#### **4.1 Create Comprehensive README.md**

**Required Sections**:
1. Overview & Purpose
2. Quick Start (`npm run dev:{component}-compact`)
3. Features (What's Included / What's Excluded)
4. Production Enhancements (if applicable)
5. CSS Architecture (Hybrid Token System)
6. Testing & Usage (Screenshot testing, Manual checklist)
7. Development Workflow
8. External Collaboration
9. Troubleshooting
10. Acceptance Criteria

**Template**: See `src/sandboxes/TaskCreationCompact/README.md`

#### **4.2 Create CollaboratorResponse/ (if applicable)**

If external collaborator provides feedback:
- Document all identified issues
- List resolutions and integration decisions
- Include verification results
- Mark as "gold standard" if appropriate

---

### **Phase 5: Verification** (~30 min)

#### **5.1 Build Verification**
```bash
npm run build
# ✅ Must pass with no errors
```

#### **5.2 Manual Testing Checklist**

**Core Functionality**:
- [ ] Component renders without errors
- [ ] All interactive elements work
- [ ] Mock data displays correctly
- [ ] Form validation functions
- [ ] Console logging works
- [ ] Submit/Reset buttons functional

**Production Enhancements**:
- [ ] ErrorBoundary catches errors
- [ ] Dark mode toggles with OS preference
- [ ] Shadows visible on all elements
- [ ] Focus states visible (Tab navigation)
- [ ] Responsive on all 5 breakpoints
- [ ] Fluid spacing scales smoothly
- [ ] Overflow handled properly
- [ ] Print preview optimized

#### **5.3 Browser Testing**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (responsive mode)

#### **5.4 Accessibility Testing**
- [ ] WCAG 2.1 AA keyboard navigation
- [ ] Focus indicators on all interactive elements
- [ ] Semantic HTML structure
- [ ] Labels properly associated

---

## 🎨 Production-Ready Enhancements

### **Mandatory Features**

1. **ErrorBoundary** - Crash protection
2. **Hybrid Token System** - Modular + self-contained
3. **Dark Mode** - OS preference detection
4. **5-Breakpoint Responsive** - 1024/768/480/360/print
5. **Fluid Sizing** - clamp() throughout
6. **Shadow System** - 3-tier depth
7. **Enhanced Focus** - WCAG 2.1 AA compliant
8. **Grid Protection** - minmax() wrapping
9. **Overflow Protection** - word-break, max-height
10. **Print Optimization** - Print-friendly styles

### **Optional Enhancements**

- Animations/transitions
- Loading states
- Form validation framework
- i18n support
- Unit tests
- Storybook integration

---

## 📊 Success Criteria

### **Required for "Production Ready" Status**

- [x] ✅ Runs independently with mock data
- [x] ✅ No external dependencies (contexts, Firebase, routing)
- [x] ✅ Uses modular token CSS exclusively
- [x] ✅ ErrorBoundary implemented
- [x] ✅ Dark mode supported
- [x] ✅ Responsive on all 5 breakpoints
- [x] ✅ Build passes with zero errors
- [x] ✅ Comprehensive documentation
- [x] ✅ Ready for external collaboration (zip & share)

### **Optional "Gold Standard" Criteria**

- [ ] External collaborator validation
- [ ] Screenshot test baseline established
- [ ] Accessibility audit passed
- [ ] Performance optimized
- [ ] Unit test coverage >80%

---

## 🚀 Usage Patterns

### **Development Workflow**

```bash
# Start sandbox
npm run dev:{component}-compact

# Test dark mode
# → Toggle OS dark mode in browser DevTools (Cmd+Shift+P → "dark mode")

# Test responsive
# → Resize to 1024px, 768px, 480px, 360px

# Test ErrorBoundary
# → Intentionally throw error in component

# Test print
# → Ctrl+P / Cmd+P
```

### **External Collaboration**

```bash
# Zip sandbox for sharing
cd src/sandboxes
zip -r {ComponentName}Compact.zip {ComponentName}Compact/

# Include dependencies
# - README.md instructions
# - npm run dev:{component}-compact command
# - Node.js version requirements
```

### **Screenshot Testing**

```bash
# Capture all themes
node scripts/batch-screenshots/cli.cjs \
  --type pages \
  --pages {ComponentName}Compact \
  --themes light,dim-dark,sepia,grayscale,velvet-dark
```

---

## 🛡️ Anti-Patterns to Avoid

### ❌ **Don't Do**

1. **Hardcoded CSS values** - Always use tokens
2. **Production dependencies** - No contexts, Firebase, or routing
3. **Inline tokens** - Use hybrid approach (import + override)
4. **Single breakpoint** - Implement all 5 breakpoints
5. **No ErrorBoundary** - Always include crash protection
6. **Fixed sizing** - Use clamp() for fluid responsive
7. **Missing dark mode** - Always support OS preference
8. **No documentation** - Comprehensive README required
9. **Skipping build verification** - Always verify build passes
10. **Ignoring accessibility** - WCAG 2.1 AA minimum

### ✅ **Do**

1. **Hybrid tokens** - Import base + sandbox overrides
2. **Mock data files** - SandboxConfig.js
3. **Computed validation** - Clean JSX
4. **Enhanced logging** - console.table() for objects
5. **Responsive grids** - minmax(min(280px, 100%), 1fr)
6. **Focus states** - outline-offset: 2px
7. **Print styles** - @media print optimizations
8. **Overflow protection** - word-break, max-height
9. **JSDoc comments** - Document enhancement IDs
10. **External validation** - Share with collaborators

---

## 📚 Reference Implementation

**Success Case**: TaskCreationCompact Sandbox
- **Enhancement IDs**: ENH-INFRA-037 (initial) + ENH-INFRA-038 (enhancements)
- **Status**: ✅ Production Ready, Gold Standard
- **External Validation**: ✅ Collaborator-verified
- **Location**: `src/sandboxes/TaskCreationCompact/`
- **Documentation**: Complete with CollaboratorResponse/

**Use as template** for all future sandbox implementations.

---

## 🔄 Integration with Existing Protocols

### **Parent Protocols**
- Production-First Development Protocol
- Safe Automation Protocol
- Build Verification Protocol

### **Related Protocols**
- Component Safety Analysis Protocol
- CSS-JSX Targeting Implementation Protocol
- Screenshot Testing Master Guide

### **Enforcement**
Add to `CLAUDE.md` AUTOMATIC PROTOCOL ENFORCEMENT:

```yaml
🎨 BEFORE creating isolated component/page → MANDATORY: Check Sandbox Creation Protocol (SCP-001)
🏗️ WHEN external collaboration needed → MANDATORY: Follow sandbox creation best practices
📦 WHEN building reusable components → MANDATORY: Consider sandbox for testing/validation
```

---

## 📋 Quick Reference Checklist

### **Pre-Creation**
- [ ] Verify scenario matches "Recommended Scenarios"
- [ ] Check if sandbox is best solution (vs. Storybook, DevTools)
- [ ] Plan mock data structure
- [ ] Identify external dependencies to eliminate

### **Implementation**
- [ ] Create directory structure
- [ ] Implement SandboxConfig.js
- [ ] Create hybrid token system
- [ ] Build main component (isolated)
- [ ] Create component styles (production-ready)
- [ ] Implement ErrorBoundary in index.jsx
- [ ] Create index.html entry point
- [ ] Add npm script to package.json

### **Documentation**
- [ ] Create comprehensive README.md
- [ ] Document all features and exclusions
- [ ] Provide usage instructions
- [ ] Include testing checklists
- [ ] Add troubleshooting section

### **Verification**
- [ ] Run build verification (must pass)
- [ ] Test all core functionality
- [ ] Verify production enhancements
- [ ] Test across browsers
- [ ] Validate accessibility (keyboard nav)
- [ ] Test dark mode
- [ ] Test all responsive breakpoints
- [ ] Test print output

### **Deployment**
- [ ] Commit with enhancement ID
- [ ] Update CLAUDE.md if needed
- [ ] Share with external collaborators (if applicable)
- [ ] Establish screenshot baseline
- [ ] Mark as production-ready

---

## 🎯 ROI & Value Proposition

### **Time Investment**
- Initial creation: ~2.5 hours
- Ongoing maintenance: Minimal (self-contained)

### **Value Delivered**
- External collaboration without production access
- Isolated bug reproduction environment
- CSS token validation platform
- UI/UX prototyping sandbox
- Screenshot testing baseline
- Production enhancement testing ground

### **Long-Term Benefits**
- Reusable patterns for future sandboxes
- External collaborator efficiency
- Reduced production debugging time
- Higher code quality through isolation
- Better documentation practices

---

## ⚠️ **Lessons Learned & Limitations** 🔍 **CRITICAL CONTEXT**

### **🚨 TaskCreationCompact Case Study** (2025-11-04)

The TaskCreationCompact sandbox revealed **critical limitations** of the sandbox approach that led to early retirement in favor of production-first hardening.

#### **Key Findings**

**Gap Analysis**:
- **Production**: ~4,000+ lines across 10 components, 50+ fields, 5-step wizard, 10+ services
- **TaskCreationCompact**: 358 lines, single file, 10 basic fields, zero services
- **Gap**: ~90% of features missing from sandbox

**Effort Analysis**:
- Building sandbox to production parity: **40-60 hours** (rebuilding entire page)
- Using production for hardening: **10-15 hours** (screenshot testing + bug fixes)
- **ROI**: 10x better by focusing on production

#### **What Worked** ✅

1. **CSS Token Testing**: Sandbox excellent for isolated token validation
2. **External Demos**: Simple demos for showing UI concepts without Firebase
3. **Screenshot Baseline**: Good for establishing visual regression baseline
4. **Quick Prototyping**: Fast iteration on small UI changes

#### **What Didn't Work** ❌

1. **Production Debugging**: 90% feature gap made sandbox unusable for real debugging
2. **Duplicate Maintenance**: Two codebases to sync forever (high ongoing cost)
3. **Service Integration**: Mocking 10+ services not practical
4. **Complex State**: Replicating TaskCreationContext reducer = rebuilding production
5. **Firebase Dependencies**: Mocking 8+ collections not cost-effective

#### **Critical Limitations** 🚧

| **Limitation** | **Impact** | **Mitigation** |
|----------------|------------|----------------|
| **Feature Gap** | Sandbox doesn't reflect real production complexity | Use production wrapper sandbox instead (TaskCreationSandbox.jsx) |
| **Divergence Risk** | Sandbox and production drift over time | Keep sandbox minimal or wrap production |
| **Effort to Parity** | Building full-featured sandbox = rebuilding production | Don't attempt parity - use production |
| **Service Mocking** | Complex services hard to mock convincingly | Use real services or minimal sandbox scope |
| **Maintenance Burden** | Two codebases require double the maintenance | Prefer production wrappers over standalone sandboxes |

#### **Better Alternative: Production Wrappers** ✅

**TaskCreationSandbox.jsx** (55 lines):
```jsx
import TaskCreationPage from '../pages/TaskCreationPage';
import _SandboxTemplate from './_SandboxTemplate';

export default function TaskCreationSandbox() {
  return (
    <_SandboxTemplate
      pageName="TaskCreationPage"
      lockedTheme="sepia"
      requiresAuth={true}
    >
      <TaskCreationPage />
    </_SandboxTemplate>
  );
}
```

**Benefits**:
- ✅ **Zero duplication**: Wraps actual production code
- ✅ **Full feature parity**: All 50+ fields, 5-step wizard, all services
- ✅ **Real Firebase**: No mocking required
- ✅ **Zero maintenance**: Production improvements automatically propagate
- ✅ **Perfect for external collaboration**: Isolated environment with full functionality

#### **Revised Recommendations** 📋

**✅ Use Standalone Sandbox When**:
- Component is small (<500 lines total)
- Minimal service dependencies (<3 services)
- Primary goal is CSS token testing or simple prototyping
- NO expectation of production parity

**✅ Use Production Wrapper Sandbox When**:
- Component is large (>1000 lines)
- Complex service dependencies (>3 services)
- Need full feature parity for external collaboration
- Production debugging or realistic testing required

**❌ NEVER Attempt**:
- Building standalone sandbox to match complex production page
- Replicating complex state management (reducers, contexts)
- Mocking extensive service layers
- Maintaining parallel feature sets

#### **Retirement Decision** 🕰️

Despite successful initial implementation (ENH-INFRA-037 + ENH-INFRA-038), the TaskCreation **stepper wizard was retired** (2025-11-04) in favor of compact single-page view, demonstrating that even "production-ready" features may be simplified when better alternatives exist.

**Tag**: `v1.0.0-stepper-retired`
**Savings**: ~35 KB bundle, 549 lines of code
**Rationale**: Simpler UX, faster data entry, better accessibility

**See**:
- [Universal Retirement Protocol](UNIVERSAL-RETIREMENT-PROTOCOL.md) (URP-001)
- [TaskCreation Sandbox vs Production Gap Analysis](../architecture/TASKCREATION-SANDBOX-VS-PRODUCTION-GAP-ANALYSIS.md)

---

**Protocol ID**: SCP-001
**Status**: ✅ Active - with lessons learned applied
**Last Updated**: 2025-11-04
**Success Rate**: 100% (TaskCreationCompact) - but revealed limitations
**Recommended**: Yes - for simple components OR use production wrapper pattern
**Critical Lesson**: Prefer production wrappers over standalone sandboxes for complex pages
