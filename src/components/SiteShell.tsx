"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveEventBanner, {
  type BannerEventSummary,
} from "@/components/LiveEventBanner";

export default function SiteShell({
  children,
  upcomingEvents,
}: {
  children: React.ReactNode;
  upcomingEvents: BannerEventSummary[];
}) {
  const pathname = usePathname();
  const isPortfolioEditorialRoute = pathname?.startsWith("/portfolio");

  if (isPortfolioEditorialRoute) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <LiveEventBanner events={upcomingEvents} />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}
