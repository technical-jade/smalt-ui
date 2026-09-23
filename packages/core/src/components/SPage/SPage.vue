<script setup lang="ts">
import { computed } from 'vue'
import { useDefaults } from '../../composables'
import type { SPageProps } from './types'

const props = withDefaults(defineProps<SPageProps>(), {
  padded: true,
  container: false,
  landmark: true,
})
const p = useDefaults(props, 'SPage')

/**
 * `.s-container` reads a variable of its own, so both names carry the same value and the
 * `container` prop needs no branch here.
 */
const maxWidthStyle = computed(() => {
  if (p.maxWidth === undefined) return undefined
  const value = typeof p.maxWidth === 'number' ? `${p.maxWidth}px` : p.maxWidth
  return { '--s-page-max-width': value, '--s-container-max-width': value }
})

defineSlots<{
  /** Page content. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div
    class="s-page"
    :class="{ 's-page--padded': p.padded }"
    :role="p.landmark ? 'main' : undefined"
  >
    <div
      class="s-page__content"
      :class="{ 's-container': p.container }"
      :style="maxWidthStyle"
    >
      <slot />
    </div>
  </div>
</template>

<style src="./SPage.scss" lang="scss"></style>
