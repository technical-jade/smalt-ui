import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SListbox } from '../index'

const options = [
  { label: 'New York', value: 'nyc' },
  { label: 'London', value: 'lon' },
  { label: 'Tokyo', value: 'tyo', disabled: true },
]

describe('SListbox · a11y', () => {
  it('has no violations with a single selection', async () => {
    const { container } = render(SListbox, {
      props: { options, label: 'City', modelValue: 'lon' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with multiple selection', async () => {
    const { container } = render(SListbox, {
      props: { options, label: 'Cities', multiple: true, modelValue: ['nyc', 'lon'] },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations while empty', async () => {
    const { container } = render(SListbox, { props: { options: [], label: 'City' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations while disabled', async () => {
    const { container } = render(SListbox, {
      props: { options, label: 'City', disabled: true },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
