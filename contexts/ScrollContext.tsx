"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ScrollContextType {
  scrollProgress: number; // 0 to 1
  currentSection: string;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollProgress: 0,
  currentSection: "hero",
});

export function useScroll() {
  return useContext(ScrollContext);
}

const sections = ["hero", "about", "experience", "projects", "education", "contact"];

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / scrollHeight, 1);
      setScrollProgress(progress);

      // Determine current section based on progress
      const sectionIndex = Math.min(
        Math.floor(progress * sections.length),
        sections.length - 1
      );
      setCurrentSection(sections[sectionIndex]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollProgress, currentSection }}>
      {children}
    </ScrollContext.Provider>
  );
}
