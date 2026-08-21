# AGP-002 Enforcement Checklist

**Protocol:** AGP-002 — Autonomous Debugging Protocol (Balanced Hybrid Mode)
**Version:** 1.1
**Status:** Production Ready
**Purpose:** Pre-investigation validation and compliance verification

---

## 🎯 **Purpose**

This checklist ensures AGP-002 compliance before and during debugging investigations. Use this to verify:
- Investigation triggers are valid
- Scope is appropriate
- Token budgets are respected
- Approval gates are properly handled
- Evidence is collected
- Safety limits are enforced

---

## 📋 **Pre-Investigation Checklist**

### **Section 1: Trigger Validation** ✅

Run this checklist when debugging issues or inconsistencies:

```yaml
□ Data mismatch detected across pages/components/services?
□ Query returns fewer documents than expected?
□ UI data inconsistent with Firestore console?
□ Missing or unhelpful logs detected?
□ Multiple modules use same Firestore collection?
□ Cache/context may affect data visibility?

If ANY checked → AGP-002 investigation authorized
```

**Example Scenarios:**
- ✅ TaskCreationPage shows 5 profiles, ProfileManagement shows 12
- ✅ Firestore query returns 0 results when expecting 10+
- ✅ User asks for logs that don't exist in code
- ✅ Profile count differs between header and list
- ❌ Simple typo in variable name (not an AGP-002 trigger)
- ❌ Known limitation documented in code (not an investigation)

---

### **Section 2: Escalation Level Determination** 📊

Determine appropriate escalation level before starting:

```yaml
LEVEL 1: Local Investigation (~500 tokens, auto-proceed)
□ Issue isolated to single file?
□ No cross-layer dependencies suspected?
□ Immediate imports are sufficient context?
→ Proceed with Level 1

LEVEL 2: Cross-Layer Investigation (~2K tokens, auto-proceed)
□ Issue involves UI → Context → Service chain?
□ Data flow tracing needed?
□ Single page/component affected?
→ Proceed with Level 2

LEVEL 3: Cross-Module Investigation (~3-5K tokens, requires approval)
□ Multiple pages/components show different results for same data?
□ Need to compare queries across modules?
□ Firestore rules/schema investigation needed?
□ Token estimate >2K?
→ Show investigation declaration, request approval

LEVEL 4: Comprehensive Repo Scan (~5K+ tokens, requires override)
□ System-wide issue suspected?
□ Architectural pattern validation needed?
□ Token estimate >5K?
→ Offer cache-based alternatives, require explicit override
```

---

### **Section 3: AGP-001 Compliance Check** 🔧

Verify AGP-002 operates within AGP-001 framework:

```yaml
□ Cache check completed (Step 1: PreCheck → .cache/research-map.json)?
□ Freshness validated (Step 2: FreshnessCheck → maps <7 days old)?
□ Intent parsed (Step 3: QueryIntake)?
□ AATP-001 gate passed (Step 4: No subagent launches)?
□ Using direct tools only (Read, Grep, Glob, Bash)?
□ No autonomous agent launches planned?

All must be ✅ to proceed with AGP-002 investigation
```

---

### **Section 4: Token Budget Pre-Check** 💰

Estimate token cost before investigation:

```yaml
Estimated files to read: ___ files
Estimated layers: ___ layers (UI/Context/Service/Rules/Schema/Cache)
Estimated token cost: ___ tokens

Token Budget Validation:
□ <500 tokens → Level 1, auto-proceed
□ 500-2K tokens → Level 2, auto-proceed
□ 2-5K tokens → Level 3, show declaration + require approval
□ >5K tokens → Level 4, offer cache alternatives + require override

If >2K tokens:
□ Investigation declaration prepared?
□ File list ready to show user?
□ Token estimate displayed?
□ User approval requested?
```

**Investigation Declaration Template:**
```
🔍 Level 3 Investigation Triggered

Issue: [Brief description]
Scope: Will read [N] files across [modules/layers]
Estimated tokens: ~[X]K

Files to examine:
  - [file 1]
  - [file 2]
  ...

Proceed? (Y/n)
```

---

## 🔍 **During-Investigation Checklist**

### **Section 5: Layer Walkthrough Compliance** 🏗️

Ensure systematic investigation across all relevant layers:

```yaml
UI Layer Investigation:
□ Component located and inspected?
□ Props, hooks, useEffect dependencies checked?
□ Component-level filtering examined?
□ Data transformations (map, filter, sort) reviewed?

Context Layer Investigation:
□ State management located (Context/Redux/Zustand)?
□ Reducers and actions inspected?
□ Silent filters detected (level-based, role-based)?
□ Memoization and derived state checked?

Service Layer Investigation:
□ Firestore query definitions located?
□ All queries touching same collection identified?
□ orderBy, where, limit clauses compared?
□ Caching or memoization examined?
□ Utility services (ProfileUserMappingService) checked?

Firestore Query Comparison:
□ Comparison matrix built (page → query → orderBy → filters)?
□ Differences identified (orderBy fields, where clauses)?
□ Composite index requirements checked?

Firestore Rules Investigation:
□ Rules for target collection inspected?
□ Path patterns and access logic compared?
□ Level-based access requirements verified?
□ Field existence requirements in rules checked?

Document Schema Investigation:
□ Sample documents checked for missing fields?
□ Undefined/null values detected?
□ Inconsistent data types identified?
□ Documents without required fields cataloged?

Cache Layer Investigation:
□ localStorage/sessionStorage checked?
□ Service-level caches examined (ProfileUserMappingService)?
□ Context-level memoization inspected?
□ Cached vs live Firestore data compared?
```

---

### **Section 6: ACVP-001 Compliance** 🔐

**CRITICAL:** When user states architectural facts, verify independently:

```yaml
Architectural Claim Detected:
□ User stated fact about required fields, schema, relationships, or business rules?
□ Acknowledge claim: "Let me verify that from the architecture..."
□ Search for evidence in order:
  1. □ firestore.rules (security rules encode requirements)
  2. □ Schema definitions (src/schemas/, TypeScript interfaces)
  3. □ Validation services (Services with "Validation" in name)
  4. □ Architecture docs (docs/AUTHENTICATION.md, docs/TASK-MANAGEMENT.md)
  5. □ Service layer (query definitions, data transformations)

Evidence Classification:
□ ✅ Confirmed → Provide file:line + code snippet + explanation
□ ⚠️ Cannot Verify → State what was checked, ask if should add validation
□ ❌ Conflict → Present code reality vs claim, ask which is correct

Forbidden Phrases (without citation):
□ NEVER: "Yes, exactly"
□ NEVER: "That's correct"
□ NEVER: "As you mentioned"
□ NEVER: "Right, profiles need levels"
□ NEVER: "You're absolutely right"

Required Phrases:
□ ALWAYS: "Verified in `<file>:<line>`"
□ ALWAYS: "Confirmed from `<source>`"
□ ALWAYS: "Cannot independently confirm, proceeding on your guidance"
□ ALWAYS: "Code shows `<reality>`, which conflicts with `<claim>`"
```

**ACVP-001 Example:**
```
❌ PROHIBITED:
User: "Profiles MUST have levels"
Claude: "Yes, exactly - profiles need levels."

✅ REQUIRED:
User: "Profiles MUST have levels"
Claude: "Let me verify that from the architecture...

🔍 Checking firestore.rules, ProfileService.js, schema docs...

✅ Confirmed from firestore.rules:167:
[code snippet]

Architectural requirement verified: Profiles MUST have level field.
Used by: Access control, hierarchy enforcement, filtering"
```

---

### **Section 7: Automatic Fallback Checks** 🔄

When results still don't make sense, automatically test:

```yaml
Alternate Query Variants:
□ Tested query without orderBy?
□ Tested query without where clauses?
□ Tested basic collection() without filters?

Field Existence Validation:
□ Iterated through documents to detect missing fields?
□ Cataloged which fields are missing in which documents?

Rules Simulation:
□ Compared read rules vs actual user access?
□ Checked if level-based filtering in rules?
□ Verified field existence requirements?

Admin SDK Simulation:
□ Reasoned about admin SDK behavior (structure-based)?
□ Explained what admin SDK would return vs client SDK?

Cross-Page Comparison:
□ Re-scanned all modules loading same data?
□ Built comparison matrix across pages?
□ Identified query definition differences?
```

---

### **Section 8: Evidence Collection** 📚

For every claim in root cause analysis:

```yaml
File Path + Line Number:
□ Every code reference includes file:line format?
  Example: firestore.rules:167, ProfileService.js:45

Code Snippet:
□ Relevant code snippet provided for each claim?
□ Snippet shows exact issue/behavior?

Reasoning:
□ Explanation connects code to symptom?
□ Causality clearly established?
□ Evidence supports conclusion?

Example Evidence Block:
```javascript
// ProfileService.js:45
export const getProfiles = () => {
  return query(collection(db, 'profiles'), orderBy('level'));
};

Reasoning: This query uses orderBy('level'), which excludes
profiles without level field (Firestore behavior).
```
```

---

### **Section 9: Safety Limits Enforcement** ⚠️

Monitor and enforce safety limits during investigation:

```yaml
File Count Monitoring:
□ Current files read: ___ / 20 max
□ If >10 files: Show progress indicator?
□ If >20 files: HALT and show options?

Layer Depth Monitoring:
□ Current depth: ___ / 3 max layers
□ If >3 layers: Justification provided for expansion?

Token Budget Monitoring:
□ Current tokens: ___ / 2K budget (without approval)
□ If >1.5K tokens: Warning displayed?
□ If >2K tokens: HALT and request approval?
□ If >5K tokens: ABORT and show alternatives?

Investigation Time:
□ Investigation running >30s: Status update shown?

Scope Boundaries:
□ Investigating only related modules?
□ Justification provided for unrelated module investigation?
□ User approval obtained for scope expansion?
```

**Limit Exceeded Actions:**

**20 File Limit Reached:**
```
⚠️ Investigation limit reached (20 files)

Options:
1. Provide preliminary analysis with current findings
2. User specifies next 5 files (targeted expansion)
3. User authorizes comprehensive scan (remove limit)

Select option: _
```

**2K Token Budget Exceeded:**
```
⚠️ Exceeding token budget (2.3K estimated)

Options:
1. Proceed with investigation (requires approval)
2. Use cached maps instead (~500 tokens)
3. Narrow scope to 3 critical files (~1.2K tokens)

Select option: _
```

**5K Token Hard Limit:**
```
🚫 Cannot proceed - exceeds TEP-001 5K hard limit

Alternatives:
1. Targeted scan (UI + Service only) - ~2.5K tokens
2. Cache-based analysis (component-map.json) - ~600 tokens
3. Split investigation into 2 sessions

Select option: _
```

---

## 📊 **Post-Investigation Checklist**

### **Section 10: Output Format Validation** ✅

Verify output meets AGP-002 requirements:

```yaml
Root Cause Report:
□ Table format used (Layer | File | Symptom | Root Cause | Evidence)?
□ Every row has all columns filled?
□ Evidence column includes file:line references?

Multi-Hypothesis Elimination:
□ Multiple hypotheses listed and tested?
□ Each hypothesis marked ✅ confirmed or ❌ eliminated?
□ Evidence provided for each conclusion?
□ Root cause clearly identified?

Proposed Patch:
□ File path specified?
□ Before/after diff shown?
□ Explanation of change provided?
□ Recommendation with rationale?
□ Files affected count listed?
□ Breaking changes noted?
□ Migration requirements specified?
```

**Output Format Example:**
```markdown
## Root Cause Analysis

| Layer | File | Symptom | Root Cause | Evidence |
|-------|------|---------|------------|----------|
| Service | ProfileService.js:45 | Returns 5 profiles | orderBy('level') excludes docs without level | Query definition |

## Hypothesis Testing

1. ❌ UI bug → Eliminated by: No filter logic in component
2. ✅ Service bug → Confirmed by: orderBy('level') behavior

## Proposed Fix

**File:** src/services/ProfileService.js
**Recommendation:** Option 2 (in-memory sort)
**Rationale:** Handles missing fields gracefully
```

---

### **Section 11: Approval Gate Compliance** 🚪

Verify approval gate is properly presented:

```yaml
Approval Gate Presentation:
□ Clear separation (--- line) before approval section?
□ "Approval Required" header shown?
□ Options clearly numbered (1, 2, 3, 4)?
□ Explicit phrases specified ("Apply Option 1", "Cancel")?
□ No auto-application logic present?

User Response Handling:
□ Explicit approval phrases recognized?
  ✅ "Apply the patch", "Proceed", "Implement this", "Go ahead"
□ Rejection phrases recognized?
  ❌ "Cancel", "Don't apply", "Wait", "Not yet"
□ Ambiguous responses handled?
  ⚠️ "Looks good" → Request clarification
  ⚠️ "Sounds reasonable" → Request explicit confirmation

No Timeout:
□ CONFIRMED: No automatic application after N seconds?
□ CONFIRMED: Waits indefinitely for explicit approval?
```

**Approval Gate Example:**
```markdown
---

## Approval Required

Proposed patch ready. Shall I:
1. **Apply Option 2** (in-memory sort, handles missing fields)
2. **Apply Option 1** (remove orderBy, use name sorting)
3. **Modify the approach** (specify changes)
4. **Cancel** (don't apply any changes)

Reply with: "Apply Option 1" / "Apply Option 2" / "Modify: <description>" / "Cancel"
```

---

### **Section 12: Protocol Integration Verification** 🔗

Ensure integration with other protocols:

```yaml
BVP-001 (Build Verification):
□ After approved changes, plan to run `npm run build`?

QMP-001 (Query Memoization):
□ If Firestore queries modified, check memoization compliance?

CDPP-001 (Circular Dependency Prevention):
□ If service layer touched, verify ServiceRegistry pattern?

PFDD-001 (Production-First):
□ Balance thoroughness vs shipping speed considered?
□ Fix scope appropriate for production urgency?

TEP-001 (Token Efficiency):
□ Progressive disclosure used?
□ Cache-first strategy applied?
□ Token estimates accurate?

AATP-001 (Anti-Agent-Trigger):
□ No subagent launches during investigation?
□ All tools direct (Read, Grep, Glob, Bash)?
```

---

## 🎯 **Quick Validation Checklist**

Use this condensed version for rapid compliance checks:

```yaml
Pre-Investigation (30 seconds):
□ Valid trigger detected?
□ Escalation level determined?
□ AGP-001 compliance verified?
□ Token budget estimated?

During Investigation (ongoing):
□ Layer walkthrough systematic?
□ ACVP-001 applied to architectural claims?
□ Automatic fallback checks executed?
□ Evidence collected (file:line + snippets)?
□ Safety limits monitored?

Post-Investigation (60 seconds):
□ Root cause table complete?
□ Hypothesis elimination shown?
□ Proposed patch formatted correctly?
□ Approval gate presented properly?
□ Protocol integration verified?
```

---

## 📋 **Enforcement Failure Responses**

### **Trigger Validation Failure**
```
❌ AGP-002 VIOLATION: No valid trigger detected

Issue does not meet AGP-002 trigger conditions.
This appears to be: [simple bug | typo | known limitation]

Recommended action: [Direct fix | Consult documentation | Different protocol]
```

### **ACVP-001 Violation**
```
❌ ACVP-001 VIOLATION: Architectural claim echoed without verification

User stated: "[claim]"
Claude response: "[parroted claim]"

Required response:
1. Acknowledge: "Let me verify that..."
2. Search: firestore.rules, schemas, validation services
3. Cite: "✅ Confirmed from [file:line]" or "⚠️ Cannot verify"
```

### **Token Budget Violation**
```
❌ TEP-001 VIOLATION: Token budget exceeded without approval

Estimated tokens: [X]K
Budget threshold: 2K (requires approval)

Required action:
1. Show investigation declaration with token estimate
2. Request user approval before proceeding
3. Offer cache-based alternatives if >5K
```

### **Safety Limit Violation**
```
❌ AGP-002 VIOLATION: Safety limit exceeded

Limit exceeded: [20 files | 3 layers | 5K tokens]
Current value: [actual value]

Required action: HALT and show options for:
- Preliminary analysis with current findings
- Targeted expansion (user specifies scope)
- Cache-based alternatives
```

### **Approval Gate Violation**
```
❌ AGP-002 VIOLATION: Code modified without approval

Proposed patch was applied without explicit approval phrase.

Required approval phrases:
✅ "Apply the patch", "Proceed", "Implement this"

Received: "[ambiguous response]"

Required action: Request explicit approval before applying changes
```

---

## 🔄 **Checklist Maintenance**

### **When to Update This Checklist**

Update this checklist when:
- AGP-002 protocol updated (version change)
- New trigger conditions added
- New safety limits established
- New protocol integrations added
- Enforcement violations detected (add to Failure Responses)

### **Version History**

**v1.0** (2025-11-20)
- Initial enforcement checklist for AGP-002 v1.1
- Covers all 12 sections of AGP-002 protocol
- Includes quick validation checklist
- Includes enforcement failure responses

---

## 📚 **Related Documents**

- **[AGP-002 Full Protocol](./AGP-002-AUTONOMOUS-DEBUGGING-PROTOCOL.md)** - Complete debugging protocol
- **[AGP-002 Claude.md Integration](./AGP-002-CLAUDE-MD-INTEGRATION.md)** - Quick reference for Claude Code
- **[AGP-001 Parent Framework](./AGP-001-AGENT-GOVERNANCE-PROTOCOL.md)** - Parent governance protocol
- **[ACVP-001 Examples](./AGP-002-AUTONOMOUS-DEBUGGING-PROTOCOL.md#6-architectural-claims-verification-acvp-001)** - Architectural claims verification examples
- **[Protocol Navigation Map](./PROTOCOL-NAVIGATION-MAP.md)** - Protocol discovery and routing

---

**Last Updated:** 2025-11-20
**Checklist Version:** 1.0
**Protocol Version:** AGP-002 v1.1
**Status:** Production Ready
