<template>
  <div class="marquee" aria-hidden="true">
    <div ref="trackRef" class="marquee__track">
      <span v-for="n in 2" :key="n" class="marquee__content">
        <span v-for="(item, i) in items" :key="i" class="marquee__item">
          <span class="marquee__text">{{ item }}</span>
          <span class="marquee__separator">/</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const items = ['EFFECTS', 'INTERACTIONS', 'ANIMATIONS', 'EXPERIMENTS']

const trackRef = ref<HTMLElement>()
let scrollTriggerInstance: ScrollTrigger | null = null
let tweenInstance: gsap.core.Tween | null = null

onMounted(() => {
  if (!trackRef.value) return

  tweenInstance = gsap.to(trackRef.value, {
    xPercent: -50,
    duration: 20,
    ease: 'none',
    repeat: -1,
  })

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const velocity = Math.abs(self.getVelocity()) / 1000
      const speedMultiplier = 1 + Math.min(velocity, 5)
      gsap.to(tweenInstance!, {
        timeScale: speedMultiplier,
        duration: 0.3,
        overwrite: true,
      })
    },
  })
})

onBeforeUnmount(() => {
  tweenInstance?.kill()
  scrollTriggerInstance?.kill()
})
</script>

<style lang="scss" scoped>
.marquee {
  padding: $space-xl 0;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
  overflow: hidden;
  user-select: none;

  @include bp($bp-md) {
    padding: $space-2xl 0;
  }
}

.marquee__track {
  display: flex;
  width: fit-content;
  will-change: transform;
}

.marquee__content {
  display: flex;
  flex-shrink: 0;
}

.marquee__item {
  display: flex;
  align-items: center;
  gap: $space-lg;
  padding-right: $space-lg;

  @include bp($bp-md) {
    gap: $space-xl;
    padding-right: $space-xl;
  }
}

.marquee__text {
  font-family: $font-display;
  font-size: clamp($font-size-xl, 4vw, $font-size-3xl);
  font-weight: 700;
  color: $color-text-primary;
  white-space: nowrap;
  letter-spacing: 0.05em;
}

.marquee__separator {
  font-family: $font-display;
  font-size: clamp($font-size-lg, 3vw, $font-size-2xl);
  color: $color-accent;
  opacity: 0.5;
}
</style>
