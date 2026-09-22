<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SButton } from '../SButton'
import { useDefaults, useMessages } from '../../composables'
import { devWarn } from '../../internal/dev'
import type { SBackTopProps } from './types'

const props = withDefaults(defineProps<SBackTopProps>(), {
  visibilityHeight: 200,
  behavior: 'smooth',
  icon: 'chevron-up',
  variant: 'primary',
  size: 'md',
  round: true,
})
const p = useDefaults(props, 'SBackTop')
const m = useMessages()

defineSlots<{
  /**
   * Replaces the button. Receives the current visibility and the scroll action, so a custom
   * control can drive the same behavior.
   */
  default?: (props: { visible: boolean; scrollToTop: () => void }) => unknown
}>()

const visible = ref(false)

/**
 * The scrolled container is resolved on mount: the `target` selector points at the consumer's
 * markup, which does not exist while the component renders on the server. `null` means the
 * component follows the window; keeping the resolved element here (instead of re-reading the
 * selector) guarantees the listener is removed from the very object it was added to.
 */
let container: HTMLElement | null = null

function update() {
  visible.value = (container ? container.scrollTop : window.scrollY) > p.visibilityHeight
}

// The motion preference is read on click: the system setting can change while the page is open.
function scrollToTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const options: ScrollToOptions = { top: 0, behavior: reduced ? 'auto' : p.behavior }
  if (container) container.scrollTo(options)
  else window.scrollTo(options)
}

onMounted(() => {
  container = p.target ? document.querySelector<HTMLElement>(p.target) : null
  if (p.target && !container) {
    devWarn(`[SBackTop] no element matches the \`target\` selector "${p.target}".`)
  }
  ;(container ?? window).addEventListener('scroll', update, { passive: true })
  update()
})

onBeforeUnmount(() => {
  ;(container ?? window).removeEventListener('scroll', update)
})
</script>

<template>
  <!-- The positioned root stays in the DOM: a Transition as the component root would swallow the
       consumer's class and style instead of passing them down. -->
  <div class="s-back-top">
    <!-- v-show rather than v-if: the markup the server renders matches the hidden client state,
         so the button appears without a hydration mismatch. -->
    <Transition name="s-back-top-fade">
      <div
        v-show="visible"
        class="s-back-top__control"
      >
        <slot
          :visible="visible"
          :scroll-to-top="scrollToTop"
        >
          <SButton
            :icon="p.icon"
            :variant="p.variant"
            :size="p.size"
            :color="p.color"
            :round="p.round"
            :aria-label="p.label ?? m.backToTop"
            @click="scrollToTop"
          />
        </slot>
      </div>
    </Transition>
  </div>
</template>

<style src="./SBackTop.scss" lang="scss"></style>
