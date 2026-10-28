import { computed, type ComponentPublicInstance } from 'vue'

type ElementSource = Element | ComponentPublicInstance | null | undefined

function insidePinnedBlock(el: Element) {
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    const { position } = getComputedStyle(node)
    if (position === 'fixed' || position === 'sticky') return true
  }
  return false
}

/**
 * `position-strategy` for a Reka panel. With `fixed` (the Reka default) the panel waits for a JS
 * update on page scroll while the page moves on the compositor, so it lags. `absolute` moves with
 * the page, except for a trigger in a `fixed`/`sticky` block, which stays put. Reka reads the
 * strategy once per opening, when the panel mounts.
 */
export function usePopperStrategy(trigger: () => ElementSource, open: () => boolean) {
  return computed<'absolute' | 'fixed'>(() => {
    // Layout reads are not reactive: the open() read re-runs the ancestor check on each opening.
    if (!open() || typeof window === 'undefined') return 'fixed'
    const source = trigger()
    const el = source instanceof Element ? source : (source?.$el as unknown)
    return el instanceof Element && !insidePinnedBlock(el) ? 'absolute' : 'fixed'
  })
}
