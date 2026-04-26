import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Privacy Vault",
  description:
    "Clean files before they reach AI tools, social platforms, or work systems. Remove hidden metadata in your browser with no server uploads.",
  keywords: [
    "privacy vault",
    "metadata removal",
    "image privacy",
    "EXIF data remover",
    "client-side privacy",
    "secure image processing",
  ],
  openGraph: {
    title: "Privacy Vault",
    description:
      "Clean files before sharing them with AI tools or online platforms, with no server uploads.",
    type: "website",
  },
  referrer: "no-referrer",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {/* Layer 0: Immersive Background (Pointer Events None) */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="animate-breathe absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(93,57,224,0.08),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        </div>

        {/* Layer 10: HUD Orchestrator */}
        <div className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
