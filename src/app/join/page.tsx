"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Github, Building2, User, Mail, Send } from "lucide-react";
import { WINGS } from "@/data/axonData";

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "UET Lahore",
    roleType: "General Member Engineer",
    preferredWing: "systems-infra",
    githubUsername: "",
    statement: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Editorial Header */}
      <div className="border-b border-void-border pb-10 mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          ADMISSIONS & INDUCTIONS // COHORT 2026.2
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          Join the AXON Engineering Network
        </h1>
        <p className="mt-4 text-base text-slate-300 font-sans leading-relaxed">
          AXON inducts student engineers, research fellows, campus ambassadors, and future university chapter founders across our 11 operational directorates. Inductions are meritocratic, focusing on practical engineering capability and demonstrable projects.
        </p>
      </div>

      {submitted ? (
        <div className="p-10 rounded-2xl bg-void-card border border-circuit-green/50 text-center">
          <div className="w-12 h-12 rounded-full bg-circuit-green/20 border border-circuit-green text-circuit-green flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
            Application Submitted to Directorate Board
          </h2>
          <p className="text-sm font-sans text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            Thank you, <strong className="text-white">{formData.name}</strong>. Your application for <strong className="text-cyan-axon">{formData.roleType}</strong> has been logged into the AXON Admin moderation queue. The respective Directorate Lead will review your technical profile and send onboarding instructions to <strong className="text-white">{formData.email}</strong>.
          </p>
          <div className="inline-flex gap-4 font-mono text-xs">
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
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Daniyal Tariq"
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. candidate@domain.edu.pk"
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">UNIVERSITY / INSTITUTION *</label>
                <input
                  type="text"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="e.g. UET Lahore, NUST, FAST, GIKI"
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">GITHUB USERNAME / PROFILE *</label>
                <input
                  type="text"
                  required
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
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
                <label className="block text-slate-300 mb-2">APPLICATION TRACK *</label>
                <select
                  value={formData.roleType}
                  onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
                >
                  <option value="General Member Engineer">General Member Engineer</option>
                  <option value="Campus Ambassador Lead">Campus Ambassador Lead (Non-UET)</option>
                  <option value="Research & Publications Fellow">Research & Publications Fellow</option>
                  <option value="University Chapter Founder">Prospective University Chapter Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">PRIMARY DIRECTORATE / WING *</label>
                <select
                  value={formData.preferredWing}
                  onChange={(e) => setFormData({ ...formData, preferredWing: e.target.value })}
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
                >
                  {WINGS.map((w) => (
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
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                placeholder="Briefly describe your programming experience, hardware projects, open-source contributions, or why you want to lead an AXON wing/chapter..."
                className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs font-sans"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs pt-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-circuit-green" />
              <span>Applications reviewed by Executive Council within 48 hours</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2"
            >
              <span>Submit Application</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
