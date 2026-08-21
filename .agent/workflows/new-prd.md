---
description: Start a new Product Requirements Document (PRD) session using the change-prd-architect skill.
---

# Workflow: /new-prd

Trigger the change-prd-architect skill to start a new PRD session.

## Instructions
1. Load `.agent/skills/change-prd-architect/SKILL.md` in full.
2. Ask the user for the high-level change description if not already provided.
3. Begin Phase 1 of the skill workflow immediately.
4. Use Plan Mode throughout this task.
5. Save state to `./prd_state/prd_state_<change_id>.json` after every turn.
