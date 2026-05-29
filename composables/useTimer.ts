export function useTimer(startTime?: string) {
  const elapsed = ref(0)
  let interval: ReturnType<typeof setInterval> | null = null

  const formatted = computed(() => {
    const h = Math.floor(elapsed.value / 3600)
    const m = Math.floor((elapsed.value % 3600) / 60)
    const s = elapsed.value % 60

    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  function start(fromTimestamp?: string) {
    stop()

    if (fromTimestamp) {
      elapsed.value = Math.floor((Date.now() - new Date(fromTimestamp).getTime()) / 1000)
    }

    interval = setInterval(() => {
      elapsed.value++
    }, 1000)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function reset() {
    stop()
    elapsed.value = 0
  }

  onUnmounted(stop)

  if (startTime) {
    start(startTime)
  }

  return { elapsed, formatted, start, stop, reset }
}
