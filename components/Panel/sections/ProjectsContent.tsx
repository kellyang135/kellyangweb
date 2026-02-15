// components/Panel/sections/ProjectsContent.tsx
import { projects } from '@/lib/content';

export default function ProjectsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="border-l-2 border-lattice-back pl-4">
            <h3 className="font-semibold text-crystal-text text-lg">{project.title}</h3>
            <div className="flex flex-wrap gap-2 my-2">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-crystal-atom/20 text-crystal-atom"
                >
                  {tech}
                </span>
              ))}
            </div>
            <ul className="text-crystal-muted text-sm space-y-1">
              {project.description.map((item, i) => (
                <li key={i}>- {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
