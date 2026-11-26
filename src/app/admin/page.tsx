import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { canAccessAdmin, formatRbacLabel, getServerSession, isSuperAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { WINGS } from "@/data/axonData";
import AdminPanelClient from "@/components/AdminPanelClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Executive Council Admin Panel",
  description: "AXON Central Directorate Management Console.",
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
            Council Console Restricted
          </h1>
          <p className="text-slate-300 font-sans text-sm leading-relaxed">
            Your current role (
            <strong className="text-white">
              {formatRbacLabel(session.rbacRole)}
            </strong>
            ) does not permit access to{" "}
            <code className="text-cyan-axon">/admin</code>. Only Wing Directors
            (wing-scoped) and Super Admins (full access) may open the Executive
            Council console.
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
  const fullAccess = isSuperAdmin(session.rbacRole);

  const applications = fullAccess
    ? db.applications
    : db.applications.filter((a) => a.preferredWing === session.wingId);

  const projects = fullAccess
    ? db.projects
    : db.projects.filter((p) => p.wingId === session.wingId);

  const blogs = fullAccess
    ? db.blogs
    : db.blogs.filter((b) => b.wingId === session.wingId);

  const membersList = Object.values(db.members).filter(
    (m) => m.rbacRole !== "pending_applicant"
  );

  return (
    <AdminPanelClient
      sessionUser={session}
      initialApplications={applications}
      initialCertificates={db.certificates}
      initialProjects={projects}
      initialBlogs={blogs}
      initialInquiries={fullAccess ? db.inquiries : []}
      membersList={membersList}
      wings={WINGS}
    />
  );
}
