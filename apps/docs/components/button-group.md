# Button Group

`SButtonGroup` joins several `SButton` into one control: attached buttons share their edges, and
the appearance props set on the group (`size`, `variant`, `color`, `square`, `round`, `disabled`)
become the defaults of every button inside, so a button that sets the prop itself still wins. The
root carries `role="group"`; give it a `label` when the set of actions needs a name of its own.

## Attached buttons

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

## API

<ApiTable name="SButtonGroup" />
