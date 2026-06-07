import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const springX = useSpring(cursorX, { stiffness: 120, damping: 20, mass: 0.5 })
  const springY = useSpring(cursorY, { stiffness: 120, damping: 20, mass: 0.5 })

  const isHovering = useRef(false)
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

    const enterLink = () => {
      outerScale.set(2.2)
      outerOpacity.set(0.15)
      isHovering.current = true
    }

    const leaveLink = () => {
      outerScale.set(1)
      outerOpacity.set(0.4)
      isHovering.current = false
    }

    window.addEventListener('mousemove', move)

    const addListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, label').forEach(el => {
        el.addEventListener('mouseenter', enterLink)
        el.addEventListener('mouseleave', leaveLink)
      })
    }

    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Outer ring — lagged spring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-gold-400"
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
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-gold-400"
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
