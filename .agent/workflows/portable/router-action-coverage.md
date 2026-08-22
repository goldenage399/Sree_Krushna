---
slug: router-action-coverage
origin: CAP-044 (Documentation Governance)
tier: 🟢 Universal
description: "Enforcing that every API action in a dispatch table is explicitly classified in a coverage manifest, with a commit-time gate and graphify-assisted gap detection."
---

# Router Action Coverage

## The Core Concept

Any project with a named API dispatch table — a map of `"actionKey": handler` — accumulates documentation debt silently. Each CAP adds actions; none require documentation as a condition of shipping. Over time, the gap between what the API does and what the manual describes grows unbounded.

This pattern closes that loop by:
1. Maintaining a **coverage manifest** — a single JSON file that classifies every action
2. Running a **commit-time validator** that fails if any action is unclassified
3. Enforcing a **CAP kickoff ritual** using Graphify's isolated-node report to catch gaps before they ship

## Why This Exists (The Problem)

In Capsicum, `02_Router.js` accumulated 57 actions across CAP-004 through CAP-043 with no documentation gate. By the time a Graphify audit ran during CAP-044 scoping, 116 isolated nodes had accumulated — functions and concepts with no connection to any workflow document.

The root cause was not laziness. It was the absence of a mechanical enforcement point. The YAML step schema (ADR-0020) was already enforcing *structure* within workflow docs, but had no mechanism to enforce *coverage* across the full action surface.

## The Pattern

### 1. Coverage Manifest (`router_coverage.json`)

A single JSON file at `docs/manual/router_coverage.json` (or equivalent path). Every action in the dispatch table must have an entry. Five categories:

```json
{
  "_meta": {
    "categories": {
      "wf:WF-XXX":         "Covered by a named workflow doc",
      "data_load":          "Read-only — documented in DATA_LOADS.md",
      "maintenance":        "Backend-only admin op — documented in MAINTENANCE_OPS.md",
      "excluded:<reason>":  "Not user-facing; reason required",
      "gap":                "Known debt — warns on commit, does not block"
    }
  },
  "markTaskComplete":   "wf:WF-002",
  "getDashboardData":   "data_load",
  "migrateLegacyLog":   "maintenance",
  "provisionCycleTasks":"excluded:called automatically during cycle start",
  "closeCropCycle":     "gap"
}
```

**The key design choice**: `gap` warns but does not fail. This allows the manifest to be bootstrapped for a project with pre-existing debt without blocking all commits. Any truly *new* undocumented action (absent from the manifest entirely) is a hard failure.

### 2. Validator Script (`validate_workflow_coverage.js`)

```javascript
// Minimal implementation — adapt path constants for your project
const routerContent = fs.readFileSync('src/backend/Router.js', 'utf-8');
const coverage      = JSON.parse(fs.readFileSync('docs/manual/router_coverage.json', 'utf-8'));
const { _meta, ...entries } = coverage;

// Parse action keys from dispatch table
// Capsicum pattern: "key": (req) => ...
// Firebase pattern: exports.key = onCall(...) — adapt regex accordingly
const actionKeys = parseRouterActions(routerContent);

let failures = 0;
actionKeys.forEach(key => {
  if (!(key in entries)) {
    console.error(`❌ "${key}" missing from router_coverage.json`);
    failures++;
  } else if (entries[key] === 'gap') {
    console.warn(`⚠️  GAP: "${key}" — known documentation debt`);
  }
});

// Verify wf: references point to existing workflow docs
Object.entries(entries).forEach(([key, val]) => {
  if (val.startsWith('wf:')) {
    const wfId = val.slice(3);
    const found = /* check workflow docs for id: ${wfId} */ false;
    if (!found) { console.error(`❌ "${key}" → "${val}" but no workflow with id: ${wfId} exists`); failures++; }
  }
});

process.exit(failures > 0 ? 1 : 0);
```

### 3. Pre-commit Hook

```sh
CHANGED=$(git diff --cached --name-only)
if echo "$CHANGED" | grep -qE '^src/backend/|^docs/manual/'; then
  node scripts/validate_workflow_coverage.js || exit 1
fi
```

Wire alongside any existing SSOT validators so backend commits run the full governance suite.

### 4. Graphify CAP Kickoff Ritual

At the start of every new CAP (before PRD or any code):
1. Check if Graphify is fresh (`git log -1 --format="%ci"` vs graph.json mtime)
2. If stale → rebuild
3. Read `GRAPH_REPORT.md` → **Knowledge Gaps** section
4. For every isolated node: confirm it has an entry in the coverage manifest
5. Record the isolated-node count in the CAP's planning notes
6. **Invariant**: count must not grow between pre-flight and post-CAP rebuild

This ritual ensures the commit-time gate and the graph-level view stay in sync. The validator catches new gaps mechanically; Graphify catches conceptual gaps (ADR cross-references, module relationships) that the validator can't reach.

## Companion Documents

Projects adopting this pattern need three reference files alongside the workflow docs:

| File | Purpose |
|---|---|
| `DATA_LOADS.md` | Reference table: read-only endpoints → trigger → data surface |
| `MAINTENANCE_OPS.md` | Reference table: backend-only ops → run method → effect |
| `router_coverage.json` | Classification manifest for every dispatch-table action |

These replace the temptation to force non-UI operations into the YAML step schema — a schema pollution failure mode that degrades structural linting across all workflow docs.

## Adapting to Other Stacks

### Firebase Callable Functions
```javascript
// Replace Capsicum's regex with:
function parseRouterActions(content) {
  const keys = [];
  const re = /exports\.(\w+)\s*=\s*onCall/g;
  let m;
  while ((m = re.exec(content)) !== null) keys.push(m[1]);
  return keys;
}
```

### Express.js Router
```javascript
// Replace with:
const re = /router\.(get|post|put|delete)\(['"]\/(\w[^'"]*)['"]/g;
// Extract the route path segments as action keys
```

### Any dispatch map (`switch` or object literal)
The validator works on any file where actions are registered as string keys. Adapt the regex to match your registration pattern.

## Evolution: covers_actions as Source of Truth (CAP-044+)

The baseline pattern above uses the manifest JSON (`router_coverage.json`) as the primary source for **all** classifications. This works but creates dual-maintenance: adding a `wf:WF-XXX` action requires updating both the manifest and the workflow doc.

**The evolved pattern** moves workflow action ownership into the workflow doc frontmatter:

```yaml
# docs/manual/workflows/culture-lab.md
---
id: WF-006
covers_actions:
  - registerContainer
  - startBatch
  - saveRecipe          # added when CAP-045 ships
---
```

The validator derives the workflow coverage map from all `covers_actions` fields, then falls back to the manifest only for non-workflow categories (`data_load`, `maintenance`, `excluded:`).

**Benefits:**
- Single artifact to update when adding a workflow action (the doc, not the doc + manifest)
- Bidirectional check: orphaned `covers_actions` entries (action removed from router) are caught as hard failures
- Workflow docs become self-describing — frontmatter declares what they cover, body shows how it works

**Validator changes:**
```javascript
// Build action → workflowId map from all workflow frontmatters
function buildCoversMap(workflowDir) {
    const map = {};
    fs.readdirSync(workflowDir).filter(f => f.endsWith('.md')).forEach(file => {
        const content = fs.readFileSync(path.join(workflowDir, file), 'utf-8');
        const id = parseFrontmatterField(content, 'id');
        parseCoversActions(content).forEach(action => { map[action] = id; });
    });
    return map;
}

// Check 1: every router action in coversMap OR in override manifest
// Check 2: every covers_actions entry exists in the router (bidirectional)
```

See ADR-0023 for the full decision record.

## Related Patterns
- **Structured Interaction Schema** (`structured-interaction-schema.md`) — defines the YAML step schema that this pattern enforces coverage for
- **Self-Guarding Manual System** — the broader governance architecture this pattern plugs into
- **Task Close Gate** (`task-close-gate.md`) — composes this validator with output freshness into a single agent task-close command
