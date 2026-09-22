<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { SAlertDialog } from '../../components/SAlertDialog'
import { devWarn } from '../../internal/dev'
import {
  clearConfirms,
  confirmQueue,
  registerConfirmProvider,
  settleConfirm,
  unregisterConfirmProvider,
} from '../../internal/confirmQueue'

/**
 * Only the first queued request is on screen: the confirmation dialog is modal, so there is no
 * room for several at once; the next one opens once the current one is answered.
 */
const current = computed(() => confirmQueue.value[0])

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
  if (unregisterConfirmProvider() === 0) clearConfirms()
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
    @confirm="settleConfirm(current.id, true)"
    @cancel="settleConfirm(current.id, false)"
  />
</template>
