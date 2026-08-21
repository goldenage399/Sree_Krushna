# Sree_Krushna — Preflight Gate & Routing Table

> **Standard**: P82 (Governance Wiring Completeness)
> **Enforcement**: Run before making structural, code, or schema changes.

## Routing Matrix

| Row | Trigger / Condition | Standard / Protocol | Verification Action | Rationale / Failure Mode Prevented |
|---|---|---|---|---|
| R1 | Creating new Markdown specifications or guides | `.agent/workflows/portable/spoke-and-wheel-docs.md` | Check `hub:` frontmatter and verify registration in parent hub | Documentation drift and orphaned markdown files |
| R2 | Adding or updating `.agent/patterns/*.md` | `docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md` (PACT-001) | `npm run verify:governance-wiring` | Orphaned pattern contracts or unwired triggers |
| R3 | Running cross-repo sync | `.agent/workflows/sap-sync.md` | `npm run verify:governance-wiring:all` | Schema drift across sibling repositories |
