// components/Panel/sections/IndustryContent.tsx
import { industry, extracurricular } from '@/lib/content';
import ExperienceCard from './ExperienceCard';

export default function IndustryContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Industry</h2>
      <div className="space-y-4">
        {industry.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} accentColor="crystal-accent" />
        ))}
      </div>

      <h3 className="text-xl font-semibold text-green-400 mt-8">Extracurricular</h3>
      <div className="space-y-4">
        {extracurricular.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} accentColor="green-400" />
        ))}
      </div>
    </div>
  );
}
