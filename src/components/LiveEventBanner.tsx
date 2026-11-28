"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Calendar, Sparkles, X } from "lucide-react";

export interface BannerEventSummary {
  slug: string;
  title: string;
  date: string;
  location: string;
  status: string;
}

export default function LiveEventBanner({
  events: initialEvents,
}: {
  events: BannerEventSummary[];
}) {
  const pathname = usePathname();
  const [events, setEvents] = useState<BannerEventSummary[]>(initialEvents);
  const [dismissed, setDismissed] = useState(false);

  const syncEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events?limit=6", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        events?: BannerEventSummary[];
      };
      if (Array.isArray(data.events)) {
        const live = data.events.filter(
          (e) => e.status === "Registrations Open" || e.status === "Scheduled"
        );
        if (live.length > 0) setEvents(live);
      }
    } catch {
      // Retain SSR events cleanly
    }
  }, []);

  useEffect(() => {
    void syncEvents();
    const onChange = () => void syncEvents();
    window.addEventListener("axon-events-changed", onChange);
    return () => window.removeEventListener("axon-events-changed", onChange);
  }, [syncEvents, pathname]);

  if (dismissed || events.length === 0) return null;

  const primary = events[0];
  const extraCount = events.length - 1;

  return (
    <div
      role="region"
      aria-label="Upcoming live event announcement"
      className="no-print border-b border-cyan-axon/25 bg-gradient-to-r from-[#07111E] via-[#0C1726] to-[#07111E] text-slate-200 text-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-circuit-green/15 border border-circuit-green/40 font-mono text-[10px] uppercase tracking-wider text-circuit-green shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse" />
            Live Event
          </span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-axon shrink-0 hidden sm:inline" />
          <p className="truncate text-slate-200 font-medium">
            <span className="text-white">{primary.title}</span>
            <span className="hidden md:inline text-slate-400 font-mono ml-2">
              <Calendar className="w-3 h-3 inline mr-1 -mt-0.5" />
              {primary.date} · {primary.location}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/events/${primary.slug}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-axon/15 border border-cyan-axon/40 text-cyan-axon font-mono text-[11px] hover:bg-cyan-axon/25 transition-colors"
          >
            <span>{extraCount > 0 ? `View (+${extraCount})` : "Event Page"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss event notification banner"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-void-border/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
