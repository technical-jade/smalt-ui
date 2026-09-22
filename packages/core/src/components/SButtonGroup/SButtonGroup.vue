<script setup lang="ts">
import { computed } from 'vue'
import { provideDefaults, useDefaults } from '../../composables'
import type { SButtonGroupProps } from './types'

const props = withDefaults(defineProps<SButtonGroupProps>(), {
  orientation: 'horizontal',
  attached: true,
})
const p = useDefaults(props, 'SButtonGroup')

/**
 * Appearance travels to the buttons as their defaults, so a button that sets the prop itself
 * still wins. Only the props actually set are passed on: the rest must stay at each button's
 * own default.
 */
const buttonDefaults = computed(() =>
  Object.fromEntries(
    Object.entries({
      size: p.size,
      variant: p.variant,
      color: p.color,
      square: p.square,
      round: p.round,
      disabled: p.disabled,
    }).filter(([, value]) => value !== undefined),
  ),
)

provideDefaults(() => ({ SButton: buttonDefaults.value }))

defineSlots<{
  /** Buttons of the group (`SButton`). */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div
    class="s-button-group"
    :class="[
      `s-button-group--${p.orientation}`,
      p.attached ? 's-button-group--attached' : 's-button-group--detached',
    ]"
    role="group"
    :aria-label="p.label"
  >
    <slot />
  </div>
</template>

<style src="./SButtonGroup.scss" lang="scss"></style>
