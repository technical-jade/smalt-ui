import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SEditable } from '../index'

describe('SEditable · a11y', () => {
  it('has no violations at rest', async () => {
    const { container } = render(SEditable, {
      props: { label: 'Title', modelValue: 'Quarterly report' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations while editing', async () => {
    const { container } = render(SEditable, {
      props: { label: 'Title', modelValue: 'Quarterly report', withControls: true },
    })
    await fireEvent.focusIn(container.querySelector('.s-editable__preview')!)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations without a label, with a hint and an error', async () => {
    const { container } = render(SEditable, {
      props: { modelValue: '', placeholder: 'Untitled', hint: 'Tab to edit', error: 'Required' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
