import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SAlertDialog } from '../index'

describe('SAlertDialog · a11y', () => {
  it('open dialog has no violations', async () => {
    const { baseElement } = render(SAlertDialog, {
      props: {
        open: true,
        title: 'Delete file?',
        description: 'The file will be deleted permanently.',
        confirmLabel: 'Delete',
        danger: true,
      },
    })
    await screen.findByRole('alertdialog')
    expect(await axe(baseElement)).toHaveNoViolations()
  })

  it('without description the dialog has no dangling aria-describedby', async () => {
    const { baseElement } = render(SAlertDialog, {
      props: { open: true, title: 'Delete file?', confirmLabel: 'Delete' },
    })
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).not.toHaveAttribute('aria-describedby')
    expect(await axe(baseElement)).toHaveNoViolations()
  })
})
