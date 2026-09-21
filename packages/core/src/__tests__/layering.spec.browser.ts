import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SDialog, SDrawer, SPopover, SSelect } from '../index'

const options = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
]

// The element a click at the center of the option would reach.
function hit(el: Element) {
  const { left, top, width, height } = el.getBoundingClientRect()
  return document.elementFromPoint(left + width / 2, top + height / 2)
}

/** A list teleported to body is stacked by z-index alone, which happy-dom does not compute. */
describe('a select list opens above the layer it is in', () => {
  it.each([
    ['SDialog', '<SDialog open title="Pick">'],
    ['SDrawer', '<SDrawer open title="Pick">'],
    ['SPopover', '<SPopover open><template #trigger><button>Open</button></template>'],
  ])('%s', async (name, open) => {
    render({
      components: { SDialog, SDrawer, SPopover, SSelect },
      setup: () => ({ options }),
      template: `${open}<SSelect :options="options" aria-label="Letter" /></${name}>`,
    })
    // From the keyboard: a click inside the open popover times out waiting for it to settle.
    ;(await screen.findByRole('combobox', { name: 'Letter' })).focus()
    await userEvent.keyboard('{ArrowDown}')
    const option = await screen.findByRole('option', { name: 'Beta' })
    expect(option.contains(hit(option))).toBe(true)
  })
})
