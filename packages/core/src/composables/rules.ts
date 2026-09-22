import type { SRule, SRuleResult } from './useValidation'

/** Result of `StandardSchemaV1['~standard']['validate']`: the value, or a list of issues. */
export type StandardSchemaResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<{ readonly message: string }> }

/**
 * The Standard Schema interface (https://standardschema.dev), declared here instead of pulling
 * `@standard-schema/spec`: Zod 3.24+, Valibot 1, ArkType and Effect Schema implement it.
 */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': {
    readonly version: 1
    readonly vendor: string
    readonly validate: (
      value: unknown,
    ) => StandardSchemaResult<Output> | Promise<StandardSchemaResult<Output>>
    readonly types?: { readonly input: Input; readonly output: Output } | undefined
  }
}

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )

/**
 * Empty for `required()`: nothing, blank text, an empty list, an unchecked box and a date range
 * with both ends missing. Zero is a value: a rating of 0 is checked with `min(1)`.
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === false) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object' && 'start' in value && 'end' in value) {
    return value.start == null && value.end == null
  }
  return false
}

/** The value must not be empty (see `isEmptyValue`). */
export function required(message?: string): SRule<unknown> {
  return (value, { messages }) => !isEmptyValue(value) || (message ?? messages.ruleRequired)
}

type Sized = string | readonly unknown[] | null | undefined

/**
 * Minimum length of text or of a list (tags, multiple select). An empty value passes: whether
 * the field may stay empty is decided by `required()`.
 */
export function minLength(min: number, message?: string): SRule<Sized> {
  return (value, { messages }) => {
    if (isEmptyValue(value) || value == null) return true
    if (value.length >= min) return true
    const text = typeof value === 'string' ? messages.ruleMinLength : messages.ruleMinItems
    return fill(message ?? text, { min })
  }
}

/** Maximum length of text or of a list. An empty value passes. */
export function maxLength(max: number, message?: string): SRule<Sized> {
  return (value, { messages }) => {
    if (isEmptyValue(value) || value == null) return true
    if (value.length <= max) return true
    const text = typeof value === 'string' ? messages.ruleMaxLength : messages.ruleMaxItems
    return fill(message ?? text, { max })
  }
}

type Numeric = number | string | null | undefined

/**
 * A string is the unmasked model of a numeric `SInput` ("1234.5"). Anything else that is not a
 * number passes rather than being coerced: `Number([5])` is `5`, which would silently check a
 * range as a single value.
 */
const toNumber = (value: Numeric): number | undefined => {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined
  if (isEmptyValue(value)) return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isNaN(n) ? undefined : n
}

/**
 * Lower bound of a number, or of a numeric string (the model of `SInput` with `numeric`). An
 * empty value passes, zero is checked, a non-numeric string passes. Applies to a single value; a
 * range (array) is not checked — write your own rule.
 */
export function min(limit: number, message?: string): SRule<Numeric> {
  return (value, { messages }) => {
    const n = toNumber(value)
    return n === undefined || n >= limit || fill(message ?? messages.ruleMin, { min: limit })
  }
}

/**
 * Upper bound of a number, or of a numeric string (the model of `SInput` with `numeric`). An
 * empty value passes, a non-numeric string passes. Applies to a single value; a range (array) is
 * not checked — write your own rule.
 */
export function max(limit: number, message?: string): SRule<Numeric> {
  return (value, { messages }) => {
    const n = toNumber(value)
    return n === undefined || n <= limit || fill(message ?? messages.ruleMax, { max: limit })
  }
}

/** The text must match `re`. An empty value passes. */
export function pattern(re: RegExp, message?: string): SRule<string | null | undefined> {
  return (value, { messages }) => {
    if (isEmptyValue(value)) return true
    // A /g or /y regex keeps lastIndex between calls and would fail every second check.
    re.lastIndex = 0
    return re.test(value!) || (message ?? messages.rulePattern)
  }
}

// Deliberately loose: a strict RFC check rejects valid addresses; the server confirms the address.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** A plausible email address. An empty value passes. */
export function email(message?: string): SRule<string | null | undefined> {
  return (value, { messages }) =>
    isEmptyValue(value) || EMAIL.test(value!) || (message ?? messages.ruleEmail)
}

/**
 * A rule from a Standard Schema (Zod, Valibot, ArkType…): the first issue's message becomes the
 * error. An async schema returns a Promise, which the field awaits.
 */
export function schemaRule<I>(schema: StandardSchemaV1<I>): SRule<I> {
  return (value, { messages }) => {
    const toResult = (result: StandardSchemaResult<unknown>): SRuleResult =>
      !result.issues?.length || result.issues[0]?.message || messages.ruleFailed
    const result = schema['~standard'].validate(value)
    return result instanceof Promise ? result.then(toResult) : toResult(result)
  }
}
