import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { defineComponent, h, nextTick, ref } from 'vue'
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
    expect(emitted()['update:search']?.flat()).not.toContain('San Francisco')
    // The input shows the label, not the query, so the query is emptied rather than left at 'san'.
    expect(emitted()['update:search']?.at(-1)).toEqual([''])
  })

  it('the label replacing the typed text empties the query', async () => {
    const props = { options, label: 'City', modelValue: undefined, selectedLabel: '' }
    const { emitted, rerender } = render(SAutocomplete, { props })
    const input = screen.getByLabelText('City')
    await fireEvent.update(input, 'san')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.click(await screen.findByRole('option', { name: 'San Francisco' }))
    await rerender({ ...props, modelValue: 'sf', selectedLabel: 'San Francisco' })

    await fireEvent.update(input, 'San Franciscoo')
    await fireEvent.keyDown(input, { key: 'Escape' })
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(input).toHaveValue('San Francisco')
    expect(emitted()['update:search']?.at(-1)).toEqual([''])
  })

  it('closing the panel without a selection keeps the typed query', async () => {
    const { emitted } = render(SAutocomplete, { props: { options, label: 'City' } })
    const input = screen.getByLabelText('City')
    await fireEvent.update(input, 'new')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Escape' })
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(input).toHaveValue('new')
    expect(emitted()['update:search']?.at(-1)).toEqual(['new'])
  })

  it('reopening the panel keeps the typed query', async () => {
    render(SAutocomplete, { props: { options, label: 'City' } })
    const input = screen.getByLabelText('City')
    await fireEvent.update(input, 'new')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Escape' })
    await new Promise((resolve) => setTimeout(resolve, 10))
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await screen.findByRole('option', { name: 'New York' })

    expect(input).toHaveValue('new')
  })

  it('a value reset from outside empties the input', async () => {
    const props = { options, label: 'City', modelValue: 'sf', selectedLabel: 'San Francisco' }
    const { rerender } = render(SAutocomplete, { props })
    await nextTick()
    expect(screen.getByLabelText('City')).toHaveValue('San Francisco')

    await rerender({ ...props, modelValue: undefined, selectedLabel: undefined })
    expect(screen.getByLabelText('City')).toHaveValue('')
  })

  it('a value reset while the panel is open empties the input once it closes', async () => {
    const props = { options, label: 'City', modelValue: 'sf', selectedLabel: 'San Francisco' }
    const { rerender } = render(SAutocomplete, { props })
    const input = screen.getByLabelText('City')
    await nextTick()
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await screen.findByRole('option', { name: 'San Francisco' })

    await rerender({ ...props, modelValue: undefined, selectedLabel: undefined })
    await fireEvent.keyDown(input, { key: 'Escape' })
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(input).toHaveValue('')
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
    const { emitted } = render(SAutocomplete, { props: { options, label: 'City' } })
    const input = screen.getByLabelText('City')
    await fireEvent.focusIn(input)
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    const option = await screen.findByRole('option', { name: 'New York' })

    await fireEvent.focusOut(input, { relatedTarget: option })
    expect(emitted().blur).toBeUndefined()

    await fireEvent.focusOut(input, { relatedTarget: document.body })
    expect(emitted().blur).toHaveLength(1)
  })

  it('blur fires when focus leaves the component through the clear button', async () => {
    const { emitted } = render(SAutocomplete, {
      props: { options, label: 'City', search: 'new' },
    })
    const input = screen.getByLabelText('City')
    const clear = screen.getByRole('button', { name: 'Clear' })
    await fireEvent.focusIn(input)
    await fireEvent.focusOut(input, { relatedTarget: clear })
    await fireEvent.focusIn(clear)
    expect(emitted().blur).toBeUndefined()

    await fireEvent.focusOut(clear, { relatedTarget: document.body })
    expect(emitted().blur).toHaveLength(1)
    expect(emitted().focus).toHaveLength(1)
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

  it('required is announced on the input', () => {
    render(SAutocomplete, { props: { options, label: 'City', required: true } })
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true')
  })

  describe('free-text', () => {
    const base = { options, label: 'Email', freeText: true }

    it('typing updates v-model right away and leaves v-model:search alone', async () => {
      const { emitted } = render(SAutocomplete, { props: base })
      await fireEvent.update(screen.getByLabelText('Email'), 'john@')
      expect(emitted()['update:modelValue']?.at(-1)).toEqual(['john@'])
      expect(emitted()['update:search']).toBeUndefined()
    })

    it('v-model is shown in the input and updates it from outside', async () => {
      const { rerender } = render(SAutocomplete, { props: { ...base, modelValue: '1 Main St' } })
      const input = screen.getByLabelText('Email')
      expect(input).toHaveValue('1 Main St')
      await rerender({ ...base, modelValue: '2 Main St' })
      expect(input).toHaveValue('2 Main St')
    })

    it('picking a suggestion puts its label into v-model and passes the option to select', async () => {
      const { emitted } = render(SAutocomplete, { props: base })
      const input = screen.getByLabelText('Email')
      await fireEvent.update(input, 'san')
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.click(await screen.findByRole('option', { name: 'San Francisco' }))
      expect(emitted()['update:modelValue']?.at(-1)).toEqual(['San Francisco'])
      expect(emitted().select).toEqual([[options[1]]])
      expect(input).toHaveValue('San Francisco')
    })

    it('text set by the application in the select handler stays in the input', async () => {
      const Harness = defineComponent(() => {
        const text = ref('san')
        return () =>
          h(SAutocomplete, {
            ...base,
            modelValue: text.value,
            'onUpdate:modelValue': (v?: string) => (text.value = v ?? ''),
            onSelect: () => (text.value = 'san'),
          })
      })
      render(Harness)
      const input = screen.getByLabelText('Email')
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.click(await screen.findByRole('option', { name: 'New York' }))
      await nextTick()
      expect(input).toHaveValue('san')
    })

    it('closing the panel and leaving the field keep the text', async () => {
      const { emitted } = render(SAutocomplete, { props: { ...base, modelValue: 'new' } })
      const input = screen.getByLabelText('Email')
      await fireEvent.focusIn(input)
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await screen.findByRole('option', { name: 'New York' })
      await fireEvent.keyDown(input, { key: 'Escape' })
      await fireEvent.focusOut(input, { relatedTarget: document.body })
      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(input).toHaveValue('new')
      expect(emitted()['update:modelValue']).toBeUndefined()
    })

    it('the clear button makes the text an empty string', async () => {
      const { emitted } = render(SAutocomplete, { props: { ...base, modelValue: 'new' } })
      await fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(emitted()['update:modelValue']?.at(-1)).toEqual([''])
      expect(screen.getByLabelText('Email')).toHaveValue('')
    })

    it('the panel stays closed without suggestions and opens when they arrive', async () => {
      const { rerender } = render(SAutocomplete, { props: { ...base, options: [] } })
      const input = screen.getByLabelText('Email')
      await fireEvent.update(input, 'ne')
      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(screen.queryByText('Nothing found')).toBeNull()
      expect(input).toHaveAttribute('aria-expanded', 'false')

      await rerender({ ...base, options })
      expect(await screen.findByRole('option', { name: 'New York' })).toBeInTheDocument()
    })

    it('suggestions arriving after a selection do not open the panel', async () => {
      const { rerender } = render(SAutocomplete, { props: base })
      const input = screen.getByLabelText('Email')
      await fireEvent.update(input, 'ne')
      await fireEvent.click(await screen.findByRole('option', { name: 'New York' }))
      await rerender({ ...base, options: [] })
      await rerender({ ...base, options })
      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    it('name submits the input text', () => {
      render(SAutocomplete, { props: { ...base, modelValue: 'new', name: 'email' } })
      expect(screen.getByLabelText('Email')).toHaveAttribute('name', 'email')
    })
  })
})
