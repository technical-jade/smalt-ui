import { onBeforeUnmount, onMounted, type Ref } from 'vue'

function keepCaretKeys(event: KeyboardEvent) {
  if (event.key === 'Home' || event.key === 'End') event.stopPropagation()
}

/**
 * Home and End must move the caret in a combobox input, but Reka hands them to list navigation
 * with a listener on the input itself. So the keys are stopped in the capture phase on the frame
 * around it. The listener is native: a Vue handler stamps the event with a time, and an input
 * listener attached in the same millisecond would skip it.
 */
export function useKeepCaretKeys(frame: Ref<{ $el: Element } | undefined>) {
  onMounted(() =>
    frame.value?.$el.addEventListener('keydown', keepCaretKeys as EventListener, true),
  )
  onBeforeUnmount(() =>
    frame.value?.$el.removeEventListener('keydown', keepCaretKeys as EventListener, true),
  )
}
