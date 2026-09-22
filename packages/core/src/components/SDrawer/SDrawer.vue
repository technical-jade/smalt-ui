<script setup lang="ts">
import { SDialogShell } from '../../internal/SDialogShell'
import { useDefaults, useMessages } from '../../composables'
import type { SDrawerProps } from './types'

const props = withDefaults(defineProps<SDrawerProps>(), {
  side: 'right',
})
const p = useDefaults(props, 'SDrawer')

const m = useMessages()

/** Whether the drawer is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open')

defineSlots<{
  /** Trigger element that opens the drawer (wrapped in `DialogTrigger`). */
  trigger?: (props: Record<string, never>) => unknown
  /** Title (replaces the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Description (replaces the `description` prop). */
  description?: (props: Record<string, never>) => unknown
  /** Main content (body) of the drawer. */
  default?: (props: Record<string, never>) => unknown
  /** Footer, usually action buttons. */
  footer?: (props: Record<string, never>) => unknown
  /** Close button content (an `x` icon by default). */
  close?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <SDialogShell
    v-model:open="open"
    name="drawer"
    :label="m.drawerLabel"
    :side="p.side"
    :title="p.title"
    :description="p.description"
    :close-label="p.closeLabel"
    :square="p.square"
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

<style src="./SDrawer.scss" lang="scss"></style>
