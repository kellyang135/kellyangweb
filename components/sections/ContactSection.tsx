import { contact } from "@/lib/content";

export default function ContactSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6">Let&apos;s Connect</h2>
        <p className="text-crystal-muted mb-8">
          Interested in collaborating or have questions about my work? I&apos;d love to hear from you.
        </p>
        <div className="space-y-4">
          <a
            href={`mailto:${contact.email}`}
            className="block w-full py-3 px-6 bg-crystal-atom text-crystal-bg font-semibold rounded-lg hover:bg-crystal-atomGlow transition-colors"
          >
            {contact.email}
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-6 border border-crystal-atom text-crystal-atom rounded-lg hover:bg-crystal-atom/10 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
