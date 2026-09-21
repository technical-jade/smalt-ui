import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SCard } from '../index'

/** Focus and computed styles: happy-dom computes neither. */
describe('SCard · browser', () => {
  it('a selectable card moves focus to the nested radio and highlights', async () => {
    render(SCard, {
      props: { as: 'label', interactive: true },
      slots: { default: '<input type="radio" name="size" aria-label="Size S" />' },
    })
    const radio = screen.getByRole('radio', { name: 'Size S' })
    await userEvent.click(radio)
    expect(radio).toBeChecked()
    expect(document.activeElement).toBe(radio)
  })

  it('selected draws the accent border', () => {
    const { container } = render(SCard, { props: { selected: true }, slots: { default: 'M' } })
    const styles = getComputedStyle(container.querySelector('.s-card')!)
    expect(styles.boxShadow).not.toBe('none')
  })

  /** Shadow layers: commas inside rgba(...) are not separators. */
  const layers = (el: Element) =>
    getComputedStyle(el)
      .boxShadow.split(/,(?![^(]*\))/)
      .map((layer) => layer.trim())

  it('a selected elevated card keeps both the ring and the shadow', () => {
    const { container } = render(SCard, {
      props: { variant: 'elevated', selected: true },
      slots: { default: 'M' },
    })
    const [ring, lift] = layers(container.querySelector('.s-card')!)
    expect(ring).toContain('inset')
    // The second layer is a real shadow: the selection ring does not displace it.
    expect(lift).not.toContain('rgba(0, 0, 0, 0)')
  })

  it('flat removes the elevated variant shadow without touching the selection ring', () => {
    const { container } = render(SCard, {
      props: { variant: 'elevated', selected: true, flat: true },
      slots: { default: 'M' },
    })
    const [ring, lift] = layers(container.querySelector('.s-card')!)
    expect(ring).toContain('inset')
    expect(lift).toContain('rgba(0, 0, 0, 0)')
  })

  it('--s-card-padding sets the card padding, a nested card keeps its own', () => {
    const { container } = render({
      components: { SCard },
      template: `
        <SCard style="--s-card-padding: 0">
          <SCard>Nested</SCard>
        </SCard>
      `,
    })
    const [outer, inner] = [...container.querySelectorAll('.s-card__body')]
    expect(getComputedStyle(outer).paddingTop).toBe('0px')
    expect(getComputedStyle(inner).paddingTop).not.toBe('0px')
  })

  it('a disabled button card is skipped by Tab and ignores Enter', async () => {
    const onClick = vi.fn()
    render({
      components: { SCard },
      setup: () => ({ onClick }),
      template: `
        <button>Before</button>
        <SCard as="button" disabled @click="onClick">Plan</SCard>
        <button>After</button>`,
    })
    screen.getByRole('button', { name: 'Before' }).focus()
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After' }))
    expect(screen.getByRole('button', { name: 'Plan' })).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('a disabled link card leaves the tab order and does not navigate', async () => {
    const onClick = vi.fn()
    render({
      components: { SCard },
      setup: () => ({ onClick }),
      template: `<SCard as="a" href="#plan" disabled @click="onClick">Plan</SCard>`,
    })
    const link = screen.getByText('Plan').closest('a')!
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
    link.focus()
    await userEvent.keyboard('{Enter}')
    expect(location.hash).not.toBe('#plan')
    expect(onClick).not.toHaveBeenCalled()
  })
})
