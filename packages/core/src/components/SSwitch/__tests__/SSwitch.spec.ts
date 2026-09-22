import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { flushPromises, mount } from '@vue/test-utils'
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

  it('class/style stay on the field, other attributes reach the switch', () => {
    const { container } = render(SSwitch, {
      attrs: { 'aria-label': 'Wi-Fi', class: 'wifi', style: 'margin: 4px', 'data-testid': 'wifi' },
    })
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('s-field', 'wifi')
    expect(root.style.margin).toBe('4px')
    expect(root).not.toHaveAttribute('data-testid')
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toHaveAttribute('data-testid', 'wifi')
  })

  it('shows the hint below the switch and links it', () => {
    render(SSwitch, { props: { label: 'Notifications', hint: 'Sent daily' } })
    expect(screen.getByText('Sent daily')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAccessibleDescription(
      'Sent daily',
    )
  })

  it('error marks the switch invalid and describes it', () => {
    render(SSwitch, { props: { label: 'Terms', error: 'Accept the terms' } })
    const control = screen.getByRole('switch', { name: 'Terms' })
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAccessibleDescription('Accept the terms')
  })

  it('invalid marks the switch without a message', () => {
    render(SSwitch, { props: { label: 'Terms', invalid: true } })
    expect(screen.getByRole('switch', { name: 'Terms' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('required shows the label marker and sets aria-required', () => {
    render(SSwitch, { props: { label: 'Notifications', required: true } })
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAttribute(
      'aria-required',
      'true',
    )
  })

  it('hides the marker without required', () => {
    render(SSwitch, { props: { label: 'Notifications' } })
    expect(screen.queryByText('*')).toBeNull()
  })

  it('a failed rule shows its message after validate()', async () => {
    const wrapper = mount(SSwitch, {
      props: { label: 'Terms', rules: [(on: boolean) => on || 'Accept the terms'] },
    })
    expect(await (wrapper.vm as unknown as { validate(): Promise<boolean> }).validate()).toBe(false)
    await flushPromises()
    expect(wrapper.find('.s-field__error').text()).toBe('Accept the terms')
    expect(wrapper.find('[role="switch"]').attributes('aria-invalid')).toBe('true')
  })
})
