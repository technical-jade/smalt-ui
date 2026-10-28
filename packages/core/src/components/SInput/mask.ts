import { Mask, type MaskOptions, type MaskTokens } from 'maska'
import type { SInputNumeric } from './types'

/**
 * Input mask for `SInput` on top of Maska. The public API (the `mask` prop) defines the token
 * alphabet and named masks; all caret/paste/IME logic is handled by Maska.
 */

// Named masks: `mask="phone"` and the like expand into a pattern.
export const NAMED_MASKS: Record<string, string> = {
  phone: '(###) ### - ####',
  date: '####/##/##',
  datetime: '####/##/## ##:##',
  time: '##:##',
  fulltime: '##:##:##',
  card: '#### #### #### ####',
}

/**
 * Token alphabet: `#` digit, `S` letter, `N` alphanumeric, `A`/`a` upper/lowercase letter,
 * `X`/`x` upper/lowercase alphanumeric. Replaces the default Maska tokens (`@`/`*`) via
 * `tokensReplace: true`. A letter is `\p{L}`, any script: a mask such as a license plate is typed
 * in the user's own alphabet.
 */
export const MASK_TOKENS: MaskTokens = {
  '#': { pattern: /[0-9]/ },
  S: { pattern: /\p{L}/u },
  N: { pattern: /[0-9\p{L}]/u },
  A: { pattern: /\p{L}/u, transform: (c) => c.toUpperCase() },
  a: { pattern: /\p{L}/u, transform: (c) => c.toLowerCase() },
  X: { pattern: /[0-9\p{L}]/u, transform: (c) => c.toUpperCase() },
  x: { pattern: /[0-9\p{L}]/u, transform: (c) => c.toLowerCase() },
}

/**
 * Expands a named mask into a pattern and converts our `\X` escape into the Maska `!X` escape
 * (Maska escapes with `!`), so the public API can escape with `\`.
 */
export function resolveMask(mask: string): string {
  return (NAMED_MASKS[mask] ?? mask).replace(/\\(.)/g, '!$1')
}

// Options for Maska (the `v-maska` directive / `Mask` class): our alphabet replaces the default.
export function toMaskaOptions(mask: string): MaskOptions {
  return { mask: resolveMask(mask), tokens: MASK_TOKENS, tokensReplace: true }
}

// Engine that formats the value (masking a raw or already masked string is idempotent).
export function createMaskEngine(mask: string): Mask {
  return new Mask(toMaskaOptions(mask))
}

const TOKEN_KEYS = new Set(Object.keys(MASK_TOKENS))

/**
 * Empty mask template for fill-mask: tokens become `fillChar`, literals (including escaped `!X`)
 * are kept. E.g. `(###) ### - ####` → `(___) ___ - ____`. Works on the resolved mask (the Maska
 * form with `!` escapes).
 */
export function toTemplate(mask: string, fillChar = '_'): string {
  const resolved = resolveMask(mask)
  let out = ''
  for (let i = 0; i < resolved.length; i++) {
    const c = resolved[i]
    if (c === '!') {
      out += resolved[++i] ?? ''
      continue
    }
    out += TOKEN_KEYS.has(c) ? fillChar : c
  }
  return out
}

// Maska options for numeric mode; the locale sets the group and decimal separators.
export function toNumericMaskaOptions(numeric: SInputNumeric): MaskOptions {
  return {
    number: {
      locale: numeric.locale ?? 'en',
      fraction: numeric.decimals ?? 0,
      unsigned: numeric.unsigned ?? false,
    },
  }
}

// Numeric mode engine: formats the model value for display.
export function createNumericMaskEngine(numeric: SInputNumeric): Mask {
  return new Mask(toNumericMaskaOptions(numeric))
}

/**
 * Converts the input to a number: Maska returns a raw string with a dot and no group separators,
 * so `Number` is enough. An empty string or a lone minus is not a number yet.
 */
export function parseNumeric(raw: string): number | null {
  if (raw === '' || raw === '-') return null
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

/** Clamps the number to `min`/`max`. Maska does not enforce them, so this runs on top of it. */
export function clampNumeric(value: number, numeric: SInputNumeric): number {
  const min = numeric.min ?? -Infinity
  const max = numeric.max ?? Infinity
  return Math.min(Math.max(value, min), max)
}
