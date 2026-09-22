<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Primitive } from 'reka-ui'
import { SIcon } from '../SIcon'
import { useDefaults } from '../../composables'
import type { SListItemProps } from './types'

const props = withDefaults(defineProps<SListItemProps>(), {
  active: false,
  clickable: false,
  disabled: false,
})
const p = useDefaults(props, 'SListItem')

/**
 * A link or a button carries its own role, which would replace `listitem` if it were the root.
 * The row is therefore nested inside a plain `div role="listitem"`, and everything the consumer
 * passes goes to the row — `class`/`style` stay on the wrapper, as usual.
 */
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const rootClass = computed(() => attrs.class)
const rootStyle = computed(() => attrs.style)

const LISTENER = /^on[A-Z]/

/**
 * A disabled row drops the consumer's listeners: on anything but a native button `disabled` is
 * only an announcement, so the handler would keep running. Dropping them beats cancelling the
 * event, which would depend on the order the two listeners end up registered in.
 */
const rowAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => key !== 'class' && key !== 'style' && !(p.disabled && LISTENER.test(key)),
    ),
  ),
)

const tag = computed(() => p.as ?? (p.href ? 'a' : p.clickable ? 'button' : 'div'))
const isLink = computed(() => tag.value === 'a')
const isNativeButton = computed(() => tag.value === 'button')
const isInteractive = computed(
  () => p.clickable || !!p.href || isLink.value || isNativeButton.value,
)

/** A disabled link still navigates on activation, and the click still reaches the ancestors. */
function onClick(event: MouseEvent) {
  if (!p.disabled) return
  event.preventDefault()
  event.stopImmediatePropagation()
}

defineSlots<{
  /** Leading content: an icon, an avatar or a checkbox. Overrides the `icon` prop. */
  prepend?: (props: Record<string, never>) => unknown
  /** Row content, replacing the title and the description. */
  default?: (props: Record<string, never>) => unknown
  /** Row title (instead of the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Secondary line (instead of the `description` prop). */
  description?: (props: Record<string, never>) => unknown
  /** Trailing content: meta text, a badge or an action button. */
  append?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div
    class="s-list-item"
    :class="[rootClass, { 's-list-item--active': p.active, 's-list-item--disabled': p.disabled }]"
    :style="rootStyle"
    :data-disabled="p.disabled || undefined"
    role="listitem"
  >
    <Primitive
      class="s-list-item__row"
      :class="{ 's-list-item__row--interactive': isInteractive }"
      :as="tag"
      :href="isLink ? p.href : undefined"
      :type="isNativeButton ? 'button' : undefined"
      :disabled="isNativeButton && p.disabled ? true : undefined"
      :aria-disabled="!isNativeButton && p.disabled ? true : undefined"
      :aria-current="isLink && p.active ? 'true' : undefined"
      :tabindex="isLink && p.disabled ? -1 : undefined"
      :data-disabled="p.disabled || undefined"
      :data-active="p.active || undefined"
      v-bind="rowAttrs"
      @click.capture="onClick"
    >
      <span
        v-if="$slots.prepend || p.icon"
        class="s-list-item__prepend"
      >
        <slot name="prepend">
          <SIcon
            :icon="p.icon"
            :size="20"
          />
        </slot>
      </span>

      <span class="s-list-item__content">
        <slot>
          <span
            v-if="$slots.title || p.title"
            class="s-list-item__title"
            ><slot name="title">{{ p.title }}</slot></span
          >
          <span
            v-if="$slots.description || p.description"
            class="s-list-item__description"
            ><slot name="description">{{ p.description }}</slot></span
          >
        </slot>
      </span>

      <span
        v-if="$slots.append"
        class="s-list-item__append"
      >
        <slot name="append" />
      </span>
    </Primitive>
  </div>
</template>

<style src="./SListItem.scss" lang="scss"></style>
