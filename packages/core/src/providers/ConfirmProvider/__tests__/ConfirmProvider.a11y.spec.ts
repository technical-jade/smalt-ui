import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { useConfirm } from '../../../composables/useConfirm'
import { clearConfirms } from '../../../internal/confirmQueue'
import { ConfirmProvider } from '../index'

afterEach(() => {
  clearConfirms()
})

describe('ConfirmProvider · a11y', () => {
  it('a programmatically opened dialog has no violations', async () => {
    const { baseElement } = render(ConfirmProvider)
    useConfirm().confirm({
      title: 'Delete the project?',
      description: 'The project and all its data will be permanently deleted.',
      confirmLabel: 'Delete',
      danger: true,
    })

    await screen.findByRole('alertdialog')
    expect(await axe(baseElement)).toHaveNoViolations()
  })
})
