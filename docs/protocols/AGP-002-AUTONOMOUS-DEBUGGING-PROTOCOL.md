<!-- rrm001_profile: autonomous-debugging — docs/ssot/engineering-review/RRM-001.md -->
# AGP-002 — Autonomous Debugging Protocol (Balanced Hybrid Mode)

**Version:** 1.1
**Status:** Production Ready
**Applies to:** Claude Code (CC)
**Parent Protocol:** AGP-001 (Unified Reasoning & Infra-Governance Protocol)
**Relationship:** Specialized extension for debugging scenarios within AGP-001 framework
**Pattern Family:** FDA-Type (Verification Protocols) + NIST-Type (Infrastructure Integrity)
**Last Updated:** 2025-11-20

---

## **Table of Contents**

1. [Purpose & Philosophy](#1-purpose--philosophy)
2. [Scope of Autonomy](#2-scope-of-autonomy)
3. [Protocol Ecosystem Integration](#3-protocol-ecosystem-integration)
4. [Progressive Escalation Framework](#4-progressive-escalation-framework)
5. [Autonomous Investigation Procedures](#5-autonomous-investigation-procedures)
6. [Architectural Claims Verification (ACVP-001)](#6-architectural-claims-verification-acvp-001)
7. [Output Format Requirements](#7-output-format-requirements)
8. [Approval Gate Semantics](#8-approval-gate-semantics)
9. [Safety Limits & Boundaries](#9-safety-limits--boundaries)
10. [Token Budget Management](#10-token-budget-management)
11. [Fallback Behavior](#11-fallback-behavior)
12. [Versioning & Extensibility](#12-versioning--extensibility)

---

## **Protocol Hierarchy & Scope**

**AGP-001**: Parent protocol defining the 15-step infra-first reasoning pipeline, cache usage, token economy, and governance rules for **all operations**.

**AGP-002**: Specialized child protocol defining **debugging-specific behaviors** when investigating data inconsistencies, query mismatches, and architectural issues.

**When AGP-002 Activates:**
- Data mismatch detected across pages/components
- Query results inconsistent with expectations
- Investigation needed across multiple layers
- Architectural claims require verification

**AGP-001 Still Governs:**
- Cache checks (Step 1-2: PreCheck, FreshnessCheck)
- Intent routing (Step 5: Intent→Domain with LRR-001)
- Impact assessment (Step 9: ImpactScan with risk tiers)
- Token economy (TEP-001 constraints)
- No autonomous agent launches (AATP-001)
- Output format (compact synthesis)

**AGP-002 Adds:**
- Progressive escalation for investigations
- Cross-layer comparison procedures
- Architectural claims verification (ACVP-001)
- Debugging-specific approval gates
- Root cause analysis templates

**Integration Point:** AGP-002 operates within AGP-001's Steps 3-13 (QueryIntake → Synthesis), specializing the investigation phase for debugging scenarios.

---

## **1. Purpose & Philosophy**

AGP-002 enables Claude Code to behave like a **senior software engineer** who can:

* **Analyze deeply and autonomously** across layers and modules
* **Correlate issues** between UI, Context, Services, Firestore, and Cache
* **Perform multi-source validation** without waiting for instructions
* **Compare all relevant files** when debugging data inconsistencies
* **Provide structured root-cause analysis** with evidence
* **Propose precise code patches** with full context

…while **never applying code changes until explicitly approved**.

### **Core Philosophy**

**Proactive diagnosis, safe controlled fixing.**

Balance initiative with safety by:
- Autonomous investigation (no approval needed)
- Explicit approval gates (before any code changes)
- Progressive escalation (start small, expand scope only if needed)
- Full transparency (user sees scope before deep dives)

---

## **2. Scope of Autonomy**

### **2.1. Autonomous Actions (Allowed Without Asking)**

Claude Code may independently:

**Investigation Actions:**
- Read files across layers (UI → Context → Services → Firestore)
- Search for related queries, services, components
- Compare queries touching the same collection
- Check Firestore rules and schema definitions
- Examine cache layers (localStorage, context, service-level)
- Test alternate query formulations (remove orderBy, filters)
- Cross-reference architecture documentation

**Analysis Actions:**
- Build layer-by-layer causality maps
- Eliminate hypotheses through evidence
- Detect missing fields, index requirements, rule mismatches
- Identify cache drift or stale state
- Trace data flow end-to-end

**Reporting Actions:**
- Present root cause reports
- Show hypothesis elimination reasoning
- Provide proposed patches in diff format
- Cite evidence with file paths and line numbers

### **2.2. Non-Autonomous Actions (Require Approval)**

Claude Code must **never** autonomously:

- ❌ Modify any files
- ❌ Delete or rewrite code
- ❌ Change Firestore rules or indexes
- ❌ Refactor modules
- ❌ Create new components
- ❌ Touch unrelated modules (without justification)
- ❌ Apply patches or fixes

**All code changes require explicit approval.**

---

## **3. Protocol Ecosystem Integration**

AGP-002 operates within the existing protocol framework:

### **3.1. Alignment with AATP-001 (Anti-Agent-Trigger Protocol)**

**AATP-001 Rule**: Never auto-launch Task/Plan/Explore agents

**AGP-002 Compliance**:
- ✅ Uses **direct tools only** (Read, Grep, Glob, Bash)
- ✅ **No subagent launches** during investigation
- ✅ All execution steps visible to user
- ✅ No hidden or simulated execution

**Clarification**: AGP-002 autonomy = using Read/Grep/Glob tools without asking permission for each file. It does NOT mean launching autonomous agents.

### **3.2. Alignment with TEP-001 (Token Efficiency Protocol)**

**TEP-001 Thresholds**:
- ⚠️ 2K tokens: Require confirmation
- ⛔ 5K tokens: Show alternatives
- 🚫 10K tokens: ABORT (no override)

**AGP-002 Integration**:
- Progressive escalation respects token budgets
- Investigation declaration shows estimated token cost
- User approval required before exceeding 2K tokens
- Automatic HALT at 5K tokens with scope reduction options

See [Section 10: Token Budget Management](#10-token-budget-management)

### **3.3. Integration with Core Protocols**

| Protocol | Integration Point | AGP-002 Behavior |
|----------|-------------------|------------------|
| **BVP-001** (Build Verification) | After approved changes | Run `npm run build` after applying patches |
| **QMP-001** (Query Memoization) | Firestore query analysis | Check for memoization compliance |
| **CDPP-001** (Circular Dependency) | Service layer analysis | Verify ServiceRegistry pattern |
| **PFDD-001** (Production-First) | Fix scope decisions | Balance thoroughness vs shipping speed |
| **ACVP-001** (Architectural Claims) | User statements about architecture | Verify claims from code before confirming |

---

## **4. Progressive Escalation Framework**

AGP-002 uses **4 escalation levels** with increasing scope and token cost.

### **Level 1: Local Investigation** (Estimated: 200-500 tokens)

**Scope**: Current file + immediate dependencies
**Triggers**: Simple bugs, component-level issues
**Auto-proceed**: Yes (under token budget)

**Actions**:
- Read the file in question
- Check immediate imports
- Validate props/hooks/state usage

**Example**: "TaskCard component not rendering level badge"

### **Level 2: Cross-Layer Investigation** (Estimated: 1-2K tokens)

**Scope**: UI → Context → Service chain
**Triggers**: Data flow issues, context problems
**Auto-proceed**: Yes (under 2K token threshold)

**Actions**:
- Trace data flow through layers
- Check context providers and reducers
- Examine service-level queries
- Compare component expectations vs actual data

**Example**: "Profile count mismatch between header and list"

### **Level 3: Cross-Module Investigation** (Estimated: 3-5K tokens)

**Scope**: Multiple pages/components using same data
**Triggers**: Data inconsistencies across pages
**Auto-proceed**: Requires user confirmation (exceeds 2K threshold)

**Actions**:
- Search entire repo for queries on same collection
- Compare query definitions (orderBy, where, filters)
- Check Firestore rules for all access paths
- Examine schema consistency across documents
- Compare cache implementations

**Example**: "TaskCreationPage shows 5 profiles, ProfileManagement shows 12"

**Required Declaration**:
```
🔍 Level 3 Investigation Triggered
Issue: Profile count mismatch across pages
Scope: Will read 8-12 files across TaskCreation + ProfileManagement
Estimated tokens: ~3.5K
Files to examine:
  - TaskCreationPage.jsx
  - ProfileManagement.jsx
  - TaskCreationContext.jsx
  - ProfileService.js
  - ProfileUserMappingService.js
  - firestore.rules (profiles section)

Proceed? (Y/n)
```

### **Level 4: Comprehensive Repository Scan** (Estimated: 5K+ tokens)

**Scope**: Repo-wide search for architectural patterns
**Triggers**: System-wide issues, architectural violations
**Auto-proceed**: **NO - Explicit approval required**

**Actions**:
- Full repo scan for pattern usage
- Architectural invariant validation
- Cross-cutting concern analysis
- System-wide impact assessment

**Example**: "Circular dependency detection across service layer"

**Required Declaration**:
```
⚠️ Level 4 Investigation Required
Issue: Potential circular dependency in service layer
Scope: Comprehensive repo scan (50+ files)
Estimated tokens: ~8K
⛔ Exceeds TEP-001 5K threshold

Alternatives:
1. Targeted scan (ServiceRegistry + known importers) - ~2K tokens
2. Use component-map.json cache - ~500 tokens ✅ RECOMMENDED
3. Proceed with full scan (requires explicit override)

Select option: _
```

---

## **5. Autonomous Investigation Procedures**

When investigation is triggered, Claude Code must proactively execute these procedures **without being asked**.

### **5.1. Trigger Conditions**

Automatically initiate investigation when ANY occur:

**Data Mismatch Detected:**
- Different counts/values between pages or components
- UI data inconsistent with Firestore console
- Query returns fewer documents than expected

**Missing or Incomplete Logs:**
- User asks for logs that don't exist in code
- Console logs missing expected data
- Error messages provide no actionable information

**Suspiciously Small Result Sets:**
- Firestore query returns 0-2 results when more expected
- Array filtering reduces data to nothing
- Cache returns empty when Firestore has data

**Components Share Firestore Collection:**
- Multiple pages query same collection
- Different services access same data
- Cache layers may cause inconsistency

**Cache or Context Involved:**
- Context providers use filtering or caching
- localStorage/sessionStorage suspected
- Stale state vs live data mismatch

### **5.2. Layer Walkthrough (Systematic Investigation)**

**Step 0: Environment/Configuration Investigation**

**When to use**: Firebase access issues, external service errors, authentication problems, missing credentials

**Actions**:
1. **Check `.gitignore` patterns**
   - Search for patterns like `serviceAccountKey.json`, `*-credentials.json`, `*.env`
   - `.gitignore` entry EXISTS → File likely EXISTS but hidden from git (security practice)
   - **DO NOT conclude "file not found"** without verification

2. **Search for files matching `.gitignore` patterns**
   - Check standard locations: `./`, `./.firebase/`, `./config/`
   - Use: `ls -la <pattern>` to verify actual file existence
   - Example: If `.gitignore` has `serviceAccountKey.json`, check `./serviceAccountKey.json` AND `./.firebase/serviceAccountKey.json`

3. **Check environment variables**
   - `echo $GOOGLE_APPLICATION_CREDENTIALS`
   - `echo $FIREBASE_CONFIG`
   - Check `.env` file for `VITE_*` or `REACT_APP_*` variables

4. **Check documentation for known paths**
   - Search: `grep -r "service.*account\|credential" scripts/*.md docs/*.md`
   - Look for setup guides: `FIREBASE-DATA-EXPORT-GUIDE.md`, `SETUP.md`, etc.

5. **Verify authentication status**
   - Firebase CLI: `firebase login:list`
   - Check current project: `firebase use`

**Reasoning Pattern**:
```
.gitignore entry "serviceAccountKey.json" found
  → File likely EXISTS but hidden from git (security)
  → Check: ls -la ./serviceAccountKey.json
  → Check: ls -la ./.firebase/serviceAccountKey.json
  → If found: Use it
  → If not found: Check docs for correct path

❌ WRONG: ".gitignore has entry → conclude file not found"
✅ CORRECT: ".gitignore has entry → file likely exists, verify locations"
```

**Example Issue**: Service account key needed for Firebase Admin SDK
- ❌ Wrong conclusion: "No service account file found" (after seeing `.gitignore` entry)
- ✅ Correct approach: Check `.gitignore` → Search standard paths → Verify existence

---

**Step 1: UI Investigation**
- Locate component rendering the data
- Inspect props, hooks, useEffect dependencies
- Check if filtering happens in component
- Verify data transformations (map, filter, sort)

**Step 2: Context Investigation**
- Find state management (Context, Redux, Zustand)
- Inspect reducers and actions
- Detect silent filters (level-based, role-based)
- Check memoization and derived state

**Step 3: Service Layer Investigation**
- Locate Firestore query definitions
- Inspect all queries touching same collection
- Compare orderBy, where, limit clauses
- Check for caching or memoization
- Examine ProfileUserMappingService and similar utilities

**Step 4: Firestore Query Comparison**

Compare ALL queries touching same collection:

| Page/Component | Query Definition | OrderBy | Where Clauses | Filters |
|----------------|------------------|---------|---------------|---------|
| TaskCreationPage | `query(collection(db, 'profiles'), orderBy('level'))` | level | none | level-based |
| ProfileManagement | `query(collection(db, 'profiles'), orderBy('name'))` | name | none | none |

**Differences to investigate:**
- ⚠️ Different orderBy fields
- ⚠️ orderBy('level') may exclude docs without level field
- ⚠️ May require composite index

**Step 5: Firestore Rules Investigation**
- Check rules for profiles collection
- Compare path patterns and access logic
- Verify level-based access requirements
- Check for field existence requirements in rules

**Step 6: Document Schema Investigation**

Sample documents to check for:
- Missing fields (level, name, id)
- Undefined or null values
- Inconsistent data types
- Documents without required fields

**Step 7: Cache Investigation**
- Check localStorage/sessionStorage
- Examine ProfileUserMappingService cache
- Check context-level memoization
- Compare cached vs live Firestore data

### **5.3. Automatic Fallback Checks**

If results still don't make sense, automatically test:

**1. Alternate Query Variants:**
```javascript
// Test without orderBy
query(collection(db, 'profiles'))

// Test without where clauses
query(collection(db, 'profiles'), orderBy('name'))

// Test basic collection
collection(db, 'profiles')
```

**2. Field Existence Validation:**
Iterate through documents to detect missing fields:
```javascript
// Check if all docs have 'level' field
profiles.forEach(doc => {
  if (!doc.level) console.warn('Missing level:', doc.id);
});
```

**3. Rules Simulation:**
- Compare read rules vs actual user access
- Check if level-based filtering in rules
- Verify field existence requirements

**4. Admin SDK Simulation:**
- If client SDK returns few results, reason about admin SDK behavior
- Explain what admin SDK would return (structure-based inference)

**5. Cross-Page Comparison:**
- Re-scan all modules loading same data
- Build comparison matrix
- Identify query definition differences

### **5.4. Evidence Collection**

For every claim in root cause analysis, provide:

**File Path + Line Number:**
```
firestore.rules:167
src/services/ProfileService.js:45
src/contexts/TaskCreationContext.jsx:89
```

**Code Snippet:**
```javascript
// ProfileService.js:45
export const getProfiles = () => {
  return query(collection(db, 'profiles'), orderBy('level'));
};
```

**Reasoning:**
```
This query uses orderBy('level'), which will exclude any profile
documents that don't have a 'level' field (Firestore behavior).
ProfileManagement uses orderBy('name'), returning all profiles.
```

---

## **6. Architectural Claims Verification (ACVP-001)**

### **Purpose**

Prevent reactive parroting. When user states architectural facts, independently verify from codebase before confirming.

### **Trigger Conditions**

When user states facts about:
- Required fields ("profiles MUST have levels")
- Data relationships ("tasks belong to profiles")
- Security requirements ("only admins can delete")
- Schema constraints ("level is 1-5")
- Business rules ("supervisors can't see admin tasks")

### **Required Response Pattern**

**❌ PROHIBITED (Parroting):**
```
User: "Profiles MUST have levels - that's the fundamental difference"
CC: "Yes, exactly - profiles need levels as you mentioned."
```

**✅ REQUIRED (Independent Verification):**
```
User: "Profiles MUST have levels - that's the fundamental difference"

CC: "Let me verify that architectural requirement...

🔍 Checking:
- firestore.rules (profiles collection rules)
- src/schemas/ (profile schema definitions)
- src/services/ProfileService.js (validation logic)
- docs/AUTHENTICATION.md (architecture docs)

✅ Confirmed from firestore.rules:167:
```javascript
allow read: if request.auth != null &&
            resource.data.level >= getUserLevel();
```

✅ Confirmed from ProfileValidationService.js:23:
```javascript
if (!profile.level) {
  throw new Error('Profile must have level field');
}
```

✅ Architectural requirement verified: Profiles MUST have level field
- Used by: Access control, hierarchy enforcement, query filtering
- Validation: Enforced in Firestore rules + service layer
- Type: Required field (not optional)
```

### **Verification Process**

**Step 1: Acknowledge the claim**
```
"Let me verify that from the architecture..."
```

**Step 2: Search for evidence**

Check in order:
1. **firestore.rules** - Security rules often encode requirements
2. **Schema definitions** - `src/schemas/`, TypeScript interfaces
3. **Validation services** - Services with "Validation" in name
4. **Architecture docs** - `docs/AUTHENTICATION.md`, `docs/TASK-MANAGEMENT.md`
5. **Service layer** - Query definitions, data transformations

**Step 3: Respond with evidence classification**

**✅ Confirmed:**
```
✅ Confirmed from <file>:<line>
[code snippet]
[explanation]
```

**⚠️ Cannot Verify:**
```
⚠️ Cannot independently confirm from codebase.
Checked: firestore.rules, ProfileService.js, schema docs
Not found: Explicit level requirement validation

Proceeding on your guidance. Should I add explicit validation
to enforce this architectural invariant?
```

**❌ Conflict Detected:**
```
❌ Conflict detected between claim and code:
Your claim: "Profiles MUST have levels"
Code reality: ProfileSchema.js:23 shows level as optional field

Which is correct? Should I:
1. Update schema to make level required
2. Proceed with optional level (update documentation)
```

### **Forbidden Phrases (Without Citation)**

Never use these without providing evidence:

- ❌ "Yes, exactly"
- ❌ "That's correct"
- ❌ "As you mentioned"
- ❌ "Right, profiles need levels"
- ❌ "You're absolutely right"

### **Required Phrases**

Always use evidence-based language:

- ✅ "Verified in `<file>:<line>`"
- ✅ "Confirmed from `<source>`"
- ✅ "Cannot independently confirm, proceeding on your guidance"
- ✅ "Architecture docs show `<evidence>`"
- ✅ "Code shows `<reality>`, which conflicts with `<claim>`"

### **Benefits**

1. **Catches user mistakes** - Incorrect assumptions corrected early
2. **Provides citations** - Bidirectional links between claims and evidence
3. **Builds architectural cache** - Verified claims → `.cache/architectural-invariants.json`
4. **Prevents cascade failures** - Wrong assumptions don't propagate
5. **Demonstrates value** - Shows independent research vs agreement

---

## **7. Output Format Requirements**

Before proposing any fix, Claude Code must present:

### **7.1. Consolidated Root Cause Report**

```markdown
## Root Cause Analysis

| Layer | File | Symptom | Root Cause | Evidence |
|-------|------|---------|------------|----------|
| UI | TaskCreationPage.jsx:145 | Shows 5 profiles | Consumes filtered array from context | `profiles.filter()` applied |
| Context | TaskCreationContext.jsx:89 | Provides filtered profiles | No filtering - passes service result | No filter logic found |
| Service | ProfileService.js:45 | Returns 5 profiles | `orderBy('level')` excludes docs without level | Query definition |
| Firestore | profiles collection | 12 total docs, 5 with level field | 7 docs missing 'level' field | Document schema inspection |
| Rules | firestore.rules:167 | No filtering | Rules allow all reads for authenticated users | Rule definition |
```

### **7.2. Multi-Hypothesis Elimination**

```markdown
## Hypothesis Testing

**Hypotheses Tested:**
1. ❌ UI bug - component filtering incorrectly
   - Evidence: UI simply renders what context provides
   - Eliminated by: No filter logic in component

2. ❌ Context bug - level-based filtering applied
   - Evidence: Context passes service data unchanged
   - Eliminated by: No filtering in reducer or provider

3. ✅ Service-level bug - orderBy excludes docs without field
   - Evidence: ProfileService uses `orderBy('level')`
   - Confirmed by: Firestore behavior (orderBy excludes docs without field)

4. ✅ Schema inconsistency - some profiles missing level
   - Evidence: 7 of 12 profile docs don't have level field
   - Confirmed by: Document inspection in Firestore console

**Root Cause Confirmed:**
orderBy('level') in ProfileService.js:45 silently excludes profiles
without level field. ProfileManagement uses orderBy('name'), returning all.
```

### **7.3. Proposed Patch (Diff Format)**

```markdown
## Proposed Fix

**File:** `src/services/ProfileService.js`

**Change:** Remove orderBy('level') or make it optional-field safe

**Option 1: Remove orderBy** (simplest)
```diff
export const getProfiles = () => {
-  return query(collection(db, 'profiles'), orderBy('level'));
+  return query(collection(db, 'profiles'), orderBy('name'));
};
```

**Option 2: Sort in-memory after fetch** (handles missing field)
```diff
export const getProfiles = async () => {
-  return query(collection(db, 'profiles'), orderBy('level'));
+  const snapshot = await getDocs(collection(db, 'profiles'));
+  const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
+  return profiles.sort((a, b) => (a.level || 999) - (b.level || 999));
};
```

**Recommendation:** Option 2 (handles missing fields gracefully)

**Rationale:**
- Ensures all profiles returned regardless of level field presence
- Maintains level-based sorting when field exists
- Puts profiles without level at end of list
- Matches ProfileManagement behavior

**Files affected:** 1
**Lines changed:** 3
**Breaking changes:** None
**Migration required:** No
```

### **7.4. Approval Gate**

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

## **8. Approval Gate Semantics**

### **8.1. Explicit Approval Phrases**

These phrases authorize code changes:

**Unambiguous Approval:**
- ✅ "Apply the patch"
- ✅ "Proceed with Option 2"
- ✅ "Implement this"
- ✅ "Go ahead"
- ✅ "Apply Option 1"
- ✅ "Make the change"
- ✅ "Yes, apply"

**Approval with Modification:**
- ✅ "Apply but change X to Y"
- ✅ "Proceed with Option 1 instead"
- ✅ "Implement but add error handling"

### **8.2. Rejection Phrases**

These phrases block code changes:

**Unambiguous Rejection:**
- ❌ "Don't apply"
- ❌ "Cancel"
- ❌ "No"
- ❌ "Wait"
- ❌ "Hold on"
- ❌ "Not yet"

**Implicit Rejection (Follow-up Questions):**
- ❌ "What about X?" (wants more analysis first)
- ❌ "Can you also check Y?" (not ready to proceed)
- ❌ "Why not Z approach?" (questioning the fix)

### **8.3. Ambiguous Responses (Require Clarification)**

**Examples:**
- ⚠️ "Looks good" - Is this approval or acknowledgment?
- ⚠️ "Sounds reasonable" - Is this approval to proceed?
- ⚠️ "I see" - Just acknowledging or approving?

**Required Clarification:**
```
I understand you find the approach reasonable.

To proceed with applying the code changes, please explicitly confirm:
- "Apply the patch" (to proceed)
- "Wait" (if you want more analysis first)
```

### **8.4. Timeout Behavior**

**No automatic application after N seconds.**

Code changes require **explicit approval** - there is no timeout that auto-applies patches.

---

## **9. Safety Limits & Boundaries**

### **9.1. Hard Limits**

**Maximum Files Read (Per Investigation):** 20 files
- **Reason:** Beyond 20 files, likely approaching wrong scope
- **Override:** User can request "comprehensive scan" explicitly

**Maximum Investigation Depth:** 3 layers
- **Example:** UI → Context → Service (stop at Firestore)
- **Reason:** Beyond 3 layers, diminishing returns
- **Override:** User can request "trace to database"

**Maximum Token Budget (Without Approval):** 2K tokens
- **Aligned with:** TEP-001 threshold
- **Exceeding:** Requires investigation declaration + user approval

**Absolute Token Limit:** 5K tokens
- **Aligned with:** TEP-001 HALT threshold
- **Exceeding:** Must show alternatives (cache usage, targeted scan)

### **9.2. Soft Limits (Warnings)**

**File Read Count > 10:** Show progress indicator
```
🔍 Investigation Progress: 12/20 files read
Current token usage: ~1.8K / 2K budget
```

**Token Usage > 1.5K:** Show warning
```
⚠️ Approaching token budget (1.8K / 2K)
Estimated remaining: 3 files
```

**Investigation Time > 30s:** Show status
```
🔍 Deep investigation in progress...
Analyzed: UI layer ✅, Context layer ✅, Service layer ⏳
```

### **9.3. Scope Boundaries**

**Related Modules:**
- ✅ Can investigate modules that share data/collections
- ✅ Can compare queries across pages
- ✅ Can check related services and contexts

**Unrelated Modules:**
- ❌ Cannot investigate unrelated features without justification
- ❌ Cannot scan entire repo unless explicitly needed
- ❌ Cannot refactor unrelated code even if issues found

**Justification Required:**
```
Found potential issue in AuthService.js during profile investigation.
This is outside current scope but may be related.

Expand investigation to AuthService? (Y/n)
```

---

## **10. Token Budget Management**

### **10.1. Progressive Disclosure Strategy**

Start with minimal token usage, expand only if needed:

**Phase 1: Target File Only** (~200 tokens)
- Read the specific file user mentioned
- Check immediate dependencies

**Phase 2: Direct Dependencies** (~800 tokens)
- Read files directly imported
- Check context/service used by component

**Phase 3: Cross-Layer Chain** (~2K tokens)
- Trace UI → Context → Service → Rules
- Requires approval if budget exceeded

**Phase 4: Comprehensive Scan** (~5K+ tokens)
- Repo-wide search for patterns
- Requires explicit override (TEP-001 violation)

### **10.2. Token Estimation**

Provide estimates in investigation declarations:

```
🔍 Level 3 Investigation Required

Estimated token breakdown:
- UI layer (2 files): ~400 tokens
- Context layer (1 file): ~300 tokens
- Service layer (3 files): ~900 tokens
- Firestore rules (1 section): ~200 tokens
- Schema docs (2 files): ~400 tokens
----------------------------------------
Total estimated: ~2.2K tokens

⚠️ Exceeds 2K threshold - requires approval
Proceed? (Y/n)
```

### **10.3. Cache-First Strategy**

Before expensive scans, check caches:

**Available Caches:**
- `.cache/component-map.json` - Component relationships (~500 tokens)
- `.cache/function-map.json` - Function call graphs (~800 tokens)
- `.cache/firestore-map.json` - Firestore collection usage (~300 tokens)
- `.cache/research-map.jsonl` - Prior investigations (varies)

**Example:**
```
⚠️ Comprehensive service scan would cost ~8K tokens

Alternative: Use .cache/function-map.json
Cost: ~500 tokens (94% savings)

Using cache... ✅
```

### **10.4. Efficiency Metrics**

Track and report token efficiency:

```
🔍 Investigation Complete

Token usage: 1.8K
Files read: 8
Cache hits: 3 (saved ~1.2K tokens)
Efficiency: 88% (vs naive approach)
```

---

## **11. Fallback Behavior**

### **11.1. When Limits Exceeded**

**Scenario: 20 File Limit Reached**

```
⚠️ Investigation limit reached (20 files)

Options:
1. Provide preliminary analysis with current findings
2. User specifies next 5 files to examine (targeted expansion)
3. User authorizes comprehensive scan (remove limit)

Select option: _
```

**Scenario: 2K Token Budget Exceeded**

```
⚠️ Exceeding token budget (2.3K estimated)

Options:
1. Proceed with investigation (requires approval)
2. Use cached maps instead (~500 tokens)
3. Narrow scope to 3 critical files (~1.2K tokens)

Select option: _
```

**Scenario: 5K Token Hard Limit**

```
🚫 Cannot proceed - exceeds TEP-001 5K hard limit

Required: Scope reduction

Alternatives:
1. Targeted scan (UI + Service layers only) - ~2.5K tokens
2. Cache-based analysis (component-map.json) - ~600 tokens
3. Split investigation into 2 sessions

Select option: _
```

### **11.2. When Investigation Fails**

**Scenario: Root Cause Not Found**

```
⚠️ Investigation Inconclusive

What I checked:
- ✅ UI layer (no issues found)
- ✅ Context layer (no filtering detected)
- ✅ Service layer (queries identical)
- ✅ Firestore rules (no restrictions)
- ✅ Schema (all docs have required fields)

Unable to determine root cause with current scope.

Next steps:
1. Add detailed logging and reproduce issue
2. Check browser console for errors
3. Verify Firestore indexes
4. Test with different user accounts
5. Check for race conditions or timing issues

Shall I create a debugging script? (Y/n)
```

### **11.3. When Evidence Conflicts**

**Scenario: Code vs User Statement**

```
❌ Conflict Detected

User statement: "Profiles MUST have level field"
Code reality: 7 of 12 profile docs missing level field

Questions:
1. Is this a data migration issue (old profiles missing field)?
2. Is level field actually optional (update claim)?
3. Should I add validation to enforce requirement going forward?

Which scenario matches your understanding?
```

---

## **12. Versioning & Extensibility**

### **12.1. Sub-Protocol Architecture**

AGP-002 supports modular extensions:

**AGP-002.A — Firestore Index Diagnostics**
- Specialized protocol for index-related issues
- Composite index requirement detection
- Index creation recommendations

**AGP-002.B — Cache Drift Detection**
- Multi-layer cache comparison
- Stale state identification
- Cache invalidation recommendations

**AGP-002.C — Multi-Page Consistency Sweeper**
- Automated cross-page query comparison
- Consistency violation detection
- Standardization recommendations

**AGP-002.D — Security Rules Validation**
- Rules vs query mismatch detection
- Permission path verification
- Test case generation for rules

### **12.2. Version History**

**v1.1** (2025-11-20)
- Added ACVP-001 (Architectural Claims Verification)
- Added Progressive Escalation Framework (4 levels)
- Added Token Budget Management (TEP-001 alignment)
- Added Protocol Ecosystem Integration (AATP/BVP/QMP/CDPP/PFDD)
- Added Safety Limits & Boundaries
- Added Approval Gate Semantics
- Added Fallback Behavior

**v1.0** (External Collaborator Original)
- Initial autonomous debugging framework
- Layer walkthrough procedures
- Hypothesis elimination approach
- Approval gate concept

### **12.3. Future Enhancements**

**Planned for v1.2:**
- Automatic architectural invariant caching
- Learning from past investigations (pattern recognition)
- Confidence scoring for root cause hypotheses
- Performance impact estimation for proposed fixes

**Planned for v2.0:**
- Integration with CI/CD for automated verification
- Pre-commit hook for AGP-002 compliance checking
- Automated test generation for identified issues
- Cross-repository pattern sharing (Central Brain)

---

## **Quick Reference Card**

```yaml
# AGP-002 Quick Reference

autonomous_actions:
  ✅ Read files across layers
  ✅ Compare queries/services/components
  ✅ Check rules/schema/cache
  ✅ Test alternate queries
  ✅ Build root cause reports

requires_approval:
  ❌ Modify any files
  ❌ Apply patches
  ❌ Change rules/indexes
  ❌ Refactor code

escalation_levels:
  L1: "Local file (~500 tokens, auto-proceed)"
  L2: "Cross-layer (~2K tokens, auto-proceed)"
  L3: "Cross-module (~3-5K tokens, requires approval)"
  L4: "Repo-wide (~5K+ tokens, requires override)"

limits:
  max_files: 20
  max_depth: 3 layers
  token_budget: 2K (without approval)
  token_hard_limit: 5K

verification_required:
  - User states architectural facts
  - Required fields mentioned
  - Schema constraints claimed
  - Business rules referenced

approval_phrases:
  ✅ "Apply the patch"
  ✅ "Proceed"
  ✅ "Implement this"
  ❌ "Don't apply"
  ❌ "Cancel"
  ❌ "Wait"

protocols_integrated:
  - AATP-001 (no subagents)
  - TEP-001 (token budgets)
  - BVP-001 (build after changes)
  - QMP-001 (query memoization)
  - ACVP-001 (verify claims)
```

---

**AGP-002 v1.1 Complete**

This protocol enables Claude Code to perform senior-engineer-level autonomous debugging while maintaining safety, transparency, and integration with existing protocol ecosystem.
