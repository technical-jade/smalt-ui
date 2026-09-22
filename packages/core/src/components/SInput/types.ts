import type { SValidationProps } from '../../composables/useValidation'

export type SInputSize = 'sm' | 'md' | 'lg'

/**
 * Options of the `SInput` numeric mode. Input is filtered by a Maska mask: letters and a second
 * decimal point never appear in the field, rather than being removed after typing.
 */
export interface SInputNumeric {
  /** Digits after the decimal separator. `0` (default) allows integers only. */
  decimals?: number
  /** Disallows negative values (the minus sign cannot be typed). */
  unsigned?: boolean
  /** Lower bound. Checked on top of the mask: the value is clamped on the `change` event. */
  min?: number
  /** Upper bound. Checked on top of the mask: the value is clamped on the `change` event. */
  max?: number
  /**
   * Formatting locale (`Intl.NumberFormat`), `en` by default: a dot as the decimal separator and
   * a comma between digit groups.
   */
  locale?: string
}

export interface SInputProps extends SValidationProps<string | string[]> {
  /** Input id. Generated automatically when not set (SSR-safe). */
  id?: string
  /**
   * Type of the native input (plain mode only, not `use-tags`). `number` never reaches the DOM:
   * on intermediate invalid input the browser returns an empty string and silently loses what was
   * typed, so numeric mode is enabled instead, see `numeric`.
   */
  type?: string
  /** Field label (linked to the input via `for`/`id`). */
  label?: string
  /**
   * Floating label: the label sits inside the border, looks like a placeholder at rest and
   * floats up to the top edge on focus or when filled. On by default; `false` renders a regular
   * label above the field. The label size is fixed and does not depend on `size`.
   */
  floatingLabel?: boolean
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Placeholder text in an empty field. */
  placeholder?: string
  /** Field size: `sm` (32px), `md` (40px) or `lg` (48px). */
  size?: SInputSize
  /** Disables input and makes the field inactive. */
  disabled?: boolean
  /** Marks the field as required: adds `*` to the label and sets `required`. */
  required?: boolean
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Read-only field: the value is visible and selectable but cannot be edited. */
  readonly?: boolean
  /** Square corners: removes the field border radius (rounded by default). */
  square?: boolean
  /** Text prefix inside the border, before the input (e.g. `$`, `+1`). */
  prefix?: string
  /** Text suffix inside the border, after the input: a unit of measure (`kg`, `cm`, `pcs`). */
  suffix?: string
  /** Registry name or raw path of the leading icon, drawn on the left inside the field. */
  icon?: string
  /** Registry name or raw path of the trailing icon, drawn on the right (plain mode only). */
  iconRight?: string
  /** Shows a clear button that resets the field value (plain mode only). */
  clearable?: boolean
  /** Registry name or raw path of the clear button icon. */
  clearIcon?: string
  /** Accessible name of the clear button (defaults to the locale dictionary). */
  clearLabel?: string
  /**
   * Input mask (plain mode only, not `use-tags`). A pattern of tokens: `#` is a digit, `S` a
   * letter, `N` alphanumeric, `A`/`a` an upper/lowercase letter, `X`/`x` upper/lowercase
   * alphanumeric; any other character is a literal separator. Escape a literal with `\`
   * (e.g. `\#`). Named masks are supported: `phone`, `date`, `datetime`, `time`, `fulltime`,
   * `card`. Example: `mask="(###) ### - ####"`.
   */
  mask?: string
  /**
   * With a mask: `v-model` holds the raw value without separators/literals (e.g. `9991234567`
   * instead of `(999) 123 - 4567`). By default the model contains the masked string.
   */
  unmaskedValue?: boolean
  /**
   * With a mask: shows the mask template right in the field, with empty slots filled by a
   * character that **stays visible while typing** (e.g. `(123) 45_ - ____`). `true` uses `_`;
   * a string sets a custom character (e.g. `fill-mask="·"`). Drawn as a "ghost" layer behind the
   * text, so the caret works natively. The label stays floated at the top.
   */
  fillMask?: boolean | string
  /**
   * Numeric mode (plain mode only, not `use-tags`; incompatible with `mask`). `true` allows
   * integers; an object sets precision and bounds. `v-model` holds a normalized string: a dot as
   * the decimal separator and no group separators, so `Number(value)` always works.
   * Example: `:numeric="{ decimals: 2, unsigned: true, max: 1000 }"`.
   */
  numeric?: boolean | SInputNumeric
  /**
   * Tags mode: the field becomes an input for multiple tags. In this mode `modelValue` is a
   * `string[]` rather than a `string`; the `type`/`iconRight`/`clearable` props do not apply.
   */
  useTags?: boolean
  /** Tags mode: allows duplicate tags. */
  duplicate?: boolean
  /** Tags mode: adds tags when pasting from the clipboard (split by the delimiter). */
  addOnPaste?: boolean
  /** Tags mode: maximum number of tags. */
  max?: number
  /** Tags mode: icon of the tag remove button (registry name or raw path). */
  removeIcon?: string
  /** Tags mode: accessible name of the tag remove button (defaults to the locale dictionary). */
  removeTagLabel?: string
}
