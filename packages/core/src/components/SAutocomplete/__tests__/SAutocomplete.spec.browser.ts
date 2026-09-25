import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, ref } from 'vue'
import { SAutocomplete } from '../index'

const options = [
  { label: 'New York', value: 'nyc' },
  { label: 'Boston', value: 'bos' },
]

/**
 * The panel is teleported to body, and its position and height are computed from the real field
 * size, which happy-dom does not have.
 */
describe('SAutocomplete · browser', () => {
  it('the panel opens below the field and aligns with its frame', async () => {
    const { container } = render(SAutocomplete, { props: { options, label: 'City' } })
    await userEvent.click(screen.getByLabelText('City'))
    await userEvent.keyboard('{ArrowDown}')
    const listbox = await screen.findByRole('listbox')
    const control = container.querySelector('.s-autocomplete__control')!.getBoundingClientRect()
    const panel = listbox.getBoundingClientRect()
    expect(panel.width).toBeGreaterThan(0)
    expect(panel.top).toBeGreaterThanOrEqual(control.top)
    expect(panel.left).toBeLessThan(control.right)
    expect(panel.right).toBeGreaterThan(control.left)
  })

  it('a long suggestion list is height-limited and scrolls', async () => {
    const many = Array.from({ length: 200 }, (_, i) => ({
      label: `City ${i + 1}`,
      value: String(i),
    }))
    render(SAutocomplete, { props: { options: many, label: 'City' } })
    await userEvent.click(screen.getByLabelText('City'))
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    const viewport = document.querySelector<HTMLElement>('.s-autocomplete__viewport')!
    expect(viewport.getBoundingClientRect().height).toBeLessThanOrEqual(320)
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
  })

  it('selecting a suggestion with the keyboard returns focus to the input', async () => {
    render(SAutocomplete, { props: { options, label: 'City', selectedLabel: 'Boston' } })
    const input = screen.getByLabelText('City')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    expect(document.activeElement).toBe(input)
  })

  /**
   * The label comes from the application after a server request, and by then Reka has already
   * asked for it and received an empty string.
   */
  it('the selected label appears right after a mouse selection', async () => {
    const Harness = defineComponent(() => {
      const value = ref<string>()
      const search = ref('')
      const selectedLabel = ref('')
      return () =>
        h(SAutocomplete, {
          label: 'City',
          options,
          modelValue: value.value,
          'onUpdate:modelValue': (v?: string) => {
            value.value = v
            setTimeout(() => {
              selectedLabel.value = options.find((o) => o.value === v)?.label ?? ''
            }, 20)
          },
          search: search.value,
          'onUpdate:search': (v: string) => (search.value = v),
          selectedLabel: selectedLabel.value,
        })
    })
    render(Harness)
    const input = screen.getByLabelText('City') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    await userEvent.click(screen.getByRole('option', { name: 'Boston' }))
    await expect.poll(() => input.value).toBe('Boston')
  })

  /**
   * The scenario focus is held for: a "left the field without selecting" handler changes the
   * suggestion list. If focus moved to the item, it would disappear between mousedown and mouseup,
   * and the click would never happen.
   */
  it('a mouse selection works even when the blur handler clears the suggestions', async () => {
    const onBlur = vi.fn()
    const Harness = defineComponent(() => {
      const value = ref<string>()
      const visible = ref([...options])
      return () => [
        h(SAutocomplete, {
          label: 'City',
          options: visible.value,
          modelValue: value.value,
          'onUpdate:modelValue': (v?: string) => (value.value = v),
          onBlur: (event: FocusEvent) => {
            onBlur(event)
            visible.value = []
          },
        }),
        h('button', { type: 'button' }, 'Next'),
      ]
    })
    render(Harness)
    const input = screen.getByLabelText('City') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')

    await userEvent.click(screen.getByRole('option', { name: 'Boston' }))

    expect(onBlur).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(input)
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await expect.poll(() => onBlur.mock.calls.length).toBe(1)
  })

  /**
   * Reka closes the panel on a real focus move, and that is where its own reset used to erase the
   * input. happy-dom keeps `activeElement` on the input, so the close never happens there.
   */
  it('leaving the field without a selection keeps the typed text and the query', async () => {
    const search = ref('')
    const Harness = defineComponent(() => {
      return () => [
        h(SAutocomplete, {
          label: 'City',
          options,
          search: search.value,
          'onUpdate:search': (v: string) => (search.value = v),
        }),
        h('button', { type: 'button' }, 'Next'),
      ]
    })
    render(Harness)
    const input = screen.getByLabelText('City') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.keyboard('new')
    await screen.findByRole('listbox')

    // The open panel covers the button, so focus moves without a click.
    screen.getByRole('button', { name: 'Next' }).focus()
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull()
    expect(input.value).toBe('new')
    expect(search.value).toBe('new')
  })

  it('square also removes the rounding of the suggestion panel', async () => {
    render(SAutocomplete, { props: { options, label: 'City', square: true } })
    await userEvent.click(screen.getByLabelText('City'))
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    const content = document.querySelector('.s-autocomplete__content')!
    expect(getComputedStyle(content).borderTopLeftRadius).toBe('0px')
  })

  it('a preset search is visible in the input after mount', async () => {
    render(SAutocomplete, { props: { options, label: 'City', search: '221B Baker St' } })
    const input = screen.getByLabelText('City') as HTMLInputElement
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(input.value).toBe('221B Baker St')
  })

  it('Home and End move the caret in the input, not in the list', async () => {
    render(SAutocomplete, { props: { options, label: 'City' } })
    const input = screen.getByLabelText('City') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.keyboard('New York')
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    await userEvent.keyboard('{Home}')
    expect(input.selectionStart).toBe(0)
    await userEvent.keyboard('{End}')
    expect(input.selectionStart).toBe('New York'.length)
  })

  it('blur fires when Tab moves focus out of the component through the clear button', async () => {
    const onBlur = vi.fn()
    const Harness = defineComponent(() => {
      return () => [
        h(SAutocomplete, { label: 'City', options, search: 'new', onBlur }),
        h('button', { type: 'button' }, 'Next'),
      ]
    })
    render(Harness)
    await userEvent.click(screen.getByLabelText('City'))
    await userEvent.keyboard('{Escape}')
    await userEvent.tab()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Clear' }))
    expect(onBlur).not.toHaveBeenCalled()

    await userEvent.tab()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Next' }))
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('free-text: a pick leaves its label in the input, leaving the field keeps the text', async () => {
    const text = ref('')
    const Harness = defineComponent(() => {
      return () => [
        h(SAutocomplete, {
          label: 'Address',
          options,
          freeText: true,
          modelValue: text.value,
          'onUpdate:modelValue': (v?: string) => (text.value = v ?? ''),
        }),
        h('button', { type: 'button' }, 'Next'),
      ]
    })
    render(Harness)
    const input = screen.getByLabelText('Address') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.keyboard('bo')
    await screen.findByRole('listbox')
    await userEvent.click(screen.getByRole('option', { name: 'Boston' }))
    await expect.poll(() => input.value).toBe('Boston')
    expect(text.value).toBe('Boston')

    await userEvent.keyboard(', MA')
    screen.getByRole('button', { name: 'Next' }).focus()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(input.value).toBe('Boston, MA')
    expect(text.value).toBe('Boston, MA')
  })
})
