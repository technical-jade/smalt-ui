<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'
import { SButton } from '../SButton'
import { SVisuallyHidden } from '../../internal/SVisuallyHidden'
import { useDefaults, useMessages } from '../../composables'
import type { SAlertDialogProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SAlertDialogProps>(), {
  danger: false,
})
const p = useDefaults(props, 'SAlertDialog')

const m = useMessages()

/** Whether the dialog is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open')

const emit = defineEmits<{
  /** The user confirmed the action (confirm button). */
  confirm: []
  /** The user canceled the action (cancel button). */
  cancel: []
}>()

/**
 * Closing with Escape is the same refusal as the "Cancel" button: otherwise a consumer that
 * resets state in `@cancel` would never hear about it. The flag tells a close after a button
 * press (the decision is already reported) from a close "from outside".
 */
let decided = false

function onConfirm() {
  decided = true
  emit('confirm')
}

function onCancel() {
  decided = true
  emit('cancel')
}

function onOpenChange(next: boolean) {
  open.value = next
  if (next) {
    decided = false
    return
  }
  /**
   * Reka closes the dialog from its own button click handler, and its order relative to our
   * `@click` is undefined — so "closed from outside?" is decided in a microtask, when the
   * button's decision is guaranteed to be recorded.
   */
  queueMicrotask(() => {
    if (!decided) emit('cancel')
    decided = false
  })
}

defineSlots<{
  /** Trigger element that opens the dialog. */
  trigger?: (props: Record<string, never>) => unknown
  /** Title (replaces the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Description (replaces the `description` prop). */
  description?: (props: Record<string, never>) => unknown
  /** Extra content between the description and the buttons. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <AlertDialogRoot
    :open="open"
    @update:open="onOpenChange"
  >
    <AlertDialogTrigger
      v-if="$slots.trigger"
      as-child
    >
      <slot name="trigger" />
    </AlertDialogTrigger>

    <AlertDialogPortal>
      <AlertDialogOverlay class="s-alert-dialog__overlay" />
      <AlertDialogContent
        v-bind="{
          ...$attrs,
          ...(p.description || $slots.description ? {} : { 'aria-describedby': undefined }),
        }"
        class="s-alert-dialog__content"
        :class="{ 's-alert-dialog__content--square': p.square }"
      >
        <AlertDialogTitle
          v-if="p.title || $slots.title"
          as="div"
          class="s-alert-dialog__title"
        >
          <slot name="title">{{ p.title }}</slot>
        </AlertDialogTitle>
        <AlertDialogTitle
          v-else
          as-child
        >
          <SVisuallyHidden>{{ m.alertDialogLabel }}</SVisuallyHidden>
        </AlertDialogTitle>
        <AlertDialogDescription
          v-if="p.description || $slots.description"
          as="div"
          class="s-alert-dialog__description"
        >
          <slot name="description">{{ p.description }}</slot>
        </AlertDialogDescription>

        <div
          v-if="$slots.default"
          class="s-alert-dialog__body"
        >
          <slot />
        </div>

        <div class="s-alert-dialog__footer">
          <AlertDialogCancel as-child>
            <SButton
              variant="outline"
              @click="onCancel"
              >{{ p.cancelLabel ?? m.cancel }}</SButton
            >
          </AlertDialogCancel>
          <AlertDialogAction as-child>
            <SButton
              :variant="p.danger ? 'negative' : 'primary'"
              @click="onConfirm"
            >
              {{ p.confirmLabel ?? m.confirm }}
            </SButton>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style src="./SAlertDialog.scss" lang="scss"></style>
