/* eslint-disable vue/one-component-per-file -- test stubs: a custom field and the hosts that mount it */
import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { SForm, required, useValidation, type SRule } from '../../../index'

/** A minimal custom field: useValidation is the public way to join SForm. */
const Field = defineComponent({
  props: {
    value: { type: String, default: '' },
    rules: { type: Array as () => SRule<string>[], default: () => [] },
    name: { type: String, default: undefined },
    disabled: Boolean,
    validateOn: { type: String as () => 'blur' | 'input' | 'submit', default: undefined },
  },
  setup(props) {
    const v = useValidation({
      value: () => props.value,
      rules: () => props.rules,
      name: () => props.name,
      disabled: () => props.disabled,
      validateOn: () => props.validateOn,
    })
    return () =>
      h('input', {
        'aria-invalid': v.invalid.value || undefined,
        'data-error': v.errorMessage.value,
        onBlur: v.onBlur,
      })
  },
})

function mountForm(template: string, setup: () => Record<string, unknown> = () => ({})) {
  return mount(defineComponent({ components: { SForm, Field }, setup, template }), {
    attachTo: document.body,
  })
}

describe('SForm', () => {
  it('renders a form without native validation', () => {
    const w = mountForm('<SForm><Field /></SForm>')
    expect(w.find('form').attributes('novalidate')).toBeDefined()
    expect(w.find('form').classes()).toContain('s-form')
  })

  it('emits invalid instead of submit when a field fails', async () => {
    const onSubmit = vi.fn()
    const onInvalid = vi.fn()
    const w = mountForm(
      '<SForm @submit="onSubmit" @invalid="onInvalid"><Field name="email" :rules="rules" /></SForm>',
      () => ({ onSubmit, onInvalid, rules: [required()] }),
    )
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'email', messages: ['This field is required'] }),
    ])
  })

  it('emits submit when every field passes', async () => {
    const onSubmit = vi.fn()
    const w = mountForm(
      '<SForm @submit="onSubmit"><Field value="ok" :rules="rules" /></SForm>',
      () => ({
        onSubmit,
        rules: [required()],
      }),
    )
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0]![0]).toBeInstanceOf(Event)
  })

  it('never calls the submit listener for an invalid form', async () => {
    const onSubmit = vi.fn()
    const w = mountForm('<SForm @submit="onSubmit"><Field :rules="rules" /></SForm>', () => ({
      onSubmit,
      rules: [required()],
    }))
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('discards the verdict of a submission overtaken by a newer one', async () => {
    const onSubmit = vi.fn()
    let resolveFirst: (value: true | string) => void = () => {}
    let calls = 0
    const rule: SRule<string> = () => {
      calls++
      if (calls === 1) return new Promise((resolve) => (resolveFirst = resolve))
      return true
    }
    const w = mountForm(
      '<SForm @submit="onSubmit"><Field value="x" :rules="rules" /></SForm>',
      () => ({
        onSubmit,
        rules: [rule],
      }),
    )
    await w.find('form').trigger('submit')
    await w.find('form').trigger('submit')
    resolveFirst(true)
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('reports validity through v-model', async () => {
    const valid = ref<boolean | null>(null)
    const value = ref('')
    const w = mountForm(
      '<SForm v-model="valid"><Field :value="value" :rules="rules" validate-on="input" /></SForm>',
      () => ({ valid, value, rules: [required()] }),
    )
    await flushPromises()
    expect(valid.value).toBeNull()
    value.value = 'a'
    await flushPromises()
    expect(valid.value).toBe(true)
    value.value = ''
    await flushPromises()
    expect(valid.value).toBe(false)
    w.unmount()
  })

  it('does not report a vacuous true before the fields register', async () => {
    const onUpdate = vi.fn()
    mountForm('<SForm @update:model-value="onUpdate"><Field :rules="rules" /></SForm>', () => ({
      onUpdate,
      rules: [required()],
    }))
    await flushPromises()
    expect(onUpdate.mock.calls.flat()).not.toContain(true)
  })

  it('replaces a value the app writes into v-model', async () => {
    const valid = ref<boolean | null>(null)
    mountForm('<SForm v-model="valid"><Field :rules="rules" /></SForm>', () => ({
      valid,
      rules: [required()],
    }))
    await flushPromises()
    valid.value = true
    await flushPromises()
    expect(valid.value).toBeNull()
  })

  it('drops a pending submission when the form is reset', async () => {
    const onSubmit = vi.fn()
    const onInvalid = vi.fn()
    let resolve: (value: true | string) => void = () => {}
    const rule: SRule<string> = () => new Promise((r) => (resolve = r))
    const w = mountForm(
      '<SForm @submit="onSubmit" @invalid="onInvalid"><Field value="x" :rules="rules" /></SForm>',
      () => ({ onSubmit, onInvalid, rules: [rule] }),
    )
    await w.find('form').trigger('submit')
    await w.find('form').trigger('reset')
    resolve('Taken')
    await flushPromises()
    expect(onInvalid).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('exposes the state to the default slot', async () => {
    const w = mountForm(
      `<SForm v-slot="{ valid, errors }">
        <Field name="a" :rules="rules" />
        <output>{{ String(valid) }}:{{ errors.map((e) => e.name).join() }}</output>
      </SForm>`,
      () => ({ rules: [required()] }),
    )
    await flushPromises()
    expect(w.find('output').text()).toBe('null:')
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(w.find('output').text()).toBe('false:a')
  })

  it('validate() returns every error and resetValidation() clears them', async () => {
    const form = ref()
    const w = mountForm(
      '<SForm ref="form"><Field name="a" :rules="rules" /><Field name="b" :rules="rules" /></SForm>',
      () => ({ form, rules: [required()] }),
    )
    const result = await form.value.validate()
    expect(result.valid).toBe(false)
    expect(result.errors.map((e: { name: string }) => e.name)).toEqual(['a', 'b'])
    form.value.resetValidation()
    await nextTick()
    expect(w.findAll('[aria-invalid]')).toHaveLength(0)
  })

  it('skips disabled and unmounted fields', async () => {
    const shown = ref(true)
    const form = ref()
    mountForm(
      '<SForm ref="form"><Field disabled :rules="rules" /><Field v-if="shown" :rules="rules" /></SForm>',
      () => ({ form, shown, rules: [required()] }),
    )
    shown.value = false
    await nextTick()
    await expect(form.value.validate()).resolves.toMatchObject({ valid: true })
  })

  it('passes validate-on to the fields; a field prop wins', async () => {
    const w = mountForm(
      '<SForm validate-on="submit"><Field id="a" :rules="rules" /><Field id="b" validate-on="blur" :rules="rules" /></SForm>',
      () => ({ rules: [required()] }),
    )
    await w.find('#a').trigger('blur')
    await w.find('#b').trigger('blur')
    await flushPromises()
    expect(w.find('#a').attributes('aria-invalid')).toBeUndefined()
    expect(w.find('#b').attributes('aria-invalid')).toBe('true')
  })

  it('emits reset and clears the errors after it', async () => {
    const onReset = vi.fn()
    const w = mountForm('<SForm @reset="onReset"><Field :rules="rules" /></SForm>', () => ({
      onReset,
      rules: [required()],
    }))
    await w.find('form').trigger('submit')
    await flushPromises()
    await w.find('form').trigger('reset')
    await nextTick()
    await nextTick()
    expect(onReset).toHaveBeenCalledOnce()
    expect(w.findAll('[aria-invalid]')).toHaveLength(0)
  })
})
