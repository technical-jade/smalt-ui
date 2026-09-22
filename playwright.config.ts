import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  expect: {
    /**
     * `threshold` is the per-pixel color distance. The default 0.2 treats a light gray panel on
     * white, or a faint shadow on a dark page, as unchanged, so whole low-contrast shapes slipped
     * through; 0.05 still ignores antialiasing noise.
     * */
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, threshold: 0.05 },
  },
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    // docs must be built beforehand (see the test:visual script).
    command: 'pnpm --filter docs preview --port 4173',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
