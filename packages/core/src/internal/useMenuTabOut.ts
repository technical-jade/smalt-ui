/**
 * Tab out of a non-modal menu. Reka lets the browser move focus to the end of the document and
 * does not return it, since focus "left on its own". Focus goes back to where it was before the
 * menu opened, and the browser's Tab carries on from there: the menu closes on focus outside and
 * focus lands next to the trigger, as the APG menu button pattern expects.
 */
export function useMenuTabOut(isModal: () => boolean) {
  let returnTo: HTMLElement | null = null

  function onOpenChange(open: boolean) {
    if (open && document.activeElement instanceof HTMLElement) returnTo = document.activeElement
  }

  function onKeydown(event: KeyboardEvent) {
    // A modal menu traps Tab itself.
    if (event.key !== 'Tab' || isModal() || !returnTo?.isConnected) return
    returnTo.focus()
  }

  return { onOpenChange, onKeydown }
}
