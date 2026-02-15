'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Node from './Node';
import Bond from './Bond';
import { getProjectedNodes, bonds, ProjectedNode } from '@/lib/latticePositions';

interface LatticeProps {
  activeNode: string | null;
  onNodeClick: (nodeId: string) => void;
  compressed?: boolean;
}

export default function Lattice({ activeNode, onNodeClick, compressed = false }: LatticeProps) {
  const scale = compressed ? 60 : 100;
  const nodes = useMemo(() => getProjectedNodes(scale), [scale]);

  // Create a map for quick node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, ProjectedNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Calculate viewBox to center the lattice
  const padding = 100;
  const minX = Math.min(...nodes.map((n) => n.px)) - padding;
  const maxX = Math.max(...nodes.map((n) => n.px)) + padding;
  const minY = Math.min(...nodes.map((n) => n.py)) - padding;
  const maxY = Math.max(...nodes.map((n) => n.py)) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <motion.svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      className="w-full h-full"
      animate={{ scale: compressed ? 0.85 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Bonds first (behind nodes) */}
      {bonds.map((bond) => {
        const fromNode = nodeMap.get(bond.from);
        const toNode = nodeMap.get(bond.to);
        if (!fromNode || !toNode) return null;
        return (
          <Bond
            key={`${bond.from}-${bond.to}`}
            from={fromNode}
            to={toNode}
          />
        );
      })}

      {/* Nodes on top */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isActive={activeNode === node.id}
          onClick={() => onNodeClick(node.id)}
        />
      ))}
    </motion.svg>
  );
}
