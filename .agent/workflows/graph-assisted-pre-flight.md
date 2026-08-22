---
pattern: graph-assisted-pre-flight
origin_cap: CAP-044
tier: universal
applies_to:
  - "Large-scale agentic AI repositories"
  - "Refactoring and module-splitting tasks"
  - "High-risk business logic modifications"
prereqs:
  - "Dependency graph generator (e.g., Graphify)"
  - "Static analysis toolchain"
porting_effort: low
canonical_source: d:/GitHub_Repo/Capsicum/docs/ADRs/ADR-0019-Graph-Assisted-Pre-Flight.md
last_reviewed: 2026-05-04
description: Graph-Assisted Pre-Flight Discovery - Discover dependencies and prevent duplicated utilities using knowledge graphs.
---

# Graph-Assisted Pre-Flight Discovery

> **Purpose**: Eradicate "Surgical Blindness" by using dependency community analysis to identify hidden edges, god-nodes, and existing abstractions before drafting an implementation plan.

## 1. Problem: Surgical Blindness
Agents often perform "surgical" edits using grep/read-file, which provides a linear view of code but misses the architectural "gravity" of functions.
- **Risk 1**: Duplicating existing utilities hidden in unrelated files.
- **Risk 2**: Accidentally touching a "God Node" (high-edge center) that triggers a cascade of breaking changes.
- **Risk 3**: Drawing module boundaries through high-cohesion clusters, creating circular dependencies.

## 2. Solution: Step 0 Discovery
Before any PRD or implementation manifest, execute a "Graph Audit":

1.  **Identify Targets**: List the functions and files in scope.
2.  **Locate Communities**: Find the cohesion clusters (Communities) these functions belong to.
3.  **Audit God Nodes**: Check the top 5-10 nodes by edge count. If a target is a god node, escalate to "High Risk."
4.  **Abstraction Check**: Search the "Utility" communities (those with high inbound edges from multiple domains) for existing implementations of the planned feature.

## 3. Implementation Workflow

1.  **Generate Graph**: Run `graphify` or similar to produce a community report (`GRAPH_REPORT.md`).
2.  **Step 0 Verification**: Document the findings:
    - *"Target `logTask` is in Community 32 (Cohesion 0.53). No god-node risk."*
    - *"Proposed `validate` helper matches pattern in Community 49. Extending existing instead of creating new."*
3.  **Phased Planning**: If the graph reveals high coupling, break the implementation into "Extraction" and "Logic" phases to preserve graph integrity.

## 4. Key Benefits

-   **Zero Architectural Drift**: Code follows the natural shape of the system.
-   **Reduced Rollbacks**: Breaking cascades are identified in minutes, not hours.
-   **Knowledge Parity**: The agent inherits the architectural context of every previous developer via the graph.
