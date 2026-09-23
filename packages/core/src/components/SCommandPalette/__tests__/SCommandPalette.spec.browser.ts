import { defineComponent, h, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SCommandPalette } from '../index'
import type { SCommandGroup } from '../types'

/**
 * The portal, the global shortcut, focus around open and close, and the highlight that travels
 * through aria-activedescendant: happy-dom reproduces none of it.
 */
const groups: SCommandGroup[] = [
  {
    label: 'Files',
    items: [
      { id: 'new', label: 'New file' },
      { id: 'open', label: 'Open file' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile', label: 'Edit profile' },
      { id: 'billing', label: 'Billing' },
      { id: 'logout', label: 'Sign out' },
    ],
  },
]

const Harness = defineComponent({
  props: { maxHeight: { type: [String, Number], default: undefined } },
  emits: ['select'],
  setup(props, { emit }) {
    const open = ref(false)
    return () =>
      h('div', [
        h('button', { onClick: () => (open.value = true) }, 'Open palette'),
        h(SCommandPalette, {
          open: open.value,
          'onUpdate:open': (value: boolean | undefined) => (open.value = value ?? false),
          onSelect: (item: unknown) => emit('select', item),
          groups,
          maxHeight: props.maxHeight,
        }),
      ])
  },
})

const input = () => screen.getByRole('combobox')
const option = (name: string) => screen.getByRole('option', { name })

const activeOption = () =>
  vi.waitFor(() => {
    const id = input().getAttribute('aria-activedescendant')
    expect(id).toBeTruthy()
    return document.getElementById(id!)!
  })

describe('SCommandPalette · browser', () => {
  it('opens on Cmd+K with focus in the search input, and on Ctrl+K as well', async () => {
    render(Harness)

    await userEvent.keyboard('{Meta>}k{/Meta}')
    const dialog = await screen.findByRole('dialog')
    await vi.waitFor(() => expect(input()).toHaveFocus())
    expect(document.body.contains(dialog)).toBe(true)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await userEvent.keyboard('{Control>}k{/Control}')
    await screen.findByRole('dialog')
    await vi.waitFor(() => expect(input()).toHaveFocus())
  })

  it('moves the highlight with the arrows, stepping over the group headings', async () => {
    render(Harness)
    await userEvent.keyboard('{Meta>}k{/Meta}')
    await screen.findByRole('dialog')
    expect(await activeOption()).toHaveTextContent('New file')

    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(async () => expect(await activeOption()).toHaveTextContent('Open file'))

    // The next row belongs to the other group: its heading is not an option, so it is skipped.
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(async () => expect(await activeOption()).toHaveTextContent('Edit profile'))

    await userEvent.keyboard('{ArrowUp}')
    await vi.waitFor(async () => expect(await activeOption()).toHaveTextContent('Open file'))
    // Focus never leaves the input: the highlight travels through aria-activedescendant.
    expect(input()).toHaveFocus()
  })

  it('runs the highlighted command on Enter and closes', async () => {
    const { emitted } = render(Harness)
    await userEvent.keyboard('{Meta>}k{/Meta}')
    await screen.findByRole('dialog')

    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(async () => expect(await activeOption()).toHaveTextContent('Open file'))
    await userEvent.keyboard('{Enter}')

    await vi.waitFor(() => expect(emitted('select')?.at(-1)).toEqual([groups[0].items[1]]))
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('Escape closes the palette and gives focus back to what opened it', async () => {
    render(Harness)
    const trigger = screen.getByRole('button', { name: 'Open palette' })
    await userEvent.click(trigger)
    await screen.findByRole('dialog')
    await vi.waitFor(() => expect(input()).toHaveFocus())

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await vi.waitFor(() => expect(trigger).toHaveFocus())
  })

  /** A height that fails to resolve costs no error: the row just collapses onto the text. */
  it('gives the search row its own height, not the height of the input', async () => {
    render(Harness)
    await userEvent.keyboard('{Meta>}k{/Meta}')
    await screen.findByRole('dialog')

    const row = document.querySelector<HTMLElement>('.s-command-palette__search')!
    const input = document.querySelector<HTMLElement>('.s-command-palette__input')!
    const close = document.querySelector<HTMLElement>('.s-command-palette__close')!

    const rowBox = row.getBoundingClientRect()
    const inputBox = input.getBoundingClientRect()
    expect(rowBox.height).toBeGreaterThan(inputBox.height + 16)
    expect(inputBox.top - rowBox.top).toBeGreaterThan(8)
    // The close button spans the row, so it stays centred against the input.
    expect(close.getBoundingClientRect().height).toBeCloseTo(rowBox.height, 0)
  })

  it('scrolls the active command into view', async () => {
    render(Harness, { props: { maxHeight: 96 } })
    await userEvent.keyboard('{Meta>}k{/Meta}')
    await screen.findByRole('dialog')

    const viewport = document.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(viewport.scrollTop).toBe(0)

    await userEvent.keyboard('{End}')
    await vi.waitFor(async () => expect(await activeOption()).toHaveTextContent('Sign out'))
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))

    const last = option('Sign out').getBoundingClientRect()
    const frame = viewport.getBoundingClientRect()
    expect(Math.round(last.bottom)).toBeLessThanOrEqual(Math.ceil(frame.bottom))
  })
})
