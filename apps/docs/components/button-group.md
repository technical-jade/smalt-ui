# Button Group

`SButtonGroup` joins several `SButton` into one control: attached buttons share their edges, and
the appearance props set on the group (`size`, `variant`, `color`, `square`, `round`, `disabled`)
become the defaults of every `SButton` inside, nested ones included, so a button that sets the
prop itself still wins. `variant="link"` is not accepted on the group.

The root is a `div` with `role="group"`. The `label` prop gives the group an accessible name
(`aria-label`); without it the group stays unnamed. Every button is its own <kbd>Tab</kbd> stop,
and the arrow keys do not move focus. If the buttons choose a value rather than run actions, use
[`SToggleGroup`](./toggle#group-stogglegroup).

## Attached buttons

A long label wraps in a narrow container, and its button grows in height (see
[Button sizes](/components/button#sizes)). In an attached row the other buttons take the same
height, so the shared edges still meet.

Filled buttons (`primary`, `secondary`, `negative`) are split by a thin line in their text color,
and the attached group casts one shadow instead of a shadow per button. A group that mixes filled
and other variants has no shadow. `flat` removes the shadow and `elevation` sets its level on the
[scale](/style/elevation); in a detached group both reach every button instead. A button's own
`elevation` still draws its own shadow.

<Demo>
  <SButtonGroup label="Text actions">
    <SButton>Copy</SButton>
    <SButton>Cut</SButton>
    <SButton>Paste</SButton>
  </SButtonGroup>

<template #code>

```vue
<template>
  <SButtonGroup label="Text actions">
    <SButton>Copy</SButton>
    <SButton>Cut</SButton>
    <SButton>Paste</SButton>
  </SButtonGroup>
</template>
```

  </template>
</Demo>

## Shared appearance

The group props reach every button. Here the whole group is `outline` and `sm`, while the last
button sets its own `variant`.

<Demo>
  <SButtonGroup variant="outline" size="sm" label="Row status">
    <SButton>Draft</SButton>
    <SButton>Review</SButton>
    <SButton variant="primary">Publish</SButton>
  </SButtonGroup>

<template #code>

```vue
<template>
  <SButtonGroup
    variant="outline"
    size="sm"
    label="Row status"
  >
    <SButton>Draft</SButton>
    <SButton>Review</SButton>
    <SButton variant="primary">Publish</SButton>
  </SButtonGroup>
</template>
```

  </template>
</Demo>

## Vertical and detached

`orientation="vertical"` stacks the buttons. `:attached="false"` keeps every button's own shape
and spaces them out instead.

<Demo>
  <SButtonGroup orientation="vertical" variant="outline" label="Sorting">
    <SButton icon="chevron-up">Up</SButton>
    <SButton icon="chevron-down">Down</SButton>
  </SButtonGroup>
  <SButtonGroup :attached="false" label="Form actions">
    <SButton variant="ghost">Cancel</SButton>
    <SButton>Save</SButton>
  </SButtonGroup>

<template #code>

```vue
<template>
  <SButtonGroup
    orientation="vertical"
    variant="outline"
    label="Sorting"
  >
    <SButton icon="chevron-up">Up</SButton>
    <SButton icon="chevron-down">Down</SButton>
  </SButtonGroup>

  <SButtonGroup
    :attached="false"
    label="Form actions"
  >
    <SButton variant="ghost">Cancel</SButton>
    <SButton>Save</SButton>
  </SButtonGroup>
</template>
```

  </template>
</Demo>

## Shape and color

`round` and `square` apply to the whole group: the outer corners follow the button shape, the
inner ones always collapse. `color` takes a name from the [palette](/style/palette).

<Demo>
  <SButtonGroup round color="teal" label="Zoom">
    <SButton icon="minus" aria-label="Zoom out" />
    <SButton>100%</SButton>
    <SButton icon="plus" aria-label="Zoom in" />
  </SButtonGroup>
  <SButtonGroup square variant="outline" label="Alignment">
    <SButton>Left</SButton>
    <SButton>Center</SButton>
    <SButton>Right</SButton>
  </SButtonGroup>

<template #code>

```vue
<template>
  <SButtonGroup
    round
    color="teal"
    label="Zoom"
  >
    <SButton
      icon="minus"
      aria-label="Zoom out"
    />
    <SButton>100%</SButton>
    <SButton
      icon="plus"
      aria-label="Zoom in"
    />
  </SButtonGroup>
</template>
```

  </template>
</Demo>

## Limitations

Attaching works only for buttons placed directly in the group. Wrap a button in a `div` or another
element and it keeps its rounded inner corners and a double border. `STooltip` does not break the
attachment, because it adds no wrapper around its trigger. The appearance defaults still reach
the button either way: they travel through context, not through markup.

## API

<ApiTable name="SButtonGroup" />
