---
description: Streamlined SSOT Conflict Resolution Workflow
---

# /ssot-reconciliation-lite

**Purpose**: Quickly resolve drift when code and documentation diverge.

---

## Step 1 — Identify the Drift
Pinpoint which documentation file (ADRs, schemas, readmes) has outdated data or contradicts active code.

## Step 2 — Edit the Authoritative Doc
Modify the SSOT file directly using the `writing-technical-documentation` skill. Update the file in place to represent the correct state of the codebase.

## Step 3 — Registry Update (if applicable)
If your changes added, deleted, or renamed code files with database/collection dependencies, update `.agent/context-registry.json` immediately.
