/**
 * Breakpoint minimums in pixels, mirrored from the SCSS map `$breakpoints`
 * (`styles/settings/_variables.scss`). The stylesheet reaches them through `respond-to`, but the
 * drawer switch needs the number in JavaScript too, and a media query cannot read a CSS variable.
 * `__tests__/breakpoints.spec.ts` fails if the two ever drift apart.
 */
export const SIDEBAR_BREAKPOINTS = {
  sm: 600,
  md: 1024,
  lg: 1440,
  xl: 1920,
} as const

export type SSidebarBreakpoint = keyof typeof SIDEBAR_BREAKPOINTS
