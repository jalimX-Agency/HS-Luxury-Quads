'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export function FadeIn({ children, delay = 0, className, direction = 'up' }: FadeInProps) {
  const initial =
    direction === 'up' ? { opacity: 0, y: 40 }
    : direction === 'left' ? { opacity: 0, x: -40 }
    : direction === 'right' ? { opacity: 0, x: 40 }
    : { opacity: 0 };

  const animate =
    direction === 'up' ? { opacity: 1, y: 0 }
    : direction === 'left' ? { opacity: 1, x: 0 }
    : direction === 'right' ? { opacity: 1, x: 0 }
    : { opacity: 1 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
