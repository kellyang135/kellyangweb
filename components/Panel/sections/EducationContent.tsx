// components/Panel/sections/EducationContent.tsx
import { education, skills, awards } from '@/lib/content';

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
        <div className="space-y-4">
          {awards.map((award, i) => (
            <div key={i} className="border-l-2 border-crystal-accent/50 pl-4">
              <h4 className="font-medium text-crystal-text">{award.title}</h4>
              <p className="text-crystal-muted text-sm">{award.issuer} · {award.date}</p>
              {award.place && (
                <p className="text-crystal-accent text-sm">{award.place}</p>
              )}
              {award.description && (
                <p className="text-crystal-muted text-sm mt-1">{award.description}</p>
              )}
              {award.awards && (
                <ul className="mt-2 space-y-1">
                  {award.awards.map((a, j) => (
                    <li key={j} className="text-crystal-muted text-sm pl-2">- {a}</li>
                  ))}
                </ul>
              )}
              {award.additionalAwards && (
                <ul className="mt-2 space-y-1">
                  {award.additionalAwards.map((a, j) => (
                    <li key={j} className="text-crystal-muted text-sm pl-2">- {a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
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
