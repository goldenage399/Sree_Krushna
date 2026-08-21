# PRISM Pipeline Comparison Protocol

**Protocol ID**: PRISM-COMP-001
**Status**: Active
**Version**: 1.1 (Pattern B Enforcement Added)
**Created**: 2025-11-22
**Updated**: 2025-11-22 (v1.1 - Pattern B mandatory for external designs)
**Enhancement**: ENH-INFRA-066
**Pattern Family**: BIS-Type (Design Integrity Protocols)

---

## 🚨 **MANDATORY: COMPONENT_SCOPED for External Designs**

**CRITICAL RULE**: All external designs integrated through PRISM pipeline **MUST** use COMPONENT_SCOPED (per-component isolation) semantic classes.

### **COMPONENT_SCOPED Requirements**

```yaml
mandatory_for: "ALL external designs in preview system"
pattern_type: "COMPONENT_SCOPED (per-component isolation)"
naming_convention: "{component-name}__{element}--{modifier}"
css_location: "src/styles/components/preview-{component-name}.css"
import_location: "src/styles/components/index.css"

examples:
  component_name: "proposed-project-classification"
  classes:
    - ".proposed-project-classification__container"
    - ".proposed-project-classification__card"
    - ".proposed-project-classification__button-primary"
    - ".proposed-project-classification__label--section"
```

### **Why COMPONENT_SCOPED is Mandatory**

1. **External Design Isolation**: Prevents changes from affecting other components during review
2. **PRISM Pipeline Requirement**: Per-page isolation reduces error blast radius
3. **Single Context Usage**: External designs used in 1 preview component only
4. **Migration Safety**: Consolidate to SHARED later when 3+ pages show reuse

### **NEVER Do This**

```yaml
❌ wrong:
  pattern: "SHARED (multi-component reusable)"
  classes: [".label-sm", ".input-base", ".btn-primary"]
  reason: "Would affect 40+ existing components in app"

✅ correct:
  pattern: "COMPONENT_SCOPED (per-component isolation)"
  classes: [".proposed-project-classification__label"]
  reason: "Isolated to preview component, safe during review"
```

### **Migration Path**

```yaml
initial: "COMPONENT_SCOPED (per-component, isolated)"
threshold: "3+ pages use same pattern"
action: "Consolidate to SHARED (multi-component, reusable)"
tool: "npm run analyze:utilities (detects cross-page usage)"
```

---

## 🎯 **Purpose**

Define exactly what side-by-side comparisons should show in the PRISM pipeline for external design integration.

---

## 🚨 **Critical Principle - SINGLE JSX, TWO RENDERS**

**A side-by-side comparison in the PRISM pipeline shows THE SAME JSX RENDERED TWICE:**

```yaml
Left Panel:   Same JSX WITHOUT our application-specific Tailwind class transformations
Right Panel:  Same JSX WITH our application-specific Tailwind class transformations
```

**Key Understanding:**
- **SAME JSX CODE** (identical component)
- **SAME TAILWIND CLASSES** (bg-white, px-4, etc.)
- **DIFFERENT RENDERING** because our app transforms Tailwind classes:
  - Left: Pure Tailwind (bg-white stays bg-white)
  - Right: Our app's CSS (bg-white → bg-surface-elevated with sepia overlay)

**Purpose**: See how external design looks BEFORE vs AFTER our app's style transformations

---

## 📊 **The ONLY Comparison Type - Single JSX, Dual Render**

### **External Design: Before vs After App Transformations**

**Purpose**: See how external design looks WITH and WITHOUT our app's Tailwind class transformations

**Left Panel**: 🔒 **Pure Tailwind** (What designer sent)
- Component: External design JSX
- Wrapper: `ThemeIsolationWrapper` (6-layer defense ACTIVE)
- Rendering: Pure Tailwind classes, NO app transformations
- Example: `bg-white` renders as actual white (#ffffff)
- Label: "🔒 PURE TAILWIND (What Designer Sent)"

**Right Panel**: ✨ **With App Transformations** (How it looks in our app)
- Component: SAME IDENTICAL JSX (not a copy, literally the same)
- Wrapper: None
- Rendering: App's Tailwind class transformations ACTIVE
- Example: `bg-white` transformed to `bg-surface-elevated` with sepia overlay
- Label: "✨ WITH APP STYLES (How It Looks In Production)"

**Critical Understanding**:
```jsx
// This is the ONLY component
const ExternalDesign = () => (
  <div className="bg-white px-4 py-2">...</div>
);

// Left panel renders it as:
<ThemeIsolationWrapper>
  <ExternalDesign /> {/* bg-white = #ffffff pure white */}
</ThemeIsolationWrapper>

// Right panel renders SAME component as:
<ExternalDesign /> {/* bg-white transformed by our CSS to sepia-tinted surface */}
```

**What's Different Between Panels?**
- JSX code: IDENTICAL
- Tailwind classes: IDENTICAL
- Rendering: DIFFERENT (because our app transforms Tailwind classes)

**Why Same Component Twice?**
- Shows impact of our app's style transformations
- Left = designer's intent (pure Tailwind)
- Right = production reality (with transformations)
- Helps decide if transformations are acceptable

**Banners**:
```jsx
<Banner type="info">
  <p><strong>Both panels show THE SAME JSX</strong> from the external design</p>
  <p><strong>Left:</strong> Pure Tailwind rendering (no app transformations)</p>
  <p><strong>Right:</strong> Same JSX but our app transforms Tailwind classes</p>
  <p><strong>Purpose:</strong> See if app's style transformations match designer's intent</p>
</Banner>

<Banner type="technical">
  <p><strong>What Our App Transforms:</strong></p>
  <ul>
    <li>Tailwind classes: <code>bg-white</code> → <code>bg-surface-elevated</code></li>
    <li>Color overlays: Sepia/amber filters applied</li>
    <li>CSS variables: Tailwind values → custom properties</li>
    <li>Theme effects: Gradients, shadows, borders enhanced</li>
  </ul>
</Banner>

<Banner type="decision">
  <p><strong>Decision Question:</strong></p>
  <p>Do our app's style transformations (right) maintain designer's intent (left)?</p>
  <p>If NO → Adjust theme system</p>
  <p>If YES → Adopt external design</p>
</Banner>
```

---

## 🛠️ **Implementation Guide**

### **File Naming Convention**

**ONLY ONE PATTERN** (Single JSX, Dual Render):
```
External design:         ProposedProjectClassificationV2.jsx
Isolated wrapper:        ProposedProjectClassificationV2Reference.jsx (wraps with ThemeIsolationWrapper)
Comparison component:    ProposedProjectClassificationV2Comparison.jsx
```

**Key Point**: You DON'T create two separate components. You create:
1. The external design JSX (once)
2. A wrapper that adds ThemeIsolationWrapper
3. A comparison that uses BOTH (isolated + raw)

### **Component Structure**

**Step 1: External Design** (raw JSX from designer)
```jsx
// ProposedProjectClassificationV2.jsx
export default function ProposedProjectClassificationV2() {
  return (
    <div className="bg-white px-4 py-2">
      {/* External design JSX - uses pure Tailwind classes */}
    </div>
  );
}
```

**Step 2: Isolated Reference** (wraps Step 1 with ThemeIsolationWrapper)
```jsx
// ProposedProjectClassificationV2Reference.jsx
import ThemeIsolationWrapper from '../ThemeIsolationWrapper';
import ProposedProjectClassificationV2 from './ProposedProjectClassificationV2';

export default function ProposedProjectClassificationV2Reference() {
  return (
    <ThemeIsolationWrapper>
      <ProposedProjectClassificationV2 />
    </ThemeIsolationWrapper>
  );
}
```

**Step 3: Comparison** (shows both wrapped + raw versions)
```jsx
// ProposedProjectClassificationV2Comparison.jsx
import SideBySideComparison from '../SideBySideComparison';
import ProposedProjectClassificationV2Reference from './ProposedProjectClassificationV2Reference';
import ProposedProjectClassificationV2 from './ProposedProjectClassificationV2';

export default function ProposedProjectClassificationV2Comparison() {
  return (
    <SideBySideComparison
      referenceComponent={<ProposedProjectClassificationV2Reference />} {/* WITH wrapper */}
      themedComponent={<ProposedProjectClassificationV2 />} {/* WITHOUT wrapper */}
      title="External Design: Pure Tailwind vs App Transformations"
      description="Same JSX rendered twice to show impact of our app's Tailwind class transformations"
      referenceLabel="🔒 PURE TAILWIND (Designer's Intent)"
      themedLabel="✨ WITH APP TRANSFORMATIONS (Production Reality)"
      customBanners={<TransformationBanners />}
    />
  );
}
```

---

## 📋 **PRISM Pipeline Integration**

### **Step 4b: Visual Validation**

**Current behavior** (INCORRECT):
```javascript
async step4b_VisualValidation() {
  // Creates: ProposedDesignIsolated vs ProposedDesignThemed
  // Problem: Shows same component twice (educational only)
}
```

**Correct behavior** (Type 1 - Design Review):
```javascript
async step4b_VisualValidation() {
  // Extract current implementation
  const currentImpl = await this.extractCurrentImplementation({
    component: 'ProjectClassification',
    source: 'src/components/TaskCreation/steps/ProjectClassificationStep.jsx'
  });

  // Create comparison with external proposal
  await this.createComparison({
    left: {
      component: currentImpl,
      label: 'CURRENT (Production)',
      themeActive: true
    },
    right: {
      component: this.context.design,
      label: 'PROPOSED (External)',
      themeActive: true
    },
    type: 'DESIGN_REVIEW'
  });
}
```

### **Optional Step 4c: Theme Isolation Demo**

```javascript
async step4c_ThemeIsolationDemo() {
  // ONLY if user wants educational view
  await this.createComparison({
    left: {
      component: this.context.design,
      wrapper: 'ThemeIsolationWrapper',
      label: 'Pure Tailwind (Isolated)',
      themeActive: false
    },
    right: {
      component: this.context.design,
      wrapper: null,
      label: 'With Themes',
      themeActive: true
    },
    type: 'THEME_ISOLATION_DEMO'
  });
}
```

---

## ✅ **Validation Checklist**

Before creating a comparison component, verify:

**For Type 1 (Design Review)**:
- [ ] Left panel shows CURRENT implementation
- [ ] Right panel shows PROPOSED external design
- [ ] Both WITH application themes active
- [ ] Labels clearly state "Current" vs "Proposed"
- [ ] Banners explain this is for decision-making
- [ ] Question framed as: "Should we replace current with proposed?"

**For Type 2 (Theme Isolation Demo)**:
- [ ] Both panels show SAME component
- [ ] Left panel has ThemeIsolationWrapper
- [ ] Right panel has NO wrapper
- [ ] Labels clearly state "Same Component"
- [ ] Banners warn this is educational only
- [ ] Banners explain what gets removed

---

## 🚫 **Anti-Patterns**

### **WRONG: Mixed comparison**
```jsx
// ❌ BAD - Shows proposed design twice
<SideBySideComparison
  referenceComponent={<ProposedIsolated />}
  themedComponent={<ProposedThemed />}
  // Problem: Doesn't show current implementation
  // User can't make informed decision
/>
```

### **WRONG: Mislabeled as design review**
```jsx
// ❌ BAD - Educational demo labeled as decision comparison
<SideBySideComparison
  title="Current vs Proposed" // LYING - both are proposed
  referenceComponent={<ProposedIsolated />}
  themedComponent={<ProposedThemed />}
/>
```

### **CORRECT: Type 1**
```jsx
// ✅ GOOD - Clear design review
<SideBySideComparison
  title="Design Review: Current vs Proposed"
  referenceComponent={<CurrentImplementation />}
  themedComponent={<ExternalProposal />}
  customBanners={<DecisionBanners />}
/>
```

### **CORRECT: Type 2**
```jsx
// ✅ GOOD - Educational demo properly labeled
<SideBySideComparison
  title="Educational: Theme Isolation Effect"
  referenceComponent={<SameComponentIsolated />}
  themedComponent={<SameComponentThemed />}
  customBanners={<EducationalWarningBanners />}
/>
```

---

## 📚 **Related Documentation**

- **Theme Isolation Guide**: `docs/development-guidelines/THEME-ISOLATION-PLUGIN-GUIDE.md`
- **SideBySideComparison**: `docs/components/SIDE-BY-SIDE-COMPARISON-COMPONENT.md`
- **PRISM Pipeline**: `docs/enhancements/ENH-INFRA-066-IMPLEMENTATION-SYNTHESIS.md`
- **Design Integration**: `scripts/design-integration-pipeline.cjs`

---

## 🔄 **Migration Path**

### **If you have Type 2 labeled as Type 1:**

1. **Rename the comparison**:
   ```bash
   mv ProposedDesignComparison.jsx ProposedDesignThemeIsolationDemo.jsx
   ```

2. **Create proper Type 1**:
   ```bash
   # Extract current implementation
   # Create CurrentDesignReference.jsx
   # Create new ProposedVsCurrentComparison.jsx
   ```

3. **Update routes**:
   ```jsx
   // Educational demo
   <Route path="/demo/theme-isolation" element={<ThemeIsolationDemo />} />

   // Actual design review
   <Route path="/review/project-classification" element={<CurrentVsProposedComparison />} />
   ```

4. **Update documentation**:
   - Add warnings to educational demos
   - Add decision questions to design reviews
   - Fix all labels and banners

---

## 🎓 **Summary**

| Aspect | Type 1: Design Review | Type 2: Theme Isolation Demo |
|--------|----------------------|------------------------------|
| **Purpose** | Decide: adopt proposed design? | Educate: how isolation works |
| **Left Panel** | Current implementation | Proposed (isolated) |
| **Right Panel** | External proposal | SAME proposed (themed) |
| **Both Themed?** | YES (fair comparison) | NO (one isolated, one themed) |
| **Decision** | Replace current with proposed? | N/A (educational only) |
| **Label Pattern** | "Current" vs "Proposed" | "Isolated" vs "Themed" |
| **User Action** | Choose which to keep | Learn about isolation |

**Default should be Type 1** - design review is the primary use case.

---

## ✅ **Verification Checklist**

Before creating external design preview components, verify:

- [ ] Component in `src/components/preview/` directory?
- [ ] CSS file created: `src/styles/components/preview-{name}.css`?
- [ ] Classes follow `{component-name}__{element}--{modifier}` pattern (BEM-style)?
- [ ] All CSS values use semantic tokens (DHCP-001 compliant)?
- [ ] CSS imported in `src/styles/components/index.css`?
- [ ] AGP-001 Step 8 validation passes (COMPONENT_SCOPED pattern enforced)?

---

## 📊 **Impact of COMPONENT_SCOPED Enforcement**

**Before**: COMPONENT_SCOPED pattern was optional, leading to SHARED pattern misuse
**Result**: 40+ existing components affected when generic classes like `.label-sm`, `.btn-primary` were modified
**After**: COMPONENT_SCOPED pattern mandatory for external designs, enforced by AGP-001
**Prevention**: Claude Code HALTs if SHARED pattern attempted for preview components

---

## 🔗 **Governance Integration**

This protocol integrates with the broader governance framework:

- **ENH-INFRA-066 Step 4a**: Implements COMPONENT_SCOPED enforcement with runtime HALT mechanism
- **SEMANTIC-CLASS-TRANSITION-FRAMEWORK**: Documents COMPONENT_SCOPED vs SHARED decision matrix
- **AGP-001 Step 8**: Pre-answer validation checks COMPONENT_SCOPED usage for `preview/` components
- **DHCP-001**: Ensures all CSS values use semantic tokens (no hardcoded colors/spacing)

---

**Version**: 1.1
**Last Updated**: 2025-11-23
**Maintained By**: Task Dashboard Team
**Pattern Authority**: ENH-INFRA-066 (PRISM Pipeline)
