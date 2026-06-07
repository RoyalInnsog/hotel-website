import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, ChevronDown, Users, Home, Star } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import MagneticButton from './ui/MagneticButton';

// P12: Standardized spring configs
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

export default function BookingBar() {
  const [guests, setGuests] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  const { checkInLabel, checkOutLabel } = useMemo(() => {
    const today = new Date();
    const checkOutDate = new Date(today);
    checkOutDate.setDate(today.getDate() + 3);

    const formatter = new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      checkInLabel: formatter.format(today),
      checkOutLabel: formatter.format(checkOutDate),
    };
  }, []);

  const cycleGuests = useCallback(() => {
    setGuests((currentGuests) => (currentGuests === 4 ? 1 : currentGuests + 1));
  }, []);

  const scrollToBooking = useCallback(() => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSmooth, delay: 0.8 }}
      className="absolute bottom-0 left-0 right-0 z-30 w-full translate-y-1/2 px-3 sm:px-4 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        {/* P3 Fix: Reduce backdrop-blur-xl to backdrop-blur-md for GPU performance */}
        <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#1B263B]/85 p-3 text-white shadow-2xl backdrop-blur-md sm:gap-4 sm:p-4 md:px-8 md:py-6 lg:flex-row lg:gap-8">
          <div className="grid w-full grid-cols-1 sm:grid-cols-3 lg:w-3/4">
            <div className="relative flex flex-col gap-1 border-b border-white/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 md:pr-6">
              <span className="mb-1 text-[10px] uppercase tracking-widest text-[#E0C9A6] sm:mb-2">Check-In</span>
              <div className="flex w-full items-center justify-between">
                <span className="text-base font-light text-white sm:text-lg">{checkInLabel}</span>
                <Calendar size={16} className="text-[#E0C9A6] opacity-60" />
              </div>
            </div>

            <div className="relative flex flex-col gap-1 border-b border-white/10 py-3 sm:border-b-0 sm:border-r sm:px-4 sm:py-0 md:px-6">
              <span className="mb-1 text-[10px] uppercase tracking-widest text-[#E0C9A6] sm:mb-2">Check-Out</span>
              <div className="flex w-full items-center justify-between">
                <span className="text-base font-light text-white sm:text-lg">{checkOutLabel}</span>
                <Calendar size={16} className="text-[#E0C9A6] opacity-60" />
              </div>
            </div>

            <div className="relative flex flex-col gap-1 pt-3 sm:pl-4 sm:pt-0 md:pl-6">
              <span className="mb-1 text-[10px] uppercase tracking-widest text-[#E0C9A6] sm:mb-2">Guests</span>
              <button
                type="button"
                onClick={cycleGuests}
                className="flex w-full items-center justify-between text-left focus:outline-none"
                aria-label="Change guest count"
              >
                <motion.span
                  key={guests}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springDefault}
                  className="text-base font-light text-white sm:text-lg"
                >
                  {guests} Adult{guests !== 1 && 's'}
                </motion.span>
                <span className="flex items-center gap-1 text-[#E0C9A6]">
                  <Users size={14} className="opacity-60" />
                  <ChevronDown size={12} className="opacity-60" />
                </span>
              </button>
            </div>
          </div>

          <div className="mt-2 w-full flex-none lg:mt-0 lg:w-auto">
            <MagneticButton
              showPulse
              onClick={scrollToBooking}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E0C9A6] px-6 text-[10px] font-bold uppercase tracking-widest text-[#1B263B] shadow-lg transition-colors duration-300 hover:bg-white sm:h-14 sm:gap-3 sm:px-10 sm:text-xs lg:w-auto overflow-hidden"
            >
              {/* P8 Fix: Add will-change-transform to hint GPU pre-allocation for the fast-running hover animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent will-change-transform"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '200%' : '-100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Check Availability
                <motion.span
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={springDefault}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
