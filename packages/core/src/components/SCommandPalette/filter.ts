import type { SCommandGroup, SCommandItem } from './types'

/**
 * Plain case-insensitive substring match over everything a command can be found by. Fuzzy
 * ranking is deliberately absent: it reorders the rows while the user is still typing, and the
 * highlighted row — the one Enter runs — moves out from under them.
 */
export function matchesCommand(item: SCommandItem, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [item.label, item.description, ...(item.keywords ?? [])].some((text) =>
    text?.toLowerCase().includes(needle),
  )
}

/** Keeps the matching commands and drops the groups left without any. */
export function filterCommandGroups(groups: SCommandGroup[], query: string): SCommandGroup[] {
  if (!query.trim()) return groups
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesCommand(item, query)),
    }))
    .filter((group) => group.items.length > 0)
}
