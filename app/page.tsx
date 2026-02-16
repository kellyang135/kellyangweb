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
      {/* Title overlay - positioned above the cube */}
      <div
        className={`fixed inset-x-0 top-0 flex justify-center pt-8 sm:pt-12 pointer-events-none z-10 transition-all duration-300 ${
          activeNode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-crystal-muted/70 tracking-wide lowercase">
          kelly yang
        </h1>
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
