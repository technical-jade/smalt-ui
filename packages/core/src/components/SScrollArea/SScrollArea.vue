<script setup lang="ts">
import { computed } from 'vue'
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { useDefaults } from '../../composables'
import type { SScrollAreaProps } from './types'

const props = withDefaults(defineProps<SScrollAreaProps>(), {
  type: 'hover',
  scrollHideDelay: 600,
  orientation: 'vertical',
  size: 'md',
})
const p = useDefaults(props, 'SScrollArea')

defineSlots<{
  /** Content of the scrollable region. */
  default?: (props: Record<string, never>) => unknown
}>()

/** A number means pixels, as width/height do in Vue bindings. */
const toLength = (value: string | number | undefined) =>
  typeof value === 'number' ? `${value}px` : value

const rootStyle = computed(() => {
  const height = toLength(p.height)
  return height ? { height } : undefined
})

/**
 * `maxHeight` belongs to the viewport, not to the root: the viewport takes its height from the
 * root, and a root that is only capped has no definite height to give it. The viewport would then
 * grow with the content and the root would merely clip it — a cut-off region with no scrollbar.
 */
const viewportStyle = computed(() => {
  const maxHeight = toLength(p.maxHeight)
  return maxHeight ? { maxHeight } : undefined
})
</script>

<template>
  <ScrollAreaRoot
    class="s-scroll-area"
    :class="`s-scroll-area--${p.size}`"
    :style="rootStyle"
    :type="p.type"
    :scroll-hide-delay="p.scrollHideDelay"
  >
    <!-- The viewport is the scrolling element; Reka hides its native scrollbars and makes it
         focusable, which keeps arrow keys, Page Up/Down and Home/End working. -->
    <ScrollAreaViewport
      class="s-scroll-area__viewport"
      :style="viewportStyle"
    >
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="p.orientation !== 'horizontal'"
      class="s-scroll-area__scrollbar"
      orientation="vertical"
    >
      <ScrollAreaThumb class="s-scroll-area__thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="p.orientation !== 'vertical'"
      class="s-scroll-area__scrollbar"
      orientation="horizontal"
    >
      <ScrollAreaThumb class="s-scroll-area__thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner class="s-scroll-area__corner" />
  </ScrollAreaRoot>
</template>

<style src="./SScrollArea.scss" lang="scss"></style>
