import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
  type ComponentPublicInstance,
} from 'vue'

type ElementSource = Element | ComponentPublicInstance | null | undefined

const toElement = (source: ElementSource) =>
  source instanceof Element ? source : (source?.$el as Element | undefined)

/**
 * Inline `--s-field-label-x` for the field frame: the resting label offset measured to where the
 * text starts (`start` is its selector). Text in `#prepend`/`prefix` is wider than the icon the
 * CSS offset assumes; that offset still applies until the first measurement (SSR, first frame).
 * `enabled` reads slots directly: they are not reactive, and a `computed` over them never updates.
 */
export function useLeadingLabelOffset(
  frame: () => ElementSource,
  start: string,
  enabled: () => boolean,
) {
  const offset = ref<number>()
  let observer: ResizeObserver | undefined
  let observed: Element[] = []

  function measure(frameEl: Element) {
    const startEl = frameEl.querySelector(start)
    const box = frameEl.getBoundingClientRect()
    if (!startEl || !box.width) return
    const target = startEl.getBoundingClientRect()
    const style = getComputedStyle(frameEl)
    /**
     * Client rects include transforms (a dialog opens from `scale: 0.96`), the CSS offset does
     * not. `offsetWidth` is rounded, so a difference under a pixel is rounding, not a transform.
     */
    const width = frameEl instanceof HTMLElement ? frameEl.offsetWidth : box.width
    const k = Math.abs(width - box.width) < 1 ? 1 : width / box.width
    // An absolutely positioned label is placed from the padding box, i.e. inside the border.
    offset.value =
      style.direction === 'rtl'
        ? (box.right - target.right) * k - parseFloat(style.borderRightWidth)
        : (target.left - box.left) * k - parseFloat(style.borderLeftWidth)
  }

  function observe() {
    const frameEl = enabled() ? toElement(frame()) : undefined
    // Leading siblings change width without resizing the frame, so every child is watched.
    const targets = frameEl ? [frameEl, ...frameEl.children] : []
    if (targets.length === observed.length && targets.every((el, i) => el === observed[i])) return
    observer?.disconnect()
    observed = targets
    if (!frameEl || typeof ResizeObserver === 'undefined') {
      offset.value = undefined
      return
    }
    observer = new ResizeObserver(() => measure(frameEl))
    for (const el of targets) observer.observe(el)
  }

  // Browser only: the server has neither Element nor layout.
  onMounted(() =>
    watch([() => toElement(frame()), enabled], observe, { flush: 'post', immediate: true }),
  )

  /**
   * Slots are not reactive, so a `#prepend` that appears after mount only re-renders the field:
   * the check and the set of watched children are renewed on every update.
   */
  onUpdated(observe)

  onBeforeUnmount(() => observer?.disconnect())

  /**
   * `offset` is read first so the computed always depends on it. Rounded up, away from the
   * leading content: rounding to nearest could overlap it by a subpixel.
   */
  return computed(() =>
    offset.value !== undefined && enabled()
      ? { '--s-field-label-x': `${Math.ceil(offset.value)}px` }
      : undefined,
  )
}
