import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SFileUpload } from '../index'

const file = (name: string) => new File(['xxxx'], name, { type: 'image/png' })

describe('SFileUpload · a11y', () => {
  it('has no violations while empty', async () => {
    const { container } = render(SFileUpload, {
      props: { label: 'Attachments', hint: 'Up to 5 MB per file' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with selected files', async () => {
    const { container } = render(SFileUpload, {
      props: { label: 'Attachments', multiple: true, modelValue: [file('a.png'), file('b.png')] },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations in the invalid state', async () => {
    const { container } = render(SFileUpload, {
      props: { label: 'Attachments', error: 'Attach a file', required: true },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations in compact mode', async () => {
    const { container } = render(SFileUpload, {
      props: { label: 'Attachments', dropzone: false, modelValue: [file('a.png')] },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
