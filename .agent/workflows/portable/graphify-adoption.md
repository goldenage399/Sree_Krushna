---
description: "Standard protocol for knowledge graph onboarding and documentation semantic expansion."
---

<!-- shared:std.knowledge-graph.adoption-guide:start -->
# Graphify Adoption & Initiation Guide (GAIG)
## Standard Protocol for Knowledge Graph Onboarding

This document provides the standard procedure for initiating Graphify in a new repository or upgrading an existing one to include full documentation semantic coverage.

---

## 1. Prerequisites
- **Graphify Skill**: Must be installed at `C:\Users\TEMP\.agent\skills\graphify\SKILL.md`.
- **Python 3**: Required for AST extraction and graph processing.
- **Git**: Required for pre-commit hook integration.

---

## 2. Initiation Process (Phased Rollout)

### Phase 1: Structural Detection
Run the detection script to identify all files in scope.
```bash
python -m graphify . --detect --output ./graphify-out
```
*Verify `.graphify_detect.json` for file counts.*

### Phase 2: AST Extraction (Code Layer)
Extract structural relationships from source code (.js, .py, .jsx, etc.).
```bash
python -m graphify . --ast --output ./graphify-out
```
*Verify `.graphify_ast.json` existence.*

### Phase 3: Semantic Extraction (Documentation Layer)
For large documentation corpuses (e.g., 500+ .md files), use the **Deterministic Batch Extraction** method:
1. Generate the file list: `Get-ChildItem -Recurse -Filter *.md | Select-Object -ExpandProperty FullName > .graphify_uncached.txt`
2. Prepare the `DOCS_EXTRACTION_PROMPT.md` using the template from `Task-Dashboard/graphify-out/DOCS_EXTRACTION_PROMPT.md`.
3. Execute extraction in chunks (recommended 20-25 files per chunk).
4. Store chunks as `graphify-out/.graphify_chunk_NN.json`.

### Phase 4: Collection & Merging
Merge the AST graph with semantic chunks.
```bash
python -m graphify --merge ./graphify-out --output ./graphify-out/graph.json
```

---

## 3. Session Protocol Integration

### Pre-Commit Hook
Install the pre-commit hook to ensure the graph stays synchronized with code changes.
```bash
# Copy template to .git/hooks/pre-commit
cp .agent/workflows/graphify.md .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Session Opener
Always start a new AI session by loading the graph:
> Before we start, read `graphify-out/GRAPH_REPORT.md` in full, then `graphify-out/graph.json`.

---

## 4. Cross-Repo Alignment
If this repo shares standards with others (e.g., `Capsicum`, `Task-Dashboard`), use the `docs/SHARED_ALIGNMENT_PROTOCOL.md` to track shared blocks.

### Shared Block Example
```md
<!-- shared:std.knowledge-graph.session-protocol:start -->
... (Content from graphify.md) ...
<!-- shared:std.knowledge-graph.session-protocol:end -->
```

---

## 6. Governance & Lifecycle

### Persistent Presence (Living SOP)
While Phases 1–4 are transitory "scaffolding" steps for initiation, this guide remains a **persistent standard** in every repository to govern **Maintenance** (Phase 5) and **Audit** routines. 

### Why Constant Sync?
The `graphify` toolset and its underlying extraction algorithms are subject to evolutionary updates. Maintaining a synced copy of this guide via the **Shared Alignment Protocol** ensures:
- **Consistency**: All repositories use the same re-clustering and deduplication thresholds.
- **Pattern Parity**: New "God Node" or "Thin Community" detection rules are immediately available to all agents.
- **Audit Integrity**: Standardized reporting formats ensure cross-repo architectural analysis remains comparable.

> **Note**: This document is a "Portable Pattern" canonicalized in `Capsicum`. It is synchronized to local repos to prevent architectural drift during the maintenance phase.
<!-- shared:std.knowledge-graph.adoption-guide:end -->
