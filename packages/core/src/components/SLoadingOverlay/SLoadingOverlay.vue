<script setup lang="ts">
import { computed } from 'vue'
import { SSpinner } from '../SSpinner'
import { useDefaults, useMessages } from '../../composables'
import type { SLoadingOverlayProps } from './types'

/**
 * The root is a Transition, which renders nothing while the overlay is closed, so the consumer's
 * class, style and attributes are bound to the covering element by hand.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SLoadingOverlayProps>(), {
  open: false,
  fullscreen: false,
  hideLabel: false,
  spinner: true,
  size: 'md',
  blur: false,
})
const p = useDefaults(props, 'SLoadingOverlay')
const m = useMessages()

defineSlots<{
  /**
   * Replaces the spinner and the label — a place for a circular `SProgress` with a percentage.
   * The overlay keeps announcing itself as busy, but the replacement has to carry its own
   * accessible name.
   */
  default?: (props: Record<string, never>) => unknown
}>()

const label = computed(() => p.label ?? m.value.loading)

// Inline, so the prop wins over both the base value and the lower one `--blur` sets.
const opacityStyle = computed(() =>
  p.opacity == null ? undefined : { '--s-loading-overlay-opacity': String(p.opacity) },
)
</script>

<template>
  <Transition name="s-loading-overlay-fade">
    <div
      v-if="p.open"
      class="s-loading-overlay"
      :class="[
        `s-loading-overlay--${p.size}`,
        {
          's-loading-overlay--fullscreen': p.fullscreen,
          's-loading-overlay--blur': p.blur,
        },
      ]"
      :style="opacityStyle"
      aria-busy="true"
      v-bind="$attrs"
    >
      <!-- The dimming lives on its own layer: opacity on the overlay would fade the spinner and
           the label along with the covered content. -->
      <div class="s-loading-overlay__backdrop" />
      <div class="s-loading-overlay__content">
        <slot>
          <SSpinner
            v-if="p.spinner"
            class="s-loading-overlay__spinner"
            :size="p.size"
          />
          <span
            class="s-loading-overlay__label"
            :class="{ 's-loading-overlay__label--hidden': p.hideLabel }"
            role="status"
            aria-live="polite"
          >
            {{ label }}
          </span>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<style src="./SLoadingOverlay.scss" lang="scss"></style>
