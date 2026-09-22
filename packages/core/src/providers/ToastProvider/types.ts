/** Screen corner where notifications appear. */
export type SToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface ToastProviderProps {
  /**
   * Display duration for all notifications, in ms. Unset, it comes from the `SToast` defaults
   * (5000 unless configured).
   */
  duration?: number
  /**
   * Screen corner where notifications appear (`bottom-right` by default). There is one corner
   * per app, since a single provider instance is expected. The swipe direction follows from it:
   * a notification is swiped toward its own edge.
   */
  position?: SToastPosition
  /** Accessible label of the notification region (defaults to the locale dictionary). */
  label?: string
}
