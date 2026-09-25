---
'@smalt-ui/core': minor
---

`SAutocomplete`:

- new `free-text` prop for free text input: `v-model` holds the input text, picking a suggestion
  puts its `label` into the input and passes the option to `select`; neither closing the panel nor
  leaving the field changes the text, the clear button makes it an empty string, and the panel
  stays closed without suggestions and opens when they arrive;
- `focus` and `blur` are now component events: `blur` fires when focus leaves the component by any
  path, including Tab from the clear button.
