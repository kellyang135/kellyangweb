// components/Lattice/Node.tsx
'use client';

import { motion } from 'framer-motion';
import { ProjectedNode, getNodeColor, getNodeSize } from '@/lib/latticePositions';

interface NodeProps {
  node: ProjectedNode;
  isActive: boolean;
  onClick: () => void;
  animate?: boolean;
  animationDelay?: number;
  isKelly?: boolean;
}

export default function Node({ node, isActive, onClick, animate = true, animationDelay = 0, isKelly = false }: NodeProps) {
  const size = getNodeSize(node.z);
  const color = getNodeColor(node.z);

  // Kelly node gets a special entrance glow pulse after all animations complete
  const kellyGlowAnimation = isKelly && animate ? {
    scale: [1, 1.8, 1.4, 1],
    opacity: [0.2, 0.6, 0.4, 0.2],
  } : undefined;

  return (
    <motion.g
      initial={animate ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: animationDelay, duration: 0.5, ease: 'easeOut' }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <motion.circle
        cx={node.px}
        cy={node.py}
        r={size * 1.5}
        fill={color}
        opacity={0.2}
        initial={{ scale: 1 }}
        animate={
          isActive
            ? { scale: 1.3, opacity: 0.4 }
            : kellyGlowAnimation || { scale: 1, opacity: 0.2 }
        }
        transition={
          isKelly && animate && !isActive
            ? { delay: 1.2, duration: 0.8, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      />

      {/* Main node */}
      <motion.circle
        cx={node.px}
        cy={node.py}
        r={size}
        fill={color}
        whileHover={{ scale: 1.15 }}
        animate={isActive ? { scale: 1.2 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* Label */}
      <motion.text
        x={node.px}
        y={node.py + size + 20}
        textAnchor="middle"
        fill="var(--crystal-text)"
        fontSize="14"
        fontFamily="var(--font-sans)"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {node.label}
      </motion.text>
    </motion.g>
  );
}
