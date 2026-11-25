import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Cpu, Wrench, Shield, Users, Terminal } from "lucide-react";
import { WINGS } from "@/data/axonData";

export const metadata = {
  title: "11 Directorates & Operational Wings",
  description:
    "Explore AXON's 11 specialized technical wings, research directorates, active student initiatives, and future spin-off wings originating at IMAC UET Lahore.",
};

export default function WingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Editorial Header */}
      <div className="max-w-4xl border-b border-void-border pb-12 mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          DIRECTORATE MATRIX // 11 TEAMS
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          Specialized Engineering Directorates & Spin-Off Wings
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          AXON structures its operations across 11 dedicated directorates. Each wing functions with autonomous research roadmaps, industry partnerships, laboratory equipment access at IMAC, and student project supervision.
        </p>
      </div>

      {/* Wings Dossier List */}
      <div className="space-y-12">
        {WINGS.map((wing, index) => (
          <article
            key={wing.id}
            id={wing.id}
            className="p-8 rounded-xl bg-void-card border border-void-border hover:border-cyan-axon/40 transition-all scroll-mt-24"
          >
            {/* Top metadata strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-void-border/60 font-mono text-xs mb-6">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-void-subtle border border-void-border text-cyan-axon font-bold">
                  {wing.code}
                </span>
                <span className="text-slate-400">INDEX: 0{index + 1} / 11</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">{wing.directorate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-circuit-green"></span>
                <span className="text-circuit-green font-medium uppercase">{wing.status}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{wing.initiativesCount} Active Initiatives</span>
              </div>
            </div>

            {/* Wing Title & Lead */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="max-w-3xl">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                  {wing.name}
                </h2>
                <p className="text-sm font-mono text-cyan-axon mb-4">
                  {wing.tagline}
                </p>
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {wing.mandate}
                </p>
              </div>

              {/* Leadership badge */}
              <div className="p-4 rounded bg-void-subtle border border-void-border font-mono text-xs shrink-0 w-full lg:w-64">
                <div className="text-[10px] text-slate-400 uppercase">DIRECTORATE HEAD</div>
                <div className="font-serif text-base font-bold text-white mt-0.5">
                  {wing.lead}
                </div>
                <div className="text-[11px] text-cyan-axon mt-0.5">{wing.role}</div>
                <div className="mt-3 pt-2 border-t border-void-border/50 text-[10px] text-slate-400">
                  UET Lahore Chapter Node
                </div>
              </div>
            </div>

            {/* Core Competencies & Tools */}
            <div className="mt-8 pt-6 border-t border-void-border/60 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div>
                <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-2">
                  Research & Engineering Pillars
                </div>
                <div className="flex flex-wrap gap-2">
                  {wing.focus.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded bg-void-400 border border-void-border text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-2">
                  Standard Toolchains & Environments
                </div>
                <div className="flex flex-wrap gap-2">
                  {wing.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded bg-void-subtle border border-void-border text-cyan-axon/90"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-void-border/40 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <span className="text-slate-400">
                Phase 2 Dedicated Sub-Slug: /wings/{wing.slug}
              </span>
              <Link
                href={`/join?wing=${wing.id}`}
                className="px-4 py-2 bg-void-subtle border border-cyan-axon text-cyan-axon hover:bg-cyan-axon hover:text-void-500 rounded font-semibold transition-all flex items-center gap-1.5"
              >
                <span>Apply to Join This Directorate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
