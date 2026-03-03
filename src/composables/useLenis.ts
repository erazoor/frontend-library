import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null

/**
 * Initializes a global Lenis smooth scroll instance and syncs it
 * with GSAP's ticker and ScrollTrigger.
 *
 * Call once in App.vue or the root layout. Subsequent calls return
 * the existing instance (singleton).
 */
export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  })

  lenisInstance.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenisInstance!.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

/**
 * Returns the current Lenis instance, or null if not yet initialized.
 * Use in any component that needs to control scroll (scrollTo, stop, start).
 */
export function useLenis(): Lenis | null {
  return lenisInstance
}
