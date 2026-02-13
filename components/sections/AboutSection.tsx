import { about } from "@/lib/content";

export default function AboutSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel p-8 max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-6">About</h2>

        <p className="text-xl text-crystal-text mb-2">{about.degree}</p>
        <p className="text-lg text-crystal-accent mb-8">{about.school}</p>

        <p className="text-sm text-crystal-muted uppercase tracking-wider mb-3">Research Interests</p>
        <div className="flex flex-wrap justify-center gap-2">
          {about.interests.map((interest) => (
            <span
              key={interest}
              className="px-4 py-2 text-sm bg-crystal-atom/20 text-crystal-atom rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
