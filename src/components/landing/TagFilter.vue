<template>
  <div class="tags">
    <button
      v-for="tag in displayTags"
      :key="tag"
      class="tags__item"
      :class="{ 'is-active': modelValue === tag }"
      @click="$emit('update:modelValue', tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tags: string[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [tag: string]
}>()

const displayTags = computed(() => ['All', ...props.tags])
</script>

<style lang="scss" scoped>
.tags {
  display: flex;
  gap: $space-xs;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: $space-xs;

  &::-webkit-scrollbar {
    display: none;
  }

  @include bp($bp-md) {
    flex-wrap: wrap;
    overflow-x: visible;
    padding-bottom: 0;
  }
}

.tags__item {
  padding: $space-xs $space-md;
  font-family: $font-mono;
  font-size: $font-size-xs;
  color: $color-text-muted;
  border: 1px solid $color-border;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  flex-shrink: 0;
  transition:
    color $duration-fast $ease-out-expo,
    border-color $duration-fast $ease-out-expo,
    background-color $duration-fast $ease-out-expo;

  @include hover {
    color: $color-text-secondary;
    border-color: $color-text-muted;
  }

  &.is-active {
    color: $color-bg;
    background-color: $color-accent;
    border-color: $color-accent;
  }
}
</style>
