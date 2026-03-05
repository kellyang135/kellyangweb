'use client';

import { useState, useEffect } from 'react';
import { Crystal } from '@/components/Crystal';
import { Panel } from '@/components/Panel';
import InteractiveTitle from '@/components/InteractiveTitle';
import { useAnimationStore } from '@/lib/useAnimationStore';

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const setPhase = useAnimationStore((s) => s.setPhase);
  const setIsMobile = useAnimationStore((s) => s.setIsMobile);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  const handleNodeClick = (nodeId: string) => {
    if (activeNode === nodeId) {
      handleClose();
    } else {
      setActiveNode(nodeId);
      // Phase transitions happen in Atom component
      setTimeout(() => setPhase('open'), 900);
    }
  };

  const handleClose = () => {
    setPhase('closing');
    setTimeout(() => {
      setActiveNode(null);
      setPhase('idle');
    }, 800); // Longer timeout for smoother close
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-crystal-bg">
      {/* Interactive title overlay */}
      <InteractiveTitle visible={!activeNode} />

      {/* Crystal - stays centered, modal pops over it */}
      <div className="fixed inset-0">
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
