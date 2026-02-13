"use client";

import { useScroll } from "@/contexts/ScrollContext";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function Navigation() {
  const { currentSection } = useScroll();

  const scrollToSection = (index: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / (sections.length - 1)) * scrollHeight;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <ul className="space-y-4">
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(index)}
              className="group flex items-center gap-3"
              aria-label={section.label}
            >
              <span
                className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                  currentSection === section.id ? "text-crystal-atom" : "text-crystal-muted"
                }`}
              >
                {section.label}
              </span>
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSection === section.id
                    ? "bg-crystal-atom scale-150"
                    : "bg-crystal-muted/50 group-hover:bg-crystal-muted"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
