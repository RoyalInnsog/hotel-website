import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useId, useState } from 'react';
import { Check, CircleAlert } from 'lucide-react';

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  min?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  error?: string;
  touched?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

const springTransition = { type: 'spring' as const, stiffness: 100, damping: 15 };

const FloatingInput = React.memo(function FloatingInput({
  label,
  name,
  type = 'text',
  value = '',
  placeholder = '',
  required = false,
  maxLength,
  min,
  inputMode,
  autoComplete,
  error,
  touched,
  onChange,
  onBlur,
  ref,
}: FloatingInputProps) {
  const uniqueId = useId();
  const inputId = `input-${name}-${uniqueId}`;
  const errorId = `${inputId}-error`;
  const hasError = touched && Boolean(error);
  const isValid = touched && !error && Boolean(value && value.length > 0);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return (
    <div className="relative group">
      <motion.label
        htmlFor={inputId}
        animate={{
          color: hasError ? 'rgba(220,38,38,0.85)' : isFocused ? '#E0C9A6' : 'rgba(27,38,59,0.62)',
        }}
        transition={{ duration: 0.2 }}
        className="mb-2 block text-[10px] font-semibold uppercase tracking-widest"
      >
        {label}
        {required && <span className="ml-1 text-[#E0C9A6]">*</span>}
      </motion.label>

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          min={min}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={hasError}
          aria-required={required}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full rounded-none border-b-2 bg-transparent py-3 pr-8 text-sm font-light text-[#1B263B] placeholder:text-[#1B263B]/25 transition-colors duration-300 focus:outline-none sm:text-base ${
            hasError
              ? 'border-red-400 focus:border-red-500'
              : isValid
                ? 'border-emerald-400/70 focus:border-emerald-500'
                : 'border-[#1B263B]/10 focus:border-[#E0C9A6]'
          }`}
        />

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[#E0C9A6] to-[#E0C9A6]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused || value ? 1 : 0 }}
          transition={springTransition}
          style={{ willChange: 'transform' }}
        />

        <AnimatePresence mode="wait">
          {isValid && (
            <motion.span
              key="valid"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={springTransition}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500"
              aria-hidden="true"
            >
              <Check size={16} strokeWidth={2} />
            </motion.span>
          )}
          {hasError && (
            <motion.span
              key="error"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={springTransition}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500"
              aria-hidden="true"
            >
              <CircleAlert size={16} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {hasError && (
          <motion.span
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={springTransition}
            className="mt-2 block text-[10px] font-medium uppercase tracking-widest text-red-500"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
});

export default FloatingInput;
