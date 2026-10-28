<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { ToolbarRoot, useDirection } from 'reka-ui'
import { useDefaults, useElevationProp } from '../../composables'
import { TOOLBAR_KEY, createToolbarItems } from './context'
import type { SToolbarProps } from './types'

const props = withDefaults(defineProps<SToolbarProps>(), {
  orientation: 'horizontal',
  loop: true,
})
const p = useDefaults(props, 'SToolbar')

const elevationStyle = useElevationProp(p, 's-toolbar')

const rootRef = ref<{ $el?: HTMLElement }>()

provide(TOOLBAR_KEY, {
  root: computed(() => rootRef.value?.$el),
  orientation: () => p.orientation,
  loop: () => p.loop,
  dir: useDirection(),
  items: createToolbarItems(),
  current: ref(),
})

defineSlots<{
  /**
   * Toolbar actions: buttons (`SButton`), toggles (`SToggle`), separators (`SSeparator`). Buttons
   * and toggles become one tab stop with arrow-key navigation.
   */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <ToolbarRoot
    ref="rootRef"
    :orientation="p.orientation"
    :loop="p.loop"
    :aria-label="p.ariaLabel"
    class="s-toolbar"
    :class="[`s-toolbar--${p.orientation}`, { 's-toolbar--square': p.square }]"
    :style="elevationStyle"
  >
    <slot />
  </ToolbarRoot>
</template>

<style src="./SToolbar.scss" lang="scss"></style>
