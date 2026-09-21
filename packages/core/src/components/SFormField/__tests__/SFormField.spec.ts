import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { h } from 'vue'
import { SFormField } from '../index'

function renderField(props: Record<string, unknown>) {
  return render(SFormField, {
    props,
    slots: {
      default: (slotProps: { id: string; describedBy?: string; invalid: boolean }) =>
        h('input', {
          id: slotProps.id,
          'aria-describedby': slotProps.describedBy,
          'aria-invalid': slotProps.invalid || undefined,
        }),
    },
  })
}

describe('SFormField', () => {
  it('square adds the s-field--square modifier (resets --s-field-radius)', () => {
    const { container } = renderField({ square: true })
    expect(container.querySelector('.s-field')).toHaveClass('s-field--square')
  })

  it('links the label to the element via a generated id', () => {
    renderField({ label: 'Name' })
    const input = screen.getByLabelText('Name')
    expect(input.tagName).toBe('INPUT')
    expect(input.id).toBeTruthy()
  })

  it('uses the given id', () => {
    renderField({ label: 'Name', id: 'my-id' })
    expect(screen.getByLabelText('Name').id).toBe('my-id')
  })

  it('links the hint via aria-describedby', () => {
    renderField({ label: 'Email', hint: 'Work email' })
    const input = screen.getByLabelText('Email')
    const hint = screen.getByText('Work email')
    expect(input.getAttribute('aria-describedby')).toContain(hint.id)
  })

  it('error marks the field invalid and links the message', () => {
    renderField({ label: 'Email', error: 'Required field' })
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const error = screen.getByText('Required field')
    expect(input.getAttribute('aria-describedby')).toContain(error.id)
  })

  it('aria-describedby references only rendered elements', () => {
    const { container } = render(SFormField, {
      props: { label: 'Field', hint: 'hint', error: 'error' },
      slots: {
        default: (slotProps: { id: string; describedBy?: string }) =>
          h('input', { id: slotProps.id, 'aria-describedby': slotProps.describedBy }),
      },
    })
    const describedBy = container.querySelector('input')!.getAttribute('aria-describedby')!
    const missing = describedBy.split(' ').filter((id) => !container.querySelector(`#${id}`))
    expect(missing).toEqual([])
  })

  it('error takes precedence over hint', () => {
    renderField({ label: 'Email', hint: 'Hint', error: 'Error' })
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByText('Hint')).toBeNull()
  })

  it('renders the top label (.s-field__label) by default', () => {
    const { container } = renderField({ label: 'Name' })
    expect(container.querySelector('.s-field__label')).not.toBeNull()
  })

  it('floatingLabel suppresses the top label (the field draws the label itself)', () => {
    const { container } = renderField({ label: 'Name', floatingLabel: true })
    expect(container.querySelector('.s-field__label')).toBeNull()
  })

  it('the slot receives label and floatingLabel', () => {
    let received: { label?: string; floatingLabel?: boolean } = {}
    render(SFormField, {
      props: { label: 'Name', floatingLabel: true },
      slots: {
        default: (p: { id: string; label?: string; floatingLabel?: boolean }) => {
          received = p
          return h('input', { id: p.id })
        },
      },
    })
    expect(received.label).toBe('Name')
    expect(received.floatingLabel).toBe(true)
  })

  it('the label slot builds the label from markup and stays linked to the field', () => {
    const { container } = render(SFormField, {
      props: { id: 'declared-value' },
      slots: {
        label: '<a href="/service">Declared value</a>',
        default: '<input id="declared-value" />',
      },
    })
    const label = container.querySelector('label.s-field__label')!
    expect(label.querySelector('a')?.textContent).toBe('Declared value')
    expect(label.getAttribute('for')).toBe('declared-value')
  })

  it('renders the error into a live region that exists before the error appears', async () => {
    const { container, rerender } = render(SFormField, { props: { label: 'Email' } })
    const live = container.querySelector('[aria-live="polite"]')
    expect(live).not.toBeNull()
    await rerender({ label: 'Email', error: 'Enter an email' })
    expect(container.querySelector('[aria-live="polite"]')).toBe(live)
    expect(live).toHaveTextContent('Enter an email')
  })
})
