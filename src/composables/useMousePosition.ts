import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Tracks the mouse position reactively.
 * Updates on every mousemove event with clientX/clientY coordinates.
 */
export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function onMouseMove(e: MouseEvent) {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', onMouseMove))
  onBeforeUnmount(() => window.removeEventListener('mousemove', onMouseMove))

  return { x, y }
}
