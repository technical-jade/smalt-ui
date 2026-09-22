import { watchEffect, type MaybeRefOrGetter, type ShallowRef, toValue } from 'vue'

/**
 * Reka names a floating panel after its trigger with `aria-labelledby`, which beats
 * `aria-label`, and its own binding wins over ours. With an own name the attribute is removed
 * from the element: Vue does not write it back while its value stays the same.
 */
export function useOwnAccessibleName(
  content: Readonly<ShallowRef<{ $el: unknown } | null>>,
  selector: string,
  ariaLabel: MaybeRefOrGetter<string | undefined>,
) {
  watchEffect(
    () => {
      // The component root is Reka's positioning wrapper around the panel.
      const wrapper = content.value?.$el
      if (!toValue(ariaLabel) || !(wrapper instanceof Element)) return
      wrapper.querySelector(selector)?.removeAttribute('aria-labelledby')
    },
    { flush: 'post' },
  )
}
