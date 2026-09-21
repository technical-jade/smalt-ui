import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SPopover } from '../index'

const triggerBtn = '<button type="button">Open</button>'

describe('SPopover', () => {
  it('renders the trigger, the panel is hidden by default', () => {
    render(SPopover, { slots: { trigger: triggerBtn, default: 'Body' } })
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
    expect(screen.queryByText('Body')).toBeNull()
  })

  it('opens on click (v-model:open)', async () => {
    const { emitted } = render(SPopover, {
      slots: { trigger: triggerBtn, default: 'Popover body' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(emitted()['update:open']).toBeTruthy()
    expect(await screen.findByText('Popover body')).toBeInTheDocument()
  })

  it('is open with open=true', async () => {
    render(SPopover, {
      props: { open: true },
      slots: { trigger: triggerBtn, default: 'Visible content' },
    })
    expect(await screen.findByText('Visible content')).toBeInTheDocument()
  })

  it('class, style and data attributes from the component land on the panel', async () => {
    render(SPopover, {
      props: { open: true },
      attrs: { class: 'filters', style: 'width: 320px', 'data-testid': 'filters-popover' },
      slots: { trigger: triggerBtn, default: 'Filters' },
    })
    const panel = await screen.findByRole('dialog')
    expect(panel).toHaveClass('s-popover__content', 'filters')
    expect(panel).toHaveAttribute('data-testid', 'filters-popover')
    expect(panel.style.width).toBe('320px')
  })
})
