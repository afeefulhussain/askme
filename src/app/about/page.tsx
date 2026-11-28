import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, GitBranch, Compass } from "lucide-react";
import {
  MEMBERS_PORTFOLIOS,
  UNIVERSITY_CHAPTERS,
  WINGS,
} from "@/data/axonData";

export const metadata: Metadata = {
  title: "About & Governance",
  description:
    "Institutional charter, Faculty Patron, Core Executive Council, and 11 Directorate Wings of AXON (Together We Transmit), originating at IMAC, UET Lahore.",
  alternates: { canonical: "https://askme.pk/about" },
};

export default function AboutPage() {
  const members = Object.values(MEMBERS_PORTFOLIOS);
  const patron = members.find((m) => m.rbacRole === "ADVISOR");
  const coreCouncil = members.filter(
    (m) =>
      m.rbacRole === "SUPER_ADMIN" ||
      m.rbacRole === "CORE_AUDITOR" ||
      m.rbacRole === "CORE_LEAD"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl border-b border-void-border pb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          INSTITUTIONAL CHARTER // TOGETHER WE TRANSMIT
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          An independent technology umbrella built for academic autonomy,
          technical execution, and federated university growth.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          Anchored at the{" "}
          <strong className="text-white font-semibold">
            Innovation & Manufacturing Auxiliary Center (IMAC)
          </strong>{" "}
          within the University of Engineering & Technology (UET) Lahore, AXON
          unites 11 technical, media, secretarial, and operational wings under
          one verified digital architecture at{" "}
          <span className="text-cyan-axon font-mono">askme.pk</span>.
        </p>
      </div>

      {/* Core Mission & Multi-University Expansion */}
      <section className="py-16 border-b border-void-border grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-void-card border border-void-border p-8 rounded-lg">
          <div className="w-10 h-10 rounded bg-cyan-axon/10 border border-cyan-axon/40 flex items-center justify-center text-cyan-axon mb-5">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-3">
            Core Institutional Mission
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Together We Transmit. AXON bridges classroom theory and
            production-grade engineering by connecting student builders with
            hardware fabrication facilities, peer code reviews, verifiable
            credentials, and real organizational leadership across 11 wings.
          </p>
        </div>

        <div className="bg-void-card border border-void-border p-8 rounded-lg">
          <div className="w-10 h-10 rounded bg-circuit-green/10 border border-circuit-green/40 flex items-center justify-center text-circuit-green mb-5">
            <GitBranch className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-3">
            Active & Incubating University Chapters
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed mb-4">
            Originating at IMAC, UET Lahore, AXON&apos;s federated model supports
            regional university chapters sharing the central credential
            verification registry.
          </p>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            {UNIVERSITY_CHAPTERS.map((chapter) => (
              <span
                key={chapter}
                className="px-2.5 py-1 rounded bg-void-subtle border border-void-border text-slate-200"
              >
                {chapter}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Public Leadership Directory — Strictly flat public view (NO internal Reports To exposed) */}
      <section className="py-16 border-b border-void-border">
        <div className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
            PUBLIC LEADERSHIP DIRECTORY
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">
            Faculty Advisor, Core Executive Council & 11 Wings
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-sans max-w-2xl">
            Every council member and wing directorate officer holds a verified
            credential ID in the public askme.pk verification registry.
          </p>
        </div>

        <div className="space-y-6 font-mono text-xs">
          {/* Patron / Faculty Advisor */}
          {patron && (
            <div className="p-6 bg-void-card border border-circuit-green/40 rounded-lg">
              <div className="text-circuit-green uppercase tracking-wider text-[11px] font-bold mb-3">
                FACULTY PATRON & INSTITUTIONAL ADVISOR
              </div>
              <Link
                href={`/u/${patron.username}`}
                className="inline-flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 w-full bg-void-subtle rounded border border-void-border hover:border-circuit-green/60 transition-colors"
              >
                <div>
                  <div className="font-serif font-bold text-white text-lg">
                    {patron.name}
                  </div>
                  <div className="text-xs text-circuit-green mt-0.5">
                    {patron.designation} {"//"} IMAC, UET Lahore
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">
                  {patron.memberId} →
                </span>
              </Link>
            </div>
          )}

          {/* Core Executive Council (Flat Public Section) */}
          <div className="p-6 bg-void-card border border-cyan-axon/40 rounded-lg">
            <div className="text-cyan-axon uppercase tracking-wider text-[11px] font-bold mb-3">
              CORE EXECUTIVE COUNCIL ({coreCouncil.length} OFFICERS)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
              {coreCouncil.map((officer) => (
                <Link
                  key={officer.username}
                  href={`/u/${officer.username}`}
                  className="p-4 bg-void-subtle rounded border border-void-border hover:border-cyan-axon/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{officer.memberId}</span>
                    <span className="text-cyan-axon">{officer.designation}</span>
                  </div>
                  <div className="font-serif font-bold text-white text-base">
                    {officer.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 11 Specialized Wings — Director & Co-Director (Public View) */}
          <div className="p-6 bg-void-card border border-void-border rounded-lg">
            <div className="text-slate-300 uppercase tracking-wider text-[11px] font-bold mb-4">
              THE 11 WINGS — DIRECTORS & CO-DIRECTORS (22 OFFICERS)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {WINGS.map((wing) => (
                <div
                  key={wing.id}
                  className="p-4 bg-void-400 rounded border border-void-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-cyan-axon mb-1">
                      <span>{wing.code}</span>
                      <Link
                        href={`/wings/${wing.slug}`}
                        className="text-slate-400 hover:text-white underline"
                      >
                        Charter
                      </Link>
                    </div>
                    <div className="font-serif text-base font-bold text-white mb-3">
                      {wing.name}
                    </div>
                  </div>
                  <div className="space-y-1.5 border-t border-void-border/50 pt-2.5 text-[11px]">
                    <Link
                      href={`/u/${wing.leadUsername}`}
                      className="flex items-center justify-between text-slate-200 hover:text-cyan-axon"
                    >
                      <span>{wing.lead}</span>
                      <span className="text-[10px] text-slate-400">
                        Director →
                      </span>
                    </Link>
                    <Link
                      href={`/u/${wing.coLeadUsername}`}
                      className="flex items-center justify-between text-slate-300 hover:text-cyan-axon"
                    >
                      <span>{wing.coLead}</span>
                      <span className="text-[10px] text-slate-400">
                        Co-Director →
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-void-card border border-void-border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-slate-300 uppercase tracking-wider text-[11px] font-bold">
                GENERAL BODY // 480+ INDUCTED STUDENT ENGINEERS & FELLOWS
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Every inducted member receives a verified AXN-26 credential ID,
                public portfolio profile, and participation privileges across all
                11 wings.
              </p>
            </div>
            <Link
              href="/join"
              className="px-4 py-2 bg-void-subtle border border-cyan-axon text-cyan-axon hover:bg-cyan-axon hover:text-void-500 rounded font-mono text-xs uppercase font-bold transition-all shrink-0"
            >
              Apply for Next Cohort
            </Link>
          </div>
        </div>
      </section>

      {/* Anchor Facilities at IMAC UET Lahore */}
      <section className="py-16">
        <div className="bg-void-card border border-void-border p-8 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <Building2 className="w-4 h-4 text-cyan-axon" />
            <span>PRIMARY CAMPUS HEADQUARTERS</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Innovation & Manufacturing Auxiliary Center (IMAC)
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-3xl mb-6">
            The IMAC facility at UET Lahore provides physical labs, embedded
            benches, fabrication rooms, creative studios, and auditorium venues
            that anchor AXON&apos;s technical and media activities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-400">
            <div className="p-3 bg-void-subtle rounded border border-void-border">
              <span className="text-white font-medium block">
                Technical & Portal Lab
              </span>
              <span>Production tooling, Linux workstations & workshops</span>
            </div>
            <div className="p-3 bg-void-subtle rounded border border-void-border">
              <span className="text-white font-medium block">
                Media & Design Studios
              </span>
              <span>Photography, video editing, brand systems & decor</span>
            </div>
            <div className="p-3 bg-void-subtle rounded border border-void-border">
              <span className="text-white font-medium block">
                Auditorium Staging
              </span>
              <span>250-seat lecture halls for hybrid masterclasses</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
