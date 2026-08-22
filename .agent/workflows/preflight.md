---
description: Pre-change routing shim — canonical content lives in .agent/PREFLIGHT.md (one-page table R1-R12 + npm run preflight mechanical scan).
---

# Preflight (shim)

Read and apply **`.agent/PREFLIGHT.md`** — the canonical one-page pre-change routing table (default path since the 2026-06-10 COS demotion).

1. `npm run preflight` — mechanical P11/P68/P-SVC scan of the working diff
2. Match task against table rows R1–R12 → read the "Read FIRST" doc before touching code
3. Escalate to `.agent/skills/cos-orchestrator/SKILL.md` only for ≥3-surface tasks, active `INC-XXX`, or god-node refactors

This file exists only so `verify-router-integrity.cjs` resolves the `preflight` router entry to a physical asset.
