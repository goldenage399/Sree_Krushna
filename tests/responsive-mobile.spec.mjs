// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Sree Krushna Marriage OS — Playwright Responsive & Mobile Verification Spec
 * Audits 300px, 320px (iPhone SE), 375px (iPhone 13), 768px (iPad), and 1280px (Desktop).
 */

const viewports = [
  { name: 'Ultra Narrow', width: 300, height: 600 },
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 13', width: 375, height: 812 },
  { name: 'iPad Portrait', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
];

for (const vp of viewports) {
  test.describe(`Viewport: ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('https://sree-krushna-forever.web.app');
    });

    test('should have zero horizontal body overflow', async ({ page }) => {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1); // Allow sub-pixel tolerance
    });

    test('should render auth gate card cleanly', async ({ page }) => {
      const authCard = page.getByTestId('auth-card');
      await expect(authCard).toBeVisible();

      const btn = page.getByTestId('login-button');
      await expect(btn).toBeVisible();

      // Check touch target height
      const box = await btn.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });
  });
}
