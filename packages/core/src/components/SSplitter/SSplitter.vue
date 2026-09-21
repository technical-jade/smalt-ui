<script setup lang="ts">
import { computed } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { useDefaults, useMessages } from '../../composables'
import type { SSplitterProps } from './types'

const props = withDefaults(defineProps<SSplitterProps>(), {
  direction: 'horizontal',
})
const p = useDefaults(props, 'SSplitter')

defineSlots<{
  /** Panel content by the panel's name (`name` or `panel-<index>`). */
  [name: string]: (props: Record<string, never>) => unknown
}>()

const m = useMessages()

const slotName = (index: number) => p.panels[index]?.name ?? `panel-${index}`

// The handle sits across the split: side-by-side panels get a vertical handle.
const handleOrientation = computed(() => (p.direction === 'horizontal' ? 'vertical' : 'horizontal'))

type PanelInstance = { collapse: () => void; expand: () => void; isCollapsed: boolean }
const panelRefs: (PanelInstance | null)[] = []

// Enter toggles the panel before the handle, as the APG window splitter pattern describes.
function toggleCollapse(index: number) {
  const panel = panelRefs[index - 1]
  if (!panel || !p.panels[index - 1]?.collapsible) return
  if (panel.isCollapsed) panel.expand()
  else panel.collapse()
}
</script>

<template>
  <SplitterGroup
    :direction="p.direction"
    class="s-splitter"
    :class="`s-splitter--${p.direction}`"
  >
    <template
      v-for="(panel, index) in p.panels"
      :key="index"
    >
      <SplitterResizeHandle
        v-if="index > 0"
        class="s-splitter__handle"
        :aria-label="p.handleLabel ?? m.resize"
        :aria-orientation="handleOrientation"
        @keydown.enter.prevent="toggleCollapse(index)"
      >
        <span
          class="s-splitter__grip"
          aria-hidden="true"
        />
      </SplitterResizeHandle>

      <SplitterPanel
        :ref="(el) => (panelRefs[index] = el as PanelInstance | null)"
        :default-size="panel.defaultSize"
        :min-size="panel.minSize"
        :max-size="panel.maxSize"
        :collapsible="panel.collapsible"
        class="s-splitter__panel"
      >
        <slot :name="slotName(index)" />
      </SplitterPanel>
    </template>
  </SplitterGroup>
</template>

<style src="./SSplitter.scss" lang="scss"></style>
