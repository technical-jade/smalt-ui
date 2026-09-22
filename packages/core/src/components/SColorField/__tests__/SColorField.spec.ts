import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { nextTick } from 'vue'
import { SColorField } from '../index'

describe('SColorField', () => {
  it('renders the label and the input', () => {
    render(SColorField, { props: { label: 'Primary color' } })
    expect(screen.getByText('Primary color')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows the model value in the input', () => {
    render(SColorField, { props: { modelValue: '#3B82F6' } })
    expect((screen.getByRole('textbox') as HTMLInputElement).value.toLowerCase()).toBe('#3b82f6')
  })

  it('paints the preview swatch with the current color', () => {
    const { container } = render(SColorField, { props: { modelValue: '#ff0000' } })
    const swatch = container.querySelector('.s-color-field__swatch') as HTMLElement
    expect(swatch.style.backgroundColor).toBe('#ff0000')
  })

  it('links the error and marks the field invalid', () => {
    render(SColorField, { props: { label: 'Color', error: 'Invalid format' } })
    expect(screen.getByText('Invalid format')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies the size class', () => {
    const { container } = render(SColorField, { props: { size: 'lg' } })
    expect(container.querySelector('.s-color-field')).toHaveClass('s-color-field--lg')
  })

  it('renders the prepend/append slots inside the border', () => {
    const { container } = render(SColorField, {
      slots: { prepend: () => 'P', append: () => 'A' },
    })
    const control = container.querySelector('.s-color-field__control')
    expect(control?.querySelector('.s-color-field__prepend')?.textContent).toBe('P')
    expect(control?.querySelector('.s-color-field__append')?.textContent).toBe('A')
  })

  it('class/style stay on the field, attributes and listeners reach the input', async () => {
    const onBlur = vi.fn()
    const { container } = render(SColorField, {
      props: { label: 'Brand color' },
      attrs: { class: 'brand', style: 'width: 200px', 'data-testid': 'brand', onBlur },
    })
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('s-color-field', 'brand')
    expect(root.style.width).toBe('200px')
    const input = screen.getByLabelText('Brand color')
    expect(input).toHaveAttribute('data-testid', 'brand')
    await fireEvent.blur(input)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('an empty value shows an empty input, not a default color', async () => {
    const { container } = render(SColorField, { props: { label: 'Brand color', modelValue: '' } })
    await nextTick()
    expect(screen.getByLabelText('Brand color')).toHaveValue('')
    expect(container.querySelector('.s-color-field__control')).not.toHaveAttribute('data-filled')
  })

  it('erasing the text clears the value', async () => {
    const { emitted } = render(SColorField, {
      props: { label: 'Brand color', modelValue: '#3b82f6' },
    })
    const input = screen.getByLabelText('Brand color')
    await fireEvent.focus(input)
    await fireEvent.update(input, '')
    await fireEvent.blur(input)
    await nextTick()
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([''])
    expect(input).toHaveValue('')
  })

  it('erasing the text and pressing Enter clears the value', async () => {
    const { emitted } = render(SColorField, {
      props: { label: 'Brand color', modelValue: '#3b82f6' },
    })
    const input = screen.getByLabelText('Brand color')
    await fireEvent.focus(input)
    await fireEvent.update(input, '')
    await fireEvent.keyDown(input, { key: 'Enter' })
    await nextTick()
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([''])
    expect(input).toHaveValue('')
  })

  it('clearing the value from outside empties the input', async () => {
    const { rerender } = render(SColorField, {
      props: { label: 'Brand color', modelValue: '#3b82f6' },
    })
    await rerender({ label: 'Brand color', modelValue: '' })
    await nextTick()
    expect(screen.getByLabelText('Brand color')).toHaveValue('')
  })
})
