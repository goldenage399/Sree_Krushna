# Sree_Krushna — Preflight Gate & Routing Table

> **Standard**: P82 (Governance Wiring Completeness)
> **Enforcement**: Run before making structural, code, or schema changes.

## Routing Matrix

| Row | Trigger / Condition | Standard / Protocol | Verification Action | Rationale / Failure Mode Prevented |
|---|---|---|---|---|
| R1 | Creating new Markdown specifications or guides | `.agent/workflows/portable/spoke-and-wheel-docs.md` | Check `hub:` frontmatter and verify registration in parent hub | Documentation drift and orphaned markdown files |
| R2 | Adding or updating `.agent/patterns/*.md` | `docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md` (PACT-001) | `npm run verify:governance-wiring` | Orphaned pattern contracts or unwired triggers |
| R3 | Running cross-repo sync | `.agent/workflows/sap-sync.md` | `npm run verify:governance-wiring:all` | Schema drift across sibling repositories |
| R4 | Modifying or creating web modules/registries | `STD-MOD-COMP-001` (Modular Component Architecture) | `npm run verify:modular-architecture` | Monolithic script bloat (>500 lines) and dual-release byte drift |
| R5 | Modifying visual procurement, shopping, or decor options | `P-COLLAB-VISUAL-INTAKE-001` (Tri-Modal Visual Intake) | `npm run test:shopping` | Single-asset lock-in, unnormalized Pinterest URLs, and broken deep-link state |
| R6 | Modifying client-side media intake (`controller.js`, `firestore-client.js`) or the standalone HTML shells (`shopping-registry.html`, `decorator-cockpit.html`) | `INV-DATA-TRANSIT-001` (`SK-012`) | `npm run verify:pipeline-contracts` | Base64 image data mocked into `localStorage`, and standalone shells silently missing a `firestore-client.js` dependency their controller needs (`INC-099`) |
| R7 | Session startup or authoring domain documentation / specs | `STD-UNIVERSAL-TAXONOMY-001` / `.agent/patterns/universal-repository-taxonomy-and-discovery-graph.md` (`SK-019`) | `npm run test:graph && npm run verify:taxonomy` | Unverified domain entities, non-canonical terminology, and slow exploratory discovery latency |
