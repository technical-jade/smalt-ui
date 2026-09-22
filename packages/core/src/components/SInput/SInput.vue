<script setup lang="ts">
import { computed, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { SFormField } from '../SFormField'
import InputText from './InputText.vue'
import InputTags from './InputTags.vue'
import { useDefaults } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import type { SInputNumeric, SInputProps } from './types'

/**
 * The component root is `SFormField`, with the field inside it. If the root inherited attributes,
 * `maxlength`/`autocomplete` and an `@blur` handler would land on the outer `div`: blur does not
 * bubble, so such a handler would silently never fire.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SInputProps>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  required: false,
  invalid: false,
  floatingLabel: true,
  clearable: false,
  clearIcon: 'x',
  unmaskedValue: false,
  useTags: false,
  duplicate: false,
  addOnPaste: true,
  removeIcon: 'x',
})
const p = useDefaults(props, 'SInput')

const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

/**
 * `numeric` accepts both `true` and an options object from outside; internally it is always an
 * object. `type="number"` means the same intent: a native number input returns an empty string
 * on intermediate invalid input and loses what was typed, so it never reaches the DOM.
 */
const numeric = computed<SInputNumeric | undefined>(() => {
  if (p.numeric === true) return {}
  if (p.numeric) return p.numeric
  return p.type === 'number' ? { decimals: 2 } : undefined
})
const fieldType = computed(() => (numeric.value ? 'text' : p.type))

// A floating label does not apply in tags mode: the frame grows in height with the chips.
const floating = computed(() => p.floatingLabel && !p.useTags)

defineSlots<{
  /** Content at the start of the field, inside the border (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the border (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/**
 * Field value: `string` in regular mode, `string[]` (the tag list) with `use-tags`. Two-way bound
 * via `v-model`.
 */
const model = defineModel<string | string[]>()

const root = useTemplateRef<ComponentPublicInstance>('root')
const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => model.value, root)
const { onFocusIn, onFocusOut } = useFieldFocus(root, () => {}, undefined, onLeave)
defineExpose(expose)

/**
 * Adapters for the two branches: only one of them is mounted (v-if), so a single union `model`
 * is safely proxied to string or string[].
 */
const text = computed<string>({
  get: () => (typeof model.value === 'string' ? model.value : ''),
  set: (v) => {
    model.value = v
  },
})
const tags = computed<string[]>({
  get: () => (Array.isArray(model.value) ? model.value : []),
  set: (v) => {
    model.value = v
  },
})
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-input"
    :class="[`s-input--${p.size}`, rootClass]"
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
      #default="{
        id: fieldId,
        labelId: fieldLabelId,
        describedBy,
        invalid: fieldInvalid,
        label: fieldLabel,
        floatingLabel: fieldFloating,
      }"
    >
      <InputTags
        v-if="p.useTags"
        v-model="tags"
        :field-id="fieldId"
        :described-by="describedBy"
        :invalid="fieldInvalid"
        :disabled="p.disabled"
        :placeholder="p.placeholder"
        :required="p.required"
        :icon="p.icon"
        :duplicate="p.duplicate"
        :add-on-paste="p.addOnPaste"
        :max="p.max"
        :remove-icon="p.removeIcon"
        :remove-tag-label="p.removeTagLabel"
        v-bind="controlAttrs"
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
      </InputTags>
      <InputText
        v-else
        v-model="text"
        :field-id="fieldId"
        :label-id="fieldLabelId"
        :label="fieldLabel"
        :floating-label="fieldFloating"
        :described-by="describedBy"
        :invalid="fieldInvalid"
        :type="fieldType"
        :placeholder="p.placeholder"
        :disabled="p.disabled"
        :required="p.required"
        :readonly="p.readonly"
        :prefix="p.prefix"
        :suffix="p.suffix"
        :icon="p.icon"
        :icon-right="p.iconRight"
        :clearable="p.clearable"
        :clear-icon="p.clearIcon"
        :clear-label="p.clearLabel"
        :mask="p.mask"
        :unmasked-value="p.unmaskedValue"
        :fill-mask="p.fillMask"
        :numeric="numeric"
        v-bind="controlAttrs"
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
      </InputText>
    </template>
  </SFormField>
</template>

<style src="./SInput.scss" lang="scss"></style>
