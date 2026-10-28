import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { h, nextTick, ref, type Component } from 'vue'
import {
  SAutocomplete,
  SColorField,
  SDateField,
  SDatePicker,
  SDateRangePicker,
  SInput,
  SSelect,
  STextarea,
  STimeField,
} from '../components'

const options = [{ value: 'a', label: 'Alpha' }]

const fields: [string, Component, Record<string, unknown>][] = [
  ['SInput', SInput, {}],
  ['STextarea', STextarea, {}],
  ['SSelect', SSelect, { options }],
  ['SSelect searchable', SSelect, { options, searchable: true }],
  ['SAutocomplete', SAutocomplete, { options: [], floatingLabel: true }],
  ['SColorField', SColorField, {}],
  ['SDateField', SDateField, {}],
  ['STimeField', STimeField, {}],
  ['SDatePicker', SDatePicker, {}],
  ['SDateRangePicker', SDateRangePicker, {}],
]

const labelOf = (container: Element) =>
  [...container.querySelectorAll('label')].find((el) => el.textContent?.includes('Pickup address'))!

// The label position depends on layout, which happy-dom does not compute.
describe('resting floating label and leading content · browser', () => {
  for (const [name, component, props] of fields) {
    it(`${name}: the label does not overlap the text in #prepend`, async () => {
      const { container } = render(component, {
        props: { floatingLabel: true, ...props, label: 'Pickup address' },
        slots: { prepend: () => h('span', 'London, Baker Street,') },
      })
      const prepend = screen.getByText('London, Baker Street,')
      await vi.waitFor(() => {
        expect(labelOf(container).getBoundingClientRect().left).toBeGreaterThanOrEqual(
          prepend.getBoundingClientRect().right,
        )
      })
    })
  }

  it('SInput: the label does not overlap the prefix', async () => {
    const { container } = render(SInput, {
      props: { label: 'Pickup address', prefix: 'London, Baker Street,' },
    })
    const prefix = container.querySelector('.s-input__affix')!
    await vi.waitFor(() => {
      expect(labelOf(container).getBoundingClientRect().left).toBeGreaterThanOrEqual(
        prefix.getBoundingClientRect().right,
      )
    })
  })

  it('SInput: the label follows #prepend when it changes width after mount', async () => {
    const text = ref('London,')
    const { container } = render({
      setup: () => () =>
        h(SInput, { label: 'Pickup address' }, { prepend: () => h('span', text.value) }),
    })
    const label = labelOf(container)
    const before = await vi.waitFor(() => {
      const left = label.getBoundingClientRect().left
      expect(left).toBeGreaterThan(0)
      return left
    })
    text.value = 'London, Baker Street, 221B,'
    await nextTick()
    const prepend = screen.getByText('London, Baker Street, 221B,')
    await vi.waitFor(() => {
      const left = label.getBoundingClientRect().left
      expect(left).toBeGreaterThan(before)
      expect(left).toBeGreaterThanOrEqual(prepend.getBoundingClientRect().right)
    })
  })

  // Slots are not reactive: the field learns about a late #prepend only from its own re-render.
  const lateFields: [string, Component][] = [
    ['SInput', SInput],
    ['STextarea', STextarea],
  ]
  for (const [name, component] of lateFields) {
    it(`${name}: the label moves past a #prepend that appears after mount`, async () => {
      const shown = ref(false)
      const { container } = render({
        setup: () => () =>
          h(
            component,
            { label: 'Pickup address' },
            shown.value ? { prepend: () => h('span', 'London, Baker Street,') } : {},
          ),
      })
      shown.value = true
      await nextTick()
      const prepend = screen.getByText('London, Baker Street,')
      await vi.waitFor(() => {
        expect(labelOf(container).getBoundingClientRect().left).toBeGreaterThanOrEqual(
          prepend.getBoundingClientRect().right,
        )
      })
    })
  }

  // A dialog opens from scale 0.96: client rects shrink with the transform, CSS pixels do not.
  it('SInput: the offset inside a scaled container equals the unscaled one', async () => {
    const field = () =>
      h(SInput, { label: 'Pickup address' }, { prepend: () => h('span', 'London, Baker Street,') })
    const { container } = render({
      setup: () => () =>
        h('div', [
          h('div', { class: 'plain' }, [field()]),
          h('div', { class: 'scaled', style: 'transform: scale(0.5)' }, [field()]),
        ]),
    })
    const offsetIn = (selector: string) =>
      container
        .querySelector<HTMLElement>(`${selector} .s-input__wrap`)!
        .style.getPropertyValue('--s-field-label-x')
    await vi.waitFor(() => {
      expect(offsetIn('.plain')).not.toBe('')
      expect(offsetIn('.scaled')).toBe(offsetIn('.plain'))
    })
  })
})
