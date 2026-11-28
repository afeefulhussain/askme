import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import {
  canAccessAdmin,
  canViewFinanceAndAudit,
  formatRbacLabel,
  getServerSession,
  isSuperAdmin,
} from "@/lib/auth";
import { readDb } from "@/lib/db";
import { WINGS } from "@/data/axonData";
import AdminPanelClient from "@/components/AdminPanelClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Executive Council & Wing Management Portal",
  description: "AXON RBAC Governance Console at askme.pk.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const session = getServerSession();
  if (!session) {
    redirect("/login");
  }

  if (!canAccessAdmin(session.rbacRole)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 font-mono text-xs">
        <div className="p-8 rounded-2xl bg-void-card border border-red-500/40 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-red-400 mx-auto" />
          <div className="text-red-400 font-bold uppercase">
            403 // INSUFFICIENT RBAC CLEARANCE
          </div>
          <h1 className="font-serif text-2xl font-bold text-white font-sans">
            Council & Directorate Console Restricted
          </h1>
          <p className="text-slate-300 font-sans text-sm leading-relaxed">
            Your current role (
            <strong className="text-white">
              {formatRbacLabel(session.rbacRole)}
            </strong>
            ) does not permit access to{" "}
            <code className="text-cyan-axon">/admin</code>. Only Directors,
            Co-Directors, Core Team Leads, Core Auditor, Faculty Advisor, or
            Super Admin may access management consoles.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded"
            >
              Go to Member Dashboard
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-void-subtle border border-void-border text-slate-200 rounded"
            >
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const db = readDb();
  const fullOrgScope =
    isSuperAdmin(session.rbacRole) || session.rbacRole === "ADVISOR";
  const isCoreLead = session.rbacRole === "CORE_LEAD";

  const scopeMatchesWing = (wingId: string) => {
    if (fullOrgScope) return true;
    if (isCoreLead) return session.supervisedWings.includes(wingId);
    return wingId === session.wingId;
  };

  const applications = db.applications.filter((a) =>
    scopeMatchesWing(a.preferredWing)
  );
  const projects = db.projects.filter((p) => scopeMatchesWing(p.wingId));
  const blogs = db.blogs.filter((b) => scopeMatchesWing(b.wingId));
  const events = fullOrgScope
    ? db.events
    : db.events.filter(
        (e) =>
          scopeMatchesWing(e.wingId) || e.submittedBy === session.name
      );
  const tasks = db.wingTasks.filter((t) => scopeMatchesWing(t.wingId));

  const membersList = Object.values(db.members).filter(
    (m) => m.rbacRole !== "PENDING_APPLICANT"
  );

  const visibleWings = fullOrgScope
    ? WINGS
    : isCoreLead
    ? WINGS.filter((w) => session.supervisedWings.includes(w.id))
    : WINGS.filter((w) => w.id === session.wingId);

  const showFinance = canViewFinanceAndAudit(session.rbacRole);

  return (
    <AdminPanelClient
      sessionUser={session}
      initialApplications={applications}
      initialCertificates={db.certificates}
      initialProjects={projects}
      initialBlogs={blogs}
      initialEvents={events}
      initialTasks={tasks}
      initialFinance={showFinance ? db.financeRecords : []}
      initialAuditLogs={showFinance ? db.auditLogs : []}
      initialInquiries={fullOrgScope ? db.inquiries : []}
      membersList={membersList}
      allWings={WINGS}
      scopedWings={visibleWings}
    />
  );
}
