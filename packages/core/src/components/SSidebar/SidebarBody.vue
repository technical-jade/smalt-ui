<script setup lang="ts">
import { SButton } from '../SButton'

/**
 * Inner layout of `SSidebar`, shared by its two renderings: the fixed column on wide screens and
 * the drawer below the breakpoint. Styles live in `SSidebar.scss`; the props arrive already
 * resolved against the prop defaults.
 */
// Several root nodes: without this Vue warns about attributes it cannot place.
defineOptions({ inheritAttrs: false })

defineProps<{
  collapsed: boolean
  collapsible: boolean
  navLabel?: string
  toggleLabel: string
  toggleIcon: string
}>()

defineEmits<{ toggle: [] }>()

defineSlots<{
  header?: (props: Record<string, never>) => unknown
  default?: (props: Record<string, never>) => unknown
  footer?: (props: Record<string, never>) => unknown
  toggle?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div
    v-if="$slots.header"
    class="s-sidebar__header"
  >
    <slot name="header" />
  </div>

  <div
    class="s-sidebar__nav"
    role="navigation"
    :aria-label="navLabel"
  >
    <slot />
  </div>

  <div
    v-if="$slots.footer"
    class="s-sidebar__footer"
  >
    <slot name="footer" />
  </div>

  <div
    v-if="collapsible"
    class="s-sidebar__toggle"
  >
    <slot name="toggle">
      <SButton
        variant="ghost"
        size="sm"
        icon-only
        :icon="toggleIcon"
        :aria-label="toggleLabel"
        :aria-expanded="!collapsed"
        @click="$emit('toggle')"
      />
    </slot>
  </div>
</template>
