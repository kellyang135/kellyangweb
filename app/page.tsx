'use client';

import { useState } from 'react';
import { Crystal } from '@/components/Crystal';
import { Panel } from '@/components/Panel';

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
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
      {/* Title overlay */}
      <div
        className={`fixed inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-300 ${
          activeNode ? 'lg:right-[60%] sm:right-[80%] opacity-0' : 'right-0 opacity-100'
        }`}
      >
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-crystal-text tracking-tight">
            Kelly Yang
          </h1>
          <p className="text-crystal-muted mt-2 text-sm sm:text-base">Click a node to explore</p>
        </div>
      </div>

      {/* Crystal */}
      <div
        className={`fixed inset-0 transition-all duration-300 ${
          activeNode ? 'lg:right-[60%] sm:right-[80%]' : 'right-0'
        }`}
      >
        <Crystal
          activeNode={activeNode}
          onNodeClick={handleNodeClick}
          compressed={!!activeNode}
        />
      </div>

      <Panel activeNode={activeNode} onClose={handleClose} />
    </main>
  );
}
