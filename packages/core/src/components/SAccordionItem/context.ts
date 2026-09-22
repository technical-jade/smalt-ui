import type { InjectionKey, Ref } from 'vue'
import type { SAccordionHeadingLevel } from './types'

export const accordionHeadingLevelKey: InjectionKey<Ref<SAccordionHeadingLevel>> = Symbol(
  'smalt-accordion-heading-level',
)
