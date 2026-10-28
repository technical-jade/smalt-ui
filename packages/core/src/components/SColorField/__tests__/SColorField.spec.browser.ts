import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SColorField } from '../index'

// happy-dom moves no focus on a real click, so a click on the frame is checked in the browser.
describe('SColorField · browser', () => {
  it('a click on the swatch focuses the field', async () => {
    const { container } = render(SColorField, { props: { label: 'Color', modelValue: '#ff0000' } })
    const input = container.querySelector<HTMLInputElement>('.s-color-field__input')!
    await userEvent.click(container.querySelector<HTMLElement>('.s-color-field__swatch')!)
    expect(document.activeElement).toBe(input)
  })

  it('a button in the append slot keeps focus to itself', async () => {
    const { container } = render(SColorField, {
      props: { label: 'Color' },
      slots: { append: '<button type="button" class="probe">go</button>' },
    })
    const button = container.querySelector<HTMLButtonElement>('.probe')!
    await userEvent.click(button)
    expect(document.activeElement).toBe(button)
  })
})
