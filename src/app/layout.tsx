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
      <body>{children}</body>
    </html>
  );
}
