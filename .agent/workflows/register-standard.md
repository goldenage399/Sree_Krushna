---
description: Register a new code standard/pattern for propagation and enforcement across the codebase
---

# Register Standard Workflow

> **Purpose**: When you discover or implement a good pattern, register it as an enforceable standard so violations can be tracked and resolved across all modules.
> **Complement**: This feeds `.agent/standards-catalog.json` (WHAT) → `.agent/violation-patterns.json` (HOW) → `/scan-violations` → `.agent/technical-debt.md`

---

## Trigger Conditions

Invoke this workflow when:

- You implemented a pattern that **should be the standard** for all modules
- You discovered an existing pattern is **inconsistent** across modules
- A **PIRR check** reveals a practice that should be codified
- User says: "This should be the standard", "Let's enforce this everywhere"

---

## 🧊 Step 0 — Protocol Surface Freeze Gate (MANDATORY since 2026-06-10)

The protocol surface is **frozen** following the 2026-06-10 governance review (INC-005 was caused by registry collisions among proliferating standards). A new P-number may be registered **only if ALL four** pass:

1. **Evidence gate** — the pattern traces to a logged incident (`INC-XXX`) OR appears in ≥1 entry of `.agent/memory/session_signals.jsonl` (telemetry proof it fires in practice). Aspirational standards are rejected — document them as notes in the relevant pattern doc instead.
2. **Enforceability gate** — state HOW it will be checked mechanically (ast-grep rule, ESLint rule, or `preflight-gate.cjs` extension). If it cannot be scripted, it is *advice*, not a standard — add it as a row in `.agent/PREFLIGHT.md` instead of a P-number.
3. **Uniqueness gate** — `npm run lint:standards` AND `node scripts/verify-standards-integrity.cjs` pass with the new entry (no ID collisions, no Jaccard overlap >0.45 with an existing standard).
4. **Single-registry gate** — the entry lands in `.agent/standards-catalog.json` FIRST; `GEMINI.md` and `violation-patterns.json` entries must reference that ID, never introduce their own.

If any gate fails → **HALT registration** and record the candidate in `technical-debt.md` for review instead.

---

## Step 1 — Describe the Pattern

Document what the standard IS:

```
Pattern Name: [e.g., "Declarative Field Schema"]
Origin: [PIO that introduced it, or incident that revealed need]
Current State: [Which modules already follow it? Which don't?]
Why It Matters: [What breaks if violated?]
```

**Example**:
```
Pattern Name: WriteJournal Audit Trail
Origin: PIO-044 (data loss incident)
Current State: Expense ✅, Ledger ✅, Accounts ✅, Receivables ❌
Why It Matters: No audit trail → no rollback → data loss risk
```

---

## Step 2 — Classify Enforcement Level

| Level | Meaning | Action |
|-------|---------|--------|
| **CRITICAL** | Production risk if violated | Must fix before next deploy |
| **HIGH** | Data integrity risk | Create PIO, fix within sprint |
| **MEDIUM** | Maintainability risk | Track in debt register, fix opportunistically |
| **LOW** | Aspirational / cosmetic | Document only, no active tracking |

---

## Step 2.5 — Register in Standards Catalog

Add or update entry in `.agent/standards-catalog.json`:

```json
{
    "id": "P{XX}",
    "category": "governance|data-integrity|schema-safety|performance|deployment|ui-quality|architecture|testing|documentation|memory",
    "name": "Pattern Name",
    "description": "One-line description of what the standard requires.",
    "severity": "CRITICAL|HIGH|MEDIUM|LOW",
    "enforcement": {
        "checkpoints": ["pre-commit", "PIRR", "deploy"],
        "detectionPatternId": "P{XX}_{PATTERN_NAME}" ,
        "manualOnly": false
    },
    "lifecycle": {
        "createdDate": "YYYY-MM-DD",
        "sunsetDate": null,
        "reviewCycle": "permanent|annual"
    },
    "references": ["path/to/relevant/doc"],
    "incidents": ["PIO-XXX"]
}
```

> [!IMPORTANT]
> If the standard has no scannable regex, set `"detectionPatternId": null` and `"manualOnly": true`.
> The catalog entry is the **authoritative definition** (WHAT). The violation pattern is the **detection mechanism** (HOW).

---

## Step 3 — Create Violation Pattern

Add entry to `.agent/violation-patterns.json`:

```json
{
    "P{XX}_{PATTERN_NAME}": {
        "standardId": "P{XX}",
        "regex": "pattern-to-detect-violation",
        "severity": "HIGH",
        "message": "Human-readable explanation of what's wrong and how to fix",
        "exceptions": [
            "files-or-patterns-that-are-exempt",
            "@compliance-ignore P{XX}"
        ],
        "protocols": ["P{XX}"],
        "checkpoints": ["PIRR"],
        "reference": "GEMINI.md Protocol #{XX}"
    }
}
```

> [!IMPORTANT]
> Not all standards can be detected by regex. For non-regex-scannable standards:
> - Set `"regex": null`
> - Add `"manualCheck": "Description of what to look for"`
> - These are checked during PIRR only (not automated scanning)

---

## Step 4 — Check If Protocol Exists in GEMINI.md

- **If YES**: Verify the protocol number matches the pattern ID. Done.
- **If NEW**: Assess via [/post-incident-governance](post-incident-governance.md) Step 2 (§2.5 classification):
  - **(A) Structural** → Add protocol to GEMINI.md `### Mandatory Tooling Protocols`
  - **(B) Diagnostic** → Skip GEMINI.md, keep pattern in `violation-patterns.json` only

---

## Step 5 — Run Initial Scan

Invoke `/scan-violations` with the new pattern to:
1. Find all current violations across the codebase
2. Populate `.agent/technical-debt.md` with findings
3. Optionally create a PIO for clustered violations

---

## Step 6 — Update Documentation

| Check | Action |
|-------|--------|
| `standards-catalog.json` updated? | ✅ Step 2.5 |
| `violation-patterns.json` updated? | ✅ Step 3 |
| GEMINI.md protocol added (if structural)? | ✅ Step 4 |
| `technical-debt.md` populated? | ✅ Step 5 |
| PIO created (if HIGH+ cluster)? | If needed |
| `CORE_FUNCTION_INDEX.md` updated (if new functions)? | If applicable |

---

## Decision Tree

```
"This pattern should be standard"
        │
        ▼
   Step 1: Describe It
        │
        ▼
   Step 2: Classify Severity
        │
        ▼
   Step 2.5: Add to standards-catalog.json (WHAT)
        │
        ▼
   Step 3: Add to violation-patterns.json (HOW)
        │
        ▼
   Step 4: Protocol exists?
    ┌────┴────┐
    YES       NO
    │         │
    │    §2.5 Classify
    │    ┌────┴────┐
    │    (A)       (B)
    │    │         │
    │  Add to    Skip
    │  GEMINI.md GEMINI
    │    │         │
    └────┴────┬────┘
              │
              ▼
   Step 5: /scan-violations
              │
              ▼
   Step 6: Update docs
```
