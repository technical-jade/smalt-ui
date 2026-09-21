export interface DateParts {
  year: number
  month: number
  day: number
}

export interface TimeParts {
  hour: number
  minute: number
  second: number
}

type DateField = keyof DateParts

// Order of the fields in the locale's numeric date: 11/22/2000, 22/11/2000, 2000/11/22.
function dateOrder(locale: string): DateField[] {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(new Date(2000, 10, 22))
    .map((part) => part.type)
    .filter((type): type is DateField => type === 'year' || type === 'month' || type === 'day')
}

const ISO_DATE = /(\d{4})-(\d{1,2})-(\d{1,2})/g

function isValidDate({ year, month, day }: DateParts): boolean {
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31
}

/**
 * Dates found in pasted text, in order: ISO 8601 (`2024-03-15`) first, otherwise groups of three
 * numbers in the order of the locale's own date format (`03/15/2024` in en-US, `15/03/2024` in
 * en-GB). A two-digit year means this century.
 */
export function parseDates(text: string, locale: string): DateParts[] {
  const iso = [...text.matchAll(ISO_DATE)].map(([, year, month, day]) => ({
    year: Number(year),
    month: Number(month),
    day: Number(day),
  }))
  if (iso.length) return iso.filter(isValidDate)

  const numbers = (text.match(/\d+/g) ?? []).map(Number)
  const order = dateOrder(locale)
  const dates: DateParts[] = []
  for (let i = 0; i + 3 <= numbers.length; i += 3) {
    const parts = { year: 0, month: 0, day: 0 }
    order.forEach((field, index) => (parts[field] = numbers[i + index]))
    if (parts.year < 100) parts.year += 2000
    if (isValidDate(parts)) dates.push(parts)
  }
  return dates
}

/** Time in pasted text: `9:30`, `09:30:15`, `9:30 PM`, or the time part of an ISO date-time. */
export function parseTime(text: string): TimeParts | null {
  const match = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap])?/i.exec(text)
  if (!match) return null
  const [, h, minute, second = '0', meridiem] = match
  let hour = Number(h)
  if (meridiem?.toLowerCase() === 'p' && hour < 12) hour += 12
  if (meridiem?.toLowerCase() === 'a' && hour === 12) hour = 0
  const time = { hour, minute: Number(minute), second: Number(second) }
  if (time.hour > 23 || time.minute > 59 || time.second > 59) return null
  return time
}
