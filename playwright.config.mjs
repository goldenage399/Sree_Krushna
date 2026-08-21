// playwright.config.mjs — Pillar 5: Cross-Device Playwright Configuration
// Sree Krushna Marriage OS — M-GATE-01 compliant
// Viewports: iPhone SE 300px (minimum gate), 320px, iPhone 13, Pixel 5, iPad 768px, Desktop 1280

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 1,
  workers: 2,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // ── Mobile ──────────────────────────────────────────────────────────────
    {
      name: "iPhone SE 300px (M-GATE-01 minimum)",
      use: {
        viewport: { width: 300, height: 667 },
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "iPhone SE 320px",
      use: {
        viewport: { width: 320, height: 667 },
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "iPhone 13",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "Pixel 5",
      use: { ...devices["Pixel 5"] },
    },
    // ── Tablet ──────────────────────────────────────────────────────────────
    {
      name: "iPad 768px",
      use: {
        viewport: { width: 768, height: 1024 },
        userAgent: "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
      },
    },
    // ── Desktop ─────────────────────────────────────────────────────────────
    {
      name: "Desktop 1280",
      use: {
        viewport: { width: 1280, height: 800 },
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
