# 📋 Pre-Cleanup Checklist for Documentation Tasks

**Status**: 📘 **DOCUMENTED BEST PRACTICE** (not technically enforced)

**Purpose**: Establish structured workflow for Claude Code to load governance context before modifying documentation files

**Reality Check**: This checklist requires **human discipline**. Claude Code sessions are stateless and cannot guarantee context loading without user intervention. This is a **best practice workflow**, not an automatic enforcement mechanism.

**Use this at the start of ANY documentation cleanup/modification session**

---

## 🔒 **Mandatory Context Loading Sequence**

Copy-paste this exact sequence to Claude Code:

```
BEFORE we start cleanup, execute this mandatory sequence:

1. Read /mnt/d/GitHub_Repo/Task_Dashboard/Task-Dashboard/CLAUDE.md (lines 1-15)
2. Read /mnt/d/GitHub_Repo/Task_Dashboard/Task-Dashboard/docs/protocols/AGP-001-AGENT-GOVERNANCE-PROTOCOL.md (Section D)
3. Answer: What does DPP-001 say?
4. Answer: What are the 4 content classification categories?
5. Answer: What requires confirmation before deletion?

ONLY after answering all 5 items, proceed with the cleanup task.
```

---

## 🛡️ **Expected Responses (Validation)**

Claude Code should respond with:

**Q3: What does DPP-001 say?**
```
DPP-001 Documentation Preservation Protocol requires:
1. Classify content as: architecture | navigation | operational protocol | verbose enforcement
2. NEVER remove architecture or navigation content
3. ONLY remove procedural/enforcement content duplicated by AGP-001
4. ALWAYS request confirmation before deleting >10 lines
5. If classification uncertain → halt with "DPP-001 UNCERTAIN"
```

**Q4: What are the 4 content classification categories?**
```
1. architecture - System layer explanations, diagrams, structure descriptions
2. navigation - Links, documentation maps, quick references
3. operational protocol - Runtime behavior rules (covered by AGP-001)
4. verbose enforcement - Auto-trigger blocks, mandatory checklists, enforcement YAML
```

**Q5: What requires confirmation before deletion?**
```
- Any deletion >10 lines
- Uncertain classification (halt with "DPP-001 UNCERTAIN")
- Architecture or navigation content (NEVER delete)
- Structural changes to CLAUDE.md, ARCHITECTURE.md, INFRA-OPS-LAYER.md
```

---

## 🚨 **Red Flags (Stop Immediately)**

If Claude Code exhibits these behaviors, HALT the session:

❌ **Skips context loading** - "I'll just start with the cleanup..."
❌ **Doesn't mention DPP-001** - No classification shown before deletion
❌ **Deletes >10 lines without asking** - Protocol violation
❌ **Removes architecture sections** - "This layer explanation is redundant..."
❌ **Guesses classification** - Should halt with "DPP-001 UNCERTAIN" instead

**Recovery**: Re-run the mandatory sequence above.

---

## 📝 **Session Template**

Use this template for documentation cleanup sessions:

```markdown
## Session Start: [YYYY-MM-DD] - [Task Description]

### Pre-Cleanup Validation ✅
- [ ] CLAUDE.md lines 1-15 loaded
- [ ] AGP-001 Section D loaded
- [ ] DPP-001 rules confirmed
- [ ] Classification categories confirmed
- [ ] Confirmation requirements confirmed

### Cleanup Task
[Describe what needs to be cleaned/modified]

### Classification Analysis
File: [file path]
Section: [section name]
Classification: [ ] architecture | [ ] navigation | [ ] operational protocol | [ ] verbose enforcement
Lines affected: [count]
Confirmation needed: [ ] Yes (>10 lines) | [ ] No (<10 lines)

### Execution
- [ ] Classification confirmed with user
- [ ] Deletion approved (if >10 lines)
- [ ] Changes applied
- [ ] Verification complete
```

---

## 🎯 **Example Usage**

**Correct Workflow:**

```
User: "Clean up the Infra-Ops section in CLAUDE.md"

Claude: [Runs mandatory sequence, loads context]

Claude: "DPP-001 loaded. Classification analysis:
- Lines 589-631 (42 lines)
- Content: Three-layer architecture explanation
- Classification: ARCHITECTURE
- Decision: CANNOT remove (DPP-001 Rule 2)
- Alternative: Can I trim verbose conventions while keeping layer descriptions?"

User: "Yes, keep layer descriptions, remove internal conventions"

Claude: "Confirmed. Will remove lines 683-777 (94 lines - internal conventions)
Classification: OPERATIONAL PROTOCOL (covered by AGP-001)
>10 lines deletion - proceeding with your approval."
```

**Incorrect Workflow:**

```
User: "Clean up the Infra-Ops section in CLAUDE.md"

Claude: "I'll remove the verbose Infra-Ops section..."
[Deletes 235 lines including architecture]

❌ PROTOCOL VIOLATION:
- Did not load DPP-001 context
- Did not classify content
- Did not request confirmation
- Removed architecture (Rule 2 violation)
```

---

## 📚 **Related Protocols**

- **AGP-001** - Agent Governance Protocol (operational behavior)
- **DPP-001** - Documentation Preservation Protocol (modification safety)
- **TEP-001** - Token Efficiency Protocol (avoid duplication)
- **AATP-001** - Anti-Agent-Trigger Protocol (no auto-agents)

---

## 🔄 **Version History**

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2025-11-19 | Initial checklist | External Collaborator guidance |

---

**Status**: 📘 DOCUMENTED BEST PRACTICE
**Enforcement**: Requires human discipline - not technically enforced
**Authority**: DPP-001 (AGP-001 Section D)
**Limitation**: Claude Code sessions are stateless - context loading depends on user workflow
