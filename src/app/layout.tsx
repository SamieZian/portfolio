import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/Sound";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = "Sampat Hake · Backend & AI Engineer";
const description =
  "Sampat Hake, backend and AI engineer in Bangalore. SDE 2 at Kotak Mahindra Bank building loan origination systems; previously founding engineer of an MCP AI agent platform used by 1,000+ organizations.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sampathake.in"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "https://sampathake.in", title, description, siteName: "Sampat Hake" },
  twitter: { card: "summary_large_image", title, description },
  authors: [{ name: "Sampat Hake", url: "https://sampathake.in" }],
};

export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sampat Hake",
  alternateName: "Sampatrao Hake",
  url: "https://sampathake.in",
  jobTitle: "Software Development Engineer 2 (Backend)",
  worksFor: { "@type": "Organization", name: "Kotak Mahindra Bank" },
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Dr. Babasaheb Ambedkar Technological University" },
  knowsAbout: ["Backend Engineering", "Distributed Systems", "AI Agents", "Model Context Protocol", "Python", "Go", "FastAPI", "AWS", "GCP"],
  sameAs: ["https://www.linkedin.com/in/sampatraohake121", "https://github.com/SamieZian"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-acid focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <SoundProvider>
          <SmoothScroll />
          <Cursor />
          <div className="grain" aria-hidden />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
