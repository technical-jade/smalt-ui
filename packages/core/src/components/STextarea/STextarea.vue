<script setup lang="ts">
import { computed } from 'vue'
import { SFormField } from '../SFormField'
import { useDefaults } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import type { STextareaProps } from './types'

/**
 * The component root is `SFormField`, with the field inside it. If the root inherited attributes,
 * `maxlength` and an `@blur` handler would land on the outer `div`: blur does not bubble, so such
 * a handler would silently never fire.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<STextareaProps>(), {
  size: 'md',
  disabled: false,
  required: false,
  invalid: false,
  floatingLabel: true,
  rows: 3,
})
const p = useDefaults(props, 'STextarea')

const slots = defineSlots<{
  /** Content at the start of the field, inside the border (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the border (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/** Field value. Two-way bound via `v-model`. */
const model = defineModel<string>()

const { rootClass, rootStyle, controlAttrs: fieldAttrs } = useFieldAttrs()

const floating = computed(() => p.floatingLabel && !!p.label)
const filled = computed(() => !!model.value)
const hasLeading = computed(() => !!slots.prepend)
</script>

<template>
  <SFormField
    :id="p.id"
    class="s-textarea"
    :class="[`s-textarea--${p.size}`, rootClass]"
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
      <div
        class="s-textarea__wrap"
        :class="{
          's-textarea__wrap--invalid': fieldInvalid,
          's-textarea__wrap--disabled': p.disabled,
          's-textarea__wrap--floating': floating,
          's-textarea__wrap--has-leading': floating && hasLeading,
          's-textarea__wrap--has-append': !!$slots.append,
        }"
        :data-filled="filled || undefined"
        :data-invalid="fieldInvalid || undefined"
      >
        <span
          v-if="$slots.prepend"
          class="s-textarea__prepend"
        >
          <slot name="prepend" />
        </span>
        <textarea
          v-bind="fieldAttrs"
          :id="fieldId"
          v-model="model"
          class="s-textarea__field"
          :rows="p.rows"
          :placeholder="p.placeholder"
          :disabled="p.disabled"
          :required="p.required"
          :readonly="p.readonly"
          :aria-invalid="fieldInvalid || undefined"
          :aria-describedby="describedBy"
        />
        <label
          v-if="floating"
          :id="labelId"
          class="s-textarea__label"
          :for="fieldId"
        >
          {{ fieldLabel }}
          <span
            v-if="p.required"
            class="s-textarea__label-required"
            aria-hidden="true"
            >*</span
          >
        </label>
        <span
          v-if="$slots.append"
          class="s-textarea__append"
        >
          <slot name="append" />
        </span>
      </div>
    </template>
  </SFormField>
</template>

<style src="./STextarea.scss" lang="scss"></style>
