import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { nextTick } from 'vue'
import { userEvent } from 'vitest/browser'
import { SCheckbox } from '../index'

/**
 * Reka's `CheckboxRoot` reads its `aria-label` fallback from `[for=id]`'s `innerText` once the
 * control's own ref settles, one tick after mount — happy-dom never computes `innerText`, so only
 * a real browser after that tick reproduces the required marker leaking into it.
 */
describe('SCheckbox · browser', () => {
  it('keeps the asterisk out of the accessible name with a required prop label', async () => {
    render(SCheckbox, { props: { label: 'I accept the terms', required: true } })
    await nextTick()
    const box = screen.getByRole('checkbox', { name: 'I accept the terms' })
    expect(box).toHaveAttribute('aria-labelledby')
    expect(screen.queryByRole('checkbox', { name: /\*/ })).toBeNull()
  })

  it('keeps the asterisk out of the accessible name with a required slot label', async () => {
    render(SCheckbox, {
      props: { required: true },
      slots: { default: 'Contains no dangerous goods' },
    })
    await nextTick()
    expect(
      screen.getByRole('checkbox', { name: 'Contains no dangerous goods' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: /\*/ })).toBeNull()
  })

  it('resolves the same accessible name without required', async () => {
    render(SCheckbox, { props: { label: 'I accept the terms' } })
    await nextTick()
    expect(screen.getByRole('checkbox', { name: 'I accept the terms' })).toBeInTheDocument()
  })

  it('falls back to ariaLabel without a visible label', async () => {
    render(SCheckbox, { props: { ariaLabel: 'Select row', required: true } })
    await nextTick()
    const box = screen.getByRole('checkbox', { name: 'Select row' })
    expect(box).not.toHaveAttribute('aria-labelledby')
    expect(box).toHaveAttribute('aria-required', 'true')
  })

  it('clicking the label toggles the checkbox', async () => {
    const { emitted } = render(SCheckbox, {
      props: { label: 'I accept the terms', modelValue: false },
    })
    await nextTick()
    await userEvent.click(screen.getByText('I accept the terms'))
    expect(emitted()['update:modelValue']).toContainEqual([true])
  })
})
