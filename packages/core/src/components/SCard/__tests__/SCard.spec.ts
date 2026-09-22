import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { provideDefaults } from '../../../composables'
import { render, screen } from '@testing-library/vue'
import { SCard } from '../index'
import { resetDevWarnings } from '../../../internal/dev'

describe('SCard', () => {
  it('renders the header/default/footer slots', () => {
    render(SCard, {
      slots: { header: 'Title', default: 'Body', footer: 'Footer' },
    })
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies the variant class', () => {
    const { container } = render(SCard, { props: { variant: 'elevated' }, slots: { default: 'X' } })
    expect(container.querySelector('.s-card')).toHaveClass('s-card--elevated')
  })

  it('does not render header/footer without slots', () => {
    const { container } = render(SCard, { slots: { default: 'Body only' } })
    expect(container.querySelector('.s-card__header')).toBeNull()
    expect(container.querySelector('.s-card__footer')).toBeNull()
  })

  it('as changes the root tag — a selectable card is built on label', () => {
    const { container } = render(SCard, {
      props: { as: 'label', interactive: true },
      slots: { default: '<input type="radio" name="size" />' },
    })
    const root = container.querySelector('.s-card')!
    expect(root.tagName).toBe('LABEL')
    expect(root).toHaveClass('s-card--interactive')
  })

  it('selected is marked by both a class and a data attribute', () => {
    const { container } = render(SCard, { props: { selected: true }, slots: { default: 'M' } })
    const root = container.querySelector('.s-card')!
    expect(root).toHaveClass('s-card--selected')
    expect(root).toHaveAttribute('data-selected', 'true')
  })

  it('disabled marks the card as disabled', () => {
    const { container } = render(SCard, { props: { disabled: true }, slots: { default: 'M' } })
    expect(container.querySelector('.s-card')).toHaveAttribute('data-disabled', 'true')
  })

  it('flat removes the elevated variant shadow', () => {
    const { container } = render(SCard, {
      props: { variant: 'elevated', flat: true },
      slots: { default: 'M' },
    })
    expect(container.querySelector('.s-card')?.getAttribute('style')).toContain(
      '--s-card-elevation: 0 0 #0000',
    )
  })

  it('elevation sets the level on top of the variant', () => {
    const { container } = render(SCard, { props: { elevation: 3 }, slots: { default: 'M' } })
    expect(container.querySelector('.s-card')?.getAttribute('style')).toContain(
      '--s-card-elevation: var(--s-elevation-3)',
    )
  })

  it('global flat turns the shadow off, a local elevation brings it back', () => {
    const Host = defineComponent({
      props: { cardProps: { type: Object, default: () => ({}) } },
      setup(props) {
        provideDefaults(() => ({ global: { flat: true } }))
        return () => h(SCard, props.cardProps, { default: () => 'M' })
      },
    })

    const flat = render(Host, { props: { cardProps: { variant: 'elevated' } } })
    expect(flat.container.querySelector('.s-card')?.getAttribute('style')).toContain(
      '--s-card-elevation: 0 0 #0000',
    )

    const lifted = render(Host, { props: { cardProps: { variant: 'elevated', elevation: 2 } } })
    expect(lifted.container.querySelector('.s-card')?.getAttribute('style')).toContain(
      '--s-card-elevation: var(--s-elevation-2)',
    )
  })

  it('bodyClass lands on the content wrapper', () => {
    const { container } = render(SCard, {
      props: { bodyClass: 'cargo-row' },
      slots: { default: 'Body' },
    })
    expect(container.querySelector('.s-card__body')).toHaveClass('cargo-row')
  })

  describe('disabled label card', () => {
    beforeEach(() => resetDevWarnings())
    afterEach(() => vi.restoreAllMocks())

    it('warns about an enabled control inside', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(SCard, {
        props: { as: 'label', disabled: true },
        slots: { default: '<input type="radio" name="size" /> Small' },
      })
      await nextTick()
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[SCard] disabled label card'))
    })

    it('stays quiet when the control is disabled too', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(SCard, {
        props: { as: 'label', disabled: true },
        slots: { default: '<input type="radio" name="size" disabled /> Small' },
      })
      await nextTick()
      expect(warn).not.toHaveBeenCalled()
    })
  })
})
