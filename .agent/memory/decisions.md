# Architectural & Implementation Decisions

- [2026-09-16 11:15] **Decision**: Institutionalize Universal Executive Stakeholder Quick-Share Station & Canonical Deep-Link Architecture (AC-DEC-2026-027 / UI-DEC-2026-023 / P-QUICK-SHARE-001).
  - **Rationale**: Prevented SPA Pathname Drift (BUG-SHARE-BASEURL-001) where copying links within embedded SPA tabs produced root URLs ('/?mode=family') that forced unauthenticated elders/parents to encounter Google Auth login screens. Explicitly anchored all stakeholder share links to canonical standalone portal filenames via SKPrimitives.getStakeholderUrl. Deployed global header station with 10 verified stakeholder deep links and in-tab contextual share bars.
  - **Alternatives**:
    1. Rely on window.location.pathname (rejected: breaks whenever modular components are mounted into SPA host shell).
    2. Require elders to authenticate with Google (rejected: high cognitive friction, breaks effortless WhatsApp survey access for non-technical family members).
    3. Keep deep links in documentation only (rejected: executive host cannot quickly retrieve and dispatch links from live application).

- [2026-09-16 01:30] **Decision**: Dual-Look Groom Wardrobe Transition Protocol (AC-DEC-2026-025 / UI-DEC-2026-021 / P-LITURGICAL-ATTIRE-001).
  - **Rationale**: Reconciled theological Vedic liturgy (unstitched Ahatavasana Sambalpuri Silk Joda required for havan fire rites) with photographic pageantry (Sherwani for Barat and stage Varmala photos).
  - **Alternatives**:
    1. Wear Sherwani at Mandap (rejected: strictly non-Vedic, heat exhaustion danger at 1.5m from Agni).
    2. Omit Sherwani entirely (rejected: groom and family desire grand royal arrival aesthetic).