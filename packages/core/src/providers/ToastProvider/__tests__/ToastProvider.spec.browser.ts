import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'
import { useToast } from '../../../composables/useToast'
import { ToastProvider } from '../index'
import type { SToastPosition } from '../types'

afterEach(() => {
  const { clear } = useToast()
  clear()
})

/**
 * The position comes from `position: fixed` and logical properties; happy-dom does not compute
 * layout, so it is checked here: the viewport must stick to its own window edges.
 */
const CASES: Array<[SToastPosition, { top: boolean; left: boolean }]> = [
  ['top-left', { top: true, left: true }],
  ['top-right', { top: true, left: false }],
  ['bottom-left', { top: false, left: true }],
  ['bottom-right', { top: false, left: false }],
]

/**
 * The provider is mounted inside the app, not at the document root, and any ancestor with
 * `isolation`/`transform`/`z-index` traps `position: fixed` in its stacking context — then the
 * host header or sidebar paints over the notification. The wrapper below reproduces exactly
 * that: the library's `.s-root` isolates its subtree.
 */
function renderIsolated(position: SToastPosition = 'bottom-right') {
  const Harness = defineComponent(() => () => [
    h('div', { style: 'isolation: isolate' }, [h(ToastProvider, { position })]),
    h('div', {
      class: 'host-layer',
      style: 'position: fixed; inset: 0; z-index: 1; background: rgba(0,0,0,0.02)',
    }),
  ])
  return render(Harness)
}

describe('ToastProvider · browser', () => {
  it('the notification paints above host layers, not below them', async () => {
    renderIsolated()
    useToast().toast({ title: 'File uploaded' })
    await screen.findByText('File uploaded')

    const toast = document.querySelector('.s-toast')!.getBoundingClientRect()
    const onTop = document.elementFromPoint(
      toast.left + toast.width / 2,
      toast.top + toast.height / 2,
    )
    expect(onTop?.closest('.s-toast')).not.toBeNull()
  })

  it('the viewport lives in body, not in the subtree where the provider is mounted', async () => {
    const { container } = renderIsolated()
    useToast().toast({ title: 'File uploaded' })
    await screen.findByText('File uploaded')

    const viewport = document.querySelector('.s-toast-viewport')!
    expect(container.contains(viewport)).toBe(false)
    expect(document.body.contains(viewport)).toBe(true)
  })

  it.each(CASES)('position %s pins notifications to its edges', async (position, edges) => {
    render(ToastProvider, { props: { position } })
    useToast().toast({ title: 'File uploaded' })
    await screen.findByText('File uploaded')

    const viewport = document.querySelector('.s-toast-viewport')!.getBoundingClientRect()
    const middleX = window.innerWidth / 2
    const middleY = window.innerHeight / 2

    expect(viewport.width).toBeGreaterThan(0)
    if (edges.top) expect(viewport.top).toBeLessThan(middleY)
    else expect(viewport.bottom).toBeGreaterThan(middleY)
    if (edges.left) expect(viewport.left).toBeLessThan(middleX)
    else expect(viewport.right).toBeGreaterThan(middleX)
  })

  it('the newest notification appears at its edge, not deep in the stack', async () => {
    render(ToastProvider, { props: { position: 'top-right' } })
    const { toast } = useToast()
    toast({ title: 'First' })
    toast({ title: 'Second' })
    await screen.findByText('Second')

    const toasts = [...document.querySelectorAll('.s-toast')]
    const byTitle = (title: string) =>
      toasts.find((el) => el.textContent?.includes(title))!.getBoundingClientRect()
    expect(byTitle('Second').top).toBeLessThan(byTitle('First').top)
  })

  it('the close button shows the focus ring outside .s-root', async () => {
    render(ToastProvider)
    useToast().toast({ title: 'File uploaded' })
    await screen.findByText('File uploaded')
    const close = document.querySelector<HTMLElement>('.s-toast__close')!
    // Keyboard modality first, otherwise Chromium does not match :focus-visible.
    await userEvent.keyboard('{Shift}')
    close.focus()
    expect(close.matches(':focus-visible')).toBe(true)
    const style = getComputedStyle(close)
    expect(style.outlineStyle).toBe('solid')
    expect(parseFloat(style.outlineWidth)).toBeGreaterThan(0)
  })
})
