---
slug: just-in-time-architecture
origin: CAP-035 (Portable Knowledge System)
tier: 🟢 Universal
description: "Planting dormant triggers for future patterns instead of pre-building them."
---

# Just-In-Time Architecture (The Stub Pattern)

## The Core Concept
Do not build architectural infrastructure (like function indices, complex mappers, or shared utility layers) before the codebase needs them. Instead, plant a **Dormant Trigger (Stub)** in the agent's workflow that will automatically provision the architecture the moment the triggering condition is met.

## Why This Exists (The Problem)
Agents are prone to over-engineering. If they see an architectural pattern in their prompt or skill files, they may attempt to implement it universally, even if the current repo's scale doesn't warrant it. Building premature architecture creates maintenance overhead and slows down feature delivery.

## The Solution: The Stub Pattern

Instead of building the system, build the *instruction to build the system*, and hide it behind a strict conditional gate.

### Example: Core Function Index (CFI)
If a repository is small and strictly uses domain-bounded files with zero duplicates, it does not need a Core Function Index. However, if it grows, it might.
Instead of forcing a CFI early, place this in the agent's Phase 0 commit checklist:

```markdown
5. New shared utility module added (`00_*.js`)? → Create `CORE_FUNCTION_INDEX.md`.
   > Pattern: /path/to/reference/CORE_FUNCTION_INDEX.md
   > Trigger: Only when a reusable utility layer emerges — not for domain files.
```

### Payoff
1. **Zero Overhead**: The architecture costs nothing to maintain while the trigger is unmet.
2. **Guaranteed Execution**: The agent checks the condition on every commit. The moment the condition is met, the architecture is provisioned perfectly based on the referenced pattern.
3. **Context Preservation**: The "why" and "how" of the architecture are preserved in the skill file, so the agent doesn't have to relearn or deduce the pattern months later.

## When to Use
- **Potential Future Complexity**: When you anticipate needing a complex pattern but current requirements are simple.
- **Porting Heavy Patterns**: When adapting heavy patterns from mature sibling repositories into a new, smaller repository.
