import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { useConfirm } from '../../../composables/useConfirm'
import { ConfirmProvider } from '../index'
import { resetDevWarnings } from '../../../internal/dev'

beforeEach(() => {
  useConfirm().clear()
})

afterEach(() => {
  useConfirm().clear()
})

const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }))

describe('ConfirmProvider', () => {
  it('shows the dialog with the given text', async () => {
    render(ConfirmProvider)
    const { confirm } = useConfirm()
    confirm({ title: 'Delete the project?', description: 'This cannot be undone.' })

    expect(await screen.findByText('Delete the project?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('confirming resolves the promise to true', async () => {
    render(ConfirmProvider)
    const answer = useConfirm().confirm({ title: 'Delete the project?' })

    await screen.findByText('Delete the project?')
    await click('Confirm')

    await expect(answer).resolves.toBe(true)
  })

  it('canceling resolves the promise to false', async () => {
    render(ConfirmProvider)
    const answer = useConfirm().confirm({ title: 'Delete the project?' })

    await screen.findByText('Delete the project?')
    await click('Cancel')

    await expect(answer).resolves.toBe(false)
  })

  it('Escape declines just like the cancel button', async () => {
    render(ConfirmProvider)
    const answer = useConfirm().confirm({ title: 'Delete the project?' })

    const title = await screen.findByText('Delete the project?')
    await fireEvent.keyDown(title, { key: 'Escape' })

    await expect(answer).resolves.toBe(false)
  })

  it('calls are queued: the next dialog waits for an answer to the previous one', async () => {
    render(ConfirmProvider)
    const { confirm } = useConfirm()
    const first = confirm({ title: 'First question' })
    const second = confirm({ title: 'Second question' })

    await screen.findByText('First question')
    expect(screen.queryByText('Second question')).toBeNull()

    await click('Confirm')
    await expect(first).resolves.toBe(true)

    expect(await screen.findByText('Second question')).toBeInTheDocument()
    await click('Cancel')
    await expect(second).resolves.toBe(false)
  })

  it('unmounting the provider does not leave the promise pending', async () => {
    const { unmount } = render(ConfirmProvider)
    const answer = useConfirm().confirm({ title: 'Delete the project?' })

    await screen.findByText('Delete the project?')
    unmount()

    await expect(answer).resolves.toBe(false)
  })

  it('declines and warns without a provider', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      await expect(useConfirm().confirm({ title: 'Delete the project?' })).resolves.toBe(false)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ConfirmProvider'))
    } finally {
      warn.mockRestore()
    }
  })

  it('a second provider is a usage error: the queue is shared', async () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      render(ConfirmProvider)
      render(ConfirmProvider)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ConfirmProvider'))
    } finally {
      warn.mockRestore()
    }
  })
})
