"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  ArrowUpRight,
  Github,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { PublicAxonMember, Wing } from "@/lib/types";

interface TalentDirectoryClientProps {
  members: PublicAxonMember[];
  wings: Wing[];
}

export default function TalentDirectoryClient({
  members: initialMembers,
  wings,
}: TalentDirectoryClientProps) {
  const [wingFilter, setWingFilter] = useState("all");
  const [gradYear, setGradYear] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<PublicAxonMember[]>(
    initialMembers.slice(0, 9)
  );
  const [total, setTotal] = useState(initialMembers.length);
  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil(initialMembers.length / 9))
  );
  const [loading, setLoading] = useState(false);
  const didMountRef = useRef(false);

  const years = Array.from(
    new Set(initialMembers.map((m) => m.graduationYear))
  ).sort();

  // 300ms debounce on search input
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput);
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
      q: debouncedSearch.trim(),
      wing: wingFilter,
      internshipOnly: String(onlyAvailable),
      page: String(page),
      limit: "9",
    });

    fetch(`/api/directory/talent?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(
        (data: {
          items?: PublicAxonMember[];
          total?: number;
          totalPages?: number;
        }) => {
          if (Array.isArray(data.items)) {
            setRows(data.items);
            setTotal(data.total ?? data.items.length);
            setTotalPages(data.totalPages ?? 1);
          }
        }
      )
      .catch(() => {
        // Ignore aborts
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedSearch, wingFilter, onlyAvailable, page]);

  const filtered = rows.filter(
    (m) => gradYear === "All" || String(m.graduationYear) === gradYear
  );

  return (
    <>
      {/* Filter Controls */}
      <search className="p-4 rounded-xl bg-void-card border border-void-border mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by directorate"
            value={wingFilter}
            onChange={(e) => {
              setWingFilter(e.target.value);
              setPage(1);
            }}
            className="bg-void-400 border border-void-border rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-axon"
          >
            <option value="all">All Directorates</option>
            {wings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by graduation year"
            value={gradYear}
            onChange={(e) => setGradYear(e.target.value)}
            className="bg-void-400 border border-void-border rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-axon"
          >
            <option value="All">All Grad Years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                Class of {y}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 px-3 py-2 bg-void-400 border border-void-border rounded cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => {
                setOnlyAvailable(e.target.checked);
                setPage(1);
              }}
              className="accent-cyan-400"
            />
            <span>Available for Internships / Roles</span>
          </label>
        </div>

        <div className="relative min-w-[260px]">
          <input
            aria-label="Search member skills, name, or roll number"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search TypeScript, PyTorch, name..."
            className="w-full bg-void-400 border border-void-border rounded px-3 py-2 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </search>

      {/* Telemetry Count */}
      <div className="mb-4 flex items-center justify-between font-mono text-[11px] text-slate-400">
        <span>
          {loading
            ? "Filtering verified members..."
            : `Showing ${filtered.length} of ${total} verified profiles`}
        </span>
        <span>
          Page {page} / {totalPages}
        </span>
      </div>

      {/* Talent Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-void-card border border-void-border rounded-xl font-mono text-xs text-slate-400">
          No verified member portfolios match your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <article
              key={m.username}
              className="p-6 rounded-xl bg-void-card border border-void-border hover:border-cyan-axon/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={m.avatar}
                      alt={m.name}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="w-12 h-12 rounded-lg border border-void-border object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="font-serif text-lg font-bold text-white leading-tight truncate">
                        {m.name}
                      </h2>
                      <div className="font-mono text-[11px] text-cyan-axon">
                        {m.memberId}
                      </div>
                    </div>
                  </div>
                  {m.internshipAvailable && (
                    <span className="px-2 py-0.5 rounded bg-circuit-green/15 text-circuit-green border border-circuit-green/30 font-mono text-[10px] font-bold shrink-0">
                      OPEN
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                  {m.headline}
                </p>

                <div className="font-mono text-[11px] text-slate-400 space-y-1 mb-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-circuit-green shrink-0" />
                    <span className="truncate">{m.wing}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {m.chapter} • Class of {m.graduationYear}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {[...m.skills.languages, ...m.skills.frameworks]
                    .slice(0, 6)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-void-subtle border border-void-border font-mono text-[10px] text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              <div className="pt-4 border-t border-void-border/60 flex items-center justify-between font-mono text-xs">
                {m.github ? (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>@{m.githubUsername}</span>
                  </a>
                ) : (
                  <span className="text-slate-500 text-[11px]">
                    @{m.username}
                  </span>
                )}
                <Link
                  href={`/portfolio/${m.username}`}
                  className="text-cyan-axon hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Server-Side Pagination Controls */}
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
