import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SLoadingOverlay } from '../index'

const overlay = () => document.querySelector('.s-loading-overlay')

describe('SLoadingOverlay', () => {
  it('renders nothing while closed', () => {
    render(SLoadingOverlay)
    expect(overlay()).toBeNull()
  })

  it('covers the region and announces the busy state when open', () => {
    render(SLoadingOverlay, { props: { open: true } })
    expect(overlay()).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })

  it('takes the label from the dictionary and from the prop', async () => {
    const { rerender } = render(SLoadingOverlay, { props: { open: true } })
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
    await rerender({ open: true, label: 'Fetching invoices' })
    expect(screen.getByRole('status')).toHaveTextContent('Fetching invoices')
  })

  it('keeps the label for screen readers with hide-label', () => {
    render(SLoadingOverlay, { props: { open: true, hideLabel: true } })
    const label = screen.getByRole('status')
    expect(label).toHaveTextContent('Loading')
    expect(label).toHaveClass('s-loading-overlay__label--hidden')
  })

  it('shows the spinner by default and drops it on demand', () => {
    const { unmount } = render(SLoadingOverlay, { props: { open: true } })
    expect(document.querySelector('.s-spinner')).not.toBeNull()
    unmount()
    render(SLoadingOverlay, { props: { open: true, spinner: false } })
    expect(document.querySelector('.s-spinner')).toBeNull()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('tints the spinner with the color prop and leaves the label alone', () => {
    render(SLoadingOverlay, { props: { open: true, color: 'teal' } })

    const spinner = document.querySelector<HTMLElement>('.s-spinner')!
    expect(spinner.style.cssText).toContain('--s-spinner-c: var(--s-teal)')
    expect(document.querySelector<HTMLElement>('.s-loading-overlay__label')!.style.cssText).toBe('')
  })

  it('leaves the spinner on its own color without the prop', () => {
    render(SLoadingOverlay, { props: { open: true } })

    expect(document.querySelector<HTMLElement>('.s-spinner')!.style.cssText).not.toContain(
      '--s-spinner-c',
    )
  })

  it('lets the default slot replace the spinner and the label', () => {
    render(SLoadingOverlay, {
      props: { open: true },
      slots: { default: '<span>42%</span>' },
    })
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(document.querySelector('.s-spinner')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('switches to the fullscreen modifier', () => {
    render(SLoadingOverlay, { props: { open: true, fullscreen: true } })
    expect(overlay()).toHaveClass('s-loading-overlay--fullscreen')
  })

  it('applies the size modifier', () => {
    render(SLoadingOverlay, { props: { open: true, size: 'lg' } })
    expect(overlay()).toHaveClass('s-loading-overlay--lg')
    expect(document.querySelector('.s-spinner')).toHaveClass('s-spinner--lg')
  })

  it('sends blur and opacity to the backdrop styling', () => {
    render(SLoadingOverlay, { props: { open: true, blur: true, opacity: 0.25 } })
    expect(overlay()).toHaveClass('s-loading-overlay--blur')
    expect(overlay()?.getAttribute('style')).toContain('--s-loading-overlay-opacity: 0.25')
  })

  // The root is a Transition, so fallthrough attributes are bound by hand.
  it('passes the consumer class and attributes to the covering element', () => {
    render(SLoadingOverlay, {
      props: { open: true },
      attrs: { class: 'my-overlay', 'data-testid': 'busy' },
    })
    expect(overlay()).toHaveClass('my-overlay')
    expect(overlay()).toHaveAttribute('data-testid', 'busy')
  })
})
