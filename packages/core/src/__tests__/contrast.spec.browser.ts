import { afterEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { h } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { SAlert } from '../components/SAlert'
import { SAvatar } from '../components/SAvatar'
import { SBadge } from '../components/SBadge'
import { SButton } from '../components/SButton'
import { SCalendar } from '../components/SCalendar'
import { SInput } from '../components/SInput'
import { SList } from '../components/SList'
import { SListItem } from '../components/SListItem'
import { SStat } from '../components/SStat'

/**
 * Contrast can only be measured with layout and computed styles: in happy-dom axe silently
 * skips the color-contrast rule. So "text × actual background" pairs are checked here, in real
 * Chromium.
 */
const AA_NORMAL = 4.5

type Rgba = [number, number, number, number]

/**
 * Chromium returns a computed `color-mix()` as `color(srgb …)` with 0–1 fractions, and plain
 * colors as `rgb()/rgba()` with bytes. The prefix tells them apart; otherwise fractions are read
 * as bytes and every color pair converges to a 1:1 contrast.
 */
function parse(color: string): Rgba {
  const nums = color.match(/[\d.]+/g)
  if (!nums) throw new Error(`unparsed color: ${color}`)
  const scale = color.startsWith('color(') ? 255 : 1
  const [r, g, b, a = '1'] = nums
  return [Number(r) * scale, Number(g) * scale, Number(b) * scale, Number(a)]
}

function over([r, g, b, a]: Rgba, base: Rgba): Rgba {
  return [r * a + base[0] * (1 - a), g * a + base[1] * (1 - a), b * a + base[2] * (1 - a), 1]
}

/** Element background: the first opaque ancestor with the translucent layers composited on top. */
function backgroundOf(el: Element): Rgba {
  const layers: Rgba[] = []
  let node: Element | null = el
  let base: Rgba = [255, 255, 255, 1]
  while (node) {
    const rgba = parse(getComputedStyle(node).backgroundColor)
    if (rgba[3] > 0) {
      if (rgba[3] === 1) {
        base = rgba
        break
      }
      layers.push(rgba)
    }
    node = node.parentElement
  }
  return layers.reduceRight((acc, layer) => over(layer, acc), base)
}

function luminance([r, g, b]: Rgba): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastOf(el: Element): number {
  const bg = backgroundOf(el)
  const fg = over(parse(getComputedStyle(el).color), bg)
  const [a, b] = [luminance(fg), luminance(bg)]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

function mount(node: ReturnType<typeof h>, theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme
  return render({ render: () => h('div', { class: 's-root s-root--app' }, [node]) })
}

afterEach(() => {
  delete document.documentElement.dataset.theme
})

describe.each(['light', 'dark'] as const)('text contrast · theme %s', (theme) => {
  it('resting field label: the placeholder is transparent, only the label is visible', () => {
    const { container } = mount(h(SInput, { label: 'Delivery instructions' }), theme)
    expect(contrastOf(container.querySelector('.s-input__label')!)).toBeGreaterThanOrEqual(
      AA_NORMAL,
    )
  })

  it('field error message', () => {
    const { container } = mount(h(SInput, { label: 'Weight', error: 'From 0.1 to 30 kg' }), theme)
    expect(contrastOf(container.querySelector('.s-field__error')!)).toBeGreaterThanOrEqual(
      AA_NORMAL,
    )
  })

  it('link inside the library container', () => {
    const { container } = mount(h('a', { href: '#' }, 'Link'), theme)
    expect(contrastOf(container.querySelector('a')!)).toBeGreaterThanOrEqual(AA_NORMAL)
  })

  it.each(['primary', 'secondary', 'outline', 'ghost', 'negative'] as const)(
    'button %s',
    (variant) => {
      const { container } = mount(
        h(SButton, { variant }, () => 'Check out'),
        theme,
      )
      expect(contrastOf(container.querySelector('.s-button')!)).toBeGreaterThanOrEqual(AA_NORMAL)
    },
  )

  it.each(['neutral', 'primary', 'positive', 'warning', 'negative'] as const)(
    'badge %s',
    (variant) => {
      const { container } = mount(
        h(SBadge, { variant }, () => 'Label'),
        theme,
      )
      expect(contrastOf(container.querySelector('.s-badge')!)).toBeGreaterThanOrEqual(AA_NORMAL)
    },
  )

  it.each(['info', 'positive', 'warning', 'negative'] as const)('alert %s', (variant) => {
    const { container } = mount(
      h(SAlert, { variant, title: 'Title' }, () => 'Notification text'),
      theme,
    )
    expect(contrastOf(container.querySelector('.s-alert__title')!)).toBeGreaterThanOrEqual(
      AA_NORMAL,
    )
    expect(contrastOf(container.querySelector('.s-alert__body')!)).toBeGreaterThanOrEqual(AA_NORMAL)
  })

  it('adjacent-month days in the calendar', () => {
    const { container } = mount(h(SCalendar, { locale: 'en-GB' }), theme)
    const outside = container.querySelectorAll('[data-outside-view], [data-outside-visible-view]')
    expect(outside.length).toBeGreaterThan(0)
    outside.forEach((day) => expect(contrastOf(day)).toBeGreaterThanOrEqual(AA_NORMAL))
  })

  /**
   * The end of the month shows twice: in its own month and as an adjacent-month day in the next
   * one. The selected fill comes from `[data-selected]`, the digit color from the adjacent-month
   * rule.
   */
  it('selected day shown as an adjacent-month day', () => {
    const { container } = mount(
      h(SCalendar, {
        locale: 'en-GB',
        numberOfMonths: 2,
        modelValue: new CalendarDate(2026, 7, 30),
      }),
      theme,
    )
    const selected = container.querySelectorAll('[data-selected]')
    expect(selected.length).toBeGreaterThan(1)
    selected.forEach((day) => expect(contrastOf(day)).toBeGreaterThanOrEqual(AA_NORMAL))
  })

  it('active list row on its own tint', () => {
    const { container } = mount(
      h(SList, () => h(SListItem, { title: 'Inbox', active: true })),
      theme,
    )
    expect(contrastOf(container.querySelector('.s-list-item__row')!)).toBeGreaterThanOrEqual(
      AA_NORMAL,
    )
  })

  it.each([12, -12])('stat trend %d', (trend) => {
    const { container } = mount(h(SStat, { label: 'Revenue', value: 128, trend }), theme)
    expect(contrastOf(container.querySelector('.s-stat__trend-value')!)).toBeGreaterThanOrEqual(
      AA_NORMAL,
    )
  })

  it('avatar fallback initials', () => {
    const { container } = mount(h(SAvatar, { fallback: 'AJ' }), theme)
    expect(contrastOf(container.querySelector('.s-avatar__fallback')!)).toBeGreaterThanOrEqual(
      AA_NORMAL,
    )
  })
})
