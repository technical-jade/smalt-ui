import { z } from 'zod'
import { describe, expectTypeOf, it } from 'vitest'
import type { ComputedRef } from 'vue'
import {
  createTheme,
  max,
  min,
  required,
  schemaRule,
  SForm,
  useColorMode,
  useConfirm,
  useMessages,
  useValidation,
} from '../index'
import type {
  ColorMode,
  ColorScheme,
  ConfigProviderProps,
  SBadgeVariant,
  SCardProps,
  SCheckboxProps,
  SConfirmOptions,
  SDatePickerProps,
  SDateRangePickerProps,
  SElevation,
  SFormFieldSlotProps,
  SFormValidateResult,
  SInputProps,
  SInputSize,
  SLocale,
  SMessages,
  SNumberFieldProps,
  SAutocompleteOption,
  SAutocompleteProps,
  SDropdownMenuOption,
  SDropdownMenuProps,
  SRadioGroupProps,
  SRadioOption,
  SRatingProps,
  SRule,
  SSelectOption,
  SSelectProps,
  SStepperItem,
  SStepperProps,
  SSwitchProps,
  STabsProps,
  STreeItem,
  STreeProps,
  STabItem,
  STagProps,
  StandardSchemaV1,
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

describe('validation types', () => {
  it('a rule narrower than the field model still fits (bivariant SRule)', () => {
    const rule: SRule<string> = (v) => v.length > 0 || 'Required'
    const props: SInputProps = { rules: [rule, required()] }
    expectTypeOf(props.rules).toEqualTypeOf<readonly SRule<string | string[]>[] | undefined>()
  })

  it('a readonly (e.g. `as const`) rules array is accepted', () => {
    const rules = [required()] as const
    const props: SInputProps = { rules }
    void props
  })

  it('a rule may not return false', () => {
    // @ts-expect-error false is not a valid SRuleResult
    const bad: SRule<string> = () => false
    void bad
  })

  it('required() fits every validated field, whatever its value type', () => {
    const inputProps: SInputProps = { rules: [required()] }
    const selectProps: SSelectProps = { options: [], rules: [required()] }
    const numberProps: SNumberFieldProps = { rules: [required()] }
    const datePickerProps: SDatePickerProps = { rules: [required()] }
    const dateRangePickerProps: SDateRangePickerProps = { rules: [required()] }
    const checkboxProps: SCheckboxProps = { rules: [required()] }
    const switchProps: SSwitchProps = { rules: [required()] }
    const ratingProps: SRatingProps = { rules: [required()] }
    void inputProps
    void selectProps
    void numberProps
    void datePickerProps
    void dateRangePickerProps
    void checkboxProps
    void switchProps
    void ratingProps
  })

  it('min()/max() accept both a number and a numeric string', () => {
    const numberRule: SRule<number> = min(0)
    const stringRule: SRule<string> = max(100)
    expectTypeOf(numberRule).not.toBeAny()
    expectTypeOf(stringRule).not.toBeAny()
  })

  it('schemaRule infers the input type from a Standard Schema', () => {
    expectTypeOf(schemaRule(z.string())).toEqualTypeOf<SRule<string>>()

    const literalSchema: StandardSchemaV1<number> = {
      '~standard': {
        version: 1,
        vendor: 'x',
        validate: (v) => ({ value: v as number }),
      },
    }
    expectTypeOf(schemaRule(literalSchema)).toEqualTypeOf<SRule<number>>()
  })

  it('useValidation exposes validate/resetValidation/errorMessage', () => {
    expectTypeOf(useValidation<string>).returns.toHaveProperty('validate')
    expectTypeOf(useValidation<string>).returns.toHaveProperty('resetValidation')
    expectTypeOf(useValidation<string>).returns.toHaveProperty('errorMessage')
    expectTypeOf(useValidation<string>({ value: '' }).validate).returns.toEqualTypeOf<
      Promise<boolean>
    >()
  })

  it("SForm's exposed validate() resolves to SFormValidateResult", () => {
    type SFormInstance = InstanceType<typeof SForm>
    expectTypeOf<SFormInstance['validate']>().returns.toEqualTypeOf<Promise<SFormValidateResult>>()
    expectTypeOf<SFormValidateResult['errors'][number]['messages']>().toEqualTypeOf<string[]>()
  })
})
