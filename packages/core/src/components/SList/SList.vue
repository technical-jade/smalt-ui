<script setup lang="ts">
import { useDefaults } from '../../composables'
import type { SListProps } from './types'

const props = withDefaults(defineProps<SListProps>(), {
  variant: 'plain',
  size: 'md',
})
const p = useDefaults(props, 'SList')

defineSlots<{
  /** Rows of the list, normally `SListItem` elements. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div
    class="s-list"
    :class="[`s-list--${p.variant}`, `s-list--${p.size}`]"
    role="list"
    :aria-label="p.label"
  >
    <slot />
  </div>
</template>

<style src="./SList.scss" lang="scss"></style>
