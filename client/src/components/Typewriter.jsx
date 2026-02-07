import React, { useEffect, useState } from "react"

// Typewriter that cycles through multiple phrases, typing, pausing, deleting, then next
export default function Typewriter({ texts = [], speed = 80, pause = 1200, deleteSpeed = 40 }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [forward, setForward] = useState(true)

  useEffect(() => {
    const current = texts[index] || ''

    if (forward) {
      if (subIndex < current.length) {
        const timeout = setTimeout(() => setSubIndex(subIndex + 1), speed)
        return () => clearTimeout(timeout)
      }
      const pauseTimeout = setTimeout(() => setForward(false), pause)
      return () => clearTimeout(pauseTimeout)
    }

    if (!forward) {
      if (subIndex > 0) {
        const timeout = setTimeout(() => setSubIndex(subIndex - 1), deleteSpeed)
        return () => clearTimeout(timeout)
      }
      setForward(true)
      setIndex((i) => (i + 1) % (texts.length || 1))
    }
  }, [subIndex, index, forward, texts, speed, pause, deleteSpeed])

  return (
    <span className="text-accent">
      {(texts[index] || '').substring(0, subIndex)}
      <span className="blinking">|</span>
    </span>
  )
}
