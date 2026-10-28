<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useDefaults, useMessages } from '../../composables'
import type { SMessages } from '../../composables'
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

/**
 * Screen reader names. Modifiers and service keys are named as printed on the keyboard and need
 * no translation; `meta` is the ⌘ key, a Mac symbol, so its name is the Mac one as well. Arrows
 * and space are printed as glyphs, so their names come from the locale dictionary.
 */
const KEY_NAMES: Readonly<Record<string, string>> = Object.freeze({
  meta: 'Command',
  command: 'Command',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  option: 'Option',
  shift: 'Shift',
  enter: 'Enter',
  return: 'Enter',
  backspace: 'Backspace',
  delete: 'Delete',
  escape: 'Esc',
  esc: 'Esc',
  tab: 'Tab',
  capslock: 'Caps Lock',
})

const KEY_MESSAGES: Readonly<Record<string, keyof SMessages>> = Object.freeze({
  up: 'kbdArrowUp',
  arrowup: 'kbdArrowUp',
  down: 'kbdArrowDown',
  arrowdown: 'kbdArrowDown',
  left: 'kbdArrowLeft',
  arrowleft: 'kbdArrowLeft',
  right: 'kbdArrowRight',
  arrowright: 'kbdArrowRight',
  space: 'kbdSpace',
})

defineSlots<{
  /** Key content instead of `value`; it is rendered as given, without symbol mapping. */
  default?: (props: Record<string, never>) => unknown
}>()

const slots = useSlots()
const m = useMessages()

const key = computed(() => p.value?.toLowerCase() ?? '')
const symbol = computed(() => KEY_SYMBOLS[key.value])

/**
 * A <kbd> tag would pick up the host's prose styles, so the element is a plain span and carries
 * the key name for screen readers: read on its own, a symbol such as "⌘" is an unknown glyph.
 * The role is what allows the name — a generic span cannot be labelled.
 */
const label = computed(() => {
  if (!symbol.value || slots.default) return undefined
  const message = KEY_MESSAGES[key.value]
  return message ? m.value[message] : KEY_NAMES[key.value]
})
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
