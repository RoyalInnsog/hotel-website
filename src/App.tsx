import { useState, useEffect, createContext, useContext, useCallback, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Amenities from './components/Amenities'
import Showcase from './components/Showcase'
import Testimonials from './components/Testimonials'
import BookingForm from './components/BookingForm'
import Footer from './components/Footer'
import Gallery from './components/Gallery'

/* Lazy-load custom cursor only for pointer (mouse) devices — saves ~3KB from mobile bundle */
const CustomCursor = lazy(() => import('./components/CustomCursor'))
const isPointerDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/* ─── Theme Context ───────────────────────────────────── */
export type ThemeContextType = {
  isDark: boolean
  toggle: () => void
}
export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggle: () => {},
})
export const useTheme = () => useContext(ThemeContext)

// Page loader component
function PageLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Prevent background scrolling during splash
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => {
      document.body.style.overflow = ''
      onComplete()
    }, 2200)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1B263B]"
      aria-label="Loading Royal Inn Hotel"
      role="progressbar"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <motion.span
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl"
          >
            👑
          </motion.span>
          <div>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-2xl font-semibold text-[#E0C9A6]"
            >
              Royal Inn
            </motion.p>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[10px] uppercase tracking-[0.3em] text-[#E0C9A6]/60"
            >
              Hotel · Suratgarh
            </motion.p>
          </div>
        </motion.div>

        {/* Loading bar */}
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-[#E0C9A6]/20">
          <motion.div
            className="h-full w-full origin-left bg-[#E0C9A6]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ─── App ─────────────────────────────────────────────── */
export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(p => !p) }}>
      {/* Skip-to-content link for keyboard / screen-reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-950 focus:font-semibold focus:text-sm focus:shadow-lg"
      >
        Skip to main content
      </a>

      <AnimatePresence mode="wait">
        {isLoading && <PageLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {/* Render custom cursor only on devices with a fine pointer (mouse) */}
      {isPointerDevice && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}

      <div className={`${isDark ? 'dark bg-navy-900' : 'bg-cream-100'} transition-colors duration-700 min-h-screen`}>
        <Navbar />
        <motion.main
          id="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Hero />
          <Amenities />
          <Showcase />
          <Gallery />
          <Testimonials />
          <BookingForm />
        </motion.main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}
