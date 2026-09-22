# Toggle

`SToggle` is a two-state toggle button (pressed/unpressed) built on Reka UI: it carries the
`button` role with `aria-pressed` and `data-state`. It is used on its own (for example, "bold" in
an editor) or inside `SToggleGroup` — then the group manages the state.

## Single toggle

<ClientOnly>
<Demo>
  <SToggle>Bold</SToggle>
  <SToggle :modelValue="true">Italic</SToggle>
  <SToggle disabled>Underline</SToggle>

<template #code>

```vue
<template>
  <SToggle v-model="bold">Bold</SToggle>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Sizes

<ClientOnly>
<Demo>
  <SToggle size="sm">sm</SToggle>
  <SToggle size="md">md</SToggle>
  <SToggle size="lg">lg</SToggle>

<template #code>

```vue
<template>
  <SToggle size="sm">sm</SToggle>
  <SToggle size="lg">lg</SToggle>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Group (`SToggleGroup`)

Groups related toggles. `type="single"` keeps one item active, `type="multiple"` allows any
subset; without `type` the mode follows `v-model`, so an array means `multiple`. Items are set
with the `options` prop or with `SToggle`s placed in the slot (each needs a `value`); `SToggle`s in
the slot take the group `size` unless they set their own.

<ClientOnly>
<Demo>
  <SToggleGroup
    aria-label="Alignment"
    :options="[
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ]"
  />

<template #code>

```vue
<template>
  <SToggleGroup
    v-model="align"
    type="single"
    aria-label="Alignment"
    :options="[
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

### Multiple selection

<ClientOnly>
<Demo>
  <SToggleGroup
    type="multiple"
    aria-label="Formatting"
    :options="[
      { value: 'bold', label: 'B' },
      { value: 'italic', label: 'I' },
      { value: 'underline', label: 'U' },
    ]"
  />

<template #code>

```vue
<template>
  <SToggleGroup
    v-model="marks"
    type="multiple"
    aria-label="Formatting"
    :options="[
      { value: 'bold', label: 'B' },
      { value: 'italic', label: 'I' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

### Required selection

In `single` mode a click on the active item clears the value. `mandatory` keeps it selected, so
the group always has a value once one is picked.

<ClientOnly>
<Demo>
  <SToggleGroup
    mandatory
    model-value="list"
    aria-label="View"
    :options="[
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
    ]"
  />

<template #code>

```vue
<template>
  <SToggleGroup
    v-model="view"
    mandatory
    aria-label="View"
    :options="[
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` prop sets the color of the on state from the [palette](/style/palette).

<ClientOnly>
<Demo>
  <SToggle :model-value="true" color="indigo">Indigo</SToggle>
  <SToggle :model-value="true" color="blue">Blue</SToggle>
  <SToggle :model-value="true" color="blue-grey">Blue-grey</SToggle>

<template #code>

```vue
<template>
  <SToggle
    v-model="on"
    color="indigo"
  >
    Indigo
  </SToggle>
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

### SToggle

<ApiTable name="SToggle" />

### SToggleGroup

<ApiTable name="SToggleGroup" />
