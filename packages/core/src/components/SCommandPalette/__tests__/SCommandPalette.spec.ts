import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SCommandPalette } from '../index'
import { filterCommandGroups, matchesCommand } from '../filter'
import type { SCommandGroup } from '../types'

const groups: SCommandGroup[] = [
  {
    label: 'Files',
    items: [
      { id: 'new', label: 'New file', icon: 'plus', shortcut: ['meta', 'n'] },
      { id: 'open', label: 'Open file', description: 'From the workspace' },
      { id: 'archive', label: 'Archive file', disabled: true },
    ],
  },
  {
    label: 'Account',
    items: [{ id: 'logout', label: 'Sign out', keywords: ['exit', 'log off'] }],
  },
]

const renderPalette = (props: Record<string, unknown> = {}) =>
  render(SCommandPalette, { props: { open: true, groups, ...props } })

const pressShortcut = (target: EventTarget = document.body, key = 'k') => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, metaKey: true, bubbles: true }))
}

describe('SCommandPalette', () => {
  it('lists the groups, the commands, their icons and their shortcut hints', async () => {
    renderPalette()
    await screen.findByRole('dialog')

    expect(screen.getByText('Files')).toBeInTheDocument()
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(4)

    const newFile = screen.getByRole('option', { name: /New file/ })
    expect(newFile.querySelector('.s-command-palette__item-icon')).toBeInTheDocument()
    expect(newFile.querySelectorAll('.s-kbd')).toHaveLength(2)
    expect(screen.getByRole('option', { name: /Open file/ })).toHaveTextContent(
      'From the workspace',
    )
  })

  it('names the search input from the locale dictionary and links it to the list', async () => {
    renderPalette()
    await screen.findByRole('dialog')

    const input = screen.getByRole('combobox', { name: 'Search commands' })
    expect(input).toHaveAttribute('placeholder', 'Search commands')
    expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id)
  })

  it('filters by label, description and keywords, and updates v-model:search', async () => {
    const { emitted } = renderPalette()
    await screen.findByRole('dialog')

    await fireEvent.update(screen.getByRole('combobox'), 'LOG OFF')
    expect(emitted('update:search')?.at(-1)).toEqual(['LOG OFF'])
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: /Sign out/ })).toBeInTheDocument()
    expect(screen.queryByText('Files')).toBeNull()

    await fireEvent.update(screen.getByRole('combobox'), 'workspace')
    expect(screen.getByRole('option', { name: /Open file/ })).toBeInTheDocument()
  })

  it('leaves the list untouched with filter off', async () => {
    renderPalette({ filter: false })
    await screen.findByRole('dialog')

    await fireEvent.update(screen.getByRole('combobox'), 'nothing matches this')
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })

  it('shows the empty text from the dictionary, and the empty slot instead', async () => {
    const { unmount } = renderPalette({ groups: [] })
    await screen.findByRole('dialog')
    expect(screen.getByText('No results found')).toBeInTheDocument()
    unmount()

    render(SCommandPalette, {
      props: { open: true, groups: [] },
      slots: { empty: 'Nothing here yet' },
    })
    await screen.findByRole('dialog')
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('emits the selected command and closes', async () => {
    const { emitted } = renderPalette()
    await screen.findByRole('dialog')

    await fireEvent.click(screen.getByRole('option', { name: /Open file/ }))
    expect(emitted('select')?.at(-1)).toEqual([groups[0].items[1]])
    expect(emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('ignores a click on a disabled command', async () => {
    const { emitted } = renderPalette()
    await screen.findByRole('dialog')

    await fireEvent.click(screen.getByRole('option', { name: /Archive file/ }))
    expect(emitted('select')).toBeUndefined()
    expect(emitted('update:open')).toBeUndefined()
  })

  it('clears the query when the palette closes', async () => {
    const { emitted, rerender } = renderPalette()
    await screen.findByRole('dialog')
    await fireEvent.update(screen.getByRole('combobox'), 'sign')

    await rerender({ open: false })
    expect(emitted('update:search')?.at(-1)).toEqual([''])
  })

  it('opens on the global shortcut and releases it on unmount', async () => {
    const onOpen = vi.fn()
    // A handler prop rather than `emitted()`: the recorded events are gone once the wrapper is
    // unmounted, which is exactly the moment this test asks about.
    const { unmount } = render(SCommandPalette, { props: { groups, 'onUpdate:open': onOpen } })
    await nextTick()

    pressShortcut()
    expect(onOpen).toHaveBeenCalledWith(true)

    unmount()
    onOpen.mockClear()
    pressShortcut()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('leaves the shortcut to the field the user is typing in', async () => {
    const { emitted } = render(SCommandPalette, { props: { groups } })
    await nextTick()

    const field = document.body.appendChild(document.createElement('input'))
    pressShortcut(field)
    expect(emitted('update:open')).toBeUndefined()
    field.remove()
  })

  it('binds nothing with shortcutKey false, and honours another key', async () => {
    const { emitted, unmount } = render(SCommandPalette, {
      props: { groups, shortcutKey: false },
    })
    await nextTick()
    pressShortcut()
    expect(emitted('update:open')).toBeUndefined()
    unmount()

    const other = render(SCommandPalette, { props: { groups, shortcutKey: 'j' } })
    await nextTick()
    pressShortcut(document.body, 'k')
    expect(other.emitted('update:open')).toBeUndefined()
    pressShortcut(document.body, 'j')
    expect(other.emitted('update:open')?.at(-1)).toEqual([true])
  })
})

describe('filterCommandGroups', () => {
  const [files] = groups

  it('matches the label, the description and the keywords, ignoring case', () => {
    expect(matchesCommand(files.items[0], 'NEW')).toBe(true)
    expect(matchesCommand(files.items[1], 'Workspace')).toBe(true)
    expect(matchesCommand(groups[1].items[0], 'exit')).toBe(true)
    expect(matchesCommand(files.items[0], 'sign')).toBe(false)
  })

  it('keeps every command for a blank query', () => {
    expect(filterCommandGroups(groups, '   ')).toBe(groups)
  })

  it('drops the groups left without commands', () => {
    expect(filterCommandGroups(groups, 'file')).toEqual([{ label: 'Files', items: files.items }])
  })
})
