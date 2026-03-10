'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '@/lib/useAnimationStore';
import AboutContent from './sections/AboutContent';
import ResearchContent from './sections/ResearchContent';
import IndustryContent from './sections/IndustryContent';
import ProjectsContent from './sections/ProjectsContent';
import EducationContent from './sections/EducationContent';
import ContactContent from './sections/ContactContent';
import WritingsContent from './sections/WritingsContent';

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
  writings: WritingsContent,
};

export default function Panel({ activeNode, onClose }: PanelProps) {
  const Content = activeNode ? contentMap[activeNode] : null;
  const phase = useAnimationStore((s) => s.phase);

  const showPanel = phase === 'transitioning' || phase === 'open';

  return (
    <AnimatePresence>
      {activeNode && Content && showPanel && (
        <>
          {/* Backdrop - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Centered modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed z-50 inset-4 sm:inset-8 lg:inset-16 xl:inset-24
              bg-[#12121a]/95 backdrop-blur-xl rounded-2xl border border-white/10
              flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 0 80px rgba(79, 209, 197, 0.15), 0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Subtle corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-teal-400/20 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-teal-400/20 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-teal-400/20 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-teal-400/20 rounded-br-2xl" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:rotate-90 transition-all duration-300 z-10 border border-white/10"
              aria-label="Close panel"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, filter: 'blur(6px)', y: 15 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(4px)', y: -10 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.15,
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
