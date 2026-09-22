<script setup>
import { ref } from 'vue'
import { email, minLength, registerIcons, required } from '@smalt-ui/core'

registerIcons({
  search: [
    ['circle', { cx: 11, cy: 11, r: 8 }],
    ['path', { d: 'm21 21-4.3-4.3' }],
  ],
})

const query = ref('Draft report')
const stack = ref(['Vue', 'Nuxt'])
const rawPhone = ref('')
const birth = ref('')
const license = ref('')
const fillPhone = ref('')
const fillCard = ref('')
const secret = ref('correct horse')
const workEmail = ref('')
const skills = ref([])
</script>

# Input

`SInput` is a text field with a label, a hint, an error state and correct a11y wiring
(`label`, `aria-describedby`, `aria-invalid`). It works through `v-model`.
The `use-tags` flag turns it into a tags input (see [below](#tags-mode-use-tags)).

## Basic usage

<Demo>
  <SInput label="Name" placeholder="Enter your name" />

<template #code>

```vue
<template>
  <SInput
    v-model="name"
    label="Name"
    placeholder="Enter your name"
  />
</template>
```

  </template>
</Demo>

## Square corners

The `square` prop removes the rounding of the field border (fields are rounded by default).
Available on all fields.

<Demo>
  <SInput label="Rounded" placeholder="Default" />
  <SInput square label="Square" placeholder="square" />

<template #code>

```vue
<template>
  <SInput
    square
    label="Square"
    placeholder="square"
  />
</template>
```

  </template>
</Demo>

## Floating label

By default the label **floats**: at rest it looks like a placeholder inside the border, and on
focus or once filled it moves up onto the top border with a notch cut into it. The label size is
fixed and does not depend on `size`. Turn it off with `:floating-label="false"` — the label then
renders as a regular line above the field.

<Demo>
  <SInput label="Floating (default)" />
  <SInput label="Regular label" :floating-label="false" placeholder="Enter a value" />

<template #code>

```vue
<template>
  <SInput label="Floating (default)" />
  <SInput
    label="Regular label"
    :floating-label="false"
  />
</template>
```

  </template>
</Demo>

## Hint and error

<Demo>
  <SInput label="Email" hint="Your work email" placeholder="you@company.com" />
  <SInput label="Email" error="This field is required" placeholder="you@company.com" />

<template #code>

```vue
<template>
  <SInput
    label="Email"
    hint="Your work email"
  />
  <SInput
    label="Email"
    error="This field is required"
  />
</template>
```

  </template>
</Demo>

## Sizes

The `size` prop (`sm`/`md`/`lg`) controls padding and font size.

<Demo>
  <SInput label="sm" size="sm" />
  <SInput label="md" size="md" />
  <SInput label="lg" size="lg" />

<template #code>

```vue
<template>
  <SInput
    label="sm"
    size="sm"
  />
  <SInput
    label="md"
    size="md"
  />
  <SInput
    label="lg"
    size="lg"
  />
</template>
```

  </template>
</Demo>

## Icons and clearing

`icon` draws a leading icon (a name from the registry — here a custom `search` icon registered
with `registerIcons`). The `clearable` flag adds a clear button, visible while the value is not
empty.

<Demo>
  <SInput icon="search" placeholder="Search" aria-label="Search" />
  <SInput v-model="query" clearable label="Clearable" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { registerIcons } from '@smalt-ui/core'

registerIcons({
  search: [
    ['circle', { cx: 11, cy: 11, r: 8 }],
    ['path', { d: 'm21 21-4.3-4.3' }],
  ],
})

const query = ref('Draft report')
</script>

<template>
  <SInput
    icon="search"
    placeholder="Search"
    aria-label="Search"
  />
  <SInput
    v-model="query"
    clearable
    label="Clearable"
  />
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The `prepend` and `append` slots put arbitrary content inside the field border — an icon, text or
a button. Unlike the decorative `icon` prop, slot content is interactive.

<Demo>
  <SInput placeholder="0.00" aria-label="Amount">
    <template #prepend><span style="color: var(--s-color-text-muted)">$</span></template>
  </SInput>
  <SInput placeholder="Value" aria-label="Value">
    <template #append>
      <SButton size="sm" variant="ghost" icon="copy" aria-label="Copy" />
    </template>
  </SInput>

<template #code>

```vue
<template>
  <SInput
    placeholder="0.00"
    aria-label="Amount"
  >
    <template #prepend>
      <span>$</span>
    </template>
  </SInput>

  <SInput
    placeholder="Value"
    aria-label="Value"
  >
    <template #append>
      <SButton
        size="sm"
        variant="ghost"
        icon="copy"
        aria-label="Copy"
      />
    </template>
  </SInput>
</template>
```

  </template>
</Demo>

## States

`disabled` blocks input, `invalid` marks the field as invalid (in addition to `error`),
`required` adds `*` to the label and sets the native `required` attribute.

<Demo>
  <SInput label="Disabled" disabled placeholder="Unavailable" />
  <SInput label="Invalid" invalid placeholder="Check the value" />
  <SInput label="Required" required placeholder="Fill in the field" />

<template #code>

```vue
<template>
  <SInput
    label="Disabled"
    disabled
    placeholder="Unavailable"
  />
  <SInput
    label="Invalid"
    invalid
    placeholder="Check the value"
  />
  <SInput
    label="Required"
    required
    placeholder="Fill in the field"
  />
</template>
```

  </template>
</Demo>

## Input types

The `type` prop is the native `<input>` type: `password` (masks input), `email` (email keyboard
and validation), and so on.

<Demo>
  <SInput label="Password" type="password" placeholder="••••••••" />
  <SInput label="Email" type="email" placeholder="you@company.com" />

<template #code>

```vue
<template>
  <SInput
    label="Password"
    type="password"
    placeholder="••••••••"
  />
  <SInput
    label="Email"
    type="email"
    placeholder="you@company.com"
  />
</template>
```

  </template>
</Demo>

::: warning `type="number"` never reaches the DOM
On intermediate invalid input, a native number field hands the browser an empty string: typing
`12,75` can turn into `5` while the field stays empty — the value gets corrupted silently. That is
why `type="number"` enables numeric mode (see below) and renders as `text`.
:::

## Password reveal

`revealable` adds a button at the end of a `type="password"` field that switches the value between
hidden and visible. It applies to password fields only: with any other `type` nothing is rendered.

The toggle is a `<button type="button">`, so it never submits the surrounding form. It takes no
focus of its own — the field keeps the caret and typing continues where it stopped. Its accessible
name comes from the locale dictionary (`Show password` / `Hide password`) and follows the state
together with `aria-pressed`; `show-password-label` and `hide-password-label` override it for a
single field, `reveal-icon` and `hide-icon` replace the icons. With `clearable` on as well, the
clear button comes first and the reveal button sits after it, before anything in the `append` slot.

<Demo>
  <SInput label="Password" type="password" revealable placeholder="••••••••" />
  <SInput label="Current password" type="password" revealable clearable v-model="secret" />

<template #code>

```vue
<template>
  <SInput
    v-model="password"
    label="Password"
    type="password"
    revealable
  />
  <SInput
    v-model="password"
    label="Current password"
    type="password"
    revealable
    clearable
  />
</template>
```

  </template>
</Demo>

## Numeric mode

The `numeric` prop restricts input to a number: letters and a second decimal separator simply never
appear in the field, rather than being removed after typing. `true` means integers; an object sets
precision and bounds. `v-model` holds a normalized string (dot as the decimal separator, no group
separators), so `Number(value)` always works, while the field shows the locale's usual formatting.

It also sets `inputmode`, so phones open a numeric keyboard.

<Demo>
  <SInput label="Quantity" :numeric="true" placeholder="0" suffix="pcs" :floating-label="false" />
  <SInput label="Weight" :numeric="{ decimals: 2, unsigned: true }" placeholder="0.00" suffix="kg" :floating-label="false" />
  <SInput label="Declared value" :numeric="{ decimals: 2, unsigned: true, max: 100000 }" placeholder="0.00" suffix="$" :floating-label="false" />

<template #code>

```vue
<template>
  <SInput
    v-model="count"
    label="Quantity"
    numeric
    suffix="pcs"
  />
  <SInput
    v-model="weight"
    label="Weight"
    :numeric="{ decimals: 2, unsigned: true }"
    suffix="kg"
  />
  <SInput
    v-model="value"
    label="Declared value"
    :numeric="{ decimals: 2, unsigned: true, max: 100000 }"
    suffix="$"
  />
</template>
```

  </template>
</Demo>

| Key         | What it does                                                   |
| ----------- | -------------------------------------------------------------- |
| `decimals`  | digits after the separator; `0` (default) allows integers only |
| `unsigned`  | disallows the minus sign                                       |
| `min`/`max` | value bounds — applied on `change`, not on every keystroke     |
| `locale`    | formatting locale, `en` by default                             |

Bounds are checked on the `change` event on purpose: if they were applied on every keystroke, with
`min: 10` you could not type the first digit — it would immediately be replaced with `10`.

For a field with a stepper — "minus" and "plus" buttons — there is a separate
[`SNumberField`](/components/number-field).

## Units

The `prefix` and `suffix` props draw text inside the border, before and after the input: units of
measure, a currency sign, a country code. Unlike the `prepend`/`append` slots, they do not
intercept clicks — tapping next to the unit moves focus into the field.

<Demo>
  <SInput label="Weight" suffix="kg" :floating-label="false" placeholder="0" />
  <SInput label="Amount" prefix="$" :floating-label="false" placeholder="0" />
  <SInput label="Phone" prefix="+1" :floating-label="false" placeholder="555 000-0000" />

<template #code>

```vue
<template>
  <SInput
    label="Weight"
    suffix="kg"
  />
  <SInput
    label="Amount"
    prefix="$"
  />
</template>
```

  </template>
</Demo>

## Read-only

`readonly` keeps the value visible and selectable but not editable. Unlike `disabled`, the field is
not dimmed, stays in the tab order and is submitted with the form; the clear button is hidden.

<Demo>
  <SInput label="Order number" model-value="MYD-10446" readonly :floating-label="false" />
  <SInput label="Order number" model-value="MYD-10446" disabled :floating-label="false" />

<template #code>

```vue
<template>
  <SInput
    v-model="orderId"
    label="Order number"
    readonly
  />
</template>
```

  </template>
</Demo>

## Native attributes and events

Everything not declared as a prop goes to the `<input>` itself: `maxlength`, `autocomplete`,
`name`, `pattern`, `inputmode`, `@blur`, `@focus`, `@change` handlers. Only `class` and `style`
stay on the outer border. The links to the label, hint and error (`id`, `aria-describedby`,
`aria-invalid`) are the field's own and are not overridden.

The clear button returns focus to the input, so keyboard users stay in the field.

```vue
<template>
  <SInput
    v-model="zip"
    label="ZIP code"
    name="postal-code"
    autocomplete="postal-code"
    maxlength="5"
    class="own-class"
    @blur="validate"
  />
</template>
```

This matters for `@blur`: the event does not bubble, so the handler has to sit on the field
itself. Attached to the outer `div`, it would silently never fire.

## Trailing icon and custom clear icon

`iconRight` draws a decorative icon on the right inside the field; `clearIcon` sets a custom icon
for the clear button (instead of the default cross).

<Demo>
  <SInput label="Email" icon-right="mail" placeholder="you@company.com" />
  <SInput v-model="query" clearable clear-icon="trash-2" label="Custom clear icon" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const query = ref('Draft report')
</script>

<template>
  <SInput
    label="Email"
    icon-right="mail"
    placeholder="you@company.com"
  />
  <SInput
    v-model="query"
    clearable
    clear-icon="trash-2"
    label="Custom clear icon"
  />
</template>
```

  </template>
</Demo>

## Input mask

The `mask` prop formats input by a template of tokens; the `fill-mask` flag shows the template in
the field and keeps it visible while typing (`__/__/____`). Tokens, named masks and options are
listed in the [API table](#api) below.

<Demo>
  <SInput v-model="fillPhone" label="Phone" mask="(###) ### - ####" fill-mask>
    <template #prepend><SIcon icon="phone" :size="16" /></template>
  </SInput>
  <SInput v-model="fillCard" label="Card" mask="card" fill-mask>
    <template #prepend><SIcon icon="credit-card" :size="16" /></template>
  </SInput>
  <SInput v-model="birth" label="Date of birth" mask="##/##/####" fill-mask>
    <template #prepend><SIcon icon="calendar" :size="16" /></template>
  </SInput>

<template #code>

```vue
<template>
  <SInput
    v-model="phone"
    label="Phone"
    mask="(###) ### - ####"
    fill-mask
  >
    <template #prepend>
      <SIcon
        icon="phone"
        :size="16"
      />
    </template>
  </SInput>
  <SInput
    v-model="card"
    label="Card"
    mask="card"
    fill-mask
  >
    <template #prepend>
      <SIcon
        icon="credit-card"
        :size="16"
      />
    </template>
  </SInput>
  <SInput
    v-model="birth"
    label="Date of birth"
    mask="##/##/####"
    fill-mask
  >
    <template #prepend>
      <SIcon
        icon="calendar"
        :size="16"
      />
    </template>
  </SInput>
</template>
```

  </template>
</Demo>

### Raw value and letters

With `unmasked-value`, `v-model` receives the value without separators (handy for sending to the
backend). Letter tokens with a case transform suit IDs such as a license number: `AA ######`
(letters are uppercased).

<Demo>
  <SInput v-model="rawPhone" label="Phone (raw value)" mask="phone" fill-mask unmasked-value :hint="`v-model: ${rawPhone || '—'}`">
    <template #prepend><SIcon icon="phone" :size="16" /></template>
  </SInput>
  <SInput v-model="license" label="License number" mask="AA ######" fill-mask hint="Letters are uppercased">
    <template #prepend><SIcon icon="file-text" :size="16" /></template>
  </SInput>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const rawPhone = ref('')
const license = ref('')
</script>

<template>
  <!-- v-model receives "9991234567" instead of "(999) 123 - 4567" -->
  <SInput
    v-model="rawPhone"
    label="Phone (raw value)"
    mask="phone"
    fill-mask
    unmasked-value
  >
    <template #prepend>
      <SIcon
        icon="phone"
        :size="16"
      />
    </template>
  </SInput>
  <!-- The A token forces letters to uppercase -->
  <SInput
    v-model="license"
    label="License number"
    mask="AA ######"
    fill-mask
  >
    <template #prepend>
      <SIcon
        icon="file-text"
        :size="16"
      />
    </template>
  </SInput>
</template>
```

  </template>
</Demo>

## Tags mode (use-tags)

The `use-tags` flag enables entering multiple tags (it replaces the former standalone `STagsInput`
component). In this mode `v-model` is a `string[]`: a new tag is added on Enter, and each tag is an
[`STag`](/components/tag) chip with a remove button. The `duplicate`, `add-on-paste` and `max`
props control input behavior. Inside a `<form>` the tags are submitted under `name` as
`name[0]`, `name[1]`, …, and `required` passes once there is at least one tag.

<Demo>
  <SInput
    v-model="stack"
    use-tags
    label="Technologies"
    placeholder="Type and press Enter"
    :max="5"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const stack = ref(['Vue', 'Nuxt'])
</script>

<template>
  <SInput
    v-model="stack"
    use-tags
    label="Technologies"
    placeholder="Type and press Enter"
    :max="5"
  />
</template>
```

  </template>
</Demo>

## Validation

`rules` checks the value when focus leaves the field, and then on every change while the error
is shown. The rules receive the `v-model` value: a `string`, a `string[]` in tags mode, and in
numeric mode a number as a string (`'1234.5'`), which `min()` and `max()` convert themselves. The
details, including when fields check and forms, are in the [Validation](/guide/validation) guide.

Leave the email field empty and move focus away, then type an address. In tags mode
`minLength()` counts the tags ("Select at least 2"); an empty list passes it, so the field also
has `required()`.

<Demo>
  <div style="display: grid; gap: 16px; width: 100%; max-width: 360px">
    <SInput
      v-model="workEmail"
      label="Work email"
      autocomplete="email"
      required
      :rules="[required(), email()]"
    />
    <SInput
      v-model="skills"
      use-tags
      label="Skills"
      placeholder="Type and press Enter"
      :rules="[required(), minLength(2)]"
    />
  </div>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { email, minLength, required } from '@smalt-ui/core'

const address = ref('')
const skills = ref<string[]>([])
</script>

<template>
  <SInput
    v-model="address"
    label="Work email"
    autocomplete="email"
    required
    :rules="[required(), email()]"
  />
  <SInput
    v-model="skills"
    use-tags
    label="Skills"
    placeholder="Type and press Enter"
    :rules="[required(), minLength(2)]"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SInput" />
