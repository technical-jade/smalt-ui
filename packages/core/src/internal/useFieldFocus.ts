import type { ComponentPublicInstance, ShallowRef } from 'vue'

interface FocusEmit {
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
}

/**
 * `focus`/`blur` of a composite field. Native events do not bubble, so focusin/focusout are
 * handled on `root` and on the panel (`popup` is its selector: the panel lives in `body`), and
 * only entering and leaving the field are emitted, not moves between segments or into the panel.
 * `onLeave` runs with the `blur` emit, whether or not anyone listens to it.
 */
export function useFieldFocus(
  root: Readonly<ShallowRef<ComponentPublicInstance | null>>,
  emit: FocusEmit,
  popup?: string,
  onLeave?: () => void,
) {
  let focused = false

  function inside(target: EventTarget | null) {
    if (!(target instanceof Element)) return false
    return Boolean(
      (root.value?.$el as Element | undefined)?.contains(target) ||
      (popup && target.closest(popup)),
    )
  }

  function onFocusIn(event: FocusEvent) {
    /**
     * A flag rather than relatedTarget: the selected calendar day is removed together with
     * focus, and focus returning to the field arrives without a relatedTarget.
     */
    if (focused) return
    focused = true
    emit('focus', event)
  }

  function onFocusOut(event: FocusEvent) {
    if (!focused || inside(event.relatedTarget)) return
    focused = false
    emit('blur', event)
    onLeave?.()
  }

  return { onFocusIn, onFocusOut }
}
