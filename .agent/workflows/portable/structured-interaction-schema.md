---
slug: structured-interaction-schema
origin: CAP-043 (Documentation Governance)
tier: 🟢 Universal
description: "Encoding UI interactions into formal YAML blocks within markdown to enable programmatic compilation and architectural linting."
---

# Structured Interaction Schema

## The Core Concept
User manuals and workflow documentation should not be written as passive bullet points. By formatting interaction steps as structured YAML blocks embedded within markdown, you create an **Active Specification**. This allows custom build scripts to parse, validate, and compile role-specific manuals while enforcing architectural UI taxonomies.

## Why This Exists (The Problem)
Agent-driven repositories frequently suffer from "Ghost Documentation":
1. **UI Drift**: The application's navigation, button labels, and validation states evolve, but the markdown manuals do not.
2. **Decoupled Taxonomies**: Engineering defines a strict taxonomy for error states or UI blocking cards, but the manual describes these states using loose, informal language.
3. **Context Collapse**: Non-technical users need simple step-by-step instructions, while engineers need preconditions, outcomes, and failure IDs. Mixing both in plain markdown creates unreadable files.

## The Solution: YAML Step Blocks

Instead of writing:
```markdown
1. Go to Admin Panel and click Start Cycle. If it fails, check if the protocol exists.
```

Write a structured block:
```yaml
manager:
  - id: STEP-001
    view: "Admin Panel > Block Config"
    element: "Start Cycle button"
    precondition: "Block card shows 'No Active Cycle'"
    action: "Fill form and click the Start Cycle button"
    expected_outcome: "Toast notification confirms cycle creation"
    blocking_state_ref: "NO_SCHEDULE_DEFINED"
    error_inline: "FC-001"
```

### 1. Enforcing Taxonomy
By adding the `blocking_state_ref` field, the document compiler can validate that the error state actually exists in the project's visual language specification (e.g., ADR-0009). If the code doesn't exist, the step is invalid.

### 2. Auto-Inlining Failures
The compiler uses the `error_inline` reference to dynamically pull the fix instructions from a `failure_cases` block and inject it directly below the step in the final compiled user manual. This keeps the source file DRY but the output manual highly contextual.

### 3. Role-Based Generation
Because the YAML block maps arrays to roles (`user:`, `manager:`, `admin:`), a simple compiler script can extract exactly what is needed for a specific audience without string-matching markdown headers.

## Related Capabilities
- Complements the **Self-Guarding Manual System** by adding deep structural validation to the documents being tracked.
