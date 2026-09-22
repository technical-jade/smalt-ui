<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  ComboboxVirtualizer,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import SelectTags from './SelectTags.vue'
import { useMessages } from '../../composables'
import { useKeepCaretKeys } from '../../internal/useKeepCaretKeys'
import type { SSelectOption } from './types'

/**
 * Internal `SSelect` branch with search (`searchable`): Reka Combobox (an input with
 * filtering). Not public; used only from `SSelect.vue`.
 */
const props = defineProps<{
  options: readonly SSelectOption[]
  fieldId?: string
  labelId?: string
  label?: string
  floating?: boolean
  required?: boolean
  describedBy?: string
  invalid?: boolean
  disabled?: boolean
  placeholder?: string
  icon?: string
  ariaLabel?: string
  clearable?: boolean
  clearIcon?: string
  clearLabel?: string
  dropdownIcon?: string
  emptyText?: string
  showOptionsLabel?: string
  multiple?: boolean
  useTags?: boolean
  square?: boolean
  contentStyle?: Record<string, string>
  /** Fallthrough attributes of `SSelect` without class/style. */
  controlAttrs?: Record<string, unknown>
  virtualize?: boolean
}>()

const slots = defineSlots<{
  prepend?: (props: Record<string, never>) => unknown
  append?: (props: Record<string, never>) => unknown
}>()

const model = defineModel<string | string[]>()
const m = useMessages()

const isMultiple = computed(() => props.multiple || props.useTags)
const valueArray = computed<string[]>(() => (Array.isArray(model.value) ? model.value : []))

const label = (v: string) => props.options?.find((o) => o.value === v)?.label ?? v
// Single mode: the field shows the selected option's label, not its value.
const displayValue = (val: string) => (val ? label(val) : '')
const commaText = computed(() => valueArray.value.map(label).join(', '))

// An empty string means "nothing selected" (see SelectDropdown).
const hasValue = computed(() =>
  isMultiple.value ? valueArray.value.length > 0 : Boolean(model.value),
)
const showClear = computed(() => props.clearable && !props.disabled && hasValue.value)

const hasLeading = computed(() => !!props.icon || !!slots.prepend)

const anchor = ref<{ $el: Element }>()
useKeepCaretKeys(anchor)

const input = ref<{ $el: HTMLInputElement }>()

const clear = () => {
  model.value = isMultiple.value ? [] : undefined
  input.value?.$el.focus()
}
const removeValue = (v: string) => {
  model.value = valueArray.value.filter((x) => x !== v)
}
</script>

<template>
  <ComboboxRoot
    v-model="model"
    :multiple="isMultiple"
    :disabled="disabled"
  >
    <ComboboxAnchor
      ref="anchor"
      class="s-select__control"
      :class="{
        's-select__control--invalid': invalid,
        's-select__control--disabled': disabled,
        's-select__control--tags': useTags,
        's-select__control--floating': floating,
        's-select__control--has-leading': floating && hasLeading,
      }"
      :data-filled="hasValue || undefined"
      :data-invalid="invalid || undefined"
    >
      <span
        v-if="$slots.prepend"
        class="s-select__prepend"
      >
        <slot name="prepend" />
      </span>
      <SIcon
        v-if="icon"
        class="s-select__leading"
        :icon="icon"
        :size="16"
      />
      <SelectTags
        v-if="useTags"
        :options="options"
        :values="valueArray"
        :disabled="disabled"
        @remove="removeValue"
      />
      <span
        v-else-if="multiple && commaText"
        class="s-select__comma"
        >{{ commaText }}</span
      >
      <ComboboxInput
        v-bind="controlAttrs"
        :id="fieldId"
        ref="input"
        class="s-select__input"
        :placeholder="placeholder"
        :display-value="isMultiple ? undefined : displayValue"
        :aria-label="ariaLabel"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
        :aria-required="required || undefined"
      />
      <!-- Floating label: a direct child of the frame, floats up on focus/fill.
           ComboboxInput is a native input, so the name is linked via <label for>. -->
      <label
        v-if="floating"
        :id="labelId"
        class="s-select__label"
        :for="fieldId"
      >
        {{ props.label }}
        <span
          v-if="required"
          class="s-select__label-required"
          aria-hidden="true"
          >*</span
        >
      </label>
      <button
        v-if="showClear"
        type="button"
        class="s-select__clear"
        :aria-label="clearLabel ?? m.clear"
        @click="clear"
      >
        <SIcon
          :icon="clearIcon"
          :size="16"
        />
      </button>
      <span
        v-if="$slots.append"
        class="s-select__append"
      >
        <slot name="append" />
      </span>
      <ComboboxTrigger
        class="s-select__toggle"
        :aria-label="showOptionsLabel ?? m.showOptions"
      >
        <SIcon
          class="s-select__icon"
          :icon="dropdownIcon"
          :size="16"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        class="s-select__content"
        :class="{ 's-select__content--square': square }"
        :style="contentStyle"
        position="popper"
        :side-offset="4"
      >
        <ComboboxViewport class="s-select__viewport">
          <ComboboxEmpty class="s-select__empty">{{ emptyText ?? m.selectEmpty }}</ComboboxEmpty>
          <!-- Virtualization keeps only visible rows in the DOM: a plain v-for over a thousand
               options creates every node at once, and opening the list freezes the tab. -->
          <!-- Reka declares options as mutable although it only reads the list, hence the cast. -->
          <ComboboxVirtualizer
            v-if="virtualize"
            v-slot="{ option }"
            :options="options as SSelectOption[]"
            :estimate-size="40"
            :text-content="(o: SSelectOption) => o.label"
          >
            <ComboboxItem
              class="s-select__item"
              :value="option.value"
              :disabled="option.disabled"
            >
              <ComboboxItemIndicator
                class="s-select__indicator"
                aria-hidden="true"
                >✓</ComboboxItemIndicator
              >
              <SIcon
                v-if="option.icon"
                class="s-select__item-icon"
                :icon="option.icon"
                :size="16"
              />
              {{ option.label }}
            </ComboboxItem>
          </ComboboxVirtualizer>
          <ComboboxItem
            v-for="option in virtualize ? [] : options"
            :key="option.value"
            class="s-select__item"
            :value="option.value"
            :disabled="option.disabled"
          >
            <ComboboxItemIndicator
              class="s-select__indicator"
              aria-hidden="true"
              >✓</ComboboxItemIndicator
            >
            <SIcon
              v-if="option.icon"
              class="s-select__item-icon"
              :icon="option.icon"
              :size="16"
            />
            {{ option.label }}
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
