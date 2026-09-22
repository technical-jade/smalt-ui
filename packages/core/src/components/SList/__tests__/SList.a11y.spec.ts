import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SList } from '../index'
import { SListItem } from '../../SListItem'

const components = { SList, SListItem }

describe('SList · a11y', () => {
  it('a plain list has no violations', async () => {
    const { container } = render(
      {
        components,
        template: `
          <SList label="Recent files">
            <SListItem title="Report" description="Updated today" />
            <SListItem title="Invoice" description="Updated yesterday" />
          </SList>
        `,
      },
      {},
    )

    expect(await axe(container)).toHaveNoViolations()
  })

  it('a list of links has no violations', async () => {
    const { container } = render({
      components,
      template: `
        <SList variant="divided" label="Sections">
          <SListItem href="#overview" title="Overview" icon="check" />
          <SListItem href="#billing" title="Billing" active />
        </SList>
      `,
    })

    expect(await axe(container)).toHaveNoViolations()
  })

  it('a disabled row has no violations', async () => {
    const { container } = render({
      components,
      template: `
        <SList variant="bordered">
          <SListItem clickable title="Export" />
          <SListItem clickable disabled title="Archive" />
          <SListItem href="#gone" disabled title="Deleted" />
        </SList>
      `,
    })

    expect(await axe(container)).toHaveNoViolations()
  })
})
