import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SButton } from '../../SButton'
import { SButtonGroup } from '../index'

const renderGroup = (props: Record<string, unknown> = {}, template?: string) =>
  render(
    {
      components: { SButtonGroup, SButton },
      template:
        template ??
        `<SButtonGroup v-bind="$attrs"><SButton>Copy</SButton><SButton>Paste</SButton></SButtonGroup>`,
    },
    { attrs: props },
  )

describe('SButtonGroup', () => {
  it('renders the buttons inside a group', () => {
    renderGroup()
    const group = screen.getByRole('group')
    expect(group).toHaveClass('s-button-group', 's-button-group--horizontal')
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(group.querySelectorAll('.s-button')).toHaveLength(2)
  })

  it('is attached by default and detaches on demand', () => {
    const { unmount } = renderGroup()
    expect(screen.getByRole('group')).toHaveClass('s-button-group--attached')
    unmount()

    renderGroup({ attached: false })
    expect(screen.getByRole('group')).toHaveClass('s-button-group--detached')
  })

  it('applies the orientation modifier', () => {
    renderGroup({ orientation: 'vertical' })
    expect(screen.getByRole('group')).toHaveClass('s-button-group--vertical')
  })

  it('label names the group, and without it the group stays unnamed', () => {
    const { unmount } = renderGroup({ label: 'Text actions' })
    expect(screen.getByRole('group', { name: 'Text actions' })).toBeInTheDocument()
    unmount()

    renderGroup()
    expect(screen.getByRole('group')).not.toHaveAttribute('aria-label')
  })

  it('passes size, variant and color down to the buttons', () => {
    renderGroup({ size: 'sm', variant: 'outline', color: 'teal' })
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('s-button--sm', 's-button--outline')
      expect(button.getAttribute('style') ?? '').toContain('--s-button-c: var(--s-teal)')
    }
  })

  it('passes the shape and disabled props down to the buttons', () => {
    renderGroup({ round: true, square: true, disabled: true })
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('s-button--round', 's-button--square')
      expect(button).toBeDisabled()
    }
  })

  it('a prop set on the button itself wins over the group', () => {
    renderGroup(
      { size: 'sm', disabled: true },
      `<SButtonGroup v-bind="$attrs">
         <SButton size="lg" :disabled="false">Copy</SButton>
         <SButton>Paste</SButton>
       </SButtonGroup>`,
    )
    const [own, inherited] = screen.getAllByRole('button')
    expect(own).toHaveClass('s-button--lg')
    expect(own).not.toBeDisabled()
    expect(inherited).toHaveClass('s-button--sm')
    expect(inherited).toBeDisabled()
  })

  it('props left unset keep the button defaults', () => {
    renderGroup({ size: 'sm' })
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('s-button--primary')
      expect(button).not.toHaveClass('s-button--round', 's-button--square')
      expect(button).not.toBeDisabled()
    }
  })
})
