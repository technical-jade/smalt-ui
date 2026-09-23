import {
  computed,
  inject,
  provide,
  toValue,
  type App,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'

/**
 * Strings the components render themselves: accessible names, visually hidden labels, placeholder
 * texts. Override them with `ConfigProvider`/`provideLocale` or per-instance props. Covers
 * Smalt UI's own strings only, not application content, so no i18n library is required.
 */
export interface SMessages {
  /** Close button (dialog/drawer/toast/alert). */
  close: string
  /** Button that clears the field value. */
  clear: string
  /** Button that opens the list in a searchable `SSelect`. */
  showOptions: string
  /** Placeholder shown when a searchable `SSelect` has no matches. */
  selectEmpty: string
  /** Decrement button in `SNumberField`. */
  decrement: string
  /** Increment button in `SNumberField`. */
  increment: string
  /** Button that opens the calendar (`SDatePicker`/`SDateRangePicker`). */
  openCalendar: string
  /** Moves the calendar to the previous month. */
  prevMonth: string
  /** Moves the calendar to the next month. */
  nextMonth: string
  /** Accessible name of a calendar grid, followed by the visible month ("Calendar, March 2026"). */
  calendar: string
  /** Moves `SPagination` to the previous page. */
  prevPage: string
  /** Moves `SPagination` to the next page. */
  nextPage: string
  /** The word "page" in the accessible name of a page number (`SPagination`), e.g. "Page 3". */
  page: string
  /** Accessible name of the page navigation landmark (`SPagination`). */
  pagination: string
  /**
   * Accessible name of an `SPinInput` cell. `{index}` and `{length}` are replaced with the cell
   * number and the cell count. A template rather than a function, so it survives the JSON of the
   * Nuxt module options.
   */
  pinCell: string
  /** Button that removes a tag (`STag`, `use-tags` in `SInput`/`SSelect`). */
  removeTag: string
  /** The word "rating" in the accessible name of an `SRating` item, e.g. "Rating 3". */
  rating: string
  /** Group of preset colors in `SColorPicker`. */
  colorSwatches: string
  /** Hidden accessible name of a dialog without a visible title. */
  dialogLabel: string
  /** Hidden accessible name of a drawer without a visible title. */
  drawerLabel: string
  /** Hidden accessible name of an alert dialog without a visible title. */
  alertDialogLabel: string
  /** Default label of the confirm button (`SAlertDialog`). */
  confirm: string
  /** Default label of the cancel button (`SAlertDialog`). */
  cancel: string
  /** Accessible name of the breadcrumb navigation (`SBreadcrumb`). */
  breadcrumb: string
  /** Accessible name of the color panel (`SColorPicker`). */
  colorPicker: string
  /** Accessible name of the button that opens the palette (`SColorPicker`). */
  pickColor: string
  /** Hidden label of the completed-step mark (`SStepper`). */
  stepCompleted: string
  /** Accessible name of the notification region (`ToastProvider`). */
  notifications: string
  /** Word a screen reader says before each notification it announces (`ToastProvider`). */
  notification: string
  /** Accessible name of a resize handle between panels (`SSplitter`). */
  resize: string
  /** Accessible name of the range start thumb (`SSlider`). */
  rangeStart: string
  /** Accessible name of the range end thumb (`SSlider`). */
  rangeEnd: string
  /** Placeholder shown when `SAutocomplete` has no suggestions. */
  autocompleteEmpty: string
  /** Hidden label of a loading state (`SAutocomplete` suggestions, indeterminate `SProgress`). */
  loading: string
  /** Accessible name of the button that scrolls back to the top (`SBackTop`). */
  backToTop: string
  /** Default title of an `SEmptyState` without its own text. */
  noData: string
  /** Button that reveals the value of a password `SInput`. */
  showPassword: string
  /** Button that hides the value of a password `SInput`. */
  hidePassword: string
  /** Button that opens the file dialog (`SFileUpload`). */
  chooseFiles: string
  /** Hint inside the `SFileUpload` drop zone. */
  dropFilesHint: string
  /** Button that removes a file from the `SFileUpload` list. */
  removeFile: string
  /** `SFileUpload` rejection: the file is over the limit; `{max}` is the readable size. */
  fileTooLarge: string
  /** `SFileUpload` rejection: the file does not match `accept`. */
  fileTypeRejected: string
  /** `SFileUpload` rejection: more files than `maxFiles` allows; `{max}` is the limit. */
  tooManyFiles: string
  /** Button that starts editing (`SEditable`). */
  edit: string
  /** Button that commits an edit (`SEditable`). */
  save: string
  /** Button that opens the time panel (`STimePicker`). */
  openTimePicker: string
  /** Hidden label of an upward trend (`SStat`). */
  trendUp: string
  /** Hidden label of a downward trend (`SStat`). */
  trendDown: string
  /** Placeholder of the `SCommandPalette` search field. */
  searchCommands: string
  /** Button that expands a collapsed `SSidebar`. */
  expandSidebar: string
  /** Button that collapses an expanded `SSidebar`. */
  collapseSidebar: string
  /** Button that opens the fan of actions of an `SFab`. */
  showActions: string
  /** Error of the `required()` rule. */
  ruleRequired: string
  /** Error of `minLength()` for text; `{min}` is the limit. */
  ruleMinLength: string
  /** Error of `maxLength()` for text; `{max}` is the limit. */
  ruleMaxLength: string
  /** Error of `minLength()` for a list (tags, multiple select); `{min}` is the limit. */
  ruleMinItems: string
  /** Error of `maxLength()` for a list; `{max}` is the limit. */
  ruleMaxItems: string
  /** Error of the `min()` rule; `{min}` is the limit. */
  ruleMin: string
  /** Error of the `max()` rule; `{max}` is the limit. */
  ruleMax: string
  /** Error of the `pattern()` rule. */
  rulePattern: string
  /** Error of the `email()` rule. */
  ruleEmail: string
  /** Error shown when a rule throws or its Promise rejects. */
  ruleFailed: string
}

/** Built-in English dictionary (the default). */
export const enMessages: SMessages = {
  close: 'Close',
  clear: 'Clear',
  showOptions: 'Show options',
  selectEmpty: 'No results found',
  decrement: 'Decrease',
  increment: 'Increase',
  openCalendar: 'Open calendar',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  calendar: 'Calendar',
  prevPage: 'Previous page',
  nextPage: 'Next page',
  page: 'Page',
  pagination: 'Pagination',
  pinCell: 'Character {index} of {length}',
  removeTag: 'Remove tag',
  rating: 'Rating',
  colorSwatches: 'Color swatches',
  dialogLabel: 'Dialog',
  drawerLabel: 'Panel',
  alertDialogLabel: 'Confirmation',
  confirm: 'Confirm',
  cancel: 'Cancel',
  breadcrumb: 'Breadcrumb',
  colorPicker: 'Color picker',
  pickColor: 'Pick a color',
  stepCompleted: 'Completed',
  notifications: 'Notifications',
  notification: 'Notification',
  resize: 'Resize',
  rangeStart: 'start',
  rangeEnd: 'end',
  autocompleteEmpty: 'Nothing found',
  loading: 'Loading',
  backToTop: 'Back to top',
  noData: 'No data',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  chooseFiles: 'Choose files',
  dropFilesHint: 'Drop files here or click to choose',
  removeFile: 'Remove file',
  fileTooLarge: 'The file is larger than {max}',
  fileTypeRejected: 'This file type is not accepted',
  tooManyFiles: 'Too many files ({max} at most)',
  edit: 'Edit',
  save: 'Save',
  openTimePicker: 'Open time picker',
  trendUp: 'Up',
  trendDown: 'Down',
  searchCommands: 'Search commands',
  expandSidebar: 'Expand sidebar',
  collapseSidebar: 'Collapse sidebar',
  showActions: 'Show actions',
  ruleRequired: 'This field is required',
  ruleMinLength: 'Enter at least {min} characters',
  ruleMaxLength: 'Enter no more than {max} characters',
  ruleMinItems: 'Select at least {min}',
  ruleMaxItems: 'Select no more than {max}',
  ruleMin: 'Must be at least {min}',
  ruleMax: 'Must be no more than {max}',
  rulePattern: 'Invalid format',
  ruleEmail: 'Enter a valid email address',
  ruleFailed: 'The value could not be checked',
}

/** Identifier of a built-in locale. Other languages are supplied through `messages`. */
export type SLocale = 'en'

const BUILTIN_LOCALES: Record<SLocale, SMessages> = {
  en: enMessages,
}

export interface ProvideLocaleOptions {
  /** Built-in base locale (`'en'` by default). */
  locale?: SLocale
  /** Partial override of individual strings on top of the base locale. */
  messages?: Partial<SMessages>
}

const MESSAGES_KEY: InjectionKey<ComputedRef<SMessages>> = Symbol('smalt-messages')
const LOCALE_KEY: InjectionKey<ComputedRef<SLocale>> = Symbol('smalt-locale')

/**
 * Formatting locale for dates and times. `SLocale` is the UI language, while `Intl` and
 * `@internationalized/date` expect a BCP 47 tag: without a region the date format is undefined.
 */
const FORMAT_LOCALES: Record<SLocale, string> = {
  en: 'en-US',
}

/**
 * Provides the string dictionary (base locale + partial `messages`, may be reactive) to a
 * subtree and returns it. Without an explicit `locale` the base is the dictionary provided
 * above: otherwise a `ConfigProvider` added only for prop defaults would reset the
 * application's strings back to the built-in ones.
 */
export function provideLocale(
  source: MaybeRefOrGetter<ProvideLocaleOptions | undefined> = {},
): ComputedRef<SMessages> {
  const inherited = inject<ComputedRef<SMessages> | null>(MESSAGES_KEY, null)
  const inheritedLocale = inject<ComputedRef<SLocale> | null>(LOCALE_KEY, null)
  const messages = computed<SMessages>(() => {
    const opts = toValue(source) ?? {}
    const base = opts.locale
      ? (BUILTIN_LOCALES[opts.locale] ?? enMessages)
      : (inherited?.value ?? enMessages)
    return { ...base, ...opts.messages }
  })
  provide(MESSAGES_KEY, messages)
  provide(
    LOCALE_KEY,
    computed(() => toValue(source)?.locale ?? inheritedLocale?.value ?? 'en'),
  )
  return messages
}

/**
 * Returns the computed dictionary of library strings; without a `ConfigProvider`/`provideLocale`
 * above, the built-in English one. Components take their accessible names from here:
 * `:aria-label="closeLabel ?? m.close"`.
 */
export function useMessages(): ComputedRef<SMessages> {
  return inject(
    MESSAGES_KEY,
    computed(() => enMessages),
  )
}

/**
 * Provides the string dictionary to the whole Vue application (`app.provide`) — an alternative
 * to `ConfigProvider` without a wrapper in the template. The Nuxt module uses it; in a plain
 * application call it once: `installLocale(app, { messages: { close: 'Schließen' } })`.
 */
export function installLocale(app: App, options: ProvideLocaleOptions = {}): void {
  const base = BUILTIN_LOCALES[options.locale ?? 'en'] ?? enMessages
  app.provide(
    MESSAGES_KEY,
    computed(() => ({ ...base, ...options.messages })),
  )
  app.provide(
    LOCALE_KEY,
    computed(() => options.locale ?? 'en'),
  )
}

/**
 * The current library locale, as chosen by `ConfigProvider`/`installLocale` (English by
 * default). `useMessages` returns the dictionary; this returns the identifier itself, which an
 * application can use, for example, to pick its own formats.
 */
export function useLocale(): ComputedRef<SLocale> {
  return inject(
    LOCALE_KEY,
    computed(() => 'en' as SLocale),
  )
}

/**
 * Formatting locale for date/time components: the component's `locale` prop, or else the
 * BCP 47 tag derived from the library locale.
 */
export function useFormatLocale(prop: () => string | undefined): ComputedRef<string> {
  const locale = useLocale()
  return computed(() => prop() ?? FORMAT_LOCALES[locale.value] ?? FORMAT_LOCALES.en)
}
