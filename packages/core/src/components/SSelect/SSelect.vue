<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { SFormField } from '../SFormField'
import SelectCombobox from './SelectCombobox.vue'
import SelectDropdown from './SelectDropdown.vue'
import { useDefaults, useElevationProp } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import type { SSelectProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SSelectProps>(), {
  size: 'md',
  required: false,
  invalid: false,
  clearable: false,
  searchable: false,
  multiple: false,
  useTags: false,
  floatingLabel: true,
  dropdownIcon: 'chevron-down',
  clearIcon: 'x',
  /**
   * Vue casts an unset prop with Boolean in its type to `false`, which would make "default"
   * indistinguishable from an explicit opt-out. An explicit `undefined` keeps the third
   * state: "decide for me".
   */
  virtualize: undefined,
})
const p = useDefaults(props, 'SSelect')

const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

const emit = defineEmits<{
  /** Focus entered the field. Moving into the open list does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Moving into the open list does not count. */
  blur: [event: FocusEvent]
}>()
const root = useTemplateRef<ComponentPublicInstance>('root')

const elevationStyle = useElevationProp(p, 's-surface')

/**
 * Panel variables: the panel is teleported, so they travel with it rather than on the field
 * root. A number in maxHeight means pixels, as width/height do in Vue bindings.
 */
const contentStyle = computed(() => {
  const maxHeight =
    p.maxHeight == null
      ? undefined
      : {
          '--s-select-max-height':
            typeof p.maxHeight === 'number' ? `${p.maxHeight}px` : p.maxHeight,
        }
  if (!maxHeight && !elevationStyle.value) return undefined
  return { ...maxHeight, ...elevationStyle.value }
})

/**
 * Virtualization threshold: a long list freezes the tab not through the panel height but
 * through the number of DOM nodes. `true`/`false` is an explicit consumer choice, a number
 * is a custom threshold.
 */
const VIRTUALIZE_FROM = 100
const virtualize = computed(() => {
  if (typeof p.virtualize === 'boolean') return p.virtualize
  return p.options.length >= (p.virtualize ?? VIRTUALIZE_FROM)
})

// In tags mode the frame grows as chips wrap, so the label stays on top.
const floating = computed(() => p.floatingLabel && !!p.label && !p.useTags)

defineSlots<{
  /** Content at the start of the field, inside the frame (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the frame (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/**
 * Selection. Single: the option `value` (`string`); with `multiple`/`use-tags`: an array of
 * `value` (`string[]`). Two-way binding via `v-model`.
 */
const model = defineModel<string | string[]>()

/**
 * The form gets its own hidden select rather than Reka's: Reka assigns an array to
 * `select.value`, so `multiple` submits an empty string, and the Combobox branch would name the
 * values "tags[0]", "tags[1]". `v-model` also brings browser autofill back into the value.
 */
const isMultiple = computed(() => p.multiple || p.useTags)

// Without v-model a multiple select still holds a list: the rules see [] rather than undefined.
const {
  errorMessage,
  onBlur: onLeave,
  expose,
} = useFieldValidation(
  p,
  () => (isMultiple.value && !Array.isArray(model.value) ? [] : model.value),
  root,
)
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit, '.s-select__content', onLeave)
defineExpose(expose)

// Native validation focuses the hidden select on submit; the user needs the visible control.
function focusControl() {
  const el = root.value?.$el as HTMLElement | undefined
  el?.querySelector<HTMLElement>('.s-select__trigger, .s-select__input')?.focus()
}
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-select"
    :class="[`s-select--${p.size}`, rootClass]"
    :style="rootStyle"
    :label="p.label"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :floating-label="floating"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template
      #default="{ id: fieldId, labelId, describedBy, invalid: fieldInvalid, label: fieldLabel }"
    >
      <!-- The searchable branch lives in subcomponents (Reka Select vs Combobox); the shared
           skeleton is SFormField + the BEM frame .s-select__control (see SSelect.scss). -->
      <SelectCombobox
        v-if="p.searchable"
        v-model="model"
        :options="p.options"
        :field-id="fieldId"
        :label-id="labelId"
        :label="fieldLabel"
        :floating="floating"
        :described-by="describedBy"
        :invalid="fieldInvalid"
        :required="p.required"
        :disabled="p.disabled"
        :placeholder="p.placeholder"
        :icon="p.icon"
        :aria-label="p.ariaLabel"
        :clearable="p.clearable"
        :clear-icon="p.clearIcon"
        :clear-label="p.clearLabel"
        :dropdown-icon="p.dropdownIcon"
        :empty-text="p.emptyText"
        :show-options-label="p.showOptionsLabel"
        :multiple="p.multiple"
        :use-tags="p.useTags"
        :square="p.square"
        :content-style="contentStyle"
        :control-attrs="controlAttrs"
        :virtualize="virtualize"
        @content-focusin="onFocusIn"
      >
        <template
          v-if="$slots.prepend"
          #prepend
        >
          <slot name="prepend" />
        </template>
        <template
          v-if="$slots.append"
          #append
        >
          <slot name="append" />
        </template>
      </SelectCombobox>
      <SelectDropdown
        v-else
        v-model="model"
        :options="p.options"
        :field-id="fieldId"
        :label-id="labelId"
        :label="fieldLabel"
        :floating="floating"
        :described-by="describedBy"
        :invalid="fieldInvalid"
        :required="p.required"
        :disabled="p.disabled"
        :placeholder="p.placeholder"
        :icon="p.icon"
        :aria-label="p.ariaLabel"
        :clearable="p.clearable"
        :clear-icon="p.clearIcon"
        :clear-label="p.clearLabel"
        :dropdown-icon="p.dropdownIcon"
        :multiple="p.multiple"
        :use-tags="p.useTags"
        :square="p.square"
        :content-style="contentStyle"
        :control-attrs="controlAttrs"
        @content-focusin="onFocusIn"
      >
        <template
          v-if="$slots.prepend"
          #prepend
        >
          <slot name="prepend" />
        </template>
        <template
          v-if="$slots.append"
          #append
        >
          <slot name="append" />
        </template>
      </SelectDropdown>
      <select
        v-if="p.name"
        v-model="model"
        class="s-select__native"
        tabindex="-1"
        aria-hidden="true"
        :name="p.name"
        :multiple="isMultiple"
        :required="p.required"
        :disabled="p.disabled"
        @focus="focusControl"
      >
        <option
          v-if="!isMultiple"
          value=""
        />
        <option
          v-for="option in p.options"
          :key="option.value"
          :value="option.value"
        />
      </select>
    </template>
  </SFormField>
</template>

<style src="./SSelect.scss" lang="scss"></style>
