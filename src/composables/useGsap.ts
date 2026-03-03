import { onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

/**
 * Creates a GSAP context scoped to the component lifecycle.
 * All animations created within the setup callback are automatically
 * reverted (killed + styles restored) when the component unmounts.
 *
 * Usage :
 * ```ts
 * const { ctx } = useGsap((self) => {
 *   gsap.to('.box', { x: 100 })
 * })
 * ```
 */
export function useGsap(
  setup?: (self: gsap.Context) => void,
  scope?: Element | string,
) {
  const ctx = gsap.context(() => {}, scope)

  onMounted(() => {
    if (setup) {
      ctx.add(setup)
    }
  })

  onBeforeUnmount(() => {
    ctx.revert()
  })

  return { ctx }
}
