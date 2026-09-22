<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import type { SProgressProps, SProgressSize } from './types'

const props = withDefaults(defineProps<SProgressProps>(), {
  value: null,
  max: 100,
  size: 'md',
  variant: 'primary',
  circular: false,
  showValue: false,
})
const p = useDefaults(props, 'SProgress')

defineSlots<{
  /** Content in the middle of the ring; replaces `show-value`. Circular form only. */
  default?: (props: { value: number | null; percentage: number | null }) => unknown
}>()

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
const percentLabel = computed(() =>
  percent.value == null ? null : `${Math.round(percent.value)}%`,
)

// Reka names the bar with the percentage and leaves an indeterminate bar unnamed.
function valueLabel() {
  if (p.label) return p.label
  return percentLabel.value ?? m.value.loading
}

/** Ring geometry in px: the viewBox uses the same unit, so `thickness` is a real stroke width. */
const RING_DIAMETERS: Record<SProgressSize, number> = { sm: 32, md: 48, lg: 64 }
const RING_THICKNESS: Record<SProgressSize, number> = { sm: 3, md: 4, lg: 6 }

const diameter = computed(() => RING_DIAMETERS[p.size])
const center = computed(() => diameter.value / 2)
const thickness = computed(() =>
  p.thickness != null && Number.isFinite(p.thickness) && p.thickness > 0
    ? p.thickness
    : RING_THICKNESS[p.size],
)
// The stroke straddles the path, so the drawn circle has to shrink by half a stroke on each side.
const radius = computed(() => Math.max(0, (diameter.value - thickness.value) / 2))
const circumference = computed(() => 2 * Math.PI * radius.value)

/**
 * A single dash as long as the whole circle, pulled back by the unfilled part: the visible arc
 * equals the percentage. An indeterminate ring instead shows a fixed quarter that spins.
 */
const dashArray = computed(() =>
  percent.value == null
    ? `${circumference.value / 4} ${circumference.value}`
    : `${circumference.value} ${circumference.value}`,
)
const dashOffset = computed(() =>
  percent.value == null ? 0 : (circumference.value * (100 - percent.value)) / 100,
)
</script>

<template>
  <ProgressRoot
    class="s-progress"
    :class="[
      `s-progress--${p.size}`,
      `s-progress--${p.variant}`,
      { 's-progress--circular': p.circular },
    ]"
    :style="colorStyle"
    :model-value="value"
    :max="max"
    :get-value-label="valueLabel"
  >
    <template v-if="p.circular">
      <svg
        class="s-progress__svg"
        :width="diameter"
        :height="diameter"
        :viewBox="`0 0 ${diameter} ${diameter}`"
        aria-hidden="true"
      >
        <circle
          class="s-progress__track"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="thickness"
        />
        <ProgressIndicator
          as="circle"
          class="s-progress__indicator"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="thickness"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <div
        v-if="$slots.default || (p.showValue && percentLabel)"
        class="s-progress__value"
      >
        <slot
          :value="value"
          :percentage="percent"
        >
          {{ percentLabel }}
        </slot>
      </div>
    </template>
    <ProgressIndicator
      v-else
      class="s-progress__indicator"
      :style="percent == null ? undefined : { transform: `translateX(-${100 - percent}%)` }"
    />
  </ProgressRoot>
</template>

<style src="./SProgress.scss" lang="scss"></style>
