<script setup lang="ts">
import { computed, useId } from 'vue'
import { SIcon } from '../SIcon'
import { SSkeleton } from '../SSkeleton'
import { SVisuallyHidden } from '../../internal/SVisuallyHidden'
import { useColorProp, useDefaults, useFormatLocale, useMessages } from '../../composables'
import type { SStatProps, SStatSize } from './types'

const props = withDefaults(defineProps<SStatProps>(), {
  size: 'md',
  variant: 'plain',
  formatValue: true,
  square: false,
  loading: false,
})
const p = useDefaults(props, 'SStat')

const m = useMessages()
const formatLocale = useFormatLocale(() => p.locale)
const colorStyle = useColorProp(p, 's-stat')

defineSlots<{
  /** The value itself: replaces the formatted number. */
  value?: (props: Record<string, never>) => unknown
  /** What the number means: replaces the `label` prop. */
  label?: (props: Record<string, never>) => unknown
  /** Media next to the label: replaces the icon. */
  icon?: (props: Record<string, never>) => unknown
  /** The whole trend line: the arrow, the change and its hidden direction label. */
  trend?: (props: Record<string, never>) => unknown
  /** Explanatory line under the value: replaces the `description` prop. */
  description?: (props: Record<string, never>) => unknown
  /** Actions in the corner of the tile: a link to the report, a period switch. */
  actions?: (props: Record<string, never>) => unknown
}>()

const labelId = `s-stat-${useId()}`

const ICON_SIZES: Record<SStatSize, number> = { sm: 16, md: 20, lg: 24 }
const iconSize = computed(() => ICON_SIZES[p.size])

const formattedValue = computed(() => {
  const { value, formatValue } = p
  if (typeof value !== 'number' || formatValue === false) return String(value)
  return new Intl.NumberFormat(
    formatLocale.value,
    typeof formatValue === 'object' ? formatValue : undefined,
  ).format(value)
})

const trendDirection = computed(() => {
  if (p.trend === undefined) return undefined
  if (p.trend > 0) return 'up'
  if (p.trend < 0) return 'down'
  return 'flat'
})

/**
 * The sign is part of the number, not a separate glyph: `exceptZero` keeps a plain `0` for the
 * neutral state, where a `+` would read as growth.
 */
const formattedTrend = computed(() =>
  p.trend === undefined
    ? ''
    : new Intl.NumberFormat(formatLocale.value, {
        signDisplay: 'exceptZero',
        maximumFractionDigits: 2,
      }).format(p.trend),
)

const trendIcon = computed(() => {
  if (trendDirection.value === 'up') return 'chevron-up'
  if (trendDirection.value === 'down') return 'chevron-down'
  return 'minus'
})

// A flat trend needs no hidden label: the number already reads as no change.
const trendDirectionLabel = computed(() => {
  if (trendDirection.value === 'up') return p.trendUpLabel ?? m.value.trendUp
  if (trendDirection.value === 'down') return p.trendDownLabel ?? m.value.trendDown
  return undefined
})
</script>

<template>
  <div
    class="s-stat"
    :class="[
      `s-stat--${p.size}`,
      `s-stat--${p.variant}`,
      { 's-stat--square': p.square, 's-stat--loading': p.loading },
    ]"
    :style="colorStyle"
    role="group"
    :aria-labelledby="p.loading ? undefined : labelId"
    :aria-label="p.loading ? m.loading : undefined"
    :aria-busy="p.loading || undefined"
  >
    <div class="s-stat__header">
      <div
        :id="labelId"
        class="s-stat__label"
      >
        <SSkeleton
          v-if="p.loading"
          width="8ch"
        />
        <slot
          v-else
          name="label"
          >{{ p.label }}</slot
        >
      </div>
      <div
        v-if="$slots.icon || p.icon"
        class="s-stat__icon"
      >
        <slot name="icon">
          <SIcon
            :icon="p.icon"
            :size="iconSize"
          />
        </slot>
      </div>
      <div
        v-if="$slots.actions"
        class="s-stat__actions"
      >
        <slot name="actions" />
      </div>
    </div>

    <div class="s-stat__value">
      <SSkeleton
        v-if="p.loading"
        width="50%"
      />
      <slot
        v-else
        name="value"
        >{{ formattedValue }}</slot
      >
    </div>

    <div
      v-if="!p.loading && (p.trend !== undefined || $slots.trend)"
      class="s-stat__trend"
      :class="trendDirection && `s-stat__trend--${trendDirection}`"
    >
      <slot name="trend">
        <SIcon
          class="s-stat__trend-icon"
          :icon="trendIcon"
          size="1em"
        />
        <SVisuallyHidden v-if="trendDirectionLabel">{{ trendDirectionLabel }}</SVisuallyHidden>
        <span class="s-stat__trend-value">{{ formattedTrend }}</span>
        <span
          v-if="p.trendLabel"
          class="s-stat__trend-label"
          >{{ p.trendLabel }}</span
        >
      </slot>
    </div>

    <div
      v-if="!p.loading && (p.description || $slots.description)"
      class="s-stat__description"
    >
      <slot name="description">{{ p.description }}</slot>
    </div>
  </div>
</template>

<style src="./SStat.scss" lang="scss"></style>
