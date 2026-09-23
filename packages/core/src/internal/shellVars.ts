import { onBeforeUnmount, onMounted, watchEffect, type Ref } from 'vue'

/**
 * Publishes layout custom properties onto the shell — the element that wraps the app bar, the
 * sidebar and the page. Siblings cannot read a custom property declared on one another, so a size
 * a neighbour has to reserve (a custom bar height, a custom rail width) is written one level up,
 * where every part of the shell inherits it. Nothing is measured: the values come from props, and
 * the stylesheets carry the defaults for the server-rendered frame.
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
