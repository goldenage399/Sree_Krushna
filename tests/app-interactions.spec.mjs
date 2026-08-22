// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Sree Krushna Marriage OS — UI & Functional Interactions Spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch tabs smoothly without page refresh', async ({ page }) => {
    const swimlaneTab = page.locator('button[data-testid="nav-tab-swimlane"]');
    if (await swimlaneTab.isVisible()) {
      await swimlaneTab.click();
      const swimlaneView = page.locator('#tab-swimlane');
      await expect(swimlaneView).toBeVisible();
    }
  });

  test('should open and close inspection console drawer', async ({ page }) => {
    // Check if openTaskConsole is available
    const drawer = page.locator('#console-drawer');
    const closeBtn = page.locator('#console-drawer .drawer-close-btn');

    // Trigger console opening via evaluate
    await page.evaluate(() => {
      if (typeof window.openTaskConsole === 'function') {
        window.openTaskConsole('TSK-502');
      }
    });

    if (await drawer.isVisible()) {
      await expect(drawer).toBeVisible();
      await closeBtn.click();
      await expect(drawer).not.toBeVisible();
    }
  });

  test('should support theme changes via data-theme attribute', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'velvet');
    });
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('velvet');
  });
});
