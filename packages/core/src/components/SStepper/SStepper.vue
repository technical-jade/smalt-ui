<script setup lang="ts">
import {
  StepperRoot,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
} from 'reka-ui'
import { computed, ref } from 'vue'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import { useStackAt } from '../../internal/useStackAt'
import type { SStepperLabelPlacement, SStepperProps } from './types'

const props = withDefaults(defineProps<SStepperProps>(), {
  orientation: 'horizontal',
  linear: false,
  doneIcon: 'check',
  narrowOrientation: 'vertical',
  activeVariant: 'tonal',
})
const p = useDefaults(props, 'SStepper')

const colorStyle = useColorProp(p, 's-stepper')
const m = useMessages()

const root = ref<HTMLElement | null>(null)
const orientation = useStackAt(root, {
  stackAt: () => p.stackAt,
  wide: () => p.orientation,
  narrow: () => p.narrowOrientation,
})

/**
 * The default depends on the orientation: a horizontal stepper labels steps below, a vertical
 * one on the right. A shared value is impossible here — it would move the label when the
 * orientation changes.
 */
const placement = computed<SStepperLabelPlacement>(
  () => p.labelPlacement ?? (orientation.value === 'vertical' ? 'end' : 'bottom'),
)

/** Current active step (1-based). Two-way binding via `v-model`. */
const model = defineModel<number>({ default: 1 })
</script>

<template>
  <!-- as-child: the root must be our own DOM node — ResizeObserver tracks its width. -->
  <StepperRoot
    v-model="model"
    as-child
    :orientation="orientation"
    :linear="p.linear"
  >
    <div
      ref="root"
      class="s-stepper"
      :class="[
        `s-stepper--${orientation}`,
        `s-stepper--label-${placement}`,
        { 's-stepper--active-filled': p.activeVariant === 'filled' },
      ]"
      :style="colorStyle"
    >
      <StepperItem
        v-for="(item, index) in p.items"
        :key="index"
        :step="index + 1"
        :disabled="item.disabled"
        class="s-stepper__item"
        :class="{ 's-stepper__item--disabled': item.disabled }"
      >
        <StepperTrigger class="s-stepper__trigger">
          <StepperIndicator class="s-stepper__indicator">
            <SIcon
              v-if="item.icon"
              :icon="item.icon"
              :size="20"
            />
            <template v-else>
              <SIcon
                class="s-stepper__check"
                :icon="p.doneIcon"
                :size="20"
                :label="m.stepCompleted"
              />
              <span class="s-stepper__number">{{ index + 1 }}</span>
            </template>
          </StepperIndicator>

          <span class="s-stepper__text">
            <!-- as="div": no h4/p, otherwise host tag styles (e.g. .vp-doc h4) override our
               classes by specificity. Reka roles carry the semantics. -->
            <StepperTitle
              as="div"
              class="s-stepper__title"
              >{{ item.title }}</StepperTitle
            >
            <StepperDescription
              v-if="item.description"
              as="div"
              class="s-stepper__description"
            >
              {{ item.description }}
            </StepperDescription>
          </span>
        </StepperTrigger>

        <StepperSeparator
          v-if="index < p.items.length - 1"
          class="s-stepper__separator"
        />
      </StepperItem>
    </div>
  </StepperRoot>
</template>

<style src="./SStepper.scss" lang="scss"></style>
