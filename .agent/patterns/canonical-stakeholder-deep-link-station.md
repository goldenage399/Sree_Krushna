---
pattern: canonical-stakeholder-deep-link-station
activation_tier: guarded
guard: "npm run verify:deployment"
canonical_source: sree-krushna
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: .agent/workflows/web-deployment-gate.md
    at: "Step 1 — Run the Automated Pre-Flight Gate"
triggers:
  - "getStakeholderUrl"
  - "executiveShareModal"
  - "quick-share"
  - "stakeholder share"
  - "deep link station"
portability: universal
porting_effort: low
---

# Pattern: Canonical Stakeholder Deep-Link Station & SPA Pathname Conflation Defense

**Standard ID**: `P-QUICK-SHARE-001` (`AC-DEC-2026-027` / `UI-DEC-2026-023`)  
**Category**: Architecture / Multi-Surface / Stakeholder Access / Deep Linking  
**Origin**: Sree Krushna Incident INC-090 (`BUG-SHARE-BASEURL-001`)  
**Status**: VALIDATED  

---

## 1. Problem Statement & Anti-Pattern

In multi-surface web applications where modular components exist both as **standalone satellite web pages** (e.g., `/shopping-registry.html`, `/decision-registry.html`) and as **dynamic embedded fragments** inside an authenticated SPA shell (`#tab-shopping`, `#tab-decision-registry` inside `/index.html`), client-side share link generators suffer from **SPA Pathname Conflation**:

```javascript
// ❌ ANTI-PATTERN: Blind pathname inheritance
const shareUrl = window.location.origin + window.location.pathname + '?mode=family';
```

- When run on `/shopping-registry.html`: Produces `https://domain.com/shopping-registry.html?mode=family` (Works).
- When run inside the SPA host (`/` or `/index.html`): Produces `https://domain.com/?mode=family` (BROKEN!).

### The Consequence
When the groom, bride, or executive shares links with non-technical stakeholders (parents, elders, sisters, committee members) via WhatsApp:
1. Recipients land on the main authenticated SPA application root (`/`).
2. They are blocked by Google OAuth / authentication login walls.
3. Elders and relatives become confused, frustrated, and abandoned without seeing the survey or styling options.

---

## 2. The 4 Mandatory Invariants

### INV-SHARE-01: Explicit Portal Filename Canonicalization
Share link generators MUST NOT derive the portal URL from `window.location.pathname`. They MUST explicitly anchor against the canonical standalone portal filename via a centralized utility:

```javascript
SKPrimitives.getStakeholderUrl = function(portalFile, params = {}) {
  const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
  const cleanFile = (portalFile || 'shopping-registry.html').replace(/^\/+/, '');
  const url = new URL(cleanFile, origin.endsWith('/') ? origin : origin + '/');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  });
  return url.toString();
};
```

### INV-SHARE-02: 3-Tier Resilient Clipboard Dispatch
Link copy affordances MUST support progressive fallback across hostile mobile web environments, iframe sandboxes, and unprivileged contexts:
1. Modern Async Clipboard API (`navigator.clipboard.writeText`)
2. Synchronous hidden `<textarea>` DOM execCommand fallback (`document.execCommand('copy')`)
3. Interactive user modal prompt (`window.prompt`)
4. Immediate non-blocking toast feedback (`SKPrimitives.showToast`)

### INV-SHARE-03: Dual-Surface Affordance Locality
Stakeholders and administrators must never have to dig through chat history or commit logs to distribute links. Every multi-surface application MUST provide:
1. **Global Executive Quick-Share Station**: A globally accessible header button (`[🔗 Share Links]`) and modal accessible from every page and tab, presenting the full catalog of audience-targeted deep links.
2. **In-Tab Contextual Share Bars**: Sticky or hero-level quick-share bars embedded directly above modular content, offering 1-click WhatsApp message copy and standalone portal breakout links.

### INV-SHARE-04: Dual-Release Pre-Flight Verification Gate
Automated pre-flight verification scripts (`verify-web-deployment-gate.cjs` / `test:shopping`) MUST statically assert:
- `getStakeholderUrl` is defined and used by all share handlers.
- Both Root (`/`) and Public (`/public`) entry points contain the share button and modal.
- Standalone and fragment bundles contain the in-tab share bar and pop-out affordances.
- 100% byte-for-byte parity is preserved between root and public distributions.

---

## 3. Reference Implementation

### Centralized Primitives Utility (`ui_primitives/scripts/primitives_core.js`)
```javascript
copyStakeholderShareLink: function(portalFile, params, label) {
  const url = this.getStakeholderUrl(portalFile, params);
  const toastMsg = label ? `Copied ${label} Link!` : 'Copied link to clipboard!';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      this.showToast(toastMsg, 'success');
    }).catch(() => {
      this._fallbackCopyText(url, toastMsg);
    });
  } else {
    this._fallbackCopyText(url, toastMsg);
  }
}
```

### WhatsApp Message Dispatch Helper
```javascript
copyWhatsAppMessage: function(portalFile, params, title, summary) {
  const url = this.getStakeholderUrl(portalFile, params);
  const msg = `*${title}*\n\n${summary}\n\n👉 Open Portal: ${url}`;
  this._fallbackCopyText(msg, `Copied WhatsApp message for ${title}!`);
}
```

---

## 4. Verification Checklist

- [x] Canonical URL generation is centralized in `SKPrimitives.getStakeholderUrl`.
- [x] Zero usage of `window.location.pathname` in share link construction.
- [x] Global Executive Share Station accessible from top navigation dock.
- [x] Contextual in-tab share bar present in both shopping and decision registry modules.
- [x] Automated pre-flight check in `npm run verify:deployment` asserts affordances.
- [x] 100% byte parity between root and public files.
