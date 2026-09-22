<script lang="ts">
/**
 * Module scope (shared by all instances): the mounted provider counter lives in `useConfirm`,
 * which uses it to decline a call made without a provider instead of leaving a hanging promise.
 */
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { SAlertDialog } from '../../components/SAlertDialog'
import { devWarn } from '../../internal/dev'
import {
  registerConfirmProvider,
  unregisterConfirmProvider,
  useConfirm,
} from '../../composables/useConfirm'

const { queue, settle, clear } = useConfirm()

/**
 * Only the first queued request is on screen: the confirmation dialog is modal, so there is no
 * room for several at once; the next one opens once the current one is answered.
 */
const current = computed(() => queue.value[0])

onMounted(() => {
  if (registerConfirmProvider() > 1) {
    devWarn(
      '[smalt] Several <ConfirmProvider> instances are mounted. The confirmation queue is ' +
        'shared, so the dialog will be duplicated. Keep one provider at the app root.',
    )
  }
})

onUnmounted(() => {
  // Pending promises would otherwise never settle, so they are declined.
  if (unregisterConfirmProvider() === 0) clear()
})

defineSlots<{
  /** The app: the provider can wrap it or sit next to it. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <slot />

  <SAlertDialog
    v-if="current"
    :key="current.id"
    :open="true"
    :title="current.title"
    :description="current.description"
    :confirm-label="current.confirmLabel"
    :cancel-label="current.cancelLabel"
    :danger="current.danger"
    :square="current.square"
    :initial-focus="current.initialFocus"
    @confirm="settle(current.id, true)"
    @cancel="settle(current.id, false)"
  />
</template>
