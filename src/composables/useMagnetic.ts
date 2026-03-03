import { onMounted, onBeforeUnmount, type Ref } from 'vue'
import gsap from 'gsap'

/**
 * Makes an element magnetically attract toward the cursor on hover.
 * Returns `onMove` and `onReset` handlers that can be bound to any
 * trigger element (doesn't have to be the target itself).
 *
 * @param targetRef | The element that physically moves.
 * @param options.strength | How strongly the element attracts (0-1). Default 0.3.
 */
export function useMagnetic(
  targetRef: Ref<HTMLElement | undefined>,
  options: { strength?: number } = {},
) {
  const { strength = 0.3 } = options

  let xTo: gsap.QuickToFunc
  let yTo: gsap.QuickToFunc
  let ready = false

  onMounted(() => {
    if (!targetRef.value) return
    xTo = gsap.quickTo(targetRef.value, 'x', {
      duration: 0.5,
      ease: 'power3.out',
    })
    yTo = gsap.quickTo(targetRef.value, 'y', {
      duration: 0.5,
      ease: 'power3.out',
    })
    ready = true
  })

  onBeforeUnmount(() => {
    ready = false
  })

  function onMove(e: MouseEvent) {
    if (!ready || !targetRef.value) return
    const rect = targetRef.value.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    xTo((e.clientX - cx) * strength)
    yTo((e.clientY - cy) * strength)
  }

  function onReset() {
    if (!ready) return
    xTo(0)
    yTo(0)
  }

  return { onMove, onReset }
}
