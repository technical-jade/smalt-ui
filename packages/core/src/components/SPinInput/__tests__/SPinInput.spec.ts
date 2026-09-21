import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SPinInput } from '../index'

describe('SPinInput', () => {
  it('renders length cells', () => {
    const { container } = render(SPinInput, { props: { length: 6, label: 'Code' } })
    expect(container.querySelectorAll('.s-pin-input__cell')).toHaveLength(6)
  })

  it('has 4 cells by default', () => {
    const { container } = render(SPinInput, { props: { label: 'Code' } })
    expect(container.querySelectorAll('.s-pin-input__cell')).toHaveLength(4)
  })

  it('typing a character updates v-model', async () => {
    const { emitted } = render(SPinInput, { props: { length: 4, label: 'Code' } })
    const first = screen.getAllByRole('textbox')[0]
    await fireEvent.update(first, '7')
    expect(emitted()['update:modelValue']).toBeTruthy()
    const last = emitted()['update:modelValue'].at(-1) as string[][] | undefined
    expect(last?.[0]).toContain('7')
  })

  it('mask hides characters (type=password on cells)', () => {
    const { container } = render(SPinInput, { props: { length: 4, mask: true, label: 'Code' } })
    const cell = container.querySelector('.s-pin-input__cell') as HTMLInputElement
    expect(cell.type).toBe('password')
  })

  it('disabled disables the cells', () => {
    const { container } = render(SPinInput, { props: { length: 4, disabled: true, label: 'Code' } })
    expect(container.querySelector('.s-pin-input__cell')).toBeDisabled()
  })

  it('renders the prepend/append slots inside the border', () => {
    const { container } = render(SPinInput, {
      props: { length: 4, label: 'Code' },
      slots: {
        prepend: '<span data-test="pre">P</span>',
        append: '<span data-test="app">A</span>',
      },
    })
    const wrap = container.querySelector('.s-pin-input__wrap')
    expect(wrap?.querySelector('.s-pin-input__prepend [data-test="pre"]')).toBeTruthy()
    expect(wrap?.querySelector('.s-pin-input__append [data-test="app"]')).toBeTruthy()
  })

  it('focus/blur fire once for the group, not when moving between cells', async () => {
    const { container, emitted } = render(SPinInput, { props: { label: 'Code', length: 2 } })
    const [first, second] = container.querySelectorAll('.s-pin-input__cell')
    await fireEvent.focusIn(first!)
    await fireEvent.focusOut(first!, { relatedTarget: second })
    await fireEvent.focusIn(second!, { relatedTarget: first })
    expect(emitted().focus).toHaveLength(1)
    expect(emitted().blur).toBeUndefined()
    await fireEvent.focusOut(second!, { relatedTarget: document.body })
    expect(emitted().blur).toHaveLength(1)
  })
})
