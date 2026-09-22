<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { SScrollArea } from '../SScrollArea'
import type { TimePickerFields } from './TimePickerBase'
import type { STimeValue } from '../STimeField/types'

type TimePart = 'hour' | 'minute' | 'second' | 'dayPeriod'

interface TimeOption {
  value: number
  label: string
  disabled: boolean
  selected: boolean
}

interface TimeColumn {
  part: TimePart
  label: string
  options: TimeOption[]
  /** The option that carries the tab stop of its column. */
  active?: number
}

/**
 * Private part of STimePicker: the columns of the panel. It only reads the value and reports the
 * picked field; the writing is done by the wrapper, which owns the Reka time-field context.
 * Styles are global BEM from STimePicker.scss (the panel is portalled to body).
 */
const props = defineProps<{
  value?: STimeValue
  locale: string
  hourCycle: 12 | 24
  granularity: 'hour' | 'minute' | 'second'
  minuteStep: number
  secondStep: number
  minValue?: STimeValue
  maxValue?: STimeValue
}>()

const emit = defineEmits<{
  pick: [fields: TimePickerFields]
}>()

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR

const secondOfDay = (hour: number, minute = 0, second = 0) =>
  hour * SECONDS_PER_HOUR + minute * SECONDS_PER_MINUTE + second

const boundary = (value: STimeValue | undefined, fallback: number) =>
  value ? secondOfDay(value.hour, value.minute, value.second) : fallback

const earliest = computed(() => boundary(props.minValue, 0))
const latest = computed(() => boundary(props.maxValue, SECONDS_PER_DAY - 1))
const allowed = (from: number, to: number) => to >= earliest.value && from <= latest.value

const numbers = computed(
  () => new Intl.NumberFormat(props.locale, { minimumIntegerDigits: 2, useGrouping: false }),
)
const pad = (value: number) => numbers.value.format(value)

const dayPeriods = computed(() => {
  const format = new Intl.DateTimeFormat(props.locale, { hour: 'numeric', hour12: true })
  const read = (hour: number) =>
    format.formatToParts(new Date(2024, 0, 1, hour)).find((part) => part.type === 'dayPeriod')
      ?.value ?? ''
  return { am: read(9), pm: read(21) }
})

/**
 * Column names come from Intl, not from the message dictionary: the panel is formatted in the
 * field's locale, and the dictionary ships English only, so a name taken from it would not match
 * the digits next to it.
 */
function unitLabel(unit: 'hour' | 'minute' | 'second'): string {
  const parts = new Intl.NumberFormat(props.locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).formatToParts(2)
  return parts.find((part) => part.type === 'unit')?.value ?? unit
}

/** The hour the other columns are read against: the picked one, or midnight while empty. */
const anchorHour = computed(() => props.value?.hour ?? 0)
const anchorMinute = computed(() => props.value?.minute ?? 0)

const series = (limit: number, step: number) => {
  const size = Math.min(Math.max(Math.floor(step) || 1, 1), limit)
  return Array.from({ length: Math.ceil(limit / size) }, (_, index) => index * size)
}

/** Focus stays where the user left it, so Tab returns to the last option of the column. */
const focused = ref<Partial<Record<TimePart, number>>>({})

function build(part: TimePart, label: string, options: TimeOption[]): TimeColumn {
  const remembered = focused.value[part]
  const enabled = (option: TimeOption) => !option.disabled
  const active =
    options.find((option) => option.value === remembered && enabled(option)) ??
    options.find((option) => option.selected && enabled(option)) ??
    options.find(enabled)
  return { part, label, options, active: active?.value }
}

const hours = computed(() => {
  const period = props.hourCycle === 12 && anchorHour.value >= 12 ? 12 : 0
  const options = Array.from({ length: props.hourCycle }, (_, index) => {
    const hour = props.hourCycle === 12 ? index + period : index
    return {
      value: hour,
      label: pad(props.hourCycle === 12 && index === 0 ? 12 : index),
      disabled: !allowed(secondOfDay(hour), secondOfDay(hour, 59, 59)),
      selected: props.value?.hour === hour,
    }
  })
  return build('hour', unitLabel('hour'), options)
})

const minutes = computed(() => {
  const hour = anchorHour.value
  const options = series(60, props.minuteStep).map((minute) => ({
    value: minute,
    label: pad(minute),
    disabled: !allowed(secondOfDay(hour, minute), secondOfDay(hour, minute, 59)),
    selected: props.value?.minute === minute,
  }))
  return build('minute', unitLabel('minute'), options)
})

const seconds = computed(() => {
  const at = (second: number) => secondOfDay(anchorHour.value, anchorMinute.value, second)
  const options = series(60, props.secondStep).map((second) => ({
    value: second,
    label: pad(second),
    disabled: !allowed(at(second), at(second)),
    selected: props.value?.second === second,
  }))
  return build('second', unitLabel('second'), options)
})

const periods = computed(() => {
  const { am, pm } = dayPeriods.value
  const options = [
    { offset: 0, label: am },
    { offset: 12, label: pm },
  ].map(({ offset, label }) => ({
    value: offset,
    label,
    disabled: !allowed(secondOfDay(offset), secondOfDay(offset + 11, 59, 59)),
    selected: props.value !== undefined && (props.value.hour >= 12 ? 12 : 0) === offset,
  }))
  return build('dayPeriod', `${am}/${pm}`, options)
})

const columns = computed(() => {
  const list: TimeColumn[] = [hours.value]
  if (props.granularity !== 'hour') list.push(minutes.value)
  if (props.granularity === 'second') list.push(seconds.value)
  if (props.hourCycle === 12) list.push(periods.value)
  return list
})

function pick(part: TimePart, value: number): void {
  focused.value[part] = value
  if (part === 'hour') emit('pick', { hour: value })
  else if (part === 'minute') emit('pick', { minute: value })
  else if (part === 'second') emit('pick', { second: value })
  else emit('pick', { hour: (anchorHour.value % 12) + value })
}

const panel = useTemplateRef<HTMLElement>('panel')

const lists = () => [...(panel.value?.querySelectorAll<HTMLElement>('[role="listbox"]') ?? [])]
const items = (list: HTMLElement) => [
  ...list.querySelectorAll<HTMLElement>('[role="option"]:not([disabled])'),
]
const tabStop = (list: HTMLElement | undefined) =>
  list?.querySelector<HTMLElement>('[role="option"][tabindex="0"]') ?? undefined

/**
 * Scrolls inside the column alone. `scrollIntoView` would also scroll every ancestor, including
 * the page behind the panel.
 */
function reveal(option: HTMLElement | undefined): void {
  const viewport = option?.closest<HTMLElement>('[data-reka-scroll-area-viewport]')
  if (!option || !viewport) return
  const centered = (viewport.clientHeight - option.offsetHeight) / 2
  viewport.scrollTop = option.offsetTop - viewport.offsetTop - centered
}

function moveTo(option: HTMLElement | undefined, event: KeyboardEvent): void {
  if (!option) return
  event.preventDefault()
  option.focus()
  reveal(option)
}

function neighbour(list: HTMLElement, step: number): HTMLElement | undefined {
  const all = lists()
  return tabStop(all[all.indexOf(list) + step])
}

function onKeydown(event: KeyboardEvent): void {
  const option = (event.target as Element | null)?.closest<HTMLElement>('[role="option"]')
  const list = option?.closest<HTMLElement>('[role="listbox"]')
  if (!option || !list) return
  const enabled = items(list)
  const index = enabled.indexOf(option)
  if (event.key === 'ArrowDown') moveTo(enabled[index + 1], event)
  else if (event.key === 'ArrowUp') moveTo(enabled[index - 1], event)
  else if (event.key === 'Home') moveTo(enabled[0], event)
  else if (event.key === 'End') moveTo(enabled.at(-1), event)
  else if (event.key === 'ArrowRight') moveTo(neighbour(list, 1), event)
  else if (event.key === 'ArrowLeft') moveTo(neighbour(list, -1), event)
}

onMounted(async () => {
  await nextTick()
  const all = lists()
  all.forEach((list) => reveal(tabStop(list)))
  tabStop(all[0])?.focus()
})
</script>

<template>
  <div
    ref="panel"
    class="s-time-picker__columns"
    @keydown="onKeydown"
  >
    <SScrollArea
      v-for="column in columns"
      :key="column.part"
      class="s-time-picker__column"
      size="sm"
    >
      <div
        class="s-time-picker__list"
        role="listbox"
        :aria-label="column.label"
      >
        <button
          v-for="option in column.options"
          :key="option.value"
          type="button"
          role="option"
          class="s-time-picker__option"
          :disabled="option.disabled"
          :aria-selected="option.selected"
          :data-selected="option.selected || undefined"
          :tabindex="column.active === option.value ? 0 : -1"
          @click="pick(column.part, option.value)"
          @focus="focused[column.part] = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </SScrollArea>
  </div>
</template>
