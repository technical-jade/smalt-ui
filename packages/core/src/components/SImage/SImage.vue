<script setup lang="ts">
import { computed, onMounted, ref, watch, type HTMLAttributes } from 'vue'
import { SAspectRatio } from '../SAspectRatio'
import { SSkeleton } from '../SSkeleton'
import { useDefaults } from '../../composables'
import type { SImageProps } from './types'

const props = withDefaults(defineProps<SImageProps>(), {
  fit: 'cover',
  position: 'center',
  lazy: true,
  placeholder: true,
})
const p = useDefaults(props, 'SImage')

const emit = defineEmits<{
  /** The image finished loading. */
  load: [event: Event]
  /** The image failed to load; fires again when the `fallback` fails as well. */
  error: [event: Event]
}>()

const slots = defineSlots<{
  /** Replaces the loading skeleton. */
  placeholder?: (props: Record<string, never>) => unknown
  /** Replaces the surface shown once the image — and the `fallback` — failed to load. */
  error?: (props: Record<string, never>) => unknown
}>()

type SImageStatus = 'loading' | 'loaded' | 'error'

const status = ref<SImageStatus>('loading')
const usingFallback = ref(false)

const currentSrc = computed(() => (usingFallback.value ? (p.fallback ?? p.src) : p.src))

watch(
  () => p.src,
  () => {
    status.value = 'loading'
    usingFallback.value = false
  },
)

const imgEl = ref<HTMLImageElement | null>(null)

function markLoaded() {
  status.value = 'loaded'
}

function markError() {
  if (p.fallback && !usingFallback.value) {
    usingFallback.value = true
    status.value = 'loading'
    return
  }
  status.value = 'error'
}

function onLoad(event: Event) {
  markLoaded()
  emit('load', event)
}

function onError(event: Event) {
  markError()
  emit('error', event)
}

/**
 * A cached image can finish before Vue attaches the listeners, leaving the placeholder up for
 * good; `complete` with a decoded `naturalWidth` catches it. Zero width is NOT read as a
 * failure: a DOM that never loads images reports exactly that for every one of them.
 */
onMounted(() => {
  const img = imgEl.value
  if (img?.complete && img.naturalWidth > 0) markLoaded()
})

const frame = computed(() => (p.ratio === undefined ? 'div' : SAspectRatio))
const frameProps = computed(() =>
  p.ratio === undefined ? {} : { ratio: p.ratio, square: p.square },
)

/**
 * Inline, not in the stylesheet: both are free-form values, and SAspectRatio sets its own
 * object-fit on direct media children at the same specificity as our class would.
 */
const imgStyle = computed(() => ({ objectFit: p.fit, objectPosition: p.position }))

/**
 * A failed image still owes the reader its text alternative, so the built-in surface carries
 * `alt` as its accessible name; a decorative image (empty `alt`) is hidden from assistive
 * technology instead. Custom content in the `error` slot names itself.
 */
const errorAttrs = computed<HTMLAttributes>(() => {
  if (slots.error) return {}
  return p.alt ? { role: 'img', 'aria-label': p.alt } : { 'aria-hidden': true }
})
</script>

<template>
  <component
    :is="frame"
    v-bind="frameProps"
    class="s-image"
    :class="{ 's-image--square': p.square }"
  >
    <!-- Rendered on the server with its real src, so the browser starts the request during
         parsing and hydration has nothing to swap. -->
    <img
      v-if="status !== 'error'"
      ref="imgEl"
      class="s-image__img"
      :src="currentSrc"
      :alt="p.alt"
      :srcset="p.srcset"
      :sizes="p.sizes"
      :loading="p.lazy ? 'lazy' : 'eager'"
      :decoding="p.lazy ? 'async' : undefined"
      :style="imgStyle"
      @load="onLoad"
      @error="onError"
    />
    <div
      v-if="p.placeholder && status === 'loading'"
      class="s-image__placeholder"
    >
      <slot name="placeholder">
        <SSkeleton variant="rect" />
      </slot>
    </div>
    <div
      v-else-if="status === 'error'"
      class="s-image__error"
      v-bind="errorAttrs"
    >
      <slot name="error" />
    </div>
  </component>
</template>

<style src="./SImage.scss" lang="scss"></style>
