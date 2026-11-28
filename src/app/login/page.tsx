import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canAccessAdmin, getServerSession } from "@/lib/auth";
import LoginFormClient from "@/components/LoginFormClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OTP Portal Authentication",
  description:
    "Passwordless Email + 6-digit OTP verification for AXON Members, Directors, and Executive Council.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const session = getServerSession();
  if (session) {
    if (canAccessAdmin(session.rbacRole)) {
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
