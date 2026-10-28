# Form Field

`SFormField` is a form field wrapper: a label (via `SLabel`), a hint or error message, and correct
a11y relationships (`for`, `aria-describedby`, `aria-invalid`). The control goes into the default
slot and receives the scoped props `{ id, describedBy, invalid }`. `SInput`, `SSelect`, and
`STextarea` are built on this block — composition instead of duplicated markup.
An error that appears is announced by screen readers (a polite live region), and a floating label
rises over a value filled in by browser autofill.

The label is a `<label for>` with the id of the control. One message is shown under the field: an
error replaces the hint, and `aria-describedby` points only at what is in the DOM. `required`
draws `*` next to the label; the native `required` attribute on the control is set by the control
itself.

| Slot prop       | What it is                                                         |
| --------------- | ------------------------------------------------------------------ |
| `id`            | the id of the control, linked to `<label for>`                     |
| `describedBy`   | the id of the error or the hint for `aria-describedby`, or nothing |
| `invalid`       | the field is invalid (`error` or `invalid`), for `aria-invalid`    |
| `labelId`       | the label id for `aria-labelledby` of group controls               |
| `label`         | the label text, for a control that draws the label itself          |
| `floatingLabel` | whether the floating label is on                                   |
| `square`        | whether square corners are on                                      |

## Basic usage

<Demo>
  <SFormField label="Name" hint="How should we address you?">
    <template #default="{ id, describedBy }">
      <input :id="id" :aria-describedby="describedBy" style="width: 100%; height: 2.5rem; padding: 0 12px; border: 1px solid var(--s-color-outline); border-radius: var(--s-radius-sm); background: var(--s-color-surface); color: var(--s-color-text)" />
    </template>
  </SFormField>

<template #code>

```vue
<template>
  <SFormField
    label="Name"
    hint="How should we address you?"
  >
    <template #default="{ id, describedBy }">
      <input
        :id="id"
        :aria-describedby="describedBy"
      />
    </template>
  </SFormField>
</template>
```

  </template>
</Demo>

## Error state

<Demo>
  <SFormField label="Email" error="This field is required" required>
    <template #default="{ id, describedBy, invalid }">
      <input :id="id" :aria-describedby="describedBy" :aria-invalid="invalid || undefined" style="width: 100%; height: 2.5rem; padding: 0 12px; border: 1px solid var(--s-color-negative); border-radius: var(--s-radius-sm); background: var(--s-color-surface); color: var(--s-color-text)" />
    </template>
  </SFormField>

<template #code>

```vue
<template>
  <SFormField
    label="Email"
    error="This field is required"
    required
  >
    <template #default="{ id, describedBy, invalid }">
      <input
        :id="id"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
      />
    </template>
  </SFormField>
</template>
```

  </template>
</Demo>

The library fields built on `SFormField` fill `error` by themselves: with `rules`, a failed rule
puts its text there, so there is no need to keep an error variable for every field. A manual
`error` passed to the field, a server response for example, still wins over the rules. See the
[Validation](/guide/validation) guide; a control of your own gets the same behavior from
`useValidation` (see [Custom fields](/guide/validation#custom-fields)).

## Sizes

The label above the field always matches the hint and the error in font size
(`--s-font-size-xs`), so the `size` prop (`sm` / `md` / `lg`) does not change it: it only sets the
`s-label--{size}` modifier on the label, and the library fields pass their own `size` here. The
size of the control itself is managed on the control's side.

## Label from markup

The `label` prop takes a string. When the label has to be built from elements — made a link, or
given a hint icon — use the `#label` slot: its content goes inside the same `<label for>`, so
clicking it still focuses the field. The slot takes `{ id, for, required }` and wins over the
`label` prop.

<Demo>
  <SFormField hint="Limit: $1,000">
    <template #label>
      <a href="./form-field">Declared value</a>
    </template>
    <template #default="{ id, describedBy }">
      <input :id="id" :aria-describedby="describedBy" inputmode="decimal" style="width: 100%; height: 2.5rem; padding: 0 12px; border: 1px solid var(--s-color-outline); border-radius: var(--s-radius-sm); background: var(--s-color-surface); color: var(--s-color-text)" />
    </template>
  </SFormField>

<template #code>

```vue
<template>
  <SFormField hint="Limit: $1,000">
    <template #label>
      <a href="./form-field">Declared value</a>
    </template>
    <template #default="{ id, describedBy }">
      <input
        :id="id"
        :aria-describedby="describedBy"
        inputmode="decimal"
      />
    </template>
  </SFormField>
</template>
```

  </template>
</Demo>

The slot is incompatible with a floating label: that label is drawn by the field itself, not by
`SFormField`. In dev mode this combination logs a warning — pass `:floating-label="false"`.

The slot content has to be a native control, as above. A library field such as `SInput` is built
on its own `SFormField`, so it draws and links its label itself and does not need this wrapper.

## Group controls

`<label for>` works only with native fields (`input`, `textarea`, `select`). When the control is a
group of elements (a `div` with `role="group"` or `radiogroup`, a set of cells), link the label to
it through `aria-labelledby` and the `labelId` slot prop. Put the `id` on the first focusable
element of the group: `SForm` moves focus to an invalid field by it.

```vue
<template>
  <SFormField label="Delivery method">
    <template #default="{ id, labelId, describedBy, invalid }">
      <div
        role="radiogroup"
        :aria-labelledby="labelId"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
      >
        <label>
          <input
            :id="id"
            type="radio"
            name="delivery"
            value="courier"
          />
          Courier
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="pickup"
          />
          Pickup point
        </label>
      </div>
    </template>
  </SFormField>
</template>
```

## Compact controls and corner shape

`inline` narrows the field to the width of its content instead of the full row, for a checkbox or
a switch that needs a hint and an error but not a stretched block. `square` removes the rounding
of the frame on the library fields inside and is passed to the `square` slot prop, so a custom
control with a popup panel can match the panel corners to it.

## Instance

Through a template ref `SFormField` exposes `controlId`: the id it gives the control (the `id`
prop, or a generated `s-field-…` id), the same value as the `id` slot prop. It lets code outside
the slot find the control, for example to move focus to it:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const field = useTemplateRef('field')

function focusControl() {
  const id = field.value?.controlId
  if (id) document.getElementById(id)?.focus()
}
</script>

<template>
  <SFormField
    ref="field"
    label="Name"
  >
    <template #default="{ id }">
      <input :id="id" />
    </template>
  </SFormField>
</template>
```

## API

<ApiTable name="SFormField" />
