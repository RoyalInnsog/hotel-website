import { motion, AnimatePresence } from 'motion/react';
import { Clock, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// P12: Standardized spring configurations
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

const quickLinks = [
  { name: 'Home', href: '#' },
  { name: 'Our Rooms', href: '#rooms' },
  { name: 'Amenities', href: '#amenities' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'Book Now', href: '#booking' },
];

// Animated link component
function AnimatedLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 6, color: '#E0C9A6' }}
      transition={springDefault}
      className="inline-block transition-colors"
    >
      {children}
    </motion.a>
  );
}

// Back to top button — only visible after scrolling down
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let wasVisible = false;
    const onScroll = () => {
      const nowVisible = window.scrollY > 400;
      if (nowVisible !== wasVisible) {
        wasVisible = nowVisible;
        setIsVisible(nowVisible);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          transition={springDefault}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#E0C9A6] text-[#1B263B] shadow-lg shadow-[#E0C9A6]/20"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Footer() {
  return (
    <footer id="location" className="relative overflow-hidden bg-[#1B263B] pb-8 pt-16 text-white sm:pb-10 sm:pt-20">
      <BackToTop />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C9A6]/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springSmooth}
          className="mb-12 overflow-hidden rounded-lg border border-white/10 shadow-xl sm:mb-16"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.1!2d73.8983!3d29.3320!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39176e900e999999%3A0x1234567890abcdef!2sRoyal%20Inn%20Hotel%2C%20Near%20New%20Bus%20Stand%2C%20Suratgarh!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="220"
            style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Royal Inn Hotel Location - Near New Bus Stand, Suratgarh, Rajasthan"
            className="w-full"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 sm:gap-12 sm:pb-16 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springSmooth}
            className="col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="mb-4 flex items-center gap-3 sm:mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-[#E0C9A6] sm:h-10 sm:w-10">
                <span className="block font-serif text-lg font-bold text-[#E0C9A6] sm:text-xl">R</span>
              </div>
              <span className="font-serif text-xl font-light tracking-tight sm:text-2xl">
                Royal Inn <span className="text-[#E0C9A6]">Hotel</span>
              </span>
            </div>
            <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-white/65 sm:mb-8 sm:text-base">
              Experience refined comfort and bespoke 24/7 service at Royal Inn Hotel, Near New Bus Stand, Suratgarh, Rajasthan,
              designed for calm arrivals and restful nights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSmooth, delay: 0.1 }}
          >
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6] sm:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-light text-white/70 sm:space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <AnimatedLink href={link.href}>
                    {link.name}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSmooth, delay: 0.2 }}
          >
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6] sm:mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm font-light text-white/70">
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-0.5 shrink-0 text-[#E0C9A6]/65" />
                <a href="tel:+918209526458" className="transition-colors hover:text-white">
                  +91 8209526458
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-0.5 shrink-0 text-[#E0C9A6]/65" />
                <a
                  href="mailto:royal.inn.hotel.suratgarh@gmail.com"
                  className="break-all transition-colors hover:text-white sm:break-words"
                >
                  royal.inn.hotel.suratgarh@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#E0C9A6]/65" />
                <span className="leading-relaxed">
                  Near New Bus Stand, Suratgarh, Rajasthan
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSmooth, delay: 0.3 }}
          >
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6] sm:mb-6">
              Hours
            </h3>
            <ul className="space-y-4 text-sm font-light text-white/70">
              <li className="flex items-start gap-3">
                <Clock size={14} className="mt-0.5 shrink-0 text-[#E0C9A6]/65" />
                <div>
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/90">
                    Front Desk
                  </span>
                  <span>Open 24 Hours</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="mt-0.5 shrink-0 text-[#E0C9A6]/65" />
                <div>
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/90">
                    Check-In
                  </span>
                  <span>12:00 PM onwards</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="mt-0.5 shrink-0 text-[#E0C9A6]/65" />
                <div>
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/90">
                    Check-Out
                  </span>
                  <span>Before 10:00 AM</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="section-divider my-6 sm:my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:gap-0">
          <span>&copy; {new Date().getFullYear()} Royal Inn Suratgarh — All Rights Reserved</span>
          <div className="flex gap-6 sm:gap-8">
            <a href="#" className="transition-colors hover:text-white/60">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white/60">
              Terms
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-[9px] tracking-[0.15em] text-white/20">
          Crafted with precision · Royal Inn Hotel, Suratgarh
        </p>
      </div>
    </footer>
  );
}
