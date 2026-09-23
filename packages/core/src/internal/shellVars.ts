import { onBeforeUnmount, onMounted, watchEffect, type Ref } from 'vue'

/**
 * Publishes layout custom properties onto the wrapping shell element: siblings cannot read a
 * custom property declared on one another, so a size a neighbour reserves goes one level up.
 * The values come from props, never from measurement — defaults live in the stylesheets.
 */
export function usePublishShellVars(
  el: Ref<HTMLElement | null>,
  vars: () => Record<string, string>,
): void {
  let shell: HTMLElement | null = null
  let published: string[] = []

  const clear = () => {
    for (const name of published) shell?.style.removeProperty(name)
    published = []
  }

  onMounted(() => {
    shell = el.value?.parentElement ?? null
    watchEffect(() => {
      const next = vars()
      if (!shell) return
      clear()
      for (const [name, value] of Object.entries(next)) {
        shell.style.setProperty(name, value)
        published.push(name)
      }
    })
  })

  onBeforeUnmount(clear)
}
