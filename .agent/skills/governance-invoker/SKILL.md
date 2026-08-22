---
description: Invokes Python governance layer for research workflows - enforces 6-phase state machine with blockers
---

# Governance Workflow Skill

> **Trigger**: Research tasks, multi-document analysis, or when `/research-governance` workflow is invoked
> **Purpose**: Activate Python Layer 2 enforcement for systematic research

---

## Pre-Flight Check

Before invoking governance:

```python
from governance.config import GovernanceConfig

config = GovernanceConfig()
if not config.is_enabled():
    # Governance is disabled - proceed without enforcement
    print("⚠️ Governance disabled. Proceeding without enforcement.")
```

---

## Quick Start

### Check Status

```bash
python -m governance.cli status
```

### Enable/Disable Toggle

```bash
python -m governance.cli enable   # Turn ON
python -m governance.cli disable  # Turn OFF
```

### Run Governed Research

```bash
python -m governance.cli start-research "What is X?" --docs doc1.md doc2.md
```

---

## Python Usage

```python
from governance import ResearchGovernanceWorkflow, BlockedPhaseError
from governance.config import GovernanceConfig

# Check if governance is enabled
config = GovernanceConfig()
if config.is_module_enabled('accounts'):

    # Create workflow
    workflow = ResearchGovernanceWorkflow(
        research_question="Analyze governance frameworks",
        documents=["doc1.md", "doc2.md"]
    )

    try:
        report = workflow.run_full_research()
        print(f"✅ Complete: {report['status']}")
    except BlockedPhaseError as e:
        print(f"❌ Blocked: {e}")
        # MUST stop and resolve blocker
```

---

## Toggle Config

Edit `governance/governance_config.json`:

```json
{
  "governance_enabled": true, // Master toggle

  "modules": {
    "accounts": true, // Per-module toggle
    "expense": true,
    "ledger": true,
    "receivables": false
  }
}
```

---

## What's Enforced

| Feature         | When Enabled                    |
| --------------- | ------------------------------- |
| Phase Blockers  | Cannot skip phases              |
| Discovery Gates | Must halt on ambiguity          |
| 100% Coverage   | All documents must be processed |
| Audit Trail     | All actions logged              |

---

## Integration Points

1. **Workflow**: `.agent/workflows/governance-workflow.md`
2. **Protocol**: `GEMINI.md` Protocol #30
3. **CLI**: `python -m governance.cli`
4. **Skill**: This file (auto-invoked by agent)

---

## Related

- [governance-workflow.md](../workflows/governance-workflow.md)
- [GEMINI.md Protocol #30](../../GEMINI.md)
- [GOVERNANCE_PROTOCOL.md](../../docs/GOVERNANCE/GOVERNANCE_PROTOCOL.md)
