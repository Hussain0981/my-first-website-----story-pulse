// composables/useInfiniteScroll.js
export function useInfiniteScroll({ callback, canLoadMore, offset = 300 }) {
  function handleScroll() {
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    if (
      scrollTop + windowHeight >= documentHeight - offset &&
      canLoadMore() // must be a function returning a boolean
    ) {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
