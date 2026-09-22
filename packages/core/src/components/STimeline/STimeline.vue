<script setup lang="ts">
import { computed } from 'vue'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults } from '../../composables'
import type { STimelineItem, STimelineProps, STimelineSize, STimelineSlotProps } from './types'

const props = withDefaults(defineProps<STimelineProps>(), {
  orientation: 'vertical',
  size: 'md',
})
const p = useDefaults(props, 'STimeline')

const colorStyle = useColorProp(p, 's-timeline')

/**
 * Current item: the value of `item.value`, or the index for items without one. Without a value
 * nothing is completed and the timeline is a plain feed.
 */
const model = defineModel<string | number | undefined>()

defineSlots<{
  /** Indicator content: replaces the dot, the item icon and the completed check mark. */
  indicator?: (props: STimelineSlotProps) => unknown
  /** Item title (alternative to `item.title`). */
  title?: (props: STimelineSlotProps) => unknown
  /** Item description (alternative to `item.description`). */
  description?: (props: STimelineSlotProps) => unknown
  /** Item date (alternative to `item.date`). */
  date?: (props: STimelineSlotProps) => unknown
}>()

const ICON_SIZES: Record<STimelineSize, number> = { sm: 12, md: 14, lg: 18 }

const iconSize = computed(() => ICON_SIZES[p.size])

const currentIndex = computed(() =>
  model.value === undefined
    ? -1
    : p.items.findIndex((item, index) => (item.value ?? index) === model.value),
)

const rows = computed<STimelineSlotProps[]>(() =>
  p.items.map((item, index) => ({
    item,
    index,
    active: index === currentIndex.value,
    completed: currentIndex.value >= 0 && index < currentIndex.value,
  })),
)

/**
 * The item accent goes into a variable of its own, not the one `useColorProp` writes on the
 * root: the item tints its dot in every state, while the timeline color only paints the part
 * that is already completed.
 */
function itemStyle(item: STimelineItem) {
  return item.color ? { '--s-timeline-item-c': `var(--s-${item.color})` } : undefined
}
</script>

<template>
  <div
    class="s-timeline"
    :class="[`s-timeline--${p.orientation}`, `s-timeline--${p.size}`]"
    :style="colorStyle"
    role="list"
  >
    <div
      v-for="row in rows"
      :key="row.item.value ?? row.index"
      class="s-timeline__item"
      :class="{
        's-timeline__item--active': row.active,
        's-timeline__item--completed': row.completed,
      }"
      :style="itemStyle(row.item)"
      :data-disabled="row.item.disabled || undefined"
      role="listitem"
    >
      <div class="s-timeline__indicator">
        <slot
          name="indicator"
          v-bind="row"
        >
          <SIcon
            v-if="row.item.icon"
            :icon="row.item.icon"
            :size="iconSize"
          />
          <SIcon
            v-else-if="row.completed"
            icon="check"
            :size="iconSize"
          />
        </slot>
      </div>

      <div
        v-if="row.index < rows.length - 1"
        class="s-timeline__line"
      />

      <div class="s-timeline__content">
        <div
          v-if="row.item.date || $slots.date"
          class="s-timeline__date"
        >
          <slot
            name="date"
            v-bind="row"
            >{{ row.item.date }}</slot
          >
        </div>
        <div
          v-if="row.item.title || $slots.title"
          class="s-timeline__title"
        >
          <slot
            name="title"
            v-bind="row"
            >{{ row.item.title }}</slot
          >
        </div>
        <div
          v-if="row.item.description || $slots.description"
          class="s-timeline__description"
        >
          <slot
            name="description"
            v-bind="row"
            >{{ row.item.description }}</slot
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./STimeline.scss" lang="scss"></style>
