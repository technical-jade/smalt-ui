import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SSelect } from '../index'
import type { SSelectOption } from '../types'

const options: SSelectOption[] = [
  { label: 'New York', value: 'ny', icon: 'star' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi', disabled: true },
]

describe('SSelect', () => {
  it('renders the trigger with a placeholder when no value is selected', () => {
    const { container } = render(SSelect, {
      props: { options, placeholder: 'Choose a city', ariaLabel: 'City' },
    })
    const trigger = container.querySelector('.s-select__trigger')
    expect(trigger).not.toBeNull()
    expect(trigger?.textContent).toContain('Choose a city')
  })

  it('required draws the required marker on the floating label', () => {
    const { container } = render(SSelect, {
      props: { options, label: 'City', required: true },
    })
    expect(container.querySelector('.s-select__label-required')).not.toBeNull()
  })

  it.each([
    ['dropdown', {}, '.s-select__trigger'],
    ['searchable', { searchable: true }, 'input'],
  ])('required is announced on the %s control', (_, extra, selector) => {
    const { container } = render(SSelect, {
      props: { options, label: 'City', required: true, ...extra },
    })
    expect(container.querySelector(selector)).toHaveAttribute('aria-required', 'true')
  })

  it('an empty string is not treated as a selected value', () => {
    const { container } = render(SSelect, {
      props: { options, label: 'City', modelValue: '', clearable: true },
    })
    expect(container.querySelector('.s-select__control')?.getAttribute('data-filled')).toBeNull()
    expect(container.querySelector('.s-select__clear')).toBeNull()
  })

  it('size sets the field size class', () => {
    const { container } = render(SSelect, { props: { options, size: 'sm' } })
    expect(container.querySelector('.s-select')).toHaveClass('s-select--sm')
  })

  it('passes the accessible name to the trigger', () => {
    const { container } = render(SSelect, {
      props: { options, placeholder: 'Choose', ariaLabel: 'City' },
    })
    expect(container.querySelector('.s-select__trigger')?.getAttribute('aria-label')).toBe('City')
  })

  it('disabled marks the trigger', () => {
    const { container } = render(SSelect, {
      props: { options, placeholder: 'Choose', ariaLabel: 'City', disabled: true },
    })
    expect(container.querySelector('.s-select__trigger')?.hasAttribute('data-disabled')).toBe(true)
  })

  it('renders the dropdown indicator icon (rightmost chevron)', () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'City' },
    })
    const control = container.querySelector('.s-select__control')!
    // The chevron is the last flex child of the frame (rightmost).
    expect(control.lastElementChild).toHaveClass('s-select__icon')
  })

  it('adornment order: text → clear → append → chevron', () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'City', clearable: true, modelValue: 'ny' },
      slots: { append: '<span class="test-append">A</span>' },
    })
    const control = container.querySelector('.s-select__control')!
    const idx = (cls: string) => [...control.children].findIndex((el) => el.classList.contains(cls))
    expect(idx('s-select__trigger')).toBeLessThan(idx('s-select__clear'))
    expect(idx('s-select__clear')).toBeLessThan(idx('s-select__append'))
    expect(idx('s-select__append')).toBeLessThan(idx('s-select__icon'))
  })

  it('clearable: the clear button is hidden without a selected value', () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'City', clearable: true },
    })
    expect(container.querySelector('.s-select__clear')).toBeNull()
  })

  it('clearable: the clear button is visible with a selected value', () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'City', clearable: true, modelValue: 'ny' },
    })
    expect(container.querySelector('.s-select__clear')).not.toBeNull()
  })

  it('clearable: resets the value on click', async () => {
    const { container, emitted } = render(SSelect, {
      props: { options, ariaLabel: 'City', clearable: true, modelValue: 'ny' },
    })
    await fireEvent.click(container.querySelector('.s-select__clear')!)
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([undefined])
  })

  it('renders a leading icon inside the field', () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'City', icon: 'search' },
    })
    expect(container.querySelector('.s-select__leading')).not.toBeNull()
  })

  it('renders the prepend/append slots inside the field frame', () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'City' },
      slots: {
        prepend: '<span class="test-prepend">before</span>',
        append: '<span class="test-append">after</span>',
      },
    })
    const control = container.querySelector('.s-select__control')
    expect(control?.querySelector('.s-select__prepend .test-prepend')).not.toBeNull()
    expect(control?.querySelector('.s-select__append .test-append')).not.toBeNull()
  })
})

describe('SSelect · searchable', () => {
  it('renders an input with a placeholder instead of the trigger', () => {
    render(SSelect, {
      props: { options, searchable: true, label: 'City', placeholder: 'Search cities' },
    })
    expect(screen.getByPlaceholderText('Search cities')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('the chevron button is the rightmost element of the frame', () => {
    const { container } = render(SSelect, {
      props: { options, searchable: true, ariaLabel: 'City' },
    })
    expect(container.querySelector('.s-select__control')!.lastElementChild).toHaveClass(
      's-select__toggle',
    )
  })

  it('opens the list and shows the options', async () => {
    render(SSelect, { props: { options, searchable: true, label: 'City' } })
    await fireEvent.click(screen.getByRole('button', { name: 'Show options' }))
    expect(await screen.findByRole('option', { name: 'New York' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Los Angeles' })).toBeInTheDocument()
  })

  it('selecting an option updates v-model', async () => {
    const { emitted } = render(SSelect, {
      props: { options, searchable: true, label: 'City' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Show options' }))
    await fireEvent.click(await screen.findByRole('option', { name: 'Los Angeles' }))
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['la'])
  })

  it('disabled disables the input', () => {
    render(SSelect, { props: { options, searchable: true, disabled: true, label: 'City' } })
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('clearable: resets the value on click', async () => {
    const { container, emitted } = render(SSelect, {
      props: { options, searchable: true, label: 'City', clearable: true, modelValue: 'ny' },
    })
    await fireEvent.click(container.querySelector('.s-select__clear')!)
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([undefined])
  })

  it('renders the leading icon and the prepend/append slots inside the frame', () => {
    const { container } = render(SSelect, {
      props: { options, searchable: true, label: 'City', icon: 'search' },
      slots: {
        prepend: '<span class="test-prepend">before</span>',
        append: '<span class="test-append">after</span>',
      },
    })
    const control = container.querySelector('.s-select__control')
    expect(control?.querySelector('.s-select__leading')).not.toBeNull()
    expect(control?.querySelector('.s-select__prepend .test-prepend')).not.toBeNull()
    expect(control?.querySelector('.s-select__append .test-append')).not.toBeNull()
  })
})

describe('SSelect · multiple / use-tags', () => {
  it('use-tags: renders STag chips for the selected values', () => {
    const { container } = render(SSelect, {
      props: { options, useTags: true, modelValue: ['ny', 'la'], ariaLabel: 'Cities' },
    })
    expect(container.querySelectorAll('.s-select__tag')).toHaveLength(2)
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('Los Angeles')).toBeInTheDocument()
  })

  it('use-tags: removing a chip removes the value from the array', async () => {
    const { emitted } = render(SSelect, {
      props: { options, useTags: true, modelValue: ['ny', 'la'], ariaLabel: 'Cities' },
    })
    const removeBtns = screen.getAllByRole('button', { name: 'Remove tag' })
    expect(removeBtns).toHaveLength(2)
    await fireEvent.click(removeBtns[0])
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([['la']])
  })

  it('use-tags also works in the searchable branch', () => {
    const { container } = render(SSelect, {
      props: { options, searchable: true, useTags: true, modelValue: ['ny'], label: 'Cities' },
    })
    expect(container.querySelectorAll('.s-select__tag')).toHaveLength(1)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('multiple (searchable): selected labels are comma-separated', () => {
    const { container } = render(SSelect, {
      props: {
        options,
        searchable: true,
        multiple: true,
        modelValue: ['ny', 'la'],
        label: 'Cities',
      },
    })
    expect(container.querySelector('.s-select__comma')?.textContent).toContain(
      'New York, Los Angeles',
    )
  })

  it('multiple: clear resets to an empty array', async () => {
    const { container, emitted } = render(SSelect, {
      props: { options, useTags: true, clearable: true, modelValue: ['ny'], ariaLabel: 'Cities' },
    })
    await fireEvent.click(container.querySelector('.s-select__clear')!)
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([[]])
  })

  it('the shadow variable goes to the panel along with the height limit', async () => {
    render(SSelect, {
      props: { options, ariaLabel: 'City', searchable: true, flat: true, maxHeight: 240 },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Show options' }))
    const style = document.querySelector('.s-select__content')?.getAttribute('style') ?? ''
    expect(style).toContain('--s-surface-elevation: none')
    expect(style).toContain('--s-select-max-height: 240px')
  })

  it('class/style stay on the field, other attributes reach the trigger', () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'Country' },
      attrs: { class: 'country', style: 'width: 240px', 'data-testid': 'country-select' },
    })
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('s-select', 'country')
    expect(root.style.width).toBe('240px')
    expect(root).not.toHaveAttribute('data-testid')
    expect(container.querySelector('.s-select__trigger')).toHaveAttribute(
      'data-testid',
      'country-select',
    )
  })

  it('searchable: attributes reach the input', () => {
    render(SSelect, {
      props: { options, label: 'Country', searchable: true },
      attrs: { autocomplete: 'country-name', 'data-testid': 'country-input' },
    })
    const input = screen.getByRole('combobox', { name: 'Country' })
    expect(input).toHaveAttribute('autocomplete', 'country-name')
    expect(input).toHaveAttribute('data-testid', 'country-input')
  })

  it('focus/blur fire when focus enters and leaves the field, not when it moves into the list', async () => {
    const { emitted } = render(SSelect, { props: { options, label: 'Country', searchable: true } })
    const input = screen.getByRole('combobox', { name: 'Country' })
    await fireEvent.focusIn(input)
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    const option = await screen.findByRole('option', { name: 'New York' })

    await fireEvent.focusOut(input, { relatedTarget: option })
    expect(emitted().focus).toHaveLength(1)
    expect(emitted().blur).toBeUndefined()

    await fireEvent.focusOut(input, { relatedTarget: document.body })
    expect(emitted().blur).toHaveLength(1)
  })
})
