import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import * as v from 'valibot'
import {
  email,
  enMessages,
  isEmptyValue,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  required,
  schemaRule,
  type SRuleContext,
} from '../index'

const ctx: SRuleContext = { messages: enMessages }

describe('isEmptyValue', () => {
  it.each([undefined, null, '', '   ', [], false, { start: undefined, end: undefined }])(
    'treats %j as empty',
    (value) => expect(isEmptyValue(value)).toBe(true),
  )

  it.each([0, 'a', ['a'], true, { start: 1, end: undefined }])('treats %j as filled', (value) =>
    expect(isEmptyValue(value)).toBe(false),
  )
})

describe('required', () => {
  it('fails on an empty value with the default text', () => {
    expect(required()('', ctx)).toBe('This field is required')
  })

  it('passes a filled value and zero', () => {
    expect(required()('text', ctx)).toBe(true)
    expect(required()(0, ctx)).toBe(true)
  })

  it('uses a custom message', () => {
    expect(required('Name is required')(null, ctx)).toBe('Name is required')
  })

  it('reads the default text from the context locale', () => {
    const local: SRuleContext = { messages: { ...enMessages, ruleRequired: 'Pflichtfeld' } }
    expect(required()('', local)).toBe('Pflichtfeld')
  })
})

describe('length rules', () => {
  it('skips an empty value', () => {
    expect(minLength(3)('', ctx)).toBe(true)
    expect(maxLength(3)(undefined, ctx)).toBe(true)
  })

  it('checks strings with the characters text', () => {
    expect(minLength(3)('ab', ctx)).toBe('Enter at least 3 characters')
    expect(minLength(3)('abc', ctx)).toBe(true)
    expect(maxLength(2)('abc', ctx)).toBe('Enter no more than 2 characters')
  })

  it('checks arrays with the items text', () => {
    expect(minLength(2)(['a'], ctx)).toBe('Select at least 2')
    expect(maxLength(1)(['a', 'b'], ctx)).toBe('Select no more than 1')
  })

  it('fills the placeholder in a custom message', () => {
    expect(minLength(8, 'At least {min} symbols')('abc', ctx)).toBe('At least 8 symbols')
  })
})

describe('number rules', () => {
  it('skips an empty value but checks zero', () => {
    expect(min(1)(null, ctx)).toBe(true)
    expect(min(1)(0, ctx)).toBe('Must be at least 1')
    expect(max(10)(11, ctx)).toBe('Must be no more than 10')
    expect(max(10)(10, ctx)).toBe(true)
  })

  it('checks a numeric string, the unmasked model of SInput with numeric', () => {
    expect(min(1)('0', ctx)).toBe('Must be at least 1')
    expect(min(1)('', ctx)).toBe(true)
    expect(max(10)('10.5', ctx)).toBe('Must be no more than 10')
    expect(min(1)('-', ctx)).toBe(true)
    expect(max(10)('9', ctx)).toBe(true)
    expect(min(1)('   ', ctx)).toBe(true)
    expect(max(10)('abc', ctx)).toBe(true)
  })

  it('passes a value that is not a number or a string, such as a range array', () => {
    expect(min(1)([5] as never, ctx)).toBe(true)
    expect(min(1)([0, 5] as never, ctx)).toBe(true)
  })
})

describe('pattern and email', () => {
  it('checks a pattern and ignores the global flag state', () => {
    const rule = pattern(/^\d+$/g)
    expect(rule('123', ctx)).toBe(true)
    expect(rule('123', ctx)).toBe(true)
    expect(rule('12a', ctx)).toBe('Invalid format')
  })

  it('checks an email', () => {
    expect(email()('user@example.com', ctx)).toBe(true)
    expect(email()('user@', ctx)).toBe('Enter a valid email address')
    expect(email()('', ctx)).toBe(true)
  })
})

describe('schemaRule', () => {
  it('passes the first zod issue message', () => {
    const rule = schemaRule(z.string().email('Bad email'))
    expect(rule('x', ctx)).toBe('Bad email')
    expect(rule('a@b.co', ctx)).toBe(true)
  })

  it('works with valibot', () => {
    const rule = schemaRule(v.pipe(v.string(), v.minLength(3, 'Too short')))
    expect(rule('ab', ctx)).toBe('Too short')
  })

  it('awaits an async schema', async () => {
    const rule = schemaRule(z.string().refine(async (s) => s !== 'taken', 'Name is taken'))
    await expect(rule('taken', ctx)).resolves.toBe('Name is taken')
    await expect(rule('free', ctx)).resolves.toBe(true)
  })
})
