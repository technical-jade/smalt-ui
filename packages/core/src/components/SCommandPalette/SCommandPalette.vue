<script setup lang="ts">
import { computed, onMounted, ref, useId, watch, watchEffect } from 'vue'
import {
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
} from 'reka-ui'
import { SDialogShell } from '../../internal/SDialogShell'
import { SEmptyState } from '../SEmptyState'
import { SIcon } from '../SIcon'
import { SKbd } from '../SKbd'
import { SScrollArea } from '../SScrollArea'
import { SSpinner } from '../SSpinner'
import { useDefaults, useElevationProp, useMessages } from '../../composables'
import { filterCommandGroups } from './filter'
import { bindShortcut, isTypingTarget, matchesShortcut } from './shortcut'
import type { SCommandItem, SCommandPaletteProps } from './types'

const props = withDefaults(defineProps<SCommandPaletteProps>(), {
  filter: true,
  shortcutKey: 'k',
  loading: false,
  square: false,
})
const p = useDefaults(props, 'SCommandPalette')

const m = useMessages()

/** Whether the palette is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open')

/**
 * The query the user typed. Two-way binding via `v-model:search`: bind it to search on the
 * server and hand the result back in `groups` with `filter` off. Closing the palette clears it,
 * so the next opening starts from the full list rather than from a query nobody can see.
 */
const search = defineModel<string>('search', { default: '' })

watch(open, (value) => {
  if (!value) search.value = ''
})

const emit = defineEmits<{
  /**
   * The user ran a command with the mouse or the keyboard. The application performs it; the
   * palette only closes itself.
   */
  select: [item: SCommandItem]
}>()

defineSlots<{
  /** Row content instead of the icon, the label and the shortcut hints. */
  item?: (props: { item: SCommandItem; active: boolean }) => unknown
  /** Panel content when nothing matches the query. */
  empty?: (props: Record<string, never>) => unknown
  /** Hint row under the list, for example the keys that navigate and run a command. */
  footer?: (props: Record<string, never>) => unknown
}>()

// Empty groups are dropped either way: a heading with nothing under it is noise, and with
// server-side search the application usually sends the group before its commands arrive.
const groups = computed(() =>
  p.filter
    ? filterCommandGroups(p.groups, search.value)
    : p.groups.filter((group) => group.items.length > 0),
)
const hasItems = computed(() => groups.value.some((group) => group.items.length > 0))

const listId = useId()

/**
 * The highlighted command, for the `active` slot prop. Reka keeps the highlight on the element
 * and announces it through `aria-activedescendant`; the value is what a custom row can compare
 * itself against.
 */
const highlighted = ref<string>()
const onHighlight = (payload?: { value?: unknown }) => {
  highlighted.value = typeof payload?.value === 'string' ? payload.value : undefined
}

/**
 * Closing comes first and the event second: an application that wants the palette to stay open
 * sets `open` back in its own handler, and that decision is the last one applied — which is why
 * there is no `keepOpen` prop.
 */
function onSelect(item: SCommandItem) {
  // Reka emits `select` before it looks at `disabled`, so a click on a dimmed row reaches here.
  if (item.disabled) return
  open.value = false
  emit('select', item)
}

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

/**
 * The listener is bound after mount (the server has no document) and re-bound when the key
 * changes, which is what releases the previous one. The watcher is stopped on unmount, so the
 * cleanup below also runs there.
 */
watchEffect((onCleanup) => {
  if (!mounted.value || p.shortcutKey === false) return
  const key = p.shortcutKey
  onCleanup(
    bindShortcut((event) => {
      if (isTypingTarget(event.target) || !matchesShortcut(event, key)) return
      event.preventDefault()
      open.value = true
    }),
  )
})

const elevationStyle = useElevationProp(p, 's-command-palette')

/** A number means pixels, as width/height do in Vue bindings. */
const listMaxHeight = computed(() => {
  const value = p.maxHeight == null ? '22rem' : p.maxHeight
  const length = typeof value === 'number' ? `${value}px` : value
  // The window has the final word: a tall list would otherwise push the panel off the screen.
  return `min(${length}, 60vh)`
})
</script>

<template>
  <SDialogShell
    v-model:open="open"
    name="command-palette"
    :label="m.searchCommands"
    :square="p.square"
    :style="elevationStyle"
  >
    <ListboxRoot
      class="s-command-palette__listbox"
      highlight-on-hover
      @highlight="onHighlight"
    >
      <div class="s-command-palette__search">
        <SIcon
          class="s-command-palette__search-icon"
          icon="search"
          :size="18"
        />
        <!-- ListboxFilter owns the keyboard: it forwards the arrows, Home/End and Enter to the
             list and publishes the highlighted row as aria-activedescendant. The combobox role
             and aria-controls are ours — Reka leaves the pairing to the markup around it. -->
        <ListboxFilter
          v-model="search"
          class="s-command-palette__input"
          auto-focus
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          :aria-controls="listId"
          :aria-label="p.placeholder ?? m.searchCommands"
          :placeholder="p.placeholder ?? m.searchCommands"
        />
        <SSpinner
          v-if="p.loading"
          class="s-command-palette__spinner"
          size="sm"
          :label="m.loading"
        />
      </div>

      <SScrollArea
        class="s-command-palette__list"
        :max-height="listMaxHeight"
      >
        <ListboxContent
          :id="listId"
          class="s-command-palette__options"
        >
          <!-- A group without a heading is a plain wrapper: ListboxGroup always points
               aria-labelledby at a label element, which would then not exist. -->
          <component
            :is="group.label ? ListboxGroup : 'div'"
            v-for="(group, index) in groups"
            :key="group.label ?? index"
            class="s-command-palette__group"
          >
            <ListboxGroupLabel
              v-if="group.label"
              class="s-command-palette__group-label"
            >
              {{ group.label }}
            </ListboxGroupLabel>

            <ListboxItem
              v-for="item in group.items"
              :key="item.id"
              class="s-command-palette__item"
              :value="item.id"
              :disabled="item.disabled"
              @select="onSelect(item)"
            >
              <slot
                name="item"
                :item="item"
                :active="item.id === highlighted"
              >
                <SIcon
                  v-if="item.icon"
                  class="s-command-palette__item-icon"
                  :icon="item.icon"
                  :size="16"
                />
                <span class="s-command-palette__item-text">
                  <span class="s-command-palette__item-label">{{ item.label }}</span>
                  <span
                    v-if="item.description"
                    class="s-command-palette__item-description"
                    >{{ item.description }}</span
                  >
                </span>
                <span
                  v-if="item.shortcut?.length"
                  class="s-command-palette__item-shortcut"
                >
                  <SKbd
                    v-for="key in item.shortcut"
                    :key="key"
                    :value="key"
                    size="sm"
                  />
                </span>
              </slot>
            </ListboxItem>
          </component>
        </ListboxContent>

        <!-- Sibling of the list, not a row inside it: role="listbox" owns options, and a plain
             div among them is an invalid child. -->
        <div
          v-if="!hasItems"
          class="s-command-palette__empty"
        >
          <div
            v-if="p.loading"
            class="s-command-palette__status"
          >
            <SSpinner size="sm" />
            {{ m.loading }}
          </div>
          <slot
            v-else
            name="empty"
          >
            <SEmptyState
              size="sm"
              icon="search"
              :title="p.emptyText ?? m.selectEmpty"
            />
          </slot>
        </div>
      </SScrollArea>
    </ListboxRoot>

    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </SDialogShell>
</template>

<style src="./SCommandPalette.scss" lang="scss"></style>
