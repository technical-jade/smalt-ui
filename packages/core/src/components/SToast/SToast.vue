<script setup lang="ts">
import { computed } from 'vue'
import { ToastClose, ToastDescription, ToastRoot, ToastTitle } from 'reka-ui'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults, useElevationProp, useMessages } from '../../composables'
import type { SToastProps } from './types'

const props = withDefaults(defineProps<SToastProps>(), {
  variant: 'info',
  duration: 5000,
})
const p = useDefaults(props, 'SToast')

const m = useMessages()
const colorStyle = useColorProp(p, 's-toast')
const elevationStyle = useElevationProp(p, 's-surface')

const emit = defineEmits<{
  /** The toast closed (by timer, swipe or button). */
  close: []
}>()

const ICON_NAMES: Record<NonNullable<SToastProps['variant']>, string> = {
  info: 'info',
  positive: 'check',
  warning: 'triangle-alert',
  negative: 'circle-alert',
}

const iconName = computed(() => ICON_NAMES[p.variant])

// Reka announces a `foreground` toast assertively and a `background` one politely, as SAlert does.
const urgency = computed(() => (p.variant === 'negative' ? 'foreground' : 'background'))

function onOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<template>
  <ToastRoot
    class="s-toast"
    :class="[`s-toast--${p.variant}`, { 's-toast--square': p.square }]"
    :style="[colorStyle, elevationStyle]"
    :type="urgency"
    :duration="p.duration"
    @update:open="onOpenChange"
  >
    <SIcon
      class="s-toast__icon"
      :icon="iconName"
      :size="20"
    />

    <div class="s-toast__body">
      <ToastTitle
        as="div"
        class="s-toast__title"
        >{{ p.title }}</ToastTitle
      >
      <ToastDescription
        v-if="p.description"
        as="div"
        class="s-toast__description"
      >
        {{ p.description }}
      </ToastDescription>
    </div>

    <ToastClose
      class="s-toast__close"
      :aria-label="p.closeLabel ?? m.close"
    >
      <SIcon
        icon="x"
        :size="16"
      />
    </ToastClose>
  </ToastRoot>
</template>

<style src="./SToast.scss" lang="scss"></style>
