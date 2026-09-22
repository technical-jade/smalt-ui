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

  it('removing a middle panel keeps the state of the panels after it', async () => {
    const panels = [
      { name: 'a', defaultSize: 20 },
      { name: 'b', defaultSize: 30 },
      { name: 'c', defaultSize: 50 },
    ]
    const { container, rerender } = render(SSplitter, {
      props: { panels },
      slots: { a: 'A', b: 'B', c: 'C' },
      attrs: { style: 'width: 600px; height: 200px' },
    })
    const panelOf = (text: string) =>
      [...container.querySelectorAll('.s-splitter__panel')].find((el) => el.textContent === text)
    const before = panelOf('C')!
    const id = before.getAttribute('data-panel-id')
    await rerender({ panels: [panels[0], panels[2]] })
    const after = panelOf('C')!
    expect(after).toBe(before)
    expect(after.getAttribute('data-panel-id')).toBe(id)
  })
})
