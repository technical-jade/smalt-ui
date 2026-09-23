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

/** Cmd or Ctrl plus the key. Shift and Alt make it a different shortcut, so they must be off. */
export function matchesShortcut(event: KeyboardEvent, key: string): boolean {
  if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return false
  return event.key.toLowerCase() === key.toLowerCase()
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
