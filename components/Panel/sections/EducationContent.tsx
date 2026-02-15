// components/Panel/sections/EducationContent.tsx
import { education, skills, honors } from '@/lib/content';

export default function EducationContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-crystal-text mb-4">Education</h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="border-l-2 border-crystal-atom pl-4">
              <h3 className="font-semibold text-crystal-text">{edu.school}</h3>
              <p className="text-crystal-atom text-sm">{edu.degree}</p>
              <p className="text-crystal-muted text-sm">{edu.duration}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-crystal-text mb-3">Skills</h3>
        <div className="space-y-3">
          <SkillRow label="Languages" items={skills.languages} />
          <SkillRow label="Frameworks" items={skills.frameworks} />
          <SkillRow label="Databases" items={skills.databases} />
          <SkillRow label="Tools" items={skills.tools} />
          <SkillRow label="Human Languages" items={skills.humanLanguages} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-crystal-text mb-3">Honors & Awards</h3>
        <ul className="space-y-2">
          {honors.map((honor, i) => (
            <li key={i} className="text-crystal-muted text-sm flex items-start gap-2">
              <span className="text-crystal-accent mt-1">★</span>
              {honor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkillRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <span className="text-crystal-muted text-sm">{label}: </span>
      <span className="text-crystal-text text-sm">{items.join(', ')}</span>
    </div>
  );
}
