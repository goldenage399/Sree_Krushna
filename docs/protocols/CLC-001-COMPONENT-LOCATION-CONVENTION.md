# CLC-001: Component Location Convention Protocol

**Protocol ID**: CLC-001
**Status**: Active (2025-11-22)
**Version**: 1.0.0
**Authority**: Prevents file location errors and token waste
**Pattern Family**: ISO-Type (Standardization) + NIST-Type (Resource Efficiency)
**Created**: 2025-11-22
**Integration**: AGP-001 Step 1, TEP-001 Step 0b, CLAUDE.md Pre-Flight Checklist

---

## <¯ **Protocol Objective**

Establish **strict directory structure rules** for React components to prevent:
- Component creation in wrong locations
- Route duplication and conflicts
- Token waste from duplicate creation + deletion cycles
- Confusion about component type and purpose

**ROI**: 5,000-15,000 tokens saved per session with component work

---

## =Â **Directory Structure Rules**

### **Component Type ’ Location Mapping**

| Component Type | Location | Route Pattern | Lazy Load | Example |
|----------------|----------|---------------|-----------|---------|
| **Preview/External Designs** | `src/components/preview/` | `/preview/{name}` |  Yes | `ManageUserModalPreview.jsx` |
| **Comparison Views** | `src/components/preview/` | `/preview/{name}-comparison` |  Yes | `ProjectClassificationComparison.jsx` |
| **Reference Components** | `src/components/preview/` | N/A (imported by comparison) | L No | `ProjectClassificationReference.jsx` |
| **Full Page Components** | `src/pages/` | `/{name}` | L No (direct import) | `TaskCreationPage.jsx` |
| **Reusable Utilities** | `src/components/` | N/A (imported everywhere) | L No | `SideBySideComparison.jsx` |
| **Admin Components** | `src/components/admin/` | N/A (imported in admin pages) | L No | `ProfileAssignmentPanel.jsx` |
| **UI Components** | `src/components/ui/` | N/A (design system) | L No | `Button.jsx` |

---

## <× **Naming Conventions**

### **Preview Components**

```yaml
pattern: "{ComponentName}Preview.jsx"
location: "src/components/preview/"
route: "/preview/{component-name}" (kebab-case)
lazy_load: true
import_pattern: |
  const ComponentNamePreview = React.lazy(() =>
    import('./components/preview/ComponentNamePreview')
  );
route_pattern: |
  {import.meta.env.DEV && <Route
    path="/preview/component-name"
    element={<ComponentNamePreview />}
  />}
```

### **Comparison Components**

```yaml
pattern: "{ComponentName}Comparison.jsx"
location: "src/components/preview/"
route: "/preview/{component-name}-comparison"
lazy_load: true
imports: |
  import SideBySideComparison from '../SideBySideComparison';
  import {ComponentName}Reference from './{ComponentName}Reference';
  import {ComponentName}Preview from './{ComponentName}Preview';
usage: |
  <SideBySideComparison
    referenceComponent={<ComponentNameReference />}
    themedComponent={<ComponentNamePreview />}
  />
```

### **Reference Components**

```yaml
pattern: "{ComponentName}Reference.jsx"
location: "src/components/preview/"
route: N/A (imported by comparison component)
lazy_load: false
purpose: "Ground truth baseline for external designs"
theme_isolation: true (wrapped by SideBySideComparison)
```

### **Page Components**

```yaml
pattern: "{ComponentName}Page.jsx"
location: "src/pages/"
route: "/{component-name}" or "/{nested}/{path}"
lazy_load: false (direct import in App.jsx)
import_pattern: |
  import ComponentNamePage from './pages/ComponentNamePage';
route_pattern: |
  <Route path="/component-name" element={<ComponentNamePage />} />
```

---

##  **Pre-Creation Checklist**

### **Before Creating Preview Component**

```bash
# Step 1: Check if exists
ls src/components/preview/ | grep -i "{ComponentName}"
find src/ -name "*{ComponentName}*Preview*" -type f

# Step 2: Check routes
grep -n "{ComponentName}Preview" src/App.jsx

# Step 3: Load component map
cat .cache/component-map.json | jq '.components[] | select(.name | contains("{ComponentName}"))'

# Decision:
# - EXISTS ’ READ first, then EDIT (never Write)
# - NOT EXISTS ’ Verify name, create in src/components/preview/
```

### **Before Creating Comparison**

```bash
# Step 1: Check if preview and reference exist
ls src/components/preview/ | grep -i "{ComponentName}" | grep -E "(Preview|Reference)"

# Step 2: Verify SideBySideComparison utility exists
ls src/components/ | grep -i "SideBySideComparison"

# Step 3: Check comparison routes
grep -n "{ComponentName}Comparison" src/App.jsx

# Decision:
# - MISSING preview/reference ’ Create those first
# - COMPARISON EXISTS ’ READ first, then EDIT
# - ALL READY ’ Create comparison in src/components/preview/
```

### **Before Creating Page Component**

```bash
# Step 1: Verify it should be a page (not preview)
# Ask: Is this for external design testing? ’ Preview
# Ask: Is this a full application page? ’ Page

# Step 2: Check if exists
ls src/pages/ | grep -i "{ComponentName}"

# Step 3: Check routes
grep -n "{ComponentName}Page" src/App.jsx

# Decision:
# - EXISTS ’ READ first, then EDIT
# - NOT EXISTS ’ Create in src/pages/
```

---

## =¨ **Violation Detection**

### **Common Violations**

| Violation | Detection | Correction |
|-----------|-----------|------------|
| **Preview in pages/** | `find src/pages/ -name "*Preview.jsx"` | Move to `src/components/preview/` |
| **Page in preview/** | `find src/components/preview/ -name "*Page.jsx"` | Move to `src/pages/` |
| **Duplicate routes** | `grep -n "path=\"/preview/X\"" src/App.jsx \| wc -l > 1` | Delete duplicate, keep one |
| **Component exists, created anyway** | Created file + existing file with same name | Delete new, edit existing |

### **Retroactive Detection**

After session, check for violations:

```bash
# Find preview components in wrong location
find src/pages/ -name "*Preview.jsx" -o -name "*Comparison.jsx" -o -name "*Reference.jsx"

# Find page components in preview
find src/components/preview/ -name "*Page.jsx"

# Find duplicate lazy imports
grep -n "React.lazy.*{ComponentName}" src/App.jsx | wc -l

# Find deleted files (token waste indicator)
git log --diff-filter=D --summary | grep -i "{ComponentName}"
```

---

## =á **Enforcement**

### **AGP-001 Integration** (Step 1: PreCheck)

```yaml
PreCheck:
  trigger: ["create component", "add preview", "new page"]
  auto_execute:
    - find src/ -name "*{ComponentName}*" -type f
    - ls src/components/preview/ | grep -i "{keyword}"
    - grep -n "{ComponentName}" src/App.jsx
  halt_conditions:
    - component_exists: "MUST Read ’ Edit (skip Write)"
    - routes_exist: "Update existing (skip creation)"
    - wrong_location: "Preview ’ src/components/preview/ (NOT src/pages/)"
  violation_cost: ">5K tokens (duplicate + deletion)"
```

### **TEP-001 Integration** (Step 0b: Pre-Write Validation)

```yaml
step_0b:
  name: "COMPONENT/FILE CREATION PRE-FLIGHT (CLC-001)"
  trigger_keywords:
    - "create component"
    - "add preview"
    - "new page"
    - "side-by-side comparison"
  auto_commands:
    - find src/ -name '*{ComponentName}*' -type f
    - grep -rn '{ComponentName}' src/App.jsx
    - ls -la src/components/preview/ | grep -i '{keyword}'
  halt_if:
    - component_exists: true
    - routes_exist: true
    - wrong_location: true
  decision_tree: |
    Component EXISTS: READ ’ EDIT (skip Write)
    Routes EXIST: Update existing (skip creation)
    Preview file: src/components/preview/
    Page component: src/pages/
    Utility: src/components/
```

### **CLAUDE.md Integration** (Pre-Flight Checklist)

Mandatory checklist at top of CLAUDE.md enforces CLC-001 before any file operations.

---

## =Ê **ROI Analysis**

### **Token Waste Without CLC-001**

```yaml
scenario_1_duplicate_creation:
  action: "Create component without checking if exists"
  steps:
    - Write new component: 2,000 tokens
    - Discover existing component: 200 tokens
    - Delete new component: 100 tokens
    - Edit existing component: 500 tokens
  total: 2,800 tokens
  wasted: 2,100 tokens (75%)

scenario_2_wrong_location:
  action: "Create preview component in src/pages/"
  steps:
    - Write component in wrong location: 2,000 tokens
    - Discover location error: 200 tokens
    - Delete from wrong location: 100 tokens
    - Create in correct location: 2,000 tokens
  total: 4,300 tokens
  wasted: 2,300 tokens (53%)

average_violation_cost: 2,200 tokens
violations_per_session: 2-3
total_waste_per_session: 4,400-6,600 tokens
```

### **Token Savings With CLC-001**

```yaml
pre_flight_check_cost: 200 tokens
prevention_rate: 95%
tokens_saved_per_session: 4,180-6,270 tokens
efficiency_gain: 21x-31x
payback_period: Immediate (first prevention)
```

---

## = **Related Protocols**

- **AGP-001**: Agent Governance Protocol (Step 1: PreCheck integration)
- **TEP-001**: Token Efficiency Protocol (Step 0b: Pre-Write validation)
- **ENH-INFRA-065**: Preview system and theme isolation
- **ENH-INFRA-067**: Component Pre-Flight Validation System (prevention)

---

## =Ú **Documentation References**

- **[PREVIEW-COMPONENT-QUICK-START.md](../development-guidelines/PREVIEW-COMPONENT-QUICK-START.md)** - Preview system setup guide
- **[SIDE-BY-SIDE-COMPARISON-COMPONENT.md](../components/SIDE-BY-SIDE-COMPARISON-COMPONENT.md)** - Comparison component reference
- **[THEME-ISOLATION-PLUGIN-GUIDE.md](../development-guidelines/THEME-ISOLATION-PLUGIN-GUIDE.md)** - Theme isolation system

---

## =Ý **Quick Reference Card**

```
                                                             
 CLC-001: COMPONENT LOCATION QUICK REFERENCE                 
                                                             $
 BEFORE CREATING ANY COMPONENT:                              
                                                              
 1. find src/ -name "*ComponentName*" -type f                
 2. grep -n "ComponentName" src/App.jsx                      
 3. ls src/components/preview/ | grep -i "keyword"           
                                                              
 IF FOUND ’ READ first, then EDIT (never Write)              
                                                              
 LOCATION RULES:                                              
 " Preview/External ’ src/components/preview/                
 " Page Component ’ src/pages/                               
 " Reusable Utility ’ src/components/                        
                                                              
 NAMING:                                                      
 " Preview: {Name}Preview.jsx                                
 " Comparison: {Name}Comparison.jsx                          
 " Reference: {Name}Reference.jsx                            
 " Page: {Name}Page.jsx                                      
                                                              
 VIOLATION COST: 5,000-15,000 tokens wasted                  
                                                             
```

---

**Protocol Owner**: Development Team
**Enforcement**: AGP-001 + TEP-001 + CLAUDE.md
**Compliance**: Mandatory for all component creation operations
**Version History**: v1.0.0 (2025-11-22) - Initial protocol creation
