import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { installDefaults } from '../../../composables'
import { STabs } from '../index'

const items = [
  { value: 'a', label: 'Tab A' },
  { value: 'b', label: 'Tab B' },
]

describe('STabs', () => {
  it('renders the tabs and the active tab content', () => {
    render(STabs, {
      props: { items, modelValue: 'a', ariaLabel: 'Sections' },
      slots: { a: 'Content A', b: 'Content B' },
    })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toBeInTheDocument()
    expect(screen.getByText('Content A')).toBeInTheDocument()
  })

  it('clicking a tab updates v-model', async () => {
    const { emitted } = render(STabs, {
      props: { items, modelValue: 'a', ariaLabel: 'Sections' },
      slots: { a: 'Content A', b: 'Content B' },
    })
    // Reka Tabs (automatic) activates a tab on focus.
    await fireEvent.focus(screen.getByRole('tab', { name: 'Tab B' }))
    expect(emitted()['update:modelValue']).toContainEqual(['b'])
  })

  it('renders the tab icon when set', () => {
    const { container } = render(STabs, {
      props: {
        items: [
          { value: 'a', label: 'A', icon: 'star' },
          { value: 'b', label: 'B' },
        ],
        modelValue: 'a',
        ariaLabel: 'Sections',
      },
      slots: { a: 'Content A', b: 'Content B' },
    })
    const triggers = container.querySelectorAll('.s-tabs__trigger')
    expect(triggers[0].querySelector('.s-icon')).not.toBeNull()
    expect(triggers[1].querySelector('.s-icon')).toBeNull()
  })

  it('activation-mode=manual: focusing a tab does not activate it', async () => {
    const { emitted } = render(STabs, {
      props: { items, modelValue: 'a', ariaLabel: 'Sections' },
      slots: { a: 'Content A', b: 'Content B' },
      global: { plugins: [(app) => installDefaults(app, { STabs: { activationMode: 'manual' } })] },
    })
    await fireEvent.focus(screen.getByRole('tab', { name: 'Tab B' }))
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('unmount-on-hide=false keeps inactive panels mounted and hidden', () => {
    render(STabs, {
      props: { items, modelValue: 'a', ariaLabel: 'Sections' },
      slots: { a: 'Content A', b: 'Content B' },
      global: { plugins: [(app) => installDefaults(app, { STabs: { unmountOnHide: false } })] },
    })
    expect(screen.getByText('Content B')).not.toBeVisible()
  })
})
