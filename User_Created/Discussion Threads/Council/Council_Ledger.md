# 🏛️ Architecture & Governance Council Ledger

This ledger records all formal Council reviews, deliberations, and amendments across the Sree Krushna Marriage OS and synchronized repositories.

| Date | Council | Type | Subject | Verdict / Summary | Artifact Link | Snapshot Hash |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-08-22 | Architecture | FULL | Universal Web Release & Refactor Assurance Pipeline (`P-VERIFY-GATE-002`) | APPROVED: (1) Mandate 6-layer zero-proxy deployment gate (`verify-deployment.cjs`), (2) Enforce AST decomposition audit against git history (`forensic-audit.cjs`), (3) Ban heuristic regex preflight checks, (4) VETO heavyweight npm package in favor of zero-dependency SAP-synced scripts. | [260822_arch_council_release_and_refactor_assurance_pipeline.md](./260822_arch_council_release_and_refactor_assurance_pipeline.md) | d0d507e6491d760ba9e42d6f19e9327e58c1398c |
| 2026-08-22 | Architecture | FULL | Web App Bootstrap Package & Release Module Architecture (`SPEC-SAP-BOOTSTRAP-001`) | APPROVED: (1) Build zero-dependency native Node.js bootstrap CLI (`bootstrap-web-app.cjs`) with `scaffold` and `retrofit` subcommands, (2) Turnkey starter template in `templates/web-spa-shell/` with Auth, Theme, PWA, Tokens, and 6-layer gate, (3) Auto-verification on generation, (4) VETO npm package publishing in favor of local SAP synchronization. | [260822_arch_council_web_app_bootstrap_package.md](./260822_arch_council_web_app_bootstrap_package.md) | d0d507e6491d760ba9e42d6f19e9327e58c1398c |
