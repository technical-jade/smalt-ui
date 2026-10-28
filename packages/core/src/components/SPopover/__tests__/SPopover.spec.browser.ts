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
  const open = async (props: Record<string, unknown>, attrs: Record<string, unknown> = {}) => {
    render(SPopover, {
      props,
      attrs,
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

  it('--s-popover-border colors both the panel border and the arrow stroke', async () => {
    const panel = await open({}, { style: '--s-popover-border: rgb(0, 128, 0)' })
    expect(getComputedStyle(panel).borderTopColor).toBe('rgb(0, 128, 0)')
    expect(getComputedStyle(panel.querySelector('.s-popover__arrow')!).stroke).toBe(
      'rgb(0, 128, 0)',
    )
  })

  it('the arrow stroke matches the border width: it does not scale with the arrow', async () => {
    const panel = await open({})
    const path = panel.querySelector('.s-popover__arrow path')!
    expect(getComputedStyle(path).vectorEffect).toBe('non-scaling-stroke')
  })

  const openIn = async (wrapperStyle: string) => {
    render({
      components: { SPopover },
      template: `
        <div style="height: 3000px">
          <div style="${wrapperStyle}">
            <SPopover><template #trigger><button>Open</button></template>Content</SPopover>
          </div>
        </div>`,
    })
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await screen.findByText('Content')
    const wrapper = document.querySelector<HTMLElement>('[data-reka-popper-content-wrapper]')!
    return { wrapper, trigger: screen.getByRole('button', { name: 'Open' }) }
  }

  it('in the page flow the panel scrolls with the page without waiting for an update', async () => {
    const { wrapper, trigger } = await openIn('padding-top: 200px')
    const gap = () => wrapper.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom
    await expect.poll(gap).toBeGreaterThan(0)
    const before = gap()
    // Measured in the same task as the scroll: the scroll handler has not repositioned it yet.
    window.scrollBy(0, 120)
    try {
      expect(gap()).toBeCloseTo(before, 0)
    } finally {
      window.scrollTo(0, 0)
    }
  })

  it('for a trigger in a pinned block the panel stays fixed', async () => {
    const { wrapper } = await openIn('position: sticky; top: 0')
    expect(getComputedStyle(wrapper).position).toBe('fixed')
  })
})
