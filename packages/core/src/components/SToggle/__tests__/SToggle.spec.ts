import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SToggle } from '../index'

describe('SToggle', () => {
  it('renders a toggle button with content', () => {
    render(SToggle, { slots: { default: 'Bold' } })
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
  })

  it('toggles the state on click (v-model)', async () => {
    const { emitted } = render(SToggle, { slots: { default: 'B' } })
    await fireEvent.click(screen.getByRole('button'))
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual([true])
  })

  it('applies the size class', () => {
    const { container } = render(SToggle, { props: { size: 'lg' }, slots: { default: 'X' } })
    expect(container.querySelector('.s-toggle')).toHaveClass('s-toggle--lg')
  })

  it('variant sets the appearance modifier, tonal by default', async () => {
    const { container, rerender } = render(SToggle, { slots: { default: 'X' } })
    const toggle = container.querySelector('.s-toggle')
    expect(toggle).toHaveClass('s-toggle--tonal')
    await rerender({ variant: 'outline' })
    expect(toggle).toHaveClass('s-toggle--outline')
  })

  it('reflects the initial state via data-state', () => {
    render(SToggle, { props: { modelValue: true }, slots: { default: 'X' } })
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'on')
  })

  it('value outside SToggleGroup does not break rendering and works standalone', async () => {
    const { container } = render(SToggle, {
      props: { value: 'bold' },
      slots: { default: 'B' },
    })
    const button = container.querySelector('button')!
    expect(button).toBeInTheDocument()
    await fireEvent.click(button)
    expect(button).toHaveAttribute('data-state', 'on')
  })

  it('disabled disables the button', () => {
    render(SToggle, { props: { disabled: true }, slots: { default: 'X' } })
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
