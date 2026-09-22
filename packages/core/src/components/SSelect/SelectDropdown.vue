<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import SelectTags from './SelectTags.vue'
import { useMessages } from '../../composables'
import type { SSelectOption } from './types'

/**
 * Internal `SSelect` branch without search: Reka Select (a trigger + a dropdown listbox).
 * Not public; used only from `SSelect.vue`.
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
  multiple?: boolean
  useTags?: boolean
  square?: boolean
  contentStyle?: Record<string, string>
  /** Fallthrough attributes of `SSelect` without class/style. */
  controlAttrs?: Record<string, unknown>
}>()

const slots = defineSlots<{
  prepend?: (props: Record<string, never>) => unknown
  append?: (props: Record<string, never>) => unknown
}>()

const model = defineModel<string | string[]>()
const m = useMessages()

const isMultiple = computed(() => props.multiple || props.useTags)
const valueArray = computed<string[]>(() => (Array.isArray(model.value) ? model.value : []))

/**
 * An empty string means "nothing selected": otherwise the floating label floats above an empty
 * control and the clear button offers to clear nothing.
 */
const hasValue = computed(() =>
  isMultiple.value ? valueArray.value.length > 0 : Boolean(model.value),
)
const showClear = computed(() => props.clearable && !props.disabled && hasValue.value)

const hasLeading = computed(() => !!props.icon || !!slots.prepend)

/**
 * The popup anchor is the whole frame, not the narrow trigger: Reka takes the popup width and
 * position from PopperAnchor.reference.
 */
const control = ref<HTMLElement>()

const trigger = ref<{ $el: HTMLElement }>()

const clear = () => {
  model.value = isMultiple.value ? [] : undefined
  trigger.value?.$el.focus()
}
const removeValue = (v: string) => {
  model.value = valueArray.value.filter((x) => x !== v)
}
</script>

<template>
  <SelectRoot
    v-slot="{ open }"
    v-model="model"
    :multiple="isMultiple"
    :disabled="disabled"
    :required="required"
  >
    <div
      ref="control"
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
      <SelectTrigger
        v-bind="controlAttrs"
        :id="fieldId"
        ref="trigger"
        class="s-select__trigger"
        :reference="control"
        :aria-label="ariaLabel"
        :aria-labelledby="floating ? labelId : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
      >
        <span
          v-if="useTags"
          class="s-select__placeholder"
        >
          {{ valueArray.length ? '' : placeholder }}
        </span>
        <SelectValue
          v-else-if="multiple"
          v-slot="{ selectedLabel }"
          :placeholder="placeholder"
        >
          <template v-if="(selectedLabel as string[])?.length">
            {{ (selectedLabel as string[]).join(', ') }}
          </template>
          <span
            v-else
            class="s-select__placeholder"
            >{{ placeholder }}</span
          >
        </SelectValue>
        <SelectValue
          v-else
          :placeholder="floating ? '' : placeholder"
        />
      </SelectTrigger>
      <!-- Floating label: a direct child of the frame, floats up on focus/fill.
           The trigger is a button (it cannot be linked via <label for>), so the name is
           carried by id + aria-labelledby on SelectTrigger. -->
      <label
        v-if="floating"
        :id="labelId"
        class="s-select__label"
      >
        {{ label }}
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
      <!-- The chevron is decorative (rightmost): Reka SelectIcon must live inside
           SelectTrigger, but the chevron has to come after append; the trigger itself opens
           the list. -->
      <SIcon
        class="s-select__icon"
        :class="{ 's-select__icon--open': open }"
        :icon="dropdownIcon"
        :size="16"
        aria-hidden="true"
      />
    </div>

    <SelectPortal>
      <!-- body-lock is off: by default (bodyLock=true) Reka Select locks body scroll and
           compensates for the scrollbar with padding, which shifts the layout like a modal.
           Popover/Combobox/DropdownMenu do not lock body; Select is aligned with them. -->
      <SelectContent
        class="s-select__content"
        :class="{ 's-select__content--square': square }"
        :style="contentStyle"
        position="popper"
        :side-offset="4"
        :body-lock="false"
      >
        <SelectViewport class="s-select__viewport">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="s-select__item"
            :value="option.value"
            :disabled="option.disabled"
          >
            <SelectItemIndicator
              class="s-select__indicator"
              aria-hidden="true"
              >✓</SelectItemIndicator
            >
            <SIcon
              v-if="option.icon"
              class="s-select__item-icon"
              :icon="option.icon"
              :size="16"
            />
            <SelectItemText>{{ option.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
