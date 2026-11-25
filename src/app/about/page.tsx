import React from "react";
import Link from "next/link";
import { ShieldCheck, Building2, GitBranch, Cpu, Compass, Users2, ArrowUpRight } from "lucide-react";
import { AXON_ORG_METADATA } from "@/data/axonData";

export const metadata = {
  title: "About & Governance",
  description:
    "Institutional charter, governance model, and leadership directory of the AXON Umbrella Organization, originating at IMAC, UET Lahore.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Editorial Header */}
      <div className="max-w-4xl border-b border-void-border pb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          INSTITUTIONAL CHARTER // GOVERNANCE MODEL
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          An umbrella architecture built for academic autonomy, technical excellence, and national expansion.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          Founded and anchored at the <strong className="text-white font-semibold">Innovation & Manufacturing Auxiliary Center (IMAC)</strong> within the University of Engineering & Technology (UET) Lahore, AXON operates not merely as a student society, but as a strategic technical federation designed to incubate autonomous engineering wings, foster original research, and expand across collegiate campuses nationwide.
        </p>
      </div>

      {/* Core Mission & Long-Term Vision */}
      <section className="py-16 border-b border-void-border grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-void-card border border-void-border p-8 rounded-lg">
          <div className="w-10 h-10 rounded bg-cyan-axon/10 border border-cyan-axon/40 flex items-center justify-center text-cyan-axon mb-5">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-3">
            Core Institutional Mission
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            To bridge the acute delta between theoretical university curricula and industrial-scale engineering. AXON provides ambitious student engineers with laboratory resources, compute infrastructure, collaborative code review standards, and direct mentorship from experienced professionals and researchers.
          </p>
        </div>

        <div className="bg-void-card border border-void-border p-8 rounded-lg">
          <div className="w-10 h-10 rounded bg-circuit-green/10 border border-circuit-green/40 flex items-center justify-center text-circuit-green mb-5">
            <GitBranch className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-3">
            Multi-University Roadmap
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            AXON is engineered to scale. Using a standardized charter and decentralized governance model, collegiate chapters outside UET Lahore are integrated as federated nodes. Each chapter operates autonomous directorate branches while synchronizing with the central cryptographic credential registry.
          </p>
        </div>
      </section>

      {/* Executive Council & Governance Org Chart (Blueprint Section 3 & 8.3) */}
      <section className="py-16 border-b border-void-border">
        <div className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
            ORGANIZATIONAL STRUCTURE
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">
            Executive Council & Directorate Governance
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-sans max-w-2xl">
            AXON operates under an independent 5-tier role-based governance model ensuring meritocratic decision making, peer accountability, and transparent resource allocation.
          </p>
        </div>

        {/* Tree Org Layout */}
        <div className="space-y-6 font-mono text-xs">
          {/* Tier 1: Executive Board & Advisory */}
          <div className="p-6 bg-void-card border border-cyan-axon/40 rounded-lg">
            <div className="text-cyan-axon uppercase tracking-wider text-[11px] font-bold mb-2">
              LEVEL 01 // EXECUTIVE COUNCIL & FACULTY ADVISORY
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-sans">
              <div className="p-3 bg-void-subtle rounded border border-void-border">
                <div className="font-serif font-bold text-white text-base">Dr. M. Haris</div>
                <div className="text-xs text-slate-400 font-mono">Chief Faculty Advisor // IMAC UET</div>
              </div>
              <div className="p-3 bg-void-subtle rounded border border-void-border">
                <div className="font-serif font-bold text-white text-base">Irfan Ullah</div>
                <div className="text-xs text-cyan-axon font-mono">Executive Lead & Systems Architect</div>
              </div>
              <div className="p-3 bg-void-subtle rounded border border-void-border">
                <div className="font-serif font-bold text-white text-base">Sarah Kamran</div>
                <div className="text-xs text-slate-400 font-mono">Director of University Alliances</div>
              </div>
            </div>
          </div>

          {/* Tier 2: Directorate Wing Heads */}
          <div className="p-6 bg-void-card border border-void-border rounded-lg">
            <div className="text-slate-300 uppercase tracking-wider text-[11px] font-bold mb-3">
              LEVEL 02 // DIRECTORATE HEADS (11 SPECIALIZED TECHNICAL WINGS)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Muhammad Talha</div>
                <div className="text-[10px] text-slate-400 font-mono">Infrastructure (DIR-01)</div>
              </div>
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Ayesha Noor</div>
                <div className="text-[10px] text-slate-400 font-mono">Machine Intelligence (DIR-02)</div>
              </div>
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Hamza Tariq</div>
                <div className="text-[10px] text-slate-400 font-mono">Cyber Operations (DIR-03)</div>
              </div>
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Bilal Ahmed</div>
                <div className="text-[10px] text-slate-400 font-mono">Hardware & Robotics (DIR-05)</div>
              </div>
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Zainab Bilal</div>
                <div className="text-[10px] text-slate-400 font-mono">Brand & Spatial Design (DIR-04)</div>
              </div>
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Zaid Farooq</div>
                <div className="text-[10px] text-slate-400 font-mono">Web Architecture (DIR-06)</div>
              </div>
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Usama Riaz</div>
                <div className="text-[10px] text-slate-400 font-mono">Competitive Prog. (DIR-07)</div>
              </div>
              <div className="p-2.5 bg-void-400 rounded border border-void-border">
                <div className="text-white font-medium">Maryam Chaudhry</div>
                <div className="text-[10px] text-slate-400 font-mono">Operations & Events (DIR-11)</div>
              </div>
            </div>
          </div>

          {/* Tier 3: Core Member Engineers & Fellows */}
          <div className="p-6 bg-void-card border border-void-border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-slate-300 uppercase tracking-wider text-[11px] font-bold">
                LEVEL 03 // 340+ INDUCTED MEMBER ENGINEERS & RESEARCH FELLOWS
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Selected through technical review, each member carries a verified AXON credential ID and public GitHub repository showcase.
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
            The IMAC facility at UET Lahore provides physical labs, FPGA development boards, high-speed soldering benches, 3D printing suites, and dedicated server rack spaces that power AXON&apos;s physical and digital activities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-400">
            <div className="p-3 bg-void-subtle rounded border border-void-border">
              <span className="text-white font-medium block">Hardware Prototyping</span>
              <span>KiCad PCB routing, SMD rework & pick-and-place</span>
            </div>
            <div className="p-3 bg-void-subtle rounded border border-void-border">
              <span className="text-white font-medium block">Bare-Metal Compute</span>
              <span>Internal rack cluster for model training & CI</span>
            </div>
            <div className="p-3 bg-void-subtle rounded border border-void-border">
              <span className="text-white font-medium block">Auditorium Staging</span>
              <span>250-seat lecture halls for hybrid masterclasses</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
