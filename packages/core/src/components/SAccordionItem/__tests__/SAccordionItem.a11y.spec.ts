import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SAccordion } from '../../SAccordion'
import { SAccordionItem } from '../index'

describe('SAccordionItem · a11y', () => {
  it('has no violations inside SAccordion', async () => {
    const { container } = render({
      components: { SAccordion, SAccordionItem },
      template: `
        <SAccordion :model-value="'x'">
          <SAccordionItem value="x" title="Section">Section content</SAccordionItem>
        </SAccordion>
      `,
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('SAccordionItem · heading semantics', () => {
  it('headers are level 3 headings by default', () => {
    render({
      components: { SAccordion, SAccordionItem },
      template: `
        <SAccordion>
          <SAccordionItem value="x" title="Section">Content</SAccordionItem>
        </SAccordion>
      `,
    })
    expect(screen.getByRole('heading', { level: 3, name: 'Section' })).toBeInTheDocument()
  })

  it('the accordion sets the level and an item overrides it', () => {
    render({
      components: { SAccordion, SAccordionItem },
      template: `
        <SAccordion :heading-level="2">
          <SAccordionItem value="x" title="Outer">Content</SAccordionItem>
          <SAccordionItem value="y" title="Inner" :heading-level="4">Content</SAccordionItem>
        </SAccordion>
      `,
    })
    expect(screen.getByRole('heading', { level: 2, name: 'Outer' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Inner' })).toBeInTheDocument()
  })
})
