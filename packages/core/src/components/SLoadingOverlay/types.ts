export type SLoadingOverlaySize = 'sm' | 'md' | 'lg'

export interface SLoadingOverlayProps {
  /**
   * Whether the overlay covers its region. The component never changes it: the loading state
   * belongs to the request the consumer is waiting for.
   */
  open?: boolean
  /**
   * Cover the viewport instead of the nearest positioned ancestor. A regular overlay fills the
   * closest positioned parent, so that parent needs `position: relative` — add the
   * `s-loading-overlay-host` class to it.
   */
  fullscreen?: boolean
  /** Text under the spinner. Defaults to the locale dictionary entry (`loading`). */
  label?: string
  /** Keep the label for screen readers only, leaving just the spinner visible. */
  hideLabel?: boolean
  /** Show the spinner above the label. */
  spinner?: boolean
  /** Size of the spinner, the label and the gap between them: `sm`, `md` or `lg`. */
  size?: SLoadingOverlaySize
  /** Blur the covered content behind the backdrop. */
  blur?: boolean
  /**
   * Backdrop opacity, from 0 to 1. Defaults to the `--s-loading-overlay-opacity` variable
   * (`0.9`, and `0.4` with `blur`, where the blur already hides the content).
   */
  opacity?: number
}
