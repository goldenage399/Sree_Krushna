---
description: Turn any folder of files into a navigable knowledge graph
---

# Workflow: graphify
**Command:** /graphify
**Description:** Turn any folder of files into a navigable knowledge graph

## Steps
Follow the graphify skill installed at C:\Users\TEMP\.agent\skills\graphify\SKILL.md to run the full pipeline. In this repository, the build and post-processing steps are custom-orchestrated via the finalize script:

```bash
python scratch/finalize_graph.py
```

If no path argument is given, use `.` (current directory).

<!-- shared:std.knowledge-graph.session-protocol:start -->
## Session Protocol

### Pre-Commit Hook

Install once in each repo that uses Graphify. Rebuilds the graph incrementally and tracks its structural outputs on every commit.

```bash
#!/bin/bash
# .git/hooks/pre-commit
REPO_ROOT=$(git rev-parse --show-toplevel)
OUT_DIR="$REPO_ROOT/graphify-out"
PYTHON="python"           # Override if using a specific interpreter (e.g. python3)

echo "Graphify: rebuilding knowledge graph..."
"$PYTHON" "$REPO_ROOT/scratch/finalize_graph.py" || \
  python3 "$REPO_ROOT/scratch/finalize_graph.py" || {
    echo "❌ Graphify: Build failed. Please check Python environment/dependencies."
    exit 1
  }

# Track outputs automatically into the commit
git add "$OUT_DIR/graph.json" "$OUT_DIR/GRAPH_REPORT.md" 2>/dev/null || true
echo "Graphify: done"
```

```bash
# One-time setup
cp .git/hooks/pre-commit-graphify .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Session Opener

Paste this at the start of every new session before asking any architecture or codebase questions:

> Before we start, read `graphify-out/GRAPH_REPORT.md` in full, then `graphify-out/graph.json`.
> Note the god nodes, community clusters, and edge types (EXTRACTED vs INFERRED).
> Tell me in one sentence what you understand the core of this system to be — then wait for my first question.

The one-sentence response is a sanity check. If the answer is wrong, the agent did not load the graph correctly.

### Output Location

| File | Purpose |
|---|---|
| `graphify-out/graph.json` | GraphRAG-ready, structured, persistent across sessions |
| `graphify-out/graph.html` | Interactive visual — open in browser |
| `graphify-out/GRAPH_REPORT.md` | Plain-language audit: god nodes, communities, surprises |
<!-- shared:std.knowledge-graph.session-protocol:end -->
