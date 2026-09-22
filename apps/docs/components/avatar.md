# Avatar

`SAvatar` is a user avatar built on Reka UI: it shows an image, and when there is none or it fails
to load, a fallback (usually initials). It supports sizes.
Clearing `src` after an image has loaded brings the fallback back.

## Sizes (fallback initials)

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

## With an image

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

## API

<ApiTable name="SAvatar" />
