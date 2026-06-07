import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Send, Star } from 'lucide-react';
import SectionLabel from './ui/SectionLabel';
import MagneticButton from './ui/MagneticButton';

// P12: Standardized spring configurations
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

const AUTO_PLAY_INTERVAL = 6000;
const SWIPE_THRESHOLD = 50;
const REVIEW_STORAGE_KEY = 'royal-inn-local-reviews';

interface Review {
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
}

const curatedReviews: Review[] = [
  {
    name: 'Rajesh Sharma',
    city: 'Jaipur',
    rating: 5,
    text: 'Best hotel I have ever stayed at. The rooms are spotless, staff is extremely courteous, and the 24/7 room service was a lifesaver during our late-night arrival. Highly recommend!',
    date: 'March 2026',
  },
  {
    name: 'Priya Agarwal',
    city: 'New Delhi',
    rating: 5,
    text: 'We stopped here during our road trip and were impressed by the quality. The reception area is elegant, rooms are well-furnished, and the food was outstanding. Will definitely come back.',
    date: 'February 2026',
  },
  {
    name: 'Vikram Singh',
    city: 'Bikaner',
    rating: 4,
    text: 'Clean rooms, great parking facility, and the pet-friendly policy made our stay easier. The Wi-Fi was fast enough for my video calls. A gem in the city!',
    date: 'January 2026',
  },
  {
    name: 'Meera Patel',
    city: 'Ahmedabad',
    rating: 5,
    text: 'The ambience of Royal Inn is truly premium. It feels like a boutique luxury stay. The Rajasthani thali was absolutely divine!',
    date: 'April 2026',
  },
  {
    name: 'Arjun Choudhary',
    city: 'Jodhpur',
    rating: 5,
    text: 'Stayed here with my family for 3 nights. The staff went above and beyond to make us comfortable. Check-out was smooth and the pricing is very fair for the quality offered.',
    date: 'March 2026',
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

function sanitizeReviewField(value: string, maxLength: number) {
  return value
    .normalize('NFKC')
    .replace(/[<>{}`[\]\\]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function normalizeStoredReview(value: unknown): Review | null {
  if (!value || typeof value !== 'object') return null;
  const review = value as Partial<Review>;
  const rating = Number(review.rating);
  const cleanReview = {
    name: sanitizeReviewField(String(review.name ?? ''), 60),
    city: sanitizeReviewField(String(review.city ?? ''), 60),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
    text: sanitizeReviewField(String(review.text ?? ''), 280),
    date: sanitizeReviewField(String(review.date ?? ''), 32),
  };

  if (cleanReview.name.length < 2 || cleanReview.city.length < 2 || cleanReview.text.length < 20) {
    return null;
  }

  return cleanReview;
}

export default function Testimonials() {
  const [storedReviews, setStoredReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [draft, setDraft] = useState({ name: '', city: '', rating: 5, text: '' });
  const [reviewError, setReviewError] = useState('');
  const timerRef = useRef<ReturnType<typeof window.setInterval> | null>(null);

  const allReviews = useMemo(() => [...storedReviews, ...curatedReviews], [storedReviews]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(REVIEW_STORAGE_KEY) ?? '[]');
      if (!Array.isArray(parsed)) return;
      setStoredReviews(parsed.map(normalizeStoredReview).filter(Boolean).slice(0, 6) as Review[]);
    } catch {
      setStoredReviews([]);
    }
  }, []);

  useEffect(() => {
    if (currentIndex < allReviews.length) return;
    setCurrentIndex(0);
  }, [allReviews.length, currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = window.setInterval(() => {
      setDirection(1);
      setCurrentIndex((current) => (current + 1) % allReviews.length);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [allReviews.length, isPaused]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((current) => (current + 1) % allReviews.length);
  }, [allReviews.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((current) => (current - 1 + allReviews.length) % allReviews.length);
  }, [allReviews.length]);

  const goToReview = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipe = info.offset.x + info.velocity.x * 0.4;
      if (swipe < -SWIPE_THRESHOLD) goNext();
      else if (swipe > SWIPE_THRESHOLD) goPrev();
    },
    [goNext, goPrev]
  );

  const handleSubmitReview = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextReview = normalizeStoredReview({
        ...draft,
        date: new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date()),
      });

      if (!nextReview) {
        setReviewError('Add your name, city, rating, and at least 20 characters of review text.');
        return;
      }

      const nextReviews = [nextReview, ...storedReviews].slice(0, 6);
      setStoredReviews(nextReviews);
      window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));
      setCurrentIndex(0);
      setDirection(-1);
      setDraft({ name: '', city: '', rating: 5, text: '' });
      setReviewError('');
    },
    [draft, storedReviews]
  );

  const current = allReviews[currentIndex] ?? curatedReviews[0];

  return (
    <section
      id="reviews"
      className="relative z-10 overflow-hidden bg-[#1B263B] py-20 sm:py-24 md:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C9A6]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E0C9A6]/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-12">
        <div className="mb-12 text-center sm:mb-16">
          <SectionLabel text="Guest Voices" />
          <h2 className="font-serif text-3xl font-light text-white sm:text-4xl md:text-5xl">
            What our <span className="italic text-[#E0C9A6]">Guests</span> say
          </h2>
        </div>

        <div
          className="relative mx-auto min-h-[330px] max-w-4xl sm:min-h-[260px]"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${current.name}-${current.date}-${currentIndex}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springSmooth}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 flex cursor-grab touch-pan-y flex-col items-center text-center active:cursor-grabbing"
            >
              <Quote size={32} className="mb-6 text-[#E0C9A6]/25" />
              <p className="mb-8 max-w-2xl px-2 text-base font-light leading-relaxed text-white/80 sm:text-lg">
                &ldquo;{current.text}&rdquo;
              </p>
              
              {/* Star Rating — Standardized to high-performance static rendering to prevent JS paint stutters on transition */}
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < current.rating ? 'fill-[#E0C9A6] text-[#E0C9A6]' : 'text-white/20'}
                  />
                ))}
              </div>
              
              <span className="font-serif text-lg font-medium text-white">{current.name}</span>
              <span className="mt-1 text-[10px] uppercase tracking-widest text-white/45">
                {current.city} - {current.date}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={springDefault}
            onClick={goPrev}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/65 transition-colors hover:border-[#E0C9A6]/50 hover:text-[#E0C9A6]"
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </motion.button>

          <div className="flex items-center gap-2">
            {allReviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToReview(i)}
                className="relative h-2 cursor-pointer overflow-hidden rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex ? 24 : 8,
                  background: i === currentIndex ? 'transparent' : 'rgba(255,255,255,0.2)',
                }}
                aria-label={`Go to review ${i + 1}`}
              >
                {i === currentIndex && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-[#E0C9A6]/30" />
                    <motion.span
                      key={`progress-${currentIndex}`}
                      className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#E0C9A6]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isPaused ? 0 : 1 }}
                      transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                    />
                  </>
                )}
              </button>
            ))}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={springDefault}
            onClick={goNext}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/65 transition-colors hover:border-[#E0C9A6]/50 hover:text-[#E0C9A6]"
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* P3 Fix: Reduce backdrop-blur-xl to backdrop-blur-md for GPU performance */}
          <motion.form
            onSubmit={handleSubmitReview}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springSmooth}
            className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_70px_rgba(4,11,18,0.22)] backdrop-blur-md sm:p-6"
          >
            <h3 className="font-serif text-2xl font-light text-white">Compose a Review</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6]">
                Name
                <input
                  value={draft.name}
                  maxLength={60}
                  onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))}
                  className="mt-2 w-full rounded-none border-b border-white/20 bg-transparent py-3 text-sm font-light text-white placeholder:text-white/30 transition-colors duration-300 focus:border-[#E0C9A6] focus:outline-none"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6]">
                City
                <input
                  value={draft.city}
                  maxLength={60}
                  onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, city: event.target.value }))}
                  className="mt-2 w-full rounded-none border-b border-white/20 bg-transparent py-3 text-sm font-light text-white placeholder:text-white/30 transition-colors duration-300 focus:border-[#E0C9A6] focus:outline-none"
                  placeholder="Your city"
                  autoComplete="address-level2"
                />
              </label>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6]">Rating</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      key={ratingValue}
                      type="button"
                      onClick={() => setDraft((currentDraft) => ({ ...currentDraft, rating: ratingValue }))}
                      className="rounded-full p-1 text-[#E0C9A6] transition-transform hover:scale-110"
                      aria-label={`Rate ${ratingValue} stars`}
                      aria-pressed={draft.rating === ratingValue}
                    >
                      <Star
                        size={22}
                        className={ratingValue <= draft.rating ? 'fill-[#E0C9A6]' : 'text-white/25'}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="mt-5 block text-[10px] font-semibold uppercase tracking-widest text-[#E0C9A6]">
              Review
              <textarea
                value={draft.text}
                maxLength={280}
                onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, text: event.target.value }))}
                className="mt-2 min-h-32 w-full resize-none rounded-lg border border-white/15 bg-white/[0.04] p-3 text-sm font-light leading-6 text-white placeholder:text-white/30 transition-colors duration-300 focus:border-[#E0C9A6] focus:outline-none"
                placeholder="Share the moment that made your stay feel memorable."
              />
            </label>

            <AnimatePresence>
              {reviewError && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-3 text-xs font-medium text-[#E0C9A6]"
                >
                  {reviewError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* P12: Enhanced submit button with MagneticButton for premium visual feedback */}
            <MagneticButton
              type="submit"
              showPulse
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E0C9A6] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#1B263B] transition-colors duration-300 hover:bg-white shadow-lg shadow-[#E0C9A6]/10"
            >
              <Send size={14} />
              Publish Locally
            </MagneticButton>
          </motion.form>

          <div className="grid gap-4 sm:grid-cols-2">
            {allReviews.slice(0, 4).map((review, index) => (
              <motion.article
                key={`${review.name}-${review.city}-${review.date}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springSmooth, delay: index * 0.06 }}
                className="rounded-lg border border-white/10 bg-white/[0.055] p-4 text-left backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg text-white">{review.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">{review.city}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={13}
                        className={starIndex < review.rating ? 'fill-[#E0C9A6] text-[#E0C9A6]' : 'text-white/15'}
                      />
                    ))}
                  </div>
                </div>
                <p className="line-clamp-4 text-sm font-light leading-6 text-white/68">{review.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
