import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SPinInput } from '../index'

// Focus moves between cells from Reka's key handling, which happy-dom does not run for real.
describe('SPinInput · browser', () => {
  function setup() {
    const { container, emitted } = render(SPinInput, { props: { label: 'Code', length: 4 } })
    const cells = [...container.querySelectorAll<HTMLInputElement>('.s-pin-input__cell')]
    return { cells, emitted }
  }

  it('typing moves on to the next cell, Backspace goes back', async () => {
    const { cells } = setup()
    await userEvent.click(cells[0]!)
    await userEvent.keyboard('12')
    expect(document.activeElement).toBe(cells[2])
    await userEvent.keyboard('{Backspace}')
    expect(document.activeElement).toBe(cells[1])
  })

  it('arrows move between cells', async () => {
    const { cells } = setup()
    await userEvent.click(cells[0]!)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(cells[1])
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(cells[0])
  })

  it('pasting a code fills every cell and completes', async () => {
    const { cells, emitted } = setup()
    await userEvent.click(cells[0]!)
    // Playwright has no clipboard access here, so the paste event carries the text itself.
    const clipboardData = new DataTransfer()
    clipboardData.setData('text/plain', '4821')
    cells[0]!.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true }))
    await expect.poll(() => cells.map((cell) => cell.value)).toEqual(['4', '8', '2', '1'])
    expect(emitted().complete).toEqual([[['4', '8', '2', '1']]])
  })
})
