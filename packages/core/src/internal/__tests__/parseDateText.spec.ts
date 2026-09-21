import { describe, expect, it } from 'vitest'
import { parseDates, parseTime } from '../parseDateText'

describe('parseDates', () => {
  it('reads ISO dates in any locale', () => {
    expect(parseDates('2024-03-15', 'en-US')).toEqual([{ year: 2024, month: 3, day: 15 }])
    expect(parseDates('2024-03-15/2024-03-20', 'en-GB')).toEqual([
      { year: 2024, month: 3, day: 15 },
      { year: 2024, month: 3, day: 20 },
    ])
  })

  it('reads numeric dates in the order of the locale', () => {
    expect(parseDates('03/15/2024', 'en-US')).toEqual([{ year: 2024, month: 3, day: 15 }])
    expect(parseDates('15/03/2024', 'en-GB')).toEqual([{ year: 2024, month: 3, day: 15 }])
    expect(parseDates('15.03.24', 'de-DE')).toEqual([{ year: 2024, month: 3, day: 15 }])
  })

  it('reads two dates of a range', () => {
    expect(parseDates('03/15/2024 – 03/20/2024', 'en-US')).toHaveLength(2)
  })

  it('ignores text that is not a date', () => {
    expect(parseDates('hello', 'en-US')).toEqual([])
    expect(parseDates('13/40/2024', 'en-US')).toEqual([])
  })
})

describe('parseTime', () => {
  it('reads 24-hour, 12-hour and ISO date-time text', () => {
    expect(parseTime('09:30')).toEqual({ hour: 9, minute: 30, second: 0 })
    expect(parseTime('9:30:15 PM')).toEqual({ hour: 21, minute: 30, second: 15 })
    expect(parseTime('12:05 am')).toEqual({ hour: 0, minute: 5, second: 0 })
    expect(parseTime('2024-03-15T18:45')).toEqual({ hour: 18, minute: 45, second: 0 })
  })

  it('rejects impossible times', () => {
    expect(parseTime('25:00')).toBeNull()
    expect(parseTime('no time')).toBeNull()
  })
})
