import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SKbd } from '../index'
import { installLocale } from '../../../composables'

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

  it.each([
    ['meta', 'Command'],
    ['command', 'Command'],
    ['ctrl', 'Ctrl'],
    ['control', 'Ctrl'],
    ['alt', 'Alt'],
    ['option', 'Option'],
    ['shift', 'Shift'],
    ['enter', 'Enter'],
    ['return', 'Enter'],
    ['backspace', 'Backspace'],
    ['delete', 'Delete'],
    ['escape', 'Esc'],
    ['esc', 'Esc'],
    ['tab', 'Tab'],
    ['capslock', 'Caps Lock'],
    ['up', 'Up arrow'],
    ['arrowup', 'Up arrow'],
    ['down', 'Down arrow'],
    ['arrowdown', 'Down arrow'],
    ['left', 'Left arrow'],
    ['arrowleft', 'Left arrow'],
    ['right', 'Right arrow'],
    ['arrowright', 'Right arrow'],
    ['space', 'Space'],
  ])('announces %s by the readable name "%s"', (value, name) => {
    render(SKbd, { props: { value } })
    expect(screen.getByRole('img', { name })).toBeInTheDocument()
  })

  it('takes the names of arrows and space from the locale dictionary', () => {
    render(SKbd, {
      props: { value: 'ArrowUp' },
      global: {
        plugins: [(app) => installLocale(app, { messages: { kbdArrowUp: 'Pfeil nach oben' } })],
      },
    })
    expect(screen.getByRole('img', { name: 'Pfeil nach oben' })).toHaveTextContent('↑')
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
