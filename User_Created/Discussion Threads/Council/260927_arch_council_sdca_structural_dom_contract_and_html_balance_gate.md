# Architecture Council — SDCA Structural DOM Contract & HTML Balance Gate

**Session Date**: 2026-09-27  
**Type**: EXPEDITED (single-domain, single-gap, evidence-bounded)  
**Subject**: Regression prevention gate for SDCA HTML component tag-balance and source→DOM structural correctness  
**Governing Standard**: `STD-MOD-COMP-001` / `P-MOD-COMP-001`  
**Triggering Thread**: `User_Created/Discussion Threads/Shopping/260927_RegressionHandling.md` (Q1.1 Root-Cause Review)  
**Incident**: Unclosed `<div class="shop-welcome-left">` in `shopping_src/components/body.html` caused `#shoppingRegistryRoot` DOM ancestry corruption. Fixed in `fd47c6f`.

---

## 🌍 Grounding Snapshot (RFG-001 §1)

**Repository stage**: Wedding planning OS — multi-module SDCA web app, active development, host + family users.  
**Active SDCA modules**: 3 (`shopping_src`, `cockpit_src`, `decision_registry_src`)  
**Component HTML files exposed to this gap**: 11 (confirmed via directory scan)  
**Existing validation model**: string-match + byte-parity only — zero DOM parsing anywhere (confirmed: no `jsdom`, `parse5`, `htmlparser`, `linkedom` in any script)

---

## ⚡ 3-Question Invocation Gate

| Question | Answer | Rationale |
|---|---|---|
| Reversibility | **YES** | Adding a tag-balance check to `build.cjs` and `verify-modular-architecture.cjs` is a script addition, not a source mutation. Low reversal cost, but not adding it leaves all 3 SDCA modules exposed. |
| Boundary crossing | **NO** | This is scoped entirely to the SDCA build pipeline scripts — no Firestore, no React, no service layer. |
| Engineer disagreement | **YES** — borderline | The root-cause review (Q1.1) considered two competing philosophies: (A) minimal fix — extend one existing gate, (B) full DOM contract architecture. Two reasonable engineers could disagree on scope. |

**Decision**: EXPEDITED council — 3 most relevant default members, compressed.

---

## Phase 0: Evidence Collection

### Evidence Snapshot

| Evidence Item | File | Observed Fact |
|---|---|---|
| All test scripts use `.includes()` only | `scripts/test-shopping-registry.cjs:70–73` | `domChecks.forEach(check => assert(rootHtml.includes(check)))` — substring only |
| `verify:modular-architecture` loop iterates 3 SDCA modules | `scripts/verify-modular-architecture.cjs:57–88` | Checks file existence, JS syntax, CSS line count, byte parity — zero HTML parsing |
| No DOM parser anywhere in scripts | Grep across `scripts/` | Zero matches for `jsdom`, `parse5`, `htmlparser`, `linkedom`, `DOMParser` |
| Incident fix committed | `git log` | `fd47c6f` — fix committed and 11 commits upstream of HEAD; fix is live |
| 11 SDCA component HTML files exist | Directory scan | `cockpit_src/components/` (6 files), `decision_registry_src/components/` (1 file), `shopping_src/components/` (4 files) |
| `check-html-balance.cjs` does NOT exist | `find_by_name` against `scripts/` | No existing script of this type — gap confirmed |
| `verify-modular-architecture.cjs` step [2/6] iterates `sdcaModules` | Lines 56–88 | Natural extension point already in place; loop body can be augmented |
| Prior council ruling on this domain | Council_Ledger grep | No prior ruling on HTML structural validation — first instance |

### Duplication Check

No existing mechanism provides tag-balance validation across SDCA sources. The incident's own scratch `node -e "..."` (Q1.0 transcript lines 104–120) was the only implementation, and it was never committed. No external pattern search required — the gap is explicit and scoped.

---

## Phase 1: Independent Evaluations

### 1. SSOT Authority Auditor

**Position**: The preventive control proposed by Q1.1 (`check-html-balance.cjs` wired into 3 SDCA `build.cjs` compilers) is consistent with `STD-MOD-COMP-001`. That standard mandates SDCA structure compliance but does not currently define *structural correctness of component HTML files* — only their existence. Extending `verify:modular-architecture` step [2/6] to include tag-balance is additive and non-conflicting. No existing ADR or protocol is violated.

**Evidence**: `GEMINI.md` §4 (`STD-MOD-COMP-001`) governs SDCA structure; the "Mandatory SDCA Structure" list does not mention source-level HTML validity. This is a genuine gap in the standard — not a contradiction of it.

**Assumptions**: Tag-balance is a necessary but not sufficient condition for structural correctness. Balanced tags can still produce wrong nesting (e.g., sibling div swapped with child div). But unbalanced tags *always* produce wrong DOM — so balance is the correct minimum gate.

**Trade-offs**: Extending the standard by a coverage note vs. leaving it silent. Net: extending is cheaper and correct.

**Risk & Dependencies**: None — additive change to a documentation standard and an existing script.

**Challenge**: *Could this create a false sense of security — where passing tag-balance causes engineers to skip live browser verification?* The tag-balance check is one necessary condition; it can't replace browser testing. The risk is that it gets treated as complete validation. **What would change my mind**: if the fix proposal were to claim tag-balance *replaces* DOM runtime validation, I'd object. As long as it's framed as a source-gate minimum, not a full DOM contract, it's sound.

**Confidence**: High.

---

### 2. Dependency & Impact Auditor (Assigned Dissenter this session)

**Position** (dissenting on scope): The root-cause review's recommendation — extract a `~30-line` script, wire to 3 build compilers — is too narrow. The *class* of failure is "source text validated as present, but DOM constructed wrongly." Tag-balance only catches one variant of this class. A sibling HTML file with correct tag balance but inverted nesting hierarchy (e.g., `#shoppingRegistryRoot` placed *inside* `#shopWelcomeBanner` instead of alongside it) would pass tag-balance and still corrupt the DOM contract `app.js` depends on. The proposal closes one door without acknowledging the adjacent open window.

**Evidence**: Q1.1, section E: the same gap exists across all 3 SDCA modules. The incident was caused by a missing `</div>` — caught by balance check. But a future engineer could introduce a *mismatched* nesting (structurally balanced, wrong hierarchy) that the balance check would not catch.

**Assumptions**: Future structural bugs will be as simple as the current one (single missing tag). This assumption has poor historical support — as modules grow, structural authoring complexity increases.

**Trade-offs**: Narrow fix now vs. broader nesting-contract check later. The narrow fix closes the specific incident class. The broader check is significantly harder (requires DOM parsing).

**Risk & Dependencies**: If the narrow fix is landed without an explicit note that it does NOT cover nesting hierarchy, engineers may assume it does and omit future browser smoke tests.

**Challenge (mandatory)**: *What is the actual blast radius of landing only the tag-balance check?* It catches: any unclosed/unopened tag. It misses: any well-balanced but structurally inverted tree. In a repo that has already had one DOM structural regression, landing a check that doesn't address the full class risks a second, different-variant regression with false confidence. **What would change my mind**: if the proposal explicitly scoped itself as "closes gap variant A only; gap variant B requires DOM-parsing validation and is deferred per INV-PROVE-BEFORE-CLAIM-001 until a second real instance." That explicit scope marker is what's missing.

**Confidence**: Medium (on the dissenting position — the narrow fix is still better than nothing).

---

### 3. Maintainability & Velocity Auditor

**Position**: The Q1.1 recommendation is the correct move at this repo's maturity stage. One bug, one class (unbalanced tags), one small script. The Dependency Auditor's dissent is technically correct but argues for a capability this repo doesn't need until evidence demands it (`INV-PROVE-BEFORE-CLAIM-001`). Wiring a stack-based tag matcher into the build pipeline costs ~30 lines, integrates into an existing gate, and has zero maintenance overhead. A full structural DOM contract (nesting hierarchy verification with a headless browser or DOM parser) costs 10–20× more in script complexity, CI time, and library dependency. The burden of proof for the larger solution requires a second real instance of the narrower fix failing to prevent a real regression.

**Evidence**: `SK-027` + `INV-PROVE-BEFORE-CLAIM-001` (ratified `AC-DEC-2026-069`) — no cross-repo or multi-instance framework is justified from a single incident. Q1.1 itself declined sections I/J/K on exactly these grounds, citing S227/S229 as the precedent.

**Assumptions**: The tag-balance gate catches the most common variant of this bug class. Second-variant bugs (correct balance, wrong nesting) require authoring a semantically invalid component — a harder mistake to make accidentally.

**Trade-offs**: ~1-hour narrow fix vs. 2-3 day DOM contract architecture. The narrow fix satisfies the gap class documented. The broad architecture is speculative until a second incident.

**Risk**: The Dependency Auditor's concern about false confidence is real but addressable by a comment in the script header ("this validates tag balance only; DOM nesting hierarchy requires live browser testing").

**Challenge**: *If the balance check passes but nesting is wrong, what signal does the developer get?* The build succeeds, the tests pass, and the regression ships. The balance check adds one layer of protection without eliminating all layers of risk. This is acceptable — defense in depth at minimum viable cost.

**What would change my mind**: a second real regression where tags were balanced but nesting was wrong. That would justify the DOM-parser upgrade.

**Confidence**: High.

---

## Phase 2: Synthesis

### Areas of Unanimous Agreement

1. **The tag-balance gap is real and unprotected**: zero existing scripts parse HTML as a DOM tree. `fd47c6f` fixed the symptom; the gap allowing it to occur remains open.
2. **`verify-modular-architecture.cjs` step [2/6] is the natural extension point**: it already iterates all 3 `sdcaModules` and is the SDCA structural compliance owner.
3. **The fix is small, scoped, and low-risk**: a stack-based tag-balance check (~30 lines) wired into the existing gate.
4. **`INV-PROVE-BEFORE-CLAIM-001` applies**: broader DOM contract architecture (nesting hierarchy via DOM parsing) is not justified by a single incident.

### Areas of Disagreement

| Disagree-ment | Dependency Auditor | Maintainability Auditor | Resolution |
|---|---|---|---|
| Scope of the fix | Narrow fix leaves adjacent nesting-hierarchy variant unclosed | Narrow fix is correct for evidence level; broader fix is speculative overhead | **Resolved in favor of narrow fix with mandatory scope annotation** |
| Risk of false confidence | Engineers may assume balance check = complete DOM validation | Comment in script header is sufficient mitigation | **Resolved: scope annotation in script header + enhancement index** |

### Verbatim Challenge Resolutions

> *Dependency Auditor*: "What is the actual blast radius of landing only the tag-balance check? It catches: any unclosed/unopened tag. It misses: any well-balanced but structurally inverted tree."

**Resolution**: The synthesis explicitly acknowledges this scope boundary. The balance check is labeled `GAP-VARIANT-A` only. GAP-VARIANT-B (balanced but wrong nesting) is deferred per `INV-PROVE-BEFORE-CLAIM-001` and documented as a named open investigation with a specific re-open trigger.

> *SSOT Authority Auditor*: "Could this create a false sense of security — where passing tag-balance causes engineers to skip live browser verification?"

**Resolution**: The script header will carry an explicit comment: `"This validator catches unbalanced open/close tag pairs (Gap Variant A). It does NOT validate DOM nesting hierarchy or runtime selector contracts (Gap Variant B). Live browser verification and Playwright tests remain required for full structural assurance."` This is also added to the `STD-MOD-COMP-001` coverage note.

### Recommended Course of Action

**Required Now** (justified by single incident, zero existing protection, minimal cost):

1. **Create `scripts/check-html-balance.cjs`** — stack-based tag matcher, ~30 lines, exits non-zero on unclosed/mismatched tags, takes file path as argument. Lifted from Q1.0 scratch investigation (lines 104–120 of transcript), elevated to committed script.

2. **Extend `scripts/verify-modular-architecture.cjs` step [2/6]** — in the `sdcaModules.forEach()` loop (lines 56–88), after the existing existence checks, call `check-html-balance.cjs` on every `*.html` file under `<mod>/components/`. This closes the gap in one gate for all 3 SDCA modules simultaneously.

3. **Add scope annotation** to the script header and to the `STD-MOD-COMP-001` coverage note in `GEMINI.md` §4: *"Tag-balance validated at source level (Gap Variant A). DOM nesting hierarchy contract (Gap Variant B) deferred to `SK-028` re-open trigger."*

**Future Extension** (deferred, named trigger):
- `GAP-VARIANT-B`: DOM nesting hierarchy verification via real browser DOM (`playwright` or `jsdom`). **Re-open trigger**: a second real SDCA regression where tags were balanced but DOM structure was wrong, OR when a Playwright SDCA smoke test suite is introduced (whichever comes first). Currently classified `EXPERIMENTAL_PILOT / LOCAL_ONLY` per `INV-PROVE-BEFORE-CLAIM-001`.

### Alternatives Considered and Rejected

| Alternative | Reason Rejected |
|---|---|
| Wire balance check into each `build.cjs` compiler instead of `verify-modular-architecture.cjs` | Q1.1 suggested this, but `verify:modular-architecture` already owns the "is this SDCA module structurally sound?" responsibility. Adding to `build.cjs` splits ownership across 3 separate files vs. 1 gate. Rejected in favor of single-gate ownership. |
| Full DOM-contract architecture (Source/Build/Runtime/Integration gates) | Not justified by single incident per `INV-PROVE-BEFORE-CLAIM-001`. Deferred to `SK-028` re-open trigger. |
| Playwright-based smoke test for Shopping tab | Zero Playwright tests currently target the Shopping module (confirmed grep). Valid future investment, but out of scope for this ticket — requires separate UI council review. |

### Confidence

| Recommendation | Confidence | Reason |
|---|---|---|
| Create `check-html-balance.cjs` | **High** | Directly closes the confirmed gap. Minimal complexity. |
| Extend `verify:modular-architecture` step [2/6] | **High** | Existing loop is the correct integration point. No architectural change. |
| Scope annotation | **High** | Prevents false confidence with zero implementation cost. |
| Defer Gap Variant B | **High** | Consistent with `INV-PROVE-BEFORE-CLAIM-001` + `SK-027` precedent. |

---

## Phase 2 Process Notes (ICG-001)

**Gap: No prior council ruling on HTML structural validation existed.**  
*Proposed fix*: This session's ruling becomes the first. Applied in-session.

**Gap: Dependency Auditor's dissent (dissenter seat) was assigned, not organically produced.**  
*Proposed fix*: Dissenter seat was explicitly named and argued against the majority (narrow fix). Challenge quoted verbatim in synthesis. Applied in-session.

**Gap: Full Phase 1 roster (7 default members) was not seated — only 3.**  
*Proposed fix*: Expedited tier justified — change does not touch Firestore, React, Auth, permissions, service layer, or file placement. Schema & Firestore Auditor, Service Layer Integrity Auditor, Auth & Permission Auditor, File Placement Auditor, and Decision & Standards Auditor are explicitly N/A for this session. Logged below.

**Explicit N/A Ledger:**

| Auditor | N/A Reason |
|---|---|
| Schema & Firestore Auditor | No Firestore schema change |
| Service Layer Integrity Auditor | No service layer change |
| Auth & Permission Auditor | No auth/permission model change |
| File Placement Auditor | New script goes to `scripts/` — unambiguous placement |
| Decision & Standards Auditor | `STD-MOD-COMP-001` coverage note is a documentation extension, not a new ADR |

---

## Certified Decision

**ID**: `AC-DEC-2026-070`  
**Type**: EXPEDITED  
**Verdict**: APPROVED — Create `scripts/check-html-balance.cjs` and extend `verify:modular-architecture.cjs` step [2/6] to validate tag-balance on all SDCA `components/*.html` files.  
**Gap Variant B** (DOM nesting hierarchy): DEFERRED — `SK-028` re-open trigger.  
**Scope Annotation**: MANDATORY in script header.

---

## Enhancement Registration (SK-028)

Per `STD-PHASED-DEV-001`: this council session maps to **two deliverables**:

- **SK-028 Phase 1** (Required Now): `check-html-balance.cjs` + `verify-modular-architecture.cjs` extension — single-phase, ≤2 hours. Registered as **Simple** enhancement.
- **SK-028 open investigation** (Future Extension): DOM nesting hierarchy validation — held pending re-open trigger.

Next ID per `enhancement-config.json`: `SK-028`.

---

## Evidence Files Relied On (Snapshot)

| File | Commit at Time of Review |
|---|---|
| `scripts/verify-modular-architecture.cjs` | `5d4d0fe` (HEAD) |
| `scripts/test-shopping-registry.cjs` | `5d4d0fe` (HEAD) |
| `shopping_src/components/*.html` (4 files) | `5d4d0fe` (HEAD) |
| `cockpit_src/components/*.html` (6 files) | `5d4d0fe` (HEAD) |
| `decision_registry_src/components/body.html` | `5d4d0fe` (HEAD) |
| `enhancement-config.json` | `5d4d0fe` (HEAD) |
| `User_Created/Discussion Threads/Shopping/260927_RegressionHandling.md` | 2026-09-27 session |

**Staleness rule**: run `git log 5d4d0fe.. -- scripts/verify-modular-architecture.cjs scripts/test-shopping-registry.cjs shopping_src/components decision_registry_src/components cockpit_src/components` before relying on this ruling.

---

*Council artifact — route to `Council_Ledger.md` and proceed to SK-028 Phase 1 implementation via `writing-plans`.*
