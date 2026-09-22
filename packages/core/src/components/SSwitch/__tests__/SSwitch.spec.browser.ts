import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { nextTick } from 'vue'
import { userEvent } from 'vitest/browser'
import { SSwitch } from '../index'

/**
 * `SwitchRoot` merges `$attrs` after its own `aria-label` fallback, so our own
 * `:aria-label="p.ariaLabel"` (`undefined` without the prop) always wipes that fallback: the
 * accessible name falls back to the native `<label for>` association, which excludes
 * `aria-hidden` content. Unlike `SCheckbox`, no `aria-labelledby` fix is needed here.
 */
describe('SSwitch · browser', () => {
  it('keeps the asterisk out of the accessible name with a required prop label', async () => {
    render(SSwitch, { props: { label: 'Accept the terms', required: true } })
    await nextTick()
    const control = screen.getByRole('switch', { name: 'Accept the terms' })
    expect(control).not.toHaveAttribute('aria-label')
    expect(screen.queryByRole('switch', { name: /\*/ })).toBeNull()
  })

  it('keeps the asterisk out of the accessible name with a required slot label', async () => {
    render(SSwitch, {
      props: { required: true },
      slots: { default: 'Accept the terms' },
    })
    await nextTick()
    expect(screen.getByRole('switch', { name: 'Accept the terms' })).toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: /\*/ })).toBeNull()
  })

  it('resolves the same accessible name without required', async () => {
    render(SSwitch, { props: { label: 'Accept the terms' } })
    await nextTick()
    expect(screen.getByRole('switch', { name: 'Accept the terms' })).toBeInTheDocument()
  })

  it('falls back to ariaLabel without a visible label', async () => {
    render(SSwitch, { props: { ariaLabel: 'Wi-Fi', required: true } })
    await nextTick()
    const control = screen.getByRole('switch', { name: 'Wi-Fi' })
    expect(control).toHaveAttribute('aria-label', 'Wi-Fi')
    expect(control).toHaveAttribute('aria-required', 'true')
  })

  it('clicking the label toggles the switch', async () => {
    const { emitted } = render(SSwitch, {
      props: { label: 'Accept the terms', modelValue: false },
    })
    await nextTick()
    await userEvent.click(screen.getByText('Accept the terms'))
    expect(emitted()['update:modelValue']).toContainEqual([true])
  })
})
