<template>
  <div ref="root" class="effect">
    <h1 class="effect__title">Effect Template</h1>
    <p class="effect__description">
      Duplicate this folder and rename it to create a new effect.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { useGsap } from '@/composables/useGsap'

const root = ref<HTMLElement>()

useGsap(() => {
  gsap.from('.effect__title', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  })
})
</script>

<style lang="scss" scoped>
.effect {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-lg;
}

.effect__title {
  font-size: $font-size-3xl;
}

.effect__description {
  font-size: $font-size-lg;
  color: $color-text-secondary;
}
</style>
