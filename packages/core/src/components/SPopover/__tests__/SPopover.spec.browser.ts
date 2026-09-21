import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SPopover } from '../index'

/**
 * The panel is teleported to body, and its shadow comes from the floating-surface mixin;
 * happy-dom does not compute styles. One portal case checks the mechanism shared by all
 * floating panels.
 */
describe('SPopover · browser', () => {
  const open = async (props: Record<string, unknown>) => {
    render(SPopover, {
      props,
      slots: { trigger: '<button>Open</button>', default: 'Content' },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await screen.findByText('Content')
    return document.querySelector('.s-popover__content')!
  }

  it('the panel has a shadow by default', async () => {
    expect(getComputedStyle(await open({})).boxShadow).not.toBe('none')
  })

  it('flat removes the shadow, square leaves it alone', async () => {
    expect(getComputedStyle(await open({ flat: true })).boxShadow).toBe('none')
  })

  it('square changes the radius but keeps the shadow', async () => {
    const panel = await open({ square: true })
    const styles = getComputedStyle(panel)
    expect(styles.borderTopLeftRadius).toBe('0px')
    expect(styles.boxShadow).not.toBe('none')
  })

  it('the arrow is stroked with the panel border color and visible without a shadow', async () => {
    const panel = await open({ flat: true })
    const styles = getComputedStyle(panel.querySelector('.s-popover__arrow')!)
    expect(styles.stroke).toBe(getComputedStyle(panel).borderTopColor)
    expect(styles.overflow).toBe('visible')
  })

  it('elevation sets the level', async () => {
    const flat = getComputedStyle(await open({ elevation: 0 })).boxShadow
    expect(flat).toBe('none')
  })

  it('long content scrolls within the space left on screen', async () => {
    render(SPopover, {
      slots: {
        trigger: '<button>Open</button>',
        default: '<div style="height: 3000px">Long content</div>',
      },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await screen.findByText('Long content')
    const panel = document.querySelector<HTMLElement>('.s-popover__content')!
    await expect
      .poll(() => panel.getBoundingClientRect().bottom)
      .toBeLessThanOrEqual(window.innerHeight)
    expect(panel.scrollHeight).toBeGreaterThan(panel.clientHeight)
  })
})
