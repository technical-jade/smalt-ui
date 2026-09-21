<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import { useDefaults, useElevationProp } from '../../composables'
import type { SDropdownMenuOption, SDropdownMenuProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SDropdownMenuProps>(), {
  side: 'bottom',
  align: 'start',
  sideOffset: 8,
  modal: false,
})
const p = useDefaults(props, 'SDropdownMenu')

const elevationStyle = useElevationProp(p, 's-surface')

/** Whether the menu is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  /** A menu item was selected; receives the item's `value`. */
  select: [value: string]
}>()

defineSlots<{
  /** Trigger element that opens the menu on click. */
  trigger?: (props: Record<string, never>) => unknown
  /** Custom menu content (instead of the `items` prop). */
  default?: (props: Record<string, never>) => unknown
}>()

function onItemSelect(opt: SDropdownMenuOption) {
  if (opt.value !== undefined) emit('select', opt.value)
}
</script>

<template>
  <DropdownMenuRoot
    v-model:open="open"
    :modal="p.modal"
  >
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        v-bind="$attrs"
        class="s-dropdown-menu__content"
        :class="{ 's-dropdown-menu__content--square': p.square }"
        :style="elevationStyle"
        :side="p.side"
        :align="p.align"
        :side-offset="p.sideOffset"
        :aria-label="p.ariaLabel"
      >
        <slot>
          <template
            v-for="(opt, i) in p.items"
            :key="i"
          >
            <DropdownMenuSeparator
              v-if="opt.type === 'separator'"
              class="s-dropdown-menu__separator"
            />
            <DropdownMenuLabel
              v-else-if="opt.type === 'label'"
              class="s-dropdown-menu__label"
            >
              {{ opt.label }}
            </DropdownMenuLabel>
            <DropdownMenuItem
              v-else
              class="s-dropdown-menu__item"
              :class="{ 's-dropdown-menu__item--danger': opt.danger }"
              :disabled="opt.disabled"
              @select="onItemSelect(opt)"
            >
              <SIcon
                v-if="opt.icon"
                :icon="opt.icon"
                class="s-dropdown-menu__icon"
                :size="16"
              />
              {{ opt.label }}
            </DropdownMenuItem>
          </template>
        </slot>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style src="./SDropdownMenu.scss" lang="scss"></style>
