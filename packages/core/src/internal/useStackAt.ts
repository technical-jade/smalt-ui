import { computed, onBeforeUnmount, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'

interface StackAtOptions<T extends string> {
  /** Width in pixels below which the narrow layout takes over. Without it nothing is measured. */
  stackAt: () => number | undefined
  /** Layout while there is room. */
  wide: () => T
  /** Layout below the threshold. */
  narrow: () => T
}

/**
 * A layout that collapses on a narrow container: a row turns into a column inside a sidebar or a
 * modal, long before the screen would. What gets measured is the parent of `el`, not the window
 * or the component itself — collapsed in a flex container it shrinks to its content, so its own
 * width would stop reflecting the space available and it would never expand back.
 */
export function useStackAt<T extends string>(
  el: Ref<HTMLElement | null>,
  { stackAt, wide, narrow }: StackAtOptions<T>,
): ComputedRef<T> {
  const width = ref<number>()

  let observer: ResizeObserver | undefined

  function watchWidth() {
    observer?.disconnect()
    observer = undefined
    width.value = undefined
    if (!el.value || stackAt() === undefined) return

    const container = el.value.parentElement ?? el.value

    observer = new ResizeObserver(([entry]) => {
      // The measurement is deferred by a frame: the layout changes straight from the callback,
      // and the browser logs an unfinished observer loop to the app console.
      requestAnimationFrame(() => {
        width.value = entry.contentRect.width
      })
    })
    observer.observe(container)
  }

  onMounted(watchWidth)
  watch(stackAt, watchWidth)
  onBeforeUnmount(() => observer?.disconnect())

  /**
   * Until the first measurement (server, first frame) the declared layout is kept: the server has
   * nothing to guess the width from, and a wrong guess would cost a hydration mismatch.
   */
  return computed(() => {
    const threshold = stackAt()
    return threshold !== undefined && width.value !== undefined && width.value < threshold
      ? narrow()
      : wide()
  })
}
