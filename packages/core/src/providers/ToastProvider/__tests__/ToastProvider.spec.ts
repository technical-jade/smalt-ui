import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { render, screen } from '@testing-library/vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { ToastProvider as RekaToastProvider } from 'reka-ui'
import { useToast } from '../../../composables/useToast'
import { ToastProvider } from '../index'
import { provideDefaults } from '../../../composables'
import type { SDefaults } from '../../../composables'
import { resetDevWarnings } from '../../../internal/dev'

// A provider left mounted would render the queue of the next tests as well.
enableAutoUnmount(afterEach)

beforeEach(() => {
  const { toasts, dismiss } = useToast()
  ;[...toasts.value].forEach((t) => dismiss(t.id))
})

describe('ToastProvider', () => {
  it('shows a notification added via useToast', async () => {
    render(ToastProvider)
    const { toast } = useToast()
    toast({ title: 'File uploaded', description: 'Done' })
    expect(await screen.findByText('File uploaded')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('shows several notifications from the queue', async () => {
    render(ToastProvider)
    const { toast } = useToast()
    toast({ title: 'First' })
    toast({ title: 'Second' })
    expect(await screen.findByText('First')).toBeInTheDocument()
    expect(await screen.findByText('Second')).toBeInTheDocument()
  })

  it('renders the slot content', () => {
    render(ToastProvider, { slots: { default: 'Application' } })
    expect(screen.getByText('Application')).toBeInTheDocument()
  })

  it('notifications default to the bottom-right corner', async () => {
    render(ToastProvider)
    // The viewport is teleported to body and appears after mounting, not at render time.
    await nextTick()
    expect(document.querySelector('.s-toast-viewport')).toHaveClass(
      's-toast-viewport--bottom-right',
    )
  })

  it.each(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const)(
    'position %s is set by the prop',
    async (position) => {
      render(ToastProvider, { props: { position } })
      await nextTick()
      expect(document.querySelector('.s-toast-viewport')).toHaveClass(
        `s-toast-viewport--${position}`,
      )
    },
  )

  it.each([
    ['bottom-right', 'right'],
    ['top-right', 'right'],
    ['bottom-left', 'left'],
    ['top-left', 'left'],
  ] as const)('swipe at position %s goes toward its edge: %s', (position, direction) => {
    const wrapper = mount(ToastProvider, { props: { position } })
    expect(wrapper.findComponent(RekaToastProvider).props('swipeDirection')).toBe(direction)
  })

  it('auto-dismiss removes the toast after duration', async () => {
    /**
     * Auto-hide lives here, not in the composable (where `duration` is inert):
     * SToast → Reka ToastRoot :duration → @close → dismiss(id). The test checks the queue
     * directly (more robust against portal timing) and drives the timer with fake timers.
     */
    vi.useFakeTimers()
    try {
      const { toast, toasts } = useToast()
      render(ToastProvider, { props: { duration: 1000 } })
      toast({ title: 'Vanishing', duration: 1000 })
      expect(toasts.value.some((t) => t.title === 'Vanishing')).toBe(true)
      await nextTick()
      await vi.advanceTimersByTimeAsync(1500)
      expect(toasts.value.some((t) => t.title === 'Vanishing')).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  describe('SToast defaults', () => {
    // Reka repeats the text in a hidden live region, so the toast itself is picked by its class.
    async function toastByTitle(title: string) {
      const matches = await screen.findAllByText(title)
      return matches.map((el) => el.closest('.s-toast')).find(Boolean)
    }

    function renderWithDefaults(defaults: SDefaults, providerProps = {}) {
      const Host = defineComponent(() => {
        provideDefaults(() => defaults)
        return () => h(ToastProvider, providerProps)
      })
      return render(Host)
    }

    it('reach notifications from the queue', async () => {
      renderWithDefaults({ SToast: { variant: 'positive' } })
      useToast().toast({ title: 'Saved' })
      const toast = await toastByTitle('Saved')
      expect(toast).toHaveClass('s-toast--positive')
    })

    it('an option of the call still wins', async () => {
      renderWithDefaults({ SToast: { variant: 'positive' } })
      useToast().toast({ title: 'Failed', variant: 'negative' })
      const toast = await toastByTitle('Failed')
      expect(toast).toHaveClass('s-toast--negative')
    })

    it.each([
      ['the SToast default', {}, 1000],
      ['the provider duration over it', { duration: 3000 }, 3000],
    ])('duration: %s', async (_, providerProps, expected) => {
      vi.useFakeTimers()
      try {
        const { toast, toasts } = useToast()
        renderWithDefaults({ SToast: { duration: 1000 } }, providerProps)
        toast({ title: 'Vanishing' })
        await nextTick()
        await vi.advanceTimersByTimeAsync(expected - 200)
        expect(toasts.value).toHaveLength(1)
        await vi.advanceTimersByTimeAsync(400)
        expect(toasts.value).toHaveLength(0)
      } finally {
        vi.useRealTimers()
      }
    })
  })

  it('a second provider is a usage error: the queue is shared', () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      render(ToastProvider)
      render(ToastProvider)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ToastProvider'))
    } finally {
      warn.mockRestore()
    }
  })
})
