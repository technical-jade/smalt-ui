<script lang="ts">
/**
 * Module scope (shared by all instances): the mounted provider counter.
 * The toast queue is a global singleton, so ONE provider per app is expected.
 */
let activeProviders = 0
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { ToastPortal, ToastProvider as RekaToastProvider, ToastViewport } from 'reka-ui'
import { useToast } from '../../composables/useToast'
import { useDefaults, useMessages } from '../../composables'
import { devWarn } from '../../internal/dev'
import { SToast } from '../../components/SToast'
import type { SToastPosition, ToastProviderProps } from './types'

// No own duration default: an unset one leaves the choice to the defaults of SToast.
const props = withDefaults(defineProps<ToastProviderProps>(), {
  position: 'bottom-right',
})

/**
 * The provider is registered like a regular component (plugin + Nuxt auto-import), so it also
 * reads prop defaults like one; otherwise `defaults: { ToastProvider: … }` would silently do
 * nothing.
 */
const p = useDefaults(props, 'ToastProvider')

const m = useMessages()
const { toasts, dismiss, clear } = useToast()

/** Swipe goes toward the nearest screen edge: right on the right side, left on the left. */
const SWIPE_DIRECTIONS: Record<SToastPosition, 'left' | 'right'> = {
  'top-left': 'left',
  'bottom-left': 'left',
  'top-right': 'right',
  'bottom-right': 'right',
}
const swipeDirection = computed(() => SWIPE_DIRECTIONS[p.position])

onMounted(() => {
  activeProviders += 1
  if (activeProviders > 1) {
    devWarn(
      '[smalt] Several <ToastProvider> instances are mounted. The toast queue is shared, ' +
        'so notifications will be duplicated. Keep one provider at the app root.',
    )
  }
})

onUnmounted(() => {
  activeProviders -= 1
  // The queue is global: without a provider its toasts would linger until the next mount.
  if (activeProviders <= 0) clear()
})
</script>

<template>
  <RekaToastProvider
    :duration="p.duration"
    :label="m.notification"
    :swipe-direction="swipeDirection"
  >
    <slot />

    <SToast
      v-for="t in toasts"
      :key="t.id"
      :title="t.title"
      :description="t.description"
      :variant="t.variant"
      :color="t.color"
      :duration="t.duration ?? p.duration"
      @close="dismiss(t.id)"
    />

    <!-- The portal moves the viewport into body: the provider is mounted inside the app, and any
         ancestor with isolation/transform/z-index would trap position:fixed in its stacking
         context, so the host's header or sidebar would render over the notification. -->
    <ToastPortal>
      <ToastViewport
        class="s-toast-viewport"
        :class="`s-toast-viewport--${p.position}`"
        :label="(hotkey: string) => `${p.label ?? m.notifications} (${hotkey})`"
      />
    </ToastPortal>
  </RekaToastProvider>
</template>

<style src="./ToastProvider.scss" lang="scss"></style>
