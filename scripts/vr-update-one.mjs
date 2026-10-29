#!/usr/bin/env node
/**
 * Regenerates the visual regression baselines of ONE component (light + dark), leaving the others
 * untouched. A wrapper because the `-g "<name> —"` filter goes mid-command, while npm/pnpm only
 * append arguments. Usage: `pnpm test:visual:update:one stepper` (the docs page slug, NOT SName).
 */

import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'

const name = process.argv[2]
if (!name || name.startsWith('-')) {
  console.error('Error: pass a component slug. Example: pnpm test:visual:update:one stepper')
  process.exit(1)
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

// 1) Kill zombie previews: otherwise Playwright (reuseExistingServer) captures the OLD dist.
try {
  execSync('pkill -f "vite preview"; pkill -f vitepress', { stdio: 'ignore' })
} catch {
  // pkill exits with a non-zero code when no processes match
}

// 2) Fresh docs dist (aliases @smalt-ui/core to the sources, so component edits are picked up).
rmSync('apps/docs/.vitepress/cache', { recursive: true, force: true })
rmSync('apps/docs/.vitepress/dist', { recursive: true, force: true })
run('pnpm --filter docs build')

/**
 * 3) Update the baselines of this component only. The " —" anchor (before the light/dark theme)
 * rules out partial matches (e.g. 'date' does not touch 'date-field'). Plain --update-snapshots
 * skips a screenshot that differs within the comparison threshold, and a thin line or a shadow
 * change fits into it.
 */
run(`npx playwright test -g "${name} —" --update-snapshots=all`)

console.log(
  `\n✓ Visual regression baselines for "${name}" regenerated (light + dark). Check git diff.`,
)
