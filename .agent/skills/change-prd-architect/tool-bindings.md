# Tool Bindings for change-prd-architect — Capsicum

| Conceptual Tool    | Bound To                                                         | Notes                                                       |
|--------------------|------------------------------------------------------------------|-------------------------------------------------------------|
| repo.search        | Grep / ripgrep over `src/backend/` and `frontend/src/`          | Available natively in Claude Code                           |
| repo.read          | Read tool — filesystem access                                    | Available natively in Claude Code                           |
| docs.search        | Grep over `./docs/` + `./enhancement-notes/` + `ENHANCEMENTS.md`| Local markdown; search by keyword or heading                |
| tickets.search     | Read `ENHANCEMENTS.md` + Grep `enhancement-notes/` by CAP-ID    | No external ticket system; source is local enhancement notes|
| graph.dependencies | Read `docs/graphify-out/GRAPH_REPORT.md` + `docs/graphify-out/graph.json` + `docs/graphify-out/wiki/` | Full graphify output: god nodes, communities, `rationale_for` edges, `surprising_connections`, `AMBIGUOUS` edge provenance, wiki articles per community. Graph auto-rebuilds on commit via `.githooks/post-commit`. Re-run `/graphify` for a full LLM refresh. |
| tests.search       | Grep over `src/backend/Test_*.js`                                | One test file per CAP; pattern `runCAP{N}Tests()`           |
| runtime.search     | UNBOUND — no observability stack                                 | Note in Assumptions & Constraints; downgrade to Unknown     |
