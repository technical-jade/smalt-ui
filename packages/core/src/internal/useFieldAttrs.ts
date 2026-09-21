import { computed, useAttrs } from 'vue'

/**
 * Splits fallthrough attributes of a field whose root is a frame around the actual control:
 * `class`/`style` stay on the frame, everything else (`aria-*`, `data-*`, `name`, listeners) goes
 * to the control. Left on the root, an `@blur` handler would never fire (blur does not bubble)
 * and an `aria-label` would name a `div`. The component must declare `inheritAttrs: false`.
 */
export function useFieldAttrs() {
  const attrs = useAttrs()
  const rootClass = computed(() => attrs.class)
  const rootStyle = computed(() => attrs.style)
  const controlAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
  )
  return { attrs, rootClass, rootStyle, controlAttrs }
}
