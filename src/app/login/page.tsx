import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import LoginFormClient from "@/components/LoginFormClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal Authentication",
  description: "AXON Member & Executive Council authentication portal.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const session = getServerSession();
  if (session) {
    if (
      session.rbacRole === "super_admin" ||
      session.rbacRole === "wing_director"
    ) {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <LoginFormClient />
    </div>
  );
}
