import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SFormField } from '../index'

describe('SFormField · browser', () => {
  it('the label above the field matches the hint font size at any size', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    const fontSizes = sizes.map((size) => {
      const { container, unmount } = render(SFormField, {
        props: { label: 'Name', hint: 'Hint', size },
        slots: { default: '<input />' },
      })
      const label = getComputedStyle(container.querySelector('.s-field__label')!).fontSize
      const hint = getComputedStyle(container.querySelector('.s-field__hint')!).fontSize
      unmount()
      return [label, hint]
    })
    for (const [label, hint] of fontSizes) expect(label).toBe(hint)
  })
})
