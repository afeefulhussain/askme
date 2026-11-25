"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ChevronDown, Menu, X, ArrowUpRight, Terminal, UserCheck } from "lucide-react";
import { AXON_ORG_METADATA } from "@/data/axonData";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-void-400/90 backdrop-blur-md border-b border-void-border">
      {/* Top micro-bar: Institutional origin & status */}
      <div className="border-b border-void-border/60 bg-void-subtle/50 px-4 py-1 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse"></span>
            <span>UET LAHORE // IMAC NODE 01</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">INDEPENDENT UMBRELLA NETWORK</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <Link
              href="/verify"
              className="text-slate-400 hover:text-cyan-axon transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-cyan-axon" />
              <span>VERIFY CREDENTIAL</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition-colors"
            >
              PORTAL LOGIN
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded bg-void-card border border-void-border flex items-center justify-center font-mono font-bold text-base text-cyan-axon shadow-sm group-hover:border-cyan-axon/60 transition-colors">
              <span className="tracking-tighter">A</span>
              <span className="text-slate-400 text-xs">X</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-cyan-axon transition-colors">
                AXON
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                Technology Umbrella
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/about"
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-void-card rounded transition-colors"
            >
              About
            </Link>
            <Link
              href="/wings"
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-void-card rounded transition-colors"
            >
              11 Directorates
            </Link>
            <Link
              href="/events"
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-void-card rounded transition-colors"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-void-card rounded transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/blogs"
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-void-card rounded transition-colors"
            >
              Research & Blogs
            </Link>

            {/* Utilities Toggle (Discreet as specified in Blueprint Section 8.2) */}
            <div className="relative">
              <button
                onClick={() => setUtilitiesOpen(!utilitiesOpen)}
                onBlur={() => setTimeout(() => setUtilitiesOpen(false), 200)}
                className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white hover:bg-void-card rounded flex items-center gap-1 transition-colors"
              >
                <span>Utilities</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${utilitiesOpen ? "rotate-180" : ""}`} />
              </button>

              {utilitiesOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-void-card border border-void-border shadow-2xl p-2 py-2 text-xs font-mono">
                  <div className="text-[10px] text-slate-500 uppercase px-3 py-1 border-b border-void-border/50">
                    Verification & Tools
                  </div>
                  <Link
                    href="/verify"
                    className="flex items-center gap-2 px-3 py-2 text-slate-200 hover:text-cyan-axon hover:bg-void-50 rounded mt-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-axon" />
                    <div>
                      <div className="font-semibold">Verify Credential</div>
                      <div className="text-[10px] text-slate-400">Search Certificate or Member ID</div>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-slate-200 hover:text-white hover:bg-void-50 rounded mt-1"
                  >
                    <UserCheck className="w-4 h-4 text-circuit-green" />
                    <div>
                      <div className="font-semibold">Member Dashboard</div>
                      <div className="text-[10px] text-slate-400">Digital ID & Portfolio Builder</div>
                    </div>
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-slate-200 hover:text-white hover:bg-void-50 rounded mt-1"
                  >
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-semibold">Admin Panel</div>
                      <div className="text-[10px] text-slate-400">Executive Council Console</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/join"
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-void-500 bg-cyan-axon hover:bg-cyan-300 font-semibold rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-1.5"
            >
              <span>Join AXON</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-void-border bg-void-card/95 px-4 pt-3 pb-6 space-y-2 font-mono text-sm">
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-axon"
          >
            About AXON
          </Link>
          <Link
            href="/wings"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-axon"
          >
            11 Directorates
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-axon"
          >
            Events & Workshops
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-axon"
          >
            Student Projects
          </Link>
          <Link
            href="/blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-axon"
          >
            Research & Blogs
          </Link>
          <div className="pt-2 border-t border-void-border/50">
            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-cyan-axon"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Credential / Member ID</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-slate-200"
            >
              <UserCheck className="w-4 h-4 text-circuit-green" />
              <span>Member Dashboard & Digital ID</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-slate-400"
            >
              <Terminal className="w-4 h-4" />
              <span>Admin Management Console</span>
            </Link>
          </div>
          <div className="pt-3">
            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-xs font-mono uppercase bg-cyan-axon text-void-500 font-semibold rounded"
            >
              Join AXON Network
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
