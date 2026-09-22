<script setup lang="ts">
import { computed } from 'vue'
import { SDialogShell } from '../../internal/SDialogShell'
import { useDefaults, useMessages } from '../../composables'
import type { SDialogProps } from './types'

const props = defineProps<SDialogProps>()
const p = useDefaults(props, 'SDialog')

const m = useMessages()

const widthStyle = computed(() =>
  p.width == null
    ? undefined
    : { '--s-dialog-width': typeof p.width === 'number' ? `${p.width}px` : p.width },
)

/** Whether the dialog is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open')

defineSlots<{
  /** Trigger element that opens the dialog (wrapped in `DialogTrigger`). */
  trigger?: (props: Record<string, never>) => unknown
  /** Dialog title (replaces the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Dialog description (replaces the `description` prop). */
  description?: (props: Record<string, never>) => unknown
  /** Main content (body) of the dialog. */
  default?: (props: Record<string, never>) => unknown
  /** Dialog footer, usually action buttons. */
  footer?: (props: Record<string, never>) => unknown
  /** Content of the close button (an `x` icon by default). */
  close?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <SDialogShell
    v-model:open="open"
    name="dialog"
    :label="m.dialogLabel"
    :title="p.title"
    :description="p.description"
    :close-label="p.closeLabel"
    :square="p.square"
    :style="widthStyle"
  >
    <template
      v-if="$slots.trigger"
      #trigger
    >
      <slot name="trigger" />
    </template>
    <template
      v-if="$slots.title"
      #title
    >
      <slot name="title" />
    </template>
    <template
      v-if="$slots.description"
      #description
    >
      <slot name="description" />
    </template>
    <template #default>
      <slot />
    </template>
    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
    <template
      v-if="$slots.close"
      #close
    >
      <slot name="close" />
    </template>
  </SDialogShell>
</template>

<style src="./SDialog.scss" lang="scss"></style>
