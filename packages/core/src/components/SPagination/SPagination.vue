<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { SButton } from '../SButton'
import { SIcon } from '../SIcon'
import { useDefaults, useMessages } from '../../composables'
import type { SPaginationProps } from './types'

const m = useMessages()

const props = withDefaults(defineProps<SPaginationProps>(), {
  itemsPerPage: 10,
  siblingCount: 1,
  showEdges: false,
  disabled: false,
  prevIcon: 'chevron-left',
  nextIcon: 'chevron-right',
})
const p = useDefaults(props, 'SPagination')

/** Current page (1-based). Two-way binding via `v-model:page`. */
const page = defineModel<number>('page', { default: 1 })

/**
 * Reka does not clamp the page when the page count drops (fewer results after filtering): no
 * button is current and "next" leads further out.
 */
const pageCount = computed(() => Math.max(1, Math.ceil(p.total / p.itemsPerPage)))
watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>

<template>
  <PaginationRoot
    v-model:page="page"
    class="s-pagination"
    :total="p.total"
    :items-per-page="p.itemsPerPage"
    :sibling-count="p.siblingCount"
    :show-edges="p.showEdges"
    :disabled="p.disabled"
    :aria-label="p.ariaLabel ?? m.pagination"
  >
    <PaginationList
      v-slot="{ items }"
      class="s-pagination__list"
    >
      <PaginationPrev as-child>
        <SButton
          variant="outline"
          size="sm"
          :aria-label="p.prevPageLabel ?? m.prevPage"
        >
          <SIcon
            :icon="p.prevIcon"
            :size="16"
          />
        </SButton>
      </PaginationPrev>

      <template
        v-for="(item, i) in items"
        :key="i"
      >
        <PaginationListItem
          v-if="item.type === 'page'"
          :value="item.value"
          as-child
        >
          <SButton
            class="s-pagination__page"
            :variant="item.value === page ? 'primary' : 'ghost'"
            size="sm"
            :aria-label="`${m.page} ${item.value}`"
          >
            {{ item.value }}
          </SButton>
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          class="s-pagination__ellipsis"
          >…</PaginationEllipsis
        >
      </template>

      <PaginationNext as-child>
        <SButton
          variant="outline"
          size="sm"
          :aria-label="p.nextPageLabel ?? m.nextPage"
        >
          <SIcon
            :icon="p.nextIcon"
            :size="16"
          />
        </SButton>
      </PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>

<style src="./SPagination.scss" lang="scss"></style>
