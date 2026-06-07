import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'motion/react';
import { getRoomDetail, type RoomDetail } from '../data/roomDetails';
import RoomDetailsDialog from './RoomDetailsDialog';
import MagneticButton from './ui/MagneticButton';
import SectionLabel from './ui/SectionLabel';

// P12: Standardized spring configurations
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

const stats = [
  { value: 500, suffix: '+', label: 'Happy Guests' },
  { value: 4.8, suffix: '', label: 'Google Rating', isDecimal: true },
  { value: 24, suffix: '/7', label: 'Room Service' },
];

// Parallax image wrapper component
function ParallaxImage({ src, alt, className, speed = 1 }: { src: string; alt: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // P12 Fix: Standardized smooth spring configuration for scroll-linked animations
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.2 });
  const travel = `${Math.max(4, 10 * speed)}%`;
  const y = useTransform(smoothScrollY, [0, 1], [`-${travel}`, travel]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-[120%] w-full -mt-[10%]">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      </motion.div>
    </div>
  );
}

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  isDecimal?: boolean;
  label: string;
}

const AnimatedCounter = React.memo(function AnimatedCounter({
  value,
  suffix,
  isDecimal,
  label,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startedAt = performance.now();
    const duration = 1800;
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isDecimal ? Number((eased * value).toFixed(1)) : Math.floor(eased * value));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        setCount(value);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isDecimal, isInView, value]);

  return (
    <div className="text-center">
      <span ref={ref} className="block font-serif text-2xl font-light text-[#E0C9A6] sm:text-3xl">
        {isDecimal ? count.toFixed(1) : count}
        {suffix}
      </span>
      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-[#1B263B]/45">
        {label}
      </span>
    </div>
  );
});

export default function Showcase() {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const arrivalRoom = getRoomDetail('exterior-arrival');
  const loungeRoom = getRoomDetail('reception-lounge');

  const scrollToAmenities = useCallback(() => {
    document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="rooms" className="relative z-10 overflow-hidden bg-[#faf9f6] py-20 sm:py-24 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:gap-16 sm:px-6 md:px-12 lg:flex-row lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={springSmooth}
          className="flex-1 space-y-6 sm:space-y-8"
        >
          <SectionLabel text="Our Story" centered={false} />
          <h2 className="font-serif text-3xl font-light leading-[1.1] text-[#1B263B] sm:text-4xl md:text-5xl lg:text-6xl">
            A Sanctuary in the <br />
            <span className="italic text-[#E0C9A6]">City.</span>
          </h2>
          <div className="space-y-4 text-base font-light leading-relaxed text-[#1B263B]/70 sm:space-y-6 sm:text-lg">
            <p>
              Whether you are a city traveler seeking a safe haven or a family looking for a luxurious retreat,
              Royal Inn offers an uncompromising standard of comfort.
            </p>
            <p>
              Our signature 24/7 room service ensures your needs are met at any hour. From the reception desk to
              your room, every detail is shaped for a seamless premium stay.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 sm:gap-10">
            {stats.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                isDecimal={stat.isDecimal}
              />
            ))}
          </div>

          <MagneticButton
            onClick={scrollToAmenities}
            className="mt-4 rounded-full border border-[#1B263B] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#1B263B] transition-colors duration-300 hover:bg-[#1B263B] hover:text-white sm:px-8"
          >
            Discover More
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={springSmooth}
          className="relative h-[380px] w-full flex-1 sm:h-[500px] md:h-[600px]"
        >
          <div className="absolute -right-4 top-8 h-[80%] w-2/3 border border-[#E0C9A6]/20" aria-hidden="true" />
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            transition={springDefault}
            onClick={() => setSelectedRoom(arrivalRoom)}
            aria-label={`Open details for ${arrivalRoom.title}`}
            className="absolute right-0 top-0 z-10 h-3/4 w-4/5 overflow-hidden rounded-lg border border-white/20 text-left shadow-2xl"
          >
            <ParallaxImage
              src={arrivalRoom.image}
              alt={arrivalRoom.alt}
              className="h-full w-full"
            />
            <div className="absolute inset-0 bg-black/10" />
            <span className="absolute bottom-4 left-4 rounded-full border border-[#E0C9A6]/30 bg-[#1B263B]/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              View Details
            </span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            transition={springDefault}
            onClick={() => setSelectedRoom(loungeRoom)}
            aria-label={`Open details for ${loungeRoom.title}`}
            className="absolute bottom-0 left-0 z-20 h-[55%] w-3/5 overflow-hidden rounded-lg border-4 border-[#faf9f6] text-left shadow-[0_20px_40px_rgba(27,38,59,0.2)] sm:h-[60%] sm:border-[6px]"
          >
            <ParallaxImage
              src={loungeRoom.image}
              alt={loungeRoom.alt}
              className="h-full w-full"
              speed={0.5}
            />
            <span className="absolute bottom-3 left-3 rounded-full border border-[#E0C9A6]/30 bg-[#1B263B]/50 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur-md sm:text-[10px]">
              View Details
            </span>
          </motion.button>
        </motion.div>
      </div>
      <RoomDetailsDialog room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </section>
  );
}
