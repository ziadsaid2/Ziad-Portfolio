import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque, Syne, Unbounded } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import SmoothFollower from "@/components/smooth-follower";
import BootScreen from "@/components/boot-screen";
import ServerBootstrapScripts from "@/components/server-bootstrap-scripts";
import { getThemeScript, STORAGE_KEY } from "@/components/theme-tokens";
import ThemeToggle from "@/components/theme-toggle";
import FloatingProgressIndicator from "@/components/floating-progress-indicator";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const wideFont = Unbounded({
  weight: ["400", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-wide",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ziad Said — Full Stack Developer",
  description: "Full Stack Developer specializing in SaaS products, CRM systems, and messaging platforms. Building modern web experiences with Next.js, React, TypeScript, and NestJS.",
  authors: [{ name: "Ziad Said", url: SITE_URL }],
  keywords: [
    "Ziad Said",
    "Full Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "NestJS",
    "Node.js",
    "Portfolio",
    "Egypt",
    "Remote",
    "SaaS",
    "CRM",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Ziad Said — Full Stack Developer",
    description: "Full Stack Developer specializing in SaaS products, CRM systems, and messaging platforms. Building modern web experiences with Next.js, React, TypeScript, and NestJS.",
    siteName: "Ziad Said Portfolio",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ziad Said — Full Stack Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziad Said — Full Stack Developer",
    description: "Full Stack Developer specializing in SaaS products, CRM systems, and messaging platforms.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const scrollResetScript = `
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = getThemeScript(STORAGE_KEY);
  
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${anton.variable} ${bricolage.variable} ${syne.variable} ${wideFont.variable} antialiased`}
    >
      <body>
        <ServerBootstrapScripts
          themeScript={themeScript}
          scrollResetScript={scrollResetScript}
        />
        <BootScreen />
        <SmoothFollower />
        <ThemeToggle />
        <FloatingProgressIndicator />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
