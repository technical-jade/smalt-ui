import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SRadioGroup } from '../index'

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' },
]

/**
 * A quick arrow press must select the option it moves to (WAI-ARIA radio group). Reka selects
 * only while the key is held, so the group completes the selection; the timing exists only in a
 * real browser.
 */
describe('SRadioGroup · browser', () => {
  it('a quick arrow press moves focus and selects the option', async () => {
    const { emitted } = render(SRadioGroup, {
      props: { options, ariaLabel: 'Choice', modelValue: 'one' },
    })
    await userEvent.click(screen.getByRole('radio', { name: 'One' }))
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Two' }))
    await expect.poll(() => emitted()['update:modelValue']?.at(-1)).toEqual(['two'])
  })
})
