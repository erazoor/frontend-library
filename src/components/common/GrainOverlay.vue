<template>
  <div class="grain" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvasDataUrl = ref('')

onMounted(() => {
  const canvas = document.createElement('canvas')
  const size = 256
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(size, size)

  for (let i = 0; i < imageData.data.length; i += 4) {
    const value = Math.random() * 255
    imageData.data[i] = value
    imageData.data[i + 1] = value
    imageData.data[i + 2] = value
    imageData.data[i + 3] = 255
  }

  ctx.putImageData(imageData, 0, 0)
  canvasDataUrl.value = canvas.toDataURL('image/png')

  const el = document.querySelector('.grain') as HTMLElement
  if (el) {
    el.style.backgroundImage = `url(${canvasDataUrl.value})`
  }
})
</script>

<style lang="scss" scoped>
.grain {
  position: fixed;
  inset: -100%;
  width: 300%;
  height: 300%;
  background-repeat: repeat;
  background-size: 256px 256px;
  opacity: 0.035;
  pointer-events: none;
  z-index: 9999;
  animation: grain-drift 6s steps(8) infinite;
}

@keyframes grain-drift {
  0%,
  100% { transform: translate(0, 0); }
  12% { transform: translate(-5%, -8%); }
  25% { transform: translate(-12%, 4%); }
  37% { transform: translate(6%, -20%); }
  50% { transform: translate(-4%, 18%); }
  62% { transform: translate(-10%, 8%); }
  75% { transform: translate(12%, -2%); }
  87% { transform: translate(2%, 12%); }
}
</style>
