import { describe, expectTypeOf, it } from 'vitest'
import type { ComputedRef } from 'vue'
import { createTheme, useColorMode, useConfirm, useMessages } from '../index'
import type {
  ColorMode,
  ColorScheme,
  ConfigProviderProps,
  SBadgeVariant,
  SCardProps,
  SCheckboxProps,
  SConfirmOptions,
  SElevation,
  SFormFieldSlotProps,
  SInputProps,
  SInputSize,
  SLocale,
  SMessages,
  SAutocompleteOption,
  SAutocompleteProps,
  SDropdownMenuOption,
  SDropdownMenuProps,
  SRadioGroupProps,
  SRadioOption,
  SSelectOption,
  SSelectProps,
  SStepperItem,
  SStepperProps,
  STabsProps,
  STreeItem,
  STreeProps,
  STabItem,
  STagProps,
  ThemeTokens,
  UseColorModeReturn,
} from '../index'

describe('@smalt-ui/core public types', () => {
  it('ColorMode and ColorScheme are the expected unions', () => {
    expectTypeOf<ColorMode>().toEqualTypeOf<'light' | 'dark' | 'auto'>()
    expectTypeOf<ColorScheme>().toEqualTypeOf<'light' | 'dark'>()
  })

  it('useColorMode returns the UseColorModeReturn contract', () => {
    expectTypeOf(useColorMode).returns.toEqualTypeOf<UseColorModeReturn>()
  })

  it('createTheme takes ThemeTokens and returns a string', () => {
    expectTypeOf(createTheme).parameter(0).toEqualTypeOf<ThemeTokens>()
    expectTypeOf(createTheme).returns.toEqualTypeOf<string>()
  })

  it('component public types are exported with the expected shape', () => {
    expectTypeOf<SBadgeVariant>().toEqualTypeOf<
      'neutral' | 'primary' | 'positive' | 'warning' | 'negative'
    >()
    expectTypeOf<SRadioOption>().toEqualTypeOf<{
      label: string
      value: string
      disabled?: boolean
    }>()
    expectTypeOf<STabItem>().toEqualTypeOf<{
      value: string
      label: string
      icon?: string
      disabled?: boolean
    }>()
    expectTypeOf<SCheckboxProps['label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<SFormFieldSlotProps>().toMatchTypeOf<{ id: string; invalid: boolean }>()
  })

  it('sizes/variants are the expected unions', () => {
    expectTypeOf<SInputSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
    expectTypeOf<SSelectProps['searchable']>().toEqualTypeOf<boolean | undefined>()
  })

  it('tag/multiple selection modes are exported', () => {
    expectTypeOf<SInputProps['useTags']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<SSelectProps['multiple']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<SSelectProps['useTags']>().toEqualTypeOf<boolean | undefined>()
    // STag composes SBadge → the same variants.
    expectTypeOf<STagProps['variant']>().toEqualTypeOf<SBadgeVariant | undefined>()
    expectTypeOf<STagProps['removable']>().toEqualTypeOf<boolean | undefined>()
  })

  it('i18n: SLocale, SMessages and useMessages have the expected shape', () => {
    expectTypeOf<SLocale>().toEqualTypeOf<'en'>()
    expectTypeOf<SMessages['close']>().toEqualTypeOf<string>()
    expectTypeOf(useMessages).returns.toEqualTypeOf<ComputedRef<SMessages>>()
    expectTypeOf<ConfigProviderProps['messages']>().toEqualTypeOf<Partial<SMessages> | undefined>()
    expectTypeOf<ConfigProviderProps['locale']>().toEqualTypeOf<SLocale | undefined>()
  })

  it('useConfirm exposes only confirm: the queue belongs to ConfirmProvider', () => {
    expectTypeOf(useConfirm()).toEqualTypeOf<{
      confirm: (options: SConfirmOptions) => Promise<boolean>
    }>()
  })

  it('SElevation is the shadow level scale', () => {
    expectTypeOf<SElevation>().toEqualTypeOf<0 | 1 | 2 | 3 | 4 | 5>()
    expectTypeOf<SCardProps['elevation']>().toEqualTypeOf<SElevation | undefined>()
  })

  it('list props accept a readonly lookup declared with `as const`', () => {
    expectTypeOf<readonly SSelectOption[]>().toMatchTypeOf<SSelectProps['options']>()
    expectTypeOf<readonly SAutocompleteOption[]>().toMatchTypeOf<SAutocompleteProps['options']>()
    expectTypeOf<readonly SRadioOption[]>().toMatchTypeOf<SRadioGroupProps['options']>()
    expectTypeOf<readonly SDropdownMenuOption[]>().toMatchTypeOf<SDropdownMenuProps['items']>()
    expectTypeOf<readonly STabItem[]>().toMatchTypeOf<STabsProps['items']>()
    expectTypeOf<readonly SStepperItem[]>().toMatchTypeOf<SStepperProps['items']>()
    expectTypeOf<readonly STreeItem[]>().toMatchTypeOf<STreeProps['items']>()

    const INTERVALS = [{ label: '09:00 — 14:00', value: '09-14' }] as const satisfies readonly {
      label: string
      value: string
    }[]
    expectTypeOf(INTERVALS).toMatchTypeOf<SSelectProps['options']>()
  })
})
