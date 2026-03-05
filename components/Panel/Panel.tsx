'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAnimationStore } from '@/lib/useAnimationStore';
import AboutContent from './sections/AboutContent';
import ResearchContent from './sections/ResearchContent';
import IndustryContent from './sections/IndustryContent';
import ProjectsContent from './sections/ProjectsContent';
import EducationContent from './sections/EducationContent';
import ContactContent from './sections/ContactContent';

interface PanelProps {
  activeNode: string | null;
  onClose: () => void;
}

const contentMap: Record<string, React.ComponentType> = {
  kelly: AboutContent,
  research: ResearchContent,
  industry: IndustryContent,
  projects: ProjectsContent,
  education: EducationContent,
  contact: ContactContent,
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function Panel({ activeNode, onClose }: PanelProps) {
  const Content = activeNode ? contentMap[activeNode] : null;
  const isDesktop = useIsDesktop();
  const phase = useAnimationStore((s) => s.phase);

  // Crystal growth animation - starts thin, expands to full width
  const panelVariants = {
    initial: isDesktop
      ? { scaleX: 0, opacity: 0, originX: 1 }
      : { scaleY: 0, opacity: 0, originY: 1 },
    animate: isDesktop
      ? { scaleX: 1, opacity: 1, originX: 1 }
      : { scaleY: 1, opacity: 1, originY: 1 },
    exit: isDesktop
      ? { scaleX: 0, opacity: 0, originX: 1 }
      : { scaleY: 0, opacity: 0, originY: 1 },
  };

  const showPanel = phase === 'transitioning' || phase === 'open';

  return (
    <AnimatePresence>
      {activeNode && Content && showPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Crystal growth panel */}
          <motion.div
            initial={panelVariants.initial}
            animate={panelVariants.animate}
            exit={panelVariants.exit}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1], // Custom easing for crystal feel
            }}
            className="fixed z-50 bg-[#12121a]/95 border-white/10 backdrop-blur-xl
              inset-x-0 bottom-0 h-[85vh] rounded-t-2xl border-t
              lg:inset-y-0 lg:right-0 lg:left-auto lg:bottom-auto lg:w-[60%] lg:h-full lg:rounded-none lg:border-l lg:border-t-0"
            style={{
              boxShadow: '0 0 60px rgba(79, 209, 197, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Crystalline edge glow */}
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-teal-400/30 to-transparent lg:block hidden" />

            {/* Drag handle - mobile only */}
            <div className="lg:hidden flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Close button - hexagonal style */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 lg:top-6 lg:right-6 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 hover:rotate-90 transition-all duration-300 z-10 border border-white/10"
              aria-label="Close panel"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>

            {/* Content with crystallize animation */}
            <div className="h-full overflow-y-auto p-6 pt-4 lg:p-8 lg:pt-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(4px)', y: -10 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2, // Wait for panel to grow
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Content />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
