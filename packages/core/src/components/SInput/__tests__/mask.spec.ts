import { describe, expect, it } from 'vitest'
import {
  clampNumeric,
  createMaskEngine,
  createNumericMaskEngine,
  parseNumeric,
  resolveMask,
  toTemplate,
  NAMED_MASKS,
} from '../mask'

describe('SInput · mask engine', () => {
  it('formats by the pattern and unmasks', () => {
    const e = createMaskEngine('(###) ### - ####')
    expect(e.masked('1234567890')).toBe('(123) 456 - 7890')
    expect(e.unmasked('1234567890')).toBe('1234567890')
  })

  it('masking is idempotent (masked of an already masked value)', () => {
    const e = createMaskEngine('(###) ### - ####')
    expect(e.masked('(123) 456 - 7890')).toBe('(123) 456 - 7890')
  })

  it('empty string → empty (no fill placeholder)', () => {
    expect(createMaskEngine('(###) ### - ####').masked('')).toBe('')
  })

  it('named masks expand into a pattern', () => {
    expect(resolveMask('phone')).toBe(NAMED_MASKS.phone)
    expect(createMaskEngine('phone').masked('9991234567')).toBe('(999) 123 - 4567')
    expect(createMaskEngine('date').masked('20240131')).toBe('2024/01/31')
  })

  it('letter/alphanumeric tokens and case transforms', () => {
    expect(createMaskEngine('AAA').masked('abc')).toBe('ABC')
    expect(createMaskEngine('aaa').masked('ABC')).toBe('abc')
    expect(createMaskEngine('SSS').masked('a1b2')).toBe('ab')
    expect(createMaskEngine('NNN').masked('a1!b')).toBe('a1b')
  })

  it('letter tokens accept letters of any script', () => {
    expect(createMaskEngine('A###AA').masked('α123βγ')).toBe('Α123ΒΓ')
    expect(createMaskEngine('aaa').masked('ΔΕΖ')).toBe('δεζ')
    expect(createMaskEngine('SSS').masked('λ1μ2')).toBe('λμ')
    expect(createMaskEngine('NNN').masked('κ1!π')).toBe('κ1π')
    expect(createMaskEngine('XX').masked('ω9')).toBe('Ω9')
    expect(createMaskEngine('xx').masked('Ω9')).toBe('ω9')
  })

  it('named masks still accept only digits', () => {
    expect(createMaskEngine('phone').masked('αβγ9991234567')).toBe('(999) 123 - 4567')
  })

  it('escaping a literal with \\', () => {
    expect(resolveMask('\\#')).toBe('!#')
    expect(createMaskEngine('\\###').masked('5')).toBe('#5')
  })

  it('toTemplate: empty mask template (fill-mask)', () => {
    expect(toTemplate('(###) ### - ####')).toBe('(___) ___ - ____')
    expect(toTemplate('card')).toBe('____ ____ ____ ____')
    expect(toTemplate('####/##/##', '·')).toBe('····/··/··')
    expect(toTemplate('\\###')).toBe('#__')
  })
})

describe('SInput · numeric mode', () => {
  it('shows digit groups with the locale separator while the model holds the raw number', () => {
    const e = createNumericMaskEngine({ decimals: 0 })
    expect(e.masked('1234567')).toBe('1,234,567')
    expect(e.unmasked('1234567')).toBe('1234567')
  })

  it('takes a dot as the decimal separator and drops group commas', () => {
    const e = createNumericMaskEngine({ decimals: 2 })
    expect(e.unmasked('12.75')).toBe('12.75')
    expect(e.unmasked('1,234.75')).toBe('1234.75')
  })

  it('decimals: 0 drops the fractional part', () => {
    expect(createNumericMaskEngine({ decimals: 0 }).unmasked('12.75')).toBe('12')
  })

  it('letters do not get into the numeric value', () => {
    expect(createNumericMaskEngine({ decimals: 2 }).unmasked('12a3b')).toBe('123')
  })

  it('unsigned drops the minus sign', () => {
    expect(createNumericMaskEngine({ decimals: 0, unsigned: true }).unmasked('-7')).toBe('7')
    expect(createNumericMaskEngine({ decimals: 0 }).unmasked('-7')).toBe('-7')
  })

  it('parseNumeric: empty string and a lone minus are not numbers yet', () => {
    expect(parseNumeric('')).toBeNull()
    expect(parseNumeric('-')).toBeNull()
    expect(parseNumeric('12.5')).toBe(12.5)
  })

  it('clampNumeric clamps the value to the bounds', () => {
    expect(clampNumeric(5, { min: 10 })).toBe(10)
    expect(clampNumeric(500, { max: 99 })).toBe(99)
    expect(clampNumeric(50, { min: 10, max: 99 })).toBe(50)
  })
})
