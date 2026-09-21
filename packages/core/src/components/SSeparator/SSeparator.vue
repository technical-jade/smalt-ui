<script setup lang="ts">
import { computed, useId } from 'vue'
import { Separator } from 'reka-ui'
import { useDefaults } from '../../composables'
import type { SSeparatorProps } from './types'

const props = withDefaults(defineProps<SSeparatorProps>(), {
  orientation: 'horizontal',
  decorative: false,
})
const p = useDefaults(props, 'SSeparator')

const slots = defineSlots<{
  /** Label content in the center of a horizontal separator. */
  default?: (props: Record<string, never>) => unknown
}>()

const hasLabel = computed(
  () => p.orientation === 'horizontal' && (p.label != null || !!slots.default),
)

/**
 * The separator role hides its children from screen readers, so the visible label is linked by
 * id: that also covers a label passed through the slot. A decorative separator keeps no role, and
 * its label is read as plain text.
 */
const labelId = useId()
</script>

<template>
  <div
    v-if="hasLabel"
    class="s-separator s-separator--labeled"
    :role="p.decorative ? 'none' : 'separator'"
    :aria-orientation="p.decorative ? undefined : 'horizontal'"
    :aria-labelledby="p.decorative ? undefined : labelId"
  >
    <Separator
      class="s-separator__line"
      decorative
    />
    <span
      :id="labelId"
      class="s-separator__label"
      ><slot>{{ p.label }}</slot></span
    >
    <Separator
      class="s-separator__line"
      decorative
    />
  </div>
  <Separator
    v-else
    class="s-separator"
    :class="`s-separator--${p.orientation}`"
    :orientation="p.orientation"
    :decorative="p.decorative"
  />
</template>

<style src="./SSeparator.scss" lang="scss"></style>
