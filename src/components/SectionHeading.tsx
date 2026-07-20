import React from 'react';
 import { motion } from 'framer-motion';

interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  dark = false
}) => {
  const isLeft = align === 'left';

  return (
    <div className={`mb-12 max-w-3xl ${isLeft ? 'text-left' : 'text-center mx-auto'}`}>
      {/* Top Badge */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="inline-block text-xs font-semibold uppercase tracking-widest text-gold mb-3"
      >
        ✦ {badge} ✦
      </motion.span>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${
          dark ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </motion.h2>

      {/* Underline Decoration */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`h-[3px] bg-gold mt-4 ${isLeft ? '' : 'mx-auto'}`}
      />

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-sm md:text-base mt-4 leading-relaxed ${
            dark ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
