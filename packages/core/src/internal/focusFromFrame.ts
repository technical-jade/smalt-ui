const INTERACTIVE = 'input, textarea, select, button, a[href], [tabindex], [contenteditable]'

/**
 * `mousedown` handler of a field frame: a click on its non-focusable part (an affix, an icon, a
 * swatch, the padding) moves focus to the `input`. Without cancelling mousedown the browser would
 * move focus to body. Interactive slot content keeps focus to itself; an ancestor with `tabindex`
 * outside the frame (the content of a dialog) does not count.
 */
export function focusFromFrame(event: MouseEvent, input: HTMLElement | null | undefined) {
  const frame = event.currentTarget as HTMLElement
  const target = event.target as Element
  if (!input || target === input) return
  const hit = target.closest(INTERACTIVE)
  if (hit && frame.contains(hit)) return
  event.preventDefault()
  input.focus()
}
