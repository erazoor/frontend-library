<template>
  <Preloader @complete="onPreloaderComplete" />
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Preloader from '@/components/common/Preloader.vue'
import { initLenis } from '@/composables/useLenis'

const isReady = ref(false)
provide('isReady', isReady)

onMounted(() => {
  initLenis()
})

function onPreloaderComplete() {
  isReady.value = true
}
</script>
