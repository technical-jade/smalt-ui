import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SProgress } from '../index'

describe('SProgress · a11y', () => {
  it('has no violations with an accessible name', async () => {
    const { container } = render(SProgress, { props: { value: 60, label: 'Uploading file' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('without label the bar is named by its percentage', async () => {
    const { container } = render(SProgress, { props: { value: 60 } })
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('60%')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('an indeterminate bar without label is named from the dictionary', async () => {
    const { container } = render(SProgress, { props: { value: null } })
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Loading')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('label names the bar', () => {
    render(SProgress, { props: { value: 60, label: 'Uploading file' } })
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Uploading file')
  })

  it('the circular form has no violations', async () => {
    const { container } = render(SProgress, {
      props: { value: 60, circular: true, showValue: true },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('the circular form is named by its percentage', async () => {
    const { container } = render(SProgress, { props: { value: 60, circular: true } })
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('60%')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('an indeterminate ring is named from the dictionary', async () => {
    const { container } = render(SProgress, { props: { circular: true } })
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Loading')
    expect(await axe(container)).toHaveNoViolations()
  })
})
