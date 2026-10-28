import { computed, inject, shallowReactive, watch } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

type Orientation = 'horizontal' | 'vertical'

/**
 * Reka `ToolbarRoot` moves focus only between its own `ToolbarButton`s. Wrapping S-components in
 * `RovingFocusItem` would reach buttons in popups inside the toolbar too, giving them
 * `tabindex="-1"` in their portal, so an item counts only while it lies inside the toolbar's DOM.
 */
export interface ToolbarContext {
  root: Readonly<Ref<HTMLElement | undefined>>
  orientation: () => Orientation
  loop: () => boolean
  dir: Readonly<Ref<'ltr' | 'rtl'>>
  items: Map<HTMLElement, () => boolean>
  current: Ref<HTMLElement | undefined>
}

// The key lives in its own module so that SButton and SToggle do not import SToolbar itself.
export const TOOLBAR_KEY: InjectionKey<ToolbarContext> = Symbol('smalt-toolbar')

export function createToolbarItems() {
  return shallowReactive(new Map<HTMLElement, () => boolean>())
}

function members(ctx: ToolbarContext) {
  const root = ctx.root.value
  if (!root) return []
  return [...ctx.items]
    .filter(([el, disabled]) => !disabled() && root.contains(el))
    .map(([el]) => el)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
}

function target(ctx: ToolbarContext, from: HTMLElement, key: string) {
  const list = members(ctx)
  if (key === 'Home') return list[0]
  if (key === 'End') return list[list.length - 1]

  const vertical = ctx.orientation() === 'vertical'
  const forward = vertical ? 'ArrowDown' : ctx.dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
  const backward = vertical ? 'ArrowUp' : ctx.dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
  const step = key === forward ? 1 : key === backward ? -1 : 0
  if (!step) return undefined

  const next = list.indexOf(from) + step
  if (ctx.loop()) return list[(next + list.length) % list.length]
  return list[next]
}

/**
 * Joins a component to the roving focus of the toolbar it lies in. Returns the attributes for the
 * focusable element; outside a toolbar, an empty object.
 */
export function useToolbarItem(
  el: () => HTMLElement | undefined,
  disabled: () => boolean,
): ComputedRef<Record<string, unknown>> {
  const ctx = inject(TOOLBAR_KEY, null)

  watch(
    el,
    (node, _, onCleanup) => {
      if (!ctx || !node) return
      ctx.items.set(node, disabled)
      onCleanup(() => ctx.items.delete(node))
    },
    { immediate: true, flush: 'post' },
  )

  return computed(() => {
    const node = el()
    const root = ctx?.root.value
    if (!ctx || !node || !root || !ctx.items.has(node) || !root.contains(node)) return {}

    const list = members(ctx)
    const stop = ctx.current.value && list.includes(ctx.current.value) ? ctx.current.value : list[0]
    return {
      tabindex: node === stop ? 0 : -1,
      onFocus: () => (ctx.current.value = node),
      onKeydown: (event: KeyboardEvent) => {
        if (event.target !== event.currentTarget) return
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
        const next = target(ctx, node, event.key)
        if (!next) return
        event.preventDefault()
        next.focus()
      },
    }
  })
}
