import { defineComponent, type Ref } from 'vue'
import { injectTimeFieldRootContext } from 'reka-ui'

/** The parts of a time the panel writes. */
export interface TimePickerFields {
  hour?: number
  minute?: number
  second?: number
}

export interface TimePickerBaseExposed {
  write(fields: TimePickerFields): void
}

/** Any time value: the panel only sets fields on a value Reka already holds. */
interface SettableTime {
  hour: number
  minute: number
  second: number
  set(fields: TimePickerFields): SettableTime
}

/**
 * Renderless helper inside the panel's own `TimeFieldRoot`. `@internationalized/date` stays a
 * type-only dependency, so a value cannot be constructed here: the picked fields are set on the
 * model, or on Reka's placeholder while the field is still empty. Writing back through Reka also
 * keeps the class of the value — a `Time` stays a `Time`, a date-time keeps its date.
 */
export default defineComponent({
  name: 'TimePickerBase',
  setup(_props, { expose }) {
    const context = injectTimeFieldRootContext()!
    const model = context.modelValue as unknown as Ref<SettableTime | undefined>
    const placeholder = context.placeholder as unknown as Ref<SettableTime>

    function write(fields: TimePickerFields): void {
      model.value = (model.value ?? placeholder.value).set(fields)
    }

    expose({ write } satisfies TimePickerBaseExposed)
    return () => null
  },
})
