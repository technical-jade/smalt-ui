import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SToggleGroup } from '../index'
import { SToggle } from '../../SToggle'

const options = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

describe('SToggleGroup', () => {
  it('renders a group with items from options', () => {
    render(SToggleGroup, { props: { options, ariaLabel: 'Alignment' } })
    expect(screen.getByRole('group', { name: 'Alignment' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Left' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Right' })).toBeInTheDocument()
  })

  it('single: a click selects one value', async () => {
    const { emitted } = render(SToggleGroup, { props: { options } })
    await fireEvent.click(screen.getByRole('button', { name: 'Center' }))
    expect(emitted()['update:modelValue'][0]).toEqual(['center'])
  })

  it('multiple: accumulates several values', async () => {
    const { emitted } = render(SToggleGroup, { props: { type: 'multiple', options } })
    await fireEvent.click(screen.getByRole('button', { name: 'Left' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Right' }))
    const updates = emitted()['update:modelValue']
    expect(updates.at(-1)).toEqual([['left', 'right']])
  })

  it('passes the size to the items', () => {
    const { container } = render(SToggleGroup, { props: { options, size: 'sm' } })
    expect(container.querySelector('.s-toggle')).toHaveClass('s-toggle--sm')
  })

  it('passes the size to toggles in the slot; their own size wins', () => {
    const { container } = render({
      components: { SToggleGroup, SToggle },
      template: `
        <SToggleGroup size="sm">
          <SToggle value="a">A</SToggle>
          <SToggle value="b" size="lg">B</SToggle>
          <SToggle value="c" :size="undefined">C</SToggle>
        </SToggleGroup>`,
    })
    const [a, b, c] = container.querySelectorAll('.s-toggle')
    expect(a).toHaveClass('s-toggle--sm')
    expect(b).toHaveClass('s-toggle--lg')
    expect(c).toHaveClass('s-toggle--sm')
  })

  it('single: a click on the active item clears the value by default', async () => {
    const { emitted } = render(SToggleGroup, { props: { options } })
    const center = screen.getByRole('button', { name: 'Center' })
    await fireEvent.click(center)
    await fireEvent.click(center)
    expect(emitted()['update:modelValue']).toEqual([['center'], [undefined]])
  })

  it('mandatory keeps the active item selected, with or without v-model', async () => {
    const { emitted } = render(SToggleGroup, { props: { options, mandatory: true } })
    const center = screen.getByRole('button', { name: 'Center' })
    await fireEvent.click(center)
    await fireEvent.click(center)
    expect(emitted()['update:modelValue']).toEqual([['center']])
    expect(center).toHaveAttribute('data-state', 'on')
  })

  it('an array v-model without type selects several items', async () => {
    const { emitted } = render(SToggleGroup, {
      props: {
        modelValue: ['bold'],
        ariaLabel: 'Format',
        options: [{ value: 'bold' }, { value: 'italic' }],
      },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'italic' }))
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([['bold', 'italic']])
  })

  it('a string v-model without type stays single', async () => {
    const { emitted } = render(SToggleGroup, {
      props: {
        modelValue: 'bold',
        ariaLabel: 'Format',
        options: [{ value: 'bold' }, { value: 'italic' }],
      },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'italic' }))
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['italic'])
  })
})
