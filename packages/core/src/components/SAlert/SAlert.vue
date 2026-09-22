<script setup lang="ts">
import { computed } from 'vue'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import type { SAlertProps } from './types'

const props = withDefaults(defineProps<SAlertProps>(), {
  variant: 'info',
  closable: false,
})
const p = useDefaults(props, 'SAlert')

const m = useMessages()

const emit = defineEmits<{
  /** The close button was clicked. */
  close: []
}>()

/**
 * Whether the alert is shown. `closable` hides it by itself; `v-model:visible` brings it back.
 * Hiding it with `v-if` on `close` works too.
 */
const visible = defineModel<boolean>('visible', { default: true })

function onClose() {
  visible.value = false
  emit('close')
}

defineSlots<{
  /** Alert body. */
  default?: (props: Record<string, never>) => unknown
  /** Title (alternative to the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Custom icon (replaces the status icon). */
  icon?: (props: Record<string, never>) => unknown
}>()

const colorStyle = useColorProp(p, 's-alert')

/**
 * `negative` is the most urgent message: it interrupts the queue (role=alert + assertive).
 * Other variants are announced politely: role=status already implies polite, while the pair
 * role=alert + aria-live=polite is contradictory and screen readers interpret it differently.
 */
const live = computed(() => (p.variant === 'negative' ? 'assertive' : 'polite'))
const role = computed(() => (p.variant === 'negative' ? 'alert' : 'status'))

// Priority: `icon` slot → `icon` prop → the variant's status icon.
const STATUS_ICONS: Record<NonNullable<SAlertProps['variant']>, string> = {
  info: 'info',
  positive: 'circle-check',
  warning: 'triangle-alert',
  negative: 'circle-alert',
}

const statusIcon = computed(() => p.icon ?? STATUS_ICONS[p.variant])
</script>

<template>
  <div
    v-if="visible"
    class="s-alert"
    :class="[`s-alert--${p.variant}`, { 's-alert--square': p.square }]"
    :style="colorStyle"
    :role="role"
    :aria-live="live"
  >
    <span class="s-alert__icon">
      <slot name="icon">
        <SIcon :icon="statusIcon" />
      </slot>
    </span>

    <div class="s-alert__content">
      <div
        v-if="p.title || $slots.title"
        class="s-alert__title"
      >
        <slot name="title">{{ p.title }}</slot>
      </div>
      <div class="s-alert__body"><slot /></div>
    </div>

    <button
      v-if="p.closable"
      type="button"
      class="s-alert__close"
      :aria-label="p.closeLabel ?? m.close"
      @click="onClose"
    >
      <SIcon
        icon="x"
        :size="16"
      />
    </button>
  </div>
</template>

<style src="./SAlert.scss" lang="scss"></style>
