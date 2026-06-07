import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, select, textarea, label'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const springX = useSpring(cursorX, { stiffness: 120, damping: 20, mass: 0.5 })
  const springY = useSpring(cursorY, { stiffness: 120, damping: 20, mass: 0.5 })

  const outerScale = useMotionValue(1)
  const outerOpacity = useMotionValue(0.4)
  const outerScaleSpring = useSpring(outerScale, { stiffness: 200, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }

    // P2 Fix: Single delegated listener instead of per-element + MutationObserver
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        outerScale.set(2.2)
        outerOpacity.set(0.15)
      }
    }

    const onOut = (e: MouseEvent) => {
      const target = e.target as Element
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        outerScale.set(1)
        outerOpacity.set(0.4)
      }
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.body.addEventListener('mouseover', onOver, { passive: true })
    document.body.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      document.body.removeEventListener('mouseover', onOver)
      document.body.removeEventListener('mouseout', onOut)
    }
  }, [cursorX, cursorY, dotX, dotY, outerScale, outerOpacity])

  return (
    <>
      {/* Outer ring — lagged spring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-gold-400 hidden md:block will-change-transform"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: 36,
          height: 36,
          scale: outerScaleSpring,
          opacity: outerOpacity,
        }}
      />
      {/* Inner dot — instant */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-gold-400 hidden md:block will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
        }}
      />
    </>
  )
}
