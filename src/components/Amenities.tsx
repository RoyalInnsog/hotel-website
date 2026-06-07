import React from 'react';
import { motion } from 'motion/react';
import { Bell, Car, Clock, CreditCard, PawPrint, Shield, UtensilsCrossed, Wifi } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionLabel from './ui/SectionLabel';

interface AmenityItem {
  name: string;
  icon: LucideIcon;
  description: string;
}

const amenitiesList: AmenityItem[] = [
  { name: 'Pet Friendly', icon: PawPrint, description: 'Your furry friends are welcome here' },
  { name: 'Free Wi-Fi', icon: Wifi, description: 'High-speed internet across the property' },
  { name: 'Free Parking', icon: Car, description: 'Secure, well-lit parking 24/7' },
  { name: '24/7 Room Service', icon: Bell, description: 'Gourmet meals anytime you need' },
  { name: 'Check-out: 10 AM', icon: Clock, description: 'Flexible late check-out on request' },
  { name: 'Safe & Secure', icon: Shield, description: 'CCTV surveillance & trained staff' },
  { name: 'Multi-Cuisine', icon: UtensilsCrossed, description: 'Rajasthani & North Indian delights' },
  { name: 'Easy Payments', icon: CreditCard, description: 'UPI, cards & cash accepted' },
];

// P12: Standardized spring configurations
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

const AmenityCard = React.memo(function AmenityCard({
  amenity,
  index,
}: {
  amenity: AmenityItem;
  index: number;
}) {
  const Icon = amenity.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ ...springSmooth, delay: index * 0.06 }}
      whileHover={{
        y: -8,
      }}
      className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-[#1B263B]/5 bg-[#faf9f6] p-5 text-center transition-all duration-300 hover:border-[#E0C9A6]/50 hover:shadow-[0_20px_40px_-12px_rgba(224,201,166,0.35)] sm:gap-5 sm:p-8"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at center, rgba(224,201,166,0.15) 0%, transparent 70%)',
        }}
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1 }}
      />
      <motion.div
        whileHover={{ y: -2, scale: 1.08 }}
        transition={springDefault}
        className="relative text-[#1B263B]/70 transition-colors duration-300 group-hover:text-[#E0C9A6]"
      >
        <Icon size={26} strokeWidth={1.5} />
        {/* Animated sparkle on hover */}
        <motion.span
          className="absolute -right-1 -top-1 text-[#E0C9A6]"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        >
          ★
        </motion.span>
      </motion.div>
      <span className="relative font-serif text-sm tracking-wide text-[#1B263B] sm:text-base">{amenity.name}</span>
      <span className="hidden text-[10px] font-light leading-snug text-[#1B263B]/45 sm:block">
        {amenity.description}
      </span>
    </motion.div>
  );
});

export default function Amenities() {
  return (
    <section id="amenities" className="relative z-10 bg-white pb-20 pt-24 sm:pb-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
        <div className="mb-12 text-center sm:mb-16">
          <SectionLabel text="Signature Comforts" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springSmooth}
            className="font-serif text-3xl font-light text-[#1B263B] sm:text-4xl md:text-5xl"
          >
            Core <span className="italic text-[#E0C9A6]">Amenities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSmooth, delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-sm font-light text-[#1B263B]/55 sm:text-base"
          >
            Every detail is curated for your comfort, from seamless connectivity to round-the-clock hospitality.
          </motion.p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {amenitiesList.map((amenity, index) => (
            <AmenityCard key={amenity.name} amenity={amenity} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
