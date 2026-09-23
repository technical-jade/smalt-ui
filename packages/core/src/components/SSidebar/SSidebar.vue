<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { SDrawer } from '../SDrawer'
import SidebarBody from './SidebarBody.vue'
import { useDefaults, useMessages } from '../../composables'
import { usePublishShellVars } from '../../internal/shellVars'
import { SIDEBAR_BREAKPOINTS } from './breakpoints'
import type { SSidebarProps } from './types'

const props = withDefaults(defineProps<SSidebarProps>(), {
  side: 'start',
  breakpoint: 'md',
  bordered: true,
  collapsible: true,
})
const p = useDefaults(props, 'SSidebar')
const m = useMessages()

/** Whether the drawer is open below the breakpoint. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open', { default: false })

/** Whether the wide-screen column is collapsed to a rail of icons. Bound via `v-model:collapsed`. */
const collapsed = defineModel<boolean>('collapsed', { default: false })

/**
 * The server renders the column: `matchMedia` exists only in the browser, and guessing the width
 * during SSR would hydrate into the wrong tree. Until the listener runs the stylesheet already
 * hides the column below the breakpoint, so the first paint is correct on a narrow screen too.
 */
const wide = ref(true)

onMounted(() => {
  watchEffect((onCleanup) => {
    const query = window.matchMedia(`(min-width: ${SIDEBAR_BREAKPOINTS[p.breakpoint]}px)`)
    const apply = (matches: boolean) => {
      wide.value = matches
      // The drawer and the column are two renderings of one sidebar: an open drawer left behind
      // by a resize would cover the column it turned into.
      if (matches) open.value = false
    }
    const onChange = (event: MediaQueryListEvent) => apply(event.matches)
    apply(query.matches)
    query.addEventListener('change', onChange)
    onCleanup(() => query.removeEventListener('change', onChange))
  })
})

const root = ref<HTMLElement | null>(null)

const toCss = (value?: string | number) => (typeof value === 'number' ? `${value}px` : value)

const sizeVars = computed(() => {
  const vars: Record<string, string> = {}
  const width = toCss(p.width)
  const collapsedWidth = toCss(p.collapsedWidth)
  if (width) vars['--s-sidebar-width'] = width
  if (collapsedWidth) vars['--s-sidebar-collapsed-width'] = collapsedWidth
  return vars
})

/**
 * The page reserves the column's width with padding, and a sibling cannot read a property
 * declared here — so custom widths are mirrored onto the shell.
 */
usePublishShellVars(root, () => sizeVars.value)

/** The rail is a wide-screen state: inside the drawer the labels are always visible. */
const rail = computed(() => wide.value && collapsed.value)

const toggleLabel = computed(() =>
  rail.value
    ? (p.expandLabel ?? m.value.expandSidebar)
    : (p.collapseLabel ?? m.value.collapseSidebar),
)

// The chevron points the way the column would move, which is mirrored on the trailing edge.
const toggleIcon = computed(() => {
  const outward = p.side === 'start' ? 'chevron-left' : 'chevron-right'
  const inward = p.side === 'start' ? 'chevron-right' : 'chevron-left'
  return rail.value ? inward : outward
})

const drawerSide = computed(() => (p.side === 'start' ? 'left' : 'right'))

const toggle = () => (collapsed.value = !collapsed.value)

defineSlots<{
  /** Top of the sidebar: a logo, a workspace switcher. */
  header?: (props: { collapsed: boolean }) => unknown
  /** Navigation content. Receives the rail state so items can hide their labels. */
  default?: (props: { collapsed: boolean }) => unknown
  /** Bottom of the sidebar: a user card, secondary links. */
  footer?: (props: { collapsed: boolean }) => unknown
  /** Replaces the collapse button; receives the rail state and the toggle handler. */
  toggle?: (props: { collapsed: boolean; toggle: () => void }) => unknown
}>()
</script>

<template>
  <div
    v-if="wide"
    ref="root"
    class="s-sidebar s-sidebar--fixed"
    :class="[
      `s-sidebar--${p.side}`,
      `s-sidebar--bp-${p.breakpoint}`,
      {
        's-sidebar--collapsed': rail,
        's-sidebar--bordered': p.bordered,
      },
    ]"
    :style="sizeVars"
  >
    <SidebarBody
      :collapsed="rail"
      :collapsible="p.collapsible"
      :nav-label="p.ariaLabel"
      :toggle-label="toggleLabel"
      :toggle-icon="toggleIcon"
      @toggle="toggle"
    >
      <template
        v-if="$slots.header"
        #header
      >
        <slot
          name="header"
          :collapsed="rail"
        />
      </template>
      <slot :collapsed="rail" />
      <template
        v-if="$slots.footer"
        #footer
      >
        <slot
          name="footer"
          :collapsed="rail"
        />
      </template>
      <template
        v-if="$slots.toggle"
        #toggle
      >
        <slot
          name="toggle"
          :collapsed="rail"
          :toggle="toggle"
        />
      </template>
    </SidebarBody>
  </div>

  <SDrawer
    v-else
    v-model:open="open"
    :side="drawerSide"
  >
    <div class="s-sidebar s-sidebar--drawer">
      <SidebarBody
        :collapsed="false"
        :collapsible="false"
        :nav-label="p.ariaLabel"
        :toggle-label="toggleLabel"
        :toggle-icon="toggleIcon"
        @toggle="toggle"
      >
        <template
          v-if="$slots.header"
          #header
        >
          <slot
            name="header"
            :collapsed="false"
          />
        </template>
        <slot :collapsed="false" />
        <template
          v-if="$slots.footer"
          #footer
        >
          <slot
            name="footer"
            :collapsed="false"
          />
        </template>
      </SidebarBody>
    </div>
  </SDrawer>
</template>

<style src="./SSidebar.scss" lang="scss"></style>
