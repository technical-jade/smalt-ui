import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SAlertDialog } from '../index'

describe('SAlertDialog', () => {
  it('open: alertdialog with confirm and cancel buttons', async () => {
    render(SAlertDialog, {
      props: {
        open: true,
        title: 'Delete project?',
        description: 'This cannot be undone',
        confirmLabel: 'Delete',
        danger: true,
      },
    })
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('confirm button emits confirm', async () => {
    const { emitted } = render(SAlertDialog, {
      props: { open: true, title: 'Are you sure?', confirmLabel: 'Yes' },
    })
    await screen.findByRole('alertdialog')
    await fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    expect(emitted().confirm).toBeTruthy()
  })

  it('cancel button emits cancel', async () => {
    const { emitted } = render(SAlertDialog, {
      props: { open: true, title: 'Are you sure?', cancelLabel: 'No' },
    })
    await screen.findByRole('alertdialog')
    await fireEvent.click(screen.getByRole('button', { name: 'No' }))
    expect(emitted().cancel).toBeTruthy()
  })

  it('closing with Escape emits cancel', async () => {
    const { emitted } = render(SAlertDialog, {
      props: { open: true, title: 'Delete?' },
    })
    await screen.findByRole('alertdialog')
    await fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(emitted().cancel).toBeTruthy()
  })

  it('confirming does not emit cancel after the close', async () => {
    const { emitted } = render(SAlertDialog, {
      props: { open: true, title: 'Delete?' },
    })
    await screen.findByRole('alertdialog')
    await fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(emitted().confirm).toBeTruthy()
    expect(emitted().cancel).toBeFalsy()
  })

  it('danger makes the confirm button destructive', async () => {
    render(SAlertDialog, {
      props: { open: true, title: 'X', confirmLabel: 'Delete', danger: true },
    })
    await screen.findByRole('alertdialog')
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('s-button--negative')
  })

  it('class, data attributes and listeners from the component land on the dialog', async () => {
    const onEscapeKeyDown = vi.fn()
    render(SAlertDialog, {
      props: { open: true, title: 'Delete project?' },
      attrs: { class: 'delete-confirm', 'data-testid': 'delete-dialog', onEscapeKeyDown },
    })
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveClass('s-alert-dialog__content', 'delete-confirm')
    expect(dialog).toHaveAttribute('data-testid', 'delete-dialog')
    await fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(onEscapeKeyDown).toHaveBeenCalled()
  })
})
