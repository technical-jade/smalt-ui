<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  injectAccordionRootContext,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import { useDefaults } from '../../composables'
import { accordionHeadingLevelKey } from './context'
import type { SAccordionItemProps } from './types'

const props = withDefaults(defineProps<SAccordionItemProps>(), {
  expandIcon: 'chevron-down',
  // Vue casts an absent boolean prop to false, which would override the accordion's setting.
  unmountOnHide: undefined,
})
const p = useDefaults(props, 'SAccordionItem')

const root = injectAccordionRootContext()
const accordionHeadingLevel = inject(accordionHeadingLevelKey, undefined)
const headingLevel = computed(() => p.headingLevel ?? accordionHeadingLevel?.value ?? 3)

/**
 * Reka ignores a click on the open item of a non-collapsible single accordion but leaves the
 * trigger unmarked. Any value bound here replaces Reka's own `aria-disabled`, so the disabled
 * item is repeated.
 */
function triggerAriaDisabled(open: boolean) {
  const locked = open && root.isSingle.value && !root.collapsible
  return locked || p.disabled || root.disabled.value ? true : undefined
}

defineSlots<{
  /** Custom item header (instead of the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Collapsible item content. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <AccordionItem
    v-slot="{ open }"
    class="s-accordion__item"
    :value="p.value"
    :disabled="p.disabled"
    :unmount-on-hide="p.unmountOnHide"
  >
    <AccordionHeader
      as="div"
      class="s-accordion__header"
      role="heading"
      :aria-level="headingLevel"
    >
      <AccordionTrigger
        class="s-accordion__trigger"
        :aria-disabled="triggerAriaDisabled(open)"
      >
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
