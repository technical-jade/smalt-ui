import type { SCommandGroup, SCommandItem } from './types'

/**
 * No fuzzy ranking: it reorders the rows while the user is still typing, and the highlighted
 * row — the one Enter runs — moves out from under them.
 */
export function matchesCommand(item: SCommandItem, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [item.label, item.description, ...(item.keywords ?? [])].some((text) =>
    text?.toLowerCase().includes(needle),
  )
}

export function filterCommandGroups(groups: SCommandGroup[], query: string): SCommandGroup[] {
  if (!query.trim()) return groups
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesCommand(item, query)),
    }))
    .filter((group) => group.items.length > 0)
}
