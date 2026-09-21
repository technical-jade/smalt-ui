<script setup lang="ts">
import { computed, onScopeDispose, ref, watch } from 'vue'
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { useDefaults, useElevationProp } from '../../composables'
import type { STooltipProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<STooltipProps>(), {
  side: 'top',
  trigger: 'hover',
  delayDuration: 200,
  autoCloseDelay: 0,
})
const p = useDefaults(props, 'STooltip')

const elevationStyle = useElevationProp(p, 's-tooltip')

/** Whether the tooltip is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open', { default: false })

/**
 * `auto` mode picks the behavior from the live event's pointerType, not from
 * `matchMedia('(pointer: coarse)')`: the media query describes the device's primary pointer, so
 * on hybrids (a laptop with a touchscreen, a tablet with a mouse) one of the two input methods
 * would not work. It also avoids touching window during setup, so SSR and hydration are safe.
 */
const lastPointerType = ref('mouse')

const tapToOpen = computed(
  () => p.trigger === 'click' || (p.trigger === 'auto' && lastPointerType.value === 'touch'),
)

let autoCloseTimer: ReturnType<typeof setTimeout> | undefined

function clearAutoClose() {
  clearTimeout(autoCloseTimer)
  autoCloseTimer = undefined
}

function onTriggerPointerDown(event: PointerEvent) {
  lastPointerType.value = event.pointerType
}

/**
 * In `auto` mode a mouse click closes the tooltip, as Reka itself does. It has to be repeated
 * here because Reka's built-in closing is disabled (see the markup).
 */
function onTriggerClick() {
  if (p.trigger === 'hover') return
  open.value = tapToOpen.value ? !open.value : false
}

watch(open, (isOpen) => {
  clearAutoClose()
  if (!isOpen || !tapToOpen.value || p.autoCloseDelay <= 0) return
  autoCloseTimer = setTimeout(() => {
    open.value = false
  }, p.autoCloseDelay)
})

onScopeDispose(clearAutoClose)

defineSlots<{
  /** Trigger element; interacting with it shows the tooltip. */
  trigger?: (props: Record<string, never>) => unknown
  /** Tooltip content (alternative to the `content` prop). */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <!--
    Each tooltip's own TooltipProvider overrides an outer one's context, so a shared skip delay
    (showing a neighboring tooltip instantly after the first) does not apply between STooltips.
  -->
  <TooltipProvider :delay-duration="p.delayDuration">
    <!--
      Reka's `disabled` does not turn the tooltip off; it only detaches its own trigger
      handlers. That is exactly what `click` mode needs, where hover must not open it: content
      rendering and `aria-describedby` depend on `open` and stay in place.
      `disable-closing-trigger` hands closing entirely to this component: otherwise Reka's click
      handler would cancel ours, and their order is set by the attribute merge via `as-child`.
    -->
    <TooltipRoot
      v-model:open="open"
      :disabled="p.trigger === 'click'"
      :disable-closing-trigger="p.trigger !== 'hover'"
    >
      <TooltipTrigger
        as-child
        @pointerdown="onTriggerPointerDown"
        @click="onTriggerClick"
      >
        <slot name="trigger" />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent
          v-bind="$attrs"
          class="s-tooltip__content"
          :class="{ 's-tooltip__content--square': p.square }"
          :style="elevationStyle"
          :side="p.side"
          :side-offset="6"
        >
          <slot>{{ p.content }}</slot>
          <TooltipArrow
            class="s-tooltip__arrow"
            :width="10"
            :height="5"
          />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style src="./STooltip.scss" lang="scss"></style>
