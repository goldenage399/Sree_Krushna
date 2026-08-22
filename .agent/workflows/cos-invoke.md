---
description: COS Entry Protocol — thin entry point. Default path is the PREFLIGHT routing table + mechanical scan; full COS modes are the deep path for ≥3-surface tasks only.
layer: COS-L2 — Session-Intra Orchestration
---

# COS — Invoke Protocol (Demoted 2026-06-10)

> **System**: Cognitive Orchestration System (COS)
> **Change**: Mode choreography demoted per the 2026-06-10 governance review (`memory/decisions.md`). Risk signals are now mechanical (`npm run preflight`); routing knowledge lives in one page (`.agent/PREFLIGHT.md`). The MODE 1–5 state machine remains available as the deep path only.
> **When to use**: Any task that touches `src/`, `functions/`, or `firestore.rules`.

---

## Default Path (covers ~90% of tasks)

### Step 1 — Mechanical Signal Scan

```powershell
npm run preflight
```

Zero judgment required. The script scans the working diff for:
- **P11** — changed file >600 lines (warn) / >800 (hard ceiling)
- **P68** — Firestore API call in a file not registered in `.agent/context-registry.json` (exit 1)
- **P-SVC** — service/hook/context surface touched (implicit blast radius)

### Step 2 — Routing Table Lookup

Open `.agent/PREFLIGHT.md`. Match the task against rows R1–R22. Read the "Read FIRST" doc for each matched row **before opening target code**, then run the listed mechanical check before committing.

### Step 3 — Proceed

No signals + no table row matched → lightweight path, implement directly. Signals fired → follow the matched rows. Done.

---

## Deep Path (rare — full COS state machine)

Escalate to `.agent/skills/cos-orchestrator/SKILL.md` **only** when one of these holds:

1. A single task spans **≥3 surfaces simultaneously** (e.g. UI + Firestore schema + service layer), or
2. An **active `INC-XXX` incident** matches the task keywords, or
3. The task is a structural refactor of a god-node (>800 lines AND >10 consumers per `npm run impact`).

The deep path retains: MODE 1 (Topology) / MODE 2 (Implementation) / MODE 5 (Safe Refactor) dispatch, bundle contracts (`docs/ssot/architecture-hub/COS-BUNDLES.md`), and mode-transition verification:

```powershell
node .agent/bin/verify-mode-transition.js .agent/session/mode<N>-output.json
```

---

## Telemetry (always, session close)

Append one line to `.agent/memory/session_signals.jsonl` (template in `PREFLIGHT.md`). `npm run preflight:json` emits the mechanical half of the line for you.

---

## Reference

- **Routing table (canonical)**: `.agent/PREFLIGHT.md`
- **Service Write Wiring Check**: `.agent/patterns/service-import-without-write-wiring.md`
- **JWT Claims Sync Gate**: `.agent/patterns/jwt-claims-sync-gate.md`
- **Centralized Mutation Delegation**: `.agent/patterns/centralized-mutation-delegation.md`
- **Write-Without-Reader Check**: `.agent/patterns/write-without-reader.md`
- **Derive-Don't-Declare (guard-rail design)**: `.agent/patterns/derive-dont-declare-guardrails.md` — before adding or editing a lint or gate, ensure it READS the fact it protects rather than hardcoding a copy of it (INC-062).
- **Proxy-Signal Verdicts (verify before deleting)**: `.agent/patterns/proxy-signal-verdicts.md` — MANDATORY before any delete/merge/"consolidate": measure real consumption, diff real content, ignore mtimes and header comments, and re-verify at the moment of the edit (TASK-218: five wrong verdicts).
- **Position Routine Workspace Scoping**: `.agent/patterns/position-routine-workspace-vs-audit-scoping.md`
- **Recurring Checklist CRUD Playbook**: `.agent/patterns/recurring-checklist-crud-playbook.md` — read before any create/update/delete on `checklist_templates`/`checklist_instances` or item-level toggle/remark logic.
- **Typography Weight & Bridge Token Enforcement**: `.agent/patterns/typography-weight-and-bridge-token-enforcement.md`
- Full state machine (deep path): `.agent/skills/cos-orchestrator/SKILL.md`
- Intent-signal prose reference: `.agent/cos-intent-signal-routing-table.md`
- Bundle registry: `docs/ssot/architecture-hub/COS-BUNDLES.md`
