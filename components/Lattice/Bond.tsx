'use client';

import { motion } from 'framer-motion';
import { ProjectedNode } from '@/lib/latticePositions';

interface BondProps {
  from: ProjectedNode;
  to: ProjectedNode;
  animate?: boolean;
}

export default function Bond({ from, to, animate = true }: BondProps) {
  const pathLength = Math.hypot(to.px - from.px, to.py - from.py);

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
      transition={{ delay: 0.6, duration: 0.4 }}
    />
  );
}
