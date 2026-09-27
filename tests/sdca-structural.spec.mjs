// @ts-check
/**
 * sdca-structural.spec.mjs — SDCA Runtime DOM Contract Assertions (SK-028 Phase 3)
 *
 * SCOPE: Gap Variant C — asserts that lazy-mounted SDCA fragments deliver the
 * required DOM ancestry contracts (declared in .structural-contracts/*.json)
 * in the browser's live DOM after tab activation.
 *
 * This is what Phases 1 and 2 cannot catch: malformed HTML that browsers
 * silently error-recover into a wrong DOM structure (the fd47c6f regression class).
 *
 * Infrastructure: playwright.config.mjs — baseURL=localhost:5000,
 * webServer: node scripts/dev-server.cjs (auto-started by Playwright)
 *
 * Tab nav selectors — confirmed in index.html:
 *   Shopping:          data-testid="nav-tab-shopping"          (L:207)
 *   Cockpit:           data-testid="nav-tab-cockpit"           (L:206)
 *   Decision Registry: data-testid="nav-tab-decision-registry" (L:205)
 *
 * See: STD-STRUCTURAL-CONTRACT-001 / SK-028 / AC-DEC-2026-070
 */
import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Activates an SPA tab in the local testing environment by ensuring the app shell
 * is visible and invoking tab navigation.
 * @param {import('@playwright/test').Page} page
 * @param {string} tabId e.g. 'tab-shopping'
 * @param {string} [waitSelector] DOM selector that confirms fragment mounting
 */
async function activateTab(page, tabId, waitSelector) {
  await page.goto('/');
  await page.evaluate((target) => {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.style.display = 'none';
    const skeleton = document.getElementById('authLoadingSkeleton');
    if (skeleton) skeleton.style.display = 'none';
    const appRoot = document.getElementById('appRoot');
    if (appRoot) appRoot.style.display = 'block';

    if (typeof window.switchTab === 'function') {
      window.switchTab(target);
    }
  }, tabId);

  if (waitSelector) {
    await page.waitForSelector(waitSelector, { state: 'attached', timeout: 10000 });
  }
}

/**
 * Asserts that #childId is a DOM descendant of #ancestorId in the live page.
 * @param {import('@playwright/test').Page} page
 * @param {string} childId
 * @param {string} ancestorId
 */
async function assertDescendantOf(page, childId, ancestorId) {
  const isDescendant = await page.evaluate(
    ({ child, ancestor }) => {
      const childEl    = document.getElementById(child);
      const ancestorEl = document.getElementById(ancestor);
      return !!(childEl && ancestorEl && ancestorEl.contains(childEl));
    },
    { child: childId, ancestor: ancestorId }
  );
  expect(isDescendant, `#${childId} must be a DOM descendant of #${ancestorId}`).toBe(true);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shopping Registry (SK-028 / AC-DEC-2026-070)
// Contracts mirror .structural-contracts/shopping.json
// ─────────────────────────────────────────────────────────────────────────────
test.describe('SDCA Structural Contracts — Shopping (SK-028)', () => {
  test.beforeEach(async ({ page }) => {
    await activateTab(page, 'tab-shopping', '#shoppingRegistryRoot');
  });

  test('shoppingRegistryRoot is DOM descendant of shoppingRegistryFrame after lazy mount', async ({ page }) => {
    // This is the exact contract broken by fd47c6f:
    // missing </div> caused browser to reparent #shoppingRegistryRoot outside the frame
    await assertDescendantOf(page, 'shoppingRegistryRoot', 'shoppingRegistryFrame');
  });

  test('shopWelcomeBanner is DOM descendant of shoppingRegistryRoot after lazy mount', async ({ page }) => {
    await assertDescendantOf(page, 'shopWelcomeBanner', 'shoppingRegistryRoot');
  });

  test('catalogViewSection is DOM descendant of shoppingRegistryRoot after lazy mount', async ({ page }) => {
    await assertDescendantOf(page, 'catalogViewSection', 'shoppingRegistryRoot');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Decorator Cockpit
// Contracts mirror .structural-contracts/cockpit.json (fragment target)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('SDCA Structural Contracts — Cockpit (SK-028)', () => {
  test.beforeEach(async ({ page }) => {
    await activateTab(page, 'tab-cockpit', '#cockpitFrame');
  });

  test('cockpitFrame is present at DOM root level after lazy mount', async ({ page }) => {
    const cockpitFrame = page.locator('#cockpitFrame');
    await expect(cockpitFrame).toBeAttached();
  });

  test('hudWorkspace is DOM descendant of cockpitFrame after lazy mount', async ({ page }) => {
    await assertDescendantOf(page, 'hudWorkspace', 'cockpitFrame');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Decision Registry
// Contracts mirror .structural-contracts/decision-registry.json (fragment)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('SDCA Structural Contracts — Decision Registry (SK-028)', () => {
  test.beforeEach(async ({ page }) => {
    await activateTab(page, 'tab-decision-registry', '#decisionRegistryRoot');
  });

  test('decisionRegistryRoot is DOM descendant of decisionRegistryFrame after lazy mount', async ({ page }) => {
    await assertDescendantOf(page, 'decisionRegistryRoot', 'decisionRegistryFrame');
  });

  test('familyWelcomeBanner is DOM descendant of decisionRegistryRoot after lazy mount', async ({ page }) => {
    await assertDescendantOf(page, 'familyWelcomeBanner', 'decisionRegistryRoot');
  });

  test('decisionsGrid is DOM descendant of decisionRegistryRoot after lazy mount', async ({ page }) => {
    await assertDescendantOf(page, 'decisionsGrid', 'decisionRegistryRoot');
  });
});
