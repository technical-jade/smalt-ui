<script setup lang="ts">
import { computed } from 'vue'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import type { SBannerProps, SBannerVariant } from './types'

const props = withDefaults(defineProps<SBannerProps>(), {
  /**
   * `icon` accepts `false`, so Vue infers a Boolean prop and casts an omitted one to `false` —
   * the banner would lose its status icon. Declaring the default keeps it `undefined`.
   */
  icon: undefined,
  variant: 'neutral',
  closable: false,
  sticky: false,
  bordered: false,
  square: true,
})
const p = useDefaults(props, 'SBanner')

const m = useMessages()

const emit = defineEmits<{
  /** The close button was clicked. */
  close: []
}>()

/**
 * Whether the banner is shown. The close button hides it by itself; `v-model:visible` brings it
 * back, so an application that remembers the dismissal restores the state on the next visit.
 */
const visible = defineModel<boolean>('visible', { default: true })

function onClose() {
  visible.value = false
  emit('close')
}

defineSlots<{
  /** Message. */
  default?: (props: Record<string, never>) => unknown
  /** Title (alternative to the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Custom icon (replaces the status icon). */
  icon?: (props: Record<string, never>) => unknown
  /** Actions at the end of the row; they wrap under the message on narrow screens. */
  actions?: (props: Record<string, never>) => unknown
  /** Close control instead of the built-in button; `closable` still has to be set. */
  close?: (props: { close: () => void }) => unknown
}>()

const colorStyle = useColorProp(p, 's-banner')

/**
 * Same live-region rule as SAlert: `negative` interrupts the queue (role=alert + assertive),
 * everything else is announced politely. The pair role=alert + aria-live=polite is contradictory
 * and screen readers interpret it differently.
 */
const live = computed(() => (p.variant === 'negative' ? 'assertive' : 'polite'))
const role = computed(() => (p.variant === 'negative' ? 'alert' : 'status'))

// Priority: `icon` slot → `icon` prop → the variant's status icon. `neutral` reports no status.
const STATUS_ICONS: Record<SBannerVariant, string | undefined> = {
  neutral: undefined,
  info: 'info',
  positive: 'circle-check',
  warning: 'triangle-alert',
  negative: 'circle-alert',
}

const statusIcon = computed(() =>
  p.icon === false ? undefined : (p.icon ?? STATUS_ICONS[p.variant]),
)
</script>

<template>
  <div
    v-if="visible"
    class="s-banner"
    :class="[
      `s-banner--${p.variant}`,
      {
        's-banner--square': p.square,
        's-banner--sticky': p.sticky,
        's-banner--bordered': p.bordered,
      },
    ]"
    :style="colorStyle"
    :role="role"
    :aria-live="live"
  >
    <span
      v-if="statusIcon || $slots.icon"
      class="s-banner__icon"
    >
      <slot name="icon">
        <SIcon :icon="statusIcon" />
      </slot>
    </span>

    <div class="s-banner__main">
      <div class="s-banner__content">
        <div
          v-if="p.title || $slots.title"
          class="s-banner__title"
        >
          <slot name="title">{{ p.title }}</slot>
        </div>
        <div
          v-if="$slots.default"
          class="s-banner__body"
        >
          <slot />
        </div>
      </div>

      <div
        v-if="$slots.actions"
        class="s-banner__actions"
      >
        <slot name="actions" />
      </div>
    </div>

    <template v-if="p.closable">
      <slot
        name="close"
        :close="onClose"
      >
        <button
          type="button"
          class="s-banner__close"
          :aria-label="p.closeLabel ?? m.close"
          @click="onClose"
        >
          <SIcon
            icon="x"
            :size="16"
          />
        </button>
      </slot>
    </template>
  </div>
</template>

<style src="./SBanner.scss" lang="scss"></style>
