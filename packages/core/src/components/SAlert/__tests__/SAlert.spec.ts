import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SAlert } from '../index'

describe('SAlert', () => {
  it('renders the title and body in a live region', () => {
    render(SAlert, { props: { title: 'Attention' }, slots: { default: 'Something happened' } })
    // Non-urgent variants are announced politely (role=status); role=alert is for negative only.
    const alert = screen.getByRole('status')
    expect(alert).toHaveTextContent('Attention')
    expect(alert).toHaveTextContent('Something happened')
  })

  it('announces negative with the alert role', () => {
    render(SAlert, { props: { variant: 'negative' }, slots: { default: 'Error' } })
    expect(screen.getByRole('alert')).toHaveTextContent('Error')
  })

  it('applies the variant class', () => {
    const { container } = render(SAlert, {
      props: { variant: 'negative' },
      slots: { default: 'X' },
    })
    expect(container.querySelector('.s-alert')).toHaveClass('s-alert--negative')
  })

  it('announcement urgency follows variant', async () => {
    const { container, rerender } = render(SAlert, {
      props: { variant: 'info' },
      slots: { default: () => 'Text' },
    })
    const alert = () => container.querySelector('.s-alert')!
    expect(alert().getAttribute('aria-live')).toBe('polite')
    await rerender({ variant: 'negative' })
    expect(alert().getAttribute('aria-live')).toBe('assertive')
  })

  it('non-urgent variants use the status role (alert implies assertive)', () => {
    const { container } = render(SAlert, {
      props: { variant: 'info' },
      slots: { default: () => 'Text' },
    })
    expect(container.querySelector('.s-alert')?.getAttribute('role')).toBe('status')
  })

  it('closable shows the button and emits close', async () => {
    const { emitted } = render(SAlert, { props: { closable: true }, slots: { default: 'X' } })
    await fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(emitted().close).toHaveLength(1)
  })

  it('has no close button without closable', () => {
    render(SAlert, { slots: { default: 'X' } })
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })

  it('renders the variant status icon', () => {
    const { container } = render(SAlert, {
      props: { variant: 'positive' },
      slots: { default: 'X' },
    })
    expect(container.querySelector('.s-alert__icon .s-icon')).not.toBeNull()
  })

  it('the icon prop overrides the status icon', () => {
    const { container } = render(SAlert, {
      props: { variant: 'positive', icon: 'star' },
      slots: { default: 'X' },
    })
    expect(container.querySelector('.s-alert__icon .s-icon')).not.toBeNull()
  })

  it('the icon slot takes precedence over the prop', () => {
    const { container } = render(SAlert, {
      props: { variant: 'info', icon: 'star' },
      slots: { default: 'X', icon: '<i class="custom-icon" />' },
    })
    expect(container.querySelector('.custom-icon')).not.toBeNull()
  })

  it('closable hides the alert itself and still emits close', async () => {
    const { emitted } = render(SAlert, { props: { closable: true }, slots: { default: 'Saved' } })
    await fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Saved')).toBeNull()
    expect(emitted().close).toHaveLength(1)
    expect(emitted()['update:visible']).toEqual([[false]])
  })

  it('v-model:visible controls whether the alert is shown', async () => {
    const { rerender } = render(SAlert, { props: { visible: false }, slots: { default: 'Saved' } })
    expect(screen.queryByText('Saved')).toBeNull()
    await rerender({ visible: true })
    expect(screen.getByText('Saved')).toBeInTheDocument()
  })
})
