import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SCommandPalette } from '../index'
import type { SCommandGroup } from '../types'

const groups: SCommandGroup[] = [
  {
    label: 'Files',
    items: [
      { id: 'new', label: 'New file', shortcut: ['meta', 'n'] },
      { id: 'open', label: 'Open file', description: 'From the workspace' },
    ],
  },
  { items: [{ id: 'logout', label: 'Sign out' }] },
]

describe('SCommandPalette · a11y', () => {
  // Scanned on the panel, not the body: Reka's focus guards trip the `aria-hidden-focus` rule.
  it('has no violations when open', async () => {
    render(SCommandPalette, { props: { open: true, groups } })
    expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations()
  })

  it('has no violations with an empty list', async () => {
    render(SCommandPalette, { props: { open: true, groups: [] } })
    expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations()
  })

  it('pairs the combobox with the list and announces the active command', async () => {
    render(SCommandPalette, { props: { open: true, groups } })
    await screen.findByRole('dialog')

    const input = screen.getByRole('combobox')
    const list = screen.getByRole('listbox')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-controls', list.id)

    const active = await vi.waitFor(() => {
      const id = input.getAttribute('aria-activedescendant')
      expect(id).toBeTruthy()
      return id
    })
    expect(list.querySelector(`#${active}`)).toHaveAttribute('role', 'option')
  })
})
