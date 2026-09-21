import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SDrawer } from '../index'

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
