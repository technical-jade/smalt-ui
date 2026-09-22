import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SListItem } from '../index'

/** A row is only valid inside a list, so every case is rendered within `role="list"`. */
function renderInList(template: string) {
  return render({
    components: { SListItem },
    template: `<div role="list" aria-label="Rows">${template}</div>`,
  })
}

describe('SListItem · a11y', () => {
  it('a plain row has no violations', async () => {
    const { container } = renderInList(
      '<SListItem title="Report" description="Updated today" icon="check" />',
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('a link row has no violations', async () => {
    const { container } = renderInList('<SListItem href="/billing" title="Billing" active />')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('a disabled action row has no violations', async () => {
    const { container } = renderInList('<SListItem clickable disabled title="Archive" />')
    expect(await axe(container)).toHaveNoViolations()
  })
})
