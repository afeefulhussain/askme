import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://askme.pk"),
  title: {
    default: "AXON — Together We Transmit | Independent Tech & Leadership Organization",
    template: "%s | AXON",
  },
  description:
    "AXON — Together We Transmit. An independent technology, innovation, and leadership umbrella organization originating at IMAC, UET Lahore, uniting 11 specialized wings and student chapters across Pakistan.",
  keywords: [
    "AXON Organization",
    "Together We Transmit",
    "askme.pk",
    "AXON Pakistan",
    "AXON Events",
    "IMAC UET Lahore",
    "student tech webinars",
    "AI/CS community Lahore",
    "university tech organizations Pakistan",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://askme.pk/",
  },
  authors: [{ name: "AXON Executive Council" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://askme.pk/",
    siteName: "AXON Umbrella Organization",
    title: "AXON — Together We Transmit | Independent Tech & Leadership Organization",
    description:
      "Together We Transmit. Empowering the next generation of tech builders through workshops, events, and 11 collaborative technical & operational wings.",
    images: [
      {
        url: "/assets/og-cover.png",
        width: 1200,
        height: 630,
        alt: "AXON — Together We Transmit Official Network Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AXON — Together We Transmit | Independent Tech & Leadership Organization",
    description:
      "Together We Transmit. Empowering student builders through 11 technical and operational wings at IMAC, UET Lahore.",
    images: ["/assets/og-cover.png"],
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
  slogan: "Together We Transmit.",
  url: "https://askme.pk",
  logo: "https://askme.pk/assets/axon-logo-white.png",
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
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} dark`}
    >
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
