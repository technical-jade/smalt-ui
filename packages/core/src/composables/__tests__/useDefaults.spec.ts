/* eslint-disable vue/one-component-per-file -- test stubs: a provider host and a probe */
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, nextTick, ref } from 'vue'
import { render } from '@testing-library/vue'
import { mergeDefaults, provideDefaults, useDefaults } from '../useDefaults'

const Probe = defineComponent({
  name: 'SProbe',
  props: {
    size: { type: String, default: 'md' },
    variant: { type: String, default: 'primary' },
  },
  setup(props) {
    const p = useDefaults(props, 'SProbe')
    return () => h('div', { 'data-size': p.size, 'data-variant': p.variant })
  },
})

const Host = defineComponent({
  props: {
    defaults: { type: Object, required: true },
    probeProps: { type: Object, default: () => ({}) },
  },
  setup(props) {
    provideDefaults(() => props.defaults)
    return () => h(Probe, props.probeProps)
  },
})

const read = (container: Element) => {
  const el = container.querySelector('div')!
  return { size: el.getAttribute('data-size'), variant: el.getAttribute('data-variant') }
}

describe('useDefaults', () => {
  it('without a provider returns the component own defaults', () => {
    const { container } = render(Probe)
    expect(read(container)).toEqual({ size: 'md', variant: 'primary' })
  })

  it('a global default overrides the component default', () => {
    const { container } = render(Host, {
      props: { defaults: { global: { size: 'lg' } } },
    })
    expect(read(container).size).toBe('lg')
  })

  it('a per-component default overrides the global one', () => {
    const { container } = render(Host, {
      props: { defaults: { global: { size: 'lg' }, SProbe: { size: 'sm' } } },
    })
    expect(read(container).size).toBe('sm')
  })

  it('an explicitly passed prop overrides any defaults', () => {
    const { container } = render(Host, {
      props: {
        defaults: { global: { size: 'lg' }, SProbe: { size: 'sm' } },
        probeProps: { size: 'md' },
      },
    })
    expect(read(container).size).toBe('md')
  })

  it('a prop set to undefined does not cancel the defaults', () => {
    const { container } = render(Host, {
      props: {
        defaults: { global: { size: 'lg' } },
        probeProps: { size: undefined },
      },
    })
    expect(read(container).size).toBe('lg')
  })

  it('a kebab-case prop set to undefined does not cancel the defaults either', () => {
    const KebabHost = defineComponent({
      setup() {
        provideDefaults(() => ({ SProbe: { variant: 'ghost' } }))
        return () => h(Probe, { variant: undefined })
      },
    })
    const { container } = render(KebabHost)
    expect(read(container).variant).toBe('ghost')
  })

  it('a kebab-case prop in the template also counts as explicit', () => {
    const KebabHost = defineComponent({
      setup() {
        provideDefaults(() => ({ SProbe: { variant: 'ghost' } }))
        return () => h(Probe, { variant: 'outline' })
      },
    })
    const { container } = render(KebabHost)
    expect(read(container).variant).toBe('outline')
  })

  it('a computed inside the component sees the prop become explicit', async () => {
    const ComputedProbe = defineComponent({
      name: 'SComputedProbe',
      props: { size: { type: String, default: 'md' } },
      setup(props) {
        const p = useDefaults(props, 'SComputedProbe')
        const derived = computed(() => `c:${p.size}`)
        return () => h('div', { 'data-size': p.size, 'data-derived': derived.value })
      },
    })

    const passed = ref(false)
    const App = defineComponent({
      setup() {
        provideDefaults(() => ({ SComputedProbe: { size: 'sm' } }))
        // The value equals the component own default: only the explicitness changes.
        return () => h(ComputedProbe, passed.value ? { size: 'md' } : null)
      },
    })

    const { container } = render(App)
    const el = () => container.querySelector('div')!
    expect(el().getAttribute('data-derived')).toBe('c:sm')

    passed.value = true
    await nextTick()
    expect(el().getAttribute('data-size')).toBe('md')
    expect(el().getAttribute('data-derived')).toBe('c:md')
  })

  it('defaults do not leak between different components', () => {
    const { container } = render(Host, {
      props: { defaults: { SOther: { size: 'lg' } } },
    })
    expect(read(container).size).toBe('md')
  })

  it('an undefined value in a nested layer keeps the outer one', () => {
    expect(
      mergeDefaults({ SButton: { variant: 'negative' } }, { SButton: { variant: undefined } }),
    ).toEqual({ SButton: { variant: 'negative' } })
  })
})
