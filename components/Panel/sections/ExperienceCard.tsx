// components/Panel/sections/ExperienceCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/lib/content';

interface ExperienceCardProps {
  experience: Experience;
  accentColor: string;
}

export default function ExperienceCard({ experience, accentColor }: ExperienceCardProps) {
  // Convert border color class to background color class for the animated border
  const bgColor = accentColor.replace('border-', 'bg-');

  return (
    <div className="relative pl-4">
      <motion.div
        className={`absolute left-0 top-0 bottom-0 w-0.5 ${bgColor}`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 0 }}
      />
      <h4 className="font-semibold text-crystal-text">{experience.title}</h4>
      <p className={`text-${accentColor.replace('border-', '')} text-sm`}>{experience.organization}</p>
      <p className="text-crystal-muted text-sm mb-2">
        {experience.location} | {experience.duration}
      </p>
      <ul className="text-crystal-muted text-sm space-y-1">
        {experience.description.map((item, i) => (
          <li key={i}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
