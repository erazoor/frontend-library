import { ref, onMounted, type Ref } from 'vue'

/**
 * Splits the text content of an element into individual character
 * and word spans for granular animation control.
 *
 * Each character is wrapped in a `<span class="split-char">` inside
 * a `<span class="split-word">` with `overflow: hidden` for reveal effects.
 *
 * @param elementRef | Ref to the target HTML element.
 * @returns | Reactive arrays of character and word span elements.
 */
export function useSplitText(elementRef: Ref<HTMLElement | undefined>) {
  const chars = ref<HTMLElement[]>([])
  const words = ref<HTMLElement[]>([])

  onMounted(() => {
    if (!elementRef.value) return

    const text = elementRef.value.textContent || ''
    elementRef.value.textContent = ''
    elementRef.value.setAttribute('aria-label', text)

    text.split(' ').forEach((word, wordIndex) => {
      if (wordIndex > 0) {
        const space = document.createElement('span')
        space.innerHTML = '&nbsp;'
        space.style.display = 'inline-block'
        elementRef.value!.appendChild(space)
      }

      const wordSpan = document.createElement('span')
      wordSpan.classList.add('split-word')
      wordSpan.style.display = 'inline-block'
      wordSpan.style.overflow = 'hidden'
      wordSpan.style.verticalAlign = 'top'

      word.split('').forEach((char) => {
        const charSpan = document.createElement('span')
        charSpan.classList.add('split-char')
        charSpan.style.display = 'inline-block'
        charSpan.textContent = char
        wordSpan.appendChild(charSpan)
      })

      elementRef.value!.appendChild(wordSpan)
      words.value.push(wordSpan)
      wordSpan.querySelectorAll<HTMLElement>('.split-char').forEach((c) => {
        chars.value.push(c)
      })
    })
  })

  return { chars, words }
}
