"use client";

import React, { useEffect, useRef, useState } from "react";
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
  KeyRound,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import type {
  AuditLog,
  AxonEvent,
  BackgroundJob,
  BlogPost,
  ContactInquiry,
  FinanceRecord,
  MembershipApplication,
  PortalRole,
  Project,
  PublicAxonMember,
  SessionUser,
  VerifiedCertificate,
  Wing,
  WingTask,
} from "@/lib/types";
import {
  canApproveApplications,
  canApproveEventsAndContent,
  canCreateEventProposal,
  canResetPasswords,
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
  initialJobs: BackgroundJob[];
  membersList: PublicAxonMember[];
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
  | "users"
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
  initialJobs,
  membersList,
  allWings,
  scopedWings,
}: AdminPanelClientProps) {
  const isSuper = isSuperAdmin(sessionUser.rbacRole);
  const canApproveApps = canApproveApplications(sessionUser.rbacRole);
  const canManagePasswords = canResetPasswords(sessionUser.rbacRole);
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

  // Applications (debounced search + server-side pagination)
  const [applications, setApplications] =
    useState<MembershipApplication[]>(initialApplications);
  const [appSearch, setAppSearch] = useState("");
  const [debouncedAppSearch, setDebouncedAppSearch] = useState("");
  const [appPage, setAppPage] = useState(1);
  const [appTotalPages, setAppTotalPages] = useState(
    Math.max(1, Math.ceil(initialApplications.length / 8))
  );
  const [appTotal, setAppTotal] = useState(initialApplications.length);
  const [roleChoices, setRoleChoices] = useState<Record<string, PortalRole>>({});
  const [wingChoices, setWingChoices] = useState<Record<string, string>>({});
  const [onboardingNotice, setOnboardingNotice] = useState<string | null>(null);
  const appMountRef = useRef(false);

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
  const [evtPosterImage, setEvtPosterImage] = useState("/assets/poster-launch.png");
  const [evtExternalUrl, setEvtExternalUrl] = useState("");
  const [evtScheduleInput, setEvtScheduleInput] = useState(
    "18:00 PKT | Opening Briefing & Architecture | " + sessionUser.name
  );
  const [evtSpeakerName, setEvtSpeakerName] = useState(sessionUser.name);
  const [evtSpeakerTitle, setEvtSpeakerTitle] = useState("AXON Directorate");
  const [evtDescription, setEvtDescription] = useState("");
  const [evtCurriculum, setEvtCurriculum] = useState(
    "Session Foundations & Live Walkthrough\nHands-on Implementation & Q&A"
  );
  const [evtNotice, setEvtNotice] = useState<string | null>(null);
  const [evtError, setEvtError] = useState<string | null>(null);

  // Certificates, Background Jobs & Technical CSV Hub
  const [certificates, setCertificates] =
    useState<VerifiedCertificate[]>(initialCertificates);
  const [jobs, setJobs] = useState<BackgroundJob[]>(initialJobs);
  const [certSearch, setCertSearch] = useState("");
  const [debouncedCertSearch, setDebouncedCertSearch] = useState("");
  const [certPage, setCertPage] = useState(1);
  const [certTotalPages, setCertTotalPages] = useState(
    Math.max(1, Math.ceil(initialCertificates.length / 8))
  );
  const certMountRef = useRef(false);
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

  // Moderation & Finance
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [financeList, setFinanceList] = useState<FinanceRecord[]>(initialFinance);

  // Password Governance (SUPER_ADMIN Only)
  const [userSearch, setUserSearch] = useState("");
  const [resetUsername, setResetUsername] = useState(
    membersList[0]?.username || "afeef"
  );
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const actionLockRef = useRef(false);

  // Tasks & Endorsements
  const [tasks, setTasks] = useState<WingTask[]>(initialTasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskWing, setTaskWing] = useState(scopedWings[0]?.id || "technical");
  const [taskOwner, setTaskOwner] = useState(sessionUser.name);
  const [taskDue, setTaskDue] = useState("2026-12-08");

  const [endorseTarget, setEndorseTarget] = useState(
    membersList[0]?.username || "afeef"
  );
  const [endorseBadge, setEndorseBadge] = useState("");
  const [endorseNote, setEndorseNote] = useState("");
  const [endorseSuccess, setEndorseSuccess] = useState<string | null>(null);

  // 300ms Debounce for Applications Table
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedAppSearch(appSearch);
      setAppPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [appSearch]);

  useEffect(() => {
    if (!appMountRef.current) {
      appMountRef.current = true;
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({
      q: debouncedAppSearch.trim(),
      page: String(appPage),
      limit: "8",
    });
    fetch(`/api/applications?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(
        (data: {
          applications?: MembershipApplication[];
          total?: number;
          totalPages?: number;
        }) => {
          if (Array.isArray(data.applications)) {
            setApplications(data.applications);
            setAppTotal(data.total ?? data.applications.length);
            setAppTotalPages(data.totalPages ?? 1);
          }
        }
      )
      .catch(() => {});
    return () => controller.abort();
  }, [debouncedAppSearch, appPage]);

  // 300ms Debounce for Certificates Table
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedCertSearch(certSearch);
      setCertPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [certSearch]);

  useEffect(() => {
    if (!certMountRef.current) {
      certMountRef.current = true;
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({
      q: debouncedCertSearch.trim(),
      page: String(certPage),
      limit: "8",
    });
    fetch(`/api/verify?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(
        (data: {
          matches?: VerifiedCertificate[];
          totalPages?: number;
        }) => {
          if (Array.isArray(data.matches)) {
            setCertificates(data.matches);
            setCertTotalPages(data.totalPages ?? 1);
          }
        }
      )
      .catch(() => {});
    return () => controller.abort();
  }, [debouncedCertSearch, certPage]);

  const refreshJobs = async () => {
    try {
      const res = await fetch("/api/jobs?limit=20", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { jobs?: BackgroundJob[] };
        if (data.jobs) setJobs(data.jobs);
      }
    } catch {
      // ignore
    }
  };

  const handleReviewApp = async (
    id: string,
    decision: "Approved" | "Rejected"
  ) => {
    if (!canApproveApps || actionLockRef.current) return;
    actionLockRef.current = true;
    try {
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
            `Approved ${data.application.name}: Assigned Member ID ${data.application.generatedMemberId}, editorial portfolio /portfolio/${data.application.generatedUsername}, and queued welcome email.`
          );
          void refreshJobs();
        }
      }
    } finally {
      actionLockRef.current = false;
    }
  };

  const handleCreateEventProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    setEvtNotice(null);
    setEvtError(null);
    const curriculumLines = evtCurriculum
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const scheduleItems = evtScheduleInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [time = "18:00 PKT", topic = "", speaker = evtSpeakerName] =
          line.split("|").map((p) => p.trim());
        return { time, topic: topic || evtTitle, speaker };
      });

    try {
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
          posterImage: evtPosterImage.trim() || "/assets/poster-launch.png",
          externalRegistrationUrl: evtExternalUrl.trim() || undefined,
          schedule: scheduleItems,
          speakerName: evtSpeakerName,
          speakerTitle: evtSpeakerTitle,
          speakerOrg: "AXON IMAC Chapter",
          description: evtDescription,
          curriculum:
            curriculumLines.length > 0
              ? curriculumLines
              : ["Core Workshop Track"],
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
        `Event "${data.event.title}" logged as "${data.event.status}". Super Admin approval publishes /events/${data.event.slug} and triggers the live visitor banner.`
      );
    } finally {
      actionLockRef.current = false;
    }
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
      window.dispatchEvent(new Event("axon-events-changed"));
      void refreshJobs();
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certRecipient.trim() || !certRole.trim() || actionLockRef.current)
      return;
    actionLockRef.current = true;
    try {
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
    } finally {
      actionLockRef.current = false;
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
      queued?: boolean;
      count?: number;
      job?: BackgroundJob;
      message?: string;
      error?: string;
    };
    if (!res.ok) {
      setCsvUploadError(data.error || "Failed to process CSV upload.");
      return;
    }
    if (data.job) {
      setJobs((prev) => [data.job!, ...prev]);
    }
    setCsvUploadStatus(
      data.message ||
        `Queued ${data.count} verified certificates in background worker.`
    );
    window.setTimeout(() => {
      void refreshJobs();
      setCertPage(1);
    }, 350);
  };

  const handleCsvPasteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    setCsvUploadError(null);
    setCsvUploadStatus(null);
    try {
      const res = await fetch("/api/certificates/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText: csvPaste }),
      });
      const data = (await res.json()) as {
        queued?: boolean;
        count?: number;
        job?: BackgroundJob;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setCsvUploadError(data.error || "Failed to parse pasted CSV rows.");
        return;
      }
      if (data.job) {
        setJobs((prev) => [data.job!, ...prev]);
      }
      setCsvUploadStatus(
        data.message ||
          `Queued ${data.count} certificate records into background worker.`
      );
      window.setTimeout(() => {
        void refreshJobs();
        setCertPage(1);
      }, 350);
    } finally {
      actionLockRef.current = false;
    }
  };

  const handleResetUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManagePasswords || actionLockRef.current) return;
    actionLockRef.current = true;
    setPasswordStatus(null);
    setPasswordError(null);

    try {
      const res = await fetch("/api/admin/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: resetUsername,
          newPassword: newPasswordInput,
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setPasswordError(data.error || "Unable to update user password.");
        return;
      }
      setPasswordStatus(
        data.message || `Password reset completed for @${resetUsername}.`
      );
      setNewPasswordInput("");
    } catch {
      setPasswordError("Network error while resetting password.");
    } finally {
      actionLockRef.current = false;
    }
  };

  const handleModerateFinance = async (
    id: string,
    status: FinanceRecord["status"]
  ) => {
    const res = await fetch("/api/finance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const data = (await res.json()) as { record: FinanceRecord };
      setFinanceList((prev) =>
        prev.map((item) => (item.id === id ? data.record : item))
      );
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
    ...(canManagePasswords
      ? [
          {
            id: "users" as const,
            label: `Users & Passwords (${membersList.length})`,
            icon: KeyRound,
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
          {!canApproveApps && (
            <div className="p-4 rounded-lg bg-void-subtle border border-void-border text-slate-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-cyan-axon shrink-0" />
              <span>
                All new member applications route exclusively to the AXON President (
                <strong className="text-white">SUPER_ADMIN</strong>) for final approval and wing/role appointment.
              </span>
            </div>
          )}

          {onboardingNotice && (
            <div className="p-4 rounded-lg bg-circuit-green/10 border border-circuit-green/40 text-circuit-green flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{onboardingNotice}</span>
            </div>
          )}

          {/* Debounced Search Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative min-w-[260px]">
              <input
                aria-label="Search applications"
                type="search"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search name, email, roll no, university..."
                className="w-full bg-void-card border border-void-border rounded px-3 py-2 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
            <div className="text-[11px] text-slate-400">
              Showing {applications.length} of {appTotal} applications • Page {appPage} / {appTotalPages}
            </div>
          </div>

          <div className="overflow-x-auto border border-void-border rounded-xl">
            <table className="w-full text-left bg-void-card border-collapse">
              <thead>
                <tr className="border-b border-void-border/80 bg-void-subtle text-slate-400 text-[11px] uppercase">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">University / Roll No.</th>
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
                      <div>{app.university}</div>
                      {(app.rollNumber || app.department) && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {[app.rollNumber, app.department].filter(Boolean).join(" • ")}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {app.status === "Pending" && canApproveApps ? (
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
                      {app.status === "Pending" && canApproveApps ? (
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
                      {app.status === "Pending" && canApproveApps ? (
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
                      ) : app.status === "Pending" ? (
                        <span className="text-slate-400 text-[10px]">
                          Super Admin Only
                        </span>
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

          {appTotalPages > 1 && (
            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                disabled={appPage <= 1}
                onClick={() => setAppPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-void-border text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="text-slate-400">
                Page {appPage} of {appTotalPages}
              </span>
              <button
                type="button"
                disabled={appPage >= appTotalPages}
                onClick={() => setAppPage((p) => Math.min(appTotalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-void-border text-slate-300 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
                  Official Registration / Joining Link (Optional)
                </label>
                <input
                  type="url"
                  value={evtExternalUrl}
                  onChange={(e) => setEvtExternalUrl(e.target.value)}
                  placeholder="https://meet.askme.pk/session"
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                  Event Poster Asset
                </label>
                <select
                  value={evtPosterImage}
                  onChange={(e) => setEvtPosterImage(e.target.value)}
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
                >
                  <option value="/assets/poster-launch.png">Launch Symposium Plate</option>
                  <option value="/assets/poster-systems.png">Distributed Systems Plate</option>
                  <option value="/assets/poster-design.png">Design Systems Plate</option>
                  <option value="/assets/poster-hardware.png">Hardware / RTL Plate</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 uppercase text-[10px]">
                  Event Schedule (Time | Topic | Speaker per line)
                </label>
                <textarea
                  rows={2}
                  value={evtScheduleInput}
                  onChange={(e) => setEvtScheduleInput(e.target.value)}
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-white font-semibold uppercase text-[11px]">
                  Verified Certificate Registry (Page {certPage} / {certTotalPages})
                </div>
                <div className="relative">
                  <input
                    aria-label="Search issued certificates"
                    type="search"
                    value={certSearch}
                    onChange={(e) => setCertSearch(e.target.value)}
                    placeholder="Search serial or recipient..."
                    className="bg-void-card border border-void-border rounded px-3 py-1.5 pl-7 text-[11px] text-white"
                  />
                  <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                </div>
              </div>
              {certificates.slice(0, 12).map((cert) => (
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
              {certTotalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={certPage <= 1}
                    onClick={() => setCertPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded border border-void-border text-slate-300 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={certPage >= certTotalPages}
                    onClick={() => setCertPage((p) => Math.min(certTotalPages, p + 1))}
                    className="px-3 py-1 rounded border border-void-border text-slate-300 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Background Job Queue Monitor */}
              <div className="mt-6 p-4 rounded-xl bg-void-subtle border border-void-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-cyan-axon font-bold">
                    Background Job Queue Telemetry ({jobs.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => void refreshJobs()}
                    className="inline-flex items-center gap-1 text-[10px] text-slate-300 hover:text-white"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </button>
                </div>
                {jobs.length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    No background CSV or email jobs queued in this session yet.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {jobs.slice(0, 6).map((j) => (
                      <div
                        key={j.id}
                        className="p-2 rounded bg-void-card border border-void-border flex items-center justify-between text-[11px]"
                      >
                        <span className="text-slate-200 truncate mr-2">
                          {j.summary}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase shrink-0 ${
                            j.status === "completed"
                              ? "bg-circuit-green/15 text-circuit-green"
                              : j.status === "failed"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-cyan-axon/15 text-cyan-axon"
                          }`}
                        >
                          {j.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            {financeList.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-void-card border border-void-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-base font-bold text-white">
                    PKR {f.amountPkr.toLocaleString()}
                  </div>
                  <select
                    aria-label={`Audit status for ${f.title}`}
                    value={f.status}
                    onChange={(e) =>
                      void handleModerateFinance(
                        f.id,
                        e.target.value as FinanceRecord["status"]
                      )
                    }
                    className="bg-void-400 border border-void-border rounded px-2.5 py-1 text-[10px] text-circuit-green"
                  >
                    <option value="Pending Audit">Pending Audit</option>
                    <option value="Approved">Approved</option>
                    <option value="Settled">Settled</option>
                  </select>
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
                  {m.name} (/portfolio/{m.username})
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

      {/* Tab: Users & Password Governance (STRICTLY SUPER_ADMIN ONLY) */}
      {activeTab === "users" && canManagePasswords && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form
            onSubmit={handleResetUserPassword}
            className="lg:col-span-2 p-6 rounded-xl bg-void-card border border-cyan-axon/40 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2 text-cyan-axon text-[11px] uppercase font-bold">
              <KeyRound className="w-4 h-4" />
              <span>SUPER_ADMIN Credential Governance</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Set / Reset Account Password
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Exclusive authority granted only to the AXON President (
              <strong className="text-white">SUPER_ADMIN</strong>). Resets apply
              immediately using salted <code className="text-cyan-axon">scrypt</code>{" "}
              digests and record an immutable audit trail entry.
            </p>

            {passwordError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 text-xs">
                {passwordError}
              </div>
            )}
            {passwordStatus && (
              <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green text-xs">
                {passwordStatus}
              </div>
            )}

            <div>
              <label
                htmlFor="admin-reset-user"
                className="block text-slate-300 mb-1 uppercase text-[10px]"
              >
                Target Member Account (@askme.pk)
              </label>
              <select
                id="admin-reset-user"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
                className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white text-xs"
              >
                {membersList.map((m) => (
                  <option key={m.username} value={m.username}>
                    {m.name} — {m.email} ({m.rbacRole})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="admin-new-password"
                className="block text-slate-300 mb-1 uppercase text-[10px]"
              >
                New Password (min 8 characters) *
              </label>
              <div className="relative">
                <input
                  id="admin-new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new institutional password"
                  className="w-full bg-void-400 border border-void-border rounded px-3 py-2 pr-10 text-white"
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  aria-pressed={showNewPassword}
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute right-2 top-1.5 p-1 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300"
            >
              Update Account Password
            </button>
          </form>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-white font-semibold uppercase text-[11px]">
                All Directory & Council Accounts ({membersList.length})
              </div>
              <input
                aria-label="Filter member directory accounts"
                type="search"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search name, @askme.pk, wing..."
                className="bg-void-card border border-void-border rounded px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {membersList
                .filter((m) =>
                  [m.name, m.email, m.memberId, m.wing, m.rbacRole]
                    .join(" ")
                    .toLowerCase()
                    .includes(userSearch.trim().toLowerCase())
                )
                .map((m) => (
                  <div
                    key={m.username}
                    className="p-3.5 rounded-lg bg-void-card border border-void-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-white text-sm">
                          {m.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-void-subtle border border-void-border text-cyan-axon">
                          {m.memberId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {m.email} • {m.wing} ({m.rbacRole})
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/portfolio/${m.username}`}
                        className="px-2.5 py-1 rounded border border-void-border text-slate-300 hover:border-cyan-axon text-[10px]"
                      >
                        Portfolio
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setResetUsername(m.username);
                          setPasswordStatus(null);
                          setPasswordError(null);
                        }}
                        className="px-2.5 py-1 rounded bg-void-subtle border border-cyan-axon/40 text-cyan-axon hover:bg-cyan-axon hover:text-void-500 text-[10px] font-bold"
                      >
                        Select for Reset
                      </button>
                    </div>
                  </div>
                ))}
            </div>
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
