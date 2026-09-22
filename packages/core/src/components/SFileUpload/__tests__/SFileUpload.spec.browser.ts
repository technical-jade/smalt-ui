import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SFileUpload } from '../index'

/**
 * happy-dom has no real drag and drop, no DataTransfer and no focus: there the drop zone looks
 * alive even if the file never reaches the model.
 */
const png = (name: string) => new File(['payload'], name, { type: 'image/png' })

function transfer(files: File[]) {
  const data = new DataTransfer()
  files.forEach((file) => data.items.add(file))
  return data
}

const dragEvent = (type: string, files: File[]) =>
  new DragEvent(type, { dataTransfer: transfer(files), bubbles: true, cancelable: true })

describe('SFileUpload · browser', () => {
  it('takes a real drop into the model', async () => {
    const { container, emitted } = render(SFileUpload, {
      props: { label: 'Attachments', multiple: true, modelValue: [] },
    })
    const zone = container.querySelector('.s-file-upload__zone')!
    const dropped = png('photo.png')
    zone.dispatchEvent(dragEvent('dragenter', [dropped]))
    zone.dispatchEvent(dragEvent('dragover', [dropped]))
    zone.dispatchEvent(dragEvent('drop', [dropped]))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    const files = emitted()['update:modelValue']?.at(-1) as [File[]]
    expect(files[0].map((file) => file.name)).toEqual(['photo.png'])
  })

  it('marks the zone while a file hovers over it and clears the mark on drop', async () => {
    const { container } = render(SFileUpload, { props: { label: 'Attachments' } })
    const zone = container.querySelector('.s-file-upload__zone')!
    zone.dispatchEvent(dragEvent('dragenter', [png('photo.png')]))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(zone).toHaveClass('s-file-upload__zone--dragging')
    zone.dispatchEvent(dragEvent('drop', [png('photo.png')]))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(zone).not.toHaveClass('s-file-upload__zone--dragging')
  })

  it('keeps the hidden input in the tab order', async () => {
    const { container } = render(SFileUpload, { props: { label: 'Attachments' } })
    const input = container.querySelector<HTMLInputElement>('.s-file-upload__input')!
    expect(getComputedStyle(input).display).not.toBe('none')
    expect(getComputedStyle(input).visibility).not.toBe('hidden')
    await userEvent.tab()
    expect(document.activeElement).toBe(input)
  })

  it('opens the dialog from the keyboard', async () => {
    const { container } = render(SFileUpload, { props: { label: 'Attachments' } })
    const input = container.querySelector<HTMLInputElement>('.s-file-upload__input')!
    let opened = 0
    // The real dialog is an OS window a test cannot close, so the activation is stopped here.
    input.addEventListener('click', (event) => {
      event.preventDefault()
      opened += 1
    })
    input.focus()
    await userEvent.keyboard(' ')
    expect(opened).toBe(1)
    await userEvent.keyboard('{Enter}')
    expect(opened).toBe(2)
  })

  it('a click on the drop zone activates the input', async () => {
    const { container } = render(SFileUpload, { props: { label: 'Attachments' } })
    const input = container.querySelector<HTMLInputElement>('.s-file-upload__input')!
    let opened = 0
    input.addEventListener('click', (event) => {
      event.preventDefault()
      opened += 1
    })
    await userEvent.click(container.querySelector<HTMLElement>('.s-file-upload__text')!)
    expect(opened).toBe(1)
  })
})
