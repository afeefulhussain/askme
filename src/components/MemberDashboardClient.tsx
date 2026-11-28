"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  CreditCard,
  Code,
  Award,
  Save,
  CheckCircle,
  Eye,
  Github,
  Plus,
  FileText,
  Clock,
  RefreshCw,
  AlertCircle,
  Lock,
  Upload,
} from "lucide-react";
import DigitalIdCard from "@/components/DigitalIdCard";
import type {
  AxonMember,
  BlogPost,
  PortfolioTheme,
  Project,
  VerifiedCertificate,
  Wing,
} from "@/lib/types";
import { canAccessAdmin, formatRbacLabel } from "@/lib/rbac";

interface MemberDashboardClientProps {
  initialMember: AxonMember;
  initialProjects: Project[];
  initialBlogs: BlogPost[];
  initialCertificates: VerifiedCertificate[];
  wings: Wing[];
}

export default function MemberDashboardClient({
  initialMember,
  initialProjects,
  initialBlogs,
  initialCertificates,
  wings,
}: MemberDashboardClientProps) {
  const [member, setMember] = useState<AxonMember>(initialMember);
  const [activeTab, setActiveTab] = useState<
    "id-card" | "portfolio" | "projects" | "blogs" | "certificates"
  >("id-card");

  // Portfolio Builder state
  const [headline, setHeadline] = useState(member.headline);
  const [bio, setBio] = useState(member.bio);
  const [githubUsername, setGithubUsername] = useState(member.githubUsername);
  const [linkedin, setLinkedin] = useState(member.linkedin);
  const [avatarUrl, setAvatarUrl] = useState(member.avatar);
  const [resumeUrl, setResumeUrl] = useState(member.resumeUrl || "");
  const [graduationYear, setGraduationYear] = useState(member.graduationYear);
  const [internshipAvailable, setInternshipAvailable] = useState(
    member.internshipAvailable
  );
  const [themePreference, setThemePreference] = useState<PortfolioTheme>(
    member.themePreference
  );
  const [languagesInput, setLanguagesInput] = useState(
    member.skills.languages.join(", ")
  );
  const [frameworksInput, setFrameworksInput] = useState(
    member.skills.frameworks.join(", ")
  );
  const [systemsInput, setSystemsInput] = useState(
    member.skills.systems.join(", ")
  );
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Project Submission state (starts "Under Review" until Super Admin approves)
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [repoUrl, setRepoUrl] = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [projArchitecture, setProjArchitecture] = useState("");
  const [projDemoUrl, setProjDemoUrl] = useState("");
  const [projCoverUrl, setProjCoverUrl] = useState("");
  const [projWing, setProjWing] = useState(
    wings.some((w) => w.id === member.wingId) ? member.wingId : "technical"
  );
  const [syncingRepo, setSyncingRepo] = useState(false);
  const [projMessage, setProjMessage] = useState<string | null>(null);
  const [projError, setProjError] = useState<string | null>(null);

  // Blog Draft state (starts "Pending Review" until Super Admin approves)
  const [blogList, setBlogList] = useState<BlogPost[]>(initialBlogs);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogTags, setBlogTags] = useState("Systems, Architecture");
  const [blogContent, setBlogContent] = useState("");
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState<string | null>(null);
  const [blogError, setBlogError] = useState<string | null>(null);

  // Pending Applicant strict lock
  if (member.rbacRole === "PENDING_APPLICANT") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 font-mono text-xs">
        <div className="p-8 rounded-2xl bg-void-card border border-yellow-500/40 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="inline-block px-3 py-1 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold uppercase text-[11px]">
            RBAC STATUS: PENDING APPLICANT
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white font-sans">
            Application Under Council Review
          </h1>
          <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-xl mx-auto">
            Hello <strong>{member.name}</strong> ({member.email}). Your
            application for <strong>{member.wing}</strong> is currently pending
            approval. Digital ID generation, project submissions, and file
            uploads unlock automatically once inducted.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/wings"
              className="px-5 py-2.5 bg-void-subtle border border-void-border text-slate-200 rounded hover:border-cyan-axon"
            >
              Browse 11 Wings
            </Link>
            <Link
              href="/events"
              className="px-5 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded"
            >
              Attend Open Workshops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleUploadFile = async (
    file: File | undefined,
    bucket: "avatars" | "project-covers" | "resumes",
    onSuccess: (url: string) => void
  ) => {
    if (!file) return;
    setUploadingAsset(bucket);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("bucket", bucket);
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setUploadError(data.error || "Upload failed.");
      } else {
        onSuccess(data.url);
      }
    } catch {
      setUploadError("Network error while uploading file.");
    } finally {
      setUploadingAsset(null);
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPortfolio(true);
    setSavedSuccess(false);

    const parseCsv = (val: string) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          bio,
          githubUsername,
          linkedin,
          avatar: avatarUrl,
          resumeUrl: resumeUrl || undefined,
          graduationYear: Number(graduationYear) || 2027,
          internshipAvailable,
          themePreference,
          skills: {
            languages: parseCsv(languagesInput),
            frameworks: parseCsv(frameworksInput),
            systems: parseCsv(systemsInput),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMember(data.member);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setSavingPortfolio(false);
    }
  };

  const handleSyncProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setSyncingRepo(true);
    setProjError(null);
    setProjMessage(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubRepo: repoUrl,
          title: projTitle,
          architecture: projArchitecture,
          liveDemoUrl: projDemoUrl,
          coverImage: projCoverUrl || undefined,
          wingId: projWing,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProjError(data.error || "Unable to submit repository.");
      } else {
        setProjectList([data.project, ...projectList]);
        setRepoUrl("");
        setProjTitle("");
        setProjArchitecture("");
        setProjDemoUrl("");
        setProjCoverUrl("");
        setProjMessage(
          `Project submitted with status "${data.project.status}". It will appear publicly on /projects once approved by the Super Admin.`
        );
      }
    } catch {
      setProjError("Network error while submitting project.");
    } finally {
      setSyncingRepo(false);
    }
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBlog(true);
    setBlogSuccess(null);
    setBlogError(null);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogTitle,
          summary: blogSummary,
          content: blogContent,
          tags: blogTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBlogError(data.error || "Failed to submit article.");
      } else {
        setBlogList([data.blog, ...blogList]);
        setBlogTitle("");
        setBlogSummary("");
        setBlogContent("");
        setBlogSuccess(
          `Article submitted as "${data.blog.status}". Super Admin approval is required before public listing on /blogs.`
        );
      }
    } finally {
      setSubmittingBlog(false);
    }
  };

  const totalStars = projectList.reduce((sum, p) => sum + p.stars, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono text-xs">
      {/* Top Welcome Strip */}
      <div className="border-b border-void-border pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-cyan-axon text-[11px] mb-1">
            <span className="w-2 h-2 rounded-full bg-circuit-green"></span>
            <span>
              AUTHENTICATED SESSION // {formatRbacLabel(member.rbacRole).toUpperCase()}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white font-sans">
            Member Operations Workspace
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Signed in as <strong className="text-white">{member.name}</strong> (
            {member.memberId}) — {member.wing}
          </p>
          {/* Internal-only reporting visibility (hidden from public pages) */}
          {member.reportsTo && (
            <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-void-card border border-void-border text-[11px] text-slate-300">
              <span className="text-cyan-axon font-semibold">
                INTERNAL SUPERVISION LINE:
              </span>
              <span>Reports To {member.reportsTo} (Core Coordinator)</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/u/${member.username}`}
            className="px-4 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 rounded flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-axon" />
            <span>Public Portfolio</span>
          </Link>

          <Link
            href={`/verify?code=${encodeURIComponent(member.memberId)}`}
            className="px-4 py-2 bg-void-card border border-circuit-green/40 text-circuit-green rounded hover:bg-circuit-green/10 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verification Seal</span>
          </Link>

          {canAccessAdmin(member.rbacRole) && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-cyan-axon text-void-500 font-bold rounded hover:bg-cyan-300 transition-colors"
            >
              Open Council / Wing Console →
            </Link>
          )}
        </div>
      </div>

      {/* Workspace Metric Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 no-print">
        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">
            PORTFOLIO VIEWS
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {member.portfolioViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-circuit-green mt-0.5">
            askme.pk/u/{member.username}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">
            GITHUB STARS (LINKED)
          </div>
          <div className="text-2xl font-bold text-white mt-1">{totalStars}</div>
          <div className="text-[10px] text-cyan-axon mt-0.5">
            {projectList.length} Submitted Repos
          </div>
        </div>

        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">
            VERIFIED CREDENTIALS
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {initialCertificates.length}
          </div>
          <div className="text-[10px] text-circuit-green mt-0.5">
            SHA-160 Anchored
          </div>
        </div>

        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">
            PUBLICATIONS & DRAFTS
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {blogList.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            IMAC Technical Press
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-void-border mb-8 overflow-x-auto no-print">
        {(
          [
            { id: "id-card", label: "Digital Student ID", icon: CreditCard },
            { id: "portfolio", label: "Portfolio & Resume", icon: User },
            { id: "projects", label: "Submit Project", icon: Code },
            { id: "blogs", label: "Submit Article", icon: FileText },
            { id: "certificates", label: "Credential Vault", icon: Award },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-cyan-axon text-cyan-axon"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Digital ID Card */}
      {activeTab === "id-card" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="no-print">
            <div className="text-white font-serif font-bold text-xl mb-2 font-sans">
              Institutional Member Credential
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans mb-6">
              Your AXN-26 credential embeds a scannable QR verification route to{" "}
              <code className="text-cyan-axon">askme.pk/verify</code> and
              supports PNG and vector PDF export.
            </p>

            <div className="p-4 rounded-lg bg-void-card border border-void-border space-y-2 mb-6">
              <div className="text-[10px] text-slate-400 uppercase">
                SPECIFICATIONS
              </div>
              <div>
                • Member ID:{" "}
                <span className="text-cyan-axon font-bold">
                  {member.memberId}
                </span>
              </div>
              <div>• Designation: {member.designation}</div>
              <div>• Directorate: {member.wing}</div>
              <div>• Chapter Node: {member.chapter}</div>
              {member.portalResponsibilities && (
                <div className="pt-2 border-t border-void-border/50 text-slate-300">
                  • Scope: {member.portalResponsibilities}
                </div>
              )}
            </div>
          </div>

          <div>
            <DigitalIdCard member={member} />
          </div>
        </div>
      )}

      {/* Tab 2: Portfolio Builder & Uploads */}
      {activeTab === "portfolio" && (
        <form
          onSubmit={handleSavePortfolio}
          className="p-8 rounded-xl bg-void-card border border-void-border space-y-6 max-w-4xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-void-border pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-white font-sans">
                Live Portfolio & File Uploads
              </h2>
              <p className="text-slate-400 text-xs">
                Updates publish immediately to{" "}
                <Link
                  href={`/u/${member.username}`}
                  className="text-cyan-axon underline"
                >
                  /u/{member.username}
                </Link>
              </p>
            </div>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-circuit-green font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Saved to Registry!</span>
              </span>
            )}
          </div>

          {uploadError && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Avatar & Resume File Uploaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-void-subtle border border-void-border">
            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Profile Portrait (PNG / JPEG / WebP)
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={member.name}
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded object-cover border border-void-border"
                />
                <label className="px-3 py-2 bg-void-card border border-void-border hover:border-cyan-axon rounded cursor-pointer flex items-center gap-1.5 text-[11px]">
                  <Upload className="w-3.5 h-3.5 text-cyan-axon" />
                  <span>
                    {uploadingAsset === "avatars"
                      ? "Uploading..."
                      : "Upload Avatar"}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleUploadFile(
                        e.target.files?.[0],
                        "avatars",
                        (url) => setAvatarUrl(url)
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Recruiter Resume (PDF, Max 5MB)
              </label>
              <div className="flex items-center gap-3">
                <label className="px-3 py-2 bg-void-card border border-void-border hover:border-cyan-axon rounded cursor-pointer flex items-center gap-1.5 text-[11px]">
                  <Upload className="w-3.5 h-3.5 text-circuit-green" />
                  <span>
                    {uploadingAsset === "resumes"
                      ? "Uploading..."
                      : "Upload Resume PDF"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleUploadFile(
                        e.target.files?.[0],
                        "resumes",
                        (url) => setResumeUrl(url)
                      )
                    }
                  />
                </label>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-axon underline text-[11px] truncate max-w-[160px]"
                  >
                    PDF Attached →
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Technical Bio / Story
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-axon text-xs font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                GitHub Username (Manual Link)
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Graduation Year
              </label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Editorial Layout / Accent Preset
              </label>
              <select
                value={themePreference}
                onChange={(e) =>
                  setThemePreference(e.target.value as PortfolioTheme)
                }
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              >
                <option value="obsidian-cyan">Obsidian Cyan (Default)</option>
                <option value="imac-emerald">IMAC Circuit Emerald</option>
                <option value="editorial-slate">Editorial Slate</option>
                <option value="monolith-amber">Hardware Monolith Amber</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Languages (comma separated)
              </label>
              <input
                type="text"
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Frameworks (comma separated)
              </label>
              <input
                type="text"
                value={frameworksInput}
                onChange={(e) => setFrameworksInput(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Systems & Tools (comma separated)
              </label>
              <input
                type="text"
                value={systemsInput}
                onChange={(e) => setSystemsInput(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={internshipAvailable}
                  onChange={(e) => setInternshipAvailable(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>
                  Display &quot;Available for Internships / Roles&quot; badge on
                  public talent directory
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href={`/u/${member.username}`}
              className="px-4 py-2.5 bg-void-subtle border border-void-border text-slate-300 hover:text-white rounded"
            >
              View Live Portfolio
            </Link>
            <button
              type="submit"
              disabled={savingPortfolio}
              className="px-6 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingPortfolio ? "Saving..." : "Save & Publish"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Project Submission */}
      {activeTab === "projects" && (
        <div className="space-y-8">
          <div className="p-6 rounded-xl bg-void-card border border-void-border">
            <h2 className="font-serif text-lg font-bold text-white mb-2 font-sans">
              Submit GitHub Project for Super Admin Review
            </h2>
            <p className="text-slate-400 text-xs mb-4">
              Paste your public GitHub repository URL directly (no GitHub OAuth
              login required). All member submissions enter{" "}
              <strong className="text-yellow-400">Under Review</strong> until
              approved by the Super Admin.
            </p>

            {projError && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{projError}</span>
              </div>
            )}
            {projMessage && (
              <div className="mb-4 p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{projMessage}</span>
              </div>
            )}

            <form onSubmit={handleSyncProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                    Custom Project Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="Auto-filled from GitHub if blank"
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={projDemoUrl}
                    onChange={(e) => setProjDemoUrl(e.target.value)}
                    placeholder="https://demo.askme.pk"
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                    Tagged Directorate
                  </label>
                  <select
                    value={projWing}
                    onChange={(e) => setProjWing(e.target.value)}
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
                  >
                    {wings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                    Architecture Summary (Optional)
                  </label>
                  <input
                    type="text"
                    value={projArchitecture}
                    onChange={(e) => setProjArchitecture(e.target.value)}
                    placeholder="Technical design, benchmarks, stack..."
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                    Project Cover Image (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon rounded cursor-pointer flex items-center gap-1.5 text-[11px]">
                      <Upload className="w-3.5 h-3.5 text-cyan-axon" />
                      <span>
                        {uploadingAsset === "project-covers"
                          ? "Uploading..."
                          : "Upload Cover"}
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) =>
                          handleUploadFile(
                            e.target.files?.[0],
                            "project-covers",
                            (url) => setProjCoverUrl(url)
                          )
                        }
                      />
                    </label>
                    {projCoverUrl && (
                      <span className="text-circuit-green text-[11px]">
                        Cover ready
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={syncingRepo}
                className="px-6 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {syncingRepo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing GitHub API...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Submit Project for Approval</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="text-white font-semibold uppercase text-[11px]">
              Your Submitted Repositories ({projectList.length})
            </div>
            {projectList.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-lg bg-void-card border border-void-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        p.status === "Verified & Active"
                          ? "bg-circuit-green/20 text-circuit-green"
                          : p.status === "Rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                    <span className="text-slate-400">★ {p.stars}</span>
                  </div>
                  <div className="font-serif text-base font-bold text-white font-sans">
                    {p.title}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {p.githubRepo}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={p.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5 text-cyan-axon" />
                    <span>GitHub</span>
                  </a>
                  {p.status === "Verified & Active" && (
                    <Link
                      href={`/projects/${p.slug}`}
                      className="px-3 py-1.5 bg-void-subtle border border-void-border hover:border-cyan-axon text-cyan-axon rounded"
                    >
                      View Live Listing
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Technical Blog Draft Submission */}
      {activeTab === "blogs" && (
        <div className="space-y-8">
          <form
            onSubmit={handleSubmitBlog}
            className="p-6 rounded-xl bg-void-card border border-void-border space-y-4 max-w-3xl"
          >
            <div>
              <h2 className="font-serif text-lg font-bold text-white font-sans">
                Submit Engineering Monograph / Article Draft
              </h2>
              <p className="text-slate-400 text-xs">
                Supports Markdown headings and fenced code blocks. All submissions
                enter <strong className="text-yellow-400">Pending Review</strong>{" "}
                for Super Admin publication approval.
              </p>
            </div>

            {blogError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{blogError}</span>
              </div>
            )}

            {blogSuccess && (
              <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{blogSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="e.g. Lock-Free Ring Buffers in Rust for Telemetry Ingestion"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Executive Summary *
              </label>
              <input
                type="text"
                required
                value={blogSummary}
                onChange={(e) => setBlogSummary(e.target.value)}
                placeholder="Concise 1-2 sentence technical abstract..."
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={blogTags}
                onChange={(e) => setBlogTags(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Markdown Content *
              </label>
              <textarea
                rows={7}
                required
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                placeholder="### Architecture Overview"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-axon text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={submittingBlog}
              className="px-6 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors disabled:opacity-60"
            >
              {submittingBlog ? "Submitting..." : "Submit Draft for Review"}
            </button>
          </form>

          <div className="space-y-3">
            <div className="text-white font-semibold uppercase text-[11px]">
              Your Submitted Articles ({blogList.length})
            </div>
            {blogList.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-lg bg-void-card border border-void-border flex items-center justify-between gap-4"
              >
                <div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      b.status === "Published"
                        ? "bg-circuit-green/20 text-circuit-green"
                        : b.status === "Rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                  <div className="font-serif text-base font-bold text-white mt-1 font-sans">
                    {b.title}
                  </div>
                </div>
                {b.status === "Published" && (
                  <Link
                    href={`/blogs/${b.slug}`}
                    className="px-3 py-1.5 bg-void-subtle border border-void-border hover:border-cyan-axon text-cyan-axon rounded shrink-0"
                  >
                    Read Live
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Certificates Vault */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          <div className="text-white font-semibold uppercase text-[11px]">
            Your Cryptographically Sealed Certificates ({initialCertificates.length})
          </div>
          {initialCertificates.length === 0 ? (
            <div className="p-8 rounded-xl bg-void-card border border-void-border text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>No certificates issued to your Member ID yet.</span>
            </div>
          ) : (
            initialCertificates.map((cert) => (
              <div
                key={cert.certCode}
                className="p-6 rounded-xl bg-void-card border border-circuit-green/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-circuit-green font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>STATUS: {cert.status}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-cyan-axon">{cert.certCode}</span>
                  </div>
                  <div className="font-serif text-lg font-bold text-white font-sans">
                    {cert.eventOrRole}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Issued: {cert.issueDate} {"//"} Authority:{" "}
                    {cert.issuerAuthority}
                  </div>
                </div>

                <Link
                  href={`/verify?code=${encodeURIComponent(cert.certCode)}`}
                  className="px-4 py-2 bg-void-subtle border border-cyan-axon text-cyan-axon hover:bg-cyan-axon hover:text-void-500 rounded font-semibold transition-all text-center shrink-0"
                >
                  Open Verification Seal
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
