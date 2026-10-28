import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { STextarea } from '../index'

/**
 * The browser draws the native resize grip in the bottom right corner of the textarea box itself,
 * so its place is checked through the field geometry inside the frame, which happy-dom lacks.
 */
function measure(container: Element) {
  const frame = container.querySelector('.s-textarea__wrap')!.getBoundingClientRect()
  const fieldEl = container.querySelector<HTMLElement>('.s-textarea__field')!
  const field = fieldEl.getBoundingClientRect()
  const cs = getComputedStyle(fieldEl)
  const border = 1
  return {
    field: {
      right: frame.right - border - field.right,
      bottom: frame.bottom - border - field.bottom,
    },
    text: {
      left: field.left + parseFloat(cs.paddingLeft) - frame.left - border,
      right: frame.right - border - (field.right - parseFloat(cs.paddingRight)),
      top: field.top + parseFloat(cs.paddingTop) - frame.top - border,
      bottom: frame.bottom - border - (field.bottom - parseFloat(cs.paddingBottom)),
    },
  }
}

describe('STextarea · browser', () => {
  it.each([
    ['sm', 8],
    ['md', 12],
    ['lg', 16],
  ] as const)('the %s resize grip sits in the bottom right corner of the frame', (size, padX) => {
    const { container } = render(STextarea, { props: { size, label: 'Comment' } })
    const { field, text } = measure(container)
    expect(field).toEqual({ right: 0, bottom: 0 })
    expect(text).toEqual({ left: padX, right: padX, top: 8, bottom: 8 })
  })

  it('with append the text stays clear of it, and the grip stays in the frame corner', () => {
    const { container } = render(STextarea, {
      props: { label: 'Comment' },
      slots: { append: '<span style="display: inline-block; width: 20px; height: 20px"></span>' },
    })
    const { field, text } = measure(container)
    expect(field).toEqual({ right: 0, bottom: 0 })
    expect(text.right).toBe(12 + 40)
  })
})
