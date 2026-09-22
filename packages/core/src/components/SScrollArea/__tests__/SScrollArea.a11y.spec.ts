import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SScrollArea } from '../index'

describe('SScrollArea · a11y', () => {
  it('has no violations with a vertical scrollbar', async () => {
    const { container } = render(SScrollArea, {
      props: { type: 'always', height: 200 },
      slots: { default: 'Release notes' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with both scrollbars', async () => {
    const { container } = render(SScrollArea, {
      props: { type: 'always', orientation: 'both', height: 200 },
      slots: { default: 'Release notes' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
