import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { defineComponent } from 'vue'
import { SFileUpload } from '../index'
import type { SFileUploadRejection } from '../index'

const file = (name: string, bytes = 4, type = 'image/png') =>
  new File(['x'.repeat(bytes)], name, { type })

/**
 * A file dialog cannot be driven from a test: the files are put on the input, then the `change`
 * the browser would fire is dispatched.
 */
function pick(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  return fireEvent.change(input)
}

const input = () => screen.getByLabelText('Attachments') as HTMLInputElement

const rejected = (emitted: Record<string, unknown[]>, call = 0): SFileUploadRejection[] =>
  (emitted.reject?.[call] as SFileUploadRejection[][])[0]

describe('SFileUpload', () => {
  it('links the label to the native file input', () => {
    render(SFileUpload, { props: { label: 'Attachments' } })
    expect(input().tagName).toBe('INPUT')
    expect(input().type).toBe('file')
  })

  it('puts the picked files into the model', async () => {
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', multiple: true, modelValue: [] },
    })
    const first = file('one.png')
    const second = file('two.png')
    await pick(input(), [first, second])
    expect(emitted()['update:modelValue']).toContainEqual([[first, second]])
  })

  it('keeps a single file without multiple', async () => {
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', modelValue: [] },
    })
    const first = file('one.png')
    const second = file('two.png')
    await pick(input(), [first, second])
    expect(emitted()['update:modelValue']).toContainEqual([[first]])
    expect(rejected(emitted()).map((entry) => entry.reason)).toEqual(['count'])
  })

  it('replaces the previous file without multiple', async () => {
    const first = file('one.png')
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', modelValue: [first] },
    })
    const second = file('two.png')
    await pick(input(), [second])
    expect(emitted()['update:modelValue']).toContainEqual([[second]])
  })

  it('rejects a file that does not match accept', async () => {
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', accept: 'image/*,.pdf', modelValue: [] },
    })
    const text = file('notes.txt', 4, 'text/plain')
    const pdf = file('report.pdf', 4, 'application/pdf')
    await pick(input(), [text, pdf])
    expect(emitted()['update:modelValue']).toContainEqual([[pdf]])
    expect(rejected(emitted())).toHaveLength(1)
    expect(rejected(emitted())[0].file).toBe(text)
    expect(rejected(emitted())[0].reason).toBe('type')
    expect(screen.getByText('This file type is not accepted')).toBeInTheDocument()
  })

  it('rejects a file over maxSize and names the readable limit', async () => {
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', maxSize: 2048, modelValue: [] },
    })
    await pick(input(), [file('big.png', 4096)])
    expect(emitted()['update:modelValue']).toBeUndefined()
    expect(rejected(emitted())[0].reason).toBe('size')
    expect(screen.getByText('The file is larger than 2 KB')).toBeInTheDocument()
  })

  it('rejects the files over maxFiles', async () => {
    const kept = file('one.png')
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', multiple: true, maxFiles: 2, modelValue: [kept] },
    })
    const second = file('two.png')
    const third = file('three.png')
    await pick(input(), [second, third])
    expect(emitted()['update:modelValue']).toContainEqual([[kept, second]])
    expect(rejected(emitted())[0].file).toBe(third)
    expect(rejected(emitted())[0].reason).toBe('count')
    expect(screen.getByText('Too many files (2 at most)')).toBeInTheDocument()
  })

  it('shows the error of the app instead of its own rejection message', async () => {
    render(SFileUpload, {
      props: { label: 'Attachments', accept: '.pdf', error: 'Upload failed', modelValue: [] },
    })
    await pick(input(), [file('photo.png')])
    expect(screen.getByText('Upload failed')).toBeInTheDocument()
    expect(screen.queryByText('This file type is not accepted')).toBeNull()
  })

  it('lists the selected files with a readable size', () => {
    render(SFileUpload, {
      props: { label: 'Attachments', modelValue: [file('report.pdf', 1536)] },
    })
    expect(screen.getByText('report.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.5 KB')).toBeInTheDocument()
  })

  it('removes a file through the row button', async () => {
    const first = file('one.png')
    const second = file('two.png')
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', multiple: true, modelValue: [first, second] },
    })
    await fireEvent.click(screen.getByLabelText('Remove file: one.png'))
    expect(emitted()['update:modelValue']).toContainEqual([[second]])
  })

  it('hides the list with show-list off', () => {
    render(SFileUpload, {
      props: { label: 'Attachments', showList: false, modelValue: [file('one.png')] },
    })
    expect(screen.queryByText('one.png')).toBeNull()
  })

  it('renders the empty slot while nothing is selected', () => {
    render(SFileUpload, {
      props: { label: 'Attachments', modelValue: [] },
      slots: { empty: 'Nothing selected yet' },
    })
    expect(screen.getByText('Nothing selected yet')).toBeInTheDocument()
  })

  it('passes the file, its index and remove to the file slot', async () => {
    const Host = defineComponent({
      components: { SFileUpload },
      props: { files: { type: Array as () => File[], required: true } },
      emits: ['update:files'],
      template: `
        <SFileUpload
          label="Attachments"
          :model-value="files"
          @update:model-value="$emit('update:files', $event)"
        >
          <template #file="{ file, index, remove }">
            <span>{{ index }}:{{ file.name }}</span>
            <button type="button" @click="remove()">drop</button>
          </template>
        </SFileUpload>
      `,
    })
    const { emitted } = render(Host, { props: { files: [file('one.png')] } })
    expect(screen.getByText('0:one.png')).toBeInTheDocument()
    await fireEvent.click(screen.getByText('drop'))
    expect(emitted()['update:files']).toContainEqual([[]])
  })

  it('lets the same file be picked twice in a row', async () => {
    const { emitted } = render(SFileUpload, { props: { label: 'Attachments', modelValue: [] } })
    const same = file('one.png')
    await pick(input(), [same])
    expect(input().value).toBe('')
    await pick(input(), [same])
    expect(emitted()['update:modelValue']).toHaveLength(2)
  })

  it('renders the drop hint and the compact button from the dictionary', async () => {
    const { rerender } = render(SFileUpload, { props: { label: 'Attachments' } })
    expect(screen.getByText('Drop files here or click to choose')).toBeInTheDocument()
    await rerender({ dropzone: false })
    expect(screen.getByText('Choose files')).toBeInTheDocument()
  })

  it('marks the zone while a file is dragged over it', async () => {
    const { container } = render(SFileUpload, { props: { label: 'Attachments' } })
    const zone = container.querySelector('.s-file-upload__zone')!
    await fireEvent.dragEnter(zone)
    expect(zone).toHaveClass('s-file-upload__zone--dragging')
    await fireEvent.dragLeave(zone)
    expect(zone).not.toHaveClass('s-file-upload__zone--dragging')
  })

  it('ignores a selection while disabled', async () => {
    const { emitted } = render(SFileUpload, {
      props: { label: 'Attachments', disabled: true, modelValue: [] },
    })
    await pick(input(), [file('one.png')])
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('size sets the field size class', () => {
    const { container } = render(SFileUpload, { props: { size: 'sm' } })
    expect(container.querySelector('.s-file-upload')).toHaveClass('s-file-upload--sm')
  })

  it('checks its rules on the file list when focus leaves the field', async () => {
    const attached = (value: File[]) => value.length > 0 || 'Attach a file'
    render(SFileUpload, { props: { label: 'Attachments', modelValue: [], rules: [attached] } })
    await fireEvent.focusIn(input())
    await fireEvent.focusOut(input())
    expect(await screen.findByText('Attach a file')).toBeInTheDocument()
  })
})
