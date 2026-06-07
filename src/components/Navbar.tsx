import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Sun, Moon, Crown } from 'lucide-react'
import { useTheme } from '../App'
import MagneticButton from './ui/MagneticButton'

const links = [
  { label: 'Rooms', href: '#rooms' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Book', href: '#booking' },
]

export default function Navbar() {
  const { isDark, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // P1 Fix: rAF-throttled scroll with zero-rerender progress bar
  const progressRef = useRef<HTMLDivElement>(null)
  const rafId = useRef(0)
  const lastScrolled = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) return
      rafId.current = requestAnimationFrame(() => {
        rafId.current = 0
        const y = window.scrollY
        const nowScrolled = y > 60

        // Only trigger React re-render when threshold actually crosses
        if (nowScrolled !== lastScrolled.current) {
          lastScrolled.current = nowScrolled
          setScrolled(nowScrolled)
        }

        // Drive progress bar via DOM — zero React re-renders
        if (progressRef.current) {
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
          const pct = height > 0 ? (y / height) * 100 : 0
          progressRef.current.style.transform = `scaleX(${pct / 100})`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      {/* Scroll Progress Bar — driven via DOM ref, not React state */}
      <div
        className={`fixed top-[72px] left-0 right-0 z-[60] h-[2px] transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-gradient-to-r from-[#E0C9A6] via-[#B9966D] to-[#E0C9A6] will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 h-[72px]"
      >
        {/* P1/P3 Fix: Pre-composite backdrop blur to prevent scroll threshold crossing jank */}
        <div
          className={`absolute inset-0 transition-all duration-500 border-b backdrop-blur-md ${
            isDark
              ? 'bg-navy-950/95 border-gold-500/10 shadow-2xl shadow-navy-950/50'
              : 'bg-cream-50/95 border-gold-500/20 shadow-lg'
          }`}
          style={{
            opacity: scrolled ? 1 : 0,
            pointerEvents: 'none',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
          >
            <Crown className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="leading-none">
              <p className={`font-display text-lg font-semibold tracking-wide ${(!scrolled || isDark) ? 'text-cream-100' : 'text-navy-900'}`}>
                Royal Inn
              </p>
              <p className="text-gold-500 text-[10px] tracking-[0.2em] uppercase font-sans">
                Hotel · Suratgarh
              </p>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l, i) => (
              <motion.button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className={`text-sm tracking-wider uppercase font-sans relative group transition-colors ${
                  (!scrolled || isDark) ? 'text-navy-200 hover:text-gold-400' : 'text-navy-700 hover:text-gold-600'
                }`}
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggle}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                (!scrolled || isDark)
                  ? 'border-navy-600 text-gold-400 hover:border-gold-500/40 hover:bg-gold-500/10'
                  : 'border-navy-200 text-navy-700 hover:border-navy-400 hover:bg-navy-100'
              }`}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Book Now CTA */}
            <MagneticButton
              showPulse
              onClick={() => scrollTo('#booking')}
              className="hidden md:flex items-center gap-2 px-5 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-sans font-semibold rounded-sm tracking-wider uppercase transition-colors shadow-lg shadow-gold-500/20"
            >
              Book Now
            </MagneticButton>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`md:hidden w-9 h-9 flex items-center justify-center ${(!scrolled || isDark) ? 'text-cream-100' : 'text-navy-900'}`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-[72px] left-0 right-0 z-40 border-b ${
              isDark
                ? 'bg-navy-950/97 backdrop-blur-md border-gold-500/10'
                : 'bg-cream-50/97 backdrop-blur-md border-navy-100'
            }`}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map((l, i) => (
                <motion.button
                  key={l.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 120, damping: 18 }}
                  onClick={() => scrollTo(l.href)}
                  className={`text-left text-base font-sans tracking-wider uppercase ${
                    isDark ? 'text-navy-100 hover:text-gold-400' : 'text-navy-800 hover:text-gold-600'
                  }`}
                >
                  {l.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.06 + 0.1, type: 'spring', stiffness: 120, damping: 18 }}
                onClick={() => scrollTo('#booking')}
                className="mt-2 w-full py-3 bg-gold-500 text-navy-950 font-semibold tracking-wider uppercase text-sm rounded-sm"
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
