"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Send,
  AlertCircle,
  Upload,
} from "lucide-react";
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  const [chapterChoice, setChapterChoice] = useState(
    chapters[0] || "IMAC, UET Lahore (Founding Chapter)"
  );
  const [customChapter, setCustomChapter] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    university: chapters[0] || "IMAC, UET Lahore (Founding Chapter)",
    roleType: "General Member Engineer",
    preferredWing: validWing,
    githubUsername: "",
    linkedin: "",
    avatarUrl: "",
    skillsInput: "",
    statement: "",
  });

  const handlePhotoUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingPhoto(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("bucket", "onboarding-avatars");
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Unable to upload profile photo.");
      } else {
        setFormData((prev) => ({ ...prev, avatarUrl: data.url! }));
      }
    } catch {
      setError("Network error while uploading profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;
    submitLockRef.current = true;
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
      submitLockRef.current = false;
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
          APPLICATION REFERENCE: {submittedApp.id.toUpperCase()} {"//"} STATUS: PENDING SUPER ADMIN REVIEW
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
          Onboarding Package Routed to Super Admin
        </h2>
        <p className="text-sm font-sans text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
          Thank you, <strong className="text-white">{submittedApp.name}</strong>.
          Your complete profile package for{" "}
          <strong className="text-cyan-axon">{submittedApp.roleType}</strong>{" "}
          is now queued in the AXON President (SUPER_ADMIN) review console for official wing and role appointment. Upon approval, your{" "}
          <code className="text-cyan-axon font-mono">/portfolio/[slug]</code>, Digital Member ID card, and credentials activate immediately.
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
            Portal Sign-In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 font-mono text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Candidate Identity, Academic Details & Photo */}
      <div className="p-8 rounded-xl bg-void-card border border-void-border space-y-6">
        <div className="text-xs font-mono uppercase text-slate-400 border-b border-void-border/60 pb-2">
          01 // Candidate Profile, Academic Identity & Photo
        </div>

        {/* Profile Photo Upload */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-void-400 border border-void-border">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-void-border bg-void-500 flex items-center justify-center shrink-0">
            {formData.avatarUrl ? (
              <Image
                src={formData.avatarUrl}
                alt="Candidate avatar preview"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono text-xs text-slate-500">PHOTO</span>
            )}
          </div>
          <div className="space-y-1.5 font-mono text-xs flex-1">
            <label
              htmlFor="join-photo-upload"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-axon" />
              <span>
                {uploadingPhoto ? "Uploading Photo..." : "Upload Profile Photo (PNG/JPEG/WebP, max 2MB)"}
              </span>
            </label>
            <input
              id="join-photo-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => void handlePhotoUpload(e.target.files?.[0])}
              className="sr-only"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              Used immediately on your Digital Member ID Card and verified public portfolio upon Super Admin approval.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
          <div>
            <label htmlFor="join-name" className="block text-slate-300 mb-2">
              FULL NAME *
            </label>
            <input
              id="join-name"
              type="text"
              required
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Daniyal Tariq"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label htmlFor="join-email" className="block text-slate-300 mb-2">
              EMAIL ADDRESS *
            </label>
            <input
              id="join-email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="e.g. candidate@uet.edu.pk"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label htmlFor="join-roll" className="block text-slate-300 mb-2">
              UNIVERSITY ROLL / REGISTRATION NO. *
            </label>
            <input
              id="join-roll"
              type="text"
              required
              value={formData.rollNumber}
              onChange={(e) =>
                setFormData({ ...formData, rollNumber: e.target.value })
              }
              placeholder="e.g. 2024-CS-142"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label htmlFor="join-dept" className="block text-slate-300 mb-2">
              ACADEMIC DEPARTMENT *
            </label>
            <input
              id="join-dept"
              type="text"
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="e.g. IMAC / Computer Science"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label htmlFor="join-chapter" className="block text-slate-300 mb-2">
              UNIVERSITY / CHAPTER NODE *
            </label>
            <select
              id="join-chapter"
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
            <label htmlFor="join-github" className="block text-slate-300 mb-2">
              GITHUB USERNAME / PROFILE *
            </label>
            <input
              id="join-github"
              type="text"
              required
              value={formData.githubUsername}
              onChange={(e) =>
                setFormData({ ...formData, githubUsername: e.target.value })
              }
              placeholder="e.g. daniyal-tariq"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label htmlFor="join-linkedin" className="block text-slate-300 mb-2">
              LINKEDIN PROFILE URL
            </label>
            <input
              id="join-linkedin"
              type="url"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
            />
          </div>

          <div>
            <label htmlFor="join-skills" className="block text-slate-300 mb-2">
              KEY SKILLS (COMMA-SEPARATED)
            </label>
            <input
              id="join-skills"
              type="text"
              value={formData.skillsInput}
              onChange={(e) =>
                setFormData({ ...formData, skillsInput: e.target.value })
              }
              placeholder="TypeScript, Next.js, Verilog, Figma"
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
            <label htmlFor="join-track" className="block text-slate-300 mb-2">
              APPLICATION TRACK *
            </label>
            <select
              id="join-track"
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
            <label htmlFor="join-wing" className="block text-slate-300 mb-2">
              PRIMARY DIRECTORATE / WING *
            </label>
            <select
              id="join-wing"
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
          <label
            htmlFor="join-statement"
            className="block text-slate-300 font-mono text-xs mb-2"
          >
            ENGINEERING BACKGROUND & PORTFOLIO BIO *
          </label>
          <textarea
            id="join-statement"
            rows={4}
            required
            value={formData.statement}
            onChange={(e) =>
              setFormData({ ...formData, statement: e.target.value })
            }
            placeholder="Describe your projects, academic interests, and technical goals..."
            className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs font-sans"
          />
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs pt-4">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-circuit-green" />
          <span>
            Reviewed directly by AXON Super Admin (President) for official wing appointment
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting || uploadingPhoto}
          className="w-full sm:w-auto px-8 py-3.5 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span>{submitting ? "Submitting..." : "Submit Application"}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
