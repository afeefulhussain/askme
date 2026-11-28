"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Send, AlertCircle } from "lucide-react";
import type { MembershipApplication, Wing } from "@/lib/types";

interface JoinPortalClientProps {
  wings: Wing[];
  chapters: string[];
  initialWing?: string;
}

export default function JoinPortalClient({
  wings,
  chapters,
  initialWing,
}: JoinPortalClientProps) {
  const validWing =
    wings.find((w) => w.id === initialWing || w.slug === initialWing)?.id ||
    "technical";

  const [submittedApp, setSubmittedApp] =
    useState<MembershipApplication | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chapterChoice, setChapterChoice] = useState(
    chapters[0] || "IMAC, UET Lahore (Founding Chapter)"
  );
  const [customChapter, setCustomChapter] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: chapters[0] || "IMAC, UET Lahore (Founding Chapter)",
    roleType: "General Member Engineer",
    preferredWing: validWing,
    githubUsername: "",
    statement: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const resolvedUniversity =
      chapterChoice === "__custom__"
        ? customChapter.trim() || "Prospective University Chapter"
        : chapterChoice;

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          university: resolvedUniversity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to submit application.");
      } else {
        setSubmittedApp(data.application);
      }
    } catch {
      setError("Network error while submitting application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedApp) {
    return (
      <div className="p-10 rounded-2xl bg-void-card border border-circuit-green/50 text-center">
        <div className="w-12 h-12 rounded-full bg-circuit-green/20 border border-circuit-green text-circuit-green flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="font-mono text-xs text-cyan-axon mb-2">
          APPLICATION REFERENCE: {submittedApp.id.toUpperCase()} {"//"} STATUS: PENDING
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
          Application Logged in Directorate Queue
        </h2>
        <p className="text-sm font-sans text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
          Thank you, <strong className="text-white">{submittedApp.name}</strong>.
          Your application for{" "}
          <strong className="text-cyan-axon">{submittedApp.roleType}</strong>{" "}
          is now live in the AXON Executive Council moderation panel. Upon
          approval, your Digital Member ID and{" "}
          <code className="text-cyan-axon font-mono">/dashboard</code> access
          unlock automatically.
        </p>
        <div className="inline-flex flex-wrap justify-center gap-4 font-mono text-xs">
          <Link
            href="/"
            className="px-6 py-3 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/wings"
            className="px-6 py-3 bg-void-subtle border border-void-border text-slate-200 rounded hover:border-slate-500 transition-colors"
          >
            Explore Directorates
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-void-card border border-cyan-axon/50 text-cyan-axon rounded hover:bg-void-subtle transition-colors"
          >
            Check Portal Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Candidate Identity */}
      <div className="p-8 rounded-xl bg-void-card border border-void-border space-y-6">
        <div className="text-xs font-mono uppercase text-slate-400 border-b border-void-border/60 pb-2">
          01 // Candidate Profile & Contact
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-2">FULL NAME *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Daniyal Tariq"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="e.g. candidate@domain.edu.pk"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              UNIVERSITY / CHAPTER NODE *
            </label>
            <select
              value={chapterChoice}
              onChange={(e) => {
                setChapterChoice(e.target.value);
                if (e.target.value !== "__custom__") {
                  setFormData({ ...formData, university: e.target.value });
                }
              }}
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
            >
              {chapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
              <option value="__custom__">
                Other University / Prospective New Chapter
              </option>
            </select>
            {chapterChoice === "__custom__" && (
              <input
                type="text"
                required
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
                placeholder="Enter University & Campus Name"
                className="mt-2 w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
              />
            )}
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              GITHUB USERNAME / PROFILE *
            </label>
            <input
              type="text"
              required
              value={formData.githubUsername}
              onChange={(e) =>
                setFormData({ ...formData, githubUsername: e.target.value })
              }
              placeholder="e.g. github.com/username"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Role & Directorate Alignment */}
      <div className="p-8 rounded-xl bg-void-card border border-void-border space-y-6">
        <div className="text-xs font-mono uppercase text-slate-400 border-b border-void-border/60 pb-2">
          02 // Induction Track & Preferred Directorate
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-2">
              APPLICATION TRACK *
            </label>
            <select
              value={formData.roleType}
              onChange={(e) =>
                setFormData({ ...formData, roleType: e.target.value })
              }
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
            >
              <option value="General Member Engineer">
                General Member Engineer
              </option>
              <option value="Campus Ambassador Lead">
                Campus Ambassador Lead (Non-UET)
              </option>
              <option value="Research & Publications Fellow">
                Research & Publications Fellow
              </option>
              <option value="University Chapter Founder">
                Prospective University Chapter Lead
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              PRIMARY DIRECTORATE / WING *
            </label>
            <select
              value={formData.preferredWing}
              onChange={(e) =>
                setFormData({ ...formData, preferredWing: e.target.value })
              }
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
            >
              {wings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-mono text-xs mb-2">
            ENGINEERING BACKGROUND & TECHNICAL STATEMENT
          </label>
          <textarea
            rows={4}
            required
            value={formData.statement}
            onChange={(e) =>
              setFormData({ ...formData, statement: e.target.value })
            }
            placeholder="Briefly describe your programming experience, hardware projects, open-source contributions, or why you want to lead an AXON wing/chapter..."
            className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs font-sans"
          />
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs pt-4">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-circuit-green" />
          <span>
            Applications reviewed by Executive Council within 48 hours
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3.5 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span>{submitting ? "Submitting..." : "Submit Application"}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
