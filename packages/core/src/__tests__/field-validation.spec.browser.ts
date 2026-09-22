import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { ref, type Component } from 'vue'
import {
  SAutocomplete,
  SCheckbox,
  SColorField,
  SDateField,
  SDatePicker,
  SDateRangePicker,
  SForm,
  SInput,
  SNumberField,
  SPinInput,
  SRadioGroup,
  SRating,
  SSelect,
  SSlider,
  SSwitch,
  STextarea,
  STimeField,
  required,
} from '../index'

const options = [{ label: 'One', value: 'one' }]
const radios = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
]
const segment = (block: string) => `.${block}__segment:not(.${block}__segment--literal)`

describe('field validation · browser', () => {
  it('SInput: checks on blur, then clears the error while typing', async () => {
    const { container } = render({
      components: { SInput },
      setup: () => ({ rules: [required()] }),
      template: '<SInput label="Name" :rules="rules" /><button>Next</button>',
    })
    const input = container.querySelector('input')!
    await userEvent.click(input)
    await userEvent.tab()
    await vi.waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'))
    await userEvent.click(input)
    await userEvent.keyboard('A')
    await vi.waitFor(() => expect(input).not.toHaveAttribute('aria-invalid', 'true'))
  })

  it('SNumberField: checks the number committed on blur, not the previous value', async () => {
    const seen: unknown[] = []
    const rule = (value: number | null) => {
      seen.push(value)
      return value != null || 'Required'
    }
    const { container } = render({
      components: { SNumberField },
      setup: () => ({ value: ref<number | null>(null), rules: [rule] }),
      template:
        '<SNumberField v-model="value" label="Age" :rules="rules" /><button class="next">Next</button>',
    })
    const input = container.querySelector('input')!
    await userEvent.click(input)
    await userEvent.keyboard('5')
    // Leaving from a script: no microtask checkpoint between blur and focusout.
    container.querySelector<HTMLElement>('.next')!.focus()
    await vi.waitFor(() => expect(seen).toEqual([5]))
    expect(input).not.toHaveAttribute('aria-invalid', 'true')
  })

  /**
   * Validation tracks leaving the field on its own: the consumer's `@blur` keeps its path to
   * the control (or the field's own emit) and fires once per leave.
   */
  const BLUR_CASES: [string, Component, string, string?][] = [
    ['SInput', SInput, '<SInput label="Field" :rules="rules" @blur="onBlur" />'],
    ['STextarea', STextarea, '<STextarea label="Field" :rules="rules" @blur="onBlur" />'],
    [
      'SAutocomplete',
      SAutocomplete,
      '<SAutocomplete label="Field" :options="[]" :rules="rules" @blur="onBlur" />',
    ],
    ['SColorField', SColorField, '<SColorField label="Field" :rules="rules" @blur="onBlur" />'],
    ['SNumberField', SNumberField, '<SNumberField label="Field" :rules="rules" @blur="onBlur" />'],
    ['SPinInput', SPinInput, '<SPinInput label="Field" :rules="rules" @blur="onBlur" />'],
    ['SSlider', SSlider, '<SSlider label="Field" :rules="rules" @blur="onBlur" />'],
    [
      'SSelect',
      SSelect,
      '<SSelect label="Field" :options="options" :rules="rules" @blur="onBlur" />',
      '.s-select__trigger',
    ],
    [
      'SSelect searchable',
      SSelect,
      '<SSelect label="Field" searchable :options="options" :rules="rules" @blur="onBlur" />',
      '.s-select__input',
    ],
    [
      'SDateField',
      SDateField,
      '<SDateField label="Field" :rules="rules" @blur="onBlur" />',
      segment('s-date-field'),
    ],
    [
      'STimeField',
      STimeField,
      '<STimeField label="Field" :rules="rules" @blur="onBlur" />',
      segment('s-time-field'),
    ],
    [
      'SDatePicker',
      SDatePicker,
      '<SDatePicker label="Field" :rules="rules" @blur="onBlur" />',
      segment('s-date-picker'),
    ],
    [
      'SDateRangePicker',
      SDateRangePicker,
      '<SDateRangePicker label="Field" :rules="rules" @blur="onBlur" />',
      segment('s-date-range-picker'),
    ],
    [
      'SCheckbox',
      SCheckbox,
      '<SCheckbox label="Field" :rules="rules" @blur="onBlur" />',
      '[role="checkbox"]',
    ],
    [
      'SSwitch',
      SSwitch,
      '<SSwitch label="Field" :rules="rules" @blur="onBlur" />',
      '[role="switch"]',
    ],
  ]

  it.each(BLUR_CASES)(
    '%s: a consumer @blur fires once',
    async (name, component, template, selector) => {
      const onBlur = vi.fn()
      const { container } = render({
        components: { [name.split(' ')[0]]: component },
        setup: () => ({ rules: [() => 'Rule error'], onBlur, options }),
        template: `${template}<button class="next">Next</button>`,
      })
      const control = container.querySelector<HTMLElement>(
        selector ?? 'input:not([type="hidden"]):not([tabindex="-1"]), textarea, [role="slider"]',
      )!
      // A slider thumb takes focus only after the track is measured.
      await vi.waitFor(() => {
        control.focus()
        expect(document.activeElement).toBe(control)
      })
      container.querySelector<HTMLElement>('.next')!.focus()
      await vi.waitFor(() => expect(container.querySelector('.s-field__error')).not.toBeNull())
      expect(onBlur).toHaveBeenCalledTimes(1)
    },
  )

  const FOCUS_CASES: [string, Component, Record<string, unknown>, string][] = [
    ['SInput', SInput, {}, 'input'],
    ['SInput use-tags', SInput, { useTags: true }, 'input'],
    ['STextarea', STextarea, {}, 'textarea'],
    ['SAutocomplete', SAutocomplete, { options: [] }, 'input'],
    ['SColorField', SColorField, { name: 'color' }, '.s-color-field__input'],
    ['SNumberField', SNumberField, {}, 'input[role="spinbutton"]'],
    ['SPinInput', SPinInput, {}, '.s-pin-input__cell'],
    ['SSlider', SSlider, { modelValue: [20, 60] }, '[role="slider"]'],
    ['SSelect', SSelect, { options }, '.s-select__trigger'],
    ['SSelect searchable', SSelect, { options, searchable: true }, '.s-select__input'],
    ['SSelect use-tags', SSelect, { options, useTags: true }, '.s-select__trigger'],
    ['SDateField', SDateField, {}, segment('s-date-field')],
    ['STimeField', STimeField, {}, segment('s-time-field')],
    ['SDatePicker', SDatePicker, {}, segment('s-date-picker')],
    ['SDateRangePicker', SDateRangePicker, {}, segment('s-date-range-picker')],
    ['SCheckbox', SCheckbox, {}, '[role="checkbox"]'],
    ['SSwitch', SSwitch, {}, '[role="switch"]'],
    ['SRadioGroup', SRadioGroup, { options: radios }, '[role="radio"]'],
    [
      'SRadioGroup with a value',
      SRadioGroup,
      { options: radios, modelValue: 'b' },
      '[role="radio"][aria-checked="true"]',
    ],
    ['SRating', SRating, { ariaLabel: 'Rating' }, '[role="radio"]'],
    [
      'SRating with a value',
      SRating,
      { ariaLabel: 'Rating', modelValue: 3 },
      '[role="radio"][aria-checked="true"]',
    ],
  ]

  it.each(FOCUS_CASES)('%s: focus() lands on the control', async (_, component, props, target) => {
    const exposed = ref<{ focus(): void }>()
    const { container } = render({
      components: { Field: component },
      setup: () => ({ exposed, props }),
      template: `<Field ref="exposed" label="Field" v-bind="props">
        <template #prepend><button type="button">Before</button></template>
      </Field>`,
    })
    const control = container.querySelector<HTMLElement>(target)!
    await vi.waitFor(() => {
      exposed.value!.focus()
      expect(document.activeElement).toBe(control)
    })
  })

  it('SSelect: opening the list does not validate, leaving the field does', async () => {
    const { container } = render({
      components: { SSelect },
      setup: () => ({ rules: [required()], options }),
      template: '<SSelect label="City" :options="options" :rules="rules" /><button>Next</button>',
    })
    const trigger = container.querySelector<HTMLElement>('.s-select__trigger')!
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(document.querySelector('.s-select__content')).not.toBeNull())
    await vi.waitFor(() =>
      expect(document.activeElement?.closest('.s-select__content')).toBeTruthy(),
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(trigger).not.toHaveAttribute('aria-invalid', 'true')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.querySelector('.s-select__content')).toBeNull())
    expect(trigger).not.toHaveAttribute('aria-invalid', 'true')
    await userEvent.tab()
    await vi.waitFor(() => expect(trigger).toHaveAttribute('aria-invalid', 'true'))
  })

  it('SDatePicker: moving into the calendar does not validate', async () => {
    const { container } = render({
      components: { SDatePicker },
      setup: () => ({ rules: [required()] }),
      template: '<SDatePicker label="Date" :rules="rules" /><button class="next">Next</button>',
    })
    await userEvent.click(container.querySelector<HTMLElement>('.s-date-picker__trigger')!)
    await vi.waitFor(() =>
      expect(document.activeElement?.closest('.s-date-picker__content')).toBeTruthy(),
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(container.querySelector('[aria-invalid="true"]')).toBeNull()
    await userEvent.click(container.querySelector<HTMLElement>('.next')!)
    await vi.waitFor(() => expect(container.querySelector('[aria-invalid="true"]')).not.toBeNull())
  })

  it('SForm focuses the tab stop of an invalid radio group', async () => {
    const { container } = render({
      components: { SForm, SRadioGroup },
      setup: () => ({ rules: [required()], options: radios }),
      template: `<SForm @submit="() => {}"><SRadioGroup label="Plan" :options="options" :rules="rules" />
        <button type="submit">Send</button></SForm>`,
    })
    // Radios are buttons too.
    await userEvent.click(container.querySelector('button[type="submit"]')!)
    await vi.waitFor(() => expect(document.activeElement?.getAttribute('role')).toBe('radio'))
    expect(document.activeElement).toBe(container.querySelector('[role="radio"]'))
  })
})
