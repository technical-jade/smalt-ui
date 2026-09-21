import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SSplitter } from '../index'

/** Panel sizes come from the real layout, which happy-dom does not have. */
describe('SSplitter · browser', () => {
  const size = () => screen.getByRole('separator').getAttribute('aria-valuenow')

  it('Enter on the handle collapses the panel before it and restores its size', async () => {
    render(SSplitter, {
      props: { panels: [{ defaultSize: 30, minSize: 20, collapsible: true }, { defaultSize: 70 }] },
      attrs: { style: 'width: 600px; height: 200px' },
    })
    screen.getByRole('separator').focus()
    await userEvent.keyboard('{Enter}')
    expect(size()).toBe('0')
    await userEvent.keyboard('{Enter}')
    expect(size()).toBe('30')
  })

  it('Enter does nothing when the panel is not collapsible', async () => {
    render(SSplitter, {
      props: { panels: [{ defaultSize: 30 }, { defaultSize: 70 }] },
      attrs: { style: 'width: 600px; height: 200px' },
    })
    screen.getByRole('separator').focus()
    await userEvent.keyboard('{Enter}')
    expect(size()).toBe('30')
  })
})
