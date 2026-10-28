<script setup lang="ts">
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from 'reka-ui'
import { computed } from 'vue'
import { SIcon } from '../SIcon'
import { useDefaults, useElevationProp } from '../../composables'
import type { SNavigationMenuProps } from './types'

const props = withDefaults(defineProps<SNavigationMenuProps>(), {
  size: 'md',
  align: 'start',
})
const p = useDefaults(props, 'SNavigationMenu')

const elevationStyle = useElevationProp(p, 's-surface')

const columnsStyle = computed(() =>
  p.columns == null ? undefined : { '--s-navigation-menu-columns': String(p.columns) },
)
</script>

<template>
  <NavigationMenuRoot
    class="s-navigation-menu"
    :class="`s-navigation-menu--${p.size}`"
    :style="columnsStyle"
    :aria-label="p.ariaLabel"
  >
    <NavigationMenuList class="s-navigation-menu__list">
      <NavigationMenuItem
        v-for="(item, i) in p.items"
        :key="i"
      >
        <template v-if="item.links">
          <NavigationMenuTrigger class="s-navigation-menu__trigger">
            {{ item.label }}
            <SIcon
              class="s-navigation-menu__chevron"
              icon="chevron-down"
              :size="16"
            />
          </NavigationMenuTrigger>
          <NavigationMenuContent class="s-navigation-menu__content">
            <div
              class="s-navigation-menu__panel"
              role="list"
            >
              <div
                v-for="(link, li) in item.links"
                :key="li"
                role="listitem"
              >
                <NavigationMenuLink
                  :href="link.href"
                  :target="link.target"
                  :rel="link.rel"
                  class="s-navigation-menu__link"
                >
                  <span class="s-navigation-menu__link-title">{{ link.label }}</span>
                  <span
                    v-if="link.description"
                    class="s-navigation-menu__link-desc"
                  >
                    {{ link.description }}
                  </span>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </template>
        <NavigationMenuLink
          v-else
          :href="item.href"
          :target="item.target"
          :rel="item.rel"
          class="s-navigation-menu__top-link"
        >
          {{ item.label }}
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>

    <div class="s-navigation-menu__viewport-wrap">
      <NavigationMenuViewport
        class="s-navigation-menu__viewport"
        :class="{ 's-navigation-menu__viewport--square': p.square }"
        :align="p.align"
        :style="elevationStyle"
      />
    </div>
  </NavigationMenuRoot>
</template>

<style src="./SNavigationMenu.scss" lang="scss"></style>
