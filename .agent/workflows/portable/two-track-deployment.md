---
pattern: two-track-deployment
origin_cap: CAP-035
tier: gas+firebase
applies_to:
  - "Decoupled backend/frontend (e.g. GAS + Firebase/Netlify/Vercel)"
  - "Headless API architectures"
prereqs:
  - "Separate deployment targets for API and Static Assets"
porting_effort: low
canonical_source: GEMINI.md Protocol #31
last_reviewed: 2026-04-18
description: "Simultaneous GAS and Firebase deployment."
---

# Portable Workflow: Two-Track Deployment

**Purpose:** Decoupled architectures (e.g. a serverless API and a static frontend) require coordinated deployments. Partial deployments leave the system in an inconsistent state where the frontend calls non-existent API endpoints or vice versa.

---

## 1. The Decision Matrix

Determine which tracks must be fired based on the files modified:

| Change Type | Track 1: Backend (API) | Track 2: Frontend (Assets) |
|---|---|---|
| API Code Only | YES | NO |
| Frontend Assets Only | NO | YES |
| Both API and Frontend | YES | YES |

---

## 2. Track 1 — Backend (API)

**Goal:** Update the serverless functions/scripts and ensure they are syntactically valid before pushing to production.

1. **Local Validation**: Run linters or syntax checks.
2. **Push**: Deploy to the serverless provider (e.g. `clasp push` for GAS, `serverless deploy` for Lambda).
3. **Verify**: Run a health-check endpoint (e.g. `doGet` or a `/status` route).

---

## 3. Track 2 — Frontend (Assets)

**Goal:** Build and upload static assets (HTML, JS, CSS) to the hosting provider.

1. **Extraction/Preparation**: If logic is embedded in HTML, extract it into modules.
2. **Build**: Run the bundler (e.g. `npm run build` with Vite).
3. **Deploy**: Upload the build folder (e.g. `dist/`) to the hosting provider (Firebase, Netlify).

---

## 4. Coordinated Deployment Gate

If both tracks are modified, NEVER skip a track.
1. Deploy the Backend FIRST.
2. Deploy the Frontend SECOND.
3. If the Backend deploy fails, STOP. Do not deploy the Frontend, as it will likely break in production.

---

## Gotchas

- **Shared Constants**: Ensure that constants (like API version or action names) are synchronized between both tracks before building.
- **Cache Invalidation**: Ensure the hosting provider invalidates CDN caches post-deploy to prevent users from seeing stale versions of the frontend.
