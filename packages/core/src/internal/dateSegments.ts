import type { SMessages } from '../composables/useLocale'

/**
 * Date/time segment separators come from ICU, and server and browser ICU versions differ, so
 * hydration mismatches for no real reason. Hence two adjustments: a trailing separator is not
 * rendered (Reka asks `Intl` for the time zone name and, for a value without a zone, drops the
 * segment itself but keeps the separator), and spaces inside are normalized to a regular space.
 */
export interface DateSegment {
  part: string
  value: string
}

// No-break, thin and narrow no-break spaces: the ones ICU versions disagree on.
const SPACES = /[\u00a0\u2009\u202f]/g

export function visibleSegments<T extends DateSegment>(segments: readonly T[]): T[] {
  let end = segments.length
  while (end > 0 && segments[end - 1].part === 'literal') end--
  return segments
    .slice(0, end)
    .map((segment) =>
      segment.part === 'literal'
        ? { ...segment, value: segment.value.replace(SPACES, ' ') }
        : segment,
    )
}

const SEGMENT_LABELS: Partial<Record<string, keyof SMessages>> = {
  day: 'segmentDay',
  month: 'segmentMonth',
  year: 'segmentYear',
  hour: 'segmentHour',
  minute: 'segmentMinute',
  second: 'segmentSecond',
  dayPeriod: 'segmentDayPeriod',
  timeZoneName: 'segmentTimeZone',
}

// An empty numeric segment shows Reka's placeholder ("mm", "––"), a filled one shows digits.
const DIGIT = /\p{Nd}/u
const NUMERIC_PARTS = new Set(['day', 'month', 'year', 'hour', 'minute', 'second'])

/**
 * Reka hardcodes English `aria-label`s on the segments ("day,", "hour,") and the `aria-valuetext`
 * "Empty" on an empty one. Attributes passed to `*Input` land on its root over Reka's own, so the
 * names come from the dictionary here. The value text of a filled segment stays with Reka: it is
 * already localized (the month one includes the month name).
 */
export function segmentAria(segment: DateSegment, m: SMessages): Record<string, string> {
  const label = SEGMENT_LABELS[segment.part]
  if (!label) return {}
  const attrs: Record<string, string> = { 'aria-label': m[label] }
  if (NUMERIC_PARTS.has(segment.part) && !DIGIT.test(segment.value)) {
    attrs['aria-valuetext'] = m.segmentEmpty
  }
  return attrs
}
