---
slug: document-driven-guardrails
origin: CAP-035 (Portable Knowledge System)
tier: 🟢 Universal
description: "Using markdown documents as dynamic CI/CD databases for agent skills."
---

# Document-Driven Guardrails

## The Core Concept
Markdown documentation should not just be passive text for human readers; it should serve as **Active Infrastructure** and a structured data source for agent scripts and CI/CD pipelines. This pattern eliminates hardcoded validation rules by linking agent checks directly to living documents.

## Why This Exists (The Problem)
Agent-driven repositories frequently suffer from two problems:
1. **Silent Duplication**: Agents hallucinate or duplicate utility functions because they lack a systematic way to inventory what already exists.
2. **Hardcoded Guardrails**: Commit scripts and PR checks rely on hardcoded arrays (e.g., `grep "Deprecated_FuncA|Deprecated_FuncB"`). When architecture changes, developers forget to update the script, leading to false negatives or positives.

## The Solution: Active Infrastructure

### 1. The Pre-Creation Guardrail
Before an agent creates a new utility or architectural component, force it to read a central inventory (e.g., a `CORE_FUNCTION_INDEX.md`).
- **Implementation**: In your commit orchestrator or task initiation skill, mandate a "Check the Index" step.
- **Payoff**: Agents reuse existing functions instead of hallucinating duplicates, drastically reducing codebase bloat.

### 2. Markdown Tables as Dynamic Databases
Instead of hardcoding rules in bash scripts or agent instructions, use the columns of a Markdown table as the source of truth.
- **Implementation**: If you have a `CORE_FUNCTION_INDEX.md` with a "Status" column, your commit guardrail (e.g., Dead Reference Scan) should dynamically parse the table to find rows marked as "Deprecated", and construct its `grep` pattern on the fly.
- **Payoff**: The documentation *is* the configuration. When a developer or agent marks a function as "Deprecated" in the documentation, the CI/CD guardrail automatically begins enforcing the new rule without touching any code.

## Related Capabilities
- Fits cleanly into the `phased-commit-orchestrator` as Phase 0 logic.
- Complements the **Self-Guarding Manual System** by turning documentation updates into runtime assertions.
