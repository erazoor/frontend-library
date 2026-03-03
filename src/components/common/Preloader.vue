<template>
  <div
    v-if="!dismissed"
    ref="preloaderRef"
    class="preloader"
  >
    <div class="preloader__content">
      <span ref="counterRef" class="preloader__counter">{{ displayCount }}</span>
      <div class="preloader__bar">
        <div ref="barFillRef" class="preloader__bar-fill" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits<{
  complete: []
}>()

const preloaderRef = ref<HTMLElement>()
const barFillRef = ref<HTMLElement>()

const displayCount = ref(0)
const dismissed = ref(false)

onMounted(() => {
  if (!preloaderRef.value || !barFillRef.value) return

  document.body.style.overflow = 'hidden'

  const counter = { value: 0 }

  gsap.to(counter, {
    value: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      displayCount.value = Math.round(counter.value)
    },
  })

  gsap.to(barFillRef.value, {
    scaleX: 1,
    duration: 2.2,
    ease: 'power2.inOut',
  })

  gsap.to(preloaderRef.value, {
    yPercent: -100,
    duration: 1,
    ease: 'power4.inOut',
    delay: 2.5,
    onComplete: () => {
      dismissed.value = true
      document.body.style.overflow = ''
      emit('complete')
    },
  })
})
</script>

<style lang="scss" scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: $color-bg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-lg;
}

.preloader__counter {
  font-family: $font-display;
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 800;
  color: $color-text-primary;
  line-height: 1;
  letter-spacing: -0.04em;
}

.preloader__bar {
  width: clamp(120px, 30vw, 240px);
  height: 2px;
  background: $color-border;
  border-radius: 1px;
  overflow: hidden;
}

.preloader__bar-fill {
  width: 100%;
  height: 100%;
  background: $color-accent;
  transform: scaleX(0);
  transform-origin: left;
}
</style>
