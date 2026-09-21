<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { SIcon } from '../SIcon'
import { useDefaults } from '../../composables'
import type { SCollapsibleProps } from './types'

const props = withDefaults(defineProps<SCollapsibleProps>(), {
  disabled: false,
  expandIcon: 'chevron-down',
  unmountOnHide: true,
})
const p = useDefaults(props, 'SCollapsible')

/** Whether the content is expanded. Two-way bound via `v-model:open`. */
const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  /** Custom trigger content (instead of the `title` prop). */
  trigger?: (props: Record<string, never>) => unknown
  /** Collapsible content. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <CollapsibleRoot
    v-model:open="open"
    class="s-collapsible"
    :class="{ 's-collapsible--square': p.square }"
    :disabled="p.disabled"
    :unmount-on-hide="p.unmountOnHide"
  >
    <CollapsibleTrigger class="s-collapsible__trigger">
      <span class="s-collapsible__title"
        ><slot name="trigger">{{ p.title }}</slot></span
      >
      <SIcon
        class="s-collapsible__chevron"
        :icon="p.expandIcon"
        :size="20"
      />
    </CollapsibleTrigger>

    <CollapsibleContent class="s-collapsible__content">
      <div class="s-collapsible__body"><slot /></div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

<style src="./SCollapsible.scss" lang="scss"></style>
