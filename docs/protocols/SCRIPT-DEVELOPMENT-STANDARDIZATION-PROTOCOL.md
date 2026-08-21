# Script Development Standardization Protocol

**Protocol ID**: SCRIPT-DEV-001  
**Status**: ⚠️ **MANDATORY** - All script development must follow this protocol  
**Created**: August 2025  
**Scope**: Workspace-wide script development standardization

## 🎯 **Purpose**

Establish consistent, discoverable, and maintainable script development practices across the entire workspace to:
- **Prevent script duplication** through discovery mechanisms
- **Ensure proper documentation** for future developers
- **Organize outputs systematically** for easy management
- **Maintain code quality** through standardized patterns

## 📋 **Mandatory Script Development Checklist**

### **Pre-Development Phase**
- [ ] **Search existing scripts**: Check `scripts/SCRIPT-DISCOVERY-INDEX.md` for similar functionality
- [ ] **Validate necessity**: Confirm no existing solution meets the need
- [ ] **Define clear purpose**: Single responsibility principle
- [ ] **Choose organization pattern**: Purpose-based folder structure

### **Development Phase**
- [ ] **Create purpose folder**: `scripts/[purpose-description]/`
- [ ] **Follow naming convention**: Descriptive, consistent naming
- [ ] **Implement core features**: Robust error handling, progress reporting
- [ ] **Add modularity**: Command-line arguments for flexibility
- [ ] **Include safety measures**: Backups, dry-run modes, rollback capabilities

### **Documentation Phase**
- [ ] **Create README.md**: Comprehensive documentation in script folder
- [ ] **Update discovery index**: Add entry to `scripts/SCRIPT-DISCOVERY-INDEX.md`
- [ ] **Document outputs**: Clear descriptions of generated files
- [ ] **Add troubleshooting**: Common issues and solutions

### **Testing & Integration Phase**
- [ ] **Test in isolation**: Verify functionality before integration
- [ ] **Create examples**: Sample usage with expected outputs
- [ ] **Integration testing**: Verify compatibility with existing systems
- [ ] **Update related docs**: Protocol updates, CLAUDE.md references

## 🗂️ **Standardized Folder Structure**

### **Folder Naming Convention**
```
scripts/
├── [primary-purpose-description]/
│   ├── README.md                    # MANDATORY - Complete documentation
│   ├── [main-script].sh           # Primary functionality
│   ├── [helper-scripts].sh        # Supporting utilities
│   ├── outputs/                   # Generated files directory
│   ├── examples/                  # Usage examples and test data
│   └── archive/                   # Deprecated versions
```

### **Purpose Categories**
- `css-[specific-functionality]` - CSS analysis, optimization, validation
- `ui-[specific-functionality]` - UI testing, component analysis, visual validation
- `build-[specific-functionality]` - Build processes, deployment, CI/CD
- `data-[specific-functionality]` - Data processing, analysis, reporting
- `testing-[specific-functionality]` - Test automation, validation, quality assurance
- `monitoring-[specific-functionality]` - System monitoring, health checks, alerts
- `security-[specific-functionality]` - Security scanning, compliance, validation

## 📚 **Mandatory README.md Template**

```markdown
# [Script Purpose Title]

**Purpose**: [One-line description of what this script does]
**Created**: [Date]
**Status**: [Production/Testing/Development]
**Last Updated**: [Date]

## 🎯 Problem Statement

[Detailed description of the problem this script solves]
[Include context, scope, and impact]

## 📁 Script Contents

### Core Scripts
- `[script-name].sh` - [Description]
- `[helper-script].sh` - [Description]

### Output Files
- `[output-file]` - [Description of contents and format]
- `[report-file]` - [Description of analysis results]

## 🚀 Quick Start Guide

### Basic Usage
```bash
# [Most common usage pattern]
./[script-name].sh [common-args]
```

### Advanced Options
```bash
# [Advanced usage with all options]
./[script-name].sh --option1 value --option2
```

## 📊 Expected Outputs

[Description of all files created, their formats, and interpretation]

## 🔧 Troubleshooting

### Common Issues
- **Issue**: [Description]
  - **Cause**: [Explanation]
  - **Solution**: [Fix]

## 📈 Success Metrics

[How to measure if the script worked correctly]
[Performance indicators and validation criteria]

## 🔗 Related Documentation

[Links to related protocols, documentation, or dependencies]
```

## 🔧 **Standardized Script Features**

### **Mandatory Features**
Every script must include:

```bash
#!/bin/bash

# [SCRIPT PURPOSE DESCRIPTION]
# [Brief description of functionality]
# Created: [Date]
# Last Updated: [Date]

set -e  # Exit on error

# Color definitions for consistent output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Usage function
show_usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --verbose, -v       Verbose output"
    echo "  --dry-run          Preview changes without execution"
    echo "  [specific options]  [descriptions]"
}

# Argument parsing
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h) show_usage; exit 0 ;;
        --verbose|-v) VERBOSE=true; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        *) echo "Unknown option: $1"; show_usage; exit 1 ;;
    esac
done

# Script header with purpose
echo -e "${BLUE}=== [SCRIPT PURPOSE TITLE] ===${NC}"
echo "[Brief description of what this execution will do]"
echo ""
```

### **Progress Reporting Standard**
```bash
# Batch progress reporting
if [ "$((count % batch_size))" -eq 0 ]; then
    echo -e "${YELLOW}📊 Progress: $count/$total processed${NC}"
    echo "   Status: [relevant metrics]"
fi
```

### **Error Handling Standard**
```bash
# Robust error handling
command_with_error_potential || {
    echo -e "${RED}❌ Error: [descriptive message]${NC}"
    echo "💡 Solution: [suggested fix]"
    exit 1
}
```

### **Output Management Standard**
```bash
# Organized output files
OUTPUT_DIR="outputs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$OUTPUT_DIR"

# Clear output file descriptions
echo "📁 Outputs will be saved to:"
echo "  - $OUTPUT_DIR/results-$TIMESTAMP.txt"
echo "  - $OUTPUT_DIR/summary-$TIMESTAMP.json"
```

## 🔍 **Discovery Index Integration**

### **Adding New Scripts**
When creating new scripts, add entry to `scripts/SCRIPT-DISCOVERY-INDEX.md`:

```markdown
### [Purpose Category]
**Location**: `scripts/[folder-name]/`
**Purpose**: [One-line description]

| Script | Purpose | Status | Last Updated |
|--------|---------|--------|--------------|
| `[script-name].sh` | [Description] | ✅ Production | [Date] |

**Key Features**: [List major capabilities]
**Key Outputs**: [List important output files]
```

### **Search Before Create Protocol**
```bash
# Before creating any new script, run:
grep -i "[functionality-keyword]" scripts/SCRIPT-DISCOVERY-INDEX.md

# Example searches:
grep -i "css" scripts/SCRIPT-DISCOVERY-INDEX.md
grep -i "test" scripts/SCRIPT-DISCOVERY-INDEX.md
grep -i "analysis" scripts/SCRIPT-DISCOVERY-INDEX.md
```

## ⚡ **Quality Standards**

### **Code Quality Requirements**
- **Error handling**: All commands must handle failures gracefully
- **Input validation**: Validate all user inputs and file existence
- **Special characters**: Use `grep -F` for literal matching when needed
- **Cross-platform**: Consider macOS/Linux compatibility
- **Performance**: Progress reporting for operations >30 seconds

### **Documentation Quality Requirements**
- **Purpose clarity**: Anyone should understand the script's purpose in 30 seconds
- **Usage examples**: Include realistic usage scenarios
- **Output descriptions**: Clear explanation of all generated files
- **Troubleshooting**: Address common issues and solutions

### **Security Standards**
- **Input sanitization**: Validate and sanitize all inputs
- **Backup creation**: Always create backups before modifying files
- **Rollback capability**: Provide clear rollback instructions
- **Permission checks**: Verify necessary permissions before execution

## 🚀 **Integration with Existing Systems**

### **CLAUDE.md Integration**
New script categories should be referenced in:
- Protocol navigation sections
- Quick reference guides
- Command reference hub

### **Protocol Integration**
Scripts should integrate with existing protocols:
- **Build Verification Protocol**: Automatic `npm run build` testing
- **Safe Automation Protocol**: 4-step safety process
- **Token Optimization Protocol**: Prefer simple tools over complex ones

### **Git Integration**
- **Commit messages**: Include script purpose and impact
- **Branch naming**: `scripts/[purpose-description]`
- **Pre-commit hooks**: Verify documentation completeness

## 📈 **Success Metrics**

### **Adoption Metrics**
- **Script reuse rate**: Measure how often scripts are reused vs recreated
- **Documentation completeness**: All scripts have complete README.md
- **Discovery effectiveness**: Time to find existing scripts vs creating new ones

### **Quality Metrics**
- **Error rates**: Scripts should have <5% failure rate in normal usage
- **Performance**: Progress reporting for all operations >10 seconds
- **Maintainability**: Scripts should be modifiable by any team member

## 🔄 **Maintenance Protocol**

### **Regular Reviews**
- **Monthly**: Update script status in discovery index
- **Quarterly**: Archive unused scripts, update documentation
- **After major system changes**: Verify script compatibility

### **Version Management**
- **Major updates**: Keep previous version in `archive/` folder
- **Breaking changes**: Update all documentation and examples
- **Deprecation**: Clear migration path to replacement scripts

## 💡 **Best Practices Enforcement**

### **Automatic Enforcement**
- **Pre-commit hooks**: Check for README.md presence
- **CI/CD integration**: Verify script documentation standards
- **Linting**: Consistent shell script formatting

### **Peer Review Requirements**
- **All new scripts**: Require peer review before merge
- **Documentation review**: Verify clarity and completeness
- **Testing verification**: Confirm scripts work as documented

---

## 🎯 **Implementation Action Items**

1. **Immediate**: Apply this protocol to all future script development
2. **Short-term**: Retrofit existing scripts to meet standards
3. **Medium-term**: Implement automated enforcement mechanisms
4. **Long-term**: Expand to other development artifacts (configs, templates, etc.)

This protocol ensures consistent, maintainable, and discoverable script development across the entire workspace.