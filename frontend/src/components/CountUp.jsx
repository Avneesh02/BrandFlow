import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value = 0, duration = 700, pad = 2 }) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef(null)
  const fromRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return undefined
    }
    const from = fromRef.current
    const to = Number(value) || 0
    const start = performance.now()

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = Math.round(from + (to - from) * eased)
      setDisplay(next)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <>{display.toString().padStart(pad, '0')}</>
}
