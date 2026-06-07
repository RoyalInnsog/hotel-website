import React, { useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
  prefix?: string;
}

const currencySpring = { stiffness: 100, damping: 15, mass: 0.35 };

const AnimatedCurrency = React.memo(function AnimatedCurrency({
  value,
  className = '',
  prefix = 'Rs. ',
}: AnimatedCurrencyProps) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, currencySpring);

  const formatter = useMemo(() => new Intl.NumberFormat('en-IN'), []);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  // P11 Fix: useTransform drives display without React re-renders
  const displayText = useTransform(springValue, (latest) =>
    `${prefix}${formatter.format(Math.round(latest))}`
  );

  return <motion.span className={className}>{displayText}</motion.span>;
});

export default AnimatedCurrency;
