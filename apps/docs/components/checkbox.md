<script setup>
import { ref } from 'vue'
import { required } from '@smalt-ui/core'

const terms = ref(false)
const subscribe = ref(true)
const checkedDemo = ref(true)
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

The `required` prop marks the checkbox as required for form submission: the browser will not
submit the form until it is checked.

<ClientOnly>
<Demo>
  <SCheckbox label="I accept the data processing terms" required />

<template #code>

```vue
<template>
  <SCheckbox
    v-model="accept"
    label="I accept the data processing terms"
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

## API

<ApiTable name="SCheckbox" />
