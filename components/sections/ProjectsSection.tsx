import { projects } from "@/lib/content";

interface ProjectCardProps {
  title: string;
  tech: string[];
  description: string[];
}

function ProjectCard({ title, tech, description }: ProjectCardProps) {
  return (
    <div className="glass-panel p-6 mb-4">
      <h4 className="font-semibold text-crystal-text text-lg mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2 mb-3">
        {tech.map((t) => (
          <span key={t} className="px-2 py-0.5 text-xs bg-crystal-accent/20 text-crystal-accent rounded">
            {t}
          </span>
        ))}
      </div>
      <ul className="text-crystal-muted text-sm space-y-1">
        {description.map((item, i) => (
          <li key={i}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
