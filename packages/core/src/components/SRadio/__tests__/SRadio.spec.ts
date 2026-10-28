import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SRadioGroup } from '../../SRadioGroup'
import { SRadio } from '../index'

describe('SRadio', () => {
  it('renders a label associated with the radio inside a group', () => {
    render({
      components: { SRadioGroup, SRadio },
      template: `
        <SRadioGroup aria-label="Choice">
          <SRadio value="a" label="Option A" />
          <SRadio value="b" label="Option B" disabled />
        </SRadioGroup>
      `,
    })
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
  })

  it('aria-label names an option without a visible label', () => {
    render({
      components: { SRadioGroup, SRadio },
      template: `
        <SRadioGroup aria-label="Color">
          <SRadio value="red" aria-label="Red" />
        </SRadioGroup>
      `,
    })
    expect(screen.getByRole('radio', { name: 'Red' })).toBeInTheDocument()
  })

  it('aria-* and data-* go to the radio, class and style to the wrapper', () => {
    const { container } = render({
      components: { SRadioGroup, SRadio },
      template: `
        <SRadioGroup aria-label="Choice">
          <SRadio value="a" label="A" data-testid="radio-a" aria-describedby="note" class="extra" style="margin: 4px" />
        </SRadioGroup>
      `,
    })
    const radio = screen.getByRole('radio', { name: 'A' })
    expect(radio).toHaveAttribute('data-testid', 'radio-a')
    expect(radio).toHaveAttribute('aria-describedby', 'note')
    const wrap = container.querySelector('.s-radio') as HTMLElement
    expect(wrap).toHaveClass('extra')
    expect(wrap.style.margin).toBe('4px')
    expect(wrap).not.toHaveAttribute('data-testid')
  })
})
