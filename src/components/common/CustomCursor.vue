<template>
  <div v-if="!isTouch" ref="cursorRef" class="cursor" aria-hidden="true">
    <div ref="dotRef" class="cursor__dot" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const cursorRef = ref<HTMLElement>()
const dotRef = ref<HTMLElement>()

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

let xTo: gsap.QuickToFunc
let yTo: gsap.QuickToFunc

const interactiveSelectors = 'a, button, input, textarea, [data-cursor]'

function onMouseMove(e: MouseEvent) {
  xTo(e.clientX)
  yTo(e.clientY)
}

function onMouseEnterInteractive() {
  dotRef.value?.classList.add('is-hovering')
}

function onMouseLeaveInteractive() {
  dotRef.value?.classList.remove('is-hovering')
}

function onMouseOver(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest(interactiveSelectors)) {
    onMouseEnterInteractive()
  }
}

function onMouseOut(e: MouseEvent) {
  const target = e.target as HTMLElement
  const related = e.relatedTarget as HTMLElement | null
  if (
    target.closest(interactiveSelectors) &&
    !related?.closest(interactiveSelectors)
  ) {
    onMouseLeaveInteractive()
  }
}

onMounted(() => {
  if (isTouch || !cursorRef.value || !dotRef.value) return

  document.documentElement.classList.add('has-custom-cursor')

  xTo = gsap.quickTo(cursorRef.value, 'x', {
    duration: 0.15,
    ease: 'power2.out',
  })
  yTo = gsap.quickTo(cursorRef.value, 'y', {
    duration: 0.15,
    ease: 'power2.out',
  })

  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseover', onMouseOver)
  document.addEventListener('mouseout', onMouseOut)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('has-custom-cursor')
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseover', onMouseOver)
  document.removeEventListener('mouseout', onMouseOut)
})
</script>

<style lang="scss" scoped>
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.cursor__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: $color-accent;
  transition:
    width $duration-base $ease-out-expo,
    height $duration-base $ease-out-expo,
    background-color $duration-base,
    opacity $duration-base;
  mix-blend-mode: difference;

  &.is-hovering {
    width: 48px;
    height: 48px;
    opacity: 0.6;
  }
}
</style>
