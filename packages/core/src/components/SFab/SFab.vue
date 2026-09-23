<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, useId, useTemplateRef, watch, watchEffect } from 'vue'
import { SButton } from '../SButton'
import { SIcon } from '../SIcon'
import { useDefaults, useMessages } from '../../composables'
import { devWarn } from '../../internal/dev'
import type { SFabAction, SFabProps } from './types'

const props = withDefaults(defineProps<SFabProps>(), {
  size: 'md',
  variant: 'primary',
  position: 'bottom-end',
  direction: 'up',
  openOn: 'click',
})
const p = useDefaults(props, 'SFab')
const m = useMessages()

/** Whether the fan of actions is open. Two-way binding via `v-model:open`. */
const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  /** An action of the fan was picked; receives the action itself. */
  select: [action: SFabAction]
}>()

const menuId = `s-fab-${useId()}`

const hasActions = computed(() => (p.actions?.length ?? 0) > 0)
const isExtended = computed(() => !!p.label)
const isFixed = computed(() => p.position !== 'static')
const isEdgeStart = computed(() => p.position === 'bottom-start' || p.position === 'top-start')
const isVertical = computed(() => p.direction === 'up' || p.direction === 'down')

/**
 * A fan turns the button into a disclosure: it opens the actions instead of performing one, so it
 * is named after what it opens. An extended FAB keeps its visible text as the name — an
 * `aria-label` would hide the words the visitor can read (WCAG "Label in Name").
 */
const fanName = computed(() => p.actionsLabel ?? m.value.showActions)
const toggleName = computed(() => {
  if (p.ariaLabel) return p.ariaLabel
  if (isExtended.value) return undefined
  return hasActions.value ? fanName.value : undefined
})

watchEffect(() => {
  if (!isExtended.value && !toggleName.value) {
    devWarn('[SFab] a circular FAB without an accessible name — set the `ariaLabel` prop.')
  }
})

const ICON_SIZES = { sm: 20, md: 24, lg: 28 } as const
const iconSize = computed(() => ICON_SIZES[p.size] ?? ICON_SIZES.md)

/**
 * Arrow keys follow the fan, not the screen: with `direction: 'up'` the next action lies above
 * the previous one, so ArrowUp walks forward through the list.
 */
const FAN_KEYS = {
  up: { next: 'ArrowUp', prev: 'ArrowDown' },
  down: { next: 'ArrowDown', prev: 'ArrowUp' },
  start: { next: 'ArrowLeft', prev: 'ArrowRight' },
  end: { next: 'ArrowRight', prev: 'ArrowLeft' },
} as const

const root = useTemplateRef<HTMLElement>('root')
const toggle = useTemplateRef<{ $el: HTMLElement | null }>('toggle')

// Disabled actions are skipped: focus on a disabled button is a dead end for the keyboard.
function actionButtons(): HTMLButtonElement[] {
  const buttons = root.value?.querySelectorAll<HTMLButtonElement>('.s-fab__action-button') ?? []
  return Array.from(buttons).filter((button) => !button.disabled)
}

async function openFan(focus: 'first' | 'last' | null) {
  open.value = true
  if (!focus) return
  await nextTick()
  const buttons = actionButtons()
  const button = focus === 'first' ? buttons[0] : buttons.at(-1)
  button?.focus()
}

function closeFan(restoreFocus: boolean) {
  open.value = false
  if (restoreFocus) toggle.value?.$el?.focus()
}

function onToggleClick() {
  if (!hasActions.value) return
  /**
   * In hover mode the click only opens the fan. A touch screen has no hover, but the browser
   * fires `mouseenter` right before `click` on a tap — a toggling click would undo the open the
   * same tap had just triggered.
   */
  if (open.value) {
    if (p.openOn === 'click') closeFan(false)
    return
  }
  void openFan('first')
}

function onKeydown(event: KeyboardEvent) {
  if (!hasActions.value) return

  if (event.key === 'Escape') {
    if (!open.value) return
    event.preventDefault()
    closeFan(true)
    return
  }

  const keys = FAN_KEYS[p.direction]
  const isNext = event.key === keys.next || event.key === 'Home'
  const isPrev = event.key === keys.prev || event.key === 'End'
  if (!isNext && !isPrev) return
  // The fan owns the arrows while it is open, so the page does not scroll underneath it.
  event.preventDefault()

  if (!open.value) {
    void openFan(isNext ? 'first' : 'last')
    return
  }

  const buttons = actionButtons()
  if (!buttons.length) return
  const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
  let index: number
  if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = buttons.length - 1
  else if (isNext) index = current < 0 ? 0 : (current + 1) % buttons.length
  else index = current <= 0 ? buttons.length - 1 : current - 1
  buttons[index]?.focus()
}

// Tabbing out of the fan leaves it open behind the visitor, so leaving focus closes it.
function onFocusout(event: FocusEvent) {
  if (!open.value) return
  const next = event.relatedTarget as Node | null
  if (next && root.value?.contains(next)) return
  closeFan(false)
}

function onPointerEnter() {
  if (p.openOn === 'hover' && hasActions.value && !open.value) void openFan(null)
}

function onPointerLeave() {
  if (p.openOn === 'hover' && open.value) closeFan(false)
}

function onActionClick(action: SFabAction) {
  emit('select', action)
  closeFan(true)
}

function onDocumentPointerDown(event: PointerEvent) {
  if (root.value?.contains(event.target as Node)) return
  closeFan(false)
}

/**
 * The fan is an inline element rather than a portal, so nothing dismisses it on its own. The
 * capture phase catches the press even when the page stops it from bubbling.
 */
watch(open, (value) => {
  if (value) document.addEventListener('pointerdown', onDocumentPointerDown, true)
  else document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <div
    ref="root"
    class="s-fab"
    :class="[
      `s-fab--${p.position}`,
      `s-fab--${p.size}`,
      `s-fab--fan-${p.direction}`,
      {
        's-fab--fixed': isFixed,
        's-fab--edge-start': isEdgeStart,
        's-fab--open': open,
      },
    ]"
    @keydown="onKeydown"
    @focusout="onFocusout"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <Transition name="s-fab-fan">
      <div
        v-if="hasActions && open"
        :id="menuId"
        class="s-fab__actions"
        role="menu"
        :aria-label="fanName"
        :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
      >
        <div
          v-for="action in p.actions"
          :key="action.id"
          class="s-fab__action"
          role="none"
        >
          <!-- The chip repeats the accessible name of the button, so it is decorative. -->
          <span
            class="s-fab__action-label"
            aria-hidden="true"
            >{{ action.label }}</span
          >
          <SButton
            class="s-fab__action-button"
            role="menuitem"
            :tabindex="-1"
            :icon="action.icon"
            icon-only
            round
            :variant="p.variant"
            :color="p.color"
            :size="p.size"
            :disabled="action.disabled"
            :aria-label="action.label"
            @click="onActionClick(action)"
          />
        </div>
      </div>
    </Transition>

    <SButton
      ref="toggle"
      class="s-fab__toggle"
      :class="{ 's-fab__toggle--extended': isExtended }"
      round
      :variant="p.variant"
      :color="p.color"
      :size="p.size"
      :aria-label="toggleName"
      :aria-haspopup="hasActions ? 'menu' : undefined"
      :aria-expanded="hasActions ? open : undefined"
      :aria-controls="hasActions && open ? menuId : undefined"
      @click="onToggleClick"
    >
      <template #leading>
        <SIcon
          :icon="p.icon"
          :size="iconSize"
        />
      </template>
      <template
        v-if="p.label"
        #default
        >{{ p.label }}</template
      >
    </SButton>
  </div>
</template>

<style src="./SFab.scss" lang="scss"></style>
