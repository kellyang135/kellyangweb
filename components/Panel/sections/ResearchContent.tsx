// components/Panel/sections/ResearchContent.tsx
import { research } from '@/lib/content';
import ExperienceCard from './ExperienceCard';

export default function ResearchContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Research</h2>
      <div className="space-y-4">
        {research.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} accentColor="crystal-atom" />
        ))}
      </div>
    </div>
  );
}
