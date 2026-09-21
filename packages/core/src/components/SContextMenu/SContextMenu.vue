<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import { useDefaults, useElevationProp } from '../../composables'
import type { SContextMenuOption, SContextMenuProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SContextMenuProps>(), {
  modal: false,
})
const p = useDefaults(props, 'SContextMenu')

const elevationStyle = useElevationProp(p, 's-surface')

const emit = defineEmits<{
  /** A menu item was selected; receives the item's `value`. */
  select: [value: string]
}>()

defineSlots<{
  /** Area that opens the menu on right-click. */
  default?: (props: Record<string, never>) => unknown
  /** Custom menu content (instead of the `items` prop). */
  menu?: (props: Record<string, never>) => unknown
}>()

function onItemSelect(opt: SContextMenuOption) {
  if (opt.value !== undefined) emit('select', opt.value)
}
</script>

<template>
  <ContextMenuRoot :modal="p.modal">
    <ContextMenuTrigger as-child>
      <slot />
    </ContextMenuTrigger>

    <ContextMenuPortal>
      <ContextMenuContent
        v-bind="$attrs"
        class="s-context-menu__content"
        :class="{ 's-context-menu__content--square': p.square }"
        :style="elevationStyle"
        :aria-label="p.ariaLabel"
      >
        <slot name="menu">
          <template
            v-for="(opt, i) in p.items"
            :key="i"
          >
            <ContextMenuSeparator
              v-if="opt.type === 'separator'"
              class="s-context-menu__separator"
            />
            <ContextMenuLabel
              v-else-if="opt.type === 'label'"
              class="s-context-menu__label"
            >
              {{ opt.label }}
            </ContextMenuLabel>
            <ContextMenuItem
              v-else
              class="s-context-menu__item"
              :class="{ 's-context-menu__item--danger': opt.danger }"
              :disabled="opt.disabled"
              @select="onItemSelect(opt)"
            >
              <SIcon
                v-if="opt.icon"
                :icon="opt.icon"
                class="s-context-menu__icon"
                :size="16"
              />
              {{ opt.label }}
            </ContextMenuItem>
          </template>
        </slot>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<style src="./SContextMenu.scss" lang="scss"></style>
