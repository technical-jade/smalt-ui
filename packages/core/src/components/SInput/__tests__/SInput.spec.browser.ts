import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SInput } from '../index'

/**
 * happy-dom moves no focus on a real click and keeps no caret, so the reveal toggle looks
 * harmless there even if it took the focus away from the field or sent the caret to the start.
 */
describe('SInput · browser', () => {
  it('the reveal toggle leaves focus in the field', async () => {
    const { container } = render(SInput, {
      props: { label: 'Password', type: 'password', revealable: true, modelValue: 'secret' },
    })
    const input = container.querySelector<HTMLInputElement>('.s-input__field')!
    const toggle = container.querySelector<HTMLElement>('.s-input__reveal')!

    input.focus()
    await userEvent.click(toggle)
    expect(document.activeElement).toBe(input)
    expect(input.type).toBe('text')
    expect(input.value).toBe('secret')
  })

  it('the caret keeps its place, so typing continues where it was', async () => {
    const { container } = render(SInput, {
      props: { label: 'Password', type: 'password', revealable: true, modelValue: 'abd' },
    })
    const input = container.querySelector<HTMLInputElement>('.s-input__field')!
    input.focus()
    input.setSelectionRange(2, 2)
    await userEvent.click(container.querySelector<HTMLElement>('.s-input__reveal')!)
    expect(input.selectionStart).toBe(2)
    await userEvent.keyboard('c')
    expect(input.value).toBe('abcd')
  })

  it('a click on the suffix or the prefix focuses the field', async () => {
    const { container } = render(SInput, {
      props: { label: 'Price', prefix: '$', suffix: 'USD', modelValue: '10' },
    })
    const input = container.querySelector<HTMLInputElement>('.s-input__field')!
    const [prefix, suffix] = container.querySelectorAll<HTMLElement>('.s-input__affix')
    // The affix catches no clicks (pointer-events: none), so the click lands on the frame below.
    await userEvent.click(suffix, { force: true })
    expect(document.activeElement).toBe(input)
    input.blur()
    await userEvent.click(prefix, { force: true })
    expect(document.activeElement).toBe(input)
  })

  it('a click on the frame next to the icon focuses the field', async () => {
    const { container } = render(SInput, { props: { label: 'Search', icon: 'search' } })
    const input = container.querySelector<HTMLInputElement>('.s-input__field')!
    await userEvent.click(container.querySelector<HTMLElement>('.s-input__icon')!, { force: true })
    expect(document.activeElement).toBe(input)
  })

  it('a button in the append slot keeps focus to itself', async () => {
    const { container } = render(SInput, {
      props: { label: 'Search' },
      slots: { append: '<button type="button" class="probe">go</button>' },
    })
    const button = container.querySelector<HTMLButtonElement>('.probe')!
    await userEvent.click(button)
    expect(document.activeElement).toBe(button)
  })
})
