import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { findMemberByEmailOrRole, getMemberByUsername, readDb } from "@/lib/db";
import { WINGS } from "@/data/axonData";
import MemberDashboardClient from "@/components/MemberDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Member Operations Workspace",
  description: "Authenticated AXON Member Dashboard, Digital ID, and Portfolio Builder.",
  robots: { index: false, follow: false },
};

export default function MemberDashboardPage() {
  const session = getServerSession();
  if (!session) {
    redirect("/login");
  }

  const db = readDb();
  const member =
    getMemberByUsername(session.username) ||
    findMemberByEmailOrRole(session.email, session.rbacRole);

  if (!member) {
    redirect("/login");
  }

  const memberProjects = db.projects.filter(
    (p) => p.author.username.toLowerCase() === member.username.toLowerCase()
  );

  const memberBlogs = db.blogs.filter(
    (b) => b.author.username.toLowerCase() === member.username.toLowerCase()
  );

  const memberCerts = db.certificates.filter(
    (c) =>
      c.memberId === member.memberId ||
      c.recipientName.toLowerCase() === member.name.toLowerCase()
  );

  return (
    <MemberDashboardClient
      initialMember={member}
      initialProjects={memberProjects}
      initialBlogs={memberBlogs}
      initialCertificates={memberCerts}
      wings={WINGS}
    />
  );
}
