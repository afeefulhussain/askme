"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  Award,
  Layers,
  CheckCircle2,
  FileText,
  Mail,
  BadgeCheck,
  Ban,
} from "lucide-react";
import type {
  AxonMember,
  BlogPost,
  ContactInquiry,
  MembershipApplication,
  Project,
  RbacRole,
  SessionUser,
  VerifiedCertificate,
  Wing,
} from "@/lib/types";
import { formatRbacLabel } from "@/lib/rbac";

interface AdminPanelClientProps {
  sessionUser: SessionUser;
  initialApplications: MembershipApplication[];
  initialCertificates: VerifiedCertificate[];
  initialProjects: Project[];
  initialBlogs: BlogPost[];
  initialInquiries: ContactInquiry[];
  membersList: AxonMember[];
  wings: Wing[];
}

export default function AdminPanelClient({
  sessionUser,
  initialApplications,
  initialCertificates,
  initialProjects,
  initialBlogs,
  initialInquiries,
  membersList,
  wings,
}: AdminPanelClientProps) {
  const isSuper = sessionUser.rbacRole === "super_admin";

  const [activeTab, setActiveTab] = useState<
    "applications" | "certificates" | "moderation" | "endorsements" | "wings"
  >("applications");

  const [applications, setApplications] =
    useState<MembershipApplication[]>(initialApplications);
  const [roleChoices, setRoleChoices] = useState<Record<string, RbacRole>>({});
  const [wingChoices, setWingChoices] = useState<Record<string, string>>({});
  const [onboardingNotice, setOnboardingNotice] = useState<string | null>(null);

  const [certificates, setCertificates] =
    useState<VerifiedCertificate[]>(initialCertificates);
  const [certRecipient, setCertRecipient] = useState("");
  const [certRole, setCertRole] = useState("");
  const [certType, setCertType] =
    useState<VerifiedCertificate["type"]>("Technical Distinction");
  const [certIssuedSuccess, setCertIssuedSuccess] = useState<string | null>(
    null
  );

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);

  // Endorsements state
  const [endorseTarget, setEndorseTarget] = useState(
    membersList[0]?.username || "irfan"
  );
  const [endorseBadge, setEndorseBadge] = useState("");
  const [endorseNote, setEndorseNote] = useState("");
  const [endorseSuccess, setEndorseSuccess] = useState<string | null>(null);

  const handleReviewApp = async (
    id: string,
    decision: "Approved" | "Rejected"
  ) => {
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        decision,
        assignedWing: wingChoices[id],
        assignedRole: roleChoices[id] || "approved_member",
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        application: MembershipApplication;
      };
      setApplications(
        applications.map((a) => (a.id === id ? data.application : a))
      );
      if (decision === "Approved" && data.application.generatedMemberId) {
        setOnboardingNotice(
          `Approved ${data.application.name}: Generated Member ID ${data.application.generatedMemberId}, portfolio /u/${data.application.generatedUsername}, and automated onboarding certificate.`
        );
      }
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certRecipient.trim() || !certRole.trim()) return;
    const res = await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientName: certRecipient,
        eventOrRole: certRole,
        type: certType,
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { certificate: VerifiedCertificate };
      setCertificates([data.certificate, ...certificates]);
      setCertIssuedSuccess(data.certificate.certCode);
      setCertRecipient("");
      setCertRole("");
    }
  };

  const handleToggleCertificate = async (certCode: string) => {
    const res = await fetch("/api/certificates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certCode }),
    });
    if (res.ok) {
      const data = (await res.json()) as { certificate: VerifiedCertificate };
      setCertificates(
        certificates.map((c) =>
          c.certCode === certCode ? data.certificate : c
        )
      );
    }
  };

  const handleModerateProject = async (
    id: string,
    status: Project["status"]
  ) => {
    const res = await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = await res.json();
      setProjects(projects.map((p) => (p.id === id ? data.project : p)));
    }
  };

  const handleModerateBlog = async (
    id: string,
    status: BlogPost["status"]
  ) => {
    const res = await fetch("/api/blogs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = await res.json();
      setBlogs(blogs.map((b) => (b.id === id ? data.blog : b)));
    }
  };

  const handleAwardEndorsement = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/endorsements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientUsername: endorseTarget,
        badgeTitle: endorseBadge,
        note: endorseNote,
      }),
    });
    if (res.ok) {
      setEndorseSuccess(
        `Endorsement badge "${endorseBadge}" awarded to /u/${endorseTarget}.`
      );
      setEndorseBadge("");
      setEndorseNote("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono text-xs">
      {/* Top Banner */}
      <div className="border-b border-void-border pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-[11px] mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>
              RESTRICTED EXECUTIVE CONSOLE //{" "}
              {formatRbacLabel(sessionUser.rbacRole).toUpperCase()}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white font-sans">
            Central Directorate Management Panel
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Signed in as <strong className="text-white">{sessionUser.name}</strong>{" "}
            — Scope:{" "}
            <span className="text-cyan-axon">
              {isSuper
                ? "Full Organization (All 11 Directorates)"
                : `${sessionUser.wing} Only`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded"
          >
            Member Workspace
          </Link>
          <Link
            href="/verify"
            className="px-4 py-2 bg-void-card border border-void-border hover:border-cyan-axon text-slate-200 rounded flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-axon" />
            <span>Public Verifier</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-void-border mb-8 overflow-x-auto">
        {(
          [
            {
              id: "applications",
              label: `Applications (${applications.filter((a) => a.status === "Pending").length})`,
              icon: UserCheck,
            },
            { id: "certificates", label: "Certificate Hub", icon: Award },
            { id: "moderation", label: "Projects & Blogs", icon: FileText },
            {
              id: "endorsements",
              label: "Endorsements & Inquiries",
              icon: BadgeCheck,
            },
            { id: "wings", label: "Directorates & RBAC", icon: Layers },
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

      {/* Tab 1: Applications Moderation */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {onboardingNotice && (
            <div className="p-4 rounded-lg bg-circuit-green/10 border border-circuit-green/40 text-circuit-green flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{onboardingNotice}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>
              Induction Applications ({applications.length})
            </span>
            <span className="text-circuit-green">
              Auto-generates Member ID, Portfolio & Certificate on Approval
            </span>
          </div>

          <div className="overflow-x-auto border border-void-border rounded-xl">
            <table className="w-full text-left bg-void-card border-collapse">
              <thead>
                <tr className="border-b border-void-border/80 bg-void-subtle text-slate-400 text-[11px] uppercase">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">University</th>
                  <th className="p-4">Wing Assignment</th>
                  <th className="p-4">Role Assignment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Council Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-void-border text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-void-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white font-sans">
                        {app.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.email}
                      </div>
                      <div className="text-cyan-axon text-[10px]">
                        github.com/{app.githubUsername}
                      </div>
                    </td>

                    <td className="p-4 text-slate-300 font-sans">
                      {app.university}
                    </td>

                    <td className="p-4">
                      {app.status === "Pending" && isSuper ? (
                        <select
                          aria-label="Assign wing"
                          value={wingChoices[app.id] || app.preferredWing}
                          onChange={(e) =>
                            setWingChoices({
                              ...wingChoices,
                              [app.id]: e.target.value,
                            })
                          }
                          className="bg-void-400 border border-void-border rounded px-2 py-1 text-cyan-axon text-[11px]"
                        >
                          {wings.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.code}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-void-400 border border-void-border text-cyan-axon text-[10px]">
                          {app.preferredWing}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {app.status === "Pending" && isSuper ? (
                        <select
                          aria-label="Assign RBAC role"
                          value={roleChoices[app.id] || "approved_member"}
                          onChange={(e) =>
                            setRoleChoices({
                              ...roleChoices,
                              [app.id]: e.target.value as RbacRole,
                            })
                          }
                          className="bg-void-400 border border-void-border rounded px-2 py-1 text-slate-200 text-[11px]"
                        >
                          <option value="approved_member">Approved Member</option>
                          <option value="wing_director">Wing Director</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className="text-slate-300 text-[11px]">
                          {app.roleType}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {app.status === "Approved" ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded bg-circuit-green/20 text-circuit-green font-bold text-[10px]">
                            APPROVED
                          </span>
                          <div className="text-[10px] text-slate-400">
                            ID:{" "}
                            <Link
                              href={`/verify?code=${encodeURIComponent(app.generatedMemberId || "")}`}
                              className="text-white font-bold hover:text-cyan-axon underline"
                            >
                              {app.generatedMemberId}
                            </Link>
                          </div>
                        </div>
                      ) : app.status === "Rejected" ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold text-[10px]">
                          PENDING REVIEW
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {app.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleReviewApp(app.id, "Approved")}
                            className="px-3 py-1.5 bg-circuit-green hover:bg-emerald-400 text-void-500 font-bold uppercase rounded text-[10px] transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewApp(app.id, "Rejected")}
                            className="px-3 py-1.5 bg-void-400 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-void-border rounded text-[10px] transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : app.generatedUsername ? (
                        <Link
                          href={`/u/${app.generatedUsername}`}
                          className="text-cyan-axon hover:underline text-[11px]"
                        >
                          /u/{app.generatedUsername}
                        </Link>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Certificate Issuance & Revocation */}
      {activeTab === "certificates" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 p-6 rounded-xl bg-void-card border border-void-border space-y-5 h-fit">
            <div className="border-b border-void-border pb-4">
              <h2 className="font-serif text-xl font-bold text-white font-sans">
                Issue New Certificate
              </h2>
              <p className="text-slate-400 text-xs">
                Immediately verifiable in{" "}
                <span className="text-cyan-axon">/verify</span>
              </p>
            </div>

            {certIssuedSuccess && (
              <div className="p-4 rounded-lg bg-circuit-green/10 border border-circuit-green/40 text-circuit-green text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certificate Anchored</span>
                </div>
                <div>
                  Code:{" "}
                  <strong className="text-white">{certIssuedSuccess}</strong>
                </div>
                <Link
                  href={`/verify?code=${encodeURIComponent(certIssuedSuccess)}`}
                  className="inline-block text-cyan-axon underline text-[11px]"
                >
                  Inspect Live in /verify →
                </Link>
              </div>
            )}

            <form onSubmit={handleIssueCertificate} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={certRecipient}
                  onChange={(e) => setCertRecipient(e.target.value)}
                  placeholder="e.g. Mahnoor Khan"
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                  Certificate Classification
                </label>
                <select
                  value={certType}
                  onChange={(e) =>
                    setCertType(e.target.value as VerifiedCertificate["type"])
                  }
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
                >
                  <option value="Technical Distinction">
                    Technical Distinction
                  </option>
                  <option value="Workshop Speaker">Workshop Speaker</option>
                  <option value="Hackathon Winner">Hackathon Winner</option>
                  <option value="Leadership Appointment">
                    Leadership Appointment
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                  Citation / Event / Role
                </label>
                <input
                  type="text"
                  required
                  value={certRole}
                  onChange={(e) => setCertRole(e.target.value)}
                  placeholder="e.g. Workshop Speaker - Distributed Systems"
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all shadow"
              >
                Anchor & Issue Certificate
              </button>
            </form>
          </div>

          {/* Registry Audit List */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-white font-semibold uppercase text-[11px]">
              Issued Registry ({certificates.length})
            </div>
            {certificates.map((cert) => (
              <div
                key={cert.certCode}
                className="p-4 rounded-lg bg-void-card border border-void-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        cert.status === "Active"
                          ? "bg-circuit-green/20 text-circuit-green"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {cert.status.toUpperCase()}
                    </span>
                    <Link
                      href={`/verify?code=${encodeURIComponent(cert.certCode)}`}
                      className="text-cyan-axon font-bold hover:underline"
                    >
                      {cert.certCode}
                    </Link>
                  </div>
                  <div className="font-serif text-sm font-bold text-white font-sans">
                    {cert.recipientName} — {cert.eventOrRole}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {cert.issueDate} // {cert.issuerAuthority}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCertificate(cert.certCode)}
                  className={`px-3 py-1.5 rounded border text-[10px] uppercase shrink-0 flex items-center gap-1 ${
                    cert.status === "Active"
                      ? "bg-void-400 border-red-500/40 text-red-400 hover:bg-red-500/10"
                      : "bg-void-400 border-circuit-green/40 text-circuit-green hover:bg-circuit-green/10"
                  }`}
                >
                  <Ban className="w-3 h-3" />
                  <span>{cert.status === "Active" ? "Revoke" : "Restore"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Project & Blog Moderation */}
      {activeTab === "moderation" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Student Projects Moderation
            </h2>
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-void-card border border-void-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === "Verified & Active"
                        ? "bg-circuit-green/20 text-circuit-green"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-slate-400">{p.author.name}</span>
                </div>
                <div className="font-serif font-bold text-white text-base font-sans">
                  {p.title}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleModerateProject(p.id, "Verified & Active")
                    }
                    className="px-3 py-1 bg-circuit-green/20 text-circuit-green border border-circuit-green/40 rounded text-[10px]"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerateProject(p.id, "Rejected")}
                    className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-[10px]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Blogs */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Blog & Monograph Moderation
            </h2>
            {blogs.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-void-card border border-void-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === "Published"
                        ? "bg-circuit-green/20 text-circuit-green"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-slate-400">{b.author.name}</span>
                </div>
                <div className="font-serif font-bold text-white text-base font-sans">
                  {b.title}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleModerateBlog(b.id, "Published")}
                    className="px-3 py-1 bg-circuit-green/20 text-circuit-green border border-circuit-green/40 rounded text-[10px]"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerateBlog(b.id, "Rejected")}
                    className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-[10px]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Director Endorsements & Contact Inquiries */}
      {activeTab === "endorsements" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleAwardEndorsement}
            className="p-6 rounded-xl bg-void-card border border-void-border space-y-4 h-fit"
          >
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Award Director Endorsement Badge
            </h2>
            <p className="text-slate-400 text-xs">
              Displays as a verified badge on the member&apos;s public{" "}
              <code className="text-cyan-axon">/u/[username]</code> portfolio.
            </p>
            {endorseSuccess && (
              <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green">
                {endorseSuccess}
              </div>
            )}
            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Target Member
              </label>
              <select
                value={endorseTarget}
                onChange={(e) => setEndorseTarget(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white"
              >
                {membersList.map((m) => (
                  <option key={m.username} value={m.username}>
                    {m.name} (/u/{m.username})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Contribution Badge Title
              </label>
              <input
                type="text"
                required
                value={endorseBadge}
                onChange={(e) => setEndorseBadge(e.target.value)}
                placeholder="e.g. Zero-Downtime Infrastructure Lead"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Skill Endorsement Note
              </label>
              <textarea
                rows={3}
                required
                value={endorseNote}
                onChange={(e) => setEndorseNote(e.target.value)}
                placeholder="Brief endorsement statement..."
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white font-sans"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300"
            >
              Award Contribution Badge
            </button>
          </form>

          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Institutional & Sponsorship Inquiries ({initialInquiries.length})
            </h2>
            {initialInquiries.length === 0 ? (
              <div className="p-6 rounded-xl bg-void-card border border-void-border text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>No new inquiries submitted via /contact yet.</span>
              </div>
            ) : (
              initialInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl bg-void-card border border-void-border space-y-2"
                >
                  <div className="flex justify-between text-cyan-axon">
                    <span>{inq.subject}</span>
                    <span className="text-slate-400">{inq.createdAt}</span>
                  </div>
                  <div className="font-bold text-white font-sans">
                    {inq.name} ({inq.organization})
                  </div>
                  <div className="text-slate-300 font-sans text-xs">
                    {inq.message}
                  </div>
                  <div className="text-slate-400 text-[11px]">{inq.email}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Directorate Capacity & RBAC */}
      {activeTab === "wings" && (
        <div className="space-y-6">
          <div className="text-slate-400 text-xs">
            11 Active Directorates & RBAC Governance Roster
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wings.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-lg bg-void-card border border-void-border"
              >
                <div className="flex items-center justify-between text-[10px] text-cyan-axon mb-1">
                  <span>{w.code}</span>
                  <span className="text-circuit-green">{w.status}</span>
                </div>
                <div className="font-serif font-bold text-white text-sm font-sans">
                  {w.name}
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  Lead: {w.lead}
                </div>
                <div className="text-slate-500 text-[10px] mt-2 border-t border-void-border/50 pt-2">
                  Active Initiatives: {w.initiativesCount} // Sub-route: /wings/
                  {w.slug}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
