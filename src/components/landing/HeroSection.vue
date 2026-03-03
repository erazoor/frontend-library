<template>
  <section ref="heroRef" class="hero">
    <div class="hero__bg" aria-hidden="true" />

    <div class="hero__content">
      <h1 ref="titleLine1" class="hero__title">FRONT</h1>
      <h1 ref="titleLine2" class="hero__title">LIBRARY</h1>

      <p ref="subtitleRef" class="hero__subtitle">
        A curated collection of stunning frontend effects & interactions.
      </p>
    </div>

    <div ref="scrollIndicator" class="hero__scroll">
      <span class="hero__scroll-text">Scroll to explore</span>
      <span class="hero__scroll-line" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, inject, onMounted, onBeforeUnmount, type Ref } from 'vue'
import gsap from 'gsap'
import { useSplitText } from '@/composables/useSplitText'

const isReady = inject<Ref<boolean>>('isReady', ref(true))

const titleLine1 = ref<HTMLElement>()
const titleLine2 = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const scrollIndicator = ref<HTMLElement>()

const { chars: chars1 } = useSplitText(titleLine1)
const { chars: chars2 } = useSplitText(titleLine2)

let xTo1: gsap.QuickToFunc
let yTo1: gsap.QuickToFunc
let xTo2: gsap.QuickToFunc
let yTo2: gsap.QuickToFunc
let xToSub: gsap.QuickToFunc
let yToSub: gsap.QuickToFunc
let parallaxActive = false

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

function onMouseMove(e: MouseEvent) {
  if (!parallaxActive) return
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  const ox = (e.clientX - cx) / cx
  const oy = (e.clientY - cy) / cy

  xTo1(ox * 18)
  yTo1(oy * 10)
  xTo2(ox * -22)
  yTo2(oy * -14)
  xToSub(ox * 8)
  yToSub(oy * 5)
}

function startParallax() {
  if (isTouch || !titleLine1.value || !titleLine2.value || !subtitleRef.value) return

  const opts = { duration: 0.8, ease: 'power2.out' as const }
  xTo1 = gsap.quickTo(titleLine1.value, 'x', opts)
  yTo1 = gsap.quickTo(titleLine1.value, 'y', opts)
  xTo2 = gsap.quickTo(titleLine2.value, 'x', opts)
  yTo2 = gsap.quickTo(titleLine2.value, 'y', opts)
  xToSub = gsap.quickTo(subtitleRef.value, 'x', opts)
  yToSub = gsap.quickTo(subtitleRef.value, 'y', opts)

  parallaxActive = true
  window.addEventListener('mousemove', onMouseMove)
}

function playEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

  tl.from(chars1.value, {
    y: '110%',
    rotateX: -80,
    stagger: 0.04,
    duration: 1.2,
  })
    .from(
      chars2.value,
      {
        y: '110%',
        rotateX: -80,
        stagger: 0.04,
        duration: 1.2,
      },
      0.15,
    )
    .from(
      subtitleRef.value!,
      {
        y: 30,
        opacity: 0,
        duration: 1,
      },
      0.8,
    )
    .from(
      scrollIndicator.value!,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
      },
      1.2,
    )
    .call(startParallax, [], 1.5)
}

onMounted(() => {
  if (isReady.value) {
    playEntrance()
  }
})

watch(isReady, (ready) => {
  if (ready) playEntrance()
})

onBeforeUnmount(() => {
  parallaxActive = false
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    width: 50%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      ellipse,
      rgba($color-accent, 0.06) 0%,
      transparent 70%
    );
  }
}

.hero__content {
  text-align: center;
  padding-inline: $space-md;

  @include bp($bp-md) {
    padding-inline: $container-padding;
  }
}

.hero__title {
  font-family: $font-display;
  font-size: clamp(2.5rem, 14vw, 12rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: $color-text-primary;
  perspective: 600px;
  will-change: transform;
}

.hero__subtitle {
  margin-top: $space-lg;
  font-size: clamp($font-size-sm, 2vw, $font-size-lg);
  color: $color-text-secondary;
  max-width: 480px;
  margin-inline: auto;
  line-height: 1.6;
  padding-inline: $space-sm;
  will-change: transform;

  @include bp($bp-md) {
    margin-top: $space-xl;
    padding-inline: 0;
  }
}

.hero__scroll {
  position: absolute;
  bottom: $space-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;

  @include bp($bp-md) {
    bottom: $space-3xl;
  }
}

.hero__scroll-text {
  font-family: $font-mono;
  font-size: $font-size-xs;
  color: $color-text-muted;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.hero__scroll-line {
  display: block;
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, $color-text-muted, transparent);
  animation: scroll-pulse 2s ease-in-out infinite;

  @include bp($bp-md) {
    height: 48px;
  }
}

@keyframes scroll-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.3;
    transform: scaleY(0.6);
  }
}
</style>
