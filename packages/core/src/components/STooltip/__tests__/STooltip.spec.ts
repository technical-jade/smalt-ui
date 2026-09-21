import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { STooltip } from '../index'

const mount = (props: Record<string, unknown> = {}) =>
  render(STooltip, {
    props: { content: 'Tooltip', ...props },
    slots: { trigger: '<button>Hover me</button>' },
  })

const triggerButton = () => screen.getByRole('button', { name: 'Hover me' })

/**
 * The tooltip text appears in the document twice: in the bubble itself and in the hidden
 * `role="tooltip"` node Reka keeps for `aria-describedby`. Querying by the bubble class tells
 * them apart.
 */
const content = () => document.querySelector('.s-tooltip__content')

describe('STooltip', () => {
  it('renders the trigger from the slot', () => {
    mount()
    expect(triggerButton()).toBeInTheDocument()
  })

  it('trigger="click" opens and closes the tooltip on press', async () => {
    mount({ trigger: 'click' })

    await fireEvent.click(triggerButton())
    await waitFor(() => expect(content()).toHaveTextContent('Tooltip'))

    await fireEvent.click(triggerButton())
    await waitFor(() => expect(content()).toBeNull())
  })

  it('a press does not open the tooltip by default', async () => {
    mount()
    await fireEvent.click(triggerButton())
    expect(content()).toBeNull()
  })

  it('opens programmatically via v-model:open', async () => {
    const { rerender } = mount({ open: true })
    await waitFor(() => expect(content()).toHaveTextContent('Tooltip'))

    await rerender({ content: 'Tooltip', open: false })
    await waitFor(() => expect(content()).toBeNull())
  })

  it('autoCloseDelay closes a tooltip opened by a press', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      mount({ trigger: 'click', autoCloseDelay: 1500 })

      await fireEvent.click(triggerButton())
      await waitFor(() => expect(content()).toHaveTextContent('Tooltip'))

      await vi.advanceTimersByTimeAsync(1500)
      await waitFor(() => expect(content()).toBeNull())
    } finally {
      vi.useRealTimers()
    }
  })

  it('class and data attributes from the component land on the bubble', async () => {
    render(STooltip, {
      props: { content: 'Tooltip', open: true },
      attrs: { class: 'hint', 'data-testid': 'hint' },
      slots: { trigger: '<button>Hover me</button>' },
    })
    await waitFor(() => expect(content()).toHaveClass('hint'))
    expect(content()).toHaveAttribute('data-testid', 'hint')
    expect(triggerButton()).not.toHaveAttribute('data-testid')
  })
})
