<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import type { SProgressProps } from './types'

const props = withDefaults(defineProps<SProgressProps>(), {
  value: null,
  max: 100,
  size: 'md',
  variant: 'primary',
})
const p = useDefaults(props, 'SProgress')

const colorStyle = useColorProp(p, 's-progress')
const m = useMessages()

/**
 * The same clamped numbers feed the bar and Reka: Reka only logs an out-of-range value and
 * announces it as is, so the announced value would disagree with the drawn bar.
 */
const max = computed(() => (Number.isFinite(p.max) && p.max > 0 ? p.max : 100))
const value = computed(() =>
  p.value == null || Number.isNaN(p.value) ? null : Math.min(max.value, Math.max(0, p.value)),
)

// Fill percentage; null means indeterminate mode (styled via data-state).
const percent = computed(() => (value.value == null ? null : (value.value / max.value) * 100))

// Reka names the bar with the percentage and leaves an indeterminate bar unnamed.
function valueLabel() {
  if (p.label) return p.label
  return percent.value == null ? m.value.loading : `${Math.round(percent.value)}%`
}
</script>

<template>
  <ProgressRoot
    class="s-progress"
    :class="[`s-progress--${p.size}`, `s-progress--${p.variant}`]"
    :style="colorStyle"
    :model-value="value"
    :max="max"
    :get-value-label="valueLabel"
  >
    <ProgressIndicator
      class="s-progress__indicator"
      :style="percent == null ? undefined : { transform: `translateX(-${100 - percent}%)` }"
    />
  </ProgressRoot>
</template>

<style src="./SProgress.scss" lang="scss"></style>
