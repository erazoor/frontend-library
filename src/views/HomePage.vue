<template>
  <div class="home">
    <HeroSection />
    <MarqueeDivider />
    <EffectCatalog :effects="effects" />
  </div>
</template>

<script setup lang="ts">
import { getEffects } from '@/utils/effects-registry'
import HeroSection from '@/components/landing/HeroSection.vue'
import MarqueeDivider from '@/components/landing/MarqueeDivider.vue'
import EffectCatalog from '@/components/landing/EffectCatalog.vue'

const effects = getEffects()
</script>

<style lang="scss" scoped>
.home {
  overflow: hidden;
}
</style>
