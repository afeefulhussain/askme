import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Mail,
  ArrowUpRight,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { AXON_ORG_METADATA, WINGS } from "@/data/axonData";

export default function Footer() {
  return (
    <footer className="border-t border-void-border bg-void-500 text-slate-400 font-mono text-xs no-print">
      {/* Top Banner: Institutional Provenance */}
      <div className="border-b border-void-border/60 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-void-card border border-void-border flex items-center justify-center font-bold text-cyan-axon">
              AX
            </div>
            <div>
              <div className="text-white font-serif text-sm font-semibold tracking-wide">
                AXON Technology Umbrella
              </div>
              <div className="text-[11px] text-slate-400">
                Originating at IMAC, University of Engineering & Technology (UET)
                Lahore
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-circuit-green"></span>
              <span className="text-slate-300">
                11 DIRECTORATES OPERATIONAL
              </span>
            </div>
            <div className="text-slate-400">REV: 2026.4 // NODE-01</div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Organization & Identity */}
        <div>
          <div className="text-white font-semibold uppercase tracking-wider mb-3 text-[11px] border-b border-void-border/40 pb-1">
            Institutional Base
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px] font-sans mb-4">
            AXON is an independent technology, innovation, and leadership
            umbrella organization originating at IMAC, UET Lahore. We operate a
            multi-university network incubating specialized technical wings.
          </p>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-axon shrink-0 mt-0.5" />
              <span className="text-slate-400">
                IMAC Complex, UET Lahore, Pakistan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-axon shrink-0" />
              <a
                href={`mailto:${AXON_ORG_METADATA.email}`}
                className="text-slate-300 hover:text-cyan-axon"
              >
                {AXON_ORG_METADATA.email}
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Public Navigation */}
        <div>
          <div className="text-white font-semibold uppercase tracking-wider mb-3 text-[11px] border-b border-void-border/40 pb-1">
            Navigation & Pillars
          </div>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link
                href="/about"
                className="hover:text-cyan-axon transition-colors"
              >
                Organization Vision & Governance
              </Link>
            </li>
            <li>
              <Link
                href="/wings"
                className="hover:text-cyan-axon transition-colors"
              >
                11 Operational Directorates
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-cyan-axon transition-colors"
              >
                Webinars, Workshops & Bootcamps
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="hover:text-cyan-axon transition-colors"
              >
                GitHub-Synced Student Projects
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="hover:text-cyan-axon transition-colors"
              >
                Technical Papers & Insights
              </Link>
            </li>
            <li>
              <Link
                href="/talent"
                className="hover:text-cyan-axon transition-colors"
              >
                Recruiter Talent Directory
              </Link>
            </li>
            <li>
              <Link
                href="/join"
                className="text-cyan-axon hover:underline flex items-center gap-1"
              >
                <span>Inductions & Membership Portal</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Directorates Overview */}
        <div>
          <div className="text-white font-semibold uppercase tracking-wider mb-3 text-[11px] border-b border-void-border/40 pb-1">
            Directorate Wings
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            {WINGS.slice(0, 6).map((wing) => (
              <li key={wing.id}>
                <Link
                  href={`/wings/${wing.slug}`}
                  className="hover:text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>{wing.name}</span>
                  <span className="text-[9px] text-slate-400">
                    {wing.code.split("/")[1]}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/wings"
                className="text-cyan-axon hover:underline text-[10px] block pt-1"
              >
                + View all 11 directorates
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Verification & Utilities */}
        <div>
          <div className="text-white font-semibold uppercase tracking-wider mb-3 text-[11px] border-b border-void-border/40 pb-1">
            Verification & Utility Tools
          </div>
          <div className="p-3 bg-void-card border border-void-border rounded mb-4">
            <div className="flex items-center gap-2 text-white font-semibold text-[11px] mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-axon" />
              <span>Public Verification Engine</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-normal mb-2.5">
              Instantly authenticate AXON certificates, credentials, and
              official member digital ID cards.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-mono bg-void-subtle border border-void-border hover:border-cyan-axon text-cyan-axon rounded transition-colors"
            >
              <span>Launch /verify</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <a
              href={AXON_ORG_METADATA.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-void-card border border-void-border hover:text-white hover:border-slate-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={AXON_ORG_METADATA.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-void-card border border-void-border hover:text-white hover:border-slate-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href={AXON_ORG_METADATA.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-void-card border border-void-border hover:text-white hover:border-slate-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Colophon Bar */}
      <div className="border-t border-void-border/60 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div>
          © {new Date().getFullYear()} AXON Umbrella Organization. Originating at
          IMAC, UET Lahore.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/verify" className="hover:text-slate-300">
            Credential Verification
          </Link>
          <span className="text-slate-800">/</span>
          <Link href="/contact" className="hover:text-slate-300">
            Institutional Liaison
          </Link>
          <span className="text-slate-800">/</span>
          <Link href="/admin" className="hover:text-slate-300">
            Council Console
          </Link>
        </div>
      </div>
    </footer>
  );
}
