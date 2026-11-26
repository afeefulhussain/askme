"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  ArrowUpRight,
  Github,
  GraduationCap,
} from "lucide-react";
import type { AxonMember, Wing } from "@/lib/types";

interface TalentDirectoryClientProps {
  members: AxonMember[];
  wings: Wing[];
}

export default function TalentDirectoryClient({
  members,
  wings,
}: TalentDirectoryClientProps) {
  const [wingFilter, setWingFilter] = useState("All");
  const [gradYear, setGradYear] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [search, setSearch] = useState("");

  const years = Array.from(new Set(members.map((m) => m.graduationYear))).sort();

  const filtered = members.filter((m) => {
    const matchWing = wingFilter === "All" || m.wingId === wingFilter;
    const matchYear =
      gradYear === "All" || String(m.graduationYear) === gradYear;
    const matchAvail = !onlyAvailable || m.internshipAvailable;
    const allSkills = [
      ...m.skills.languages,
      ...m.skills.frameworks,
      ...m.skills.systems,
    ]
      .join(" ")
      .toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.headline.toLowerCase().includes(search.toLowerCase()) ||
      m.chapter.toLowerCase().includes(search.toLowerCase()) ||
      allSkills.includes(search.toLowerCase());

    return matchWing && matchYear && matchAvail && matchSearch;
  });

  return (
    <>
      {/* Filter Controls */}
      <div className="p-4 rounded-xl bg-void-card border border-void-border mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by directorate"
            value={wingFilter}
            onChange={(e) => setWingFilter(e.target.value)}
            className="bg-void-400 border border-void-border rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-axon"
          >
            <option value="All">All Directorates</option>
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
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="accent-cyan-400"
            />
            <span>Available for Internships / Roles</span>
          </label>
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Rust, PyTorch, eBPF, name..."
            className="w-full bg-void-400 border border-void-border rounded px-3 py-2 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
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
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg border border-void-border object-cover"
                    />
                    <div>
                      <h2 className="font-serif text-lg font-bold text-white leading-tight">
                        {m.name}
                      </h2>
                      <div className="font-mono text-[11px] text-cyan-axon">
                        {m.memberId}
                      </div>
                    </div>
                  </div>
                  {m.internshipAvailable && (
                    <span className="px-2 py-0.5 rounded bg-circuit-green/15 text-circuit-green border border-circuit-green/30 font-mono text-[10px] font-bold">
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
                    <span>
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
                <a
                  href={m.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>@{m.githubUsername}</span>
                </a>
                <Link
                  href={`/u/${m.username}`}
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
    </>
  );
}
