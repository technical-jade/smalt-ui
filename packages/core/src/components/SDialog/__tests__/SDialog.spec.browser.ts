import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SDialog } from '../index'

/**
 * Portals: content is teleported to body, outside the `.s-root` container. The focus trap,
 * closing on Escape and the overlay size can be checked only in a real browser.
 */
describe('SDialog · browser', () => {
  it('content is teleported out of the app subtree and receives focus', async () => {
    const { container } = render(SDialog, {
      props: { open: true, title: 'Title' },
      slots: { default: 'Content' },
    })
    const dialog = await screen.findByRole('dialog')
    // `body.contains` is true even without a teleport (the test mounts the app in body), so the
    // check is against the app container: the content must end up OUTSIDE it.
    expect(container.contains(dialog)).toBe(false)
    expect(document.body.contains(dialog)).toBe(true)
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('Escape closes the dialog', async () => {
    const { emitted } = render(SDialog, {
      props: { open: true, title: 'Title' },
      slots: { default: 'Content' },
    })
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    expect(emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('the overlay covers the whole page', async () => {
    render(SDialog, {
      props: { open: true, title: 'Title' },
      slots: { default: 'Content' },
    })
    await screen.findByRole('dialog')
    const overlay = document.querySelector('.s-dialog__overlay')!.getBoundingClientRect()
    expect(overlay.width).toBeGreaterThanOrEqual(window.innerWidth - 1)
    expect(overlay.height).toBeGreaterThanOrEqual(window.innerHeight - 1)
  })

  it('long content scrolls in the body; the title and the footer stay in view', async () => {
    render(SDialog, {
      props: { open: true, title: 'Terms' },
      slots: {
        default: '<div style="height: 3000px">Long text</div>',
        footer: '<button>Accept</button>',
      },
    })
    const dialog = await screen.findByRole('dialog')
    const body = dialog.querySelector<HTMLElement>('.s-dialog__body')!
    expect(dialog.scrollHeight).toBe(dialog.clientHeight)
    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight)
    const footer = screen.getByRole('button', { name: 'Accept' }).getBoundingClientRect()
    expect(footer.bottom).toBeLessThanOrEqual(window.innerHeight)
  })
})
