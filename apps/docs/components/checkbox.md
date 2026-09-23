<script setup>
import { computed, ref } from 'vue'
import { required } from '@smalt-ui/core'

const terms = ref(false)
const subscribe = ref(true)
const checkedDemo = ref(true)
const contacts = ref(['email'])
const extras = ref(['gift'])
const TOPPINGS = ['cheese', 'olives', 'basil']
const toppings = ref(['cheese'])
const allToppings = computed({
  get() {
    if (toppings.value.length === TOPPINGS.length) return true
    return toppings.value.length === 0 ? false : 'indeterminate'
  },
  set(checked) {
    toppings.value = checked === true ? [...TOPPINGS] : []
  },
})
</script>

# Checkbox

`SCheckbox` is a checkbox built on Reka UI with correct semantics (`role="checkbox"`, keyboard,
`data-state`). The label is rendered with the reusable `SLabel`. It supports a mixed state
(`indeterminate`) and works with `v-model`.
Without a visible label, name the checkbox with `aria-label`.

## Basic usage

<ClientOnly>
<Demo>
  <SCheckbox label="I agree to the terms" />
  <SCheckbox label="Subscribe to the newsletter" v-model="subscribe" />
  <SCheckbox label="Unavailable" disabled />

<template #code>

```vue
<template>
  <SCheckbox
    v-model="agree"
    label="I agree to the terms"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` prop sets the checked state color from the [palette](/style/palette) (`primary`,
`teal`, `teal-10`); `text-color` sets the check mark color.

<ClientOnly>
<Demo>
  <SCheckbox label="teal" color="teal" :model-value="true" />
  <SCheckbox label="deep-purple" color="deep-purple" :model-value="true" />
  <SCheckbox label="light-blue-3" color="light-blue-3" text-color="dark" :model-value="true" />

<template #code>

```vue
<template>
  <SCheckbox
    v-model="a"
    color="teal"
    label="teal"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Mixed state

<ClientOnly>
<Demo>
  <SCheckbox label="Select all" model-value="indeterminate" />

<template #code>

```vue
<template>
  <SCheckbox
    v-model="state"
    label="Select all"
  />
  <!-- state can be true | false | 'indeterminate' -->
</template>
```

  </template>
</Demo>
</ClientOnly>

## State icons

`checked-icon` sets the checked state icon, `indeterminate-icon` the mixed state icon (both take a
registry name or a raw path).

<ClientOnly>
<Demo>
  <SCheckbox label="Checked" v-model="checkedDemo" checked-icon="check" />
  <SCheckbox label="Mixed" model-value="indeterminate" indeterminate-icon="minus" />

<template #code>

```vue
<template>
  <SCheckbox
    v-model="agree"
    label="Checked"
    checked-icon="check"
  />
  <SCheckbox
    v-model="state"
    label="Mixed"
    indeterminate-icon="minus"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Required checkbox

The `required` prop adds the `*` marker to the label and `aria-required` for screen readers. Native
validation needs `name` as well: the hidden input that carries `required` into the form is only
rendered for a named checkbox, and without it the browser has nothing to block the submit on.

<ClientOnly>
<Demo>
  <SCheckbox label="I accept the data processing terms" name="terms" required />

<template #code>

```vue
<template>
  <SCheckbox
    v-model="accept"
    label="I accept the data processing terms"
    name="terms"
    required
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Hint and error message

The `hint` and `error` props render text under the checkbox and link it through
`aria-describedby`, with no separate `SFormField` wrapper needed.

<ClientOnly>
<Demo>
  <SCheckbox label="Subscribe to the newsletter" hint="At most once a week" />
  <SCheckbox label="I agree to the terms" error="Check this box to continue" required />

<template #code>

```vue
<template>
  <SCheckbox
    v-model="subscribe"
    label="Subscribe to the newsletter"
    hint="At most once a week"
  />
  <SCheckbox
    v-model="agree"
    label="I agree to the terms"
    :error="errors.agree"
    required
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Label from markup

The slot accepts more than text: the label flows like a regular paragraph, so links inside it wrap
together with the rest of the sentence, and the required asterisk stays attached to the last word.
You do not need to wrap the content in a single element.

<ClientOnly>
<!-- The narrow box is the point of the demo: at half a line the sentence would fit on one line
     and there would be nothing to wrap. -->
<Demo style="--demo-field-max: 260px">
  <SCheckbox required>
    Contains no <a href="./checkbox">dangerous</a> or
    <a href="./checkbox">prohibited</a> goods
  </SCheckbox>

<template #code>

```vue
<template>
  <SCheckbox
    v-model="safe"
    required
  >
    Contains no <a :href="links.dangerous">dangerous</a> or
    <a :href="links.prohibited">prohibited</a> goods
  </SCheckbox>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Alignment and stretch

`align="center"` places the box at the middle of a multi-line label; by default it sits at the
first line. `stretch` makes the checkbox fill the container width: the label takes the free space,
and a click anywhere on the row toggles the checkbox.

<ClientOnly>
<Demo>
  <div style="width: 100%; max-width: 420px; padding: 12px 16px; border: 1px solid var(--s-color-border); border-radius: var(--s-radius-md)">
    <SCheckbox stretch align="center">
      <span style="display: block">Cargo insurance</span>
      <span style="display: block; font-weight: var(--s-font-weight-normal); font-size: var(--s-font-size-xs); color: var(--s-color-text-muted)">0.5% of the declared value</span>
    </SCheckbox>
  </div>

<template #code>

```vue
<template>
  <SCheckbox
    v-model="insurance"
    stretch
    align="center"
  >
    <span class="option-title">Cargo insurance</span>
    <span class="option-note">0.5% of the declared value</span>
  </SCheckbox>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Validation

`rules` checks the checkbox when focus leaves it, and then on every change while the error is
shown, so checking the box clears the error at once. The rules receive the `v-model` value:
`false` for an unchecked box, which `required()` treats as empty, and `true` or `'indeterminate'`
otherwise. `'indeterminate'` is not empty, so a tri-state checkbox that must be checked needs
`(v) => v === true || '…'`. An invalid checkbox gets a red border. See the
[Validation](/guide/validation) guide for the details.

Move focus to the checkbox and away without checking it, then check it.

<ClientOnly>
<Demo>
  <SCheckbox
    v-model="terms"
    label="I accept the terms of service"
    required
    :rules="[required('Accept the terms')]"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { required } from '@smalt-ui/core'

const terms = ref(false)
</script>

<template>
  <SCheckbox
    v-model="terms"
    label="I accept the terms of service"
    required
    :rules="[required('Accept the terms')]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Checkbox group

`SCheckboxGroup` keeps several checkboxes together: the `v-model` of the group is the array of the
checked `value`s, and the boxes inside report to it instead of holding a state of their own. The
options come either from the `options` prop (`{ label, value, disabled?, hint? }`) or from
`SCheckbox` items in the default slot — those need a `value`, which is what the group puts into the
array. A value stays there until its box is unchecked, in the order the boxes were checked.

`orientation="horizontal"` lays the options out in a row, `disabled` on the group turns all of them
off, and `disabled` on an option turns off only that one. `label` becomes the group title and is
linked with `aria-labelledby` (a native `<label for>` does not work with a `role="group"`
container); `hint` and `error` go below the options, so no separate `SFormField` wrapper is needed.
Unlike a radio group, every checkbox keeps its own tab stop: Tab walks through the options, and the
arrow keys do nothing.

The class and style of `SCheckboxGroup` go to the field wrapper together with the title and the
hint; other attributes (`data-*`, `aria-*`, listeners) go to the element with `role="group"`. The
layout of the options themselves is set with `group-class` — the class of the `.s-checkbox-group`
container. The gap between options is the `--s-checkbox-group-gap` variable.

<ClientOnly>
<Demo>
  <SCheckboxGroup
    v-model="contacts"
    label="How can we reach you"
    :options="[
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone', hint: 'On working days only' },
      { label: 'Post (unavailable)', value: 'post', disabled: true }
    ]"
  />
  <SCheckboxGroup v-model="extras" aria-label="Extra services" orientation="horizontal">
    <SCheckbox value="gift" label="Gift wrap" />
    <SCheckbox value="insurance" label="Insurance" />
    <SCheckbox value="fragile" label="Fragile" />
  </SCheckboxGroup>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const contacts = ref(['email'])
const extras = ref(['gift'])
const channels = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone', hint: 'On working days only' },
]
</script>

<template>
  <SCheckboxGroup
    v-model="contacts"
    label="How can we reach you"
    :options="channels"
  />

  <SCheckboxGroup
    v-model="extras"
    orientation="horizontal"
    aria-label="Extra services"
  >
    <SCheckbox
      value="gift"
      label="Gift wrap"
    />
    <SCheckbox
      value="insurance"
      label="Insurance"
    />
  </SCheckboxGroup>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Select all

A parent checkbox that reflects the whole group is a composition rather than a prop of the group:
keep an `SCheckbox` outside it and drive it from the array — `true` when every option is checked,
`false` when none is, and `'indeterminate'` in between. Writing to it either checks everything or
clears the selection.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <SCheckbox v-model="allToppings" label="All toppings" />
    <SCheckboxGroup
      v-model="toppings"
      aria-label="Toppings"
      style="margin-left: 28px"
      :options="[
        { label: 'Cheese', value: 'cheese' },
        { label: 'Olives', value: 'olives' },
        { label: 'Basil', value: 'basil' }
      ]"
    />
  </div>

<template #code>

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const options = [
  { label: 'Cheese', value: 'cheese' },
  { label: 'Olives', value: 'olives' },
  { label: 'Basil', value: 'basil' },
]
const toppings = ref(['cheese'])

const all = computed({
  get() {
    if (toppings.value.length === options.length) return true
    return toppings.value.length === 0 ? false : 'indeterminate'
  },
  set(checked) {
    toppings.value = checked === true ? options.map((option) => option.value) : []
  },
})
</script>

<template>
  <SCheckbox
    v-model="all"
    label="All toppings"
  />
  <SCheckboxGroup
    v-model="toppings"
    :options="options"
    aria-label="Toppings"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Group validation

`rules` go on `SCheckboxGroup`, not on the single `SCheckbox`. They receive the array of the
checked values, so `required()` fails while nothing is chosen and `minLength(2)` counts the
options. The group checks when focus leaves it — moving between the options does not count — and
then on every change while the error is shown. Inside [`SForm`](/components/form) it is checked on
submit as well, and an invalid group takes the focus of its first checkbox. The boxes of an invalid
group get a red border. See the [Validation](/guide/validation) guide for the details.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { minLength, required } from '@smalt-ui/core'

const interests = ref<string[]>([])
const topics = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Marketing', value: 'marketing' },
]
</script>

<template>
  <SForm>
    <SCheckboxGroup
      v-model="interests"
      label="Interests"
      required
      :rules="[required('Choose at least one topic'), minLength(2)]"
      :options="topics"
    />
  </SForm>
</template>
```

## API

The checkbox itself:

<ApiTable name="SCheckbox" />

The group:

<ApiTable name="SCheckboxGroup" />
