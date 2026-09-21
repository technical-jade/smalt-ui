import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SAccordion } from '../../SAccordion'
import { installDefaults } from '../../../composables'
import { SAccordionItem } from '../index'

// SAccordionItem works only inside SAccordion (it takes the group context).
const Wrapper = {
  components: { SAccordion, SAccordionItem },
  template: `
    <SAccordion>
      <SAccordionItem value="x" title="Section title">Section body</SAccordionItem>
    </SAccordion>
  `,
}

describe('SAccordionItem', () => {
  it('renders the header trigger, collapsed by default', () => {
    render(Wrapper)
    expect(screen.getByRole('button', { name: 'Section title' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('expands the content on click', async () => {
    render(Wrapper)
    await fireEvent.click(screen.getByRole('button', { name: 'Section title' }))
    expect(await screen.findByText('Section body')).toBeInTheDocument()
  })

  it('supports a custom header through the slot', () => {
    render({
      components: { SAccordion, SAccordionItem },
      template: `
        <SAccordion>
          <SAccordionItem value="x">
            <template #title>Custom title</template>
            Body
          </SAccordionItem>
        </SAccordion>
      `,
    })
    expect(screen.getByRole('button', { name: /Custom title/ })).toBeInTheDocument()
  })

  it('renders the chevron-down indicator by default', () => {
    const { container } = render(Wrapper)
    expect(container.querySelector('.s-accordion__chevron path')).toHaveAttribute(
      'd',
      'm6 9 6 6 6-6',
    )
  })

  it('uses the icon from the expandIcon prop', () => {
    const { container } = render({
      components: { SAccordion, SAccordionItem },
      template: `
        <SAccordion>
          <SAccordionItem
            value="x"
            title="T"
            expand-icon="chevron-up"
          >Body</SAccordionItem>
        </SAccordion>
      `,
    })
    expect(container.querySelector('.s-accordion__chevron path')).toHaveAttribute(
      'd',
      'm18 15-6-6-6 6',
    )
  })

  it('follows unmount-on-hide of the accordion and can override it', () => {
    render(
      {
        components: { SAccordion, SAccordionItem },
        template: `
          <SAccordion>
            <SAccordionItem value="a" title="A">Body A</SAccordionItem>
            <SAccordionItem value="b" title="B" unmount-on-hide>Body B</SAccordionItem>
          </SAccordion>
        `,
      },
      {
        global: {
          plugins: [(app) => installDefaults(app, { SAccordion: { unmountOnHide: false } })],
        },
      },
    )
    expect(screen.getByText('Body A')).not.toBeVisible()
    expect(screen.queryByText('Body B')).toBeNull()
  })
})
