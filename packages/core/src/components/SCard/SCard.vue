<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from 'vue'
import { Primitive } from 'reka-ui'
import { useDefaults, useElevationProp } from '../../composables'
import { devWarn } from '../../internal/dev'
import type { SCardProps } from './types'

const props = withDefaults(defineProps<SCardProps>(), {
  as: 'div',
  variant: 'outline',
  interactive: false,
  selected: false,
  disabled: false,
})
const p = useDefaults(props, 'SCard')

/**
 * The zero value is a transparent shadow rather than `none`: the selection ring is in the same
 * list, and the keyword would invalidate the whole declaration.
 */
const elevationStyle = useElevationProp(p, 's-card', { zero: '0 0 #0000' })

/**
 * `pointer-events: none` stops only the mouse: a disabled button or link card would still take
 * focus and activate from the keyboard. A native button gets `disabled`; on other tags the click
 * (which Enter on a link also fires, as does a click on a label) is cancelled, and a link leaves
 * the tab order.
 */
const isNativeButton = computed(() => p.as === 'button')
const isLink = computed(() => p.as === 'a')

function onClick(event: MouseEvent) {
  if (p.disabled && !isNativeButton.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

/**
 * A disabled label card swallows clicks and Space but cannot tell a control from the slot that
 * it is disabled: the control stays focusable and sounds enabled to a screen reader.
 */
const root = useTemplateRef<{ $el: Element | null }>('root')
watchEffect(
  () => {
    if (!p.disabled || p.as !== 'label') return
    const el = root.value?.$el
    if (!(el instanceof Element)) return
    if (el.querySelector('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')) {
      devWarn('[SCard] disabled label card around an enabled control — disable the control too.')
    }
  },
  { flush: 'post' },
)

defineSlots<{
  /** Card header. */
  header?: (props: Record<string, never>) => unknown
  /** Main content. */
  default?: (props: Record<string, never>) => unknown
  /** Card footer. */
  footer?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <!-- data-selected/-disabled in addition to classes: the consumer and nested elements style the
       card by them without depending on the order of BEM modifiers. -->
  <Primitive
    ref="root"
    :as="p.as"
    class="s-card"
    :class="[
      `s-card--${p.variant}`,
      {
        's-card--square': p.square,
        's-card--interactive': p.interactive,
        's-card--selected': p.selected,
        's-card--disabled': p.disabled,
      },
    ]"
    :style="elevationStyle"
    :data-selected="p.selected || undefined"
    :data-disabled="p.disabled || undefined"
    :disabled="isNativeButton ? p.disabled : undefined"
    :aria-disabled="isLink && p.disabled ? true : undefined"
    :tabindex="isLink && p.disabled ? -1 : undefined"
    @click.capture="onClick"
  >
    <div
      v-if="$slots.header"
      class="s-card__header"
    >
      <slot name="header" />
    </div>
    <div
      class="s-card__body"
      :class="p.bodyClass"
    >
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="s-card__footer"
    >
      <slot name="footer" />
    </div>
  </Primitive>
</template>

<style src="./SCard.scss" lang="scss"></style>
