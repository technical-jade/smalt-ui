<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { useDefaults } from '../../composables'
import type { SAvatarProps } from './types'

const props = withDefaults(defineProps<SAvatarProps>(), {
  size: 'md',
})
const p = useDefaults(props, 'SAvatar')

defineSlots<{
  /** Fallback content (an alternative to the `fallback` prop). */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <AvatarRoot
    class="s-avatar"
    :class="`s-avatar--${p.size}`"
  >
    <!-- Rendered without v-if: Reka keeps the "loaded" status after the image unmounts, and the
         fallback would not come back when src is cleared. An empty src reports an error. -->
    <AvatarImage
      class="s-avatar__image"
      :src="p.src ?? ''"
      :alt="p.alt ?? ''"
    />
    <AvatarFallback
      class="s-avatar__fallback"
      :delay-ms="p.delayMs"
    >
      <slot>{{ p.fallback }}</slot>
    </AvatarFallback>
  </AvatarRoot>
</template>

<style src="./SAvatar.scss" lang="scss"></style>
