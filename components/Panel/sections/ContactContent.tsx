// components/Panel/sections/ContactContent.tsx
import { contact } from '@/lib/content';

export default function ContactContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-crystal-text">Contact</h2>
      <div className="space-y-4">
        <a
          href={`mailto:${contact.email}`}
          className="block p-4 border border-crystal-atom/30 rounded-lg hover:border-crystal-atom transition-colors"
        >
          <p className="text-crystal-muted text-sm">Email</p>
          <p className="text-crystal-atom">{contact.email}</p>
        </a>

        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-lattice-back/30 rounded-lg hover:border-lattice-back transition-colors"
        >
          <p className="text-crystal-muted text-sm">LinkedIn</p>
          <p className="text-lattice-back">Kelly Yang</p>
        </a>
      </div>
    </div>
  );
}
