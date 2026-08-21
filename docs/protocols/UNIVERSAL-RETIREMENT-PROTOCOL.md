# Universal Retirement Protocol

**Protocol ID**: URP-001
**Status**: ✅ ACTIVE - Best Practice
**Category**: Infrastructure - Code Lifecycle Management
**Created**: 2025-11-04
**Framework**: Tech-stack agnostic, works across all repositories

---

## 🎯 **Purpose**

Standardizes how we retire (temporarily or permanently) any system, module, or feature while ensuring:
- ✅ **Complete restoration capability** via git references
- ✅ **Machine-parseable documentation** for automation
- ✅ **Cross-repository discoverability** with semantic tagging
- ✅ **Zero information loss** - all context preserved

---

## 📋 **Protocol Components**

### **1. Universal Retirement Comment Block**

Use this exact, structured header anytime something is being deprecated, paused, or retired:

```javascript
/**
 * 🏁 SYSTEM RETIREMENT NOTICE
 * -------------------------------------------------------------------
 * Name: <System or Feature Name>
 * Status: RETIRED / DEPRECATED / TEMPORARILY DISABLED
 * Date: YYYY-MM-DD
 * Responsible Commit: [COMMIT_HASH]
 * Tag: [TAG_NAME]
 *
 * Summary:
 * <Brief description of what was retired and why.>
 *
 * Restore Instructions:
 * - To view the original code: git show <TAG>:<FILE_PATH>
 * - To restore: git checkout <TAG> -- <FILE_PATH>
 * - Or cherry-pick: git show <COMMIT>:<FILE_PATH> > restored.ext
 *
 * Retired Components (if applicable):
 * - <Component 1> - <Description>
 * - <Component 2> - <Description>
 *
 * Rationale:
 * - <Reason 1>
 * - <Reason 2>
 * - <Metrics if applicable (e.g., bundle size reduction)>
 *
 * Related Docs:
 * - CLAUDE.md → Section: Retired Systems
 * - <Any other relevant doc or PR link>
 * -------------------------------------------------------------------
 */
```

**Benefits**:
- Clear, machine-parseable (Claude can detect this block easily)
- Works in any language (comment syntax varies, but body stays the same)
- Self-contained, meaning it can travel with the code or live in history cleanly

---

### **2. CLAUDE.md Integration**

Each repo should maintain a standard section inside `CLAUDE.md`:

```markdown
## 🕰️ **Retired Systems — Git References**

This section tracks all retired, deprecated, or temporarily disabled systems with git references for restoration.

| System | Commit/Tag | Date | Files Affected | Rationale |
|---------|-------------|------|----------------|------------|
| TaskCreation Stepper Wizard | `40381a0` / `v1.0.0-stepper-retired` | 2025-11-04 | `src/components/TaskCreation/TaskCreationWizard.jsx` (852→303 lines) | Compact single-page view validated; simpler UX, faster data entry, better accessibility, ~35KB bundle reduction |
| CSS Toggle System | `abc123` / `v1.0.0-css-toggle-retired` | 2025-XX-XX | `src/pages/TaskCreationPage.jsx` | Modular tokens validated in production |

### **Restoration Commands**

\`\`\`bash
# List all retired systems
git tag --list "*retired"

# View retired code
git show <TAG>:<FILE_PATH>

# Restore a retired system
git checkout <TAG> -- <FILE_PATH>
\`\`\`
```

**Automation Hook**:
Claude Code (or your scripts) can auto-update this table when a retirement notice block is detected in commits.

---

### **3. Git Tagging Convention**

Use consistent, semantically structured tags:

```
v<major>.<minor>.<patch>-<system>-retired
```

**Examples**:
- `v1.0.0-stepper-retired`
- `v1.0.0-css-toggle-retired`
- `v2.3.1-legacy-api-retired`

**Benefits**:
- Quick `git tag --list "*retired"` filtering
- Cross-repo discoverability (agnostic naming)
- Reversible snapshot tagging
- Semantic versioning context

**Creation**:
```bash
# Tag the last commit before retirement
git tag v1.0.0-stepper-retired <COMMIT_HASH>

# Push tag to remote (optional, if using remote git)
git push origin v1.0.0-stepper-retired
```

---

### **4. Retirement Record JSON (For Automation)**

Create a machine-readable file under `/meta/retirements/<system-name>.json`:

```json
{
  "system": "TaskCreation Stepper Wizard",
  "status": "retired",
  "commit": "40381a0",
  "tag": "v1.0.0-stepper-retired",
  "date": "2025-11-04",
  "files": [
    "src/components/TaskCreation/TaskCreationWizard.jsx"
  ],
  "lines_removed": 549,
  "bundle_savings": {
    "raw_kb": 35,
    "gzipped_kb": 9
  },
  "rationale": "Compact single-page view validated; simpler UX, faster data entry, better accessibility, reduced bundle size",
  "restore_ref": "v1.0.0-stepper-retired",
  "restore_commands": {
    "view": "git show v1.0.0-stepper-retired:src/components/TaskCreation/TaskCreationWizard.jsx",
    "restore": "git checkout v1.0.0-stepper-retired -- src/components/TaskCreation/TaskCreationWizard.jsx"
  },
  "retired_components": [
    "renderWizardView() - Full step-by-step wizard interface",
    "PremiumWizardHeader - Premium animated header with step progress"
  ],
  "replacement": {
    "system": "CompactTaskCreationView",
    "path": "src/components/TaskCreation/CompactTaskCreationView.jsx",
    "benefits": [
      "All fields visible at once",
      "Faster data entry",
      "Better accessibility"
    ]
  },
  "documentation": {
    "file_header": "src/components/TaskCreation/TaskCreationWizard.jsx",
    "claude_md": "CLAUDE.md - Section: Retired Systems",
    "related_docs": []
  }
}
```

**Enables automation for**:
- Docs sync
- Retirement summary generation
- AI-based "code archaeology" lookups
- CI/CD integration (prevent accidental usage of retired APIs)

---

## 🔄 **Retirement Workflow**

### **Step 1: Prepare for Retirement**
1. Ensure replacement system is tested and validated
2. Document rationale and metrics (bundle size, complexity reduction, etc.)
3. Identify all affected files

### **Step 2: Create Git Tag**
```bash
# Tag current commit (before making retirement changes)
git tag v1.0.0-<system>-retired <COMMIT_HASH>
```

### **Step 3: Add Retirement Notice**
Replace existing code with retirement notice block in affected files

### **Step 4: Update CLAUDE.md**
Add entry to "Retired Systems — Git References" table

### **Step 5: Create Retirement Record**
Create JSON file in `meta/retirements/<system>.json`

### **Step 6: Verify Build**
```bash
npm run build  # or equivalent build command
```

### **Step 7: Commit Changes**
```bash
git add .
git commit -m "chore: retire <system> (URP-001)

Retired <system> in favor of <replacement>.

Rationale:
- <Reason 1>
- <Reason 2>

Tag: v1.0.0-<system>-retired
Protocol: URP-001 Universal Retirement Protocol"
```

---

## 📊 **Reference Example**

**Real-world implementation**: TaskCreation Stepper Wizard Retirement (2025-11-04)

**Files**:
- Retirement notice: `src/components/TaskCreation/TaskCreationWizard.jsx:1-40`
- CLAUDE.md entry: `CLAUDE.md` → "Retired Systems" section
- Retirement record: `meta/retirements/stepper-wizard.json`
- Git tag: `v1.0.0-stepper-retired` on commit `40381a0`

**Results**:
- ✅ Complete restoration capability preserved
- ✅ 549 lines of code removed (852 → 303)
- ✅ 35 KB bundle size reduction
- ✅ Machine-parseable metadata for automation
- ✅ Clear documentation trail

---

## ✅ **Benefits**

### **For Developers**
- **Zero guesswork**: Clear instructions for restoration
- **Fast discovery**: `git tag --list "*retired"` shows all retired systems
- **Safe retirement**: Nothing is ever truly lost, just archived
- **Context preservation**: Full rationale and metrics preserved

### **For Teams**
- **Consistency**: Same process across all repos and tech stacks
- **Onboarding**: New team members can understand retired systems
- **Code archaeology**: Easy to trace why decisions were made
- **Risk mitigation**: Quick rollback if retirement was premature

### **For Automation**
- **CI/CD integration**: Detect usage of retired APIs automatically
- **Documentation sync**: Auto-update docs when retirements happen
- **Metrics tracking**: Bundle size impact, complexity reduction
- **AI assistance**: Claude can parse and understand retirement context

---

## 🚀 **Protocol Adoption**

### **Mandatory Enforcement**
This protocol is **mandatory** for:
- ❗ Retiring entire systems/modules (e.g., stepper wizard, legacy APIs)
- ❗ Temporarily disabling features (experimental flags, beta features)
- ❗ Deprecating major components (UI frameworks, service layers)

### **Optional but Recommended**
- Individual function deprecations (can use simpler `@deprecated` JSDoc)
- Small utility function removals (if well-tested and low-risk)

### **CLAUDE.md Enforcement**
Add to `CLAUDE.md` automatic protocol enforcement section:

```markdown
🕰️ BEFORE retiring any system/module/feature → MANDATORY: Apply Universal Retirement Protocol (URP-001)
```

---

## 📚 **Related Protocols**

- **[Production-First Development Protocol](PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md)** - Ship fast, enhance later
- **[Safe Automation Protocol](SAFE-AUTOMATION-PROTOCOL.md)** - 4-step safety process for automation
- **[Build Verification Protocol](BUILD-VERIFICATION-PROTOCOL.md)** - Mandatory verification after changes

---

## 🔧 **Template Files**

### **Retirement Notice Template**
See [Section 1](#1-universal-retirement-comment-block) above

### **Retirement Record Template**
```bash
cp meta/retirements/stepper-wizard.json meta/retirements/<new-system>.json
# Edit the JSON file with your system details
```

---

## 📖 **Quick Reference Card**

```bash
# 1. Tag current state
git tag v1.0.0-<system>-retired <COMMIT_HASH>

# 2. Add retirement notice to file(s)
# (Use template from this protocol)

# 3. Update CLAUDE.md
# Add entry to "Retired Systems — Git References" table

# 4. Create retirement record
mkdir -p meta/retirements
# Create <system>.json with metadata

# 5. Verify build
npm run build

# 6. Commit with protocol reference
git commit -m "chore: retire <system> (URP-001)"

# 7. List all retirements
git tag --list "*retired"

# 8. Restore if needed
git checkout v1.0.0-<system>-retired -- <FILE_PATH>
```

---

**Last Updated**: 2025-11-04
**Maintained By**: Development Team
**Status**: Active Best Practice
