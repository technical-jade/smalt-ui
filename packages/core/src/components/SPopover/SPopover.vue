<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useDefaults, useElevationProp } from '../../composables'
import type { SPopoverProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SPopoverProps>(), {
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
  modal: false,
})
const p = useDefaults(props, 'SPopover')

const elevationStyle = useElevationProp(p, 's-surface')

/** Whether the panel is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  /** Trigger element that opens the panel on click. */
  trigger?: (props: Record<string, never>) => unknown
  /** Popover panel content. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <PopoverRoot
    v-model:open="open"
    :modal="p.modal"
  >
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        v-bind="$attrs"
        class="s-popover__content"
        :class="{ 's-popover__content--square': p.square }"
        :style="elevationStyle"
        :side="p.side"
        :align="p.align"
        :side-offset="p.sideOffset"
        :aria-label="p.ariaLabel"
      >
        <slot />
        <PopoverArrow
          class="s-popover__arrow"
          :width="16"
          :height="8"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style src="./SPopover.scss" lang="scss"></style>
