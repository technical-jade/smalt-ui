<script setup>
import { ref } from 'vue'
import { email, maxLength, minLength, required } from '@smalt-ui/core'

const signupEmail = ref('')
const signupPassword = ref('')
const signupAbout = ref('')
const signupSent = ref(false)

function onSignupReset() {
  signupEmail.value = ''
  signupPassword.value = ''
  signupAbout.value = ''
  signupSent.value = false
}

const mode = ref('blur')
const modeName = ref('')
const modeCode = ref('')
const modeSent = ref(false)

const stateName = ref('')
const stateEmail = ref('')
const stateValid = ref(null)
const stateSent = ref(false)

const methodsForm = ref()
const methodsCity = ref('')
const methodsResult = ref()

async function runValidate() {
  const { valid, errors } = await methodsForm.value.validate()
  methodsResult.value = valid ? 'valid' : `errors: ${errors.length}`
}

function runReset() {
  methodsForm.value.resetValidation()
  methodsResult.value = undefined
}
</script>

# Form

`SForm` renders a native `<form novalidate>` and collects the fields placed anywhere inside it.
On submit it checks every field, moves focus to the first invalid one and emits `submit` only
when the whole form is valid; otherwise it emits `invalid`. Without a `submit` listener a valid
form is submitted natively, so a classic form with `action` keeps working. The form also reports
its validity through `v-model` and its default slot.

The rules themselves live on the fields (`rules`, `validate-on`, `error`): see the
[Validation](/guide/validation) guide. `SForm` adds no styles of its own and no layout: arrange
the fields as you like.

## Sign-up form

Press **Create account** with empty fields: every required field shows its error, and focus moves to the
first one. **Reset** clears the values and the errors.

<Demo>
  <SForm
    style="display: grid; gap: 16px; width: 100%; max-width: 400px"
    @submit="signupSent = true"
    @reset="onSignupReset"
  >
    <SInput
      v-model="signupEmail"
      label="Email"
      autocomplete="email"
      name="email"
      required
      :rules="[required(), email()]"
    />
    <SInput
      v-model="signupPassword"
      label="Password"
      name="password"
      type="password"
      autocomplete="new-password"
      required
      :rules="[required(), minLength(8)]"
    />
    <STextarea
      v-model="signupAbout"
      label="About"
      name="about"
      hint="Up to 200 characters"
      :rules="[maxLength(200)]"
    />
    <div style="display: flex; align-items: center; gap: 8px">
      <SButton type="submit">Create account</SButton>
      <SButton type="reset" variant="ghost">Reset</SButton>
      <span v-if="signupSent">Sent</span>
    </div>
  </SForm>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { email, maxLength, minLength, required } from '@smalt-ui/core'

const address = ref('')
const password = ref('')
const about = ref('')
const sent = ref(false)

function onReset() {
  address.value = ''
  password.value = ''
  about.value = ''
  sent.value = false
}
</script>

<template>
  <SForm
    @submit="sent = true"
    @reset="onReset"
  >
    <SInput
      v-model="address"
      label="Email"
      name="email"
      autocomplete="email"
      required
      :rules="[required(), email()]"
    />
    <SInput
      v-model="password"
      label="Password"
      name="password"
      type="password"
      autocomplete="new-password"
      required
      :rules="[required(), minLength(8)]"
    />
    <STextarea
      v-model="about"
      label="About"
      name="about"
      hint="Up to 200 characters"
      :rules="[maxLength(200)]"
    />
    <SButton type="submit"> Create account </SButton>
    <SButton
      type="reset"
      variant="ghost"
    >
      Reset
    </SButton>
    <span v-if="sent">Sent</span>
  </SForm>
</template>
```

  </template>
</Demo>

`SButton` is `type="button"` by default, so the submit and reset buttons need `type="submit"` and
`type="reset"`. Pressing Enter in a text field of a form with a submit button submits it, as in
any native form.

## Validation modes

`validate-on` on the form sets when its fields check: `blur` (the default), `input` or `submit`.
A field's own `validate-on` wins over the form's. The modes are described in
[When fields check](/guide/validation#when-fields-check).

<Demo>
  <ClientOnly>
    <div style="display: grid; gap: 16px; width: 100%; max-width: 400px">
      <SToggleGroup
        v-model="mode"
        type="single"
        aria-label="validate-on"
        :options="[
          { value: 'blur', label: 'blur' },
          { value: 'input', label: 'input' },
          { value: 'submit', label: 'submit' },
        ]"
      />
      <SForm
        style="display: grid; gap: 16px"
        :validate-on="mode"
        @submit="modeSent = true"
      >
        <SInput
          v-model="modeName"
          label="Name"
          :rules="[required(), minLength(3)]"
        />
        <SInput
          v-model="modeCode"
          label="Invite code"
          :rules="[required(), minLength(6)]"
        />
        <div style="display: flex; align-items: center; gap: 12px">
          <SButton type="submit">Submit</SButton>
          <span v-if="modeSent">Sent</span>
        </div>
      </SForm>
    </div>
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { minLength, required, type SValidateOn } from '@smalt-ui/core'

const mode = ref<SValidateOn>('blur')
const name = ref('')
const code = ref('')
const sent = ref(false)
</script>

<template>
  <SToggleGroup
    v-model="mode"
    type="single"
    aria-label="validate-on"
    :options="[
      { value: 'blur', label: 'blur' },
      { value: 'input', label: 'input' },
      { value: 'submit', label: 'submit' },
    ]"
  />
  <SForm
    :validate-on="mode"
    @submit="sent = true"
  >
    <SInput
      v-model="name"
      label="Name"
      :rules="[required(), minLength(3)]"
    />
    <SInput
      v-model="code"
      label="Invite code"
      :rules="[required(), minLength(6)]"
    />
    <SButton type="submit"> Submit </SButton>
    <span v-if="sent">Sent</span>
  </SForm>
</template>
```

  </template>
</Demo>

The form's mode can also be set once for the app through [prop defaults](/guide/defaults):
`defaults: { SForm: { validateOn: 'input' } }`.

## Validity and state

`v-model` on the form reports its validity:

- `null` until the form is mounted (also during server rendering), and while some field with rules
  has not been checked yet or an async rule is still running;
- `true` when every field with rules has been checked and passed;
- `false` as soon as any field shows an error, a rule error or a manual `error`.

A field without rules counts as valid unless it has a manual `error`, so a form with no rules at
all is `true` right after mounting. The model is read-only for the app: a value you write into it
is replaced with the actual state at once.

The default slot receives the same state and more:

| Slot prop         | Meaning                                                           |
| ----------------- | ----------------------------------------------------------------- |
| `valid`           | the same value as `v-model`: `true`, `false` or `null`            |
| `validating`      | whether an async rule is running in some field                    |
| `errors`          | the fields that show an error now, in page order (`SFormError[]`) |
| `validate`        | checks every field, see [Methods](#methods)                       |
| `resetValidation` | clears the errors of every field                                  |

`SFormError` is `{ id, name, messages }`: an internal field id, the field's `name` (when set) and
its error texts (one text per field).

Below, the button stays disabled while the form is known to be invalid, and the errors are listed
above the fields:

<Demo>
  <SForm
    v-slot="{ errors }"
    v-model="stateValid"
    style="display: grid; gap: 16px; width: 100%; max-width: 400px"
    @submit="stateSent = true"
  >
    <ul v-if="errors.length" style="margin: 0; padding-left: 20px; list-style: disc; color: var(--s-color-negative-text)">
      <li v-for="error in errors" :key="error.id">{{ error.name }}: {{ error.messages[0] }}</li>
    </ul>
    <SInput
      v-model="stateName"
      label="Name"
      name="name"
      :rules="[required()]"
    />
    <SInput
      v-model="stateEmail"
      label="Email"
      name="email"
      :rules="[required(), email()]"
    />
    <div style="display: flex; align-items: center; gap: 12px">
      <SButton type="submit" :disabled="stateValid === false">Send</SButton>
      <code>v-model: {{ String(stateValid) }}</code>
      <span v-if="stateSent">Sent</span>
    </div>
  </SForm>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { email, required } from '@smalt-ui/core'

const name = ref('')
const address = ref('')
const valid = ref<boolean | null>(null)
const sent = ref(false)
</script>

<template>
  <SForm
    v-slot="{ errors }"
    v-model="valid"
    @submit="sent = true"
  >
    <ul v-if="errors.length">
      <li
        v-for="error in errors"
        :key="error.id"
      >
        {{ error.name }}: {{ error.messages[0] }}
      </li>
    </ul>
    <SInput
      v-model="name"
      label="Name"
      name="name"
      :rules="[required()]"
    />
    <SInput
      v-model="address"
      label="Email"
      name="email"
      :rules="[required(), email()]"
    />
    <SButton
      type="submit"
      :disabled="valid === false"
    >
      Send
    </SButton>
    <span v-if="sent">Sent</span>
  </SForm>
</template>
```

  </template>
</Demo>

Disable the button on `valid === false`, not on `!valid`: `null` means "not checked yet", and a
button disabled from the start would never let the user submit and see the errors.

## Methods

Through a template ref the form provides two methods (they are not listed in the API table
below, which shows props, events and slots):

- `validate()`: checks every field at once, in parallel, and resolves to `{ valid, errors }`,
  where `errors` lists the failed fields in page order. It shows the errors like a submission,
  but does not move focus and does not emit `submit` or `invalid`;
- `resetValidation()`: clears the errors of every field and cancels a pending submission; the
  values stay as they are.

The same functions are also passed to the default slot.

<Demo>
  <SForm
    ref="methodsForm"
    style="display: grid; gap: 16px; width: 100%; max-width: 400px"
    @submit="runValidate"
    @invalid="runValidate"
  >
    <SInput
      v-model="methodsCity"
      label="City"
      :rules="[required()]"
    />
    <div style="display: flex; align-items: center; gap: 8px">
      <SButton variant="outline" @click="runValidate">validate()</SButton>
      <SButton variant="ghost" @click="runReset">resetValidation()</SButton>
      <code v-if="methodsResult" style="white-space: nowrap">{{ methodsResult }}</code>
    </div>
  </SForm>

<template #code>

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { required } from '@smalt-ui/core'

const city = ref('')
const result = ref<string>()
const form = useTemplateRef('form')

async function check() {
  const { valid, errors } = await form.value!.validate()
  result.value = valid ? 'valid' : `errors: ${errors.length}`
}

function clear() {
  form.value!.resetValidation()
  result.value = undefined
}
</script>

<template>
  <SForm
    ref="form"
    @submit="check"
    @invalid="check"
  >
    <SInput
      v-model="city"
      label="City"
      :rules="[required()]"
    />
    <SButton
      variant="outline"
      @click="check"
    >
      validate()
    </SButton>
    <SButton
      variant="ghost"
      @click="clear"
    >
      resetValidation()
    </SButton>
    <code v-if="result">{{ result }}</code>
  </SForm>
</template>
```

  </template>
</Demo>

## Submission

On submit the form calls `preventDefault()` on the native event and checks every field. Then:

- **the form is invalid:** it emits `invalid` with the failed fields (`SFormError[]`, in page
  order) and moves focus to the first invalid field in page order, not in the order the fields
  were added. `no-error-focus` keeps focus where it is;
- **the form is valid and has a `submit` listener:** it emits `submit` with the original
  `SubmitEvent`. Sending the data is up to the app;
- **the form is valid and has no `submit` listener:** the browser submits it natively.

A new submission while an async rule of the previous one is still running replaces it: only the
latest submission emits `submit` or `invalid`. A reset (or `resetValidation()`) during a pending
submission cancels it, so neither event is emitted.

### Native submission

Without a `submit` listener, a valid form is submitted with `form.requestSubmit(submitter)` one
task after the check, where `submitter` is the button that was pressed. So the native
submission keeps what a plain `form.submit()` would drop: the `name` and `value` of the pressed
button, and its `formaction`, `formmethod`, `formenctype` and `formtarget`:

```vue
<script setup lang="ts">
import { required } from '@smalt-ui/core'
</script>

<template>
  <SForm
    action="/search"
    method="get"
  >
    <SInput
      name="q"
      label="Search"
      :rules="[required()]"
    />
    <SButton
      type="submit"
      name="scope"
      value="all"
    >
      Search everywhere
    </SButton>
  </SForm>
</template>
```

Attributes such as `action` and `method` go to the native `<form>`. One limit: a browser opens a
new window (`formtarget="_blank"`, `target="_blank"`) only shortly after a user action. If an
async rule makes the check take longer than about five seconds, the browser may block that
window.

## Reset

A reset button (or `form.reset()`) does not reset the fields natively. The form calls
`preventDefault()`, emits `reset` and clears the errors of every field on the next tick. The
fields are bound with `v-model`, so the app resets its own data in the `reset` handler, as in the
[sign-up form](#sign-up-form) above; the errors are cleared after that, so the emptied fields do
not show errors.

Because the native reset is prevented, inputs the app does not control are not reset either: a
plain `<input>` without `v-model`, or an `<input type="file">`, keeps its value. Reset them in the
`reset` handler too.

## Which fields take part

A field registers in the nearest `SForm` when it mounts and leaves it when it unmounts, so fields
under `v-if` join and leave the form as they appear. A `disabled` field leaves the form: it is
not checked, does not block the submission and does not get focus. Server rendering registers
nothing.

Fields of the library register by themselves. A control of your own takes part through the
`useValidation` composable, see [Custom fields](/guide/validation#custom-fields).

## Server errors

An error known only after the data is sent is passed to the field in its `error` prop: the field
shows it, and the form is invalid while it is set. See
[Server errors](/guide/validation#server-errors).

## API

<ApiTable name="SForm" />
