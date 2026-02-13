import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelly Yang | Materials Science & EECS",
  description: "Portfolio of Kelly Yang - UC Berkeley MSE/EECS student",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
