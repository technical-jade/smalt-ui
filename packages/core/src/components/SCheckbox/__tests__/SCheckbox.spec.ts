import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SCheckbox } from '../index'

describe('SCheckbox', () => {
  it('renders the label and associates it with the checkbox', () => {
    render(SCheckbox, { props: { label: 'I agree' } })
    expect(screen.getByRole('checkbox', { name: 'I agree' })).toBeInTheDocument()
  })

  it('toggles v-model on click', async () => {
    const { emitted } = render(SCheckbox, { props: { label: 'I agree', modelValue: false } })
    await fireEvent.click(screen.getByRole('checkbox', { name: 'I agree' }))
    expect(emitted()['update:modelValue']).toContainEqual([true])
  })

  it('disabled disables the checkbox', () => {
    render(SCheckbox, { props: { label: 'I agree', disabled: true } })
    expect(screen.getByRole('checkbox', { name: 'I agree' })).toBeDisabled()
  })

  it('reflects checked in data-state', () => {
    render(SCheckbox, { props: { label: 'I agree', modelValue: true } })
    expect(screen.getByRole('checkbox', { name: 'I agree' })).toHaveAttribute(
      'data-state',
      'checked',
    )
  })

  it('draws the check icon when checked', () => {
    const { container } = render(SCheckbox, { props: { label: 'I agree', modelValue: true } })
    expect(container.querySelector('.s-checkbox__indicator path')?.getAttribute('d')).toBe(
      'M20 6 9 17l-5-5',
    )
  })

  it('draws the indeterminate icon in the mixed state', () => {
    const { container } = render(SCheckbox, {
      props: { label: 'I agree', modelValue: 'indeterminate' },
    })
    expect(container.querySelector('.s-checkbox__indicator path')?.getAttribute('d')).toBe(
      'M5 12h14',
    )
  })

  it('hint and error are linked to the checkbox via aria-describedby', () => {
    const { rerender } = render(SCheckbox, {
      props: { label: 'I agree', hint: 'You can withdraw it' },
    })
    const box = screen.getByRole('checkbox')
    expect(box.getAttribute('aria-describedby')).toBe(screen.getByText('You can withdraw it').id)
    return rerender({ label: 'I agree', error: 'Required' }).then(() => {
      expect(box).toHaveAttribute('aria-invalid', 'true')
      expect(box.getAttribute('aria-describedby')).toBe(screen.getByText('Required').id)
    })
  })

  it('stretch spans the full row, align sets a modifier', () => {
    const { container } = render(SCheckbox, {
      props: { label: 'Insurance', stretch: true, align: 'center' },
    })
    expect(container.querySelector('.s-field')).not.toHaveClass('s-field--inline')
    expect(container.querySelector('.s-checkbox')).toHaveClass(
      's-checkbox--stretch',
      's-checkbox--align-center',
    )
  })

  it('class/style stay on the field, other attributes reach the checkbox', () => {
    const { container } = render(SCheckbox, {
      props: { ariaLabel: 'Select row' },
      attrs: { class: 'row-check', style: 'margin: 4px', 'data-testid': 'row-1' },
    })
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('row-check')
    expect(root.style.margin).toBe('4px')
    const box = screen.getByRole('checkbox', { name: 'Select row' })
    expect(box).toHaveAttribute('data-testid', 'row-1')
    expect(root).not.toHaveAttribute('data-testid')
  })

  it('aria-label passed as an attribute names the checkbox', () => {
    render(SCheckbox, { attrs: { 'aria-label': 'Select row' } })
    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument()
  })
})
