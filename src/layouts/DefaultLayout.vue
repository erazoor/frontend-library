<template>
  <div class="layout">
    <main class="layout__content">
      <slot />
    </main>
    <SiteFooter />
    <CustomScrollbar />
    <CustomCursor />
    <GrainOverlay />
  </div>
</template>

<script setup lang="ts">
import GrainOverlay from '@/components/common/GrainOverlay.vue'
import CustomScrollbar from '@/components/common/CustomScrollbar.vue'
import CustomCursor from '@/components/common/CustomCursor.vue'
import SiteFooter from '@/components/common/SiteFooter.vue'
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__content {
  flex: 1;
}
</style>
