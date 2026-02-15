'use client';

import { motion } from 'framer-motion';
import { ProjectedNode } from '@/lib/latticePositions';

interface BondProps {
  from: ProjectedNode;
  to: ProjectedNode;
  animate?: boolean;
  animationDelay?: number;
}

export default function Bond({ from, to, animate = true, animationDelay = 0.6 }: BondProps) {
  return (
    <motion.line
      x1={from.px}
      y1={from.py}
      x2={to.px}
      y2={to.py}
      stroke="var(--crystal-bond)"
      strokeWidth={1.5}
      initial={animate ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: animationDelay, duration: 0.3, ease: 'easeOut' }}
    />
  );
}
