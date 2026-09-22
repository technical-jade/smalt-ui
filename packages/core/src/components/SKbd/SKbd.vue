<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useDefaults } from '../../composables'
import type { SKbdProps } from './types'

const props = withDefaults(defineProps<SKbdProps>(), {
  size: 'md',
  variant: 'outline',
})
const p = useDefaults(props, 'SKbd')

/**
 * Symbols are fixed, never picked by platform: the shortcut has to match the one the application
 * documents, and sniffing would make the server render a different string than the client.
 */
const KEY_SYMBOLS: Readonly<Record<string, string>> = Object.freeze({
  meta: '⌘',
  command: '⌘',
  ctrl: '⌃',
  control: '⌃',
  alt: '⌥',
  option: '⌥',
  shift: '⇧',
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  delete: '⌦',
  escape: '⎋',
  esc: '⎋',
  tab: '⇥',
  capslock: '⇪',
  up: '↑',
  arrowup: '↑',
  down: '↓',
  arrowdown: '↓',
  left: '←',
  arrowleft: '←',
  right: '→',
  arrowright: '→',
  space: '␣',
})

defineSlots<{
  /** Key content instead of `value`; it is rendered as given, without symbol mapping. */
  default?: (props: Record<string, never>) => unknown
}>()

const slots = useSlots()

const symbol = computed(() => (p.value ? KEY_SYMBOLS[p.value.toLowerCase()] : undefined))

/**
 * A <kbd> tag would pick up the host's prose styles, so the element is a plain span and carries
 * the key name for screen readers: read on its own, a symbol such as "⌘" is an unknown glyph.
 * The role is what allows the name — a generic span cannot be labelled.
 */
const label = computed(() => (symbol.value && !slots.default ? p.value : undefined))
</script>

<template>
  <span
    class="s-kbd"
    :class="[`s-kbd--${p.variant}`, `s-kbd--${p.size}`]"
    :role="label ? 'img' : undefined"
    :aria-label="label"
  >
    <slot>{{ symbol ?? p.value }}</slot>
  </span>
</template>

<style src="./SKbd.scss" lang="scss"></style>
