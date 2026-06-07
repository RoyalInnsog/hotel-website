import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import React, { useCallback, useRef } from 'react';

type MagneticButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  showPulse?: boolean;
};

const magneticSpring = { stiffness: 120, damping: 18 };

const MagneticButton = React.memo(function MagneticButton({
  children,
  className = '',
  type = 'button',
  showPulse = false,
  disabled = false,
  style,
  ...buttonProps
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, magneticSpring);
  const springY = useSpring(y, magneticSpring);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current || disabled || prefersReducedMotion) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      x.set((e.clientX - centerX) * 0.16);
      y.set((e.clientY - centerY) * 0.16);
    },
    [disabled, prefersReducedMotion, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, x: springX, y: springY }}
      whileTap={disabled || prefersReducedMotion ? undefined : { scale: 0.97 }}
      className={`relative cursor-pointer ${className} ${disabled ? 'opacity-50 !cursor-not-allowed' : ''}`}
      {...buttonProps}
    >
      {showPulse && !disabled && !prefersReducedMotion && (
        <span className="pulse-ring absolute inset-0 rounded-[inherit] pointer-events-none" aria-hidden="true" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

export default MagneticButton;
