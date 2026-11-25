"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  CreditCard,
  Code,
  Award,
  ExternalLink,
  Edit,
  Save,
  CheckCircle,
  Eye,
  GitBranch,
  Github,
  Plus,
} from "lucide-react";
import DigitalIdCard from "@/components/DigitalIdCard";
import { MEMBERS_PORTFOLIOS, PROJECTS, CERTIFICATES_DATABASE } from "@/data/axonData";

export default function MemberDashboard() {
  const member = MEMBERS_PORTFOLIOS["irfan"];
  const [activeTab, setActiveTab] = useState<"id-card" | "portfolio" | "projects" | "certificates">("id-card");

  // Portfolio editor state
  const [headline, setHeadline] = useState(member.headline);
  const [bio, setBio] = useState(member.bio);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New project draft state
  const [repoUrl, setRepoUrl] = useState("");
  const [syncingRepo, setSyncingRepo] = useState(false);
  const [projectList, setProjectList] = useState(PROJECTS.filter((p) => p.author.username === "irfan"));

  const handleSavePortfolio = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSyncProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;
    setSyncingRepo(true);
    setTimeout(() => {
      setSyncingRepo(false);
      setProjectList([
        ...projectList,
        {
          id: `proj-${Date.now()}`,
          slug: "custom-repo",
          title: repoUrl.split("/").pop() || "Custom Engineered Component",
          author: {
            name: member.name,
            username: member.username,
            memberId: member.memberId,
            wing: member.wing,
            avatar: member.avatar,
          },
          summary: "Newly linked repository automatically fetched from GitHub REST API.",
          architecture: "Verified GitHub commit history and code coverage metrics.",
          techStack: ["Rust", "TypeScript", "Docker"],
          githubRepo: repoUrl,
          stars: 12,
          forks: 3,
          wingId: "systems-infra",
          status: "Verified & Active",
        },
      ]);
      setRepoUrl("");
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono text-xs">
      {/* Top Welcome Strip */}
      <div className="border-b border-void-border pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-axon text-[11px] mb-1">
            <span className="w-2 h-2 rounded-full bg-circuit-green"></span>
            <span>AUTHENTICATED MEMBER SESSION // RBAC: APPROVED MEMBER</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white font-sans">
            Member Operations Workspace
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Logged in as <strong className="text-white">{member.name}</strong> ({member.memberId}) — {member.wing}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/u/${member.username}`}
            className="px-4 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 rounded flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-axon" />
            <span>Public Portfolio</span>
          </Link>

          <Link
            href="/verify?code=AXN-2026-018"
            className="px-4 py-2 bg-void-card border border-circuit-green/40 text-circuit-green rounded hover:bg-circuit-green/10 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public Status</span>
          </Link>
        </div>
      </div>

      {/* Workspace Metric Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">PORTFOLIO VIEWS</div>
          <div className="text-2xl font-bold text-white mt-1">1,482</div>
          <div className="text-[10px] text-circuit-green mt-0.5">+18% this month</div>
        </div>

        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">GITHUB STARS (LINKED)</div>
          <div className="text-2xl font-bold text-white mt-1">184</div>
          <div className="text-[10px] text-cyan-axon mt-0.5">Vortex KV Storage</div>
        </div>

        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">VERIFIED CREDENTIALS</div>
          <div className="text-2xl font-bold text-white mt-1">2</div>
          <div className="text-[10px] text-circuit-green mt-0.5">Cryptographically Sealed</div>
        </div>

        <div className="p-4 rounded-xl bg-void-card border border-void-border">
          <div className="text-[10px] text-slate-400 uppercase">DIRECTORATE COMMITMENT</div>
          <div className="text-2xl font-bold text-white mt-1">100%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">IMAC Node Active</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-void-border mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("id-card")}
          className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "id-card"
              ? "border-cyan-axon text-cyan-axon"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Digital Student ID Card</span>
        </button>

        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "portfolio"
              ? "border-cyan-axon text-cyan-axon"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Portfolio Builder</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "projects"
              ? "border-cyan-axon text-cyan-axon"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>GitHub Project Submissions</span>
        </button>

        <button
          onClick={() => setActiveTab("certificates")}
          className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "certificates"
              ? "border-cyan-axon text-cyan-axon"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Credential Vault</span>
        </button>
      </div>

      {/* Tab 1: Digital ID Card */}
      {activeTab === "id-card" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-white font-serif font-bold text-xl mb-2 font-sans">
              Auto-Generated Member Credential
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans mb-6">
              Your institutional ID is automatically synthesized by the AXON Council upon admission approval. It features an integrated high-contrast QR code routing directly to the real-time public verification system.
            </p>

            <div className="p-4 rounded-lg bg-void-card border border-void-border space-y-2 mb-6">
              <div className="text-[10px] text-slate-400 uppercase">SPECIFICATIONS</div>
              <div>• Unique Identifier: <span className="text-cyan-axon font-bold">{member.memberId}</span></div>
              <div>• Tenure Validity: 2026 – 2028 Academic Cycle</div>
              <div>• Physical Node: IMAC Labs, UET Lahore</div>
              <div>• Verification Protocol: SHA-160 Secure Digest</div>
            </div>
          </div>

          <div>
            <DigitalIdCard member={member} />
          </div>
        </div>
      )}

      {/* Tab 2: Portfolio Builder */}
      {activeTab === "portfolio" && (
        <div className="p-8 rounded-xl bg-void-card border border-void-border space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-void-border pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-white font-sans">
                Edit Shareable Portfolio Details
              </h2>
              <p className="text-slate-400 text-xs">
                Changes update your live public link at <span className="text-cyan-axon">/u/{member.username}</span>
              </p>
            </div>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-circuit-green">
                <CheckCircle className="w-4 h-4" />
                <span>Saved & Deployed!</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
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

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Long-form Technical Bio / Story
              </label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-axon text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href={`/u/${member.username}`}
                className="px-4 py-2.5 bg-void-subtle border border-void-border text-slate-300 hover:text-white rounded"
              >
                Preview Profile
              </Link>
              <button
                onClick={handleSavePortfolio}
                className="px-6 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: GitHub Projects */}
      {activeTab === "projects" && (
        <div className="space-y-8">
          {/* Submit new repo */}
          <div className="p-6 rounded-xl bg-void-card border border-void-border">
            <h2 className="font-serif text-lg font-bold text-white mb-2 font-sans">
              Link GitHub Repository (Members Only)
            </h2>
            <p className="text-slate-400 text-xs mb-4">
              Enter your repository URL. The backend extracts commit frequency, star counts, and language breakdowns automatically.
            </p>

            <form onSubmit={handleSyncProject} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/irfanullah/new-microservice"
                className="flex-1 bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
              />
              <button
                type="submit"
                disabled={syncingRepo}
                className="px-6 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2"
              >
                {syncingRepo ? (
                  <span>Syncing GitHub...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Sync & Publish</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of projects */}
          <div className="space-y-4">
            <div className="text-white font-semibold uppercase text-[11px]">
              Your Published Repositories ({projectList.length})
            </div>
            {projectList.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-lg bg-void-card border border-void-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-circuit-green mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="font-semibold">{p.status}</span>
                  </div>
                  <div className="font-serif text-base font-bold text-white font-sans">
                    {p.title}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{p.githubRepo}</div>
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
                  <Link
                    href={`/projects/${p.slug}`}
                    className="px-3 py-1.5 bg-void-subtle border border-void-border hover:border-cyan-axon text-cyan-axon rounded"
                  >
                    View Listing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Certificates Vault */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          <div className="text-white font-semibold uppercase text-[11px]">
            Your Cryptographically Sealed Certificates
          </div>
          {CERTIFICATES_DATABASE.filter((c) => c.memberId === "AXN-2026-018").map((cert) => (
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
                  Issued: {cert.issueDate} // Authority: {cert.issuerAuthority}
                </div>
              </div>

              <Link
                href={`/verify?code=${cert.certCode}`}
                className="px-4 py-2 bg-void-subtle border border-cyan-axon text-cyan-axon hover:bg-cyan-axon hover:text-void-500 rounded font-semibold transition-all text-center"
              >
                Open Verification Seal
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
