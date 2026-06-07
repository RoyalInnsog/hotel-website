import React from 'react';
import { motion } from 'motion/react';

interface SectionLabelProps {
  text: string;
  centered?: boolean;
}

const spring = { type: 'spring' as const, stiffness: 100, damping: 15 };

const SectionLabel = React.memo(function SectionLabel({ text, centered = true }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...spring, delay: 0.1 }}
      className={`flex items-center gap-3 sm:gap-4 text-[#E0C9A6] ${centered ? 'justify-center' : ''} mb-6`}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ ...spring, delay: 0.3 }}
        className="h-[1px] bg-[#E0C9A6]/40"
      />
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium font-sans whitespace-nowrap">
        {text}
      </span>
      {centered && (
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.3 }}
          className="h-[1px] bg-[#E0C9A6]/40"
        />
      )}
    </motion.div>
  );
});

export default SectionLabel;
