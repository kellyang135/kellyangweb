// components/Panel/ContentBlock.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContentBlockProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ContentBlock({ children, delay = 0, className = '' }: ContentBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{
        duration: 0.3,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
