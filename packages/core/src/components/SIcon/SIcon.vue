<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { resolveIcon, type SIconNode } from '../../composables/useIcons'
import { useDefaults } from '../../composables'
import type { SIconProps, SIconSize } from './types'
import { devWarn } from '../../internal/dev'

const props = withDefaults(defineProps<SIconProps>(), {
  size: 'md',
  viewBox: '0 0 24 24',
})
const p = useDefaults(props, 'SIcon')

defineSlots<{
  /** SVG content of the icon (`<path>`, `<circle>`, etc.). Overrides the `icon` prop. */
  default?: (props: Record<string, never>) => unknown
}>()

const SIZES = { sm: 16, md: 20, lg: 24 } as const

const isToken = (size: SIconSize): size is keyof typeof SIZES => size in SIZES

/**
 * A CSS length goes to the style: the width/height attributes of an SVG do not take `calc()` or
 * `var()`.
 */
const cssSize = computed(() =>
  typeof p.size === 'string' && !isToken(p.size) ? p.size : undefined,
)
const pixelSize = computed(() => {
  if (typeof p.size === 'number') return p.size
  return isToken(p.size) ? SIZES[p.size] : undefined
})

const iconStyle = computed(() => ({
  // The color prop sets `color` (= currentColor for stroke/fill); otherwise it is inherited.
  color: p.color ? `var(--s-${p.color})` : undefined,
  width: cssSize.value,
  height: cssSize.value,
}))

const slots = useSlots()

// A raw SVG path starts with an M/m command, which tells it apart from a registry icon name.
const isRawPath = (value: string) => /^[Mm][\s\d.,-]/.test(value)

const nodes = computed<SIconNode>(() => {
  if (slots.default || !p.icon) return []
  const resolved = resolveIcon(p.icon)
  if (resolved) return resolved
  if (isRawPath(p.icon)) return [['path', { d: p.icon }]]
  devWarn(`[SIcon] icon "${p.icon}" is not registered — use registerIcons().`)
  return []
})
</script>

<template>
  <svg
    class="s-icon"
    :style="iconStyle"
    :width="pixelSize"
    :height="pixelSize"
    :viewBox="p.viewBox"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="p.label ? 'img' : undefined"
    :aria-label="p.label"
    :aria-hidden="p.label ? undefined : true"
  >
    <slot>
      <component
        :is="node[0]"
        v-for="(node, i) in nodes"
        :key="i"
        v-bind="node[1]"
      />
    </slot>
  </svg>
</template>

<style src="./SIcon.scss" lang="scss"></style>
