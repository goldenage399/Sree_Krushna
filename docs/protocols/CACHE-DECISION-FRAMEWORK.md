# Cache Decision Framework

## 🚨 Protocol ID: CDF-001
**Status**: 🎯 **BEST PRACTICE - PRODUCTION READY**
**Created**: 2025-11-05
**Last Updated**: 2025-11-05
**Scope**: Structured decision-making for cache-worthiness evaluation
**Parent Protocols**: [Universal Research Cache Protocol (URC-001)](UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md), [Universal DOM Geometry Diagnostics Protocol (UDGD-001)](UNIVERSAL-DOM-GEOMETRY-DIAGNOSTICS-PROTOCOL.md)

---

## 🎯 Purpose

**Prevent cache bloat** and **ensure high-value knowledge persistence** through structured evaluation of completed work.

### Problem This Solves
- ❌ Uncertainty: "Should I cache this work or not?"
- ❌ Cache pollution: Low-value entries diluting high-value insights
- ❌ Duplicate documentation: Cached work already documented elsewhere
- ❌ Wrong cache: Research in diagnostic cache, diagnostics in research cache

### Solution Provided
✅ **Quick decision tree** for yes/no cache determination
✅ **Scoring rubric** for reusability assessment
✅ **Cache type selector** for research vs diagnostic vs none
✅ **Real examples** for pattern recognition

---

## ⚡ Quick Decision Tree

Use this flowchart at the end of any significant work session:

```
┌─────────────────────────────────────────┐
│  Is this work cache-worthy?             │
└───────────┬─────────────────────────────┘
            │
            ├─► Was it implementation of known solution?
            │   └─► ❌ DON'T CACHE (enhancement tracker sufficient)
            │
            ├─► Is it page/component-specific ONE-TIME work?
            │   └─► ⚠️ EVALUATE REUSABILITY (see rubric below)
            │
            ├─► Is this the Nth application of a pattern?
            │   ├─► N=1 → ❌ DON'T CACHE (track for future)
            │   ├─► N=2 → ❌ DON'T CACHE (note pattern repetition)
            │   └─► N≥3 → ✅ EXTRACT PROTOCOL + CACHE
            │
            ├─► Did we discover REUSABLE patterns/insights?
            │   └─► ✅ CACHE in research-map.json
            │
            ├─► Is it DOM geometry/layout diagnostic?
            │   └─► ✅ CACHE in diagnostic-map.json
            │
            ├─► Is it architectural/protocol research?
            │   └─► ✅ CACHE in research-map.json
            │
            ├─► Is it already documented in enhancement tracker?
            │   └─► ❌ DON'T CACHE (ENH-XXX sufficient)
            │
            └─► Token cost < 15k AND well-documented?
                └─► ❌ DON'T CACHE (too small, already captured)
```

---

## 📊 Reusability Scoring Rubric

### Scoring Dimensions

| Dimension | Score | Criteria |
|-----------|-------|----------|
| **Scope** | 3 pts | Solves class of problems (not single instance) |
|           | 2 pts | Useful for component family (e.g., all wizards) |
|           | 1 pt  | Page/component-specific |
|           | 0 pts | One-time implementation |
| **Applicability** | 3 pts | Applicable across 5+ components/pages |
|                   | 2 pts | Applicable to 2-4 scenarios |
|                   | 1 pt  | Applicable to 1-2 scenarios |
|                   | 0 pts | Single-use only |
| **Pattern Value** | 3 pts | Architectural insights (reusable principles) |
|                   | 2 pts | Component patterns (design system value) |
|                   | 1 pt  | Implementation details (code snippets) |
|                   | 0 pts | No patterns identified |
| **Token Cost** | 3 pts | ≥30k tokens invested |
|                | 2 pts | 15-30k tokens invested |
|                | 1 pt  | 5-15k tokens invested |
|                | 0 pts | <5k tokens invested |

### Score Interpretation

| Total Score | Recommendation | Action |
|-------------|----------------|--------|
| **10-12** | ✅ **CACHE - High Value** | Immediate cache entry, high confidence |
| **7-9**   | ⚠️ **CACHE - Medium Value** | Cache if not already documented |
| **4-6**   | ⚠️ **CONDITIONAL** | Cache only if no alternative docs exist |
| **0-3**   | ❌ **DON'T CACHE** | Enhancement tracker or git commit sufficient |

---

## 🗂️ Cache Type Selection Matrix

| Work Type | Diagnostic Cache | Research Cache | Enhancement Tracker | None |
|-----------|:----------------:|:--------------:|:-------------------:|:----:|
| **Layout/CSS overflow investigation** | ✅ | ❌ | Link ref | ❌ |
| **Protocol design research** | ❌ | ✅ | Link ref | ❌ |
| **Architectural pattern discovery** | ❌ | ✅ | Link ref | ❌ |
| **Component family diagnostic** | ✅ | ❌ | Link ref | ❌ |
| **Page-specific UI implementation** | ❌ | ❌ | ✅ | ❌ |
| **One-time refactoring** | ❌ | ❌ | ✅ | ❌ |
| **External design proposal execution** | ❌ | ❌ | ✅ | ❌ |
| **Bug fix (no pattern)** | ❌ | ❌ | ❌ | ✅ Git commit |
| **Small documentation update** | ❌ | ❌ | ❌ | ✅ Git commit |

### Cache Selection Decision Flow

```yaml
step_1_identify_work_type:
  question: "What type of work was this?"

  if_diagnostic:
    check: "Is it DOM geometry, layout overflow, CSS cascade issue?"
    cache: "diagnostic-map.json"
    entry_type: "component diagnostic with pattern library"

  if_research:
    check: "Is it protocol design, architecture audit, system discovery?"
    cache: "research-map.json"
    entry_type: "research session with key findings"

  if_implementation:
    check: "Is it page-specific feature, one-time refactor, UI polish?"
    cache: "None (enhancement tracker sufficient)"
    alternative_doc: "ENH-XXX tracker + git commit"

  if_bug_fix:
    check: "Is it simple bug fix without patterns discovered?"
    cache: "None (git commit sufficient)"
    alternative_doc: "Detailed git commit message"

step_2_verify_alternative_docs:
  enhancement_tracker: "Does ENH-XXX tracker exist?"
  protocol_doc: "Was protocol document created?"
  git_commit: "Is git commit message comprehensive?"

  if_yes_to_any:
    action: "Don't cache (alternative documentation sufficient)"
  if_no_to_all:
    action: "Proceed with cache evaluation"

step_3_evaluate_reusability:
  use_rubric: "Calculate reusability score (0-12)"
  threshold: "Score ≥7 → Cache recommended"
  threshold: "Score <7 → Enhancement tracker sufficient"
```

---

## 🔍 Alternative Documentation Check

**Before caching, verify if work is already captured:**

### Documentation Hierarchy

1. **✅ Enhancement Tracker (ENH-XXX)** → Implementation details, metrics, status
   - **When sufficient**: Page-specific work, one-time refactoring, feature implementation
   - **Not sufficient**: Reusable patterns, architectural insights, protocols

2. **✅ Protocol Document** → Best practices, repeatable workflows, governance
   - **When sufficient**: Protocol created with clear steps and patterns
   - **Not sufficient**: Deep investigation details, diagnostic findings

3. **✅ Git Commit Message** → Code changes, bug fixes, small updates
   - **When sufficient**: Bug fixes, small refactors, documentation updates
   - **Not sufficient**: Complex investigations, architectural research

4. **✅ Cache System** → Cross-session knowledge, reusable patterns, diagnostics
   - **When to use**: High-value research, diagnostics, architectural insights
   - **When not to use**: Work already documented in #1-3 above

### Decision Logic

```yaml
documentation_check:
  step_1: "Check ENH-XXX tracker exists and is comprehensive"
  step_2: "Check protocol document created"
  step_3: "Check git commit message is detailed"

  if_any_yes:
    question: "Does cache add unique value beyond existing docs?"
    if_no: "Don't cache (duplicate)"
    if_yes: "Cache with cross-reference to existing docs"

  if_all_no:
    question: "Is work cache-worthy per rubric?"
    if_yes: "Cache recommended (primary documentation)"
    if_no: "Create enhancement tracker or detailed commit"
```

---

## 📚 Real-World Examples

### Example 1: TaskCreation Design Harmonization (Session: 2025-11-05)

**Work Type**: Page-specific UI implementation
**Description**: Implemented External Collaborator's design recommendations for TaskCreationPage Review section (titles inside cards, two-column layouts, compact checkboxes)

**Evaluation**:
```yaml
reusability_scoring:
  scope: 1 (Page-specific to TaskCreationPage Review section)
  applicability: 1 (Specific to Review step, not reusable elsewhere)
  pattern_value: 1 (Implementation details, not architectural patterns)
  token_cost: 2 (90k tokens total, but mostly implementation work)
  total_score: 5/12

alternative_documentation:
  enhancement_tracker: "✅ ENH-UI-042 comprehensive tracker exists"
  git_commit: "✅ Detailed commit planned"
  protocol: "❌ No protocol created (not needed)"

decision_tree:
  is_implementation: "Yes"
  is_page_specific: "Yes"
  already_documented: "Yes (ENH-UI-042)"
  reuse_score: "5/12 (below threshold)"
```

**Decision**: ❌ **DON'T CACHE**
**Rationale**: Page-specific implementation already documented in ENH-UI-042 tracker with comprehensive metrics, file changes, and height reduction analysis. Enhancement tracker is sufficient documentation.

**Alternative**: Enhancement tracker + git commit provide complete record

---

### Example 2: UDGD Protocol Research (Session: 2025-11-04)

**Work Type**: Protocol design research
**Description**: Designed framework-agnostic DOM geometry diagnostics protocol with persistent cache integration

**Evaluation**:
```yaml
reusability_scoring:
  scope: 3 (Solves entire class of layout/CSS problems)
  applicability: 3 (Applicable to any component with layout issues)
  pattern_value: 3 (Architectural protocol with reusable snippets)
  token_cost: 3 (40k tokens invested)
  total_score: 12/12

alternative_documentation:
  enhancement_tracker: "✅ ENH-INFRA-042 tracks implementation"
  git_commit: "✅ Code committed"
  protocol: "✅ UDGD-001 protocol document created"

decision_tree:
  is_research: "Yes"
  is_reusable: "Yes (any component)"
  already_documented: "Yes, but cache adds value"
  reuse_score: "12/12 (max score)"
```

**Decision**: ✅ **CACHE in research-map.json**
**Rationale**: Protocol design research with reusable patterns applicable across entire codebase. Cache entry complements protocol document by providing investigation context, token costs, and session details.

**Cache Entry**:
```json
{
  "id": "research-udgd-protocol-001",
  "type": "protocol-design",
  "topic": "Universal DOM Geometry Diagnostics Protocol",
  "token_cost": 40000,
  "confidence": "High",
  "key_findings": [
    "Framework-agnostic diagnostic snippets for layout debugging",
    "Persistent cache integration with git timestamp validation",
    "Console-based quick checks vs comprehensive script patterns"
  ],
  "deliverables": [
    "docs/protocols/UNIVERSAL-DOM-GEOMETRY-DIAGNOSTICS-PROTOCOL.md"
  ],
  "related_enhancements": ["ENH-INFRA-042"]
}
```

---

### Example 3: TaskCreationPage Height Overflow Diagnostic (Session: 2025-11-04)

**Work Type**: Component diagnostic investigation
**Description**: Investigated 73px height overflow issue on TaskCreationPage (1890px child > 1817px parent)

**Evaluation**:
```yaml
reusability_scoring:
  scope: 2 (Component family: pages with height constraints)
  applicability: 2 (Applicable to 2-4 pages with similar patterns)
  pattern_value: 3 (Reusable pattern: double 100vh cascade detection)
  token_cost: 3 (63k tokens via agent investigation)
  total_score: 10/12

alternative_documentation:
  enhancement_tracker: "✅ ENH-UI-041 tracks the fix"
  git_commit: "✅ Fix committed"
  protocol: "❌ No protocol (diagnostic case study)"

decision_tree:
  is_diagnostic: "Yes"
  is_component_specific: "Yes, but pattern is reusable"
  already_documented: "Partially (fix, not investigation)"
  reuse_score: "10/12 (high value)"
```

**Decision**: ✅ **CACHE in diagnostic-map.json**
**Rationale**: Component diagnostic with reusable pattern (100vh cascade causing overflow). Cache prevents re-investigating same issue on other pages. Pattern detection valuable for future similar issues.

**Cache Entry**:
```json
{
  "component_name": "TaskCreationPage",
  "issue_type": "height-overflow",
  "patterns_detected": [
    "100vh-cascade",
    "fixed-positioning-conflict",
    "duplicate-definitions"
  ],
  "files_affected": [
    "src/styles/task-creation.css",
    "src/styles/components/layout-containers.css"
  ],
  "token_cost": 63200,
  "last_audit": "2025-11-04",
  "related_enhancements": ["ENH-UI-041"]
}
```

---

### Example 4: Simple Bug Fix (Hypothetical)

**Work Type**: Bug fix
**Description**: Fixed typo in button label ("Sumbit" → "Submit")

**Evaluation**:
```yaml
reusability_scoring:
  scope: 0 (Single button label)
  applicability: 0 (One-time fix)
  pattern_value: 0 (No patterns)
  token_cost: 0 (<1k tokens)
  total_score: 0/12

alternative_documentation:
  enhancement_tracker: "❌ Too trivial"
  git_commit: "✅ Simple commit message sufficient"
  protocol: "❌ Not needed"
```

**Decision**: ❌ **DON'T CACHE**
**Rationale**: Trivial fix with zero reusability. Git commit message sufficient.

**Alternative**: `git commit -m "fix: correct button label typo (Sumbit → Submit)"`

---

### Example 5: Design System Token Expansion (Hypothetical)

**Work Type**: Architecture research + implementation
**Description**: Researched semantic token expansion strategy, designed 3-tier token system, implemented 150+ new tokens

**Evaluation**:
```yaml
reusability_scoring:
  scope: 3 (Design system affects all components)
  applicability: 3 (All future components use token system)
  pattern_value: 3 (Architectural token hierarchy pattern)
  token_cost: 3 (55k tokens research + implementation)
  total_score: 12/12

alternative_documentation:
  enhancement_tracker: "✅ ENH-UI-XXX tracks implementation"
  git_commit: "✅ Tokens committed"
  protocol: "✅ Token usage protocol document created"
```

**Decision**: ✅ **CACHE in research-map.json**
**Rationale**: Architectural research with system-wide impact. Token hierarchy pattern reusable for future design system expansions.

**Cache Entry**:
```json
{
  "id": "research-token-expansion-001",
  "type": "architecture-audit",
  "topic": "Semantic Token 3-Tier Hierarchy Design",
  "token_cost": 55000,
  "confidence": "High",
  "key_findings": [
    "3-tier token system (primitive → semantic → component)",
    "Migration strategy: progressive enhancement with fallbacks",
    "150+ tokens added with zero breaking changes"
  ],
  "deliverables": [
    "docs/protocols/SEMANTIC-TOKEN-USAGE-PROTOCOL.md",
    "src/tokens/semantic/*.js"
  ],
  "related_enhancements": ["ENH-UI-XXX"]
}
```

---

## 🔄 Pattern Evolution Threshold

### When Implementation Becomes Protocol

**Problem**: Page-specific implementations may reveal reusable patterns only after multiple applications.

**Solution**: Track pattern usage and extract to protocol when threshold is reached.

### Evolution Stages

```yaml
stage_1_single_implementation:
  status: "Don't cache (page-specific)"
  documentation: "Enhancement tracker + git commit"
  css_location: "Page-specific CSS file"
  example: "TaskCreationPage Review section (ENH-UI-042)"
  action: "Track patterns for potential reuse"

stage_2_second_application:
  status: "Consider creating protocol"
  documentation: "Track in both enhancement trackers"
  css_location: "Still page-specific, note pattern repetition"
  example: "MyTasksPage filter/review panels (hypothetical)"
  action: "Identify common patterns, prepare for extraction"

stage_3_third_application:
  status: "CREATE PROTOCOL + CACHE"
  trigger: "Pattern proven across 3 different contexts"
  documentation: "Protocol document + cache entry"
  css_location: "Extract to utilities (e.g., harmonization-patterns.css)"
  example: "TeamOversightPage approval sections (hypothetical)"
  action: "Extract protocol, cache knowledge, refactor implementations"
  deliverables:
    - "docs/protocols/[PATTERN-NAME]-PROTOCOL.md"
    - "src/styles/utilities/[pattern-name].css"
    - ".cache/research-map.json entry (category: design-system)"

stage_4_fifth_application:
  status: "Promote to design system component"
  trigger: "5+ pages using same patterns"
  deliverables:
    - "React component abstractions"
    - "Storybook documentation"
    - "Semantic token layer integration"
  example: "Universal review section component"
```

### Tracking Mechanism

**When implementing similar patterns across pages**:

1. **First implementation**: Document in enhancement tracker
2. **Second implementation**: Add note "Pattern repetition - watch for 3rd application"
3. **Third implementation**:
   - **Trigger protocol extraction**
   - Create protocol document
   - Extract reusable CSS
   - Add cache entry
   - Refactor all 3 implementations to use protocol

### Real Example: Design Harmonization Pattern

**Pattern**: Review section design consistency (titles inside cards, two-column grids, compact forms)

**Application Tracking**:

| # | Page | Enhancement | Date | Height Saved | Status |
|---|------|-------------|------|--------------|--------|
| 1 | TaskCreationPage | ENH-UI-042 | 2025-11-05 | 470px (47%) | ✅ Complete |
| 2 | MyTasksPage | ENH-UI-XXX | TBD | TBD | ⏳ Pending |
| 3 | TeamOversightPage | ENH-UI-YYY | TBD | TBD | ⏳ Pending |

**Threshold Status**: 1/3 applications (not yet ready for protocol extraction)

**When 3rd application occurs**:
1. Create `DESIGN-HARMONIZATION-PROTOCOL.md`
2. Extract CSS to `src/styles/utilities/harmonization-patterns.css`
3. Add cache entry to `research-map.json`
4. Update all 3 implementations to reference DHP

### Protocol Extraction Checklist

**Before creating protocol** (at 3rd application):

- [ ] Verify pattern is identical across all 3 implementations
- [ ] Identify common CSS classes to extract
- [ ] Document measured benefits (height savings, consistency)
- [ ] Create protocol document with:
  - [ ] Problem statement
  - [ ] Solution patterns
  - [ ] Reusable CSS classes
  - [ ] Application checklist
  - [ ] Real examples from all 3 implementations
- [ ] Extract CSS to utilities file
- [ ] Refactor implementations to use extracted CSS
- [ ] Create cache entry with:
  - [ ] High reusability score (≥10)
  - [ ] All application references
  - [ ] Measured benefits per implementation
  - [ ] Pattern library classification

### Pattern Evolution Decision Flow

```
Is this the Nth application of similar patterns?
├─ N=1 → Don't cache, document in enhancement tracker
├─ N=2 → Note pattern repetition, watch for 3rd
├─ N=3 → EXTRACT PROTOCOL + CACHE
│   ├─ Create protocol document
│   ├─ Extract reusable CSS
│   ├─ Add cache entry
│   └─ Refactor implementations
└─ N≥5 → Consider design system component promotion
```

### Benefits of 3-Application Threshold

**Why wait for 3 applications?**

✅ **Validates pattern is truly reusable** (not page-specific quirk)
✅ **Battle-tested across different contexts** (different data, layouts, use cases)
✅ **Prevents premature abstraction** (wait for pattern to stabilize)
✅ **Clear trigger point** (not subjective, easy to track)

**Trade-offs**:
⚠️ Some CSS duplication before threshold (acceptable cost for validation)
⚠️ Refactoring required when protocol is extracted (one-time effort)

### Integration with CDF-001

**Pattern evolution affects cache decisions**:

| Implementation # | Cache Decision | Action |
|------------------|----------------|--------|
| 1st | ❌ Don't cache | Enhancement tracker sufficient |
| 2nd | ❌ Don't cache | Track pattern, not yet protocol |
| 3rd | ✅ CACHE protocol | Extract patterns, create protocol doc, cache entry |
| 5th+ | ✅ Update cache | Add new applications to cache entry |

---

## 🔗 Integration Points

### 1. CLAUDE.md Integration

**Location**: `CLAUDE.md` Governance Protocols section
**Reference**:
```markdown
🧠 BEFORE caching session work → MANDATORY: Apply Cache Decision Framework (CDF-001)
```

### 2. Universal Research Cache Protocol (URC-001)

**Location**: `docs/protocols/UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md`
**Link**: Section "When to Cache Research"
**Addition**:
```markdown
**Decision Framework**: See [Cache Decision Framework (CDF-001)](CACHE-DECISION-FRAMEWORK.md) for structured cache-worthiness evaluation.
```

### 3. proto-export-context Command

**Location**: `CLAUDE.md` proto_export_context domain
**Reference**:
```yaml
proto_export_context:
  step_0_evaluate: "Apply Cache Decision Framework (CDF-001) rubric"
  step_1_analyze_runtime: "Review responses in current conversation"
  # ... rest of flow
```

### 4. Universal DOM Geometry Diagnostics Protocol (UDGD-001)

**Location**: `docs/protocols/UNIVERSAL-DOM-GEOMETRY-DIAGNOSTICS-PROTOCOL.md`
**Link**: Section "When to Cache Diagnostics"
**Addition**:
```markdown
**Decision Framework**: Use [Cache Decision Framework (CDF-001)](CACHE-DECISION-FRAMEWORK.md) to determine if diagnostic findings should be cached.
```

---

## 📊 Quick Reference Card

### Cache Decision in 30 Seconds

```
1. Score work using rubric (0-12)
2. Check alternative docs exist (ENH/protocol/commit)
3. Apply decision tree

CACHE IF:
✅ Score ≥7 AND no alternative docs
✅ Score ≥10 (even if docs exist, cache adds value)
✅ Diagnostic with reusable pattern
✅ Research with architectural insights

DON'T CACHE IF:
❌ Score <7
❌ Enhancement tracker already comprehensive
❌ Page-specific implementation
❌ One-time refactoring
❌ Bug fix without patterns
```

---

## 🎯 Success Metrics

**Efficiency Gains**:
- ✅ Reduces cache decision time from 5-10 minutes → 30 seconds
- ✅ Prevents cache pollution (low-value entries)
- ✅ Ensures high-value work is always cached
- ✅ Clear rubric eliminates subjective uncertainty

**Quality Improvements**:
- ✅ Standardized cache evaluation process
- ✅ Consistent documentation hierarchy
- ✅ Cross-referenced integration with existing protocols
- ✅ Real examples for pattern recognition

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-05 | Initial framework with decision tree, rubric, and 5 real examples |
| 1.1.0 | 2025-11-05 | Added Pattern Evolution Threshold section with 4-stage evolution model, Design Harmonization tracking example, protocol extraction checklist |

---

**Protocol Status**: ✅ Production Ready
**Next Review**: 2026-02-05 (90 days)
**Maintenance**: Update examples as new cache patterns emerge
