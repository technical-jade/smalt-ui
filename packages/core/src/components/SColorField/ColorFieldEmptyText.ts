import { defineComponent, watchEffect } from 'vue'
import { injectColorFieldRootContext } from 'reka-ui'

/**
 * Private part of SColorField. Reka's color field has no empty state: without a value it shows
 * its '#000000' default in the input. While the field is empty and not being edited, the text is
 * cleared so the placeholder shows; the context is reachable only from inside ColorFieldRoot.
 */
export default defineComponent({
  name: 'ColorFieldEmptyText',
  props: {
    empty: { type: Boolean, required: true },
    editing: { type: Boolean, required: true },
  },
  setup(props) {
    const context = injectColorFieldRootContext()!
    watchEffect(() => {
      if (props.empty && !props.editing && context.inputValue.value) context.inputValue.value = ''
    })
    return () => null
  },
})
