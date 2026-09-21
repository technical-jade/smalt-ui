<script setup lang="ts">
import { AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from 'reka-ui'
import { SIcon } from '../SIcon'
import { useDefaults } from '../../composables'
import type { SAccordionItemProps } from './types'

const props = withDefaults(defineProps<SAccordionItemProps>(), {
  expandIcon: 'chevron-down',
  // Vue casts an absent boolean prop to false, which would override the accordion's setting.
  unmountOnHide: undefined,
})
const p = useDefaults(props, 'SAccordionItem')

defineSlots<{
  /** Custom item header (instead of the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Collapsible item content. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <AccordionItem
    class="s-accordion__item"
    :value="p.value"
    :disabled="p.disabled"
    :unmount-on-hide="p.unmountOnHide"
  >
    <AccordionHeader
      as="div"
      class="s-accordion__header"
    >
      <AccordionTrigger class="s-accordion__trigger">
        <span class="s-accordion__title"
          ><slot name="title">{{ p.title }}</slot></span
        >
        <SIcon
          class="s-accordion__chevron"
          :icon="p.expandIcon"
          :size="20"
        />
      </AccordionTrigger>
    </AccordionHeader>

    <AccordionContent class="s-accordion__content">
      <div class="s-accordion__body"><slot /></div>
    </AccordionContent>
  </AccordionItem>
</template>

<style src="./SAccordionItem.scss" lang="scss"></style>
