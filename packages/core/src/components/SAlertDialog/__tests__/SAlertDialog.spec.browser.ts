import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SAlertDialog } from '../index'

// Layout of the teleported panel: happy-dom has no sizes.
describe('SAlertDialog · browser', () => {
  it('long content scrolls in the body; the actions stay in view', async () => {
    render(SAlertDialog, {
      props: { open: true, title: 'Delete the project?' },
      slots: { default: '<div style="height: 3000px">Everything that goes away</div>' },
    })
    const dialog = await screen.findByRole('alertdialog')
    const body = dialog.querySelector<HTMLElement>('.s-alert-dialog__body')!
    expect(dialog.scrollHeight).toBe(dialog.clientHeight)
    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight)
    const actions = dialog.querySelector('.s-alert-dialog__footer')!.getBoundingClientRect()
    expect(actions.bottom).toBeLessThanOrEqual(window.innerHeight)
  })

  it('a long description scrolls too', async () => {
    render(SAlertDialog, {
      props: { open: true, title: 'Terms', description: 'Clause. '.repeat(2000) },
    })
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog.scrollHeight).toBe(dialog.clientHeight)
    const actions = dialog.querySelector('.s-alert-dialog__footer')!.getBoundingClientRect()
    expect(actions.bottom).toBeLessThanOrEqual(window.innerHeight)
  })
})
