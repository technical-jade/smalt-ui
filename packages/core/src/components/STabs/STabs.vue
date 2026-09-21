<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults } from '../../composables'
import type { STabsProps } from './types'

const props = withDefaults(defineProps<STabsProps>(), {
  orientation: 'horizontal',
  activationMode: 'automatic',
  unmountOnHide: true,
})
const p = useDefaults(props, 'STabs')

const colorStyle = useColorProp(p, 's-tabs')

defineSlots<{
  /**
   * Tab content: the slot name matches the `value` of its item
   * (`<template #overview>` for `{ value: 'overview' }`).
   */
  [value: string]: (props: Record<string, never>) => unknown
}>()

/** Value of the active tab. Two-way binding via `v-model`. */
const model = defineModel<string>()

/**
 * Keyboard focus scrolls a tab into view by itself, a value set from outside does not. Only the
 * list scrolls: scrollIntoView would also move the page.
 */
const list = useTemplateRef<{ $el: HTMLElement }>('list')
watch(
  [model, list],
  () => {
    const el = list.value?.$el
    const active = el?.querySelector<HTMLElement>('[data-state="active"]')
    if (!el || !active || p.orientation !== 'horizontal') return
    const box = el.getBoundingClientRect()
    const tab = active.getBoundingClientRect()
    if (tab.left < box.left) el.scrollLeft -= box.left - tab.left
    else if (tab.right > box.right) el.scrollLeft += tab.right - box.right
  },
  { flush: 'post' },
)
</script>

<template>
  <TabsRoot
    v-model="model"
    class="s-tabs"
    :class="`s-tabs--${p.orientation}`"
    :style="colorStyle"
    :orientation="p.orientation"
    :activation-mode="p.activationMode"
    :unmount-on-hide="p.unmountOnHide"
  >
    <TabsList
      ref="list"
      class="s-tabs__list"
      :aria-label="p.ariaLabel"
    >
      <TabsTrigger
        v-for="item in p.items"
        :key="item.value"
        class="s-tabs__trigger"
        :value="item.value"
        :disabled="item.disabled"
      >
        <SIcon
          v-if="item.icon"
          :icon="item.icon"
          :size="16"
        />
        {{ item.label }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="item in p.items"
      :key="item.value"
      class="s-tabs__content"
      :value="item.value"
    >
      <slot :name="item.value" />
    </TabsContent>
  </TabsRoot>
</template>

<style src="./STabs.scss" lang="scss"></style>
