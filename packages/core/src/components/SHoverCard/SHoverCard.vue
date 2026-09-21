<script setup lang="ts">
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from 'reka-ui'
import { useDefaults, useElevationProp } from '../../composables'
import type { SHoverCardProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SHoverCardProps>(), {
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
  openDelay: 300,
  closeDelay: 200,
  enableTouch: false,
})
const p = useDefaults(props, 'SHoverCard')

const elevationStyle = useElevationProp(p, 's-surface')

/** Whether the card is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  /** Trigger element that shows the card on hover. */
  trigger?: (props: Record<string, never>) => unknown
  /** Card content. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <HoverCardRoot
    v-model:open="open"
    :open-delay="p.openDelay"
    :close-delay="p.closeDelay"
    :enable-touch="p.enableTouch"
  >
    <HoverCardTrigger as-child>
      <slot name="trigger" />
    </HoverCardTrigger>

    <HoverCardPortal>
      <HoverCardContent
        v-bind="$attrs"
        class="s-hover-card__content"
        :class="{ 's-hover-card__content--square': p.square }"
        :style="elevationStyle"
        :side="p.side"
        :align="p.align"
        :side-offset="p.sideOffset"
      >
        <slot />
        <HoverCardArrow
          class="s-hover-card__arrow"
          :width="16"
          :height="8"
        />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<style src="./SHoverCard.scss" lang="scss"></style>
