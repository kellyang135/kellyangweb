// components/Panel/sections/AboutContent.tsx
import { about } from '@/lib/content';

export default function AboutContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-crystal-text mb-2">About</h2>
        <p className="text-xl text-crystal-atom">{about.degree}</p>
        <p className="text-crystal-muted">{about.school} · {about.gradYear}</p>
      </div>

      <div>
        <p className="text-crystal-text leading-relaxed">{about.bio}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-crystal-text mb-3">Research Interests</h3>
        <ul className="space-y-2">
          {about.interests.map((interest, i) => (
            <li key={i} className="text-crystal-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-crystal-atom" />
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
