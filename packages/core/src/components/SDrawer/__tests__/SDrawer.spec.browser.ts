import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SDrawer } from '../index'

describe('SDrawer · animation', () => {
  it('the drawer slides in on open and slides out before it unmounts', async () => {
    render(SDrawer, { props: { open: true, title: 'Menu' }, slots: { default: 'Body' } })
    const dialog = await screen.findByRole('dialog')
    expect(getComputedStyle(dialog).animationName).toBe('s-drawer-content-in')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(getComputedStyle(dialog).animationName).toBe('s-drawer-content-out')
    await expect.poll(() => document.querySelector('.s-drawer__content')).toBeNull()
  })
})

/** The body is a scroll container: whether it clips a focus ring shows only in real layout. */
describe('SDrawer · browser', () => {
  it('the body leaves room for the focus ring of a field at its edge', async () => {
    render(SDrawer, {
      props: { open: true, title: 'Filters' },
      slots: { default: '<input aria-label="Search" style="display: block; width: 100%" />' },
    })
    const dialog = await screen.findByRole('dialog')
    const body = dialog.querySelector('.s-drawer__body')!.getBoundingClientRect()
    const field = screen.getByLabelText('Search').getBoundingClientRect()
    const ring = 4 // --s-focus-ring-width + --s-focus-ring-offset
    expect(field.left - ring).toBeGreaterThanOrEqual(body.left)
    expect(field.right + ring).toBeLessThanOrEqual(body.right)
  })
})
