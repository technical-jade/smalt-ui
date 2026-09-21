<script setup lang="ts">
import { computed } from 'vue'
import { AspectRatio } from 'reka-ui'
import { useDefaults } from '../../composables'
import { devWarn } from '../../internal/dev'
import type { SAspectRatioProps } from './types'

const props = withDefaults(defineProps<SAspectRatioProps>(), {
  ratio: 1,
})
const p = useDefaults(props, 'SAspectRatio')

/**
 * Reka turns the ratio into `padding-bottom: (1 / ratio) * 100%` unchecked: 0 or NaN (a
 * `video.videoWidth / video.videoHeight` before metadata loads) gives an invalid declaration,
 * and the block collapses to zero height.
 */
const ratio = computed(() => {
  if (Number.isFinite(p.ratio) && p.ratio > 0) return p.ratio
  devWarn(`[SAspectRatio] ratio must be a positive finite number, got ${p.ratio}; using 1.`)
  return 1
})

defineSlots<{
  /** Content with a fixed aspect ratio (image, video, map, placeholder). */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <!-- Own root: Reka puts attributes on its inner absolutely positioned block, so a consumer's
       width or max-width would narrow the content while the height still follows the parent. -->
  <div class="s-aspect-ratio">
    <AspectRatio
      :ratio="ratio"
      class="s-aspect-ratio__content"
    >
      <slot />
    </AspectRatio>
  </div>
</template>

<style src="./SAspectRatio.scss" lang="scss"></style>
