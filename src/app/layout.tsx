import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { site } from "@/data/site";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f0e1" },
    { media: "(prefers-color-scheme: dark)", color: "#121b16" },
  ],
};

export const metadata: Metadata = {
  // Bare domain only (no /repo-name). Next adds the base path to the share-image URL itself.
  metadataBase: new URL(site.url),
  icons: {
    icon: [
      { url: `${base}/favicon.ico`, sizes: "48x48" },
      { url: `${base}/icon.svg`, type: "image/svg+xml" },
    ],
    apple: `${base}/apple-icon.png`,
  },
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.name,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}