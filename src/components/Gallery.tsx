import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { ROOM_DETAILS, type RoomDetail } from '../data/roomDetails';
import RoomDetailsDialog from './RoomDetailsDialog';
import SectionLabel from './ui/SectionLabel';

// P12: Standardized spring configurations
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

export default function Gallery() {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((previous) => new Set(previous).add(id));
  }, []);

  return (
    <section id="gallery" className="relative bg-[#faf9f6] py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="mb-12 text-center sm:mb-16">
          <SectionLabel text="Visual Tour" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springSmooth}
            className="font-serif text-3xl font-light leading-[1.1] text-[#1B263B] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            A Glimpse into <span className="italic text-[#E0C9A6]">Luxury.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSmooth, delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-sm font-light text-[#1B263B]/55 sm:text-base"
          >
            Explore the elegance of Royal Inn Hotel before you even step through the doors.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {ROOM_DETAILS.map((room, index) => (
            <motion.button
              key={room.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springSmooth, delay: index * 0.08 }}
              className={`group relative min-h-[240px] cursor-pointer overflow-hidden rounded-lg bg-[#1B263B]/10 text-left ${room.gallerySpan}`}
              onClick={() => setSelectedRoom(room)}
              aria-label={`Open details for ${room.title}`}
            >
              {!loadedImages.has(room.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1B263B]/10">
                  <motion.div
                    className="h-8 w-8 rounded-full border-2 border-[#E0C9A6]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}

              <motion.img
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                src={room.image}
                alt={room.alt}
                className={`h-full min-h-[240px] w-full object-cover transition-opacity duration-500 ${
                  loadedImages.has(room.id) ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(room.id)}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1B263B]/85 via-[#1B263B]/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-medium text-white">{room.title}</p>
                <p className="mt-1 text-xs text-white/70">{room.category}</p>
              </div>
              <motion.span
                initial={{ scale: 0.92, opacity: 0 }}
                whileHover={{ scale: 1.04, opacity: 1 }}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden="true"
              >
                <Maximize2 size={18} />
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>

      <RoomDetailsDialog room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </section>
  );
}
