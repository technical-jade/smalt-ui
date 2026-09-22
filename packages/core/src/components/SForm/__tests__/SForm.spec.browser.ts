import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, onMounted, ref } from 'vue'
import { SForm, useValidation, required } from '../../../index'

const Field = defineComponent({
  props: {
    id: { type: String, default: undefined },
    value: { type: String, default: '' },
  },
  setup(props) {
    let input: HTMLInputElement | null = null
    const v = useValidation({
      value: () => props.value,
      rules: [required()],
      focus: () => input?.focus(),
      el: () => input,
    })
    return () =>
      h('input', {
        id: props.id,
        ref: (el) => (input = el as HTMLInputElement | null),
        'aria-invalid': v.invalid.value || undefined,
      })
  },
})

describe('SForm · browser', () => {
  it('submits on Enter and focuses the first invalid field in DOM order', async () => {
    const onInvalid = vi.fn()
    const { container } = render({
      components: { SForm, Field },
      setup: () => ({ onInvalid }),
      template: `<SForm @invalid="onInvalid">
        <Field id="first" /><Field id="second" value="ok" /><Field id="third" />
        <button type="submit">Send</button>
      </SForm>`,
    })
    container.querySelector<HTMLInputElement>('#second')!.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(onInvalid).toHaveBeenCalled())
    await vi.waitFor(() => expect(document.activeElement?.id).toBe('first'))
  })

  it('focuses in DOM order when a field mounts after the others', async () => {
    const { container } = render({
      components: { SForm, Field },
      setup() {
        const shown = ref(false)
        onMounted(() => (shown.value = true))
        return { shown }
      },
      template: `<SForm>
        <Field v-if="shown" id="late" /><Field id="early" />
        <button type="submit">Send</button>
      </SForm>`,
    })
    await vi.waitFor(() => expect(container.querySelector('#late')).not.toBeNull())
    await userEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => expect(document.activeElement?.id).toBe('late'))
  })

  it('keeps focus with no-error-focus', async () => {
    const { container } = render({
      components: { SForm, Field },
      template: `<SForm no-error-focus><Field id="a" /><button type="submit">Send</button></SForm>`,
    })
    const button = container.querySelector('button')!
    button.focus()
    await userEvent.click(button)
    await vi.waitFor(() => expect(container.querySelector('[aria-invalid]')).not.toBeNull())
    await new Promise((r) => setTimeout(r, 50))
    expect(document.activeElement).toBe(button)
  })

  it('submits natively with the clicked button when there is no submit listener', async () => {
    const requestSubmit = vi.spyOn(HTMLFormElement.prototype, 'requestSubmit')
    const { container } = render({
      components: { SForm, Field },
      template: `<SForm action="/save">
        <Field value="ok" />
        <button type="submit" name="intent" value="draft">Draft</button>
        <button type="submit" name="intent" value="publish" formaction="/publish">Publish</button>
      </SForm>`,
    })
    const form = container.querySelector('form')!
    const publish = container.querySelectorAll('button')[1]!
    const submitted: { submitter: HTMLElement | null; data: FormData }[] = []
    // Stands in for the navigation: records what the browser would send, then cancels it.
    form.addEventListener(
      'submit',
      (event) => {
        const { submitter } = event as SubmitEvent
        submitted.push({ submitter, data: new FormData(form, submitter) })
        event.preventDefault()
      },
      { capture: true },
    )
    expect(form.getAttribute('action')).toBe('/save')
    await userEvent.click(publish)
    await vi.waitFor(() => expect(requestSubmit).toHaveBeenCalledOnce())
    expect(requestSubmit).toHaveBeenCalledWith(publish)
    expect(submitted).toHaveLength(2)
    expect(submitted[1]!.submitter).toBe(publish)
    expect(submitted[1]!.data.get('intent')).toBe('publish')
    requestSubmit.mockRestore()
  })

  it('calls the submit listener once and does not submit natively', async () => {
    const requestSubmit = vi.spyOn(HTMLFormElement.prototype, 'requestSubmit')
    const submit = vi.spyOn(HTMLFormElement.prototype, 'submit')
    const onSubmit = vi.fn()
    const { container } = render({
      components: { SForm, Field },
      setup: () => ({ onSubmit }),
      template: `<SForm @submit="onSubmit"><Field value="ok" /><button type="submit">Send</button></SForm>`,
    })
    await userEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalled())
    await new Promise((r) => setTimeout(r, 50))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0]![0]).toBeInstanceOf(SubmitEvent)
    expect(requestSubmit).not.toHaveBeenCalled()
    expect(submit).not.toHaveBeenCalled()
    requestSubmit.mockRestore()
    submit.mockRestore()
  })

  it('never calls the submit listener for an invalid form', async () => {
    const onSubmit = vi.fn()
    const { container } = render({
      components: { SForm, Field },
      setup: () => ({ onSubmit }),
      template: `<SForm @submit="onSubmit"><Field /><button type="submit">Send</button></SForm>`,
    })
    await userEvent.click(container.querySelector('button')!)
    await vi.waitFor(() => expect(container.querySelector('[aria-invalid]')).not.toBeNull())
    await new Promise((r) => setTimeout(r, 50))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
