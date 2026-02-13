import { research, industry, extracurricular } from "@/lib/content";

interface ExperienceCardProps {
  title: string;
  organization: string;
  location: string;
  duration: string;
  description: string[];
  featured?: boolean;
}

function ExperienceCard({ title, organization, location, duration, description, featured }: ExperienceCardProps) {
  return (
    <div className={`border-l-2 ${featured ? 'border-crystal-atom' : 'border-crystal-atom/30'} pl-4 mb-6`}>
      <h4 className="font-semibold text-crystal-text">{title}</h4>
      <p className="text-crystal-atom text-sm">{organization}</p>
      <p className="text-crystal-muted text-sm mb-2">
        {location} | {duration}
      </p>
      <ul className="text-crystal-muted text-sm space-y-1">
        {description.map((item, i) => (
          <li key={i}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass-panel p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Experience</h2>

        <h3 className="text-xl font-semibold text-crystal-atom mb-4">Research</h3>
        {research.map((exp) => (
          <ExperienceCard key={exp.id} {...exp} />
        ))}

        <h3 className="text-xl font-semibold text-crystal-accent mb-4 mt-8">Industry</h3>
        {industry.map((exp) => (
          <ExperienceCard key={exp.id} {...exp} />
        ))}

        <h3 className="text-xl font-semibold text-green-400 mb-4 mt-8">Extracurricular</h3>
        {extracurricular.map((exp) => (
          <ExperienceCard key={exp.id} {...exp} />
        ))}
      </div>
    </section>
  );
}
