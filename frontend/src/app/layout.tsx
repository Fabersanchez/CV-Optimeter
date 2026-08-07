import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Optimeter AI | Enterprise ATS Optimization & Career AI SaaS",
  description: "AI-powered resume optimization, ATS scoring, STAR rewriter, cover letter generator, and LinkedIn profile tuning platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
