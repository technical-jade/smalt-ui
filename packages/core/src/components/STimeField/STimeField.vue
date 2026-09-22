<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { TimeFieldRoot, TimeFieldInput } from 'reka-ui'
import { SFormField } from '../SFormField'
import { visibleSegments } from '../../internal/dateSegments'
import SegmentedFieldBridge, {
  type SegmentedFieldBridgeExposed,
} from '../../internal/SegmentedFieldBridge'
import { useDefaults, useFormatLocale } from '../../composables'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { focusFirstSegment, useFieldValidation } from '../../internal/useFieldValidation'
import type { STimeFieldProps, STimeValue } from './types'

const props = withDefaults(defineProps<STimeFieldProps>(), {
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  floatingLabel: true,
})
const p = useDefaults(props, 'STimeField')

const emit = defineEmits<{
  /** Focus entered the field. Moving between segments does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Moving between segments does not count. */
  blur: [event: FocusEvent]
}>()
const root = useTemplateRef<ComponentPublicInstance>('root')

const formatLocale = useFormatLocale(() => p.locale)

const slots = defineSlots<{
  /** Content at the start of the field, inside the border (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the border (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/**
 * Time value (`Time`/`CalendarDateTime`/`ZonedDateTime`). Two-way bound via `v-model`.
 */
const model = defineModel<STimeValue | undefined>()

const {
  errorMessage,
  onBlur: onLeave,
  expose,
} = useFieldValidation(
  p,
  () => model.value,
  root,
  () => focusFirstSegment(root.value?.$el, 's-time-field'),
)
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit, undefined, onLeave)
defineExpose(expose)

const outOfRange = ref(false)
const bridge = useTemplateRef<SegmentedFieldBridgeExposed>('bridge')

const floating = computed(() => p.floatingLabel && !!p.label)
const filled = computed(() => model.value != null)
const hasLeading = computed(() => !!slots.prepend)
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-time-field"
    :class="`s-time-field--${p.size}`"
    :label="p.label"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid || outOfRange"
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
      <div
        class="s-time-field__wrap"
        :class="{
          's-time-field__wrap--invalid': fieldInvalid,
          's-time-field__wrap--disabled': p.disabled,
          's-time-field__wrap--floating': floating,
          's-time-field__wrap--has-leading': floating && hasLeading,
        }"
        :data-filled="filled || undefined"
        :data-invalid="fieldInvalid || undefined"
      >
        <span
          v-if="$slots.prepend"
          class="s-time-field__prepend"
        >
          <slot name="prepend" />
        </span>
        <TimeFieldRoot
          :id="fieldId"
          v-slot="{ segments }"
          v-model="model"
          class="s-time-field__control"
          :locale="formatLocale"
          :hour-cycle="p.hourCycle"
          :granularity="p.granularity"
          :min-value="p.minValue"
          :max-value="p.maxValue"
          :disabled="p.disabled"
          :readonly="p.readonly"
          :name="p.name"
          :required="p.required"
          :aria-labelledby="labelId"
          :aria-invalid="fieldInvalid || undefined"
          :aria-describedby="describedBy"
          @paste="bridge?.paste($event)"
        >
          <TimeFieldInput
            v-for="item in visibleSegments(segments)"
            :key="item.part"
            :part="item.part"
            class="s-time-field__segment"
            :class="{ 's-time-field__segment--literal': item.part === 'literal' }"
          >
            {{ item.value }}
          </TimeFieldInput>
          <SegmentedFieldBridge
            ref="bridge"
            kind="time"
            @invalid="outOfRange = $event"
          />
        </TimeFieldRoot>
        <label
          v-if="floating"
          :id="labelId"
          class="s-time-field__label"
        >
          {{ fieldLabel }}
          <span
            v-if="p.required"
            class="s-time-field__label-required"
            aria-hidden="true"
            >*</span
          >
        </label>
        <span
          v-if="$slots.append"
          class="s-time-field__append"
        >
          <slot name="append" />
        </span>
      </div>
    </template>
  </SFormField>
</template>

<style src="./STimeField.scss" lang="scss"></style>
