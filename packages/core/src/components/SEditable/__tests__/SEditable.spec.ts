import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SEditable } from '../index'
import { SForm, required } from '../../../index'

const renderEditable = (props: Record<string, unknown> = {}) => {
  const utils = render(SEditable, { props: { label: 'Title', ...props } })
  const preview = utils.container.querySelector<HTMLElement>('.s-editable__preview')!
  const input = utils.container.querySelector<HTMLInputElement>('.s-editable__input')!
  return { ...utils, preview, input }
}

describe('SEditable', () => {
  it('shows the value as text', () => {
    const { preview, input } = renderEditable({ modelValue: 'Quarterly report' })
    expect(preview).toHaveTextContent('Quarterly report')
    expect(input.hidden).toBe(true)
  })

  it('shows the placeholder while the value is empty', () => {
    const { preview } = renderEditable({ modelValue: '', placeholder: 'Untitled' })
    expect(preview).toHaveTextContent('Untitled')
  })

  it('opens the editor when focus enters the value', async () => {
    const { preview, input } = renderEditable({ modelValue: 'Title' })
    await fireEvent.focusIn(preview)
    expect(input.hidden).toBe(false)
    expect(preview.hidden).toBe(true)
  })

  it('opens the editor on a double click only in dblclick mode', async () => {
    const { preview, input } = renderEditable({ modelValue: 'Title', activationMode: 'dblclick' })
    await fireEvent.focusIn(preview)
    expect(input.hidden).toBe(true)
    await fireEvent.dblClick(preview)
    expect(input.hidden).toBe(false)
  })

  it('opens the editor with Enter on the focused value', async () => {
    const { preview, input } = renderEditable({ modelValue: 'Title', activationMode: 'dblclick' })
    await fireEvent.keyDown(preview, { key: 'Enter' })
    expect(input.hidden).toBe(false)
  })

  it('commits the typed value on Enter and emits submit', async () => {
    const { preview, input, emitted } = renderEditable({ modelValue: 'Old' })
    await fireEvent.focusIn(preview)
    await fireEvent.update(input, 'New')
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(emitted('update:modelValue')?.at(-1)).toEqual(['New'])
    expect(emitted('submit')?.at(-1)).toEqual(['New'])
  })

  it('restores the value on Escape and emits cancel', async () => {
    const { preview, input, emitted } = renderEditable({ modelValue: 'Old' })
    await fireEvent.focusIn(preview)
    await fireEvent.update(input, 'Draft')
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(emitted('update:modelValue')).toBeUndefined()
    expect(emitted('cancel')).toHaveLength(1)
    expect(preview).toHaveTextContent('Old')
  })

  it('keeps the editor closed when disabled or read-only', async () => {
    const disabled = renderEditable({ modelValue: 'Title', disabled: true })
    await fireEvent.focusIn(disabled.preview)
    expect(disabled.input.hidden).toBe(true)

    const readonly = renderEditable({ modelValue: 'Title', readonly: true })
    await fireEvent.focusIn(readonly.preview)
    expect(readonly.input.hidden).toBe(true)
  })

  it('takes the control labels from the dictionary', async () => {
    const { preview } = renderEditable({ modelValue: 'Title', withControls: true })
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    await fireEvent.focusIn(preview)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('lets each control label be overridden', async () => {
    const { preview } = renderEditable({
      modelValue: 'Title',
      withControls: true,
      editLabel: 'Rename',
      saveLabel: 'Apply',
      cancelLabel: 'Discard',
    })
    expect(screen.getByRole('button', { name: 'Rename' })).toBeInTheDocument()
    await fireEvent.focusIn(preview)
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
  })

  it('commits from the save control and drops the edit from the cancel one', async () => {
    const { preview, input, emitted } = renderEditable({ modelValue: 'Old', withControls: true })
    await fireEvent.focusIn(preview)
    await fireEvent.update(input, 'New')
    await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(emitted('update:modelValue')?.at(-1)).toEqual(['New'])

    await fireEvent.focusIn(preview)
    await fireEvent.update(input, 'Draft')
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(emitted('cancel')).toHaveLength(1)
  })

  it('names the input after the field label', () => {
    const { input } = renderEditable({ modelValue: 'Title' })
    expect(input.getAttribute('aria-label')).toBeNull()
    expect(screen.getByLabelText('Title')).toBe(input)
  })

  it('reports a rule failure on form submission', async () => {
    const host = defineComponent({
      components: { SForm, SEditable },
      setup: () => ({ rules: [required()] }),
      template: '<SForm><SEditable label="Title" name="title" :rules="rules" /></SForm>',
    })
    const w = mount(host, { attachTo: document.body })
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(w.find('.s-field__error').text()).toBe('This field is required')
    w.unmount()
  })
})
