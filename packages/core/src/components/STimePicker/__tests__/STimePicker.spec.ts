import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, shallowRef } from 'vue'
import { Time } from '@internationalized/date'
import { SForm, required } from '../../../index'
import { STimePicker } from '../index'
import type { STimeValue } from '../../STimeField/types'

/** A host that keeps the model, so a second pick builds on the first. */
function renderBound(props: Record<string, unknown> = {}, initial?: STimeValue) {
  const value = shallowRef<STimeValue | undefined>(initial)
  render(() =>
    h(STimePicker, {
      label: 'Appointment',
      locale: 'en-GB',
      ...props,
      modelValue: value.value,
      'onUpdate:modelValue': (next: STimeValue | undefined) => (value.value = next),
    }),
  )
  return value
}

const openPanel = async (name = 'Open time picker') => {
  await fireEvent.click(screen.getByRole('button', { name }))
  return screen.findAllByRole('listbox')
}

const labels = (list: HTMLElement) =>
  [...list.querySelectorAll('[role="option"]')].map((option) => option.textContent?.trim())

describe('STimePicker', () => {
  it('renders the label, the segmented field and the open button', () => {
    render(STimePicker, { props: { label: 'Appointment', locale: 'en-GB' } })
    expect(screen.getByText('Appointment')).toBeInTheDocument()
    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open time picker' })).toBeInTheDocument()
  })

  it('forwards the field props to STimeField', () => {
    const { container } = render(STimePicker, {
      props: { label: 'Appointment', error: 'Enter a time', size: 'lg', locale: 'en-GB' },
    })
    expect(screen.getByText('Enter a time')).toBeInTheDocument()
    expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true')
    expect(container.querySelector('.s-time-picker')).toHaveClass('s-time-field--lg')
  })

  it('renders editable segments for the value', () => {
    render(STimePicker, { props: { modelValue: new Time(14, 30), locale: 'en-GB' } })
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
  })

  it('takes the accessible name of the open button from the dictionary and from openLabel', () => {
    const { unmount } = render(STimePicker, { props: { locale: 'en-GB' } })
    expect(screen.getByRole('button', { name: 'Open time picker' })).toBeInTheDocument()
    unmount()

    render(STimePicker, { props: { locale: 'en-GB', openLabel: 'Choose the hour' } })
    expect(screen.getByRole('button', { name: 'Choose the hour' })).toBeInTheDocument()
  })

  it('keeps the panel closed until the button is pressed', async () => {
    render(STimePicker, { props: { locale: 'en-GB' } })
    expect(screen.queryByRole('listbox')).toBeNull()
    const lists = await openPanel()
    expect(lists.map((list) => list.getAttribute('aria-label'))).toEqual(['hours', 'minutes'])
  })

  it('lists the hours of the cycle and the minutes of the step', async () => {
    render(STimePicker, { props: { locale: 'en-GB', minuteStep: 15 } })
    const [hours, minutes] = await openPanel()
    expect(labels(hours!)).toHaveLength(24)
    expect(labels(hours!).at(-1)).toBe('23')
    expect(labels(minutes!)).toEqual(['00', '15', '30', '45'])
  })

  it('updates the model when an hour and then a minute is picked', async () => {
    const value = renderBound({ minuteStep: 30 })
    const [hours, minutes] = await openPanel()
    await fireEvent.click(hours!.querySelectorAll('[role="option"]')[9]!)
    expect(String(value.value)).toBe('09:00:00')

    await fireEvent.click(minutes!.querySelectorAll('[role="option"]')[1]!)
    expect(String(value.value)).toBe('09:30:00')
  })

  it('keeps the class of the value it was given', async () => {
    const value = renderBound({}, new Time(8, 5, 20))
    const [hours] = await openPanel()
    await fireEvent.click(hours!.querySelectorAll('[role="option"]')[10]!)
    expect(value.value).toBeInstanceOf(Time)
    expect(String(value.value)).toBe('10:05:20')
  })

  it('shows the AM/PM column and maps the picked hour to it', async () => {
    const value = renderBound({ locale: 'en-US', hourCycle: 12 }, new Time(14, 30))
    const lists = await openPanel()
    expect(lists.map((list) => list.getAttribute('aria-label'))).toEqual([
      'hours',
      'minutes',
      'AM/PM',
    ])
    const [hours, , periods] = lists
    expect(labels(hours!)).toHaveLength(12)
    expect(labels(hours!)[0]).toBe('12')
    expect(
      [...document.querySelectorAll('[data-selected]')].map((option) => option.textContent?.trim()),
    ).toEqual(['02', '30', 'PM'])

    await fireEvent.click(periods!.querySelectorAll('[role="option"]')[0]!)
    expect(String(value.value)).toBe('02:30:00')
  })

  it('picks the afternoon hour while the PM period is selected', async () => {
    const value = renderBound({ locale: 'en-US', hourCycle: 12 }, new Time(13, 0))
    const [hours] = await openPanel()
    // The fourth entry of the column is 3 o'clock, which is 15:00 in the afternoon.
    await fireEvent.click(hours!.querySelectorAll('[role="option"]')[3]!)
    expect(String(value.value)).toBe('15:00:00')
  })

  it('drops the columns below the granularity', async () => {
    const { unmount } = render(STimePicker, { props: { locale: 'en-GB', granularity: 'hour' } })
    expect((await openPanel()).map((list) => list.getAttribute('aria-label'))).toEqual(['hours'])
    unmount()

    render(STimePicker, { props: { locale: 'en-GB', granularity: 'second' } })
    expect((await openPanel()).map((list) => list.getAttribute('aria-label'))).toEqual([
      'hours',
      'minutes',
      'seconds',
    ])
  })

  it('disables the entries outside min-value and max-value', async () => {
    render(STimePicker, {
      props: { locale: 'en-GB', minValue: new Time(9, 30), maxValue: new Time(17, 0) },
    })
    const [hours, minutes] = await openPanel()
    const options = [...hours!.querySelectorAll<HTMLButtonElement>('[role="option"]')]
    expect(options[8]!.disabled).toBe(true)
    expect(options[9]!.disabled).toBe(false)
    expect(options[17]!.disabled).toBe(false)
    expect(options[18]!.disabled).toBe(true)

    // Nothing is picked yet, so the minutes are read against midnight: all of them are too early.
    expect(
      [...minutes!.querySelectorAll<HTMLButtonElement>('[role="option"]')].every(
        (option) => option.disabled,
      ),
    ).toBe(true)
  })

  it('marks the selected entry for assistive technology', async () => {
    render(STimePicker, { props: { locale: 'en-GB', modelValue: new Time(7, 0) } })
    const [hours] = await openPanel()
    const selected = hours!.querySelector('[aria-selected="true"]')
    expect(selected?.textContent?.trim()).toBe('07')
    expect(selected).toHaveAttribute('data-selected')
  })

  it('takes part in the validation of SForm', async () => {
    const onSubmit = vi.fn()
    const onInvalid = vi.fn()
    const value = shallowRef<STimeValue | undefined>()
    const host = defineComponent({
      setup() {
        return () =>
          h(SForm, { onSubmit, onInvalid }, () => [
            h(STimePicker, {
              label: 'Appointment',
              name: 'appointment',
              locale: 'en-GB',
              rules: [required()],
              modelValue: value.value,
              'onUpdate:modelValue': (next: STimeValue | undefined) => (value.value = next),
            }),
          ])
      },
    })
    const wrapper = mount(host, { attachTo: document.body })

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'appointment', messages: ['This field is required'] }),
    ])

    value.value = new Time(10, 0)
    await flushPromises()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})
