type ShortcutHandler = (event: KeyboardEvent) => void

/**
 * One document listener serves every mounted palette. Two palettes bound to the same key would
 * both open and stack their dialogs, so only the innermost — the most recently mounted — is
 * called; unmounting it hands the key back to the one before.
 */
const handlers: ShortcutHandler[] = []

function onKeydown(event: KeyboardEvent) {
  handlers.at(-1)?.(event)
}

export function bindShortcut(handler: ShortcutHandler): () => void {
  if (!handlers.length) document.addEventListener('keydown', onKeydown)
  handlers.push(handler)

  return () => {
    const index = handlers.lastIndexOf(handler)
    if (index !== -1) handlers.splice(index, 1)
    if (!handlers.length) document.removeEventListener('keydown', onKeydown)
  }
}

/** Physical key of a Latin letter or digit: `k` → `KeyK`, `1` → `Digit1`. */
function keyCode(key: string): string | undefined {
  if (/^[a-z]$/i.test(key)) return `Key${key.toUpperCase()}`
  if (/^\d$/.test(key)) return `Digit${key}`
  return undefined
}

/**
 * Cmd or Ctrl plus the key, without Shift and Alt: they make it a different shortcut. On a
 * non-Latin layout (Ctrl+K on a Greek one arrives as "κ") the physical key `event.code` is
 * compared; on a Latin layout only `event.key` is, because Dvorak or AZERTY put the letter
 * somewhere other than QWERTY does.
 */
export function matchesShortcut(event: KeyboardEvent, key: string): boolean {
  if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return false
  if (event.key.toLowerCase() === key.toLowerCase()) return true
  const isLatin = /^[\x20-\x7e]$/.test(event.key)
  return !isLatin && event.key.length === 1 && event.code === keyCode(key)
}

/**
 * Whether the keystroke belongs to text the user is writing. A field may bind the same
 * combination for its own editing command, and taking it away mid-sentence is worse than
 * asking for one extra click to open the palette.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'
}
