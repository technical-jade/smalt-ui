# Form Field

`SFormField` is a form field wrapper: a label (via `SLabel`), a hint or error message, and correct
a11y relationships (`for`, `aria-describedby`, `aria-invalid`). The control goes into the default
slot and receives the scoped props `{ id, describedBy, invalid }`. `SInput`, `SSelect`, and
`STextarea` are built on this block — composition instead of duplicated markup.
An error that appears is announced by screen readers (a polite live region), and a floating label
rises over a value filled in by browser autofill.

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

## Sizes

The `size` prop (`sm` / `md` / `lg`) is passed to the label (`SLabel`) and changes its typography.
The size of the control itself is managed separately, on the control's side.

<Demo>
    <SFormField label="sm" size="sm">
      <template #default="{ id }">
        <input :id="id" style="width: 100%; height: 2.5rem; padding: 0 12px; border: 1px solid var(--s-color-outline); border-radius: var(--s-radius-sm); background: var(--s-color-surface); color: var(--s-color-text)" />
      </template>
    </SFormField>
    <SFormField label="md" size="md">
      <template #default="{ id }">
        <input :id="id" style="width: 100%; height: 2.5rem; padding: 0 12px; border: 1px solid var(--s-color-outline); border-radius: var(--s-radius-sm); background: var(--s-color-surface); color: var(--s-color-text)" />
      </template>
    </SFormField>
    <SFormField label="lg" size="lg">
      <template #default="{ id }">
        <input :id="id" style="width: 100%; height: 2.5rem; padding: 0 12px; border: 1px solid var(--s-color-outline); border-radius: var(--s-radius-sm); background: var(--s-color-surface); color: var(--s-color-text)" />
      </template>
    </SFormField>

<template #code>

```vue
<template>
  <SFormField
    label="sm"
    size="sm"
  >
    <template #default="{ id }">
      <input :id="id" />
    </template>
  </SFormField>
  <SFormField
    label="md"
    size="md"
  >
    <template #default="{ id }">
      <input :id="id" />
    </template>
  </SFormField>
  <SFormField
    label="lg"
    size="lg"
  >
    <template #default="{ id }">
      <input :id="id" />
    </template>
  </SFormField>
</template>
```

  </template>
</Demo>

## Label from markup

The `label` prop takes a string. When the label has to be built from elements — made a link, or
given a hint icon — use the `#label` slot: its content goes inside the same `<label for>`, so
clicking it still focuses the field.

<Demo>
  <SFormField hint="Limit: $1,000">
    <template #label>
      <a href="./form-field">Declared value</a>
    </template>
    <template #default="{ id, describedBy }">
      <SInput
        :id="id"
        :aria-describedby="describedBy"
        :floating-label="false"
        prefix="$"
        placeholder="0"
      />
    </template>
  </SFormField>

<template #code>

```vue
<template>
  <SFormField :error="errors.declaredValue">
    <template #label>
      <a
        :href="links.declaredValue"
        target="_blank"
        >Declared value</a
      >
    </template>
    <template #default="{ id, describedBy, invalid }">
      <SInput
        :id="id"
        v-model="value"
        :aria-describedby="describedBy"
        :invalid="invalid"
        :floating-label="false"
      />
    </template>
  </SFormField>
</template>
```

  </template>
</Demo>

The slot is incompatible with a floating label: that label is drawn by the field itself, not by
`SFormField`. In dev mode this combination logs a warning — pass `floating-label="false"`.

## API

<ApiTable name="SFormField" />
