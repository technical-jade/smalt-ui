/**
 * Extracts the component API (props/events/slots) from TS types with vue-component-meta and
 * writes .vitepress/data/api.json, the single source of truth for the auto-generated doc tables.
 */
import { createChecker } from 'vue-component-meta'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '../../..')
const coreDir = join(repoRoot, 'packages/core')
const componentsDir = join(coreDir, 'src/components')
const tsconfig = join(coreDir, 'tsconfig.json')

/**
 * External types with methods — the @internationalized/date classes (DateValue = CalendarDate |
 * CalendarDateTime | ZonedDateTime, etc.) and the DOM `File`. Fully expanding them in the schema
 * gives an unreadable wall of text, so they stay as alias names.
 */
const OPAQUE_TYPES = [
  'File',
  'DateValue',
  'Time',
  'CalendarDate',
  'CalendarDateTime',
  'ZonedDateTime',
  'Calendar',
  'AnyCalendarDate',
  'DateDuration',
  'DateTimeDuration',
  'DateFields',
  'TimeFields',
  'CycleOptions',
  'CycleTimeOptions',
  'Disambiguation',
]

const checker = createChecker(tsconfig, {
  forceUseTs: true,
  schema: { ignore: OPAQUE_TYPES },
  printer: { newLine: 1 },
})

function clean(type) {
  return String(type).replace(/\s+/g, ' ').trim()
}

/**
 * Prop name in kebab-case, as written in a template (`floatingLabel` → `floating-label`).
 * Same logic as Vue's `hyphenate`, so the name in the docs matches the attribute in markup.
 */
function hyphenate(name) {
  return String(name)
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()
}

/**
 * Removes the `| undefined` noise from a type string (optionality is conveyed by the "Default"
 * column and the required marker).
 */
function stripUndefined(str) {
  return (
    String(str)
      .split('|')
      .map((s) => s.trim())
      .filter((p) => p && p !== 'undefined')
      .join(' | ') || String(str).trim()
  )
}

function literalOf(m) {
  return typeof m === 'string' ? m : (m?.type ?? '')
}

/**
 * Expands a vue-component-meta schema into a full readable type: aliases and interfaces are
 * written out (`SInputSize` → `"sm" | "md" | "lg"`,
 * `SSelectOption[]` → `{ label: string; value: string; disabled?: boolean }[]`).
 */
function expandType(schema, depth = 0) {
  if (depth > 5) return null
  if (typeof schema === 'string') return stripUndefined(schema)
  if (!schema || typeof schema !== 'object') return null

  switch (schema.kind) {
    case 'enum': {
      const members = (schema.schema ?? []).filter((m) => literalOf(m) !== 'undefined')
      const set = new Set(members.map(literalOf))
      if (set.size === 2 && set.has('true') && set.has('false')) return 'boolean'
      const parts = members.map((m) => expandType(m, depth + 1)).filter(Boolean)
      return parts.length ? [...new Set(parts)].join(' | ') : null
    }
    case 'array': {
      const el = expandType(schema.schema?.[0], depth + 1)
      return el ? `${el}[]` : null
    }
    case 'object': {
      const parts = Object.values(schema.schema ?? {}).map((p) => {
        const t = expandType(p.schema, depth + 1) ?? clean(p.type)
        return `${p.name}${p.required ? '' : '?'}: ${t}`
      })
      return parts.length ? `{ ${parts.join('; ')} }` : null
    }
    default:
      return null
  }
}

/**
 * Dates are shown as a union of the classes the consumer creates (`parseDate`, `parseDateTime`,
 * `parseZonedDateTime`, `parseTime`): the `DateValue` alias tells the reader nothing. The `[]`
 * variant is parenthesized for operator precedence.
 */
const DATE_UNION = 'CalendarDate | CalendarDateTime | ZonedDateTime'
const TIME_UNION = 'Time | CalendarDateTime | ZonedDateTime'

function normalizeDateTypes(type) {
  if (!type) return type
  return type
    .replace(/\bDateValue\[\]/g, `(${DATE_UNION})[]`)
    .replace(/\bDateValue\b/g, DATE_UNION)
    .replace(/\bS?TimeValue\[\]/g, `(${TIME_UNION})[]`)
    .replace(/\bS?TimeValue\b/g, TIME_UNION)
}

/**
 * `vue-component-meta` does not return event JSDoc: `description` is empty with both `defineEmits`
 * forms (checked with the tuple and call syntax). The code has the descriptions, so they are read
 * straight from the SFC: `defineEmits<{ … }>` blocks in the repo are uniform, with JSDoc above
 * the event name.
 */
function readEventDescriptions(file) {
  const source = readFileSync(file, 'utf8')
  const start = source.indexOf('defineEmits<{')
  if (start === -1) return {}

  let depth = 0
  let end = start
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}' && --depth === 0) {
      end = i
      break
    }
  }

  const body = source.slice(start, end)
  const entry = /\/\*\*([\s\S]*?)\*\/\s*['"]?([\w:]+)['"]?\s*:/g
  const descriptions = {}
  let match
  while ((match = entry.exec(body)) !== null) {
    const text = match[1]
      .split('\n')
      .map((line) => line.replace(/^\s*\*?\s?/, '').trimEnd())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) descriptions[match[2]] = text
  }
  return descriptions
}

/**
 * SColorName (the color/text-color prop) expands into ~290 palette values, a useless wall of
 * text. It is shown as string; the explanation and the palette link are in the JSDoc. The
 * marker is a literal unique to the palette union. The union is collapsed in place rather than
 * in the whole type, because the palette also appears nested inside item types
 * (`STimelineItem[]`), where replacing everything would hide the item's own fields.
 */
const PALETTE_MARKER = '"blue-grey-14"'
const LITERAL_UNION = /"[^"]+"(?:\s*\|\s*"[^"]+")+/g

function collapsePalette(type) {
  if (!type || !type.includes(PALETTE_MARKER)) return type
  return type.replace(LITERAL_UNION, (union) => (union.includes(PALETTE_MARKER) ? 'string' : union))
}

/**
 * `Intl.NumberFormatOptions` (formatting props) expands into the whole option bag of the
 * standard library — two dozen fields no reader scans. The alias name says it all; the options
 * worth setting are named in the prop's JSDoc.
 */
const INTL_NUMBER_BAG = /\{[^{}]*\btrailingZeroDisplay\?:[^{}]*\}/g

function collapseIntlOptions(type) {
  return type ? type.replace(INTL_NUMBER_BAG, 'Intl.NumberFormatOptions') : type
}

function renderType(prop) {
  const type = normalizeDateTypes(expandType(prop.schema) ?? stripUndefined(clean(prop.type)))
  return collapseIntlOptions(collapsePalette(type))
}

function describeEvent(name) {
  const m = /^update:(.+)$/.exec(name)
  if (m) {
    const prop = m[1]
    const model = prop === 'modelValue' ? 'v-model' : `v-model:${prop}`
    return `Emitted when \`${prop}\` changes. Used for two-way binding (\`${model}\`).`
  }
  return ''
}

/**
 * Providers are scanned along with components: `ToastProvider` is documented with `<ApiTable>`.
 * `EXCLUDE` lists public items without a table of their own (`ConfigProvider` is covered in the
 * guide).
 */
const providersDir = join(coreDir, 'src/providers')
const EXCLUDE = new Set(['ConfigProvider'])

const result = {}

for (const dir of [componentsDir, providersDir]) {
  for (const name of readdirSync(dir)) {
    if (EXCLUDE.has(name)) continue
    const file = join(dir, name, `${name}.vue`)
    if (!existsSync(file)) continue

    const meta = checker.getComponentMeta(file)
    const eventDescriptions = readEventDescriptions(file)

    result[name] = {
      props: meta.props
        .filter((p) => !p.global)
        .map((p) => ({
          name: hyphenate(p.name),
          type: renderType(p),
          required: p.required,
          default: p.default != null ? clean(p.default) : null,
          description: p.description ?? '',
        }))
        /**
         * Required props first, then declaration order from `types.ts` (the sort is stable):
         * props there are grouped by meaning, and alphabetical order would scatter the groups.
         */
        .sort((a, b) => Number(b.required) - Number(a.required)),
      events: meta.events.map((e) => ({
        name: e.name,
        type: normalizeDateTypes(clean(e.type)),
        description: e.description || eventDescriptions[e.name] || describeEvent(e.name),
      })),
      slots: meta.slots.map((s) => ({
        name: s.name,
        description: s.description ?? '',
      })),
    }
  }
}

const outDir = join(here, '../.vitepress/data')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'api.json'), JSON.stringify(result, null, 2), 'utf8')

console.log(`✓ API extracted for: ${Object.keys(result).join(', ')}`)
