# Button

`SButton` is a button with style variants, sizes, a loading state, and icon slots. It is
polymorphic: `as` renders it as another element, such as a link.

## Variants

<Demo>
  <SButton variant="primary">Primary</SButton>
  <SButton variant="secondary">Secondary</SButton>
  <SButton variant="outline">Outline</SButton>
  <SButton variant="ghost">Ghost</SButton>
  <SButton variant="negative">Negative</SButton>

<template #code>

```vue
<template>
  <SButton variant="primary">Primary</SButton>
  <SButton variant="secondary">Secondary</SButton>
  <SButton variant="outline">Outline</SButton>
  <SButton variant="ghost">Ghost</SButton>
  <SButton variant="negative">Negative</SButton>
</template>
```

  </template>
</Demo>

## Sizes

<Demo>
  <SButton size="sm">Small</SButton>
  <SButton size="md">Medium</SButton>
  <SButton size="lg">Large</SButton>

<template #code>

```vue
<template>
  <SButton size="sm">Small</SButton>
  <SButton size="md">Medium</SButton>
  <SButton size="lg">Large</SButton>
</template>
```

  </template>
</Demo>

## Shape

The `round` prop fully rounds the edges (pill shape), while `square` does the opposite and removes
the rounding (square corners). Every component with a frame (buttons, inputs, cards, overlays,
etc.) has the `square` prop, and it works the same way everywhere.

<Demo>
  <SButton round variant="primary">Get started</SButton>
  <SButton round variant="outline">Learn more</SButton>
  <SButton square variant="primary">Square</SButton>
  <SButton round icon="plus" variant="primary" aria-label="Add" />

<template #code>

```vue
<template>
  <SButton
    round
    variant="primary"
  >
    Get started
  </SButton>
  <SButton
    round
    variant="outline"
  >
    Learn more
  </SButton>
  <SButton
    square
    variant="primary"
  >
    Square
  </SButton>
  <SButton
    round
    icon="plus"
    variant="primary"
    aria-label="Add"
  />
</template>
```

  </template>
</Demo>

## Color

The `color` prop sets a color from the [palette](/style/palette): a brand role, a family, or one of
its shades (`primary`, `teal`, `teal-10`). It overrides the variant color while keeping the style
(fill/outline). The `hover`/`active` states are derived automatically. On a light fill, set
`text-color` to keep the text readable.

<Demo>
  <SButton color="teal">teal</SButton>
  <SButton color="deep-purple">deep-purple</SButton>
  <SButton color="teal-10">teal-10</SButton>
  <SButton variant="outline" color="pink">outline pink</SButton>
  <SButton color="light-blue-3" text-color="dark">light-blue-3 + text-color</SButton>

<template #code>

```vue
<template>
  <SButton color="teal">teal</SButton>
  <SButton color="deep-purple">deep-purple</SButton>
  <SButton color="teal-10">teal-10</SButton>
  <SButton
    variant="outline"
    color="pink"
  >
    outline pink
  </SButton>
  <SButton
    color="light-blue-3"
    text-color="dark"
  >
    Light fill, dark text
  </SButton>
</template>
```

  </template>
</Demo>

## States

`loading` shows a spinner over the content: the button keeps its width and its accessible name.

<Demo>
  <SButton disabled>Disabled</SButton>
  <SButton loading>Loading</SButton>

<template #code>

```vue
<template>
  <SButton disabled>Disabled</SButton>
  <SButton loading>Loading</SButton>
</template>
```

  </template>
</Demo>

## As a link

<Demo>
  <SButton as="a" href="#button" variant="outline">Link button</SButton>

<template #code>

```vue
<template>
  <SButton
    as="a"
    href="/docs"
    variant="outline"
  >
    Link button
  </SButton>
</template>
```

  </template>
</Demo>

## Icons

The leading (`icon`) and trailing (`icon-right`) icons take a registry name and follow the button
size: 16px for `sm`, 18px for `md`, 20px for `lg`. For a button without text, set `aria-label` so
the icon gets an accessible name.

<Demo>
  <SButton icon="plus" variant="primary">Add</SButton>
  <SButton icon-right="chevron-down" variant="outline">Menu</SButton>
  <SButton icon="x" variant="ghost" aria-label="Close" />

<template #code>

```vue
<template>
  <SButton
    icon="plus"
    variant="primary"
  >
    Add
  </SButton>
  <SButton
    icon-right="chevron-down"
    variant="outline"
  >
    Menu
  </SButton>
  <SButton
    icon="x"
    variant="ghost"
    aria-label="Close"
  />
</template>
```

  </template>
</Demo>

## Icon button

An icon without a text label makes the button square automatically: the horizontal padding is
removed and the width equals the height of the size. If the content comes through a slot, enable
the mode with the `icon-only` prop. Such a button requires `aria-label`, since there is nothing
else to announce.

<Demo>
  <SButton icon="x" variant="outline" aria-label="Close" />
  <SButton icon="pencil" variant="ghost" aria-label="Edit" />
  <SButton icon="trash-2" variant="negative" aria-label="Delete" />
  <SButton icon="settings" variant="outline" size="sm" aria-label="Settings" />
  <SButton icon="settings" variant="outline" size="lg" aria-label="Settings" />
  <SButton
    icon-only
    variant="ghost"
    aria-label="Favorite"
  >
    <template #leading>
      <SIcon icon="heart" />
    </template>
  </SButton>

<template #code>

```vue
<template>
  <SButton
    icon="x"
    variant="outline"
    aria-label="Close"
  />
  <SButton
    icon="pencil"
    variant="ghost"
    aria-label="Edit"
  />
  <SButton
    icon="trash-2"
    variant="negative"
    aria-label="Delete"
  />
  <SButton
    icon="settings"
    variant="outline"
    size="sm"
    aria-label="Settings"
  />
  <SButton
    icon="settings"
    variant="outline"
    size="lg"
    aria-label="Settings"
  />
  <SButton
    icon-only
    variant="ghost"
    aria-label="Favorite"
  >
    <template #leading>
      <SIcon icon="heart" />
    </template>
  </SButton>
</template>
```

  </template>
</Demo>

## Without shadow

The filled variants (`primary`, `secondary`, `negative`) come with a shadow. The `flat` prop
removes it without touching the shadows of other components. If you want flat buttons across the
whole app, make the prop a [default](/guide/defaults):
`installDefaults(app, { SButton: { flat: true } })`. The reverse also works: `elevation` sets the
level explicitly and overrides `flat`, including a `flat` that comes from the global defaults. The
scale and the rules are on the [Elevation](/style/elevation) page.

<Demo>
  <SButton variant="primary">With shadow</SButton>
  <SButton variant="primary" flat>No shadow</SButton>
  <SButton variant="secondary" flat>No shadow</SButton>
  <SButton variant="primary" :elevation="4">elevation 4</SButton>

<template #code>

```vue
<template>
  <SButton variant="primary">With shadow</SButton>
  <SButton
    variant="primary"
    flat
  >
    No shadow
  </SButton>
  <SButton
    variant="secondary"
    flat
  >
    No shadow
  </SButton>
  <SButton
    variant="primary"
    :elevation="4"
  >
    elevation 4
  </SButton>
</template>
```

  </template>
</Demo>

## Button type

Inside a form, `type="submit"` submits it and `type="reset"` resets the fields. The default is
`type="button"`, a neutral button that does not submit.

<Demo>
  <form style="display: flex; gap: 8px; align-items: center" @submit.prevent>
    <SButton type="submit" variant="primary">Submit</SButton>
    <SButton type="reset" variant="outline">Reset</SButton>
  </form>

<template #code>

```vue
<template>
  <form @submit.prevent="onSubmit">
    <SButton
      type="submit"
      variant="primary"
    >
      Submit
    </SButton>
    <SButton
      type="reset"
      variant="outline"
    >
      Reset
    </SButton>
  </form>
</template>
```

  </template>
</Demo>

## Icon slots

The `#leading` and `#trailing` slots override the `icon`/`icon-right` props and accept any markup,
for example an `SIcon` with a custom size.

<Demo>
  <SButton variant="primary">
    <template #leading>
      <SIcon icon="check" :size="18" />
    </template>
    Save
  </SButton>
  <SButton variant="outline">
    Next
    <template #trailing>
      <SIcon icon="chevron-right" :size="18" />
    </template>
  </SButton>

<template #code>

```vue
<template>
  <SButton variant="primary">
    <template #leading>
      <SIcon
        icon="check"
        :size="18"
      />
    </template>
    Save
  </SButton>
  <SButton variant="outline">
    Next
    <template #trailing>
      <SIcon
        icon="chevron-right"
        :size="18"
      />
    </template>
  </SButton>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SButton" />
