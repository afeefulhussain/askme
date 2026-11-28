import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { getDashboardBundle } from "@/lib/db";
import { WINGS } from "@/data/axonData";
import MemberDashboardClient from "@/components/MemberDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Member Operations Workspace",
  description:
    "Authenticated AXON Member Dashboard, Digital ID, Upload Suite, and Portfolio Builder.",
  robots: { index: false, follow: false },
};

export default async function MemberDashboardPage() {
  const session = getServerSession();
  if (!session) {
    redirect("/login");
  }

  const bundle = await getDashboardBundle(session);

  if (!bundle.member) {
    redirect("/login");
  }

  return (
    <MemberDashboardClient
      initialMember={bundle.member}
      initialProjects={bundle.myProjects}
      initialBlogs={bundle.myBlogs}
      initialCertificates={bundle.myCertificates}
      wings={WINGS}
    />
  );
}
