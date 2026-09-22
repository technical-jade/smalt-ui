/* eslint-disable vue/one-component-per-file -- test stubs: the harness component and a form/field pair */
import { describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, provide, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { required, useValidation, type SRule, type SValidateOn } from '../index'
import { formContextKey, type SFormContext } from '../../internal/formContext'

function harness(opts: {
  rules?: SRule<string>[]
  validateOn?: SValidateOn
  error?: string
  disabled?: boolean
}) {
  const value = ref('')
  const error = ref(opts.error)
  const disabled = ref(opts.disabled ?? false)
  let api!: ReturnType<typeof useValidation<string>>
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useValidation({
          value,
          rules: () => opts.rules,
          validateOn: () => opts.validateOn,
          error,
          disabled,
        })
        return () => h('div')
      },
    }),
  )
  return { value, error, disabled, api, wrapper, opts }
}

describe('useValidation', () => {
  it('blur mode: silent while typing, checks on blur, then on every change', async () => {
    const { value, api } = harness({ rules: [required()] })
    value.value = 'a'
    value.value = ''
    await flushPromises()
    expect(api.errorMessage.value).toBeUndefined()

    api.onBlur()
    await flushPromises()
    expect(api.errorMessage.value).toBe('This field is required')

    value.value = 'fixed'
    await flushPromises()
    expect(api.errorMessage.value).toBeUndefined()

    value.value = ''
    await flushPromises()
    expect(api.errorMessage.value).toBeUndefined()
  })

  it('input mode: checks on every change, not on mount', async () => {
    const { value, api } = harness({ rules: [required()], validateOn: 'input' })
    await flushPromises()
    expect(api.errorMessage.value).toBeUndefined()
    value.value = 'a'
    await flushPromises()
    value.value = ''
    await flushPromises()
    expect(api.errorMessage.value).toBe('This field is required')
  })

  it('submit mode: ignores blur, validate() shows the error', async () => {
    const { api } = harness({ rules: [required()], validateOn: 'submit' })
    api.onBlur()
    await flushPromises()
    expect(api.errorMessage.value).toBeUndefined()
    await expect(api.validate()).resolves.toBe(false)
    expect(api.invalid.value).toBe(true)
  })

  it('a manual error wins over the rules and makes validate() fail', async () => {
    const { error, api } = harness({ rules: [() => 'Rule error'], error: 'Server error' })
    await expect(api.validate()).resolves.toBe(false)
    expect(api.errorMessage.value).toBe('Server error')
    error.value = undefined
    expect(api.errorMessage.value).toBe('Rule error')
  })

  it('a disabled field is always valid via validate(), but keeps showing a manual error', async () => {
    const { disabled, error, api } = harness({ rules: [required()] })
    await api.validate()
    expect(api.invalid.value).toBe(true)
    disabled.value = true
    await nextTick()
    expect(api.invalid.value).toBe(false)
    await expect(api.validate()).resolves.toBe(true)

    error.value = 'Server error'
    await nextTick()
    expect(api.errorMessage.value).toBe('Server error')
    await expect(api.validate()).resolves.toBe(true)
  })

  it('drops a stale async result', async () => {
    let resolveFirst!: (r: true | string) => void
    const calls: string[] = []
    const rule: SRule<string> = (v) => {
      calls.push(v)
      return calls.length === 1
        ? new Promise((r) => (resolveFirst = r))
        : Promise.resolve(true as const)
    }
    const { value, api } = harness({ rules: [rule] })
    const first = api.validate()
    value.value = 'b'
    await api.validate()
    resolveFirst('Stale error')
    await first
    expect(api.errorMessage.value).toBeUndefined()
  })

  it('a stale run adopts the outcome of the run that superseded it', async () => {
    let resolveFirst!: (r: true | string) => void
    const calls: string[] = []
    const rule: SRule<string> = () => {
      calls.push('call')
      return calls.length === 1
        ? new Promise((r) => (resolveFirst = r))
        : Promise.resolve('Second run failed')
    }
    const { api } = harness({ rules: [rule] })
    const first = api.validate()
    const second = api.validate()
    resolveFirst(true)
    await expect(second).resolves.toBe(false)
    await expect(first).resolves.toBe(false)
  })

  it('a stale run forced by resetValidation() resolves false', async () => {
    let resolvePending!: (r: true | string) => void
    const rule: SRule<string> = () => new Promise((r) => (resolvePending = r))
    const { api } = harness({ rules: [rule] })
    const pending = api.validate()
    api.resetValidation()
    resolvePending(true)
    await expect(pending).resolves.toBe(false)
  })

  it('reports validating while an async rule runs', async () => {
    const { api } = harness({ rules: [() => Promise.resolve(true as const)] })
    const run = api.validate()
    expect(api.validating.value).toBe(true)
    await run
    expect(api.validating.value).toBe(false)
  })

  it('does not flicker validating for a purely synchronous rule list', async () => {
    const { api } = harness({ rules: [required()] })
    const run = api.validate()
    expect(api.validating.value).toBe(false)
    await run
    expect(api.validating.value).toBe(false)
  })

  it('turns a throwing rule into the ruleFailed error', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { api } = harness({
      rules: [
        () => {
          throw new Error('boom')
        },
      ],
    })
    await api.validate()
    expect(api.errorMessage.value).toBe('The value could not be checked')
    warn.mockRestore()
  })

  it('resetValidation clears the error and waits for the next trigger', async () => {
    const { value, api } = harness({ rules: [required()] })
    await api.validate()
    api.resetValidation()
    expect(api.errorMessage.value).toBeUndefined()
    value.value = 'a'
    value.value = ''
    await flushPromises()
    expect(api.errorMessage.value).toBeUndefined()
  })

  it('changing the rules does not recheck; the shown error persists until the next validate()', async () => {
    const { opts, value, api } = harness({ rules: [() => 'Always fails'] })
    value.value = 'x'
    await api.validate()
    expect(api.errorMessage.value).toBe('Always fails')

    opts.rules = [required()]
    await flushPromises()
    expect(api.errorMessage.value).toBe('Always fails')

    await expect(api.validate()).resolves.toBe(true)
    expect(api.errorMessage.value).toBeUndefined()
  })

  it('registers with the form on mount, unregisters when disabled, and unregisters on unmount', async () => {
    const register = vi.fn()
    const unregister = vi.fn()
    const form: SFormContext = {
      validateOn: computed(() => undefined),
      register,
      unregister,
    }

    const value = ref('')
    const disabled = ref(false)
    const Field = defineComponent({
      setup() {
        useValidation({ value, disabled })
        return () => h('div')
      },
    })
    const wrapper = mount(
      defineComponent({
        setup() {
          provide(formContextKey, form)
          return () => h(Field)
        },
      }),
    )
    await nextTick()
    expect(register).toHaveBeenCalledTimes(1)
    const entry = register.mock.calls[0]?.[0] as unknown
    expect(unregister).not.toHaveBeenCalled()

    disabled.value = true
    await nextTick()
    expect(unregister).toHaveBeenCalledTimes(1)
    expect(unregister.mock.calls[0]?.[0]).toBe(entry)

    disabled.value = false
    await nextTick()
    expect(register).toHaveBeenCalledTimes(2)
    expect(register.mock.calls[1]?.[0]).toBe(entry)

    wrapper.unmount()
    expect(unregister).toHaveBeenCalledTimes(2)
    expect(unregister.mock.calls[1]?.[0]).toBe(entry)
  })
})
