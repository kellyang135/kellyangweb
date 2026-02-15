'use client';

import { useState } from 'react';
import { Lattice } from '@/components/Lattice';
import { Panel } from '@/components/Panel';

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    // If clicking the same node, close the panel
    if (activeNode === nodeId) {
      setActiveNode(null);
    } else {
      setActiveNode(nodeId);
    }
  };

  const handleClose = () => {
    setActiveNode(null);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-crystal-bg">
      {/* Lattice - compresses when panel is open */}
      <div
        className={`fixed inset-0 transition-all duration-300 flex items-center justify-center ${
          activeNode ? 'lg:right-[60%] sm:right-[80%]' : 'right-0'
        }`}
      >
        <Lattice
          activeNode={activeNode}
          onNodeClick={handleNodeClick}
          compressed={!!activeNode}
        />
      </div>

      {/* Panel */}
      <Panel activeNode={activeNode} onClose={handleClose} />
    </main>
  );
}
