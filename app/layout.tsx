import type { Metadata } from "next";
import { ScrollProvider } from "@/contexts/ScrollContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelly Yang | Materials Science & EECS @ UC Berkeley",
  description:
    "Portfolio of Kelly Yang - UC Berkeley student researching topological quantum materials, electronic skin sensors, and brain-computer interfaces.",
  keywords: [
    "Kelly Yang",
    "UC Berkeley",
    "Materials Science",
    "EECS",
    "Quantum Materials",
    "Electronic Skin",
    "Portfolio",
  ],
  authors: [{ name: "Kelly Yang" }],
  openGraph: {
    title: "Kelly Yang | Materials Science & EECS",
    description: "UC Berkeley student researching quantum materials and electronic skin sensors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
