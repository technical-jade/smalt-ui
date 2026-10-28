import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/vue'
import { SColorPicker } from '../index'

describe('SColorPicker', () => {
  it('renders a trigger with a preview of the current color', () => {
    const { container } = render(SColorPicker, { props: { modelValue: '#3B82F6' } })
    expect(screen.getByRole('button', { name: 'Pick a color' })).toBeInTheDocument()
    const preview = container.querySelector('.s-color-picker__preview') as HTMLElement
    expect(preview.style.backgroundColor).toBe('#3B82F6')
  })

  it('shows the label next to the preview', () => {
    render(SColorPicker, { props: { label: 'Accent' } })
    expect(screen.getByText('Accent')).toBeInTheDocument()
  })

  it('the panel is closed by default', () => {
    render(SColorPicker, { props: { modelValue: '#3B82F6' } })
    expect(document.querySelector('.s-color-picker__area')).toBeNull()
  })

  it('opens the panel with the area and hue slider on click', async () => {
    render(SColorPicker, { props: { modelValue: '#3B82F6' } })
    await fireEvent.click(screen.getByRole('button', { name: 'Pick a color' }))
    expect(document.querySelector('.s-color-picker__area')).not.toBeNull()
    expect(document.querySelector('.s-color-picker__slider--hue')).not.toBeNull()
  })

  it('adds the alpha slider with withAlpha', async () => {
    render(SColorPicker, { props: { modelValue: '#3B82F6', withAlpha: true } })
    await fireEvent.click(screen.getByRole('button', { name: 'Pick a color' }))
    expect(document.querySelector('.s-color-picker__slider--alpha')).not.toBeNull()
  })

  it('renders preset swatches', async () => {
    render(SColorPicker, {
      props: { modelValue: '#3B82F6', swatches: ['#ff0000', '#00ff00', '#0000ff'] },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Pick a color' }))
    expect(document.querySelectorAll('.s-color-picker__swatch')).toHaveLength(3)
  })

  it('includes the hex field (SColorField) in the panel', async () => {
    render(SColorPicker, { props: { modelValue: '#3B82F6' } })
    await fireEvent.click(screen.getByRole('button', { name: 'Pick a color' }))
    const panel = document.querySelector('.s-color-picker__panel') as HTMLElement
    expect(within(panel).getByRole('textbox')).toBeInTheDocument()
  })

  it('hides the hex field with hideInput', async () => {
    render(SColorPicker, { props: { modelValue: '#3B82F6', hideInput: true } })
    await fireEvent.click(screen.getByRole('button', { name: 'Pick a color' }))
    expect(document.querySelector('.s-color-picker__input')).toBeNull()
  })

  it('disabled set while the panel is open blocks both the swatches and the hex field', async () => {
    const { emitted, rerender } = render(SColorPicker, {
      props: { modelValue: '#3B82F6', swatches: ['#ff0000'] },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Pick a color' }))
    await rerender({ disabled: true })

    const panel = document.querySelector('.s-color-picker__panel') as HTMLElement
    expect(within(panel).getByRole('textbox')).toBeDisabled()
    await fireEvent.click(panel.querySelector('.s-color-picker__swatch') as HTMLElement)
    expect(emitted('update:modelValue')).toBeUndefined()
  })

  it('the visible label is part of the trigger name', () => {
    render(SColorPicker, { props: { label: 'Accent' } })
    expect(screen.getByRole('button', { name: /Accent/ })).toBeInTheDocument()
  })
})
