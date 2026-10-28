import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { h, type Component } from 'vue'
import { SDateField, SInput, SNumberField, SSelect } from '../components'

const options = [{ value: 'a', label: 'Alpha' }]

const raised = (component: Component, props: Record<string, unknown>, width: number) => {
  const { container } = render({
    render: () =>
      h('div', { style: `width: ${width}px` }, [
        h(component, { floatingLabel: 'pinned', required: true, ...props }),
      ]),
  })
  const label = [...container.querySelectorAll('label')].find((el) =>
    el.textContent?.includes(String(props.label)),
  )!
  return { label, frame: label.parentElement! }
}

const truncated = (label: HTMLElement) => label.scrollWidth > label.clientWidth

// Truncation and the geometry of the scaled label are computed layout, which happy-dom lacks.
describe('floated label: truncation by the scaled width · browser', () => {
  const fields: [string, Component, Record<string, unknown>][] = [
    ['SInput', SInput, {}],
    ['SSelect', SSelect, { options }],
    ['SDateField', SDateField, {}],
    ['SNumberField', SNumberField, {}],
  ]

  for (const [name, component, props] of fields) {
    it(`${name}: a label that fits once scaled is not truncated`, () => {
      const { label } = raised(component, { ...props, label: 'Length (cm)' }, 108)
      expect(truncated(label)).toBe(false)
    })

    it(`${name}: a long label is truncated within the frame`, () => {
      const { label, frame } = raised(
        component,
        { ...props, label: 'A very long field label that does not fit at all' },
        140,
      )
      expect(truncated(label)).toBe(true)
      expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(
        frame.getBoundingClientRect().right,
      )
    })
  }

  it('SInput: the width of #prepend does not narrow the floated label', async () => {
    const { container } = render({
      render: () =>
        h('div', { style: 'width: 150px' }, [
          h(
            SInput,
            { label: 'Pickup address', floatingLabel: 'pinned' },
            { prepend: () => h('span', 'London, Baker') },
          ),
        ]),
    })
    const label = [...container.querySelectorAll('label')].find((el) =>
      el.textContent?.includes('Pickup address'),
    )!
    // The measured offset, not only the CSS fallback, must leave the floated label alone.
    await vi.waitFor(() =>
      expect(label.parentElement!.style.getPropertyValue('--s-field-label-x')).not.toBe(''),
    )
    expect(truncated(label)).toBe(false)
  })
})
