import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://axon.org.pk"),
  title: {
    default: "AXON | Independent Tech & Leadership Organization",
    template: "%s | AXON",
  },
  description:
    "AXON is an independent technology, innovation, and leadership umbrella organization originating at IMAC, UET Lahore. Driving student engineering, 11 directorates, and multi-university chapters.",
  keywords: [
    "AXON Organization",
    "AXON Pakistan",
    "AXON Events",
    "IMAC UET Lahore",
    "student tech webinars",
    "AI/CS community Lahore",
    "university tech organizations Pakistan",
  ],
  authors: [{ name: "AXON Executive Council" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://axon.org.pk/",
    siteName: "AXON Umbrella Organization",
    title: "AXON | Independent Tech & Leadership Organization",
    description:
      "Empowering the next generation of tech leaders through workshops, events, and collaborative innovation wings.",
    images: [
      {
        url: "https://axon.org.pk/assets/og-cover.png",
        width: 1200,
        height: 630,
        alt: "AXON Organization Official",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AXON | Independent Tech & Leadership Organization",
    description:
      "Empowering the next generation of tech leaders through workshops, events, and collaborative innovation wings.",
    images: ["https://axon.org.pk/assets/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AXON",
  url: "https://axon.org.pk",
  logo: "https://axon.org.pk/assets/logo.png",
  sameAs: [
    "https://linkedin.com/company/axon-org",
    "https://instagram.com/axon.org",
    "https://github.com/axon-org",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "axon@askme.pk",
    contactType: "Administrative",
  },
  foundingLocation: {
    "@type": "Place",
    name: "IMAC, University of Engineering & Technology (UET) Lahore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-void text-slate-100 font-sans selection:bg-cyan-axon selection:text-void-500 antialiased">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
