import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PRICE_PER_ROOM_PER_NIGHT = 1499;
const TAX_RATE = 0.12;
const MAX_WHATSAPP_ENCODED_TEXT_LENGTH = 1800;
const ROOM_COUNTS: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4+': 4,
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function sanitizeText(value: unknown, maxLength = 120): string {
  if (typeof value !== 'string') return '';

  return value
    .normalize('NFKC')
    .replace(/[<>{}`[\]\\]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeDigits(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function sanitizePromoCode(value: unknown): string {
  return sanitizeText(value, 20).toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

function sanitizeDateInput(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 10);
}

function sanitizeMessageLine(value: unknown, maxLength = 180): string {
  return sanitizeText(value, maxLength);
}

export function getTodayIso(): string {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60 * 1000;
  return new Date(today.getTime() - offset).toISOString().slice(0, 10);
}

export function addDaysIso(value: string, days: number): string {
  if (!value) return getTodayIso();
  const parsed = parseDateInput(value);
  if (!parsed) return getTodayIso();

  const next = new Date(parsed);
  next.setDate(next.getDate() + days);
  const offset = next.getTimezoneOffset() * 60 * 1000;
  return new Date(next.getTime() - offset).toISOString().slice(0, 10);
}

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }
  return parsed;
}

function getNights(checkIn: string, checkOut: string): number {
  const start = parseDateInput(checkIn);
  const end = parseDateInput(checkOut);
  if (!start || !end) return 1;

  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(1, Math.round((endUtc - startUtc) / MS_PER_DAY));
}

export function formatAadhaar(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 12);
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
}

const bookingSchema = z
  .object({
    name: z
      .string()
      .transform((value) => sanitizeText(value, 80))
      .pipe(
      z
        .string()
        .min(2, 'Name must be at least 2 characters.')
        .max(80, 'Name is too long.')
        .regex(/^[a-zA-Z\s.'-]+$/, "Use letters, spaces, apostrophes, or hyphens only.")
      ),
    email: z
      .string()
      .transform((value) => sanitizeText(value, 120).toLowerCase())
      .pipe(z.string().max(120, 'Email is too long.').email("Enter a valid email address.")),
    mobile: z
      .string()
      .transform((value) => sanitizeDigits(value, 10))
      .pipe(
      z
        .string()
        .regex(/^\d{10}$/, "Mobile must be exactly 10 digits.")
        .regex(/^[6-9]/, "Indian mobile numbers start with 6-9.")
      ),
    aadhaar: z
      .string()
      .transform((value) => sanitizeDigits(value, 12))
      .pipe(z.string().refine((val) => val.length === 12, "Aadhaar must be exactly 12 digits.")),
    city: z
      .string()
      .transform((value) => sanitizeText(value, 60))
      .pipe(
      z
        .string()
        .min(2, "Enter a valid city name.")
        .max(60, "City name is too long.")
        .regex(/^[a-zA-Z\s.'-]+$/, "Use letters, spaces, apostrophes, or hyphens only.")
      ),
    rooms: z.enum(['1', '2', '3', '4+'] as const, {
      message: "Select the number of rooms.",
    }),
    checkIn: z
      .string()
      .transform(sanitizeDateInput)
      .pipe(
      z
        .string()
        .min(1, "Check-in date is required.")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid check-in date.")
        .refine((value) => Boolean(parseDateInput(value)), "Use a valid check-in date.")
      ),
    checkOut: z
      .string()
      .transform(sanitizeDateInput)
      .pipe(
      z
        .string()
        .min(1, "Check-out date is required.")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid check-out date.")
        .refine((value) => Boolean(parseDateInput(value)), "Use a valid check-out date.")
      ),
    promo: z
      .string()
      .transform(sanitizePromoCode)
      .pipe(z.string().max(20, "Promo code is too long.").regex(/^[A-Z0-9-]*$/, "Use letters, numbers, or hyphens only.")),
  })
  .refine(
    (data) => {
      const today = getTodayIso();
      return data.checkIn >= today;
    },
    {
      message: "Check-in cannot be in the past.",
      path: ["checkIn"],
    }
  )
  .refine(
    (data) => {
      return data.checkOut > data.checkIn;
    },
    {
      message: "Check-out must be after check-in.",
      path: ["checkOut"],
    }
  );

export type BookingFormData = z.infer<typeof bookingSchema>;

export interface BookingPriceEstimate {
  pricePerRoom: number;
  numRooms: number;
  nights: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  promoApplied: boolean;
  promoMessage: string;
}

export function clampWhatsAppMessage(message: string): string {
  const cleaned = message
    .split('\n')
    .map((line) => sanitizeMessageLine(line))
    .filter(Boolean)
    .join('\n');

  if (encodeURIComponent(cleaned).length <= MAX_WHATSAPP_ENCODED_TEXT_LENGTH) {
    return cleaned;
  }

  const suffix = '\nDetails trimmed for secure WhatsApp delivery.';
  const lines: string[] = [];

  for (const line of cleaned.split('\n')) {
    const candidate = [...lines, line, suffix.trim()].join('\n');
    if (encodeURIComponent(candidate).length > MAX_WHATSAPP_ENCODED_TEXT_LENGTH) break;
    lines.push(line);
  }

  return `${lines.join('\n')}${suffix}`;
}

export function buildBookingMessage(
  formData: Partial<BookingFormData>,
  estimatedPrice: BookingPriceEstimate
): string {
  const promo = sanitizePromoCode(formData.promo);
  const lines = [
    'Hello Royal Inn, I want to book a room.',
    `Name: ${sanitizeMessageLine(formData.name, 80)}`,
    `Mobile: ${sanitizeDigits(formData.mobile, 10)}`,
    `Email: ${sanitizeMessageLine(formData.email, 120)}`,
    `Aadhaar: ${sanitizeDigits(formData.aadhaar, 12)}`,
    `City: ${sanitizeMessageLine(formData.city, 60)}`,
    `Rooms: ${sanitizeMessageLine(formData.rooms || '1', 2)}`,
    `Check-in: ${sanitizeDateInput(formData.checkIn)}`,
    `Check-out: ${sanitizeDateInput(formData.checkOut)}`,
    `Subtotal: Rs. ${estimatedPrice.subtotal.toLocaleString('en-IN')}`,
  ];

  if (estimatedPrice.discount > 0 && promo) {
    lines.push(`Promo: ${promo} (-Rs. ${estimatedPrice.discount.toLocaleString('en-IN')})`);
  }

  lines.push(
    `GST (12%): Rs. ${estimatedPrice.tax.toLocaleString('en-IN')}`,
    `Estimated Total: Rs. ${estimatedPrice.total.toLocaleString('en-IN')}`
  );

  return clampWhatsAppMessage(lines.join('\n'));
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/918209526458?text=${encodeURIComponent(clampWhatsAppMessage(message))}`;
}

export function buildUpiUrl(total: number): string {
  const amount = Math.max(0, Number.isFinite(total) ? total : 0).toFixed(2);
  const params = new URLSearchParams({
    pa: '9411480138@ybl',
    pn: 'Royal Inn Hotel',
    am: amount,
    cu: 'INR',
  });

  return `upi://pay?${params.toString()}`;
}

export function canLaunchUpiIntent(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;
  const hasMobileUserAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  return hasMobileUserAgent && hasCoarsePointer;
}

export function useBookingForm() {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      aadhaar: '',
      rooms: '1',
      checkIn: '',
      checkOut: '',
      city: '',
      promo: '',
    },
    mode: 'onTouched',
  });

  const formData = form.watch();

  const estimatedPrice = useMemo<BookingPriceEstimate>(() => {
    const numRooms = ROOM_COUNTS[formData.rooms] ?? 1;
    const nights = getNights(formData.checkIn, formData.checkOut);
    const subtotal = PRICE_PER_ROOM_PER_NIGHT * numRooms * nights;

    let discount = 0;
    let promoApplied = false;
    let promoMessage = '';
    const cleanPromo = sanitizePromoCode(formData.promo);

    if (cleanPromo === 'ROYAL500') {
      discount = 500;
      promoApplied = true;
      promoMessage = 'ROYAL500 applied! Flat Rs. 500 discount.';
    } else if (cleanPromo === 'ROYALINN') {
      discount = Math.round(subtotal * 0.1);
      promoApplied = true;
      promoMessage = 'ROYALINN applied! 10% luxury discount.';
    } else if (cleanPromo.length > 0) {
      promoMessage = 'Invalid promo code.';
    }

    const tax = Math.round((subtotal - discount) * TAX_RATE);

    return {
      pricePerRoom: PRICE_PER_ROOM_PER_NIGHT,
      numRooms,
      nights,
      subtotal,
      discount,
      tax,
      total: Math.max(0, subtotal - discount + tax),
      promoApplied,
      promoMessage,
    };
  }, [formData.rooms, formData.checkIn, formData.checkOut, formData.promo]);

  const minimumDates = useMemo(
    () => ({
      checkIn: getTodayIso(),
      checkOut: addDaysIso(formData.checkIn || getTodayIso(), 1),
    }),
    [formData.checkIn]
  );

  return {
    form,
    estimatedPrice,
    minimumDates,
    formatAadhaar,
  };
}
