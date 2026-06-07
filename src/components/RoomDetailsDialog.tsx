import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BedDouble, Check, Maximize2, Sparkles, Users, X } from 'lucide-react';
import { useCallback } from 'react';
import type { RoomDetail } from '../data/roomDetails';
import { useModalFocusTrap } from '../hooks/useModalFocusTrap';
import MagneticButton from './ui/MagneticButton';

// P12: Standardized smooth spring configuration for page and modal transitions
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };

interface RoomDetailsDialogProps {
  room: RoomDetail | null;
  onClose: () => void;
}

export default function RoomDetailsDialog({ room, onClose }: RoomDetailsDialogProps) {
  const dialogRef = useModalFocusTrap<HTMLDivElement>(Boolean(room), onClose);

  const scrollToBooking = useCallback(() => {
    onClose();
    window.setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 180);
  }, [onClose]);

  return (
    <AnimatePresence>
      {room && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-[#1B263B]/85 px-3 pb-3 pt-16 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={onClose}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`room-title-${room.id}`}
            aria-describedby={`room-desc-${room.id}`}
            className="relative grid max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg border border-[#E0C9A6]/25 bg-[#faf9f6] text-[#1B263B] shadow-[0_32px_90px_rgba(4,11,18,0.45)] outline-none md:grid-cols-[1.05fr_0.95fr]"
            initial={{ y: 56, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 36, opacity: 0, scale: 0.98 }}
            transition={springSmooth}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close room details"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#1B263B]/70 text-white backdrop-blur-md transition-colors hover:bg-[#1B263B]"
            >
              <X size={18} />
            </button>

            <div className="relative min-h-[260px] overflow-hidden md:min-h-full">
              <motion.img
                src={room.image}
                alt={room.alt}
                className="h-full min-h-[260px] w-full object-cover md:min-h-full"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B263B]/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-16 text-white">
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#E0C9A6]/30 bg-[#1B263B]/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6] backdrop-blur-md">
                  <Sparkles size={12} />
                  {room.category}
                </p>
                <p className="max-w-md text-sm font-light leading-relaxed text-white/80">{room.highlight}</p>
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <h2 id={`room-title-${room.id}`} className="font-serif text-3xl font-light leading-tight sm:text-4xl">
                {room.title}
              </h2>
              <p id={`room-desc-${room.id}`} className="mt-3 text-sm font-light leading-7 text-[#1B263B]/65">
                {room.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Maximize2, label: 'Space', value: room.dimensions },
                  { icon: BedDouble, label: 'Bed', value: room.bedSize },
                  { icon: Users, label: 'Best For', value: room.occupancy },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-lg border border-[#1B263B]/10 bg-white/70 p-4">
                      <Icon size={17} className="mb-3 text-[#B9966D]" />
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#1B263B]/45">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs font-medium leading-5 text-[#1B263B]/75">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#B9966D]">
                    Room Features
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {room.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm font-light text-[#1B263B]/70">
                        <Check size={15} className="mt-0.5 shrink-0 text-[#B9966D]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#B9966D]">
                    Amenities
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {room.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-start gap-2 text-sm font-light text-[#1B263B]/70">
                        <Check size={15} className="mt-0.5 shrink-0 text-[#B9966D]" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <MagneticButton
                type="button"
                showPulse
                onClick={scrollToBooking}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B263B] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-colors duration-300 hover:bg-[#E0C9A6] hover:text-[#1B263B]"
              >
                Reserve This Stay
                <ArrowRight size={15} />
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
