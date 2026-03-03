<template>
  <div class="scrollbar" aria-hidden="true">
    <div class="scrollbar__track">
      <div ref="thumbRef" class="scrollbar__thumb" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const thumbRef = ref<HTMLElement>()

let yTo: gsap.QuickToFunc
let scaleTo: gsap.QuickToFunc
let rafId: number

function update() {
  if (!thumbRef.value) return

  const scrollHeight = document.documentElement.scrollHeight
  const viewportHeight = window.innerHeight
  const scrollTop = window.scrollY

  if (scrollHeight <= viewportHeight) return

  const progress = scrollTop / (scrollHeight - viewportHeight)

  const viewRatio = viewportHeight / scrollHeight
  const scale = Math.max(viewRatio * 6, 0.6)

  yTo(progress * 100)
  scaleTo(scale)
}

function onScroll() {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(update)
}

onMounted(() => {
  if (!thumbRef.value) return

  yTo = gsap.quickTo(thumbRef.value, 'yPercent', {
    duration: 0.4,
    ease: 'power2.out',
  })

  scaleTo = gsap.quickTo(thumbRef.value, 'scale', {
    duration: 0.6,
    ease: 'power2.out',
  })

  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', update)
  cancelAnimationFrame(rafId)
})
</script>

<style lang="scss" scoped>
.scrollbar {
  position: fixed;
  right: 24px;
  top: 35%;
  height: 30vh;
  z-index: 9998;
  display: none;

  @include bp($bp-md) {
    display: block;
  }
}

.scrollbar__track {
  width: 3px;
  height: 100%;
  background: rgba($color-text-muted, 0.15);
  border-radius: 2px;
  position: relative;
}

.scrollbar__thumb {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: $color-accent;
  opacity: 0.8;
  transition: opacity $duration-fast;

  .scrollbar:hover & {
    opacity: 1;
  }
}
</style>
