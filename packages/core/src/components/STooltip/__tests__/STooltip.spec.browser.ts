import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { STooltip } from '../index'

/**
 * `auto` mode reads the live event's `pointerType`, and the bubble is portaled to body; happy-dom
 * reproduces neither: there a PointerEvent arrives without a pointer type.
 */
describe('STooltip · browser', () => {
  const mount = (props: Record<string, unknown> = {}, body = 'Tooltip') => {
    render(STooltip, {
      props: { delayDuration: 0, ...props },
      slots: { trigger: '<button>Trigger</button>', default: body },
    })
    return screen.getByRole('button', { name: 'Trigger' })
  }

  /**
   * `userEvent` has no touch input, so the tap sequence is dispatched by hand. The browser moves
   * focus on the emulated mousedown unless a handler cancels it; here that is done by hand too.
   */
  const tap = async (el: Element) => {
    el.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }))
    el.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }))
    const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    if (el.dispatchEvent(mousedown)) (el as HTMLElement).focus()
    ;(el as HTMLElement).click()
  }

  const content = () => document.querySelector('.s-tooltip__content')

  it('auto: a tap opens the tooltip and a second tap closes it', async () => {
    const trigger = mount({ trigger: 'auto' })

    await tap(trigger)
    await expect.poll(() => content()?.textContent).toContain('Tooltip')

    await tap(trigger)
    await expect.poll(content).toBeNull()
  })

  it('auto: a tooltip opened by a tap closes on a press outside', async () => {
    const trigger = mount({ trigger: 'auto' })

    await tap(trigger)
    await expect.poll(() => content()?.textContent).toContain('Tooltip')

    await userEvent.click(document.body)
    await expect.poll(content).toBeNull()
  })

  it('auto: a tap on a link in a tooltip opened by a tap keeps it open', async () => {
    const trigger = mount({ trigger: 'auto' }, '<a href="#details">Details</a>')

    await tap(trigger)
    await expect.poll(() => content()?.textContent).toContain('Details')

    await tap(screen.getByRole('link', { name: 'Details' }))
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(content()?.textContent).toContain('Details')
  })

  it('auto: a field in the trigger still takes focus from a tap', async () => {
    render(STooltip, {
      props: { delayDuration: 0, trigger: 'auto', content: 'Format: 123-456' },
      slots: { trigger: '<input aria-label="Code" />' },
    })
    const field = screen.getByRole('textbox', { name: 'Code' })

    await tap(field)
    expect(document.activeElement).toBe(field)
  })

  it('auto: a mouse opens the tooltip on hover', async () => {
    const trigger = mount({ trigger: 'auto' })

    await userEvent.hover(trigger)
    await expect.poll(() => content()?.textContent).toContain('Tooltip')
  })

  it('click: hover does not open the tooltip', async () => {
    const trigger = mount({ trigger: 'click' })

    await userEvent.hover(trigger)
    await expect.poll(content).toBeNull()

    await userEvent.click(trigger)
    await expect.poll(() => content()?.textContent).toContain('Tooltip')
  })
})
