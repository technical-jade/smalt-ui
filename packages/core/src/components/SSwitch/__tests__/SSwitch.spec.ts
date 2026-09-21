import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SSwitch } from '../index'

describe('SSwitch', () => {
  it('renders the label and links it to the switch', () => {
    render(SSwitch, { props: { label: 'Notifications' } })
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('toggles v-model on click', async () => {
    const { emitted } = render(SSwitch, { props: { label: 'Notifications', modelValue: false } })
    await fireEvent.click(screen.getByRole('switch', { name: 'Notifications' }))
    expect(emitted()['update:modelValue']).toContainEqual([true])
  })

  it('disabled disables the switch', () => {
    render(SSwitch, { props: { label: 'Notifications', disabled: true } })
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeDisabled()
  })

  it('reflects checked in data-state', () => {
    render(SSwitch, { props: { label: 'Notifications', modelValue: true } })
    expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAttribute(
      'data-state',
      'checked',
    )
  })

  it('class/style stay on the root, other attributes reach the switch', () => {
    const { container } = render(SSwitch, {
      attrs: { 'aria-label': 'Wi-Fi', class: 'wifi', style: 'margin: 4px', 'data-testid': 'wifi' },
    })
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('s-switch', 'wifi')
    expect(root.style.margin).toBe('4px')
    expect(root).not.toHaveAttribute('data-testid')
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toHaveAttribute('data-testid', 'wifi')
  })
})
