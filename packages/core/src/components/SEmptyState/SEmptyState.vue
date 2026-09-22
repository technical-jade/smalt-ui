<script setup lang="ts">
import { computed } from 'vue'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import type { SEmptyStateProps, SEmptyStateSize } from './types'

const props = withDefaults(defineProps<SEmptyStateProps>(), {
  size: 'md',
})
const p = useDefaults(props, 'SEmptyState')

const m = useMessages()

const colorStyle = useColorProp(p, 's-empty-state')

defineSlots<{
  /** Media above the title: replaces the icon and the image. */
  icon?: (props: Record<string, never>) => unknown
  /** Title (alternative to the `title` prop). */
  title?: (props: Record<string, never>) => unknown
  /** Description (alternative to the `description` prop). */
  description?: (props: Record<string, never>) => unknown
  /** Extra content under the description: a hint, a form, a list of next steps. */
  default?: (props: Record<string, never>) => unknown
  /** Action buttons at the bottom of the block. */
  actions?: (props: Record<string, never>) => unknown
}>()

const ICON_SIZES: Record<SEmptyStateSize, number> = { sm: 24, md: 32, lg: 48 }

const iconSize = computed(() => ICON_SIZES[p.size])
</script>

<template>
  <div
    class="s-empty-state"
    :class="`s-empty-state--${p.size}`"
    :style="colorStyle"
  >
    <div
      v-if="$slots.icon || p.image || p.icon"
      class="s-empty-state__media"
    >
      <slot name="icon">
        <img
          v-if="p.image"
          class="s-empty-state__image"
          :src="p.image"
          alt=""
        />
        <SIcon
          v-else
          :icon="p.icon"
          :size="iconSize"
        />
      </slot>
    </div>

    <div class="s-empty-state__title">
      <slot name="title">{{ p.title ?? m.noData }}</slot>
    </div>

    <div
      v-if="p.description || $slots.description"
      class="s-empty-state__description"
    >
      <slot name="description">{{ p.description }}</slot>
    </div>

    <div
      v-if="$slots.default"
      class="s-empty-state__body"
    >
      <slot />
    </div>

    <div
      v-if="$slots.actions"
      class="s-empty-state__actions"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<style src="./SEmptyState.scss" lang="scss"></style>
