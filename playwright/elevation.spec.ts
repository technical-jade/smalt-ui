import { expect, test } from '@playwright/test'

/**
 * Shadows are faint by design, so the shared 1% tolerance of the component snapshots lets a
 * missing shadow through (the dark theme once lost them all unnoticed). These demos are compared
 * strictly, in both themes.
 * */
const DEMOS = [
  { name: 'elevation-scale', path: '/style/elevation', heading: 'set the level' },
  { name: 'card-elevation', path: '/components/card', heading: 'Elevation' },
]

for (const theme of ['light', 'dark'] as const) {
  for (const demo of DEMOS) {
    test(`${demo.name} — ${theme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme })
      await page.goto(demo.path, { waitUntil: 'networkidle' })
      const preview = page
        .locator(`h2:has-text("${demo.heading}") ~ .demo`)
        .first()
        .locator('.demo__preview')
      await preview.waitFor({ state: 'visible' })
      await page.evaluate(() => document.fonts.ready)
      await expect(preview).toHaveScreenshot(`${demo.name}-${theme}.png`, {
        maxDiffPixelRatio: 0,
        threshold: 0.02,
      })
    })
  }
}
