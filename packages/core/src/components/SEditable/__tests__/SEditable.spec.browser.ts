import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SEditable } from '../index'

/**
 * happy-dom moves no focus of its own and measures nothing, so the two things this field lives
 * by — where focus lands around a commit and whether the box stays put when the text becomes an
 * input — can only be checked in a real browser.
 */
const renderEditable = (props: Record<string, unknown> = {}) => {
  const utils = render(SEditable, {
    props: { label: 'Title', modelValue: 'Quarterly report', ...props },
  })
  return {
    ...utils,
    area: utils.container.querySelector<HTMLElement>('.s-editable__area')!,
    preview: utils.container.querySelector<HTMLElement>('.s-editable__preview')!,
    input: utils.container.querySelector<HTMLInputElement>('.s-editable__input')!,
  }
}

describe('SEditable · browser', () => {
  it('moves focus into the input when the editor opens', async () => {
    const { preview, input } = renderEditable()
    preview.focus()
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    expect(input.value).toBe('Quarterly report')
  })

  it('gives focus back to the value after a commit', async () => {
    const { preview, input, emitted } = renderEditable()
    preview.focus()
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    await userEvent.fill(input, 'Annual report')
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(document.activeElement).toBe(preview))
    expect(emitted('submit')?.at(-1)).toEqual(['Annual report'])
    // Returning focus must not reopen the editor the user has just left.
    expect(input.hidden).toBe(true)
  })

  it('gives focus back to the value after a cancel', async () => {
    const { preview, input } = renderEditable()
    preview.focus()
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.activeElement).toBe(preview))
    expect(input.hidden).toBe(true)
  })

  it('keeps the box and the type scale when the text becomes an input', async () => {
    const { area, preview, input } = renderEditable()
    const restArea = area.getBoundingClientRect()
    const restText = preview.getBoundingClientRect()
    const previewFont = getComputedStyle(preview).fontSize

    preview.focus()
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    const editArea = area.getBoundingClientRect()
    const editText = input.getBoundingClientRect()

    expect(editArea.width).toBeCloseTo(restArea.width, 1)
    expect(editArea.height).toBeCloseTo(restArea.height, 1)
    expect(editArea.top).toBeCloseTo(restArea.top, 1)
    expect(editText.left).toBeCloseTo(restText.left, 1)
    expect(editText.width).toBeCloseTo(restText.width, 1)
    expect(Math.abs(editText.height - restText.height)).toBeLessThan(1)
    expect(getComputedStyle(input).fontSize).toBe(previewFont)
  })
})

describe('SEditable · controls · browser', () => {
  it('opens the editor from the edit control', async () => {
    const { container, preview } = renderEditable({
      withControls: true,
      activationMode: 'none',
      submitMode: 'none',
    })
    await userEvent.click(container.querySelector<HTMLElement>('.s-editable__controls button')!)
    const input = container.querySelector<HTMLInputElement>('.s-editable__input')!
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    expect(preview.hidden).toBe(true)
  })
})
