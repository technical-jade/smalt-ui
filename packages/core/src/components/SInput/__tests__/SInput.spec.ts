import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SInput } from '../index'

describe('SInput', () => {
  it('links the label to the field', () => {
    render(SInput, { props: { label: 'Name' } })
    const input = screen.getByLabelText('Name')
    expect(input.tagName).toBe('INPUT')
  })

  it('updates v-model on input', async () => {
    const { emitted } = render(SInput, { props: { label: 'Name', modelValue: '' } })
    const input = screen.getByLabelText('Name')
    await fireEvent.update(input, 'Anna')
    expect(emitted()['update:modelValue']).toContainEqual(['Anna'])
  })

  it('shows the hint and links it via aria-describedby', () => {
    render(SInput, { props: { label: 'Email', hint: 'Work email' } })
    const input = screen.getByLabelText('Email')
    const hint = screen.getByText('Work email')
    expect(input.getAttribute('aria-describedby')).toContain(hint.id)
  })

  it('error marks the field invalid and links the message', () => {
    render(SInput, { props: { label: 'Email', error: 'Required field' } })
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const error = screen.getByText('Required field')
    expect(input.getAttribute('aria-describedby')).toContain(error.id)
  })

  it('disabled disables the field', () => {
    render(SInput, { props: { label: 'Name', disabled: true } })
    expect(screen.getByLabelText('Name')).toBeDisabled()
  })

  it('renders the leading and trailing icons', () => {
    const { container } = render(SInput, {
      props: { label: 'Search', icon: 'star', iconRight: 'calendar' },
    })
    expect(container.querySelectorAll('.s-input__icon')).toHaveLength(2)
  })

  it('clearable: the clear button is hidden when the value is empty', () => {
    render(SInput, { props: { label: 'Name', clearable: true, modelValue: '' } })
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
  })

  it('clearable: clears the value on click', async () => {
    const { emitted } = render(SInput, {
      props: { label: 'Name', clearable: true, modelValue: 'Anna' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(emitted()['update:modelValue']).toContainEqual([''])
  })

  it('clearable: the clear button is hidden when disabled', () => {
    render(SInput, {
      props: { label: 'Name', clearable: true, modelValue: 'Anna', disabled: true },
    })
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
  })
})

describe('SInput · password reveal (revealable)', () => {
  it('renders the toggle for a password field', () => {
    render(SInput, { props: { label: 'Password', type: 'password', revealable: true } })
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
  })

  it('renders no toggle when the type is not password', () => {
    const { container } = render(SInput, {
      props: { label: 'Name', type: 'text', revealable: true },
    })
    expect(container.querySelector('.s-input__reveal')).toBeNull()
  })

  it('renders no toggle without revealable', () => {
    const { container } = render(SInput, { props: { label: 'Password', type: 'password' } })
    expect(container.querySelector('.s-input__reveal')).toBeNull()
  })

  it('renders no toggle when the field is disabled', () => {
    const { container } = render(SInput, {
      props: { label: 'Password', type: 'password', revealable: true, disabled: true },
    })
    expect(container.querySelector('.s-input__reveal')).toBeNull()
  })

  it('click switches the input type and flips aria-pressed', async () => {
    const { container } = render(SInput, {
      props: { label: 'Password', type: 'password', revealable: true, modelValue: 'secret' },
    })
    const input = container.querySelector('.s-input__field') as HTMLInputElement
    const toggle = container.querySelector('.s-input__reveal') as HTMLElement
    expect(input).toHaveAttribute('type', 'password')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await fireEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'text')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await fireEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'password')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })

  it('the accessible name switches with the state', async () => {
    render(SInput, { props: { label: 'Password', type: 'password', revealable: true } })
    await fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
  })

  it('the label props override the dictionary strings', async () => {
    render(SInput, {
      props: {
        label: 'Password',
        type: 'password',
        revealable: true,
        showPasswordLabel: 'Unmask',
        hidePasswordLabel: 'Mask',
      },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Unmask' }))
    expect(screen.getByRole('button', { name: 'Mask' })).toBeInTheDocument()
  })

  it('custom icons are used for both states', async () => {
    const { container } = render(SInput, {
      props: {
        label: 'Password',
        type: 'password',
        revealable: true,
        revealIcon: 'star',
        hideIcon: 'calendar',
      },
    })
    const toggle = container.querySelector('.s-input__reveal') as HTMLElement
    expect(toggle.querySelector('.s-icon')).not.toBeNull()
    await fireEvent.click(toggle)
    expect(toggle.querySelector('.s-icon')).not.toBeNull()
  })

  it('the toggle does not submit the surrounding form', () => {
    const { container } = render(SInput, {
      props: { label: 'Password', type: 'password', revealable: true },
    })
    expect(container.querySelector('.s-input__reveal')).toHaveAttribute('type', 'button')
  })

  it('clear and reveal coexist: clear comes first, the value survives the toggle', async () => {
    const { container } = render(SInput, {
      props: {
        label: 'Password',
        type: 'password',
        revealable: true,
        clearable: true,
        modelValue: 'secret',
      },
    })
    const buttons = [...container.querySelectorAll('.s-input__wrap button')].map((b) => b.className)
    expect(buttons).toEqual(['s-input__clear', 's-input__reveal'])

    const input = container.querySelector('.s-input__field') as HTMLInputElement
    await fireEvent.click(container.querySelector('.s-input__reveal')!)
    expect(input).toHaveAttribute('type', 'text')
    expect(input.value).toBe('secret')
  })
})

describe('SInput · floating label', () => {
  it('renders the label inside the border by default and keeps it linked to the field', () => {
    const { container } = render(SInput, { props: { label: 'Name' } })
    expect(container.querySelector('.s-input__label')).not.toBeNull()
    expect(container.querySelector('.s-field__label')).toBeNull()
    expect(screen.getByLabelText('Name').tagName).toBe('INPUT')
  })

  it('data-filled on the frame reflects whether there is a value', async () => {
    const { container, rerender } = render(SInput, {
      props: { label: 'Name', modelValue: '' },
    })
    const wrap = container.querySelector('.s-input__wrap') as HTMLElement
    expect(wrap.hasAttribute('data-filled')).toBe(false)
    await rerender({ label: 'Name', modelValue: 'Anna' })
    expect(wrap.hasAttribute('data-filled')).toBe(true)
  })

  it('floating-label=false renders a regular label above', () => {
    const { container } = render(SInput, { props: { label: 'Name', floatingLabel: false } })
    expect(container.querySelector('.s-input__label')).toBeNull()
    expect(container.querySelector('.s-field__label')).not.toBeNull()
    expect(screen.getByLabelText('Name').tagName).toBe('INPUT')
  })
})

describe('SInput · tags mode (use-tags)', () => {
  it('renders existing tags', () => {
    render(SInput, { props: { useTags: true, modelValue: ['vue', 'react'], label: 'Stack' } })
    expect(screen.getByText('vue')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
  })

  it('adds a tag on Enter (v-model)', async () => {
    const { emitted } = render(SInput, {
      props: { useTags: true, modelValue: ['vue'], label: 'Stack' },
    })
    const input = screen.getByRole('textbox')
    await fireEvent.update(input, 'nuxt')
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(emitted()['update:modelValue']).toBeTruthy()
    const last = emitted()['update:modelValue'].at(-1) as string[][] | undefined
    expect(last?.[0]).toContain('nuxt')
  })

  it('each tag is an STag chip with a remove button (name = tag text)', () => {
    const { container } = render(SInput, {
      props: { useTags: true, modelValue: ['vue', 'react'], label: 'Stack' },
    })
    // Reka labels the remove button via aria-labelledby, so its name is the tag text.
    expect(container.querySelectorAll('.s-tag__remove')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'vue' })).toBeInTheDocument()
  })

  it('disabled disables the tags control', () => {
    const { container } = render(SInput, {
      props: { useTags: true, modelValue: ['x'], disabled: true },
    })
    expect(container.querySelector('.s-input__control')).toHaveAttribute('data-disabled')
  })

  it('renders the leading icon in tags mode', () => {
    const { container } = render(SInput, {
      props: { useTags: true, modelValue: ['vue'], icon: 'star' },
    })
    expect(container.querySelector('.s-input__leading')).not.toBeNull()
  })
})

describe('SInput · mask', () => {
  it('formats input and emits the masked value', async () => {
    const { emitted } = render(SInput, {
      props: { label: 'Phone', mask: '(###) ### - ####', modelValue: '' },
    })
    await fireEvent.update(screen.getByLabelText('Phone'), '9991234567')
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['(999) 123 - 4567'])
  })

  it('unmasked-value: the model holds the raw value without separators', async () => {
    const { emitted } = render(SInput, {
      props: { label: 'Phone', mask: 'phone', unmaskedValue: true, modelValue: '' },
    })
    await fireEvent.update(screen.getByLabelText('Phone'), '9991234567')
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['9991234567'])
  })

  it('shows the initial value masked (with unmasked-value the model is raw)', () => {
    render(SInput, {
      props: { label: 'Phone', mask: 'phone', unmaskedValue: true, modelValue: '9991234567' },
    })
    expect((screen.getByLabelText('Phone') as HTMLInputElement).value).toBe('(999) 123 - 4567')
  })

  it('clearable is visible when filled and resets the value', async () => {
    const { container, emitted } = render(SInput, {
      props: { label: 'Phone', mask: 'phone', clearable: true, modelValue: '(999) 123 - 4567' },
    })
    const clear = container.querySelector('.s-input__clear')
    expect(clear).not.toBeNull()
    await fireEvent.click(clear!)
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([''])
  })

  it('passes native attributes to the input itself, not the frame', () => {
    render(SInput, {
      props: { label: 'ZIP code' },
      attrs: { maxlength: 6, autocomplete: 'postal-code', name: 'zip' },
    })
    const input = screen.getByLabelText('ZIP code')
    expect(input).toHaveAttribute('maxlength', '6')
    expect(input).toHaveAttribute('autocomplete', 'postal-code')
    expect(input).toHaveAttribute('name', 'zip')
  })

  it('the blur handler fires (blur does not bubble, so it must be on the input)', async () => {
    const onBlur = vi.fn()
    render(SInput, { props: { label: 'Name' }, attrs: { onBlur } })
    await fireEvent.blur(screen.getByLabelText('Name'))
    expect(onBlur).toHaveBeenCalled()
  })

  it('class and style stay on the outer field frame', () => {
    const { container } = render(SInput, {
      props: { label: 'Name' },
      attrs: { class: 'own-field', style: 'width: 120px' },
    })
    const root = container.querySelector('.s-field')!
    expect(root).toHaveClass('own-field')
    expect(root.getAttribute('style')).toContain('120px')
    expect(screen.getByLabelText('Name')).not.toHaveClass('own-field')
  })

  it('numeric mode: letters do not get into the model', async () => {
    const { emitted } = render(SInput, {
      props: { label: 'Weight', numeric: { decimals: 2 }, modelValue: '' },
    })
    await fireEvent.update(screen.getByLabelText('Weight'), '12a.75')
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['12.75'])
  })

  it('numeric mode: sets inputmode for the mobile keyboard', () => {
    render(SInput, { props: { label: 'Quantity', numeric: true } })
    expect(screen.getByLabelText('Quantity')).toHaveAttribute('inputmode', 'numeric')
  })

  it('numeric mode: bounds are clamped on change, not on every keystroke', async () => {
    const { emitted } = render(SInput, {
      props: { label: 'Quantity', numeric: { max: 99 }, modelValue: '' },
    })
    const input = screen.getByLabelText('Quantity')
    await fireEvent.update(input, '500')
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['500'])
    await fireEvent.change(input)
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['99'])
  })

  it('type="number" does not reach the DOM — numeric mode is used instead', () => {
    render(SInput, { props: { label: 'Amount', type: 'number' } })
    expect(screen.getByLabelText('Amount')).toHaveAttribute('type', 'text')
  })

  it('renders the prefix and suffix inside the border', () => {
    const { container } = render(SInput, {
      props: { label: 'Weight', prefix: '~', suffix: 'kg' },
    })
    const affixes = [...container.querySelectorAll('.s-input__affix')].map((n) => n.textContent)
    expect(affixes).toEqual(['~', 'kg'])
  })

  it('readonly shows no clear button', () => {
    const { container } = render(SInput, {
      props: { label: 'Name', modelValue: 'Anna', readonly: true, clearable: true },
    })
    expect(screen.getByLabelText('Name')).toHaveAttribute('readonly')
    expect(container.querySelector('.s-input__clear')).toBeNull()
  })

  it('fill-mask: shows the ghost template in an empty field', () => {
    const { container } = render(SInput, {
      props: { label: 'Phone', mask: 'phone', fillMask: true },
    })
    expect(container.querySelector('.s-input__ghost-fill')?.textContent).toBe('')
    expect(container.querySelector('.s-input__ghost-tail')?.textContent).toBe('(___) ___ - ____')
  })

  it('fill-mask: the ghost tail shrinks as the field fills (the template stays)', () => {
    const { container } = render(SInput, {
      props: { label: 'Phone', mask: 'phone', fillMask: true, modelValue: '(123) 45' },
    })
    expect(container.querySelector('.s-input__ghost-fill')?.textContent).toBe('(123) 45')
    expect(container.querySelector('.s-input__ghost-tail')?.textContent).toBe('_ - ____')
  })

  it('fill-mask: custom fill character', () => {
    const { container } = render(SInput, {
      props: { label: 'Date', mask: 'date', fillMask: '·' },
    })
    expect(container.querySelector('.s-input__ghost-tail')?.textContent).toBe('····/··/··')
  })
})
