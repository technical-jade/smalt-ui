<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue'
import { Toggle, ToggleGroupItem } from 'reka-ui'
import { useColorProp, useDefaults } from '../../composables'
import { TOGGLE_GROUP_KEY } from '../SToggleGroup/context'
import { useToolbarItem } from '../SToolbar/context'
import type { SToggleProps } from './types'
import { devWarn } from '../../internal/dev'

const props = withDefaults(defineProps<SToggleProps>(), {
  size: 'md',
  disabled: false,
})
const p = useDefaults(props, 'SToggle')

const colorStyle = useColorProp(p, 's-toggle')

/**
 * The branch depends on the presence of a group, not on the `value` prop alone: a
 * `ToggleGroupItem` outside `ToggleGroupRoot` throws and breaks rendering of the whole subtree.
 */
const inGroup = inject(TOGGLE_GROUP_KEY, false)
const isGroupItem = computed(() => inGroup && p.value !== undefined)

/**
 * Inside SToolbar a standalone toggle is an item of its roving focus. A group item stays in the
 * roving focus of the group itself, with its own arrows and its own tab stop.
 */
const toggleRef = ref<{ $el?: HTMLElement }>()
const toolbarItem = useToolbarItem(
  () => toggleRef.value?.$el,
  () => p.disabled,
)

watchEffect(() => {
  if (p.value !== undefined && !inGroup) {
    devWarn(
      '[SToggle] the `value` prop only makes sense inside <SToggleGroup> — ' +
        'outside a group the toggle works standalone (v-model).',
    )
  }
})

/**
 * Pressed state of a standalone toggle. Two-way binding via `v-model` (not used inside
 * `SToggleGroup` — the group manages the state).
 */
const model = defineModel<boolean>({ default: false })

defineSlots<{
  /** Toggle content: text and/or an icon. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <!-- Inside SToggleGroup (value is set) it is a group item; otherwise a standalone toggle. -->
  <ToggleGroupItem
    v-if="isGroupItem"
    :value="p.value!"
    class="s-toggle"
    :class="[`s-toggle--${p.size}`, { 's-toggle--square': p.square }]"
    :style="colorStyle"
    :disabled="p.disabled"
    :aria-label="p.ariaLabel"
  >
    <slot />
  </ToggleGroupItem>
  <Toggle
    v-else
    ref="toggleRef"
    v-model="model"
    v-bind="toolbarItem"
    class="s-toggle"
    :class="[`s-toggle--${p.size}`, { 's-toggle--square': p.square }]"
    :style="colorStyle"
    :disabled="p.disabled"
    :aria-label="p.ariaLabel"
  >
    <slot />
  </Toggle>
</template>

<style src="./SToggle.scss" lang="scss"></style>
