import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SKbd } from '../index'

describe('SKbd', () => {
  it.each([
    ['meta', '⌘'],
    ['command', '⌘'],
    ['ctrl', '⌃'],
    ['control', '⌃'],
    ['alt', '⌥'],
    ['option', '⌥'],
    ['shift', '⇧'],
    ['enter', '↵'],
    ['return', '↵'],
    ['backspace', '⌫'],
    ['delete', '⌦'],
    ['escape', '⎋'],
    ['esc', '⎋'],
    ['tab', '⇥'],
    ['capslock', '⇪'],
    ['up', '↑'],
    ['arrowup', '↑'],
    ['down', '↓'],
    ['arrowdown', '↓'],
    ['left', '←'],
    ['arrowleft', '←'],
    ['right', '→'],
    ['arrowright', '→'],
    ['space', '␣'],
  ])('renders %s as %s', (value, symbol) => {
    const { container } = render(SKbd, { props: { value } })
    expect(container.querySelector('.s-kbd')).toHaveTextContent(symbol)
  })

  it('matches the key name regardless of case', () => {
    const { container } = render(SKbd, { props: { value: 'Shift' } })
    expect(container.querySelector('.s-kbd')).toHaveTextContent('⇧')
  })

  it('shows an unknown key as given', () => {
    const { container } = render(SKbd, { props: { value: 'F12' } })
    const kbd = container.querySelector('.s-kbd')
    expect(kbd).toHaveTextContent('F12')
    expect(kbd).not.toHaveAttribute('aria-label')
  })

  it('announces a symbol by its key name', () => {
    render(SKbd, { props: { value: 'meta' } })
    expect(screen.getByLabelText('meta')).toHaveTextContent('⌘')
  })

  it('the slot wins over the value', () => {
    const { container } = render(SKbd, { props: { value: 'meta' }, slots: { default: 'Cmd' } })
    const kbd = container.querySelector('.s-kbd')
    expect(kbd).toHaveTextContent('Cmd')
    expect(kbd).not.toHaveAttribute('aria-label')
  })

  it('applies the default size and variant', () => {
    const { container } = render(SKbd, { props: { value: 'K' } })
    expect(container.querySelector('.s-kbd')).toHaveClass('s-kbd--md', 's-kbd--outline')
  })

  it('applies the size and variant modifiers', () => {
    const { container } = render(SKbd, { props: { value: 'K', size: 'lg', variant: 'solid' } })
    expect(container.querySelector('.s-kbd')).toHaveClass('s-kbd--lg', 's-kbd--solid')
  })

  it('renders a span, not a kbd tag', () => {
    const { container } = render(SKbd, { props: { value: 'K' } })
    expect(container.querySelector('.s-kbd')?.tagName).toBe('SPAN')
  })
})
