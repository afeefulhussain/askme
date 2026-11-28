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
  Calendar,
  Upload,
  Download,
  ClipboardList,
  Wallet,
  AlertCircle,
} from "lucide-react";
import type {
  AuditLog,
  AxonEvent,
  AxonMember,
  BlogPost,
  ContactInquiry,
  FinanceRecord,
  MembershipApplication,
  PortalRole,
  Project,
  SessionUser,
  VerifiedCertificate,
  Wing,
  WingTask,
} from "@/lib/types";
import {
  canApproveEventsAndContent,
  canCreateEventProposal,
  canUploadCertificateCsv,
  canViewFinanceAndAudit,
  formatRbacLabel,
  isSuperAdmin,
} from "@/lib/rbac";

interface AdminPanelClientProps {
  sessionUser: SessionUser;
  initialApplications: MembershipApplication[];
  initialCertificates: VerifiedCertificate[];
  initialProjects: Project[];
  initialBlogs: BlogPost[];
  initialEvents: AxonEvent[];
  initialTasks: WingTask[];
  initialFinance: FinanceRecord[];
  initialAuditLogs: AuditLog[];
  initialInquiries: ContactInquiry[];
  membersList: AxonMember[];
  allWings: Wing[];
  scopedWings: Wing[];
}

type AdminTab =
  | "applications"
  | "events"
  | "certificates"
  | "moderation"
  | "tasks"
  | "finance"
  | "endorsements"
  | "wings";

export default function AdminPanelClient({
  sessionUser,
  initialApplications,
  initialCertificates,
  initialProjects,
  initialBlogs,
  initialEvents,
  initialTasks,
  initialFinance,
  initialAuditLogs,
  initialInquiries,
  membersList,
  allWings,
  scopedWings,
}: AdminPanelClientProps) {
  const isSuper = isSuperAdmin(sessionUser.rbacRole);
  const canApproveAll = canApproveEventsAndContent(sessionUser.rbacRole);
  const canProposeEvent = canCreateEventProposal(sessionUser.rbacRole);
  const canUploadCsv = canUploadCertificateCsv(
    sessionUser.rbacRole,
    sessionUser.wingId
  );
  const canSeeFinance = canViewFinanceAndAudit(sessionUser.rbacRole);

  const defaultTab: AdminTab =
    sessionUser.rbacRole === "CORE_AUDITOR" ? "finance" : "applications";
  const [activeTab, setActiveTab] = useState<AdminTab>(defaultTab);

  // Applications
  const [applications, setApplications] =
    useState<MembershipApplication[]>(initialApplications);
  const [roleChoices, setRoleChoices] = useState<Record<string, PortalRole>>({});
  const [wingChoices, setWingChoices] = useState<Record<string, string>>({});
  const [onboardingNotice, setOnboardingNotice] = useState<string | null>(null);

  // Events
  const [events, setEvents] = useState<AxonEvent[]>(initialEvents);
  const [evtTitle, setEvtTitle] = useState("");
  const [evtCategory, setEvtCategory] =
    useState<AxonEvent["category"]>("Technical Workshop");
  const [evtDate, setEvtDate] = useState("2026-12-10");
  const [evtTime, setEvtTime] = useState("18:00 PKT");
  const [evtLocation, setEvtLocation] = useState(
    "IMAC Hall, UET Lahore & Live Stream"
  );
  const [evtWing, setEvtWing] = useState(
    scopedWings[0]?.id || "technical"
  );
  const [evtSpeakerName, setEvtSpeakerName] = useState(sessionUser.name);
  const [evtSpeakerTitle, setEvtSpeakerTitle] = useState("AXON Directorate");
  const [evtDescription, setEvtDescription] = useState("");
  const [evtCurriculum, setEvtCurriculum] = useState(
    "Session Foundations & Live Walkthrough\nHands-on Implementation & Q&A"
  );
  const [evtNotice, setEvtNotice] = useState<string | null>(null);
  const [evtError, setEvtError] = useState<string | null>(null);

  // Certificates & Technical CSV Hub
  const [certificates, setCertificates] =
    useState<VerifiedCertificate[]>(initialCertificates);
  const [certRecipient, setCertRecipient] = useState("");
  const [certRole, setCertRole] = useState("");
  const [certType, setCertType] =
    useState<VerifiedCertificate["type"]>("Technical Distinction");
  const [certIssuedSuccess, setCertIssuedSuccess] = useState<string | null>(
    null
  );
  const [csvPaste, setCsvPaste] = useState(
    'recipientName,eventOrRole,issueDate,certCode,type,memberId\n"Bilal Raza","Technical Track Workshop Certificate","2026-11-28","AXN-CERT-9601","Event Attendance",""'
  );
  const [csvUploadStatus, setCsvUploadStatus] = useState<string | null>(null);
  const [csvUploadError, setCsvUploadError] = useState<string | null>(null);

  // Moderation
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);

  // Tasks
  const [tasks, setTasks] = useState<WingTask[]>(initialTasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskWing, setTaskWing] = useState(scopedWings[0]?.id || "technical");
  const [taskOwner, setTaskOwner] = useState(sessionUser.name);
  const [taskDue, setTaskDue] = useState("2026-12-08");

  // Endorsements
  const [endorseTarget, setEndorseTarget] = useState(
    membersList[0]?.username || "afeef"
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
        assignedRole: roleChoices[id] || "APPROVED_MEMBER",
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
          `Approved ${data.application.name}: Generated Member ID ${data.application.generatedMemberId}, portfolio /u/${data.application.generatedUsername}, onboarding certificate & Resend email.`
        );
      }
    }
  };

  const handleCreateEventProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvtNotice(null);
    setEvtError(null);
    const curriculumLines = evtCurriculum
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: evtTitle,
        category: evtCategory,
        date: evtDate,
        time: evtTime,
        location: evtLocation,
        isVirtual: true,
        wingId: evtWing,
        capacity: 200,
        speakerName: evtSpeakerName,
        speakerTitle: evtSpeakerTitle,
        speakerOrg: "AXON IMAC Chapter",
        description: evtDescription,
        curriculum:
          curriculumLines.length > 0 ? curriculumLines : ["Core Workshop Track"],
      }),
    });
    const data = (await res.json()) as { event?: AxonEvent; error?: string };
    if (!res.ok || !data.event) {
      setEvtError(data.error || "Unable to submit event proposal.");
      return;
    }
    setEvents([data.event, ...events]);
    setEvtTitle("");
    setEvtDescription("");
    setEvtNotice(
      `Event "${data.event.title}" logged as "${data.event.status}". Super Admin approval opens public registrations on /events.`
    );
  };

  const handleModerateEvent = async (
    id: string,
    status: "Registrations Open" | "Rejected"
  ) => {
    const res = await fetch("/api/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = (await res.json()) as { event: AxonEvent };
      setEvents(events.map((evt) => (evt.id === id ? data.event : evt)));
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

  const handleCsvFileUpload = async (file: File | undefined) => {
    if (!file) return;
    setCsvUploadError(null);
    setCsvUploadStatus(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/certificates/csv", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as {
      count?: number;
      certificates?: VerifiedCertificate[];
      error?: string;
    };
    if (!res.ok || !data.certificates) {
      setCsvUploadError(data.error || "Failed to process CSV upload.");
      return;
    }
    setCertificates([...data.certificates, ...certificates]);
    setCsvUploadStatus(
      `Bulk uploaded ${data.count} verified certificates. Immediately searchable by name or serial on /verify.`
    );
  };

  const handleCsvPasteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setCsvUploadError(null);
    setCsvUploadStatus(null);
    const res = await fetch("/api/certificates/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText: csvPaste }),
    });
    const data = (await res.json()) as {
      count?: number;
      certificates?: VerifiedCertificate[];
      error?: string;
    };
    if (!res.ok || !data.certificates) {
      setCsvUploadError(data.error || "Failed to parse pasted CSV rows.");
      return;
    }
    setCertificates([...data.certificates, ...certificates]);
    setCsvUploadStatus(
      `Imported ${data.count} certificate records into cryptographic registry.`
    );
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wingId: taskWing,
        title: taskTitle,
        ownerName: taskOwner,
        ownerRole: formatRbacLabel(sessionUser.rbacRole),
        dueDate: taskDue,
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { task: WingTask };
      setTasks([data.task, ...tasks]);
      setTaskTitle("");
    }
  };

  const handleUpdateTaskStatus = async (
    id: string,
    status: WingTask["status"]
  ) => {
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = (await res.json()) as { task: WingTask };
      setTasks(tasks.map((t) => (t.id === id ? data.task : t)));
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

  const availableTabs: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    ...(sessionUser.rbacRole !== "CORE_AUDITOR"
      ? [
          {
            id: "applications" as const,
            label: `Applications (${applications.filter((a) => a.status === "Pending").length})`,
            icon: UserCheck,
          },
          {
            id: "events" as const,
            label: `Events (${events.filter((e) => e.status === "Pending Approval").length} pending)`,
            icon: Calendar,
          },
        ]
      : []),
    ...(canUploadCsv
      ? [
          {
            id: "certificates" as const,
            label: "Certificate & CSV Hub",
            icon: Award,
          },
        ]
      : []),
    ...(sessionUser.rbacRole !== "CORE_AUDITOR"
      ? [
          {
            id: "moderation" as const,
            label: "Content Review",
            icon: FileText,
          },
          {
            id: "tasks" as const,
            label: `Wing Tasks (${tasks.length})`,
            icon: ClipboardList,
          },
        ]
      : []),
    ...(canSeeFinance
      ? [
          {
            id: "finance" as const,
            label: "Finance & Audit Logs",
            icon: Wallet,
          },
        ]
      : []),
    ...(sessionUser.rbacRole !== "CORE_AUDITOR"
      ? [
          {
            id: "endorsements" as const,
            label: "Endorsements & Inquiries",
            icon: BadgeCheck,
          },
        ]
      : []),
    {
      id: "wings" as const,
      label: "Governance Hierarchy",
      icon: Layers,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono text-xs">
      {/* Top Banner */}
      <div className="border-b border-void-border pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-axon text-[11px] mb-1">
            <span className="w-2 h-2 rounded-full bg-circuit-green animate-pulse"></span>
            <span>
              INTERNAL PORTAL // {formatRbacLabel(sessionUser.rbacRole).toUpperCase()}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white font-sans">
            Executive Council & Wing Portal
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Signed in as{" "}
            <strong className="text-white">{sessionUser.name}</strong> (
            {sessionUser.memberId}) — Scope:{" "}
            <span className="text-cyan-axon">
              {isSuper
                ? "Full Organization (11 Wings)"
                : sessionUser.rbacRole === "CORE_LEAD"
                ? `Core Lead: ${scopedWings.map((w) => w.name).join(", ")}`
                : sessionUser.rbacRole === "CORE_AUDITOR"
                ? "Independent Audit Line (Budgets, Sponsorships & Logs)"
                : sessionUser.rbacRole === "ADVISOR"
                ? "Faculty Patron Overview"
                : `${sessionUser.wing} Directorate`}
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
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
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

      {/* Tab: Applications */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {onboardingNotice && (
            <div className="p-4 rounded-lg bg-circuit-green/10 border border-circuit-green/40 text-circuit-green flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{onboardingNotice}</span>
            </div>
          )}

          <div className="overflow-x-auto border border-void-border rounded-xl">
            <table className="w-full text-left bg-void-card border-collapse">
              <thead>
                <tr className="border-b border-void-border/80 bg-void-subtle text-slate-400 text-[11px] uppercase">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">University Chapter</th>
                  <th className="p-4">Wing Assignment</th>
                  <th className="p-4">Role Assignment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-void-border text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-void-50/50">
                    <td className="p-4">
                      <div className="font-semibold text-white font-sans">
                        {app.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.email}
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
                          {allWings.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name}
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
                          aria-label="Assign role"
                          value={roleChoices[app.id] || "APPROVED_MEMBER"}
                          onChange={(e) =>
                            setRoleChoices({
                              ...roleChoices,
                              [app.id]: e.target.value as PortalRole,
                            })
                          }
                          className="bg-void-400 border border-void-border rounded px-2 py-1 text-slate-200 text-[11px]"
                        >
                          <option value="APPROVED_MEMBER">Approved Member</option>
                          <option value="CO_DIRECTOR">Co-Director</option>
                          <option value="DIRECTOR">Director</option>
                          <option value="CORE_LEAD">Core Team Lead</option>
                          <option value="CORE_AUDITOR">Core Auditor</option>
                          <option value="ADVISOR">Advisor</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
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
                          <div className="text-[10px] text-white">
                            {app.generatedMemberId}
                          </div>
                        </div>
                      ) : app.status === "Rejected" ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold text-[10px]">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {app.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleReviewApp(app.id, "Approved")}
                            className="px-3 py-1.5 bg-circuit-green text-void-500 font-bold uppercase rounded text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewApp(app.id, "Rejected")}
                            className="px-3 py-1.5 bg-void-400 border border-void-border text-slate-400 hover:text-red-400 rounded text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
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

      {/* Tab: Events Workflow */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {canProposeEvent && (
            <form
              onSubmit={handleCreateEventProposal}
              className="lg:col-span-2 p-6 rounded-xl bg-void-card border border-void-border space-y-4 h-fit"
            >
              <h2 className="font-serif text-xl font-bold text-white font-sans">
                Submit Event Proposal
              </h2>
              <p className="text-slate-400 text-xs">
                Core Team proposals enter{" "}
                <strong className="text-yellow-400">Pending Approval</strong> and
                go live after Super Admin confirmation.
              </p>

              {evtError && (
                <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{evtError}</span>
                </div>
              )}
              {evtNotice && (
                <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green">
                  {evtNotice}
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                    Wing
                  </label>
                  <select
                    value={evtWing}
                    onChange={(e) => setEvtWing(e.target.value)}
                    className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                  >
                    {scopedWings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                    Category
                  </label>
                  <select
                    value={evtCategory}
                    onChange={(e) =>
                      setEvtCategory(e.target.value as AxonEvent["category"])
                    }
                    className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                  >
                    <option value="Technical Workshop">Technical Workshop</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Launch Event">Launch Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                    Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="text"
                    required
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    value={evtTime}
                    onChange={(e) => setEvtTime(e.target.value)}
                    className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={evtLocation}
                  onChange={(e) => setEvtLocation(e.target.value)}
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                    Speaker Name
                  </label>
                  <input
                    type="text"
                    required
                    value={evtSpeakerName}
                    onChange={(e) => setEvtSpeakerName(e.target.value)}
                    className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                    Speaker Title
                  </label>
                  <input
                    type="text"
                    required
                    value={evtSpeakerTitle}
                    onChange={(e) => setEvtSpeakerTitle(e.target.value)}
                    className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                  Description (min 15 chars) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={evtDescription}
                  onChange={(e) => setEvtDescription(e.target.value)}
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                  Syllabus Topics (one per line)
                </label>
                <textarea
                  rows={2}
                  value={evtCurriculum}
                  onChange={(e) => setEvtCurriculum(e.target.value)}
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300"
              >
                Submit Proposal (Pending Approval)
              </button>
            </form>
          )}

          <div
            className={`${canProposeEvent ? "lg:col-span-3" : "lg:col-span-5"} space-y-3`}
          >
            <div className="text-white font-semibold uppercase text-[11px]">
              Events & Proposals ({events.length})
            </div>
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl bg-void-card border border-void-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        evt.status === "Pending Approval"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : evt.status === "Rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-circuit-green/20 text-circuit-green"
                      }`}
                    >
                      {evt.status.toUpperCase()}
                    </span>
                    <span className="text-slate-400">{evt.date}</span>
                    <span className="text-cyan-axon">({evt.wingId})</span>
                  </div>
                  <div className="font-serif text-base font-bold text-white font-sans">
                    {evt.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Proposed by {evt.submittedBy} • {evt.attendeeCount} attendees
                  </div>
                </div>

                {canApproveAll && evt.status === "Pending Approval" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleModerateEvent(evt.id, "Registrations Open")
                      }
                      className="px-3 py-1.5 bg-circuit-green text-void-500 font-bold uppercase rounded text-[10px]"
                    >
                      Approve & Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerateEvent(evt.id, "Rejected")}
                      className="px-3 py-1.5 bg-void-400 border border-void-border text-red-400 rounded text-[10px]"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Certificate & CSV Hub (Technical Wing + Super Admin) */}
      {activeTab === "certificates" && canUploadCsv && (
        <div className="space-y-8">
          {/* Bulk CSV Uploader */}
          <div className="p-6 rounded-xl bg-void-card border border-cyan-axon/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-void-border pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-white font-sans">
                  Technical Wing — Bulk CSV Certificate Uploader
                </h2>
                <p className="text-slate-400 text-xs">
                  Download the template CSV, populate attendee names & serial IDs,
                  and bulk publish into the{" "}
                  <code className="text-cyan-axon">/verify</code> database.
                </p>
              </div>
              <a
                href="/api/certificates/csv"
                className="px-4 py-2 bg-void-subtle border border-cyan-axon text-cyan-axon hover:bg-cyan-axon hover:text-void-500 rounded font-bold uppercase flex items-center gap-2 shrink-0 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Template</span>
              </a>
            </div>

            {csvUploadError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{csvUploadError}</span>
              </div>
            )}
            {csvUploadStatus && (
              <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{csvUploadStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 mb-2 uppercase text-[11px]">
                  Upload Filled CSV File
                </label>
                <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-void-border hover:border-cyan-axon rounded-lg bg-void-subtle cursor-pointer text-slate-200 transition-colors">
                  <Upload className="w-5 h-5 text-cyan-axon" />
                  <span>Select .csv Certificate Sheet to Import</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => handleCsvFileUpload(e.target.files?.[0])}
                  />
                </label>
              </div>

              <form onSubmit={handleCsvPasteUpload} className="space-y-2">
                <label className="block text-slate-300 uppercase text-[11px]">
                  Or Paste CSV Rows Directly
                </label>
                <textarea
                  rows={4}
                  value={csvPaste}
                  onChange={(e) => setCsvPaste(e.target.value)}
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white text-[11px] font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300"
                >
                  Import CSV Rows
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 p-6 rounded-xl bg-void-card border border-void-border space-y-4 h-fit">
              <h3 className="font-serif text-lg font-bold text-white font-sans">
                Issue Single Certificate
              </h3>
              {certIssuedSuccess && (
                <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green text-xs">
                  Anchored:{" "}
                  <strong className="text-white">{certIssuedSuccess}</strong>
                </div>
              )}
              <form onSubmit={handleIssueCertificate} className="space-y-3">
                <input
                  type="text"
                  required
                  value={certRecipient}
                  onChange={(e) => setCertRecipient(e.target.value)}
                  placeholder="Recipient Full Name"
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                />
                <select
                  value={certType}
                  onChange={(e) =>
                    setCertType(e.target.value as VerifiedCertificate["type"])
                  }
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                >
                  <option value="Technical Distinction">
                    Technical Distinction
                  </option>
                  <option value="Event Attendance">Event Attendance</option>
                  <option value="Workshop Speaker">Workshop Speaker</option>
                  <option value="Hackathon Winner">Hackathon Winner</option>
                  <option value="Leadership Appointment">
                    Leadership Appointment
                  </option>
                </select>
                <input
                  type="text"
                  required
                  value={certRole}
                  onChange={(e) => setCertRole(e.target.value)}
                  placeholder="Citation / Event / Role"
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded"
                >
                  Anchor Single Certificate
                </button>
              </form>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="text-white font-semibold uppercase text-[11px]">
                Verified Certificate Registry ({certificates.length})
              </div>
              {certificates.slice(0, 20).map((cert) => (
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
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleCertificate(cert.certCode)}
                    className="px-3 py-1.5 rounded border border-void-border text-slate-300 hover:border-cyan-axon text-[10px] uppercase flex items-center gap-1"
                  >
                    <Ban className="w-3 h-3" />
                    <span>
                      {cert.status === "Active" ? "Revoke" : "Restore"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Projects & Blogs Moderation */}
      {activeTab === "moderation" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Member Projects ({projects.length})
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
                {canApproveAll ? (
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleModerateProject(p.id, "Verified & Active")
                      }
                      className="px-3 py-1 bg-circuit-green/20 text-circuit-green border border-circuit-green/40 rounded text-[10px]"
                    >
                      Approve & Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerateProject(p.id, "Rejected")}
                      className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-[10px]"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 pt-1">
                    Super Admin approval required before public showcase.
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Member Blog Posts ({blogs.length})
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
                {canApproveAll ? (
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleModerateBlog(b.id, "Published")}
                      className="px-3 py-1 bg-circuit-green/20 text-circuit-green border border-circuit-green/40 rounded text-[10px]"
                    >
                      Approve & Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerateBlog(b.id, "Rejected")}
                      className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-[10px]"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 pt-1">
                    Super Admin approval required before public listing.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Wing Tasks & Internal Supervision */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleCreateTask}
            className="p-6 rounded-xl bg-void-card border border-void-border space-y-4 h-fit"
          >
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Assign Wing Deliverable
            </h2>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title (e.g., Audit Q4 certificates)"
              className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
            />
            <select
              value={taskWing}
              onChange={(e) => setTaskWing(e.target.value)}
              className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
            >
              {scopedWings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              value={taskOwner}
              onChange={(e) => setTaskOwner(e.target.value)}
              placeholder="Assigned Officer"
              className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
            />
            <input
              type="text"
              required
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              placeholder="Due date YYYY-MM-DD"
              className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded"
            >
              Create Task
            </button>
          </form>

          <div className="lg:col-span-2 space-y-3">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-void-card border border-void-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] mb-1">
                    <span className="text-cyan-axon uppercase">{t.wingId}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Due: {t.dueDate}</span>
                  </div>
                  <div className="font-serif text-base font-bold text-white font-sans">
                    {t.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Owner: {t.ownerName} ({t.ownerRole})
                  </div>
                </div>
                <select
                  aria-label="Update task status"
                  value={t.status}
                  onChange={(e) =>
                    handleUpdateTaskStatus(
                      t.id,
                      e.target.value as WingTask["status"]
                    )
                  }
                  className="bg-void-400 border border-void-border rounded px-3 py-1.5 text-circuit-green text-[11px]"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Finance & Audit Logs (Auditor / Advisor / Super Admin) */}
      {activeTab === "finance" && canSeeFinance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Budgets, Sponsorships & Expense Ledger
            </h2>
            {initialFinance.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-void-card border border-void-border flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-cyan-axon uppercase">
                    {f.category} • {f.wingId}
                  </div>
                  <div className="font-bold text-white font-sans text-sm">
                    {f.title}
                  </div>
                  <div className="text-[10px] text-slate-400">{f.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">
                    PKR {f.amountPkr.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-circuit-green">
                    {f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Immutable Audit Log ({initialAuditLogs.length})
            </h2>
            {initialAuditLogs.slice(0, 20).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-void-card border border-void-border text-[11px]"
              >
                <div className="flex justify-between text-cyan-axon">
                  <span>{log.action}</span>
                  <span className="text-slate-500">
                    {log.timestamp.split("T")[0]}
                  </span>
                </div>
                <div className="text-white mt-0.5">{log.target}</div>
                <div className="text-[10px] text-slate-400">
                  Actor: {log.actorName} ({log.actorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Endorsements & Inquiries */}
      {activeTab === "endorsements" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleAwardEndorsement}
            className="p-6 rounded-xl bg-void-card border border-void-border space-y-4 h-fit"
          >
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Award Director Endorsement Badge
            </h2>
            {endorseSuccess && (
              <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green">
                {endorseSuccess}
              </div>
            )}
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
            <input
              type="text"
              required
              value={endorseBadge}
              onChange={(e) => setEndorseBadge(e.target.value)}
              placeholder="Badge title (e.g. Zero-Downtime Lead)"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white"
            />
            <textarea
              rows={3}
              required
              value={endorseNote}
              onChange={(e) => setEndorseNote(e.target.value)}
              placeholder="Endorsement statement..."
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white font-sans"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded"
            >
              Award Contribution Badge
            </button>
          </form>

          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Institutional Inquiries ({initialInquiries.length})
            </h2>
            {initialInquiries.length === 0 ? (
              <div className="p-6 rounded-xl bg-void-card border border-void-border text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>No inquiries visible in current scope.</span>
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
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Internal Governance Hierarchy (Safe internal-only view of Reports To) */}
      {activeTab === "wings" && (
        <div className="space-y-4">
          <div className="text-slate-400 text-xs">
            Internal Governance Roster (Logged-in Portal Only — Reports To is
            hidden from public pages)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scopedWings.map((w) => (
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
                <div className="text-slate-300 text-[11px] mt-1">
                  Director: {w.lead} • Co-Director: {w.coLead}
                </div>
                <div className="text-cyan-axon text-[11px] mt-1">
                  Reports To: {w.reportsTo}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
