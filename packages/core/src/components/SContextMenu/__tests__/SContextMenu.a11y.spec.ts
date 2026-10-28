import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { ContextMenuItem } from 'reka-ui'
import { SContextMenu } from '../index'

const area = '<div>area</div>'

describe('SContextMenu · a11y', () => {
  it('has no violations (closed)', async () => {
    const { container } = render(SContextMenu, {
      props: { items: [{ label: 'Copy', value: 'copy' }] },
      slots: { default: area },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations (open)', async () => {
    render(SContextMenu, {
      props: {
        ariaLabel: 'Actions',
        items: [
          { type: 'label', label: 'Edit' },
          { label: 'Copy', value: 'copy' },
          { type: 'separator' },
          { label: 'Delete', value: 'delete', danger: true },
        ],
      },
      slots: { default: area },
    })
    await fireEvent.contextMenu(screen.getByText('area'))
    // The menu is modal: scan the panel subtree, not document.body.
    const menu = await screen.findByRole('menu')
    expect(await axe(menu)).toHaveNoViolations()
  })

  it('has no violations with a menu slot of Reka items', async () => {
    render({
      components: { SContextMenu, ContextMenuItem },
      template: `
        <SContextMenu aria-label="Actions">
          <div>area</div>
          <template #menu>
            <ContextMenuItem class="s-context-menu__item">Share</ContextMenuItem>
          </template>
        </SContextMenu>`,
    })
    await fireEvent.contextMenu(screen.getByText('area'))
    expect(await axe(await screen.findByRole('menu'))).toHaveNoViolations()
  })
})
