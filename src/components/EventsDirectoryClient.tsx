"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { AxonEvent } from "@/lib/types";

interface EventsDirectoryClientProps {
  events: AxonEvent[];
}

export default function EventsDirectoryClient({
  events: initialEvents,
}: EventsDirectoryClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<AxonEvent[]>(initialEvents.slice(0, 8));
  const [total, setTotal] = useState(initialEvents.length);
  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil(initialEvents.length / 8))
  );
  const [loading, setLoading] = useState(false);
  const didMountRef = useRef(false);

  const categories = [
    { label: "All", value: "all" },
    { label: "Launch Event", value: "Launch Event" },
    { label: "Technical Workshop", value: "Technical Workshop" },
    { label: "Bootcamp", value: "Bootcamp" },
    { label: "Symposium", value: "Symposium" },
  ];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchInput);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({
      q: debouncedQuery.trim(),
      category: activeCategory,
      page: String(page),
      limit: "8",
    });

    fetch(`/api/events?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(
        (data: { events?: AxonEvent[]; total?: number; totalPages?: number }) => {
          if (Array.isArray(data.events)) {
            setRows(data.events);
            setTotal(data.total ?? data.events.length);
            setTotalPages(data.totalPages ?? 1);
          }
        }
      )
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery, activeCategory, page]);

  return (
    <>
      {/* Filter and Search Bar */}
      <search className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-void-card border border-void-border rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                setActiveCategory(cat.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeCategory === cat.value
                  ? "bg-cyan-axon text-void-500 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <input
            aria-label="Search events by topic or speaker"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search topic or speaker..."
            className="w-full bg-void-card border border-void-border rounded px-3 py-2 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </search>

      <div className="mb-4 flex items-center justify-between font-mono text-[11px] text-slate-400">
        <span>
          {loading
            ? "Filtering events..."
            : `Showing ${rows.length} of ${total} events`}
        </span>
        <span>
          Page {page} / {totalPages}
        </span>
      </div>

      {/* Events Grid */}
      {rows.length === 0 ? (
        <div className="p-12 text-center bg-void-card border border-void-border rounded-xl font-mono text-xs text-slate-400">
          No sessions match your current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rows.map((evt) => (
            <article
              key={evt.id}
              className="bg-void-card border border-void-border hover:border-slate-600 rounded-xl overflow-hidden flex flex-col justify-between transition-all"
            >
              <div>
                {evt.posterImage && (
                  <Link
                    href={`/events/${evt.slug}`}
                    className="block relative aspect-[16/10] w-full bg-void-subtle border-b border-void-border overflow-hidden"
                  >
                    <Image
                      src={evt.posterImage}
                      alt={`${evt.title} poster`}
                      width={640}
                      height={400}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                    />
                  </Link>
                )}

                <div className="p-6 sm:p-8 pb-4">
                  <div className="flex items-center justify-between font-mono text-xs mb-4">
                    <span
                      className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold ${
                        evt.status === "Registrations Open"
                          ? "bg-circuit-green/20 text-circuit-green border-circuit-green/40"
                          : evt.status === "Completed"
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-cyan-axon/20 text-cyan-axon border-cyan-axon/30"
                      }`}
                    >
                      {evt.status.toUpperCase()}
                    </span>
                    <span className="text-slate-400">{evt.category}</span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-white mb-3 hover:text-cyan-axon transition-colors">
                    <Link href={`/events/${evt.slug}`}>{evt.title}</Link>
                  </h2>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                    {evt.description}
                  </p>

                  <div className="p-3.5 rounded bg-void-subtle border border-void-border font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase">
                      LEAD SPEAKER / INSTRUCTOR
                    </div>
                    <div className="font-medium text-white mt-0.5">
                      {evt.speaker.name}
                    </div>
                    <div className="text-[11px] text-cyan-axon">
                      {evt.speaker.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {evt.speaker.organization}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-4 border-t border-void-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="space-y-1 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-axon" />
                    <span>
                      {evt.date} {"//"} {evt.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[240px]">
                      {evt.location}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/events/${evt.slug}`}
                  className="px-4 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 hover:text-white rounded font-medium transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Details & RSVP</span>
                  <ArrowUpRight className="w-3 h-3 text-cyan-axon" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-void-border pt-6 font-mono text-xs">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-void-border bg-void-card text-slate-300 hover:border-cyan-axon disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-void-border bg-void-card text-slate-300 hover:border-cyan-axon disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
