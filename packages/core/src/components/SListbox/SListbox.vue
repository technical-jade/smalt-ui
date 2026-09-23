<script setup lang="ts">
import { computed } from 'vue'
import { ListboxContent, ListboxItem, ListboxItemIndicator, ListboxRoot } from 'reka-ui'
import { SIcon } from '../SIcon'
import { SScrollArea } from '../SScrollArea'
import { useDefaults, useMessages } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import type { SListboxOption, SListboxProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SListboxProps>(), {
  size: 'md',
  multiple: false,
  selectionBehavior: 'toggle',
  square: false,
  disabled: false,
})
const p = useDefaults(props, 'SListbox')

/**
 * Reka puts `role="listbox"` on ListboxContent, not on the root, so consumer attributes have to
 * reach the content: `aria-labelledby`, `aria-describedby` and an id belong on the element that
 * carries the role.
 */
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

const m = useMessages()

defineSlots<{
  /** Option row: replaces the icon, the label and the selected indicator. */
  option?: (props: { option: SListboxOption; selected: boolean; disabled: boolean }) => unknown
  /** Message shown when there are no options. */
  empty?: (props: Record<string, never>) => unknown
}>()

/**
 * Selection: the option `value` (`string`), or an array of them with `multiple` (`string[]`).
 * Two-way binding via `v-model`.
 */
const model = defineModel<string | string[]>()

const selectedValues = computed(() => {
  if (Array.isArray(model.value)) return model.value
  return model.value == null ? [] : [model.value]
})

const isSelected = (value: string) => selectedValues.value.includes(value)
</script>

<template>
  <ListboxRoot
    v-model="model"
    class="s-listbox"
    :class="[rootClass, `s-listbox--${p.size}`, { 's-listbox--square': p.square }]"
    :style="rootStyle"
    :multiple="p.multiple"
    :selection-behavior="p.selectionBehavior"
    :disabled="p.disabled"
  >
    <SScrollArea
      class="s-listbox__scroll"
      :max-height="p.maxHeight"
    >
      <ListboxContent
        class="s-listbox__content"
        :aria-label="p.label"
        v-bind="controlAttrs"
      >
        <ListboxItem
          v-for="option in p.options"
          :key="option.value"
          class="s-listbox__item"
          :value="option.value"
          :disabled="option.disabled"
        >
          <slot
            name="option"
            :option="option"
            :selected="isSelected(option.value)"
            :disabled="Boolean(option.disabled) || p.disabled"
          >
            <SIcon
              v-if="option.icon"
              class="s-listbox__item-icon"
              :icon="option.icon"
              :size="16"
            />
            <span class="s-listbox__label">{{ option.label }}</span>
            <ListboxItemIndicator
              class="s-listbox__indicator"
              as="span"
            >
              <SIcon
                icon="check"
                :size="16"
              />
            </ListboxItemIndicator>
          </slot>
        </ListboxItem>
      </ListboxContent>

      <!-- The message is a sibling of the list, not a row inside it: role="listbox" owns
           options, and a plain div among them is an invalid child. -->
      <div
        v-if="!p.options.length"
        class="s-listbox__empty"
      >
        <slot name="empty">{{ p.emptyText ?? m.listboxEmpty }}</slot>
      </div>
    </SScrollArea>
  </ListboxRoot>
</template>

<style src="./SListbox.scss" lang="scss"></style>
