import type { Metadata } from "next";
import { ScrollProvider } from "@/contexts/ScrollContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelly Yang | Materials Science & EECS",
  description: "Portfolio of Kelly Yang - UC Berkeley MSE/EECS student",
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
