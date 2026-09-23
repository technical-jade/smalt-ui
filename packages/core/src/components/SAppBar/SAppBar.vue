<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useColorProp, useDefaults, useElevationProp } from '../../composables'
import { usePublishShellVars } from '../../internal/shellVars'
import type { SAppBarProps } from './types'

const props = withDefaults(defineProps<SAppBarProps>(), {
  position: 'sticky',
  bordered: true,
  elevateOnScroll: false,
  landmark: true,
})
const p = useDefaults(props, 'SAppBar')

const colorStyle = useColorProp(p, 's-app-bar')
const elevationStyle = useElevationProp(p, 's-app-bar')

const root = ref<HTMLElement | null>(null)

const height = computed(() =>
  p.height === undefined ? undefined : typeof p.height === 'number' ? `${p.height}px` : p.height,
)
const heightVars = computed(() => {
  const vars: Record<string, string> = {}
  if (height.value) vars['--s-app-bar-height'] = height.value
  return vars
})

/**
 * The bar sizes itself from its own variable, but the page and the sidebar have to reserve the
 * same height, and a sibling cannot read a property declared here — so a custom height is mirrored
 * onto the shell.
 */
usePublishShellVars(root, () => heightVars.value)

const scrolled = ref(false)

onMounted(() => {
  watchEffect((onCleanup) => {
    if (!p.elevateOnScroll) return
    const onScroll = () => (scrolled.value = window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    onCleanup(() => window.removeEventListener('scroll', onScroll))
  })
})

defineSlots<{
  /** Leading area: a menu button, a logo, a back arrow. */
  prepend?: (props: Record<string, never>) => unknown
  /** Centre of the bar: the title, a search field, tabs. */
  default?: (props: Record<string, never>) => unknown
  /** Trailing area: actions, a notifications button, an avatar. */
  append?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div
    ref="root"
    class="s-app-bar"
    :class="[
      `s-app-bar--${p.position}`,
      {
        's-app-bar--bordered': p.bordered,
        's-app-bar--elevated': p.elevateOnScroll && scrolled,
      },
    ]"
    :style="[colorStyle, elevationStyle, heightVars]"
    :role="p.landmark ? 'banner' : undefined"
  >
    <div
      v-if="$slots.prepend"
      class="s-app-bar__prepend"
    >
      <slot name="prepend" />
    </div>
    <div class="s-app-bar__content">
      <slot />
    </div>
    <div
      v-if="$slots.append"
      class="s-app-bar__append"
    >
      <slot name="append" />
    </div>
  </div>
</template>

<style src="./SAppBar.scss" lang="scss"></style>
