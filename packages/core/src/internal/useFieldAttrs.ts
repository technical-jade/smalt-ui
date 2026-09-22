import { computed, useAttrs } from 'vue'

/**
 * Splits fallthrough attributes of a framed field: `class`/`style` stay on the frame, the rest
 * goes to the control (on the root `@blur` never fires). Needs `inheritAttrs: false`. Bind
 * `controlAttrs` before the `SFormField` bindings (`id`, `aria-describedby`, `aria-labelledby`,
 * `aria-invalid`): consumer attributes override the component's own, but not those bindings.
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
