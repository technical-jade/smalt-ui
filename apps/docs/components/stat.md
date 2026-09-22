# Stat

`SStat` is the metric tile of a dashboard: a label, the number it stands for, an optional change
against a previous period and a line of context. The label is required — a number with no name
tells a reader nothing — and it is also the accessible name of the tile: value and label are
wrapped in one labelled group, so a screen reader reads "Revenue, 1,234,567" instead of two
unrelated strings.

The trend is never conveyed by color and an arrow alone. Next to the change the component renders
a visually hidden direction label (`Up` / `Down`, from the locale dictionary, overridable with
`trend-up-label` / `trend-down-label`); a zero change stays neutral and gets no label, because a
plain `0` already reads as no movement.

By default the tile draws no surface of its own: it is meant to sit inside an
[`SCard`](./card) or in a grid cell that already has one. `variant="card"` gives it a standalone
look with a border, a radius and padding.

## Basic usage

A numeric `value` is formatted with the thousands separators of the current locale. Tiles line up
in a grid; `icon` marks the metric, `description` carries the period or the source.

<Demo>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; width: 100%">
    <SStat label="Revenue" :value="1234567" icon="credit-card" description="Last 30 days" />
    <SStat label="Active users" :value="8421" icon="users" description="Last 30 days" />
    <SStat label="Conversion" value="12.5%" icon="filter" description="Checkout funnel" />
  </div>

<template #code>

```vue
<template>
  <SStat
    label="Revenue"
    :value="1234567"
    icon="credit-card"
    description="Last 30 days"
  />
  <SStat
    label="Active users"
    :value="8421"
    icon="users"
    description="Last 30 days"
  />
  <SStat
    label="Conversion"
    value="12.5%"
    icon="filter"
    description="Checkout funnel"
  />
</template>
```

  </template>
</Demo>

A string `value` is rendered exactly as given — use it for numbers that are already formatted
(`12.5%`, `$1.2M`). `format-value` controls the rest: `false` prints the raw number, an object is
passed to `Intl.NumberFormat` as its options.

<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 32px; width: 100%">
    <SStat label="Order id" :value="1234567" :format-value="false" />
    <SStat label="Revenue" :value="1234.5" :format-value="{ style: 'currency', currency: 'USD' }" />
    <SStat label="Storage" :value="0.732" :format-value="{ style: 'percent', maximumFractionDigits: 1 }" />
  </div>

<template #code>

```vue
<template>
  <SStat
    label="Order id"
    :value="1234567"
    :format-value="false"
  />
  <SStat
    label="Revenue"
    :value="1234.5"
    :format-value="{ style: 'currency', currency: 'USD' }"
  />
  <SStat
    label="Storage"
    :value="0.732"
    :format-value="{ style: 'percent', maximumFractionDigits: 1 }"
  />
</template>
```

  </template>
</Demo>

## Trends

`trend` is the signed change: positive renders the upward treatment, negative the downward one,
`0` the neutral one. `trend-label` says what the change is measured against.

<Demo>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; width: 100%">
    <SStat label="Revenue" :value="1234567" :trend="12.4" trend-label="vs last month" />
    <SStat label="Refunds" :value="312" :trend="-3.2" trend-label="vs last month" />
    <SStat label="Open tickets" :value="48" :trend="0" trend-label="vs last month" />
  </div>

<template #code>

```vue
<template>
  <SStat
    label="Revenue"
    :value="1234567"
    :trend="12.4"
    trend-label="vs last month"
  />
  <SStat
    label="Refunds"
    :value="312"
    :trend="-3.2"
    trend-label="vs last month"
  />
  <SStat
    label="Open tickets"
    :value="48"
    :trend="0"
    trend-label="vs last month"
  />
</template>
```

  </template>
</Demo>

## Card variant and sizes

`variant="card"` turns the tile into a standalone card; `square` removes its radius. `size` scales
the value, the spacing and the icon, and `color` accents the icon with a name from the
[palette](/style/palette).

<Demo>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; width: 100%">
    <SStat variant="card" size="sm" label="Sessions" :value="24318" icon="eye" />
    <SStat variant="card" label="Revenue" :value="1234567" icon="credit-card" color="teal" :trend="12.4" trend-label="vs last month" />
    <SStat variant="card" size="lg" label="Active users" :value="8421" icon="users" color="primary" />
  </div>

<template #code>

```vue
<template>
  <SStat
    variant="card"
    size="sm"
    label="Sessions"
    :value="24318"
    icon="eye"
  />
  <SStat
    variant="card"
    label="Revenue"
    :value="1234567"
    icon="credit-card"
    color="teal"
    :trend="12.4"
    trend-label="vs last month"
  />
  <SStat
    variant="card"
    size="lg"
    label="Active users"
    :value="8421"
    icon="users"
    color="primary"
  />
</template>
```

  </template>
</Demo>

A plain tile keeps its own layout inside a card, so several metrics can share one surface.

<Demo>
  <SCard style="width: 100%">
    <div style="display: flex; flex-wrap: wrap; gap: 32px">
      <SStat label="Revenue" :value="1234567" :trend="12.4" trend-label="vs last month" />
      <SStat label="Orders" :value="4821" :trend="-1.8" trend-label="vs last month" />
    </div>
  </SCard>

<template #code>

```vue
<template>
  <SCard>
    <div class="metrics">
      <SStat
        label="Revenue"
        :value="1234567"
        :trend="12.4"
        trend-label="vs last month"
      />
      <SStat
        label="Orders"
        :value="4821"
        :trend="-1.8"
        trend-label="vs last month"
      />
    </div>
  </SCard>
</template>
```

  </template>
</Demo>

## Loading

While the data is in flight, `loading` replaces the value and the label with skeletons, hides the
trend and the description, and marks the tile `aria-busy`.

<Demo>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; width: 100%">
    <SStat variant="card" loading label="Revenue" :value="0" icon="credit-card" />
    <SStat variant="card" loading size="lg" label="Active users" :value="0" icon="users" />
  </div>

<template #code>

```vue
<template>
  <SStat
    variant="card"
    :loading="pending"
    label="Revenue"
    :value="revenue"
    icon="credit-card"
  />
</template>
```

  </template>
</Demo>

## Slots

`value`, `label`, `icon`, `trend` and `description` replace the matching parts; `actions` puts a
control in the corner of the tile, next to the label.

<Demo>
  <SStat variant="card" style="width: 100%" label="Revenue" :value="1234567" :trend="12.4">
    <template #value>1.23 <span style="font-size: 0.5em">M</span></template>
    <template #actions>
      <SButton variant="ghost" size="sm">Report</SButton>
    </template>
    <template #description>
      Updated <SBadge variant="positive" size="sm">a minute ago</SBadge>
    </template>
  </SStat>

<template #code>

```vue
<template>
  <SStat
    variant="card"
    label="Revenue"
    :value="1234567"
    :trend="12.4"
  >
    <template #value> 1.23 <span class="unit">M</span> </template>
    <template #actions>
      <SButton
        variant="ghost"
        size="sm"
      >
        Report
      </SButton>
    </template>
    <template #description>
      Updated
      <SBadge
        variant="positive"
        size="sm"
      >
        a minute ago
      </SBadge>
    </template>
  </SStat>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SStat" />
