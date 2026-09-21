import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import type { Component } from 'vue'
import { SAutocomplete, SContextMenu, SDropdownMenu, SInput, SSelect } from '../index'

const options = [
  { label: 'New York', value: 'ny' },
  { label: 'Chicago', value: 'chi' },
]
const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete' },
]

/** Focus is not tracked by happy-dom, so these run in a real browser. */
describe('focus is not lost to body', () => {
  it.each<[string, Component, Record<string, unknown>, () => HTMLElement]>([
    [
      'SInput',
      SInput,
      { label: 'Name', clearable: true, modelValue: 'Ann' },
      () => screen.getByLabelText('Name'),
    ],
    [
      'SAutocomplete',
      SAutocomplete,
      { label: 'City', options, modelValue: 'ny', selectedLabel: 'New York' },
      () => screen.getByLabelText('City'),
    ],
    [
      'SSelect',
      SSelect,
      { label: 'City', options, clearable: true, modelValue: 'ny' },
      () => screen.getByRole('combobox'),
    ],
    [
      'SSelect searchable',
      SSelect,
      { label: 'City', options, clearable: true, searchable: true, modelValue: 'ny' },
      () => screen.getByRole('combobox'),
    ],
  ])('%s: clearing returns focus to the control', async (_, component, props, control) => {
    render(component, { props })
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
    expect(document.activeElement).toBe(control())
  })

  it('Tab out of SDropdownMenu moves on from the trigger', async () => {
    render({
      components: { SDropdownMenu },
      setup: () => ({ items }),
      template: `
        <button>Before</button>
        <SDropdownMenu :items="items"><template #trigger><button>Menu</button></template></SDropdownMenu>
        <button>After</button>`,
    })
    screen.getByRole('button', { name: 'Menu' }).focus()
    await userEvent.keyboard('{Enter}')
    await screen.findByRole('menu')
    await userEvent.keyboard('{Tab}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After' }))
  })

  it('Tab out of SContextMenu returns to the page', async () => {
    render({
      components: { SContextMenu },
      setup: () => ({ items }),
      template: `
        <SContextMenu :items="items"><button>Row</button></SContextMenu>
        <button>After</button>`,
    })
    const row = screen.getByRole('button', { name: 'Row' })
    row.focus()
    // What the browser sends for Shift+F10 or the context menu key on a focused element.
    row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    await screen.findByRole('menu')
    await userEvent.keyboard('{Tab}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After' }))
  })

  it('Home and End move the caret in a searchable SSelect', async () => {
    render(SSelect, { props: { options, label: 'City', searchable: true } })
    const input = screen.getByRole('combobox') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.keyboard('New')
    await screen.findByRole('listbox')
    await userEvent.keyboard('{Home}')
    expect(input.selectionStart).toBe(0)
    await userEvent.keyboard('{End}')
    expect(input.selectionStart).toBe('New'.length)
  })
})
