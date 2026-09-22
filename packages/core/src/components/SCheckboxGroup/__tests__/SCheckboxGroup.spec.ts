/* eslint-disable vue/one-component-per-file -- test stubs: the hosts that bind the group model */
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { fireEvent, render, screen } from '@testing-library/vue'
import { defineComponent, ref } from 'vue'
import { SCheckboxGroup } from '../index'
import { SCheckbox, SForm, required } from '../../../index'

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' },
]

describe('SCheckboxGroup', () => {
  it('renders the options in the order of the prop', () => {
    const { container } = render(SCheckboxGroup, { props: { options, ariaLabel: 'Numbers' } })
    const labels = Array.from(container.querySelectorAll('.s-checkbox__label'))
    expect(labels.map((label) => label.textContent?.trim())).toEqual(['One', 'Two', 'Three'])
  })

  it('checking adds the value, unchecking removes it', async () => {
    const Host = defineComponent({
      components: { SCheckboxGroup },
      setup: () => ({ picked: ref(['one']), options }),
      template: `
        <SCheckboxGroup
          v-model="picked"
          aria-label="Numbers"
          :options="options"
        />
      `,
    })
    const w = mount(Host)
    const boxes = w.findAll('[role="checkbox"]')
    await boxes[1]!.trigger('click')
    expect(w.vm.picked).toEqual(['one', 'two'])
    await boxes[0]!.trigger('click')
    expect(w.vm.picked).toEqual(['two'])
  })

  it('starts from an empty selection without a model', async () => {
    const { emitted } = render(SCheckboxGroup, { props: { options, ariaLabel: 'Numbers' } })
    await fireEvent.click(screen.getByRole('checkbox', { name: 'Two' }))
    expect(emitted()['update:modelValue']).toContainEqual([['two']])
  })

  it('reflects the model in the state of the boxes', () => {
    render(SCheckboxGroup, { props: { options, ariaLabel: 'Numbers', modelValue: ['two'] } })
    expect(screen.getByRole('checkbox', { name: 'Two' })).toHaveAttribute('data-state', 'checked')
    expect(screen.getByRole('checkbox', { name: 'One' })).toHaveAttribute('data-state', 'unchecked')
  })

  it('disabled on the group disables every option', () => {
    render(SCheckboxGroup, { props: { options, ariaLabel: 'Numbers', disabled: true } })
    for (const name of ['One', 'Two', 'Three']) {
      expect(screen.getByRole('checkbox', { name })).toBeDisabled()
    }
  })

  it('disabled on an option disables only that one', () => {
    render(SCheckboxGroup, {
      props: {
        ariaLabel: 'Numbers',
        options: [options[0]!, { ...options[1]!, disabled: true }],
      },
    })
    expect(screen.getByRole('checkbox', { name: 'One' })).toBeEnabled()
    expect(screen.getByRole('checkbox', { name: 'Two' })).toBeDisabled()
  })

  it('orientation sets the modifier of the options container', () => {
    const { container, rerender } = render(SCheckboxGroup, {
      props: { options, ariaLabel: 'Numbers' },
    })
    const group = container.querySelector('.s-checkbox-group')!
    expect(group).toHaveClass('s-checkbox-group--vertical')
    return rerender({ options, ariaLabel: 'Numbers', orientation: 'horizontal' }).then(() => {
      expect(group).toHaveClass('s-checkbox-group--horizontal')
    })
  })

  it('label names the group, hint and error are linked to it', async () => {
    const { rerender } = render(SCheckboxGroup, {
      props: { label: 'Pick the numbers', hint: 'Any of them', options },
    })
    const group = screen.getByRole('group', { name: 'Pick the numbers' })
    expect(group.getAttribute('aria-describedby')).toBe(screen.getByText('Any of them').id)
    await rerender({ label: 'Pick the numbers', options, error: 'Pick at least one' })
    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(group.getAttribute('aria-describedby')).toBe(screen.getByText('Pick at least one').id)
  })

  it('groupClass goes to the options container, not to the field wrapper', () => {
    const { container } = render(SCheckboxGroup, {
      props: { options, ariaLabel: 'Numbers', groupClass: 'numbers' },
    })
    expect(container.querySelector('.s-checkbox-group')).toHaveClass('numbers')
    expect(container.querySelector('.s-field')).not.toHaveClass('numbers')
  })

  it('consumer attributes go to the group, class and style stay on the field', () => {
    const { container } = render(SCheckboxGroup, {
      props: { options, ariaLabel: 'Numbers' },
      attrs: { class: 'outer', style: 'margin: 4px', 'data-testid': 'numbers' },
    })
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-testid', 'numbers')
    expect(group).toHaveAccessibleName('Numbers')
    const field = container.querySelector('.s-field')!
    expect(field).toHaveClass('outer')
    expect(field).toHaveStyle({ margin: '4px' })
    expect(field).not.toHaveAttribute('data-testid')
  })

  it('checkboxes from the default slot belong to the group', async () => {
    const Host = defineComponent({
      components: { SCheckboxGroup, SCheckbox },
      setup: () => ({ picked: ref(['one']) }),
      template: `
        <SCheckboxGroup
          v-model="picked"
          aria-label="Numbers"
        >
          <SCheckbox value="one" label="One" />
          <SCheckbox value="two" label="Two" />
        </SCheckboxGroup>
      `,
    })
    const w = mount(Host)
    const boxes = w.findAll('[role="checkbox"]')
    expect(boxes.map((box) => box.attributes('data-state'))).toEqual(['checked', 'unchecked'])
    await boxes[1]!.trigger('click')
    expect(w.vm.picked).toEqual(['one', 'two'])
  })

  it('rules run on submit and the invalid group takes focus', async () => {
    const Host = defineComponent({
      components: { SCheckboxGroup, SForm },
      setup: () => ({ picked: ref<string[]>([]), options, rules: [required('Pick a number')] }),
      template: `
        <SForm>
          <SCheckboxGroup
            v-model="picked"
            label="Numbers"
            :options="options"
            :rules="rules"
          />
        </SForm>
      `,
    })
    const w = mount(Host, { attachTo: document.body })
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.text()).toContain('Pick a number')
    expect(document.activeElement).toBe(w.findAll('[role="checkbox"]')[0]!.element)
    w.unmount()
  })
})
