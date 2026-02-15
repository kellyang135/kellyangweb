// components/Panel/sections/ExperienceCard.tsx
import { Experience } from '@/lib/content';

interface ExperienceCardProps {
  experience: Experience;
  accentColor: string;
}

export default function ExperienceCard({ experience, accentColor }: ExperienceCardProps) {
  return (
    <div className={`border-l-2 border-${accentColor} pl-4`}>
      <h4 className="font-semibold text-crystal-text">{experience.title}</h4>
      <p className={`text-${accentColor} text-sm`}>{experience.organization}</p>
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
