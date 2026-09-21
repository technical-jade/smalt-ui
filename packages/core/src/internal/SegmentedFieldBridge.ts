import { defineComponent, watch, type PropType, type Ref } from 'vue'
import {
  injectDateFieldRootContext,
  injectDateRangeFieldRootContext,
  injectTimeFieldRootContext,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { parseDates, parseTime, type DateParts, type TimeParts } from './parseDateText'

type Kind = 'date' | 'time' | 'range'

export interface SegmentedFieldBridgeExposed {
  paste(event: ClipboardEvent): void
}

/**
 * Any date or time value. The fields are set on a value Reka already holds (the model or its
 * placeholder): `@internationalized/date` stays a type-only dependency of the library, so a value
 * cannot be constructed here.
 */
interface SettableValue {
  set(fields: Partial<DateParts & TimeParts>): SettableValue
  year?: number
  month?: number
  day?: number
  hour?: number
}

const asSettable = (value: unknown) => value as SettableValue | undefined

// A date the value clamped (Feb 30 → Feb 28) is not what the user pasted.
function applyDate(base: SettableValue, date: DateParts, time?: TimeParts | null) {
  const next = base.set({ ...date, ...(time && base.hour !== undefined ? time : {}) })
  return next.month === date.month && next.day === date.day ? next : undefined
}

/**
 * Renderless helper placed inside a Reka date/time field: reports Reka's own validity (a typed
 * value outside `minValue`/`maxValue`), which the wrapper cannot see, and applies text pasted
 * into a segment. Reka cancels every `beforeinput` on the contenteditable segments, so a paste
 * would otherwise be lost.
 */
export default defineComponent({
  name: 'SegmentedFieldBridge',
  props: {
    kind: { type: String as PropType<Kind>, required: true },
  },
  emits: {
    invalid: (value: boolean) => typeof value === 'boolean',
  },
  setup(props, { emit, expose }) {
    const context =
      props.kind === 'range'
        ? injectDateRangeFieldRootContext()!
        : props.kind === 'time'
          ? injectTimeFieldRootContext()!
          : injectDateFieldRootContext()!

    watch(context.isInvalid, (value) => emit('invalid', value), { immediate: true })

    function write(target: Ref<DateValue | undefined>, value: SettableValue | undefined) {
      if (value) target.value = value as unknown as DateValue
      return Boolean(value)
    }

    function applyText(text: string, segment: Element | null): boolean {
      const locale = context.locale.value
      const placeholder = asSettable(context.placeholder.value)!

      if (props.kind === 'range') {
        const range = context as NonNullable<ReturnType<typeof injectDateRangeFieldRootContext>>
        const dates = parseDates(text, locale)
        if (dates.length >= 2) {
          const start = applyDate(asSettable(range.startValue.value) ?? placeholder, dates[0])
          const end = applyDate(asSettable(range.endValue.value) ?? placeholder, dates[1])
          if (!start || !end) return false
          write(range.startValue, start)
          return write(range.endValue, end)
        }
        if (!dates.length) return false
        const bound =
          segment?.getAttribute('data-reka-date-range-field-segment-type') === 'end'
            ? range.endValue
            : range.startValue
        return write(bound, applyDate(asSettable(bound.value) ?? placeholder, dates[0]))
      }

      const field = context as NonNullable<ReturnType<typeof injectDateFieldRootContext>>
      const base = asSettable(field.modelValue.value) ?? placeholder
      const [date] = parseDates(text, locale)
      const time = parseTime(text)
      if (props.kind === 'time') {
        if (!time) return false
        // A date-time value also takes the date when the text has one.
        const withDate = date && base.year !== undefined ? applyDate(base, date) : base
        return write(field.modelValue, withDate?.set(time))
      }
      if (!date) return false
      return write(field.modelValue, applyDate(base, date, time))
    }

    /** Handles a paste that bubbled up from a segment; the wrapper listens on its root. */
    function paste(event: ClipboardEvent) {
      if (context.disabled.value || context.readonly.value) return
      const segment = (event.target as Element | null)?.closest(
        '[data-reka-date-field-segment], [data-reka-time-field-segment]',
      )
      if (!segment) return
      const text = event.clipboardData?.getData('text') ?? ''
      if (applyText(text, segment)) event.preventDefault()
    }

    expose({ paste } satisfies SegmentedFieldBridgeExposed)
    return () => null
  },
})
