import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FloatingSelectProps {
  label: string;
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  touched?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  ref?: React.Ref<HTMLSelectElement>;
}

const springTransition = { type: 'spring' as const, stiffness: 100, damping: 15 };

const FloatingSelect = React.memo(function FloatingSelect({
  label,
  name,
  value = '',
  options,
  required = false,
  error,
  touched,
  onChange,
  onBlur,
  ref,
}: FloatingSelectProps) {
  const uniqueId = useId();
  const selectId = `select-${name}-${uniqueId}`;
  const errorId = `${selectId}-error`;
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && Boolean(error);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return (
    <div className="relative group">
      <motion.label
        htmlFor={selectId}
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
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          required={required}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={hasError}
          aria-required={required}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full cursor-pointer appearance-none rounded-none border-b-2 bg-transparent py-3 pr-8 text-sm font-light text-[#1B263B] transition-colors duration-300 focus:outline-none sm:text-base ${
            hasError ? 'border-red-400 focus:border-red-500' : 'border-[#1B263B]/10 focus:border-[#E0C9A6]'
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#E0C9A6] to-[#E0C9A6]"
          initial={{ width: '0%' }}
          animate={{ width: isFocused ? '100%' : '0%' }}
          transition={springTransition}
        />

        <motion.span
          animate={{ rotate: isFocused ? 180 : 0 }}
          transition={springTransition}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#1B263B]/35 transition-colors group-focus-within:text-[#E0C9A6]"
          aria-hidden="true"
        >
          <ChevronDown size={16} strokeWidth={1.75} />
        </motion.span>
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

export default FloatingSelect;
