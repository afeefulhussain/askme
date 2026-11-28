"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Terminal,
  UserCheck,
  Users,
  LogOut,
} from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { canAccessAdmin, canAccessDashboard } from "@/lib/rbac";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as {
          authenticated: boolean;
          user: SessionUser | null;
        };
        setSessionUser(data.authenticated ? data.user : null);
      }
    } catch {
      setSessionUser(null);
    }
  }, []);

  useEffect(() => {
    fetchSession();
    const handler = () => fetchSession();
    window.addEventListener("axon-auth-changed", handler);
    return () => window.removeEventListener("axon-auth-changed", handler);
  }, [fetchSession, pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUtilitiesOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUtilitiesOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSessionUser(null);
    window.dispatchEvent(new Event("axon-auth-changed"));
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-void-400/95 backdrop-blur-md border-b border-void-border no-print">
      {/* Top micro-bar: Institutional origin & session status */}
      <div className="border-b border-void-border/60 bg-void-subtle/50 px-4 py-1 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse shrink-0"></span>
            <span className="truncate">UET LAHORE // IMAC NODE 01</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              INDEPENDENT UMBRELLA NETWORK
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] shrink-0">
            {sessionUser ? (
              <>
                <Link
                  href={
                    canAccessAdmin(sessionUser.rbacRole)
                      ? "/admin"
                      : "/dashboard"
                  }
                  className="text-circuit-green hover:text-white transition-colors font-semibold uppercase"
                >
                  {sessionUser.name} ({sessionUser.memberId})
                </Link>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors inline-flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>SIGN OUT</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-slate-400 hover:text-white transition-colors"
              >
                OTP PORTAL LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded bg-void-card border border-void-border flex items-center justify-center p-1 shadow-sm group-hover:border-cyan-axon/60 transition-colors">
              <img
                src="/assets/axon-mark.svg"
                alt="AXON Brand Mark"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-cyan-axon transition-colors">
                AXON
              </span>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase -mt-1">
                Together We Transmit
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
          >
            <Link
              href="/about"
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                pathname === "/about"
                  ? "text-cyan-axon bg-void-card"
                  : "text-slate-300 hover:text-white hover:bg-void-card"
              }`}
            >
              About
            </Link>
            <Link
              href="/wings"
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                pathname?.startsWith("/wings")
                  ? "text-cyan-axon bg-void-card"
                  : "text-slate-300 hover:text-white hover:bg-void-card"
              }`}
            >
              11 Directorates
            </Link>
            <Link
              href="/events"
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                pathname?.startsWith("/events")
                  ? "text-cyan-axon bg-void-card"
                  : "text-slate-300 hover:text-white hover:bg-void-card"
              }`}
            >
              Events
            </Link>
            <Link
              href="/projects"
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                pathname?.startsWith("/projects")
                  ? "text-cyan-axon bg-void-card"
                  : "text-slate-300 hover:text-white hover:bg-void-card"
              }`}
            >
              Projects
            </Link>
            <Link
              href="/blogs"
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                pathname?.startsWith("/blogs")
                  ? "text-cyan-axon bg-void-card"
                  : "text-slate-300 hover:text-white hover:bg-void-card"
              }`}
            >
              Research & Blogs
            </Link>

            {/* Discreet Utilities Dropdown (Blueprint Section 8.2) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                aria-expanded={utilitiesOpen}
                onClick={() => setUtilitiesOpen((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white hover:bg-void-card rounded flex items-center gap-1 transition-colors"
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    utilitiesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {utilitiesOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md bg-void-card border border-void-border shadow-2xl p-2 text-xs font-mono z-50">
                  <div className="text-[10px] text-slate-500 uppercase px-3 py-1 border-b border-void-border/50">
                    Utilities & Portals
                  </div>
                  <Link
                    href="/verify"
                    onClick={() => setUtilitiesOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:text-cyan-axon hover:bg-void-50 rounded mt-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-axon shrink-0" />
                    <div>
                      <div className="font-semibold">Verify Credential</div>
                      <div className="text-[10px] text-slate-400">
                        Certificate & Member ID Audit
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/talent"
                    onClick={() => setUtilitiesOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:text-white hover:bg-void-50 rounded mt-1"
                  >
                    <Users className="w-4 h-4 text-cyan-axon shrink-0" />
                    <div>
                      <div className="font-semibold">Talent Directory</div>
                      <div className="text-[10px] text-slate-400">
                        Verified Member Portfolios
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setUtilitiesOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:text-white hover:bg-void-50 rounded mt-1"
                  >
                    <UserCheck className="w-4 h-4 text-circuit-green shrink-0" />
                    <div>
                      <div className="font-semibold">Member Dashboard</div>
                      <div className="text-[10px] text-slate-400">
                        Digital ID & Portfolio Builder
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setUtilitiesOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:text-white hover:bg-void-50 rounded mt-1"
                  >
                    <Terminal className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Admin Console</div>
                      <div className="text-[10px] text-slate-400">
                        Executive Council Moderation
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {sessionUser && canAccessDashboard(sessionUser.rbacRole) ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-void-500 bg-cyan-axon hover:bg-cyan-300 font-semibold rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/join"
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-void-500 bg-cyan-axon hover:bg-cyan-300 font-semibold rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-1.5"
              >
                <span>Join AXON</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
          <Link
            href="/talent"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-axon"
          >
            Talent Directory
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
