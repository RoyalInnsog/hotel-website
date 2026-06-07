import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, CreditCard, FileCheck2, IndianRupee, Sparkles, TicketPercent } from 'lucide-react';
import {
  buildBookingMessage,
  buildUpiUrl,
  buildWhatsAppUrl,
  canLaunchUpiIntent,
  sanitizePromoCode,
  useBookingForm,
  type BookingFormData,
} from '../hooks/useBookingForm';
import AnimatedCurrency from './ui/AnimatedCurrency';
import FloatingInput from './ui/FloatingInput';
import FloatingSelect from './ui/FloatingSelect';
import MagneticButton from './ui/MagneticButton';
import SectionLabel from './ui/SectionLabel';

// P12: Standardized spring configurations
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const springDefault = { type: 'spring' as const, stiffness: 120, damping: 18 };

const ROOM_OPTIONS = [
  { value: '1', label: '1 Room' },
  { value: '2', label: '2 Rooms' },
  { value: '3', label: '3 Rooms' },
  { value: '4+', label: '4+ Rooms' },
];

/** Stagger delay for form field entrance */
const fieldDelay = (i: number) => ({ ...springSmooth, delay: 0.08 + i * 0.06 });

export default function BookingForm() {
  const {
    form,
    estimatedPrice,
    minimumDates,
    formatAadhaar,
  } = useBookingForm();

  const { register, handleSubmit: hookFormSubmit, formState: { errors }, watch, setValue } = form;
  const formData = watch();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const roomNightSummary = useMemo(
    () =>
      `${estimatedPrice.numRooms} room${estimatedPrice.numRooms > 1 ? 's' : ''} x ${estimatedPrice.nights} night${
        estimatedPrice.nights > 1 ? 's' : ''
      }`,
    [estimatedPrice.numRooms, estimatedPrice.nights]
  );

  const bookingSteps = useMemo(
    () => [
      {
        label: 'Detail Entry',
        icon: FileCheck2,
        isComplete: Boolean(formData.name && formData.mobile && formData.email && formData.city && formData.checkIn && formData.checkOut),
      },
      {
        label: 'Discount Promo',
        icon: TicketPercent,
        isComplete: estimatedPrice.promoApplied,
      },
      {
        label: 'Confirm & Pay',
        icon: CreditCard,
        isComplete: estimatedPrice.total > 0 && Boolean(formData.checkIn && formData.checkOut),
      },
    ],
    [
      estimatedPrice.promoApplied,
      estimatedPrice.total,
      formData.checkIn,
      formData.checkOut,
      formData.city,
      formData.email,
      formData.mobile,
      formData.name,
    ]
  );

  const onSubmit = useCallback(
    (cleanFormData: BookingFormData) => {
      const bookingMessage = buildBookingMessage(cleanFormData, estimatedPrice);
      const waUrl = buildWhatsAppUrl(bookingMessage);
      const upiUrl = buildUpiUrl(estimatedPrice.total);

      setIsSubmitted(true);
      
      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Attempt UPI intent only on mobile (avoid breaking desktop experience)
      if (canLaunchUpiIntent()) {
        setTimeout(() => {
          window.location.assign(upiUrl);
        }, 500);
      }

      window.setTimeout(() => {
        setIsSubmitted(false);
        form.reset();
      }, 5000);
    },
    [estimatedPrice, form]
  );

  return (
    <section id="booking" className="relative z-10 bg-white py-20 sm:py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-12">
        <div className="mb-12 text-center sm:mb-16">
          <SectionLabel text="Reserve Your Stay" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springSmooth}
            className="font-serif text-3xl font-light leading-[1.1] text-[#1B263B] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Secure your <span className="italic text-[#E0C9A6]">Reservation.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSmooth, delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-sm font-light text-[#1B263B]/55 sm:text-base"
          >
            Share your travel details and our front desk will confirm the stay on WhatsApp.
          </motion.p>
        </div>

        <motion.ol
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springSmooth}
          className="mb-8 grid grid-cols-3 gap-2 sm:mb-10 sm:gap-4"
          aria-label="Booking progress"
        >
          {bookingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.label}
                layout
                transition={{ ...springSmooth, delay: index * 0.06 }}
                className={`relative overflow-hidden rounded-lg border px-3 py-3 text-left transition-colors duration-500 sm:px-4 sm:py-4 ${
                  step.isComplete
                    ? 'border-[#E0C9A6]/50 bg-[#1B263B] text-white'
                    : 'border-[#1B263B]/10 bg-[#faf9f6] text-[#1B263B]'
                }`}
              >
                <motion.span
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#E0C9A6]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step.isComplete ? 1 : 0.18 }}
                  transition={springDefault}
                />
                <span className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-semibold uppercase tracking-widest opacity-60">
                    Step {index + 1}
                  </span>
                  <Icon size={15} className={step.isComplete ? 'text-[#E0C9A6]' : 'text-[#B9966D]'} />
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest sm:text-xs">
                  {step.label}
                </span>
              </motion.li>
            );
          })}
        </motion.ol>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={springSmooth}
              className="rounded-lg border border-[#1B263B]/5 bg-[#faf9f6] p-10 text-center shadow-[0_20px_60px_rgba(27,38,59,0.05)] sm:p-16"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springDefault, delay: 0.15 }}>
                <CheckCircle size={64} className="mx-auto mb-6 text-emerald-500" strokeWidth={1.5} />
              </motion.div>
              <h3 className="mb-3 font-serif text-2xl text-[#1B263B] sm:text-3xl">Booking Sent</h3>
              <p className="font-light text-[#1B263B]/60">
                WhatsApp is opening with your booking details for final confirmation.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springSmooth}
              onSubmit={hookFormSubmit(onSubmit)}
              noValidate
              className="grid grid-cols-1 gap-6 rounded-lg border border-[#1B263B]/5 bg-[#faf9f6] p-6 shadow-[0_20px_60px_rgba(27,38,59,0.05)] sm:gap-8 sm:p-8 md:grid-cols-2 md:p-12"
            >
              {/* Staggered field entrance animations */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(0)}
              >
                <FloatingInput
                  label="Full Name"
                  placeholder="Name as shown on ID"
                  required
                  maxLength={80}
                  autoComplete="name"
                  {...register('name')}
                  value={formData.name || ''}
                  error={errors.name?.message}
                  touched={!!errors.name}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(1)}
              >
                <FloatingInput
                  label="WhatsApp / Mobile"
                  type="tel"
                  placeholder="9876543210"
                  required
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                  {...register('mobile')}
                  value={formData.mobile || ''}
                  onChange={(e) => setValue('mobile', e.target.value.replace(/\D/g, '').slice(0, 10), { shouldValidate: true })}
                  error={errors.mobile?.message}
                  touched={!!errors.mobile}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(2)}
              >
                <FloatingInput
                  label="Email Address"
                  type="email"
                  placeholder="Email for confirmation"
                  required
                  maxLength={120}
                  autoComplete="email"
                  {...register('email')}
                  value={formData.email || ''}
                  error={errors.email?.message}
                  touched={!!errors.email}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(3)}
              >
                <FloatingInput
                  label="Aadhaar / ID Number"
                  placeholder="12-digit ID number"
                  required
                  maxLength={14}
                  inputMode="numeric"
                  autoComplete="off"
                  {...register('aadhaar')}
                  value={formData.aadhaar || ''}
                  onChange={(e) => setValue('aadhaar', formatAadhaar(e.target.value), { shouldValidate: true })}
                  error={errors.aadhaar?.message}
                  touched={!!errors.aadhaar}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(4)}
              >
                <FloatingInput
                  label="City of Origin"
                  placeholder="Jaipur"
                  required
                  maxLength={60}
                  autoComplete="address-level2"
                  {...register('city')}
                  value={formData.city || ''}
                  error={errors.city?.message}
                  touched={!!errors.city}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(5)}
              >
                <FloatingInput
                  label="Check-In Date"
                  type="date"
                  required
                  min={minimumDates.checkIn}
                  {...register('checkIn')}
                  value={formData.checkIn || ''}
                  error={errors.checkIn?.message}
                  touched={!!errors.checkIn}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(6)}
              >
                <FloatingInput
                  label="Check-Out Date"
                  type="date"
                  required
                  min={minimumDates.checkOut}
                  {...register('checkOut')}
                  value={formData.checkOut || ''}
                  error={errors.checkOut?.message}
                  touched={!!errors.checkOut}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(7)}
              >
                <FloatingSelect
                  label="Number of Rooms"
                  options={ROOM_OPTIONS}
                  required
                  {...register('rooms')}
                  value={formData.rooms || ''}
                  error={errors.rooms?.message}
                  touched={!!errors.rooms}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(8)}
              >
                <FloatingInput
                  label="Luxury Promo Code"
                  placeholder="ROYALINN"
                  maxLength={20}
                  autoComplete="off"
                  {...register('promo')}
                  value={formData.promo || ''}
                  onChange={(e) => setValue('promo', sanitizePromoCode(e.target.value), { shouldValidate: true })}
                  error={errors.promo?.message}
                  touched={!!errors.promo}
                />
                {formData.promo && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1.5 text-[10px] tracking-wider uppercase ${
                      estimatedPrice.promoApplied ? 'text-emerald-600 font-semibold' : 'text-red-500'
                    }`}
                  >
                    {estimatedPrice.promoMessage}
                  </motion.p>
                )}
              </motion.div>
 
              {/* Dynamic Pricing Estimator */}
              <motion.div
                className="relative overflow-hidden rounded-lg border border-[#E0C9A6]/20 bg-gradient-to-br from-[#1B263B]/[0.04] via-[#E0C9A6]/[0.06] to-[#1B263B]/[0.03] p-4 sm:p-6 md:col-span-2"
                layout
                transition={springSmooth}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Subtle animated glow on the border */}
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-lg opacity-0"
                  animate={{
                    opacity: [0, 0.5, 0],
                    background: [
                      'linear-gradient(135deg, rgba(224,201,166,0.15) 0%, transparent 50%, rgba(224,201,166,0.1) 100%)',
                      'linear-gradient(135deg, transparent 0%, rgba(224,201,166,0.2) 50%, transparent 100%)',
                      'linear-gradient(135deg, rgba(224,201,166,0.1) 0%, transparent 50%, rgba(224,201,166,0.15) 100%)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                />
 
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#1B263B]/55">
                      <IndianRupee size={11} strokeWidth={2} />
                      Estimated Cost
                    </span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={springDefault}
                      className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-widest text-[#E0C9A6]/70"
                    >
                      <Sparkles size={10} strokeWidth={2} />
                      Live Estimate
                    </motion.span>
                  </div>
 
                  <div className="flex flex-col gap-1 text-sm font-light text-[#1B263B]/65 sm:flex-row sm:items-center sm:justify-between">
                    <motion.span
                      key={roomNightSummary}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={springDefault}
                    >
                      Rs. {estimatedPrice.pricePerRoom.toLocaleString('en-IN')} x {roomNightSummary}
                    </motion.span>
                    <AnimatedCurrency value={estimatedPrice.subtotal} />
                  </div>

                  {estimatedPrice.discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={springDefault}
                      className="flex items-center justify-between text-sm font-light text-emerald-600"
                    >
                      <span>Discount ({sanitizePromoCode(formData.promo)})</span>
                      <span>
                        - <AnimatedCurrency value={estimatedPrice.discount} />
                      </span>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between text-sm font-light text-[#1B263B]/65">
                    <span>GST (12%)</span>
                    <AnimatedCurrency value={estimatedPrice.tax} />
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-[#E0C9A6]/30 to-transparent" />
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#1B263B]/75">Total</span>
                    <AnimatedCurrency
                      value={estimatedPrice.total}
                      className="font-serif text-2xl font-light text-[#E0C9A6] sm:text-3xl"
                    />
                  </div>
                </div>
              </motion.div>
 
              <motion.div
                className="mt-2 sm:mt-4 md:col-span-2"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={fieldDelay(9)}
              >
                <MagneticButton
                  type="submit"
                  showPulse
                  className="w-full rounded-lg bg-[#1B263B] py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-colors duration-300 hover:bg-[#E0C9A6] hover:text-[#1B263B] hover:shadow-[0_0_25px_rgba(224,201,166,0.4)]"
                >
                  Proceed to Payment
                </MagneticButton>
                <p className="mt-3 text-center text-[10px] font-light text-[#1B263B]/35">
                  You will be redirected to WhatsApp to confirm your booking with our front desk.
                </p>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
