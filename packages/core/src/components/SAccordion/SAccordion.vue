<script setup lang="ts">
import { AccordionRoot } from 'reka-ui'
import { SAccordionItem } from '../SAccordionItem'
import { useDefaults } from '../../composables'
import type { SAccordionProps } from './types'

const props = withDefaults(defineProps<SAccordionProps>(), {
  type: 'single',
  collapsible: true,
  unmountOnHide: true,
})
const p = useDefaults(props, 'SAccordion')

/**
 * Expanded section (`single`) or array of expanded sections (`multiple`). Two-way bound via
 * `v-model`.
 */
const model = defineModel<string | string[]>()

defineSlots<{
  /** Custom set of `SAccordionItem` (instead of the `items` prop). */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <AccordionRoot
    v-model="model"
    class="s-accordion"
    :class="{ 's-accordion--square': p.square }"
    :type="p.type"
    :collapsible="p.collapsible"
    :disabled="p.disabled"
    :unmount-on-hide="p.unmountOnHide"
  >
    <slot>
      <SAccordionItem
        v-for="it in p.items"
        :key="it.value"
        :value="it.value"
        :title="it.title"
        :disabled="it.disabled"
      >
        {{ it.content }}
      </SAccordionItem>
    </slot>
  </AccordionRoot>
</template>

<style src="./SAccordion.scss" lang="scss"></style>
