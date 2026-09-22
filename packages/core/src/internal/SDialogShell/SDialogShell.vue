<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { SIcon } from '../../components/SIcon'
import { SVisuallyHidden } from '../SVisuallyHidden'
import { useMessages } from '../../composables'
import type { SDialogShellProps } from './types'

/**
 * Modal overlay skeleton on Reka `Dialog*`: shared markup for SDialog and SDrawer (one family of
 * primitives). Public BEM classes come from the `name` prop (`s-${name}__…`); styles stay in
 * the `.scss` of each wrapper component.
 */
/**
 * The overlay has no root in the DOM: `DialogRoot` renders nothing and the content is portaled
 * into `body`. So the component's class, style and attributes go onto `__content`; otherwise
 * they would be lost entirely.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps<SDialogShellProps>()

const m = useMessages()

/** Whether the overlay is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open')

defineSlots<{
  trigger?: (props: Record<string, never>) => unknown
  title?: (props: Record<string, never>) => unknown
  description?: (props: Record<string, never>) => unknown
  default?: (props: Record<string, never>) => unknown
  footer?: (props: Record<string, never>) => unknown
  close?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger
      v-if="$slots.trigger"
      as-child
    >
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay :class="`s-${props.name}__overlay`" />
      <DialogContent
        :class="[
          `s-${props.name}__content`,
          side && `s-${props.name}__content--${side}`,
          square && `s-${props.name}__content--square`,
        ]"
        v-bind="{
          ...$attrs,
          ...(description || $slots.description ? {} : { 'aria-describedby': undefined }),
        }"
      >
        <!-- Title always renders (otherwise the overlay has no accessible name and Reka warns);
             without a visible title it is visually hidden but announced by screen readers. -->
        <DialogTitle
          v-if="title || $slots.title"
          as="div"
          :class="`s-${props.name}__title`"
        >
          <slot name="title">{{ title }}</slot>
        </DialogTitle>
        <DialogTitle
          v-else
          as-child
        >
          <SVisuallyHidden>{{ label }}</SVisuallyHidden>
        </DialogTitle>
        <DialogDescription
          v-if="description || $slots.description"
          as="div"
          :class="`s-${props.name}__description`"
        >
          <slot name="description">{{ description }}</slot>
        </DialogDescription>

        <div :class="`s-${props.name}__body`">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          :class="`s-${props.name}__footer`"
        >
          <slot name="footer" />
        </div>

        <DialogClose
          :class="`s-${props.name}__close`"
          :aria-label="closeLabel ?? m.close"
        >
          <slot name="close">
            <SIcon
              icon="x"
              :size="20"
            />
          </slot>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
