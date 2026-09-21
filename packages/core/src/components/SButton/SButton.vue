<script setup lang="ts">
import { computed, useSlots, watchEffect } from 'vue'
import { Primitive } from 'reka-ui'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults, useElevationProp } from '../../composables'
import type { SButtonProps } from './types'
import { devWarn } from '../../internal/dev'

const props = withDefaults(defineProps<SButtonProps>(), {
  as: 'button',
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
})
const p = useDefaults(props, 'SButton')

defineSlots<{
  /** Content before the label, usually a leading icon. Overrides the `icon` prop. */
  leading?: (props: Record<string, never>) => unknown
  /** Button label (text). */
  default?: (props: Record<string, never>) => unknown
  /** Content after the label, usually a trailing icon. Overrides the `iconRight` prop. */
  trailing?: (props: Record<string, never>) => unknown
}>()

const slots = useSlots()

const isNativeButton = computed(() => p.as === 'button')
const isBlocked = computed(() => p.disabled || p.loading)

/**
 * On a non-native tag (`as="a"` etc.) the `disabled` attribute does nothing, and `aria-disabled`
 * only announces the state — clicks and link navigation still work. The event is cancelled here:
 * `stopImmediatePropagation` also blocks the consumer's handler (Vue calls the inherited
 * listener after ours in the shared invoker).
 */
function onClick(event: MouseEvent) {
  if (isBlocked.value && !isNativeButton.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

const ICON_SIZES = { sm: 16, md: 18, lg: 20 } as const
const iconSize = computed(() => ICON_SIZES[p.size] ?? ICON_SIZES.md)

const colorStyle = useColorProp(p, 's-button')
// hover: a filled button rises one level on hover, including when elevation is set.
const elevationStyle = useElevationProp(p, 's-button', { hover: true })

// Icon button: an explicit prop or an icon without a label — the shape is square either way.
const isIconOnly = computed(() => p.iconOnly || ((!!p.icon || !!slots.leading) && !slots.default))

// A screen reader cannot announce an icon button without `ariaLabel`.
watchEffect(() => {
  if (isIconOnly.value && !p.ariaLabel) {
    devWarn('[SButton] icon-only button without an accessible name — set the `ariaLabel` prop.')
  }
})
</script>

<template>
  <Primitive
    :as="p.as"
    :type="isNativeButton ? p.type : undefined"
    :disabled="isNativeButton ? isBlocked : undefined"
    :aria-disabled="!isNativeButton && isBlocked ? true : undefined"
    :aria-busy="p.loading || undefined"
    :aria-label="p.ariaLabel"
    :data-loading="p.loading || undefined"
    :class="[
      's-button',
      `s-button--${p.variant}`,
      `s-button--${p.size}`,
      {
        's-button--round': p.round,
        's-button--square': p.square,
        's-button--icon-only': isIconOnly,
        's-button--flat': p.flat,
      },
    ]"
    :style="[colorStyle, elevationStyle]"
    @click="onClick"
  >
    <span
      v-if="$slots.leading || p.icon"
      class="s-button__affix"
    >
      <slot name="leading">
        <SIcon
          :icon="p.icon"
          :size="iconSize"
        />
      </slot>
    </span>
    <span
      v-if="$slots.default"
      class="s-button__label"
      ><slot
    /></span>
    <span
      v-if="$slots.trailing || p.iconRight"
      class="s-button__affix"
    >
      <slot name="trailing">
        <SIcon
          :icon="p.iconRight"
          :size="iconSize"
        />
      </slot>
    </span>
    <span
      v-if="p.loading"
      class="s-button__spinner"
      aria-hidden="true"
    />
  </Primitive>
</template>

<style src="./SButton.scss" lang="scss"></style>
