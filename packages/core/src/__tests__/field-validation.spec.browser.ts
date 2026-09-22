import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { ref, type Component } from 'vue'
import {
  SAutocomplete,
  SColorField,
  SInput,
  SNumberField,
  SPinInput,
  SSlider,
  STextarea,
  required,
} from '../index'

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
  const BLUR_CASES: [string, Component, string][] = [
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
  ]

  it.each(BLUR_CASES)('%s: a consumer @blur fires once', async (name, component, template) => {
    const onBlur = vi.fn()
    const { container } = render({
      components: { [name]: component },
      setup: () => ({ rules: [() => 'Rule error'], onBlur }),
      template: `${template}<button class="next">Next</button>`,
    })
    const control = container.querySelector<HTMLElement>(
      'input:not([type="hidden"]):not([tabindex="-1"]), textarea, [role="slider"]',
    )!
    // A slider thumb takes focus only after the track is measured.
    await vi.waitFor(() => {
      control.focus()
      expect(document.activeElement).toBe(control)
    })
    container.querySelector<HTMLElement>('.next')!.focus()
    await vi.waitFor(() => expect(container.querySelector('.s-field__error')).not.toBeNull())
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  const FOCUS_CASES: [string, Component, Record<string, unknown>, string][] = [
    ['SInput', SInput, {}, 'input'],
    ['SInput use-tags', SInput, { useTags: true }, 'input'],
    ['STextarea', STextarea, {}, 'textarea'],
    ['SAutocomplete', SAutocomplete, { options: [] }, 'input'],
    ['SColorField', SColorField, { name: 'color' }, '.s-color-field__input'],
    ['SNumberField', SNumberField, {}, 'input[role="spinbutton"]'],
    ['SPinInput', SPinInput, {}, '.s-pin-input__cell'],
    ['SSlider', SSlider, { modelValue: [20, 60] }, '[role="slider"]'],
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
})
