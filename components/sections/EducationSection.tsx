import { education, skills, honors } from "@/lib/content";

export default function EducationSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass-panel p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Education</h2>

        {education.map((edu, i) => (
          <div key={i} className="mb-4 border-l-2 border-purple-400/30 pl-4">
            <h4 className="font-semibold text-crystal-text">{edu.school}</h4>
            <p className="text-crystal-muted text-sm">{edu.degree}</p>
            <p className="text-crystal-muted text-sm">{edu.duration}</p>
          </div>
        ))}

        <h3 className="text-xl font-semibold mt-8 mb-4">Technical Skills</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-crystal-atom">Languages:</span> <span className="text-crystal-muted">{skills.languages.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Frameworks & Libraries:</span> <span className="text-crystal-muted">{skills.frameworks.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Databases & Infrastructure:</span> <span className="text-crystal-muted">{skills.databases.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Hardware & Tools:</span> <span className="text-crystal-muted">{skills.tools.join(", ")}</span></p>
          <p><span className="text-crystal-atom">Languages (Human):</span> <span className="text-crystal-muted">{skills.humanLanguages.join(", ")}</span></p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Honors & Awards</h3>
        <ul className="text-crystal-muted text-sm space-y-1">
          {honors.map((honor, i) => (
            <li key={i}>- {honor}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
