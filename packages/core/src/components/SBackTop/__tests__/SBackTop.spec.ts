import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { nextTick } from 'vue'
import { SBackTop } from '../index'

/** happy-dom never scrolls, so the offset is stubbed and the event is dispatched by hand. */
function scrollWindow(offset: number) {
  Object.defineProperty(window, 'scrollY', { value: offset, configurable: true, writable: true })
  window.dispatchEvent(new Event('scroll'))
  return nextTick()
}

function scrollElement(element: HTMLElement, offset: number) {
  Object.defineProperty(element, 'scrollTop', { value: offset, configurable: true, writable: true })
  element.dispatchEvent(new Event('scroll'))
  return nextTick()
}

/** The button is hidden by `display: none`, which takes it out of the accessibility tree. */
function findButton(name?: string) {
  return screen.getByRole('button', { name, hidden: true })
}

let scrollTo: ReturnType<typeof vi.fn>

beforeEach(() => {
  scrollTo = vi.fn()
  Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true, writable: true })
})

afterEach(() => {
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
})

describe('SBackTop', () => {
  it('stays hidden until the page is scrolled past the threshold', async () => {
    const { container } = render(SBackTop)
    const wrapper = container.querySelector('.s-back-top__control')
    expect(wrapper).not.toBeVisible()

    await scrollWindow(400)
    expect(wrapper).toBeVisible()
  })

  it('respects visibilityHeight', async () => {
    const { container } = render(SBackTop, { props: { visibilityHeight: 600 } })
    const wrapper = container.querySelector('.s-back-top__control')

    await scrollWindow(400)
    expect(wrapper).not.toBeVisible()

    await scrollWindow(800)
    expect(wrapper).toBeVisible()
  })

  it('scrolls the window back to the top on click', async () => {
    render(SBackTop)
    await scrollWindow(400)
    await fireEvent.click(findButton())

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('uses the behavior prop', async () => {
    render(SBackTop, { props: { behavior: 'auto' } })
    await scrollWindow(400)
    await fireEvent.click(findButton())

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('watches and scrolls the container named by target', async () => {
    const box = document.createElement('div')
    box.id = 'scroll-box'
    box.scrollTo = vi.fn()
    document.body.append(box)

    const { container } = render(SBackTop, { props: { target: '#scroll-box' } })
    const wrapper = container.querySelector('.s-back-top__control')
    expect(wrapper).not.toBeVisible()

    await scrollElement(box, 400)
    expect(wrapper).toBeVisible()

    await fireEvent.click(findButton())
    expect(box.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(scrollTo).not.toHaveBeenCalled()

    box.remove()
  })

  it('takes the accessible name from the dictionary', () => {
    render(SBackTop)
    expect(findButton('Back to top')).toBeInTheDocument()
  })

  it('lets the label prop override the accessible name', () => {
    render(SBackTop, { props: { label: 'To the beginning' } })
    expect(findButton('To the beginning')).toBeInTheDocument()
  })

  it('passes visibility and the scroll action to the default slot', async () => {
    const seen: Array<{ visible: boolean; scrollToTop: () => void }> = []
    render(SBackTop, {
      slots: {
        default: (slotProps: { visible: boolean; scrollToTop: () => void }) => {
          seen.push(slotProps)
          return `visible: ${slotProps.visible}`
        },
      },
    })

    expect(screen.getByText('visible: false')).toBeInTheDocument()
    expect(typeof seen[0]!.scrollToTop).toBe('function')

    await scrollWindow(400)
    expect(screen.getByText('visible: true')).toBeInTheDocument()

    seen.at(-1)!.scrollToTop()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('passes the consumer class and style down to the positioned root', () => {
    const { container } = render(SBackTop, {
      attrs: { class: 'page-back-top', style: '--s-back-top-right: 12px' },
    })
    const root = container.querySelector<HTMLElement>('.s-back-top')!

    expect(root).toHaveClass('page-back-top')
    expect(root.style.getPropertyValue('--s-back-top-right')).toBe('12px')
  })

  it('drops the scroll listener when unmounted', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(SBackTop)
    unmount()

    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
    remove.mockRestore()
  })
})
