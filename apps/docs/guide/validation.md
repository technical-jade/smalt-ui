<script setup>
import { ref, useTemplateRef } from 'vue'
import { minLength, required } from '@smalt-ui/core'
import ColorCodeField from '../.vitepress/theme/demos/ValidationCustomField.vue'

const blurColor = ref('')
const inputColor = ref('')
const serverError = ref()
const result = ref()
const blurField = useTemplateRef('blurField')
const inputField = useTemplateRef('inputField')

const rules = [required(), minLength(3)]
const isFree = (v) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(v.toLowerCase() !== 'ffffff' || 'This color is taken'), 800)
  })
const inputRules = [required(), minLength(3), isFree]

async function check() {
  const [blur, input] = await Promise.all([blurField.value.validate(), inputField.value.validate()])
  result.value = `blur field: ${blur}, input field: ${input}`
}

function reset() {
  blurField.value.resetValidation()
  inputField.value.resetValidation()
  result.value = undefined
}
</script>

# Validation

Form fields check their own value with **rules**: plain functions that return `true` or an error
text. The error is shown through `SFormField`, the wrapper every field is built on: the text
replaces the hint under the field, the control gets `aria-invalid`, and screen readers announce
the message. A whole form is checked on submit by the `SForm` component.

No validation library is required. Built-in rule factories cover the common cases, and schemas
from Zod, Valibot and other [Standard Schema](https://standardschema.dev) libraries plug in as a
rule.

## Rules

A rule is a function of the field value. It returns `true` when the value is valid, or the text
of the error otherwise. It may also return a Promise of either (see [Async rules](#async-rules)).

```ts
type SRule<T> = (value: T, ctx: SRuleContext) => true | string | PromiseLike<true | string>
```

Pass the rules to the field in the `rules` prop:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const rules = [
  (v: string) => !!v || 'Enter your name',
  (v: string) => v.length <= 20 || 'Use 20 characters or fewer',
]
</script>

<template>
  <SInput
    v-model="name"
    label="Name"
    :rules="rules"
  />
</template>
```

How the rules run:

- **In order, up to the first failure.** The first rule that returns a string gives the error;
  the rules after it do not run. So put cheap checks first and a slow server check last.
- **One error at a time.** The field shows a single message, the one from the first failed rule.
- **`false` is not a result.** An error always has a text, otherwise the field would have nothing
  to show and nothing to announce. The type accepts only `true` or a string. If a rule still
  returns something else at runtime (`false`, an empty string), the field shows the
  `ruleFailed` text, "The value could not be checked".
- **A rule that throws** (or whose Promise rejects) fails with the same `ruleFailed` text, and a
  warning with the error goes to the console in development.

The second argument, `ctx`, carries `messages`: the library strings of the current locale. Your
own rules can ignore it; the built-in factories take their default texts from it.

`rules` does not mark the field as required. The `*` next to the label and the native `required`
attribute still come from the field's own `required` prop, so set both:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { required } from '@smalt-ui/core'

const name = ref('')
</script>

<template>
  <SInput
    v-model="name"
    label="Name"
    required
    :rules="[required()]"
  />
</template>
```

## Built-in rules

Factories for the common checks are exported from `@smalt-ui/core`. Each factory except
`schemaRule` takes an optional text of its own as the last argument; without it the text comes from the library dictionary
([`SMessages`](#localization)).

| Factory                    | Passes when                                        | Empty value           | Default text (key)                                                                                            |
| -------------------------- | -------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `required(message?)`       | the value is not empty (see below)                 | fails                 | This field is required (`ruleRequired`)                                                                       |
| `minLength(min, message?)` | a text or a list has at least `min` items          | passes                | text: Enter at least {min} characters (`ruleMinLength`); list: Select at least {min} (`ruleMinItems`)         |
| `maxLength(max, message?)` | a text or a list has at most `max` items           | passes                | text: Enter no more than {max} characters (`ruleMaxLength`); list: Select no more than {max} (`ruleMaxItems`) |
| `min(limit, message?)`     | a number or a numeric string is at least `limit`   | passes                | Must be at least {min} (`ruleMin`)                                                                            |
| `max(limit, message?)`     | a number or a numeric string is at most `limit`    | passes                | Must be no more than {max} (`ruleMax`)                                                                        |
| `pattern(re, message?)`    | a text matches the regular expression `re`         | passes                | Invalid format (`rulePattern`)                                                                                |
| `email(message?)`          | a text looks like an email address                 | passes                | Enter a valid email address (`ruleEmail`)                                                                     |
| `schemaRule(schema)`       | a [schema](#schemas-zod-valibot) accepts the value | checked by the schema | the schema's first issue                                                                                      |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { email, maxLength, minLength, required } from '@smalt-ui/core'

const login = ref('')
const address = ref('')
</script>

<template>
  <SInput
    v-model="login"
    label="Login"
    required
    :rules="[required(), minLength(3), maxLength(20)]"
  />
  <SInput
    v-model="address"
    label="Email"
    :rules="[email()]"
  />
</template>
```

### Empty values

Only `required()` decides whether a field may stay empty. The other factories let an empty value
pass, so an optional field is not forced to be filled: the email field above accepts an empty
value but not `abc`.

A value is empty when it is:

- `undefined` or `null`;
- a string that is empty after trimming the spaces (`''`, `'   '`);
- an empty array (no tags, nothing selected in a multiple select);
- `false` (an unchecked checkbox or switch);
- a date range whose `start` and `end` are both missing.

The check is exported as `isEmptyValue(value)` for your own rules.

`0` is a value, not an empty one. This matters for `SRating`, whose value is `0` until the user
picks a rating: `required()` always passes on it, so ask for a rating with `min(1)`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { min } from '@smalt-ui/core'

const score = ref(0)
</script>

<template>
  <SRating
    v-model="score"
    aria-label="Your rating"
    :rules="[min(1, 'Please rate')]"
  />
</template>
```

The factories check a single kind of value: `minLength`/`maxLength` a string or an array (the
`length`), `min`/`max` a single number or numeric string (any other value, such as the array of a
range `SSlider`, passes them), `pattern`/`email` a string. What each field passes is listed in
[Value types](#value-types).

`min` and `max` also accept a string, the value of `SInput` with `numeric` (`'1234.5'`): the string
is converted with `Number()` and compared. A blank string passes, as any empty value does. A
string that is not a number (an unfinished `'-'`) passes too: telling a malformed number apart is
left to `pattern()` or rules of your own, so the field does not report "Must be at least 18" for
something that is not a number yet.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { min, required } from '@smalt-ui/core'

const age = ref('')
</script>

<template>
  <SInput
    v-model="age"
    label="Age"
    :numeric="{ unsigned: true }"
    :rules="[required(), min(18, 'You must be 18 or older')]"
  />
</template>
```

### Custom texts and placeholders

A text passed to a factory replaces the default one. The limit is filled in the same way as in
the default texts: `{min}` in the text of `minLength` and `min`, `{max}` in the text of
`maxLength` and `max`:

```ts
minLength(8, 'The password needs {min} characters or more')
max(10, 'No more than {max} guests')
```

`minLength` and `maxLength` pick the default text by the value: "characters" for a string,
"Select at least" for an array (tags, a multiple select). A custom text is used for both.

`pattern` works with any regular expression, including ones with the `g` or `y` flag: the
search position is reset before each check. `email` is deliberately loose (some text, `@`, a
domain with a dot, no spaces): a strict check rejects valid addresses, and only the server can
confirm an address anyway.

## When fields check

The `validate-on` prop of a field sets when it checks its rules:

| `validate-on`    | The field checks                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `blur` (default) | when focus leaves the field; while a rule error is shown, also on every change of the value                   |
| `input`          | on every change of the value, and when focus leaves the field                                                 |
| `submit`         | only when the form is submitted or `validate()` is called; then, while a rule error is shown, on every change |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { pattern } from '@smalt-ui/core'

const code = ref('')
</script>

<template>
  <SInput
    v-model="code"
    label="Promo code"
    validate-on="input"
    :rules="[pattern(/^[A-Z0-9]{6}$/, 'Six capital letters or digits')]"
  />
</template>
```

With the default `blur` a field goes through these steps:

1. While the user has not left the field, it is silent: typing does not show errors, and nothing
   is checked when the page opens.
2. When focus leaves the field, the rules run. This also happens when the user only tabbed
   through an empty field, so a `required()` field reports the missing value right away.
3. While the rule error is shown, every change of the value runs the rules again, so the error
   goes away as soon as the value is fixed. A manual [`error`](#server-errors) does not start
   these rechecks.
4. Once the value passes, the field is silent again until the next blur.

Leaving a field for its own popup (the list of `SSelect`, the calendar of `SDatePicker`) does not
count as a blur: the field checks when focus leaves the field together with its popup.

`input` checks on every change of the value, but not on mount: an empty required field does not
show an error before the user touches it. `submit` stays silent until the form is submitted or
`validate()` is called; after that a shown rule error is rechecked on every change, the same as in
`blur` mode, so the user sees it go away while fixing it.

The mode can be set in several places. From strongest to weakest:

1. `validate-on` passed to the field itself;
2. `validate-on` of the enclosing `SForm` (passed to it or set in its [prop defaults](/guide/defaults));
3. the prop defaults of the field (`SInput: { validateOn: 'input' }`, or `global`);
4. `blur`.

To switch every field of the app to checking while typing, set a global default:

```ts
app.use(createSUI({ defaults: { global: { validateOn: 'input' } } }))
```

`global` reaches `SForm` as well as the single fields, so the setting works the same inside a form
and outside one.

Changing the `rules` array does not check the field by itself: the new rules apply at the next
check (blur, change, submit or `validate()`). An inline array (`:rules="[required()]"`) is a new
array on every render of the parent, so rechecking on every new array would check the field on
every render. To apply new rules at once, call `validate()` on the field (see
[Checking from code](#checking-from-code)).

### Checking from code

Rules work without a form. Through a template ref each field provides:

- `validate()`: runs the rules now and resolves to `true` when the value is valid. It shows the
  error, if any, whatever the `validate-on` mode;
- `resetValidation()`: clears the rule error; the field then waits for its next trigger, as if it
  had never been checked. The value and a manual [`error`](#server-errors) are not changed;
- `focus()`: moves focus to the control.

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { required } from '@smalt-ui/core'

const city = ref('')
const step = ref(1)
const field = useTemplateRef('field')

async function next() {
  if (await field.value?.validate()) step.value++
  else field.value?.focus()
}
</script>

<template>
  <SInput
    ref="field"
    v-model="city"
    label="City"
    :rules="[required()]"
  />
  <SButton @click="next"> Next </SButton>
</template>
```

`validate()` always resolves with the outcome of the latest check: if another check starts
while it is still waiting for an async rule, it resolves with the result of that newer check.
If `resetValidation()` interrupts it, it resolves `false`.

### Disabled fields

A `disabled` field is not checked: `validate()` resolves `true`, changes and blur do not run the
rules, and a rule error is cleared the moment the field becomes disabled. A manual
[`error`](#server-errors) is still displayed on a disabled field, but it does not make its
`validate()` fail. In a form, a disabled field does not take part in the check at all.

## Async rules

A rule may return a Promise, for example to ask the server whether a login is free:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { required, type SRule } from '@smalt-ui/core'
import { api } from './api'

const login = ref('')

const isFree: SRule<string> = async (v) => !(await api.isTaken(v)) || 'This login is taken'
</script>

<template>
  <SInput
    v-model="login"
    label="Login"
    :rules="[required(), isFree]"
  />
</template>
```

- The field waits for the Promise before it runs the next rule, so a failed `required()` above
  means no request is sent for an empty value.
- **Only the latest check counts.** If the value changes while a request is in flight, the old
  answer is thrown away when it arrives, so a slow response can never overwrite a newer result.
- **`validating`** is `true` while an awaited rule runs. Synchronous rules settle in the same
  tick and never set it. Library fields do not show a spinner by themselves; the state is
  available to [custom fields](#custom-fields) through `useValidation`, and a form reports it
  for all its fields.
- A rejected Promise shows the `ruleFailed` text, as a thrown error does.

The field does not debounce the rules. In `blur` mode that rarely matters (one check per blur),
but with `validate-on="input"`, or while an error is shown, every keystroke runs the rules again.
Debounce the request inside the rule, or cache answers per value, when the check is expensive.
This version of `isFree` replaces the one in the example above:

```ts
const cache = new Map<string, Promise<boolean>>()

const isFree: SRule<string> = async (v) => {
  if (!cache.has(v)) cache.set(v, api.isTaken(v))
  return !(await cache.get(v)) || 'This login is taken'
}
```

## Server errors

Some errors are known only after the form is sent: "this email is already registered". Pass them
to the field in the `error` prop. A manual `error`:

- **wins over the rules:** the field shows it instead of a rule error;
- **makes the field invalid:** `validate()` resolves `false` while it is set, even if every rule
  passes, and a form with such a field is not valid;
- **stays until you clear it:** the field does not clear it on its own. The usual place to clear
  it is the change of the value.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { email, required } from '@smalt-ui/core'
import { api } from './api'

const address = ref('')
const serverError = ref<string>()

async function save() {
  const response = await api.register(address.value)
  if (response.errors?.email) serverError.value = response.errors.email
}
</script>

<template>
  <SInput
    v-model="address"
    label="Email"
    :rules="[required(), email()]"
    :error="serverError"
    @update:model-value="serverError = undefined"
  />
  <SButton @click="save"> Register </SButton>
</template>
```

When `error` is cleared, the field shows the error of its rules again, if there is one. The
`invalid` prop still only paints the field red: it adds no text and does not fail the check.

## Schemas: Zod, Valibot

`schemaRule(schema)` turns a schema into a rule. It works with any library that implements
[Standard Schema](https://standardschema.dev): Zod 3.24 and later, Valibot 1, ArkType, Effect
Schema. Smalt UI does not depend on any of them: install the one you use.

The message of the schema's first issue becomes the error text:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { schemaRule } from '@smalt-ui/core'
import { z } from 'zod'

const login = ref('')

const loginSchema = z
  .string()
  .min(3, 'At least 3 characters')
  .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, digits and _')
</script>

<template>
  <SInput
    v-model="login"
    label="Login"
    :rules="[schemaRule(loginSchema)]"
  />
</template>
```

The same with Valibot:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { schemaRule } from '@smalt-ui/core'
import * as v from 'valibot'

const address = ref('')

const emailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Enter your email'),
  v.email('Enter a valid email address'),
)
</script>

<template>
  <SInput
    v-model="address"
    label="Email"
    :rules="[schemaRule(emailSchema)]"
  />
</template>
```

An async schema (Zod `refine` with an async function, Valibot `pipeAsync`) makes the rule async,
and the field awaits it as any [async rule](#async-rules):

```ts
const loginSchema = z
  .string()
  .min(3, 'At least 3 characters')
  .refine(async (v) => !(await api.isTaken(v)), 'This login is taken')
```

`schemaRule` goes into the same array as other rules, and a field can have several schema rules;
they run in order like any rules.

Two things to keep in mind:

- **The schema sees the value as the field holds it.** The rule receives the raw model, not a
  converted one: `SInput` passes a string even in `numeric` mode, `SNumberField` passes `null`
  when empty, date fields pass `DateValue` objects. Write the schema for that type. See
  [Value types](#value-types). For a numeric `SInput`, keep in mind that `z.coerce.number()`
  turns `''` into `0`. With a bound, a cleared optional field gets the bound's error ("At least
  1") instead of passing. Without a bound, the schema accepts an empty field as `0`, so it cannot
  express "required". Keep the empty string out of the conversion instead:

  ```ts
  const quantity = z.union([z.literal(''), z.coerce.number().min(1, 'At least 1')])
  ```

- **Empty values reach the schema.** Unlike the factories, `schemaRule` does not let an empty
  value pass: `z.email()` fails on `''`. For an optional field allow the empty value in the
  schema: `z.union([z.literal(''), z.email()])`. For a required field put `required()` first,
  `[required(), schemaRule(z.email())]`: it reports the empty value with its own text, and the
  rules stop there, so the schema checks only the format.
- **An issue without a message** falls back to the `ruleFailed` text, as a rule that returns no
  text does.

A schema rule sees one field's value only. Checks across fields ("the passwords match") need a
validation library that owns the whole form.

## Custom fields

The `useValidation` composable gives your own control the same behavior as the library fields:
rules, `validate-on`, a manual `error`, async checks and, inside `SForm`, taking part in the form.
Library fields use it internally.

The usual way is to wrap the control in `SFormField` and pass it the error from `useValidation`:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SFormField, useValidation, type SRule, type SValidateOn } from '@smalt-ui/core'

const props = defineProps<{
  label?: string
  name?: string
  rules?: SRule<string>[]
  validateOn?: SValidateOn
  error?: string
  disabled?: boolean
}>()

const model = defineModel<string>({ default: '' })
const input = useTemplateRef<HTMLInputElement>('input')

const { errorMessage, invalid, validating, onBlur, validate, resetValidation } = useValidation({
  value: model,
  rules: () => props.rules,
  validateOn: () => props.validateOn,
  error: () => props.error,
  disabled: () => props.disabled,
  name: () => props.name,
  focus: () => input.value?.focus(),
  el: () => input.value,
})

defineExpose({ validate, resetValidation, errorMessage, invalid, validating })
</script>

<template>
  <SFormField
    v-slot="{ id, describedBy, invalid: marked }"
    :label="label"
    :error="errorMessage"
  >
    <div
      class="color-code"
      :class="{ 'color-code--invalid': marked }"
      @focusout="onBlur"
    >
      <span>#</span>
      <input
        :id="id"
        ref="input"
        v-model="model"
        :name="name"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-invalid="marked || undefined"
      />
    </div>
  </SFormField>
</template>

<style scoped>
.color-code {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 2.5rem;
  padding: 0 12px;
  border: 1px solid var(--s-color-outline);
  border-radius: var(--s-radius-sm);
  background: var(--s-color-surface);
  color: var(--s-color-text);
}
.color-code:focus-within {
  border-color: var(--s-color-primary);
}
.color-code--invalid {
  border-color: var(--s-color-negative);
}
.color-code input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
```

Call `onBlur` when focus leaves the whole control. For a control made of several focusable
parts, skip the moves between them: check `event.relatedTarget` against the control's root before
calling `onBlur`, otherwise the field would check each time focus moves inside it.

The control also exposes `errorMessage`, `invalid` and `validating`, so the demo below can print
its state. Saved as `ColorCodeField.vue`, it is used like a library field. The first field checks
on blur; the second checks on every change and has an async rule that takes 0.8 s and rejects
`ffffff`. The buttons set a server error on the first field, call `validate()` on both and print
what it resolves to, and call `resetValidation()`.

<Demo>
  <div style="display: grid; gap: 16px; width: 100%">
    <ColorCodeField
      ref="blurField"
      v-model="blurColor"
      label="Color, validate-on blur"
      :rules="rules"
      :error="serverError"
    />
    <ColorCodeField
      ref="inputField"
      v-model="inputColor"
      label="Color, validate-on input"
      validate-on="input"
      :rules="inputRules"
    />
    <div style="display: flex; flex-wrap: wrap; gap: 8px">
      <SButton size="sm" variant="outline" @click="serverError = 'This color is already used'">Set a server error</SButton>
      <SButton size="sm" variant="outline" @click="serverError = undefined">Clear</SButton>
      <SButton size="sm" @click="check">Validate</SButton>
      <SButton size="sm" variant="ghost" @click="reset">Reset</SButton>
    </div>
    <div style="display: grid; gap: 4px; font-size: 13px">
      <span>blur: <code>errorMessage: {{ blurField?.errorMessage ?? 'undefined' }}</code> <code>invalid: {{ blurField?.invalid ?? false }}</code> <code>validating: {{ blurField?.validating ?? false }}</code></span>
      <span>input: <code>errorMessage: {{ inputField?.errorMessage ?? 'undefined' }}</code> <code>invalid: {{ inputField?.invalid ?? false }}</code> <code>validating: {{ inputField?.validating ?? false }}</code></span>
      <span>validate(): <code>{{ result ?? 'not called' }}</code></span>
    </div>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { minLength, required, type SRule } from '@smalt-ui/core'
import ColorCodeField from './ColorCodeField.vue'

const blurColor = ref('')
const inputColor = ref('')
const serverError = ref<string>()
const result = ref<string>()
const blurField = useTemplateRef('blurField')
const inputField = useTemplateRef('inputField')

const rules = [required(), minLength(3)]
const isFree: SRule<string> = (v) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(v.toLowerCase() !== 'ffffff' || 'This color is taken'), 800)
  })
const inputRules = [required(), minLength(3), isFree]

async function check() {
  const [blur, input] = await Promise.all([
    blurField.value!.validate(),
    inputField.value!.validate(),
  ])
  result.value = `blur field: ${blur}, input field: ${input}`
}

function reset() {
  blurField.value!.resetValidation()
  inputField.value!.resetValidation()
  result.value = undefined
}
</script>

<template>
  <ColorCodeField
    ref="blurField"
    v-model="blurColor"
    label="Color, validate-on blur"
    :rules="rules"
    :error="serverError"
  />
  <ColorCodeField
    ref="inputField"
    v-model="inputColor"
    label="Color, validate-on input"
    validate-on="input"
    :rules="inputRules"
  />
  <SButton
    size="sm"
    variant="outline"
    @click="serverError = 'This color is already used'"
  >
    Set a server error
  </SButton>
  <SButton
    size="sm"
    variant="outline"
    @click="serverError = undefined"
  >
    Clear
  </SButton>
  <SButton
    size="sm"
    @click="check"
  >
    Validate
  </SButton>
  <SButton
    size="sm"
    variant="ghost"
    @click="reset"
  >
    Reset
  </SButton>
  <p>
    <code>errorMessage: {{ blurField?.errorMessage }}</code>
    <code>invalid: {{ blurField?.invalid }}</code>
    <code>validating: {{ blurField?.validating }}</code>
  </p>
  <p>
    <code>errorMessage: {{ inputField?.errorMessage }}</code>
    <code>invalid: {{ inputField?.invalid }}</code>
    <code>validating: {{ inputField?.validating }}</code>
  </p>
  <p>validate(): {{ result }}</p>
</template>
```

  </template>
</Demo>

### Options

Every option except `value` is optional. Options that can change take a ref or a getter.

| Option       | Type                                         | Purpose                                                                             |
| ------------ | -------------------------------------------- | ----------------------------------------------------------------------------------- |
| `value`      | `MaybeRefOrGetter<T>`                        | The value the rules check. Changes are watched deeply, so a mutated array counts.   |
| `rules`      | `MaybeRefOrGetter<SRule<T>[] \| undefined>`  | Rules, run in order until the first failure.                                        |
| `validateOn` | `MaybeRefOrGetter<SValidateOn \| undefined>` | When to check; without it the `SForm` setting applies, then `blur`.                 |
| `error`      | `MaybeRefOrGetter<string \| undefined>`      | A manual error (a server response); it wins over the rules.                         |
| `disabled`   | `MaybeRefOrGetter<boolean \| undefined>`     | A disabled control is not checked and leaves the form.                              |
| `name`       | `MaybeRefOrGetter<string \| undefined>`      | Field name, reported with the errors of `SForm`.                                    |
| `focus`      | `() => void`                                 | Moves focus to the control; `SForm` calls it for the first invalid field on submit. |
| `el`         | `() => Element \| null \| undefined`         | Root element of the control; `SForm` orders its fields by their place in the page.  |

Pass `validateOn` only when it is set on the control itself, as in the example above (the prop
has no default), and leave it `undefined` otherwise: `useValidation` then falls back to the
setting of the enclosing `SForm`, then to `blur`. A value resolved from prop defaults would
override the form's `validate-on`.

### Return value

| Property            | Type                               | Meaning                                                                       |
| ------------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| `errorMessage`      | `ComputedRef<string \| undefined>` | The error to show: the manual `error`, otherwise the text of the failed rule. |
| `invalid`           | `ComputedRef<boolean>`             | Whether an error is shown.                                                    |
| `validating`        | `Readonly<Ref<boolean>>`           | Whether an async rule is running.                                             |
| `validate()`        | `() => Promise<boolean>`           | Runs the rules now; resolves `true` when the value is valid.                  |
| `resetValidation()` | `() => void`                       | Clears the rule error; the control waits for its next trigger.                |
| `onBlur()`          | `() => void`                       | Call when focus leaves the control; checks unless the mode is `submit`.       |

`validate()`, `resetValidation()`, disabled fields and stale async results behave exactly as
described for the library fields above. Outside `SForm` the composable works on its own; inside
one, the control registers when it mounts and leaves the form when it unmounts or becomes
disabled.

## Value types

A rule receives the field's `v-model` value as is. Write custom rules and schemas for this type:

| Field              | Value                                                                                                              | Empty for `required()` |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| `SInput`           | `string`; `string[]` with `use-tags`; with `numeric`, a number as a string (`'1234.5'`), which `min`/`max` convert | `''`, `[]`             |
| `STextarea`        | `string`                                                                                                           | `''`                   |
| `SSelect`          | `string`; `string[]` with `multiple` or `use-tags`                                                                 | nothing chosen, `[]`   |
| `SAutocomplete`    | `string`: the `value` of the chosen suggestion, not the typed query                                                | nothing chosen         |
| `SNumberField`     | `number \| null`                                                                                                   | `null`                 |
| `SPinInput`        | `string[]`, one character per cell                                                                                 | `[]`                   |
| `SSlider`          | `number`; `number[]` for a range (not checked by `min`/`max`)                                                      | never                  |
| `SColorField`      | `string` in hex (`'#3B82F6'`)                                                                                      | `''`                   |
| `SDateField`       | `DateValue`                                                                                                        | no date                |
| `STimeField`       | `STimeValue` (`Time`, `CalendarDateTime` or `ZonedDateTime`)                                                       | no time                |
| `SDatePicker`      | `DateValue`                                                                                                        | no date                |
| `SDateRangePicker` | `SDateRange`: `{ start, end }`                                                                                     | both ends missing      |
| `SCheckbox`        | `boolean \| 'indeterminate'`                                                                                       | `false`                |
| `SRadioGroup`      | `string`                                                                                                           | nothing chosen         |
| `SSwitch`          | `boolean`                                                                                                          | `false`                |
| `SRating`          | `number`, `0` without a rating                                                                                     | never: use `min(1)`    |

Fields whose model has no default of its own (every field above except `SNumberField`,
`SPinInput`, `SCheckbox`, `SSwitch`, `SRating` and `SSlider`) pass `undefined` while their
`v-model` holds nothing. Rules typed for a string should allow that: `(v?: string) => …`. The
built-in factories handle `undefined` already.

Some consequences worth knowing:

- **Numeric `SInput`** holds a string with a dot as the decimal separator and no group
  separators (`'1234.5'`). `min`/`max` convert it themselves (see
  [Empty values](#empty-values)); in rules of your own and in schemas convert it with `Number()`
  or `z.coerce.number()`.
- **`SPinInput`**: `required()` only checks that the array is not empty. To require every cell,
  check the joined length: `(v: string[]) => v.join('').length === 6 || 'Enter all 6 digits'`.
- **`SCheckbox`**: `'indeterminate'` is not empty, so `required()` passes on it. Check
  `v === true` to require a checked box in a tri-state checkbox.
- **`min`/`max` check a single value**: a single-thumb `SSlider`, `SNumberField`, `SRating` and a
  numeric `SInput`. Any other value passes them, so a range `SSlider` (`number[]`) needs a rule of
  its own:
  `(v: number | number[]) => !Array.isArray(v) || v[1] - v[0] >= 10 || 'Pick a range of at least 10'`.

## Localization

The default texts of the built-in rules are keys of the library dictionary `SMessages`, like
every other library string:

| Key             | Default (`en`)                      |
| --------------- | ----------------------------------- |
| `ruleRequired`  | This field is required              |
| `ruleMinLength` | Enter at least {min} characters     |
| `ruleMaxLength` | Enter no more than {max} characters |
| `ruleMinItems`  | Select at least {min}               |
| `ruleMaxItems`  | Select no more than {max}           |
| `ruleMin`       | Must be at least {min}              |
| `ruleMax`       | Must be no more than {max}          |
| `rulePattern`   | Invalid format                      |
| `ruleEmail`     | Enter a valid email address         |
| `ruleFailed`    | The value could not be checked      |

Translate them through `ConfigProvider` (or `installLocale`, or the `messages` option of the Nuxt
module), as described in [Internationalization](/guide/i18n):

```vue
<script setup lang="ts">
import { ConfigProvider, type SMessages } from '@smalt-ui/core'

const deMessages: Partial<SMessages> = {
  ruleRequired: 'Pflichtfeld',
  ruleMinLength: 'Mindestens {min} Zeichen',
  ruleEmail: 'Ungültige E-Mail-Adresse',
}
</script>

<template>
  <ConfigProvider :messages="deMessages">
    <App />
  </ConfigProvider>
</template>
```

The text is taken from the dictionary when the check runs, not when the rule is created, so
`required()` in a module-level array follows the current locale. An error already on screen keeps
its text until the field checks again.

A text you pass to a factory (`required('Enter your name')`) is used as is and is not translated;
translate it with your app's i18n before passing it.

## Accessibility

Fields show rule errors through `SFormField`, so a rule error gets the same wiring as a manual
`error`:

- the control gets `aria-invalid="true"`;
- the error text replaces the hint under the field and is linked to the control through
  `aria-describedby`, so a screen reader reads it together with the field;
- the text is rendered into a live region (`aria-live="polite"`), so a new error is announced
  without moving focus;
- on submit, `SForm` moves focus to the first invalid field in page order, so a keyboard or
  screen reader user lands on the problem.

The live region stays in the page while the field has no error: a region is announced only if it
exists before its content appears.
