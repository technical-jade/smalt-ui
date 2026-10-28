import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SDrawer } from '../index'

/**
 * The smaller of the two corner radii in pixels: a corner is square if either is zero. The browser
 * returns a radius with percentages as an expression, so it is resolved by the child of a probe
 * box of the panel size: percentages there are taken from the same sides.
 */
function cornerRadius(el: HTMLElement, side: 'left' | 'right', edge: 'top' | 'bottom' = 'top') {
  const value = getComputedStyle(el).getPropertyValue(`border-${edge}-${side}-radius`)
  const parts = value.match(/(?:[^\s(]+|\([^)]*\))+/g)!
  const [x, y = x] = parts
  const box = document.createElement('div')
  box.style.cssText = `position: fixed; width: ${el.offsetWidth}px; height: ${el.offsetHeight}px`
  const probe = box.appendChild(document.createElement('div'))
  probe.style.cssText = `width: ${x}; height: ${y}`
  document.body.append(box)
  const { width, height } = probe.getBoundingClientRect()
  box.remove()
  return Math.min(width, height)
}

/**
 * Position of the border line relative to the window: a negative value means the line is past
 * the screen edge. The border is drawn by the ::before layer, so its offset is added to the panel
 * position.
 */
async function edgeLine(el: HTMLElement, side: 'left' | 'top') {
  // While the drawer slides in, it is shifted off the screen.
  await Promise.all(el.getAnimations().map((animation) => animation.finished))
  const offset = parseFloat(getComputedStyle(el, '::before')[side])
  return el.getBoundingClientRect()[side] + offset
}

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

describe('SDrawer · size', () => {
  it('width="100%" spans the window without rounding or a border line', async () => {
    render(SDrawer, {
      props: { open: true, title: 'Menu', width: '100%' },
      slots: { default: 'Body' },
    })
    const dialog = await screen.findByRole('dialog')
    expect(Math.round(dialog.getBoundingClientRect().width)).toBe(window.innerWidth)
    expect(cornerRadius(dialog, 'left')).toBe(0)
    expect(await edgeLine(dialog, 'left')).toBeLessThan(0)
  })

  it('a drawer narrower than the screen is rounded and bordered on the page side', async () => {
    render(SDrawer, { props: { open: true, title: 'Menu' }, slots: { default: 'Body' } })
    const dialog = await screen.findByRole('dialog')
    expect(cornerRadius(dialog, 'left')).toBeGreaterThan(0)
    expect(await edgeLine(dialog, 'left')).toBeGreaterThanOrEqual(0)
  })

  it('a width larger than the screen is capped by it', async () => {
    render(SDrawer, {
      props: { open: true, title: 'Menu', width: 5000 },
      slots: { default: 'Body' },
    })
    const dialog = await screen.findByRole('dialog')
    expect(Math.round(dialog.getBoundingClientRect().width)).toBe(window.innerWidth)
    expect(cornerRadius(dialog, 'left')).toBe(0)
  })

  it('a bottom drawer with height="100%" has neither rounding nor a border line', async () => {
    render(SDrawer, {
      props: { open: true, title: 'Menu', side: 'bottom', height: '100%' },
      slots: { default: 'Body' },
    })
    const dialog = await screen.findByRole('dialog')
    expect(cornerRadius(dialog, 'left', 'top')).toBe(0)
    expect(await edgeLine(dialog, 'top')).toBeLessThan(0)
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
