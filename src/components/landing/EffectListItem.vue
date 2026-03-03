<template>
  <RouterLink
    :to="`/effect/${effect.slug}`"
    class="effect-item"
    @mouseenter="$emit('previewEnter', effect)"
    @mouseleave="onLeave"
    @mousemove="magnetic.onMove"
  >
    <span class="effect-item__index">
      {{ String(index + 1).padStart(2, '0') }}
    </span>

    <span ref="titleRef" class="effect-item__title">
      {{ effect.meta.title }}
    </span>

    <span class="effect-item__tech">
      <span
        v-for="tech in effect.meta.tech"
        :key="tech"
        class="effect-item__badge"
      >
        {{ tech }}
      </span>
    </span>

    <span class="effect-item__arrow" aria-hidden="true">&#8599;</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { EffectMeta } from '@/types/effect'
import { useMagnetic } from '@/composables/useMagnetic'

defineProps<{
  effect: { slug: string; meta: EffectMeta }
  index: number
}>()

const emit = defineEmits<{
  previewEnter: [effect: { slug: string; meta: EffectMeta }]
  previewLeave: []
}>()

const titleRef = ref<HTMLElement>()
const magnetic = useMagnetic(titleRef, { strength: 0.25 })

function onLeave() {
  emit('previewLeave')
  magnetic.onReset()
}
</script>

<style lang="scss" scoped>
.effect-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: $space-sm;
  padding: $space-md 0;
  border-top: 1px solid $color-border;
  cursor: pointer;

  @include bp($bp-sm) {
    grid-template-columns: 36px 1fr auto;
    gap: $space-md;
  }

  @include bp($bp-md) {
    grid-template-columns: 48px 1fr auto auto;
    gap: $space-lg;
    padding: $space-lg 0;
  }

  &:last-child {
    border-bottom: 1px solid $color-border;
  }

  @include hover {
    .effect-item__index {
      color: $color-accent;
    }

    .effect-item__title {
      color: $color-text-primary;
    }

    .effect-item__badge {
      border-color: $color-text-muted;
      color: $color-text-secondary;
    }

    .effect-item__arrow {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
}

.effect-item__index {
  font-family: $font-mono;
  font-size: $font-size-xs;
  color: $color-text-muted;
  transition: color $duration-base $ease-out-expo;
  display: none;

  @include bp($bp-sm) {
    display: block;
    font-size: $font-size-sm;
  }
}

.effect-item__title {
  font-family: $font-display;
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text-secondary;
  will-change: transform;
  transition: color $duration-base $ease-out-expo;

  @include bp($bp-sm) {
    font-size: clamp($font-size-lg, 3vw, $font-size-2xl);
  }
}

.effect-item__tech {
  display: none;

  @include bp($bp-md) {
    display: flex;
    gap: $space-xs;
  }
}

.effect-item__badge {
  font-family: $font-mono;
  font-size: $font-size-xs;
  padding: 2px 10px;
  border: 1px solid $color-border;
  border-radius: 4px;
  color: $color-text-muted;
  white-space: nowrap;
  transition:
    border-color $duration-base $ease-out-expo,
    color $duration-base $ease-out-expo;
}

.effect-item__arrow {
  font-size: $font-size-base;
  color: $color-accent;

  @include touch-only {
    opacity: 0.5;
    transform: translate(0, 0);
  }

  @include hover {
    opacity: 0;
    transform: translate(-8px, 8px);
  }

  transition:
    opacity $duration-base $ease-out-expo,
    transform $duration-base $ease-out-expo;

  @include bp($bp-md) {
    font-size: $font-size-lg;
  }
}
</style>
