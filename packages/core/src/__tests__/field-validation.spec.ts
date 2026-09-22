import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { flushPromises, mount } from '@vue/test-utils'
import { ref, type Component } from 'vue'
import * as lib from '../index'

const rule = () => 'Rule error'

/**
 * Every form field takes `rules`, shows the failed rule through SFormField and exposes
 * validate(). A new field without validation fails here.
 */
const CASES: [string, Component, Record<string, unknown>][] = [
  ['SInput', lib.SInput, {}],
  ['SInput use-tags', lib.SInput, { useTags: true }],
  ['STextarea', lib.STextarea, {}],
  ['SAutocomplete', lib.SAutocomplete, { options: [] }],
  ['SColorField', lib.SColorField, {}],
  ['SNumberField', lib.SNumberField, {}],
  ['SPinInput', lib.SPinInput, {}],
  ['SSlider', lib.SSlider, {}],
]

describe('field validation', () => {
  it.each(CASES)('%s shows the rule error after validate()', async (_, component, props) => {
    const wrapper = mount(component, {
      props: { label: 'Field', rules: [rule], ...props },
      attachTo: document.body,
    })
    await (wrapper.vm as unknown as { validate(): Promise<boolean> }).validate()
    await flushPromises()
    expect(wrapper.find('.s-field__error').text()).toBe('Rule error')
    expect(wrapper.find('[aria-invalid="true"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it.each(CASES)('%s: the error prop wins over rules', async (_, component, props) => {
    const wrapper = mount(component, {
      props: { label: 'Field', rules: [rule], error: 'Server error', ...props },
    })
    await (wrapper.vm as unknown as { validate(): Promise<boolean> }).validate()
    await flushPromises()
    expect(wrapper.find('.s-field__error').text()).toBe('Server error')
  })
})

describe('field validation · SForm', () => {
  const typeInto = async (container: Element, text: string) => {
    const input = container.querySelector('input')!
    await fireEvent.update(input, text)
    await flushPromises()
    return input
  }

  it('a configured default of the field gives way to validate-on of the form', async () => {
    const { container } = render({
      components: { ConfigProvider: lib.ConfigProvider, SForm: lib.SForm, SInput: lib.SInput },
      setup: () => ({ rules: [rule], defaults: { SInput: { validateOn: 'input' } } }),
      template: `<ConfigProvider :defaults="defaults"><SForm validate-on="submit">
        <SInput label="Name" :rules="rules" />
      </SForm></ConfigProvider>`,
    })
    await typeInto(container, 'A')
    expect(container.querySelector('.s-field__error')).toBeNull()
  })

  it('validate-on on the field wins over the form', async () => {
    const { container } = render({
      components: { SForm: lib.SForm, SInput: lib.SInput },
      setup: () => ({ rules: [rule] }),
      template: `<SForm validate-on="submit">
        <SInput label="Name" validate-on="input" :rules="rules" />
      </SForm>`,
    })
    await typeInto(container, 'A')
    expect(container.querySelector('.s-field__error')?.textContent?.trim()).toBe('Rule error')
  })

  it('reports the name attribute of SInput in the form errors', async () => {
    const onInvalid = vi.fn()
    const { container } = render({
      components: { SForm: lib.SForm, SInput: lib.SInput },
      setup: () => ({ rules: [rule], onInvalid }),
      template: `<SForm @invalid="onInvalid">
        <SInput label="Email" name="email" :rules="rules" />
      </SForm>`,
    })
    await fireEvent.submit(container.querySelector('form')!)
    await flushPromises()
    expect(onInvalid.mock.calls[0][0][0]).toMatchObject({ name: 'email', messages: ['Rule error'] })
  })

  it('focus() on a valid field skips a button before the control', async () => {
    const wrapper = mount(lib.SInput, {
      props: { label: 'Code' },
      slots: { prepend: '<button type="button">Pick</button>' },
      attachTo: document.body,
    })
    ;(wrapper.vm as unknown as { focus(): void }).focus()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    wrapper.unmount()
  })

  it('focus() moves focus to the control', async () => {
    const wrapper = mount(lib.SNumberField, {
      props: { label: 'Age', rules: [rule] },
      attachTo: document.body,
    })
    ;(wrapper.vm as unknown as { focus(): void }).focus()
    expect(document.activeElement).toBe(wrapper.find('input[role="spinbutton"]').element)
    wrapper.unmount()
  })
})

/**
 * Inline `:rules` build a new array on every render of the form's slot; the form must not
 * re-render because a field did.
 */
const INLINE: [string, string, string][] = [
  ['SInput', '<SInput label="F" name="f" :rules="[() => \'E\']" v-model="value" />', 'text'],
  ['STextarea', '<STextarea label="F" name="f" :rules="[() => \'E\']" v-model="value" />', 'text'],
  [
    'SAutocomplete',
    '<SAutocomplete label="F" name="f" :options="[]" :rules="[() => \'E\']" v-model="value" />',
    'text',
  ],
  [
    'SColorField',
    '<SColorField label="F" name="f" :rules="[() => \'E\']" v-model="value" />',
    'text',
  ],
  [
    'SNumberField',
    '<SNumberField label="F" name="f" :rules="[() => \'E\']" v-model="value" />',
    'number',
  ],
  ['SPinInput', '<SPinInput label="F" name="f" :rules="[() => \'E\']" v-model="value" />', 'cells'],
  ['SSlider', '<SSlider label="F" name="f" :rules="[() => \'E\']" v-model="value" />', 'number'],
]

const initial = { text: '', number: 1, cells: [] as string[] }
const next = { text: '#ff0000', number: 2, cells: ['1'] }

describe('field validation · inline rules in SForm', () => {
  const setup = (template: string, kind: keyof typeof initial, validateOn?: string) => {
    const errors: unknown[] = []
    // The scheduler's recursion guard throws outside the app when no component is active.
    const onRejection = (error: unknown) => errors.push(error)
    process.on('unhandledRejection', onRejection)
    onTestFinished(() => {
      process.off('unhandledRejection', onRejection)
    })
    const value = ref<unknown>(initial[kind])
    const { container } = render(
      {
        components: lib as unknown as Record<string, Component>,
        setup: () => ({ value }),
        template: `<SForm${validateOn ? ` validate-on="${validateOn}"` : ''}>${template}</SForm>`,
      },
      { global: { config: { errorHandler: (error) => errors.push(error) } } },
    )
    return { container, value, errors }
  }

  it.each(INLINE)(
    '%s: submit shows the error without an update loop',
    async (_, template, kind) => {
      const { container, errors } = setup(template, kind as keyof typeof initial)
      await fireEvent.submit(container.querySelector('form')!)
      await flushPromises()
      expect(container.querySelector('.s-field__error')?.textContent?.trim()).toBe('E')
      await new Promise((resolve) => setTimeout(resolve))
      expect(errors).toEqual([])
    },
  )

  it.each(INLINE)(
    '%s: validate-on="input" checks a change without an update loop',
    async (_, template, kind) => {
      const { container, value, errors } = setup(template, kind as keyof typeof initial, 'input')
      value.value = next[kind as keyof typeof next]
      await flushPromises()
      expect(container.querySelector('.s-field__error')?.textContent?.trim()).toBe('E')
      await new Promise((resolve) => setTimeout(resolve))
      expect(errors).toEqual([])
    },
  )
})
