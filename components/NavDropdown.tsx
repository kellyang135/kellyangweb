'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavDropdownProps {
  onNodeClick: (nodeId: string) => void;
  activeNode: string | null;
}

const navItems = [
  { id: 'kelly', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'industry', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
  { id: 'writings', label: 'Writings' },
];

export default function NavDropdown({ onNodeClick, activeNode }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (nodeId: string) => {
    onNodeClick(nodeId);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-crystal-atom hover:text-crystal-atom-glow transition-all duration-300"
        style={{
          textShadow: isOpen ? '0 0 20px rgba(79, 209, 197, 0.8)' : 'none',
        }}
      >
        <span className="font-medium tracking-wide">menu</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 py-2 min-w-[140px] bg-crystal-bg/90 backdrop-blur-md border border-white/10 rounded-lg"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`block w-full text-left px-4 py-2 text-sm transition-all duration-200 ${
                  activeNode === item.id
                    ? 'text-crystal-atom'
                    : 'text-crystal-muted hover:text-crystal-atom'
                }`}
                style={{
                  textShadow: activeNode === item.id ? '0 0 15px rgba(79, 209, 197, 0.6)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow = '0 0 15px rgba(79, 209, 197, 0.6)';
                }}
                onMouseLeave={(e) => {
                  if (activeNode !== item.id) {
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
