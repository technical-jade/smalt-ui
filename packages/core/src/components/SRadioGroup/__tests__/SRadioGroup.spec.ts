import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SRadioGroup } from '../index'

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
]

describe('SRadioGroup', () => {
  it('renders options from the options prop', () => {
    render(SRadioGroup, { props: { options, ariaLabel: 'Choice' } })
    expect(screen.getByRole('radio', { name: 'One' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Two' })).toBeInTheDocument()
  })

  it('selecting an option updates v-model', async () => {
    const { emitted } = render(SRadioGroup, { props: { options, ariaLabel: 'Choice' } })
    await fireEvent.click(screen.getByRole('radio', { name: 'Two' }))
    expect(emitted()['update:modelValue']).toContainEqual(['two'])
  })

  it('disabled on the group disables the options', () => {
    render(SRadioGroup, { props: { options, ariaLabel: 'Choice', disabled: true } })
    expect(screen.getByRole('radio', { name: 'One' })).toBeDisabled()
  })

  it('label becomes the group accessible name, error marks it invalid', async () => {
    const { rerender } = render(SRadioGroup, {
      props: { label: 'Who are you', options },
    })
    const group = screen.getByRole('radiogroup', { name: 'Who are you' })
    await rerender({ label: 'Who are you', options, error: 'Choose an option' })
    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(group.getAttribute('aria-describedby')).toBe(screen.getByText('Choose an option').id)
  })

  it('groupClass goes to the options container, not the field wrapper', () => {
    const { container } = render(SRadioGroup, {
      props: { options, ariaLabel: 'Choice', groupClass: 'tariffs' },
    })
    expect(container.querySelector('.s-radio-group')).toHaveClass('tariffs')
    expect(container.querySelector('.s-field')).not.toHaveClass('tariffs')
  })

  it('consumer attributes go to the radiogroup, class and style stay on the field', () => {
    const { container } = render(SRadioGroup, {
      props: { options, ariaLabel: 'Choice' },
      attrs: {
        class: 'outer',
        style: 'margin: 4px',
        'data-testid': 'plan',
        'aria-labelledby': 'x',
      },
    })
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('data-testid', 'plan')
    // A field binding: the group keeps the name it builds itself.
    expect(group).toHaveAccessibleName('Choice')
    const field = container.querySelector('.s-field')!
    expect(field).toHaveClass('outer')
    expect(field).toHaveStyle({ margin: '4px' })
    expect(field).not.toHaveAttribute('data-testid')
  })
})
