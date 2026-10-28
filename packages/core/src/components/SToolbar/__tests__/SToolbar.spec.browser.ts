import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SButton } from '../../SButton'
import { SPopover } from '../../SPopover'
import { SSeparator } from '../../SSeparator'
import { SToggle } from '../../SToggle'
import { SToolbar } from '../index'

// Roving focus is focus and keyboard, which happy-dom does not reproduce faithfully.
describe('SToolbar · roving focus', () => {
  function mount(props = '', extra = '') {
    return render({
      components: { SToolbar, SButton, SSeparator, SToggle, SPopover },
      template: `
        <div>
          <button>Before</button>
          <SToolbar aria-label="Formatting" ${props}>
            <SButton variant="ghost">Bold</SButton>
            <SToggle aria-label="Italic">I</SToggle>
            <SSeparator orientation="vertical" />
            <SButton variant="ghost" disabled>Link</SButton>
            <SButton variant="ghost">Quote</SButton>
            ${extra}
          </SToolbar>
          <button>After</button>
        </div>
      `,
    })
  }

  const button = (name: string) => screen.getByRole('button', { name })

  it('the toolbar is a single tab stop', async () => {
    mount()
    button('Before').focus()

    await userEvent.tab()
    expect(button('Bold')).toHaveFocus()
    await userEvent.tab()
    expect(button('After')).toHaveFocus()
  })

  it('arrows move focus, skipping disabled items and the separator', async () => {
    mount()
    button('Bold').focus()

    await userEvent.keyboard('{ArrowRight}')
    expect(button('Italic')).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(button('Quote')).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(button('Italic')).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(button('Quote')).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(button('Bold')).toHaveFocus()
  })

  it('Tab returns to the item that had focus last', async () => {
    mount()
    button('Bold').focus()
    await userEvent.keyboard('{ArrowRight}')

    button('Before').focus()
    await userEvent.tab()
    expect(button('Italic')).toHaveFocus()
  })

  it('loop wraps the navigation, without it the navigation stops at the edge', async () => {
    mount()
    button('Quote').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(button('Bold')).toHaveFocus()

    document.body.innerHTML = ''
    mount(':loop="false"')
    button('Quote').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(button('Quote')).toHaveFocus()
  })

  it('a vertical toolbar listens to the up and down arrows', async () => {
    mount('orientation="vertical"')
    button('Bold').focus()

    await userEvent.keyboard('{ArrowRight}')
    expect(button('Bold')).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(button('Italic')).toHaveFocus()
  })

  it('buttons in a popup do not become toolbar items', async () => {
    mount(
      '',
      `<SPopover>
        <template #trigger><SButton variant="ghost">More</SButton></template>
        <SButton>Inside</SButton>
      </SPopover>`,
    )
    await userEvent.click(button('More'))
    const inner = await screen.findByRole('button', { name: 'Inside' })

    expect(inner).not.toHaveAttribute('tabindex')
    expect(button('More')).toHaveAttribute('tabindex')
  })
})
