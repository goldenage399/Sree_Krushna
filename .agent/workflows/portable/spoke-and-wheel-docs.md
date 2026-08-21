---
pattern: spoke-and-wheel-docs
origin_cap: CAP-035
tier: universal
applies_to:
  - "any project using markdown documentation"
  - "repositories with high documentation drift"
prereqs:
  - "Knowledge of markdown frontmatter"
porting_effort: medium
canonical_source: docs/DOCS_HUB_FOUNDATION.md
last_reviewed: 2026-04-18
description: "Decentralized documentation hub and Core Function Index."
---

# Portable Workflow: Spoke & Wheel Documentation

**Purpose:** Documentation rot happens when it has no architecture. This system treats docs as a first-class structural concern, ensuring nothing is orphaned, nothing is duplicated, and everything is discoverable.

---

## 1. Core Vocabulary

- **Hub**: A central index document (e.g. `DOCS_HUB.md`). Never contains raw content—only maps and links.
- **Spoke**: A content document (e.g. `SHEET_SCHEMAS.md`). Declares its parent hub in frontmatter.
- **Cog**: A domain unit (one hub + its spokes).
- **Interface Point**: A cross-hub link. The ONLY way one hub references another.
- **Axis**: The owner/role responsible for a cog.

---

## 2. Document Rules

### Hub Rules
- Named `HUB.md` or `DOCS_HUB.md`.
- Contains: Overview, State Snapshot (2-line phase summary), Spoke Index (table), Ownership.
- Maximum length: 150 lines (if exceeded, create a sub-hub).

### Spoke Rules
- Registered in exactly one hub.
- Declares parent hub in frontmatter: `hub: path/to/HUB.md`.
- Spoke content is the SSOT—hubs never duplicate spoke content.

---

## 3. Pre-Creation Protocol

Before creating any `.md` file, follow this decision sequence:

### Step 1 — Identify the file type
Use a standard naming convention:
- `{SUBJECT}_SCHEMA.md`
- `{SUBJECT}_PROTOCOL.md`
- `ADR-XXXX-title.md` (Decision records)
- `MANUAL_{SUBJECT}.md` (User guides)

### Step 2 — Placement
Place files in domain folders (e.g., `docs/infra/`). Never clutter the root `docs/` or repo root.

### Step 3 — Frontmatter
Every file MUST include:
```yaml
hub: path/to/parent/HUB.md
```

### Step 4 — Registration
Register the spoke in the parent hub's index table immediately. Update the hub's `last_reviewed` date.

---

## 4. No-Exception Rule

**The first exception is the beginning of the end.**
Documentation added outside the convention creates a precedent for entropy. An unregistered document does not exist to the agent.

---

## 5. The Core Function Index (CFI)

**Constraint:** A domain bounded repository might not need a universal utility layer, but any multi-module system needs a `CORE_FUNCTION_INDEX.md` (or similar Spoke).
**Why:** Without an index, utility functions (e.g. date formatting, DOM manipulation) are duplicated across modules, leading to architectural sprawl. 

**Protocol:**
1. Maintain an index of all pure utility/helper functions.
2. **Pre-Creation Guardrail**: Before creating any new function, search the index. If a partial match exists, extend or refactor the existing function; do not duplicate it.

---

## 6. Scaling
Scale by adding new domain hubs (Cogs) and linking them to the Root Hub. Cogs are autonomous but mesh at Interface Points.
