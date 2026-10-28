# Avatar

`SAvatar` is a user avatar built on Reka UI: it shows the image from `src`, and while there is none,
while it loads or when loading fails, a fallback (usually initials). Clearing `src` after an image
has loaded brings the fallback back. The sizes are `sm`, `md` (the default) and `lg`.

## Sizes (fallback initials)

<ClientOnly>
<Demo>
  <div style="display: flex; align-items: center; gap: 12px">
    <SAvatar fallback="AJ" size="sm" />
    <SAvatar fallback="MG" size="md" />
    <SAvatar fallback="DS" size="lg" />
  </div>

<template #code>

```vue
<template>
  <SAvatar
    fallback="AJ"
    size="sm"
  />
  <SAvatar
    fallback="MG"
    size="md"
  />
  <SAvatar
    fallback="DS"
    size="lg"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## With an image

`alt` gives the image its accessible name. Without it the picture is treated as decorative
(`alt=""`) and screen readers skip it. The fallback text is read as ordinary text, so initials such
as "US" are spelled out letter by letter; when the avatar carries meaning, give it an `alt`.

<ClientOnly>
<Demo>
  <SAvatar
    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%237c3aed'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Ccircle cx='48' cy='96' r='34' fill='white'/%3E%3C/svg%3E"
    alt="User"
    fallback="US"
    size="lg"
  />

<template #code>

```vue
<template>
  <SAvatar
    src="/avatars/user.jpg"
    alt="User"
    fallback="US"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Custom fallback

The default slot replaces the `fallback` prop, for example with an icon. Here `src` is not set, so
the icon shows; the same happens when the image fails to load. `delay-ms` postpones the fallback so
it does not flash while a fast image loads.

<ClientOnly>
<Demo>
  <SAvatar size="lg">
    <SIcon
      icon="user"
      :size="24"
    />
  </SAvatar>

<template #code>

```vue
<template>
  <SAvatar size="lg">
    <SIcon
      icon="user"
      :size="24"
    />
  </SAvatar>
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SAvatar" />
