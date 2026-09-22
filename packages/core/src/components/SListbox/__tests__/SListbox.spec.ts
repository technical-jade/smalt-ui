import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SListbox } from '../index'
import type { SListboxOption } from '../types'

const options: SListboxOption[] = [
  { label: 'New York', value: 'nyc' },
  { label: 'London', value: 'lon' },
  { label: 'Tokyo', value: 'tyo', disabled: true },
]

const renderListbox = (props: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) =>
  render(SListbox, { props: { options, label: 'City', ...props }, ...extra })

type OptionSlotProps = { option: SListboxOption; selected: boolean; disabled: boolean }

describe('SListbox', () => {
  it('renders the options as a named list', () => {
    renderListbox()
    expect(screen.getByRole('listbox', { name: 'City' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('lets the consumer name the list with aria-labelledby', () => {
    render(SListbox, { props: { options }, attrs: { 'aria-labelledby': 'cities-heading' } })
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-labelledby', 'cities-heading')
  })

  it('marks the selected option', () => {
    renderListbox({ modelValue: 'lon' })
    expect(screen.getByRole('option', { name: 'London' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'New York' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('selects a single value on click', async () => {
    const { emitted } = renderListbox()
    await fireEvent.click(screen.getByRole('option', { name: 'London' }))
    expect(emitted()['update:modelValue'].at(-1)).toEqual(['lon'])
  })

  it('collects an array with multiple', async () => {
    const { emitted } = renderListbox({ multiple: true })
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true')
    await fireEvent.click(screen.getByRole('option', { name: 'New York' }))
    await fireEvent.click(screen.getByRole('option', { name: 'London' }))
    expect(emitted()['update:modelValue'].at(-1)).toEqual([['nyc', 'lon']])
  })

  it('ignores a disabled option', async () => {
    const { emitted } = renderListbox()
    const tokyo = screen.getByRole('option', { name: 'Tokyo' })
    expect(tokyo).toHaveAttribute('data-disabled')
    await fireEvent.click(tokyo)
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('disables every option with the disabled prop', () => {
    renderListbox({ disabled: true })
    for (const option of screen.getAllByRole('option')) {
      expect(option).toHaveAttribute('data-disabled')
    }
  })

  it('shows the dictionary message when there are no options', () => {
    renderListbox({ options: [] })
    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('overrides the empty message with emptyText', () => {
    renderListbox({ options: [], emptyText: 'Nothing here' })
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('overrides the empty message with the empty slot', () => {
    renderListbox({ options: [] }, { slots: { empty: () => 'Add a city first' } })
    expect(screen.getByText('Add a city first')).toBeInTheDocument()
  })

  it('passes the option and its state to the option slot', () => {
    renderListbox(
      { modelValue: 'lon' },
      {
        slots: {
          option: ({ option, selected, disabled }: OptionSlotProps) =>
            `${option.label} ${selected ? 'on' : 'off'} ${disabled ? 'locked' : 'free'}`,
        },
      },
    )
    expect(screen.getByRole('option', { name: 'London on free' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Tokyo off locked' })).toBeInTheDocument()
  })

  it('applies the size modifier', () => {
    const { container } = renderListbox({ size: 'lg' })
    expect(container.querySelector('.s-listbox')).toHaveClass('s-listbox--lg')
  })
})
