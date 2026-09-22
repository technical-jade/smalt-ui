<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger, TimeFieldRoot } from 'reka-ui'
import { SIcon } from '../SIcon'
import { STimeField } from '../STimeField'
import TimePickerBase, { type TimePickerBaseExposed, type TimePickerFields } from './TimePickerBase'
import TimePickerPanel from './TimePickerPanel.vue'
import { useDefaults, useElevationProp, useFormatLocale, useMessages } from '../../composables'
import { useOwnAccessibleName } from '../../internal/useOwnAccessibleName'
import type { STimePickerProps } from './types'
import type { STimeValue } from '../STimeField/types'

const props = withDefaults(defineProps<STimePickerProps>(), {
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  floatingLabel: true,
  granularity: 'minute',
  minuteStep: 1,
  secondStep: 1,
})
const p = useDefaults(props, 'STimePicker')

const m = useMessages()

/** Selected time (`Time`, `CalendarDateTime` or `ZonedDateTime`). Two-way bound via `v-model`. */
const model = defineModel<STimeValue | undefined>()

const open = ref(false)
const formatLocale = useFormatLocale(() => p.locale)
const elevationStyle = useElevationProp(p, 's-surface')

/** An afternoon hour: a locale names a day period only when it puts time on a 12-hour clock. */
const AFTERNOON = new Date(2024, 0, 1, 13)

/**
 * The panel builds its own columns, so it needs the cycle as a number even when the prop leaves
 * the choice to the locale. The resolved value also goes to the field, so its segments and the
 * columns never disagree.
 */
const hourCycle = computed<12 | 24>(() => {
  if (p.hourCycle) return p.hourCycle
  const parts = new Intl.DateTimeFormat(formatLocale.value, { hour: 'numeric' }).formatToParts(
    AFTERNOON,
  )
  return parts.some((part) => part.type === 'dayPeriod') ? 12 : 24
})

interface FieldExposed {
  validate(): Promise<boolean>
  resetValidation(): void
  focus(): void
}

const field = useTemplateRef<FieldExposed>('field')
const base = useTemplateRef<TimePickerBaseExposed>('base')
const content = useTemplateRef<{ $el: Element | null }>('content')
useOwnAccessibleName(content, '.s-time-picker__content', () => p.label)

function onPick(fields: TimePickerFields): void {
  base.value?.write(fields)
}

/**
 * The field decides that focus left it by the element focus moves to, and the panel is portalled
 * to body, outside the field frame. Moving into the panel is still moving inside the picker, so
 * the event is kept away from the field's own listener, which would blur it and run its rules.
 */
function onFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget
  if (next instanceof Element && next.closest('.s-time-picker__content')) event.stopPropagation()
}

defineExpose({
  /** Runs the rules now; resolves to `true` when the value is valid. */
  validate: () => field.value?.validate() ?? Promise.resolve(true),
  /** Clears the error; the field waits for the next trigger again. */
  resetValidation: () => field.value?.resetValidation(),
  /** Moves focus to the first editable segment of the field. */
  focus: () => field.value?.focus(),
})
</script>

<template>
  <STimeField
    :id="p.id"
    ref="field"
    v-model="model"
    class="s-time-picker"
    :label="p.label"
    :floating-label="p.floatingLabel"
    :hint="p.hint"
    :error="p.error"
    :size="p.size"
    :disabled="p.disabled"
    :readonly="p.readonly"
    :name="p.name"
    :required="p.required"
    :invalid="p.invalid"
    :square="p.square"
    :locale="p.locale"
    :hour-cycle="hourCycle"
    :granularity="p.granularity"
    :min-value="p.minValue"
    :max-value="p.maxValue"
    :rules="p.rules"
    :validate-on="p.validateOn"
  >
    <template #append>
      <PopoverRoot v-model:open="open">
        <span
          class="s-time-picker__anchor"
          @focusout="onFocusOut"
        >
          <PopoverTrigger
            class="s-time-picker__trigger"
            :disabled="p.disabled || p.readonly"
            :aria-label="p.openLabel ?? m.openTimePicker"
          >
            <SIcon
              icon="clock"
              :size="18"
            />
          </PopoverTrigger>
        </span>

        <PopoverPortal>
          <PopoverContent
            ref="content"
            class="s-time-picker__content"
            :class="{ 's-time-picker__content--square': p.square }"
            :style="elevationStyle"
            :side-offset="6"
            align="end"
            :aria-label="p.label"
            @open-auto-focus.prevent
          >
            <!--
              A second time field, disabled and hidden: it holds the Reka value the panel sets
              its fields on (see TimePickerBase). Only the panel writes through it.
            -->
            <TimeFieldRoot
              v-model="model"
              class="s-time-picker__base"
              disabled
              aria-hidden="true"
            >
              <TimePickerBase ref="base" />
            </TimeFieldRoot>

            <TimePickerPanel
              :value="model"
              :locale="formatLocale"
              :hour-cycle="hourCycle"
              :granularity="p.granularity"
              :minute-step="p.minuteStep"
              :second-step="p.secondStep"
              :min-value="p.minValue"
              :max-value="p.maxValue"
              @pick="onPick"
            />
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </template>
  </STimeField>
</template>

<style src="./STimePicker.scss" lang="scss"></style>
