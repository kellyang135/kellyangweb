'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
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

// Hook to detect mobile vs desktop
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

  // Animation variants based on screen size
  const panelVariants = {
    initial: isDesktop ? { x: '100%' } : { y: '100%' },
    animate: isDesktop ? { x: 0 } : { y: 0 },
    exit: isDesktop ? { x: '100%' } : { y: '100%' },
  };

  return (
    <AnimatePresence>
      {activeNode && Content && (
        <>
          {/* Backdrop for closing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />

          {/* Panel - Mobile: bottom sheet, Desktop: side panel */}
          <motion.div
            initial={panelVariants.initial}
            animate={panelVariants.animate}
            exit={panelVariants.exit}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed z-50 bg-[#12121a] border-white/10
              inset-x-0 bottom-0 h-[85vh] rounded-t-2xl border-t
              lg:inset-y-0 lg:right-0 lg:left-auto lg:bottom-auto lg:w-[60%] lg:h-full lg:rounded-none lg:border-l lg:border-t-0"
          >
            {/* Drag handle - mobile only */}
            <div className="lg:hidden flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 lg:top-6 lg:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              aria-label="Close panel"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            </button>

            {/* Content */}
            <div className="h-full overflow-y-auto p-6 pt-4 lg:p-8 lg:pt-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
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
