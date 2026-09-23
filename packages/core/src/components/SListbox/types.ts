export interface SListboxOption {
  /** Visible option text. */
  label: string
  /** Value written to the model when the option is selected. */
  value: string
  /** Disables the option: it cannot be selected and keyboard navigation skips it. */
  disabled?: boolean
  /** Leading option icon (a registry name or a raw path), drawn before the label. */
  icon?: string
}

export type SListboxSize = 'sm' | 'md' | 'lg'

export type SListboxSelectionBehavior = 'toggle' | 'replace'

export interface SListboxProps {
  /** List of options. */
  options: readonly SListboxOption[]
  /** Option row size: `sm` (32px), `md` (40px), or `lg` (48px). */
  size?: SListboxSize
  /**
   * Multiple selection. `modelValue` becomes `string[]`, and the list reports itself as
   * multi-selectable to assistive technology.
   */
  multiple?: boolean
  /**
   * How picking an option changes the selection. `toggle` (the default) flips the option:
   * picking a selected one clears it, which is how checkbox-like lists behave. `replace` keeps
   * exactly one pick per action — a click always wins over the previous selection, and with
   * `multiple` Shift with the arrow keys, `Home` or `End` extends the range from the last pick.
   * The range is a keyboard gesture only: a Shift-click is an ordinary click.
   */
  selectionBehavior?: SListboxSelectionBehavior
  /**
   * Accessible name of the list. A listbox has no visible label of its own, so either set this
   * or point `aria-labelledby` at your own heading.
   */
  label?: string
  /** Text shown when `options` is empty (taken from the locale dictionary by default). */
  emptyText?: string
  /**
   * Height the list is allowed to grow to before it starts scrolling; a number means pixels.
   * Without it the list is as tall as its options.
   */
  maxHeight?: string | number
  /** Square corners: removes the list border rounding (rounded by default). */
  square?: boolean
  /** Disables the whole list: no option can be picked or focused. */
  disabled?: boolean
}
