import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Star } from 'lucide-react';
import BookingBar from './BookingBar';
import LocalStatusWidget from './LocalStatusWidget';

// P12: Standardized spring configurations
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // P12 Fix: Standardized smooth spring for luxurious parallax mapping
  const smoothScrollY = useSpring(scrollYProgress, springSmooth);

  const bgY = useTransform(smoothScrollY, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(smoothScrollY, [0, 1], [1.05, 1.2]);
  const overlayOpacity = useTransform(smoothScrollY, [0, 0.8], [0.6, 0.9]);
  const textOpacity = useTransform(smoothScrollY, [0, 0.5], [1, 0]);
  const textY = useTransform(smoothScrollY, [0, 0.5], [0, -60]);
  const badgeY = useTransform(smoothScrollY, [0, 0.4], [0, 30]);
  const badgeOpacity = useTransform(smoothScrollY, [0, 0.35], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100svh] items-center justify-center bg-[#1B263B] pb-40 pt-20 text-center text-white"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale: bgScale }}>
          <img
            src="/images/exterior.jpg"
            alt="Royal Inn Hotel exterior near New Bus Stand, Suratgarh, Rajasthan"
            className="h-full w-full object-cover text-transparent opacity-40 mix-blend-overlay"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black/65 via-[#1B263B]/20 to-[#1B263B]"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 mx-auto mt-12 flex w-full max-w-4xl flex-col items-center px-6 sm:px-8 md:mt-0 md:px-12"
        style={{ opacity: textOpacity, y: textY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.2 }}
          className="mb-4 flex items-center gap-3 text-[#E0C9A6] sm:mb-6 sm:gap-4"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...springSmooth, delay: 0.5 }}
            className="h-px w-6 origin-right bg-[#E0C9A6]/40 sm:w-12"
          />
          <span className="max-w-[210px] text-center text-[9px] font-medium uppercase leading-loose tracking-[0.24em] sm:max-w-none sm:text-xs sm:tracking-[0.4em]">
            Welcome to the Heart of Suratgarh
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...springSmooth, delay: 0.5 }}
            className="h-px w-6 origin-left bg-[#E0C9A6]/40 sm:w-12"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.4 }}
          className="mb-6 max-w-4xl font-serif text-4xl font-light leading-[0.95] sm:mb-8 sm:text-6xl md:text-7xl lg:text-[84px]"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springSmooth, delay: 0.5 }}
            className="inline-block italic"
          >
            Stay
          </motion.span>{' '}
          in Style,<br />
          Rest in{' '}
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springSmooth, delay: 0.6 }}
            className="inline-block text-[#E0C9A6]"
          >
            Luxury
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.7 }}
          className="mx-auto mb-10 w-full max-w-[18rem] px-4 text-base font-light leading-relaxed text-white/65 sm:mb-12 sm:max-w-xl sm:px-0 sm:text-lg"
        >
          Experience the finest comfort, breathtaking design, and bespoke 24/7 impeccable service
          at our premium retreat near New Bus Stand, Suratgarh, Rajasthan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.9 }}
          style={{ y: badgeY, opacity: badgeOpacity }}
          className="mb-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-widest text-white/45 sm:mb-0 sm:gap-8 sm:text-xs"
        >
          <motion.span
            whileHover={{ color: 'rgba(224,201,166,0.9)', scale: 1.05 }}
            transition={springDefault}
            className="flex cursor-default items-center gap-1.5"
          >
            <Star size={12} className="fill-[#E0C9A6] text-[#E0C9A6]" /> 4.8 Rating
          </motion.span>
          <span className="h-3 w-px bg-white/20" />
          <motion.span
            whileHover={{ color: 'rgba(224,201,166,0.9)', scale: 1.05 }}
            transition={springDefault}
            className="cursor-default"
          >
            500+ Happy Guests
          </motion.span>
          <span className="hidden h-3 w-px bg-white/20 sm:block" />
          <motion.span
            whileHover={{ color: 'rgba(224,201,166,0.9)', scale: 1.05 }}
            transition={springDefault}
            className="hidden cursor-default sm:block"
          >
            24/7 Service
          </motion.span>
        </motion.div>

        <LocalStatusWidget className="mt-7" />

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-28 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-50 md:flex"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
        <motion.div
          className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent"
          animate={{ scaleY: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <BookingBar />
    </section>
  );
}
