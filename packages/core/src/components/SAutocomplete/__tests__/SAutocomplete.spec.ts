import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SAutocomplete } from '../index'
import type { SAutocompleteOption } from '../types'

const options: SAutocompleteOption[] = [
  { label: 'New York', value: 'nyc' },
  { label: 'San Francisco', value: 'sf' },
]

describe('SAutocomplete', () => {
  it('associates the label with the input', () => {
    render(SAutocomplete, { props: { options, label: 'City' } })
    expect(screen.getByLabelText('City')).toHaveAttribute('role', 'combobox')
  })

  it('typing updates v-model:search, which the application searches by', async () => {
    const { emitted } = render(SAutocomplete, { props: { options, label: 'City' } })
    await fireEvent.update(screen.getByLabelText('City'), 'new')
    expect(emitted()['update:search']?.at(-1)).toEqual(['new'])
  })

  it('shows suggestions as is, without filtering them by the typed text', async () => {
    render(SAutocomplete, {
      props: { options, label: 'City', search: 'zzz' },
    })
    await fireEvent.focus(screen.getByLabelText('City'))
    await fireEvent.keyDown(screen.getByLabelText('City'), { key: 'ArrowDown' })
    expect(await screen.findByRole('option', { name: 'New York' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'San Francisco' })).toBeInTheDocument()
  })

  it('selecting a suggestion updates v-model', async () => {
    const { emitted } = render(SAutocomplete, { props: { options, label: 'City' } })
    await fireEvent.keyDown(screen.getByLabelText('City'), { key: 'ArrowDown' })
    await fireEvent.click(await screen.findByRole('option', { name: 'San Francisco' }))
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['sf'])
  })

  it('the selected label reaches the input even when it arrives after the selection', async () => {
    const { rerender } = render(SAutocomplete, {
      props: { options, label: 'City', modelValue: undefined, selectedLabel: '' },
    })
    await fireEvent.keyDown(screen.getByLabelText('City'), { key: 'ArrowDown' })
    await fireEvent.click(await screen.findByRole('option', { name: 'San Francisco' }))
    await rerender({ options, label: 'City', modelValue: 'sf', selectedLabel: '' })
    await rerender({ options, label: 'City', modelValue: 'sf', selectedLabel: 'San Francisco' })
    expect(screen.getByLabelText('City')).toHaveValue('San Francisco')
  })

  it('the selected label is not reported as the user query', async () => {
    const { emitted, rerender } = render(SAutocomplete, {
      props: { options, label: 'City', modelValue: undefined, selectedLabel: '' },
    })
    await fireEvent.update(screen.getByLabelText('City'), 'san')
    await fireEvent.keyDown(screen.getByLabelText('City'), { key: 'ArrowDown' })
    await fireEvent.click(await screen.findByRole('option', { name: 'San Francisco' }))
    await rerender({
      options,
      label: 'City',
      modelValue: 'sf',
      selectedLabel: 'San Francisco',
    })

    expect(screen.getByLabelText('City')).toHaveValue('San Francisco')
    expect(emitted()['update:search']?.at(-1)).toEqual(['san'])
  })

  it('closing the panel without a selection keeps the typed query', async () => {
    const { emitted } = render(SAutocomplete, { props: { options, label: 'City' } })
    const input = screen.getByLabelText('City')
    await fireEvent.update(input, 'new')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Escape' })
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(emitted()['update:search']?.at(-1)).toEqual(['new'])
  })

  it('a query set by the application is put into the input', async () => {
    const { rerender } = render(SAutocomplete, {
      props: { options, label: 'City', search: 'new' },
    })
    expect(screen.getByLabelText('City')).toHaveValue('new')
    await rerender({ options, label: 'City', search: 'bos' })
    expect(screen.getByLabelText('City')).toHaveValue('bos')
  })

  it('blur is not passed out while focus stays inside the component', async () => {
    const onBlur = vi.fn()
    render(SAutocomplete, { props: { options, label: 'City' }, attrs: { onBlur } })
    const input = screen.getByLabelText('City')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    const option = await screen.findByRole('option', { name: 'New York' })

    await fireEvent.blur(input, { relatedTarget: option })
    expect(onBlur).not.toHaveBeenCalled()

    await fireEvent.blur(input, { relatedTarget: document.body })
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('the clear button resets both the value and the query text', async () => {
    const { emitted } = render(SAutocomplete, {
      props: { options, label: 'City', modelValue: 'nyc', selectedLabel: 'New York' },
    })
    await fireEvent.update(screen.getByLabelText('City'), 'new')
    await fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([undefined])
    expect(emitted()['update:search']?.at(-1)).toEqual([''])
    expect(screen.getByLabelText('City')).toHaveValue('')
    expect(emitted().clear).toBeTruthy()
  })

  it('the option slot renders a custom list row', async () => {
    render(SAutocomplete, {
      props: { options, label: 'City' },
      slots: { option: '<template #option="{ option }"><b>{{ option.label }}</b></template>' },
    })
    await fireEvent.keyDown(screen.getByLabelText('City'), { key: 'ArrowDown' })
    const item = await screen.findByRole('option', { name: 'New York' })
    expect(item.querySelector('b')).not.toBeNull()
  })

  it('loading hides suggestions and announces the state', async () => {
    render(SAutocomplete, { props: { options, label: 'City', loading: true } })
    await fireEvent.keyDown(screen.getByLabelText('City'), { key: 'ArrowDown' })
    expect(await screen.findByText('Loading')).toBeInTheDocument()
    expect(screen.queryByRole('option')).toBeNull()
  })

  it('shows a placeholder when there are no suggestions', async () => {
    render(SAutocomplete, { props: { options: [], label: 'City', emptyText: 'City not found' } })
    await fireEvent.keyDown(screen.getByLabelText('City'), { key: 'ArrowDown' })
    expect(await screen.findByText('City not found')).toBeInTheDocument()
  })

  it('error marks the field invalid and links the message', () => {
    render(SAutocomplete, { props: { options, label: 'City', error: 'Select a city' } })
    const input = screen.getByLabelText('City')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByText('Select a city').id)
  })

  it('disabled disables the field', () => {
    render(SAutocomplete, { props: { options, label: 'City', disabled: true } })
    expect(screen.getByLabelText('City')).toBeDisabled()
  })

  it('native attributes go to the input, class and style to the frame', () => {
    const { container } = render(SAutocomplete, {
      props: { options, label: 'City' },
      attrs: { maxlength: 60, name: 'city', class: 'own-field' },
    })
    const input = screen.getByLabelText('City')
    expect(input).toHaveAttribute('maxlength', '60')
    // The visible input holds the label; the value is submitted by the hidden input of the root.
    expect(input).not.toHaveAttribute('name')
    expect(input).not.toHaveClass('own-field')
    expect(container.querySelector('.s-field')).toHaveClass('own-field')
  })

  it('select fires on every selection, including the same suggestion', async () => {
    const { emitted } = render(SAutocomplete, {
      props: { options, label: 'City', modelValue: 'sf', selectedLabel: 'San Francisco' },
    })
    const input = screen.getByLabelText('City')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.click(await screen.findByRole('option', { name: 'San Francisco' }))
    expect(emitted().select).toEqual([[options[1]]])
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('a label without a selected value does not erase the input text', async () => {
    const props = { options, label: 'City', modelValue: undefined, search: 'Bost' }
    const { rerender } = render(SAutocomplete, { props: { ...props, selectedLabel: '' } })
    await rerender({ ...props, selectedLabel: 'Boston' })
    expect(screen.getByLabelText('City')).toHaveValue('Bost')
  })
})
