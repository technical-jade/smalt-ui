import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'
import { useConfirm } from '../../../composables/useConfirm'
import { ConfirmProvider } from '../index'

afterEach(() => {
  useConfirm().clear()
})

/**
 * The focus trap and focus return need a real browser: happy-dom does not move focus across
 * portals, so "the dialog takes focus and returns it to the page after the answer" can only be
 * checked here.
 */
describe('ConfirmProvider · browser', () => {
  it('an overlay click keeps the dialog open: confirmation needs an explicit choice', async () => {
    render(ConfirmProvider)
    const answer = useConfirm().confirm({ title: 'Delete the project?' })
    await screen.findByRole('alertdialog')

    await userEvent.click(document.body, { position: { x: 5, y: 5 } })
    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(screen.queryByRole('alertdialog')).not.toBeNull()
    // The promise is still pending: racing it against a ready value returns that value.
    await expect(Promise.race([answer, Promise.resolve('pending')])).resolves.toBe('pending')

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await expect(answer).resolves.toBe(false)
  })

  it('the dialog takes focus and returns it to the trigger button after the answer', async () => {
    const Harness = defineComponent(() => {
      const { confirm } = useConfirm()
      return () => [
        h(ConfirmProvider),
        h(
          'button',
          { type: 'button', onClick: () => confirm({ title: 'Delete the project?' }) },
          'Delete',
        ),
      ]
    })
    render(Harness)

    const trigger = screen.getByRole('button', { name: 'Delete' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('alertdialog')
    await expect.poll(() => dialog.contains(document.activeElement)).toBe(true)

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await expect.poll(() => document.activeElement).toBe(trigger)
  })

  it.each([
    ['cancel', () => screen.getByRole('button', { name: 'Cancel' })],
    ['confirm', () => screen.getByRole('button', { name: 'Confirm' })],
    ['none', () => screen.getByRole('alertdialog')],
  ] as const)('initialFocus=%s decides what gets focus', async (initialFocus, target) => {
    render(ConfirmProvider)
    void useConfirm().confirm({ title: 'Delete the project?', initialFocus })
    await screen.findByRole('alertdialog')
    // Reka moves focus in a later tick; let it settle before checking.
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(document.activeElement).toBe(target())
  })
})
