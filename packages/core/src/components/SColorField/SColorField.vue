<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { ColorFieldRoot, ColorFieldInput } from 'reka-ui'
import { SFormField } from '../SFormField'
import ColorFieldEmptyText from './ColorFieldEmptyText'
import { useDefaults } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import type { SColorFieldProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SColorFieldProps>(), {
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  floatingLabel: true,
})
const p = useDefaults(props, 'SColorField')

const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

defineSlots<{
  /** Content at the start of the field, inside the border (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the border (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/** Color value in hex (e.g. `#3B82F6`). Two-way binding via `v-model`. */
const model = defineModel<string>()

/**
 * Reka ColorFieldRoot crashes on an empty string (`parseColor('')`) because it substitutes
 * defaultValue only for `null`/`undefined` (`modelValue ?? '#000000'`). An empty/falsy value is
 * passed as `undefined`, so Reka uses its defaultValue and does not throw; externally the model
 * stays a string (empty when there is no color).
 */
const colorModel = computed<string | undefined>({
  get: () => model.value || undefined,
  set: (v) => {
    model.value = v ?? ''
  },
})

const floating = computed(() => p.floatingLabel && !!p.label)

const editing = ref(false)

// Reka restores the last color when the text is erased; erased text means "no color" here.
function onBlur(event: FocusEvent) {
  editing.value = false
  if (!(event.target as HTMLInputElement).value.trim()) model.value = ''
}

const root = useTemplateRef<ComponentPublicInstance>('root')

// Native validation focuses the hidden input on submit; the user needs the visible one.
function focusInput() {
  const el = root.value?.$el as HTMLElement | undefined
  el?.querySelector<HTMLElement>('.s-color-field__input')?.focus()
}
const filled = computed(() => !!model.value)
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-color-field"
    :class="[`s-color-field--${p.size}`, rootClass]"
    :style="rootStyle"
    :label="p.label"
    :hint="p.hint"
    :error="p.error"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :floating-label="floating"
    :square="p.square"
  >
    <template
      #default="{ id: fieldId, labelId, describedBy, invalid: fieldInvalid, label: fieldLabel }"
    >
      <ColorFieldRoot
        v-model="colorModel"
        class="s-color-field__control"
        :class="{
          's-color-field__control--floating': floating,
          // The left swatch is a permanent leading adornment: it shifts the resting label right.
          's-color-field__control--has-leading': floating,
        }"
        :data-filled="filled || undefined"
        :data-invalid="fieldInvalid || undefined"
        :disabled="p.disabled"
        :readonly="p.readonly"
      >
        <span
          v-if="$slots.prepend"
          class="s-color-field__prepend"
        >
          <slot name="prepend" />
        </span>
        <span
          class="s-color-field__swatch"
          :style="{ backgroundColor: model || 'transparent' }"
          aria-hidden="true"
        />
        <ColorFieldInput
          v-bind="controlAttrs"
          :id="fieldId"
          class="s-color-field__input"
          :placeholder="p.placeholder"
          :required="p.required"
          :aria-invalid="fieldInvalid || undefined"
          :aria-describedby="describedBy"
          @focus="editing = true"
          @blur="onBlur"
        />
        <ColorFieldEmptyText
          :empty="!model"
          :editing="editing"
        />
        <label
          v-if="floating"
          :id="labelId"
          class="s-color-field__label"
          :for="fieldId"
        >
          {{ fieldLabel }}
          <span
            v-if="p.required"
            class="s-color-field__label-required"
            aria-hidden="true"
            >*</span
          >
        </label>
        <span
          v-if="$slots.append"
          class="s-color-field__append"
        >
          <slot name="append" />
        </span>
      </ColorFieldRoot>
      <!-- Reka's hidden input would submit its '#000000' default for an empty field, and
           `required` would never fail. -->
      <input
        v-if="p.name"
        class="s-color-field__native"
        tabindex="-1"
        aria-hidden="true"
        :name="p.name"
        :value="model ?? ''"
        :required="p.required"
        :disabled="p.disabled"
        @focus="focusInput"
      />
    </template>
  </SFormField>
</template>

<style src="./SColorField.scss" lang="scss"></style>
