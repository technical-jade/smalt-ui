<script setup lang="ts">
import {
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import { useDefaults, useElevationProp } from '../../composables'
import type { SMenubarOption, SMenubarProps } from './types'

const props = defineProps<SMenubarProps>()
const p = useDefaults(props, 'SMenubar')

const elevationStyle = useElevationProp(p, 's-surface')

const emit = defineEmits<{
  /** A menu item was selected; receives its `value`. Items without `value` emit nothing. */
  select: [value: string]
}>()

function onItemSelect(opt: SMenubarOption) {
  if (opt.value !== undefined) emit('select', opt.value)
}
</script>

<template>
  <MenubarRoot
    class="s-menubar"
    :class="{ 's-menubar--square': p.square }"
    :aria-label="p.ariaLabel"
  >
    <MenubarMenu
      v-for="(menu, mi) in p.menus"
      :key="mi"
    >
      <MenubarTrigger
        class="s-menubar__trigger"
        :disabled="menu.disabled"
      >
        {{ menu.label }}
      </MenubarTrigger>

      <MenubarPortal>
        <MenubarContent
          class="s-menubar__content"
          :class="{ 's-menubar__content--square': p.square }"
          :style="elevationStyle"
          align="start"
          :side-offset="6"
        >
          <template
            v-for="(opt, i) in menu.items"
            :key="i"
          >
            <MenubarSeparator
              v-if="opt.type === 'separator'"
              class="s-menubar__separator"
            />
            <MenubarLabel
              v-else-if="opt.type === 'label'"
              class="s-menubar__label"
            >
              {{ opt.label }}
            </MenubarLabel>
            <MenubarItem
              v-else
              class="s-menubar__item"
              :class="{ 's-menubar__item--danger': opt.danger }"
              :disabled="opt.disabled"
              @select="onItemSelect(opt)"
            >
              <SIcon
                v-if="opt.icon"
                :icon="opt.icon"
                class="s-menubar__icon"
                :size="16"
              />
              {{ opt.label }}
            </MenubarItem>
          </template>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>

<style src="./SMenubar.scss" lang="scss"></style>
