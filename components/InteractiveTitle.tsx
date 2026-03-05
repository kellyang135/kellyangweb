'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveTitleProps {
  visible: boolean;
}

export default function InteractiveTitle({ visible }: InteractiveTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center (-1 to 1)
      const x = (e.clientX - centerX) / (window.innerWidth / 2);
      const y = (e.clientY - centerY) / (window.innerHeight / 2);

      setMousePos({ x, y });

      // Check if mouse is near the title
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      setIsHovering(distance < 300);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Split into individual letters for staggered animation
  const letters = 'kelly yang'.split('');

  return (
    <motion.div
      ref={containerRef}
      className={`fixed inset-x-0 top-0 flex justify-center pt-8 sm:pt-12 z-10 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 4}px)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-wide lowercase flex">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{
              color: isHovering ? 'rgba(129, 230, 217, 0.9)' : 'rgba(160, 174, 192, 0.7)',
              textShadow: isHovering
                ? '0 0 30px rgba(79, 209, 197, 0.5), 0 0 60px rgba(79, 209, 197, 0.3)'
                : 'none',
              transform: `translateY(${Math.sin((mousePos.x * 3) + i * 0.3) * (isHovering ? 4 : 1)}px)`,
              transition: `color 0.4s ease, text-shadow 0.4s ease, transform 0.2s ease`,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </h1>
    </motion.div>
  );
}
