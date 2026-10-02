import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
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