<template>
  <section ref="catalogRef" class="catalog">
    <div class="catalog__header">
      <h2 class="catalog__heading">Effects</h2>
      <span class="catalog__count">{{ filteredEffects.length }} effects</span>
    </div>

    <div class="catalog__controls">
      <div class="catalog__search">
        <svg class="catalog__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="catalog__search-input"
          placeholder="Search effects..."
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        />
      </div>
      <TagFilter v-model="activeTag" :tags="allTags" />
    </div>

    <div v-if="filteredEffects.length" class="catalog__list">
      <EffectListItem
        v-for="(effect, i) in filteredEffects"
        :key="effect.slug"
        :effect="effect"
        :index="i"
        @preview-enter="onPreviewEnter"
        @preview-leave="onPreviewLeave"
      />
    </div>

    <div v-else class="catalog__empty">
      <p v-if="effects.length === 0" class="catalog__empty-text">
        No effects yet.<br />
        <span class="catalog__empty-hint">
          Create your first one in <code>src/effects/</code>
        </span>
      </p>
      <p v-else class="catalog__empty-text">
        No effects match your search.
      </p>
    </div>

    <!-- Floating effect to wire up TODO -->
    <div
      ref="previewRef"
      class="catalog__preview"
      :class="{ 'is-visible': previewVisible }"
      aria-hidden="true"
    >
      <div
        class="catalog__preview-inner"
        :style="{ background: previewBg }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { EffectMeta } from '@/types/effect'
import TagFilter from './TagFilter.vue'
import EffectListItem from './EffectListItem.vue'

const props = defineProps<{
  effects: { slug: string; meta: EffectMeta }[]
}>()

const previewRef = ref<HTMLElement>()
const activeTag = ref('All')
const searchQuery = ref('')
const isSearchFocused = ref(false)
const previewVisible = ref(false)
const previewBg = ref('')

let xTo: gsap.QuickToFunc
let yTo: gsap.QuickToFunc
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null

const allTags = computed(() => {
  const tags = new Set<string>()
  props.effects.forEach((e) => e.meta.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
})

const filteredEffects = computed(() => {
  let results = props.effects

  if (activeTag.value !== 'All') {
    results = results.filter((e) => e.meta.tags.includes(activeTag.value))
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    results = results.filter(
      (e) =>
        e.meta.title.toLowerCase().includes(query) ||
        e.meta.description.toLowerCase().includes(query) ||
        e.meta.tech.some((t) => t.toLowerCase().includes(query)) ||
        e.meta.tags.some((t) => t.toLowerCase().includes(query)),
    )
  }

  return results
})

function getPlaceholderGradient(slug: string): string {
  const hash = slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue1 = hash % 360
  const hue2 = (hash * 7 + 120) % 360
  return `linear-gradient(135deg, hsl(${hue1}, 60%, 25%), hsl(${hue2}, 70%, 18%))`
}

function onPreviewEnter(effect: { slug: string; meta: EffectMeta }) {
  previewBg.value = effect.meta.thumbnail
    ? `url(${effect.meta.thumbnail}) center/cover`
    : getPlaceholderGradient(effect.slug)
  previewVisible.value = true
}

function onPreviewLeave() {
  previewVisible.value = false
}

const isTouchDevice = typeof window !== 'undefined'
  && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

onMounted(() => {
  if (previewRef.value && !isTouchDevice) {
    xTo = gsap.quickTo(previewRef.value, 'x', {
      duration: 0.5,
      ease: 'power3',
    })
    yTo = gsap.quickTo(previewRef.value, 'y', {
      duration: 0.5,
      ease: 'power3',
    })

    mouseMoveHandler = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    window.addEventListener('mousemove', mouseMoveHandler)
  }

  if (props.effects.length) {
    ScrollTrigger.batch('.effect-item', {
      start: 'top 90%',
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
        })
      },
      once: true,
    })
  }
})

onBeforeUnmount(() => {
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler)
  }
})
</script>

<style lang="scss" scoped>
.catalog {
  @include container;
  padding-block: $space-2xl;
  position: relative;

  @include bp($bp-md) {
    padding-block: $space-4xl;
  }
}

.catalog__header {
  display: flex;
  align-items: baseline;
  gap: $space-sm;
  margin-bottom: $space-lg;

  @include bp($bp-md) {
    gap: $space-md;
    margin-bottom: $space-xl;
  }
}

.catalog__heading {
  font-family: $font-display;
  font-size: $font-size-2xl;
  font-weight: 700;

  @include bp($bp-md) {
    font-size: $font-size-3xl;
  }
}

.catalog__count {
  font-family: $font-mono;
  font-size: $font-size-xs;
  color: $color-text-muted;

  @include bp($bp-md) {
    font-size: $font-size-sm;
  }
}

.catalog__controls {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  margin-bottom: $space-xl;

  @include bp($bp-md) {
    gap: $space-lg;
    margin-bottom: $space-2xl;
  }
}

.catalog__search {
  position: relative;

  @include bp($bp-md) {
    max-width: 360px;
  }
}

.catalog__search-icon {
  position: absolute;
  left: $space-md;
  top: 50%;
  transform: translateY(-50%);
  color: $color-text-muted;
  pointer-events: none;
}

.catalog__search-input {
  width: 100%;
  padding: $space-sm $space-md $space-sm 40px;
  background: transparent;
  border: 1px solid $color-border;
  border-radius: 8px;
  font-family: $font-sans;
  font-size: $font-size-sm;
  color: $color-text-primary;
  outline: none;
  transition: border-color $duration-base $ease-out-expo;

  &::placeholder {
    color: $color-text-muted;
  }

  &:focus {
    border-color: $color-accent;
  }
}

.catalog__list {
  position: relative;
}

.catalog__empty {
  text-align: center;
  padding: $space-2xl $space-md;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;

  @include bp($bp-md) {
    padding: $space-4xl $space-xl;
  }
}

.catalog__empty-text {
  font-size: $font-size-base;
  color: $color-text-muted;
  line-height: 1.8;

  @include bp($bp-md) {
    font-size: $font-size-lg;
  }
}

.catalog__empty-hint {
  font-size: $font-size-sm;
  color: $color-text-muted;

  code {
    font-family: $font-mono;
    color: $color-accent;
    font-size: $font-size-xs;
  }
}

.catalog__preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 180px;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.85);
  transition:
    opacity $duration-base $ease-out-expo,
    transform $duration-base $ease-out-expo;
  display: none;

  @include bp($bp-md) {
    display: block;
  }

  &.is-visible {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.catalog__preview-inner {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid $color-border;
  overflow: hidden;
}
</style>
