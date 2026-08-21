# Safe Cleanup Checklist & Protocols

## 🚨 **MANDATORY PRE-CLEANUP VALIDATION**

### **☑️ Phase 1: Analysis & Classification (NO DELETIONS)**

**Infrastructure Classification:**
- [ ] **List all scripts/components** to be evaluated
- [ ] **Check documentation dependencies** (search for references in docs/)
- [ ] **Check configuration dependencies** (.claude/settings*.json, package.json)
- [ ] **Classify each item** as Essential Infrastructure vs Complex Automation
- [ ] **Map dependencies** between scripts and components
- [ ] **Estimate token impact** of each item

**Essential Infrastructure Checklist:**
- [ ] Required by documented workflows (conversation-logging.md, CLAUDE.md)
- [ ] Provides basic functionality (file creation, logging, cleanup)
- [ ] Small, focused, single-purpose
- [ ] Referenced by other essential scripts
- [ ] Token-efficient and lightweight

**Complex Automation Checklist:**
- [ ] Large, multi-responsibility systems
- [ ] Background monitoring and health checks
- [ ] Complex state tracking and recovery
- [ ] Token-heavy and resource-intensive
- [ ] Not required by core workflows

### **☑️ Phase 2: Risk Assessment**

**Dependency Analysis:**
- [ ] **Search codebase** for all references to each script/component
- [ ] **Check import statements** in JS/JSX files
- [ ] **Check configuration files** for permissions and hooks
- [ ] **Check documentation** for workflow dependencies
- [ ] **Identify cascade effects** of removal

**Cost-Benefit Analysis:**
- [ ] **Estimate cleanup time** (realistic assessment including testing)
- [ ] **Estimate recovery time** if things go wrong
- [ ] **Calculate token savings** (be conservative)
- [ ] **Compare effort vs benefit** (stop if recovery > savings)
- [ ] **Define success criteria** and exit conditions

### **☑️ Phase 3: Safety Preparation**

**Backup & Rollback Plan:**
- [ ] **Create git branch** for cleanup work
- [ ] **Document current state** (file list, sizes, purposes)
- [ ] **Test rollback procedure** (can you restore easily?)
- [ ] **Identify restore points** for incremental rollback
- [ ] **Set time limits** for each phase

---

## 🔧 **INCREMENTAL CLEANUP EXECUTION**

### **☑️ Phase 4: Progressive Removal (MAX 2 ITEMS PER CYCLE)**

**Single Item Removal:**
- [ ] **Remove only 1-2 items** at a time
- [ ] **Update configuration immediately** after each removal
- [ ] **Test in current environment** before proceeding
- [ ] **Document what was removed** and why
- [ ] **Note any issues encountered** immediately

**Configuration Synchronization (IMMEDIATE):**
- [ ] **Update .claude/settings.local.json** - remove script permissions
- [ ] **Update .claude/settings.working.json** - remove script permissions  
- [ ] **Update .claude/settings.test.json** - remove script permissions
- [ ] **Check hook commands** for deleted script references
- [ ] **Validate JSON syntax** with `python3 -m json.tool`

### **☑️ Phase 5: Immediate Validation**

**Current Environment Testing:**
- [ ] **Test Claude Code settings** with `claude config list`
- [ ] **Check for "invalid settings" warnings** in output
- [ ] **Test essential workflows** (conversation logging, audio notifications)
- [ ] **Run key scripts** to ensure they still work
- [ ] **Check for any error messages** in logs or console

**Fresh Environment Testing:**
- [ ] **Open new terminal** to test configuration loading
- [ ] **Verify no "invalid settings" warnings** appear
- [ ] **Test workflows in fresh environment**
- [ ] **Check that cleanup didn't break anything** essential

### **☑️ Phase 6: Documentation & Commit**

**Documentation Updates:**
- [ ] **Update CLAUDE.md** if infrastructure was affected
- [ ] **Update quick-reference.md** with elimination status
- [ ] **Document rationale** for each removal
- [ ] **Update troubleshooting docs** if new issues discovered
- [ ] **Create issue analysis** if problems occurred

**Clean Commit:**
- [ ] **Stage only cleanup changes** (not unrelated files)
- [ ] **Write clear commit message** describing what was removed and why
- [ ] **Reference issue analysis** if recovery was needed
- [ ] **Test final state** before pushing

---

## 🛡️ **SAFETY STOP CONDITIONS**

### **⚠️ IMMEDIATE STOP TRIGGERS:**

**Stop cleanup if ANY of these occur:**
- [ ] **Essential workflow breaks** (conversation logging, audio notifications)
- [ ] **Configuration validation fails** ("invalid settings" errors)
- [ ] **Recovery time exceeds 1 hour** 
- [ ] **Dependencies more complex than expected**
- [ ] **Uncertain about item classification**
- [ ] **Testing reveals unexpected issues**

### **⚠️ ROLLBACK TRIGGERS:**

**Immediately rollback if:**
- [ ] **Critical functionality broken** 
- [ ] **Settings corruption detected**
- [ ] **Multiple components failing**
- [ ] **Cannot identify root cause quickly**
- [ ] **Recovery effort exceeding optimization benefit**

---

## 📊 **POST-CLEANUP VALIDATION**

### **☑️ Complete System Check:**

**Essential Infrastructure Validation:**
- [ ] **Conversation logging works** (test manual trigger)
- [ ] **Audio notifications work** (test Stop hook)
- [ ] **PPID-based session files** create correctly
- [ ] **No "invalid settings" warnings** in any terminal
- [ ] **All documented workflows** function correctly

**Token Efficiency Validation:**
- [ ] **Measure actual token reduction** in practice
- [ ] **Confirm cleanup goals achieved** 
- [ ] **Document lessons learned**
- [ ] **Update protocols** based on experience
- [ ] **Calculate net benefit** (savings - recovery effort)

### **☑️ Protocol Improvement:**

**Update Protocols:**
- [ ] **Add new safety checks** discovered during cleanup
- [ ] **Update classification criteria** based on experience  
- [ ] **Improve dependency analysis** methods
- [ ] **Refine cost-benefit assessment** accuracy
- [ ] **Document new troubleshooting** procedures

---

## 🎯 **SUCCESS CRITERIA**

**Cleanup is successful ONLY if:**
1. **All essential functionality preserved**
2. **No configuration errors introduced**
3. **Token savings achieved and measurable**
4. **Recovery effort < optimization benefit**
5. **System more maintainable than before**
6. **Clear documentation of changes**

**Cleanup is considered FAILED if:**
1. **Essential infrastructure broken**
2. **Recovery effort exceeds 2 hours**
3. **Configuration becomes unreliable**
4. **Workflows require workarounds**
5. **System becomes less maintainable**