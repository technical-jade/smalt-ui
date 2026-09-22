import { beforeEach, describe, expect, it } from 'vitest'
import { useToast } from '../useToast'

// The queue is a module singleton; clear it before each test.
beforeEach(() => {
  const { toasts, dismiss } = useToast()
  ;[...toasts.value].forEach((t) => dismiss(t.id))
})

describe('useToast', () => {
  it('adds a notification and returns its id', () => {
    const { toast, toasts } = useToast()
    const id = toast({ title: 'Done' })
    expect(typeof id).toBe('number')
    expect(toasts.value.at(-1)).toMatchObject({ title: 'Done' })
    // Left to the SToast defaults, which the provider applies when it renders the entry.
    expect(toasts.value.at(-1)?.variant).toBeUndefined()
  })

  it('overrides the variant and description', () => {
    const { toast, toasts } = useToast()
    toast({ title: 'Error', description: 'Could not save', variant: 'negative' })
    expect(toasts.value.at(-1)).toMatchObject({
      variant: 'negative',
      description: 'Could not save',
    })
  })

  it('dismiss removes a notification by id', () => {
    const { toast, dismiss, toasts } = useToast()
    const id = toast({ title: 'X' })
    expect(toasts.value.some((t) => t.id === id)).toBe(true)
    dismiss(id)
    expect(toasts.value.some((t) => t.id === id)).toBe(false)
  })

  it('issues unique ids', () => {
    const { toast } = useToast()
    expect(toast({ title: 'A' })).not.toBe(toast({ title: 'B' }))
  })

  it('keeps duration on the queue entry', () => {
    const { toast, toasts } = useToast()
    toast({ title: 'With a timer', duration: 3000 })
    expect(toasts.value.at(-1)).toMatchObject({ duration: 3000 })
  })

  it('keeps insertion order (FIFO)', () => {
    const { toast, toasts } = useToast()
    toast({ title: 'A' })
    toast({ title: 'B' })
    toast({ title: 'C' })
    expect(toasts.value.map((t) => t.title)).toEqual(['A', 'B', 'C'])
  })

  it('dismissing the middle notification leaves its neighbors alone', () => {
    const { toast, dismiss, toasts } = useToast()
    toast({ title: 'A' })
    const mid = toast({ title: 'B' })
    toast({ title: 'C' })
    dismiss(mid)
    expect(toasts.value.map((t) => t.title)).toEqual(['A', 'C'])
  })

  it('clear empties the whole queue', () => {
    const { toast, clear, toasts } = useToast()
    toast({ title: 'A' })
    toast({ title: 'B' })
    clear()
    expect(toasts.value).toHaveLength(0)
  })
})
