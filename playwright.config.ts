import { defineConfig, devices } from '@playwright/test';

// End-to-end gate (CLAUDE.md §4): the agent's "manual testing" — drive a real browser and
// assert visible outcomes, on desktop and mobile, for any UI touched.
//
// The template ships no app, so there is no `webServer` here and `npm run e2e` passes with
// zero specs. A product adds, alongside its first spec:
//   use: { baseURL: 'http://localhost:3000' }
//   webServer: { command: 'npm run dev', url: 'http://localhost:3000',
//                reuseExistingServer: !process.env.CI, timeout: 120_000 }
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // No .only sneaking into CI, and one retry there to absorb genuine flake without hiding it.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    trace: 'on-first-retry',
  },
  // Both projects are Chromium: CI installs only that browser, and mobile here means the
  // viewport/touch profile, which is what the responsive floor actually needs proving on.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
});
