export type SAvatarSize = 'sm' | 'md' | 'lg'

export interface SAvatarProps {
  /** Image URL. The fallback is shown while there is none or when it fails to load. */
  src?: string
  /** Alternative text of the image. Without it the image is treated as decorative (`alt=""`). */
  alt?: string
  /** Fallback content (usually initials) shown when there is no image. */
  fallback?: string
  /** Size: `sm`/`md`/`lg`. */
  size?: SAvatarSize
  /** Delay before showing the fallback, ms (avoids flicker when the image loads fast). */
  delayMs?: number
}
