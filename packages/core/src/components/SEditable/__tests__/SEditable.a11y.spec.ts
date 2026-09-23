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

  /**
   * The native `required` stays on the hidden form input: the visible one is dropped from the
   * tree outside the edit view, and a hidden invalid control stalls the submit instead of
   * pointing at anything.
   */
  it('announces a required field on the input itself', async () => {
    const { container } = render(SEditable, {
      props: { label: 'Title', modelValue: '', required: true },
    })

    const input = container.querySelector('.s-editable__input')!
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).not.toHaveAttribute('required')

    await fireEvent.focusIn(container.querySelector('.s-editable__preview')!)
    expect(container.querySelector('.s-editable__input')).toHaveAttribute('aria-required', 'true')
  })

  it('leaves aria-required off an optional field', () => {
    const { container } = render(SEditable, { props: { label: 'Title', modelValue: '' } })
    expect(container.querySelector('.s-editable__input')).not.toHaveAttribute('aria-required')
  })

  it('has no violations without a label, with a hint and an error', async () => {
    const { container } = render(SEditable, {
      props: { modelValue: '', placeholder: 'Untitled', hint: 'Tab to edit', error: 'Required' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
